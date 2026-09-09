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
