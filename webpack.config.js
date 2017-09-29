var webpack = require('webpack');
var path = require('path');
var compileMod = require('./plugin/compileMod')
  // webpack.config.js
  console.log(__dirname)
  module.exports = {
    context: __dirname + "/src/",
    entry: __dirname + "/src/main.ts",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
    },
    target: 'node',
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ]
    },
    module: {
      loaders: [
        // note that babel-loader is configured to run after ts-loader
        { test: /\.ts(x?)$/, loader: 'babel-loader!ts-loader', exclude: /node_modules/ }
      ]
    },
    plugins: [
      new compileMod({options: 'nada'})
    ]
  }