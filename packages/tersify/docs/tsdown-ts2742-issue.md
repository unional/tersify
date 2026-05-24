# `tsdown` declaration emit causes `TS2742` in consumers

## Summary

The same `tersify` source tree produces different consumer behavior depending on how declarations are emitted:

- `tsdown`-emitted declarations fail in a downstream consumer with `TS2742`
- `tsc`-emitted declarations from the same source tree pass

The failure appears to be tied to the shape of the emitted `esm/types.d.mts` file.

## Repro commands

Run from `packages/tersify`:

```sh
pnpm smoke:consumer:tsdown
pnpm smoke:consumer:tsc
```

Expected current behavior:

- `pnpm smoke:consumer:tsdown` fails
- `pnpm smoke:consumer:tsc` passes

## Downstream consumer used in the smoke test

```ts
import { tersible } from 'tersify'

export function foo() {
  return tersible((x: any) => !!x)
}
```

Consumer `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "emitDeclarationOnly": true,
    "strict": true,
    "skipLibCheck": false
  }
}
```

## Failing error

```txt
index.ts(3,17): error TS2742: The inferred type of 'foo' cannot be named without a reference to './node_modules/tersify/esm/types.mjs'. This is likely not portable. A type annotation is necessary.
```

## Same-source builder split

The source files are the same in both cases:

- `src/index.ts`
- `src/tersible.ts`
- `src/types.ts`

Only the emitted declarations differ.

### `tsdown` output

`esm/index.d.mts`

```ts
import { Tersible, TersifyOptions } from "./types.mjs";
import { tersible } from "./tersible.mjs";
import { Tersiblized } from "./tersiblized.mjs";
import { tersify } from "./tersify.mjs";
export { Tersible, Tersiblized, TersifyOptions, tersible, tersify };
```

`esm/tersible.d.mts`

```ts
import { Tersible, TersifyOptions } from "./types.mjs";
declare function tersible<T>(subject: T, tersify?: string | ((this: T, options: Partial<TersifyOptions>) => string)): Tersible<T>;
export { tersible };
```

`esm/types.d.mts`

```ts
type TersifyOptions = {
  maxLength: number;
  raw?: boolean | undefined;
  indent?: 'tab' | number;
};
type Tersible<T = unknown> = T & {
  tersify(this: T, options?: Partial<TersifyOptions>): string;
};
export { Tersible, TersifyOptions };
```

### `tsc` output

`esm-tsc/index.d.ts`

```ts
export * from './tersible.js';
export * from './tersiblized.js';
export { tersify } from './tersify.js';
export * from './types.js';
```

`esm-tsc/tersible.d.ts`

```ts
import type { Tersible, TersifyOptions } from './types.js';
export declare function tersible<T>(subject: T, tersify?: string | ((this: T, options: Partial<TersifyOptions>) => string)): Tersible<T>;
```

`esm-tsc/types.d.ts`

```ts
export type TersifyOptions = {
  maxLength: number;
  raw?: boolean | undefined;
  indent?: 'tab' | number;
}

export type Tersible<T = unknown> = T & {
  tersify(this: T, options?: Partial<TersifyOptions>): string
}
```

## Narrowed cause

Targeted mutation tests against the `tsdown` output show:

- changing `index.d.mts` alone to the `tsc` shape does **not** fix the consumer error
- changing `tersible.d.mts` alone to the `tsc` shape does **not** fix the consumer error
- changing only `types.d.mts` to use exported type declarations **does** fix the consumer error

Specifically:

This form fails:

```ts
type TersifyOptions = ...
type Tersible<T = unknown> = ...
export { Tersible, TersifyOptions }
```

This form also fails:

```ts
type TersifyOptions = ...
type Tersible<T = unknown> = ...
export type { Tersible, TersifyOptions }
```

This form passes:

```ts
export type TersifyOptions = ...
export type Tersible<T = unknown> = ...
```

## Working hypothesis

`tsdown` emits `types.d.mts` such that the public type symbols are local aliases re-exported later, and TypeScript 5.0 does not treat that as a portable public origin when a consumer infers an exported return type through `tersible()`.

## What I would report upstream

When `tsdown` emits a declaration file like:

```ts
type Foo = ...
export { Foo }
```

for public types used by another emitted declaration, downstream TypeScript declaration emit can fail with `TS2742`, while the equivalent:

```ts
export type Foo = ...
```

does not.
