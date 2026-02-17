# Navigation Migration from react-native-router-flux to @react-navigation v7

## Summary
This project has been migrated from `react-native-router-flux` to `@react-navigation/native` v7 with `@react-navigation/stack`.

## Key Changes

### 1. New Navigation Service
Created `src/core/navigation/NavigationService.ts` that provides:
- `navigationRef`: Reference to the NavigationContainer for imperative navigation
- `NavigationService`: Core navigation methods (push, pop, popTo, reset, refresh, navigate)
- `Actions`: Backward-compatible API that mimics react-native-router-flux Actions

### 2. Updated Files

#### Main App File
- `src/wowsinfo.js`: 
  - Replaced `Router`, `Stack`, `Scene` with `NavigationContainer` and `createStackNavigator`
  - Setup navigation ref for imperative navigation
  - Converted all Scene components to Stack.Screen
  - Updated BackHandler logic to work with new navigation system

#### Navigation Utilities
- `src/core/util/SafeAction.ts`: Updated to use new NavigationService
- `src/core/index.ts`: Added export for NavigationService

#### Component Updates
All files that imported Actions from react-native-router-flux now import from `../../core/navigation/NavigationService`:
- `src/component/common/FloatingButton.tsx`
- `src/component/common/FooterButton.tsx`
- `src/page/home/Setup.js`
- `src/page/home/Menu.js`
- `src/page/wiki/WarshipModule.js`
- `src/page/wiki/WarshipFilter.js`
- `src/page/wiki/WarshipDetail.js`
- `src/page/player/Detailed.js`
- `src/page/settings/ProVersion.js`
- `src/page/settings/Settings.js`
- `src/value/data.ts`

### 3. Navigation API Compatibility

The Actions API maintains backward compatibility with react-native-router-flux:

```javascript
// All these still work:
Actions.push('ScreenName', params);
Actions.pop();
Actions.popTo('ScreenName');
Actions.reset('ScreenName');
Actions.refresh(params);
Actions.Menu();  // Direct navigation to Menu
Actions.ProVersion();  // Direct navigation to ProVersion

// State access:
Actions.state.routes  // Array of current routes
Actions.currentScene  // Current screen name
```

### 4. Screen Configuration
All screens are configured with:
- `headerShown: false` - Maintains custom header behavior
- `cardStyle` - Preserves background color based on theme
- Same screen names as before (no changes to navigation calls needed)

### 5. Initial Route Logic
- Setup screen is shown if `getFirstLaunch()` returns true
- Otherwise, Menu screen is the initial route
- This preserves the original onboarding flow

## New Architecture Compatibility
The migration uses @react-navigation v7 which is fully compatible with React Native's New Architecture (Fabric and TurboModules).

## Testing Recommendations
1. Test all navigation flows (push, pop, popTo, reset)
2. Verify Android back button behavior
3. Test first launch flow (Setup screen)
4. Test deep navigation stacks
5. Verify theme integration with dark/light modes
6. Test all SafeAction usages

## Dependencies
The following packages are required (already in package.json):
- `@react-navigation/native`: ^7.1.28
- `@react-navigation/stack`: ^7.4.3
- `react-native-gesture-handler`: ^2.22.1
- `react-native-safe-area-context`: ^4.14.1
- `react-native-screens`: ^4.3.0

## Removed Dependencies
- `react-native-router-flux` - No longer needed
