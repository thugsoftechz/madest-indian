#ifndef VSE_LOGGER_H
#define VSE_LOGGER_H

#include "../VSE_Platform.h"
#include <string>
#include <mutex>
#include <fstream>

namespace VSE::Kernel
{
    enum class LogLevel : u8
    {
        INFO,
        WARNING,
        ERROR,
        CRITICAL
    };

    class VSE_ENGINE_API Logger
    {
    public:
        static Logger& GetInstance();

        void initialize(const std::string& logFilePath);
        void shutdown();

        void log(LogLevel level, const char* file, int line, const std::string& message);

    private:
        Logger() = default;
        ~Logger();

        std::ofstream logFile;
        std::mutex logMutex;
    };

    // Helper Macros
    #define VSE_LOG_INFO(msg) VSE::Kernel::Logger::GetInstance().log(VSE::Kernel::LogLevel::INFO, __FILE__, __LINE__, msg)
    #define VSE_LOG_WARN(msg) VSE::Kernel::Logger::GetInstance().log(VSE::Kernel::LogLevel::WARNING, __FILE__, __LINE__, msg)
    #define VSE_LOG_ERROR(msg) VSE::Kernel::Logger::GetInstance().log(VSE::Kernel::LogLevel::ERROR, __FILE__, __LINE__, msg)
}

#endif // VSE_LOGGER_H
