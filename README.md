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
- 🔗 Canonical and `hreflang` links, Open Graph and Twitter cards with a share image per language, JSON-LD structured data, sitemap and `robots.txt`
- 🛡️ Content Security Policy generated at build time, with hashes for every inline script and style
- ♿ WCAG 2.1 AA checked by axe-core in both themes on every CI run

## Scope 🎯

Coverage starts on 8 January 2008 with the Mac Pro and Xserve of that year and runs to Apple's latest announcement. Every device belongs to one of ten categories:

| Category | Product lines |
| --- | --- |
| iPhone | Every iPhone, including the SE, mini, Plus, Pro, Pro Max, Air and "e" models |
| iPad | iPad, iPad mini, iPad Air, iPad Pro |
| Mac | MacBook, MacBook Neo, MacBook Air, MacBook Pro, iMac, iMac Pro, Mac mini, Mac Studio, Mac Pro, Xserve |
| Apple Watch | Apple Watch, Series, SE, Ultra |
| Audio | AirPods, AirPods Pro, AirPods Max, iPod classic, iPod nano, iPod shuffle, iPod touch |
| Home & TV | Apple TV, HomePod, HomePod mini |
| Displays | LED Cinema Display, Thunderbolt Display, Pro Display XDR, Studio Display, Studio Display XDR |
| Vision | Apple Vision Pro |
| Networking | AirPort Express, AirPort Extreme, Time Capsule |
| Accessories | Apple Pencil, AirTag |

- ✅ Every model Apple announced with a press release or on a keynote stage, plus new generations that launched quietly (_for example the 2012 AirPort Express_)
- 📅 Dates are the day of the public announcement, not the day the device shipped
- 📐 One entry per model line per announcement day; sizes get separate entries only when Apple sold them as distinct products (_14-inch and 16-inch MacBook Pro, 11-inch and 13-inch iPad Pro_), otherwise the name lists every size the announcement covered
- ❌ Silent spec bumps and carrier, storage, color or connector variants (_such as the USB-C AirPods Max_)
- ❌ Beats, and input peripherals like keyboards, mice, trackpads, remotes, chargers and cases
- ❌ Software, services and chips announced without a device

<details>
<summary><strong>Requirements 📋</strong></summary>

- Node.js 22.12 or newer (_see `.nvmrc`_)
- `rsvg-convert` (librsvg) only if you regenerate the share images with `npm run og`

</details>

<details>
<summary><strong>Usage 🚀</strong></summary>

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

</details>

<details>
<summary><strong>Scripts 🧰</strong></summary>

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

</details>

<details>
<summary><strong>Deployment 🚢</strong></summary>

Every push to `main` publishes the site to GitHub Pages at https://piecioshka.github.io/apple-devices-timeline/ through [pages.yml](.github/workflows/pages.yml). The workflow reads the origin and the path prefix from the repository's Pages settings, so a fork or a custom domain needs no changes to it.

The build is static, so `dist/` also works on any other static host. Two environment variables shape the URLs when set before `npm run build`:

| Variable | What it sets |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://timeline.example.com`. It feeds canonical URLs, `hreflang` links, Open Graph URLs, the sitemap and `robots.txt`; without it those fall back to relative paths and the sitemap is skipped. |
| `BASE_PATH` | Path prefix when the site lives in a subdirectory of the origin, for example `/apple-devices-timeline`. Leave it unset to serve from the root. |

The Content Security Policy ships as a `<meta>` tag, so it works on any host. Hosts that let you set response headers can add `Strict-Transport-Security` on top.

</details>

<details>
<summary><strong>Data 📊</strong></summary>

Each entry in `src/data/devices.ts` has an `id`, `name`, `category` (_one of the slugs in `src/lib/categories.ts`_), `thumbnail` (_pictogram key from `src/lib/thumbnails.ts`_), `announcedAt` (_ISO date of the public announcement_), an optional `event` (_keynote tagline or conference name_) and a one-line `highlight` in English and Polish.

To add a device, append an object and run `npm test`; the dataset tests check ids, dates and categories. The timeline shows every device in the dataset, so extending it is just adding entries.

</details>

## License 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2026
