---
title: Installation
description: Install tersify and import it in Node or the browser.
---

## Install

```bash
npm install tersify
```

```bash
pnpm add tersify
```

```bash
yarn add tersify
```

`tersify` ships as both ESM and CommonJS, with type declarations for each, so either module system
works without a shim.

## Import

```ts
import { tersify } from 'tersify'
```

```js
const { tersify } = require('tersify')
```

## Node and the browser

The package publishes a `browser` field that swaps two modules at bundle time:

| Module | Node build | Browser build |
| --- | --- | --- |
| `constants` | `constants.ts` | `constants.browser.ts` |
| `tersifyFunction` | `tersifyFunction.ts` | `tersifyFunction.browser.ts` |

The Node build parses function source with [acorn](https://github.com/acornjs/acorn) to produce the
most compact representation it can. The browser build drops acorn entirely and falls back to
string-based formatting, which keeps the bundle small. Any bundler that honours the `browser` field —
Vite, webpack, esbuild, Rollup with `@rollup/plugin-node-resolve` — picks the right one for you.

Function output can therefore differ slightly between the two builds. Everything else — objects,
arrays, primitives, class instances, options — behaves identically.

## What next

- [Introduction](/tersify/getting-started/introduction/) — what tersify is for.
- [Options](/tersify/guides/options/) — `maxLength`, `indent`, and `raw`.
- [Reference](/tersify/reference/) — the full exported surface.
