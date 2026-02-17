import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		include: ['src/**/*.spec.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'lcov'],
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.spec.ts', 'src/**/*.spec.*.ts']
		},
		projects: [
			// { test: { name: 'node', environment: 'node' } }
			{ test: { name: 'jsdom', environment: 'jsdom' } }
		]
	}
})
