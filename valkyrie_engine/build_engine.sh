#!/bin/bash
set -e

echo "Compiling Valkyrie Synthesis Engine..."

g++ -std=c++17 \
    main.cpp \
    src/kernel/VSE_Memory.cpp \
    src/kernel/logger/VSE_Logger.cpp \
    src/kernel/jobsystem/VSE_JobSystem.cpp \
    src/game/StoryData.cpp \
    src/simulation/CitySystem.cpp \
    src/simulation/PopulationSystem.cpp \
    -o valkyrie_engine_bin \
    -I.

echo "Compilation Success!"
echo "Running Engine..."
./valkyrie_engine_bin
