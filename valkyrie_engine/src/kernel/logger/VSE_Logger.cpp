#include "VSE_Logger.h"
#include <iostream>
#include <iomanip>
#include <ctime>

namespace VSE::Kernel
{
    Logger& Logger::GetInstance()
    {
        static Logger instance;
        return instance;
    }

    void Logger::initialize(const std::string& logFilePath)
    {
        std::lock_guard<std::mutex> lock(logMutex);
        logFile.open(logFilePath, std::ios::out | std::ios::trunc);
    }

    void Logger::shutdown()
    {
        std::lock_guard<std::mutex> lock(logMutex);
        if (logFile.is_open())
        {
            logFile.close();
        }
    }

    void Logger::log(LogLevel level, const char* file, int line, const std::string& message)
    {
        std::lock_guard<std::mutex> lock(logMutex);

        std::string levelStr;
        switch(level)
        {
            case LogLevel::INFO: levelStr = "[INFO]"; break;
            case LogLevel::WARNING: levelStr = "[WARN]"; break;
            case LogLevel::ERROR: levelStr = "[ERR ]"; break;
            case LogLevel::CRITICAL: levelStr = "[CRIT]"; break;
        }

        // Get time
        auto t = std::time(nullptr);
        auto tm = *std::localtime(&t);

        // Format: [TIME] [LEVEL] Message (File:Line)
        if (logFile.is_open())
        {
            logFile << std::put_time(&tm, "[%H:%M:%S] ") << levelStr << " " << message << " (" << file << ":" << line << ")" << std::endl;
        }

        // Also print to stdout for now
        std::cout << levelStr << " " << message << std::endl;
    }

    Logger::~Logger()
    {
        shutdown();
    }
}
