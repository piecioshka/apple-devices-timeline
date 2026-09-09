import type { Rumor } from '@/data/rumors';
import { UI, type Locale } from '@/i18n/ui';

/**
 * Expected launch window of a rumor: a month (`2026-10`), a half-year
 * (`2027-H1`) or a whole year (`2027`). The less precise the window, the
 * later it sorts within the months it could mean.
 */
const EXPECTED_WINDOW = /^(\d{4})(?:-(0[1-9]|1[0-2]|H[12]))?$/;

interface ParsedWindow {
  year: number;
  /** Month 1-12, half 1-2, or undefined for a whole year. */
  month?: number;
  half?: 1 | 2;
}

export function isExpectedWindow(value: string): boolean {
  return EXPECTED_WINDOW.test(value);
}

function parseWindow(window: string): ParsedWindow {
  const match = EXPECTED_WINDOW.exec(window);
  if (!match) throw new Error(`Invalid expected window: ${window}`);
  const year = Number(match[1]);
  const part = match[2];
  if (!part) return { year };
  if (part === 'H1') return { year, half: 1 };
  if (part === 'H2') return { year, half: 2 };
  return { year, month: Number(part) };
}

/** Sort key: months in order, then the half-year, then the whole year. */
export function windowOrder(window: string): number {
  const { year, month, half } = parseWindow(window);
  if (month) return year * 100 + month;
  if (half) return year * 100 + half * 6 + 0.5;
  return year * 100 + 13;
}

/** Last day (YYYY-MM-DD) a rumor with this window could still come true. */
export function windowEnd(window: string): string {
  const { year, month, half } = parseWindow(window);
  const lastMonth = month ?? (half === 1 ? 6 : 12);
  // Day 0 of the next month is the last day of `lastMonth`.
  const end = new Date(Date.UTC(year, lastMonth, 0));
  return end.toISOString().slice(0, 10);
}

export function sortSoonestFirst(rumors: Rumor[]): Rumor[] {
  return [...rumors].sort(
    (a, b) => windowOrder(a.expectedAt) - windowOrder(b.expectedAt),
  );
}

export interface RumorGroup {
  window: string;
  rumors: Rumor[];
}

/** Rumors grouped by expected window, soonest first; input order within a window. */
export function groupByWindow(rumors: Rumor[]): RumorGroup[] {
  const groups: RumorGroup[] = [];
  for (const rumor of sortSoonestFirst(rumors)) {
    let group = groups.at(-1);
    if (!group || group.window !== rumor.expectedAt) {
      group = { window: rumor.expectedAt, rumors: [] };
      groups.push(group);
    }
    group.rumors.push(rumor);
  }
  return groups;
}

const monthFormats = new Map<string, Intl.DateTimeFormat>();

function monthFormat(locale: string): Intl.DateTimeFormat {
  let format = monthFormats.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    monthFormats.set(locale, format);
  }
  return format;
}

/** Human-readable window, e.g. "October 2026", "First half of 2027", "2028". */
export function formatWindow(window: string, locale: Locale): string {
  const { year, month, half } = parseWindow(window);
  const ui = UI[locale];
  if (month) {
    return monthFormat(ui.dateLocale).format(
      new Date(Date.UTC(year, month - 1)),
    );
  }
  if (half) return ui.halfYear(half, year);
  return String(year);
}
