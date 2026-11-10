import { APPLE_COMPARE_KEYS, COMPARE_PAGES } from '@/data/apple-compare';
import { devices, type Device } from '@/data/devices';
import type { Locale } from '@/i18n/ui';

/** The apple.com compare page shows at most this many models side by side. */
const MAX_MODELS = 3;

const SITE_PREFIX: Record<Locale, string> = { en: '', pl: 'pl/' };

/**
 * Models of the same line announced on the latest day before `device`, among
 * those Apple lists in its compare tool. Keeps dataset order.
 */
function predecessorKeys(device: Device, dataset: readonly Device[]): string[] {
  const earlier = dataset.filter(
    (d) =>
      d.line === device.line &&
      d.announcedAt < device.announcedAt &&
      APPLE_COMPARE_KEYS[d.id] !== undefined,
  );
  const latestDay = earlier.reduce(
    (day, d) => (d.announcedAt > day ? d.announcedAt : day),
    '',
  );
  return earlier
    .filter((d) => d.announcedAt === latestDay)
    .map((d) => APPLE_COMPARE_KEYS[d.id] ?? '');
}

/**
 * Link to the compare page on apple.com with `device` preselected next to its
 * predecessor, or `undefined` when Apple does not compare that model.
 */
export function compareUrl(
  device: Device,
  locale: Locale,
  dataset: readonly Device[] = devices,
): string | undefined {
  const key = APPLE_COMPARE_KEYS[device.id];
  const page = COMPARE_PAGES[device.category];
  if (!key || !page) return undefined;
  const models = [key, ...predecessorKeys(device, dataset)].slice(
    0,
    MAX_MODELS,
  );
  return `https://www.apple.com/${SITE_PREFIX[locale]}${page}/compare/?modelList=${models.join(',')}`;
}
