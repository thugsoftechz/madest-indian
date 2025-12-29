# PHASE 1: META-ARCHITECTURE DESIGN

## 1. GLOBAL SYSTEM TOPOLOGY
The Valkyrie Synthesis Engine (VSE) operates as a layered architecture:

### Layer 0: Kernel (VSE_Kernel)
*   **Responsibility:** Hardware abstraction, Memory, Threading, Logging.
*   **Dependencies:** None (System Libraries only).
*   **Key Modules:** `VSE_Memory`, `VSE_JobSystem`, `VSE_Platform`, `VSE_Logger`.

### Layer 1: Core Resources (VSE_Core)
*   **Responsibility:** Asset Management, Math Library, FileSystem.
*   **Dependencies:** VSE_Kernel.
*   **Key Modules:** `VSE_Math`, `VSE_AssetPipe`, `VSE_Config`.

### Layer 2: Engine Systems (VSE_Engine)
*   **Responsibility:** Simulation loops, Physics, Rendering, Audio.
*   **Dependencies:** VSE_Core.
*   **Key Modules:** `VSE_Renderer` (RAL), `VSE_Physics`, `VSE_Audio`, `VSE_Input`.

### Layer 3: Simulation Core (VSE_Sim) [NEW]
*   **Responsibility:** The Living World, 300+ City Management, Macro-Simulation.
*   **Dependencies:** VSE_Engine.
*   **Key Modules:** `CitySystem`, `PopulationSystem`, `EcologySystem`, `EconomySystem`.

### Layer 4: Gameplay Framework (VSE_Game)
*   **Responsibility:** Game Logic, AI, World Streaming, Entities.
*   **Dependencies:** VSE_Sim.
*   **Key Modules:** `WorldStreamingSystem`, `AISystem`, `PlayerController`, `NarrativeDirector`.

## 2. THREADING MODEL (FIBER-BASED JOB SYSTEM)
The engine utilizes a fixed-thread-pool architecture with fiber-based job scheduling (N-M threading).

*   **Main Thread:** OS Event Pump, Window Management, Present.
*   **Worker Threads (N-1):** Execute Jobs from the global priority queue.
*   **Dedicated Threads:**
    *   **IO Thread:** Asynchronous file operations (Asset Streaming).
    *   **Audio Thread:** Audio mixing (high priority).
    *   **Sim Thread:** dedicated to the "Historical Time" loop for background city evolution.

**Synchronization:**
*   Locks/Mutexes are forbidden in the hot loop.
*   Systems use `JobHandle` and atomic counters for dependencies.
*   Frame Graph ensures render passes are ordered correctly without explicit CPU blocks.

## 3. MEMORY MODEL (STACK & POOL)
Global `new`/`delete` are forbidden.

*   **Linear Allocator (Frame Allocator):** Reset every frame. Used for temp scratch data.
*   **Pool Allocator:** Fixed-size blocks for Entity Components (Physics Bodies, AI States).
*   **Stack Allocator:** Scoped allocations for level loading.
*   **Double-Buffered State:** Game state is double-buffered (Current/Previous) to allow interpolation by the renderer.

## 4. DEPENDENCY GRAPH
`VSE_Game` -> `VSE_Sim` -> `VSE_Engine` -> `VSE_Core` -> `VSE_Kernel`

*   Cross-layer communication via Event Bus or direct interface calls (downward).
*   Upward communication via Callbacks/Delegates only.
