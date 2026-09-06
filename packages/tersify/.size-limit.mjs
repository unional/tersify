/** Node platform keeps `acorn` in the bundle; browser resolves the `browser` field and drops it. */
const nodePlatform = config => {
	config.platform = 'node'
	return config
}

export default [
	{
		name: 'cjs (browser)',
		path: './cjs/index.cjs',
		limit: '5 kB'
	},
	{
		name: 'esm (browser)',
		path: './esm/index.mjs',
		limit: '5 kB'
	},
	{
		name: 'cjs (node)',
		path: './cjs/index.cjs',
		limit: '40 kB',
		modifyEsbuildConfig: nodePlatform
	},
	{
		name: 'esm (node)',
		path: './esm/index.mjs',
		limit: '40 kB',
		modifyEsbuildConfig: nodePlatform
	}
]
