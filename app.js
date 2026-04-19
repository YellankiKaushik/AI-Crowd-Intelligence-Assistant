// Global State
let currentIntent = null;
let currentScenario = 'low';
let currentSimInterval = null;
let bestRouteState = null;
let lastSimMessage = null;
let isTransitioning = false;
let currentLocation = null;
let currentLang = 'en';
let activeTimeouts = [];

const allowedLocations = [
    "Gate A",
    "Gate B",
    "Waiting Hall 1",
    "Waiting Hall 2",
    "Food Court",
    "Darshan",
    "Exit"
];

function clearAllTimeouts() {
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];
}

const translations = {
  "en": {
    "Navigating to": "Navigating to",
    "Crowd Mode": "Crowd Mode",
    "Select your location": "1. SELECT YOUR LOCATION",
    "Recommended Action": "RECOMMENDED ACTION",
    "Fastest route found": "Fastest route found",
    "New path found": "New path found",
    "Checking for better routes": "Checking for better routes",
    "Navigate Crowded Temples with": "Navigate Crowded Temples with",
    "Intelligence": "Intelligence",
    "Real-time AI guidance to bypass queues and reach your destination faster.": "Real-time AI guidance to bypass queues and reach your destination faster.",
    "Select destination": "Select destination",
    "Follow smart routing": "Follow smart routing",
    "Save time": "Save time",
    "Start Your Journey": "Start Your Journey",
    "Explore How It Works": "Explore How It Works",
    "AI-Powered": "AI-Powered",
    "Advanced neural routing optimized for high-density crowds.": "Advanced neural routing optimized for high-density crowds.",
    "Real-Time Guidance": "Real-Time Guidance",
    "Live sensors and data feeds processed every few seconds.": "Live sensors and data feeds processed every few seconds.",
    "Smart Routing": "Smart Routing",
    "Dynamic pathfinding that adapts to shifting crowd patterns.": "Dynamic pathfinding that adapts to shifting crowd patterns.",
    "Seamlessly Simple": "Seamlessly Simple",
    "Choose Destination": "Choose Destination",
    "Tell the AI where you want to go—Darshan, Food, or Exit.": "Tell the AI where you want to go—Darshan, Food, or Exit.",
    "Get Smart Path": "Get Smart Path",
    "Our engine calculates the fastest route based on current density.": "Our engine calculates the fastest route based on current density.",
    "Follow Guidance": "Follow Guidance",
    "Live, turn-by-turn instructions keep you moving through the crowd.": "Live, turn-by-turn instructions keep you moving through the crowd.",
    "Real-World Scenario": "Real-World Scenario",
    "From Queue to Destination": "From Queue to Destination",
    "Ready for a smoother journey?": "Ready for a smoother journey?",
    "Join thousands of users navigating smarter today.": "Join thousands of users navigating smarter today.",
    "Launch Assistant": "Launch Assistant",
    "Back": "Back",
    "Select Temple": "Select Temple",
    "Choose a temple to begin your journey": "Choose a temple to begin your journey",
    "Tirupati": "Tirupati",
    "Coming Soon": "Coming Soon",
    "Crowd Intelligence": "Crowd Intelligence",
    "Assistant": "Assistant",
    "Where are you heading today?": "Where are you heading today?",
    "Go for Darshan": "Go for Darshan",
    "Find Food": "Find Food",
    "Find Exit": "Find Exit",
    "Emergency": "Emergency",
    "Simulation:": "Simulation:",
    "Low Crowd": "Low Crowd",
    "Normal": "Normal",
    "Peak Crowd": "Peak Crowd",
    "AI is optimizing your route based on live conditions": "AI is optimizing your route based on live conditions",
    "Gate A": "Gate A",
    "Gate B": "Gate B",
    "Darshan": "Darshan",
    "Food Court": "Food Court",
    "Exit": "Exit",
    "Currently at:": "Currently at:",
    "Or type location...": "Or type location...",
    "Time": "Time",
    "Dist": "Dist",
    "Crowd": "Crowd",
    "Route View:": "Route View:",
    "Live Updates": "Live Updates",
    "Live": "Live",
    "EMERGENCY DETECTED": "EMERGENCY DETECTED",
    "Immediate evacuation required.": "Immediate evacuation required.",
    "Nearest Exit:": "Nearest Exit:",
    "Follow the red flashing path immediately.": "Follow the red flashing path immediately.",
    "Dismiss (Simulation)": "Dismiss (Simulation)",
    "faster": "faster",
    "m": "m",
    "Standard time": "Standard time",
    "Detour": "Detour",
    "Avoids major crowd": "Avoids major crowd",
    "More crowded": "More crowded",
    "Normal density": "Normal density",
    "This route is faster and less crowded right now.": "This route is faster and less crowded right now.",
    "This is currently the fastest path to your destination.": "This is currently the fastest path to your destination.",
    "Bypasses heavy crowds for a smoother journey.": "Bypasses heavy crowds for a smoother journey.",
    "This remains the most reliable path available.": "This remains the most reliable path available.",
    "Based on your current location": "Based on your current location",
    "Take": "Take",
    "saves": "saves",
    "min": "min",
    "Starting guidance. Checking path...": "Starting guidance. Checking path...",
    "Checking crowd levels...": "Checking crowd levels...",
    "Crowd shifting. Finding new path...": "Crowd shifting. Finding new path...",
    "Best path confirmed.": "Best path confirmed.",
    "Crowd increasing nearby — stay on route.": "Crowd increasing nearby — stay on route.",
    "System Alert": "System Alert",
    "Recommendation": "Recommendation",
    "Live Update": "Live Update",
    "Emergency cleared. Resuming guidance.": "Emergency cleared. Resuming guidance.",
    "Using your location": "Using your location",
    "to guide you better": "to guide you better",
    "Selected": "Selected",
    "from map": "from map",
    "Scenario updated. Recalculating best route...": "Scenario updated. Recalculating best route...",
    "Gate 4": "Gate 4",
    "System": "System"
  },
  "hi": {
    "Navigating to": "नेविगेट कर रहे हैं",
    "Crowd Mode": "भीड़ मोड",
    "Select your location": "1. अपना स्थान चुनें",
    "Recommended Action": "अनुशंसित कार्रवाई",
    "Fastest route found": "सबसे तेज़ रास्ता मिला",
    "New path found": "नया रास्ता मिला",
    "Checking for better routes": "बेहतर रास्तों की जाँच की जा रही है",
    "Navigate Crowded Temples with": "भीड़-भाड़ वाले मंदिरों में नेविगेट करें",
    "Intelligence": "बुद्धिमत्ता के साथ",
    "Real-time AI guidance to bypass queues and reach your destination faster.": "कतारों को पार करने और तेज़ी से पहुँचने के लिए रीयल-टाइम AI मार्गदर्शन।",
    "Select destination": "गंतव्य चुनें",
    "Follow smart routing": "स्मार्ट मार्ग का पालन करें",
    "Save time": "समय बचाएं",
    "Start Your Journey": "अपनी यात्रा शुरू करें",
    "Explore How It Works": "जानें कि यह कैसे काम करता है",
    "AI-Powered": "AI-संचालित",
    "Advanced neural routing optimized for high-density crowds.": "अधिक भीड़ के लिए अनुकूलित उन्नत न्यूरल रूटिंग।",
    "Real-Time Guidance": "रीयल-टाइम मार्गदर्शन",
    "Live sensors and data feeds processed every few seconds.": "हर कुछ सेकंड में प्रोसेस किए गए लाइव सेंसर और डेटा फ़ीड।",
    "Smart Routing": "स्मार्ट रूटिंग",
    "Dynamic pathfinding that adapts to shifting crowd patterns.": "गतिशील पथ-खोज जो बदलती भीड़ के प्रति अनुकूल होती है।",
    "Seamlessly Simple": "पूरी तरह से सरल",
    "Choose Destination": "गंतव्य चुनें",
    "Tell the AI where you want to go—Darshan, Food, or Exit.": "AI को बताएं कि आप कहाँ जाना चाहते हैं—दर्शन, भोजन, या निकास।",
    "Get Smart Path": "स्मार्ट पथ प्राप्त करें",
    "Our engine calculates the fastest route based on current density.": "हमारा इंजन वर्तमान घनत्व के आधार पर सबसे तेज़ मार्ग की गणना करता है।",
    "Follow Guidance": "मार्गदर्शन का पालन करें",
    "Live, turn-by-turn instructions keep you moving through the crowd.": "लाइव और स्टेप-बाय-स्टेप निर्देश आपको भीड़ में आगे बढ़ाते रहते हैं।",
    "Real-World Scenario": "वास्तविक दुनिया का परिदृश्य",
    "From Queue to Destination": "कतार से गंतव्य तक",
    "Ready for a smoother journey?": "एक सहज यात्रा के लिए तैयार हैं?",
    "Join thousands of users navigating smarter today.": "आज ही स्मार्ट नेविगेट करने वाले हज़ारों उपयोगकर्ताओं से जुड़ें।",
    "Launch Assistant": "असिस्टेंट लॉन्च करें",
    "Back": "पीछे",
    "Select Temple": "मंदिर चुनें",
    "Choose a temple to begin your journey": "अपनी यात्रा शुरू करने के लिए एक मंदिर चुनें",
    "Tirupati": "तिरुपति",
    "Coming Soon": "जल्द आ रहा है",
    "Crowd Intelligence": "क्रॉड इंटेलिजेंस",
    "Assistant": "असिस्टेंट",
    "Where are you heading today?": "आज आप कहाँ जा रहे हैं?",
    "Go for Darshan": "दर्शन के लिए जाएं",
    "Find Food": "भोजन खोजें",
    "Find Exit": "निकास खोजें",
    "Emergency": "आपातकाल",
    "Simulation:": "सिमुलेशन:",
    "Low Crowd": "कम भीड़",
    "Normal": "सामान्य",
    "Peak Crowd": "पीक भीड़",
    "AI is optimizing your route based on live conditions": "AI लाइव स्थितियों के आधार पर आपके मार्ग को अनुकूलित कर रहा है",
    "Gate A": "गेट ए",
    "Gate B": "गेट बी",
    "Darshan": "दर्शन",
    "Food Court": "फूड कोर्ट",
    "Exit": "निकास",
    "Currently at:": "वर्तमान में:",
    "Or type location...": "या स्थान टाइप करें...",
    "Time": "समय",
    "Dist": "दूरी",
    "Crowd": "भीड़",
    "Route View:": "मार्ग दृश्य:",
    "Live Updates": "लाइव अपडेट",
    "Live": "लाइव",
    "EMERGENCY DETECTED": "आपातकाल का पता चला",
    "Immediate evacuation required.": "तत्काल निकासी की आवश्यकता है।",
    "Nearest Exit:": "निकटतम निकास:",
    "Follow the red flashing path immediately.": "तुरंत लाल चमकते रास्ते का पालन करें।",
    "Dismiss (Simulation)": "खारिज करें (सिमुलेशन)",
    "faster": "तेज़",
    "m": "मी",
    "Standard time": "मानक समय",
    "Detour": "चक्कर",
    "Avoids major crowd": "भारी भीड़ से बचाता है",
    "More crowded": "अधिक भीड़",
    "Normal density": "सामान्य घनत्व",
    "This route is faster and less crowded right now.": "यह मार्ग अभी तेज़ और कम भीड़ वाला है।",
    "This is currently the fastest path to your destination.": "यह वर्तमान में आपके गंतव्य के लिए सबसे तेज़ मार्ग है।",
    "Bypasses heavy crowds for a smoother journey.": "एक सहज यात्रा के लिए भारी भीड़ से बचाता है।",
    "This remains the most reliable path available.": "यह उपलब्ध सबसे विश्वसनीय मार्ग बना हुआ है।",
    "Based on your current location": "आपके वर्तमान स्थान के आधार पर",
    "Take": "लें",
    "saves": "बचाता है",
    "min": "मिनट",
    "Starting guidance. Checking path...": "मार्गदर्शन शुरू हो रहा है. रास्ता चेक कर रहे हैं...",
    "Checking crowd levels...": "भीड़ के स्तर की जाँच हो रही है...",
    "Crowd shifting. Finding new path...": "भीड़ बदल रही है। नया रास्ता खोजा जा रहा है...",
    "Best path confirmed.": "सर्वश्रेष्ठ पथ की पुष्टि की गई।",
    "Crowd increasing nearby — stay on route.": "पास में भीड़ बढ़ रही है - रास्ते पर रहें।",
    "System Alert": "सिस्टम अलर्ट",
    "Recommendation": "सिफारिश",
    "Live Update": "लाइव अपडेट",
    "Emergency cleared. Resuming guidance.": "आपातकाल हटा दिया गया। मार्गदर्शन फिर से शुरू हो रहा है।",
    "Using your location": "आपकी लोकेशन का उपयोग कर रहे हैं",
    "to guide you better": "आपको बेहतर मार्गदर्शन के लिए",
    "Selected": "चयनित",
    "from map": "नक्शे से",
    "Scenario updated. Recalculating best route...": "परिदृश्य अद्यतन किया गया। सर्वश्रेष्ठ मार्ग की पुनर्गणना हो रही है...",
    "Gate 4": "गेट 4",
    "System": "सिस्टम"
  },
  "te": {
    "Navigating to": "నావిగేట్ అవుతోంది",
    "Crowd Mode": "రద్దీ మోడ్",
    "Select your location": "1. మీ స్థానాన్ని ఎంచుకోండి",
    "Recommended Action": "సిఫార్సు చేసిన చర్య",
    "Fastest route found": "వేగవంతమైన మార్గం కనుగొనబడింది",
    "New path found": "కొత్త మార్గం కనుగొనబడింది",
    "Checking for better routes": "మెరుగైన మార్గాల కోసం తనిఖీ చేస్తోంది",
    "Navigate Crowded Temples with": "రద్దీగా ఉండే ఆలయాల్లో నావిగేట్ చేయండి",
    "Intelligence": "ఇంటెలిజెన్స్ తో",
    "Real-time AI guidance to bypass queues and reach your destination faster.": "క్యూలను దాటి వేగంగా గమ్యం చేరుకోవడానికి రియల్-టైమ్ AI మార్గదర్శకత్వం.",
    "Select destination": "గమ్యాన్ని ఎంచుకోండి",
    "Follow smart routing": "స్మార్ట్ మార్గాన్ని అనుసరించండి",
    "Save time": "సమయం ఆదా చేయండి",
    "Start Your Journey": "మీ ప్రయాణాన్ని ప్రారంభించండి",
    "Explore How It Works": "ఇది ఎలా పనిచేస్తుందో తెలుసుకోండి",
    "AI-Powered": "AI-ఆధారితం",
    "Advanced neural routing optimized for high-density crowds.": "అధిక రద్దీకి ఆప్టిమైజ్ చేయబడిన అధునాతన న్యూరల్ రూటింగ్.",
    "Real-Time Guidance": "రియల్-టైమ్ మార్గదర్శకత్వం",
    "Live sensors and data feeds processed every few seconds.": "ప్రతి కొన్ని సెకన్లకు ప్రాసెస్ చేయబడిన లైవ్ సెన్సార్లు మరియు డేటా ఫీడ్‌లు.",
    "Smart Routing": "స్మార్ట్ రూటింగ్",
    "Dynamic pathfinding that adapts to shifting crowd patterns.": "రద్దీకి అనుగుణంగా మారే డైనమిక్ మార్గ-శోధన.",
    "Seamlessly Simple": "అతుకులు లేని సరళత్వం",
    "Choose Destination": "గమ్యాన్ని ఎంచుకోండి",
    "Tell the AI where you want to go—Darshan, Food, or Exit.": "మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారో AI కి చెప్పండి—దర్శనం, ఆహారం, లేదా నిష్క్రమణ.",
    "Get Smart Path": "స్మార్ట్ మార్గాన్ని పొందండి",
    "Our engine calculates the fastest route based on current density.": "మా ఇంజిన్ రద్దీ ఆధారంగా వేగవంతమైన మార్గాన్ని గణిస్తుంది.",
    "Follow Guidance": "మార్గదర్శకాన్ని అనుసరించండి",
    "Live, turn-by-turn instructions keep you moving through the crowd.": "లైవ్ సూచనలు మిమ్మల్ని రద్దీ ద్వారా ముందుకు కదిలిస్తాయి.",
    "Real-World Scenario": "వాస్తవ ప్రపంచ పరిణామం",
    "From Queue to Destination": "క్యూ నుండి గమ్యం వరకు",
    "Ready for a smoother journey?": "మృదువైన ప్రయాణానికి సిద్ధంగా ఉన్నారా?",
    "Join thousands of users navigating smarter today.": "ఈరోజు స్మార్ట్ గా నావిగేట్ చేస్తున్న వేలాది మందితో చేరండి.",
    "Launch Assistant": "అసిస్టెంట్‌ను ప్రారంభించండి",
    "Back": "వెనుకకు",
    "Select Temple": "ఆలయాన్ని ఎంచుకోండి",
    "Choose a temple to begin your journey": "మీ ప్రయాణం ప్రారంభించడానికి ఆలయాన్ని ఎంచుకోండి",
    "Tirupati": "తిరుపతి",
    "Coming Soon": "త్వరలో వస్తుంది",
    "Crowd Intelligence": "క్రౌడ్ ఇంటెలిజెన్స్",
    "Assistant": "అసిస్టెంట్",
    "Where are you heading today?": "మీరు ఈరోజు ఎక్కడికి వెళుతున్నారు?",
    "Go for Darshan": "దర్శనానికి వెళ్ళండి",
    "Find Food": "ఆహారం కనుగొనండి",
    "Find Exit": "నిష్క్రమణ కనుగొనండి",
    "Emergency": "అత్యవసర పరిస్థితి",
    "Simulation:": "సిమ్యులేషన్:",
    "Low Crowd": "తక్కువ రద్దీ",
    "Normal": "సాధారణ",
    "Peak Crowd": "గరిష్ట రద్దీ",
    "AI is optimizing your route based on live conditions": "లైవ్ పరిస్థితుల ఆధారంగా AI మీ మార్గాన్ని అనుకూలీకరిస్తోంది",
    "Gate A": "గేట్ ఎ",
    "Gate B": "గేట్ బి",
    "Darshan": "దర్శనం",
    "Food Court": "ఫుడ్ కోర్ట్",
    "Exit": "నిష్క్రమణ",
    "Currently at:": "ప్రస్తుతం:",
    "Or type location...": "లేదా స్థానం టైప్ చేయండి...",
    "Time": "సమయం",
    "Dist": "దూరం",
    "Crowd": "రద్దీ",
    "Route View:": "రూట్ వీక్షణ:",
    "Live Updates": "లైవ్ అప్‌డేట్‌లు",
    "Live": "లైవ్",
    "EMERGENCY DETECTED": "అత్యవసర పరిస్థితి గుర్తించబడింది",
    "Immediate evacuation required.": "తక్షణ తరలింపు అవసరం.",
    "Nearest Exit:": "సమీప నిష్క్రమణ:",
    "Follow the red flashing path immediately.": "వెంటనే మెరుస్తున్న ఎర్ర మార్గాన్ని అనుసరించండి.",
    "Dismiss (Simulation)": "డిస్మిస్ చేయండి (సిమ్యులేషన్)",
    "faster": "వేగంగా",
    "m": "ని",
    "Standard time": "ప్రామాణిక సమయం",
    "Detour": "చుట్టుమార్గం",
    "Avoids major crowd": "పెద్ద రద్దీని నివారిస్తుంది",
    "More crowded": "మరింత రద్దీ",
    "Normal density": "సాధారణ సాంద్రత",
    "This route is faster and less crowded right now.": "ఈ మార్గం ఇప్పుడు వేగవంతమైనది మరియు తక్కువ రద్దీ ఉన్నది.",
    "This is currently the fastest path to your destination.": "మీ గమ్యస్థానానికి ఇది ప్రస్తుతం వేగవంతమైన మార్గం.",
    "Bypasses heavy crowds for a smoother journey.": "మృదువైన ప్రయాణానికి భారీ రద్దీని నివారిస్తుంది.",
    "This remains the most reliable path available.": "ఇది అందుబాటులో ఉన్న అత్యంత నమ్మకమైన మార్గం.",
    "Based on your current location": "మీ ప్రస్తుత స్థానం ఆధారంగా",
    "Take": "వెళ్లండి",
    "saves": "ఆదా చేస్తుంది",
    "min": "నిమిషాలు",
    "Starting guidance. Checking path...": "మార్గదర్శకం ప్రారంభమవుతుంది. దారిని తనిఖీ చేస్తోంది...",
    "Checking crowd levels...": "రద్దీ స్థాయిలను తనిఖీ చేస్తోంది...",
    "Crowd shifting. Finding new path...": "రద్దీ మారుతుంది. కొత్త మార్గం కోసం వెతుకుతోంది...",
    "Best path confirmed.": "ఉత్తమ మార్గం నిర్ధారించబడింది.",
    "Crowd increasing nearby — stay on route.": "దగ్గరలో రద్దీ పెరుగుతోంది — దారిలోనే ఉండండి.",
    "System Alert": "సిస్టమ్ అలర్ట్",
    "Recommendation": "సిఫార్సు",
    "Live Update": "లైవ్ అప్‌డేట్",
    "Emergency cleared. Resuming guidance.": "అత్యవసర పరిస్థితి తొలగించబడింది. మార్గదర్శకత్వం తిరిగి ప్రారంభమవుతుంది.",
    "Using your location": "మీ స్థానాన్ని ఉపయోగిస్తోంది",
    "to guide you better": "మరింత మెరుగ్గా మార్గనిర్దేశం చేయడానికి",
    "Selected": "ఎంచుకోబడింది",
    "from map": "మ్యాప్ నుండి",
    "Scenario updated. Recalculating best route...": "సన్నివేశం నవీకరించబడింది. ఉత్తమ మార్గాన్ని మళ్లీ లెక్కిస్తోంది...",
    "Gate 4": "గేట్ 4",
    "System": "సిస్టమ్"
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function refreshUIText() {
    const navToEl = document.getElementById('label-navigating');
    if (navToEl) navToEl.innerHTML = `📍 ${t("Navigating to")}:`;
    
    const crowdModeEl = document.getElementById('label-crowd-mode');
    if (crowdModeEl) crowdModeEl.innerHTML = `📡 ${t("Crowd Mode")}:`;
    
    const selectLocEl = document.getElementById('label-select-location');
    if (selectLocEl) selectLocEl.innerText = t("Select your location");
    
    const recActionEl = document.getElementById('label-recommended-action');
    if (recActionEl) recActionEl.innerText = t("Recommended Action");
}


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
const currentDestEl = document.getElementById('current-destination');
const currentDestTitle = currentDestEl ? currentDestEl.querySelector('span') : null;
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
    refreshUIText();
    // Force initial state: only landing visible
    switchScreen('landing', true);

    bindEvents();
    drawMapNodes(); // Draw all nodes initially
}

function bindEvents() {
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('change', (e) => {
            currentLang = e.target.value;
            refreshUIText();

            // Auto-refresh dashboard and chat for language consistency
            if (currentIntent) {
                chatFeed.innerHTML = '';
                processIntent(currentIntent, true);
            }
        });
    }

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
            if (!intent) return;
            if (intent === 'emergency') {
                triggerEmergency();
            } else {
                startAssistantFlow(intent);
            }
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentIntent = null;
            switchScreen('intent');
        });
    }

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
            currentSimInterval = null;

            if (currentIntent) {
                currentSimInterval = setInterval(simulateEvents, 22000);
            }

            // Update context header
            if (contextScenarioEl) {
                contextScenarioEl.innerText = t(scenarios[currentScenario].name);
            }

            if (currentIntent) {
                // Rerun decision engine with new scenario
                addChatMessage(t('Assistant'), t('Scenario updated. Recalculating best route...'), 'insight');
                processIntent(currentIntent, true);
            }
        });
    });

    emergencyBtn.addEventListener('click', triggerEmergency);
    dismissEmergencyBtn.addEventListener('click', () => {
        emergencyModal.classList.add('hidden');
        if (currentIntent && currentIntent !== 'emergency') {
            addChatMessage(t('System'), t('Emergency cleared. Resuming guidance.'), 'success');
            clearInterval(currentSimInterval);
            currentSimInterval = null;
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
            const inputValue = e.target.value.trim();
            if (inputValue && allowedLocations.includes(inputValue)) {
                currentLocation = inputValue;
                addChatMessage(t('Assistant'), `📍 ${t('Using your location')} (${inputValue}) ${t('to guide you better')}`, 'insight');
                // Recalculate route with updated location context
                if (currentIntent) {
                    processIntent(currentIntent, true);
                }
            } else {
                currentLocation = null;
                // Silent ignore/reset
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
                addChatMessage(t('Assistant'), `📍 ${t('Selected')} ${t(loc)} ${t('from map')}`, 'success');

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

    // Clear all pending timers
    clearAllTimeouts();
    if (currentSimInterval) {
        clearInterval(currentSimInterval);
        currentSimInterval = null;
    }

    // State isolation: Cleanup when leaving or entering specific screens
    if (screenType === 'dashboard') {
        clearDashboardUI();
    } else {
        // SVG cleanup is now handled by the general cleanup above for intervals
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
    const transitionTimer = setTimeout(() => {
        isTransitioning = false;
        document.body.classList.remove('is-transitioning');
    }, 500);
    activeTimeouts.push(transitionTimer);

    return true;
}

function clearDashboardUI() {
    chatFeed.innerHTML = '';
    actionHeadingEl.innerText = '--';
    recTimeEl.innerText = `-- ${t("min")}`;
    recDistEl.innerText = `-- ${t("m")}`;
    recCrowdEl.innerText = '--';
    recCrowdEl.className = 'crowd-val';
    actionHumanReasonEl.innerText = '--';
    predictiveInsightEl.innerText = '--';
    savingsHighlightEl.style.display = 'none';
    currentDestTitle.innerText = '--';
    activeRoutePath.setAttribute('d', '');
    altRoutePath.setAttribute('d', '');

    // Reset State
    bestRouteState = null;
    currentLocation = null;
    lastSimMessage = null;

    const locationInput = document.getElementById('user-location-input');
    const locationDisplay = document.getElementById('current-location-val');
    if (locationInput) locationInput.value = '';
    if (locationDisplay) locationDisplay.innerText = '--';
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
    if (currentDestTitle) currentDestTitle.innerText = t(titleStr);

    // Update context header
    if (contextIntentEl) {
        contextIntentEl.innerText = t(titleStr);
    }
    if (contextScenarioEl) {
        contextScenarioEl.innerText = t(scenarios[currentScenario].name);
    }

    processIntent(intentKey, false);

    // Start simulation loop
    clearInterval(currentSimInterval);
    currentSimInterval = null;
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
    let mainActionText = `👉 ${t('Take')} ${t(bestRoute.name)}`;
    if (timeDiff > 0) {
        mainActionText += ` <span class="benefit-highlight">— ${t("saves")} ${timeDiff} ${t("min")}</span>`;
    }

    actionHeadingEl.innerHTML = mainActionText;

    // UI Metrics (Minor data kept)
    recTimeEl.innerText = `${bestRoute.calculatedTime} ${t("min")}`;
    recDistEl.innerText = `${bestRoute.baseDist} ${t("m")}`;
    recCrowdEl.innerText = t(bestRoute.calculatedCrowdStatus);
    recCrowdEl.className = `crowd-val val-${bestRoute.calculatedCrowdStatus.toLowerCase()}`;

    let reasonText = '';

    if (altRoute) {
        let crowdDiff = altRoute.crowdRaw - bestRoute.crowdRaw;

        savingsHighlightEl.style.display = 'flex';

        if (timeDiff > 0) {
            uiTimeSavedEl.innerText = `${timeDiff}${t("m")} ${t("faster")}`;
            uiTimeSavedEl.style.color = "var(--accent-green)";
        } else if (timeDiff === 0) {
            uiTimeSavedEl.innerText = t("Standard time");
            uiTimeSavedEl.style.color = "var(--text-muted)";
        } else {
            uiTimeSavedEl.innerText = t("Detour");
            uiTimeSavedEl.style.color = "var(--accent-yellow)";
        }

        if (crowdDiff > 0.1) {
            uiCrowdDiffEl.innerText = t("Avoids major crowd");
            uiCrowdDiffEl.style.color = "var(--accent-green)";
        } else if (crowdDiff < -0.1) {
            uiCrowdDiffEl.innerText = t("More crowded");
            uiCrowdDiffEl.style.color = "var(--accent-yellow)";
        } else {
            uiCrowdDiffEl.innerText = t("Normal density");
            uiCrowdDiffEl.style.color = "var(--text-muted)";
        }

        // Simplified reasoning
        if (timeDiff > 0 && crowdDiff > 0) {
            reasonText = t("This route is faster and less crowded right now.");
        } else if (timeDiff > 0) {
            reasonText = t("This is currently the fastest path to your destination.");
        } else if (crowdDiff > 0) {
            reasonText = t("Bypasses heavy crowds for a smoother journey.");
        } else {
            reasonText = t("This remains the most reliable path available.");
        }
    } else {
        savingsHighlightEl.style.display = 'none';
        reasonText = t("Direct path to your destination.");
    }

    const userLoc = document.getElementById('user-location-input')?.value;
    if (userLoc) {
        reasonText += ` (${t("Based on your current location")}: ${userLoc})`;
    }

    actionHumanReasonEl.innerText = reasonText;
    predictiveInsightEl.innerText = bestRoute.predictionText || "No active predictions.";

    // Update Global Badge
    crowdStatusBadge.innerText = `${t("Crowd")}: ${t(scenarios[currentScenario].name)}`;
    let badgeClass = 'normal';
    if (currentScenario === 'peak') badgeClass = 'high';
    if (currentScenario === 'normal') badgeClass = 'medium';
    crowdStatusBadge.className = `status-badge ${badgeClass}`;

    // Update Map
    renderRouteLines(bestRoute, altRoute);

    // Provide Assistant Messaging
    generateAssistantResponse(bestRoute, altRoute, isRecalculation, reasonText);

    // Add AI explanation
    getAIExplanation(bestRoute, currentScenario).then((explanation) => {
        addChatMessage("assistant", explanation, "insight");
    });
}

function generateAssistantResponse(bestRoute, altRoute, isRecalculation, reasonText) {
    if (!isRecalculation) {
        // Step 1: Initial acknowledgment
        addChatMessage(t('Assistant'), t('Starting guidance. Checking path...'), 'message');

        // Step 2: "Thinking" phase
        activeTimeouts.push(setTimeout(() => {
            addChatMessage(t('Assistant'), t('Checking crowd levels...'), 'insight');
        }, 1200));

        // Step 3: Resolution
        activeTimeouts.push(setTimeout(() => {
            addChatMessage(t('Assistant'), `${t("Fastest route found")}.`, 'success');
        }, 2500));

        // Step 4: Simple recommendation
        activeTimeouts.push(setTimeout(() => {
            addChatMessage(t('Recommendation'), `👉 ${t('Take')} ${t(bestRoute.name)}`, 'message', reasonText);
        }, 3500));

    } else {
        // Rerouting logic
        addChatMessage(t('System Alert'), t('Crowd shifting. Finding new path...'), 'alert');

        activeTimeouts.push(setTimeout(() => {
            addChatMessage(t('Recommendation'), `${t("New path found")}! 👉 ${t("Take")} ${t(bestRoute.name)}`, 'success');
        }, 1500));
    }
}

// UI Chat Manager
function addChatMessage(sender, text, msgClass, reasonText = '') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msgClass}`;

    let reasonHtml = reasonText ? `<div class="msg-reason"><strong>${t("Why")}: </strong> ${reasonText}</div>` : '';

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

    addChatMessage(t('Live Update'), t(displayMessage), evt.type, t(evt.insight));

    // Minor predictive time adjustment to render UI alive
    if (evt.type === 'alert' && bestRouteState) {
        let newTime = Math.min(
            parseInt(recTimeEl.innerText) + 2,
            bestRouteState.calculatedTime * 1.5
        );
        recTimeEl.innerText = `${Math.round(newTime)} ${t("min")}`;
    }
}

// Emergency Trigger
function triggerEmergency() {
    clearInterval(currentSimInterval);

    emergencyModal.classList.remove('hidden');

    // Get nearest exit (mock logic)
    let exitRoutes = getCalculatedRoutes('exit', 'low', currentLocation); // Ignore crowd for nearest
    let bestExit = exitRoutes.sort((a, b) => a.baseDist - b.baseDist)[0];

    const nodeId = bestExit.path[bestExit.path.length - 1];
    nearestExitName.innerText = t(mapNodes[nodeId].name);
}

async function getAIExplanation(route, scenario) {
    try {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                route: route.name,
                scenario: scenario,
                time: route.calculatedTime
            })
        });

        const data = await res.json();
        return data.text;
    } catch (err) {
        return "Best route based on crowd and time.";
    }
}

// Start app
window.addEventListener('DOMContentLoaded', init);