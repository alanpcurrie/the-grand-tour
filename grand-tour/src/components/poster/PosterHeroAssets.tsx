import { motion } from "motion/react";
import type { ReactNode } from "react";

import { slowFloat } from "../../lib/motionPresets";

type HeroAssetProps = {
	reducedMotion: boolean;
};

type StripeAssetProps = HeroAssetProps & {
	assetId: string;
	className: string;
	drift: number;
	duration: number;
	delay?: number;
	children?: ReactNode;
};

type ShipAssetProps = HeroAssetProps & {
	ariaLabel: string;
	assetId: string;
	className: string;
	delay?: number;
	drift: number;
	rotation: number;
	children: ReactNode;
	duration: number;
	viewBox?: string;
};

type OrbitAssetProps = HeroAssetProps & {
	assetId: string;
	className: string;
	delay?: number;
	duration: number;
	rotateDelta: number;
	restingRotate: number;
	children: ReactNode;
};

type PlanetAccentAssetProps = HeroAssetProps & {
	assetId: string;
	className: string;
	delay?: number;
	driftX: number;
	driftY: number;
	duration: number;
	scalePulse?: number;
	children: ReactNode;
};

const POSTER_SCENE_VIEWBOX = {
	width: 1067,
	height: 1600,
} as const;

const POSTER_BOARD_FRAME = {
	width: 768,
	height: 1086,
} as const;

const POSTER_MAIN_PLANET_FRAME = {
	topPercent: 18.6,
	leftPercent: 15.2,
	sizePercent: 60.5,
} as const;

const POSTER_MAIN_PLANET_HEIGHT_PERCENT =
	(POSTER_MAIN_PLANET_FRAME.sizePercent * POSTER_BOARD_FRAME.width) /
	POSTER_BOARD_FRAME.height;

const POSTER_MAIN_PLANET_CENTER_PERCENT = {
	x:
		POSTER_MAIN_PLANET_FRAME.leftPercent +
		POSTER_MAIN_PLANET_FRAME.sizePercent / 2,
	y:
		POSTER_MAIN_PLANET_FRAME.topPercent + POSTER_MAIN_PLANET_HEIGHT_PERCENT / 2,
} as const;

const POSTER_SHARED_PLANET_CENTER = {
	x: (POSTER_SCENE_VIEWBOX.width * POSTER_MAIN_PLANET_CENTER_PERCENT.x) / 100,
	y: (POSTER_SCENE_VIEWBOX.height * POSTER_MAIN_PLANET_CENTER_PERCENT.y) / 100,
} as const;

const POSTER_ORBIT_SYSTEM_CENTER = {
	x: 556,
	y: 792,
} as const;

const POSTER_VIOLET_RIGHT_MASS = {
	centerX: 1174,
	centerY: POSTER_SHARED_PLANET_CENTER.y,
	radius: 448,
	shadowRadius: 414,
	rimRadius: 392,
	lensX: 928,
	lensY: POSTER_SHARED_PLANET_CENTER.y + 42,
	coreX: 924,
	coreY: POSTER_SHARED_PLANET_CENTER.y + 42,
} as const;

function PosterStripeAsset({
	assetId,
	children,
	className,
	delay = 0,
	drift,
	duration,
	reducedMotion,
}: StripeAssetProps) {
	return (
		<motion.div
			className={`poster-asset ${className}`}
			data-asset-id={assetId}
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							x: [0, drift, 0],
							opacity: [0.82, 1, 0.82],
						}
			}
			transition={slowFloat(duration, delay)}
		>
			{children}
		</motion.div>
	);
}

function PosterShipAsset({
	ariaLabel,
	assetId,
	children,
	className,
	delay = 0,
	drift,
	duration,
	reducedMotion,
	rotation,
	viewBox = "0 0 320 132",
}: ShipAssetProps) {
	return (
		<motion.div
			className={`poster-asset ${className}`}
			data-asset-id={assetId}
			initial={false}
			animate={
				reducedMotion
					? { rotate: rotation, scale: 1 }
					: {
							x: [0, drift, 0],
							y: [0, -10, 0],
							rotate: [rotation, rotation - 1.3, rotation],
							scale: [1, 1.02, 1],
						}
			}
			transition={slowFloat(duration, delay)}
		>
			<motion.svg viewBox={viewBox} role="img" aria-label={ariaLabel}>
				{children}
			</motion.svg>
		</motion.div>
	);
}

function PosterOrbitAsset({
	assetId,
	children,
	className,
	delay = 0,
	duration,
	reducedMotion,
	rotateDelta,
	restingRotate,
}: OrbitAssetProps) {
	return (
		<motion.div
			className={`poster-asset ${className}`}
			data-asset-id={assetId}
			initial={false}
			animate={
				reducedMotion
					? { rotate: restingRotate }
					: {
							rotate: [
								restingRotate,
								restingRotate + rotateDelta,
								restingRotate,
							],
						}
			}
			transition={slowFloat(duration, delay)}
		>
			{children}
		</motion.div>
	);
}

function PosterPlanetAccentAsset({
	assetId,
	children,
	className,
	delay = 0,
	driftX,
	driftY,
	duration,
	reducedMotion,
	scalePulse = 1.03,
}: PlanetAccentAssetProps) {
	return (
		<motion.div
			className={`poster-asset ${className}`}
			data-asset-id={assetId}
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							x: [0, driftX, 0],
							y: [0, driftY, 0],
							scale: [1, scalePulse, 1],
							opacity: [0.84, 1, 0.84],
						}
			}
			transition={slowFloat(duration, delay)}
		>
			{children}
		</motion.div>
	);
}

export function PosterPaperField() {
	return (
		<>
			<div className="poster-paper-field" />
			<div className="poster-paper-noise" />
			<div className="poster-vignette" />
		</>
	);
}

