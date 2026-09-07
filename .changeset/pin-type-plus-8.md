---
'tersify': patch
---

Pin `type-plus` (a devDependency) to `8.0.0-beta.10`, exactly.

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
