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
  t.is(tersify([a, b, { c: 3 }]), `[a1, b2, { c: 3 }]`)
})
