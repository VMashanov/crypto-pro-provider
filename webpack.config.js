var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    'es6-promise',
    './vendor/cadesplugin_api',
    './src/crypto-pro-provider'
  ],
  output: {
    path: path.join(__dirname, '/'),
    filename: 'index.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}
