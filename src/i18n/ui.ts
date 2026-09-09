import type { CategorySlug } from '@/lib/categories';
import type { YearRange } from '@/lib/timeline';

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
  /** Meta description; `years` are the first and last years in the dataset. */
  siteDescription: (years: YearRange) => string;
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
  /** Accessible name of the apple.com link on a device card. */
  appleLink: (name: string) => string;
  empty: string;
  /** Label before the date of the last data update. */
  updatedLabel: string;
  /** Heading of the section with unannounced, rumored devices. */
  rumorsTitle: string;
  rumors: PluralForms;
  /** Short tag on every rumor card, next to the category. */
  rumorTag: string;
  /** Disclaimer of the rumors section; `date` is the formatted "as of" date. */
  rumorsIntro: (date: string) => string;
  sources: string;
  /** "First half of 2027" and the like, for rumor windows without a month. */
  halfYear: (half: 1 | 2, year: number) => string;
  /** Heading of the product-line index at the bottom of the page. */
  linesTitle: string;
  lines: PluralForms;
  linesIntro: string;
  models: PluralForms;
  /** Compact count of rumored models in the product-line index. */
  rumorsShort: PluralForms;
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
  /** Alt text of the share image at `/og-<locale>.png`, which shows `years`. */
  ogImageAlt: (years: YearRange) => string;
}

export const UI: Record<Locale, Dictionary> = {
  en: {
    languageName: 'English',
    siteTitle: 'Apple Devices Timeline',
    siteDescription: ({ first, last }) =>
      `Every device Apple announced from ${first} to ${last}, grouped by launch day.`,
    title: 'Apple Devices Timeline',
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
    appleLink: (name) => `${name} on apple.com`,
    empty: 'Nothing in this category yet. Pick another category above.',
    updatedLabel: 'Last updated',
    rumorsTitle: 'Rumors',
    rumors: ['rumored device', 'rumored devices'],
    rumorTag: 'Rumor',
    rumorsIntro: (date) =>
      `Not announced by Apple. Devices the press expects next, based on reports from Bloomberg, MacRumors and analysts, as of ${date}. They stay out of the counts above.`,
    sources: 'Sources',
    halfYear: (half, year) =>
      half === 1 ? `First half of ${year}` : `Second half of ${year}`,
    linesTitle: 'Product lines',
    lines: ['product line', 'product lines'],
    linesIntro:
      'Every product line on this page: lines with nothing announced yet first, then by latest announcement. Open a line to see its models; rumored ones are tagged.',
    models: ['model', 'models'],
    rumorsShort: ['rumor', 'rumors'],
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
    ogImageAlt: ({ first, last }) =>
      `Apple Devices Timeline, ${first}-${last}. Every device Apple announced in those years, grouped by the day it was announced.`,
  },
  pl: {
    languageName: 'Polski',
    siteTitle: 'Oś czasu urządzeń Apple',
    siteDescription: ({ first, last }) =>
      `Każde urządzenie zapowiedziane przez Apple w latach ${first}-${last}, pogrupowane według dnia premiery.`,
    title: 'Kalendarium Sprzętu Apple',
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
    appleLink: (name) => `${name} na apple.com`,
    empty:
      'W tej kategorii nie ma jeszcze nic. Wybierz inną kategorię powyżej.',
    updatedLabel: 'Ostatnia aktualizacja',
    rumorsTitle: 'Plotki',
    rumors: [
      'plotkowane urządzenie',
      'plotkowane urządzenia',
      'plotkowanych urządzeń',
    ],
    rumorTag: 'Plotka',
    rumorsIntro: (date) =>
      `Niezapowiedziane przez Apple. Urządzenia, których spodziewa się prasa według doniesień Bloomberga, MacRumors i analityków, stan na ${date}. Nie wliczają się do liczb powyżej.`,
    sources: 'Źródła',
    halfYear: (half, year) =>
      half === 1 ? `Pierwsza połowa ${year}` : `Druga połowa ${year}`,
    linesTitle: 'Linie produktów',
    lines: ['linia produktów', 'linie produktów', 'linii produktów'],
    linesIntro:
      'Wszystkie linie produktów z tej strony: najpierw te bez żadnej zapowiedzi, potem od tej z najnowszą zapowiedzią. Rozwiń linię, żeby zobaczyć jej modele; plotki są oznaczone.',
    models: ['model', 'modele', 'modeli'],
    rumorsShort: ['plotka', 'plotki', 'plotek'],
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
    ogImageAlt: ({ first, last }) =>
      `Kalendarium Sprzętu Apple, ${first}-${last}. Każde urządzenie zapowiedziane przez Apple w tych latach, pogrupowane według dnia zapowiedzi.`,
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
