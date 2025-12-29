#include "StoryData.h"
#include <iostream>

namespace VSE::Game
{
    NarrativeSystem& NarrativeSystem::GetInstance()
    {
        static NarrativeSystem instance;
        return instance;
    }

    void NarrativeSystem::initialize()
    {
        // Hardcoded Narrative Content as requested
        protagonist = {
            "Ghost",
            21,
            "Runner",
            "Mapping the intersection of Love and Death in the year 2000."
        };

        cities = {
            {"Mumbai", "METRO", "We met on the local train. 1:43 AM. She smelled like rain."},
            {"Varanasi", "HISTORIC", "Death burns openly here. I saw a body float by and thought of her."},
            {"Goa", "COASTAL", "The party never ended. We danced until our feet bled."},
            {"Jamshedpur", "INDUSTRIAL", "Steel city. The smoke hides everything."},
            {"Delhi", "METRO", "The fog in winter blinds you. Just like love."}
        };

        std::cout << "Narrative System Initialized." << std::endl;
        std::cout << "Protagonist: " << protagonist.name << " (" << protagonist.age << ")" << std::endl;
    }
}
