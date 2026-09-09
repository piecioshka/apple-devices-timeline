import type { Device } from '@/data/devices';
import type { CategoryFilter } from './categories';

export interface Launch {
  /** ISO date (YYYY-MM-DD) of the announcement day. */
  date: string;
  /** Keynote tagline or name; undefined for press-release launches. */
  event?: string;
  devices: Device[];
}

export interface TimelineYear {
  year: number;
  deviceCount: number;
  launches: Launch[];
}

export function announcementYear(device: Device): number {
  return Number(device.announcedAt.slice(0, 4));
}

export function filterByCategory<T extends Pick<Device, 'category'>>(
  items: T[],
  filter: CategoryFilter,
): T[] {
  if (filter === 'all') return items;
  return items.filter((item) => item.category === filter);
}

export function sortNewestFirst(devices: Device[]): Device[] {
  return [...devices].sort((a, b) =>
    b.announcedAt.localeCompare(a.announcedAt),
  );
}

export function buildTimeline(devices: Device[]): TimelineYear[] {
  const years: TimelineYear[] = [];

  for (const device of sortNewestFirst(devices)) {
    const year = announcementYear(device);
    let current = years.at(-1);
    if (!current || current.year !== year) {
      current = { year, deviceCount: 0, launches: [] };
      years.push(current);
    }
    current.deviceCount += 1;

    let launch = current.launches.at(-1);
    if (!launch || launch.date !== device.announcedAt) {
      launch = { date: device.announcedAt, event: device.event, devices: [] };
      current.launches.push(launch);
    }
    if (!launch.event && device.event) launch.event = device.event;
    launch.devices.push(device);
  }

  return years;
}

export interface YearRange {
  first: number;
  last: number;
}

/** Earliest and latest announcement years in the list, or null when empty. */
export function yearRange(devices: Device[]): YearRange | null {
  if (devices.length === 0) return null;
  const years = devices.map(announcementYear);
  return { first: Math.min(...years), last: Math.max(...years) };
}

const dateFormats = new Map<string, Intl.DateTimeFormat>();

function launchDateFormat(locale: string): Intl.DateTimeFormat {
  let format = dateFormats.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });
    dateFormats.set(locale, format);
  }
  return format;
}

/** Day and month name of an ISO date in the given BCP 47 locale. */
export function formatLaunchDate(isoDate: string, locale = 'en-GB'): string {
  return launchDateFormat(locale).format(new Date(`${isoDate}T00:00:00Z`));
}

const fullDateFormats = new Map<string, Intl.DateTimeFormat>();

function fullDateFormat(locale: string): Intl.DateTimeFormat {
  let format = fullDateFormats.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    fullDateFormats.set(locale, format);
  }
  return format;
}

/** Day, month name and year of an ISO date in the given BCP 47 locale. */
export function formatFullDate(isoDate: string, locale = 'en-GB'): string {
  return fullDateFormat(locale).format(new Date(`${isoDate}T00:00:00Z`));
}

interface DateTimeFormats {
  date: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
}

const dateTimeFormats = new Map<string, DateTimeFormats>();

function dateTimeFormat(locale: string, timeZone: string | null) {
  const key = `${locale}|${timeZone ?? ''}`;
  let formats = dateTimeFormats.get(key);
  if (!formats) {
    const zone = timeZone ?? undefined;
    formats = {
      date: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: zone,
      }),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: zone,
        timeZoneName: 'short',
      }),
    };
    dateTimeFormats.set(key, formats);
  }
  return formats;
}

/**
 * Full date and the time of day of an ISO instant in the given BCP 47 locale
 * and IANA time zone, e.g. "9 September 2026, 14:10 UTC". Pass `null` as the
 * zone to use the runtime's own: the visitor's zone in the browser.
 */
export function formatDateTime(
  isoInstant: string,
  locale = 'en-GB',
  timeZone: string | null = 'UTC',
): string {
  const instant = new Date(isoInstant);
  const { date, time } = dateTimeFormat(locale, timeZone);
  return `${date.format(instant)}, ${time.format(instant)}`;
}
