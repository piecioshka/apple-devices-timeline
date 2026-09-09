import type { Device } from '@/data/devices';
import type { Rumor } from '@/data/rumors';
import { CATEGORY_SLUGS, type CategorySlug } from './categories';
import { sortFurthestFirst } from './rumors';
import type { ThumbnailKey } from './thumbnails';
import { announcementYear, sortNewestFirst } from './timeline';

/**
 * Product lines Apple sold as distinct families or tiers. Every device and
 * every rumor names one, and the index at the bottom of the page groups the
 * timeline by it. Generation markers (numbers, "XS", "5s") stay out of the
 * line; suffixes Apple kept across generations (Plus, Pro, mini, SE...) make
 * a line of their own. Grouped here by category, in navigation order.
 */
export const PRODUCT_LINES = [
  // iPhone
  'iPhone',
  'iPhone Plus',
  'iPhone Pro',
  'iPhone Pro Max',
  'iPhone Max',
  'iPhone mini',
  'iPhone SE',
  'iPhone Air',
  'iPhone e',
  'iPhone Duo',
  // iPad
  'iPad',
  'iPad mini',
  'iPad Air',
  'iPad Pro',
  // Mac
  'MacBook',
  'MacBook Neo',
  'MacBook Air',
  'MacBook Pro',
  'iMac',
  'iMac Pro',
  'Mac mini',
  'Mac Studio',
  'Mac Pro',
  'Xserve',
  // Apple Watch
  'Apple Watch',
  'Apple Watch Series',
  'Apple Watch SE',
  'Apple Watch Ultra',
  // Audio
  'AirPods',
  'AirPods Pro',
  'AirPods Max',
  'iPod classic',
  'iPod nano',
  'iPod shuffle',
  'iPod touch',
  // Home & TV
  'Apple TV',
  'HomePod',
  'HomePod mini',
  // Displays
  'LED Cinema Display',
  'Thunderbolt Display',
  'Pro Display XDR',
  'Studio Display',
  'Studio Display XDR',
  // Vision
  'Apple Vision Pro',
  // Networking
  'AirPort Express',
  'AirPort Extreme',
  'Time Capsule',
  // Accessories
  'Apple Pencil',
  'AirTag',
  // Rumored lines with no announced model yet, under the working names the
  // press uses (see `src/data/rumors.ts`).
  'Home hub',
  'Tabletop robot',
  'Smart glasses',
] as const;

export type ProductLine = (typeof PRODUCT_LINES)[number];

export interface YearSpan {
  first: number;
  last: number;
}

export interface ProductLineSummary {
  line: ProductLine;
  category: CategorySlug;
  /** Pictogram of the newest announced model, or of the first rumor. */
  thumbnail: ThumbnailKey;
  /** Announced models, newest first. */
  devices: Device[];
  /** Rumored models, furthest window first. */
  rumors: Rumor[];
  /** Announcement years of the oldest and newest model; absent until one is announced. */
  years?: YearSpan;
}

export interface CategoryLines {
  category: CategorySlug;
  lines: ProductLineSummary[];
}

/**
 * One summary per product line present in `devices` or `rumors`. Lines with
 * nothing announced yet come first, furthest window first; announced lines
 * follow in the order of their latest announcement, newest first. Like the
 * page, the index runs backwards in time.
 */
export function summarizeLines(
  devices: Device[],
  rumors: Rumor[] = [],
): ProductLineSummary[] {
  const byLine = new Map<ProductLine, ProductLineSummary>();

  for (const rumor of sortFurthestFirst(rumors)) {
    const summary = byLine.get(rumor.line);
    if (summary) {
      summary.rumors.push(rumor);
    } else {
      byLine.set(rumor.line, {
        line: rumor.line,
        category: rumor.category,
        thumbnail: rumor.thumbnail,
        devices: [],
        rumors: [rumor],
      });
    }
  }

  for (const device of sortNewestFirst(devices)) {
    const year = announcementYear(device);
    const summary = byLine.get(device.line);
    if (summary?.years) {
      summary.devices.push(device);
      summary.years.first = Math.min(summary.years.first, year);
    } else {
      // First announced model of the line: (re)insert the line here, so the
      // announced lines keep the newest-first order of the timeline.
      byLine.delete(device.line);
      byLine.set(device.line, {
        line: device.line,
        category: device.category,
        thumbnail: device.thumbnail,
        devices: [device],
        rumors: summary?.rumors ?? [],
        years: { first: year, last: year },
      });
    }
  }

  return [...byLine.values()];
}

/** Splits the summaries by category, in navigation order, skipping empty ones. */
export function groupLinesByCategory(
  lines: ProductLineSummary[],
): CategoryLines[] {
  return CATEGORY_SLUGS.map((category) => ({
    category,
    lines: lines.filter((line) => line.category === category),
  })).filter((group) => group.lines.length > 0);
}
