---
title: tersify
description: Format any JavaScript value as a terse string.
---

```ts
function tersify(value: unknown, options?: Partial<TersifyOptions>): string
```

Returns a short string representation of `value`. Never throws on a cycle, never returns
`[object Object]`, and never exceeds
[`maxLength`](/tersify/reference/tersify-options/#maxlength) — which defaults to `120`.

```ts
import { tersify } from 'tersify'

tersify({ path: [1, 2], expected: a => a > 0, actual: 0 })
// "{ path: [1, 2], expected: a => a > 0, actual: 0 }"
```

If `value` has a `.tersify()` method, that method is used instead of the rules below — see
[Custom output](/tersify/guides/custom-output/). Set
[`raw: true`](/tersify/reference/tersify-options/#raw) to bypass it.

## Primitives

| Input | Output |
| --- | --- |
| `undefined` | `undefined` |
| `null` | `null` |
| `true` | `true` |
| `1234` | `1234` |
| `1234n` | `1234n` |
| `'abc'` | `'abc'` |
| `Symbol()` | `Sym()` |
| `Symbol('abc')` | `Sym(abc)` |
| `Symbol.for('abc')` | `Sym(abc)` |

Strings are wrapped in single quotes and **not escaped**, so `"a'bc'd"` renders as `'a'bc'd'`. With
`raw: true`, symbols render as `Symbol(abc)`.

## Built-ins

| Input | Output |
| --- | --- |
| `new Date('2020-05-14T11:45:27.234Z')` | `2020-05-14T11:45:27.234Z` |
| `/foo/` | `/foo/` |
| `/foo/g` | `/foo/g` |
| `new Error()` | `Error()` |
| `new Error('abc')` | `Error('abc')` |
| `Buffer.from('abcde')` | `<Buffer 61 62 63 64 65>` |

Dates render bare — no quotes and no `Date(...)` wrapper. Errors use `constructor.name` and the
message only; custom own properties on an error are not printed.

```ts
class CustErr extends Error {}
tersify(new CustErr('abc happened'))  // "CustErr('abc happened')"
```

## Arrays

Arrays render **without inner padding**.

```ts
tersify([])                    // "[]"
tersify([1, 2, 3])             // "[1, 2, 3]"
tersify([{ a: 1 }])            // "[{ a: 1 }]"
tersify([/abcd/gi])            // "[/abcd/gi]"
tersify([function foo() { return 'a' }])
                               // "[fn foo() { return 'a' }]"
```

## Objects

Objects render **with** inner padding.

```ts
tersify({})                          // "{}"
tersify({ a: 1, b: 2 })              // "{ a: 1, b: 2 }"
tersify({ a: { b: 1, c: 'c' }, d: true })
                                     // "{ a: { b: 1, c: 'c' }, d: true }"
```

**Key quoting.** A key is quoted only when it contains a hyphen. Keys with spaces or leading digits
are left unquoted.

```ts
tersify({ 'a-b': 1 })  // "{ 'a-b': 1 }"
```

**Accessors are never invoked.** A getter that throws is still safe to tersify.

```ts
tersify({ get x() { return 1 } })            // "{ x: [Get] }"
tersify({ set x(v) {} })                     // "{ x: [Set] }"
tersify({ get x() { return 1 }, set x(v) {} })
                                             // "{ x: [Get/Set] }"
```

Objects created with `Object.create(null)` render like any other object.

## Class instances

The constructor name, then the object body. Only **own enumerable** properties are printed —
prototype methods and inherited getters are omitted.

```ts
class Empty {}
tersify(new Empty())          // "Empty {}"

class Prop { value = 1 }
tersify(new Prop())           // "Prop { value: 1 }"

class Method { foo() {} }
tersify(new Method())         // "Method {}"
```

## Classes

The constructor itself renders with **no space** before the brace, which distinguishes a class from
an instance of it at a glance.

```ts
tersify(class Foo {})                             // "class Foo{}"
tersify(class {})                                 // "class {}"
tersify(class Foo { constructor(x) {} })          // "class Foo{ constructor(x) {} }"
tersify(class Foo { async do() {} })              // "class Foo{ async do() {} }"
tersify(class Foo { *do() {} })                   // "class Foo{ *do() {} }"
tersify(class Foo { [Symbol.iterator]() {} })     // "class Foo{ [Sym.iterator]() {} }"
```

## Functions

The `function` keyword becomes `fn`; `async` and `*` are kept. Comments are dropped and semicolons
normalised, because the body is re-printed from a parsed syntax tree rather than copied from source.

```ts
tersify(function () {})                 // "fn() {}"
tersify(function (a, b, c) {})          // "fn(a, b, c) {}"
tersify(function (a = '1') {})          // "fn(a = '1') {}"
tersify(function (a, ...b) {})          // "fn(a, ...b) {}"
tersify(function ({ a, b, c }) {})      // "fn({ a, b, c }) {}"
tersify(function inc(x) { return x + 1 })
                                        // "fn inc(x) { return x + 1 }"
tersify(async function () { await x })  // "async fn() { await x }"
tersify(function* () {})                // "fn*() {}"
```

Arrow functions keep their own syntax, and a single parameter keeps its bare form:

```ts
tersify(() => {})                       // "() => {}"
tersify(() => true)                     // "() => true"
tersify(x => {})                        // "x => {}"
tersify((x, y) => {})                   // "(x, y) => {}"
tersify(async () => { await x })        // "async () => { await x }"
tersify(() => { return { a: 1 } })      // "() => ({ a: 1 })"
```

**Function-valued properties become method shorthand**, and lose their own name — except arrows,
which keep the `key: value` form:

```ts
tersify({ a: function () {} })          // "{ a() {} }"
tersify({ a: function foo() {} })       // "{ a() {} }"
tersify({ a: async function () {} })    // "{ async a() {} }"
tersify({ a: function* () {} })         // "{ *a() {} }"
tersify({ a: async function* () {} })   // "{ async *a() {} }"
tersify({ a: () => {} })                // "{ a: () => {} }"
tersify({ 'a-b': function () {} })      // "{ 'a-b'() {} }"
```

**Statically evaluable expressions inside a body are replaced by their tersified value**, which is
often what makes a body short enough to read:

```ts
tersify(function () { return new Date('2020-05-14T11:45:27.234Z') })
// "fn() { return 2020-05-14T11:45:27.234Z }"

tersify(function () { return void 0 })
// "fn() { return undefined }"
```

Anything that cannot be resolved at parse time is left alone, so `new Date(2020, x)` stays as
written.

:::note
Function output differs slightly in the browser build, which parses no syntax tree and formats from
the function's source string instead — most visibly, it keeps trailing semicolons in the body. See
[Installation](/tersify/getting-started/installation/#node-and-the-browser).
:::

## Circular and repeated values

A value already rendered earlier in the same call renders as `ref(path)`, where the path is the
property chain from the root at which it was first printed.

```ts
const subject: any = { x: 1 }
subject.y = subject
tersify(subject)  // "{ x: 1, y: ref() }"
```

See [Circular references](/tersify/guides/circular-references/).

## Options

See [TersifyOptions](/tersify/reference/tersify-options/) for `maxLength`, `raw`, and `indent`.
