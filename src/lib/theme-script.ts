import { createHash } from 'node:crypto';

/**
 * Applies a stored theme before first paint to avoid a flash. Inlined into
 * <head>, so the layout registers its hash with the Content Security Policy.
 */
export const THEME_SCRIPT = `try {
  var theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.dataset.theme = theme;
  }
} catch (_) {}`;

/** CSP source expression ("sha256-...") for an inline script or style. */
export function cspHash(content: string): `sha256-${string}` {
  return `sha256-${createHash('sha256').update(content).digest('base64')}`;
}
