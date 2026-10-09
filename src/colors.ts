/** Default background palette. Every entry has ≥ 4.5:1 contrast against white text. */
export const DEFAULT_COLORS: readonly string[] = [
  '#E11D48', // rose
  '#DB2777', // pink
  '#A21CAF', // fuchsia
  '#9333EA', // purple
  '#7C3AED', // violet
  '#4F46E5', // indigo
  '#2563EB', // blue
  '#0369A1', // sky
  '#0F766E', // teal
  '#047857', // emerald
  '#4D7C0F', // lime
  '#B45309', // amber
  '#C2410C', // orange
  '#DC2626', // red
];

const DARK_TEXT = '#111827';
const LIGHT_TEXT = '#ffffff';

/** Deterministically pick a palette entry for `seed` (djb2 hash over code points). */
export function pickColor(seed: string, palette: readonly string[] = DEFAULT_COLORS): string {
  const colors = palette.length > 0 ? palette : DEFAULT_COLORS;
  let hash = 5381;
  for (const char of seed) {
    hash = ((hash << 5) + hash + (char.codePointAt(0) ?? 0)) >>> 0;
  }
  return colors[hash % colors.length] as string;
}

type RGB = [number, number, number];

function channel(raw: string): number {
  return raw.endsWith('%') ? (Number(raw.slice(0, -1)) / 100) * 255 : Number(raw);
}

/** Parse `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()` and `rgba()`. Alpha is ignored. */
function parseColor(color: string): RGB | null {
  const value = color.trim();

  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value);
  if (hex) {
    let digits = hex[1] as string;
    if (digits.length <= 4) {
      digits = digits
        .split('')
        .map((d) => d + d)
        .join('');
    }
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as RGB;
  }

  const rgb =
    /^rgba?\(\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/].*)?\)$/i.exec(value);
  if (rgb) {
    return [channel(rgb[1] as string), channel(rgb[2] as string), channel(rgb[3] as string)];
  }

  return null;
}

function luminance([r, g, b]: RGB): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function ratio(a: RGB, b: RGB): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la >= lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** WCAG contrast ratio between two colors. Throws if either cannot be parsed. */
export function contrastRatio(a: string, b: string): number {
  const ra = parseColor(a);
  const rb = parseColor(b);
  if (!ra) throw new Error(`Unparseable color: ${a}`);
  if (!rb) throw new Error(`Unparseable color: ${b}`);
  return ratio(ra, rb);
}

/**
 * Text color that reads best on `background`: `#111827` (near-black) or `#ffffff`.
 * Unparseable input (named colors, `hsl()`, CSS variables) returns white.
 */
export function contrastColor(background: string): string {
  const rgb = parseColor(background);
  if (!rgb) return LIGHT_TEXT;
  const vsDark = ratio(rgb, parseColor(DARK_TEXT) as RGB);
  const vsLight = ratio(rgb, parseColor(LIGHT_TEXT) as RGB);
  return vsDark > vsLight ? DARK_TEXT : LIGHT_TEXT;
}
