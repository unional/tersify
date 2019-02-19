import t from 'assert'

import { tersible, Tersiblized, Tersible } from './index'

test('inject to function witout tersify function will get default tersify', () => {
  let x = 10
  const tersed = tersible(/* istanbul ignore next */a => a + x)
  t.strictEqual(tersed.tersify(), 'a => a + x')
  t.strictEqual(tersed.tersify({ maxLength: 7 }), 'a =>...')
})

test('inject to function', () => {
  let x = 10
  t.strictEqual(tersible(/* istanbul ignore next */a => a + x, /* istanbul ignore next */() => `a+${x}`).tersify(), 'a+10')
})

test('inject to function with options', () => {
  let x = 10
  t.strictEqual(tersible(/* istanbul ignore next */a => a + x, /* istanbul ignore next */options => `{ maxLength: ${options.maxLength} }`).tersify({ maxLength: 10 }), '{ maxLength: 10 }')
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
