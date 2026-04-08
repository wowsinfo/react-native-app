module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|react-native-paper|react-native-iphone-x-helper|react-native-vector-icons|react-native-animatable|react-native-device-detection|react-native-localization|react-native-super-grid|react-native-iap)/)',
  ],
};
