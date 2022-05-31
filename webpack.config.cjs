'use strict';
const paramCase = require('param-case').paramCase
const pascalCase = require('pascal-case').pascalCase
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { NormalModuleReplacementPlugin } = require('webpack');
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
        test: /\.ts$/,
        options: {
          configFile: 'tsconfig.cjs.json',
          transpileOnly: true
        }
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        options:
        {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript'
          ],
          plugins: ['@babel/plugin-transform-modules-commonjs']
        }
      },
      // {
      //   test: /\.[jt]s$/,
      //   enforce: 'pre',
      //   use: ['source-map-loader'],
      // },
    ]
  },
  optimization: {
    minimize: true,
  },
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ],
  output: {
    path: path.resolve('dist'),
    filename: `${filename}.es5.js`,
    library
  },
  plugins: [
    new CleanWebpackPlugin(),
    new NormalModuleReplacementPlugin(/.js$/, (resource) => {
      resource.request = resource.request.replace(/.js$/, '')
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ['browser', 'main']
  }
}
