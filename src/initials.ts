export interface GetInitialsOptions {
  /** Maximum number of words to take initials from. Default `2`. Use `Infinity` for all words. */
  maxInitials?: number;
  /** Delimiter between words. Default: any run of whitespace. */
  splitWith?: string | RegExp;
}

let segmenter: Intl.Segmenter | null | undefined;

/** First grapheme cluster of `text` (so emoji and combined characters are not split). */
function firstGrapheme(text: string): string {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : null;
  }
  if (segmenter) {
    const first = segmenter.segment(text)[Symbol.iterator]().next();
    return first.done ? '' : first.value.segment;
  }
  return Array.from(text)[0] ?? '';
}

/**
 * Derive uppercase initials from a name.
 *
 * `getInitials('Elizabeth Smith Brown')` → `'ES'`
 * `getInitials('Elizabeth Smith Brown', { maxInitials: Infinity })` → `'ESB'`
 */
export function getInitials(name: string, options: GetInitialsOptions = {}): string {
  const { maxInitials = 2, splitWith = /\s+/ } = options;
  const trimmed = String(name ?? '').trim();
  if (!trimmed) return '';

  const limit = Number.isNaN(maxInitials) ? 1 : Math.max(1, Math.floor(maxInitials));
  const words = trimmed.split(splitWith).filter(Boolean).slice(0, limit);

  return words.map(firstGrapheme).join('').toLocaleUpperCase();
}
