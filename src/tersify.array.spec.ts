import { test } from 'ava'

import { tersify } from './index'

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
  t.is(tersify({ path: [], expected: /*istanbul ignore next*/ a => a > 0, actual: 0 }), `{ path: [], expected: a => a > 0, actual: 0 }`)
})
