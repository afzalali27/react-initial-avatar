# react-initial-avatar

Tiny, zero-dependency React avatar. Initials from a name, automatic colors, an image with
initials fallback, and nothing to configure.

[![npm version](https://img.shields.io/npm/v/react-initial-avatar.svg)](https://www.npmjs.com/package/react-initial-avatar)
[![npm downloads](https://img.shields.io/npm/dm/react-initial-avatar.svg)](https://www.npmjs.com/package/react-initial-avatar)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-initial-avatar)](https://bundlephobia.com/package/react-initial-avatar)
[![CI](https://github.com/afzalali27/react-initial-avatar/actions/workflows/ci.yml/badge.svg)](https://github.com/afzalali27/react-initial-avatar/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-initial-avatar.svg)](LICENSE)

**[Live demo and playground →](https://afzalali27.github.io/react-initial-avatar/)**

## Install

```bash
npm install react-initial-avatar
```

React 17, 18 and 19 are supported as peer dependencies.

## Quick start

```jsx
import Avatar from 'react-initial-avatar';

<Avatar name="Elizabeth Smith Brown" />;
// → a 40px circle with "ES" on a color picked from the name
```

## Features

- Initials from any name — Unicode-aware, so accents, CJK and emoji are not split.
- Deterministic colors: the same name always gets the same background; text color is chosen
  for contrast automatically.
- `src` with graceful fallback: a broken or missing image shows the initials instead.
- Any size, any shape, optional border — all via props.
- Inline styles only. No stylesheet to import, no CSS injection, works in Next.js App Router
  and other server-rendering setups.
- Accessible: `role="img"` with an `aria-label`, or a real `<img alt>` when you pass `src`.
- Fully typed. Forwards `ref` and every `<span>` attribute.
- Under 2 kB min+gzip, zero dependencies.

## Props

| Prop              | Type                          | Default                   | Description                                                                       |
| ----------------- | ----------------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| `name`            | `string`                      | `""`                      | Name to derive initials from. Also seeds the color and the accessible label.      |
| `initials`        | `string`                      | —                         | Explicit initials, rendered as given. Skips derivation from `name`.               |
| `src`             | `string`                      | —                         | Image URL. If it fails to load, initials are shown instead. A new `src` retries.  |
| `alt`             | `string`                      | `aria-label`, then `name` | Alt text for the image.                                                           |
| `size`            | `number \| string`            | `40`                      | Width and height. Numbers are px; strings are any CSS length (`"2.5rem"`).        |
| `round`           | `boolean \| number \| string` | `true`                    | `true` circle, `false` square, number → px radius, string → raw CSS value.        |
| `backgroundColor` | `string`                      | auto from `colors`        | Any CSS color.                                                                    |
| `color`           | `string`                      | auto contrast             | Text color. Defaults to black or white, whichever reads better on the background. |
| `colors`          | `string[]`                    | `DEFAULT_COLORS`          | Palette for the automatic background.                                             |
| `maxInitials`     | `number`                      | `2`                       | Number of words used. `Infinity` for all.                                         |
| `splitWith`       | `string \| RegExp`            | `/\s+/`                   | Word delimiter for `name`.                                                        |
| `textSizeRatio`   | `number`                      | `2.5`                     | `fontSize = size / textSizeRatio`.                                                |
| `borderWidth`     | `number \| string`            | `0`                       | Numbers are px.                                                                   |
| `borderColor`     | `string`                      | `"currentColor"`          | Defaults to the text color.                                                       |
| `fallback`        | `ReactNode`                   | `"?"`                     | Shown when there are no initials (blank `name`, no `initials`).                   |
| `className`       | `string`                      | —                         | Appended after the built-in `react-initial-avatar` class.                         |
| `style`           | `CSSProperties`               | —                         | Merged last, so it overrides everything computed.                                 |
| `ref`             | `Ref<HTMLSpanElement>`        | —                         | Forwarded to the root `<span>`.                                                   |
| `height`, `width` | `number \| string`            | —                         | Legacy. Override `size` per axis.                                                 |
| `borderRadius`    | `number \| string`            | —                         | Legacy. Numbers are px. Overrides `round`.                                        |

Every other `<span>` attribute (`title`, `onClick`, `data-*`, `aria-*`, …) is passed through.

## Examples

### Automatic colors

```jsx
<Avatar name="Ada Lovelace" />
<Avatar name="Grace Hopper" />
<Avatar name="Linus Torvalds" />
```

Each name hashes to a fixed entry of a 14-color palette, so the same user always gets the
same color across pages and sessions.

### Image with initials fallback

```jsx
<Avatar name="Jane Doe" src={user.photoUrl} size={64} />
```

While the image loads the colored background shows; if the request fails the initials take
over. Passing `src=""` or `undefined` renders initials directly.

### Sizes and shapes

```jsx
<Avatar name="Ada Lovelace" size={24} />
<Avatar name="Ada Lovelace" size="3rem" />
<Avatar name="Ada Lovelace" round={false} />
<Avatar name="Ada Lovelace" round={8} />
```

### Borders

```jsx
<Avatar name="Ada Lovelace" borderWidth={2} />
<Avatar name="Ada Lovelace" borderWidth={3} borderColor="#fff" style={{ boxShadow: '0 0 0 2px #4F46E5' }} />
```

### Your own palette or fixed colors

```jsx
<Avatar name="Ada Lovelace" colors={['#0f172a', '#1e293b', '#334155']} />
<Avatar name="Ada Lovelace" backgroundColor="#fde68a" />          // text turns dark automatically
<Avatar name="Ada Lovelace" backgroundColor="aliceblue" color="#1e3a8a" />  // named colors: pass `color` too
```

Contrast detection parses hex and `rgb()` values. For named colors, `hsl()` or CSS variables,
set `color` explicitly.

### Custom initials and delimiters

```jsx
<Avatar name="Elizabeth Smith Brown" maxInitials={3} />      // ESB
<Avatar name="Elizabeth Smith Brown" initials="EB" />         // EB
<Avatar name="john.doe" splitWith="." />                      // JD
<Avatar name="" fallback={<UserIcon />} />
```

### Clickable, with a tooltip and a ref

```jsx
const ref = useRef(null);

<Avatar
  ref={ref}
  name="Ada Lovelace"
  title="Ada Lovelace"
  onClick={openProfile}
  style={{ cursor: 'pointer' }}
/>;
```

## Utilities

```ts
import { getInitials, DEFAULT_COLORS } from 'react-initial-avatar/utils';

getInitials('Elizabeth Smith Brown'); // 'ES'
getInitials('Elizabeth Smith Brown', { maxInitials: Infinity }); // 'ESB'
getInitials('john.doe', { splitWith: '.' }); // 'JD'

DEFAULT_COLORS; // ['#E11D48', '#DB2777', …]
```

The same two helpers are also exported from the package root for convenience. Prefer
`react-initial-avatar/utils` in Server Components, route handlers and plain Node: the root
entry is a client module (see below), so calling a function imported from it on the server
throws in Next.js.

## Server rendering

The component renders on the server with no browser APIs. The root entry starts with
`'use client'`, so `<Avatar>` can be imported and rendered directly from a React Server
Component in Next.js; its image fallback and `ref` work after hydration. For the helpers,
import from `react-initial-avatar/utils`, which has no directive.

Initials are computed with `Intl.Segmenter` when the runtime has it (Node 16+, all current
browsers) and by code point otherwise. The only inputs where those differ are multi-codepoint
graphemes such as emoji sequences or decomposed accents; on a browser without `Intl.Segmenter`
that can produce a hydration text mismatch for such names. Pass `initials` explicitly if you
need identical output everywhere.

## Migrating from 1.x

2.0 keeps every 1.x prop working but changes the defaults, one unit, and some base styling.

| 1.x behavior                                                    | 2.x behavior                                    | What to do                                                       |
| --------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| React bundled inside the package                                | `react` is a peer dependency (17, 18 or 19)     | Nothing, unless you are on React 16.                             |
| Default 25px square, aliceblue/cornflowerblue                   | Default 40px circle, palette color + white text | Pass `size={25} round={false} backgroundColor color` to keep it. |
| All words become initials (`"ESB"`)                             | First two words (`"ES"`)                        | Pass `maxInitials={Infinity}`.                                   |
| `borderRadius={50}` meant `50%`                                 | `borderRadius={50}` means `50px`                | Use `round` (`true`, `false`, px or any CSS value).              |
| Font size `height / 2` (15px at the default)                    | `size / 2.5` (16px at the default)              | Pass `textSizeRatio={2}` to keep 1.x proportions.                |
| `display: flex` (block-level), `font-weight: bold`, line 1.5    | `inline-flex`, `font-weight: 600`, line 1       | Wrap in a block or override via `style` if the layout changes.   |
| `height` alone → 25px wide, grows with `min-width: fit-content` | `height` alone → width from `size` (40px)       | Pass `width` as well, or use `size`.                             |
| `.avatar` class, 4px/6px padding                                | `.react-initial-avatar` class, no padding       | Move overrides to `className`/`style`; `size` is the exact box.  |
| Injected stylesheet                                             | Inline styles only                              | Nothing.                                                         |
| `splitWith` default `" "`                                       | Default `/\s+/` (any whitespace)                | Nothing, unless you relied on tabs/newlines not splitting.       |
| Named export only                                               | Default **and** named export                    | Nothing. `import Avatar from` now works as documented.           |
| `dist/esm/index.js` deep imports                                | `exports` map; deep imports are not resolvable  | Import from the package root.                                    |

## Releasing (maintainers)

One-time: on npmjs.com open the package → Settings → Trusted Publisher → GitHub Actions, and
enter organization `afzalali27`, repository `react-initial-avatar`, workflow `release.yml`.

Then for each release:

```bash
npm version <patch|minor|major>
git push origin master --follow-tags
```

The `Release` workflow runs the tests, publishes to npm with provenance, and creates a GitHub
release with generated notes. Pushing to `master` redeploys the Storybook to GitHub Pages.

## License

MIT © [Afzal Ali](https://github.com/afzalali27)
