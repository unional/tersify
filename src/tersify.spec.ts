import { tersible } from './tersible';
import { tersify } from './tersify2';

describe('undefined', () => {
  test(`tersify(undefined)`, () => {
    expect(tersify(undefined)).toBe('undefined')
    expect(tersify(undefined, { maxLength: 9 })).toBe('undefined')
    expect(tersify(undefined, { maxLength: 8 })).toBe('undef...')
    expect(tersify(undefined, { maxLength: 7 })).toBe('unde...')
    expect(tersify(undefined, { maxLength: 6 })).toBe('und...')
    expect(tersify(undefined, { maxLength: 5 })).toBe('un...')
    expect(tersify(undefined, { maxLength: 4 })).toBe('un..')
    expect(tersify(undefined, { maxLength: 3 })).toBe('un.')
    expect(tersify(undefined, { maxLength: 2 })).toBe('u.')
    expect(tersify(undefined, { maxLength: 1 })).toBe('.')
    expect(tersify(undefined, { maxLength: 0 })).toBe('')
  })
})

describe('null', () => {
  test(`tersify(null)`, () => {
    expect(tersify(null)).toBe('null')
    expect(tersify(null, { maxLength: 4 })).toBe('null')
    expect(tersify(null, { maxLength: 3 })).toBe('nu.')
    expect(tersify(null, { maxLength: 2 })).toBe('n.')
    expect(tersify(null, { maxLength: 1 })).toBe('.')
    expect(tersify(null, { maxLength: 0 })).toBe('')
  })
})

describe('boolean', () => {
  test(`tersify(true)`, () => {
    expect(tersify(true)).toBe('true')
    expect(tersify(true, { maxLength: 4 })).toBe('true')
    expect(tersify(true, { maxLength: 3 })).toBe('tr.')
    expect(tersify(true, { maxLength: 2 })).toBe('t.')
    expect(tersify(true, { maxLength: 1 })).toBe('.')
    expect(tersify(true, { maxLength: 0 })).toBe('')
  })
  test(`tersify(false)`, () => {
    expect(tersify(false)).toBe('false')
    expect(tersify(false, { maxLength: 5 })).toBe('false')
    expect(tersify(false, { maxLength: 4 })).toBe('fa..')
    expect(tersify(false, { maxLength: 3 })).toBe('fa.')
    expect(tersify(false, { maxLength: 2 })).toBe('f.')
    expect(tersify(false, { maxLength: 1 })).toBe('.')
    expect(tersify(false, { maxLength: 0 })).toBe('')
  })
})

describe('number', () => {
  test(`tersify(1)`, () => {
    expect(tersify(1)).toBe('1')
    expect(tersify(1, { maxLength: 1 })).toBe('1')
    expect(tersify(1, { maxLength: 0 })).toBe('')
  })
  test(`tersify(12)`, () => {
    expect(tersify(12)).toBe('12')
    expect(tersify(12, { maxLength: 2 })).toBe('12')
    expect(tersify(12, { maxLength: 1 })).toBe('.')
    expect(tersify(12, { maxLength: 0 })).toBe('')
  })
  test(`tersify(123)`, () => {
    expect(tersify(123)).toBe('123')
    expect(tersify(123, { maxLength: 3 })).toBe('123')
    expect(tersify(123, { maxLength: 2 })).toBe('1.')
    expect(tersify(123, { maxLength: 1 })).toBe('.')
    expect(tersify(123, { maxLength: 0 })).toBe('')
  })
  test(`tersify(1234)`, () => {
    expect(tersify(1234)).toBe('1234')
    expect(tersify(1234, { maxLength: 4 })).toBe('1234')
    expect(tersify(1234, { maxLength: 3 })).toBe('12.')
    expect(tersify(1234, { maxLength: 2 })).toBe('1.')
    expect(tersify(1234, { maxLength: 1 })).toBe('.')
    expect(tersify(1234, { maxLength: 0 })).toBe('')
  })
})

describe('bigint', () => {
  test(`tersify(1n)`, () => {
    expect(tersify(1n)).toBe('1n')
    expect(tersify(1n, { maxLength: 2 })).toBe('1n')
    expect(tersify(1n, { maxLength: 1 })).toBe('.')
    expect(tersify(1n, { maxLength: 0 })).toBe('')
  })
  test(`tersify(12n)`, () => {
    expect(tersify(12n)).toBe('12n')
    expect(tersify(12n, { maxLength: 3 })).toBe('12n')
    expect(tersify(12n, { maxLength: 2 })).toBe('1.')
    expect(tersify(12n, { maxLength: 1 })).toBe('.')
    expect(tersify(12n, { maxLength: 0 })).toBe('')
  })
  test(`tersify(123n)`, () => {
    expect(tersify(123n)).toBe('123n')
    expect(tersify(123n, { maxLength: 4 })).toBe('123n')
    expect(tersify(123n, { maxLength: 3 })).toBe('12.')
    expect(tersify(123n, { maxLength: 2 })).toBe('1.')
    expect(tersify(123n, { maxLength: 1 })).toBe('.')
    expect(tersify(123n, { maxLength: 0 })).toBe('')
  })
  test(`tersify(1234n)`, () => {
    expect(tersify(1234n)).toBe('1234n')
    expect(tersify(1234n, { maxLength: 5 })).toBe('1234n')
    expect(tersify(1234n, { maxLength: 4 })).toBe('12..')
    expect(tersify(1234n, { maxLength: 3 })).toBe('12.')
    expect(tersify(1234n, { maxLength: 2 })).toBe('1.')
    expect(tersify(1234n, { maxLength: 1 })).toBe('.')
    expect(tersify(1234n, { maxLength: 0 })).toBe('')
  })
})

describe('string', () => {
  test(`tersify('a')`, () => {
    expect(tersify('a')).toBe(`'a'`)
    expect(tersify('a', { maxLength: 3 })).toBe(`'a'`)
    expect(tersify('a', { maxLength: 2 })).toBe(`'.`)
    expect(tersify('a', { maxLength: 1 })).toBe(`.`)
    expect(tersify('a', { maxLength: 0 })).toBe('')
  })

  test(`tersify('ab')`, () => {
    expect(tersify('ab')).toBe(`'ab'`)
    expect(tersify('ab', { maxLength: 4 })).toBe(`'ab'`)
    expect(tersify('ab', { maxLength: 3 })).toBe(`'a.`)
    expect(tersify('ab', { maxLength: 2 })).toBe(`'.`)
    expect(tersify('ab', { maxLength: 1 })).toBe(`.`)
    expect(tersify('ab', { maxLength: 0 })).toBe('')
  })

  test(`tersify('abc')`, () => {
    expect(tersify('abc')).toBe(`'abc'`)
    expect(tersify('abc', { maxLength: 5 })).toBe(`'abc'`)
    expect(tersify('abc', { maxLength: 4 })).toBe(`'a..`)
    expect(tersify('abc', { maxLength: 3 })).toBe(`'a.`)
    expect(tersify('abc', { maxLength: 2 })).toBe(`'.`)
    expect(tersify('abc', { maxLength: 1 })).toBe(`.`)
    expect(tersify('abc', { maxLength: 0 })).toBe('')
  })

  test(`tersify('abcd')`, () => {
    expect(tersify('abcd')).toBe(`'abcd'`)
    expect(tersify('abcd', { maxLength: 6 })).toBe(`'abcd'`)
    expect(tersify('abcd', { maxLength: 5 })).toBe(`'a...`)
    expect(tersify('abcd', { maxLength: 4 })).toBe(`'a..`)
    expect(tersify('abcd', { maxLength: 3 })).toBe(`'a.`)
    expect(tersify('abcd', { maxLength: 2 })).toBe(`'.`)
    expect(tersify('abcd', { maxLength: 1 })).toBe(`.`)
    expect(tersify('abcd', { maxLength: 0 })).toBe('')
  })

  test('escape single quotes', () => {
    expect(tersify('a"bc"d')).toBe(`'a"bc"d'`)
    expect(tersify("a'bc'd")).toBe(`'a\'bc\'d'`)
  })
})

