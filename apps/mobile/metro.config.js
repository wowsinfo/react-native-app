const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '../..');

/**
 * Metro cannot resolve through Bun's workspace symlinks (node_modules/.bun/).
 * The correct fix: use resolveRequest with Node's require.resolve which follows
 * symlinks, then return the real file path with the correct Resolution type.
 */
const babelRuntimeDir = path.dirname(
  require.resolve('@babel/runtime/package.json', {paths: [__dirname]}),
);

const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages'),
    path.resolve(babelRuntimeDir),
  ],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    nodeModulesPaths: [
      path.resolve(monorepoRoot, 'node_modules'),
      path.resolve(__dirname, 'node_modules'),
    ],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('@babel/') || moduleName.startsWith('string-format')) {
        try {
          const resolved = require.resolve(moduleName, {paths: [__dirname]});
          return {type: 'sourceFile', filePath: resolved};
        } catch {
          return context.resolveRequest(context, moduleName, platform);
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
