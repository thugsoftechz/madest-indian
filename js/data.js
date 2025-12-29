// INDIA 2000: LOVE & DEATH CONNECTIONS
// NARRATIVE DATA STRUCTURE

const GAME_CONFIG = {
    gravity: 50.0, // Arcade heavy
    playerSpeed: 25.0, // Fast
    sprintMultiplier: 2.5,
    jumpForce: 22.0,
    friction: 10.0,
    adrenalineDecay: 10.0, // Loss per second
    adrenalineKillGain: 30.0, // Gain on checkpoint/kill
};

const PROTAGONIST = {
    name: "Ghost",
    age: 21,
    year: 2000,
    motive: "Mapping the intersection of Love and Death.",
    monologue: [
        { en: "Year 2000. Everything is changing.", hi: "Saal 2000. Sab kuch badal raha hai." },
        { en: "I am Ghost. I have nothing but time.", hi: "Main Ghost hoon. Mere paas waqt ke siwa kuch nahi." },
        { en: "She told me death is just a city.", hi: "Usne kaha tha maut bas ek sheher hai." },
    ]
};

const ARCHETYPES = {
    "METRO": {
        vibe: "Neon, Speed, Y2K Panic.",
        fogColor: 0x1a051a,
        fogDensity: 0.02,
        skyColor: 0x050005,
        trafficDensity: 2.0,
        buildingHeight: [40, 120],
        roadWidth: 18,
        lightColor: 0xff00ff
    },
    "HISTORIC": {
        vibe: "Stone, Dust, Ancient Echoes.",
        fogColor: 0x221a10,
        fogDensity: 0.03,
        skyColor: 0x100a05,
        trafficDensity: 0.8,
        buildingHeight: [10, 25],
        roadWidth: 12,
        lightColor: 0xffaa00
    },
    "COASTAL": {
        vibe: "Salt, Monsoon, Infinite Horizon.",
        fogColor: 0x0a1a22,
        fogDensity: 0.035,
        skyColor: 0x00050a,
        trafficDensity: 0.5,
        buildingHeight: [5, 20],
        roadWidth: 14,
        lightColor: 0x00ffff
    },
    "INDUSTRIAL": {
        vibe: "Steel, Smoke, The Future.",
        fogColor: 0x111111,
        fogDensity: 0.05,
        skyColor: 0x000000,
        trafficDensity: 1.2,
        buildingHeight: [15, 40],
        roadWidth: 15,
        lightColor: 0xffffff
    }
};

const CITY_DB = [
    { name: "Mumbai", type: "METRO", memory: { en: "We met on the local train. She smelled like rain.", hi: "Hum local train mein mile the. Uski khushboo baarish jaisi thi." } },
    { name: "Varanasi", type: "HISTORIC", memory: { en: "Death burns openly here. I saw a body float by.", hi: "Yahan maut khuleaam jalti hai. Maine ek laash ko behte dekha." } },
    { name: "Goa", type: "COASTAL", memory: { en: "The party never ended. We danced until we bled.", hi: "Party kabhi khatam nahi hui. Hum khoon behne tak naache." } },
    { name: "Jamshedpur", type: "INDUSTRIAL", memory: { en: "Steel city. The smoke hides everything.", hi: "Steel city. Dhuaan sab kuch chupa leta hai." } },
    { name: "Delhi", type: "METRO", memory: { en: "The winter fog blinds you. Just like love.", hi: "Sardiyon ki dhund andha kar deti hai. Pyar ki tarah." } },
    { name: "Kolkata", type: "HISTORIC", memory: { en: "Trams and revolutions. She wanted to change the world.", hi: "Tram aur inqilab. Woh duniya badalna chahti thi." } },
    { name: "Chennai", type: "COASTAL", memory: { en: "The humidity clings to you. A fever dream.", hi: "Nami chipak jaati hai. Ek bukhaar ke sapne jaisi." } },
    { name: "Bangalore", type: "METRO", memory: { en: "Cyber cafes and code. The future was here.", hi: "Cyber cafes aur code. Bhavishya yahan tha." } },
    { name: "Pune", type: "METRO", memory: { en: "Speed. We raced bikes on the highway.", hi: "Raftaar. Humne highway par bike daudayi thi." } },
    { name: "Jaipur", type: "HISTORIC", memory: { en: "Pink walls, red blood. A crash near the palace.", hi: "Gulaabi deewarein, laal khoon. Mahal ke paas ek haadsa." } },
    { name: "Hyderabad", type: "METRO", memory: { en: "Biryani and betrayal. Secrets stay buried.", hi: "Biryani aur dhokha. Raaz dafan rehte hain." } },
    { name: "Shimla", type: "HISTORIC", memory: { en: "Cold. So cold. Her hand slipped from mine.", hi: "Thand. Bohot thand. Uska haath mere haath se phisal gaya." } },
    { name: "Kochi", type: "COASTAL", memory: { en: "Backwaters. Time stops here. Death waits.", hi: "Backwaters. Waqt ruk jaata hai. Maut intezaar karti hai." } },
    { name: "Ahmedabad", type: "INDUSTRIAL", memory: { en: "Dust and money. Everything has a price.", hi: "Dhool aur paisa. Har cheez ki keemat hoti hai." } },
    { name: "Lucknow", type: "HISTORIC", memory: { en: "Politeness masking cruelty. The year 2000 changed us.", hi: "Tehzeeb ke peeche krurta. Saal 2000 ne humein badal diya." } }
];

// Fate Logic
class NarrativeEngine {
    constructor() {
        this.cities = {};
        this.generateWorld();
    }

    generateWorld() {
        // Expand database procedurally to 400+ virtual nodes
        CITY_DB.forEach(c => {
            this.cities[c.name] = {
                ...c,
                config: ARCHETYPES[c.type],
                connections: this.getConnections(c.name)
            };
        });

        // Procedural fill
        const prefixes = ["New", "Old", "South", "North", "Cyber", "Lost", "Neon", "Dust", "Steel", "Dark"];
        const bases = ["City", "Town", "Nagar", "Pur", "Bad", "Ghat", "Vihar", "Kunj", "Lok", "Colony"];

        for(let i=0; i<300; i++) {
            const name = `${prefixes[Math.floor(Math.random()*prefixes.length)]} ${bases[Math.floor(Math.random()*bases.length)]} ${i}`;
            const type = Object.keys(ARCHETYPES)[Math.floor(Math.random()*4)];
            this.cities[name] = {
                name: name,
                type: type,
                config: ARCHETYPES[type],
                memory: { en: "A place I haven't been. Yet.", hi: "Ek jagah jahan main abhi tak nahi gaya." },
                connections: [] // Dynamic
            };
        }
    }

    getConnections(name) {
        return CITY_DB.map(c => c.name).filter(n => n !== name).sort(() => 0.5 - Math.random()).slice(0, 2);
    }

    getCity(name) {
        return this.cities[name] || this.cities["Mumbai"];
    }
}

window.NARRATIVE = new NarrativeEngine();
window.GAME_CONFIG = GAME_CONFIG;
window.PROTAGONIST = PROTAGONIST;
