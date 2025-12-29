#include "VSE_Memory.h"
#include <iostream>
#include <cstdlib>
#include <mutex>
#include <atomic>

namespace VSE
{
    class HeapAllocator : public BaseAllocator
    {
    public:
        void* allocate(size_t size, size_t alignment, MemoryTag tag) override
        {
            void* ptr = nullptr;
            // C++17 aligned_alloc or posix_memalign
            if (posix_memalign(&ptr, alignment, size) != 0) return nullptr;
            if (ptr) totalAllocatedBytes += size;
            return ptr;
        }

        void deallocate(void* ptr) override
        {
            if (ptr) free(ptr);
        }

        size_t getCurrentUsage() const override
        {
            return totalAllocatedBytes.load();
        }

        std::atomic<size_t> totalAllocatedBytes{0};
    };

    static std::once_flag initFlag;
    static MemoryManager* instance = nullptr;
    static HeapAllocator primaryHeap;

    MemoryManager& MemoryManager::GetInstance()
    {
        std::call_once(initFlag, []() {
            instance = new MemoryManager();
        });
        return *instance;
    }

    void MemoryManager::initialize(size_t totalMemoryBudget)
    {
        generalAllocator = &primaryHeap;
    }

    void MemoryManager::shutdown()
    {
        generalAllocator = nullptr;
    }

    void* MemoryManager::alloc(size_t size, size_t alignment, MemoryTag tag)
    {
        if (!generalAllocator) return nullptr;
        return generalAllocator->allocate(size, alignment, tag);
    }

    void MemoryManager::dealloc(void* ptr)
    {
        if (!generalAllocator || !ptr) return;
        generalAllocator->deallocate(ptr);
    }

    size_t MemoryManager::getTagUsage(MemoryTag tag) const
    {
        return tagUsage[static_cast<u16>(tag)];
    }
}
