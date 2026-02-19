rootProject.name = "wowsinfo"

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    
    // Map plugin IDs to Maven coordinates for Android plugins
    // Kotlin plugin resolves automatically from gradlePluginPortal()
    resolutionStrategy {
        eachPlugin {
            when (requested.id.id) {
                "com.android.application", "com.android.library" -> {
                    useModule("com.android.tools.build:gradle:${requested.version}")
                }
            }
        }
    }
    
    includeBuild("../node_modules/@react-native/gradle-plugin")
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
    repositories {
        google()
        mavenCentral()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url = uri("../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url = uri("../node_modules/jsc-android/dist")
        }
    }
}

plugins {
    id("com.facebook.react.settings")
}

extensions.configure<com.facebook.react.ReactSettingsExtension> {
    autolinkLibrariesFromCommand()
}

include(":app")