export function PosterRedSunCore({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--sun-core"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -3, 0],
							scale: [1, 1.025, 1],
						}
			}
			transition={slowFloat(12)}
		>
			<div className="poster-asset-sun-core__glow" />
			<div className="poster-asset-sun-core__trail" />
			<div className="poster-asset-sun-core__disc" />
			<div className="poster-asset-sun-core__core" />
			<div className="poster-asset-sun-core__ring" />
		</motion.div>
	);
}

export function PosterTurquoiseLens({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--turquoise-lens"
			data-asset-id="turquoise-lens"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -6, 0],
							opacity: [0.68, 0.82, 0.68],
							scale: [1, 1.018, 1],
						}
			}
			transition={slowFloat(17, 0.3)}
		>
			<svg
				viewBox="0 0 640 640"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<clipPath id="turquoise-lens-clip">
						<circle cx="320" cy="320" r="304" />
					</clipPath>
					<radialGradient id="turquoise-lens-halo" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#d8fbff" stopOpacity="0.08" />
						<stop offset="58%" stopColor="#55d7de" stopOpacity="0.18" />
						<stop offset="100%" stopColor="#0198ad" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="turquoise-lens-body" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#85edf3" stopOpacity="0.12" />
						<stop offset="62%" stopColor="#16b2bf" stopOpacity="0.42" />
						<stop offset="100%" stopColor="#0198ad" stopOpacity="0.74" />
					</radialGradient>
					<radialGradient id="turquoise-lens-core" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f4feff" stopOpacity="0.18" />
						<stop offset="58%" stopColor="#f4feff" stopOpacity="0.08" />
						<stop offset="100%" stopColor="#f4feff" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle
					cx="320"
					cy="320"
					r="320"
					fill="url(#turquoise-lens-halo)"
					opacity="0.78"
				/>
				<circle
					cx="320"
					cy="320"
					r="304"
					fill="url(#turquoise-lens-body)"
					opacity="0.88"
				/>
				<g clipPath="url(#turquoise-lens-clip)" opacity="0.76">
					{[
						{
							x: -18,
							y: 224,
							width: 690,
							height: 18,
							fill: "rgba(251, 171, 80, 0.18)",
						},
						{
							x: -12,
							y: 244,
							width: 678,
							height: 10,
							fill: "rgba(252, 245, 231, 0.26)",
						},
						{
							x: -20,
							y: 264,
							width: 692,
							height: 42,
							fill: "rgba(72, 58, 63, 0.18)",
						},
						{
							x: 24,
							y: 334,
							width: 608,
							height: 16,
							fill: "rgba(156, 190, 92, 0.18)",
						},
						{
							x: 42,
							y: 388,
							width: 560,
							height: 12,
							fill: "rgba(231, 91, 59, 0.14)",
						},
					].map((band) => (
						<rect
							key={`turquoise-lens-band-${band.y}-${band.height}`}
							x={band.x}
							y={band.y}
							width={band.width}
							height={band.height}
							rx={band.height / 2}
							fill={band.fill}
						/>
					))}
				</g>
				<circle
					cx="320"
					cy="320"
					r="228"
					fill="url(#turquoise-lens-core)"
					opacity="0.72"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterMainGreenBody({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--main-green"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -8, 0],
							scale: [1, 1.014, 1],
						}
			}
			transition={slowFloat(20, 0.2)}
		>
			<svg
				viewBox="0 0 600 600"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<clipPath id="main-green-clip">
						<circle cx="300" cy="300" r="300" />
					</clipPath>
					<radialGradient id="main-green-shell" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#1f8d63" stopOpacity="0.98" />
						<stop offset="62%" stopColor="#0f7457" stopOpacity="0.98" />
						<stop offset="100%" stopColor="#044a36" stopOpacity="0.98" />
					</radialGradient>
					<radialGradient id="main-green-shadow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#043d2e" stopOpacity="0" />
						<stop offset="72%" stopColor="#043d2e" stopOpacity="0.14" />
						<stop offset="100%" stopColor="#022c22" stopOpacity="0.4" />
					</radialGradient>
					<radialGradient id="main-green-highlight" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#c2e9d6" stopOpacity="0.16" />
						<stop offset="56%" stopColor="#c2e9d6" stopOpacity="0.06" />
						<stop offset="100%" stopColor="#c2e9d6" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="main-green-sheen" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#22a07a" stopOpacity="0" />
						<stop offset="68%" stopColor="#0b6a50" stopOpacity="0" />
						<stop offset="100%" stopColor="#043d2e" stopOpacity="0.24" />
					</radialGradient>
				</defs>
				<circle cx="300" cy="300" r="300" fill="url(#main-green-shell)" />
				<g clipPath="url(#main-green-clip)" opacity="0.84">
					<rect
						x="102"
						y="-120"
						width="84"
						height="860"
						fill="rgba(5, 58, 53, 0.22)"
						transform="rotate(34 144 310)"
					/>
					<rect
						x="164"
						y="-168"
						width="24"
						height="930"
						fill="rgba(0, 152, 154, 0.14)"
						transform="rotate(34 176 300)"
					/>
					{[
						{
							x: -26,
							y: 218,
							width: 664,
							height: 18,
							fill: "rgba(252, 243, 224, 0.16)",
						},
						{
							x: -34,
							y: 238,
							width: 676,
							height: 22,
							fill: "rgba(244, 138, 71, 0.18)",
						},
						{
							x: -26,
							y: 262,
							width: 668,
							height: 48,
							fill: "rgba(74, 59, 64, 0.18)",
						},
						{
							x: -18,
							y: 388,
							width: 654,
							height: 20,
							fill: "rgba(156, 190, 92, 0.2)",
						},
						{
							x: -20,
							y: 454,
							width: 646,
							height: 16,
							fill: "rgba(59, 37, 51, 0.14)",
						},
						{
							x: 18,
							y: 484,
							width: 594,
							height: 12,
							fill: "rgba(95, 204, 212, 0.12)",
						},
					].map((band) => (
						<rect
							key={`main-green-band-${band.y}-${band.height}`}
							x={band.x}
							y={band.y}
							width={band.width}
							height={band.height}
							rx={band.height / 2}
							fill={band.fill}
						/>
					))}
				</g>
				<circle
					cx="300"
					cy="300"
					r="286"
					fill="url(#main-green-shadow)"
					opacity="0.92"
				/>
				<circle
					cx="300"
					cy="300"
					r="300"
					fill="url(#main-green-highlight)"
					opacity="0.64"
				/>
				<circle
					cx="300"
					cy="300"
					r="300"
					fill="url(#main-green-sheen)"
					opacity="0.8"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterYellowSweep({ reducedMotion }: HeroAssetProps) {
	return (
		<>
			<PosterPlanetAccentAsset
				assetId="accent-orbit-planet"
				className="poster-asset--accent-orbit-planet"
				driftX={-6}
				driftY={-5}
				duration={10}
				delay={0.2}
				reducedMotion={reducedMotion}
				scalePulse={1.05}
			>
				<svg
					viewBox="0 0 240 240"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
					focusable="false"
				>
					<defs>
						<clipPath id="accent-orbit-core-clip">
							<circle cx="120" cy="120" r="68" />
						</clipPath>
						<radialGradient
							id="accent-orbit-core-fill"
							cx="50%"
							cy="50%"
							r="50%"
						>
							<stop offset="0%" stopColor="#4ed3de" stopOpacity="0.96" />
							<stop offset="100%" stopColor="#1e98ad" stopOpacity="0.92" />
						</radialGradient>
					</defs>
					<circle cx="120" cy="120" r="108" fill="#f65d3a" opacity="0.96" />
					<circle
						cx="120"
						cy="120"
						r="88"
						fill="rgba(251, 178, 86, 0.22)"
						opacity="0.74"
					/>
					<circle
						cx="120"
						cy="120"
						r="68"
						fill="url(#accent-orbit-core-fill)"
					/>
					<motion.g
						clipPath="url(#accent-orbit-core-clip)"
						initial={false}
						animate={
							reducedMotion
								? undefined
								: {
										x: [0, 14, 0],
										opacity: [0.82, 1, 0.82],
									}
						}
						transition={slowFloat(8.5, 0.1)}
					>
						{[
							{ y: 60, height: 10, fill: "rgba(26, 131, 149, 0.52)" },
							{ y: 78, height: 14, fill: "rgba(252, 238, 214, 0.18)" },
							{ y: 98, height: 12, fill: "rgba(28, 114, 129, 0.46)" },
							{ y: 118, height: 16, fill: "rgba(252, 238, 214, 0.16)" },
							{ y: 142, height: 12, fill: "rgba(29, 109, 126, 0.42)" },
						].map((band) => (
							<rect
								key={`accent-orbit-band-${band.y}`}
								x="34"
								y={band.y}
								width="176"
								height={band.height}
								rx={band.height / 2}
								fill={band.fill}
							/>
						))}
					</motion.g>
					<circle
						cx="120"
						cy="120"
						r="68"
						fill="none"
						stroke="rgba(246, 239, 225, 0.24)"
						strokeWidth="4"
					/>
				</svg>
			</PosterPlanetAccentAsset>

			<PosterPlanetAccentAsset
				assetId="accent-left-horizon"
				className="poster-asset--accent-left-horizon"
				driftX={8}
				driftY={2}
				duration={15}
				delay={0.5}
				reducedMotion={reducedMotion}
				scalePulse={1.02}
			>
				<svg
					viewBox="0 0 320 320"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
					focusable="false"
				>
					<defs>
						<clipPath id="accent-left-horizon-clip">
							<circle cx="128" cy="168" r="124" />
						</clipPath>
						<radialGradient
							id="accent-left-horizon-shell"
							cx="40%"
							cy="44%"
							r="56%"
						>
							<stop offset="0%" stopColor="#ffc668" stopOpacity="0.98" />
							<stop offset="72%" stopColor="#f4a33b" stopOpacity="0.96" />
							<stop offset="100%" stopColor="#eb7f33" stopOpacity="0.94" />
						</radialGradient>
						<radialGradient
							id="accent-left-horizon-shadow"
							cx="54%"
							cy="58%"
							r="60%"
						>
							<stop offset="0%" stopColor="#8c4030" stopOpacity="0" />
							<stop offset="100%" stopColor="#7c332e" stopOpacity="0.24" />
						</radialGradient>
					</defs>
					<circle
						cx="128"
						cy="168"
						r="124"
						fill="url(#accent-left-horizon-shell)"
						opacity="0.92"
					/>
					<motion.g
						clipPath="url(#accent-left-horizon-clip)"
						initial={false}
						animate={
							reducedMotion
								? undefined
								: {
										x: [0, 20, 0],
										opacity: [0.8, 1, 0.8],
									}
						}
						transition={slowFloat(12.5, 0.2)}
					>
						{[
							{ y: 66, height: 14, fill: "rgba(241, 188, 83, 0.18)" },
							{ y: 88, height: 22, fill: "rgba(121, 93, 60, 0.26)" },
							{ y: 116, height: 18, fill: "rgba(242, 129, 65, 0.24)" },
							{ y: 142, height: 16, fill: "rgba(92, 98, 63, 0.3)" },
							{ y: 166, height: 14, fill: "rgba(242, 196, 90, 0.18)" },
							{ y: 190, height: 22, fill: "rgba(98, 78, 58, 0.24)" },
							{ y: 220, height: 18, fill: "rgba(244, 139, 72, 0.22)" },
						].map((band) => (
							<rect
								key={`accent-left-horizon-band-${band.y}`}
								x="-20"
								y={band.y}
								width="332"
								height={band.height}
								rx={band.height / 2}
								fill={band.fill}
							/>
						))}
					</motion.g>
					<circle
						cx="128"
						cy="168"
						r="124"
						fill="url(#accent-left-horizon-shadow)"
						opacity="0.46"
					/>
				</svg>
			</PosterPlanetAccentAsset>
		</>
	);
}

