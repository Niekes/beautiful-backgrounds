# Contributing to beautiful-backgrounds

Thanks for taking the time to contribute.

## Getting started

```bash
git clone https://github.com/Niekes/beautiful-backgrounds.git
cd beautiful-backgrounds
npm install
npx playwright install chromium
```

Node 22, 24 or newer is required. The tests run the Storybook stories in a
headless Chromium, which is what the Playwright install is for.

## The checks that have to pass

```bash
npm test          # typecheck + the Storybook tests
npm run build     # typecheck + bundle
npm run storybook # look at your change at http://localhost:6006
```

Both `npm test` and `npm run build` run in CI on every push and pull request.

## Adding a background

1. Create `src/components/<name>.ts` with a class that extends
   `BeautifulBackground` and registers itself with `@customElement("bb-<name>")`.
2. Export it from `index.ts`.
3. Add `src/stories/<Name>.stories.ts`. Every story is a test as well.
4. Add a section to the README.

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
