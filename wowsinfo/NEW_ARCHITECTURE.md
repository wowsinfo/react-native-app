# React Native New Architecture

## Current Status: DISABLED

The React Native New Architecture (TurboModules and Fabric) is **explicitly disabled** in this project for the following reasons:

### Why Disabled?

1. **Compatibility Issues**: Several native modules used in this project may not be fully compatible with the New Architecture:
   - react-native-router-flux (using old react-navigation)
   - react-native-localization
   - native-chart-experiment
   - Older versions of other native modules

2. **Build Stability**: The New Architecture requires:
   - Codegen to generate C++ bindings
   - All native modules to support the new TurboModule/Fabric APIs
   - More complex build configuration

3. **Gradual Migration Path**: React Native 0.83 supports running in legacy mode, allowing us to:
   - Upgrade React Native core first
   - Update/replace incompatible libraries later
   - Migrate to New Architecture when all dependencies are ready

## Configuration

The New Architecture is disabled via `android/gradle.properties`:

```properties
newArchEnabled=false
```

## When to Enable?

Consider enabling the New Architecture when:

1. **All dependencies are compatible**: Check that all native modules support New Arch
2. **Migration plan is ready**: Have a plan to replace/update incompatible libraries
3. **Testing infrastructure**: Can thoroughly test the new rendering and module system

## Migration Checklist

Before enabling New Architecture:

- [ ] Update react-native-router-flux to @react-navigation v6+
- [ ] Verify react-native-iap supports New Arch
- [ ] Verify react-native-reanimated supports New Arch (should be fine)
- [ ] Verify react-native-gesture-handler supports New Arch (should be fine)
- [ ] Test all native modules with New Arch enabled
- [ ] Update any custom native code to use TurboModules
- [ ] Test on both iOS and Android

## Performance Impact

Running in legacy mode (Old Architecture) is:
- **Fully supported** in React Native 0.83
- **Stable and reliable**
- **Good performance** for most apps
- **Lower complexity** in build system

The New Architecture provides benefits like:
- Faster startup time
- Better JavaScript/Native interop
- More efficient rendering

However, these benefits only matter if the app builds and runs reliably first.

## Resources

- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [New Architecture Migration Guide](https://reactnative.dev/docs/new-architecture-intro)
- [TurboModules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)
- [Fabric Renderer](https://reactnative.dev/docs/the-new-architecture/pillars-fabric-components)
