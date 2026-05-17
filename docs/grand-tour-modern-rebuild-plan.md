# The Grand Tour — modern rebuild plan

## Vision

Recreate the NASA/JPL-inspired **Grand Tour** poster as a living, interactive web experience that still feels like a printed mid-century space poster at rest.

The site should feel like:

- **A poster first** — composition, typography, and color harmony are sacred.
- **Alive on second glance** — subtle motion, parallax, glow, drift, and hover responses.
- **Explorable on interaction** — planets, trajectories, and ships can reveal depth, facts, or alternate states.
- **Performant and elegant** — smooth on laptop and mobile, with reduced-motion support.

## What exists in the current Vue prototype

The current codebase is a very early concept sketch, not a reusable animation system.

### What’s useful

- `src/assets/styles/utils/colors.scss`
  - Good starting palette extracted from the poster.
- `src/components/atoms/Saturn.vue`
  - A nice proof that CSS/SVG-like geometry can reproduce key poster forms.
- `src/components/molecules/TitleText.vue`
  - Establishes the typography/content blocks we’ll want in the final design.
- `src/assets/images/grand_tour.jpg`
  - The source visual reference is already in the project.

### What’s missing

- The ship system is effectively unbuilt:
  - `src/components/atoms/SpaceShip.vue` is empty.
  - `src/components/molecules/SpaceFleet.vue` is mostly placeholder markup.
- No animation architecture exists yet.
- No layered scene model exists.
- No responsive composition strategy exists.
- The app is built on **Vue 2.5 + Vue CLI 3 RC**, which is many generations behind modern tooling.
- Styles are mostly hardcoded rather than data-driven.

## Recommended modern stack

### Core platform

- **Astro** for the site shell, routing, asset pipeline, and mostly-static delivery.
- **React** for interactive islands and scene control.
- **TypeScript** for scene definitions and animation config.

### Animation/rendering

- **Motion for React** for:
  - entry/exit animation
  - hover/tap states
  - scroll-linked parallax
  - staggered orchestrations
  - SVG attribute/path animation
- **SVG** for the poster geometry:
  - ships
  - rings
  - stripes
  - circles
  - badges
  - route lines
  - title embellishments
- **Three.js via `@react-three/fiber`** only where it adds real value:
  - subtle depth field
  - star particles
  - volumetric glow/fog
  - gentle camera tilt/parallax

### Supporting libraries

- `@react-three/drei` for useful scene helpers
- `svgo` for SVG cleanup/optimization
- optional: `vite-plugin-svgr` if you want to import exported SVG assets as React components
- self-hosted fonts or local font assets rather than runtime Google font imports

## The right division of labor

The safest approach is:

- **Astro** = frame, route, SEO, static content, page assembly
- **React** = interactive poster island(s)
- **Motion** = most animation logic
- **SVG** = the poster itself
- **Three.js** = atmospheric enhancement, not the main illustration engine

That last point matters: trying to build the whole poster in 3D would likely make the project heavier, harder to art-direct, and less faithful to the original print aesthetic.

## Creative direction: “living poster” modes

The project becomes much easier to design if we separate it into modes.

### 1. Resting poster

The initial load should feel almost print-like:

- full composition visible
- subtle film grain/paper texture
- very light planetary drift
- soft glow/opacity breathing on certain bands
- almost imperceptible ship idle motion

### 2. Hover awakenings

On pointer hover:

- ships tilt and accelerate slightly
- route stripes brighten or elongate
- planets reveal halo rings, labels, or orbit guides
- badges and typography gain subtle pressure/magnetic response

### 3. Scroll journey

As the page scrolls:

- background layers move slower than foreground layers
- route lines slide with slight offset for depth
- ships can advance along trajectory paths
- the title/footer can pin or reveal in stages
- specific planets can become “chapters” in a story sequence

### 4. Focus mode / detail reveal

On click/tap:

- a planet or ship becomes the featured element
- the poster reframes via zoom or shared-element transition
- facts, route details, or mission-era context can appear
- returning to full poster should feel seamless

## Scene architecture

Build the composition as a **data-driven layered scene**, not as one giant component.

### Suggested scene model

Create a `src/lib/posterScene.ts` or similar with arrays for:

- palette tokens
- planets
- rings
- stripes/trails
- ships
- text blocks
- badges
- interactive hotspots

Each scene item can define:

- `id`
- `type`
- `zIndex`
- `position`
- `size`
- `color`
- `opacity`
- `blendMode` (when needed)
- `parallaxDepth`
- `animationPreset`
- `interactive` flags

That gives you one source of truth for both rendering and choreography.

## Poster decomposition

### Best rendered as SVG

- main planets and circular overlays
- Saturn-style rings
- ships and ship windows
- horizontal color bars / route trails
- badge shapes
- footer framing lines
- decorative linework

### Best rendered as HTML/CSS

