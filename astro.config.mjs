import process from 'node:process';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Public origin of the deployed site. Canonical URLs, Open Graph tags, the
// sitemap and robots.txt are built from it; without it they fall back to
// relative paths and the sitemap is skipped.
const site = process.env.SITE_URL || undefined;

// Path prefix when the site lives in a subdirectory of its origin, such as
// "/apple-devices-timeline" on GitHub Pages. Leave unset to serve from "/".
const base = process.env.BASE_PATH || undefined;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-GB', pl: 'pl-PL' },
      },
    }),
  ],
  security: {
    // Emits a Content-Security-Policy meta tag with hashes of the bundled
    // scripts and styles; the inline theme script adds its own hash.
    csp: true,
  },
});
