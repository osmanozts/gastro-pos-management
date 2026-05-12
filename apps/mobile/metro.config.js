const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  '@libs/components': path.resolve(workspaceRoot, 'libs/components/src'),
  '@libs/theme': path.resolve(workspaceRoot, 'libs/theme/src'),
  '@libs/api-client': path.resolve(workspaceRoot, 'libs/api-client/src'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    return context.resolveRequest(
      context,
      path.resolve(projectRoot, moduleName.slice(2)),
      platform
    );
  }
  // Metro converts package.json "main" values (e.g. "expo-router/entry") into
  // relative paths (e.g. "./node_modules/expo-router/entry") and resolves them
  // from the app directory. In a hoisted monorepo those packages only exist in
  // the workspace root, so strip the prefix and let nodeModulesPaths find them.
  if (/^\.\.?\//u.test(moduleName) && moduleName.includes('/node_modules/')) {
    const bare = moduleName.replace(/^(\.\.?\/)+node_modules\//, '');
    return context.resolveRequest(context, bare, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
