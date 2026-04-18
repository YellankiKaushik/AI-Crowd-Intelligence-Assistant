// Global State
let currentIntent = null;
let currentScenario = 'low';
let currentSimInterval = null;
let bestRouteState = null;
let lastSimMessage = null;
let isTransitioning = false;
let currentLocation = null;





// DOM Elements
const productLandingScreen = document.getElementById('landing-screen');
const templeScreen = document.getElementById('temple-screen');
const intentScreen = document.getElementById('intent-screen');
const startBtn = document.getElementById('start-btn');
const startBtnFooter = document.getElementById('start-btn-footer');
const tirupatiBtn = document.getElementById('tirupati-btn');
const dashboardScreen = document.getElementById('dashboard-screen');
const intentBtns = document.querySelectorAll('.intent-btn');
const backBtn = document.getElementById('back-btn');
const templeBackBtn = document.getElementById('temple-back-btn');
const intentBackBtn = document.getElementById('intent-back-btn');
const scenarioBtns = document.querySelectorAll('.scenario-btn');
const emergencyBtn = document.getElementById('emergency-btn');

// Dashboard UI Elements
const currentDestTitle = document.getElementById('current-destination').querySelector('span');
const crowdStatusBadge = document.getElementById('crowd-status-indicator');
const actionHeadingEl = document.getElementById('action-heading');
const actionHumanReasonEl = document.getElementById('action-human-reason');
const predictiveInsightEl = document.getElementById('predictive-insight-text');
const savingsHighlightEl = document.getElementById('savings-highlight');
const uiTimeSavedEl = document.getElementById('ui-time-saved');
const uiCrowdDiffEl = document.getElementById('ui-crowd-diff');
const recTimeEl = document.getElementById('rec-time');
const recDistEl = document.getElementById('rec-dist');
const recCrowdEl = document.getElementById('rec-crowd');
const chatFeed = document.getElementById('chat-feed');
const mapNodesContainer = document.getElementById('map-nodes');
const activeRoutePath = document.getElementById('active-route-path');
const altRoutePath = document.getElementById('alt-route-path');
const contextIntentEl = document.getElementById('context-intent');
const contextScenarioEl = document.getElementById('context-scenario');

// Emergency Modal Elements
const emergencyModal = document.getElementById('emergency-modal');
const nearestExitName = document.getElementById('nearest-exit-name');
const dismissEmergencyBtn = document.getElementById('dismiss-emergency');

// Initialization
function init() {
    // Force initial state: only landing visible
    switchScreen('landing', true);

    bindEvents();
    drawMapNodes(); // Draw all nodes initially
}

