#ifndef VSE_CITY_SYSTEM_H
#define VSE_CITY_SYSTEM_H

#include "CityData.h"
#include <vector>
#include <mutex>

namespace VSE::Simulation
{
    class CitySystem
    {
    public:
        static CitySystem& GetInstance();

        void initialize(u32 cityCount);
        void shutdown();

        // The main simulation tick (Historical Time Scale)
        void updateSimulation(u32 ticks);

        CityState& getCity(u32 index);
        const std::vector<CityState>& getAllCities() const;

    private:
        CitySystem() = default;

        std::vector<CityState> cities;
        std::mutex simMutex;
        u32 currentDay = 0;

        void generateWorld(u32 count);
        void simulateDay(CityState& city);
    };
}

#endif // VSE_CITY_SYSTEM_H
