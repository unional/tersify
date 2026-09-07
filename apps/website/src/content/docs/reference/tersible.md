---
title: tersible
description: Attach a .tersify() method to an existing value.
---

```ts
function tersible<T>(
	subject: T,
	tersify?: string | ((this: T, options: Partial<TersifyOptions>) => string)
): Tersible<T>
```

Defines a `tersify` property on `subject` and returns the same value, typed as
[`Tersible<T>`](/tersify/reference/tersible-type/). The property is non-enumerable and
non-writable, so it does not show up in the object's own output or in `Object.keys`.

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `subject` | `T` | The value to make tersible. Mutated in place |
| `tersify` | `string` | A fixed representation, returned as-is on every call |
| `tersify` | `(this: T, options) => string` | Called with `this` bound to `subject` |
| `tersify` | omitted | Falls back to the default formatting for the value |

## Examples

A function, with `this` bound to the subject:

```ts
import { tersible } from 'tersify'

tersible({ a: 1 }, function () { return `a = ${this.a}` }).tersify()
// "a = 1"
```

Use a `function` expression, not an arrow, when you need `this`.

A fixed string:

```ts
tersible(a => a++, 'a++').tersify()  // "a++"
```

Omitted — the value formats itself the default way, which is useful purely to get a `.tersify()`
method onto something that will be passed to code expecting one:

```ts
tersible(new Date('2020-05-14T11:45:27.234Z')).tersify()
// "2020-05-14T11:45:27.234Z"

tersible([1, 2, 3]).tersify()                    // "[1, 2, 3]"
tersible(function (a) { return a + 1 }).tersify()
// "fn(a) { return a + 1 }"
```

The options reach your function, so it can adapt to `maxLength`:

```ts
tersible(a => a + x, options => `{ maxLength: ${options.maxLength} }`)
	.tersify({ maxLength: 10 })
// "{ maxLength: 10 }"
```

## Effect on `tersify()`

Once attached, the method is used wherever the value appears, including nested:

```ts
const a = tersible({ a: 1 }, () => 'a1')
const b = tersible({ b: 2 }, () => 'b2')

tersify([a, b, { c: 3 }, undefined, null, 1, 'a'])
// "[a1, b2, { c: 3 }, undefined, null, 1, 'a']"
```

[`raw: true`](/tersify/reference/tersify-options/#raw) bypasses it:

```ts
tersify(tersible({ a: 1 }, '{a1}'), { raw: true })  // "{ a: 1 }"
```

## Attaching to a prototype

Every instance becomes tersible, and the representation is recomputed per call:

```ts
class Foo {
	a = 1
}
tersible(Foo.prototype, function () { return `a = ${this.a}` })

const f = new Foo()
f.a = 2
tersify(f)  // "a = 2"
```

:::caution
`tersible()` mutates `subject`. A function or class instance cannot be cloned faithfully, so
injecting the method is the only way to do this. Do not call it on a value you do not own — prefer
[`Tersiblized`](/tersify/reference/tersiblized/) when you control the class.
:::
