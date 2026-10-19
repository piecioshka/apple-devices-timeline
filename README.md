# apple-devices-timeline 📱

<!-- prettier-ignore-start -->

[![github-ci](https://github.com/piecioshka/apple-devices-timeline/actions/workflows/ci.yml/badge.svg)](https://github.com/piecioshka/apple-devices-timeline/actions/workflows/ci.yml)
![node](https://img.shields.io/badge/node-%3E%3D22.12-5fa04e.svg)
![astro](https://img.shields.io/badge/built%20with-Astro-ff5d01.svg)
![typescript](https://img.shields.io/badge/built%20with-TypeScript-3178c6.svg)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://piecioshka.mit-license.org)

<!-- prettier-ignore-end -->

Timeline of every device Apple announced from 2008 to today. Devices are grouped by the day they were announced, so keynote days (with their taglines, like "Awe Dropping" or "Scary Fast") sit next to quiet press-release launches.

Live at https://piecioshka.github.io/apple-devices-timeline/ 🌐

## Features ✨

- 🗓️ Newest-first timeline grouped by year and by announcement day
- 🏷️ Keynote taglines name the launch days that had a keynote (_filled marker_); press-release launches get a hollow marker
- 🔍 Category pages for iPhone, iPad, Mac, Apple Watch, audio, home & TV, displays, Vision, networking and accessories (_each has its own URL_)
- ⏩ Year links to jump straight to any year
- 📚 Product lines index at the bottom of every page: each line on the page (_iPad, iPad mini, iPad Air, iPad Pro on the iPad page_) with its model count and years, expandable to the list of its models; rumored models sit in their line too, tagged, and a line with nothing announced yet shows up as a rumor
- 🔮 Rumors section above the timeline with the unannounced devices the press expects next, grouped by expected window from the furthest down to the soonest, tagged and kept out of the counts (_sources named on every card_)
- 🕒 "Last updated" date and time in the header, shown in your time zone (_UTC when JavaScript is off_), so you know how fresh the list is
- 📦 Plain TypeScript dataset in `src/data/devices.ts` with announcement dates from Apple Newsroom
- 🍎 Every card links to the device's page on apple.com (_its tech specs page on Apple Support, or the product page while a device has no tech specs page yet_)
- 🌗 Light and dark themes with a switch that remembers your choice, defaulting to the system setting
- 🇬🇧🇵🇱 English and Polish versions with a language switch (_Polish lives under `/pl`_)
- ⚡ Fully static HTML built with Astro, no JavaScript shipped to the browser beyond the theme switch and the time-zone conversion of the update time
- 🔗 Canonical and `hreflang` links, Open Graph and Twitter cards with a share image per language, JSON-LD structured data, sitemap and `robots.txt`
- 🛡️ Content Security Policy generated at build time, with hashes for every inline script and style
- ♿ WCAG 2.1 AA checked by axe-core in both themes on every CI run

## Scope 🎯

Coverage starts on 8 January 2008 with the Mac Pro and Xserve of that year and runs to Apple's latest announcement. Every device belongs to one of ten categories:

| Category | Product lines |
| --- | --- |
| iPhone | Every iPhone, including the SE, mini, Plus, Pro, Pro Max, Air, "e" and Duo models |
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
- 🔮 Rumored devices live in a separate section and dataset: hardware in the same categories, with a named source (_Bloomberg, MacRumors, analysts_) and an expected window within about two years; they are not counted as announced devices

## Contributing 🤝

Setup, scripts, tests, deployment and the dataset format: see [CONTRIBUTING.md](CONTRIBUTING.md).

## License 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2026
