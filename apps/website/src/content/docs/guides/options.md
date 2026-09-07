---
title: Options
description: maxLength, indent, and raw — the three knobs on tersify.
---

`tersify` takes an optional second argument. Every field is optional.

```ts
type TersifyOptions = {
	maxLength: number
	raw?: boolean | undefined
	indent?: 'tab' | number
}
```

| Option | Default | Effect |
| --- | --- | --- |
| `maxLength` | `120` | Hard cap on the length of the result |
| `raw` | `undefined` | Skip any `.tersify()` method, and skip truncation |
| `indent` | `undefined` | Format objects and arrays across multiple lines |

## `maxLength`

The result is **never longer than `maxLength`** — the cap is exact, not approximate. When a value
does not fit, `tersify` truncates it and marks the cut with ASCII dots.

```ts
tersify(['abcd', '1234', 'abcd'], { maxLength: 19 })  // "['abcd', '1234'...]"
tersify(['abcd', '1234', 'abcd'], { maxLength: 18 })  // "['abcd', '1234...]"
tersify(['abcd', '1234', 'abcd'], { maxLength: 10 })  // "['abcd...]"
```

Two rules govern where the cut lands:

**Innermost first.** Content inside brackets is trimmed before the brackets themselves, and the last
entries go before the first, so the shape of the value survives as long as possible.

```ts
tersify({ abc: 'abc', def: 'def' }, { maxLength: 19 })  // "{ abc: 'abc', ... }"
tersify({ abc: 'abc', def: 'def' }, { maxLength: 17 })  // "{ abc: 'abc'... }"
tersify({ abc: 'abc', def: 'def' }, { maxLength: 5 })   // "{ . }"
```

For functions, parameters are trimmed before the body:

```ts
const fn = function (a, b, c) { return undefined }

tersify(fn, { maxLength: 30 })  // "fn(a,...) { return undefined }"
tersify(fn, { maxLength: 28 })  // "fn(a,.) { return undefined }"
tersify(fn, { maxLength: 27 })  // "fn(a,.) { return undef... }"
tersify(fn, { maxLength: 12 })  // "fn(a,.) {..."
```

**The marker shrinks with the budget.** With five or more characters available the marker is `...`;
with four it is `..`; with one to three it is `.`; with zero the result is empty. This is what keeps
the output length exactly equal to `maxLength`.

```ts
tersify(undefined, { maxLength: 8 })  // "undef..."
tersify(undefined, { maxLength: 4 })  // "un.."
tersify(undefined, { maxLength: 3 })  // "un."
tersify(undefined, { maxLength: 1 })  // "."
tersify(undefined, { maxLength: 0 })  // ""
```

A truncated string keeps its opening quote and loses the closing one — the output is a label, not
valid source:

```ts
tersify('abcd', { maxLength: 5 })  // "'a..."
```

## `indent`

Pass `'tab'` for tab indentation, or a number for that many spaces per level. Objects and arrays are
then written across multiple lines.

```ts
tersify({ a: 1, b: 2 }, { indent: 2 })
```

```
{
  a: 1,
  b: 2
}
```

Nesting indents with depth:

```ts
tersify({ a: { b: 1 }, c: true }, { indent: 2 })
```

```
{
  a: {
    b: 1
  },
  c: true
}
```

Arrays follow the same rule:

```ts
tersify([1, [2, 3]], { indent: 2 })
```

```
[
  1,
  [
    2,
    3
  ]
]
```

With `indent: 'tab'` the same calls produce `'{\n\ta: 1,\n\tb: 2\n}'` and
`'[\n\t1,\n\t[\n\t\t2,\n\t\t3\n\t]\n]'`.

Empty containers stay on one line — `{}` and `[]` — because there is nothing to indent.

:::caution
In indent mode each child is formatted against the full `maxLength` rather than the budget left over
from its parent, so a deeply nested value can produce more total output than `maxLength` suggests.
`maxLength` bounds each line's content, not the whole multi-line block.
:::

## `raw`

`raw: true` does two things:

1. **Ignores `.tersify()`.** A value that defines its own representation is formatted by the default
   rules instead. See [Custom output](/tersify/guides/custom-output/).
2. **Disables truncation entirely**, which means `maxLength` has no effect in raw mode.

It also switches a few spellings from the terse form to the language's own:

```ts
tersify(Symbol('abc'))                   // "Sym(abc)"
tersify(Symbol('abc'), { raw: true })    // "Symbol(abc)"

tersify(function () {})                  // "fn() {}"
tersify(function () {}, { raw: true })   // "function() {}"
```

Reach for `raw` when you want the value as the language spells it, and accept that the result can be
arbitrarily long.
