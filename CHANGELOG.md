# Changelog

## 2.0.0 — 2026-10-09

### Breaking

- `react` is now a peer dependency (`^17 || ^18 || ^19`) instead of being bundled into
  the package. React 16 is no longer supported.
- Default appearance changed: size `25px` → `40px`, square → circle, fixed
  aliceblue/cornflowerblue → a palette color picked from the name with white text.
- Initials are capped at two words by default (previously unlimited). Use
  `maxInitials={Infinity}` for the old behavior.
- `borderRadius` numbers are px, not percent. `borderRadius={50}` still renders as a circle
  for sizes up to 100px; prefer the new `round` prop.
- CSS class `.avatar` → `.react-initial-avatar` (image: `.react-initial-avatar__img`). The
  internal padding and `min-width: fit-content` are gone; `size` is the exact rendered box,
  border included.
- No stylesheet is emitted or injected; all styles are inline. Overrides of `.avatar` rules
  must move to `style` or `className`.
- `splitWith` default changed from `" "` to `/\s+/`.
- Base styling changed: font size is `size / 2.5` (was `height / 2`; pass `textSizeRatio={2}`
  to keep 1.x proportions), the root is `display: inline-flex` (was block-level `flex`),
  `font-weight: 600` (was `bold`), `line-height: 1` (was `1.5`). `height` without `width` now
  takes its width from `size` instead of `min-width: fit-content`.
- The package is `"type": "module"` with an `exports` map. Deep imports such as
  `react-initial-avatar/dist/esm/index.js` no longer resolve.
- The root entry is a client module (`'use client'`). Import `getInitials` and
  `DEFAULT_COLORS` from `react-initial-avatar/utils` in Server Components.

### Added

- `size`, `round`, `src` + `alt` with initials fallback, `initials`, `colors`,
  `maxInitials`, `textSizeRatio`, `fallback`, `className`, every `<span>` attribute, and a
  forwarded `ref`.
- Default export alongside the named export.
- `getInitials()` and `DEFAULT_COLORS` exports, from the root and from the directive-free
  `react-initial-avatar/utils` entry.
- Image fallback also catches requests that failed before hydration (e.g. SSR preloads).
- `name`, `initials`, `colors` and `aria-label` tolerate `null`/non-string values from
  JavaScript callers instead of throwing.
- Automatic text color by contrast with the background.
- `role="img"` and `aria-label`; a real `<img alt>` when `src` is used.
- Unicode-safe initials (accents, CJK, emoji, surrogate pairs).
- `'use client'` directive, source maps, ESM + CJS builds with `.d.ts` and `.d.cts`.
- Test suite, CI, tag-driven npm publishing with provenance, Storybook on GitHub Pages.

### Fixed

- All props are optional; `<Avatar name="…" />` type-checks.
- `0` values for `borderRadius`/`borderWidth` are respected instead of falling back.
- Every default is valid CSS.
- `width`/`height` produce the exact size requested.
- README import example matches the package exports.

## 1.1.0 and earlier

See the git history.
