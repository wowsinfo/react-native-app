const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('node:path');
const fs = require('fs');

const root = path.resolve(__dirname, '../..');
const emptyShim = path.resolve(__dirname, 'shim', '_empty.js');

const shimModules = {
  'react-native-exception-handler': path.resolve(__dirname, 'shim', 'react-native-exception-handler.js'),
  'react-native-localization': path.resolve(__dirname, 'shim', 'react-native-localization.js'),
  '@react-native-async-storage/async-storage': path.resolve(__dirname, 'shim', 'async-storage.js'),
  'react-native-screens': path.resolve(__dirname, 'shim', 'react-native-screens.js'),

};

const babelRuntimeDir = path.dirname(
  require.resolve('@babel/runtime/package.json', {paths: [__dirname]}),
);

const bunCacheDir = path.resolve(root, 'node_modules', '.bun');

const config = {
  watchFolders: [
    path.resolve(root, 'packages'),
    path.resolve(root, 'apps/mobile/src'),
    path.resolve(babelRuntimeDir),
    path.resolve(bunCacheDir),
  ],

  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules'), path.resolve(root, 'node_modules')],

    resolveRequest: (context, moduleName, platform) => {
      if (shimModules[moduleName]) {
        return {type: 'sourceFile', filePath: shimModules[moduleName]};
      }
      if (moduleName === 'react-native-vector-icons/MaterialCommunityIcons') {
        return {type: 'sourceFile', filePath: path.resolve(__dirname, 'shim', 'MaterialCommunityIcons.js')};
      }
      if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
        try {
          const r = require.resolve(moduleName.replace('react-native', 'react-native-windows'), {paths: [__dirname]});
          if (r && fs.existsSync(r)) return {type: 'sourceFile', filePath: r};
        } catch (_) {
          try {
            const r = require.resolve(moduleName, {paths: [__dirname]});
            if (r && fs.existsSync(r)) return {type: 'sourceFile', filePath: r};
          } catch (_) {}
        }
      }
      try {
        return context.resolveRequest(context, moduleName, platform);
      } catch (_err) {
        const origin = (context && context.originModulePath) || '';
        if (origin.includes('node_modules') && moduleName.startsWith('.')) {
          return {type: 'sourceFile', filePath: emptyShim};
        }
        const searchPaths = [
          __dirname,
          root,
          path.resolve(root, 'apps/mobile'),
          path.resolve(bunCacheDir),
        ];
        for (const p of searchPaths) {
          try {
            const r = require.resolve(moduleName, {paths: [p]});
            if (r && fs.existsSync(r)) return {type: 'sourceFile', filePath: r};
          } catch (_) {}
        }
        throw _err;
      }
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
