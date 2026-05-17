import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import {
	posterFlightPaths,
	posterRouteSignals,
	type PosterFleetShipId,
	type PosterRouteStripeId,
} from "../../lib/posterFlightPaths";
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
};

const stripeLookup = new Map(stripes.map((stripe) => [stripe.id, stripe]));
const flightLookup = new Map(posterFlightPaths.map((path) => [path.id, path]));
const travelKeyframeTimes = [0, 0.28, 0.56, 0.82, 1];

function toMotionKeyframes(values: readonly number[]) {
	return [...values];
}

function renderFleetShip(shipId: PosterFleetShipId, reducedMotion: boolean) {
	if (shipId === "fleet-beta") {
		return <PosterFleetBetaDart reducedMotion={reducedMotion} />;
	}

	if (shipId === "fleet-gamma") {
		return <PosterFleetGammaShuttle reducedMotion={reducedMotion} />;
	}

	if (shipId === "fleet-delta") {
		return <PosterFleetDeltaDart reducedMotion={reducedMotion} />;
	}

	return <PosterFleetAlphaArrow reducedMotion={reducedMotion} />;
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

function signalSweepTransition(duration: number, delay: number) {
	return {
		duration: duration * 0.54,
		delay,
		repeat: Number.POSITIVE_INFINITY,
		repeatDelay: duration * 0.46,
		ease: "easeInOut" as const,
	};
}

function PosterFlightRig({
	activeShipId,
	children,
	flightId,
	hasSelection,
	reducedMotion,
}: {
	activeShipId: PosterFleetShipId | null;
	children: ReactNode;
	flightId: PosterFleetShipId;
	hasSelection: boolean;
	reducedMotion: boolean;
}) {
	const path = flightLookup.get(flightId);

	if (!path) {
		return null;
	}

	const isActive = activeShipId === flightId;
	const rigStateClass = isActive
		? " poster-flight-rig--active"
		: hasSelection
			? " poster-flight-rig--observed"
			: "";
	const wakeStateClass = isActive
		? " poster-flight-wake--active"
		: hasSelection
			? " poster-flight-wake--observed"
			: "";

	const wakeStyle = {
		"--wake-accent": path.wakeAccent,
		"--wake-glow": path.wakeGlow,
		"--wake-spark": path.wakeSpark,
		zIndex: isActive ? path.zIndex + 4 : path.zIndex,
	} as CSSProperties;

	return (
		<motion.div
			className={`poster-flight-rig poster-flight-rig--${path.id}${rigStateClass}`}
			style={wakeStyle}
			initial={false}
			animate={
				reducedMotion
					? {
							opacity: [0.94, 1, 0.94],
							scale: [1, 1.01, 1],
						}
					: {
							x: toMotionKeyframes(path.xKeyframes),
							y: toMotionKeyframes(path.yKeyframes),
							rotate: toMotionKeyframes(path.rotateKeyframes),
							scale: toMotionKeyframes(path.scaleKeyframes),
						}
			}
			transition={
				reducedMotion
					? slowFloat(path.duration * 1.15, path.delay)
					: travelTransition(path.duration, path.delay)
			}
		>
			<motion.div
				className={`poster-flight-wake poster-flight-wake--${path.id}${wakeStateClass}`}
				initial={false}
				animate={
					reducedMotion
						? {
								opacity: [0.26, 0.42, 0.26],
								scaleX: [0.86, 0.98, 0.86],
							}
						: {
								opacity: [0.18, 0.76, 0.22],
								scaleX: [0.64, 1.14, 0.58],
								scaleY: [0.9, 1, 0.82],
							}
				}
				transition={slowFloat(path.duration * 0.52, path.delay + 0.12)}
			>
				<span className="poster-flight-wake__glow" />
				<span className="poster-flight-wake__beam" />
				<span className="poster-flight-wake__spark poster-flight-wake__spark--1" />
				<span className="poster-flight-wake__spark poster-flight-wake__spark--2" />
			</motion.div>
			{children}
		</motion.div>
	);
}

function PosterRouteSignals({
	activeRouteIds = [],
	activeShipId = null,
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
					zIndex: stripe.zIndex + (signal.zIndexBoost ?? 3),
				} as CSSProperties;

				return (
					<motion.div
						key={signal.id}
						className={`poster-route-signal poster-route-signal--${signal.id}${signalStateClass}`}
						style={signalStyle}
						initial={false}
						animate={
							reducedMotion
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
						transition={slowFloat(
							path.duration * 0.58,
							path.delay + (signal.phaseOffset ?? 0),
						)}
					>
						<span className="poster-route-signal__glow" />
						<span className="poster-route-signal__line" />
						<motion.span
							className="poster-route-signal__sweep"
							initial={false}
							animate={
								reducedMotion || !isHighlighted
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
									reducedMotion
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
								transition={slowFloat(
									path.duration * 0.34,
									path.delay + (signal.phaseOffset ?? 0) + index * 0.12,
								)}
							/>
						))}
					</motion.div>
				);
			})}
		</>
	);
}

export function PosterFleetMotion({
	activeRouteIds = [],
	activeShipId = null,
	reducedMotion,
}: PosterFleetMotionProps) {
	const hasSelection = activeShipId !== null || activeRouteIds.length > 0;

	return (
		<>
			<PosterRouteSignals
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				activeRouteIds={activeRouteIds}
			/>
			<PosterFlightRig
				flightId="fleet-alpha"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
			>
				{renderFleetShip("fleet-alpha", reducedMotion)}
			</PosterFlightRig>
			<PosterFlightRig
				flightId="fleet-beta"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
			>
				{renderFleetShip("fleet-beta", reducedMotion)}
			</PosterFlightRig>
			<PosterFlightRig
				flightId="fleet-gamma"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
			>
				{renderFleetShip("fleet-gamma", reducedMotion)}
			</PosterFlightRig>
			<PosterFlightRig
				flightId="fleet-delta"
				reducedMotion={reducedMotion}
				activeShipId={activeShipId}
				hasSelection={hasSelection}
			>
				{renderFleetShip("fleet-delta", reducedMotion)}
			</PosterFlightRig>
		</>
	);
}
