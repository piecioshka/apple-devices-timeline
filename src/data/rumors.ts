import type { LocalizedText } from './devices';
import type { CategorySlug } from '@/lib/categories';
import type { ThumbnailKey } from '@/lib/thumbnails';

export interface Rumor {
  /** Stable slug; becomes the device id once Apple announces the product. */
  id: string;
  /** Rumored name; a working name when the press has not settled on one. */
  name: string;
  category: CategorySlug;
  /** Pictogram key from `src/lib/thumbnails.ts`. */
  thumbnail: ThumbnailKey;
  /**
   * Expected announcement window: a month (`2026-10`), a half-year
   * (`2027-H1`) or a year (`2028`). See `src/lib/rumors.ts`.
   */
  expectedAt: string;
  /** What the reports expect the device to bring, per locale. */
  summary: LocalizedText;
  /** Outlets or analysts behind the rumor, most cited first. */
  sources: string[];
}

// Unannounced devices the press expects next, as of `DATA_UPDATED_AT` in
// `meta.ts`. Nothing here is confirmed by Apple; the summaries report what the
// named sources claim. When Apple announces a device, move it to `devices.ts`
// (same id) and delete it here. Rumors whose window has passed are removed,
// not kept as misses.
//
// Scope: same categories as the timeline, hardware only, and only rumors with
// a named source and an expected window within about two years.
// Ordered furthest window first, like the page: time runs backwards down the
// page, so the soonest rumors sit right above the latest announcements.
export const rumors: Rumor[] = [
  // 2028
  {
    id: 'tabletop-robot',
    name: 'Tabletop robot',
    category: 'home',
    thumbnail: 'robot',
    expectedAt: '2028',
    summary: {
      en: 'Display on a motorized arm that turns toward you, with a conversational Siri persona; Bloomberg’s timing has slipped from 2027 to 2028 and the target price is around $1,000.',
      pl: 'Ekran na ruchomym ramieniu, które obraca się w stronę użytkownika, z konwersacyjną Siri; według Bloomberga termin przesunął się z 2027 na 2028, cena docelowa około 1000 dolarów.',
    },
    sources: ['Bloomberg'],
  },
  // 2027
  {
    id: 'ipad-pro-m6',
    name: 'iPad Pro (M6)',
    category: 'ipad',
    thumbnail: 'ipad',
    expectedAt: '2027',
    summary: {
      en: 'M6 with vapor-chamber cooling for sustained performance.',
      pl: 'M6 z chłodzeniem komorą parową dla stabilnej wydajności.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'macbook-neo-2',
    name: 'MacBook Neo (A19 Pro)',
    category: 'mac',
    thumbnail: 'macbook',
    expectedAt: '2027',
    summary: {
      en: 'Second generation with the A19 Pro, more memory and new colors.',
      pl: 'Druga generacja z A19 Pro, większą pamięcią i nowymi kolorami.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'airpods-pro-camera',
    name: 'AirPods Pro with cameras',
    category: 'audio',
    thumbnail: 'airpods',
    expectedAt: '2027',
    summary: {
      en: 'Infrared cameras for gesture control and Visual Intelligence on the H3 chip; Bloomberg says 2027, Ming-Chi Kuo had argued for late 2026.',
      pl: 'Kamery na podczerwień do sterowania gestami i Visual Intelligence, czip H3; Bloomberg mówi o 2027, Ming-Chi Kuo obstawiał koniec 2026.',
    },
    sources: ['Bloomberg', 'Ming-Chi Kuo'],
  },
  // Second half of 2027
  {
    id: 'iphone-20',
    name: '20th-anniversary iPhone',
    category: 'iphone',
    thumbnail: 'iphone-island',
    expectedAt: '2027-H2',
    summary: {
      en: 'Higher-end model for the iPhone’s 20th year, with glass curving around all four edges and an edge-to-edge display.',
      pl: 'Model z wyższej półki na 20-lecie iPhone’a, ze szkłem zaokrąglonym na wszystkich krawędziach i ekranem od krawędzi do krawędzi.',
    },
    sources: ['Bloomberg', 'The Information', 'Ming-Chi Kuo'],
  },
  {
    id: 'apple-glasses',
    name: 'Apple smart glasses',
    category: 'vision',
    thumbnail: 'glasses',
    expectedAt: '2027-H2',
    summary: {
      en: 'Display-free glasses with cameras, speakers and Siri, priced like designer frames; Bloomberg expects an unveiling at WWDC 2027 and sales by the end of that year.',
      pl: 'Okulary bez wyświetlacza, z kamerami, głośnikami i Siri, w cenie markowych oprawek; Bloomberg spodziewa się pokazu na WWDC 2027 i sprzedaży pod koniec tego roku.',
    },
    sources: ['Bloomberg'],
  },
  // First half of 2027
  {
    id: 'macbook-pro-oled',
    name: 'MacBook Pro (OLED, touchscreen)',
    category: 'mac',
    thumbnail: 'macbook',
    expectedAt: '2027-H1',
    summary: {
      en: 'First OLED MacBook Pro with a touchscreen, a thinner body and a hole-punch camera; reports put it between late 2026 and early 2027 on M5 Pro and M5 Max, with an M7 redesign to follow.',
      pl: 'Pierwszy MacBook Pro z ekranem OLED i dotykiem, cieńszy, z kamerą w otworze zamiast wcięcia; raporty wskazują koniec 2026 lub początek 2027 na czipach M5 Pro i M5 Max, a potem przeprojektowany model z M7.',
    },
    sources: ['Bloomberg', 'DigiTimes', 'The Elec'],
  },
  {
    id: 'iphone-18',
    name: 'iPhone 18',
    category: 'iphone',
    thumbnail: 'iphone-island',
    expectedAt: '2027-H1',
    summary: {
      en: 'The standard model moves to spring as Apple splits the lineup between two launches; A20 chip and little else.',
      pl: 'Podstawowy model przechodzi na wiosnę po podziale linii na dwie premiery; czip A20 i niewiele więcej.',
    },
    sources: ['Bloomberg', 'Nikkei Asia', 'Ming-Chi Kuo'],
  },
  {
    id: 'iphone-18e',
    name: 'iPhone 18e',
    category: 'iphone',
    thumbnail: 'iphone-island',
    expectedAt: '2027-H1',
    summary: {
      en: 'Budget model on the A20 chip, following the spring cadence of the 16e and 17e.',
      pl: 'Budżetowy model z czipem A20, w rytmie wiosennych premier 16e i 17e.',
    },
    sources: ['Bloomberg', 'MacRumors'],
  },
  {
    id: 'iphone-air-2',
    name: 'iPhone Air 2',
    category: 'iphone',
    thumbnail: 'iphone-island',
    expectedAt: '2027-H1',
    summary: {
      en: 'A second rear camera, a bigger battery and the vapor chamber from the 17 Pro; pushed from 2026 after weak sales of the first Air.',
      pl: 'Drugi aparat z tyłu, większa bateria i komora parowa z 17 Pro; przesunięty z 2026 po słabej sprzedaży pierwszego Aira.',
    },
    sources: ['Bloomberg', 'Nikkei Asia', 'Ming-Chi Kuo'],
  },
  {
    id: 'ipad-12',
    name: 'iPad (12th generation)',
    category: 'ipad',
    thumbnail: 'ipad',
    expectedAt: '2027-H1',
    summary: {
      en: 'A19 chip, otherwise unchanged.',
      pl: 'Czip A19, poza tym bez zmian.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'macbook-air-m6',
    name: 'MacBook Air 13-inch and 15-inch (M6)',
    category: 'mac',
    thumbnail: 'macbook',
    expectedAt: '2027-H1',
    summary: {
      en: 'Chip refresh in the current design.',
      pl: 'Nowy czip w obecnej obudowie.',
    },
    sources: ['Bloomberg'],
  },
  // Second half of 2026
  {
    id: 'homepod-mini-2',
    name: 'HomePod mini (2nd generation)',
    category: 'home',
    thumbnail: 'homepod-mini',
    expectedAt: '2026-H2',
    summary: {
      en: 'N1 wireless chip with Wi-Fi 7, a newer S-series chip for the new Siri, better sound and a red color; said to be ready and waiting for the Siri overhaul.',
      pl: 'Czip N1 z Wi-Fi 7, nowszy czip z serii S pod nową Siri, lepszy dźwięk i czerwona wersja; podobno gotowy i czeka na przebudowaną Siri.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'apple-tv-2026',
    name: 'Apple TV 4K (2026)',
    category: 'home',
    thumbnail: 'apple-tv',
    expectedAt: '2026-H2',
    summary: {
      en: 'A17 Pro and the N1 wireless chip for the new Siri and Apple Intelligence, same box; a new Siri Remote is also rumored.',
      pl: 'A17 Pro i czip N1 pod nową Siri i Apple Intelligence, w tej samej obudowie; plotki mówią też o nowym pilocie Siri Remote.',
    },
    sources: ['Bloomberg'],
  },
  // October 2026
  {
    id: 'ipad-mini-8',
    name: 'iPad mini (OLED)',
    category: 'ipad',
    thumbnail: 'ipad',
    expectedAt: '2026-10',
    summary: {
      en: 'First OLED iPad mini at 8.4 inches, an A20-class chip, better water resistance and speakers that vibrate the display instead of using grilles.',
      pl: 'Pierwszy iPad mini z ekranem OLED 8,4 cala, czip klasy A20, lepsza wodoodporność i głośniki wprawiające w drgania ekran zamiast kratek.',
    },
    sources: ['Bloomberg', 'MacRumors'],
  },
  {
    id: 'macbook-pro-14-m6',
    name: 'MacBook Pro 14-inch (M6)',
    category: 'mac',
    thumbnail: 'macbook',
    expectedAt: '2026-10',
    summary: {
      en: 'Entry model with the 2 nm M6 in the current chassis; no M6 Pro or M6 Max is planned.',
      pl: 'Podstawowy model z M6 w 2 nm w obecnej obudowie; M6 Pro i M6 Max nie są planowane.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'imac-m6',
    name: 'iMac 24-inch (M6)',
    category: 'mac',
    thumbnail: 'imac',
    expectedAt: '2026-10',
    summary: {
      en: 'Chip refresh only, the design stays.',
      pl: 'Tylko nowy czip, wygląd bez zmian.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'home-hub',
    name: 'Home hub (HomePad)',
    category: 'home',
    thumbnail: 'home-hub',
    expectedAt: '2026-10',
    summary: {
      en: '7-inch display on a HomePod-style base or a wall mount, a camera for FaceTime and intercom, and the new Siri; expected between October 2026 and early 2027 at around $350.',
      pl: '7-calowy ekran na podstawie w stylu HomePoda albo na ścianie, kamera do FaceTime i interkomu oraz nowa Siri; spodziewany między październikiem 2026 a początkiem 2027, około 350 dolarów.',
    },
    sources: ['Bloomberg', 'MacRumors'],
  },
  // September 2026: the "Surprise and shine" event on 9 September
  {
    id: 'iphone-18-pro',
    name: 'iPhone 18 Pro / 18 Pro Max',
    category: 'iphone',
    thumbnail: 'iphone-island',
    expectedAt: '2026-09',
    summary: {
      en: 'A20 Pro built on a 2 nm process, Apple’s own C2 modem, a smaller Dynamic Island and a variable-aperture main camera; expected at the 9 September event.',
      pl: 'A20 Pro w procesie 2 nm, własny modem Apple C2, mniejsza Dynamic Island i główny aparat ze zmienną przysłoną; spodziewane na wydarzeniu 9 września.',
    },
    sources: ['Bloomberg', 'The Information', 'Ming-Chi Kuo'],
  },
  {
    id: 'iphone-fold',
    name: 'Foldable iPhone (iPhone Ultra or iPhone Fold)',
    category: 'iphone',
    thumbnail: 'iphone-fold',
    expectedAt: '2026-09',
    summary: {
      en: 'Book-style foldable with a 7.6 to 7.8-inch inner display, a 5.3-inch cover screen, Touch ID in the side button, a titanium frame and a price around $2,000.',
      pl: 'Składany model w stylu książki z ekranem wewnętrznym 7,6-7,8 cala, zewnętrznym 5,3 cala, Touch ID w przycisku bocznym, tytanową ramką i ceną około 2000 dolarów.',
    },
    sources: ['Bloomberg', 'The Information', 'Ming-Chi Kuo'],
  },
  {
    id: 'apple-watch-series-12',
    name: 'Apple Watch Series 12',
    category: 'watch',
    thumbnail: 'watch',
    expectedAt: '2026-09',
    summary: {
      en: 'First faster chip in years (S11), all-day heart-rate sampling and the return of ceramic cases in white and dark gray; no redesign.',
      pl: 'Pierwszy od lat szybszy czip (S11), całodniowy pomiar tętna i powrót kopert ceramicznych w bieli i ciemnej szarości; bez zmiany wyglądu.',
    },
    sources: ['Bloomberg', 'MacRumors'],
  },
  {
    id: 'apple-watch-ultra-4',
    name: 'Apple Watch Ultra 4',
    category: 'watch',
    thumbnail: 'watch',
    expectedAt: '2026-09',
    summary: {
      en: 'The same chip and health upgrades as the Series 12 in the unchanged Ultra case.',
      pl: 'Ten sam czip i nowości zdrowotne co w Series 12, w niezmienionej kopercie Ultra.',
    },
    sources: ['Bloomberg'],
  },
  {
    id: 'airpods-5',
    name: 'AirPods 5',
    category: 'audio',
    thumbnail: 'airpods',
    expectedAt: '2026-09',
    summary: {
      en: 'Two variants again, with and without active noise cancellation, on the H3 chip.',
      pl: 'Znów dwa warianty, z aktywną redukcją szumów i bez, na czipie H3.',
    },
    sources: ['Bloomberg'],
  },
];
