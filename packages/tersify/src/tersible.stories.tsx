import { defineDocsParam, StoryCard, showDocSource, withStoryCard } from '@repobuddy/storybook'
import type { Meta, StoryObj } from '@repobuddy/storybook/storybook-addon-tag-badges'
import dedent from 'dedent'
import { tersible } from '#tersify'
import source from './tersible.ts?raw'

const meta = {
	title: 'tersible',
	tags: ['func', 'version:next'],
	parameters: defineDocsParam({
		description: {
			component:
				'Adds a .tersify() method to objects or classes so they can customize their terse representation.'
		}
	}),
	render: () => <></>
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Specification: Story = {
	tags: ['source'],
	parameters: defineDocsParam({
		source: { code: source }
	}),
	decorators: [
		withStoryCard({
			content: (
				<p>
					<code>tersible(subject, tersify?)</code> injects <code>.tersify()</code> into the subject.
				</p>
			)
		}),
		showDocSource()
	]
}

export const TersibleObject: Story = {
	tags: ['props'],
	name: 'tersible(object)',
	parameters: defineDocsParam({
		description: {
			story: 'Inject a custom .tersify() into a plain object. When omitted, default tersify is used.'
		},
		source: {
			code: dedent`
			const point = tersible(
				{ x: 1, y: 2 },
				function (this: { x: number; y: number }) {
					return \`Point(\${this.x},\${this.y})\`
				}
			)
			point.tersify()`
		}
	}),
	decorators: [withStoryCard(), showDocSource({ placement: 'before' })],
	render: () => {
		const point = tersible({ x: 1, y: 2 }, function (this: { x: number; y: number }) {
			return `Point(${this.x},${this.y})`
		})
		return (
			<StoryCard appearance="output">
				<pre>{point.tersify()}</pre>
			</StoryCard>
		)
	}
}

export const TersibleFunction: Story = {
	tags: ['props'],
	name: 'tersible(function)',
	parameters: defineDocsParam({
		description: {
			story: 'Inject a custom .tersify() into a function. When omitted, default tersify is used.'
		},
		source: {
			code: dedent`
			const add = tersible(
				function add(a: number, b: number) {
					return a + b
				},
				() => 'add(a, b)'
			)
			add.tersify()`
		}
	}),
	decorators: [withStoryCard(), showDocSource({ placement: 'before' })],
	render: () => {
		const add = tersible(
			function add(a: number, b: number) {
				return a + b
			},
			() => 'add(a, b)'
		)
		return (
			<StoryCard appearance="output">
				<pre>{add.tersify()}</pre>
			</StoryCard>
		)
	}
}
