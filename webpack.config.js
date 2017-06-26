function buildConfig(env) {
  return require(`./${env || 'development'}.webpack.config.js`)
}

module.exports = buildConfig;