export function PosterMagentaRouteColumn({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--magenta-route-column"
			data-asset-id="magenta-route-column"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -4, 0],
							opacity: [0.72, 0.82, 0.72],
						}
			}
			transition={slowFloat(18, 0.15)}
		>
			<svg viewBox="0 0 1067 1600" aria-hidden="true" focusable="false">
				<defs>
					<linearGradient
						id="magenta-orbit-band"
						x1="0.22"
						x2="0.82"
						y1="0.08"
						y2="0.92"
					>
						<stop offset="0%" stopColor="#82355f" stopOpacity="0.72" />
						<stop offset="58%" stopColor="#69295a" stopOpacity="0.82" />
						<stop offset="100%" stopColor="#55244f" stopOpacity="0.8" />
					</linearGradient>
					<filter
						id="magenta-orbit-band-blur"
						x="-10%"
						y="-10%"
						width="120%"
						height="120%"
					>
						<feGaussianBlur stdDeviation="10" />
					</filter>
				</defs>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="156"
					ry="760"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="rgba(92, 33, 77, 0.16)"
					strokeWidth="52"
					strokeLinecap="round"
					filter="url(#magenta-orbit-band-blur)"
					opacity="0.22"
				/>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="156"
					ry="760"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="url(#magenta-orbit-band)"
					strokeWidth="28"
					strokeLinecap="round"
					opacity="0.72"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterOuterRightOrbitArc({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterOrbitAsset
			assetId="outer-right-orbit-arc"
			className="poster-asset--outer-right-orbit"
			duration={20}
			rotateDelta={0.8}
			reducedMotion={reducedMotion}
			restingRotate={0}
		>
			<svg viewBox="0 0 1067 1600" aria-hidden="true" focusable="false">
				<defs>
					<linearGradient
						id="outer-orbit-stroke"
						x1="0.18"
						x2="0.82"
						y1="0.06"
						y2="0.92"
					>
						<stop offset="0%" stopColor="#ea5456" stopOpacity="0.88" />
						<stop offset="58%" stopColor="#cb3947" stopOpacity="0.82" />
						<stop offset="100%" stopColor="#ba3043" stopOpacity="0.74" />
					</linearGradient>
					<filter
						id="outer-orbit-blur"
						x="-10%"
						y="-10%"
						width="120%"
						height="120%"
					>
						<feGaussianBlur stdDeviation="14" />
					</filter>
				</defs>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="226"
					ry="806"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="rgba(234, 84, 86, 0.16)"
					strokeWidth="82"
					strokeLinecap="round"
					filter="url(#outer-orbit-blur)"
					opacity="0.18"
				/>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="226"
					ry="806"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="url(#outer-orbit-stroke)"
					strokeWidth="60"
					strokeLinecap="round"
					opacity="0.82"
				/>
			</svg>
		</PosterOrbitAsset>
	);
}

