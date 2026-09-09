import { describe, expect, it } from 'vitest';
import { joinBase, publicPath, stripBase } from './paths';

describe('publicPath', () => {
  it('maps build-time file names to served paths', () => {
    expect(publicPath('/index.html')).toBe('/');
    expect(publicPath('/pl/index.html')).toBe('/pl');
    expect(publicPath('/mac.html')).toBe('/mac');
    expect(publicPath('/pl/mac.html')).toBe('/pl/mac');
  });

  it('leaves served paths unchanged', () => {
    expect(publicPath('/')).toBe('/');
    expect(publicPath('/pl')).toBe('/pl');
    expect(publicPath('/pl/mac')).toBe('/pl/mac');
    expect(publicPath('/pl/')).toBe('/pl');
  });
});

describe('joinBase', () => {
  it('leaves paths alone without a base', () => {
    expect(joinBase('/', '/')).toBe('/');
    expect(joinBase('/', '/pl/mac')).toBe('/pl/mac');
    expect(joinBase('', '/favicon.svg')).toBe('/favicon.svg');
  });

  it('prefixes paths with the base, with or without its trailing slash', () => {
    expect(joinBase('/repo', '/pl/mac')).toBe('/repo/pl/mac');
    expect(joinBase('/repo/', '/pl/mac')).toBe('/repo/pl/mac');
    expect(joinBase('/repo', '/favicon.svg')).toBe('/repo/favicon.svg');
  });

  it('keeps a trailing slash on the home page under a base', () => {
    expect(joinBase('/repo', '/')).toBe('/repo/');
    expect(joinBase('/repo/', '/')).toBe('/repo/');
  });
});

describe('stripBase', () => {
  it('leaves pathnames alone without a base', () => {
    expect(stripBase('/', '/pl/mac.html')).toBe('/pl/mac.html');
    expect(stripBase('', '/')).toBe('/');
  });

  it('removes the base from served pathnames', () => {
    expect(stripBase('/repo', '/repo/pl/mac.html')).toBe('/pl/mac.html');
    expect(stripBase('/repo/', '/repo/index.html')).toBe('/index.html');
    expect(stripBase('/repo', '/repo/')).toBe('/');
    expect(stripBase('/repo', '/repo')).toBe('/');
  });

  it('does not touch pathnames outside the base', () => {
    expect(stripBase('/repo', '/repository/x')).toBe('/repository/x');
    expect(stripBase('/repo', '/other')).toBe('/other');
  });
});
