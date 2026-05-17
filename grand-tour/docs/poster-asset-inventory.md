# Poster asset inventory

Generated from `public/reference/generated/layers/grand-tour-vtracer.layer-manifest.json` on 2026-05-17T16:19:15.029Z.

## Snapshot

- Canonical assets: **33**
- Hero-first assets: **7**
- Implemented in scene: **33**
- Residual reducer: **140** primary residual → **63** after heuristic cleanup
- Spatial reducer: **63** input residual → **0** remaining

## Authoring mix

- `procedural-svg`: 17
- `procedural-html-css`: 7
- `redraw-svg`: 4
- `clean-from-trace`: 3
- `hybrid-trace-to-svg`: 2

## Implementation status

- `implemented`: 33

## Hero-first build order

1. **Paper field** — `procedural-html-css`, final format `css-background`, source background (32) _(already implemented)_
2. **Red sun core** — `procedural-svg`, final format `svg-component`, source planets (54) _(already implemented)_
3. **Main green planetary body** — `hybrid-trace-to-svg`, final format `svg-component`, source planets (54) _(already implemented)_
4. **Violet right mass** — `hybrid-trace-to-svg`, final format `svg-component`, source planets (54), orbits (15) _(already implemented)_
5. **Mid route stripe** — `procedural-svg`, final format `svg-path`, source stripes (59) _(already implemented)_
6. **Fleet Alpha arrow ship** — `redraw-svg`, final format `react-component`, source fleet (119) _(already implemented)_
7. **Title lockup** — `procedural-html-css`, final format `html-css`, source footer (203) _(already implemented)_

## Group breakdown

### Foundation & paper

Base poster substrate, texture, and large compositional fields that make the piece read as print-first before animation starts.

| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Paper field | `implemented` | `procedural-html-css` | `css-background` | `hero` | `static-poster` | background (32) | Use traced background only as color reference; final implementation should be a CSS background with optional scanned paper noise. |
| Paper grain overlay | `implemented` | `procedural-html-css` | `css-background` | `medium` | `ambient-motion` | background (32), micro (43) | Treat this as a controlled overlay, not a traced asset; a tiled noise texture or film-grain shader is the safer path. |

### Celestial bodies & orbits

Hero planets, orbit arcs, and colored lenses that define the poster's central silhouette and depth cues.

| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Red sun core | `implemented` | `procedural-svg` | `svg-component` | `hero` | `ambient-motion` | planets (54) | Rebuild as a radial gradient and masked circle stack; the traced silhouette is reference, not final geometry. |
| Main green planetary body | `implemented` | `hybrid-trace-to-svg` | `svg-component` | `hero` | `interactive-depth` | planets (54) | Use the traced layer for silhouette guidance, but hand-author the final gradient stops and edge cleanup. |
| Turquoise lens overlay | `implemented` | `procedural-svg` | `svg-component` | `high` | `ambient-motion` | planets (54) | Best rebuilt as translucent circles and blur-safe masks so motion stays smooth and predictable. |
| Yellow sweep | `implemented` | `procedural-svg` | `svg-component` | `high` | `ambient-motion` | planets (54), stripes (59) | Prefer a controlled radial gradient shape instead of keeping the traced feathered edges. |
| Violet right mass | `implemented` | `hybrid-trace-to-svg` | `svg-component` | `hero` | `interactive-depth` | planets (54), orbits (15) | Keep the traced silhouette only as layout guidance, then author a cleaner right-side gradient shell. |
| Magenta token | `implemented` | `procedural-svg` | `svg-component` | `medium` | `interactive-depth` | planets (54) | Keep this crisp and simple so it can support hover or focus behavior later without artifacting. |
| Teal waypoint dot | `implemented` | `procedural-svg` | `svg-path` | `low` | `interactive-depth` | planets (54), micro (43) | This can be rebuilt as a tiny authored circle; no reason to preserve traced noise here. |
| Outer right orbit arc | `implemented` | `clean-from-trace` | `svg-path` | `high` | `ambient-motion` | orbits (15) | This is one of the few traced assets worth cleaning directly because the orbital contour is already readable. |
| Mid violet orbit arc | `implemented` | `clean-from-trace` | `svg-path` | `medium` | `ambient-motion` | orbits (15) | Smooth the bezier path and simplify anchor count before using this in motion work. |
| Magenta route column | `implemented` | `clean-from-trace` | `svg-path` | `medium` | `scroll-story` | orbits (15), stripes (59) | Keep it authored enough that it can support subtle line-travel animation without wobbling. |

### Routes & horizontal bands

