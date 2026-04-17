// Static Map/Graph Definition
// Coordinates are percentages relative to the map container width/height
const mapNodes = {
    start: { id: 'start', name: 'Current Location', x: 10, y: 50 },
    gate_a: { id: 'gate_a', name: 'Gate A', x: 30, y: 20 },
    gate_b: { id: 'gate_b', name: 'Gate B', x: 30, y: 80 },
    hall_1: { id: 'hall_1', name: 'Waiting Hall 1', x: 50, y: 30 },
    hall_2: { id: 'hall_2', name: 'Waiting Hall 2', x: 50, y: 70 },
    food_court: { id: 'food_court', name: 'Food Plaza', x: 60, y: 15 },
    darshan_point: { id: 'darshan_point', name: 'Garbhagriha', x: 85, y: 50 },
    exit_1: { id: 'exit_1', name: 'Exit North', x: 70, y: 10 },
    exit_2: { id: 'exit_2', name: 'Exit South', x: 70, y: 90 },
};

// Route definitions for intents
// baseTime in minutes, baseDist in meters
const intentRoutes = {
    darshan: [
        {
            id: 'route_darshan_a',
            name: 'Via Gate A',
            path: ['start', 'gate_a', 'hall_1', 'darshan_point'],
            baseTime: 20,
            baseDist: 400,
            baseCrowdLevel: 0.8 // High baseline crowd (80% full)
        },
        {
            id: 'route_darshan_b',
            name: 'Via Gate B',
            path: ['start', 'gate_b', 'hall_2', 'darshan_point'],
            baseTime: 25,
            baseDist: 800,
            baseCrowdLevel: 0.3 // Low baseline crowd
        }
    ],
    food: [
        {
            id: 'route_food_direct',
            name: 'Direct Path',
            path: ['start', 'gate_a', 'food_court'],
            baseTime: 10,
            baseDist: 300,
            baseCrowdLevel: 0.7
        },
        {
            id: 'route_food_alt',
            name: 'Scenic Alternate',
            path: ['start', 'hall_1', 'food_court'],
            baseTime: 18,
            baseDist: 700,
            baseCrowdLevel: 0.2
        }
    ],
    exit: [
        {
            id: 'route_exit_north',
            name: 'North Exit',
            path: ['start', 'gate_a', 'exit_1'],
            baseTime: 8,
            baseDist: 250,
            baseCrowdLevel: 0.6
        },
        {
            id: 'route_exit_south',
            name: 'South Exit',
            path: ['start', 'gate_b', 'exit_2'],
            baseTime: 15,
            baseDist: 600,
            baseCrowdLevel: 0.1
        }
    ]
};

// Scenarios influence the base data
const scenarios = {
    low: {
        crowdMultiplier: 0.15,
        timeMultiplier: 0.8, // Faster to walk
        name: "Low Crowd"
    },
    normal: {
        crowdMultiplier: 1.0,
        timeMultiplier: 1.0,
        name: "Normal"
    },
    peak: {
        crowdMultiplier: 2.0,
        timeMultiplier: 2.5, // Much slower to walk
        name: "Peak Crowd"
    }
};

