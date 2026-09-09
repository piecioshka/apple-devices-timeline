/**
 * Public URL path of a page. With `build.format: 'file'` Astro reports
 * pathnames such as "/pl/mac.html" or "/index.html" at build time, while the
 * site serves "/pl/mac" and "/" (`trailingSlash: 'never'`).
 */
export function publicPath(pathname: string): string {
  let path = pathname.replace(/\/index\.html$/, '/');
  path = path.replace(/\.html$/, '');
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}

/**
 * Prefixes a site-relative path with the base path the site is served from
 * ("/" or, on GitHub Pages, "/<repo>"). The home page keeps a trailing slash
 * under a base, so it hits the directory index without a redirect.
 */
export function joinBase(base: string, path: string): string {
  const prefix = base.replace(/\/+$/, '');
  if (!prefix) return path;
  return path === '/' ? `${prefix}/` : `${prefix}${path}`;
}

/** Inverse of `joinBase`: the site-relative path of a served pathname. */
export function stripBase(base: string, pathname: string): string {
  const prefix = base.replace(/\/+$/, '');
  if (!prefix) return pathname;
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

/** `joinBase` with the configured `base` (astro.config.mjs). */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}

/** `stripBase` with the configured `base` (astro.config.mjs). */
export function withoutBase(pathname: string): string {
  return stripBase(import.meta.env.BASE_URL, pathname);
}
