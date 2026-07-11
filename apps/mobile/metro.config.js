const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages'),
  ],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    nodeModulesPaths: [
      path.resolve(monorepoRoot, 'node_modules'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
