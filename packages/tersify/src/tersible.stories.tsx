import { defineDocsParam, StoryCard, showDocSource, withStoryCard } from '@repobuddy/storybook'
import type { Meta, StoryObj } from '@repobuddy/storybook/storybook-addon-tag-badges'
import { Tersiblized, tersible } from './tersible.js'
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
					<code>tersible(subject, tersify?)</code> injects <code>.tersify()</code> into an object.{' '}
					<code>Tersiblized(Base, tersify)</code> returns a class that extends Base with{' '}
					<code>.tersify()</code>.
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
			code: `const point = tersible({ x: 1, y: 2 }, function () { return \`Point(\${this.x},\${this.y})\` })
point.tersify()  // "Point(1,2)"`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
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

export const TersiblizedClass: Story = {
	tags: ['props'],
	name: 'Tersiblized(Base, tersify)',
	parameters: defineDocsParam({
		description: {
			story: 'Create a class whose instances have .tersify() using a custom implementation.'
		},
		source: {
			code: `const Point = Tersiblized(
  class { constructor(public x: number, public y: number) {} },
  function () { return \`Point(\${this.x},\${this.y})\` }
)
const p = new Point(3, 4)
p.tersify()  // "Point(3,4)"`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
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
