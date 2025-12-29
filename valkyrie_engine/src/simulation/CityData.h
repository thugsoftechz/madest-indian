#ifndef VSE_CITY_DATA_H
#define VSE_CITY_DATA_H

#include "../kernel/VSE_Platform.h"
#include <string>
#include <vector>

namespace VSE::Simulation
{
    struct CulturalProfile
    {
        f32 tradition_modernity; // 0.0 - 1.0
        f32 collectivism_individualism;
        f32 order_chaos;
        f32 spirituality_materialism;
        f32 social_trust;
    };

    struct ClimateProfile
    {
        f32 latitude;
        f32 elevation;
        f32 base_humidity;
        f32 rainfall_index;
        f32 pollution_level;
    };

    struct EconomicProfile
    {
        f32 gdp_per_capita;
        f32 wealth_inequality; // Gini
        f32 industrial_output;
        f32 tech_output;
        f32 agri_output;
    };

    struct CityState
    {
        u32 id;
        std::string name;
        u64 population;

        CulturalProfile culture;
        ClimateProfile climate;
        EconomicProfile economy;

        // Dynamic State
        f32 current_stability;
        f32 current_resource_pressure;
        std::vector<std::string> active_events; // "Riot", "Festival"
    };
}

#endif // VSE_CITY_DATA_H
