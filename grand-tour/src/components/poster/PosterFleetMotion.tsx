import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import {
	posterFlightPaths,
	posterRouteSignals,
	type PosterFleetMotionMode,
	type PosterFlightPath,
	type PosterFleetShipId,
	type PosterRouteStripeId,
} from "../../lib/posterFlightPaths";
import type {
	PosterTourChoreography,
	PosterTourShipCue,
} from "../../lib/posterTour";
import { stripes } from "../../lib/posterScene";
import { slowFloat } from "../../lib/motionPresets";
import {
	PosterFleetAlphaArrow,
	PosterFleetBetaDart,
	PosterFleetDeltaDart,
	PosterFleetGammaShuttle,
} from "./PosterHeroAssets";

type PosterFleetMotionProps = {
	reducedMotion: boolean;
	activeShipId?: PosterFleetShipId | null;
	activeRouteIds?: readonly PosterRouteStripeId[];
	motionEnabled: boolean;
	motionMode: PosterFleetMotionMode;
	motionResetToken: number;
	tourActive?: boolean;
	tourChoreography?: PosterTourChoreography | null;
};

const stripeLookup = new Map(stripes.map((stripe) => [stripe.id, stripe]));
const flightLookup = new Map(posterFlightPaths.map((path) => [path.id, path]));
const travelKeyframeTimes = [0, 0.28, 0.56, 0.82, 1];

function toMotionKeyframes(values: readonly number[]) {
	return [...values];
}

function toScenePercentKeyframes(values: readonly number[]) {
	return values.map((value) => `${value}%`);
}

function getCueDelay(path: PosterFlightPath, shipCue: PosterTourShipCue | null) {
	return Math.max(0, path.delay + (shipCue?.delayOffset ?? 0));
}

function getCuePaceMultiplier(
	shipCue: PosterTourShipCue | null,
	tourPaceMultiplier: number,
) {
	return (shipCue?.paceMultiplier ?? 1) * tourPaceMultiplier;
}

function shipCueAnimate(
	shipCue: PosterTourShipCue | null,
	motionEnabled: boolean,
	reducedMotion: boolean,
	motionMode: PosterFleetMotionMode,
) {
	if (!shipCue || !motionEnabled) {
		return {
			x: 0,
			y: 0,
			scale: 1,
			rotate: 0,
		};
	}

	const driftX = shipCue.driftX ?? 0;
	const driftY = shipCue.driftY ?? 0;
	const scaleBoost = shipCue.scaleBoost ?? 0;
	const rotateBias = shipCue.rotateBias ?? 0;

	if (reducedMotion) {
		return {
			x: driftX * 0.28,
			y: driftY * 0.28,
			scale: 1 + scaleBoost * 0.3,
			rotate: rotateBias * 0.32,
		};
	}

	if (motionMode === "orbit") {
		return {
			x: [0, driftX * 0.42, driftX, driftX * 0.22, 0],
			y: [0, driftY * 0.58, driftY, driftY * 0.24, 0],
			scale: [1, 1 + scaleBoost * 0.56, 1 + scaleBoost, 1 + scaleBoost * 0.34, 1],
			rotate: [0, rotateBias * 0.5, rotateBias, rotateBias * 0.26, 0],
		};
	}

	return {
		x: [0, driftX * 0.78, driftX * 0.26, 0],
		y: [0, driftY, driftY * 0.44, 0],
		scale: [1, 1 + scaleBoost, 1 + scaleBoost * 0.34, 1],
		rotate: [0, rotateBias, rotateBias * 0.3, 0],
	};
}

function renderFleetShip(
	shipId: PosterFleetShipId,
	reducedMotion: boolean,
	motionEnabled: boolean,
) {
	if (shipId === "fleet-beta") {
		return (
			<PosterFleetBetaDart
				reducedMotion={reducedMotion}
				motionEnabled={motionEnabled}
			/>
		);
	}

	if (shipId === "fleet-gamma") {
		return (
			<PosterFleetGammaShuttle
				reducedMotion={reducedMotion}
				motionEnabled={motionEnabled}
			/>
		);
	}

	if (shipId === "fleet-delta") {
		return (
			<PosterFleetDeltaDart
				reducedMotion={reducedMotion}
				motionEnabled={motionEnabled}
			/>
		);
	}

	return (
		<PosterFleetAlphaArrow
			reducedMotion={reducedMotion}
			motionEnabled={motionEnabled}
		/>
	);
}

