#include "src/kernel/VSE_Memory.h"
#include "src/game/StoryData.h"
#include <iostream>

int main()
{
    std::cout << "Initializing Valkyrie Synthesis Engine..." << std::endl;

    // Initialize Memory
    VSE::MemoryManager::GetInstance().initialize(1024 * 1024 * 100);

    // Initialize Game Systems
    VSE::Game::NarrativeSystem::GetInstance().initialize();

    // Allocate something to test memory
    void* ptr = VSE_MALLOC(1024, VSE::MemoryTag::CORE_ENGINE);
    std::cout << "Allocated 1024 bytes. Current Usage: " <<
        VSE::MemoryManager::GetInstance().getTagUsage(VSE::MemoryTag::CORE_ENGINE) << std::endl;

    VSE_FREE(ptr);

    std::cout << "Engine Shutdown." << std::endl;
    return 0;
}
