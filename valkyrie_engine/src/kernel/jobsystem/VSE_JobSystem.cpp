#include "VSE_JobSystem.h"
#include <iostream> // fallback logging

namespace VSE::Kernel
{
    JobSystem& JobSystem::GetInstance()
    {
        static JobSystem instance;
        return instance;
    }

    void JobSystem::initialize(u32 threadCount)
    {
        if (running) return;
        running = true;

        for (u32 i = 0; i < threadCount; ++i)
        {
            workers.emplace_back(&JobSystem::workerLoop, this, i);
        }
    }

    void JobSystem::shutdown()
    {
        if (!running) return;
        running = false;

        condition.notify_all();

        for (auto& worker : workers)
        {
            if (worker.joinable()) worker.join();
        }
        workers.clear();
    }

    void JobSystem::run(Job job, JobCounter* counter)
    {
        if (counter)
        {
            counter->count.fetch_add(1);
        }

        {
            std::lock_guard<std::mutex> lock(queueMutex);
            jobQueue.push_back(job); // Pass by value
        }
        condition.notify_one();
    }

    void JobSystem::waitForCounter(JobCounter* counter, u32 value)
    {
        if (!counter) return;

        // Simple spin-wait for now (should fiber yield in advanced implementation)
        while (counter->count.load() > value)
        {
            std::this_thread::yield();
        }
    }

    void JobSystem::workerLoop(u32 threadIndex)
    {
        while (running)
        {
            Job job;
            {
                std::unique_lock<std::mutex> lock(queueMutex);
                condition.wait(lock, [this]{ return !jobQueue.empty() || !running; });

                if (!running && jobQueue.empty()) return;

                job = jobQueue.front();
                jobQueue.pop_front();
            }

            // Execute Job
            try
            {
                job.task();
            }
            catch(...)
            {
                // VSE_LOG_ERROR("Job threw exception");
            }

            // Note: Decrementing counter would happen here if we tracked job-to-counter mapping inside the job struct.
            // For this simple implementation, the job task itself might need to handle it or we wrap it.
            // In a real fiber system, this is handled by the scheduler.
        }
    }
}
