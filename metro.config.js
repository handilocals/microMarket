const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Drastically reduce file watching to prevent EMFILE errors
config.watchFolders = [
  path.resolve(__dirname, "app"),
  path.resolve(__dirname, "components"),
];

// Disable node_modules watching completely
config.resolver.nodeModulesPaths = [];
config.resolver.disableHierarchicalLookup = true;

// Increase the max workers to improve performance but keep it low
config.maxWorkers = 2;

// Disable asset plugins and minification to reduce file operations
config.transformer.assetPlugins = [];
config.transformer.minifierConfig = { compress: false, mangle: false };

// Set a higher polling interval (in ms) to reduce file system operations
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: false,
  },
  watchman: {
    deferStates: ["hg.update"],
  },
};

// Increase the file watching timeout to prevent excessive reloads
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

// Add specific exclusions for directories that don't need to be watched
config.resetCache = true;

module.exports = withNativeWind(config, { input: "./global.css" });
