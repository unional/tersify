# AGENTS.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Commands

```sh
pnpm install          # install dependencies
pnpm build            # build all packages via Turbo
pnpm test             # run all tests via Turbo
pnpm check            # lint/format with Biome
pnpm check:fix        # lint/format and apply fixes
pnpm verify           # full verify: clean, build, lint, coverage, size-limit
pnpm cs               # open changeset CLI (for releases)
```

Run only the docs site (`apps/website`):

```sh
pnpm web dev          # Astro dev server (port 4321)
pnpm web build        # static build to apps/website/dist
pnpm web typecheck    # astro check
```

Run only the `tersify` package:

```sh
pnpm tersify test              # run tests (node + jsdom + storybook projects)
pnpm tersify test:node         # node environment only
pnpm tersify test:jsdom        # jsdom environment only
pnpm tersify coverage          # coverage report
pnpm tersify build             # build with tsdown
pnpm tersify sb                # start Storybook dev server (port 6006)
```

Run a single test file:

```sh
cd packages/tersify && pnpm exec vitest run src/tersify.spec.ts
```

## Architecture

`packages/tersify` is the only published package; `apps/website` is the docs site. The package creates terse string representations of any JavaScript value — useful for logging/debugging.

### Core flow

`tersify(value, options?)` → dispatches to per-type handler via `tersifyFactory` map in `tersify.ts`. Handlers: literals, string, symbol, bigint, Date, RegExp, Buffer, Error, Array, plain object (`object`), class instance (`instance`), function.

**Function tersification** (`tersifyFunction.ts`) uses [acorn](https://github.com/acornjs/acorn) to parse the function source, then `tersifyAcorn/tersifyAcorn.ts` walks the AST to produce a terse representation. Falls back to regex-based `tersifyFunctionByString.ts` on parse errors.

**Circular reference detection**: `context.references` array tracks visited objects/arrays by reference, returns `ref(path)` on revisit.

**`Tersible<T>` interface**: objects/functions can opt in by defining a `.tersify(options?)` method. `tersifyFunction.ts` and object handlers check `hasTersifyFn` and call `.tersify()` unless `raw: true` is set. `tersiblized.ts` and `tersible.ts` provide helpers to attach `.tersify()`.

**Browser vs Node**: `constants.browser.ts` and `tersifyFunction.browser.ts` are alternate entry points for browser environments (mapped via `package.json` `browser` field). tsdown builds both ESM and CJS, unbundled (`unbundle: true`), with `.d.mts`/`.d.cts` declarations.

### Test setup

Vitest runs three projects (configured in `vitest.config.ts`):
- `node` — Node environment
- `jsdom` — browser-like DOM environment  
- `storybook` — browser tests via Playwright/Chromium against Storybook stories

Coverage uses v8. Size is checked with `size-limit` (`.size-limit.mjs`). It measures both the browser path (which resolves the `browser` field and drops acorn) and the node path (which keeps it). Run `pnpm tersify size:why` for treemaps of what lands in each bundle; output goes to the gitignored `.size-why/`.

### Docs site

`apps/website` is Astro + Starlight, deployed to GitHub Pages at <https://cyberuni.github.io/tersify/> by `.github/workflows/deploy-pages.yml` on every push to `main`. It is `private: true` and needs no changeset.

Because the site is served under a path, `base: '/tersify/'` is set in `astro.config.mjs` and **every internal link in content must be written with that prefix** (`/tersify/guides/options/`) — Starlight does not rewrite plain `/guides/options/`.

Content lives in `src/content/docs/`; the sidebar is declared explicitly in `astro.config.mjs`, so a new page needs an entry there too.

The logo follows the cyber-* icon system (see `docs/design/icon-system.md` in `cyberuni/cyber-mux`): a shared reticle frame plus a per-package glyph. `public/img/logo.svg` self-themes for the favicon; `src/assets/logo-{light,dark}.svg` are the header pair, because Starlight switches on `data-theme` and `prefers-color-scheme` cannot see that.

Documented behavior must come from the specs in `packages/tersify/src/*.spec.ts`, not from `src/overview.mdx` — that Storybook page has examples that do not match the specs.

### Tooling

- **Turbo** orchestrates build/test/verify across packages; build outputs cached in `.turbo/`
- **Biome** for lint and formatting (extends `@repobuddy/biome/recommended`)
- **tsdown** for building (unbundled ESM + CJS)
- **Changesets** for versioning and changelog (`pnpm cs` / `pnpm version` / `pnpm release`)
- **Husky + commitlint** enforce conventional commits on `commit-msg` hook
