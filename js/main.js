// INDIA 2000: MADJACK ERA - CORE ENGINE
// CINEMATIC SYSTEM | WORLD STREAMING | AGGRESSIVE AI | ARCADE PHYSICS

class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Systems
        this.player = null;
        this.world = null;
        this.traffic = null;
        this.cinematic = null;

        // State
        this.currentCityName = "Mumbai";
        this.currentCityData = NARRATIVE.getCity("Mumbai");
        this.isTransitioning = false;
        this.adrenaline = 100.0;

        this.init();
    }

    init() {
        this.setupThreeJS();
        this.setupSystems();
        this.setupEventListeners();

        // Intro Cinematic
        this.cinematic.playIntro(this.currentCityData, PROTAGONIST);

        this.animate();
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 3000); // High FOV for Speed
        this.camera.rotation.order = 'YXZ';

        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0)); // Low pixel ratio for retro feel
        document.body.appendChild(this.renderer.domElement);
    }

    setupSystems() {
        this.cinematic = new CinematicSystem(this.camera);
        this.world = new World(this.scene, this.currentCityData.config);
        this.player = new Player(this.camera, this.scene);
        this.traffic = new TrafficSystem(this.scene, this.currentCityData.config, this.world.roads);

        // Apply initial environment
        this.updateEnvironment(this.currentCityData.config);
    }

    updateEnvironment(config) {
        this.scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);
        this.scene.background = new THREE.Color(config.skyColor);

        // Lighting Update
        this.scene.children.forEach(c => {
            if(c.isLight) this.scene.remove(c);
        });

        const ambient = new THREE.AmbientLight(config.lightColor, 0.2);
        this.scene.add(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 0.6);
        directional.position.set(50, 100, 50);
        this.scene.add(directional);

        // Add "Street Lights" implied by fog color
        const hemi = new THREE.HemisphereLight(config.lightColor, 0x000000, 0.5);
        this.scene.add(hemi);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('click', () => {
            if(!this.cinematic.isPlaying) document.body.requestPointerLock();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = Math.min(this.clock.getDelta(), 0.1);
        const time = this.clock.getElapsedTime();

        if (this.cinematic.isPlaying) {
            this.cinematic.update(delta, time);
        } else {
            this.player.update(delta, this.world.collidables);
            this.traffic.update(delta, this.player.position);
            this.updateAdrenaline(delta);

            // Check for City Transition (Distance from center)
            const dist = Math.sqrt(this.player.position.x**2 + this.player.position.z**2);
            if(dist > 500 && !this.isTransitioning) {
                this.triggerCityTransition();
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    updateAdrenaline(delta) {
        // Decrease if moving slow
        const speed = this.player.velocity.length();
        if (speed < 5) {
            this.adrenaline -= GAME_CONFIG.adrenalineDecay * delta;
        } else {
            this.adrenaline += delta * 2; // Recovery
        }
        this.adrenaline = Math.max(0, Math.min(100, this.adrenaline));

        // UI Update (Virtual)
        const ui = document.getElementById('crosshair');
        if (ui) {
            ui.style.color = this.adrenaline < 20 ? 'red' : '#00ff00';
            ui.innerText = `ADRENALINE: ${Math.floor(this.adrenaline)}%`;
        }
    }

    triggerCityTransition() {
        this.isTransitioning = true;

        // Pick next city (Success route for now, simple distance check)
        const nextCityName = this.currentCityData.connections[0];
        const nextCityData = NARRATIVE.getCity(nextCityName);

        // Play Transition Cinematic
        this.cinematic.playTransition(this.currentCityData, nextCityData, () => {
            // Callback when screen is dark/glitched to swap world
            this.currentCityName = nextCityName;
            this.currentCityData = nextCityData;

            this.updateEnvironment(nextCityData.config);
            this.world.regenerate(nextCityData.config);
            this.traffic.regenerate(nextCityData.config, this.world.roads);
            this.player.resetPosition();
            this.isTransitioning = false;
            this.adrenaline = 100;
        });
    }
}

// --- CINEMATIC DIRECTOR ---

class CinematicSystem {
    constructor(camera) {
        this.camera = camera;
        this.isPlaying = false;
        this.timer = 0;
        this.stage = 0;

        this.overlay = document.createElement('div');
        this.overlay.id = 'cinematic-overlay';
        this.overlay.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; display: none;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
        `;
        document.body.appendChild(this.overlay);

        this.title = document.createElement('h1');
        this.title.style.cssText = `
            font-size: 100px; color: white; text-transform: uppercase;
            text-shadow: 5px 5px 0px #ff0055; letter-spacing: 5px;
            opacity: 0; transition: opacity 0.5s;
            font-family: 'Impact', sans-serif; mix-blend-mode: hard-light;
        `;
        this.overlay.appendChild(this.title);

        this.subtitle = document.createElement('h2');
        this.subtitle.style.cssText = `
            font-size: 24px; color: #00ff00; margin-top: 20px;
            background: black; padding: 5px;
            text-shadow: 0 0 5px #00ff00; opacity: 0; transition: opacity 1s;
        `;
        this.overlay.appendChild(this.subtitle);
    }

    playIntro(cityData, protagonist) {
        this.isPlaying = true;
        this.timer = 0;
        this.stage = 0;
        this.overlay.style.display = 'flex';
        this.title.innerText = cityData.name;
        // Display English and Hindi
        this.subtitle.innerHTML = `"${cityData.memory.en}"<br><span style="color: #ff0055; font-size: 20px;">"${cityData.memory.hi}"</span>`;

        // Camera start pos (Cinematic Angle)
        this.camera.position.set(0, 40, 40);
        this.camera.lookAt(0, 0, 0);
    }

    playTransition(oldCity, newCity, swapCallback) {
        this.isPlaying = true;
        this.timer = 0;
        this.stage = 10;
        this.overlay.style.display = 'flex';
        this.title.innerText = newCity.name;
        this.subtitle.innerHTML = `"${newCity.memory.en}"<br><span style="color: #ff0055; font-size: 20px;">"${newCity.memory.hi}"</span>`;
        this.swapCallback = swapCallback;
    }

    update(delta, time) {
        this.timer += delta;

        // Noise Shake
        const shake = Math.sin(time * 50) * 0.1;
        this.camera.rotation.z = shake;

        // --- INTRO SEQUENCE ---
        if (this.stage === 0) {
            this.title.style.opacity = 1;
            this.subtitle.style.opacity = 1;

            // Fast Pan
            this.camera.position.y -= delta * 20;
            this.camera.position.z -= delta * 20;
            this.camera.lookAt(0, 0, 0);

            if (this.timer > 3) {
                this.stage = 1;
                this.title.style.opacity = 0;
                this.subtitle.style.opacity = 0;
            }
        } else if (this.stage === 1) {
            const targetY = 2;
            this.camera.position.y += (targetY - this.camera.position.y) * delta * 5;

            if (this.timer > 4) {
                this.isPlaying = false;
                this.overlay.style.display = 'none';
                this.camera.rotation.set(0, 0, 0);
                document.body.requestPointerLock();
            }
        }

        // --- TRANSITION SEQUENCE ---
        else if (this.stage === 10) {
            this.overlay.style.backgroundColor = `rgba(0,0,0,${Math.min(1, this.timer * 2)})`;

            if (this.timer > 1.5) {
                this.swapCallback();
                this.stage = 11;
                this.title.style.opacity = 1;
                this.subtitle.style.opacity = 1;
            }
        } else if (this.stage === 11) {
            this.overlay.style.backgroundColor = `rgba(0,0,0,${Math.max(0, 3 - this.timer)})`;

             if (this.timer > 4) {
                 this.title.style.opacity = 0;
                 this.subtitle.style.opacity = 0;
                 this.stage = 12;
             }
        } else if (this.stage === 12) {
             if (this.timer > 5) {
                 this.isPlaying = false;
                 this.overlay.style.display = 'none';
             }
        }
    }
}

// --- PLAYER (MULLET MADJACK PHYSICS) ---

class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.position = camera.position;
        this.velocity = new THREE.Vector3();
        this.canJump = false;
        this.keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
        this.capsuleHeight = 2.0;

        this.resetPosition();
        this.bindInput();
    }

    resetPosition() {
        this.position.set(0, 10, 0);
        this.velocity.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
    }

    bindInput() {
        document.addEventListener('keydown', (e) => this.onKey(e, true));
        document.addEventListener('keyup', (e) => this.onKey(e, false));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onKey(e, pressed) {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) this.keys[key] = pressed;
        if (e.code === 'Space') this.keys.space = pressed;
        if (e.key === 'Shift') this.keys.shift = pressed;
    }

    onMouseMove(e) {
        if (document.pointerLockElement !== document.body) return;
        this.camera.rotation.y -= e.movementX * 0.002;
        this.camera.rotation.x -= e.movementY * 0.002;
        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
    }

    update(delta, collidables) {
        const config = GAME_CONFIG;

        // Physics - Heavy Gravity, High Speed
        this.velocity.x -= this.velocity.x * config.friction * delta;
        this.velocity.z -= this.velocity.z * config.friction * delta;
        this.velocity.y -= config.gravity * delta;

        // Input - World Space
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        forward.y = 0; forward.normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        right.y = 0; right.normalize();

        const moveZ = Number(this.keys.w) - Number(this.keys.s);
        const moveX = Number(this.keys.d) - Number(this.keys.a);
        const speed = this.keys.shift ? config.playerSpeed * config.sprintMultiplier : config.playerSpeed;

        if (moveZ !== 0 || moveX !== 0) {
            this.velocity.x += (forward.x * moveZ + right.x * moveX) * speed * config.friction * delta;
            this.velocity.z += (forward.z * moveZ + right.z * moveX) * speed * config.friction * delta;
        }

        this.position.x += this.velocity.x * delta;
        this.position.z += this.velocity.z * delta;
        this.position.y += this.velocity.y * delta;

        // Ground Collision
        if (this.position.y < this.capsuleHeight) {
            this.position.y = this.capsuleHeight;
            this.velocity.y = 0;
            this.canJump = true;
        }

        // Check Wall Runs (Simple check)
        // If falling near wall and pressing input, slow fall
        // (Simplified for this version to keep collision logic minimal)

        // Jump
        if (this.keys.space && this.canJump) {
            this.velocity.y = config.jumpForce;
            this.canJump = false;
        }
    }
}

// --- WORLD GENERATOR ---

class World {
    constructor(scene, config) {
        this.scene = scene;
        this.collidables = [];
        this.roads = [];
        this.regenerate(config);
    }

    regenerate(config) {
        this.collidables.forEach(c => this.scene.remove(c));
        this.collidables = [];
        this.roads = [];

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8 })
        );
        floor.rotation.x = -Math.PI/2;
        this.scene.add(floor);
        this.collidables.push(floor);

        const buildingMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }); // Shiny/Wet look
        const roadMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const gridSize = 400;
        const cellSize = 40;

        for(let x = -gridSize; x <= gridSize; x += cellSize) {
            for(let z = -gridSize; z <= gridSize; z += cellSize) {
                const isRoadX = Math.abs(x) % (cellSize * 2) === 0;
                const isRoadZ = Math.abs(z) % (cellSize * 3) === 0;

                if (isRoadX || isRoadZ) {
                    const road = new THREE.Mesh(new THREE.PlaneGeometry(cellSize, cellSize), roadMat);
                    road.rotation.x = -Math.PI/2;
                    road.position.set(x, 0.1, z);
                    this.scene.add(road);

                    if(isRoadX) this.roads.push({x, z, axis: 'z', width: config.roadWidth});
                    if(isRoadZ) this.roads.push({x, z, axis: 'x', width: config.roadWidth});
                } else {
                    if (Math.random() > 0.2) {
                        const hRange = config.buildingHeight;
                        const height = Math.random() * (hRange[1] - hRange[0]) + hRange[0];

                        const mesh = new THREE.Mesh(new THREE.BoxGeometry(cellSize - 5, height, cellSize - 5), buildingMat);
                        mesh.position.set(x, height/2, z);
                        this.scene.add(mesh);
                        this.collidables.push(mesh);

                        // Add Neon Signage (Random)
                        if (Math.random() > 0.8) {
                            const neon = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshBasicMaterial({ color: config.lightColor, side: THREE.DoubleSide }));
                            neon.position.set(x + cellSize/2 + 0.1, height/2, z);
                            neon.rotation.y = Math.PI/2;
                            this.scene.add(neon);
                        }
                    }
                }
            }
        }
    }
}

// --- TRAFFIC (AGGRESSIVE) ---

class TrafficSystem {
    constructor(scene, config, roads) {
        this.scene = scene;
        this.cars = [];
        this.regenerate(config, roads);
    }

    regenerate(config, roads) {
        this.cars.forEach(c => this.scene.remove(c));
        this.cars = [];

        const carGeo = new THREE.BoxGeometry(2.5, 1.2, 5.0);
        const count = 150 * config.trafficDensity;

        for(let i=0; i<count; i++) {
            if (roads.length === 0) break;
            const road = roads[Math.floor(Math.random() * roads.length)];

            const car = new THREE.Mesh(carGeo, new THREE.MeshStandardMaterial({
                color: Math.random() > 0.5 ? 0xffffff : 0xff0000,
                emissive: 0x110000
            }));

            if (road.axis === 'z') {
                car.position.set(road.x + (Math.random()-0.5)*10, 0.6, road.z + (Math.random()-0.5)*400);
            } else {
                car.position.set(road.x + (Math.random()-0.5)*400, 0.6, road.z + (Math.random()-0.5)*10);
            }

            // Headlights
            const light = new THREE.SpotLight(0xffffff, 5, 60, 0.6, 0.5, 1);
            light.position.set(0, 0, 2.5);
            light.target.position.set(0, 0, 20);
            car.add(light);
            car.add(light.target);

            car.userData = {
                speed: 0,
                maxSpeed: 40 + Math.random() * 30, // Very Fast
                axis: road.axis,
                laneOffset: (Math.random()-0.5)*5
            };

            this.scene.add(car);
            this.cars.push(car);
        }
    }

    update(delta, playerPos) {
        this.cars.forEach(car => {
            const dist = car.position.distanceTo(playerPos);
            let speed = car.userData.maxSpeed;

            // AGGRESSION: If seeing player, steer towards?
            // For now, let's just make them super fast and ignore brakes close up

            if (car.userData.axis === 'z') {
                car.position.z += speed * delta;
                if (car.position.z > 500) car.position.z = -500;
            } else {
                car.position.x += speed * delta;
                if (car.position.x > 500) car.position.x = -500;
            }
            car.rotation.y = car.userData.axis === 'z' ? 0 : Math.PI/2;
        });
    }
}

window.onload = () => { window.game = new Game(); };
