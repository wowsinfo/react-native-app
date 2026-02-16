# React Native 0.76.8 Upgrade Guide

This document details the changes made during the upgrade from React Native 0.72.4 to 0.76.8.

## Overview

- **React Native**: 0.72.4 → 0.76.8
- **React**: 18.2.0 → 18.3.1
- **Gradle**: 8.0.1 → 8.11.1
- **Android Gradle Plugin**: → 8.3.0
- **iOS Deployment Target**: 14.0 → 15.1
- **Android compileSdk**: 33 → 35
- **Android targetSdk**: 33 → 35
- **Android minSdk**: 21 → 24

## Major Changes

### 1. Android Build System Migration to Kotlin DSL

All Android build files have been migrated from Groovy (`.gradle`) to Kotlin DSL (`.gradle.kts`):

- `android/build.gradle` → `android/build.gradle.kts`
- `android/settings.gradle` → `android/settings.gradle.kts`
- `android/app/build.gradle` → `android/app/build.gradle.kts`

**Benefits:**
- Better IDE support and autocompletion
- Type safety
- Better refactoring support
- Improved build performance

### 2. Removed Deprecated Features

- **Flipper**: Removed Flipper integration as it's deprecated in React Native 0.76+
- **32-bit x86**: Removed x86 architecture support (x86_64 retained for emulator support)

### 3. Updated Dependencies

#### Core Dependencies
```json
{
  "react": "18.3.1",
  "react-native": "0.76.8"
}
```

#### Dev Dependencies (Major Updates)
- `@react-native/babel-preset`: 0.76.8
- `@react-native/eslint-config`: 0.76.8
- `@react-native/metro-config`: 0.76.8
- `@react-native/typescript-config`: 0.76.8
- `typescript`: 5.7.3
- `@babel/core`: ^7.26.0

#### Native Module Updates
- `react-native-gesture-handler`: ^2.22.1
- `react-native-reanimated`: ^3.16.3
- `react-native-safe-area-context`: ^4.14.1
- `react-native-screens`: ^4.3.0
- `react-native-vector-icons`: ^10.2.0
- `react-native-paper`: ^5.12.5
- `react-native-iap`: ^12.15.6

### 4. Configuration Changes

#### Babel Configuration
Updated to use the new React Native babel preset:
```javascript
presets: ['module:@react-native/babel-preset']
```

#### TypeScript Configuration
Now extends from the official React Native TypeScript config:
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json"
}
```

#### Jest Configuration
Added transform ignore patterns for React Native modules:
```javascript
transformIgnorePatterns: [
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-router-flux|react-navigation|@react-navigation|...)/)'
]
```

### 5. iOS Changes

#### Podfile Updates
- Updated iOS deployment target to 15.1
- Removed Flipper configuration
- Simplified pod configuration for React Native 0.76

#### CocoaPods
Updated to version 1.15 in Gemfile.

## What You Need to Do

### For Local Development

1. **Clean and Reinstall Dependencies**
   ```bash
   # Clean node modules
   rm -rf node_modules
   yarn install
   
   # Clean iOS pods
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   
   # Clean Android build
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Update Your Environment**
   - Ensure you have Node.js >= 16
   - For iOS development: Xcode 15+ recommended
   - For Android development: Android Studio with SDK 35

### For CI/CD

1. Update your CI/CD scripts to use:
   - Gradle 8.11.1
   - Android SDK 35
   - NDK 26.1.10909125

2. Update any build scripts that referenced old build files:
   - Replace `.gradle` references with `.gradle.kts`
   
## Breaking Changes

### Minimum SDK Versions
- **iOS**: Minimum deployment target is now 15.1 (was 14.0)
- **Android**: Minimum SDK is now 24 (was 21)

### Architecture Support
- **Android**: 32-bit x86 is no longer built by default
  - If you need x86 support, modify `android/gradle.properties`:
    ```properties
    reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
    ```

## Testing Your Build

### Android
```bash
# Debug build
cd android
./gradlew assembleDebug

# Release build
./gradlew assembleRelease
```

### iOS
```bash
# Install pods
cd ios
pod install

# Build from Xcode or command line
xcodebuild -workspace wowsinfo.xcworkspace -scheme wowsinfo-debug
```

## Troubleshooting

### Gradle Build Issues
If you encounter Gradle issues:
1. Clean the build: `cd android && ./gradlew clean`
2. Delete `.gradle` folder in android directory
3. Try `./gradlew --refresh-dependencies`

### iOS Build Issues
If you encounter CocoaPods issues:
1. Clean: `cd ios && rm -rf Pods Podfile.lock`
2. Reinstall: `pod install --repo-update`
3. If still failing, try: `pod deintegrate && pod install`

### Metro Bundler Issues
If Metro has caching issues:
```bash
yarn start --reset-cache
```

## Benefits of This Upgrade

1. **Performance**: React Native 0.76 includes significant performance improvements
2. **Bug Fixes**: Numerous bug fixes from 0.72.4 to 0.76.8
3. **New Architecture Ready**: Better prepared for React Native's new architecture
4. **Better Build System**: Kotlin DSL provides better type safety and IDE support
5. **Security**: Updated dependencies with latest security patches
6. **Modern Standards**: Uses latest Android SDK and iOS deployment targets

## References

- [React Native 0.76 Release Notes](https://reactnative.dev/blog)
- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [Android Gradle Plugin Release Notes](https://developer.android.com/studio/releases/gradle-plugin)
- [Gradle 8.11 Release Notes](https://docs.gradle.org/8.11/release-notes.html)
