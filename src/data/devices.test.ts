import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/i18n/ui';
import { CATEGORY_SLUGS } from '@/lib/categories';
import { PRODUCT_LINES } from '@/lib/lines';
import { isThumbnailKey } from '@/lib/thumbnails';
import { devices } from './devices';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('devices dataset', () => {
  it('has unique ids in slug form', () => {
    const ids = devices.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(SLUG);
  });

  it('has valid ISO announcement dates', () => {
    for (const d of devices) {
      expect(d.announcedAt, d.id).toMatch(ISO_DATE);
      expect(Number.isNaN(Date.parse(d.announcedAt)), d.id).toBe(false);
    }
  });

  it('uses only known categories', () => {
    const known = new Set<string>(CATEGORY_SLUGS);
    for (const d of devices)
      expect(known.has(d.category), `${d.id}: ${d.category}`).toBe(true);
  });

  it('keeps every product line within one category', () => {
    const categoryOfLine = new Map<string, string>();
    for (const d of devices) {
      const seen = categoryOfLine.get(d.line);
      if (seen) expect(seen, `${d.id}: ${d.line}`).toBe(d.category);
      else categoryOfLine.set(d.line, d.category);
    }
  });

  it('uses every product line at least once', () => {
    const used = new Set<string>(devices.map((d) => d.line));
    for (const line of PRODUCT_LINES) expect(used.has(line), line).toBe(true);
  });

  it('references an existing pictogram for every device', () => {
    for (const d of devices)
      expect(isThumbnailKey(d.thumbnail), `${d.id}: ${d.thumbnail}`).toBe(true);
  });

  it('has a non-empty name and a highlight in every locale', () => {
    for (const d of devices) {
      expect(d.name.trim().length, d.id).toBeGreaterThan(0);
      for (const locale of LOCALES)
        expect(
          d.highlight[locale].trim().length,
          `${d.id} ${locale}`,
        ).toBeGreaterThan(0);
    }
  });

  it('is ordered newest first in the file', () => {
    const dates = devices.map((d) => d.announcedAt);
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(sorted);
  });

  it('shares one event per announcement day', () => {
    const eventsByDay = new Map<string, string | undefined>();
    for (const d of devices) {
      if (!eventsByDay.has(d.announcedAt))
        eventsByDay.set(d.announcedAt, d.event);
      expect(d.event, `${d.id} on ${d.announcedAt}`).toBe(
        eventsByDay.get(d.announcedAt),
      );
    }
  });

  it('covers every calendar year from 2008 to 2026', () => {
    const years = new Set(
      devices.map((d) => Number(d.announcedAt.slice(0, 4))),
    );
    for (let year = 2008; year <= 2026; year += 1)
      expect(years.has(year), String(year)).toBe(true);
  });

  it('contains no Cyrillic characters', () => {
    const text = JSON.stringify(devices);
    expect(/\p{Script=Cyrillic}/u.test(text)).toBe(false);
  });
});
