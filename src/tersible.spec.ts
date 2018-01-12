import { test } from 'ava'

import { tersible, Tersiblized, Tersible } from './index'

test('inject to function witout tersify function will get default tersify', t => {
  let x = 10
  const tersed = tersible(/* istanbul ignore next */a => a + x)
  t.is(tersed.tersify(), 'a => a + x')
  t.is(tersed.tersify({ maxLength: 7 }), 'a =>...')
})

test('inject to function', t => {
  let x = 10
  t.is(tersible(/* istanbul ignore next */a => a + x, /* istanbul ignore next */() => `a+${x}`).tersify(), 'a+10')
})

test('inject to function with options', t => {
  let x = 10
  t.is(tersible(/* istanbul ignore next */a => a + x, /* istanbul ignore next */options => `{ maxLength: ${options.maxLength} }`).tersify({ maxLength: 10 }), '{ maxLength: 10 }')
})

test('inject to object', t => {
  t.is(tersible({ a: 1 }, function () { return `a = ${this.a}` }).tersify(), 'a = 1')
})

test('inject to class', t => {
  class Foo {
    a = 1
  }
  tersible(Foo.prototype, function () {
    return `a = ${this.a}`
  })

  let f = new Foo() as Tersible<Foo>
  t.is(f.tersify(), 'a = 1')

  f.a = 2
  t.is(f.tersify(), 'a = 2')
})

test('mixin to class', t => {
  class Foo {
    a = 1
  }
  class Boo extends Tersiblized(Foo, function () { return `a = ${this.a}` }) { }
  const b = new Boo()
  b.a = 2
  t.is(b.tersify(), 'a = 2')
})

test('allow string as tersify()', t => {
  const x = tersible((a) => a++, 'a++')
  t.is(x.tersify(), 'a++')
})
