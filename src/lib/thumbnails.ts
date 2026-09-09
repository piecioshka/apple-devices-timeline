// Hand-drawn product pictograms. Every icon shares a 48x48 canvas, a 2.5px
// stroke in the current text color, and marks one defining detail with the
// `accent` class (home button, notch, Digital Crown, pencil tip...).

const THUMBNAILS = {
  'iphone-home': `<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M21 8h6"/><circle class="accent" cx="24" cy="39" r="2.2"/>`,
  'iphone-notch': `<rect x="13" y="4" width="22" height="40" rx="5"/><path class="accent fill" d="M18 4h12v2.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"/>`,
  'iphone-island': `<rect x="13" y="4" width="22" height="40" rx="5"/><rect class="accent fill" x="19.5" y="8" width="9" height="3.5" rx="1.75"/>`,
  'ipad-home': `<rect x="9" y="5" width="30" height="38" rx="3"/><circle cx="24" cy="8.5" r="1"/><circle class="accent" cx="24" cy="39.5" r="1.8"/>`,
  ipad: `<rect x="9" y="4" width="30" height="40" rx="4"/><rect x="12.5" y="9" width="23" height="30" rx="1"/><circle class="accent fill" cx="24" cy="6.5" r="1"/>`,
  macbook: `<rect x="9" y="9" width="30" height="22" rx="2"/><path d="M4 33h40v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path class="accent" d="M20 33h8"/>`,
  imac: `<rect x="6" y="7" width="36" height="27" rx="2"/><path d="M6 28h36"/><path d="M24 34v6M15 40h18"/><circle class="accent fill" cx="24" cy="10" r="1"/>`,
  'mac-mini': `<rect x="8" y="17" width="32" height="14" rx="3"/><circle class="accent fill" cx="12.5" cy="28" r="1"/>`,
  'mac-studio': `<rect x="10" y="10" width="28" height="26" rx="3"/><path d="M10 17h28"/><circle class="accent fill" cx="16" cy="30" r="1.2"/><circle cx="21" cy="30" r="1.2"/>`,
  'mac-pro': `<rect x="12" y="6" width="24" height="36" rx="3"/><circle cx="18.5" cy="14" r="1.6"/><circle cx="24" cy="14" r="1.6"/><circle cx="29.5" cy="14" r="1.6"/><circle cx="18.5" cy="21" r="1.6"/><circle class="accent" cx="24" cy="21" r="1.6"/><circle cx="29.5" cy="21" r="1.6"/><circle cx="18.5" cy="28" r="1.6"/><circle cx="24" cy="28" r="1.6"/><circle cx="29.5" cy="28" r="1.6"/>`,
  'mac-pro-cylinder': `<path d="M15 12v24a9 9 0 0 0 18 0V12"/><ellipse cx="24" cy="12" rx="9" ry="3.5"/><ellipse class="accent" cx="24" cy="12" rx="4" ry="1.5"/>`,
  xserve: `<rect x="4" y="18" width="40" height="12" rx="2"/><path d="M10 22v4M15 22v4M20 22v4"/><circle class="accent fill" cx="38" cy="24" r="1.3"/>`,
  airport: `<rect x="9" y="22" width="30" height="14" rx="3"/><path d="M14 15a14 14 0 0 1 20 0"/><path class="accent" d="M19 19.5a7 7 0 0 1 10 0"/>`,
  'airport-express': `<rect x="14" y="12" width="20" height="20" rx="4"/><path d="M20 32v7M28 32v7"/><path class="accent" d="M19.5 22a6 6 0 0 1 9 0"/>`,
  watch: `<rect x="14" y="12" width="20" height="24" rx="5"/><path d="M18 12V6h12v6M18 36v6h12v-6"/><rect class="accent fill" x="34" y="19" width="3" height="6" rx="1.5"/>`,
  airpods: `<circle cx="17" cy="16" r="5"/><path d="M18.5 21v11" stroke-width="4"/><circle cx="31" cy="16" r="5"/><path d="M29.5 21v11" stroke-width="4"/><path class="accent" d="M14 38h20"/>`,
  'airpods-max': `<path d="M10 28V24a14 14 0 0 1 28 0v4"/><rect x="7" y="25" width="8" height="13" rx="3"/><rect x="33" y="25" width="8" height="13" rx="3"/><path class="accent" d="M15 31h2M31 31h2"/>`,
  homepod: `<rect x="14" y="8" width="20" height="32" rx="8"/><path d="M18 20h12M18 26h12M18 32h12" stroke-dasharray="1.5 2.5"/><ellipse class="accent" cx="24" cy="12.5" rx="4" ry="1.6"/>`,
  'homepod-mini': `<path d="M15.7 16A13 13 0 1 0 32.3 16Z"/><path class="accent" d="M21 16h6"/>`,
  'apple-tv': `<rect x="10" y="17" width="28" height="15" rx="3"/><circle class="accent fill" cx="15" cy="27.5" r="1.2"/><path d="M40 12v22" stroke-width="3"/>`,
  airtag: `<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="6.5"/><circle class="accent fill" cx="24" cy="24" r="1.5"/>`,
  pencil: `<path d="M13 35L31 17" stroke-width="7"/><path d="M11 37l1.5-4" stroke-width="2"/><path class="accent" d="M31 17l4-4" stroke-width="3"/>`,
  display: `<rect x="6" y="8" width="36" height="24" rx="2"/><path d="M24 32v6M14 40h20"/><circle class="accent fill" cx="24" cy="11" r="1"/>`,
  vision: `<rect x="6" y="16" width="36" height="16" rx="8"/><path d="M6 24H2M42 24h4"/><path class="accent" d="M24 20v8"/>`,
  'ipod-classic': `<rect x="14" y="4" width="20" height="40" rx="3"/><rect x="17.5" y="8" width="13" height="10" rx="1"/><circle cx="24" cy="31" r="7"/><circle class="accent fill" cx="24" cy="31" r="2"/>`,
  'ipod-nano': `<rect x="16" y="6" width="16" height="36" rx="3"/><rect x="19" y="10" width="10" height="12" rx="1"/><circle cx="24" cy="32" r="5"/><circle class="accent fill" cx="24" cy="32" r="1.5"/>`,
  'ipod-shuffle': `<rect x="14" y="14" width="20" height="20" rx="3"/><circle cx="24" cy="24" r="6"/><circle class="accent fill" cx="24" cy="24" r="1.5"/>`,
  // Rumored form factors (see `src/data/rumors.ts`).
  'iphone-fold': `<path d="M22 6H10a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h12"/><path d="M26 6h12a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H26"/><path class="accent" d="M24 6v36"/>`,
  'home-hub': `<rect x="8" y="7" width="32" height="22" rx="3"/><path d="M13 41a11 11 0 0 1 22 0"/><path d="M10 41h28"/><circle class="accent fill" cx="24" cy="10.5" r="1"/>`,
  glasses: `<rect x="5" y="19" width="16" height="12" rx="5"/><rect x="27" y="19" width="16" height="12" rx="5"/><path d="M21 24h6"/><path d="M5 22l-3-3M43 22l3-3"/><circle class="accent fill" cx="9" cy="16" r="1.4"/>`,
  robot: `<rect x="18" y="5" width="23" height="16" rx="2"/><path d="M29.5 21v5l-10 9"/><rect x="8" y="35" width="24" height="7" rx="3.5"/><circle class="accent fill" cx="29.5" cy="26" r="1.6"/>`,
} as const;

export type ThumbnailKey = keyof typeof THUMBNAILS;

export function isThumbnailKey(value: string): value is ThumbnailKey {
  return Object.hasOwn(THUMBNAILS, value);
}

export function thumbnailMarkup(key: ThumbnailKey): string {
  return THUMBNAILS[key];
}
