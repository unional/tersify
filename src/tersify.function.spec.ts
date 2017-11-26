import test from 'ava'

import { tersify, tersible } from './index'

test('anonymous function', t => {
  t.is(tersify(function () { }), 'function () {}')
})

test('anonymous function with single param', t => {
  t.is(tersify(function (x) { }), 'function (x) {}')
})

test('anonymous function with multi-params', t => {
  t.is(tersify(function (x, y) { }), 'function (x, y) {}')
})

test('anonymous function with return', t => {
  t.is(tersify(function () { return }), 'function () { return; }')
  t.is(tersify(function () { return false }), 'function () { return false; }')
})

test('multi-lines anonymous function', t => {
  t.is(tersify(function (x, y) {
    x++
    return y
  }), 'function (x, y) { x++; return y; }')
})

test('long anonymous function trimmed at specified length', t => {
  const actual = tersify(function (x, y) {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  }, { maxLength: 110 })

  t.is(actual.length, 110)
  t.is(actual, 'function (x, y) { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console... }')
})

test('named function', t => {
  function foo() { }
  t.is(tersify(foo), 'function foo() {}')
})

test('named function with single param', t => {
  t.is(tersify(function foo(x) { }), 'function foo(x) {}')
})

test('named function with multi-params', t => {
  t.is(tersify(function foo(x, y) { }), 'function foo(x, y) {}')
})

test('named function with return', t => {
  t.is(tersify(function foo() { return }), 'function foo() { return; }')
  t.is(tersify(function foo() { return false }), 'function foo() { return false; }')
})

test('multi-lines named function', t => {
  t.is(tersify(function foo(x, y) {
    x++
    return y
  }), 'function foo(x, y) { x++; return y; }')
})

test('long named function trimmed at specified length', t => {
  const actual = tersify(function foo(x, y) {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  }, { maxLength: 110 })

  t.is(actual.length, 110)
  t.is(actual, 'function foo(x, y) { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); cons... }')
})

test('named function with too long signature', t => {
  const actual = tersify(function veryVeryVeryVeryLongNameFunction(a, b, c, d, e, f, g) { return a + b + c + d + e + f + g }, { maxLength: 50 })

  t.is(actual.length, 50)
  t.is(actual, 'function veryVeryVeryVeryLongNameFunction(a, b,...')
})

test('arrow function', t => {
  t.is(tersify(() => { }), '() => {}')
})

test('arrow with single param', t => {
  t.is(tersify(x => false), 'x => false')
  t.is(tersify((x) => false), 'x => false')
})

test('arrow with muliple params', t => {
  t.is(tersify((x, y) => false), '(x, y) => false')
})

test('arrow with return', t => {
  t.is(tersify((x, y) => { return false }), '(x, y) => false')
})

test('multi-lines arrow', t => {
  t.is(tersify((x, y) => {
    x++
    return y
  }), '(x, y) => { x++; return y; }')
})

test('long arrow trimmed at specified length', t => {
  const actual = tersify((x, y) => {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  }, { maxLength: 110 })

  t.is(actual.length, 110)
  t.is(actual, '(x, y) => { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console.log(6... }')
})

test('arrow function with too long signature', t => {
  const actual = tersify((a, b, c, d, e, f, g, veryVeryVeryVeryLongArgument1, veryVeryVeryVeryLongArgument2) => { return a + b + c + d + e + f + g }, { maxLength: 50 })
  t.is(actual.length, 50)
  t.is(actual, '(a, b, c, d, e, f, g, veryVeryVeryVeryLongArgum...')
})

test('long single expression arrow trimmed at specified length', t => {
  const actual = tersify((x, y) => 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + x + y, { maxLength: 30 })

  t.is(actual.length, 30)
  t.is(actual, '(x, y) => 1 + 2 + 3 + 4 + 5...')
})

test('use tersify() when available', t => {
  t.is(tersify(tersible((x, y) => x + y, () => 'x + y')), 'x + y')
})
