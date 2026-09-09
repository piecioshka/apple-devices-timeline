import { describe, expect, it } from 'vitest';
import { devices } from '@/data/devices';
import { coverage } from './coverage';

describe('coverage', () => {
  it('starts in 2008 and ends with the latest announcement', () => {
    const years = devices.map((device) =>
      Number(device.announcedAt.slice(0, 4)),
    );
    expect(coverage.first).toBe(2008);
    expect(coverage.last).toBe(Math.max(...years));
  });
});
