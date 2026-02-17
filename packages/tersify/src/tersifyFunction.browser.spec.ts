import { unpartial } from 'unpartial'
import { describe, expect, test } from 'vitest'
import { tersible } from './tersible.js'
import { tersifyFunction } from './tersifyFunction.browser.js'
import { TersifyOptions } from './types.js'
import { TersifyContext } from './typesInternal.js'

describe('function', () => {
	test('anonymous with no return', () => {
		expect(testFunction(function () {})).toBe('fn() {}')
		expect(testFunction(function () {}, { maxLength: 7 })).toBe('fn() {}')
		expect(testFunction(function () {}, { maxLength: 6 })).toBe('fn(...')
		expect(testFunction(function () {}, { maxLength: 5 })).toBe('fn...')
		expect(testFunction(function () {}, { maxLength: 4 })).toBe('fn..')
		expect(testFunction(function () {}, { maxLength: 3 })).toBe('fn.')
		expect(testFunction(function () {}, { maxLength: 2 })).toBe('f.')
		expect(testFunction(function () {}, { maxLength: 1 })).toBe('.')
		expect(testFunction(function () {}, { maxLength: 0 })).toBe('')
	})

	test(`raw mode returns using fn.toString()`, () => {
		expect(testFunction(function () {}, { raw: true })).toBe(function () {}.toString())
	})

	test('single param', () => {
		expect(testFunction(function (a) {})).toBe('fn(a) {}')
	})

	test('multiple params', () => {
		expect(testFunction(function (a, b, c) {})).toBe('fn(a, b, c) {}')
	})

	test('not enough length will first trim params before body', () => {
		expect(
			testFunction(function (a, b, c) {
				return undefined
			})
		).toBe('fn(a, b, c) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 33 }
			)
		).toBe('fn(a, b, c) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 32 }
			)
		).toBe('fn(a, ...) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 31 }
			)
		).toBe('fn(a,...) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 30 }
			)
		).toBe('fn(a,..) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 29 }
			)
		).toBe('fn(a,.) { return undefined; }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 28 }
			)
		).toBe('fn(a,.) { return undefi... }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 17 }
			)
		).toBe('fn(a,.) { re... }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 16 }
			)
		).toBe('fn(a,.) { re.. }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 15 }
			)
		).toBe('fn(a,.) { re. }')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 14 }
			)
		).toBe('fn(a,.) { r...')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 13 }
			)
		).toBe('fn(a,.) { ...')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 5 }
			)
		).toBe('fn...')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 4 }
			)
		).toBe('fn..')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 3 }
			)
		).toBe('fn.')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 2 }
			)
		).toBe('f.')
		expect(
			testFunction(
				function (a, b, c) {
					return undefined
				},
				{ maxLength: 1 }
			)
		).toBe('.')
	})

	test('named function with too long signature', () => {
		const actual = testFunction(
			function veryVeryVeryVeryLongNameFunction(a, b, c, d, e, f, g) {
				return a + b + c + d + e + f + g
			},
			{ maxLength: 50 }
		)

		expect(actual).toBe('fn veryVeryVeryVeryLongNameFunction(a,.) { re... }')
	})

	test('default param', () => {
		expect(testFunction(function (a = '1') {})).toBe(`fn(a = '1') {}`)
	})

	test('off order default param', () => {
		expect(testFunction(function (a = 1, b) {})).toBe('fn(a = 1, b) {}')
	})

	test('rest param', () => {
		expect(testFunction(function (a, ...b) {})).toBe(`fn(a, ...b) {}`)
	})

	test('multiple statements', () => {
		expect(
			testFunction(function () {
				console.info('a')
				return 'b'
			})
		).toBe(`fn() { console.info('a'); return 'b'; }`)
	})

	test('deep reference', () => {
		const a = { b: { c: { d: false } } }
		expect(
			testFunction(function () {
				return a.b.c.d
			})
		).toBe(`fn() { return a.b.c.d; }`)
	})

	test('anonymous returns nothing', () => {
		expect(
			testFunction(function () {
				return
			})
		).toBe('fn() {}')
	})

	test(`returns undefined`, () => {
		expect(
			testFunction(function () {
				return undefined
			})
		).toBe('fn() { return undefined; }')
		expect(
			testFunction(
				function () {
					return undefined
				},
				{ maxLength: 26 }
			)
		).toBe('fn() { return undefined; }')
		expect(
			testFunction(
				function () {
					return undefined
				},
				{ maxLength: 25 }
			)
		).toBe('fn() { return undefi... }')
	})

	test(`returns null`, () => {
		expect(
			testFunction(function () {
				return null
			})
		).toBe('fn() { return null; }')
		expect(
			testFunction(
				function () {
					return null
				},
				{ maxLength: 21 }
			)
		).toBe('fn() { return null; }')
		expect(
			testFunction(
				function () {
					return null
				},
				{ maxLength: 20 }
			)
		).toBe('fn() { return n... }')
	})

	test(`returns boolean`, () => {
		expect(
			testFunction(function () {
				return true
			})
		).toBe('fn() { return true; }')
		expect(
			testFunction(
				function () {
					return true
				},
				{ maxLength: 21 }
			)
		).toBe('fn() { return true; }')
		expect(
			testFunction(
				function () {
					return true
				},
				{ maxLength: 20 }
			)
		).toBe('fn() { return t... }')

		expect(
			testFunction(function () {
				return false
			})
		).toBe('fn() { return false; }')
		expect(
			testFunction(
				function () {
					return false
				},
				{ maxLength: 22 }
			)
		).toBe('fn() { return false; }')
		expect(
			testFunction(
				function () {
					return false
				},
				{ maxLength: 21 }
			)
		).toBe('fn() { return fa... }')
	})

	test(`returns number`, () => {
		expect(
			testFunction(function () {
				return 1
			})
		).toBe('fn() { return 1; }')
		expect(
			testFunction(
				function () {
					return 1
				},
				{ maxLength: 18 }
			)
		).toBe('fn() { return 1; }')
		expect(
			testFunction(
				function () {
					return 1
				},
				{ maxLength: 17 }
			)
		).toBe('fn() { retur... }')
	})

	test(`returns bigint`, () => {
		expect(
			testFunction(function () {
				return 1n
			})
		).toBe('fn() { return 1n; }')
	})

	test(`returns string`, () => {
		expect(
			testFunction(function () {
				return 'a'
			})
		).toBe(`fn() { return 'a'; }`)
	})

	test(`returns Symbol`, () => {
		expect(
			testFunction(function () {
				return Symbol()
			})
		).toBe(`fn() { return Sym(); }`)
	})

	test(`returns named Symbol`, () => {
		expect(
			testFunction(function () {
				return Symbol.for('abc')
			})
		).toBe(`fn() { return Sym(abc); }`)
		// eslint-disable-next-line quotes
		expect(
			testFunction(function () {
				return Symbol.for('abc')
			})
		).toBe(`fn() { return Sym(abc); }`)
		expect(
			testFunction(function () {
				return Symbol.for(`abc`)
			})
		).toBe(`fn() { return Sym(abc); }`)
	})

	test(`returns RegExp`, () => {
		expect(
			testFunction(function () {
				return /foo/g
			})
		).toBe(`fn() { return /foo/g; }`)
	})

	test('returns new Date()', () => {
		expect(
			testFunction(function () {
				return new Date()
			})
		).toBe('fn() { return new Date(); }')
	})

	// test('returns Date constructed with string literal', () => {
	//   expect(testFunction(function () {
	//     return new Date('2020-05-14T11:45:27.234Z')
	//   })).toBe(`fn() { return 2020-05-14T11:45:27.234Z }`)

	//   expect(testFunction(function () {
	//     const date = new Date('2020-05-14T11:45:27.234Z')
	//     return date
	//   })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; return date }`)
	// })

	// test('returns Date constructed with year, month, ...etc', () => {
	//   expect(testFunction(function () {
	//     return new Date(2020, 4, 14)
	//   })).toMatch(/fn\(\) { return 2020-05-14T\d{2}:00:00.000Z }/)
	// })

	// test('returns Date with variable in constructor', () => {
	//   expect(testFunction(function () {
	//     let x = 1
	//     return new Date(2020, x)
	//   })).toBe(`fn() { let x = 1; return new Date(2020, x) }`)
	// })

	test('returns Buffer', () => {
		expect(
			testFunction(function () {
				return Buffer.from('abc')
			})
		).toBe(`fn() { return Buffer.from('abc'); }`)
	})

	test(`returns anonymous function`, () => {
		expect(
			testFunction(function () {
				return function () {}
			})
		).toBe(`fn() { return function () {}; }`)
	})

	test('returns anonymous function with single param', () => {
		expect(testFunction(function (x) {})).toBe('fn(x) {}')
	})

	test('returns anonymous function with multi-params', () => {
		expect(testFunction(function (x, y) {})).toBe('fn(x, y) {}')
	})

	test(`returns named function`, () => {
		expect(
			testFunction(function () {
				return function foo() {}
			})
		).toBe(`fn() { return function foo() {}; }`)
	})

	test(`returns arrow function`, () => {
		expect(
			testFunction(function () {
				return () => {}
			})
		).toBe(`fn() { return () => {}; }`)
	})

	test(`returns async anonymous function`, () => {
		expect(
			testFunction(function () {
				return async function () {}
			})
		).toBe(`fn() { return async function () {}; }`)
	})

	test(`returns async named function`, () => {
		expect(
			testFunction(function () {
				return async function foo() {}
			})
		).toBe(`fn() { return async function foo() {}; }`)
	})

	test(`returns async arrow function`, () => {
		expect(
			testFunction(function () {
				return async () => {}
			})
		).toBe(`fn() { return async () => {}; }`)
	})

	test(`returns generator anonymous function`, () => {
		expect(
			testFunction(function () {
				return function* () {}
			})
		).toBe(`fn() { return function* () {}; }`)
	})

	test(`returns generator named function`, () => {
		expect(
			testFunction(function () {
				return function* foo() {}
			})
		).toBe(`fn() { return function* foo() {}; }`)
	})

	test(`returns async generator anonymous function`, () => {
		expect(
			testFunction(function () {
				return async function* () {}
			})
		).toBe(`fn() { return async function* () {}; }`)
	})

	test(`returns async generator named function`, () => {
		expect(
			testFunction(function () {
				return async function* foo() {}
			})
		).toBe(`fn() { return async function* foo() {}; }`)
	})

	test('returns single property object', () => {
		expect(
			testFunction(function () {
				return { a: 1 }
			})
		).toBe('fn() { return { a: 1 }; }')
	})

	test('returns multiple property object', () => {
		expect(
			testFunction(function () {
				return { a: 1, b: 'b' }
			})
		).toBe(`fn() { return { a: 1, b: 'b' }; }`)
	})

	test('returns computed property object', () => {
		expect(
			testFunction(function () {
				const x = 'xyz'
				return { [x]: true }
			})
		).toBe(`fn() { const x = 'xyz'; return { [x]: true }; }`)

		expect(
			testFunction(function () {
				return { ['x']: true }
			})
		).toBe(`fn() { return { ['x']: true }; }`)
	})

	test('returns symbol property object', () => {
		expect(
			testFunction(function () {
				return { [Symbol()]: true }
			})
		).toBe(`fn() { return { [Sym()]: true }; }`)

		expect(
			testFunction(function () {
				return { [Symbol.for('abc')]: true }
			})
		).toBe(`fn() { return { [Sym(abc)]: true }; }`)

		expect(
			testFunction(function () {
				const tx = Symbol.for('abc')
				return { [tx]: true }
			})
		).toBe(`fn() { const tx = Sym(abc); return { [tx]: true }; }`)
	})

	test('returns method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: function () {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: function () { return 'abc'; } }; }`)
	})

	test('returns named method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: function foo() {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: function foo() { return 'abc'; } }; }`)
	})

	test('returns async method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: async function () {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: async function () { return 'abc'; } }; }`)
	})

	test('returns generator method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: function* () {
						yield 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: function* () { yield 'abc'; } }; }`)
	})

	test('returns async generator method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: async function* () {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: async function* () { return 'abc'; } }; }`)
	})

	test('returns es6 method property object', () => {
		expect(
			testFunction(function () {
				return {
					m() {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m() { return 'abc'; } }; }`)
	})

	test('returns async es6 method property object', () => {
		expect(
			testFunction(function () {
				return {
					async m() {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { async m() { return 'abc'; } }; }`)
	})

	test('returns generator es6 method property object', () => {
		expect(
			testFunction(function () {
				return {
					*m() {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { *m() { return 'abc'; } }; }`)
	})

	test('returns async generator es6 method property object', () => {
		expect(
			testFunction(function () {
				return {
					async *m() {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { async *m() { return 'abc'; } }; }`)
	})

	test('returns arrow method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: () => {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: () => { return 'abc'; } }; }`)
	})

	test('returns async arrow method property object', () => {
		expect(
			testFunction(function () {
				return {
					m: async () => {
						return 'abc'
					}
				}
			})
		).toBe(`fn() { return { m: async () => { return 'abc'; } }; }`)
	})

	test('return es6 simplified object', () => {
		expect(
			testFunction(function (x, y) {
				return { x, y }
			})
		).toBe('fn(x, y) { return { x, y }; }')
	})

	test('returns array', () => {
		expect(
			testFunction(function () {
				return []
			})
		).toBe(`fn() { return []; }`)
		expect(
			testFunction(function () {
				return [1, undefined, 'a']
			})
		).toBe(`fn() { return [1, undefined, 'a']; }`)
	})

	test('throws empty error', () => {
		expect(
			testFunction(function () {
				throw new Error()
			})
		).toBe(`fn() { throw new Error(); }`)
	})

	test('throws with message', () => {
		expect(
			testFunction(function () {
				throw new Error('abc')
			})
		).toBe(`fn() { throw new Error('abc'); }`)
	})

	test('with variable declaration', () => {
		const subject: any = function () {
			const value = 1234
			return value
		}
		expect(testFunction(subject)).toBe(`fn() { const value = 1234; return value; }`)
		expect(testFunction(subject, { maxLength: 42 })).toBe(`fn() { const value = 1234; return value; }`)
		expect(testFunction(subject, { maxLength: 14 })).toBe(`fn() { co... }`)
		expect(testFunction(subject, { maxLength: 13 })).toBe(`fn() { co.. }`)
	})

	test('with variable declaration but no init', () => {
		expect(
			testFunction(function () {
				let x
				return x
			})
		).toBe('fn() { let x; return x; }')
	})

	// tslint:disable: one-variable-per-declaration no-var-keyword
	test('with multi-variable declaration', () => {
		/* eslint-disable no-var */
		expect(
			testFunction(function () {
				var x: any, y: any
				return x + y
			})
		).toBe('fn() { var x, y; return x + y; }')
		/* eslint-enable no-var */
	})

	test('with prefix unary expression', () => {
		expect(
			testFunction(function () {
				return !!1
			})
		).toBe(`fn() { return true; }`)
		expect(
			testFunction(function () {
				return +1
			})
		).toBe(`fn() { return 1; }`)
	})

	// Can't think of a postfix unary expression. `x++` and `x--` are update expression.
	test.todo('with postfix unary expression')

	test('with logical expression', () => {
		expect(
			testFunction(function () {
				return 1 && 2
			})
		).toBe(`fn() { return 2; }`)
	})

	test('with binary expression', () => {
		expect(
			testFunction(function () {
				return (1 + 2) * 3
			})
		).toBe(`fn() { return (1 + 2) * 3; }`)
		expect(
			testFunction(function () {
				return 3 * (1 + 2)
			})
		).toBe(`fn() { return 3 * (1 + 2); }`)
	})

	test('with update expression', () => {
		let x
		expect(
			testFunction(function () {
				return ++x
			})
		).toBe(`fn() { return ++x; }`)
		expect(
			testFunction(function () {
				return x++
			})
		).toBe(`fn() { return x++; }`)
	})

	// test('with multi-variable declaration and init (and ternary expression)', () => {
	//   expect(testFunction(function () {
	//     // tslint:disable-next-line: one-variable-per-declaration
	//     let x = 1, y: any, z = 2
	//     return y ? x : z
	//   })).toBe('fn() { let x = 1, y, z = 2; return y ? x : z; }')
	// })

	test('with if statement', () => {
		expect(
			testFunction(function (x) {
				if (x) {
					return true
				} else {
					return false
				}
			})
		).toBe('fn(x) { if (x) { return true; } else { return false; } }')

		expect(
			testFunction(function (x) {
				if (x) return true
				else return false
			})
		).toBe('fn(x) { if (x) return true; else return false; }')
		expect(
			testFunction(function (x) {
				if (x) return true
				else {
					return false
				}
			})
		).toBe('fn(x) { if (x) return true; else { return false; } }')

		expect(
			testFunction(function (x) {
				if (x) {
					return true
				}
				return false
			})
		).toBe('fn(x) { if (x) { return true; } return false; }')

		expect(
			testFunction(function (x) {
				if (x) return true
				return false
			})
		).toBe('fn(x) { if (x) return true; return false; }')
	})

	test('with assignment', () => {
		expect(
			testFunction(function (x) {
				return (x %= 1)
			})
		).toBe('fn(x) { return x %= 1; }')
	})

	test('with while loop', () => {
		expect(
			testFunction(function (x) {
				while (x) {
					x -= 1
				}
			})
		).toBe('fn(x) { while (x) { x -= 1; } }')

		expect(
			testFunction(function (x) {
				while (true) x -= 1
			})
		).toBe('fn(x) { while (true) x -= 1; }')
	})

	test('with do loop', () => {
		expect(
			testFunction(function (x) {
				do {
					x -= 1
				} while (x)
			})
		).toBe('fn(x) { do { x -= 1; } while (x); }')

		expect(
			testFunction(function (x) {
				do x -= 1
				while (x)
			})
		).toBe('fn(x) { do x -= 1; while (x); }')
	})

	test('with for loop', () => {
		expect(
			testFunction(function () {
				for (let i = 0; i < 10; i++) {
					console.info(i)
				}
			})
		).toBe('fn() { for (let i = 0; i < 10; i++) { console.info(i); } }')
	})

	test('with for loop no init', () => {
		expect(
			testFunction(function () {
				let i = 0
				for (; i < 10; i++) {
					console.info(i)
				}
			})
		).toBe('fn() { let i = 0; for (; i < 10; i++) { console.info(i); } }')
	})

	test('with for loop no test', () => {
		expect(
			testFunction(function () {
				for (let i = 0; ; i++) {
					console.info(i)
				}
			})
		).toBe('fn() { for (let i = 0;; i++) { console.info(i); } }')
	})

	test('with for loop no update', () => {
		expect(
			testFunction(function () {
				for (let i = 0, y = 1; i < 10; ) {
					console.info(i, y)
				}
			})
		).toBe('fn() { for (let i = 0, y = 1; i < 10;) { console.info(i, y); } }')
	})

	test('with for loop with break', () => {
		expect(
			testFunction(function () {
				for (;;) {
					break
				}
			})
		).toBe('fn() { for (;;) { break; } }')
	})

	test('with for loop with labeled break', () => {
		expect(
			testFunction(function () {
				label: for (;;) {
					break label
				}
			})
		).toBe(`fn() { label: for (;;) { break label; } }`)
	})

	test('with for loop with continue', () => {
		expect(
			testFunction(function () {
				for (;;) {
					continue
				}
			})
		).toBe(`fn() { for (;;) { continue; } }`)
	})

	test('with for loop with labeled continue', () => {
		expect(
			testFunction(function () {
				foo: for (;;) {
					continue foo
				}
			})
		).toBe(`fn() { foo: for (;;) { continue foo; } }`)
	})

	test('with switch', () => {
		expect(
			testFunction(function (x) {
				switch (x) {
					case 1:
						break
					case 2:
						return
					default:
						return 3
				}
			})
		).toBe(`fn(x) { switch (x) { case 1: break; case 2:  default: return 3; } }`)
	})

	test('with switch using expression', () => {
		expect(
			testFunction(function (x) {
				switch (true) {
					case x > 1:
						break
				}
			})
		).toBe(`fn(x) { switch (true) { case x > 1: break; } }`)
	})

	test('with for in', () => {
		expect(
			testFunction(function (x) {
				for (let y in x) console.info(y)
			})
		).toBe(`fn(x) { for (let y in x) console.info(y); }`)

		expect(
			testFunction(function (x) {
				for (let y in x) {
					console.info(y + 1)
					console.info(y)
				}
			})
		).toBe(`fn(x) { for (let y in x) { console.info(y + 1); console.info(y); } }`)
	})

	test('with for of', () => {
		expect(
			testFunction(function (x) {
				for (let y of x) console.info(y)
			})
		).toBe(`fn(x) { for (let y of x) console.info(y); }`)

		expect(
			testFunction(function (x) {
				for (let y of x) {
					console.info(y + 1)
					console.info(y)
				}
			})
		).toBe(`fn(x) { for (let y of x) { console.info(y + 1); console.info(y); } }`)
	})

	test('with try catch finally', () => {
		expect(
			testFunction(function () {
				try {
					return 1
				} catch (e) {
					return e
				} finally {
					console.info(3)
				}
			})
		).toBe(`fn() { try { return 1; } catch (e) { return e; } finally { console.info(3); } }`)
	})

	// The output of this is not optimal as Acorn does not support es2019
	// TODO: use Acron for try catch with no error declaration when it is supported
	test('with try catch finally an no error declaration', () => {
		expect(
			testFunction(function () {
				try {
					return 1
				} catch {
					return 2
				} finally {
					console.info(3)
				}
			})
		).toBe(`fn() { try { return 1; } catch { return 2; } finally { console.info(3); } }`)
	})

	test('with void operator', () => {
		expect(
			testFunction(function () {
				return void 0
			})
		).toBe(`fn() { return undefined; }`)
	})

	test(`async function`, () => {
		const x = Promise.resolve()
		expect(
			testFunction(async function () {
				await x
			})
		).toBe('async fn() { await x; }')
	})

	test('anonymous generator function', () => {
		expect(testFunction(function* () {})).toBe('fn*() {}')
	})

	test('named function', () => {
		const subject = function name() {}
		// expect(testFunction(subject)).toBe('fn name() {}')
		expect(testFunction(subject, { maxLength: 11 })).toBe('fn name(...')
	})
})

describe('arrow function', () => {
	test('with no return', () => {
		expect(testFunction(() => {})).toBe('() => {}')
		expect(testFunction(() => {}, { maxLength: 8 })).toBe('() => {}')
		expect(testFunction(() => {}, { maxLength: 7 })).toBe('() =...')
		expect(testFunction(() => {}, { maxLength: 6 })).toBe('() ...')
		expect(testFunction(() => {}, { maxLength: 5 })).toBe('()...')
		expect(testFunction(() => {}, { maxLength: 4 })).toBe('()..')
		expect(testFunction(() => {}, { maxLength: 3 })).toBe('().')
		expect(testFunction(() => {}, { maxLength: 2 })).toBe('(.')
		expect(testFunction(() => {}, { maxLength: 1 })).toBe('.')
		expect(testFunction(() => {}, { maxLength: 0 })).toBe('')
	})

	test('single statement', () => {
		expect(testFunction(() => true)).toBe('() => true')
		expect(testFunction(() => true, { maxLength: 9 })).toBe('() => tr.')
	})

	test('returns nothing', () => {
		expect(
			testFunction(() => {
				return
			})
		).toBe('() => {}')
	})

	test('returns undefined', () => {
		expect(
			testFunction(() => {
				return undefined
			})
		).toBe('() => undefined')
	})

	test('returns null', () => {
		expect(
			testFunction(() => {
				return null
			})
		).toBe('() => null')
	})

	test('returns boolean', () => {
		expect(
			testFunction(() => {
				return true
			})
		).toBe('() => true')
		expect(
			testFunction(() => {
				return false
			})
		).toBe('() => false')
	})

	test('returns number', () => {
		expect(
			testFunction(() => {
				return 1
			})
		).toBe('() => 1')
	})

	test('returns bigint', () => {
		expect(
			testFunction(() => {
				return 1n
			})
		).toBe('() => 1n')
	})

	test('returns string', () => {
		expect(
			testFunction(() => {
				return 'a'
			})
		).toBe(`() => 'a'`)
	})

	test('returns Symbol', () => {
		expect(
			testFunction(() => {
				return Symbol()
			})
		).toBe(`() => Sym()`)
	})

	test('returns named Symbol', () => {
		expect(
			testFunction(() => {
				return Symbol.for('abc')
			})
		).toBe(`() => Sym(abc)`)
	})

	test(`returns RegExp`, () => {
		expect(
			testFunction(() => {
				return /foo/g
			})
		).toBe(`() => /foo/g`)
	})

	test('returns Date', () => {
		expect(
			testFunction(() => {
				return new Date('2020-05-14T11:45:27.234Z')
			})
		).toBe(`() => new Date('2020-05-14T11:45:27.234Z')`)
	})

	// test('returns Date constructed with string literal', () => {
	//   expect(testFunction(() => {
	//     return new Date('2020-05-14T11:45:27.234Z')
	//   })).toBe(`() => 2020-05-14T11:45:27.234Z`)

	//   expect(testFunction(() => {
	//     const date = new Date('2020-05-14T11:45:27.234Z')
	//     return date
	//   })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; return date }`)
	// })

	// test('returns Date constructed with year, month, ...etc', () => {
	//   expect(testFunction(() => {
	//     return new Date(2020, 4, 14)
	//   })).toMatch(/\(\) => 2020-05-14T\d{2}:00:00.000Z/)
	// })

	// test('returns Date with variable in constructor', () => {
	//   expect(testFunction(() => {
	//     let x = 1
	//     return new Date(2020, x)
	//   })).toBe(`() => { let x = 1; return new Date(2020, x) }`)
	// })

	test('returns Buffer', () => {
		expect(
			testFunction(() => {
				return Buffer.from('abc')
			})
		).toBe(`() => Buffer.from('abc')`)
	})

	test('return anonymous function', () => {
		expect(testFunction(() => function () {})).toBe(`() => fn() {}`)
		expect(
			testFunction(() => {
				return function () {}
			})
		).toBe(`() => function () {}`)
		expect(
			testFunction(
				() =>
					function (a, b) {
						console.info(a)
						console.info(b)
					}
			)
		).toBe(`() => fn(a, b) { console.info(a); console.info(b); }`)
	})

	test('returns anonymous function with single param', () => {
		expect(testFunction(x => {})).toBe('x => {}')
		expect(testFunction(abcde => {})).toBe('abcde => {}')
		expect(testFunction(abcde => {}, { maxLength: 10 })).toBe('ab.. => {}')
	})

	test('returns anonymous function with multi-params', () => {
		expect(testFunction((x, y) => {})).toBe('(x, y) => {}')
	})

	test('return named function', () => {
		expect(testFunction(() => function foo() {})).toBe(`() => fn foo() {}`)
		expect(
			testFunction(() => {
				return function foo() {}
			})
		).toBe(`() => function foo() {}`)
		expect(
			testFunction(
				() =>
					function foo(a, b) {
						console.info(a)
						console.info(b)
					}
			)
		).toBe(`() => fn foo(a, b) { console.info(a); console.info(b); }`)
	})

	test('return arrow function', () => {
		expect(testFunction(() => () => true)).toBe(`() => () => true`)
		expect(
			testFunction(a => b => {
				console.info(a)
				console.info(b)
			})
		).toBe(`a => b => { console.info(a); console.info(b); }`)
	})

	test(`returns async anonymous function`, () => {
		expect(
			testFunction(() => {
				return async function () {}
			})
		).toBe(`() => async function () {}`)
	})

	test(`returns async named function`, () => {
		expect(
			testFunction(() => {
				return async function foo() {}
			})
		).toBe(`() => async function foo() {}`)
	})

	test(`returns async arrow function`, () => {
		expect(
			testFunction(() => {
				return async () => {}
			})
		).toBe(`() => async () => {}`)
	})

	test(`returns generator anonymous function`, () => {
		expect(
			testFunction(() => {
				return function* () {}
			})
		).toBe(`() => function* () {}`)
	})

	test(`returns generator named function`, () => {
		expect(
			testFunction(() => {
				return function* foo() {}
			})
		).toBe(`() => function* foo() {}`)
	})

	test(`returns async generator anonymous function`, () => {
		expect(
			testFunction(() => {
				return async function* () {}
			})
		).toBe(`() => async function* () {}`)
	})

	test(`returns async generator named function`, () => {
		expect(
			testFunction(() => {
				return async function* foo() {}
			})
		).toBe(`() => async function* foo() {}`)
	})

	test('returns single property object', () => {
		expect(
			testFunction(() => {
				return { a: 1 }
			})
		).toBe('() => ({ a: 1 })')
	})

	test('returns multiple property object', () => {
		expect(
			testFunction(() => {
				return { a: 1, b: 'b' }
			})
		).toBe(`() => ({ a: 1, b: 'b' })`)
	})

	test('returns computed property object', () => {
		expect(
			testFunction(() => {
				const x = 'xyz'
				return { [x]: true }
			})
		).toBe(`() => { const x = 'xyz'; return { [x]: true }; }`)

		expect(
			testFunction(() => {
				return { ['x']: true }
			})
		).toBe(`() => ({ ['x']: true })`)
	})

	test('returns symbol property object', () => {
		expect(
			testFunction(() => {
				return { [Symbol()]: true }
			})
		).toBe(`() => ({ [Sym()]: true })`)

		expect(
			testFunction(() => {
				return { [Symbol.for('abc')]: true }
			})
		).toBe(`() => ({ [Sym(abc)]: true })`)

		expect(
			testFunction(() => {
				const tx = Symbol.for('abc')
				return { [tx]: true }
			})
		).toBe(`() => { const tx = Sym(abc); return { [tx]: true }; }`)
	})

	test('returns method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: function () {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: function () { return 'abc'; } })`)
	})

	test('returns named method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: function foo() {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: function foo() { return 'abc'; } })`)
	})

	test('returns async method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: async function () {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: async function () { return 'abc'; } })`)
	})

	test('returns generator method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: function* () {
						yield 'abc'
					}
				}
			})
		).toBe(`() => ({ m: function* () { yield 'abc'; } })`)
	})

	test('returns async generator method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: async function* () {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: async function* () { return 'abc'; } })`)
	})

	test('returns es6 method property object', () => {
		expect(
			testFunction(() => {
				return {
					m() {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m() { return 'abc'; } })`)
	})

	test('returns async es6 method property object', () => {
		expect(
			testFunction(() => {
				return {
					async m() {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ async m() { return 'abc'; } })`)
	})

	test('returns generator es6 method property object', () => {
		expect(
			testFunction(() => {
				return {
					*m() {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ *m() { return 'abc'; } })`)
	})

	test('returns async generator es6 method property object', () => {
		expect(
			testFunction(() => {
				return {
					async *m() {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ async *m() { return 'abc'; } })`)
	})

	test('returns object', () => {
		expect(testFunction(() => ({ a: 1 }))).toBe(`() => ({ a: 1 })`)
	})

	test('returns arrow method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: () => {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: () => { return 'abc'; } })`)
	})

	test('returns async arrow method property object', () => {
		expect(
			testFunction(() => {
				return {
					m: async () => {
						return 'abc'
					}
				}
			})
		).toBe(`() => ({ m: async () => { return 'abc'; } })`)
	})

	test('return es6 simplified object', () => {
		expect(
			testFunction((x, y) => {
				return { x, y }
			})
		).toBe('(x, y) => ({ x, y })')
	})

	test('returns array', () => {
		expect(
			testFunction(() => {
				return []
			})
		).toBe(`() => []`)
		expect(
			testFunction(() => {
				return [1, undefined, 'a']
			})
		).toBe(`() => [1, undefined, 'a']`)
	})

	test('with variable declaration', () => {
		const subject: any = () => {
			const value = 1234
			return value
		}
		expect(testFunction(subject)).toBe(`() => { const value = 1234; return value; }`)
		expect(testFunction(subject, { maxLength: 43 })).toBe(`() => { const value = 1234; return value; }`)
		expect(testFunction(subject, { maxLength: 15 })).toBe(`() => { co... }`)
		expect(testFunction(subject, { maxLength: 14 })).toBe(`() => { co.. }`)
	})

	test('with variable declaration but no init', () => {
		expect(
			testFunction(() => {
				let x
				return x
			})
		).toBe('() => { let x; return x; }')
	})

	// tslint:disable: one-variable-per-declaration
	test('with multi-variable declaration', () => {
		expect(
			testFunction(() => {
				let x: any, y: any
				return x + y
			})
		).toBe('() => { let x, y; return x + y; }')
	})
	// tslint:enable: one-variable-per-declaration

	test('with prefix unary expression', () => {
		expect(
			testFunction(() => {
				return !!1
			})
		).toBe(`() => true`)
		expect(
			testFunction(() => {
				return +1
			})
		).toBe(`() => 1`)
	})

	// Can't think of a postfix unary expression. `x++` and `x--` are update expression.
	test.todo('with postfix unary expression')

	test('with logical expression', () => {
		expect(
			testFunction(() => {
				return 1 && 2
			})
		).toBe(`() => 2`)
	})

	test('with binary expression', () => {
		expect(
			testFunction(() => {
				return (1 + 2) * 3
			})
		).toBe(`() => (1 + 2) * 3`)
		expect(
			testFunction(() => {
				return 3 * (1 + 2)
			})
		).toBe(`() => 3 * (1 + 2)`)
	})

	test('with update expression', () => {
		let x
		expect(
			testFunction(() => {
				return ++x
			})
		).toBe(`() => ++x`)
		expect(
			testFunction(() => {
				return x++
			})
		).toBe(`() => x++`)
	})

	// tslint:disable: one-variable-per-declaration
	test('with multi-variable declaration and init (and ternary expression)', () => {
		expect(
			testFunction(() => {
				let x = 1,
					y: any,
					z = 2
				return y ? x : z
			})
		).toBe('() => { let x = 1, y, z = 2; return y ? x : z; }')
	})
	// tslint:enable: one-variable-per-declaration

	test('with if statement', () => {
		expect(
			testFunction(x => {
				if (x) {
					return true
				} else {
					return false
				}
			})
		).toBe('x => { if (x) { return true; } else { return false; } }')

		expect(
			testFunction(x => {
				if (x) return true
				else return false
			})
		).toBe('x => { if (x) return true; else return false; }')
		expect(
			testFunction(x => {
				if (x) return true
				else {
					return false
				}
			})
		).toBe('x => { if (x) return true; else { return false; } }')

		expect(
			testFunction(x => {
				if (x) {
					return true
				}
				return false
			})
		).toBe('x => { if (x) { return true; } return false; }')

		expect(
			testFunction(x => {
				if (x) return true
				return false
			})
		).toBe('x => { if (x) return true; return false; }')
	})

	test('with assignment', () => {
		expect(
			testFunction(x => {
				return (x %= 1)
			})
		).toBe('x => x %= 1')
	})

	test('with while loop', () => {
		expect(
			testFunction(x => {
				while (x) {
					x -= 1
				}
			})
		).toBe('x => { while (x) { x -= 1; } }')

		expect(
			testFunction(x => {
				while (true) x -= 1
			})
		).toBe('x => { while (true) x -= 1; }')
	})

	test('with do loop', () => {
		expect(
			testFunction(x => {
				do {
					x -= 1
				} while (x)
			})
		).toBe('x => { do { x -= 1; } while (x); }')

		expect(
			testFunction(x => {
				do x -= 1
				while (x)
			})
		).toBe('x => { do x -= 1; while (x); }')
	})

	test('with for loop', () => {
		expect(
			testFunction(() => {
				for (let i = 0; i < 10; i++) {
					console.info(i)
				}
			})
		).toBe('() => { for (let i = 0; i < 10; i++) { console.info(i); } }')
	})

	test('with for loop no init', () => {
		expect(
			testFunction(() => {
				let i = 0
				for (; i < 10; i++) {
					console.info(i)
				}
			})
		).toBe('() => { let i = 0; for (; i < 10; i++) { console.info(i); } }')
	})

	test('with for loop no test', () => {
		expect(
			testFunction(() => {
				for (let i = 0; ; i++) {
					console.info(i)
				}
			})
		).toBe('() => { for (let i = 0;; i++) { console.info(i); } }')
	})

	test('with for loop no update', () => {
		expect(
			testFunction(() => {
				for (let i = 0, y = 1; i < 10; ) {
					console.info(i, y)
				}
			})
		).toBe('() => { for (let i = 0, y = 1; i < 10;) { console.info(i, y); } }')
	})

	test('with for loop with break', () => {
		expect(
			testFunction(() => {
				for (;;) {
					break
				}
			})
		).toBe('() => { for (;;) { break; } }')
	})

	test('with for loop with labeled break', () => {
		expect(
			testFunction(() => {
				label: for (;;) {
					break label
				}
			})
		).toBe(`() => { label: for (;;) { break label; } }`)
	})

	test('with for loop with continue', () => {
		expect(
			testFunction(() => {
				for (;;) {
					continue
				}
			})
		).toBe(`() => { for (;;) { continue; } }`)
	})

	test('with for loop with labeled continue', () => {
		expect(
			testFunction(() => {
				foo: for (;;) {
					continue foo
				}
			})
		).toBe(`() => { foo: for (;;) { continue foo; } }`)
	})

	test('with switch', () => {
		expect(
			testFunction(x => {
				switch (x) {
					case 1:
						break
					case 2:
						return
					default:
						return 3
				}
			})
		).toBe(`x => { switch (x) { case 1: break; case 2:  default: return 3; } }`)
	})

	test('with switch using expression', () => {
		expect(
			testFunction(x => {
				switch (true) {
					case x > 1:
						break
				}
			})
		).toBe(`x => { switch (true) { case x > 1: break; } }`)
	})

	test('with for in', () => {
		expect(
			testFunction(x => {
				for (let y in x) console.info(y)
			})
		).toBe(`x => { for (let y in x) console.info(y); }`)

		expect(
			testFunction(x => {
				for (let y in x) {
					console.info(y + 1)
					console.info(y)
				}
			})
		).toBe(`x => { for (let y in x) { console.info(y + 1); console.info(y); } }`)
	})

	test('with for of', () => {
		expect(
			testFunction(x => {
				for (let y of x) console.info(y)
			})
		).toBe(`x => { for (let y of x) console.info(y); }`)

		expect(
			testFunction(x => {
				for (let y of x) {
					console.info(y + 1)
					console.info(y)
				}
			})
		).toBe(`x => { for (let y of x) { console.info(y + 1); console.info(y); } }`)
	})

	test('with try catch finally', () => {
		expect(
			testFunction(() => {
				try {
					return 1
				} catch (e) {
					return e
				} finally {
					console.info(3)
				}
			})
		).toBe(`() => { try { return 1; } catch (e) { return e; } finally { console.info(3); } }`)
	})

	// The output of this is not optimal as Acorn does not support es2019
	// TODO: use Acron for try catch with no error declaration when it is supported
	test('with try catch finally an no error declaration', () => {
		expect(
			testFunction(() => {
				try {
					return 1
				} catch {
					return 2
				} finally {
					console.info(3)
				}
			})
		).toBe(`() => { try { return 1; } catch { return 2; } finally { console.info(3); } }`)
	})

	test(`async arrow function`, () => {
		const x = Promise.resolve()
		expect(
			testFunction(async () => {
				await x
			})
		).toBe('async () => { await x; }')
	})

	test('use tersify() when available', () => {
		expect(
			testFunction(
				tersible(
					(x, y) => x + y,
					() => 'x + y'
				)
			)
		).toBe('x + y')
	})

	test('raw will skip tersify() method', () => {
		expect(
			testFunction(
				tersible(
					(x, y) => x + y,
					() => 'x + y'
				),
				{ maxLength: Infinity, raw: true }
			)
		).toBe('(x, y) => x + y')
		const fn = function (x, y) {
			return x + y
		}
		expect(
			testFunction(
				tersible(fn, () => 'x + y'),
				{ maxLength: Infinity, raw: true }
			)
		).toBe(fn.toString())
	})
})

function testFunction(fn: Function, options?: Partial<TersifyOptions>) {
	const testContext: TersifyContext = { references: [], path: [], noTrim: false, maxLength: Infinity }
	return tersifyFunction(unpartial<TersifyContext>(testContext, options), fn, 0)
}
