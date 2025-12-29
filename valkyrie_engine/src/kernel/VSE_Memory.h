#ifndef VSE_MEMORY_H
#define VSE_MEMORY_H

#include "VSE_Platform.h"
#include <cstddef> // size_t

namespace VSE
{
    // Memory tags for debugging and profiling
    enum class MemoryTag : u16
    {
        UNKNOWN,
        CORE_ENGINE,
        RENDERER,
        PHYSICS,
        AI_SYSTEM,
        WORLD_STREAMING,
        ANIMATION,
        ASSET_DATA,
        TEMP_DATA,
        MAX_TAGS
    };

    /**
     * @brief Abstract base class for all VSE memory allocators.
     */
    class VSE_ENGINE_API BaseAllocator
    {
    public:
        virtual ~BaseAllocator() = default;
        virtual void* allocate(size_t size, size_t alignment, MemoryTag tag) = 0;
        virtual void deallocate(void* ptr) = 0;
        virtual size_t getCurrentUsage() const = 0;
    };

    /**
     * @brief The global, primary memory manager for the engine.
     */
    class VSE_ENGINE_API MemoryManager
    {
    public:
        static MemoryManager& GetInstance();

        MemoryManager(const MemoryManager&) = delete;
        MemoryManager& operator=(const MemoryManager&) = delete;

        void initialize(size_t totalMemoryBudget);
        void shutdown();

        void* alloc(size_t size, size_t alignment, MemoryTag tag);
        void dealloc(void* ptr);
        size_t getTagUsage(MemoryTag tag) const;

    private:
        MemoryManager() = default;
        size_t tagUsage[static_cast<u16>(MemoryTag::MAX_TAGS)] = {};
        BaseAllocator* generalAllocator = nullptr;
    };

    // --- Allocation Helper Macros ---
    #define VSE_MALLOC(S, T) VSE::MemoryManager::GetInstance().alloc(S, 16, T)
    #define VSE_FREE(PTR) VSE::MemoryManager::GetInstance().dealloc(PTR)
}

#endif // VSE_MEMORY_H
