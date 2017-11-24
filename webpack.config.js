var path = require('path');
var webpack = require('webpack');
// require("babel-preset-babili");
const BabiliPlugin = require('babili-webpack-plugin');

process.argv.forEach(arg => {
  if(/^NODE_ENV\=/.test(arg))
    process.env.NODE_ENV=arg.split('=')[1];
});
// console.log(process.env.NODE_ENV); process.exit();

var config = {
  // devtool: 'eval',
  // devtool: 'cheap-module-eval-source-map',
  devtool: '#source-map',
  entry: {
    app: [
      'babel-polyfill',
//      'es6-promise',
//      'whatwg-fetch',
      './src/index'
    ],
    /*
    vendor: ['react','react-bootstrap','react-dom','react-redux','redux',
              'redux-logger','redux-thunk','react-typeahead',
              'react-router-redux', 'react-router', 'history']
    */
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },

  resolve: { // Make React single instance
    alias: {
      react: path.resolve('./node_modules/react')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
//        query: {stage: 0},
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: path.resolve(__dirname, 'test/data')
      },
      {
        test: /\.less$/,
        loaders: ['style-loader','css-loader','less-loader'],
        include: path.resolve(__dirname, 'src/style/theme'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?modules', 'sass'],
        include: path.resolve(__dirname, './node_modules/react-flexbox-grid'),
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: [
          path.resolve(__dirname, 'src/style'),
          path.resolve(__dirname, 'node_modules/react-spinner')
          ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
        include: path.resolve(__dirname, 'node_modules') 
      },
      { 
        test: /\.(png|jpg)$/, 
        loader: 'file-loader?name=/src/images/[name].[ext]', 
        include: path.resolve(__dirname, 'src/images')
      }
    ]
  }
};

var env = { 
  'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'SEC_PORT': JSON.stringify(process.env.SEC_PORT),
  'BACKEND_IP': JSON.stringify(process.env.BACKEND_IP)
 };

if (process.env.NODE_ENV === 'development') {
  config.entry.app.unshift(
    'webpack-hot-middleware/client'
  );
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
//    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].js' }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
//      React: 'react'
      }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(env)
    // new webpack.optimize.DedupePlugin(),c
    // new webpack.optimize.OccurenceOrderPlugin()
  ];
} else if (process.env.NODE_ENV === 'production') {
  config.plugins = [
    // new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
//    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].js' }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
//      React: 'react'
       }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(env)
//    new BabiliPlugin()
  ];
}

module.exports = config;