// Map helper to calculate actual current status based on scenario
function getCalculatedRoutes(intentKey, scenarioKey) {
    const routes = intentRoutes[intentKey];
    if (!routes) return [];

    const scenario = scenarios[scenarioKey];

    return routes.map(r => {
        // Clamp crowd level between 0.1 and 1.0
        let crowdLevel = Math.min(1.0, Math.max(0.1, r.baseCrowdLevel * scenario.crowdMultiplier));

        // Time increases non-linearly when crowd is high
        let timePenalty = crowdLevel > 0.7 ? 1.5 : 1.0;
        let estTime = Math.round(r.baseTime * scenario.timeMultiplier * timePenalty);

        let crowdStr = 'Low';
        let crowdClass = 'val-low';
        if (crowdLevel > 0.7) { crowdStr = 'High'; crowdClass = 'val-high'; }
        else if (crowdLevel > 0.4) { crowdStr = 'Medium'; crowdClass = 'val-medium'; }

        // Predictive Modifiers
        let predScoreMod = 0;
        let predMsg = "";

        if (scenarioKey === 'low') {
            if (r.baseCrowdLevel > 0.5) {
                predScoreMod = 0; // Removed penalty to allow shorter route to win
                predMsg = "This route will become crowded in 15–20 minutes. Best time to move is now.";
            } else {
                predScoreMod = 0;
                predMsg = "This path is expected to remain clear.";
            }
        } else if (scenarioKey === 'normal') {
            if (r.baseCrowdLevel > 0.4) {
                predScoreMod = 10; 
                predMsg = "Heavy congestion expected very soon. If you don't move now, time delays will increase drastically.";
            } else {
                predScoreMod = -5; 
                predMsg = "Secondary routes will remain stable despite general venue crowding.";
            }
        } else if (scenarioKey === 'peak') {
            if (r.baseCrowdLevel > 0.4) {
                predScoreMod = 25; 
                predMsg = "Extreme congestion ahead. Taking the alternative path is strongly recommended.";
            } else {
                predScoreMod = -10; 
                predMsg = "Crowds are peaking. This route bypasses the worst congestion safely.";
            }
        }

        return {
            ...r,
            calculatedTime: estTime,
            calculatedCrowdStatus: crowdStr,
            calculatedCrowdClass: crowdClass,
            crowdRaw: crowdLevel,
            predictionMod: predScoreMod,
            predictionText: predMsg
        };
    });
}

// Simulated real-time events that can be popped into the feed
const simulationEvents = [
    // PEAK SCENARIO
    {
        type: 'alert',
        triggerScenario: 'peak',
        message: 'Crowd increasing ahead.',
        insight: 'Stay on this route for the fastest trip.'
    },
    {
        type: 'insight',
        triggerScenario: 'peak',
        message: 'Checking for better routes...',
        insight: 'Your current path is still the best.'
    },
    {
        type: 'alert',
        triggerScenario: 'peak',
        message: 'Crowd increasing nearby.',
        insight: 'Stay on this route — bypassing the crowd.'
    },
    {
        type: 'insight',
        triggerScenario: 'peak',
        message: 'Crowd slowing down nearby.',
        insight: 'Stick to the plan for a smoother trip.'
    },
    {
        type: 'alert',
        triggerScenario: 'peak',
        message: 'Heavy crowd at intersections.',
        insight: 'Stay on track to avoid the congestion.'
    },

    // NORMAL SCENARIO
    {
        type: 'success',
        triggerScenario: 'normal',
        message: "You're on the best path.",
        insight: 'Conditions stable. Keep going!'
    },
    {
        type: 'insight',
        triggerScenario: 'normal',
        message: 'Minor crowd increasing nearby.',
        insight: "You're still on the fastest route."
    },
    {
        type: 'success',
        triggerScenario: 'normal',
        message: 'Pace looks good.',
        insight: 'Clear path ahead. Keep going.'
    },
    {
        type: 'insight',
        triggerScenario: 'normal',
        message: 'Route looks clear for the next 10 min.',
        insight: 'Expect a smooth trip to your destination.'
    },
    {
        type: 'insight',
        triggerScenario: 'normal',
        message: 'Small crowd ahead.',
        insight: "It should clear by the time you're there."
    },
    
    // LOW SCENARIO
    {
        type: 'success',
        triggerScenario: 'low',
        message: "You're on the fastest route.",
        insight: "Clear path! You're making great time."
    },
    {
        type: 'insight',
        triggerScenario: 'low',
        message: 'Venue is quiet right now.',
        insight: 'Enjoy the clear walk at your own pace.'
    },
    {
        type: 'success',
        triggerScenario: 'low',
        message: 'Perfect conditions for travel.',
        insight: 'Very low crowd levels ahead.'
    },
    {
        type: 'insight',
        triggerScenario: 'low',
        message: 'Everything is clear.',
        insight: 'Expect a quick, easy trip.'
    },
    {
        type: 'success',
        triggerScenario: 'low',
        message: 'Efficiency is at maximum.',
        insight: "You're saving a lot of time right now."
    }
];
