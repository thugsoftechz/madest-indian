#include "PopulationSystem.h"
#include <random>

namespace VSE::Simulation
{
    PopulationSystem& PopulationSystem::GetInstance()
    {
        static PopulationSystem instance;
        return instance;
    }

    std::vector<NPC> PopulationSystem::generateCohort(const CityState& city, u32 count)
    {
        std::vector<NPC> cohort;
        cohort.reserve(count);

        std::mt19937 rng(city.id); // Deterministic per city
        std::uniform_real_distribution<f32> distWealth(0.0f, city.economy.gdp_per_capita * 2.0f);

        for (u32 i = 0; i < count; ++i)
        {
            NPC person;
            person.id = (u64)city.id << 32 | i;
            person.age = 18 + (i % 60);
            person.wealth = distWealth(rng);
            person.happiness = 0.5f;

            // Basic profession assignment based on city economy
            if (city.economy.tech_output > 0.6f) person.profession = "TechWorker";
            else if (city.economy.industrial_output > 0.6f) person.profession = "FactoryWorker";
            else person.profession = "Laborer";

            cohort.push_back(person);
        }

        return cohort;
    }

    void PopulationSystem::updatePopulation(std::vector<NPC>& populace, const CityState& city)
    {
        // Simple update loop
        for (auto& person : populace)
        {
            // Happiness decay if instability is high
            if (city.current_stability < 0.3f)
            {
                person.happiness -= 0.01f;
            }
        }
    }
}
