import type { CSSProperties } from 'react';

export type CssLength = number | string;
export type Round = boolean | number | string;

/** `null` on any optional field means "unset", same as `undefined`. */
export interface AvatarStyleInput {
  size: CssLength;
  height?: CssLength | null | undefined;
  width?: CssLength | null | undefined;
  round: Round;
  borderRadius?: CssLength | null | undefined;
  backgroundColor: string;
  color: string;
  textSizeRatio: number;
  borderWidth?: CssLength | null | undefined;
  borderColor?: string | null | undefined;
  style?: CSSProperties | null | undefined;
}

export const DEFAULT_TEXT_SIZE_RATIO = 2.5;

const BASE_STYLE: CSSProperties = {
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
};

export const IMAGE_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

/** Numbers become px; strings are used as-is. */
export const toCssLength = (value: CssLength): string =>
  typeof value === 'number' ? `${value}px` : value;

/** `borderRadius` (legacy) wins; otherwise map `round` to a radius. */
export function resolveRadius(round: Round, borderRadius?: CssLength | null): string | number {
  if (borderRadius != null) return toCssLength(borderRadius);
  if (round === true) return '50%';
  if (round === false) return 0;
  return toCssLength(round);
}

/** Inline style for the root element. Precedence: base → props → consumer `style`. */
export function computeAvatarStyle(input: AvatarStyleInput): CSSProperties {
  const height = input.height ?? input.size;
  const width = input.width ?? input.size;
  const ratio =
    Number.isFinite(input.textSizeRatio) && input.textSizeRatio > 0
      ? input.textSizeRatio
      : DEFAULT_TEXT_SIZE_RATIO;
  const { borderWidth } = input;
  const hasBorder = borderWidth != null && borderWidth !== 0 && borderWidth !== '0';

  return {
    ...BASE_STYLE,
    width: toCssLength(width),
    height: toCssLength(height),
    fontSize: typeof height === 'number' ? `${height / ratio}px` : `calc(${height} / ${ratio})`,
    borderRadius: resolveRadius(input.round, input.borderRadius),
    backgroundColor: input.backgroundColor,
    color: input.color,
    ...(hasBorder
      ? {
          borderWidth: toCssLength(borderWidth),
          borderStyle: 'solid',
          borderColor: input.borderColor ?? 'currentColor',
        }
      : {}),
    ...input.style,
  };
}
