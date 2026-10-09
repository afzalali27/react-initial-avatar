import { describe, expect, it } from 'vitest';
import { DEFAULT_COLORS, contrastColor, contrastRatio, pickColor } from './colors';

describe('DEFAULT_COLORS', () => {
  it('has at least 12 entries, all readable with white text', () => {
    expect(DEFAULT_COLORS.length).toBeGreaterThanOrEqual(12);
    for (const color of DEFAULT_COLORS) {
      expect(contrastRatio(color, '#ffffff'), color).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('pickColor', () => {
  it('is deterministic and stays inside the palette', () => {
    const first = pickColor('Ada Lovelace');
    expect(pickColor('Ada Lovelace')).toBe(first);
    expect(DEFAULT_COLORS).toContain(first);
  });

  it('spreads different names across the palette', () => {
    const names = ['Ada', 'Grace', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Radia'];
    const picked = new Set(names.map((n) => pickColor(n)));
    expect(picked.size).toBeGreaterThan(3);
  });

  it('uses a custom palette', () => {
    expect(pickColor('anyone', ['#123456'])).toBe('#123456');
    expect(['#a', '#b']).toContain(pickColor('Ada', ['#a', '#b']));
  });

  it('falls back to the default palette when given an empty one', () => {
    expect(DEFAULT_COLORS).toContain(pickColor('Ada', []));
  });

  it('handles an empty seed', () => {
    expect(DEFAULT_COLORS).toContain(pickColor(''));
  });
});

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for identical colors', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#4F46E5', '#4f46e5')).toBeCloseTo(1, 5);
  });

  it('throws on unparseable colors', () => {
    expect(() => contrastRatio('aliceblue', '#fff')).toThrow(/aliceblue/);
  });
});

describe('contrastColor', () => {
  it('returns dark text on light backgrounds', () => {
    expect(contrastColor('#fff')).toBe('#111827');
    expect(contrastColor('#FFF')).toBe('#111827');
    expect(contrastColor('#ffff00')).toBe('#111827');
    expect(contrastColor('rgb(250, 250, 250)')).toBe('#111827');
    expect(contrastColor('rgb(250 250 250 / 0.5)')).toBe('#111827');
    expect(contrastColor('rgb(100%, 100%, 100%)')).toBe('#111827');
  });

  it('returns white text on dark backgrounds', () => {
    expect(contrastColor('#000')).toBe('#ffffff');
    expect(contrastColor('#4F46E5')).toBe('#ffffff');
    expect(contrastColor('#4F46E5CC')).toBe('#ffffff');
    expect(contrastColor('rgba(0, 0, 0, 0.9)')).toBe('#ffffff');
  });

  it('returns white for colors it cannot parse', () => {
    expect(contrastColor('aliceblue')).toBe('#ffffff');
    expect(contrastColor('hsl(0 0% 100%)')).toBe('#ffffff');
    expect(contrastColor('var(--brand)')).toBe('#ffffff');
  });
});
