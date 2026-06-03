const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Monorepo: watch packages outside the app directory
config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.resolverMainFields = ['react-native', 'source', 'browser', 'main']
config.resolver.unstable_enablePackageExports = true
config.resolver.disableHierarchicalLookup = false

module.exports = withNativeWind(config, { input: './global.css' })
