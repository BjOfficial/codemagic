// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
module.exports = getDefaultConfig(__dirname);
