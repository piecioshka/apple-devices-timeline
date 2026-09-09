import { describe, expect, it } from 'vitest';
import { devices } from './devices';
import { DATA_UPDATED_AT, DATA_UPDATED_ON } from './meta';

describe('DATA_UPDATED_AT', () => {
  it('is a valid ISO instant in UTC', () => {
    expect(DATA_UPDATED_AT).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(Number.isNaN(Date.parse(DATA_UPDATED_AT))).toBe(false);
  });

  it('is not older than the latest announcement in the dataset', () => {
    const latest = devices
      .map((d) => d.announcedAt)
      .sort((a, b) => b.localeCompare(a))[0];
    expect(DATA_UPDATED_ON.localeCompare(latest)).toBeGreaterThanOrEqual(0);
  });
});

describe('DATA_UPDATED_ON', () => {
  it('is the calendar day of DATA_UPDATED_AT', () => {
    expect(DATA_UPDATED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(DATA_UPDATED_AT.startsWith(DATA_UPDATED_ON)).toBe(true);
  });
});
