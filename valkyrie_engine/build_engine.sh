#!/bin/bash
set -e

echo "Compiling Valkyrie Synthesis Engine..."

g++ -std=c++17 \
    main.cpp \
    src/kernel/VSE_Memory.cpp \
    src/game/StoryData.cpp \
    -o valkyrie_engine_bin \
    -I.

echo "Compilation Success!"
echo "Running Engine..."
./valkyrie_engine_bin
