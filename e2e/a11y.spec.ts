import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { url } from './site';

const PAGES = ['/', '/pl', '/watch', '/no-such-page'];
const SCHEMES = ['light', 'dark'] as const;

for (const scheme of SCHEMES) {
  test.describe(`${scheme} theme`, () => {
    test.use({ colorScheme: scheme });

    for (const path of PAGES) {
      test(`${path} has no WCAG 2.1 AA violations`, async ({ page }) => {
        await page.goto(url(path));
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}
