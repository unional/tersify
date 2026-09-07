// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://cyberuni.github.io',
	base: '/tersify/',
	vite: {
		plugins: [tailwindcss()]
	},
	integrations: [
		starlight({
			title: 'tersify',
			description: 'Creates a terse string representation of any JavaScript value.',
			// The cyber-* family mark: a shared command reticle around a per-package glyph
			// (see docs/design/icon-system.md in cyberuni/cyber-mux).
			//
			// The favicon self-themes: browser chrome follows the OS, so that one file
			// flips its own fill under `prefers-color-scheme` and needs no pair.
			//
			// The header logo cannot. Starlight switches on `data-theme`, which this site
			// defaults to dark independent of the OS — a single self-theming file renders
			// black on the dark header whenever the visitor's OS is set to light. So the
			// header ships as a pair and lets Starlight pick.
			favicon: '/img/logo.svg',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				alt: 'tersify'
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/cyberuni/tersify'
				}
			],
			customCss: ['./src/styles/global.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' }
					]
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Options', slug: 'guides/options' },
						{ label: 'Custom output', slug: 'guides/custom-output' },
						{ label: 'Circular references', slug: 'guides/circular-references' }
					]
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Overview', slug: 'reference' },
						{ label: 'tersify', slug: 'reference/tersify' },
						{ label: 'tersible', slug: 'reference/tersible' },
						{ label: 'Tersiblized', slug: 'reference/tersiblized' },
						{ label: 'TersifyOptions', slug: 'reference/tersify-options' },
						{ label: 'Tersible', slug: 'reference/tersible-type' }
					]
				}
			]
		})
	]
})
