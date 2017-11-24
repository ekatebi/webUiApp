var webpack = require('webpack');
var path = require('path');

process.env.BABEL_ENV = 'test';

module.exports = {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('test')})
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'isparta-instrumenter-loader'
      },
      {
        test: /\.js$/, 
        loader: 'eslint-loader', 
        include: [
              path.resolve(__dirname, 'test'), 
              path.resolve(__dirname, 'src')
            ],
        exclude: /node_modules/
      }
    ],
    loaders: [
      { 
        test: /\.js$/, 
        loader: 'babel-loader',
        include: [
              path.resolve(__dirname, 'test'), 
              path.resolve(__dirname, 'src')
            ],
        exclude: /node_modules/
      },
      { 
        test: /\.json$/, 
        loader: 'json-loader',
        include: path.resolve(__dirname, 'test')
      }
    ]
  }
}

