import {
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { buildPhases, platformHighlights } from "../../lib/posterScene";
import {
	pointerSpring,
	revealTransition,
	slowFloat,
} from "../../lib/motionPresets";
import { PosterScene } from "./PosterScene";

type IdleWindow = Window & {
	requestIdleCallback?: (
		callback: IdleRequestCallback,
		options?: IdleRequestOptions,
	) => number;
	cancelIdleCallback?: (handle: number) => void;
};

export default function PosterExperience() {
	const reducedMotion = Boolean(useReducedMotion());
	const [enableEnhancement, setEnableEnhancement] = useState(false);
	const [pointerEngaged, setPointerEngaged] = useState(false);
	const stageRef = useRef<HTMLDivElement>(null);
	const pointerIdleTimerRef = useRef<number | null>(null);
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const stageInView = useInView(stageRef, {
		amount: 0.24,
	});
	const stageSeen = useInView(stageRef, {
		amount: 0.34,
		once: true,
	});
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
		setPointerEngaged(true);

		if (pointerIdleTimerRef.current !== null) {
			window.clearTimeout(pointerIdleTimerRef.current);
		}

		pointerIdleTimerRef.current = window.setTimeout(() => {
			setPointerEngaged(false);
			pointerIdleTimerRef.current = null;
		}, 260);
	};

	const resetPointer = () => {
		pointerX.set(0);
		pointerY.set(0);
		setPointerEngaged(false);

		if (pointerIdleTimerRef.current !== null) {
			window.clearTimeout(pointerIdleTimerRef.current);
			pointerIdleTimerRef.current = null;
		}
	};

	useEffect(() => {
		if (!stageSeen || reducedMotion) {
			return;
		}

		const idleWindow = window as IdleWindow;
		let enhancementTimer: number | undefined;
		let idleHandle: number | undefined;
		let cancelled = false;

		const warmEnhancementLayer = () => {
			void import("./PosterThreeLayer").then(() => {
				if (cancelled) {
					return;
				}

				enhancementTimer = window.setTimeout(() => {
					setEnableEnhancement(true);
				}, 120);
			});
		};

		if (idleWindow.requestIdleCallback) {
			idleHandle = idleWindow.requestIdleCallback(warmEnhancementLayer, {
				timeout: 320,
			});
		} else {
			warmEnhancementLayer();
		}

		return () => {
			cancelled = true;
			if (typeof enhancementTimer === "number") {
				window.clearTimeout(enhancementTimer);
			}
			if (typeof idleHandle === "number" && idleWindow.cancelIdleCallback) {
				idleWindow.cancelIdleCallback(idleHandle);
			}
		};
	}, [reducedMotion, stageSeen]);

	useEffect(() => {
		return () => {
			if (pointerIdleTimerRef.current !== null) {
				window.clearTimeout(pointerIdleTimerRef.current);
			}
		};
	}, []);

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
					ref={stageRef}
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
						enableEnhancement={enableEnhancement && stageInView}
						parallaxX={parallaxX}
						parallaxY={parallaxY}
						pointerEngaged={pointerEngaged}
						pointerX={pointerX}
						pointerY={pointerY}
						reducedMotion={reducedMotion}
					/>
				</motion.div>
			</div>
		</section>
	);
}