export function PosterMidVioletOrbitArc({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterOrbitAsset
			assetId="mid-violet-orbit-arc"
			className="poster-asset--mid-violet-orbit"
			delay={0.2}
			duration={16}
			rotateDelta={-0.6}
			reducedMotion={reducedMotion}
			restingRotate={0}
		>
			<svg viewBox="0 0 1067 1600" aria-hidden="true" focusable="false">
				<defs>
					<linearGradient
						id="mid-violet-orbit-stroke"
						x1="0.18"
						x2="0.8"
						y1="0.08"
						y2="0.92"
					>
						<stop offset="0%" stopColor="#5d284d" stopOpacity="0.3" />
						<stop offset="60%" stopColor="#482040" stopOpacity="0.24" />
						<stop offset="100%" stopColor="#341634" stopOpacity="0.2" />
					</linearGradient>
					<filter
						id="mid-violet-orbit-blur"
						x="-10%"
						y="-10%"
						width="120%"
						height="120%"
					>
						<feGaussianBlur stdDeviation="18" />
					</filter>
				</defs>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="178"
					ry="774"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="rgba(70, 30, 64, 0.12)"
					strokeWidth="60"
					strokeLinecap="round"
					filter="url(#mid-violet-orbit-blur)"
					opacity="0.12"
				/>
				<ellipse
					cx={POSTER_ORBIT_SYSTEM_CENTER.x}
					cy={POSTER_ORBIT_SYSTEM_CENTER.y}
					rx="178"
					ry="774"
					transform={`rotate(35 ${POSTER_ORBIT_SYSTEM_CENTER.x} ${POSTER_ORBIT_SYSTEM_CENTER.y})`}
					fill="none"
					stroke="url(#mid-violet-orbit-stroke)"
					strokeWidth="20"
					strokeLinecap="round"
					opacity="0.16"
				/>
			</svg>
		</PosterOrbitAsset>
	);
}

