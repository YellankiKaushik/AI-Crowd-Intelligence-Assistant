const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');

// Replace refreshUIText
const refreshStart = content.indexOf('function refreshUIText() {');
const refreshEndStr = '    if (recActionEl) recActionEl.innerText = t("Recommended Action");\n}';
const refreshEnd = content.indexOf(refreshEndStr) + refreshEndStr.length;

const newRefresh = `/* DOM Translation Logic */
const originalTexts = [];
function captureOriginalTexts(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.nodeValue;
        if (text.trim() && /[a-zA-Z]/.test(text)) {
            let parent = node.parentNode;
            if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE' && parent.id !== 'lang-switch') {
                originalTexts.push({ node: node, original: text, textKey: text.trim() });
            }
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE' && node.id !== 'lang-switch') {
            if (node.placeholder && /[a-zA-Z]/.test(node.placeholder)) {
                originalTexts.push({ node: node, type: 'placeholder', textKey: node.placeholder });
            }
            node.childNodes.forEach(captureOriginalTexts);
        }
    }
}

function refreshUIText() {
    originalTexts.forEach(item => {
        if (item.type === 'placeholder') {
            item.node.placeholder = t(item.textKey);
        } else {
            item.node.nodeValue = item.original.replace(item.textKey, t(item.textKey));
        }
    });
}`;

content = content.substring(0, refreshStart) + newRefresh + content.substring(refreshEnd);


// Update init()
content = content.replace('function init() {', 'function init() {\n    captureOriginalTexts(document.body);\n    refreshUIText();');

// Replace dynamic strings in JS
content = content.replace(/\('Assistant',/g, "(t('Assistant'),");
content = content.replace(/\('Recommendation',/g, "(t('Recommendation'),");
content = content.replace(/\('System Alert',/g, "(t('System Alert'),");
content = content.replace(/\('Live Update',/g, "(t('Live Update'),");
content = content.replace(/\('System',/g, "(t('System'),");

content = content.replace(/ \`Starting guidance. Checking path...\`/g, " t('Starting guidance. Checking path...')");
content = content.replace(/ \`Checking crowd levels...\`/g, " t('Checking crowd levels...')");
content = content.replace(/ \`Crowd shifting. Finding new path...\`/g, " t('Crowd shifting. Finding new path...')");
content = content.replace(/\`👉 Take \$\{bestRoute.name\}\`/g, "\`👉 ${t('Take')} ${t(bestRoute.name)}\`");
content = content.replace(/\`New path found\! 👉 Take \$\{bestRoute.name\}\`/g, "\`${t('New path found')}! 👉 ${t('Take')} ${t(bestRoute.name)}\`");

content = content.replace(/'Emergency cleared. Resuming guidance.'/g, "t('Emergency cleared. Resuming guidance.')");
content = content.replace(/\`📍 Using your location \(\$\{e\.target\.value\}\) to guide you better\`/g, "\`📍 ${t('Using your location')} (${e.target.value}) ${t('to guide you better')}\`");
content = content.replace(/\`📍 Selected \$\{loc\} from map\`/g, "\`📍 ${t('Selected')} ${t(loc)} ${t('from map')}\`");
content = content.replace(/\`🔄 Scenario updated. Recalculating best route...\`/g, "t('Scenario updated. Recalculating best route...')");

// Metrics UI in processIntent
content = content.replace(/\`${timeDiff}m faster\`/g, '\`${timeDiff}${t("m faster")}\`');
content = content.replace(/\`Standard time\`/g, 't("Standard time")');
content = content.replace(/\`Detour\`/g, 't("Detour")');
content = content.replace(/'Avoids major crowd'/g, 't("Avoids major crowd")');
content = content.replace(/'More crowded'/g, 't("More crowded")');
content = content.replace(/'Normal density'/g, 't("Normal density")');
content = content.replace(/\`This route is faster and less crowded right now.\`/g, 't("This route is faster and less crowded right now.")');
content = content.replace(/\`This is currently the fastest path to your destination.\`/g, 't("This is currently the fastest path to your destination.")');
content = content.replace(/\`Bypasses heavy crowds for a smoother journey.\`/g, 't("Bypasses heavy crowds for a smoother journey.")');
content = content.replace(/\`This remains the most reliable path available.\`/g, 't("This remains the most reliable path available.")');
content = content.replace(/\` \\(Based on your current location: \$\{userLoc\}\\)\`/g, '\` (${t("Based on your current location")}: ${t(userLoc)})\`');
content = content.replace(/\`Direct path to your destination.\`/g, 't("Direct path to your destination.")');

// "Take" string
content = content.replace(/\`👉 Take \$\{bestRoute.name\}\`/g, '\`👉 ${t("Take")} ${t(bestRoute.name)}\`');
content = content.replace('`<span class="benefit-highlight">— saves ${timeDiff} min</span>`', '`<span class="benefit-highlight">— ${t("saves")} ${timeDiff} ${t("min")}</span>`');


// Current destination translations
content = content.replace(/currentDestTitle\.innerText = titleStr;/g, 'currentDestTitle.innerText = t(titleStr);');
content = content.replace(/contextIntentEl\.innerText = titleStr;/g, 'contextIntentEl.innerText = t(titleStr);');
content = content.replace(/contextScenarioEl\.innerText = scenarios\[currentScenario\]\.name;/g, 'contextScenarioEl.innerText = t(scenarios[currentScenario].name);');

// `bestRoute.name` references
content = content.replace(/nearestExitName.innerText = bestExit.path\[bestExit.path.length - 1\].replace\('_', ' '\).toUpperCase\(\);/g, "nearestExitName.innerText = t(bestExit.path[bestExit.path.length - 1].replace('_', ' ').toUpperCase());");

// reasonText inside generateAssistantResponse
content = content.replace(/\`👉 Take \$\{bestRoute.name\}\`, 'message', reasonText/g, "\`👉 ${t('Take')} ${t(bestRoute.name)}\`, 'message', reasonText");

// processIntent UI metrics
content = content.replace(/\`\$\{bestRoute.calculatedTime\} min\`/g, '\`${bestRoute.calculatedTime} ${t("min")}\`');
content = content.replace(/\`\$\{bestRoute.baseDist\} m\`/g, '\`${bestRoute.baseDist} ${t("m")}\`');
content = content.replace(/recCrowdEl.innerText = bestRoute.calculatedCrowdStatus;/g, 'recCrowdEl.innerText = t(bestRoute.calculatedCrowdStatus);');

fs.writeFileSync('app.js', content);
