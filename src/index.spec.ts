import test from 'ava'
import { formatFunction } from './index';

test('anonymous function', t => {
  t.is(formatFunction(function () { }), 'function () {}')
})

test('anonymous function with single param', t => {
  t.is(formatFunction(function (x) { }), 'function (x) {}')
})

test('anonymous function with multi-params', t => {
  t.is(formatFunction(function (x, y) { }), 'function (x, y) {}')
})

test('anonymous function with return', t => {
  t.is(formatFunction(function () { return }), 'function () { return; }')
  t.is(formatFunction(function () { return false }), 'function () { return false; }')
})

test('multi-lines anonymous function', t => {
  t.is(formatFunction(function (x, y) {
    x++
    return y
  }), 'function (x, y) { x++; return y; }')
})

test('long anonymous function trimmed at 120', t => {
  const actual = formatFunction(function (x, y) {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  })

  t.is(actual.length, 120)
  t.is(actual, 'function (x, y) { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console.log(6); x... }')
})

test('long anonymous function trimmed at specified length', t => {
  const actual = formatFunction(function (x, y) {
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
  t.is(formatFunction(foo), 'function foo() {}')
})

test('named function with single param', t => {
  t.is(formatFunction(function foo(x) { }), 'function foo(x) {}')
})

test('named function with multi-params', t => {
  t.is(formatFunction(function foo(x, y) { }), 'function foo(x, y) {}')
})

test('named function with return', t => {
  t.is(formatFunction(function foo() { return }), 'function foo() { return; }')
  t.is(formatFunction(function foo() { return false }), 'function foo() { return false; }')
})

test('multi-lines named function', t => {
  t.is(formatFunction(function foo(x, y) {
    x++
    return y
  }), 'function foo(x, y) { x++; return y; }')
})

test('long named function trimmed at 120', t => {
  const actual = formatFunction(function foo(x, y) {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  })

  t.is(actual.length, 120)
  t.is(actual, 'function foo(x, y) { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console.log(6)... }')
})

test('long named function trimmed at specified length', t => {
  const actual = formatFunction(function foo(x, y) {
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
  const actual = formatFunction(function veryVeryVeryVeryLongNameFunction(a, b, c, d, e, f, g) { return a + b + c + d + e + f + g }, { maxLength: 50 })

  t.is(actual.length, 50)
  t.is(actual, 'function veryVeryVeryVeryLongNameFunction(a, b,...')
})

test('arrow function', t => {
  t.is(formatFunction(() => { }), '() => {}')
})

test('arrow with single param', t => {
  t.is(formatFunction(x => false), 'x => false')
  t.is(formatFunction((x) => false), 'x => false')
})

test('arrow with muliple params', t => {
  t.is(formatFunction((x, y) => false), '(x, y) => false')
})

test('arrow with return', t => {
  t.is(formatFunction((x, y) => { return false }), '(x, y) => false')
})

test('multi-lines arrow', t => {
  t.is(formatFunction((x, y) => {
    x++
    return y
  }), '(x, y) => { x++; return y; }')
})

test('long arrow trimmed at 120', t => {
  const actual = formatFunction((x, y) => {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    x++
    return y
  })

  t.is(actual.length, 120)
  t.is(actual, '(x, y) => { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console.log(6); x++; re... }')
})

test('long arrow trimmed at specified length', t => {
  const actual = formatFunction((x, y) => {
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
  const actual = formatFunction((a, b, c, d, e, f, g, veryVeryVeryVeryLongArgument1, veryVeryVeryVeryLongArgument2) => { return a + b + c + d + e + f + g }, { maxLength: 50 })
  t.is(actual.length, 50)
  t.is(actual, '(a, b, c, d, e, f, g, veryVeryVeryVeryLongArgum...')
})
