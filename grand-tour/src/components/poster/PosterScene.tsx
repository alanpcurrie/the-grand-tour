import { motion, type MotionValue } from "motion/react";

import {
	posterCopy,
	planets,
	ships,
	stripes,
	type ShipModel,
} from "../../lib/posterScene";
import { slowFloat } from "../../lib/motionPresets";

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
	return (
		<div className="poster-board">
			<motion.div
				className="poster-scene"
				style={reducedMotion ? undefined : { x: parallaxX, y: parallaxY }}
			>
				<div className="poster-paper-noise" />
				<div className="poster-vignette" />
				<div className="poster-phase-chip">
					Phase 01 — living poster scaffold
				</div>

				<motion.div
					className="poster-sun"
					animate={
						reducedMotion
							? undefined
							: { scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }
					}
					transition={slowFloat(12)}
				/>
				<div className="poster-halo" />

				<motion.div
					className="poster-band poster-band--shadow"
					initial={false}
					animate={reducedMotion ? { rotate: 33 } : { rotate: [33, 35, 33] }}
					transition={slowFloat(18)}
				/>
				<motion.div
					className="poster-band poster-band--glow"
					initial={false}
					animate={reducedMotion ? { rotate: 33 } : { rotate: [33, 31, 33] }}
					transition={slowFloat(14, 0.4)}
				/>

				<motion.div
					className="poster-ring poster-ring--outer"
					initial={false}
					animate={
						reducedMotion ? { rotate: -58 } : { rotate: [-58, -55, -58] }
					}
					transition={slowFloat(20)}
				/>
				<motion.div
					className="poster-ring poster-ring--inner"
					initial={false}
					animate={
						reducedMotion ? { rotate: -58 } : { rotate: [-58, -61, -58] }
					}
					transition={slowFloat(16, 0.2)}
				/>

				{planets.map((planet) => (
					<motion.div
						key={planet.id}
						className="poster-planet"
						style={{
							width: planet.width,
							height: planet.height,
							top: planet.top,
							left: planet.left,
							background: planet.background,
							opacity: planet.opacity,
							zIndex: planet.zIndex,
							mixBlendMode: planet.mixBlendMode,
							filter: planet.blur ? `blur(${planet.blur})` : undefined,
						}}
						initial={false}
						animate={
							reducedMotion
								? undefined
								: {
										y: [0, -planet.float, 0],
										scale: [1, 1.02, 1],
									}
						}
						transition={slowFloat(12 + planet.float, planet.float * 0.04)}
					/>
				))}

				{stripes.map((stripe) => (
					<motion.span
						key={stripe.id}
						className="poster-stripe"
						style={{
							top: stripe.top,
							left: stripe.left,
							width: stripe.width,
							height: stripe.height,
							background: stripe.color,
							opacity: stripe.opacity,
							zIndex: stripe.zIndex,
						}}
						initial={false}
						animate={
							reducedMotion
								? undefined
								: {
										x: [0, stripe.drift, 0],
										opacity: [
											stripe.opacity * 0.88,
											stripe.opacity,
											stripe.opacity * 0.88,
										],
									}
						}
						transition={slowFloat(stripe.duration, stripe.delay)}
					/>
				))}

				{ships.map((ship) => (
					<motion.div
						key={ship.id}
						className="poster-ship"
						style={{
							top: ship.top,
							left: ship.left,
							width: ship.width,
							zIndex: ship.zIndex,
						}}
						initial={false}
						animate={
							reducedMotion
								? { rotate: ship.rotation, scale: ship.scale }
								: {
										x: [0, ship.drift, 0],
										y: [0, -10, 0],
										rotate: [ship.rotation, ship.rotation - 1.3, ship.rotation],
										scale: [ship.scale, ship.scale * 1.02, ship.scale],
									}
						}
						transition={slowFloat(ship.duration, ship.delay)}
					>
						<ShipSprite model={ship.model} accent={ship.accent} />
					</motion.div>
				))}

				<div className="poster-title-lockup">
					<p className="poster-kicker">{posterCopy.kicker}</p>
					<h2 className="poster-title">{posterCopy.title}</h2>
					<div className="poster-title-underline" />
					<div className="poster-footer-row">
						<div>
							<p className="poster-itinerary">
								{posterCopy.itinerary.map((stop, index) => (
									<span key={stop}>
										{index > 0 ? (
											<span className="poster-slash"> / </span>
										) : null}
										{stop}
									</span>
								))}
							</p>
							<p className="poster-subheading">{posterCopy.subheading}</p>
						</div>
						<div className="poster-badge">
							<span>{posterCopy.badgePrefix}</span>
							<span className="poster-badge-value">
								{posterCopy.badgeValue}
							</span>
							<span>{posterCopy.badgeSuffix}</span>
						</div>
						<div className="poster-boarding">{posterCopy.boarding}</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

function ShipSprite({ accent, model }: { accent: string; model: ShipModel }) {
	const base = "#f7f0df";
	const shadow = "#e6d2b0";
	const detail = "#cbb48f";
	const windows = getWindowLayout(model);

	return (
		<motion.svg viewBox="0 0 220 90" role="img" aria-label={`${model} ship`}>
			<g style={{ filter: "drop-shadow(0 4px 8px rgba(12, 28, 44, 0.08))" }}>
				{model === "arrow" ? (
					<>
						<path fill={base} d="M8 45 62 16h92l52 29-52 29H62Z" />
						<path fill={shadow} d="M62 16 118 45 62 74 82 45Z" opacity="0.9" />
						<path fill={detail} d="M48 45 78 27v36Z" />
						<path fill={detail} d="M152 28h18l28 17-28 17h-18l13-17z" />
					</>
				) : null}

				{model === "shuttle" ? (
					<>
						<path fill={base} d="M18 45 78 21h54l44 24-44 24H78Z" />
						<path
							fill={shadow}
							d="M88 45 112 8h18l-10 37 10 37h-18Z"
							opacity="0.94"
						/>
						<path fill={detail} d="M4 45 32 33v24Z" />
						<path fill={detail} d="M132 28h18l34 17-34 17h-18l12-17z" />
					</>
				) : null}

				{model === "dart" ? (
					<>
						<path fill={base} d="M10 46 70 24h72l50 22-50 20H70Z" />
						<path
							fill={shadow}
							d="M90 14h18l-10 32 10 30H90L74 46Z"
							opacity="0.9"
						/>
						<path fill={detail} d="M34 46 58 22v48Z" />
						<path fill={detail} d="M140 34h24l24 12-24 12h-24l11-12z" />
					</>
				) : null}

				{windows.map((cx) => (
					<circle
						key={`${model}-${cx}`}
						cx={cx}
						cy="45"
						r="4.3"
						fill={accent}
					/>
				))}
			</g>
		</motion.svg>
	);
}

function getWindowLayout(model: ShipModel) {
	if (model === "shuttle") {
		return [84, 96, 108, 120];
	}

	if (model === "dart") {
		return [82, 94, 106, 118, 130];
	}

	return [88, 100, 112, 124, 136];
}
