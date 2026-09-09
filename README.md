# apple-devices-timeline 📱

<!-- prettier-ignore-start -->

[![github-ci](https://github.com/piecioshka/apple-devices-timeline/actions/workflows/ci.yml/badge.svg)](https://github.com/piecioshka/apple-devices-timeline/actions/workflows/ci.yml)
![node](https://img.shields.io/badge/node-%3E%3D22.12-5fa04e.svg)
![astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg)
![typescript](https://img.shields.io/badge/built%20with-TypeScript-3178c6.svg)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://piecioshka.mit-license.org)

<!-- prettier-ignore-end -->

Timeline of every device Apple announced since 2008, newest first. Devices are grouped by the day they were announced, so keynote days (with their taglines, like "Awe Dropping" or "Scary Fast") sit next to quiet press-release launches.

Live at https://piecioshka.github.io/apple-devices-timeline/ 🌐

## Features ✨

- 🗓️ Newest-first timeline grouped by year and by announcement day
- 🏷️ Keynote taglines name the launch days that had a keynote (_filled marker_); press-release launches get a hollow marker
- 🔍 Category pages for iPhone, iPad, Mac, Apple Watch, audio, home & TV, displays, Vision, networking and accessories (_each has its own URL_)
- ⏩ Year links to jump straight to any year
- 📦 Plain TypeScript dataset in `src/data/devices.ts` with announcement dates from Apple Newsroom
- 🌗 Light and dark themes with a switch that remembers your choice, defaulting to the system setting
- 🇬🇧🇵🇱 English and Polish versions with a language switch (_Polish lives under `/pl`_)
- ⚡ Fully static HTML built with Astro, no JavaScript shipped to the browser beyond the theme switch
- 🔗 Canonical and `hreflang` links, Open Graph and Twitter cards with a share image per language, sitemap and `robots.txt`
- 🛡️ Content Security Policy generated at build time, with hashes for every inline script and style
- ♿ WCAG 2.1 AA checked by axe-core in both themes on every CI run

## Requirements 📋

- Node.js 22.12 or newer (_see `.nvmrc`_)
- `rsvg-convert` (librsvg) only if you regenerate the share images with `npm run og`

## Usage 🚀

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

## Scripts 🧰

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on the first free port from 3000 |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run e2e` | Build, then run smoke and accessibility tests (Playwright + axe-core) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `astro check` |
| `npm run format` | Format the repository with Prettier |
| `npm run format:check` | Verify formatting |
| `npm run og` | Render the Open Graph images in `public/` from `assets/og/*.svg` |

Before the first `npm run e2e`, install the browser once with `npx playwright install chromium`.

## Deployment 🚢

Every push to `main` publishes the site to GitHub Pages at https://piecioshka.github.io/apple-devices-timeline/ through [pages.yml](.github/workflows/pages.yml). The workflow reads the origin and the path prefix from the repository's Pages settings, so a fork or a custom domain needs no changes to it.

The build is static, so `dist/` also works on any other static host. Two environment variables shape the URLs when set before `npm run build`:

| Variable | What it sets |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://timeline.example.com`. It feeds canonical URLs, `hreflang` links, Open Graph URLs, the sitemap and `robots.txt`; without it those fall back to relative paths and the sitemap is skipped. |
| `BASE_PATH` | Path prefix when the site lives in a subdirectory of the origin, for example `/apple-devices-timeline`. Leave it unset to serve from the root. |

The Content Security Policy ships as a `<meta>` tag, so it works on any host. Hosts that let you set response headers can add `Strict-Transport-Security` on top.

## Data 📊

Each entry in `src/data/devices.ts` has an `id`, `name`, `category`, `thumbnail` (pictogram key from `src/lib/thumbnails.ts`), `announcedAt` (ISO date of the public announcement), an optional `event` (keynote tagline or conference name) and a one-line `highlight` in English and Polish. To add a device, append an object and run `npm test`; the dataset tests check ids, dates and categories.

The timeline shows every device in the dataset, so extending it is just adding entries. Coverage starts on 8 January 2008 with the Mac Pro and Xserve of that year.

### Scope 🎯

- ✅ Every model Apple announced with a press release or on a keynote stage, plus new generations that launched quietly (_for example the 2012 AirPort Express_)
- ✅ Macs (_including Xserve_), iPhone, iPad, Apple Watch, Apple Vision Pro, iPod, AirPods, HomePod, Apple TV, displays and AirPort base stations
- ✅ Apple Pencil and AirTag as the only accessories
- ❌ Silent spec bumps, carrier, storage, color and connector variants (_such as the USB-C AirPods Max_), Beats, and input peripherals like keyboards, mice, trackpads, remotes, chargers and cases
- 📐 One entry per model line per announcement day; sizes get separate entries only when Apple sold them as distinct products, otherwise the name lists every size the announcement covered

## License 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2026
