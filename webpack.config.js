'use strict';
const paramCase = require('param-case').paramCase
const pascalCase = require('pascal-case').pascalCase
const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const pkg = require('./package.json')

const filename = paramCase(pkg.name)
const library = pascalCase(filename)

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './ts/index',
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.tsx?$/,
        options: {
          configFile: 'tsconfig.cjs.json',
          transpileOnly: true
        }
      }
    ]
  },
  // optimization: {
  //   minimize: false
  // },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ],
  output: {
    path: path.resolve('dist'),
    filename: `${filename}.es5.js`,
    library
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ['browser', 'main']
  }
}
