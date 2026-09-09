import { describe, expect, it } from 'vitest';
import { cspHash, THEME_SCRIPT } from './theme-script';

describe('cspHash', () => {
  it('produces a base64 SHA-256 source expression', () => {
    // echo -n 'alert(1)' | openssl dgst -sha256 -binary | base64
    expect(cspHash('alert(1)')).toBe(
      'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI=',
    );
  });
});

describe('THEME_SCRIPT', () => {
  it('is plain ES5 so it can run before any bundle', () => {
    expect(THEME_SCRIPT).not.toMatch(/\b(const|let|=>)\b/);
    expect(() => new Function(THEME_SCRIPT)).not.toThrow();
  });
});
