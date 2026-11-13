// Captures the README screenshots of the timeline (scrolled to the newest
// year) in both themes into `docs/screenshots/`. Start a server first
// (`npm run build && npm run preview`) and pass its URL:
// `BASE_URL=http://localhost:3000 node scripts/screenshots.mjs`.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4321';
const OUTPUT_DIR = 'docs/screenshots';

mkdirSync(OUTPUT_DIR, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Skip the header and the rumors so the shot shows announced launch days.
  await page.evaluate(() =>
    document.getElementById('year-2026')?.scrollIntoView({ block: 'start' }),
  );
  const output = `${OUTPUT_DIR}/timeline-${theme}.png`;
  await page.screenshot({ path: output });
  console.log(output);
  await context.close();
}
await browser.close();
