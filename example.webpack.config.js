const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    './vendor/cadesplugin_api.js',
    './example/index.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'example'),
    library: 'crypto-pro-provider',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js?$/,
      include: [
        path.resolve(__dirname, 'example'),
      ],
      loader: 'babel-loader',
    }],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'example'),
    ],
    extensions: ['.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
    compress: true,
    port: process.env.PORT || '3000',
  },
};
