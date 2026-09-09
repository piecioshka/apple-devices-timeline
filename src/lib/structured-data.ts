import type { Device } from '@/data/devices';
import type { Locale } from '@/i18n/ui';

const CONTEXT = 'https://schema.org';

export interface WebSiteInput {
  name: string;
  description: string;
  /** Absolute URL of the home page in this locale. */
  url: string;
  locale: Locale;
}

/** schema.org `WebSite` for the home page of one locale. */
export function webSite({ name, description, url, locale }: WebSiteInput) {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    name,
    description,
    url,
    inLanguage: locale,
  };
}

export interface ItemListInput {
  name: string;
  /** Absolute URL of the page that lists the devices. */
  url: string;
  /** Devices in page order (newest first); each card is anchored by its id. */
  devices: Device[];
}

/** schema.org `ItemList` mirroring the devices a timeline page shows. */
export function itemList({ name, url, devices }: ItemListInput) {
  return {
    '@context': CONTEXT,
    '@type': 'ItemList',
    name,
    url,
    numberOfItems: devices.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: devices.map((device, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: device.name,
      url: `${url}#${device.id}`,
    })),
  };
}

/**
 * JSON for a `<script type="application/ld+json">` block. `<` is escaped so
 * no value can close the script element early.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}
