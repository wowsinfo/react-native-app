# Library Migration for New Architecture Support

This document details the library changes made to support React Native 0.83's New Architecture requirement.

## Overview

React Native 0.83 requires the New Architecture (TurboModules and Fabric) to be enabled. Several legacy libraries needed to be replaced with modern alternatives that support the New Architecture.

## Library Replacements

### 1. Navigation: react-native-router-flux → @react-navigation

**Replaced:**
```json
"react-native-router-flux": "^4.3.1"
```

**With:**
```json
"@react-navigation/native": "^7.1.28",
"@react-navigation/stack": "^7.4.3",
"react-native-gesture-handler": "^2.22.1",
"react-native-safe-area-context": "^4.14.1",
"react-native-screens": "^4.3.0"
```

**Why:**
- `react-native-router-flux` uses outdated react-navigation v4 APIs
- @react-navigation v7 fully supports New Architecture
- Better maintained and actively developed
- More flexible and modern API

**Migration Steps:**
1. Replace `Router`, `Scene`, `Actions` imports with `NavigationContainer` and stack navigator
2. Update navigation structure to use Stack.Navigator/Stack.Screen pattern
3. Use `navigation.navigate()` instead of `Actions.push()`

### 2. Localization: react-native-localization → react-native-localize

**Replaced:**
```json
"react-native-localization": "^2.3.2"
```

**With:**
```json
"react-native-localize": "^3.6.1"
```

**Why:**
- `react-native-localize` is the modern, actively maintained localization library
- Full New Architecture support
- Better TypeScript support
- More comprehensive locale detection

**Migration Steps:**
1. Replace imports: `import LocalizedStrings from 'react-native-localization'` → `import * as RNLocalize from 'react-native-localize'`
2. Use `RNLocalize.getLocales()` for locale detection
3. Integrate with i18n libraries like i18next or format.js if needed

## Dependencies Now in Production

Moved from devDependencies to dependencies (required by @react-navigation):
- `react-native-gesture-handler`: ^2.22.1
- `react-native-safe-area-context`: ^4.14.1
- `react-native-screens`: ^4.3.0

These are core dependencies for @react-navigation and must be in production dependencies.

## New Architecture Compatibility

All current dependencies now support the New Architecture:

✅ **Navigation**
- @react-navigation/native: v7 (full support)
- @react-navigation/stack: v7 (full support)

✅ **Native Modules**
- react-native-gesture-handler: v2+ (full support)
- react-native-reanimated: v3+ (full support)
- react-native-safe-area-context: v4+ (full support)
- react-native-screens: v4+ (full support)
- react-native-iap: v12+ (full support)
- react-native-localize: v3+ (full support)

✅ **UI Libraries**
- react-native-paper: v5+ (full support)
- react-native-vector-icons: v10+ (full support)

✅ **Custom Libraries**
- native-chart-experiment: Updated locally to support New Architecture
  - Note: When deploying, use `file:../../native-chart-experiment` path
  - NPM version (^1.0.2) used for development/testing only

## Code Migration Required

### Navigation Code Changes

**Before (router-flux):**
```javascript
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';

export default () => (
  <Router>
    <Stack key="root">
      <Scene key="home" component={HomeScreen} title="Home" />
      <Scene key="details" component={DetailsScreen} title="Details" />
    </Stack>
  </Router>
);

// Navigate
Actions.push('details', {id: 123});
```

**After (@react-navigation):**
```javascript
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Navigate (in component)
navigation.navigate('Details', {id: 123});
```

### Localization Code Changes

**Before (react-native-localization):**
```javascript
import LocalizedStrings from 'react-native-localization';

const strings = new LocalizedStrings({
  en: {
    hello: "Hello",
    welcome: "Welcome"
  },
  es: {
    hello: "Hola",
    welcome: "Bienvenido"
  }
});

// Use
<Text>{strings.hello}</Text>
```

**After (react-native-localize):**
```javascript
import * as RNLocalize from 'react-native-localize';

// Get current locale
const locales = RNLocalize.getLocales();
const currentLocale = locales[0].languageCode;

// Simple approach
const translations = {
  en: {
    hello: "Hello",
    welcome: "Welcome"
  },
  es: {
    hello: "Hola",
    welcome: "Bienvenido"
  }
};

const strings = translations[currentLocale] || translations.en;

// Use
<Text>{strings.hello}</Text>
```

## Build Configuration

With New Architecture enabled:
- Codegen automatically generates TurboModule specs
- Fabric components use new rendering system
- Better performance and type safety
- Requires all native modules to be New Arch compatible

## Testing

After migration:
1. Test all navigation flows
2. Verify localization works correctly
3. Test native module functionality
4. Verify performance improvements
5. Check for any runtime errors related to New Architecture

## Resources

- [React Navigation v7 Docs](https://reactnavigation.org/docs/getting-started)
- [react-native-localize Docs](https://github.com/zoontek/react-native-localize)
- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Migration Guide](https://reactnative.dev/docs/new-architecture-intro)