function travelTransition(duration: number, delay: number) {
	return {
		duration,
		delay,
		repeat: Number.POSITIVE_INFINITY,
		ease: "easeInOut" as const,
		times: travelKeyframeTimes,
	};
}

function orbitTransition(
	duration: number,
	delay: number,
	times: readonly number[],
) {
	return {
		duration,
		delay,
		repeat: Number.POSITIVE_INFINITY,
		ease: "linear" as const,
		times: [...times],
	};
}

function signalSweepTransition(duration: number, delay: number) {
	return {
		duration: duration * 0.54,
		delay,
		repeat: Number.POSITIVE_INFINITY,
		repeatDelay: duration * 0.46,
		ease: "easeInOut" as const,
	};
}

function orbitShipAnimate(path: PosterFlightPath) {
	return {
		x: toScenePercentKeyframes(path.orbitLoop.xPercentKeyframes),
		y: toScenePercentKeyframes(path.orbitLoop.yPercentKeyframes),
		rotate: toMotionKeyframes(path.orbitLoop.rotateKeyframes),
		scale: toMotionKeyframes(path.orbitLoop.scaleKeyframes),
		opacity: toMotionKeyframes(path.orbitLoop.opacityKeyframes),
	};
}

function orbitSignalAnimate(path: PosterFlightPath) {
	return {
		x: toScenePercentKeyframes(path.orbitLoop.xPercentKeyframes),
		y: toScenePercentKeyframes(path.orbitLoop.yPercentKeyframes),
		scale: toMotionKeyframes(path.orbitLoop.scaleKeyframes),
		opacity: toMotionKeyframes(path.orbitLoop.opacityKeyframes),
	};
}

function orbitWakeAnimate(hasSelection: boolean) {
	const restingOpacity = hasSelection ? 0.24 : 0.32;

	return {
		opacity: [restingOpacity, 0.88, 0.08, 0.16, restingOpacity],
		scaleX: [0.82, 1.6, 0.12, 0.38, 0.82],
		scaleY: [0.92, 1.12, 0.58, 0.72, 0.92],
		y: [0, -2, -6, 3, 0],
		rotate: [0, -1.2, -3.8, 1.8, 0],
	};
}

function orbitWakeGlowAnimate() {
	return {
		x: [0, -4, -16, 10, 0],
		y: [0, -1, -4, 2, 0],
		scaleX: [0.94, 1.44, 0.16, 0.48, 0.94],
		scaleY: [1, 1.12, 0.64, 0.78, 1],
		opacity: [0.66, 0.96, 0.08, 0.22, 0.66],
	};
}

function orbitWakeBeamAnimate() {
	return {
		x: [0, -2, -20, 12, 0],
		y: [0, 0, -2, 1, 0],
		scaleX: [0.88, 1.78, 0.08, 0.44, 0.88],
		scaleY: [1, 1.06, 0.72, 0.86, 1],
		opacity: [0.54, 1, 0.04, 0.18, 0.54],
	};
}

function orbitWakeSparkAnimate(variant: "primary" | "secondary") {
	if (variant === "secondary") {
		return {
			x: [0, 2, -14, 8, 0],
			y: [0, 1, -4, -1, 0],
			scale: [0.86, 1.28, 0.16, 0.5, 0.86],
			opacity: [0.38, 0.84, 0, 0.22, 0.38],
		};
	}

	return {
		x: [0, -2, -18, 10, 0],
		y: [0, -1, -6, 2, 0],
		scale: [0.92, 1.48, 0.18, 0.58, 0.92],
		opacity: [0.52, 1, 0, 0.26, 0.52],
	};
}

const restingWakeGlowAnimate = {
	x: 0,
	y: 0,
	scaleX: 1,
	scaleY: 1,
	opacity: 0.88,
};

const restingWakeBeamAnimate = {
	x: 0,
	y: 0,
	scaleX: 1,
	scaleY: 1,
	opacity: 0.92,
};

const restingWakePrimarySparkAnimate = {
	x: 0,
	y: 0,
	scale: 1,
	opacity: 0.84,
};

const restingWakeSecondarySparkAnimate = {
	x: 0,
	y: 0,
	scale: 1,
	opacity: 0.72,
};

