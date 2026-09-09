import { describe, expect, it } from 'vitest';
import type { Device } from '@/data/devices';
import {
  buildTimeline,
  filterByCategory,
  formatFullDate,
  formatLaunchDate,
  sortNewestFirst,
  yearRange,
} from './timeline';

function device(
  overrides: Partial<Device> & Pick<Device, 'id' | 'announcedAt'>,
): Device {
  return {
    name: overrides.id,
    category: 'mac',
    thumbnail: 'macbook',
    highlight: { en: '', pl: '' },
    ...overrides,
  };
}

const fixture: Device[] = [
  device({
    id: 'a',
    announcedAt: '2024-09-09',
    category: 'iphone',
    event: 'It’s Glowtime',
  }),
  device({ id: 'b', announcedAt: '2026-03-03', category: 'mac' }),
  device({ id: 'c', announcedAt: '2026-03-03', category: 'display' }),
  device({ id: 'd', announcedAt: '2016-09-07', category: 'iphone' }),
  device({ id: 'e', announcedAt: '2026-01-26', category: 'accessory' }),
];

describe('filterByCategory', () => {
  it('keeps only devices of the given category', () => {
    expect(filterByCategory(fixture, 'iphone').map((d) => d.id)).toEqual([
      'a',
      'd',
    ]);
  });

  it('returns everything for "all"', () => {
    expect(filterByCategory(fixture, 'all')).toHaveLength(fixture.length);
  });
});

describe('sortNewestFirst', () => {
  it('orders by announcement date descending and keeps input order for ties', () => {
    expect(sortNewestFirst(fixture).map((d) => d.id)).toEqual([
      'b',
      'c',
      'e',
      'a',
      'd',
    ]);
  });

  it('does not mutate the input', () => {
    const copy = [...fixture];
    sortNewestFirst(fixture);
    expect(fixture).toEqual(copy);
  });
});

describe('buildTimeline', () => {
  it('groups devices into years and launch days, newest first', () => {
    const years = buildTimeline(fixture);
    expect(years.map((y) => y.year)).toEqual([2026, 2024, 2016]);

    const [y2026] = years;
    expect(y2026.launches.map((l) => l.date)).toEqual([
      '2026-03-03',
      '2026-01-26',
    ]);
    expect(y2026.launches[0].devices.map((d) => d.id)).toEqual(['b', 'c']);
    expect(y2026.deviceCount).toBe(3);
  });

  it('carries the event name of a launch day when present', () => {
    const years = buildTimeline(fixture);
    const y2024 = years.find((y) => y.year === 2024);
    expect(y2024?.launches[0].event).toBe('It’s Glowtime');
  });

  it('returns an empty list for no devices', () => {
    expect(buildTimeline([])).toEqual([]);
  });
});

describe('yearRange', () => {
  it('returns the earliest and latest announcement years', () => {
    expect(yearRange(fixture)).toEqual({ first: 2016, last: 2026 });
  });

  it('returns null for an empty list', () => {
    expect(yearRange([])).toBeNull();
  });
});

describe('formatFullDate', () => {
  it('formats an ISO date with day, month name and year', () => {
    expect(formatFullDate('2026-09-09')).toBe('9 September 2026');
    expect(formatFullDate('2026-09-09', 'pl')).toBe('9 września 2026');
  });
});

describe('formatLaunchDate', () => {
  it('formats an ISO date as day and month name', () => {
    expect(formatLaunchDate('2026-03-03')).toBe('3 March');
    expect(formatLaunchDate('2024-09-09')).toBe('9 September');
  });

  it('localizes the month name', () => {
    expect(formatLaunchDate('2024-09-09', 'pl')).toBe('9 września');
    expect(formatLaunchDate('2026-03-03', 'pl')).toBe('3 marca');
  });
});
