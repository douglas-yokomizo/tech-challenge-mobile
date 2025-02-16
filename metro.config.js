// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add TypeScript and JSX support
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "tsx",
  "ts",
  "jsx",
];

module.exports = withNativeWind(config, { input: "./global.css" });
