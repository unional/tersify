import t from 'assert'

import { tersible, Tersiblized, Tersible } from './index'

test('without tersify function will get default tersify', () => {
  const date = new Date('2020-05-14T11:45:27.234Z')
  t.strictEqual(tersible(date).tersify(), `2020-05-14T11:45:27.234Z`)
  t.strictEqual(tersible(Buffer.from('abc')).tersify(), '<Buffer 61 62 63>')
  t.strictEqual(tersible(/abc/).tersify(), '/abc/')
  t.strictEqual(tersible(function (a) { return a + 1 }).tersify(), 'fn(a) { return a + 1 }')
  t.strictEqual(tersible(a => a + 1).tersify(), 'a => a + 1')
  t.strictEqual(tersible({ a: 1 }).tersify(), '{ a: 1 }')
  t.strictEqual(tersible([1, 2, 3]).tersify(), '[1, 2, 3]')
})

test('inject to function', () => {
  let x = 10
  t.strictEqual(tersible(a => a + x, () => `a+${x}`).tersify(), 'a+10')
})

test('inject to function with options', () => {
  let x = 10
  t.strictEqual(tersible(a => a + x, options => `{ maxLength: ${options.maxLength} }`).tersify({ maxLength: 10 }), '{ maxLength: 10 }')
})

test('inject to object', () => {
  t.strictEqual(tersible({ a: 1 }, function () { return `a = ${this.a}` }).tersify(), 'a = 1')
})

test('inject to class', () => {
  class Foo {
    a = 1
  }
  tersible(Foo.prototype, function () {
    return `a = ${this.a}`
  })

  let f = new Foo() as Tersible<Foo>
  t.strictEqual(f.tersify(), 'a = 1')

  f.a = 2
  t.strictEqual(f.tersify(), 'a = 2')
})

test('mixin to class', () => {
  class Foo {
    a = 1
  }
  class Boo extends Tersiblized(Foo, function () { return `a = ${this.a}` }) { }
  const b = new Boo()
  b.a = 2
  t.strictEqual(b.tersify(), 'a = 2')
})

test('allow string as tersify()', () => {
  const x = tersible((a) => a++, 'a++')
  t.strictEqual(x.tersify(), 'a++')
})

test(`'this' holds the subject`, () => {
  expect(tersible({ a: 1 }, function () { return `{ a: ${this.a} }` }).tersify()).toBe(`{ a: 1 }`)
})
