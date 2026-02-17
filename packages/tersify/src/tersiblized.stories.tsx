import { defineDocsParam, StoryCard, showDocSource, withStoryCard } from '@repobuddy/storybook'
import type { Meta, StoryObj } from '@repobuddy/storybook/storybook-addon-tag-badges'
import dedent from 'dedent'
import { Tersiblized } from '#tersify'
import source from './tersiblized.ts?raw'

const meta = {
	title: 'Tersiblized',
	tags: ['func', 'version:next'],
	parameters: defineDocsParam({
		description: {
			component:
				'Creates a mixin class that extends a base class with a .tersify() method using a custom implementation.'
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
					<code>Tersiblized(Base, tersify)</code> returns a class that extends <code>Base</code> with a{' '}
					<code>.tersify(options?)</code> method. Use it when you want a class (not a plain object) whose
					instances want a custom terse representation.
				</p>
			)
		}),
		showDocSource()
	]
}

export const TersiblizedPoint: Story = {
	tags: ['props'],
	name: 'Tersiblized(Base, tersify)',
	parameters: defineDocsParam({
		description: {
			story: 'Create a class whose instances have .tersify() using a custom implementation.'
		},
		source: {
			code: dedent`const Point = Tersiblized(
				class { constructor(public x: number, public y: number) {} },
				function (this: { x: number; y: number }) {
					return \`Point(\${this.x},\${this.y})\`
				}
			)
			const p = new Point(3, 4)
			p.tersify()`
		}
	}),
	decorators: [withStoryCard(), showDocSource({ placement: 'before' })],
	render: () => {
		const Point = Tersiblized(
			class {
				constructor(
					public x: number,
					public y: number
				) {}
			},
			function (this: { x: number; y: number }) {
				return `Point(${this.x},${this.y})`
			}
		)
		const p = new Point(3, 4)
		return (
			<StoryCard appearance="output">
				<pre>{p.tersify()}</pre>
			</StoryCard>
		)
	}
}

export const TersiblizedWithOptions: Story = {
	tags: ['props'],
	name: 'Tersiblized(Base, tersify(options))',
	parameters: defineDocsParam({
		description: {
			story:
				'The custom tersify function can accept optional TersifyOptions (e.g. maxLength) and use them in the output.'
		},
		source: {
			code: dedent`const Point = Tersiblized(
				class { constructor(public x: number, public y: number) {} },
				function (this: { x: number; y: number }, opts?: { maxLength?: number }) {
					const s = \`Point(\${this.x},\${this.y})\`
					return (opts?.maxLength && s.length > opts.maxLength) ? s.slice(0, opts.maxLength) + '…' : s
				}
			)
			new Point(1, 2).tersify({ maxLength: 8 })`
		}
	}),
	decorators: [withStoryCard(), showDocSource({ placement: 'before' })],
	render: () => {
		const Point = Tersiblized(
			class {
				x: number
				y: number
				constructor(x: number, y: number) {
					this.x = x
					this.y = y
				}
			},
			function (this: { x: number; y: number }, opts?: { maxLength?: number }) {
				const s = `Point(${this.x},${this.y})`
				return opts?.maxLength && s.length > opts.maxLength ? s.slice(0, opts.maxLength) + '…' : s
			}
		)
		const p = new Point(1, 2)
		return (
			<StoryCard appearance="output">
				<pre>{p.tersify({ maxLength: 8 })}</pre>
			</StoryCard>
		)
	}
}
