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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, './src'),
      ],
      loader: 'babel-loader'
    }]
  }
}
