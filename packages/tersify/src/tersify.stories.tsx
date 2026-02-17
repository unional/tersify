import { defineDocsParam, StoryCard, showDocSource, withStoryCard } from '@repobuddy/storybook'
import type { Meta, StoryObj } from '@repobuddy/storybook/storybook-addon-tag-badges'
import { tersible } from './tersible.js'
import { tersify } from './tersify.js'
import source from './tersify.ts?raw'

const meta = {
	title: 'tersify',
	tags: ['func', 'version:next'],
	parameters: defineDocsParam({
		description: {
			component:
				'Creates a terse string representation of any value (primitives, objects, arrays, functions, etc.).'
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
					<code>tersify(value, options?)</code> returns a short, readable string for any JavaScript value,
					respecting <code>maxLength</code> and custom <code>.tersify()</code> on objects.
				</p>
			)
		}),
		showDocSource()
	]
}

export const Primitives: Story = {
	tags: ['props'],
	parameters: defineDocsParam({
		description: {
			story: 'Primitive values are stringified as-is (strings quoted).'
		},
		source: {
			code: `tersify(1)           // "1"
tersify('hello')     // "'hello'"
tersify(null)       // "null"
tersify(undefined)  // "undefined"
tersify(true)       // "true"`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => (
		<StoryCard appearance="output">
			<pre>{[tersify(1), tersify('hello'), tersify(null), tersify(undefined), tersify(true)].join('\n')}</pre>
		</StoryCard>
	)
}

export const ObjectExample: Story = {
	tags: ['props'],
	name: 'Object',
	parameters: defineDocsParam({
		description: {
			story: 'Objects are shown as { key: value, ... } with length trimming.'
		},
		source: {
			code: `tersify({ a: 1, b: 2 })
tersify({ a: 1, b: 2 }, { maxLength: 15 })`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => (
		<StoryCard appearance="output">
			<pre>
				{tersify({ a: 1, b: 2 })}
				{'\n'}
				{tersify({ a: 1, b: 2 }, { maxLength: 15 })}
			</pre>
		</StoryCard>
	)
}

export const ArrayExample: Story = {
	tags: ['props'],
	name: 'Array',
	parameters: defineDocsParam({
		description: {
			story: 'Arrays are shown as [ item, ... ] with circular reference support.'
		},
		source: {
			code: `tersify([1, 2, 3])
tersify([1, 2, 3, 4, 5], { maxLength: 20 })`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => (
		<StoryCard appearance="output">
			<pre>
				{tersify([1, 2, 3])}
				{'\n'}
				{tersify([1, 2, 3, 4, 5], { maxLength: 20 })}
			</pre>
		</StoryCard>
	)
}

export const FunctionExample: Story = {
	tags: ['props'],
	name: 'Function',
	parameters: defineDocsParam({
		description: {
			story: 'Functions are parsed and shown in a compact form (source-based when possible).'
		},
		source: {
			code: `tersify(function add(a, b) { return a + b })
tersify((x, y) => x * y)`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => (
		<StoryCard appearance="output">
			<pre>
				{tersify(function add(a: number, b: number) {
					return a + b
				})}
				{'\n'}
				{tersify((x: number, y: number) => x * y)}
			</pre>
		</StoryCard>
	)
}

export const MaxLengthOption: Story = {
	tags: ['props'],
	name: 'options.maxLength',
	parameters: defineDocsParam({
		description: {
			story: 'maxLength truncates the output with "..." when exceeded.'
		},
		source: {
			code: 'tersify({ a: 1, b: 2, c: 3 }, { maxLength: 20 })'
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => (
		<StoryCard appearance="output">
			<pre>{tersify({ a: 1, b: 2, c: 3 }, { maxLength: 20 })}</pre>
		</StoryCard>
	)
}

export const RawOption: Story = {
	tags: ['props'],
	name: 'options.raw',
	parameters: defineDocsParam({
		description: {
			story:
				'raw: true skips custom .tersify() on values and uses full forms (e.g. Symbol(...) instead of Sym(...)), so the result is parseable JavaScript.'
		},
		source: {
			code: `// Symbol: full form with raw
tersify(Symbol('x'))              // "Sym(x)"
tersify(Symbol('x'), { raw: true })  // "Symbol(x)"

// Object with custom .tersify(): raw skips it
const obj = tersible({ a: 1 }, '<custom>')
tersify(obj)                      // "<custom>"
tersify(obj, { raw: true })       // "{ a: 1 }"`
		}
	}),
	decorators: [withStoryCard(), showDocSource()],
	render: () => {
		const obj = tersible({ a: 1 }, '<custom>')
		return (
			<StoryCard appearance="output">
				<pre>
					{tersify(Symbol('x'))}
					{'\n'}
					{tersify(Symbol('x'), { raw: true })}
					{'\n\n'}
					{tersify(obj)}
					{'\n'}
					{tersify(obj, { raw: true })}
				</pre>
			</StoryCard>
		)
	}
}
