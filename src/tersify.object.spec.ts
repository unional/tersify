import { test } from 'ava'

import { tersify, tersible } from './index'

test('empty object', t => {
  t.is(tersify({}), '{}')
})

test('simple object', t => {
  t.is(tersify({ a: 1 }), '{ a: 1 }')
})

test('undefined property will be skipped', t => {
  t.is(tersify({ a: 1, b: undefined }), '{ a: 1 }')
})

test('complex object', t => {
  t.is(tersify({ a: { b: 1, c: 'c' }, d: true }), `{ a: { b: 1, c: 'c' }, d: true }`)
})

test('object with function', t => {
  t.is(tersify({ a: /*istanbul ignore next*/ () => { return true } }), `{ a: () => true }`)
})

test('long object', t => {
  t.is(tersify({ a: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: { b: 1, c:... }`)
})

test('long object with function', t => {
  t.is(tersify({ a: /*istanbul ignore next*/ () => false, c: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: () => fals... }`)
})

test('object with long function trimmed at specified length', t => {
  t.is(tersify({
    a: /*istanbul ignore next*/ function (x, y) {
      console.info(1)
      console.info(2)
      console.info(3)
      console.info(4)
      console.info(5)
      console.info(6)
      x++
      return y
    }, c: { b: 1, c: 'c' }, d: true
  }, { maxLength: 100 }), `{ a: function (x, y) { console.info(1); console.info(2); console.info(3); console.info(4); cons... }`)
})

test('object with error property', t => {
  t.is(tersify({ a: new Error('err') }), `{ a: { message: 'err' } }`)
})

test('object.tersify() is skipped when giving raw option', t => {
  t.is(tersify(tersible({ a: 1, /* istanbul ignore next */b() { return 'b' } }, /* istanbul ignore next */() => 'a1'), { raw: true }), `{ a: 1, b: b() { return 'b'; } }`)
})

test('object with long string', t => {
  t.is(tersify({ a: '12345678901234567890123456789012345678901234567890' }, { maxLength: 30 }), `{ a: '1234567890123456789... }`)
})
