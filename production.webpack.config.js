// To Do

const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [
    './vendor/cadesplugin_api.js',
    './src/index',
  ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'crypto-pro-provider',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js?$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      loader: 'babel-loader',
    }],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js'],
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'examples'),
  //   compress: true,
  //   port: process.env.PORT || '3000',
  // },
};

