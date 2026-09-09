import { describe, expect, it } from 'vitest';
import { localePath, plural, stripLocale, UI } from './ui';

describe('plural', () => {
  it('picks English forms', () => {
    expect(plural('en', 1, UI.en.devices)).toBe('device');
    expect(plural('en', 0, UI.en.devices)).toBe('devices');
    expect(plural('en', 12, UI.en.devices)).toBe('devices');
  });

  it('picks Polish forms including the teens exception', () => {
    const cases: Array<[number, string]> = [
      [1, 'urządzenie'],
      [2, 'urządzenia'],
      [4, 'urządzenia'],
      [5, 'urządzeń'],
      [12, 'urządzeń'],
      [14, 'urządzeń'],
      [22, 'urządzenia'],
      [25, 'urządzeń'],
      [112, 'urządzeń'],
    ];
    for (const [count, form] of cases)
      expect(plural('pl', count, UI.pl.devices), String(count)).toBe(form);
  });
});

describe('localePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localePath('en', '/')).toBe('/');
    expect(localePath('en', '/mac')).toBe('/mac');
  });

  it('prefixes other locales', () => {
    expect(localePath('pl', '/')).toBe('/pl');
    expect(localePath('pl', '/mac')).toBe('/pl/mac');
  });
});

describe('stripLocale', () => {
  it('removes a locale prefix', () => {
    expect(stripLocale('/pl')).toBe('/');
    expect(stripLocale('/pl/mac')).toBe('/mac');
  });

  it('leaves default-locale paths alone', () => {
    expect(stripLocale('/')).toBe('/');
    expect(stripLocale('/mac')).toBe('/mac');
    expect(stripLocale('/plus')).toBe('/plus');
  });
});
