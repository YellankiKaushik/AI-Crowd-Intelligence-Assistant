// Global State
let currentIntent = null;
let currentScenario = 'low';
let currentSimInterval = null;
let bestRouteState = null;
let lastSimMessage = null;





// DOM Elements
const landingScreen = document.getElementById('landing-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const intentBtns = document.querySelectorAll('.intent-btn');
const backBtn = document.getElementById('back-btn');
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

// Emergency Modal Elements
const emergencyModal = document.getElementById('emergency-modal');
const nearestExitName = document.getElementById('nearest-exit-name');
const dismissEmergencyBtn = document.getElementById('dismiss-emergency');

// Initialization
function init() {
    bindEvents();
    drawMapNodes(); // Draw all nodes initially
}

function bindEvents() {
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
        clearInterval(currentSimInterval);
        switchScreen('landing');
    });

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentScenario = btn.getAttribute('data-scenario');
            if (currentIntent) {
                // Rerun decision engine with new scenario
                addChatMessage('Assistant', `Scenario updated to ${scenarios[currentScenario].name}. Recalculating routes...`, 'insight', 'Simulation Engine parameters modified.');
                processIntent(currentIntent, true);
            }
        });
    });

    emergencyBtn.addEventListener('click', triggerEmergency);
    dismissEmergencyBtn.addEventListener('click', () => {
        emergencyModal.classList.add('hidden');
        if (currentIntent && currentIntent !== 'emergency') {
            addChatMessage('System', 'Emergency protocol cleared. Resuming active guidance.', 'success');
            clearInterval(currentSimInterval);
            currentSimInterval = setInterval(simulateEvents, 12000);
        }
    });
}

