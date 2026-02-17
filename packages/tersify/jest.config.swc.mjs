/** @type {import('jest').Config} */
export default {
	displayName: 'swc',
	preset: '@repobuddy/jest/presets/ts-esm',
	transform: {
		'^.+\\.(t|j)sx?$': ['@swc/jest']
	}
}
