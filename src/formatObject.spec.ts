import { test } from 'ava'

import { formatObject } from './index'

test('empty object', t => {
  t.is(formatObject({}), '{}')
})

test('simple object', t => {
  t.is(formatObject({ a: 1 }), '{ a: 1 }')
})

test('complex object', t => {
  t.is(formatObject({ a: { b: 1, c: 'c' }, d: true }), `{ a: { b: 1, c: 'c' }, d: true }`)
})

test('object with function', t => {
  t.is(formatObject({ a: () => { return true } }), `{ a: () => true }`)
})

test('long object', t => {
  t.is(formatObject({ a: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: { b: 1, c:... }`)
})

test('long object with function', t => {
  t.is(formatObject({ a: () => false, c: { b: 1, c: 'c' }, d: true }, { maxLength: 20 }), `{ a: () => fals... }`)
})

test('object with long function', t => {
  t.is(formatObject({
    a: function (x, y) {
      console.log(1)
      console.log(2)
      console.log(3)
      console.log(4)
      console.log(5)
      console.log(6)
      x++
      return y
    }, c: { b: 1, c: 'c' }, d: true
  }, { maxLength: 100 }), `{ a: function (x, y) {  console.log(1); console.log(2); console.log(3); console.log(4); console... }`)
})
