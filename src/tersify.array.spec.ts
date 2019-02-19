import t from 'assert'

import { tersify, tersible } from './index'

test('empty array', () => {
  t.strictEqual(tersify([]), '[]')
})

test('array with primitive', () => {
  t.strictEqual(tersify([1, false, 'a']), `[1, false, 'a']`)
})

test('array with object', () => {
  t.strictEqual(tersify([{ a: 1 }]), `[{ a: 1 }]`)
})

test('object with array', () => {
  t.strictEqual(tersify({ path: [1, 2], expected: /*istanbul ignore next*/ a => a > 0, actual: 0 }), `{ path: [1, 2], expected: a => a > 0, actual: 0 }`)
})

test('use tersify method for each element in array', () => {
  const a = tersible({ a: 1 }, () => 'a1')
  const b = tersible({ b: 2 }, () => 'b2')
  t.strictEqual(tersify([a, b, { c: 3 }, undefined, null, 1, 'a']), `[a1, b2, { c: 3 }, undefined, null, 1, 'a']`)
})

test('long array will be trimmed', () => {
  const a = { aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }
  t.strictEqual(tersify([a, a]), `[{ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ... ]`)
})

test('maxLength: Infinity will return whole array without trim', () => {
  const a = { aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }
  t.strictEqual(tersify([a, /*istanbul ignore next*/ function (x, y) {
    console.info(1)
    console.info(2)
    console.info(3)
    console.info(4)
    console.info(5)
    console.info(6)
    console.info(7)
    console.info(8)
    console.info(9)
    console.info(10)
    x++
    return y
  }], { maxLength: Infinity }), `[{ aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: 1, bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb: 2, ccccccccccccccccccccccccc: 3, ddddddddddddddddddddddddddddddddd: 4 }, function (x, y) { console.info(1); console.info(2); console.info(3); console.info(4); console.info(5); console.info(6); console.info(7); console.info(8); console.info(9); console.info(10); x++; return y; }]`)
})