High-contrast travel lanes, route accents, and footer bands that can be rebuilt as crisp authored geometry.

| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Top teal stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59) | A simple rectangle/path with motion-safe transforms is better than traced texture for these bands. |
| Top muted stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59), background (32) | Rebuild as a clean band with opacity control instead of carrying through paper noise. |
| Top red stripe | `implemented` | `procedural-svg` | `svg-path` | `high` | `ambient-motion` | stripes (59) | Keep this crisp; it is a good early candidate for line shimmer and subtle offset motion. |
| Middle orange stripe | `implemented` | `procedural-svg` | `svg-path` | `high` | `ambient-motion` | stripes (59), planets (54) | This is visually important enough that the authored version should be exact and animation-ready. |
| Center teal stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59) | A clean authored stripe will read better than traced pixels once it begins to drift. |
| Mid route stripe | `implemented` | `procedural-svg` | `svg-path` | `hero` | `scroll-story` | stripes (59) | This is a core motion rig candidate, so keep it geometric and easy to animate along its axis. |
| Mid green stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59) | Treat as a reusable band component with only width, color, and opacity changing. |
| Bottom orange stripe | `implemented` | `procedural-svg` | `svg-path` | `high` | `ambient-motion` | stripes (59), footer (203) | This should be a single authored band, not a cluster of traced fragments. |
| Footer lane stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59), footer (203) | This can live in the same reusable stripe system as the other route bands. |
| Footer red stripe | `implemented` | `procedural-svg` | `svg-path` | `medium` | `ambient-motion` | stripes (59), footer (203) | Keep authored so the bottom third can scale responsively without weird traced artifacts. |

### Fleet silhouettes

Named ship assets that should become clean SVG components before any travel or hover choreography is added.

| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Fleet Alpha arrow ship | `implemented` | `redraw-svg` | `react-component` | `hero` | `ambient-motion` | fleet (119) | Redraw this fully as authored SVG; traced fleet shapes are reference only and not clean enough for hero use. |
| Fleet Beta dart ship | `implemented` | `redraw-svg` | `react-component` | `high` | `ambient-motion` | fleet (119) | Keep geometry simple enough that tilt and drift feel elegant rather than twitchy. |
| Fleet Gamma shuttle ship | `implemented` | `redraw-svg` | `react-component` | `high` | `ambient-motion` | fleet (119) | Author this separately from the darts so the fleet feels intentionally designed, not duplicated. |
| Fleet Delta dart ship | `implemented` | `redraw-svg` | `react-component` | `medium` | `ambient-motion` | fleet (119) | This can reuse some structural motifs from Fleet Beta, but it should still be an authored component. |

### Type, badges & footer copy

Accessible text systems, lockups, and badge treatments that should not stay trapped inside traced SVG paths.

| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Kicker copy | `implemented` | `procedural-html-css` | `html-css` | `medium` | `static-poster` | footer (203) | Keep this as semantic HTML text so it stays sharp, accessible, and easy to restyle responsively. |
| Title lockup | `implemented` | `procedural-html-css` | `html-css` | `hero` | `static-poster` | footer (203) | Typography should stay accessible and layout-driven; do not keep it trapped in traced SVG paths. |
| Itinerary block | `implemented` | `procedural-html-css` | `html-css` | `high` | `static-poster` | footer (203) | This is better authored as semantic markup so it can evolve into an interactive chapter list later. |
| Gravity assist subheading | `implemented` | `procedural-html-css` | `html-css` | `medium` | `static-poster` | footer (203) | Keep this copy editable and accessible rather than baking it into artwork. |
| Every 175 years badge | `implemented` | `procedural-svg` | `react-component` | `high` | `interactive-depth` | footer (203), micro (43) | Build the badge shape as SVG but keep the text accessible and editable within the component. |
| Boarding badge | `implemented` | `procedural-svg` | `react-component` | `medium` | `interactive-depth` | footer (203), micro (43) | This is a nice candidate for a hoverable micro-interaction once the static poster is locked. |
| Footer mission copy | `implemented` | `procedural-html-css` | `html-css` | `high` | `static-poster` | footer (203) | Treat as semantic layout copy, then layer authored divider lines beneath it as needed. |

## Immediate production decisions

- **Ships should be redrawn** as authored SVG React components before any travel animation work.
- **Title and footer copy should stay semantic** in HTML/CSS so accessibility and responsive layout stay sane.
- **Stripes are best rebuilt procedurally** as clean SVG bands rather than promoted directly from trace output.
- **Hero planets and orbit arcs can borrow the traced split as reference**, but should still be cleaned or re-authored before motion is layered in.

