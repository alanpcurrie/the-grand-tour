import { motion, type MotionValue } from "motion/react";
import { useState } from "react";

import { posterHotspots, type PosterHotspotId } from "../../lib/posterHotspots";

import {
	PosterFooterLaneStripe,
	PosterFooterRedStripe,
	PosterBottomOrangeStripe,
	PosterCenterTealStripe,
	PosterMainGreenBody,
	PosterMagentaToken,
	PosterMagentaRouteColumn,
	PosterMidGreenStripe,
	PosterMiddleOrangeStripe,
	PosterMidVioletOrbitArc,
	PosterMidRouteStripe,
	PosterOuterRightOrbitArc,
	PosterPaperField,
	PosterRedSunCore,
	PosterTealWaypointDot,
	PosterTopMutedStripe,
	PosterTopTealStripe,
	PosterTopRedStripe,
	PosterTurquoiseLens,
	PosterVioletRightMass,
	PosterYellowSweep,
} from "./PosterHeroAssets";
import { PosterFleetMotion } from "./PosterFleetMotion";
import { PosterInteractiveHotspots } from "./PosterInteractiveHotspots";
import { PosterTitleLockup } from "./PosterTitleLockup";

type PosterSceneProps = {
	parallaxX: MotionValue<number>;
	parallaxY: MotionValue<number>;
	reducedMotion: boolean;
};

export function PosterScene({
	parallaxX,
	parallaxY,
	reducedMotion,
}: PosterSceneProps) {
	const [previewHotspotId, setPreviewHotspotId] =
		useState<PosterHotspotId | null>(null);
	const [selectedHotspotId, setSelectedHotspotId] =
		useState<PosterHotspotId | null>(null);
	const activeHotspotId = selectedHotspotId ?? previewHotspotId;
	const activeHotspot = activeHotspotId
		? (posterHotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? null)
		: null;
	const activeShipId =
		activeHotspot && "shipId" in activeHotspot ? activeHotspot.shipId : null;
	const activeRouteIds = activeHotspot?.relatedRouteIds ?? [];

	const handleHotspotPreviewStart = (id: PosterHotspotId) => {
		if (selectedHotspotId === null) {
			setPreviewHotspotId(id);
		}
	};

	const handleHotspotPreviewEnd = (id: PosterHotspotId) => {
		setPreviewHotspotId((currentId) => (currentId === id ? null : currentId));
	};

	const handleHotspotToggle = (id: PosterHotspotId) => {
		const nextSelectedId = selectedHotspotId === id ? null : id;
		setSelectedHotspotId(nextSelectedId);
		setPreviewHotspotId(nextSelectedId);
	};

	const handleClearSelection = () => {
		setSelectedHotspotId(null);
		setPreviewHotspotId(null);
	};

	return (
		<div className="poster-board">
			<motion.div
				className="poster-scene"
				style={reducedMotion ? undefined : { x: parallaxX, y: parallaxY }}
			>
				<PosterPaperField />
				<div className="poster-phase-chip">
					Phase 01 — living poster scaffold
				</div>

				<PosterTopMutedStripe reducedMotion={reducedMotion} />
				<PosterTopTealStripe reducedMotion={reducedMotion} />
				<PosterRedSunCore reducedMotion={reducedMotion} />
				<PosterMagentaRouteColumn reducedMotion={reducedMotion} />
				<PosterOuterRightOrbitArc reducedMotion={reducedMotion} />
				<PosterMidVioletOrbitArc reducedMotion={reducedMotion} />

				<PosterMainGreenBody reducedMotion={reducedMotion} />
				<PosterTurquoiseLens reducedMotion={reducedMotion} />
				<PosterYellowSweep reducedMotion={reducedMotion} />
				<PosterVioletRightMass reducedMotion={reducedMotion} />
				<PosterTealWaypointDot reducedMotion={reducedMotion} />
				<PosterMagentaToken reducedMotion={reducedMotion} />

				<PosterTopRedStripe reducedMotion={reducedMotion} />
				<PosterMiddleOrangeStripe reducedMotion={reducedMotion} />
				<PosterCenterTealStripe reducedMotion={reducedMotion} />

				<PosterMidRouteStripe reducedMotion={reducedMotion} />
				<PosterMidGreenStripe reducedMotion={reducedMotion} />
				<PosterBottomOrangeStripe reducedMotion={reducedMotion} />
				<PosterFooterLaneStripe reducedMotion={reducedMotion} />
				<PosterFooterRedStripe reducedMotion={reducedMotion} />

				<PosterFleetMotion
					reducedMotion={reducedMotion}
					activeShipId={activeShipId}
					activeRouteIds={activeRouteIds}
				/>
				<PosterInteractiveHotspots
					activeHotspotId={activeHotspotId}
					selectedHotspotId={selectedHotspotId}
					onClearSelection={handleClearSelection}
					onHotspotPreviewEnd={handleHotspotPreviewEnd}
					onHotspotPreviewStart={handleHotspotPreviewStart}
					onHotspotToggle={handleHotspotToggle}
					reducedMotion={reducedMotion}
				/>

				<PosterTitleLockup />
			</motion.div>
		</div>
	);
}
