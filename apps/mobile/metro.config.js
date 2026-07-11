const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages'),
  ],
  nodeModulesPaths: [
    path.resolve(monorepoRoot, 'node_modules'),
    path.resolve(__dirname, 'node_modules'),
  ],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