export function PosterVioletRightMass({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--violet-right"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							x: [0, -3, 0],
							y: [0, -5, 0],
						}
			}
			transition={slowFloat(18, 0.3)}
		>
			<svg viewBox="0 0 1067 1600" aria-hidden="true" focusable="false">
				<defs>
					<clipPath id="violet-right-clip">
						<circle
							cx={POSTER_VIOLET_RIGHT_MASS.centerX}
							cy={POSTER_VIOLET_RIGHT_MASS.centerY}
							r={POSTER_VIOLET_RIGHT_MASS.radius}
						/>
					</clipPath>
					<linearGradient
						id="violet-right-body"
						x1="0.64"
						x2="1"
						y1="0.18"
						y2="0.92"
					>
						<stop offset="0%" stopColor="#7d4f83" stopOpacity="0.28" />
						<stop offset="36%" stopColor="#5b2d6a" stopOpacity="0.72" />
						<stop offset="76%" stopColor="#341849" stopOpacity="0.94" />
						<stop offset="100%" stopColor="#251139" stopOpacity="0.98" />
					</linearGradient>
					<radialGradient
						id="violet-right-highlight"
						cx="0.34"
						cy="0.34"
						r="0.54"
					>
						<stop offset="0%" stopColor="#f4dfd5" stopOpacity="0.12" />
						<stop offset="34%" stopColor="#f4dfd5" stopOpacity="0.05" />
						<stop offset="100%" stopColor="#f4dfd5" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="violet-right-lens" cx="0.56" cy="0.48" r="0.34">
						<stop offset="0%" stopColor="#e39a57" stopOpacity="0.9" />
						<stop offset="56%" stopColor="#a25f46" stopOpacity="0.46" />
						<stop offset="100%" stopColor="#a25f46" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle
					className="poster-asset-violet-right__body"
					cx={POSTER_VIOLET_RIGHT_MASS.centerX}
					cy={POSTER_VIOLET_RIGHT_MASS.centerY}
					r={POSTER_VIOLET_RIGHT_MASS.radius}
					fill="url(#violet-right-body)"
					opacity="0.92"
				/>
				<g clipPath="url(#violet-right-clip)" opacity="0.84">
					<rect
						x="792"
						y={POSTER_VIOLET_RIGHT_MASS.centerY - 286}
						width="336"
						height="604"
						fill="rgba(39, 17, 56, 0.18)"
					/>
					{[
						{
							x: 628,
							y: POSTER_VIOLET_RIGHT_MASS.centerY - 188,
							width: 486,
							height: 52,
							fill: "rgba(74, 59, 64, 0.28)",
						},
						{
							x: 706,
							y: POSTER_VIOLET_RIGHT_MASS.centerY - 118,
							width: 408,
							height: 16,
							fill: "rgba(252, 243, 224, 0.28)",
						},
						{
							x: 664,
							y: POSTER_VIOLET_RIGHT_MASS.centerY - 28,
							width: 450,
							height: 20,
							fill: "rgba(231, 91, 59, 0.2)",
						},
						{
							x: 648,
							y: POSTER_VIOLET_RIGHT_MASS.centerY + 94,
							width: 468,
							height: 18,
							fill: "rgba(95, 204, 212, 0.16)",
						},
						{
							x: 724,
							y: POSTER_VIOLET_RIGHT_MASS.centerY + 166,
							width: 390,
							height: 14,
							fill: "rgba(251, 166, 49, 0.18)",
						},
						{
							x: 786,
							y: POSTER_VIOLET_RIGHT_MASS.centerY + 248,
							width: 328,
							height: 10,
							fill: "rgba(118, 28, 89, 0.34)",
						},
					].map((band) => (
						<rect
							key={`violet-right-band-${band.y}-${band.height}`}
							x={band.x}
							y={band.y}
							width={band.width}
							height={band.height}
							rx={band.height / 2}
							fill={band.fill}
						/>
					))}
				</g>
				<circle
					className="poster-asset-violet-right__shadow"
					cx={POSTER_VIOLET_RIGHT_MASS.centerX}
					cy={POSTER_VIOLET_RIGHT_MASS.centerY}
					r={POSTER_VIOLET_RIGHT_MASS.shadowRadius}
					fill="rgba(20, 8, 27, 0.38)"
					opacity="0.62"
				/>
				<circle
					className="poster-asset-violet-right__inner-glow"
					cx={POSTER_VIOLET_RIGHT_MASS.centerX}
					cy={POSTER_VIOLET_RIGHT_MASS.centerY}
					r={POSTER_VIOLET_RIGHT_MASS.radius}
					fill="url(#violet-right-highlight)"
					opacity="0.62"
				/>
				<circle
					className="poster-asset-violet-right__rim"
					cx={POSTER_VIOLET_RIGHT_MASS.centerX}
					cy={POSTER_VIOLET_RIGHT_MASS.centerY}
					r={POSTER_VIOLET_RIGHT_MASS.rimRadius}
					fill="none"
					stroke="rgba(118, 28, 89, 0.16)"
					strokeWidth="18"
					opacity="0.52"
				/>
				<ellipse
					cx={POSTER_VIOLET_RIGHT_MASS.lensX}
					cy={POSTER_VIOLET_RIGHT_MASS.lensY}
					rx="78"
					ry="46"
					fill="url(#violet-right-lens)"
					opacity="0.84"
				/>
				<ellipse
					cx={POSTER_VIOLET_RIGHT_MASS.coreX}
					cy={POSTER_VIOLET_RIGHT_MASS.coreY}
					rx="34"
					ry="20"
					fill="rgba(130, 80, 68, 0.36)"
					opacity="0.74"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterMagentaToken({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--magenta-token"
			data-asset-id="magenta-token"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -5, 0],
							scale: [1, 1.04, 1],
						}
			}
			transition={slowFloat(11, 0.6)}
		>
			<svg
				viewBox="0 0 240 240"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<clipPath id="magenta-token-clip">
						<circle cx="120" cy="120" r="104" />
					</clipPath>
					<radialGradient id="magenta-token-shell" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#8b2f6a" stopOpacity="0.96" />
						<stop offset="64%" stopColor="#661b58" stopOpacity="0.92" />
						<stop offset="100%" stopColor="#4d1242" stopOpacity="0.9" />
					</radialGradient>
					<radialGradient
						id="magenta-token-core-glow"
						cx="50%"
						cy="50%"
						r="50%"
					>
						<stop offset="0%" stopColor="#ffd8e4" stopOpacity="0.16" />
						<stop offset="60%" stopColor="#ffd8e4" stopOpacity="0.06" />
						<stop offset="100%" stopColor="#ffd8e4" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle
					cx="120"
					cy="120"
					r="120"
					fill="rgba(118, 28, 89, 0.2)"
					opacity="0.72"
				/>
				<circle
					cx="120"
					cy="120"
					r="104"
					fill="url(#magenta-token-shell)"
					opacity="0.94"
				/>
				<motion.g
					clipPath="url(#magenta-token-clip)"
					opacity="0.92"
					initial={false}
					animate={
						reducedMotion
							? undefined
							: {
									x: [0, 10, 0],
									opacity: [0.82, 1, 0.82],
								}
					}
					transition={slowFloat(8.5, 0.2)}
				>
					{[
						{ y: 68, height: 10, fill: "rgba(103, 22, 77, 0.34)" },
						{ y: 84, height: 8, fill: "rgba(250, 228, 210, 0.08)" },
						{ y: 98, height: 12, fill: "rgba(126, 41, 98, 0.28)" },
						{ y: 118, height: 16, fill: "rgba(103, 22, 77, 0.38)" },
						{ y: 142, height: 10, fill: "rgba(95, 204, 212, 0.12)" },
						{ y: 158, height: 8, fill: "rgba(250, 228, 210, 0.08)" },
					].map((band) => (
						<rect
							key={`magenta-token-band-${band.y}`}
							x="4"
							y={band.y}
							width="232"
							height={band.height}
							rx={band.height / 2}
							fill={band.fill}
						/>
					))}
				</motion.g>
				<circle
					cx="120"
					cy="120"
					r="104"
					fill="none"
					stroke="rgba(248, 231, 220, 0.12)"
					strokeWidth="4"
				/>
				<circle
					cx="120"
					cy="120"
					r="58"
					fill="url(#magenta-token-core-glow)"
					opacity="0.8"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterTealWaypointDot({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--teal-dot"
			data-asset-id="teal-dot"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							y: [0, -4, 0],
							opacity: [0.84, 1, 0.84],
							scale: [1, 1.05, 1],
						}
			}
			transition={slowFloat(13, 0.5)}
		>
			<svg
				viewBox="0 0 160 160"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<clipPath id="teal-waypoint-clip">
						<circle cx="80" cy="80" r="62" />
					</clipPath>
					<radialGradient id="teal-waypoint-shell" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#66e0ea" stopOpacity="0.96" />
						<stop offset="100%" stopColor="#1398ad" stopOpacity="0.94" />
					</radialGradient>
					<radialGradient id="teal-waypoint-core" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f4feff" stopOpacity="0.24" />
						<stop offset="100%" stopColor="#f4feff" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle
					cx="80"
					cy="80"
					r="80"
					fill="rgba(1, 152, 173, 0.18)"
					opacity="0.76"
				/>
				<circle cx="80" cy="80" r="62" fill="url(#teal-waypoint-shell)" />
				<motion.g
					clipPath="url(#teal-waypoint-clip)"
					initial={false}
					animate={
						reducedMotion
							? undefined
							: {
									x: [0, 8, 0],
									opacity: [0.82, 1, 0.82],
								}
					}
					transition={slowFloat(7.5, 0.15)}
				>
					{[
						{ y: 48, height: 8, fill: "rgba(20, 133, 149, 0.42)" },
						{ y: 64, height: 10, fill: "rgba(240, 251, 252, 0.16)" },
						{ y: 82, height: 8, fill: "rgba(17, 116, 133, 0.42)" },
						{ y: 98, height: 10, fill: "rgba(240, 251, 252, 0.14)" },
					].map((band) => (
						<rect
							key={`teal-waypoint-band-${band.y}`}
							x="12"
							y={band.y}
							width="136"
							height={band.height}
							rx={band.height / 2}
							fill={band.fill}
						/>
					))}
				</motion.g>
				<circle
					cx="80"
					cy="80"
					r="62"
					fill="url(#teal-waypoint-core)"
					opacity="0.78"
				/>
			</svg>
		</motion.div>
	);
}

