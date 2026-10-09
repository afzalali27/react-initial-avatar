import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { contrastColor, DEFAULT_COLORS, pickColor } from './colors';
import { getInitials } from './initials';
import {
  computeAvatarStyle,
  DEFAULT_TEXT_SIZE_RATIO,
  IMAGE_STYLE,
  type CssLength,
  type Round,
} from './styles';

const DEFAULT_SIZE = 40;

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'children'> {
  /** Name to derive initials from. Also seeds the automatic color and the accessible label. */
  name?: string;
  /** Explicit initials, rendered as given. Skips derivation from `name`. */
  initials?: string;
  /** Image URL. If it fails to load, the initials are shown instead. */
  src?: string;
  /** Alt text for the image. Defaults to `name`. */
  alt?: string;
  /** Width and height. Numbers are px; strings are any CSS length. Default `40`. */
  size?: CssLength;
  /** `true` → circle, `false` → square, number → px radius, string → raw CSS. Default `true`. */
  round?: Round;
  /** Background color. Defaults to a palette color picked from `name`. */
  backgroundColor?: string;
  /** Text color. Defaults to black or white, whichever contrasts more with the background. */
  color?: string;
  /** Palette used for the automatic background. Default `DEFAULT_COLORS`. */
  colors?: readonly string[];
  /** Maximum number of words used for initials. Default `2`. `Infinity` for all. */
  maxInitials?: number;
  /** Word delimiter for `name`. Default: any whitespace. */
  splitWith?: string | RegExp;
  /** `fontSize = size / textSizeRatio`. Default `2.5`. */
  textSizeRatio?: number;
  /** Border width. Numbers are px. No border by default. */
  borderWidth?: CssLength;
  /** Border color. Defaults to the text color. */
  borderColor?: string;
  /** Rendered when there are no initials (blank `name`, no `initials`). Default `'?'`. */
  fallback?: ReactNode;
  /** @deprecated Use `size`. Overrides the height. */
  height?: CssLength;
  /** @deprecated Use `size`. Overrides the width. */
  width?: CssLength;
  /** @deprecated Use `round`. Numbers are px. Overrides `round`. */
  borderRadius?: CssLength;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    name = '',
    initials,
    src,
    alt,
    size,
    round,
    backgroundColor,
    color,
    colors,
    maxInitials,
    splitWith,
    textSizeRatio = DEFAULT_TEXT_SIZE_RATIO,
    borderWidth,
    borderColor,
    fallback = '?',
    height,
    width,
    borderRadius,
    className,
    style,
    role,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  // A request that errored before hydration never reaches the <img>'s onError (React does
  // not replay error events), so probe the URL once on the client as well.
  useEffect(() => {
    if (!showImage || !src || typeof Image === 'undefined') return undefined;
    let active = true;
    const probe = new Image();
    probe.onerror = () => {
      if (active) setFailedSrc(src);
    };
    probe.src = src;
    return () => {
      active = false;
      probe.onerror = null;
    };
  }, [showImage, src]);

  // JavaScript consumers pass whatever their API returned; never let a null crash the tree.
  const safeName = name == null ? '' : String(name);
  const text =
    initials == null ? getInitials(safeName, { maxInitials, splitWith }) : String(initials);
  const background = backgroundColor ?? pickColor(safeName || text, colors ?? DEFAULT_COLORS);
  const label = String(ariaLabel ?? safeName);
  const hasLabel = label.trim().length > 0;

  const computedStyle = computeAvatarStyle({
    size: size ?? DEFAULT_SIZE,
    height,
    width,
    round: round ?? true,
    borderRadius,
    backgroundColor: background,
    color: color ?? contrastColor(background),
    textSizeRatio,
    borderWidth,
    borderColor,
    style,
  });

  return (
    <span
      ref={ref}
      className={className ? `react-initial-avatar ${className}` : 'react-initial-avatar'}
      style={computedStyle}
      role={showImage ? role : (role ?? (hasLabel ? 'img' : undefined))}
      aria-label={!showImage && hasLabel ? label : undefined}
      {...rest}
    >
      {showImage ? (
        <img
          className="react-initial-avatar__img"
          src={src}
          alt={alt ?? ariaLabel ?? safeName}
          style={IMAGE_STYLE}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        text || fallback
      )}
    </span>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
