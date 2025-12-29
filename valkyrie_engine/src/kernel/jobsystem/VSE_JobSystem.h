#ifndef VSE_JOBSYSTEM_H
#define VSE_JOBSYSTEM_H

#include "../VSE_Platform.h"
#include <functional>
#include <atomic>
#include <vector>
#include <thread>
#include <mutex>
#include <deque>
#include <condition_variable>

namespace VSE::Kernel
{
    struct Job
    {
        std::function<void()> task;
        // Padding/Alignment if needed for cache lines
    };

    struct JobCounter
    {
        std::atomic<u32> count;
    };

    class VSE_ENGINE_API JobSystem
    {
    public:
        static JobSystem& GetInstance();

        void initialize(u32 threadCount);
        void shutdown();

        // Schedule a job. Returns a pointer to a counter if synchronization is needed.
        void run(Job job, JobCounter* counter = nullptr);

        // Wait for a counter to reach zero.
        void waitForCounter(JobCounter* counter, u32 value);

    private:
        JobSystem() = default;

        void workerLoop(u32 threadIndex);

        std::vector<std::thread> workers;
        std::deque<Job> jobQueue;
        std::mutex queueMutex;
        std::condition_variable condition;
        std::atomic<bool> running{false};
    };
}

#endif // VSE_JOBSYSTEM_H
