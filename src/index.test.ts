import { describe, expect, it } from 'vitest';
import DefaultAvatar, * as pkg from './index';

describe('package exports', () => {
  it('exposes Avatar as both default and named export', () => {
    expect(pkg.Avatar).toBeDefined();
    expect(DefaultAvatar).toBe(pkg.Avatar);
  });

  it('exposes the helpers', () => {
    expect(typeof pkg.getInitials).toBe('function');
    expect(pkg.getInitials('Ada Lovelace')).toBe('AL');
    expect(pkg.DEFAULT_COLORS.length).toBeGreaterThan(0);
  });
});
