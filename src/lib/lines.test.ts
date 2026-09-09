import { describe, expect, it } from 'vitest';
import type { Device } from '@/data/devices';
import type { Rumor } from '@/data/rumors';
import { groupLinesByCategory, summarizeLines } from './lines';

function device(
  overrides: Partial<Device> & Pick<Device, 'id' | 'announcedAt' | 'line'>,
): Device {
  return {
    name: overrides.id,
    category: 'ipad',
    thumbnail: 'ipad',
    url: `https://support.apple.com/en-us/${overrides.id}`,
    highlight: { en: '', pl: '' },
    ...overrides,
  };
}

function rumor(
  overrides: Partial<Rumor> & Pick<Rumor, 'id' | 'expectedAt' | 'line'>,
): Rumor {
  return {
    name: overrides.id,
    category: 'ipad',
    thumbnail: 'ipad',
    summary: { en: '', pl: '' },
    sources: [],
    ...overrides,
  };
}

const devicesFixture: Device[] = [
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

const rumorsFixture: Rumor[] = [
  rumor({ id: 'ipad-mini-8', expectedAt: '2026-10', line: 'iPad mini' }),
  rumor({
    id: 'home-hub',
    expectedAt: '2026-10',
    line: 'Home hub',
    category: 'home',
    thumbnail: 'home-hub',
  }),
  rumor({
    id: 'tabletop-robot',
    expectedAt: '2028',
    line: 'Tabletop robot',
    category: 'home',
    thumbnail: 'robot',
  }),
  rumor({ id: 'ipad-mini-9', expectedAt: '2027-H2', line: 'iPad mini' }),
];

describe('summarizeLines', () => {
  it('groups devices by line, latest line first, models newest first', () => {
    const lines = summarizeLines(devicesFixture);
    expect(lines.map((line) => line.line)).toEqual([
      'MacBook Neo',
      'iPad',
      'iPad mini',
    ]);
    expect(lines[1]?.devices.map((d) => d.id)).toEqual(['ipad-a16', 'ipad-1']);
    expect(lines[1]?.rumors).toEqual([]);
  });

  it('spans the years of the oldest and newest model and shows the newest pictogram', () => {
    const [, ipad, mini] = summarizeLines(devicesFixture);
    expect(ipad).toMatchObject({
      category: 'ipad',
      thumbnail: 'ipad',
      years: { first: 2010, last: 2025 },
    });
    expect(mini).toMatchObject({
      thumbnail: 'ipad',
      years: { first: 2012, last: 2021 },
    });
  });

  it('puts lines with nothing announced first, furthest window first', () => {
    const lines = summarizeLines(devicesFixture, rumorsFixture);
    expect(lines.map((line) => line.line)).toEqual([
      'Tabletop robot',
      'Home hub',
      'MacBook Neo',
      'iPad',
      'iPad mini',
    ]);
    expect(lines[1]).toMatchObject({
      category: 'home',
      thumbnail: 'home-hub',
      devices: [],
    });
    expect(lines[1]?.rumors.map((r) => r.id)).toEqual(['home-hub']);
    expect(lines[1]?.years).toBeUndefined();
  });

  it('lists the rumors of an announced line furthest window first, keeping its place', () => {
    const mini = summarizeLines(devicesFixture, rumorsFixture).at(-1);
    expect(mini?.rumors.map((r) => r.id)).toEqual([
      'ipad-mini-9',
      'ipad-mini-8',
    ]);
    expect(mini?.devices.map((d) => d.id)).toEqual([
      'ipad-mini-6',
      'ipad-mini-1',
    ]);
    expect(mini).toMatchObject({
      thumbnail: 'ipad',
      years: { first: 2012, last: 2021 },
    });
  });

  it('returns nothing for empty lists', () => {
    expect(summarizeLines([])).toEqual([]);
    expect(summarizeLines([], [])).toEqual([]);
  });
});

describe('groupLinesByCategory', () => {
  it('splits the lines by category in navigation order and skips empty categories', () => {
    const groups = groupLinesByCategory(
      summarizeLines(devicesFixture, rumorsFixture),
    );
    expect(groups.map((group) => group.category)).toEqual([
      'ipad',
      'mac',
      'home',
    ]);
    expect(groups[0]?.lines.map((line) => line.line)).toEqual([
      'iPad',
      'iPad mini',
    ]);
    expect(groups[2]?.lines.map((line) => line.line)).toEqual([
      'Tabletop robot',
      'Home hub',
    ]);
  });
});
