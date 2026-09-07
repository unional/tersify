---
title: Custom output
description: Give your own types a representation with tersible, Tersiblized, or a plain tersify method.
---

Any value that has a `tersify()` method controls its own output. `tersify()` calls that method
instead of applying the default rules.

```ts
class Tersify {
	tersify() {
		return 'Tsfy {}'
	}
}

tersify(new Tersify())  // "Tsfy {}"
```

That is the whole contract. The three helpers below are conveniences for attaching such a method to
values you cannot or would rather not write a class for.

## The `Tersible` shape

```ts
type Tersible<T = unknown> = T & {
	tersify(this: T, options?: Partial<TersifyOptions>): string
}
```

The method receives the same options the caller passed, so a custom representation can honour
`maxLength` if it wants to.

## `tersible` — attach to a value

`tersible(subject, tersify?)` defines a non-enumerable, non-writable `tersify` property on the
subject and returns it, typed as `Tersible<T>`.

The second argument can be a function, a fixed string, or omitted:

```ts
import { tersible, tersify } from 'tersify'

// A function. `this` is the subject.
tersible({ a: 1 }, function () { return `a = ${this.a}` }).tersify()
// "a = 1"

// A fixed string.
tersible(a => a++, 'a++').tersify()
// "a++"

// Omitted — falls back to the default formatting.
tersible([1, 2, 3]).tersify()
// "[1, 2, 3]"
```

Once attached, `tersify()` picks the method up wherever the value appears, including nested inside
other values:

```ts
const a = tersible({ a: 1 }, () => 'a1')
const b = tersible({ b: 2 }, () => 'b2')

tersify([a, b, { c: 3 }, undefined, null, 1, 'a'])
// "[a1, b2, { c: 3 }, undefined, null, 1, 'a']"
```

The custom function is called on every `tersify()`, so the output tracks the value as it changes
rather than being captured once.

:::caution
`tersible()` **mutates its argument** — it defines the property directly on the object or function
you pass in. There is no way to clone a function or class instance faithfully, so this is by design.
Do not call it on a value you do not own.
:::

Attaching to a prototype makes every instance tersible:

```ts
class Foo {
	a = 1
}
tersible(Foo.prototype, function () { return `a = ${this.a}` })

const f = new Foo()
f.a = 2
tersify(f)  // "a = 2"
```

## `Tersiblized` — a mixin for classes

`Tersiblized(Base, tersify)` returns a subclass of `Base` with a `tersify()` method. Unlike
`tersible`, it does not touch `Base`.

```ts
import { Tersiblized } from 'tersify'

class Foo {
	a = 1
}

class Boo extends Tersiblized(Foo, function () {
	return `a = ${this.a}`
}) {}

const b = new Boo()
b.a = 2
b.tersify()  // "a = 2"
```

Use this when you control the class and want the representation to be part of its definition. Use
`tersible` when you are handed a value at runtime.

## Honouring `maxLength`

The options object reaches your function, so a custom representation can adapt:

```ts
tersible(a => a + x, options => `{ maxLength: ${options.maxLength} }`)
	.tersify({ maxLength: 10 })
// "{ maxLength: 10 }"
```

Nothing enforces the cap on a custom representation — the value you return is used as-is. If staying
within `maxLength` matters for your type, honour it yourself.

## Bypassing a custom representation

`raw: true` skips `.tersify()` and formats the value by the default rules:

```ts
tersify(tersible({ a: 1 }, '{a1}'))                   // "{a1}"
tersify(tersible({ a: 1 }, '{a1}'), { raw: true })    // "{ a: 1 }"

tersify(tersible((x, y) => x + y, () => 'x + y'), { raw: true })
// "(x, y) => x + y"
```

This is useful when you are debugging the value itself rather than reading the message it was
formatted for. Note that `raw` also disables truncation — see [Options](/tersify/guides/options/).
