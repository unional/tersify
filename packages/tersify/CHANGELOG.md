# tersify

## 4.0.7

### Patch Changes

- ee7e6ac: Pin `type-plus` (a devDependency) to `8.0.0-beta.10`, exactly.
  
  This is beta-to-beta (`8.0.0-beta.8` -> `8.0.0-beta.10`), not a range change. `type-plus`
  is used only in this package's own type tests during development — it is not a runtime
  or peer dependency, does not appear in `dependencies`, and does not leak into the
  published `.d.ts` files. Nothing changes for consumers: `patch`.
  
  The version is pinned rather than caret-ranged. `^8.0.0-beta.10` resolves to
  `>=8.0.0-beta.10 <9.0.0-0`, which admits every later 8.0.0 prerelease as well as `8.0.0`
  and `8.1.0` — and 8 is a prerelease line where breaking changes land between betas. An
  exact version makes each bump a reviewable PR instead of something a lockfile refresh
  can do silently. Move back to a caret when 8.0.0 is stable.
  
  `type-plus@8.0.0-beta.10` ships a `cjs/package.json` marker so `require('type-plus')`
  works again under its `"type": "module"` root — beta.8 lacked it. `type-plus`'s own
  runtime dependency on `tersify@^4.0.6` (this package's current published version) means
  no source change was needed here.
  
  `pnpm-workspace.yaml` also gains a first-party soak exemption: the 24h
  `minimumReleaseAge` soak exists to catch a compromised third-party release, not to delay
  our own reviewed publishes from reaching the next repo in this dependency chain.

## 4.0.6

### Patch Changes

- e33ca2a: Update `unpartial` to ^1.0.7.

## 4.0.5

### Patch Changes

- b46f029: Replace the CJS-only `is-buffer` dependency with an inlined duck-typed check.
  
  `is-buffer@2` ships only CommonJS, which broke consumers importing the ESM build in strict ESM environments. The check is three lines and has no Node dependency, so it now lives in `src/isBuffer.ts` and works in both Node and the browser. `tersify` no longer has `is-buffer` as a runtime dependency.

## 4.0.4

### Patch Changes

- 453ba40: Fix circular dependency between `tersify` and `tersifyFunction` modules.

## 4.0.3

### Patch Changes

- 2bb4e84: Raise the minimum `acorn` version to `8.18.0`.

## 4.0.2

### Patch Changes

- 0c11033: Point package metadata at `cyberuni/tersify` — `repository`, `homepage`, `bugs`, and the
  issue URL printed when an unsupported node type is encountered. `repository` is read when
  generating provenance, so this has to ship before the first trusted-publishing release.

## 4.0.1

### Patch Changes

- ab6e5a8: Fix TS2742 "inferred type cannot be named" errors in generated declaration files.

## 4.0.0

### Major Changes

- 2ec5a33: Update build targets ES2020.

  BREAKING CHANGE: The build targets now ES2020. Consumers in ES5-only environments, it's time to upgrade your runtime.

### Minor Changes

- 61b4d40: Add `options.indent`: `'tab'` for tab indentation, or a number for that many spaces per level. Objects and arrays are formatted with newlines and the chosen indentation.
- 3dc31e6: Switch build from tsc to tsdown; publish ESM as `.mjs` and CJS as `.cjs` with matching `.d.mts`/`.d.cts` types

### Patch Changes

- 454bb3d: Handle `EmptyStatement`.
- f8c1b3c: Update dependencies (acorn, unpartial).

## [3.11.0](https://github.com/unional/tersify/compare/v3.10.5...v3.11.0) (2022-12-03)

## 3.12.1

### Patch Changes

- e59c9c7: Update dependencies.

## 3.12.0

### Minor Changes

- 15eddde: Supports `SuperNode` (Parent Class).

### Patch Changes

- b60caee: Print out source when detected unknown node

## 3.11.1

### Patch Changes

- 829ed9c: support method with symbol prop

### Features

- support MetaProperty ([5506029](https://github.com/unional/tersify/commit/550602956b297f964483d00e51819081191c4b50))

## [3.10.5](https://github.com/unional/tersify/compare/v3.10.4...v3.10.5) (2022-09-14)

### Bug Fixes

- re-release ([4d2cb41](https://github.com/unional/tersify/commit/4d2cb41c319e6dab8abdba377ef21b62405fc2c6))

## [3.10.4](https://github.com/unional/tersify/compare/v3.10.3...v3.10.4) (2022-09-14)

### Bug Fixes

- handle record (Object.create(null)) ([4462e75](https://github.com/unional/tersify/commit/4462e7504b50f9eacdcde765d21de2299dbe7a4d))

## [3.10.3](https://github.com/unional/tersify/compare/v3.10.2...v3.10.3) (2022-09-02)

### Bug Fixes

- **deps:** update dependency unpartial to v1 ([b2535db](https://github.com/unional/tersify/commit/b2535db1f673a1c2a03fb754b7a57a728297fbec))

## [3.10.2](https://github.com/unional/tersify/compare/v3.10.1...v3.10.2) (2022-06-11)

### Bug Fixes

- add cjs/package.json ([366e2d7](https://github.com/unional/tersify/commit/366e2d7d91af614fadb59f1629e28209a5adbd78))

## [3.10.1](https://github.com/unional/tersify/compare/v3.10.0...v3.10.1) (2022-06-10)

### Bug Fixes

- downgrade to ES2019 ([456f1f0](https://github.com/unional/tersify/commit/456f1f0d20de0d1591772b58f55d36cc1a3f4855))

# [3.10.0](https://github.com/unional/tersify/compare/v3.9.1...v3.10.0) (2022-06-04)

### Features

- improve browser parsing ([74c3254](https://github.com/unional/tersify/commit/74c3254d85bab7e620675359d92c7e10e45e934c)), closes [#152](https://github.com/unional/tersify/issues/152)

## [3.9.1](https://github.com/unional/tersify/compare/v3.9.0...v3.9.1) (2022-06-02)

### Bug Fixes

- build working dist ([6392f35](https://github.com/unional/tersify/commit/6392f354845a4c02d29bc283657714e758e5e51a))

# [3.9.0](https://github.com/unional/tersify/compare/v3.8.4...v3.9.0) (2022-05-31)

### Features

- add swc support ([3c8ef7c](https://github.com/unional/tersify/commit/3c8ef7c27d8c094b9403be9caefa55e122e8e83c))

# [3.9.0](https://github.com/unional/tersify/compare/v3.8.4...v3.9.0) (2022-05-31)

### Features

- add swc support ([3c8ef7c](https://github.com/unional/tersify/commit/3c8ef7c27d8c094b9403be9caefa55e122e8e83c))

# [3.9.0](https://github.com/unional/tersify/compare/v3.8.4...v3.9.0) (2022-05-31)

### Features

- add swc support ([3c8ef7c](https://github.com/unional/tersify/commit/3c8ef7c27d8c094b9403be9caefa55e122e8e83c))

# [3.9.0](https://github.com/unional/tersify/compare/v3.8.4...v3.9.0) (2022-05-31)

### Features

- add swc support ([3c8ef7c](https://github.com/unional/tersify/commit/3c8ef7c27d8c094b9403be9caefa55e122e8e83c))