export function PosterTopTealStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="top-teal-stripe"
			className="poster-asset--top-teal-stripe"
			drift={-20}
			duration={15}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterTopMutedStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="top-muted-stripe"
			className="poster-asset--top-muted-stripe"
			drift={24}
			duration={18}
			delay={0.2}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterTopRedStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="top-red-stripe"
			className="poster-asset--top-red-stripe"
			drift={-26}
			duration={14}
			delay={0.4}
			reducedMotion={reducedMotion}
		/>
	);
}

export function PosterMiddleOrangeStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="middle-orange-stripe"
			className="poster-asset--middle-orange-stripe"
			drift={28}
			duration={16}
			delay={0.8}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterCenterTealStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="center-teal-stripe"
			className="poster-asset--center-teal-stripe"
			drift={-18}
			duration={20}
			delay={0.5}
			reducedMotion={reducedMotion}
		/>
	);
}

export function PosterMidRouteStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<motion.div
			className="poster-asset poster-asset--mid-route"
			initial={false}
			animate={
				reducedMotion
					? undefined
					: {
							x: [0, 30, 0],
							opacity: [0.84, 1, 0.84],
						}
			}
			transition={slowFloat(13, 0.1)}
		>
			<span className="poster-asset-mid-route__glow" />
			<span className="poster-asset-mid-route__base" />
			<span className="poster-asset-mid-route__beam" />
			<span className="poster-asset-mid-route__marker poster-asset-mid-route__marker--start" />
			<span className="poster-asset-mid-route__marker poster-asset-mid-route__marker--mid" />
			<span className="poster-asset-mid-route__marker poster-asset-mid-route__marker--end" />
		</motion.div>
	);
}

export function PosterMidGreenStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="mid-green-stripe"
			className="poster-asset--mid-green-stripe"
			drift={-22}
			duration={17}
			delay={0.3}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterBottomOrangeStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="bottom-orange-stripe"
			className="poster-asset--bottom-orange-stripe"
			drift={18}
			duration={19}
			delay={0.7}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterFooterLaneStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="footer-lane-stripe"
			className="poster-asset--footer-lane-stripe"
			drift={-20}
			duration={21}
			delay={0.9}
			reducedMotion={reducedMotion}
		>
			<span className="poster-asset-stripe__beam" />
		</PosterStripeAsset>
	);
}

export function PosterFooterRedStripe({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterStripeAsset
			assetId="footer-red-stripe"
			className="poster-asset--footer-red-stripe"
			drift={28}
			duration={14}
			delay={0.2}
			reducedMotion={reducedMotion}
		/>
	);
}

