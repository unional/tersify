import { tersify } from './index.js'

it('works with instance property', () => {
	class Circular {
		instance?: Circular
	}
	const instance = new Circular()
	instance.instance = instance

	expect(tersify(instance)).toBe('Circular { instance: ref() }')
})

it('works with object', () => {
	const a: any = {}
	const b: any = { a }
	b.c = { a, b }
	a.c = { a, b }

	expect(tersify(a)).toBe('{ c: { a: ref(), b: { a: ref(), c: { a: ref(), b: ref(c, b) } } } }')
})
