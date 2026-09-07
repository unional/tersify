---
title: Tersiblized
description: A class mixin that adds a .tersify() method to a base class.
---

```ts
function Tersiblized<C extends new (...args: any[]) => object>(
	Base: C,
	tersify: (this: InstanceType<C>, options?: Partial<TersifyOptions>) => string
): C & (new (...args: any[]) => { tersify(options?: Partial<TersifyOptions>): string })
```

Returns a **subclass** of `Base` with a `tersify()` method. `Base` itself is untouched — this is the
non-mutating counterpart to [`tersible`](/tersify/reference/tersible/).

## Parameters

| Parameter | Type | Meaning |
| --- | --- | --- |
| `Base` | a constructor | The class to extend |
| `tersify` | `(this: InstanceType<C>, options?) => string` | The representation, called with `this` bound to the instance |

## Example

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

The method is evaluated on every call, so it reflects the instance's current state.

Because the result is an ordinary class, it composes the way any base class does — extend it
directly, or `extends Tersiblized(Base, fn)` inline as above.

## Choosing between the helpers

| | Mutates | Use when |
| --- | --- | --- |
| [`tersible`](/tersify/reference/tersible/) | yes | You are handed a value at runtime |
| `Tersiblized` | no | You control the class definition |
| A plain `tersify()` method | no | You control the class and want no dependency in the signature |

All three produce the same [`Tersible`](/tersify/reference/tersible-type/) shape, and
[`tersify()`](/tersify/reference/tersify/) treats them identically.

:::note
`this` inside the `tersify` argument is typed as `InstanceType<C>` — the base instance, not the
returned subclass. Properties added by the subclass are not visible to TypeScript there.
:::
