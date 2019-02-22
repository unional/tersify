import { tersify } from './tersify2';
import { tersible } from './tersible';

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

  test('with variable declaration', () => {
    const subject: any = function () {
      const date = new Date('2020-05-14T11:45:27.234Z');
      return date;
    };
    expect(tersify(subject)).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z'); return date }`)
    expect(tersify(subject, { maxLength: 71 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z'); return date }`)
    expect(tersify(subject, { maxLength: 70 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z'); return ... }`)
    expect(tersify(subject, { maxLength: 64 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z'); r... }`)
    expect(tersify(subject, { maxLength: 63 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z'); ... }`)
    expect(tersify(subject, { maxLength: 62 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z');... }`)
    expect(tersify(subject, { maxLength: 61 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27.234Z')... }`)
    expect(tersify(subject, { maxLength: 54 })).toBe(`fn() { const date = new Date('2020-05-14T11:45:27... }`)
    expect(tersify(subject, { maxLength: 35 })).toBe(`fn() { const date = new Date('... }`)
    expect(tersify(subject, { maxLength: 34 })).toBe(`fn() { const date = new Date(... }`)
    expect(tersify(subject, { maxLength: 30 })).toBe(`fn() { const date = new D... }`)
    expect(tersify(subject, { maxLength: 29 })).toBe(`fn() { const date = new ... }`)
    expect(tersify(subject, { maxLength: 28 })).toBe(`fn() { const date = new... }`)
    expect(tersify(subject, { maxLength: 27 })).toBe(`fn() { const date = ne... }`)
    expect(tersify(subject, { maxLength: 25 })).toBe(`fn() { const date = ... }`)
    expect(tersify(subject, { maxLength: 24 })).toBe(`fn() { const date =... }`)
    expect(tersify(subject, { maxLength: 23 })).toBe(`fn() { const date ... }`)
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
      let x, y
      return x + y
    })).toBe('fn() { let x, y; return x + y }')
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
      let x = 1, y, z = 2
      return y ? x : z
    })).toBe('fn() { let x = 1, y, z = 2; return y ? x : z }')
  })

  test('returns Date', () => {
    expect(tersify(function () {
      return new Date('2020-05-14T11:45:27.234Z')
    })).toBe(`fn() { return new Date('2020-05-14T11:45:27.234Z') }`)
  })

  test.todo('returns Buffer')

  test(`returns anomymous function`, () => {
    expect(tersify(function () { return function () { } })).toBe(`fn() { return fn() {} }`)
  })

  test(`returns named function`, () => {
    expect(tersify(function () { return function foo() { } })).toBe(`fn() { return fn foo() {} }`)
  })

  test(`returns arrow function`, () => {
    expect(tersify(function () { return () => { } })).toBe(`fn() { return () => {} }`)
  })

  test.todo('returns object')
  test.todo('returns array')

  test(`async function`, () => {
    expect(tersify(async function () { })).toBe('async fn() {}')
  })

  test('anomymous generator function', () => {
    expect(tersify(function* () { })).toBe('fn*() {}')
  })

  test('named function', () => {
    expect(tersify(function name() { })).toBe('fn name() {}')
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

  test('return string', () => {
    expect(tersify(() => { return 'a' })).toBe(`() => 'a'`)
  })

  test('return Symbol', () => {
    expect(tersify(() => { return Symbol() })).toBe(`() => Sym()`)
  })

  test('return named Symbol', () => {
    expect(tersify(() => { return Symbol.for('abc') })).toBe(`() => Sym(abc)`)
  })

  test('with variable declaration but no init', () => {
    expect(tersify(() => {
      let x
      return x
    })).toBe('() => { let x; return x }')
  })

  test('with multi-variable declaration', () => {
    expect(tersify(() => {
      let x, y
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
      let x = 1, y, z = 2
      return y ? x : z
    })).toBe('() => { let x = 1, y, z = 2; return y ? x : z }')
  })

  test('returns Date', () => {
    expect(tersify(() => {
      return new Date('2020-05-14T11:45:27.234Z')
    })).toBe(`() => new Date('2020-05-14T11:45:27.234Z')`)
  })

  test.todo('returns Buffer')

  test('return RegExp', () => {
    expect(tersify(() => { return /foo/ })).toBe(`() => /foo/`)
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

  test.todo('returns object')
  test.todo('returns array')
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

  test('circular', () => {
    const node = { x: 1 }
    const subject = { a: { b: node }, c: node }
    expect(tersify(subject)).toBe('{ a: { b: { x: 1 } }, c: cir(a, b) }')
  })
})

describe('array', () => { })
describe('error', () => { })
