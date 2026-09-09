// Where the tested build claims to live. The values match the `SITE_URL` and
// `BASE_PATH` environment variables passed to `astro build`.
export const SITE_URL = process.env.SITE_URL ?? 'https://example.com';
const BASE_PATH = (process.env.BASE_PATH ?? '').replace(/\/+$/, '');

/** Served path of a page or asset, under `BASE_PATH` when set. */
export function url(path: string): string {
  if (!BASE_PATH) return path;
  return path === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

/** Absolute URL as it appears in canonical, `hreflang`, sitemap and robots. */
export function absolute(path: string): string {
  return `${SITE_URL}${url(path)}`;
}
