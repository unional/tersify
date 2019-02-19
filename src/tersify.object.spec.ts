import t from 'assert'

import { tersify, tersible } from './index'

test('empty object', () => {
  t.strictEqual(tersify({}), '{}')
})

test('simple object', () => {
  t.strictEqual(tersify({ a: 1 }), '{ a: 1 }')
})

test('undefined property will be skipped', () => {
  t.strictEqual(tersify({ a: 1, b: undefined }), '{ a: 1 }')
})

test('complex object', () => {
  t.strictEqual(tersify({ a: { b: 1, c: 'c' }, d: true }), `{ a: { b: 1, c: 'c' }, d: true }`)
})

test('object with function', () => {
  t.strictEqual(tersify({ a: /*istanbul ignore next*/ () => { return true } }), `{ a: () => true }`)
})

test('long object', () => {
  t.strictEqual(tersify({ a: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: { b: 1, c:... }`)
})

test('long object with function', () => {
  t.strictEqual(tersify({ a: /*istanbul ignore next*/ () => false, c: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: () => fals... }`)
})

test('object with long function trimmed at specified length', () => {
  t.strictEqual(tersify({
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

test('object with error property', () => {
  t.strictEqual(tersify({ a: new Error('err') }), `{ a: { message: 'err' } }`)
})

test.only('object.tersify() is skipped when giving raw option', () => {
  t.strictEqual(tersify(tersible({
    a: 1,
    /* istanbul ignore next */
    b() { return 'b' }
  },
    /* istanbul ignore next */
    () => 'a1'
  ), { raw: true }), `{ a: 1, b: b() { return 'b'; } }`)
})

test('object with long string', () => {
  t.strictEqual(tersify({ a: '12345678901234567890123456789012345678901234567890' }, { maxLength: 30 }), `{ a: '1234567890123456789... }`)
})

test('circular', () => {
  const obj: any = { a: 1 }
  obj.cir = obj

  t.strictEqual(tersify(obj), `{ a: 1, cir: [circular] }`)
})
