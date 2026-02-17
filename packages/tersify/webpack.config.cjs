const paramCase = require('param-case').paramCase
const pascalCase = require('pascal-case').pascalCase
const path = require('node:path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { NormalModuleReplacementPlugin } = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const pkg = require('./package.json')

const filename = paramCase(pkg.name)
const library = pascalCase(filename)

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: './src/index',
	module: {
		rules: [
			{
				loader: 'ts-loader',
				test: /\.ts$/,
				options: {
					configFile: 'tsconfig.esm.json'
					// transpileOnly: true
				}
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader']
			}
		]
	},
	optimization: {
		minimize: true
	},
	output: {
		path: path.resolve('dist'),
		filename: `${filename}.es5.js`,
		library
	},
	plugins: [
		new CleanWebpackPlugin(),
		new NormalModuleReplacementPlugin(/.js$/, resource => {
			if (/node_modules/.test(resource.context)) return
			resource.request = resource.request.replace(/.js$/, '')
		})
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		mainFields: ['browser', 'main']
	}
}
