# Contributing to beautiful-backgrounds

Thanks for taking the time to contribute.

## Getting started

```bash
git clone https://github.com/Niekes/beautiful-backgrounds.git
cd beautiful-backgrounds
npm install
npx playwright install chromium
```

Node 22, 24 or newer is required. The project uses [Vite+](https://viteplus.dev)
(`vp`) for building, testing, linting and formatting. The tests run in a
headless Chromium, which is what the Playwright install is for.

## The checks that have to pass

```bash
npm run lint      # vp lint, the format check and the fallow gates
npm run coverage  # typecheck + every test, which fails below 100% coverage
npm run build     # typecheck + bundle
npm run storybook # look at your change at http://localhost:6006
```

All of them run in CI on every push and pull request. `npm run fmt` formats
the code.

`npm run lint` runs two things:

- `vp lint` and `vp fmt --check`.
- [fallow](https://fallow.tools), which checks dead code, duplication,
  coverage gaps and the architecture in [.fallowrc.jsonc](.fallowrc.jsonc),
  and requires a health score of 100. `npm run hooks:install` runs it before
  each commit as well.

The coverage stays at 100% for statements, branches, functions and lines.
Cover new code with a test in `tests/` instead of excluding it, and remove
code that no test can reach.

## Repository layout

| Path               | Zone         | What lives there                                      |
| ------------------ | ------------ | ----------------------------------------------------- |
| `index.ts`         | `public-api` | The public API. The only entry point of the package.  |
| `src/components/*` | `components` | One background per module.                            |
| `src/*`, `utils/*` | `core`       | The base classes, particles and helpers.              |
| `src/stories/*`    | `stories`    | The Storybook stories, one file per background.       |
| `tests/*`          | `tests`      | The test suite.                                       |
| `scripts/*`        | `tooling`    | Repository tooling. Imports nothing from the library. |

Dependencies point inwards only: the core never imports a component, and a
component never imports another one. fallow enforces this.

## Adding a background

1. Create `src/components/<name>.ts` with a class that extends
   `BeautifulBackground` and registers itself with `@customElement("bb-<name>")`.
2. Export it from `index.ts`.
3. Add `src/stories/<Name>.stories.ts`. Every story is a smoke test as well.
4. Cover it in `tests/components.test.ts`.
5. Add it to the README, and record its GIF with `npm run gifs`.

## Releasing

A release is a pull request that bumps the version in `package.json` and
updates `CHANGELOG.md` — for example the `release/1.1.0` branch. Merging it
into `main` starts it: when `package.json` changed, the
[Release workflow](.github/workflows/release.yml) stages the new version on
npm through trusted publishing and creates the `X.Y.Z` release on GitHub,
with the version's section of `CHANGELOG.md` as its notes. A maintainer then
approves the staged version with 2FA, on npmjs.com or with
`npm stage approve <stage-id>`, and only then is it installable. The workflow
skips itself when the version is already on npm, so dependency updates that
touch `package.json` without a version bump never trigger a publish, and it
can be rerun by hand from the Actions tab, which also adds a missing GitHub
release. Do not run `npm publish` or push a version tag by hand.