function switchScreen(screenType) {
    if (screenType === 'landing') {
        landingScreen.classList.add('active');
        dashboardScreen.classList.remove('active');
        currentIntent = null;
    } else {
        landingScreen.classList.remove('active');
        dashboardScreen.classList.add('active');
    }
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
    // Helper to generate SVG path string from route nodes
    const getPathString = (route) => {
        let pathStr = '';
        route.path.forEach((nodeId, index) => {
            const node = mapNodes[nodeId];
            if (index === 0) pathStr += `M ${node.x} ${node.y} `;
            else pathStr += `L ${node.x} ${node.y} `;
        });
        return pathStr;
    };

    if (activeRoute) {
        // Since SVG viewbox is 0 0 100 100, and node percentages map to it
        // Wait, SVG paths need absolute/relative coords matching viewBox.
        // Let's set viewBox on SVG dynamically if needed.
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
}

// Assistant Flow Entry Point
function startAssistantFlow(intentKey) {
    currentIntent = intentKey;
    switchScreen('dashboard');

    chatFeed.innerHTML = ''; // Clear chat

    // Set Title
    let titleStr = intentKey.charAt(0).toUpperCase() + intentKey.slice(1);
    currentDestTitle.innerText = titleStr;

    processIntent(intentKey, false);

    // Start simulation loop
    clearInterval(currentSimInterval);
    currentSimInterval = setInterval(simulateEvents, 12000); // Trigger an event every 12 seconds but randomizer inside will space it out naturally
}

// Core Decision Engine
function processIntent(intentKey, isRecalculation = false) {
    const routes = getCalculatedRoutes(intentKey, currentScenario);

    if (routes.length === 0) return;

    // Decision Logic: Compare (Time * 0.7 + Crowd * 0.3 heavily penalized)
    // We want the fastest route with the lowest crowd.
    let bestRoute = null;
    let altRoute = null;
    let minScore = Infinity;

    routes.forEach(route => {
        // Score = Time + (Crowd % * Time penalty factor) + prediction modifier
        let score = route.calculatedTime + (route.crowdRaw * 30) + (route.predictionMod || 0);
        if (score < minScore) {
            altRoute = bestRoute;
            bestRoute = route;
            minScore = score;
        } else if (!altRoute) {
            altRoute = route;
        }
    });

    bestRouteState = bestRoute;

    // Update UI Metrics
    actionHeadingEl.innerText = bestRoute.name;
    recTimeEl.innerText = `${bestRoute.calculatedTime} min`;
    recDistEl.innerText = `${bestRoute.baseDist} m`;
    recCrowdEl.innerText = bestRoute.calculatedCrowdStatus;
    recCrowdEl.className = `crowd-val val-${bestRoute.calculatedCrowdStatus.toLowerCase()}`;

    let reasonText = '';

    if (altRoute) {
        let timeDiff = altRoute.calculatedTime - bestRoute.calculatedTime;
        let crowdDiff = altRoute.crowdRaw - bestRoute.crowdRaw;

        savingsHighlightEl.style.display = 'flex';

        if (timeDiff > 0) {
            uiTimeSavedEl.innerText = `${timeDiff} min saved`;
            uiTimeSavedEl.style.color = "var(--accent-green)";
        } else if (timeDiff === 0) {
            uiTimeSavedEl.innerText = `Same time`;
            uiTimeSavedEl.style.color = "var(--text-muted)";
        } else {
            uiTimeSavedEl.innerText = `+${Math.abs(timeDiff)} min detour`;
            uiTimeSavedEl.style.color = "var(--accent-yellow)";
        }

        if (crowdDiff > 0.3) {
            uiCrowdDiffEl.innerText = 'Avoids major crowd';
            uiCrowdDiffEl.style.color = "var(--accent-green)";
        } else if (crowdDiff > 0.1) {
            uiCrowdDiffEl.innerText = 'Avoids slight crowd';
            uiCrowdDiffEl.style.color = "var(--accent-green)";
        } else if (crowdDiff < -0.1) {
            uiCrowdDiffEl.innerText = 'Slightly more crowded';
            uiCrowdDiffEl.style.color = "var(--accent-yellow)";
        } else {
            uiCrowdDiffEl.innerText = 'Similar density';
            uiCrowdDiffEl.style.color = "var(--text-muted)";
        }

        if (timeDiff > 0 && crowdDiff > 0) {
            reasonText = `You will save ${timeDiff} minutes and avoid heavy crowd congestion by taking this route.`;
        } else if (timeDiff > 0 && crowdDiff <= 0) {
            reasonText = `This is the fastest path available, saving you ${timeDiff} minutes, though you may encounter some crowds.`;
        } else if (timeDiff <= 0 && crowdDiff > 0) {
            reasonText = `This route bypasses severe crowds. It requires ${Math.abs(timeDiff)} minutes of extra walking, but guarantees a much smoother journey.`;
        } else {
            reasonText = `This remains the most direct and reliable path to your destination based on current conditions.`;
        }
    } else {
        savingsHighlightEl.style.display = 'none';
        reasonText = `This is the only direct and clear route to your destination.`;
    }

    actionHumanReasonEl.innerText = reasonText;
    predictiveInsightEl.innerText = bestRoute.predictionText || "No active predictions for this area.";

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
        addChatMessage('System', `Initiating guidance to ${currentIntent.toUpperCase()}...`, 'message');

        // Step 2: "Thinking" phase
        setTimeout(() => {
            addChatMessage('System', `I am analyzing current crowd conditions and historical movement vectors across the venue...`, 'insight');
        }, 1500);

        // Step 3: Resolution
        setTimeout(() => {
            addChatMessage('System', `Done. This is the optimal route for you right now.`, 'success');
        }, 3000);

        // Step 4: Conversational recommendation
        setTimeout(() => {
            addChatMessage('Recommendation', `Please take ${bestRoute.name}.`, 'message', reasonText);
        }, 4500);

        // Step 5: Predictive message drop natively into chat
        if (bestRoute.predictionText) {
            setTimeout(() => {
                addChatMessage('Predictive AI', bestRoute.predictionText, 'insight');
            }, 7000);
        }

    } else {
        // Rerouting logic
        addChatMessage('System Alert', `Crowd dynamics have shifted locally. I am recalculating your path...`, 'alert');

        setTimeout(() => {
            addChatMessage('Recommendation', `Dynamic adjustment applied. New recommended route is ${bestRoute.name}.`, 'success', 'Calculated based on live scenario constraints to save time.');
        }, 2000);
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

    lastSimMessage = evt.message;

    addChatMessage('Live Update', evt.message, evt.type, evt.insight);

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