function bindEvents() {
    // New Landing Screen CTA
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            switchScreen('temple');
        });
    }
    if (startBtnFooter) {
        startBtnFooter.addEventListener('click', () => {
            switchScreen('temple');
        });
    }
    if (tirupatiBtn) {
        tirupatiBtn.addEventListener('click', () => {
            switchScreen('intent');
        });
    }
    intentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const intent = btn.getAttribute('data-intent');
            if (intent === 'emergency') {
                triggerEmergency();
            } else {
                startAssistantFlow(intent);
            }
        });
    });

    backBtn.addEventListener('click', () => {
        currentIntent = null;
        switchScreen('intent');
    });

    if (templeBackBtn) {
        templeBackBtn.addEventListener('click', () => {
            switchScreen('landing');
        });
    }

    if (intentBackBtn) {
        intentBackBtn.addEventListener('click', () => {
            currentIntent = null;
            switchScreen('temple');
        });
    }

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (isTransitioning) return;

            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentScenario = btn.getAttribute('data-scenario');

            // Reset state for new scenario
            chatFeed.innerHTML = '';
            lastSimMessage = null;

            // Restart simulation interval
            clearInterval(currentSimInterval);
            currentSimInterval = setInterval(simulateEvents, 22000);

            // Update context header
            if (contextScenarioEl) {
                contextScenarioEl.innerText = scenarios[currentScenario].name;
            }

            if (currentIntent) {
                // Rerun decision engine with new scenario
                addChatMessage('Assistant', `🔄 Scenario updated. Recalculating best route...`, 'insight');
                processIntent(currentIntent, true);
            }
        });
    });

    emergencyBtn.addEventListener('click', triggerEmergency);
    dismissEmergencyBtn.addEventListener('click', () => {
        emergencyModal.classList.add('hidden');
        if (currentIntent && currentIntent !== 'emergency') {
            addChatMessage('System', 'Emergency cleared. Resuming guidance.', 'success');
            clearInterval(currentSimInterval);
            currentSimInterval = setInterval(simulateEvents, 22000);
        }
    });

    // User Location Input logic (UI only)
    const locationInput = document.getElementById('user-location-input');
    const locationDisplay = document.getElementById('current-location-val');

    if (locationInput && locationDisplay) {
        locationInput.addEventListener('input', (e) => {
            locationDisplay.innerText = e.target.value || '--';
        });

        // Feedback when user enters location
        locationInput.addEventListener('change', (e) => {
            if (e.target.value.trim()) {
                currentLocation = e.target.value.trim();
                addChatMessage('Assistant', `📍 Using your location (${e.target.value}) to guide you better`, 'insight');
                // Recalculate route with updated location context
                if (currentIntent) {
                    processIntent(currentIntent, true);
                }
            }
        });

        // Virtual Map interaction logic
        const mapLabels = document.querySelectorAll('.map-label');
        mapLabels.forEach(label => {
            label.addEventListener('click', () => {
                // Clear previous selection highlight
                mapLabels.forEach(l => l.classList.remove('selected-label', 'highlight-label'));

                // Add highlight to current
                label.classList.add('selected-label');

                const loc = label.innerText.trim();
                currentLocation = loc;
                locationInput.value = loc;
                locationDisplay.innerText = loc;
                addChatMessage('Assistant', `📍 Selected ${loc} from map`, 'success');

                // Trigger any existing input listeners
                locationInput.dispatchEvent(new Event('input'));

                // Recalculate route with updated location context
                if (currentIntent) {
                    processIntent(currentIntent, true);
                }
            });
        });
    }
}

function switchScreen(screenType, immediate = false) {
    if (isTransitioning && !immediate) return false;

    const screens = [
        { id: 'landing', el: productLandingScreen },
        { id: 'temple', el: templeScreen },
        { id: 'intent', el: intentScreen },
        { id: 'dashboard', el: dashboardScreen }
    ];

    // State isolation: Cleanup when leaving or entering specific screens
    if (screenType === 'dashboard') {
        clearDashboardUI();
    } else {
        // If we are moving away from dashboard, cleanup simulation
        if (currentSimInterval) {
            clearInterval(currentSimInterval);
            currentSimInterval = null;
        }
        // Clear SVG routes to prevent flicker on next entry
        activeRoutePath.setAttribute('d', '');
        altRoutePath.setAttribute('d', '');
    }

    // Reset scroll position on every screen change.
    // window.scrollTo covers the page body (landing's multi-section scroll).
    // The incoming screen element's scrollTop covers any internal overflow panels
    // (e.g. the dashboard's scrollable content area).
    const incomingScreen = screens.find(s => s.id === screenType);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (incomingScreen) incomingScreen.el.scrollTop = 0;

    if (immediate) {
        screens.forEach(s => {
            s.el.style.transition = 'none';
            if (s.id === screenType) {
                s.el.classList.add('active');
            } else {
                s.el.classList.remove('active');
            }
            // Force reflow
            void s.el.offsetHeight;
            s.el.style.transition = '';
        });
        return true;
    }

    isTransitioning = true;
    document.body.classList.add('is-transitioning');

    screens.forEach(s => {
        if (s.id === screenType) {
            s.el.classList.add('active');
        } else {
            s.el.classList.remove('active');
        }
    });

    // Match CSS transition time
    setTimeout(() => {
        isTransitioning = false;
        document.body.classList.remove('is-transitioning');
    }, 500);

    return true;
}

