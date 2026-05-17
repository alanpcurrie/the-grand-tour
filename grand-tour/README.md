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
| `bun run poster:inventory` | Build a canonical poster asset inventory from the generated layer manifest |
| `bun run poster:install-vtracer` | Install the preferred Rust `vtracer` backend into a project-local tools directory |
| `bun run poster:split-layers` | Heuristically split the Rust-traced SVG into poster-friendly layer buckets |
| `bun run poster:vectorize` | Turn the legacy TIFF into traced SVG outputs through a Bun-driven pipeline |
| `bun run poster:vectorize:rust` | Run only the preferred Rust `vtracer` backend |
| `bun run poster:pipeline` | Run extraction, vectorization, splitting, and asset inventory generation end to end |
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

## TIFF to SVG pipeline with Bun

`Bun.Image` can decode the legacy `grand_tour.tif` natively on macOS, so this repo now includes a programmatic pipeline:

```sh
bun run poster:pipeline
```

The two stages are also available independently:

```sh
bun run poster:extract-reference
bun run poster:vectorize
bun run poster:split-layers
bun run poster:inventory
```

To install the preferred Rust backend locally in this repo:

```sh
bun run poster:install-vtracer
```

Together they write assets into `public/reference/generated/`, including:

- a review-friendly preview PNG
- indexed palette PNGs for tracing prep
- a grayscale study image
- a small placeholder data URL
- a Rust-traced SVG from `vtracer` when the local CLI is installed
- a traced SVG output
- a tokenized SVG output using a fixed Grand Tour palette
- a heuristic layered SVG and per-layer split SVG files for cleanup work
- a canonical asset inventory JSON plus a planning-ready markdown inventory doc
- manifests describing the source and generated outputs

Important nuance: **Bun.Image itself** still does not emit SVG. In this repo, Bun handles TIFF decoding and preprocessing, and the tracing step runs inside Bun using `imagetracerjs` plus `pngjs`.

For support tooling, this repo now also uses:

- `svgo` locally, to optimize the traced SVGs automatically after generation
- `vtracer` as the preferred optional Rust tracing backend when installed locally

The current vectorization script prefers the Rust backend whenever it is installed, and falls back to the JavaScript tracer for portability and comparison outputs.

The layer splitter is intentionally heuristic. It uses fill-color clustering plus rough shape bounds, then runs:

- a second-pass residual reducer for high-confidence leftovers
- a third-pass spatial reducer for paths that almost perfectly align with an already-classified shape

The resulting buckets are:

- `background`
- `planets`
- `orbits`
- `stripes`
- `fleet`
- `footer`
- `micro`
- `residual`

Think of these outputs as cleanup-friendly starting points, not perfect semantic layers.

The generated layer manifest also records how many paths were rescued from `residual`, along with the reducer rules, thresholds, and follow-up spatial matches that moved them.

The asset inventory step builds on top of that split manifest and produces:

- `public/reference/generated/layers/grand-tour-vtracer.asset-inventory.json`
- `docs/poster-asset-inventory.md`

Those outputs are the bridge between traced archaeology and production assets: they classify what should be kept procedural, cleaned from trace, or fully redrawn before motion work begins.
