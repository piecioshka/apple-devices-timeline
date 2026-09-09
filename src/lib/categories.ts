export const CATEGORY_SLUGS = [
  'iphone',
  'ipad',
  'mac',
  'watch',
  'audio',
  'home',
  'display',
  'vision',
  'network',
  'accessory',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type CategoryFilter = CategorySlug | 'all';

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.some((slug) => slug === value);
}
