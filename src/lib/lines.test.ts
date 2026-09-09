import { describe, expect, it } from 'vitest';
import type { Device } from '@/data/devices';
import { groupLinesByCategory, summarizeLines } from './lines';

function device(
  overrides: Partial<Device> & Pick<Device, 'id' | 'announcedAt' | 'line'>,
): Device {
  return {
    name: overrides.id,
    category: 'ipad',
    thumbnail: 'ipad',
    highlight: { en: '', pl: '' },
    ...overrides,
  };
}

const fixture: Device[] = [
  device({ id: 'ipad-mini-6', announcedAt: '2021-09-14', line: 'iPad mini' }),
  device({
    id: 'ipad-1',
    announcedAt: '2010-01-27',
    line: 'iPad',
    thumbnail: 'ipad-home',
  }),
  device({
    id: 'macbook-neo',
    announcedAt: '2026-03-04',
    line: 'MacBook Neo',
    category: 'mac',
    thumbnail: 'macbook',
  }),
  device({ id: 'ipad-a16', announcedAt: '2025-03-04', line: 'iPad' }),
  device({
    id: 'ipad-mini-1',
    announcedAt: '2012-10-23',
    line: 'iPad mini',
    thumbnail: 'ipad-home',
  }),
];

describe('summarizeLines', () => {
  it('groups devices by line, latest line first, models newest first', () => {
    const lines = summarizeLines(fixture);
    expect(lines.map((line) => line.line)).toEqual([
      'MacBook Neo',
      'iPad',
      'iPad mini',
    ]);
    expect(lines[1]?.devices.map((d) => d.id)).toEqual(['ipad-a16', 'ipad-1']);
  });

  it('spans the years of the oldest and newest model and shows the newest pictogram', () => {
    const [, ipad, mini] = summarizeLines(fixture);
    expect(ipad).toMatchObject({
      category: 'ipad',
      thumbnail: 'ipad',
      firstYear: 2010,
      lastYear: 2025,
    });
    expect(mini).toMatchObject({
      thumbnail: 'ipad',
      firstYear: 2012,
      lastYear: 2021,
    });
  });

  it('returns nothing for an empty list', () => {
    expect(summarizeLines([])).toEqual([]);
  });
});

describe('groupLinesByCategory', () => {
  it('splits the lines by category in navigation order and skips empty categories', () => {
    const groups = groupLinesByCategory(summarizeLines(fixture));
    expect(groups.map((group) => group.category)).toEqual(['ipad', 'mac']);
    expect(groups[0]?.lines.map((line) => line.line)).toEqual([
      'iPad',
      'iPad mini',
    ]);
  });
});
