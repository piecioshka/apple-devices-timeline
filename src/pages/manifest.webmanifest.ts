import type { APIRoute } from 'astro';
import { UI } from '@/i18n/ui';
import { coverage } from '@/lib/coverage';
import { withBase } from '@/lib/paths';

// Generated at build time so `start_url` and the icon paths follow `base`.
export const GET: APIRoute = () => {
  const manifest = {
    name: UI.en.siteTitle,
    short_name: 'Apple Timeline',
    description: UI.en.siteDescription(coverage),
    start_url: withBase('/'),
    display: 'browser',
    background_color: '#eef1f5',
    theme_color: '#eef1f5',
    icons: [
      { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: withBase('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
