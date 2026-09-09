import { expect, test, type Page } from '@playwright/test';
import { absolute, url } from './site';

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('home page renders the timeline in English', async ({ page }) => {
  const errors = collectConsoleErrors(page);
  const response = await page.goto(url('/'));

  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('Apple Devices Timeline');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Apple Devices Timeline',
  );
  await expect(
    page
      .getByRole('navigation', { name: 'Device categories' })
      .getByRole('link'),
  ).toHaveCount(11);
  await expect(
    page.getByRole('navigation', { name: 'Jump to year' }).getByRole('link'),
  ).not.toHaveCount(0);
  await expect(page.locator('article').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('Polish version lives under /pl and links back', async ({ page }) => {
  await page.goto(url('/pl'));

  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Kalendarium Sprzętu Apple',
  );
  const languages = page.getByRole('navigation', { name: 'Język' });
  await expect(languages.getByRole('link', { name: 'Polski' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(
    languages.getByRole('link', { name: 'English' }),
  ).toHaveAttribute('href', url('/'));
});

test('category page filters devices and keeps the locale', async ({ page }) => {
  await page.goto(url('/pl/mac'));

  const categories = page.getByRole('navigation', {
    name: 'Kategorie urządzeń',
  });
  await expect(categories.getByRole('link', { name: 'Mac' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  const labels = await page.locator('article .category').allTextContents();
  expect(labels.length).toBeGreaterThan(0);
  expect(new Set(labels)).toEqual(new Set(['Mac']));
});

test('theme switch applies and remembers the choice', async ({ page }) => {
  await page.goto(url('/'));
  const html = page.locator('html');
  const theme = page.getByRole('group', { name: 'Theme' });

  await expect(html).not.toHaveAttribute('data-theme', /.+/);
  await theme.getByRole('button', { name: 'Dark' }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(theme.getByRole('button', { name: 'Dark' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await theme.getByRole('button', { name: 'System' }).click();
  await expect(html).not.toHaveAttribute('data-theme', /.+/);
});

test('pages carry canonical, hreflang and Open Graph metadata', async ({
  page,
  request,
}) => {
  await page.goto(url('/pl/mac'));

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    absolute('/pl/mac'),
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute('href', absolute('/mac'));
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    'content',
    'pl_PL',
  );
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  expect(image).toBe(absolute('/og-pl.png'));
  const response = await request.get(url('/og-pl.png'));
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('serves robots.txt, the sitemap, icons and a 404 page', async ({
  page,
  request,
}) => {
  const robots = await request.get(url('/robots.txt'));
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(
    `Sitemap: ${absolute('/sitemap-index.xml')}`,
  );

  const sitemap = await request.get(url('/sitemap-0.xml'));
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`<loc>${absolute('/pl/mac')}</loc>`);

  for (const path of [
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/manifest.webmanifest',
  ]) {
    expect((await request.get(url(path))).status(), path).toBe(200);
  }

  const missing = await page.goto(url('/no-such-page'));
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Page not found',
  );
});

test('Content Security Policy allows the inline theme script', async ({
  page,
}) => {
  const errors = collectConsoleErrors(page);
  await page.goto(url('/'));
  await page.evaluate(() => localStorage.setItem('theme', 'dark'));
  await page.goto(url('/pl'));

  await expect(
    page.locator('meta[http-equiv="content-security-policy"]'),
  ).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});
