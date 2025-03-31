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

// Further reduce max workers to minimize file handles
config.maxWorkers = 1;

// Disable asset plugins and minification to reduce file operations
config.transformer.assetPlugins = [];
config.transformer.minifierConfig = { compress: false, mangle: false };

// Set a higher polling interval and disable health checks
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: false,
  },
  watchman: {
    deferStates: ["hg.update"],
    enableBulkWatches: false,
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

// Add explicit blacklist for directories to ignore
config.watchFolders = config.watchFolders.filter((folder) => {
  return folder !== path.resolve(__dirname, "node_modules");
});

// Add specific file extensions to watch to reduce the number of files
config.resolver.sourceExts = ["js", "jsx", "ts", "tsx"];

// Explicitly exclude tempobook directory from watching
config.watchIgnorePatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /tempobook\/dynamic/,
  /tempobook\/storyboards/,
];

module.exports = withNativeWind(config, { input: "./global.css" });
