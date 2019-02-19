import t from 'assert'

import { tersify, tersible } from './index'

test.only('anonymous function', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function () { }), 'function () {}')
})

test('anonymous function with single param', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function (x) { }), 'function (x) {}')
})

test('anonymous function with multi-params', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function (x, y) { }), 'function (x, y) {}')
})

test('anonymous function with return', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function () { return }), 'function () { return; }')
  t.strictEqual(tersify(/*istanbul ignore next*/ function () { return false }), 'function () { return false; }')
})

test('multi-lines anonymous function', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function (x, y) {
    x++
    return y
  }), 'function (x, y) { x++; return y; }')
})

test('long anonymous function trimmed at specified length', () => {
  const actual = tersify(/*istanbul ignore next*/ function (x, y) {
    console.info(1)
    console.info(2)
    console.info(3)
    console.info(4)
    console.info(5)
    console.info(6)
    x++
    return y
  }, { maxLength: 110 })

  t.strictEqual(actual.length, 110)
  t.strictEqual(actual, 'function (x, y) { console.info(1); console.info(2); console.info(3); console.info(4); console.info(5); co... }')
})

test('named function', () => {
  /*istanbul ignore next*/ function foo() { }
  t.strictEqual(tersify(foo), 'function foo() {}')
})

test('named function with single param', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function foo(x) { }), 'function foo(x) {}')
})

test('named function with multi-params', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function foo(x, y) { }), 'function foo(x, y) {}')
})

test('named function with return', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function foo() { return }), 'function foo() { return; }')
  t.strictEqual(tersify(/*istanbul ignore next*/ function foo() { return false }), 'function foo() { return false; }')
})

test('multi-lines named function', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ function foo(x, y) {
    x++
    return y
  }), 'function foo(x, y) { x++; return y; }')
})

test('long named function trimmed at specified length', () => {
  const actual = tersify(/*istanbul ignore next*/ function foo(x, y) {
    console.info(1)
    console.info(2)
    console.info(3)
    console.info(4)
    console.info(5)
    console.info(6)
    x++
    return y
  }, { maxLength: 110 })

  t.strictEqual(actual.length, 110)
  t.strictEqual(actual, 'function foo(x, y) { console.info(1); console.info(2); console.info(3); console.info(4); console.info(5);... }')
})

test('named function with too long signature', () => {
  const actual = tersify(/*istanbul ignore next*/ function veryVeryVeryVeryLongNameFunction(a, b, c, d, e, f, g) {
    return a + b + c + d + e + f + g
  }, { maxLength: 50 })

  t.strictEqual(actual.length, 50)
  t.strictEqual(actual, 'function veryVeryVeryVeryLongNameFunction(a, b,...')
})

test('arrow function', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/() => { }), '() => {}')
})

test('arrow with single param', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/ x => false), 'x => false')
  t.strictEqual(tersify(/*istanbul ignore next*/(x) => false), 'x => false')
})

test('arrow with muliple params', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/(x, y) => false), '(x, y) => false')
})

test('arrow with return', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/(x, y) => { return false }), '(x, y) => false')
})

test('multi-lines arrow', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/(x, y) => {
    x++
    return y
  }), '(x, y) => { x++; return y; }')
})

test('arrow with evaluation', () => {
  t.strictEqual(tersify(/*istanbul ignore next*/(x, y) => ({ x, y })), '(x, y) => ({ x, y })')
})

test('long arrow trimmed at specified length', () => {
  const actual = tersify(/*istanbul ignore next*/(x, y) => {
    console.info(1)
    console.info(2)
    console.info(3)
    console.info(4)
    console.info(5)
    console.info(6)
    x++
    return y
  }, { maxLength: 110 })

  t.strictEqual(actual.length, 110)
  t.strictEqual(actual, '(x, y) => { console.info(1); console.info(2); console.info(3); console.info(4); console.info(5); console.... }')
})

test('arrow function with too long signature', () => {
  const actual = tersify(/*istanbul ignore next*/(a, b, c, d, e, f, g, veryVeryVeryVeryLongArgument1, veryVeryVeryVeryLongArgument2) => { return a + b + c + d + e + f + g }, { maxLength: 50 })
  t.strictEqual(actual.length, 50)
  t.strictEqual(actual, '(a, b, c, d, e, f, g, veryVeryVeryVeryLongArgum...')
})

test('long single expression arrow trimmed at specified length', () => {
  const actual = tersify(/*istanbul ignore next*/(x, y) => 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + x + y, { maxLength: 30 })

  t.strictEqual(actual.length, 30)
  t.strictEqual(actual, '(x, y) => 1 + 2 + 3 + 4 + 5...')
})

test('use tersify() when available', () => {
  t.strictEqual(tersify(tersible(/*istanbul ignore next*/(x, y) => x + y, () => 'x + y')), 'x + y')
})

test('raw will skip tersify() method', () => {
  t.strictEqual(tersify(tersible(/*istanbul ignore next*/(x, y) => x + y, /*istanbul ignore next*/() => 'x + y'), { raw: true }), '(x, y) => x + y')
  t.strictEqual(tersify(tersible(/*istanbul ignore next*/function (x, y) { return x + y }, /*istanbul ignore next*/() => 'x + y'), { raw: true }), 'function (x, y) { return x + y; }')
})
