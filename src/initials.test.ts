import { afterEach, describe, expect, it, vi } from 'vitest';
import { getInitials } from './initials';

describe('getInitials', () => {
  it('takes the first two words by default and uppercases them', () => {
    expect(getInitials('Elizabeth Smith Brown')).toBe('ES');
    expect(getInitials('john doe')).toBe('JD');
  });

  it('returns a single letter for a single word', () => {
    expect(getInitials('afzal')).toBe('A');
  });

  it('respects maxInitials', () => {
    expect(getInitials('Elizabeth Smith Brown', { maxInitials: 1 })).toBe('E');
    expect(getInitials('Elizabeth Smith Brown', { maxInitials: 3 })).toBe('ESB');
    expect(getInitials('Elizabeth Smith Brown', { maxInitials: Infinity })).toBe('ESB');
  });

  it('treats maxInitials below 1 or NaN as 1', () => {
    expect(getInitials('John Doe', { maxInitials: 0 })).toBe('J');
    expect(getInitials('John Doe', { maxInitials: -5 })).toBe('J');
    expect(getInitials('John Doe', { maxInitials: Number.NaN })).toBe('J');
  });

  it('splits on a custom string or RegExp', () => {
    expect(getInitials('john.ronald.tolkien', { splitWith: '.', maxInitials: 3 })).toBe('JRT');
    expect(getInitials('mary-jane watson', { splitWith: /[\s-]+/, maxInitials: 3 })).toBe('MJW');
  });

  it('ignores surrounding and repeated whitespace', () => {
    expect(getInitials('  John \t\n  Doe  ')).toBe('JD');
  });

  it('returns an empty string for blank input', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });

  it('returns an empty string when the name is only delimiters', () => {
    expect(getInitials('---', { splitWith: '-' })).toBe('');
  });

  it('does not throw on non-string input from JavaScript callers', () => {
    expect(getInitials(undefined as unknown as string)).toBe('');
    expect(getInitials(null as unknown as string)).toBe('');
    expect(getInitials(42 as unknown as string)).toBe('4');
  });

  it('uppercases with locale rules', () => {
    expect(getInitials('élodie dupont')).toBe('ÉD');
  });

  it('does not split surrogate pairs', () => {
    expect(getInitials('𝒜lpha Beta')).toBe('𝒜B');
  });

  it('keeps emoji ZWJ sequences intact', () => {
    expect(getInitials('👩‍💻 Dev')).toBe('👩‍💻D');
  });

  describe('without Intl.Segmenter', () => {
    const original = Intl.Segmenter;
    const setSegmenter = (value: typeof Intl.Segmenter | undefined) => {
      Object.defineProperty(Intl, 'Segmenter', { value, configurable: true, writable: true });
    };

    afterEach(() => {
      setSegmenter(original);
      vi.resetModules();
    });

    it('falls back to code-point splitting', async () => {
      setSegmenter(undefined);
      vi.resetModules();
      const { getInitials: fallback } = await import('./initials');
      expect(fallback('𝒜lpha Beta')).toBe('𝒜B');
      expect(fallback('élodie dupont')).toBe('ÉD');
    });
  });
});

describe('getInitials with loose inputs (no casts needed)', () => {
  it('accepts null and undefined names in its signature', () => {
    expect(getInitials(undefined)).toBe('');
    expect(getInitials(null)).toBe('');
  });

  it('treats null options as unset', () => {
    expect(getInitials('Elizabeth Smith Brown', { maxInitials: null, splitWith: null })).toBe('ES');
  });
});