describe('Date', () => {
  test('represents as ISO string', () => {
    const subject = new Date('2020-05-14T11:45:27.234Z')
    expect(tersify(subject)).toBe(`2020-05-14T11:45:27.234Z`)
    expect(tersify(subject, { maxLength: 24 })).toBe(`2020-05-14T11:45:27.234Z`)
    expect(tersify(subject, { maxLength: 23 })).toBe(`2020-05-14T11:45:27....`)
  })
})

describe('Buffer', () => {
  test('as simple string prepresentation', () => {
    const subject = Buffer.from('abcde')

    expect(tersify(subject)).toBe(`<Buffer 61 62 63 64 65>`)
    expect(tersify(subject, { maxLength: 23 })).toBe(`<Buffer 61 62 63 64 65>`)
    expect(tersify(subject, { maxLength: 22 })).toBe(`<Buffer 61 62 63 64...`)
  })
})

describe('Symbol', () => {
  test('unnamed symbol is recorded as "Sym()"', () => {
    expect(tersify(Symbol())).toBe('Sym()')
    expect(tersify(Symbol(), { maxLength: 5 })).toBe('Sym()')
    expect(tersify(Symbol(), { maxLength: 4 })).toBe('Sy..')
    expect(tersify(Symbol(), { maxLength: 3 })).toBe('Sy.')
    expect(tersify(Symbol(), { maxLength: 2 })).toBe('S.')
    expect(tersify(Symbol(), { maxLength: 1 })).toBe('.')
    expect(tersify(Symbol(), { maxLength: 0 })).toBe('')
  })

  test(`named symbol is recorded as "Sym(<name>)"`, () => {
    expect(tersify(Symbol('abc'))).toBe(`Sym(abc)`)
    expect(tersify(Symbol('abc'), { maxLength: 8 })).toBe(`Sym(abc)`)
    expect(tersify(Symbol('abc'), { maxLength: 7 })).toBe('Sym(...')
    expect(tersify(Symbol('abc'), { maxLength: 6 })).toBe('Sym...')
    expect(tersify(Symbol('abc'), { maxLength: 5 })).toBe('Sy...')
    expect(tersify(Symbol('abc'), { maxLength: 4 })).toBe('Sy..')
    expect(tersify(Symbol('abc'), { maxLength: 3 })).toBe('Sy.')
    expect(tersify(Symbol('abc'), { maxLength: 2 })).toBe('S.')
    expect(tersify(Symbol('abc'), { maxLength: 1 })).toBe('.')
    expect(tersify(Symbol('abc'), { maxLength: 0 })).toBe('')
  })

  test(`keyed symbol is recorded as "Sym(<name>)"`, () => {
    expect(tersify(Symbol.for('abc'))).toBe(`Sym(abc)`)
    expect(tersify(Symbol.for('abc'), { maxLength: 8 })).toBe(`Sym(abc)`)
    expect(tersify(Symbol.for('abc'), { maxLength: 7 })).toBe('Sym(...')
    expect(tersify(Symbol.for('abc'), { maxLength: 6 })).toBe('Sym...')
    expect(tersify(Symbol.for('abc'), { maxLength: 5 })).toBe('Sy...')
    expect(tersify(Symbol.for('abc'), { maxLength: 4 })).toBe('Sy..')
    expect(tersify(Symbol.for('abc'), { maxLength: 3 })).toBe('Sy.')
    expect(tersify(Symbol.for('abc'), { maxLength: 2 })).toBe('S.')
    expect(tersify(Symbol.for('abc'), { maxLength: 1 })).toBe('.')
    expect(tersify(Symbol.for('abc'), { maxLength: 0 })).toBe('')
  })

  test('symbol in raw mode', () => {
    expect(tersify(Symbol(), { raw: true })).toBe('Symbol()')
    expect(tersify(Symbol('abc'), { raw: true })).toBe('Symbol(abc)')
    expect(tersify(Symbol.for('abc'), { raw: true })).toBe('Symbol(abc)')
  })
})

describe('RegExp', () => {
  test('tersify RegExp literal to its string representation.', () => {
    expect(tersify(/foo/)).toBe('/foo/')
    expect(tersify(/foo/g)).toBe('/foo/g')
  })

  test('trim for RegExp', () => {
    expect(tersify(/foobarkar/, { maxLength: 8 })).toBe('/foob...')
    expect(tersify(/foobarkar/, { maxLength: 7 })).toBe('/foo...')
    expect(tersify(/foobarkar/, { maxLength: 6 })).toBe('/fo...')
    expect(tersify(/foo/, { maxLength: 5 })).toBe('/foo/')
    expect(tersify(/foo/, { maxLength: 4 })).toBe('/f..')
    expect(tersify(/foo/, { maxLength: 3 })).toBe('/f.')
    expect(tersify(/foo/, { maxLength: 2 })).toBe('/.')
    expect(tersify(/foo/, { maxLength: 1 })).toBe('.')
    expect(tersify(/foo/, { maxLength: 0 })).toBe('')
  })
})

