import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import type { PointerEvent } from "react";

import { buildPhases, platformHighlights } from "../../lib/posterScene";
import {
	pointerSpring,
	revealTransition,
	slowFloat,
} from "../../lib/motionPresets";
import { PosterScene } from "./PosterScene";

export default function PosterExperience() {
	const reducedMotion = Boolean(useReducedMotion());
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const parallaxX = useSpring(
		useTransform(pointerX, [-0.5, 0.5], [-18, 18]),
		pointerSpring,
	);
	const parallaxY = useSpring(
		useTransform(pointerY, [-0.5, 0.5], [-14, 14]),
		pointerSpring,
	);
	const glowX = useSpring(
		useTransform(pointerX, [-0.5, 0.5], [-60, 60]),
		pointerSpring,
	);
	const glowY = useSpring(
		useTransform(pointerY, [-0.5, 0.5], [-40, 40]),
		pointerSpring,
	);

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const nextX = (event.clientX - rect.left) / rect.width - 0.5;
		const nextY = (event.clientY - rect.top) / rect.height - 0.5;

		pointerX.set(nextX);
		pointerY.set(nextY);
	};

	const resetPointer = () => {
		pointerX.set(0);
		pointerY.set(0);
	};

	return (
		<section className="experience-shell">
			<div className="experience-grid">
				<motion.aside
					className="experience-panel"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={revealTransition}
				>
					<p className="experience-eyebrow">Bun-powered Astro scaffold</p>
					<h1 className="experience-title">The Grand Tour</h1>
					<p className="experience-lede">
						A modern creative rebuild base using Astro for the shell, React for
						islands, Motion for choreography, and Three.js-ready dependencies
						for future atmospheric depth.
					</p>

					<div className="pill-row" aria-label="Enabled platform capabilities">
						{platformHighlights.map((highlight) => (
							<span className="pill" key={highlight}>
								{highlight}
							</span>
						))}
					</div>

					<div className="experience-status">
						<p className="experience-label">What’s ready now</p>
						<p className="experience-note">
							The home page is now a data-driven poster study instead of stock
							starter content. Motion is wired in, the scene is structured for
							reusable layers, and the 3D stack is installed for later phases.
						</p>
					</div>

					<ol className="phase-list">
						{buildPhases.map((phase, index) => (
							<li className="phase-item" key={phase.title}>
								<span className="phase-index">0{index + 1}</span>
								<div>
									<strong className="phase-title">{phase.title}</strong>
									<p className="phase-copy">{phase.detail}</p>
								</div>
							</li>
						))}
					</ol>
				</motion.aside>

				<motion.div
					className="experience-stage"
					onPointerMove={handlePointerMove}
					onPointerLeave={resetPointer}
					initial={{ opacity: 0, scale: 0.985 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ ...revealTransition, delay: 0.08 }}
				>
					<motion.div
						className="experience-glow"
						style={reducedMotion ? undefined : { x: glowX, y: glowY }}
						animate={
							reducedMotion ? undefined : { opacity: [0.38, 0.62, 0.38] }
						}
						transition={slowFloat(10)}
					/>

					<PosterScene
						parallaxX={parallaxX}
						parallaxY={parallaxY}
						reducedMotion={reducedMotion}
					/>
				</motion.div>
			</div>
		</section>
	);
}
