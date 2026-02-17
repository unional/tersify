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

| Script          | Description                         |
| --------------- | ----------------------------------- |
| `pnpm build`    | Build all packages (Turbo)          |
| `pnpm check`    | Run Biome check (lint + format)     |
| `pnpm check:fix`| Run Biome check and apply fixes     |
| `pnpm test`     | Run tests in all packages           |
| `pnpm lint`     | Lint all packages (runs Biome)      |
| `pnpm verify`   | Clean, build, lint, test, size      |
| `pnpm cs`       | Open changeset CLI                  |