export function PosterFleetAlphaArrow({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterShipAsset
			ariaLabel="Fleet Alpha arrow ship"
			assetId="fleet-alpha-arrow"
			className="poster-asset--fleet-alpha"
			drift={10}
			duration={9}
			reducedMotion={reducedMotion}
			rotation={0}
			viewBox="0 0 520 120"
		>
			<defs>
				<linearGradient
					id="fleet-alpha-shell"
					x1="0"
					x2="1"
					y1="0.18"
					y2="0.82"
				>
					<stop offset="0%" stopColor="#fbf3e4" />
					<stop offset="58%" stopColor="#efdfbf" />
					<stop offset="100%" stopColor="#d8c39a" />
				</linearGradient>
				<linearGradient
					id="fleet-alpha-shadow"
					x1="0"
					x2="1"
					y1="0.34"
					y2="0.66"
				>
					<stop offset="0%" stopColor="#efdab6" stopOpacity="0.92" />
					<stop offset="100%" stopColor="#c4aa79" stopOpacity="0.96" />
				</linearGradient>
				<linearGradient id="fleet-alpha-canopy" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#fdf8ef" />
					<stop offset="100%" stopColor="#ead8b5" />
				</linearGradient>
				<linearGradient id="fleet-alpha-fin" x1="0" x2="1" y1="0.24" y2="0.76">
					<stop offset="0%" stopColor="#f4e6c8" />
					<stop offset="100%" stopColor="#dbc39a" />
				</linearGradient>
			</defs>
			<g className="poster-fleet-alpha-svg__group">
				<path
					fill="url(#fleet-alpha-shadow)"
					d="M22 60 108 46h214l88-12 42-24h20l-12 24 66 10 42 16-42 16-66 10 12 24h-20l-42-24-88-12H108Z"
					opacity="0.58"
				/>
				<path
					fill="url(#fleet-alpha-shell)"
					d="M0 60 96 48h242l94-14 48-26h24l-14 26 68 12 52 14-52 14-68 12 14 26h-24l-48-26-94-14H96Z"
				/>
				<path fill="url(#fleet-alpha-fin)" d="M270 48 370 4h34l-46 58z" />
				<path fill="url(#fleet-alpha-fin)" d="M270 72 370 116h34l-46-58z" />
				<path
					fill="#e1cfab"
					d="M98 50h224l68 10-68 10H98L30 60z"
					opacity="0.9"
				/>
				<path
					fill="url(#fleet-alpha-canopy)"
					d="M116 52h182l32 8-32 8H116l-24-8z"
					opacity="0.92"
				/>
				<path
					fill="#d8c7a3"
					d="M268 48h86l52-10-30 22 30 22-52-10h-86l28-12z"
					opacity="0.58"
				/>
				<path
					fill="#0d1d2d"
					d="M408 48h42l56 12-56 12h-42l20-12z"
					opacity="0.92"
				/>
				<path
					fill="#f6ead2"
					d="M388 50h24l30 10-30 10h-24l12-10z"
					opacity="0.66"
				/>
				{[
					{ cx: 136, fill: "#e26239" },
					{ cx: 154, fill: "#b5cb70" },
					{ cx: 172, fill: "#81ae39" },
					{ cx: 190, fill: "#0198ad" },
					{ cx: 208, fill: "#c24f59" },
					{ cx: 226, fill: "#761c59" },
					{ cx: 244, fill: "#e26239" },
					{ cx: 262, fill: "#f0a75f" },
					{ cx: 280, fill: "#d4be93" },
				].map((window) => (
					<circle
						key={window.cx}
						cx={window.cx}
						cy="60"
						r="3.7"
						fill={window.fill}
					/>
				))}
				<path fill="#cdb78c" d="M330 48h22v24h-22l10-12z" opacity="0.54" />
			</g>
		</PosterShipAsset>
	);
}

export function PosterFleetBetaDart({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterShipAsset
			ariaLabel="Fleet Beta dart ship"
			assetId="fleet-beta-dart"
			className="poster-asset--fleet-beta"
			drift={8}
			duration={8}
			delay={0.45}
			reducedMotion={reducedMotion}
			rotation={-1}
			viewBox="0 0 260 96"
		>
			<defs>
				<linearGradient id="fleet-beta-shell" x1="0" x2="1" y1="0.2" y2="0.8">
					<stop offset="0%" stopColor="#fbf5e8" />
					<stop offset="55%" stopColor="#ecdcb6" />
					<stop offset="100%" stopColor="#ccb485" />
				</linearGradient>
				<linearGradient id="fleet-beta-core" x1="0" x2="1" y1="0.3" y2="0.7">
					<stop offset="0%" stopColor="#96bd47" />
					<stop offset="100%" stopColor="#79a13a" />
				</linearGradient>
				<linearGradient id="fleet-beta-fin" x1="0" x2="1" y1="0.18" y2="0.82">
					<stop offset="0%" stopColor="#f7eedb" />
					<stop offset="100%" stopColor="#dcc59c" />
				</linearGradient>
			</defs>
			<g className="poster-fleet-beta-svg__group">
				<path
					fill="url(#fleet-beta-shell)"
					d="M10 48 48 36h110l30 10 22 0 40 14-40 14h-22l-30 10H48Z"
				/>
				<path fill="#f6ecda" d="M48 42h94l18 6-18 6H48L24 48z" opacity="0.86" />
				<path
					fill="url(#fleet-beta-core)"
					d="M100 43h48l18 5-18 5H100l-12-5z"
				/>
				<path
					fill="url(#fleet-beta-fin)"
					d="M154 38h24l30-14-12 18h20l26 8-26 8h-20l12 18-30-14h-24l10-10z"
				/>
				<path fill="#cdb68d" d="M172 42h12v26h-12z" opacity="0.62" />
				{[90, 104, 118, 132].map((cx) => (
					<circle key={cx} cx={cx} cy="48" r="3.2" fill="#81ae39" />
				))}
				<path fill="#fbf7ee" d="M158 44h20l12 4-12 4h-20l8-4z" opacity="0.78" />
			</g>
		</PosterShipAsset>
	);
}

