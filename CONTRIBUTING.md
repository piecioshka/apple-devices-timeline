# Contributing to apple-devices-timeline

How to run, test, extend and deploy the site. For what it shows, see the [README](README.md).

## Getting started

Prerequisites:

- Node.js 22.12 or newer (_`.nvmrc` pins `lts/krypton`_)
- `rsvg-convert` (librsvg) only if you regenerate the share images with `npm run share-images`

```bash
git clone https://github.com/piecioshka/apple-devices-timeline
cd apple-devices-timeline
npm install
npm run dev
```

Then open the URL printed in the terminal.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on the first free port from 3000 |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build |
| `npm start` | Same as `npm run preview` |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run e2e` | Build, then run smoke and accessibility tests (Playwright + axe-core) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `astro check` |
| `npm run format` | Format the repository with Prettier |
| `npm run format:check` | Verify formatting |
| `npm run share-images` | Render the Open Graph images (`public/og-*.png`) from the SVG templates in `assets/og/`, with the year range taken from the dataset |

## Tests

Unit tests (`*.test.ts` next to the code in `src/`) run with Vitest. End-to-end tests in `e2e/` run with Playwright: a smoke test and an axe-core accessibility check in both themes.

Before the first `npm run e2e`, install the browser once with `npx playwright install chromium`.

## CI

[ci.yml](.github/workflows/ci.yml) runs on every push and pull request with Node from `.nvmrc`, in two jobs:

- `build`: `format:check`, `lint`, `typecheck`, `test` and `build`
- `e2e`: Playwright tests, with the Playwright report uploaded as an artifact when they fail

## Deployment

Every push to `main` publishes the site to GitHub Pages at https://piecioshka.github.io/apple-devices-timeline/ through [pages.yml](.github/workflows/pages.yml). The workflow reads the origin and the path prefix from the repository's Pages settings, so a fork or a custom domain needs no changes to it.

The build is static, so `dist/` also works on any other static host. Two environment variables shape the URLs when set before `npm run build`:

| Variable | What it sets |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://timeline.example.com`. It feeds canonical URLs, `hreflang` links, Open Graph URLs, the sitemap and `robots.txt`; without it those fall back to relative paths and the sitemap is skipped. |
| `BASE_PATH` | Path prefix when the site lives in a subdirectory of the origin, for example `/apple-devices-timeline`. Leave it unset to serve from the root. |

The Content Security Policy ships as a `<meta>` tag, so it works on any host. Hosts that let you set response headers can add `Strict-Transport-Security` on top.

## Project structure

- `src/data/` - the datasets: `devices.ts`, `rumors.ts` and `meta.ts`
- `src/lib/` - categories, product lines, pictograms, timeline grouping, paths, JSON-LD and the theme script, each with its tests
- `src/components/` and `src/layouts/` - Astro components
- `src/pages/` - English pages at the root, Polish under `pl/`, plus `404`, `robots.txt` and the web manifest
- `src/i18n/` - interface strings in both languages
- `assets/og/` - SVG templates for the share images, rendered by `scripts/share-images.mjs`
- `e2e/` - Playwright tests

## Data

Each entry in `src/data/devices.ts` has an `id`, `name`, `category` (_one of the slugs in `src/lib/categories.ts`_), `line` (_product line from `src/lib/lines.ts`; the index at the bottom of the page groups by it_), `thumbnail` (_pictogram key from `src/lib/thumbnails.ts`_), `announcedAt` (_ISO date of the public announcement_), `url` (_the device's page on apple.com: its tech specs page on Apple Support, or the product page while a device has no tech specs page yet_), an optional `event` (_keynote tagline or conference name_) and a one-line `highlight` in English and Polish.

To add a device, append an object and run `npm test`; the dataset tests check ids, dates, categories and lines. The timeline shows every device in the dataset, so extending it is just adding entries.

Rumored devices sit in `src/data/rumors.ts` with the same `id`, `name`, `category`, `line` and `thumbnail` fields, plus `expectedAt` (_a month like `2026-10`, a half-year like `2027-H1` or a year like `2028`_), a one-line `summary` per language and a list of `sources`. When Apple announces one, move it to `devices.ts` under the same id (_or a new one when Apple's name differs from the working name_) and delete the rumor; the tests reject ids present in both files and windows that have already passed.

`src/data/meta.ts` holds `DATA_UPDATED_AT`, an ISO instant in UTC shown as "last updated" in the header (_with the time of day, converted to the visitor's time zone in the browser_) and, as a calendar day, as the "as of" date of the rumors section. Bump it with every data change; a test checks it is not older than the latest announcement.

## Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), often with a scope: `feat(data):`, `fix(header):`, `docs(readme):`, `chore:`.
