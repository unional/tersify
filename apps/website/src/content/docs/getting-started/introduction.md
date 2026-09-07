---
title: Introduction
description: What tersify is and why it exists.
---

`tersify` turns any JavaScript value into a **short, readable string**. It is built for the places
where you need to show a value to a human — an assertion failure, a log line, a thrown error — and
where the value itself must not take over the message.

```ts
import { tersify } from 'tersify'

tersify({ path: [1, 2], expected: a => a > 0, actual: 0 })
// "{ path: [1, 2], expected: a => a > 0, actual: 0 }"
```

## Why not the built-ins

| | `JSON.stringify` | `util.inspect` | `tersify` |
| --- | --- | --- | --- |
| Functions | dropped | shown | shown, and terse |
| Class instances | plain object | shown | `Name { … }` |
| Circular values | throws | `[Circular]` | `ref(path)` — says *where* |
| Length cap | none | line-based | exact `maxLength` |
| Runs in the browser | yes | no | yes |

The `ref(path)` difference is the one that matters most in practice. When a value appears twice,
`tersify` tells you the property path where it was first seen rather than only that a cycle exists.

## What it renders

Every value has a form. Nothing falls through to `[object Object]`.

```ts
tersify(undefined)                    // "undefined"
tersify(1234n)                        // "1234n"
tersify('abc')                        // "'abc'"
tersify(Symbol('abc'))                // "Sym(abc)"
tersify(/foo/g)                       // "/foo/g"
tersify(new Date('2020-05-14T11:45:27.234Z'))
                                      // "2020-05-14T11:45:27.234Z"
tersify(new Error('abc'))             // "Error('abc')"
tersify(Buffer.from('abcde'))         // "<Buffer 61 62 63 64 65>"
tersify([1, 2, 3])                    // "[1, 2, 3]"
tersify({ a: 1, b: 2 })               // "{ a: 1, b: 2 }"
tersify(function (a, b) {})           // "fn(a, b) {}"
tersify(x => x + 1)                   // "x => x + 1"
```

Class instances carry their constructor name, and only own enumerable properties are printed —
prototype methods and inherited getters are left out:

```ts
class Prop { value = 1 }
tersify(new Prop())                   // "Prop { value: 1 }"

class Method { foo() {} }
tersify(new Method())                 // "Method {}"
```

Getters are shown but never invoked, so a throwing getter cannot break a log line:

```ts
tersify({ get x() { return 1 } })     // "{ x: [Get] }"
tersify({ set x(v) {} })              // "{ x: [Set] }"
```

## The output stays short

`maxLength` defaults to **120** and is a hard cap: the result is never longer, and truncation eats
into the innermost content first so the enclosing brackets survive.

```ts
tersify({ abc: 'abc', def: 'def' }, { maxLength: 19 })
// "{ abc: 'abc', ... }"

tersify(['abcd', '1234', 'abcd'], { maxLength: 18 })
// "['abcd', '1234...]"
```

See [Options](/tersify/guides/options/) for the full rule.

## It is not a serializer

`tersify` optimises for a reader, not for a parser. Strings are single-quoted and **not escaped**,
so `"a'bc'd"` renders as `'a'bc'd'` — readable, but not valid JavaScript. Do not round-trip
tersified output through `eval` or a parser. If you need to persist a value, use a real serializer.

## Where next

- [Installation](/tersify/getting-started/installation/) — install, import, and the Node/browser split.
- [Options](/tersify/guides/options/) — `maxLength`, `indent`, and `raw`.
- [Custom output](/tersify/guides/custom-output/) — give your own types a representation.
- [Circular references](/tersify/guides/circular-references/) — how `ref()` paths work.
- [Reference](/tersify/reference/) — every export, one page each.