function PosterFlightRig({
	activeShipId,
	children,
	flightId,
	hasSelection,
	motionEnabled,
	motionMode,
	reducedMotion,
	shipCue,
	tourActive,
	tourFeaturedShipId,
	tourPaceMultiplier,
}: {
	activeShipId: PosterFleetShipId | null;
	children: ReactNode;
	flightId: PosterFleetShipId;
	hasSelection: boolean;
	motionEnabled: boolean;
	motionMode: PosterFleetMotionMode;
	reducedMotion: boolean;
	shipCue: PosterTourShipCue | null;
	tourActive: boolean;
	tourFeaturedShipId: PosterFleetShipId | null;
	tourPaceMultiplier: number;
}) {
	const path = flightLookup.get(flightId);

	if (!path) {
		return null;
	}

	const isActive = activeShipId === flightId;
	const isGuided = tourActive && shipCue !== null;
	const isFeatured = tourActive && tourFeaturedShipId === flightId;
	const adjustedDelay = getCueDelay(path, shipCue);
	const adjustedPaceMultiplier = getCuePaceMultiplier(
		shipCue,
		tourPaceMultiplier,
	);
	const rigStateClass = isActive
		? " poster-flight-rig--active"
		: isFeatured
			? " poster-flight-rig--featured"
			: isGuided
				? " poster-flight-rig--guided"
		: hasSelection
			? " poster-flight-rig--observed"
			: "";
	const wakeStateClass = isActive
		? " poster-flight-wake--active"
		: isFeatured
			? " poster-flight-wake--featured"
			: isGuided
				? " poster-flight-wake--guided"
		: hasSelection
			? " poster-flight-wake--observed"
			: "";

	const wakeStyle = {
		"--wake-accent": path.wakeAccent,
		"--wake-glow": path.wakeGlow,
		"--wake-spark": path.wakeSpark,
		"--orbit-wake-duration": `${path.orbitLoop.duration}s`,
		"--orbit-wake-delay": `${adjustedDelay + 0.06}s`,
		zIndex: isActive ? path.zIndex + 4 : isFeatured ? path.zIndex + 3 : path.zIndex,
	} as CSSProperties;
	const orbitWakeActive =
		motionEnabled && !reducedMotion && motionMode === "orbit";

	return (
		<motion.div
			className={`poster-flight-rig poster-flight-rig--${path.id}${rigStateClass}`}
			style={wakeStyle}
			initial={false}
			animate={
				!motionEnabled
					? {
							x: 0,
							y: 0,
							rotate: 0,
							scale: 1,
						}
					: reducedMotion
						? {
								opacity: [0.94, 1, 0.94],
								scale: [1, 1.01, 1],
							}
						: motionMode === "orbit"
							? orbitShipAnimate(path)
							: {
									x: toMotionKeyframes(path.xKeyframes),
									y: toMotionKeyframes(path.yKeyframes),
									rotate: toMotionKeyframes(path.rotateKeyframes),
									scale: toMotionKeyframes(path.scaleKeyframes),
								}
			}
			transition={
				!motionEnabled
					? { duration: 0.28, ease: "easeOut" as const }
					: reducedMotion
						? slowFloat(path.duration * adjustedPaceMultiplier * 1.15, adjustedDelay)
						: motionMode === "orbit"
							? orbitTransition(
									path.orbitLoop.duration * adjustedPaceMultiplier,
									adjustedDelay,
									path.orbitLoop.times,
								)
							: travelTransition(
									path.duration * adjustedPaceMultiplier,
									adjustedDelay,
								)
			}
		>
			<motion.div
				className={`poster-flight-wake poster-flight-wake--${path.id}${wakeStateClass}${
					orbitWakeActive ? " poster-flight-wake--orbit" : ""
				}`}
				initial={false}
				animate={
					!motionEnabled
						? {
								opacity: hasSelection ? 0.2 : 0.28,
								scaleX: 0.82,
								scaleY: 0.92,
							}
						: reducedMotion
							? {
									opacity: [0.26, 0.42, 0.26],
									scaleX: [0.86, 0.98, 0.86],
								}
							: motionMode === "orbit"
								? orbitWakeAnimate(hasSelection)
								: {
										opacity: [0.18, 0.76, 0.22],
										scaleX: [0.64, 1.14, 0.58],
										scaleY: [0.9, 1, 0.82],
									}
				}
				transition={
					!motionEnabled
						? { duration: 0.24, ease: "easeOut" as const }
						: reducedMotion
							? slowFloat(
									path.duration * adjustedPaceMultiplier * 0.52,
									adjustedDelay + 0.12,
								)
							: motionMode === "orbit"
								? orbitTransition(
										path.orbitLoop.duration * adjustedPaceMultiplier,
										adjustedDelay + 0.06,
										path.orbitLoop.times,
									)
								: slowFloat(
										path.duration * adjustedPaceMultiplier * 0.52,
										adjustedDelay + 0.12,
									)
				}
			>
				<motion.span
					className="poster-flight-wake__glow"
					initial={false}
					style={{ transformOrigin: "right center" }}
					animate={
						orbitWakeActive ? orbitWakeGlowAnimate() : restingWakeGlowAnimate
					}
					transition={
						orbitWakeActive
							? orbitTransition(
									path.orbitLoop.duration * adjustedPaceMultiplier,
									adjustedDelay + 0.02,
									path.orbitLoop.times,
								)
							: { duration: 0.24, ease: "easeOut" as const }
					}
				/>
				<motion.span
					className="poster-flight-wake__beam"
					initial={false}
					style={{ transformOrigin: "right center" }}
					animate={
						orbitWakeActive ? orbitWakeBeamAnimate() : restingWakeBeamAnimate
					}
					transition={
						orbitWakeActive
							? orbitTransition(
									path.orbitLoop.duration * adjustedPaceMultiplier,
									adjustedDelay + 0.04,
									path.orbitLoop.times,
								)
							: { duration: 0.24, ease: "easeOut" as const }
					}
				/>
				<motion.span
					className="poster-flight-wake__spark poster-flight-wake__spark--1"
					initial={false}
					animate={
						orbitWakeActive
							? orbitWakeSparkAnimate("primary")
							: restingWakePrimarySparkAnimate
					}
					transition={
						orbitWakeActive
							? orbitTransition(
									path.orbitLoop.duration * adjustedPaceMultiplier,
									adjustedDelay + 0.03,
									path.orbitLoop.times,
								)
							: { duration: 0.24, ease: "easeOut" as const }
					}
				/>
				<motion.span
					className="poster-flight-wake__spark poster-flight-wake__spark--2"
					initial={false}
					animate={
						orbitWakeActive
							? orbitWakeSparkAnimate("secondary")
							: restingWakeSecondarySparkAnimate
					}
					transition={
						orbitWakeActive
							? orbitTransition(
									path.orbitLoop.duration * adjustedPaceMultiplier,
									adjustedDelay + 0.08,
									path.orbitLoop.times,
								)
							: { duration: 0.24, ease: "easeOut" as const }
					}
				/>
			</motion.div>
			<motion.div
				className={`poster-flight-rig__ship${
					isGuided ? " poster-flight-rig__ship--guided" : ""
				}${isFeatured ? " poster-flight-rig__ship--featured" : ""}`}
				initial={false}
				animate={shipCueAnimate(shipCue, motionEnabled, reducedMotion, motionMode)}
				transition={
					!shipCue || !motionEnabled
						? { duration: 0.24, ease: "easeOut" as const }
						: reducedMotion
							? slowFloat(path.duration * adjustedPaceMultiplier * 0.44, adjustedDelay)
							: motionMode === "orbit"
								? orbitTransition(
										path.orbitLoop.duration * adjustedPaceMultiplier,
										adjustedDelay,
										path.orbitLoop.times,
									)
								: {
										duration: path.duration * adjustedPaceMultiplier * 0.76,
										delay: adjustedDelay + 0.04,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut" as const,
										times: [0, 0.46, 0.78, 1],
									}
				}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}

function PosterRouteSignalRig({
	children,
	motionEnabled,
	motionMode,
	path,
	reducedMotion,
	zIndex,
}: {
	children: ReactNode;
	motionEnabled: boolean;
	motionMode: PosterFleetMotionMode;
	path: PosterFlightPath;
	reducedMotion: boolean;
	zIndex: number;
}) {
	const rigStyle = {
		zIndex,
	} as CSSProperties;

	return (
		<motion.div
			className={`poster-route-signal-rig poster-route-signal-rig--${path.id}`}
			style={rigStyle}
			initial={false}
			animate={
				!motionEnabled || reducedMotion || motionMode !== "orbit"
					? {
							x: "0%",
							y: "0%",
							scale: 1,
							opacity: 1,
						}
					: orbitSignalAnimate(path)
			}
			transition={
				motionEnabled && !reducedMotion && motionMode === "orbit"
					? orbitTransition(
							path.orbitLoop.duration,
							path.delay,
							path.orbitLoop.times,
						)
					: { duration: 0.24, ease: "easeOut" as const }
			}
		>
			{children}
		</motion.div>
	);
}

function PosterRouteSignals({
	activeRouteIds = [],
	activeShipId = null,
	motionEnabled,
	motionMode,
	motionResetToken,
	reducedMotion,
}: PosterFleetMotionProps) {
	const hasSelection = activeShipId !== null || activeRouteIds.length > 0;

	return (
		<>
			{posterRouteSignals.map((signal) => {
				const stripe = stripeLookup.get(signal.stripeId);
				const path = flightLookup.get(signal.shipId);

				if (!stripe || !path) {
					return null;
				}

				const isHighlighted =
					activeShipId === signal.shipId ||
					activeRouteIds.includes(signal.stripeId);
				const signalStateClass = isHighlighted
					? " poster-route-signal--active"
					: hasSelection
						? " poster-route-signal--observed"
						: "";

				const signalStyle = {
					"--route-accent": signal.accent,
					"--route-glow": signal.glow,
					"--route-beam": signal.beam,
					"--route-node": signal.node,
					top: stripe.top,
					left: stripe.left,
					width: stripe.width,
					height: stripe.height,
				} as CSSProperties;
				const signalZIndex = stripe.zIndex + (signal.zIndexBoost ?? 3);

				return (
					<PosterRouteSignalRig
						key={`${signal.id}-${motionResetToken}`}
						motionEnabled={motionEnabled}
						motionMode={motionMode}
						path={path}
						reducedMotion={reducedMotion}
						zIndex={signalZIndex}
					>
						<motion.div
							className={`poster-route-signal poster-route-signal--${signal.id}${signalStateClass}`}
							style={signalStyle}
							initial={false}
							animate={
								!motionEnabled
									? isHighlighted
										? {
												opacity: 0.42,
												scaleX: 1,
											}
										: hasSelection
											? {
													opacity: 0.08,
													scaleX: 1,
												}
											: {
													opacity: 0.2,
													scaleX: 1,
												}
									: reducedMotion
										? isHighlighted
											? {
													opacity: [0.34, 0.54, 0.34],
													scaleX: [1, 1.04, 1],
												}
											: hasSelection
												? {
														opacity: [0.08, 0.14, 0.08],
														scaleX: [0.98, 0.99, 0.98],
													}
												: {
														opacity: [0.2, 0.34, 0.2],
														scaleX: [0.98, 1.01, 0.98],
													}
										: isHighlighted
											? {
													opacity: [0.32, 0.88, 0.34],
													scaleX: [0.98, 1.08, 1],
												}
											: hasSelection
												? {
														opacity: [0.04, 0.12, 0.05],
														scaleX: [0.98, 1, 0.98],
													}
												: {
														opacity: [0.14, 0.56, 0.18],
														scaleX: [0.96, 1.04, 0.97],
													}
							}
							transition={
								motionEnabled
									? slowFloat(
											path.duration * 0.58,
											path.delay + (signal.phaseOffset ?? 0),
										)
									: { duration: 0.24, ease: "easeOut" as const }
							}
						>
							<span className="poster-route-signal__glow" />
							<span className="poster-route-signal__line" />
							<motion.span
								className="poster-route-signal__sweep"
								initial={false}
								animate={
									reducedMotion || !isHighlighted || !motionEnabled
										? undefined
										: {
												x: ["-18%", "8%", "18%"],
												opacity: [0, 1, 0],
											}
								}
								transition={signalSweepTransition(
									path.duration,
									path.delay + (signal.phaseOffset ?? 0),
								)}
							/>
							{signal.markerFractions.map((fraction, index) => (
								<motion.span
									key={`${signal.id}-${fraction}`}
									className="poster-route-signal__node"
									style={{ left: `${fraction}%` }}
									initial={false}
									animate={
										!motionEnabled
											? isHighlighted
												? {
														opacity: 0.88,
														scale: 1,
													}
												: hasSelection
													? {
															opacity: 0.16,
															scale: 0.92,
														}
													: {
															opacity: 0.52,
															scale: 0.96,
														}
											: reducedMotion
												? isHighlighted
													? {
															opacity: [0.54, 0.88, 0.54],
															scale: [1, 1.14, 1],
														}
													: hasSelection
														? {
																opacity: [0.16, 0.24, 0.16],
																scale: [0.92, 1, 0.92],
															}
														: {
																opacity: [0.42, 0.7, 0.42],
																scale: [1, 1.08, 1],
															}
												: isHighlighted
													? {
															opacity: [0.34, 0.98, 0.38],
															scale: [0.88, 1.36, 0.92],
														}
													: hasSelection
														? {
																opacity: [0.08, 0.18, 0.08],
																scale: [0.84, 0.94, 0.84],
															}
														: {
																opacity: [0.28, 0.94, 0.34],
																scale: [0.86, 1.28, 0.9],
															}
									}
									transition={
										motionEnabled
											? slowFloat(
													path.duration * 0.34,
													path.delay + (signal.phaseOffset ?? 0) + index * 0.12,
												)
											: { duration: 0.24, ease: "easeOut" as const }
									}
								/>
							))}
						</motion.div>
					</PosterRouteSignalRig>
				);
			})}
		</>
	);
}

export function PosterFleetMotion({
	activeRouteIds = [],
	activeShipId = null,
	motionEnabled,
	motionMode,
	motionResetToken,
	reducedMotion,
	tourActive = false,
	tourChoreography = null,
}: PosterFleetMotionProps) {
	const hasSelection = activeShipId !== null || activeRouteIds.length > 0;
	const shipCueLookup = new Map(
		(tourChoreography?.shipCues ?? []).map((shipCue) => [shipCue.shipId, shipCue]),
	);
	const tourFeaturedShipId = tourChoreography?.featuredShipId ?? null;
	const tourPaceMultiplier = tourChoreography?.fleetPaceMultiplier ?? 1;

	return (
		<>
			<PosterRouteSignals
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				activeRouteIds={activeRouteIds}
				motionEnabled={motionEnabled}
				motionMode={motionMode}
				motionResetToken={motionResetToken}
			/>
			<PosterFlightRig
				key={`fleet-alpha-${motionResetToken}`}
				flightId="fleet-alpha"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
				motionEnabled={motionEnabled}
				motionMode={motionMode}
				shipCue={shipCueLookup.get("fleet-alpha") ?? null}
				tourActive={tourActive}
				tourFeaturedShipId={tourFeaturedShipId}
				tourPaceMultiplier={tourPaceMultiplier}
			>
				{renderFleetShip("fleet-alpha", reducedMotion, motionEnabled)}
			</PosterFlightRig>
			<PosterFlightRig
				key={`fleet-beta-${motionResetToken}`}
				flightId="fleet-beta"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
				motionEnabled={motionEnabled}
				motionMode={motionMode}
				shipCue={shipCueLookup.get("fleet-beta") ?? null}
				tourActive={tourActive}
				tourFeaturedShipId={tourFeaturedShipId}
				tourPaceMultiplier={tourPaceMultiplier}
			>
				{renderFleetShip("fleet-beta", reducedMotion, motionEnabled)}
			</PosterFlightRig>
			<PosterFlightRig
				key={`fleet-gamma-${motionResetToken}`}
				flightId="fleet-gamma"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
				motionEnabled={motionEnabled}
				motionMode={motionMode}
				shipCue={shipCueLookup.get("fleet-gamma") ?? null}
				tourActive={tourActive}
				tourFeaturedShipId={tourFeaturedShipId}
				tourPaceMultiplier={tourPaceMultiplier}
			>
				{renderFleetShip("fleet-gamma", reducedMotion, motionEnabled)}
			</PosterFlightRig>
			<PosterFlightRig
				key={`fleet-delta-${motionResetToken}`}
				flightId="fleet-delta"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
				motionEnabled={motionEnabled}
				motionMode={motionMode}
				shipCue={shipCueLookup.get("fleet-delta") ?? null}
				tourActive={tourActive}
				tourFeaturedShipId={tourFeaturedShipId}
				tourPaceMultiplier={tourPaceMultiplier}
			>
				{renderFleetShip("fleet-delta", reducedMotion, motionEnabled)}
			</PosterFlightRig>
		</>
	);
}
