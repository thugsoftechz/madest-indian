# PHASE 0: CITY ONTOLOGY & SIMULATION AXIOMS

## 1. THE LIVING CITY AXIOM
A city in the Valkyrie Engine is not a static map. It is a **Stateful Agent** that consumes resources, produces culture, and reacts to stimuli.
**Axiom:** If a city's state can be fully described by its geometry, it is a failed implementation. It must be described by its *systems*.

## 2. CITY IDENTITY DATA STRUCTURE (Ontology)
Each of the 300+ cities is defined by a unique seed and a mutable state vector.

### 2.1 Cultural Dimensions (0.0 - 1.0)
*   **Tradition vs. Modernity:** Affects architecture blend, clothing, social norms.
*   **Collectivism vs. Individualism:** Affects crowd density, family unit size, migration.
*   **Order vs. Chaos:** Affects traffic behavior, crime rates, police presence.
*   **Spirituality vs. Materialism:** Affects festival frequency, temple/market density.
*   **Trust:** The city's collective memory of safety.

### 2.2 Climate Model
*   **Latitude/Longitude:** Determines solar cycle and base temperature.
*   **Elevation:** Modifies temp and vegetation.
*   **Humidity:** Affects fog density, disease spread, fatigue.
*   **Seasonality:** A curve defining variance over the simulation year.

### 2.3 Economic Invariants
*   **Wealth Distribution (Gini):** Defines the visual gap between zones.
*   **Primary Industry:** (Tech, Manufacturing, Agriculture, Trade).
*   **Resource Pressure:** How close the city is to collapse.

## 3. SIMULATION LOOP (Time-Scale Separation)
The simulation runs on three concurrent time scales:

1.  **Real-Time (The "Now"):** Physics, rendering, local traffic (60Hz).
    *   *Scope:* Only the city the player is currently in.
2.  **Daily Cycle (The "Routine"):** Employment, hunger, sleep schedules (1 tick = 1 minute).
    *   *Scope:* The current city + immediate neighbors.
3.  **Historical Time (The "Drift"):** Economic shifts, migration, climate change (1 tick = 1 day).
    *   *Scope:* All 300+ cities globally.

## 4. PERSISTENCE & MEMORY
*   **Global Blackboard:** A shared memory space where cities post "Events" (Disaster, Riot, Boom).
*   **Cultural Memory:** Each city maintains a weighted list of past events that decay over years.
*   **Reaction Rules:** Cities query the Blackboard to adjust their internal state (e.g., A riot in City A lowers Trust in neighbor City B).

## 5. SUCCESS METRICS
*   **Divergence:** After 100 simulation years, no two cities with the same starting seed should be identical if their neighbors differed.
*   **Stability:** The global economy must not collapse into zero or explode into infinity without external shock.
*   **Resilience:** A city must be able to recover from a "Player Event" (e.g., destruction) over time.
