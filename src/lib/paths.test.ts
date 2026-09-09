import { describe, expect, it } from 'vitest';
import { publicPath } from './paths';

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
