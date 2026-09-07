---
title: Tersible
description: The type of a value that formats itself.
---

```ts
type Tersible<T = unknown> = T & {
	tersify(this: T, options?: Partial<TersifyOptions>): string
}
```

`Tersible<T>` is `T` plus a `tersify()` method. Any value of this shape controls its own output:
[`tersify()`](/tersify/reference/tersify/) calls the method instead of applying the default rules,
unless [`raw: true`](/tersify/reference/tersify-options/#raw) is set.

The method receives the options the caller passed, so an implementation can honour `maxLength`.
Nothing enforces the cap on the value you return.

## Producing one

- [`tersible(subject, tersify?)`](/tersify/reference/tersible/) returns `Tersible<T>` by defining the
  method on an existing value.
- [`Tersiblized(Base, tersify)`](/tersify/reference/tersiblized/) returns a subclass whose instances
  have the method.
- Declaring `tersify()` on your own class satisfies the shape with no helper at all.

```ts
class Point {
	constructor(
		public x: number,
		public y: number
	) {}
	tersify() {
		return `Point(${this.x}, ${this.y})`
	}
}
```

## Using it in a signature

```ts
import type { Tersible } from 'tersify'

function log(value: Tersible) {
	console.info(value.tersify({ maxLength: 80 }))
}
```

`Tersible` defaults its parameter to `unknown`, so the bare form accepts any self-formatting value.

See [Custom output](/tersify/guides/custom-output/) for the guide.
