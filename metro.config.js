const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'react-dom': path.resolve(__dirname, 'shims/react-dom.js'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
