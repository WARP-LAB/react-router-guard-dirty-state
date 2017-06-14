'use strict';
const path = require('path');
const webpack = require('webpack');

// ----------------
// ENV
const development = process.env.NODE_ENV === 'development';
const production = process.env.NODE_ENV === 'production';
console.log('ENVIRONMENT \x1b[36m%s\x1b[0m', process.env.NODE_ENV);

// ----------------
// SOURCE MAP CONF
const sourceMapType = (development) ? 'inline-source-map' : false;

// ----------------
// BASE CONFIG

let config = {
  devtool: sourceMapType,
  target: 'web',
  context: __dirname,
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  entry: {
    index: path.join(__dirname, 'src/index.jsx')
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [
      path.resolve('./src/'),
      'src',
      'node_modules',
      'bower_components'
    ]
  }
};

// ----------------
// MODULE RULES

config.module = {
  rules: [
    {
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      loader: 'eslint-loader',
      options: {
        emitError: true,
        emitWarning: true,
        quiet: false,
        failOnWarning: !development,
        failOnError: !development,
        outputReport: false
      }
    },
    {
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      use: 'babel-loader'
    }
  ]
};

// ----------------
// PLUGINS
config.plugins = [];

// ----------------
// WEBPACK DEFINE PLUGIN
// define environmental variables into scripts

config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  'process.env.BROWSER': true,
  __CLIENT__: true,
  __SERVER__: false,
  __DEV__: development,
  __DEVELOPMENT__: development,
  __DEVTOOLS__: development,
  __PRODUCTION__: production
}));

// ----------------
// WEBPACK BUILT IN OPTIMIZATION

if (production) {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}));
  config.plugins.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true,
      warnings: false
    },
    mangle: false,
    beautify: false,
    output: {
      space_colon: false,
      comments: false
    },
    extractComments: false,
    sourceMap: sourceMapType
  }));
}

// ----------------
// BABEL CONFIG

// defined in .babelrc

// ----------------
// ESLINT CONFIG

// defined in .eslintrc.js

module.exports = config;
