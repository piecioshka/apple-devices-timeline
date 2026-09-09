import { describe, expect, it } from 'vitest';
import { PRODUCT_LINES } from '@/lib/lines';
import { devices } from './devices';
import { rumors } from './rumors';

describe('product lines across the datasets', () => {
  const entries = [...devices, ...rumors];

  it('are each used by a device or a rumor', () => {
    const used = new Set<string>(entries.map((entry) => entry.line));
    for (const line of PRODUCT_LINES) expect(used.has(line), line).toBe(true);
  });

  it('each stay within one category', () => {
    const categoryOfLine = new Map<string, string>();
    for (const entry of entries) {
      const seen = categoryOfLine.get(entry.line);
      if (seen) expect(seen, `${entry.id}: ${entry.line}`).toBe(entry.category);
      else categoryOfLine.set(entry.line, entry.category);
    }
  });
});