- large headline typography
- accessible buttons/labels
- overlays/tooltips/panels
- layout shell and responsive containers

### Best rendered as Three.js

- star dust / particle drift
- faint nebula noise plane
- low-opacity light bloom planes
- very subtle camera-based parallax depth

## Motion guidance from current docs

Based on the latest Motion docs:

- Use `motion/react` as the primary API.
- Use `motion.svg`, `motion.path`, `motion.circle`, etc. for SVG animation.
- Use `whileHover`, `whileTap`, and variants for responsive micro-interactions.
- Use `useScroll`, `useTransform`, and `useSpring` for scroll-linked parallax and storytelling.
- Use `AnimatePresence` for overlays, panels, and detail reveals.
- Use `layout` / `layoutId` for HTML UI transitions only.

### Important caveat

Motion’s layout animation system is excellent for HTML UI, but **SVG layout animation is not the same thing**.
For SVG-heavy poster elements, prefer animating:

- `pathLength`
- `pathOffset`
- `viewBox`
- `cx` / `cy`
- `attrX` / `attrY`
- transforms like `x`, `y`, `scale`, `rotate`

In other words: use Motion’s SVG features directly instead of trying to “layout animate” the poster artwork.

## Performance principles

- Rebuild the static composition first before adding heavy motion.
- Favor `transform` and `opacity` for repeated animation.
- Use CSS variables mainly for theming, not high-frequency animated geometry.
- Keep Three.js decorative and optional.
- Avoid animating every layer all the time.
- Add `prefers-reduced-motion` support from day one.
- Test mobile GPU behavior early, especially blur, blend modes, and large SVGs.

## Recommended Astro project structure

```text
src/
  components/
    poster/
      PosterScene.tsx
      PosterCanvas.tsx
      PosterSvg.tsx
      PosterTypography.tsx
      PosterOverlay.tsx
      layers/
        PlanetLayer.tsx
        RingLayer.tsx
        StripeLayer.tsx
        FleetLayer.tsx
        BadgeLayer.tsx
      ships/
        ShipClassic.tsx
        ShipWideWing.tsx
        ShipShuttle.tsx
    ui/
      IconButton.tsx
      Toggle.tsx
  layouts/
    BaseLayout.astro
  pages/
    index.astro
  lib/
    posterScene.ts
    posterTokens.ts
    motionPresets.ts
    viewport.ts
  styles/
    global.css
    poster.css
  content/
    lore/
```

## Build strategy

### Phase 1 — faithful static remake

Goal: reproduce the poster composition as closely as possible.

Deliverables:

- responsive poster layout
- palette and typography system
- vectorized ships and major geometry
- static footer/title lockup
- mobile and desktop composition rules

Do **not** chase animation too early.

### Phase 2 — ambient life

Goal: make the poster breathe without changing its identity.

Add:

- gentle drift
- glow pulsing
- subtle ship idle movement
- light grain shimmer
- hover reactions on major elements

### Phase 3 — interactive depth

Goal: make the poster explorable.

Add:

- hotspots for planets and ships
- overlay cards or side panels
- shared-element transitions for focus mode
- keyboard-accessible interactions

### Phase 4 — scroll story mode

Goal: turn the poster into a journey.

Add:

- vertical scroll narrative sections
- parallax bands and route lines
- chapter-style planet reveals
- optional “launch” sequence as the user progresses

### Phase 5 — atmospheric 3D enhancement

Goal: add depth without breaking the graphic-poster aesthetic.

Add carefully:

- soft particle field
- faint depth parallax
- restrained lighting accents

If 3D starts competing with the print style, roll it back.

## First implementation milestones

### Milestone A

Create the new Astro app and get a static poster shell rendering.

### Milestone B

Rebuild the footer/title exactly and port the palette/typography.

### Milestone C

Replace the placeholder fleet with real SVG ship components.

### Milestone D

Build the scene data model and render planets/rings/stripes from config.

### Milestone E

Add Motion-driven ambient animations.

### Milestone F

Add scroll-linked parallax and interactive hotspots.

## Risks to avoid

- Turning the poster into a generic sci-fi landing page.
- Overusing 3D where 2D vector illustration would look better.
- Building animation logic before the composition is faithful.
- Using too many simultaneous infinite animations.
- Losing the print poster’s balance and negative space.

## Definition of success

A successful remake should:

- look recognizably like the original poster even when paused
- feel premium and alive when interacted with
- stay readable and smooth on modern devices
- remain maintainable because layers, tokens, and animations are data-driven

## Suggested next move

Start with a **static Astro + React rebuild** of only these elements:

1. background/paper texture
2. large circular planet cluster
3. Saturn ring system
4. 2–3 ship variants as SVG components
5. full title/footer lockup

Once the poster looks right while standing still, Motion and Three.js can make it sing instead of trying to rescue the composition later.
