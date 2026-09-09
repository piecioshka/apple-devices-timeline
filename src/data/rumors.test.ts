import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/ui';
import { CATEGORY_SLUGS } from '@/lib/categories';
import { isExpectedWindow, windowEnd, windowOrder } from '@/lib/rumors';
import { isThumbnailKey } from '@/lib/thumbnails';
import { devices } from './devices';
import { DATA_UPDATED_AT } from './meta';
import { rumors } from './rumors';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('rumors dataset', () => {
  it('has unique ids in slug form', () => {
    const ids = rumors.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(SLUG);
  });

  it('does not reuse the id of an announced device', () => {
    const announced = new Set(devices.map((d) => d.id));
    for (const r of rumors) expect(announced.has(r.id), r.id).toBe(false);
  });

  it('has a valid expected window', () => {
    for (const r of rumors)
      expect(isExpectedWindow(r.expectedAt), `${r.id}: ${r.expectedAt}`).toBe(
        true,
      );
  });

  it('has no window that ended before the last data update', () => {
    for (const r of rumors)
      expect(
        windowEnd(r.expectedAt).localeCompare(DATA_UPDATED_AT),
        `${r.id}: ${r.expectedAt}`,
      ).toBeGreaterThanOrEqual(0);
  });

  it('uses only known categories', () => {
    const known = new Set<string>(CATEGORY_SLUGS);
    for (const r of rumors)
      expect(known.has(r.category), `${r.id}: ${r.category}`).toBe(true);
  });

  it('references an existing pictogram for every rumor', () => {
    for (const r of rumors)
      expect(isThumbnailKey(r.thumbnail), `${r.id}: ${r.thumbnail}`).toBe(true);
  });

  it('has a name, a summary in every locale and at least one source', () => {
    for (const r of rumors) {
      expect(r.name.trim().length, r.id).toBeGreaterThan(0);
      for (const locale of LOCALES)
        expect(
          r.summary[locale].trim().length,
          `${r.id} ${locale}`,
        ).toBeGreaterThan(0);
      expect(r.sources.length, r.id).toBeGreaterThan(0);
      for (const source of r.sources)
        expect(source.trim().length, r.id).toBeGreaterThan(0);
    }
  });

  it('is ordered soonest first in the file', () => {
    const order = rumors.map((r) => windowOrder(r.expectedAt));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('contains no Cyrillic characters or dashes other than the hyphen', () => {
    const text = JSON.stringify(rumors);
    expect(/\p{Script=Cyrillic}/u.test(text)).toBe(false);
    expect(/[–—]/.test(text)).toBe(false);
  });
});
