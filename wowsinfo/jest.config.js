module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-router-flux|react-navigation|@react-navigation|react-native-animatable|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|react-native-reanimated|react-native-iphone-x-helper|react-native-iap)/)',
  ],
};
