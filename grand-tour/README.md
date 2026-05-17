# The Grand Tour

A modern rebuild scaffold for turning the classic NASA-inspired **Grand Tour** poster into a living web experience.

## Stack

- **Astro** for the site shell and routing
- **React** for interactive islands
- **Motion** for animation and choreography
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for later atmospheric depth work
- **Bun** for package management and scripts

## Available commands

Run these from the project root:

| Command | What it does |
| :-- | :-- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the Astro development server |
| `bun run build` | Build the production site |
| `bun run preview` | Preview the production build locally |
| `bun run check` | Run Astro's type/content checks |
| `bun run poster:extract-reference` | Decode the legacy TIFF with Bun and emit tracing-friendly PNG reference assets |
| `bun run astro -- --help` | Show Astro CLI help |

## Project shape

```text
src/
  components/
    poster/
      PosterExperience.tsx
      PosterScene.tsx
  layouts/
    BaseLayout.astro
  lib/
    motionPresets.ts
    posterScene.ts
  pages/
    index.astro
  styles/
    global.css
    poster.css
```

## Current state

This scaffold already includes:

- Astro + React integration
- Motion and React Three Fiber dependencies
- A custom landing page with a data-driven poster study
- Palette and structure inspired by the original Grand Tour poster

## Recommended next steps

1. Rebuild the ships as tighter SVG illustrations.
2. Break the poster scene into layer components.
3. Add scroll-linked choreography.
4. Introduce optional atmospheric 3D only after the static composition feels right.

## TIFF preprocessing with Bun

`Bun.Image` can decode the legacy `grand_tour.tif` natively on macOS, so this repo includes a small extraction helper:

```sh
bun run poster:extract-reference
```

It writes normalized reference assets into `public/reference/generated/`, including:

- a review-friendly preview PNG
- indexed palette PNGs for tracing prep
- a grayscale study image
- a small placeholder data URL
- a manifest describing the source and generated outputs

Important: this is **preprocessing**, not true SVG tracing. Bun handles TIFF decode and image normalization nicely, but actual raster-to-vector conversion still needs a separate tracing step.
