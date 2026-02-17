import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook-community/storybook-dark-mode',
		'storybook-addon-tag-badges'
	],
	framework: '@storybook/react-vite',
	tags: {
		unit: {
			defaultFilterSelection: 'exclude'
		}
	}
}
export default config
