#ifndef VSE_POPULATION_SYSTEM_H
#define VSE_POPULATION_SYSTEM_H

#include "CityData.h"
#include <vector>
#include <string>

namespace VSE::Simulation
{
    struct NPC
    {
        u64 id;
        u32 age;
        std::string profession;
        f32 wealth;
        f32 happiness;

        // Memory
        std::vector<std::string> event_memory; // "Riot_2000", "Festival_1999"
    };

    class PopulationSystem
    {
    public:
        static PopulationSystem& GetInstance();

        // Generate initial population cohort for a city
        std::vector<NPC> generateCohort(const CityState& city, u32 count);

        // Update population state (aging, migration, death)
        void updatePopulation(std::vector<NPC>& populace, const CityState& city);
    };
}

#endif // VSE_POPULATION_SYSTEM_H
