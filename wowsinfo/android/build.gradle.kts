// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        set("buildToolsVersion", "35.0.0")
        set("minSdkVersion", 24)
        set("compileSdkVersion", 35)
        set("targetSdkVersion", 35)
        set("ndkVersion", "26.1.10909125")
        set("kotlinVersion", "1.9.25")
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.7.3")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25")
    }
}

apply(plugin = "com.facebook.react.rootproject")
