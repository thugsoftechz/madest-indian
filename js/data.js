// AAA SYSTEM DATA
// Defines the emotional landscape, world regions, and narrative flow.
// No explicit "Levels". The world is a state machine.

const WORLD_DATA = {
    config: {
        gravity: 30.0,
        playerSpeed: 15.0,
        sprintMultiplier: 1.8,
        jumpForce: 15.0,
        dayCycleDuration: 300, // Seconds for full day/night
    },
    regions: {
        "slums": {
            id: "slums",
            name: "The Undercity",
            vibe: "Suffocating, dense, desperate.",
            fogColor: 0x1a1a1a,
            fogDensity: 0.04,
            skyColor: 0x050505,
            trafficDensity: 0.3, // Low but chaotic
            buildingHeightRange: [5, 15],
            roadWidth: 8,
            lightColor: 0xffaa00 // Sodium vapor orange
        },
        "highway": {
            id: "highway",
            name: "The Arterial",
            vibe: "Fast, lethal, indifferent.",
            fogColor: 0x222233,
            fogDensity: 0.02,
            skyColor: 0x111122,
            trafficDensity: 1.0, // Maximum danger
            buildingHeightRange: [2, 5], // Low barriers
            roadWidth: 20,
            lightColor: 0xaaccff // LED White
        },
        "highrises": {
            id: "highrises",
            name: "The Spire District",
            vibe: "Cold, wealthy, distant.",
            fogColor: 0x333333,
            fogDensity: 0.03,
            skyColor: 0x222222,
            trafficDensity: 0.5,
            buildingHeightRange: [20, 60], // Skyscrapers
            roadWidth: 12,
            lightColor: 0xff00ff // Neon Cyber
        }
    },
    narrative: {
        initialState: "start",
        states: {
            "start": {
                region: "slums",
                objective: "Find Anaya.",
                dialogue: [
                    { speaker: "Self", text: "Rain washes away the blood. Not the memory." },
                    { speaker: "Self", text: "She is waiting near the old bridge." }
                ],
                nextState: "meet_anaya"
            },
            "meet_anaya": {
                region: "slums",
                npc: "Anaya",
                objective: "Talk to Anaya.",
                dialogue: [
                    { speaker: "Anaya", text: "You're late. Inspector Rao is two blocks away." },
                    { speaker: "Player", text: "I had to lose a tail. Is the car ready?" },
                    { speaker: "Anaya", text: "No. Aarav didn't show. We have to walk." },
                    { speaker: "Anaya", text: "Crossing the highway is suicide tonight." }
                ],
                nextState: "cross_highway"
            },
            "cross_highway": {
                region: "highway",
                objective: "Survive the traffic. Reach the other side.",
                dialogue: [
                    { speaker: "Inspector Rao", text: "(Radio) All units, seal the perimeter. No witnesses." }
                ],
                nextState: "climb_spire"
            },
            "climb_spire": {
                region: "highrises",
                objective: "Climb to the rooftop extraction.",
                dialogue: [
                    { speaker: "Anaya", text: "Don't look down. Just breathe." },
                    { speaker: "Self", text: "Almost there." }
                ],
                nextState: "ending"
            },
            "ending": {
                region: "highrises",
                objective: "Make the choice.",
                dialogue: [
                    { speaker: "Aarav", text: "The chopper's gone, man. It's just us." },
                    { speaker: "Inspector Rao", text: "End of the line, kids." }
                ]
            }
        }
    }
};

window.WORLD_DATA = WORLD_DATA;
