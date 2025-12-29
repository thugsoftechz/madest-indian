#ifndef VSE_PLATFORM_H
#define VSE_PLATFORM_H

// --- Platform Identification ---
#if defined(_WIN64)
    #define VSE_PLATFORM_WINDOWS 1
#elif defined(__linux__)
    #define VSE_PLATFORM_LINUX 1
#endif

// --- Export/Import Macros ---
#if VSE_PLATFORM_WINDOWS
    #define VSE_API __declspec(dllexport)
    #define VSE_IMPORT __declspec(dllimport)
#else
    #define VSE_API
    #define VSE_IMPORT
#endif

#ifdef VSE_BUILD_DLL
    #define VSE_ENGINE_API VSE_API
#else
    #define VSE_ENGINE_API VSE_IMPORT
#endif

// --- Fundamental Types ---
#include <cstdint>

namespace VSE
{
    using u8  = uint8_t;
    using u16 = uint16_t;
    using u32 = uint32_t;
    using u64 = uint64_t;
    using i8  = int8_t;
    using i16 = int16_t;
    using i32 = int32_t;
    using i64 = int64_t;
    using f32 = float;
    using f64 = double;
}

#endif // VSE_PLATFORM_H
