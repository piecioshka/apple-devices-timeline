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

export function filterByCategory(
  devices: Device[],
  filter: CategoryFilter,
): Device[] {
  if (filter === 'all') return devices;
  return devices.filter((device) => device.category === filter);
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

/** Earliest and latest announcement years in the list, or null when empty. */
export function yearRange(
  devices: Device[],
): { first: number; last: number } | null {
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
