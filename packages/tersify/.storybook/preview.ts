import { defineParameters } from '@repobuddy/storybook'
import type { Preview } from '@storybook/react-vite'
import { defineDarkModeParam } from '@storybook-community/storybook-dark-mode'

import './tailwind.css'
import './tailwind.repobuddy-storybook.css'

const preview: Preview = {
	parameters: defineParameters(
		{
			controls: {
				matchers: {
					color: /(background|color)$/i,
					date: /Date$/i
				}
			},
			a11y: {
				test: 'todo'
			},
			docs: {
				codePanel: true
			}
		},
		defineDarkModeParam({
			classTarget: 'html',
			stylePreview: true,
			darkClass: ['dark', 'bg-black', 'text-white']
		})
	)
}

export default preview
