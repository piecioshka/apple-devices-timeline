import { describe, expect, it } from 'vitest';
import type { Rumor } from '@/data/rumors';
import {
  formatWindow,
  groupByWindow,
  isExpectedWindow,
  sortFurthestFirst,
  windowEnd,
  windowOrder,
} from './rumors';

function rumor(id: string, expectedAt: string): Rumor {
  return {
    id,
    name: id,
    category: 'mac',
    line: 'MacBook',
    thumbnail: 'macbook',
    expectedAt,
    summary: { en: '', pl: '' },
    sources: ['Bloomberg'],
  };
}

describe('isExpectedWindow', () => {
  it('accepts a year, a month and a half-year', () => {
    for (const value of ['2027', '2026-09', '2026-12', '2027-H1', '2027-H2'])
      expect(isExpectedWindow(value), value).toBe(true);
  });

  it('rejects anything else', () => {
    for (const value of [
      '2026-9',
      '2026-13',
      '2026-00',
      '2027-H3',
      '2026-09-09',
      'soon',
      '',
    ])
      expect(isExpectedWindow(value), value).toBe(false);
  });
});

describe('windowOrder', () => {
  it('orders months, then the half-year they fall in, then the whole year', () => {
    const windows = [
      '2027',
      '2026-H2',
      '2026-10',
      '2026-09',
      '2027-H1',
      '2027-03',
      '2026-H1',
    ];
    const sorted = [...windows].sort((a, b) => windowOrder(a) - windowOrder(b));
    expect(sorted).toEqual([
      '2026-H1',
      '2026-09',
      '2026-10',
      '2026-H2',
      '2027-03',
      '2027-H1',
      '2027',
    ]);
  });

  it('throws on an invalid window', () => {
    expect(() => windowOrder('2026-9')).toThrow('Invalid expected window');
  });
});

describe('windowEnd', () => {
  it('returns the last day of the window', () => {
    expect(windowEnd('2026-09')).toBe('2026-09-30');
    expect(windowEnd('2028-02')).toBe('2028-02-29');
    expect(windowEnd('2027-H1')).toBe('2027-06-30');
    expect(windowEnd('2027-H2')).toBe('2027-12-31');
    expect(windowEnd('2027')).toBe('2027-12-31');
  });
});

describe('sortFurthestFirst', () => {
  it('sorts by window descending and keeps input order for ties', () => {
    const input = [
      rumor('a', '2026-09'),
      rumor('b', '2026-10'),
      rumor('c', '2026-10'),
      rumor('d', '2027'),
    ];
    expect(sortFurthestFirst(input).map((r) => r.id)).toEqual([
      'd',
      'b',
      'c',
      'a',
    ]);
    expect(input.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('groupByWindow', () => {
  it('groups rumors sharing a window, furthest first', () => {
    const groups = groupByWindow([
      rumor('a', '2026-10'),
      rumor('b', '2027'),
      rumor('c', '2026-10'),
    ]);
    expect(groups.map((g) => g.window)).toEqual(['2027', '2026-10']);
    expect(groups[1].rumors.map((r) => r.id)).toEqual(['a', 'c']);
  });

  it('returns an empty list for no rumors', () => {
    expect(groupByWindow([])).toEqual([]);
  });
});

describe('formatWindow', () => {
  it('formats a month with its year', () => {
    expect(formatWindow('2026-10', 'en')).toBe('October 2026');
    expect(formatWindow('2026-10', 'pl')).toBe('październik 2026');
  });

  it('spells out half-years', () => {
    expect(formatWindow('2027-H1', 'en')).toBe('First half of 2027');
    expect(formatWindow('2027-H2', 'pl')).toBe('Druga połowa 2027');
  });

  it('leaves a bare year as is', () => {
    expect(formatWindow('2028', 'en')).toBe('2028');
    expect(formatWindow('2028', 'pl')).toBe('2028');
  });
});
