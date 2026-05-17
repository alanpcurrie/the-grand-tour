# Poster SVG ↔ UI audit

Updated: 2026-05-17

## Goal

Compare the authored poster UI against the original NASA poster composition and identify where the live scene still diverges in silhouette, scale, placement, and layering.

## What was corrected in this pass

- Re-authored the fleet silhouettes in `src/components/poster/PosterHeroAssets.tsx` with a longer Alpha arrowliner, a more specialized Gamma shuttle, a clearer tiny triple-fin Delta courier, and a more distinctive Beta scout.
- Replaced the old smooth violet-right treatment with a sculpted SVG world mass that better matches the original poster’s dramatic right-side weight.
- Removed the persistent footer mission/dossier block from `src/components/poster/PosterTitleLockup.tsx` so the title/footer relationship reads like the print poster instead of a dashboard layout.
- Added composition overrides in `src/styles/global.css` to tighten the footer lockup, align the fleet and orbit cluster more closely to the source art, hide non-print scaffold chrome, and suppress idle hotspot markers.
- Updated hotspot frames in `src/lib/posterHotspots.ts` so interaction bounds follow the refined ship positions and the re-authored violet world.

## Current audit

### Fleet silhouettes

#### Fleet Alpha arrowliner
- **Before:** Too compact and gem-like; lacked the long passenger-liner body from the poster.
- **Now:** Reads much closer to the original hero ship with a longer, slimmer fuselage, a more continuous passenger window row, flatter wing geometry, and a cleaner rear engine block.
- **Remaining micro-delta:** The nose can still taper a touch farther if a third pass is needed, but it no longer reads as the old generic dart.

#### Fleet Beta dart
- **Before:** Read like a scaled-down copy of Alpha.
- **Now:** Holds as its own scout profile with a small, quick body and distinct tail treatment.
- **Remaining micro-delta:** Tail ribbing could still become slightly finer if we choose to do a final detail polish.

#### Fleet Gamma shuttle
- **Before:** Too close to another dart silhouette.
- **Now:** Reads as its own shuttle family with forward pod structure, a broader central body, and a more specialized winged silhouette.
- **Remaining micro-delta:** The original still has slightly stranger pod geometry, but the ship now clearly breaks from the dart family.

#### Fleet Delta courier
- **Before:** Positioned too low and looked like another repeated dart.
- **Now:** Sits correctly in the active fleet field and reads much more like the tiny triple-fin courier accent from the poster.
- **Remaining micro-delta:** Minor detail tuning only; the main silhouette mismatch has been resolved.

### Planet and orbit alignment

#### Red sun core
- **Before:** Sat too low relative to the ship cluster.
- **Now:** Moved upward so it better anchors the left-side departure zone.
- **Remaining micro-delta:** The inner dark overlap can still be sharpened if we want a final print-graphic pass.

#### Main green world + turquoise lens
- **Before:** The fleet sat a little low against the world, making the title overlap feel more accidental than compositional.
- **Now:** Green world and lens are better aligned to support the corrected ship placement.
- **Remaining micro-delta:** The turquoise lens is still a little cleaner and more circular than the print source.

#### Violet right mass
- **Before:** The biggest remaining planetary mismatch; too smooth and too soft relative to the print poster.
- **Now:** Re-authored as an SVG silhouette with stronger contour, inner shadowing, and better orbit-stage relationship.
- **Remaining micro-delta:** The print source still has a slightly harsher cut/overlap language, but the major shape mismatch is fixed.

### Composition and layer hierarchy

#### Good matches
- Horizontal lane system is directionally correct.
- Route column / diagonal magenta sweep still gives the scene the right large-scale motion.
- The fleet now reads in the correct left-to-right / travel-lane order.
- Title/footer composition now sits closer to the print poster after removing the persistent mission block.
- Idle hotspot rings and the scaffold phase chip are no longer visible in the resting poster view.

#### Remaining mismatches
- The poster still keeps some intentionally modern softness from gradients, motion, and interactive overlays.
- Footer badges remain slightly cleaner than the printed artifact once compared at pixel-peeping level.
- A future third pass could push more paper-grain / silkscreen roughness if exact print texture becomes a requirement.

### Hotspots

- Ship hotspots now track the updated fleet placement more accurately.
- Neptune focus bounds now follow the re-authored violet world.
- Idle hotspot affordances are hidden so the resting poster view stays visually closer to the source print.
- Browser validation completed after the second parity pass; remaining hotspot work is optional micro-tuning only.

## Priority next steps

1. **Optional texture pass**
   - Add a little more print roughness / silkscreen irregularity if the goal shifts from composition parity to surface parity.

2. **Micro silhouette tweaks only if desired**
   - Alpha nose taper.
   - Beta tail delicacy.
   - Gamma pod eccentricity.

3. **Hotspot hover QA**
   - Spot-check every ship/planet hotspot for hover and pinned-card accuracy after future art movement.

## Files touched for this audit slice

- `src/components/poster/PosterHeroAssets.tsx`
- `src/components/poster/PosterTitleLockup.tsx`
- `src/styles/global.css`
- `src/lib/posterHotspots.ts`
