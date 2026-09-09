import { describe, expect, it } from 'vitest';
import { devices } from './devices';
import { DATA_UPDATED_AT } from './meta';

describe('DATA_UPDATED_AT', () => {
  it('is a valid ISO date', () => {
    expect(DATA_UPDATED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(DATA_UPDATED_AT))).toBe(false);
  });

  it('is not older than the latest announcement in the dataset', () => {
    const latest = devices
      .map((d) => d.announcedAt)
      .sort((a, b) => b.localeCompare(a))[0];
    expect(DATA_UPDATED_AT.localeCompare(latest)).toBeGreaterThanOrEqual(0);
  });
});