describe('function', () => {
  test('anomymous with no return', () => {
    expect(tersify(function () { })).toBe('fn() {}')
    expect(tersify(function () { }, { maxLength: 7 })).toBe('fn() {}')
    expect(tersify(function () { }, { maxLength: 6 })).toBe('fn(...')
    expect(tersify(function () { }, { maxLength: 5 })).toBe('fn...')
    expect(tersify(function () { }, { maxLength: 4 })).toBe('fn..')
    expect(tersify(function () { }, { maxLength: 3 })).toBe('fn.')
    expect(tersify(function () { }, { maxLength: 2 })).toBe('f.')
    expect(tersify(function () { }, { maxLength: 1 })).toBe('.')
    expect(tersify(function () { }, { maxLength: 0 })).toBe('')
  })

  test(`raw mode will use 'function' instead of 'fn'`, () => {
    expect(tersify(function () { }, { raw: true })).toBe('function() {}')
  })

  test('single param', () => {
    expect(tersify(function (a) { })).toBe('fn(a) {}')
  })

  test('multiple params', () => {
    expect(tersify(function (a, b, c) { })).toBe('fn(a, b, c) {}')
  })

  test('not enough length will first trim params', () => {
    expect(tersify(function (a, b, c) { return undefined })).toBe('fn(a, b, c) { return undefined }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 30 })).toBe('fn(a,...) { return undefined }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 28 })).toBe('fn(a,.) { return undefined }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 27 })).toBe('fn(a,.) { return undef... }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 16 })).toBe('fn(a,.) { re.. }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 15 })).toBe('fn(a,.) { re. }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 14 })).toBe('fn(a,.) { r. }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 13 })).toBe('fn(a,.) { . }')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 12 })).toBe('fn(a,.) {...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 11 })).toBe('fn(a,.) ...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 10 })).toBe('fn(a,.)...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 9 })).toBe('fn(a,....')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 8 })).toBe('fn(a,...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 7 })).toBe('fn(a...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 6 })).toBe('fn(...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 5 })).toBe('fn...')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 4 })).toBe('fn..')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 3 })).toBe('fn.')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 2 })).toBe('f.')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 1 })).toBe('.')
    expect(tersify(function (a, b, c) { return undefined }, { maxLength: 0 })).toBe('')
  })

  test('default param', () => {
    expect(tersify(function (a = '1') { })).toBe(`fn(a = '1') {}`)
  })

  test('off order default param', () => {
    expect(tersify(function (a = 1, b) { })).toBe('fn(a = 1, b) {}')
  })

  test('rest param', () => {
    expect(tersify(function (a, ...b) { })).toBe(`fn(a, ...b) {}`)
  })

  test('multiple statements', () => {
    expect(tersify(function () {
      console.info('a')
      return 'b'
    })).toBe(`fn() { console.info('a'); return 'b' }`)
  })

  test('deep reference', () => {
    const a = { b: { c: { d: false } } }
    expect(tersify(function () {
      return a.b.c.d
    })).toBe(`fn() { return a.b.c.d }`)
  })

  test('anomymous returns nothing', () => {
    expect(tersify(function () { return })).toBe('fn() {}')
  })

  test(`returns undefined`, () => {
    expect(tersify(function () { return undefined })).toBe('fn() { return undefined }')
    expect(tersify(function () { return undefined }, { maxLength: 25 })).toBe('fn() { return undefined }')
    expect(tersify(function () { return undefined }, { maxLength: 24 })).toBe('fn() { return undef... }')
    expect(tersify(function () { return undefined }, { maxLength: 23 })).toBe('fn() { return unde... }')
  })

  test(`returns null`, () => {
    expect(tersify(function () { return null })).toBe('fn() { return null }')
    expect(tersify(function () { return null }, { maxLength: 20 })).toBe('fn() { return null }')
    expect(tersify(function () { return null }, { maxLength: 19 })).toBe('fn() { return ... }')
    expect(tersify(function () { return null }, { maxLength: 18 })).toBe('fn() { return... }')
  })

  test(`returns boolean`, () => {
    expect(tersify(function () { return true })).toBe('fn() { return true }')
    expect(tersify(function () { return true }, { maxLength: 20 })).toBe('fn() { return true }')
    expect(tersify(function () { return true }, { maxLength: 19 })).toBe('fn() { return ... }')
    expect(tersify(function () { return true }, { maxLength: 18 })).toBe('fn() { return... }')

    expect(tersify(function () { return false })).toBe('fn() { return false }')
    expect(tersify(function () { return false }, { maxLength: 21 })).toBe('fn() { return false }')
    expect(tersify(function () { return false }, { maxLength: 20 })).toBe('fn() { return f... }')
    expect(tersify(function () { return false }, { maxLength: 19 })).toBe('fn() { return ... }')
    expect(tersify(function () { return false }, { maxLength: 18 })).toBe('fn() { return... }')
  })

  test(`returns number`, () => {
    expect(tersify(function () { return 1 })).toBe('fn() { return 1 }')
    expect(tersify(function () { return 1 }, { maxLength: 17 })).toBe('fn() { return 1 }')
    expect(tersify(function () { return 1 }, { maxLength: 16 })).toBe('fn() { retu... }')
  })

  test(`returns bigint`, () => {
    expect(tersify(function () { return 1n })).toBe('fn() { return 1n }')
  })

  test(`returns string`, () => {
    expect(tersify(function () { return 'a' })).toBe(`fn() { return 'a' }`)
  })

  test(`returns Symbol`, () => {
    expect(tersify(function () { return Symbol() })).toBe(`fn() { return Sym() }`)
  })

  test(`returns named Symbol`, () => {
    expect(tersify(function () { return Symbol.for('abc') })).toBe(`fn() { return Sym(abc) }`)
  })

  test(`returns RegExp`, () => {
    expect(tersify(function () { return /foo/g })).toBe(`fn() { return /foo/g }`)
  })

  test('returns new Date()', () => {
    expect(tersify(function () {
      return new Date()
    })).toBe('fn() { return new Date() }')
  })

  test('returns Date constructed with string literal', () => {
    expect(tersify(function () {
      return new Date('2020-05-14T11:45:27.234Z')
    })).toBe(`fn() { return 2020-05-14T11:45:27.234Z }`)

    expect(tersify(function () {
      const date = new Date('2020-05-14T11:45:27.234Z')
      return date
    })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; return date }`)
  })

  test('returns Date constructed with year, month, ...etc', () => {
    expect(tersify(function () {
      return new Date(2020, 4, 14)
    })).toBe(`fn() { return 2020-05-14T07:00:00.000Z }`)
  })

  test('returns Date with variable in contructor', () => {
    expect(tersify(function () {
      let x = 1
      return new Date(2020, x)
    })).toBe(`fn() { let x = 1; return new Date(2020, x) }`)
  })

  test('returns Buffer', () => {
    expect(tersify(function () {
      return Buffer.from('abc')
    })).toBe(`fn() { return Buffer.from('abc') }`)
  })

  test(`returns anomymous function`, () => {
    expect(tersify(function () { return function () { } })).toBe(`fn() { return fn() {} }`)
  })

  test(`returns named function`, () => {
    expect(tersify(function () { return function foo() { } })).toBe(`fn() { return fn foo() {} }`)
  })

  test(`returns arrow function`, () => {
    expect(tersify(function () { return () => { } })).toBe(`fn() { return () => {} }`)
  })

  test(`returns async anomymous function`, () => {
    expect(tersify(function () { return async function () { } })).toBe(`fn() { return async fn() {} }`)
  })

  test(`returns async named function`, () => {
    expect(tersify(function () { return async function foo() { } })).toBe(`fn() { return async fn foo() {} }`)
  })

  test(`returns async arrow function`, () => {
    expect(tersify(function () { return async () => { } })).toBe(`fn() { return async () => {} }`)
  })

  test(`returns generator anomymous function`, () => {
    expect(tersify(function () { return function* () { } })).toBe(`fn() { return fn*() {} }`)
  })

  test(`returns generator named function`, () => {
    expect(tersify(function () { return function* foo() { } })).toBe(`fn() { return fn* foo() {} }`)
  })

  test(`returns async generator anomymous function`, () => {
    expect(tersify(function () { return async function* () { } })).toBe(`fn() { return async fn*() {} }`)
  })

  test(`returns async generator named function`, () => {
    expect(tersify(function () { return async function* foo() { } })).toBe(`fn() { return async fn* foo() {} }`)
  })

  test('returns single property object', () => {
    expect(tersify(function () {
      return { a: 1 }
    })).toBe('fn() { return { a: 1 } }')
  })

  test('returns multiple property object', () => {
    expect(tersify(function () {
      return { a: 1, b: 'b' }
    })).toBe(`fn() { return { a: 1, b: 'b' } }`)
  })

  test('returns computed property object', () => {
    expect(tersify(function () {
      const x = 'xyz'
      return { [x]: true }
    })).toBe(`fn() { const x = 'xyz'; return { [x]: true } }`)

    expect(tersify(function () {
      return { ['x']: true }
    })).toBe(`fn() { return { ['x']: true } }`)
  })

  test('returns symbol property object', () => {
    expect(tersify(function () {
      return { [Symbol()]: true }
    })).toBe(`fn() { return { [Sym()]: true } }`)

    expect(tersify(function () {
      return { [Symbol.for('abc')]: true }
    })).toBe(`fn() { return { [Sym(abc)]: true } }`)

    expect(tersify(function () {
      const tx = Symbol.for('abc')
      return { [tx]: true }
    })).toBe(`fn() { const tx = Sym(abc); return { [tx]: true } }`)
  })

  test('returns method property object', () => {
    expect(tersify(function () {
      return { m: function () { return 'abc' } }
    })).toBe(`fn() { return { m() { return 'abc' } } }`)
  })

  test('returns named method property object', () => {
    expect(tersify(function () {
      return { m: function foo() { return 'abc' } }
    })).toBe(`fn() { return { m() { return 'abc' } } }`)
  })

  test('returns async method property object', () => {
    expect(tersify(function () {
      return { m: async function () { return 'abc' } }
    })).toBe(`fn() { return { async m() { return 'abc' } } }`)
  })

  test('returns generator method property object', () => {
    expect(tersify(function () {
      return { m: function* () { yield 'abc' } }
    })).toBe(`fn() { return { *m() { yield 'abc' } } }`)
  })

  test('returns async generator method property object', () => {
    expect(tersify(function () {
      return { m: async function* () { return 'abc' } }
    })).toBe(`fn() { return { async *m() { return 'abc' } } }`)
  })

  test('returns es6 method property object', () => {
    expect(tersify(function () {
      return { m() { return 'abc' } }
    })).toBe(`fn() { return { m() { return 'abc' } } }`)
  })

  test('returns async es6 method property object', () => {
    expect(tersify(function () {
      return { async m() { return 'abc' } }
    })).toBe(`fn() { return { async m() { return 'abc' } } }`)
  })

  test('returns generator es6 method property object', () => {
    expect(tersify(function () {
      return { *m() { return 'abc' } }
    })).toBe(`fn() { return { *m() { return 'abc' } } }`)
  })

  test('returns async generator es6 method property object', () => {
    expect(tersify(function () {
      return { async *m() { return 'abc' } }
    })).toBe(`fn() { return { async *m() { return 'abc' } } }`)
  })

  test('returns arrow method property object', () => {
    expect(tersify(function () {
      return { m: () => { return 'abc' } }
    })).toBe(`fn() { return { m: () => 'abc' } }`)
  })

  test('returns async arrow method property object', () => {
    expect(tersify(function () {
      return { m: async () => { return 'abc' } }
    })).toBe(`fn() { return { m: async () => 'abc' } }`)
  })

  test('returns array', () => {
    expect(tersify(function () { return [] })).toBe(`fn() { return [] }`)
    expect(tersify(function () { return [1, undefined, 'a'] })).toBe(`fn() { return [1, undefined, 'a'] }`)
  })

  test('with variable declaration', () => {
    const subject: any = function () {
      const date = new Date('2020-05-14T11:45:27.234Z');
      return date;
    };
    expect(tersify(subject)).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; return date }`)
    expect(tersify(subject, { maxLength: 59 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; return date }`)
    expect(tersify(subject, { maxLength: 58 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; return ... }`)
    expect(tersify(subject, { maxLength: 52 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; r... }`)
    expect(tersify(subject, { maxLength: 51 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z; ... }`)
    expect(tersify(subject, { maxLength: 50 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z;... }`)
    expect(tersify(subject, { maxLength: 49 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234Z... }`)
    expect(tersify(subject, { maxLength: 48 })).toBe(`fn() { const date = 2020-05-14T11:45:27.234... }`)
    expect(tersify(subject, { maxLength: 26 })).toBe(`fn() { const date = 2... }`)
    expect(tersify(subject, { maxLength: 25 })).toBe(`fn() { const date = ... }`)
    expect(tersify(subject, { maxLength: 24 })).toBe(`fn() { const date =... }`)
    expect(tersify(subject, { maxLength: 23 })).toBe(`fn() { const date ... }`)
    expect(tersify(subject, { maxLength: 21 })).toBe(`fn() { const dat... }`)
    expect(tersify(subject, { maxLength: 19 })).toBe(`fn() { const d... }`)
    expect(tersify(subject, { maxLength: 18 })).toBe(`fn() { const ... }`)
    expect(tersify(subject, { maxLength: 17 })).toBe(`fn() { const... }`)
    expect(tersify(subject, { maxLength: 13 })).toBe(`fn() { co.. }`)
  })

  test('with variable declaration but no init', () => {
    expect(tersify(function () {
      let x
      return x
    })).toBe('fn() { let x; return x }')
  })

  test('with multi-variable declaration', () => {
    expect(tersify(function () {
      // tslint:disable-next-line: one-variable-per-declaration no-var-keyword
      var x: any, y: any
      return x + y
    })).toBe('fn() { var x, y; return x + y }')
  })

  test('with prefix unary expression', () => {
    expect(tersify(function () { return !!1 })).toBe(`fn() { return !!1 }`)
    expect(tersify(function () { return +1 })).toBe(`fn() { return +1 }`)
  })

  // Can't think of a postfix unary expression. `x++` and `x--` are update expression.
  test.todo('with postfix unary expression')

  test('with logical expression', () => {
    expect(tersify(function () { return 1 && 2 })).toBe(`fn() { return 1 && 2 }`)
  })

  test('with binary expression', () => {
    expect(tersify(function () { return (1 + 2) * 3 })).toBe(`fn() { return (1 + 2) * 3 }`)
    expect(tersify(function () { return 3 * (1 + 2) })).toBe(`fn() { return 3 * (1 + 2) }`)
  })

  test('with update expression', () => {
    let x
    expect(tersify(function () { return ++x })).toBe(`fn() { return ++x }`)
    expect(tersify(function () { return x++ })).toBe(`fn() { return x++ }`)
  })

  test('with multi-variable declaration and init (and ternary expression)', () => {
    expect(tersify(function () {
      // tslint:disable-next-line: one-variable-per-declaration
      let x = 1, y: any, z = 2
      return y ? x : z
    })).toBe('fn() { let x = 1, y, z = 2; return y ? x : z }')
  })

  test('with if statement', () => {
    expect(tersify(function (x) {
      if (x) {
        return true
      }
      else {
        return false
      }
    })).toBe('fn(x) { if (x) { return true } else { return false } }')

    expect(tersify(function (x) {
      if (x) return true
      else return false
    })).toBe('fn(x) { if (x) return true; else return false }')
    expect(tersify(function (x) {
      if (x) return true
      else {
        return false
      }
    })).toBe('fn(x) { if (x) return true; else { return false } }')

    expect(tersify(function (x) {
      if (x) {
        return true
      }
      return false
    })).toBe('fn(x) { if (x) { return true }; return false }')

    expect(tersify(function (x) {
      if (x) return true
      return false
    })).toBe('fn(x) { if (x) return true; return false }')
  })

  test('with assignment', () => {
    expect(tersify(function (x) {
      return x %= 1
    })).toBe('fn(x) { return x %= 1 }')
  })

  test('with while loop', () => {
    expect(tersify(function (x) {
      while (x) {
        x -= 1
      }
    })).toBe('fn(x) { while (x) { x -= 1 } }')

    expect(tersify(function (x) {
      while (true) x -= 1
    })).toBe('fn(x) { while (true) x -= 1 }')
  })

  test('with do loop', () => {
    expect(tersify(function (x) {
      do {
        x -= 1
      } while (x)
    })).toBe('fn(x) { do { x -= 1 } while (x) }')

    expect(tersify(function (x) {
      do x -= 1
      while (x)
    })).toBe('fn(x) { do x -= 1; while (x) }')
  })

  test('with for loop', () => {
    expect(tersify(function () {
      for (let i = 0; i < 10; i++) {
        console.info(i)
      }
    })).toBe('fn() { for (let i = 0; i < 10; i++) { console.info(i) } }')
  })

  test('with for loop no init', () => {
    expect(tersify(function () {
      let i = 0
      for (; i < 10; i++) {
        console.info(i)
      }
    })).toBe('fn() { let i = 0; for (; i < 10; i++) { console.info(i) } }')
  })

  test('with for loop no test', () => {
    expect(tersify(function () {
      for (let i = 0; ; i++) {
        console.info(i)
      }
    })).toBe('fn() { for (let i = 0;; i++) { console.info(i) } }')
  })

  test('with for loop no update', () => {
    expect(tersify(function () {
      for (let i = 0, y = 1; i < 10;) {
        console.info(i, y)
      }
    })).toBe('fn() { for (let i = 0, y = 1; i < 10;) { console.info(i, y) } }')
  })

  test('with for loop with break', () => {
    expect(tersify(function () {
      for (; ;) {
        break;
      }
    })).toBe('fn() { for (;;) { break } }')
  })

  test('with for loop with labeled break', () => {
    expect(tersify(function () {
      label: for (; ;) { break label }
    })).toBe(`fn() { label: for (;;) { break label } }`)
  })

  test('with for loop with continue', () => {
    expect(tersify(function () {
      for (; ;) { continue }
    })).toBe(`fn() { for (;;) { continue } }`)
  })

  test('with for loop with labeled continue', () => {
    expect(tersify(function () {
      foo: for (; ;) { continue foo }
    })).toBe(`fn() { foo: for (;;) { continue foo } }`)
  })

  test('with switch', () => {
    expect(tersify(function (x) {
      switch (x) {
        case 1:
          break
        case 2:
          return
        default:
          return 3
      }
    })).toBe(`fn(x) { switch (x) { case 1: break; case 2: return; default: return 3 } }`)
  })

  test('with switch using expression', () => {
    expect(tersify(function (x) {
      switch (true) {
        case x > 1:
          break
      }
    })).toBe(`fn(x) { switch (true) { case x > 1: break } }`)
  })

  test('with for in', () => {
    expect(tersify(function (x) {
      for (let y in x) console.info(y)
    })).toBe(`fn(x) { for (let y in x) console.info(y) }`)

    expect(tersify(function (x) {
      for (let y in x) {
        console.info(y + 1)
        console.info(y)
      }
    })).toBe(`fn(x) { for (let y in x) { console.info(y + 1); console.info(y) } }`)
  })

  test('with for of', () => {
    expect(tersify(function (x) {
      for (let y of x) console.info(y)
    })).toBe(`fn(x) { for (let y of x) console.info(y) }`)

    expect(tersify(function (x) {
      for (let y of x) {
        console.info(y + 1)
        console.info(y)
      }
    })).toBe(`fn(x) { for (let y of x) { console.info(y + 1); console.info(y) } }`)
  })

  test(`async function`, () => {
    const x = Promise.resolve()
    expect(tersify(async function () { await x })).toBe('async fn() { await x }')
  })

  test('anomymous generator function', () => {
    expect(tersify(function* () { })).toBe('fn*() {}')
  })

  test('named function', () => {
    expect(tersify(function name() { })).toBe('fn name() {}')
  })
})

