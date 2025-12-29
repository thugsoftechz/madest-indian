#ifndef STORY_DATA_H
#define STORY_DATA_H

#include <string>
#include <vector>
#include "../kernel/VSE_Platform.h"

namespace VSE::Game
{
    struct Character
    {
        std::string name;
        u32 age;
        std::string role;
        std::string motive;
    };

    struct City
    {
        std::string name;
        std::string archetype; // METRO, HISTORIC, COASTAL, INDUSTRIAL
        std::string memory;
    };

    class NarrativeSystem
    {
    public:
        static NarrativeSystem& GetInstance();
        void initialize();

        const Character& getProtagonist() const { return protagonist; }
        const std::vector<City>& getCities() const { return cities; }

    private:
        Character protagonist;
        std::vector<City> cities;
    };
}

#endif // STORY_DATA_H
