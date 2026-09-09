import { describe, expect, it } from 'vitest';
import type { Device } from '@/data/devices';
import { itemList, serializeJsonLd, webSite } from './structured-data';

const device = (id: string, name: string): Device => ({
  id,
  name,
  category: 'mac',
  thumbnail: 'mac-mini',
  announcedAt: '2026-08-25',
  highlight: { en: '', pl: '' },
});

describe('webSite', () => {
  it('describes the home page of a locale', () => {
    expect(
      webSite({
        name: 'Apple Devices Timeline',
        description: 'Every device.',
        url: 'https://example.com/pl',
        locale: 'pl',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Apple Devices Timeline',
      description: 'Every device.',
      url: 'https://example.com/pl',
      inLanguage: 'pl',
    });
  });
});

describe('itemList', () => {
  it('numbers the devices in page order and links to their anchors', () => {
    const list = itemList({
      name: 'Mac',
      url: 'https://example.com/mac',
      devices: [
        device('mac-studio-2026', 'Mac Studio'),
        device('imac-2008', 'iMac'),
      ],
    });

    expect(list['@type']).toBe('ItemList');
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListOrder).toBe(
      'https://schema.org/ItemListOrderDescending',
    );
    expect(list.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Mac Studio',
        url: 'https://example.com/mac#mac-studio-2026',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'iMac',
        url: 'https://example.com/mac#imac-2008',
      },
    ]);
  });

  it('handles an empty category', () => {
    const list = itemList({ name: 'Vision', url: '/vision', devices: [] });
    expect(list.numberOfItems).toBe(0);
    expect(list.itemListElement).toEqual([]);
  });
});

describe('serializeJsonLd', () => {
  it('produces JSON that parses back to the input', () => {
    const data = { name: 'iPad (10th gen)', count: 1 };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });

  it('cannot close the script element early', () => {
    const json = serializeJsonLd({ name: '</script><b>' });
    expect(json).not.toContain('</script');
    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual({ name: '</script><b>' });
  });
});
