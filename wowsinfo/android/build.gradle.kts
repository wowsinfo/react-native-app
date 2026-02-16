// Top-level build file where you can add configuration options common to all sub-projects/modules.

// Project-wide configuration
extra.apply {
    set("buildToolsVersion", "35.0.0")
    set("minSdkVersion", 24)
    set("compileSdkVersion", 35)
    set("targetSdkVersion", 35)
    set("ndkVersion", "26.1.10909125")
}

plugins {
    id("com.android.application") version "8.3.0" apply false
    id("com.android.library") version "8.3.0" apply false
    id("org.jetbrains.kotlin.android") version "2.1.0" apply false
}

apply(plugin = "com.facebook.react.rootproject")
