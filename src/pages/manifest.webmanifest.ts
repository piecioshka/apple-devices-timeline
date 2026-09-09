import type { APIRoute } from 'astro';
import { UI } from '@/i18n/ui';
import { withBase } from '@/lib/paths';

// Generated at build time so `start_url` and the icon paths follow `base`.
export const GET: APIRoute = () => {
  const manifest = {
    name: UI.en.siteTitle,
    short_name: 'Apple Timeline',
    description: UI.en.siteDescription,
    start_url: withBase('/'),
    display: 'browser',
    background_color: '#f3f4f6',
    theme_color: '#f3f4f6',
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
