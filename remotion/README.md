# Remotion compositions

Isolated workspace for one-off video and animation assets.
**Not part of the deployed Next.js site** (`.vercelignore` excludes this directory; separate `node_modules` tree).

## Setup

```bash
cd remotion
npm install
```

First install pulls Chromium for rendering, ~600MB.

## Use

```bash
npm run studio                            # interactive preview at localhost:3000
npm run render:logo                       # → out/logo-intro.mp4 (1080p, 30fps, 4s)
npm run render:logo:gif                   # → out/logo-intro.gif

# render any composition by id, custom output:
npx remotion render <CompositionId> out/<filename>.mp4
```

Outputs land in `out/` (gitignored).

## Compositions

| Id | Duration | Description |
|---|---|---|
| `LogoIntro` | 5s | Recreates the site's hero animation. Linen background with soft hex blobs; "murmura labs presents" → big "murmur" wordmark (Quicksand 700, tracked) → "URBAN FORESIGHT PLATFORM" (Inter caps) → v0.1 pill + April 2026 (JetBrains Mono) |

## Theme

Design tokens (colors, fonts) are centralized in `src/theme.ts` and kept in sync with `../src/index.css`. New compositions should import from there rather than hard-coding values.

## Adding a new composition

1. Create `src/compositions/<Name>.tsx` exporting a React component
2. Register it in `src/Root.tsx` with `<Composition id="..." component={...} ... />`
3. Add an `npm run render:<name>` script to `package.json` if you want a shortcut

## SVG sources

The Murmura Labs hexagon logo is recreated as inline `<polygon>` elements in `LogoIntro.tsx` so individual paths can be animated independently. Path data lives next to the component; if the canonical site logo at `../public/logo.svg` changes, port the new path data over.

For static SVG embeds (no per-path animation), drop the SVG into `remotion/public/` and reference via `staticFile('logo.svg')` inside an `<Img>` tag.