function clearDashboardUI() {
    chatFeed.innerHTML = '';
    actionHeadingEl.innerText = '--';
    recTimeEl.innerText = '-- min';
    recDistEl.innerText = '-- m';
    recCrowdEl.innerText = '--';
    recCrowdEl.className = 'crowd-val';
    actionHumanReasonEl.innerText = '--';
    predictiveInsightEl.innerText = '--';
    savingsHighlightEl.style.display = 'none';
    currentDestTitle.innerText = '--';
    activeRoutePath.setAttribute('d', '');
    altRoutePath.setAttribute('d', '');
}

// Draw the physical nodes on the visualization
function drawMapNodes() {
    mapNodesContainer.innerHTML = '';

    Object.values(mapNodes).forEach(node => {
        const xPos = `${node.x}%`;
        const yPos = `${node.y}%`;

        const nodeEl = document.createElement('div');
        nodeEl.className = 'map-node';
        nodeEl.id = `node-${node.id}`;
        nodeEl.style.left = xPos;
        nodeEl.style.top = yPos;

        nodeEl.innerHTML = `
            <div class="node-label">${node.name}</div>
            <div class="node-dot"></div>
        `;

        mapNodesContainer.appendChild(nodeEl);
    });
}

// Draw SVG Paths connecting nodes
function renderRouteLines(activeRoute, altRoute) {
    try {
        console.log("Route passed:", activeRoute);
        if (activeRoute) {
            console.log("Route path:", activeRoute.path);
        }

        // Helper to generate SVG path string from route nodes
        const getPathString = (route) => {
            let pathStr = '';
            let validIndex = 0;
            for (let i = 0; i < route.path.length; i++) {
                const nodeId = route.path[i];
                const node = mapNodes[nodeId];
                if (!node) continue;

                if (validIndex === 0) pathStr += `M ${node.x} ${node.y} `;
                else pathStr += `L ${node.x} ${node.y} `;

                validIndex++;
            }
            return pathStr;
        };

        if (activeRoute) {
            const svgElement = document.getElementById('route-svg');
            svgElement.setAttribute('viewBox', '0 0 100 100');
            svgElement.setAttribute('preserveAspectRatio', 'none');

            activeRoutePath.setAttribute('d', getPathString(activeRoute));
        } else {
            activeRoutePath.setAttribute('d', '');
        }

        if (altRoute) {
            altRoutePath.setAttribute('d', getPathString(altRoute));
        } else {
            altRoutePath.setAttribute('d', '');
        }

        // Highlight active nodes in DOM
        document.querySelectorAll('.map-node').forEach(node => {
            node.classList.remove('active');
            node.classList.remove('destination');
        });

        if (activeRoute) {
            activeRoute.path.forEach((nodeId, index) => {
                const el = document.getElementById(`node-${nodeId}`);
                if (el) {
                    el.classList.add('active');
                    if (index === activeRoute.path.length - 1) {
                        el.classList.add('destination');
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error Message:", error.message);
        console.error("Stack Trace:", error.stack);
        console.error("Error Route Data:", activeRoute);
    }
}

function startAssistantFlow(intentKey) {
    // Only proceed if screen switch is successful (not transitioning)
    if (!switchScreen('dashboard')) return;

    currentIntent = intentKey;

    // Reset Title
    let titleStr = intentKey.charAt(0).toUpperCase() + intentKey.slice(1);
    currentDestTitle.innerText = titleStr;

    // Update context header
    if (contextIntentEl) {
        contextIntentEl.innerText = titleStr;
    }
    if (contextScenarioEl) {
        contextScenarioEl.innerText = scenarios[currentScenario].name;
    }

    processIntent(intentKey, false);

    // Start simulation loop (clearInterval is handled inside switchScreen)
    currentSimInterval = setInterval(simulateEvents, 22000);
}

// Core Decision Engine
function processIntent(intentKey, isRecalculation = false) {
    const routes = getCalculatedRoutes(intentKey, currentScenario, currentLocation);

    if (routes.length === 0) return;

    // Decision Logic: Compare (Time * 0.7 + Crowd * 0.3 heavily penalized)
    // We want the fastest route with the lowest crowd.
    let bestRoute = null;
    let altRoute = null;
    let minScore = Infinity;

    routes.forEach(route => {
        // Score = Time + (Crowd % * Time penalty factor) + prediction modifier + locationBonus
        let score = route.calculatedTime + (route.crowdRaw * 30) + (route.predictionMod || 0) + (route.locationBonus || 0);
        if (score < minScore) {
            altRoute = bestRoute;
            bestRoute = route;
            minScore = score;
        } else if (!altRoute && route !== bestRoute) {
            altRoute = route;
        }
    });

    bestRouteState = bestRoute;

    // Simplified Action Header
    let timeDiff = altRoute ? altRoute.calculatedTime - bestRoute.calculatedTime : 0;
    let mainActionText = `👉 Take ${bestRoute.name}`;
    if (timeDiff > 0) {
        mainActionText += ` <span class="benefit-highlight">— saves ${timeDiff} min</span>`;
    }

    actionHeadingEl.innerHTML = mainActionText;

    // UI Metrics (Minor data kept)
    recTimeEl.innerText = `${bestRoute.calculatedTime} min`;
    recDistEl.innerText = `${bestRoute.baseDist} m`;
    recCrowdEl.innerText = bestRoute.calculatedCrowdStatus;
    recCrowdEl.className = `crowd-val val-${bestRoute.calculatedCrowdStatus.toLowerCase()}`;

    let reasonText = '';

    if (altRoute) {
        let crowdDiff = altRoute.crowdRaw - bestRoute.crowdRaw;

        savingsHighlightEl.style.display = 'flex';

        if (timeDiff > 0) {
            uiTimeSavedEl.innerText = `${timeDiff}m faster`;
            uiTimeSavedEl.style.color = "var(--accent-green)";
        } else if (timeDiff === 0) {
            uiTimeSavedEl.innerText = `Standard time`;
            uiTimeSavedEl.style.color = "var(--text-muted)";
        } else {
            uiTimeSavedEl.innerText = `Detour`;
            uiTimeSavedEl.style.color = "var(--accent-yellow)";
        }

        if (crowdDiff > 0.1) {
            uiCrowdDiffEl.innerText = 'Avoids major crowd';
            uiCrowdDiffEl.style.color = "var(--accent-green)";
        } else if (crowdDiff < -0.1) {
            uiCrowdDiffEl.innerText = 'More crowded';
            uiCrowdDiffEl.style.color = "var(--accent-yellow)";
        } else {
            uiCrowdDiffEl.innerText = 'Normal density';
            uiCrowdDiffEl.style.color = "var(--text-muted)";
        }

        // Simplified reasoning
        if (timeDiff > 0 && crowdDiff > 0) {
            reasonText = `This route is faster and less crowded right now.`;
        } else if (timeDiff > 0) {
            reasonText = `This is currently the fastest path to your destination.`;
        } else if (crowdDiff > 0) {
            reasonText = `Bypasses heavy crowds for a smoother journey.`;
        } else {
            reasonText = `This remains the most reliable path available.`;
        }
    } else {
        savingsHighlightEl.style.display = 'none';
        reasonText = `Direct path to your destination.`;
    }

    const userLoc = document.getElementById('user-location-input')?.value;
    if (userLoc) {
        reasonText += ` (Based on your current location: ${userLoc})`;
    }

    actionHumanReasonEl.innerText = reasonText;
    predictiveInsightEl.innerText = bestRoute.predictionText || "No active predictions.";

    // Update Global Badge
    crowdStatusBadge.innerText = `Crowd: ${scenarios[currentScenario].name}`;
    let badgeClass = 'normal';
    if (currentScenario === 'peak') badgeClass = 'high';
    if (currentScenario === 'normal') badgeClass = 'medium';
    crowdStatusBadge.className = `status-badge ${badgeClass}`;

    // Update Map
    renderRouteLines(bestRoute, altRoute);

    // Provide Assistant Messaging
    generateAssistantResponse(bestRoute, altRoute, isRecalculation, reasonText);
}

function generateAssistantResponse(bestRoute, altRoute, isRecalculation, reasonText) {
    if (!isRecalculation) {
        // Step 1: Initial acknowledgment
        addChatMessage('Assistant', `Starting guidance. Checking path...`, 'message');

        // Step 2: "Thinking" phase
        setTimeout(() => {
            addChatMessage('Assistant', `Checking crowd levels...`, 'insight');
        }, 1200);

        // Step 3: Resolution
        setTimeout(() => {
            addChatMessage('Assistant', `Fastest route found.`, 'success');
        }, 2500);

        // Step 4: Simple recommendation
        setTimeout(() => {
            addChatMessage('Recommendation', `👉 Take ${bestRoute.name}`, 'message', reasonText);
        }, 3500);

    } else {
        // Rerouting logic
        addChatMessage('System Alert', `Crowd shifting. Finding new path...`, 'alert');

        setTimeout(() => {
            addChatMessage('Recommendation', `New path found! 👉 Take ${bestRoute.name}`, 'success');
        }, 1500);
    }
}

// UI Chat Manager
function addChatMessage(sender, text, msgClass, reasonText = '') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msgClass}`;

    let reasonHtml = reasonText ? `<div class="msg-reason"><strong>Why: </strong> ${reasonText}</div>` : '';

    msgDiv.innerHTML = `
        <div class="msg-header">
            <span>🤖 ${sender}</span>
            <span>Just now</span>
        </div>
        <div class="msg-body">${text}</div>
        ${reasonHtml}
    `;

    chatFeed.appendChild(msgDiv);

    // Auto scroll
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// Simulate Real-time adjustments
function simulateEvents() {
    if (!bestRouteState) return;

    // 30% chance to skip an event drop so it doesn't feel robotic or overload the user
    if (Math.random() < 0.3) return;

    // Pick random insight event filtered directly by strictly matching current scenario and preventing duplicates
    let eventOptions = simulationEvents.filter(e => e.triggerScenario === currentScenario && e.message !== lastSimMessage);

    // Fallback in the rare case there is only 1 available message for the scenario
    if (eventOptions.length === 0) {
        eventOptions = simulationEvents.filter(e => e.triggerScenario === currentScenario);
        if (eventOptions.length === 0) return;
    }

    let randIdx = Math.floor(Math.random() * eventOptions.length);
    let evt = eventOptions[randIdx];

    // Simplify simulation messages based on provided guidelines
    let displayMessage = evt.message;
    if (evt.type === 'success') displayMessage = "Best path confirmed.";
    if (evt.triggerScenario === 'peak' && evt.type === 'alert') displayMessage = "Crowd increasing nearby — stay on route.";

    // Prevent consecutive repetition of the same displayed message
    if (displayMessage === lastSimMessage) return;
    lastSimMessage = displayMessage;

    addChatMessage('Live Update', displayMessage, evt.type, evt.insight);

    // Minor predictive time adjustment to render UI alive
    if (evt.type === 'alert' && bestRouteState) {
        let newTime = Math.min(
            parseInt(recTimeEl.innerText) + 2,
            bestRouteState.calculatedTime * 1.5
        );
        recTimeEl.innerText = `${Math.round(newTime)} min`;
    }
}

// Emergency Trigger
function triggerEmergency() {
    clearInterval(currentSimInterval);

    emergencyModal.classList.remove('hidden');

    // Get nearest exit (mock logic)
    let exitRoutes = getCalculatedRoutes('exit', 'low'); // Ignore crowd for nearest
    let bestExit = exitRoutes.sort((a, b) => a.baseDist - b.baseDist)[0];

    nearestExitName.innerText = bestExit.path[bestExit.path.length - 1].replace('_', ' ').toUpperCase();
}

// Start app
window.addEventListener('DOMContentLoaded', init);