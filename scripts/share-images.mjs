// Renders the Open Graph images (1200x630) from the SVG templates in
// `assets/og/` into `public/og-<locale>.png`, filling in the year range from
// the dataset. Needs `rsvg-convert` (librsvg) on the PATH. Run with
// `npm run share-images`.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { devices } from '../src/data/devices.ts';
import { LOCALES } from '../src/i18n/ui.ts';

const years = devices.map((device) => Number(device.announcedAt.slice(0, 4)));
const first = Math.min(...years);
const last = Math.max(...years);
const images = [
  {
    template: 'assets/og/og-{locale}.svg',
    output: 'public/og-{locale}.png',
    width: 1200,
    height: 630,
  },
];

for (const locale of LOCALES) {
  const fields = {
    years: `${first}-${last}`,
    first,
    last,
  };
  for (const image of images) {
    const template = image.template.replace('{locale}', locale);
    const output = image.output.replace('{locale}', locale);
    const svg = readFileSync(template, 'utf8').replace(
      /\{\{(\w+)\}\}/g,
      (match, name) => {
        if (!(name in fields))
          throw new Error(`Unknown field ${match} in ${template}`);
        return String(fields[name]);
      },
    );
    execFileSync(
      'rsvg-convert',
      ['-w', String(image.width), '-h', String(image.height), '-o', output],
      { input: svg },
    );
    console.log(`${output} (${fields.years})`);
  }
}