export function PosterFleetGammaShuttle({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterShipAsset
			ariaLabel="Fleet Gamma shuttle ship"
			assetId="fleet-gamma-shuttle"
			className="poster-asset--fleet-gamma"
			drift={7}
			duration={10}
			delay={0.2}
			reducedMotion={reducedMotion}
			rotation={1}
			viewBox="0 0 360 132"
		>
			<defs>
				<linearGradient id="fleet-gamma-shell" x1="0" x2="1" y1="0.2" y2="0.8">
					<stop offset="0%" stopColor="#faf2e3" />
					<stop offset="55%" stopColor="#ead5ad" />
					<stop offset="100%" stopColor="#c8ae7a" />
				</linearGradient>
				<linearGradient id="fleet-gamma-core" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#00a5b4" />
					<stop offset="100%" stopColor="#008f99" />
				</linearGradient>
				<linearGradient id="fleet-gamma-fin" x1="0" x2="1" y1="0.22" y2="0.78">
					<stop offset="0%" stopColor="#f6ecd8" />
					<stop offset="100%" stopColor="#d8c096" />
				</linearGradient>
			</defs>
			<g className="poster-fleet-gamma-svg__group">
				<path
					fill="#ead8b8"
					d="M42 40h96l30 16-30 6H42l-12-12z"
					opacity="0.92"
				/>
				<path
					fill="#ead8b8"
					d="M42 92h96l30-16-30-6H42l-12 12z"
					opacity="0.92"
				/>
				<path fill="#e4d1ae" d="M6 66 26 54h68l18 12-18 12H26Z" opacity="0.9" />
				<path
					fill="#e4d1ae"
					d="M22 48h62l18 8-18 8H22q-22 0-22-8 0-4 22-8z"
					opacity="0.92"
				/>
				<path
					fill="#e4d1ae"
					d="M22 68h62l18 8-18 8H22q-22 0-22-8 0-4 22-8z"
					opacity="0.92"
				/>
				<path
					fill="url(#fleet-gamma-shell)"
					d="M12 66 60 44h88l50 10 36-22h26l86 34-86 34h-26l-36-22-50 10H60Z"
				/>
				<path
					fill="url(#fleet-gamma-fin)"
					d="M150 42 236 8h34l-20 36h24l42 22-42 22h-24l20 36h-34l-86-36z"
				/>
				<path
					fill="url(#fleet-gamma-core)"
					d="M94 56h92l28 10-28 10H94L72 66z"
				/>
				<path
					fill="#0f2130"
					d="M250 46h26l48 20-48 20h-26l16-20z"
					opacity="0.92"
				/>
				<path fill="#fbf7ee" d="M84 60h100l24 6-24 6H84l-12-6z" opacity="0.8" />
				{[108, 124, 140, 156, 172].map((cx) => (
					<circle key={cx} cx={cx} cy="66" r="3.8" fill="#00989a" />
				))}
				<path fill="#d2c19e" d="M196 52h28v28h-28l12-14z" opacity="0.54" />
			</g>
		</PosterShipAsset>
	);
}

export function PosterFleetDeltaDart({ reducedMotion }: HeroAssetProps) {
	return (
		<PosterShipAsset
			ariaLabel="Fleet Delta dart ship"
			assetId="fleet-delta-dart"
			className="poster-asset--fleet-delta"
			drift={9}
			duration={9.5}
			delay={0.8}
			reducedMotion={reducedMotion}
			rotation={-3}
			viewBox="0 0 220 96"
		>
			<defs>
				<linearGradient id="fleet-delta-shell" x1="0" x2="1" y1="0.2" y2="0.8">
					<stop offset="0%" stopColor="#fbf4e6" />
					<stop offset="55%" stopColor="#ebd5ae" />
					<stop offset="100%" stopColor="#cfb283" />
				</linearGradient>
				<linearGradient id="fleet-delta-core" x1="0" x2="1" y1="0" y2="1">
					<stop offset="0%" stopColor="#f04a4c" />
					<stop offset="100%" stopColor="#df2a35" />
				</linearGradient>
				<linearGradient id="fleet-delta-fin" x1="0" x2="1" y1="0.18" y2="0.82">
					<stop offset="0%" stopColor="#f6ebd7" />
					<stop offset="100%" stopColor="#d8c29a" />
				</linearGradient>
			</defs>
			<g className="poster-fleet-delta-svg__group">
				<path
					fill="url(#fleet-delta-shell)"
					d="M6 48 34 38h66l22 10h16l20 10-20 10h-16l-22 10H34Z"
				/>
				<path fill="#fbf6ee" d="M34 42h54l16 6-16 6H34L16 48z" opacity="0.84" />
				<path fill="url(#fleet-delta-core)" d="M58 44h36l10 4-10 4H58l-8-4z" />
				<path
					fill="url(#fleet-delta-fin)"
					d="M98 48h14l18-18 0 18h18l16 10-16 10h-18v18l-18-18H98l10-10z"
				/>
				<path fill="#ead9bb" d="M96 40 122 18h16l-14 22z" opacity="0.92" />
				<path fill="#ead9bb" d="M96 56h20l20 0-14 22h-14z" opacity="0.92" />
				<path fill="#ead9bb" d="M96 32h20l20 0-14-22h-14z" opacity="0.92" />
				<path fill="#ead9bb" d="M108 48 134 6h10l-6 26z" opacity="0.82" />
				<path fill="#0d1d2c" d="M138 40h14l22 8-22 8h-14l10-8z" opacity="0.9" />
				<path fill="#f6ead4" d="M118 42h12l12 6-12 6h-12l8-6z" opacity="0.72" />
				{[46, 58, 70, 82].map((cx) => (
					<circle key={cx} cx={cx} cy="48" r="2.8" fill="#ec1f26" />
				))}
				<path fill="#cfbd98" d="M88 42h12v12H88l6-6z" opacity="0.56" />
			</g>
		</PosterShipAsset>
	);
}
