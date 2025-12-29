# PHASE 0: FOUNDATIONAL ASSUMPTIONS & AXIOMS

## 1. IMMUTABLE PROJECT AXIOMS
1.  **Zero-Latency Mandate:** The engine architecture must prioritize input-to-photon latency above all else. No subsystem shall introduce blocking waits on the main thread.
2.  **Data-Oriented Primacy:** All core systems (Physics, Rendering, AI) must utilize Data-Oriented Design (DOD). Structure of Arrays (SoA) is preferred over Array of Structures (AoS). Cache locality is the primary performance metric.
3.  **Determinism:** The core simulation loop (Physics + Game Logic) must be deterministic given the same initial seed and input stream. This is non-negotiable for the Replay system.
4.  **No Exceptions:** The codebase shall not use C++ exceptions. Error handling must be explicit (Result types or error codes).
5.  **Native Fidelity:** The engine is native C++20. No managed runtimes (C#, Java) or garbage collection are permitted in the core loop.

## 2. NON-NEGOTIABLE CONSTRAINTS
*   **Target Frame Time:** 6.94ms (144Hz) is the standard budget.
*   **Memory Budget:**
    *   System RAM: 16GB Baseline (Streaming prioritized).
    *   VRAM: 8GB Baseline (Aggressive residency management).
*   **Concurrency:** The engine must scale linearly up to 32 cores. The Task System is the only synchronization primitive allowed for high-level logic.

## 3. SYSTEM INVARIANTS
*   **Invariant A:** The Render Thread never waits for the Logic Thread; the Logic Thread submits commands to a frame-buffered queue.
*   **Invariant B:** All assets are binary-serialized and memory-mapped where possible. No text parsing at runtime.
*   **Invariant C:** Every subsystem has a strict memory quota managed by `VSE_Memory`.

## 4. FAILURE CONDITIONS
*   Any "Stop-the-world" garbage collection or resource loading during gameplay constitutes a critical failure.
*   Frame drops below 60fps in the "High Stress" benchmark constitute a critical failure.
*   Non-deterministic behavior in the physics solver constitutes a critical failure.

## 5. SUCCESS METRICS
*   **Metric A:** 1,000,000+ Active Entities simulated at 60hz.
*   **Metric B:** Instantaneous (<2s) transitions between World Regions (WSS).
*   **Metric C:** Cold boot to gameplay in <5 seconds.
