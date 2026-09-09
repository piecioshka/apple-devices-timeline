import { expect, test, type Page } from '@playwright/test';
import { formatDateTime } from '../src/lib/timeline';
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

test('every device card links to its page on apple.com', async ({ page }) => {
  await page.goto(url('/'));

  const cards = page.locator('article');
  const links = page.locator('article a[href^="https://"]');
  await expect(links).toHaveCount(await cards.count());
  const hrefs = await links.evaluateAll((anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
  );
  const onApple = /^https:\/\/(www|support)\.apple\.com\//;
  expect(hrefs.every((href) => onApple.test(href))).toBe(true);
  await expect(links.first()).toHaveAccessibleName(/ on apple\.com$/);
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

  const policy = page.locator('meta[http-equiv="content-security-policy"]');
  await expect(policy).toHaveCount(1);
  const content = await policy.getAttribute('content');
  expect(content).toContain("object-src 'none'");
  expect(content).toContain("base-uri 'self'");
  expect(content).not.toContain('unsafe-inline');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('home page dates the list and previews rumored devices', async ({
  page,
}) => {
  await page.goto(url('/'));

  const updated = page.locator('header time');
  await expect(updated).toHaveAttribute(
    'datetime',
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
  );
  await expect(updated).toHaveText(
    /^\d{1,2} [A-Z][a-z]+ \d{4}, \d{2}:\d{2} [A-Z][A-Za-z+-]*\d*$/,
  );

  const rumors = page.getByRole('region', { name: 'Rumors' });
  await expect(rumors).toBeVisible();
  await expect(rumors.getByRole('heading', { level: 4 })).not.toHaveCount(0);
  // Rumor cards are not <article>, so they stay out of the structured data.
  await expect(rumors.locator('article')).toHaveCount(0);
});

test('category without rumors hides the rumors section', async ({ page }) => {
  await page.goto(url('/pl/network'));

  await expect(page.getByRole('region', { name: 'Plotki' })).toHaveCount(0);
  await expect(page.locator('article').first()).toBeVisible();
});

test('pages carry WebSite and ItemList structured data', async ({ page }) => {
  await page.goto(url('/pl/mac'));

  const blocks = page.locator('script[type="application/ld+json"]');
  await expect(blocks).toHaveCount(1);
  const [website, list] = JSON.parse((await blocks.textContent()) ?? '');

  expect(website).toMatchObject({
    '@type': 'WebSite',
    url: absolute('/pl'),
    inLanguage: 'pl',
  });
  const cards = page.locator('article');
  expect(list).toMatchObject({
    '@type': 'ItemList',
    url: absolute('/pl/mac'),
    numberOfItems: await cards.count(),
  });
  const firstId = await cards.first().getAttribute('id');
  expect(list.itemListElement[0]).toMatchObject({
    position: 1,
    name: await cards.first().getByRole('heading').textContent(),
    url: `${absolute('/pl/mac')}#${firstId}`,
  });
  await expect(page.locator(`#${firstId}`)).toHaveCount(1);
});

test('category page indexes its product lines at the bottom', async ({
  page,
}) => {
  await page.goto(url('/ipad'));

  const index = page.getByRole('region', { name: 'Product lines' });
  await expect(index).toBeVisible();
  // A single category needs no category headings.
  await expect(index.getByRole('heading', { level: 3 })).toHaveCount(0);
  const names = await index.locator('summary .name').allTextContents();
  expect([...names].sort()).toEqual([
    'iPad',
    'iPad Air',
    'iPad Pro',
    'iPad mini',
  ]);
  await expect(index.locator('details[open]')).toHaveCount(0);

  const mini = index.locator('details', { hasText: 'iPad mini' });
  await mini.locator('summary').click();
  const oldest = mini.getByRole('link').last();
  await expect(oldest).toHaveText('iPad mini');
  const href = await oldest.getAttribute('href');
  expect(href).toMatch(/^#/);
  await oldest.click();
  await expect(page.locator(`article${href}`)).toBeInViewport();
});

test('home page groups the product lines by category', async ({ page }) => {
  await page.goto(url('/pl'));

  const index = page.getByRole('region', { name: 'Linie produktów' });
  await expect(index.getByRole('heading', { level: 3 })).toHaveText([
    'iPhone',
    'iPad',
    'Mac',
    'Apple Watch',
    'Audio',
    'Dom i TV',
    'Monitory',
    'Vision',
    'Sieć',
    'Akcesoria',
  ]);
  const summaries = index.locator('summary');
  await expect(summaries.filter({ hasText: /^iPad Pro/ })).toHaveCount(1);
  await expect(summaries.filter({ hasText: /^iPad Pro/ })).toContainText(
    /\d+ modeli/,
  );

  // A line with nothing announced yet comes from the rumors and says so.
  const rumored = index.locator('details.rumored').first();
  await expect(rumored.locator('summary')).toContainText(/\d+ plot/);
  await rumored.locator('summary').click();
  const entry = rumored.locator('.model').first();
  await expect(entry).toContainText('Plotka');
  const href = await entry.getByRole('link').getAttribute('href');
  expect(href).toMatch(/^#/);
  await entry.getByRole('link').click();
  await expect(
    page.getByRole('region', { name: 'Plotki' }).locator(href ?? ''),
  ).toBeInViewport();
});

test.describe('in a visitor time zone', () => {
  test.use({ timezoneId: 'Europe/Warsaw' });

  test('header shows the update time in the visitor zone', async ({ page }) => {
    await page.goto(url('/pl'));

    const updated = page.locator('header time');
    const instant = await updated.getAttribute('datetime');
    expect(instant).not.toBeNull();
    await expect(updated).toHaveText(
      formatDateTime(instant ?? '', 'pl', 'Europe/Warsaw'),
    );
    await expect(updated).not.toHaveText(/UTC$/);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, timezoneId: 'Europe/Warsaw' });

  test('header keeps the update time in UTC', async ({ page }) => {
    await page.goto(url('/'));

    const updated = page.locator('header time');
    const instant = await updated.getAttribute('datetime');
    await expect(updated).toHaveText(formatDateTime(instant ?? '', 'en-GB'));
    await expect(updated).toHaveText(/UTC$/);
  });
});
