import type { Device } from '@/data/devices';
import { CATEGORY_SLUGS, type CategorySlug } from './categories';
import type { ThumbnailKey } from './thumbnails';
import { announcementYear, sortNewestFirst } from './timeline';

/**
 * Product lines Apple sold as distinct families or tiers. Every device names
 * one, and the index at the bottom of the page groups the timeline by it.
 * Generation markers (numbers, "XS", "5s") stay out of the line; suffixes
 * Apple kept across generations (Plus, Pro, mini, SE...) make a line of
 * their own. Grouped here by category, in navigation order.
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
] as const;

export type ProductLine = (typeof PRODUCT_LINES)[number];

export interface ProductLineSummary {
  line: ProductLine;
  category: CategorySlug;
  /** Pictogram of the newest model. */
  thumbnail: ThumbnailKey;
  /** Models of the line, newest first. */
  devices: Device[];
  /** Announcement year of the oldest model. */
  firstYear: number;
  /** Announcement year of the newest model. */
  lastYear: number;
}

export interface CategoryLines {
  category: CategorySlug;
  lines: ProductLineSummary[];
}

/**
 * One summary per product line present in `devices`, ordered by the line's
 * latest announcement, newest first.
 */
export function summarizeLines(devices: Device[]): ProductLineSummary[] {
  const byLine = new Map<ProductLine, ProductLineSummary>();

  for (const device of sortNewestFirst(devices)) {
    const year = announcementYear(device);
    const summary = byLine.get(device.line);
    if (summary) {
      summary.devices.push(device);
      summary.firstYear = Math.min(summary.firstYear, year);
    } else {
      byLine.set(device.line, {
        line: device.line,
        category: device.category,
        thumbnail: device.thumbnail,
        devices: [device],
        firstYear: year,
        lastYear: year,
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
