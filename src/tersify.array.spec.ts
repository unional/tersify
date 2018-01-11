import { test } from 'ava'

import { tersify, tersible } from './index'

test('empty array', t => {
  t.is(tersify([]), '[]')
})

test('array with primitive', t => {
  t.is(tersify([1, false, 'a']), `[1, false, 'a']`)
})

test('array with object', t => {
  t.is(tersify([{ a: 1 }]), `[{ a: 1 }]`)
})

test('object with array', t => {
  t.is(tersify({ path: [1, 2], expected: /*istanbul ignore next*/ a => a > 0, actual: 0 }), `{ path: [1, 2], expected: a => a > 0, actual: 0 }`)
})

test('use tersify method for each element in array', t => {
  const a = tersible({ a: 1 }, () => 'a1')
  const b = tersible({ b: 2 }, () => 'b2')
  t.is(tersify([a, b, { c: 3 }, undefined, null, 1, 'a']), `[a1, b2, { c: 3 }, undefined, null, 1, 'a']`)
})

test('long array will be trimmed', t => {
  const a = { aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }
  t.is(tersify([a, a]), `[{ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ... ]`)
})

test('maxLength: Infinity will return whole array without trim', t => {
  const a = { aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }
  t.is(tersify([a, /*istanbul ignore next*/ function (x, y) {
    console.log(1)
    console.log(2)
    console.log(3)
    console.log(4)
    console.log(5)
    console.log(6)
    console.log(7)
    console.log(8)
    console.log(9)
    console.log(10)
    x++
    return y
  }], { maxLength: Infinity }), `[{ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }, function (x, y) { console.log(1); console.log(2); console.log(3); console.log(4); console.log(5); console.log(6); console.log(7); console.log(8); console.log(9); console.log(10); x++; return y; }]`)
})
