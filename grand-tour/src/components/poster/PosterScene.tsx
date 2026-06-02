import { motion, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import type {
	PosterFleetMotionMode,
	PosterRouteStripeId,
} from "../../lib/posterFlightPaths";
import type {
	PosterTourChoreography,
	PosterTourFocusTarget,
	PosterTourSceneFrame,
} from "../../lib/posterTour";
import { posterHotspots, type PosterHotspotId } from "../../lib/posterHotspots";

import {
	PosterBottomRightDetailField,
	PosterFooterLaneStripe,
	PosterFooterRedStripe,
	PosterBottomOrangeStripe,
	PosterCenterTealStripe,
	PosterMainGreenBody,
	PosterMagentaToken,
	PosterMagentaRouteColumn,
	PosterMicroTailWorlds,
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

const PosterThreeLayer = lazy(() =>
	import("./PosterThreeLayer").then((module) => ({
		default: module.PosterThreeLayer,
	})),
);

type PosterSceneProps = {
	enableEnhancement: boolean;
	fleetMotionEnabled: boolean;
	fleetMotionMode: PosterFleetMotionMode;
	fleetMotionResetToken: number;
	pointerEngaged: boolean;
	pointerX: MotionValue<number>;
	pointerY: MotionValue<number>;
	reducedMotion: boolean;
	tourAccentColor?: string | null;
	tourChoreography?: PosterTourChoreography | null;
	tourFocusTarget?: PosterTourFocusTarget | null;
	tourHotspotId?: PosterHotspotId | null;
	tourMode?: "idle" | "paused" | "playing";
};

function formatScenePercent(value: number) {
	return `${value}%`;
}

function getSceneCameraAnimate(
	sceneFrame: PosterTourSceneFrame | null,
	reducedMotion: boolean,
	tourMode: "idle" | "paused" | "playing",
	cameraPhase: "approach" | "breathe",
) {
	if (!sceneFrame || tourMode === "idle") {
		return {
			x: "0%",
			y: "0%",
			scale: 1,
			rotate: 0,
		};
	}

	const rotation = sceneFrame.rotateDeg ?? 0;

	if (reducedMotion || tourMode === "paused" || cameraPhase === "approach") {
		return {
			x: formatScenePercent(sceneFrame.xPercent),
			y: formatScenePercent(sceneFrame.yPercent),
			scale: sceneFrame.scale,
			rotate: rotation,
		};
	}

	const breathScale = sceneFrame.breathScale ?? 0.014;
	const breathX = sceneFrame.breathXPercent ?? 0.24;
	const breathY = sceneFrame.breathYPercent ?? 0.18;

	return {
		x: [
			formatScenePercent(sceneFrame.xPercent - breathX),
			formatScenePercent(sceneFrame.xPercent),
			formatScenePercent(sceneFrame.xPercent - breathX * 0.42),
		],
		y: [
			formatScenePercent(sceneFrame.yPercent + breathY),
			formatScenePercent(sceneFrame.yPercent),
			formatScenePercent(sceneFrame.yPercent - breathY * 0.38),
		],
		scale: [
			sceneFrame.scale - breathScale * 0.66,
			sceneFrame.scale,
			sceneFrame.scale - breathScale * 0.22,
		],
		rotate: [rotation - 0.08, rotation, rotation + 0.06],
	};
}

function getSceneCameraTransition(
	sceneFrame: PosterTourSceneFrame | null,
	reducedMotion: boolean,
	tourMode: "idle" | "paused" | "playing",
	cameraPhase: "approach" | "breathe",
) {
	if (!sceneFrame || tourMode === "idle") {
		return {
			duration: 0.76,
			ease: "easeOut" as const,
		};
	}

	if (cameraPhase === "approach") {
		return {
			duration: 0.94,
			ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
		};
	}

	if (reducedMotion || tourMode === "paused") {
		return {
			duration: 0.48,
			ease: "easeOut" as const,
		};
	}

	return {
		duration: 8.8,
		repeat: Number.POSITIVE_INFINITY,
		ease: "easeInOut" as const,
		times: [0, 0.56, 1],
	};
}

export function PosterScene({
	enableEnhancement,
	fleetMotionEnabled,
	fleetMotionMode,
	fleetMotionResetToken,
	pointerEngaged,
	pointerX,
	pointerY,
	reducedMotion,
	tourAccentColor = null,
	tourChoreography = null,
	tourFocusTarget = null,
	tourHotspotId = null,
	tourMode = "idle",
}: PosterSceneProps) {
	const [previewHotspotId, setPreviewHotspotId] =
		useState<PosterHotspotId | null>(null);
	const [selectedHotspotId, setSelectedHotspotId] =
		useState<PosterHotspotId | null>(null);
	const [cameraPhase, setCameraPhase] = useState<"approach" | "breathe">(
		"breathe",
	);
	const prevChoreographyRef = useRef<typeof tourChoreography>(null);
	const cameraTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(
		null,
	);

	useEffect(() => {
		if (tourChoreography === prevChoreographyRef.current) return;
		prevChoreographyRef.current = tourChoreography ?? null;

		if (cameraTimerRef.current !== null) {
			window.clearTimeout(cameraTimerRef.current);
			cameraTimerRef.current = null;
		}

		if (!tourChoreography) {
			setCameraPhase("breathe");
			return;
		}

		setCameraPhase("approach");
		cameraTimerRef.current = window.setTimeout(() => {
			setCameraPhase("breathe");
			cameraTimerRef.current = null;
		}, 980);
	}, [tourChoreography]);

	useEffect(() => {
		return () => {
			if (cameraTimerRef.current !== null) {
				window.clearTimeout(cameraTimerRef.current);
			}
		};
	}, []);
	const activeHotspotId = selectedHotspotId ?? previewHotspotId;
	const activeHotspot = activeHotspotId
		? (posterHotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? null)
		: null;
	const guidedHotspot = tourHotspotId
		? (posterHotspots.find((hotspot) => hotspot.id === tourHotspotId) ?? null)
		: null;
	const guidedRouteIds: PosterRouteStripeId[] = Array.from(
		new Set([
			...(guidedHotspot?.relatedRouteIds ?? []),
			...(tourChoreography?.featuredRouteIds ?? []),
		]),
	);
	const activeShipIdFromHotspot =
		activeHotspot && "shipId" in activeHotspot ? activeHotspot.shipId : null;
	const guidedShipIdFromHotspot =
		guidedHotspot && "shipId" in guidedHotspot ? guidedHotspot.shipId : null;
	const emphasizedShipId = activeHotspot
		? activeShipIdFromHotspot
		: guidedShipIdFromHotspot ?? tourChoreography?.featuredShipId ?? null;
	const emphasizedRouteIds = activeHotspot
		? activeHotspot.relatedRouteIds
		: guidedRouteIds;
	const sceneFrame = tourChoreography?.sceneFrame ?? null;
	const sceneCameraAnimate = getSceneCameraAnimate(
		sceneFrame,
		reducedMotion,
		tourMode,
		cameraPhase,
	);
	const sceneCameraTransition = getSceneCameraTransition(
		sceneFrame,
		reducedMotion,
		tourMode,
		cameraPhase,
	);
	const boardStyle = (
		tourAccentColor
			? {
					"--poster-tour-accent": tourAccentColor,
				}
			: undefined
	) as CSSProperties | undefined;

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
		<div
			className="poster-board"
			data-tour-featured-ship={tourChoreography?.featuredShipId ?? undefined}
			data-tour-focus-target={tourFocusTarget ?? undefined}
			data-tour-mode={tourMode}
			style={boardStyle}
		>
			<motion.div className="poster-scene">
				<motion.div
					className="poster-scene__camera poster-scene__camera--artwork"
					initial={false}
					animate={sceneCameraAnimate}
					transition={sceneCameraTransition}
				>
					<PosterPaperField />
					{enableEnhancement ? (
						<Suspense fallback={null}>
							<PosterThreeLayer
								activeHotspotId={activeHotspotId ?? tourHotspotId}
								activeRouteIds={emphasizedRouteIds}
								activeShipId={emphasizedShipId}
								pointerEngaged={pointerEngaged}
								pointerX={pointerX}
								pointerY={pointerY}
								reducedMotion={reducedMotion}
							/>
						</Suspense>
					) : null}
					<div className="poster-phase-chip">
						Phase 01 — living poster scaffold
					</div>

					<PosterTopMutedStripe reducedMotion={reducedMotion} />
					<PosterTopTealStripe reducedMotion={reducedMotion} />
					<PosterRedSunCore reducedMotion={reducedMotion} />
					<PosterMagentaRouteColumn
						reducedMotion={reducedMotion}
						motionEnabled={fleetMotionEnabled}
						motionMode={fleetMotionMode}
					/>
					<PosterOuterRightOrbitArc
						reducedMotion={reducedMotion}
						motionEnabled={fleetMotionEnabled}
						motionMode={fleetMotionMode}
					/>
					<PosterMidVioletOrbitArc
						reducedMotion={reducedMotion}
						motionEnabled={fleetMotionEnabled}
						motionMode={fleetMotionMode}
					/>

					<PosterMainGreenBody reducedMotion={reducedMotion} />
					<PosterTurquoiseLens reducedMotion={reducedMotion} />
					<PosterYellowSweep reducedMotion={reducedMotion} />
					<PosterVioletRightMass reducedMotion={reducedMotion} />
					<PosterTealWaypointDot reducedMotion={reducedMotion} />
					<PosterMagentaToken reducedMotion={reducedMotion} />

					<PosterTopRedStripe reducedMotion={reducedMotion} />
					<PosterMiddleOrangeStripe reducedMotion={reducedMotion} />
					<PosterCenterTealStripe reducedMotion={reducedMotion} />
					<PosterMicroTailWorlds reducedMotion={reducedMotion} />

					<PosterMidRouteStripe reducedMotion={reducedMotion} />
					<PosterMidGreenStripe reducedMotion={reducedMotion} />
					<PosterBottomOrangeStripe reducedMotion={reducedMotion} />
					<PosterFooterLaneStripe reducedMotion={reducedMotion} />
					<PosterFooterRedStripe reducedMotion={reducedMotion} />
					<PosterBottomRightDetailField reducedMotion={reducedMotion} />

					<PosterFleetMotion
						reducedMotion={reducedMotion}
						activeShipId={emphasizedShipId}
						activeRouteIds={emphasizedRouteIds}
						motionEnabled={fleetMotionEnabled}
						motionMode={fleetMotionMode}
						motionResetToken={fleetMotionResetToken}
						tourActive={tourMode !== "idle"}
						tourChoreography={tourChoreography}
					/>
				</motion.div>

				<motion.div
					className="poster-scene__camera poster-scene__camera--overlay"
					initial={false}
					animate={sceneCameraAnimate}
					transition={sceneCameraTransition}
				>
					<PosterInteractiveHotspots
						activeHotspotId={activeHotspotId}
						guidedHotspotId={tourHotspotId}
						selectedHotspotId={selectedHotspotId}
						onClearSelection={handleClearSelection}
						onHotspotPreviewEnd={handleHotspotPreviewEnd}
						onHotspotPreviewStart={handleHotspotPreviewStart}
						onHotspotToggle={handleHotspotToggle}
						reducedMotion={reducedMotion}
					/>

					<PosterTitleLockup />
				</motion.div>
			</motion.div>
		</div>
	);
}
