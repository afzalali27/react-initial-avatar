import { describe, expect, it } from 'vitest';
import * as utils from './utils';
import { DEFAULT_COLORS } from './colors';
import { getInitials } from './initials';

describe('utils entry (server-safe, no React)', () => {
  it('exports exactly the framework-free helpers', () => {
    expect(Object.keys(utils).sort()).toEqual(['DEFAULT_COLORS', 'getInitials']);
    expect(utils.getInitials).toBe(getInitials);
    expect(utils.DEFAULT_COLORS).toBe(DEFAULT_COLORS);
  });
});