describe('arrow function', () => {
  test('with no return', () => {
    expect(tersify(() => { })).toBe('() => {}')
    expect(tersify(() => { }, { maxLength: 8 })).toBe('() => {}')
    expect(tersify(() => { }, { maxLength: 7 })).toBe('() =...')
    expect(tersify(() => { }, { maxLength: 6 })).toBe('() ...')
    expect(tersify(() => { }, { maxLength: 5 })).toBe('()...')
    expect(tersify(() => { }, { maxLength: 4 })).toBe('()..')
    expect(tersify(() => { }, { maxLength: 3 })).toBe('().')
    expect(tersify(() => { }, { maxLength: 2 })).toBe('(.')
    expect(tersify(() => { }, { maxLength: 1 })).toBe('.')
    expect(tersify(() => { }, { maxLength: 0 })).toBe('')
  })

  test('single statement', () => {
    expect(tersify(() => true)).toBe('() => true')
  })

  test('returns nothing', () => {
    expect(tersify(() => { return })).toBe('() => {}')
  })

  test('returns undefined', () => {
    expect(tersify(() => { return undefined })).toBe('() => undefined')
  })

  test('returns null', () => {
    expect(tersify(() => { return null })).toBe('() => null')
  })

  test('returns boolean', () => {
    expect(tersify(() => { return true })).toBe('() => true')
    expect(tersify(() => { return false })).toBe('() => false')
  })

  test('returns number', () => {
    expect(tersify(() => { return 1 })).toBe('() => 1')
  })

  test('returns bigint', () => {
    expect(tersify(() => { return 1n })).toBe('() => 1n')
  })

  test('returns string', () => {
    expect(tersify(() => { return 'a' })).toBe(`() => 'a'`)
  })

  test('returns Symbol', () => {
    expect(tersify(() => { return Symbol() })).toBe(`() => Sym()`)
  })

  test('returns named Symbol', () => {
    expect(tersify(() => { return Symbol.for('abc') })).toBe(`() => Sym(abc)`)
  })

  test(`returns RegExp`, () => {
    expect(tersify(() => { return /foo/g })).toBe(`() => /foo/g`)
  })

  test('returns Date', () => {
    expect(tersify(() => {
      return new Date('2020-05-14T11:45:27.234Z')
    })).toBe(`() => 2020-05-14T11:45:27.234Z`)
  })

  test('returns Date constructed with string literal', () => {
    expect(tersify(() => {
      return new Date('2020-05-14T11:45:27.234Z')
    })).toBe(`() => 2020-05-14T11:45:27.234Z`)

    expect(tersify(() => {
      const date = new Date('2020-05-14T11:45:27.234Z')
      return date
    })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; return date }`)
  })

  test('returns Date constructed with year, month, ...etc', () => {
    expect(tersify(() => {
      return new Date(2020, 4, 14)
    })).toBe(`() => 2020-05-14T07:00:00.000Z`)
  })

  test('returns Date with variable in contructor', () => {
    expect(tersify(() => {
      let x = 1
      return new Date(2020, x)
    })).toBe(`() => { let x = 1; return new Date(2020, x) }`)
  })

  test('returns Buffer', () => {
    expect(tersify(() => {
      return Buffer.from('abc')
    })).toBe(`() => Buffer.from('abc')`)
  })

  test('return anomymous function', () => {
    expect(tersify(() => function () { })).toBe(`() => fn() {}`)
    expect(tersify(() => { return function () { } })).toBe(`() => fn() {}`)
    expect(tersify(() => function (a, b) {
      console.info(a)
      console.info(b)
    })).toBe(`() => fn(a, b) { console.info(a); console.info(b) }`)
  })

  test('return named function', () => {
    expect(tersify(() => function foo() { })).toBe(`() => fn foo() {}`)
    expect(tersify(() => { return function foo() { } })).toBe(`() => fn foo() {}`)
    expect(tersify(() => function foo(a, b) {
      console.info(a)
      console.info(b)
    })).toBe(`() => fn foo(a, b) { console.info(a); console.info(b) }`)
  })

  test('return arrow function', () => {
    expect(tersify(() => () => true)).toBe(`() => () => true`)
    expect(tersify((a) => (b) => {
      console.info(a)
      console.info(b)
    })).toBe(`(a) => (b) => { console.info(a); console.info(b) }`)
  })

  test(`returns async anomymous function`, () => {
    expect(tersify(() => { return async function () { } })).toBe(`() => async fn() {}`)
  })

  test(`returns async named function`, () => {
    expect(tersify(() => { return async function foo() { } })).toBe(`() => async fn foo() {}`)
  })

  test(`returns async arrow function`, () => {
    expect(tersify(() => { return async () => { } })).toBe(`() => async () => {}`)
  })

  test(`returns generator anomymous function`, () => {
    expect(tersify(() => { return function* () { } })).toBe(`() => fn*() {}`)
  })

  test(`returns generator named function`, () => {
    expect(tersify(() => { return function* foo() { } })).toBe(`() => fn* foo() {}`)
  })

  test(`returns async generator anomymous function`, () => {
    expect(tersify(() => { return async function* () { } })).toBe(`() => async fn*() {}`)
  })

  test(`returns async generator named function`, () => {
    expect(tersify(() => { return async function* foo() { } })).toBe(`() => async fn* foo() {}`)
  })

  test('returns single property object', () => {
    expect(tersify(() => {
      return { a: 1 }
    })).toBe('() => ({ a: 1 })')
  })

  test('returns multiple property object', () => {
    expect(tersify(() => {
      return { a: 1, b: 'b' }
    })).toBe(`() => ({ a: 1, b: 'b' })`)
  })

  test('returns computed property object', () => {
    expect(tersify(() => {
      const x = 'xyz'
      return { [x]: true }
    })).toBe(`() => { const x = 'xyz'; return { [x]: true } }`)

    expect(tersify(() => {
      return { ['x']: true }
    })).toBe(`() => ({ ['x']: true })`)
  })

  test('returns symbol property object', () => {
    expect(tersify(() => {
      return { [Symbol()]: true }
    })).toBe(`() => ({ [Sym()]: true })`)

    expect(tersify(() => {
      return { [Symbol.for('abc')]: true }
    })).toBe(`() => ({ [Sym(abc)]: true })`)

    expect(tersify(() => {
      const tx = Symbol.for('abc')
      return { [tx]: true }
    })).toBe(`() => { const tx = Sym(abc); return { [tx]: true } }`)
  })

  test('returns method property object', () => {
    expect(tersify(() => {
      return { m: function () { return 'abc' } }
    })).toBe(`() => ({ m() { return 'abc' } })`)
  })

  test('returns named method property object', () => {
    expect(tersify(() => {
      return { m: function foo() { return 'abc' } }
    })).toBe(`() => ({ m() { return 'abc' } })`)
  })

  test('returns async method property object', () => {
    expect(tersify(() => {
      return { m: async function () { return 'abc' } }
    })).toBe(`() => ({ async m() { return 'abc' } })`)
  })

  test('returns generator method property object', () => {
    expect(tersify(() => {
      return { m: function* () { yield 'abc' } }
    })).toBe(`() => ({ *m() { yield 'abc' } })`)
  })

  test('returns async generator method property object', () => {
    expect(tersify(() => {
      return { m: async function* () { return 'abc' } }
    })).toBe(`() => ({ async *m() { return 'abc' } })`)
  })

  test('returns es6 method property object', () => {
    expect(tersify(() => {
      return { m() { return 'abc' } }
    })).toBe(`() => ({ m() { return 'abc' } })`)
  })

  test('returns async es6 method property object', () => {
    expect(tersify(() => {
      return { async m() { return 'abc' } }
    })).toBe(`() => ({ async m() { return 'abc' } })`)
  })

  test('returns generator es6 method property object', () => {
    expect(tersify(() => {
      return { *m() { return 'abc' } }
    })).toBe(`() => ({ *m() { return 'abc' } })`)
  })

  test('returns async generator es6 method property object', () => {
    expect(tersify(() => {
      return { async *m() { return 'abc' } }
    })).toBe(`() => ({ async *m() { return 'abc' } })`)
  })

  test('returns arrow method property object', () => {
    expect(tersify(() => {
      return { m: () => { return 'abc' } }
    })).toBe(`() => ({ m: () => 'abc' })`)
  })

  test('returns async arrow method property object', () => {
    expect(tersify(() => {
      return { m: async () => { return 'abc' } }
    })).toBe(`() => ({ m: async () => 'abc' })`)
  })

  test('returns array', () => {
    expect(tersify(() => { return [] })).toBe(`() => []`)
    expect(tersify(() => { return [1, undefined, 'a'] })).toBe(`() => [1, undefined, 'a']`)
  })

  test('with variable declaration', () => {
    const subject: any = () => {
      const date = new Date('2020-05-14T11:45:27.234Z');
      return date;
    };
    expect(tersify(subject)).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; return date }`)
    expect(tersify(subject, { maxLength: 60 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; return date }`)
    expect(tersify(subject, { maxLength: 59 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; return ... }`)
    expect(tersify(subject, { maxLength: 53 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; r... }`)
    expect(tersify(subject, { maxLength: 52 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z; ... }`)
    expect(tersify(subject, { maxLength: 51 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z;... }`)
    expect(tersify(subject, { maxLength: 50 })).toBe(`() => { const date = 2020-05-14T11:45:27.234Z... }`)
    expect(tersify(subject, { maxLength: 49 })).toBe(`() => { const date = 2020-05-14T11:45:27.234... }`)
    expect(tersify(subject, { maxLength: 27 })).toBe(`() => { const date = 2... }`)
    expect(tersify(subject, { maxLength: 26 })).toBe(`() => { const date = ... }`)
    expect(tersify(subject, { maxLength: 25 })).toBe(`() => { const date =... }`)
    expect(tersify(subject, { maxLength: 24 })).toBe(`() => { const date ... }`)
    expect(tersify(subject, { maxLength: 22 })).toBe(`() => { const dat... }`)
    expect(tersify(subject, { maxLength: 20 })).toBe(`() => { const d... }`)
    expect(tersify(subject, { maxLength: 19 })).toBe(`() => { const ... }`)
    expect(tersify(subject, { maxLength: 18 })).toBe(`() => { const... }`)
    expect(tersify(subject, { maxLength: 14 })).toBe(`() => { co.. }`)
  })

  test('with variable declaration but no init', () => {
    expect(tersify(() => {
      let x
      return x
    })).toBe('() => { let x; return x }')
  })

  test('with multi-variable declaration', () => {
    expect(tersify(() => {
      // tslint:disable-next-line: one-variable-per-declaration
      let x: any, y: any
      return x + y
    })).toBe('() => { let x, y; return x + y }')
  })

  test('with prefix unary expression', () => {
    expect(tersify(() => { return !!1 })).toBe(`() => !!1`)
    expect(tersify(() => { return +1 })).toBe(`() => +1`)
  })

  // Can't think of a postfix unary expression. `x++` and `x--` are update expression.
  test.todo('with postfix unary expression')

  test('with logical expression', () => {
    expect(tersify(() => { return 1 && 2 })).toBe(`() => 1 && 2`)
  })

  test('with binary expression', () => {
    expect(tersify(() => { return (1 + 2) * 3 })).toBe(`() => (1 + 2) * 3`)
    expect(tersify(() => { return 3 * (1 + 2) })).toBe(`() => 3 * (1 + 2)`)
  })

  test('with update expression', () => {
    let x
    expect(tersify(() => { return ++x })).toBe(`() => ++x`)
    expect(tersify(() => { return x++ })).toBe(`() => x++`)
  })

  test('with multi-variable declaration and init (and ternary expression)', () => {
    expect(tersify(() => {
      // tslint:disable-next-line: one-variable-per-declaration
      let x = 1, y: any, z = 2
      return y ? x : z
    })).toBe('() => { let x = 1, y, z = 2; return y ? x : z }')
  })

  test('with if statement', () => {
    expect(tersify((x) => {
      if (x) {
        return true
      }
      else {
        return false
      }
    })).toBe('(x) => { if (x) { return true } else { return false } }')

    expect(tersify((x) => {
      if (x) return true
      else return false
    })).toBe('(x) => { if (x) return true; else return false }')
    expect(tersify((x) => {
      if (x) return true
      else {
        return false
      }
    })).toBe('(x) => { if (x) return true; else { return false } }')

    expect(tersify((x) => {
      if (x) {
        return true
      }
      return false
    })).toBe('(x) => { if (x) { return true }; return false }')

    expect(tersify((x) => {
      if (x) return true
      return false
    })).toBe('(x) => { if (x) return true; return false }')
  })

  test('with assignment', () => {
    expect(tersify((x) => {
      return x %= 1
    })).toBe('(x) => x %= 1')
  })

  test('with while loop', () => {
    expect(tersify((x) => {
      while (x) {
        x -= 1
      }
    })).toBe('(x) => { while (x) { x -= 1 } }')

    expect(tersify((x) => {
      while (true) x -= 1
    })).toBe('(x) => { while (true) x -= 1 }')
  })

  test('with do loop', () => {
    expect(tersify((x) => {
      do {
        x -= 1
      } while (x)
    })).toBe('(x) => { do { x -= 1 } while (x) }')

    expect(tersify((x) => {
      do x -= 1
      while (x)
    })).toBe('(x) => { do x -= 1; while (x) }')
  })

  test('with for loop', () => {
    expect(tersify(() => {
      for (let i = 0; i < 10; i++) {
        console.info(i)
      }
    })).toBe('() => { for (let i = 0; i < 10; i++) { console.info(i) } }')
  })

  test('with for loop no init', () => {
    expect(tersify(() => {
      let i = 0
      for (; i < 10; i++) {
        console.info(i)
      }
    })).toBe('() => { let i = 0; for (; i < 10; i++) { console.info(i) } }')
  })

  test('with for loop no test', () => {
    expect(tersify(() => {
      for (let i = 0; ; i++) {
        console.info(i)
      }
    })).toBe('() => { for (let i = 0;; i++) { console.info(i) } }')
  })

  test('with for loop no update', () => {
    expect(tersify(() => {
      for (let i = 0, y = 1; i < 10;) {
        console.info(i, y)
      }
    })).toBe('() => { for (let i = 0, y = 1; i < 10;) { console.info(i, y) } }')
  })

  test('with for loop with break', () => {
    expect(tersify(() => {
      for (; ;) {
        break;
      }
    })).toBe('() => { for (;;) { break } }')
  })

  test('with for loop with labeled break', () => {
    expect(tersify(() => {
      label: for (; ;) { break label }
    })).toBe(`() => { label: for (;;) { break label } }`)
  })

  test('with for loop with continue', () => {
    expect(tersify(() => {
      for (; ;) { continue }
    })).toBe(`() => { for (;;) { continue } }`)
  })

  test('with for loop with labeled continue', () => {
    expect(tersify(() => {
      foo: for (; ;) { continue foo }
    })).toBe(`() => { foo: for (;;) { continue foo } }`)
  })

  test('with switch', () => {
    expect(tersify((x) => {
      switch (x) {
        case 1:
          break
        case 2:
          return
        default:
          return 3
      }
    })).toBe(`(x) => { switch (x) { case 1: break; case 2: return; default: return 3 } }`)
  })

  test('with switch using expression', () => {
    expect(tersify((x) => {
      switch (true) {
        case x > 1:
          break
      }
    })).toBe(`(x) => { switch (true) { case x > 1: break } }`)
  })

  test('with for in', () => {
    expect(tersify((x) => {
      for (let y in x) console.info(y)
    })).toBe(`(x) => { for (let y in x) console.info(y) }`)

    expect(tersify((x) => {
      for (let y in x) {
        console.info(y + 1)
        console.info(y)
      }
    })).toBe(`(x) => { for (let y in x) { console.info(y + 1); console.info(y) } }`)
  })

  test('with for of', () => {
    expect(tersify((x) => {
      for (let y of x) console.info(y)
    })).toBe(`(x) => { for (let y of x) console.info(y) }`)

    expect(tersify((x) => {
      for (let y of x) {
        console.info(y + 1)
        console.info(y)
      }
    })).toBe(`(x) => { for (let y of x) { console.info(y + 1); console.info(y) } }`)
  })

  test(`async arrow function`, () => {
    const x = Promise.resolve()
    expect(tersify(async () => { await x })).toBe('async () => { await x }')
  })
})

describe('object', () => {
  test('empty object as {}', () => {
    expect(tersify({})).toBe('{}')
  })

  test('primitive type properties', () => {
    expect(tersify({ a: undefined })).toBe('{ a: undefined }')
    expect(tersify({ a: null })).toBe('{ a: null }')
    expect(tersify({ a: true })).toBe('{ a: true }')
    expect(tersify({ a: false })).toBe('{ a: false }')
    expect(tersify({ a: 12345 })).toBe('{ a: 12345 }')
    expect(tersify({ a: 12345n })).toBe('{ a: 12345n }')
    expect(tersify({ a: 'abc' })).toBe(`{ a: 'abc' }`)
    expect(tersify({ a: Symbol() })).toBe('{ a: Sym() }')
    expect(tersify({ a: Symbol.for('abc') })).toBe('{ a: Sym(abc) }')
    expect(tersify({ a: /abcd/gi })).toBe('{ a: /abcd/gi }')
  })

  test('date object property', () => {
    expect(tersify({ a: new Date('2020-05-14T11:45:27.234Z') })).toBe(`{ a: 2020-05-14T11:45:27.234Z }`)
  })

  test('trim content inside the object before triming outside', () => {
    expect(tersify({ a: /abcd/gi }, { maxLength: 15 })).toBe('{ a: /abcd/gi }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 14 })).toBe('{ a: /abc... }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 9 })).toBe('{ a:... }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 8 })).toBe('{ a:.. }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 7 })).toBe('{ a:. }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 6 })).toBe('{ a. }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 5 })).toBe('{ . }')
    expect(tersify({ a: /abcd/gi }, { maxLength: 4 })).toBe('{ ..')
    expect(tersify({ a: /abcd/gi }, { maxLength: 3 })).toBe('{ .')
    expect(tersify({ a: /abcd/gi }, { maxLength: 2 })).toBe('{.')
    expect(tersify({ a: /abcd/gi }, { maxLength: 1 })).toBe('.')
    expect(tersify({ a: /abcd/gi }, { maxLength: 0 })).toBe('')
  })

  test('multiple properties and trims', () => {
    const subject = {
      abc: 'abc',
      def: 'def'
    }
    expect(tersify(subject)).toBe(`{ abc: 'abc', def: 'def' }`)
    expect(tersify(subject, { maxLength: 26 })).toBe(`{ abc: 'abc', def: 'def' }`)
    expect(tersify(subject, { maxLength: 25 })).toBe(`{ abc: 'abc', def: '... }`)
    expect(tersify(subject, { maxLength: 21 })).toBe(`{ abc: 'abc', de... }`)
    expect(tersify(subject, { maxLength: 20 })).toBe(`{ abc: 'abc', d... }`)
    expect(tersify(subject, { maxLength: 19 })).toBe(`{ abc: 'abc', ... }`)
    expect(tersify(subject, { maxLength: 18 })).toBe(`{ abc: 'abc',... }`)
    expect(tersify(subject, { maxLength: 17 })).toBe(`{ abc: 'abc'... }`)
    expect(tersify(subject, { maxLength: 16 })).toBe(`{ abc: 'abc... }`)
    expect(tersify(subject, { maxLength: 15 })).toBe(`{ abc: 'ab... }`)
    expect(tersify(subject, { maxLength: 14 })).toBe(`{ abc: 'a... }`)
    expect(tersify(subject, { maxLength: 13 })).toBe(`{ abc: '... }`)
    expect(tersify(subject, { maxLength: 12 })).toBe(`{ abc: ... }`)
  })

  test('anomymous function', () => {
    expect(tersify({ a: function () { } })).toBe('{ a() {} }')
    expect(tersify({ a: function () { } }, { maxLength: 9 })).toBe('{ a(... }')
  })

  test('named function', () => {
    expect(tersify({ a: function foo() { } })).toBe('{ a() {} }')
  })

  test('async anomymous function', () => {
    expect(tersify({ a: async function () { } })).toBe('{ async a() {} }')
  })

  test('async named function', () => {
    expect(tersify({ a: async function foo() { } })).toBe('{ async a() {} }')
  })

  test('generator anomymous function', () => {
    expect(tersify({ a: function* () { } })).toBe('{ *a() {} }')

  })

  test('generator named function', () => {
    expect(tersify({ a: function* foo() { } })).toBe('{ *a() {} }')
  })

  test('async generator anomymous function', () => {
    expect(tersify({ a: async function* () { } })).toBe('{ async *a() {} }')
  })

  test('async generator named function', () => {
    expect(tersify({ a: async function* foo() { } })).toBe('{ async *a() {} }')
  })

  test('arrow function', () => {
    expect(tersify({ a: () => { } })).toBe('{ a: () => {} }')
  })

  test('async arrow function', () => {
    expect(tersify({ a: async () => { } })).toBe('{ a: async () => {} }')
    expect(tersify({ a: async (a, b, c) => { } })).toBe('{ a: async (a, b, c) => {} }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 28 })).toBe('{ a: async (a, b, c) => {} }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 27 })).toBe('{ a: async (a, b, c) =... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 26 })).toBe('{ a: async (a, b, c) ... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 25 })).toBe('{ a: async (a, b, c)... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 24 })).toBe('{ a: async (a, b, c... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 23 })).toBe('{ a: async (a, b, ... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 17 })).toBe('{ a: async (... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 16 })).toBe('{ a: async ... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 14 })).toBe('{ a: asyn... }')
    expect(tersify({ a: async (a, b, c) => { } }, { maxLength: 10 })).toBe('{ a: ... }')
  })

  test('use tersify function if available', () => {
    const subject = { a: 1 }
    tersible(subject, () => '{a1}')
    expect(tersify(subject)).toBe('{a1}')

    const subject2 = { b: 2 }
    tersible(subject2, 'a2')
    expect(tersify(subject2)).toBe('a2')
  })

  test('skip tersify function if running in raw mode', () => {
    const subject = { a: 1 }
    tersible(subject, '{a1}')
    expect(tersify(subject, { raw: true })).toBe('{ a: 1 }')
  })

  test('referencing itself', () => {
    const subject: any = { x: 1 }
    subject.y = subject
    expect(tersify(subject)).toBe('{ x: 1, y: ref() }')
  })

  test('referencing the same sub-node', () => {
    const node = { x: 1 }
    const subject = { a: { b: node }, c: node }
    expect(tersify(subject)).toBe('{ a: { b: { x: 1 } }, c: ref(a, b) }')
  })
})

describe('array', () => {
  test('empty array as []', () => {
    expect(tersify([])).toBe('[]')
  })

  test('with primitive values', () => {
    expect(tersify([undefined])).toBe('[undefined]')
    expect(tersify([null])).toBe('[null]')
    expect(tersify([true])).toBe('[true]')
    expect(tersify([false])).toBe('[false]')
    expect(tersify([12345])).toBe('[12345]')
    expect(tersify([12345n])).toBe('[12345n]')
    expect(tersify(['abc'])).toBe(`['abc']`)
    expect(tersify([Symbol()])).toBe('[Sym()]')
    expect(tersify([Symbol.for('abc')])).toBe('[Sym(abc)]')
    expect(tersify([/abcd/gi])).toBe('[/abcd/gi]')
  })

  test('multiple entries', () => {
    expect(tersify([1, 2, 3])).toBe('[1, 2, 3]')
  })

  test('with object entry', () => {
    expect(tersify([{ a: 1 }])).toBe('[{ a: 1 }]')
  })

  test('with anomymous function', () => {
    expect(tersify([function () { return 'a' }])).toBe(`[fn() { return 'a' }]`)
  })

  test('with named function', () => {
    expect(tersify([function foo() { return 'a' }])).toBe(`[fn foo() { return 'a' }]`)
  })

  test('with async function', () => {
    expect(tersify([async function () { return 'a' }])).toBe(`[async fn() { return 'a' }]`)
  })

  test('with generator function', () => {
    expect(tersify([function* () { return 'a' }])).toBe(`[fn*() { return 'a' }]`)
  })

  test('with async generator function', () => {
    expect(tersify([async function* () { return 'a' }])).toBe(`[async fn*() { return 'a' }]`)
  })

  test('trim the entry when exceed maxLength', () => {
    expect(tersify(['123456789012345678901234567890'], { maxLength: 34 })).toBe(`['123456789012345678901234567890']`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 33 })).toBe(`['123456789012345678901234567...]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 32 })).toBe(`['12345678901234567890123456...]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 8 })).toBe(`['12...]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 7 })).toBe(`['1...]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 6 })).toBe(`['1..]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 5 })).toBe(`['1.]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 4 })).toBe(`['.]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 3 })).toBe(`[.]`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 2 })).toBe(`[.`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 1 })).toBe(`.`)
    expect(tersify(['123456789012345678901234567890'], { maxLength: 0 })).toBe(``)
  })

  test('trim last entries first', () => {
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 24 })).toBe(`['abcd', '1234', 'abcd']`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 23 })).toBe(`['abcd', '1234', 'a...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 22 })).toBe(`['abcd', '1234', '...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 21 })).toBe(`['abcd', '1234', ...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 20 })).toBe(`['abcd', '1234',...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 19 })).toBe(`['abcd', '1234'...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 18 })).toBe(`['abcd', '1234...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 14 })).toBe(`['abcd', '...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 13 })).toBe(`['abcd', ...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 12 })).toBe(`['abcd',...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 11 })).toBe(`['abcd'...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 10 })).toBe(`['abcd...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 7 })).toBe(`['a...]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 6 })).toBe(`['a..]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 5 })).toBe(`['a.]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 4 })).toBe(`['.]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 3 })).toBe(`[.]`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 2 })).toBe(`[.`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 1 })).toBe(`.`)
    expect(tersify(['abcd', '1234', 'abcd'], { maxLength: 0 })).toBe(``)
  })

  test('use tersify function if available', () => {
    const subject = [{ a: 1 }]
    tersible(subject, () => '[{a1}]')
    expect(tersify(subject)).toBe('[{a1}]')

    const subject2 = [{ b: 2 }]
    tersible(subject2, '!a2!')
    expect(tersify(subject2)).toBe('!a2!')
  })

  test('skip tersify function if running in raw mode', () => {
    const subject = [{ a: 1 }]
    tersible(subject, '[{a1}]')
    expect(tersify(subject, { raw: true })).toBe('[{ a: 1 }]')
  })

  test('referencing itself', () => {
    const subject: any[] = ['a']
    subject.push(subject)
    expect(tersify(subject)).toBe(`['a', ref()]`)
  })

  test('multiple reference of the same entry', () => {
    const node = { a: 1 }
    const subject = [node, node]
    expect(tersify(subject)).toBe(`[{ a: 1 }, ref(0)]`)
  })
})

describe('error', () => {
  test('empty error', () => {
    expect(tersify(new Error())).toBe('Err()')
  })

  test('error with message', () => {
    expect(tersify(new Error('abc'))).toBe(`Err(abc)`)
    expect(tersify(new Error(123 as any))).toBe(`Err(123)`)
  })

  test('custom error shown as error. Properties ignored', () => {
    class CustErr extends Error {
      constructor(public x: string) {
        super(`${x} happened`)
      }
    }
    expect(tersify(new CustErr('abc'))).toBe(`Err(abc happened)`)
  })

  test('trim message first if longer than maxLength', () => {
    expect(tersify(new Error('abcdefghi'), { maxLength: 14 })).toBe(`Err(abcdefghi)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 13 })).toBe(`Err(abcde...)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 9 })).toBe(`Err(ab..)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 8 })).toBe(`Err(ab.)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 7 })).toBe(`Err(a.)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 6 })).toBe(`Err(.)`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 5 })).toBe(`Er...`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 4 })).toBe(`Er..`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 3 })).toBe(`Er.`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 2 })).toBe(`E.`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 1 })).toBe(`.`)
    expect(tersify(new Error('abcdefghi'), { maxLength: 0 })).toBe(``)
  })
})
