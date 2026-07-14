const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('node:path');
const fs = require('fs');

const monorepoRoot = path.resolve(__dirname, '../..');
const rnwPath = fs.realpathSync(path.resolve(
  require.resolve('react-native-windows/package.json'), '..',
));
const babelRuntimeDir = path.dirname(
  require.resolve('@babel/runtime/package.json', {paths: [__dirname]}),
);
const bunCacheDir = path.resolve(monorepoRoot, 'node_modules', '.bun');

const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages'),
    path.resolve(babelRuntimeDir),
    path.resolve(bunCacheDir),
  ],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    blockList: [
      new RegExp(
        `${path.resolve(__dirname, 'wowsinfo').replace(/[/\\]/g, '/')}.*`,
      ),
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
