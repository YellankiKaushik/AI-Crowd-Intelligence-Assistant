const fs = require('fs');

const newTranslations = {
  "Navigate Crowded Temples with": {
    hi: "भीड़-भाड़ वाले मंदिरों में नेविगेट करें",
    te: "రద్దీగా ఉండే ఆలయాల్లో నావిగేట్ చేయండి"
  },
  "Intelligence": {
    hi: "बुद्धिमत्ता के साथ",
    te: "ఇంటెలిజెన్స్ తో"
  },
  "Real-time AI guidance to bypass queues and reach your destination faster.": {
    hi: "कतारों को पार करने और तेज़ी से पहुँचने के लिए रीयल-टाइम AI मार्गदर्शन।",
    te: "క్యూలను దాటి వేగంగా గమ్యం చేరుకోవడానికి రియల్-టైమ్ AI మార్గదర్శకత్వం."
  },
  "Select destination": {
    hi: "गंतव्य चुनें",
    te: "గమ్యాన్ని ఎంచుకోండి"
  },
  "Follow smart routing": {
    hi: "स्मार्ट मार्ग का पालन करें",
    te: "స్మార్ట్ మార్గాన్ని అనుసరించండి"
  },
  "Save time": {
    hi: "समय बचाएं",
    te: "సమయం ఆదా చేయండి"
  },
  "Start Your Journey": {
    hi: "अपनी यात्रा शुरू करें",
    te: "మీ ప్రయాణాన్ని ప్రారంభించండి"
  },
  "Explore How It Works": {
    hi: "जानें कि यह कैसे काम करता है",
    te: "ఇది ఎలా పనిచేస్తుందో తెలుసుకోండి"
  },
  "AI-Powered": {
    hi: "AI-संचालित",
    te: "AI-ఆధారితం"
  },
  "Advanced neural routing optimized for high-density crowds.": {
    hi: "अधिक भीड़ के लिए अनुकूलित उन्नत न्यूरल रूटिंग।",
    te: "అధిక రద్దీకి ఆప్టిమైజ్ చేయబడిన అధునాతన న్యూరల్ రూటింగ్."
  },
  "Real-Time Guidance": {
    hi: "रीयल-टाइम मार्गदर्शन",
    te: "రియల్-టైమ్ మార్గదర్శకత్వం"
  },
  "Live sensors and data feeds processed every few seconds.": {
    hi: "हर कुछ सेकंड में प्रोसेस किए गए लाइव सेंसर और डेटा फ़ीड।",
    te: "ప్రతి కొన్ని సెకన్లకు ప్రాసెస్ చేయబడిన లైవ్ సెన్సార్లు మరియు డేటా ఫీడ్‌లు."
  },
  "Smart Routing": {
    hi: "स्मार्ट रूटिंग",
    te: "స్మార్ట్ రూటింగ్"
  },
  "Dynamic pathfinding that adapts to shifting crowd patterns.": {
    hi: "गतिशील पथ-खोज जो बदलती भीड़ के प्रति अनुकूल होती है।",
    te: "రద్దీకి అనుగుణంగా మారే డైనమిక్ మార్గ-శోధన."
  },
  "Seamlessly Simple": {
    hi: "पूरी तरह से सरल",
    te: "అతుకులు లేని సరళత్వం"
  },
  "Choose Destination": {
    hi: "गंतव्य चुनें",
    te: "గమ్యాన్ని ఎంచుకోండి"
  },
  "Tell the AI where you want to go—Darshan, Food, or Exit.": {
    hi: "AI को बताएं कि आप कहाँ जाना चाहते हैं—दर्शन, भोजन, या निकास।",
    te: "మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారో AI కి చెప్పండి—దర్శనం, ఆహారం, లేదా నిష్క్రమణ."
  },
  "Get Smart Path": {
    hi: "स्मार्ट पथ प्राप्त करें",
    te: "స్మార్ట్ మార్గాన్ని పొందండి"
  },
  "Our engine calculates the fastest route based on current density.": {
    hi: "हमारा इंजन वर्तमान घनत्व के आधार पर सबसे तेज़ मार्ग की गणना करता है।",
    te: "మా ఇంజిన్ రద్దీ ఆధారంగా వేగవంతమైన మార్గాన్ని గణిస్తుంది."
  },
  "Follow Guidance": {
    hi: "मार्गदर्शन का पालन करें",
    te: "మార్గదర్శకాన్ని అనుసరించండి"
  },
  "Live, turn-by-turn instructions keep you moving through the crowd.": {
    hi: "लाइव और स्टेप-बाय-स्टेप निर्देश आपको भीड़ में आगे बढ़ाते रहते हैं।",
    te: "లైవ్ సూచనలు మిమ్మల్ని రద్దీ ద్వారా ముందుకు కదిలిస్తాయి."
  },
  "Real-World Scenario": {
    hi: "वास्तविक दुनिया का परिदृश्य",
    te: "వాస్తవ ప్రపంచ పరిణామం"
  },
  "From Queue to Destination": {
    hi: "कतार से गंतव्य तक",
    te: "క్యూ నుండి గమ్యం వరకు"
  },
  "Ready for a smoother journey?": {
    hi: "एक सहज यात्रा के लिए तैयार हैं?",
    te: "మృదువైన ప్రయాణానికి సిద్ధంగా ఉన్నారా?"
  },
  "Join thousands of users navigating smarter today.": {
    hi: "आज ही स्मार्ट नेविगेट करने वाले हज़ारों उपयोगकर्ताओं से जुड़ें।",
    te: "ఈరోజు స్మార్ట్ గా నావిగేట్ చేస్తున్న వేలాది మందితో చేరండి."
  },
  "Launch Assistant": {
    hi: "असिस्टेंट लॉन्च करें",
    te: "అసిస్టెంట్‌ను ప్రారంభించండి"
  },
  "Back": {
    hi: "पीछे",
    te: "వెనుకకు"
  },
  "Select Temple": {
    hi: "मंदिर चुनें",
    te: "ఆలయాన్ని ఎంచుకోండి"
  },
  "Choose a temple to begin your journey": {
    hi: "अपनी यात्रा शुरू करने के लिए एक मंदिर चुनें",
    te: "మీ ప్రయాణం ప్రారంభించడానికి ఆలయాన్ని ఎంచుకోండి"
  },
  "Tirupati": {
    hi: "तिरुपति",
    te: "తిరుపతి"
  },
  "Coming Soon": {
    hi: "जल्द आ रहा है",
    te: "త్వరలో వస్తుంది"
  },
  "Crowd Intelligence": {
    hi: "क्रॉड इंटेलिजेंस",
    te: "క్రౌడ్ ఇంటెలిజెన్స్"
  },
  "Assistant": {
    hi: "असिस्टेंट",
    te: "అసిస్టెంట్"
  },
  "Where are you heading today?": {
    hi: "आज आप कहाँ जा रहे हैं?",
    te: "మీరు ఈరోజు ఎక్కడికి వెళుతున్నారు?"
  },
  "Go for Darshan": {
    hi: "दर्शन के लिए जाएं",
    te: "దర్శనానికి వెళ్ళండి"
  },
  "Find Food": {
    hi: "भोजन खोजें",
    te: "ఆహారం కనుగొనండి"
  },
  "Find Exit": {
    hi: "निकास खोजें",
    te: "నిష్క్రమణ కనుగొనండి"
  },
  "Emergency": {
    hi: "आपातकाल",
    te: "అత్యవసర పరిస్థితి"
  },
  "Simulation:": {
    hi: "सिमुलेशन:",
    te: "సిమ్యులేషన్:"
  },
  "Low Crowd": {
    hi: "कम भीड़",
    te: "తక్కువ రద్దీ"
  },
  "Normal": {
    hi: "सामान्य",
    te: "సాధారణ"
  },
  "Peak Crowd": {
    hi: "पीक भीड़",
    te: "గరిష్ట రద్దీ"
  },
  "AI is optimizing your route based on live conditions": {
    hi: "AI लाइव स्थितियों के आधार पर आपके मार्ग को अनुकूलित कर रहा है",
    te: "లైవ్ పరిస్థితుల ఆధారంగా AI మీ మార్గాన్ని అనుకూలీకరిస్తోంది"
  },
  "Gate A": {
    hi: "गेट ए",
    te: "గేట్ ఎ"
  },
  "Gate B": {
    hi: "गेट बी",
    te: "గేట్ బి"
  },
  "Darshan": {
    hi: "दर्शन",
    te: "దర్శనం"
  },
  "Food Court": {
    hi: "फूड कोर्ट",
    te: "ఫుడ్ కోర్ట్"
  },
  "Exit": {
    hi: "निकास",
    te: "నిష్క్రమణ"
  },
  "Currently at:": {
    hi: "वर्तमान में:",
    te: "ప్రస్తుతం:"
  },
  "Or type location...": {
    hi: "या स्थान टाइप करें...",
    te: "లేదా స్థానం టైప్ చేయండి..."
  },
  "Time": {
    hi: "समय",
    te: "సమయం"
  },
  "Dist": {
    hi: "दूरी",
    te: "దూరం"
  },
  "Crowd": {
    hi: "भीड़",
    te: "రద్దీ"
  },
  "Route View:": {
    hi: "मार्ग दृश्य:",
    te: "రూట్ వీక్షణ:"
  },
  "Live Updates": {
    hi: "लाइव अपडेट",
    te: "లైవ్ అప్‌డేట్‌లు"
  },
  "Live": {
    hi: "लाइव",
    te: "లైవ్"
  },
  "EMERGENCY DETECTED": {
    hi: "आपातकाल का पता चला",
    te: "అత్యవసర పరిస్థితి గుర్తించబడింది"
  },
  "Immediate evacuation required.": {
    hi: "तत्काल निकासी की आवश्यकता है।",
    te: "తక్షణ తరలింపు అవసరం."
  },
  "Nearest Exit:": {
    hi: "निकटतम निकास:",
    te: "సమీప నిష్క్రమణ:"
  },
  "Follow the red flashing path immediately.": {
    hi: "तुरंत लाल चमकते रास्ते का पालन करें।",
    te: "వెంటనే మెరుస్తున్న ఎర్ర మార్గాన్ని అనుసరించండి."
  },
  "Dismiss (Simulation)": {
    hi: "खारिज करें (सिमुलेशन)",
    te: "డిస్మిస్ చేయండి (సిమ్యులేషన్)"
  },
  "faster": {
    hi: "तेज़",
    te: "వేగంగా"
  },
  "m": {
    hi: "मी",
    te: "ని"
  },
  "Standard time": {
    hi: "मानक समय",
    te: "ప్రామాణిక సమయం"
  },
  "Detour": {
    hi: "चक्कर",
    te: "చుట్టుమార్గం"
  },
  "Avoids major crowd": {
    hi: "भारी भीड़ से बचाता है",
    te: "పెద్ద రద్దీని నివారిస్తుంది"
  },
  "More crowded": {
    hi: "अधिक भीड़",
    te: "మరింత రద్దీ"
  },
  "Normal density": {
    hi: "सामान्य घनत्व",
    te: "సాధారణ సాంద్రత"
  },
  "This route is faster and less crowded right now.": {
    hi: "यह मार्ग अभी तेज़ और कम भीड़ वाला है।",
    te: "ఈ మార్గం ఇప్పుడు వేగవంతమైనది మరియు తక్కువ రద్దీ ఉన్నది."
  },
  "This is currently the fastest path to your destination.": {
    hi: "यह वर्तमान में आपके गंतव्य के लिए सबसे तेज़ मार्ग है।",
    te: "మీ గమ్యస్థానానికి ఇది ప్రస్తుతం వేగవంతమైన మార్గం."
  },
  "Bypasses heavy crowds for a smoother journey.": {
    hi: "एक सहज यात्रा के लिए भारी भीड़ से बचाता है।",
    te: "మృదువైన ప్రయాణానికి భారీ రద్దీని నివారిస్తుంది."
  },
  "This remains the most reliable path available.": {
    hi: "यह उपलब्ध सबसे विश्वसनीय मार्ग बना हुआ है।",
    te: "ఇది అందుబాటులో ఉన్న అత్యంత నమ్మకమైన మార్గం."
  },
  "Based on your current location": {
    hi: "आपके वर्तमान स्थान के आधार पर",
    te: "మీ ప్రస్తుత స్థానం ఆధారంగా"
  },
  "Take": {
    hi: "लें",
    te: "వెళ్లండి"
  },
  "saves": {
    hi: "बचाता है",
    te: "ఆదా చేస్తుంది"
  },
  "min": {
    hi: "मिनट",
    te: "నిమిషాలు"
  },
  "Starting guidance. Checking path...": {
    hi: "मार्गदर्शन शुरू हो रहा है. रास्ता चेक कर रहे हैं...",
    te: "మార్గదర్శకం ప్రారంభమవుతుంది. దారిని తనిఖీ చేస్తోంది..."
  },
  "Checking crowd levels...": {
    hi: "भीड़ के स्तर की जाँच हो रही है...",
    te: "రద్దీ స్థాయిలను తనిఖీ చేస్తోంది..."
  },
  "Crowd shifting. Finding new path...": {
    hi: "भीड़ बदल रही है। नया रास्ता खोजा जा रहा है...",
    te: "రద్దీ మారుతుంది. కొత్త మార్గం కోసం వెతుకుతోంది..."
  },
  "Best path confirmed.": {
    hi: "सर्वश्रेष्ठ पथ की पुष्टि की गई।",
    te: "ఉత్తమ మార్గం నిర్ధారించబడింది."
  },
  "Crowd increasing nearby — stay on route.": {
    hi: "पास में भीड़ बढ़ रही है - रास्ते पर रहें।",
    te: "దగ్గరలో రద్దీ పెరుగుతోంది — దారిలోనే ఉండండి."
  },
  "System Alert": {
    hi: "सिस्टम अलर्ट",
    te: "సిస్టమ్ అలర్ట్"
  },
  "Recommendation": {
    hi: "सिफारिश",
    te: "సిఫార్సు"
  },
  "Assistant": {
    hi: "असिस्टेंट",
    te: "అసిస్టెంట్"
  },
  "Live Update": {
    hi: "लाइव अपडेट",
    te: "లైవ్ అప్‌డేట్"
  },
  "Emergency cleared. Resuming guidance.": {
    hi: "आपातकाल हटा दिया गया। मार्गदर्शन फिर से शुरू हो रहा है।",
    te: "అత్యవసర పరిస్థితి తొలగించబడింది. మార్గదర్శకత్వం తిరిగి ప్రారంభమవుతుంది."
  },
  "Using your location": {
    hi: "आपकी लोकेशन का उपयोग कर रहे हैं",
    te: "మీ స్థానాన్ని ఉపయోగిస్తోంది"
  },
  "to guide you better": {
    hi: "आपको बेहतर मार्गदर्शन के लिए",
    te: "మరింత మెరుగ్గా మార్గనిర్దేశం చేయడానికి"
  },
  "Selected": {
    hi: "चयनित",
    te: "ఎంచుకోబడింది"
  },
  "from map": {
    hi: "नक्शे से",
    te: "మ్యాప్ నుండి"
  },
  "Scenario updated. Recalculating best route...": {
    hi: "परिदृश्य अद्यतन किया गया। सर्वश्रेष्ठ मार्ग की पुनर्गणना हो रही है...",
    te: "సన్నివేశం నవీకరించబడింది. ఉత్తమ మార్గాన్ని మళ్లీ లెక్కిస్తోంది..."
  },
  "Gate 4": {
    hi: "गेट 4",
    te: "గేట్ 4"
  },
  "System": {
    hi: "सिस्टम",
    te: "సిస్టమ్"
  }
};

let appjs = fs.readFileSync('app.js', 'utf8');

const tStart = appjs.indexOf('const translations = {');
// Find end of translations block
const tEnd = appjs.indexOf('};', tStart) + 2;

const codeBefore = appjs.substring(0, tStart);
const codeAfter = appjs.substring(tEnd);

// evaluate translations to get object
const evalStr = appjs.substring(tStart, tEnd).replace('const translations = ', 'return ');
const currentTrans = new Function(evalStr)();

// Merge it
Object.entries(newTranslations).forEach(([k, v]) => {
    currentTrans.en[k] = k;
    currentTrans.hi[k] = v.hi;
    currentTrans.te[k] = v.te;
});

const newTransStr = 'const translations = ' + JSON.stringify(currentTrans, null, 2) + ';';

fs.writeFileSync('app.js', codeBefore + newTransStr + codeAfter);
