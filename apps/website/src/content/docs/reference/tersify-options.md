---
title: TersifyOptions
description: The options object accepted by tersify and by every custom tersify method.
---

```ts
type TersifyOptions = {
	maxLength: number
	raw?: boolean | undefined
	indent?: 'tab' | number
}
```

Every entry point takes `Partial<TersifyOptions>`, so all three fields are optional at the call site.

## `maxLength`

**Type:** `number` · **Default:** `120`

A hard cap on the length of the result. The returned string is never longer, and when the value does
not fit it is truncated with ASCII dots whose count shrinks with the remaining budget (`...`, `..`,
`.`, or nothing) so the output length matches `maxLength` exactly.

Truncation works innermost-first: nested content is cut before its enclosing brackets, and later
entries before earlier ones. For functions, parameters are cut before the body.

Ignored when `raw` is `true`.

See [Options](/tersify/guides/options/#maxlength) for the full rule and worked examples.

## `raw`

**Type:** `boolean | undefined` · **Default:** `undefined`

When `true`:

- any `.tersify()` method on the value is skipped and the default formatting is used
- truncation is disabled entirely, so `maxLength` has no effect
- symbols render as `Symbol(abc)` rather than `Sym(abc)`, and functions as `function() {}` rather
  than `fn() {}`

```ts
tersify(tersible({ a: 1 }, '{a1}'))                  // "{a1}"
tersify(tersible({ a: 1 }, '{a1}'), { raw: true })   // "{ a: 1 }"
```

## `indent`

**Type:** `'tab' | number` · **Default:** `undefined`

When set, objects and arrays are written across multiple lines. `'tab'` indents with one tab per
level; a number indents with that many spaces per level.

```ts
tersify({ a: 1, b: 2 }, { indent: 2 })
// '{\n  a: 1,\n  b: 2\n}'

tersify({ a: 1, b: 2 }, { indent: 'tab' })
// '{\n\ta: 1,\n\tb: 2\n}'
```

Empty containers stay inline (`{}`, `[]`). In indent mode each child is formatted against the full
`maxLength` rather than the parent's remaining budget, so the total output can exceed `maxLength`.

See [Options](/tersify/guides/options/#indent).
