import { describe, expect, it } from 'vitest';
import { APPLE_COMPARE_KEYS, COMPARE_PAGES } from '@/data/apple-compare';
import { devices, type Device } from '@/data/devices';
import { compareUrl } from './compare';

function device(id: string): Device {
  const found = devices.find((d) => d.id === id);
  if (!found) throw new Error(`No device ${id}`);
  return found;
}

describe('Apple compare keys', () => {
  it('reference existing devices', () => {
    const ids = new Set(devices.map((d) => d.id));
    for (const id of Object.keys(APPLE_COMPARE_KEYS))
      expect(ids.has(id), id).toBe(true);
  });

  it('are unique', () => {
    const keys = Object.values(APPLE_COMPARE_KEYS);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('belong only to categories that have a compare page on apple.com', () => {
    for (const id of Object.keys(APPLE_COMPARE_KEYS)) {
      const { category } = device(id);
      expect(COMPARE_PAGES[category], `${id}: ${category}`).toBeDefined();
    }
  });
});

describe('compareUrl', () => {
  it('preselects the device next to its predecessor in the same line', () => {
    expect(compareUrl(device('ipad-mini-a20-pro'), 'en')).toBe(
      'https://www.apple.com/ipad/compare/?modelList=ipad-mini-a20pro,ipad-mini-a17pro',
    );
  });

  it('links to the Polish apple.com site in Polish', () => {
    expect(compareUrl(device('ipad-mini-a20-pro'), 'pl')).toBe(
      'https://www.apple.com/pl/ipad/compare/?modelList=ipad-mini-a20pro,ipad-mini-a17pro',
    );
  });

  it('adds every predecessor announced on the same day, up to three models', () => {
    expect(compareUrl(device('iphone-11'), 'en')).toBe(
      'https://www.apple.com/iphone/compare/?modelList=iphone-11,iphone-xs,iphone-xr',
    );
  });

  it('skips predecessors Apple does not compare', () => {
    expect(compareUrl(device('iphone-7'), 'en')).toBe(
      'https://www.apple.com/iphone/compare/?modelList=iphone-7',
    );
  });

  it('maps AirPods to the AirPods compare page', () => {
    expect(compareUrl(device('airpods-pro-3'), 'en')).toBe(
      'https://www.apple.com/airpods/compare/?modelList=airpods-pro-3,airpods-pro',
    );
  });

  it('returns nothing for devices missing from Apple compare', () => {
    expect(compareUrl(device('iphone-5s'), 'en')).toBeUndefined();
    expect(compareUrl(device('apple-homeview'), 'en')).toBeUndefined();
  });
});
