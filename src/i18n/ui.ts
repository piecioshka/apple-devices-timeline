import type { CategorySlug } from '@/lib/categories';

export const LOCALES = ['en', 'pl'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/** Plural forms: English has [one, other]; Polish has [one, few, many]. */
type PluralForms =
  readonly [string, string] | readonly [string, string, string];

interface Dictionary {
  languageName: string;
  siteTitle: string;
  siteDescription: string;
  title: string;
  lede: (firstYear: number) => string;
  devices: PluralForms;
  launchDays: PluralForms;
  years: PluralForms;
  categoriesLabel: string;
  all: string;
  categories: Record<CategorySlug, string>;
  jumpToYear: string;
  pressRelease: string;
  empty: string;
  footer: string;
  themeLabel: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;
  languageLabel: string;
  dateLocale: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundLink: string;
  /** Open Graph locale tag, e.g. "en_GB". */
  ogLocale: string;
  /** Alt text of the share image at `/og-<locale>.png`. */
  ogImageAlt: string;
}

export const UI: Record<Locale, Dictionary> = {
  en: {
    languageName: 'English',
    siteTitle: 'Apple Devices Timeline',
    siteDescription:
      'Every device Apple announced since 2008, newest first, grouped by launch day.',
    title: 'Apple hardware, newest first',
    lede: (firstYear) =>
      `Every device Apple announced since ${firstYear}, grouped by the day it was announced. Keynote taglines name the days that had one.`,
    devices: ['device', 'devices'],
    launchDays: ['launch day', 'launch days'],
    years: ['year', 'years'],
    categoriesLabel: 'Device categories',
    all: 'All',
    categories: {
      iphone: 'iPhone',
      ipad: 'iPad',
      mac: 'Mac',
      watch: 'Apple Watch',
      audio: 'Audio',
      home: 'Home & TV',
      display: 'Displays',
      vision: 'Vision',
      network: 'Networking',
      accessory: 'Accessories',
    },
    jumpToYear: 'Jump to year',
    pressRelease: 'Press release',
    empty: 'Nothing in this category yet. Pick another category above.',
    footer:
      'Announcement dates follow Apple Newsroom. Devices announced on the same day are listed together; a filled marker means a keynote, a hollow one a press release.',
    themeLabel: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageLabel: 'Language',
    dateLocale: 'en-GB',
    notFoundTitle: 'Page not found',
    notFoundBody: 'There is nothing at this address.',
    notFoundLink: 'Back to the timeline',
    ogLocale: 'en_GB',
    ogImageAlt:
      'Apple hardware, newest first. Every device Apple announced since 2008, grouped by the day it was announced.',
  },
  pl: {
    languageName: 'Polski',
    siteTitle: 'Oś czasu urządzeń Apple',
    siteDescription:
      'Każde urządzenie zapowiedziane przez Apple od 2008 roku, od najnowszych, pogrupowane według dnia premiery.',
    title: 'Sprzęt Apple, od najnowszych',
    lede: (firstYear) =>
      `Każde urządzenie zapowiedziane przez Apple od ${firstYear} roku, pogrupowane według dnia zapowiedzi. Dni z keynote'em noszą jego hasło.`,
    devices: ['urządzenie', 'urządzenia', 'urządzeń'],
    launchDays: ['dzień premier', 'dni premier', 'dni premier'],
    years: ['rok', 'lata', 'lat'],
    categoriesLabel: 'Kategorie urządzeń',
    all: 'Wszystkie',
    categories: {
      iphone: 'iPhone',
      ipad: 'iPad',
      mac: 'Mac',
      watch: 'Apple Watch',
      audio: 'Audio',
      home: 'Dom i TV',
      display: 'Monitory',
      vision: 'Vision',
      network: 'Sieć',
      accessory: 'Akcesoria',
    },
    jumpToYear: 'Przejdź do roku',
    pressRelease: 'Komunikat prasowy',
    empty:
      'W tej kategorii nie ma jeszcze nic. Wybierz inną kategorię powyżej.',
    footer:
      'Daty zapowiedzi pochodzą z Apple Newsroom. Urządzenia zapowiedziane tego samego dnia są zebrane razem; pełny znacznik oznacza keynote, pusty komunikat prasowy.',
    themeLabel: 'Motyw',
    themeSystem: 'Systemowy',
    themeLight: 'Jasny',
    themeDark: 'Ciemny',
    languageLabel: 'Język',
    dateLocale: 'pl',
    notFoundTitle: 'Nie ma takiej strony',
    notFoundBody: 'Pod tym adresem nic nie ma.',
    notFoundLink: 'Wróć do osi czasu',
    ogLocale: 'pl_PL',
    ogImageAlt:
      'Sprzęt Apple, od najnowszych. Każde urządzenie zapowiedziane przez Apple od 2008 roku, pogrupowane według dnia zapowiedzi.',
  },
};

/** Picks the plural form for `count` in the given locale. */
export function plural(
  locale: Locale,
  count: number,
  forms: PluralForms,
): string {
  if (locale === 'pl' && forms.length === 3) {
    const [one, few, many] = forms;
    if (count === 1) return one;
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }
  return count === 1 ? forms[0] : forms[1];
}

/** Path of the same page in another locale; the default locale has no prefix. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  if (locale === DEFAULT_LOCALE) return clean || '/';
  return `/${locale}${clean}`;
}

/** Locale-independent path of a URL pathname, e.g. "/pl/mac" -> "/mac". */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    const prefix = `/${locale}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname || '/';
}
