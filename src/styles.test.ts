import { describe, expect, it } from 'vitest';
import { computeAvatarStyle, resolveRadius, toCssLength } from './styles';

const base = {
  size: 40,
  round: true,
  backgroundColor: '#4F46E5',
  color: '#ffffff',
  textSizeRatio: 2.5,
};

describe('toCssLength', () => {
  it('adds px to numbers and passes strings through', () => {
    expect(toCssLength(40)).toBe('40px');
    expect(toCssLength('2.5rem')).toBe('2.5rem');
  });
});

describe('resolveRadius', () => {
  it('maps round to a radius', () => {
    expect(resolveRadius(true)).toBe('50%');
    expect(resolveRadius(false)).toBe(0);
    expect(resolveRadius(8)).toBe('8px');
    expect(resolveRadius('30%')).toBe('30%');
  });

  it('lets borderRadius win over round, with numbers as px', () => {
    expect(resolveRadius(true, 50)).toBe('50px');
    expect(resolveRadius(false, '1em')).toBe('1em');
  });
});

describe('computeAvatarStyle', () => {
  it('includes the base layout styles', () => {
    const style = computeAvatarStyle(base);
    expect(style).toMatchObject({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      flexShrink: 0,
      overflow: 'hidden',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      fontFamily: 'inherit',
      fontWeight: 600,
      lineHeight: 1,
    });
  });

  it('sets width, height and font size from a numeric size', () => {
    expect(computeAvatarStyle(base)).toMatchObject({
      width: '40px',
      height: '40px',
      fontSize: '16px',
    });
  });

  it('uses calc() for a string size', () => {
    expect(computeAvatarStyle({ ...base, size: '2.5rem' })).toMatchObject({
      width: '2.5rem',
      height: '2.5rem',
      fontSize: 'calc(2.5rem / 2.5)',
    });
  });

  it('lets legacy height/width override size and bases font size on height', () => {
    expect(computeAvatarStyle({ ...base, height: 50, width: 70 })).toMatchObject({
      width: '70px',
      height: '50px',
      fontSize: '20px',
    });
  });

  it('honours textSizeRatio and falls back to 2.5 when it is not positive', () => {
    expect(computeAvatarStyle({ ...base, textSizeRatio: 2 }).fontSize).toBe('20px');
    expect(computeAvatarStyle({ ...base, textSizeRatio: 0 }).fontSize).toBe('16px');
    expect(computeAvatarStyle({ ...base, textSizeRatio: -1 }).fontSize).toBe('16px');
    expect(computeAvatarStyle({ ...base, textSizeRatio: Number.NaN }).fontSize).toBe('16px');
  });

  it('applies colors and radius', () => {
    expect(computeAvatarStyle(base)).toMatchObject({
      backgroundColor: '#4F46E5',
      color: '#ffffff',
      borderRadius: '50%',
    });
    expect(computeAvatarStyle({ ...base, round: false }).borderRadius).toBe(0);
    expect(computeAvatarStyle({ ...base, borderRadius: 8 }).borderRadius).toBe('8px');
  });

  it('adds no border by default', () => {
    const style = computeAvatarStyle(base);
    expect(style.borderWidth).toBeUndefined();
    expect(style.borderStyle).toBeUndefined();
    expect(style.borderColor).toBeUndefined();
  });

  it('adds a solid border that defaults to currentColor', () => {
    expect(computeAvatarStyle({ ...base, borderWidth: 2 })).toMatchObject({
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'currentColor',
    });
    expect(
      computeAvatarStyle({ ...base, borderWidth: '0.25em', borderColor: '#000' }),
    ).toMatchObject({ borderWidth: '0.25em', borderStyle: 'solid', borderColor: '#000' });
  });

  it('treats a zero border width as no border', () => {
    expect(computeAvatarStyle({ ...base, borderWidth: 0 }).borderStyle).toBeUndefined();
    expect(computeAvatarStyle({ ...base, borderWidth: '0' }).borderStyle).toBeUndefined();
  });

  it('lets the consumer style override everything', () => {
    const style = computeAvatarStyle({
      ...base,
      style: { backgroundColor: 'red', fontWeight: 400, width: '1px' },
    });
    expect(style).toMatchObject({ backgroundColor: 'red', fontWeight: 400, width: '1px' });
  });
});

describe('computeAvatarStyle with null inputs', () => {
  it('treats a null borderWidth as no border', () => {
    const style = computeAvatarStyle({ ...base, borderWidth: null });
    expect(style.borderWidth).toBeUndefined();
    expect(style.borderStyle).toBeUndefined();
  });

  it('treats null height/width as unset', () => {
    expect(computeAvatarStyle({ ...base, height: null, width: null })).toMatchObject({
      width: '40px',
      height: '40px',
    });
  });
});
