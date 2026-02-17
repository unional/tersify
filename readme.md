# tersify

Monorepo for tersify.

## Packages

- [tersify](packages/tersify) – Creates a terse representation of code

## Development

```sh
pnpm install
pnpm build
pnpm test
pnpm verify
```

## Scripts

| Script        | Description                    |
| ------------- | ------------------------------ |
| `pnpm build`  | Build all packages (Turbo)     |
| `pnpm test`   | Run tests in all packages      |
| `pnpm lint`   | Lint all packages              |
| `pnpm verify` | Clean, build, lint, test, size |
| `pnpm cs`     | Open changeset CLI             |
