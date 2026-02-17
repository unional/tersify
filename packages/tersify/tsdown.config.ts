import { defineConfig } from 'tsdown'

export default defineConfig([
	{
		entry: ['src/index.ts', 'src/constants.browser.ts', 'src/tersifyFunction.browser.ts'],
		format: 'esm',
		outDir: 'esm',
		clean: true,
		dts: true,
		sourcemap: true,
		unbundle: true
	},
	{
		entry: ['src/index.ts', 'src/constants.browser.ts', 'src/tersifyFunction.browser.ts'],
		format: 'cjs',
		outDir: 'cjs',
		clean: true,
		dts: true,
		sourcemap: true,
		unbundle: true
	}
])
