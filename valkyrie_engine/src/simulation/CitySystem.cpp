#include "CitySystem.h"
#include "ClimateSystem.h"
#include <iostream>
#include <random>

namespace VSE::Simulation
{
    CitySystem& CitySystem::GetInstance()
    {
        static CitySystem instance;
        return instance;
    }

    void CitySystem::initialize(u32 cityCount)
    {
        generateWorld(cityCount);
        std::cout << "City System Initialized with " << cities.size() << " living cities." << std::endl;
    }

    void CitySystem::shutdown()
    {
        cities.clear();
    }

    void CitySystem::updateSimulation(u32 ticks)
    {
        std::lock_guard<std::mutex> lock(simMutex);

        for (u32 t = 0; t < ticks; ++t)
        {
            currentDay++;
            for (auto& city : cities)
            {
                simulateDay(city);
            }
        }
    }

    void CitySystem::generateWorld(u32 count)
    {
        std::mt19937 rng(42); // Deterministic seed
        std::uniform_real_distribution<f32> dist01(0.0f, 1.0f);

        cities.reserve(count);
        for (u32 i = 0; i < count; ++i)
        {
            CityState city;
            city.id = i;
            city.name = "City_" + std::to_string(i); // Placeholder names
            city.population = 50000 + (u64)(dist01(rng) * 5000000);

            // Randomize Culture
            city.culture = { dist01(rng), dist01(rng), dist01(rng), dist01(rng), 0.5f };

            // Randomize Climate
            city.climate = { dist01(rng), dist01(rng), dist01(rng), dist01(rng), dist01(rng) };

            // Randomize Economy
            city.economy = { dist01(rng), dist01(rng), dist01(rng), dist01(rng), dist01(rng) };

            city.current_stability = 1.0f;
            city.current_resource_pressure = 0.2f;

            cities.push_back(city);
        }
    }

    void CitySystem::simulateDay(CityState& city)
    {
        // 1. Update Climate
        ClimateSystem::UpdateCityWeather(city, currentDay % 365);

        // 2. Economic Drift (Simplified)
        // High inequality + chaos = instability
        if (city.economy.wealth_inequality > 0.7f && city.culture.order_chaos > 0.6f)
        {
            city.current_stability -= 0.001f;
        }
        else
        {
            city.current_stability += 0.0005f;
        }

        // Clamp
        if (city.current_stability < 0.0f) city.current_stability = 0.0f;
        if (city.current_stability > 1.0f) city.current_stability = 1.0f;
    }

    CityState& CitySystem::getCity(u32 index)
    {
        return cities.at(index);
    }

    const std::vector<CityState>& CitySystem::getAllCities() const
    {
        return cities;
    }
}
