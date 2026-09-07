---
title: Circular references
description: How tersify renders a value it has already seen, and how to read a ref() path.
---

`JSON.stringify` throws on a cycle. `tersify` does not: when it meets a value it has already
rendered, it prints a **reference to where that value first appeared**.

```ts
const subject: any = { x: 1 }
subject.y = subject

tersify(subject)  // "{ x: 1, y: ref() }"
```

## Reading a `ref()` path

The arguments inside `ref(...)` are the property keys and array indices you would follow **from the
root of the tersified value** to reach the place the value was first printed. An empty `ref()` means
the root itself.

```ts
const node = { x: 1 }

tersify({ a: { b: node }, c: node })
// "{ a: { b: { x: 1 } }, c: ref(a, b) }"
```

Read `ref(a, b)` as *"the same object as `root.a.b`"* — which is where the full contents were
printed. Array indices appear as bare numbers:

```ts
const node = { a: 1 }

tersify([node, node])  // "[{ a: 1 }, ref(0)]"
```

Cycles through an array work the same way:

```ts
const subject: any[] = ['a']
subject.push(subject)

tersify(subject)  // "['a', ref()]"
```

Class instances are no different:

```ts
class Circular {
	instance?: Circular
}

const instance = new Circular()
instance.instance = instance

tersify(instance)  // "Circular { instance: ref() }"
```

## Shared values, not just cycles

The reference registry covers the whole call, so a value that simply appears twice is also rendered
as a `ref()` the second time. `[node, node]` above is not circular, yet the second entry is `ref(0)`.

This is deliberate: it keeps the output short and tells you the two entries are the *same object*,
not two equal ones — a distinction that is usually exactly what you are trying to establish when you
are reading a log line.

## A worked example

Two objects that reference each other, plus a shared container:

```ts
const a: any = {}
const b: any = { a }
b.c = { a, b }
a.c = { a, b }

tersify(a)
// "{ c: { a: ref(), b: { a: ref(), c: { a: ref(), b: ref(c, b) } } } }"
```

Every `ref()` here points back at `a` itself; `ref(c, b)` points at `b`, first printed at `a.c.b`.
The structure is fully described and the output stays on one line.
