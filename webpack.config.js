var webpack = require('webpack');
var path = require('path');
  // webpack.config.js
  module.exports = {
    context: __dirname + "/src/",
    entry: __dirname + "/src/main.ts",
    output: {
        path: __dirname + "/dist",
        filename: "jhcr.js",
    },
    target: 'node',
    resolve: {
      extensions: [".ts"]
    },
    module: {
      loaders: [
        // note that babel-loader is configured to run after ts-loader
        { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
      ]
    },
    watch: true
  }