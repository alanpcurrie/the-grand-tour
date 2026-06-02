import {
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { PosterFleetMotionMode } from "../../lib/posterFlightPaths";
import { buildPhases, platformHighlights } from "../../lib/posterScene";
import { posterTourStopCount, posterTourStops } from "../../lib/posterTour";
import { revealTransition, slowFloat } from "../../lib/motionPresets";
import { PosterScene } from "./PosterScene";
import { PosterTourCard } from "./PosterTourCard";

type IdleWindow = Window & {
	requestIdleCallback?: (
		callback: IdleRequestCallback,
		options?: IdleRequestOptions,
	) => number;
	cancelIdleCallback?: (handle: number) => void;
};

export default function PosterExperience() {
	const reducedMotion = Boolean(useReducedMotion());
	const audioElementRef = useRef<HTMLAudioElement>(null);
	const teardownSoundtrackRef = useRef<(() => void) | null>(null);
	const tourFrameRef = useRef<number | null>(null);
	const tourStopStartedAtRef = useRef<number | null>(null);
	const tourElapsedWithinStopRef = useRef(0);
	const tourProgressRef = useRef(0);
	const [enableEnhancement, setEnableEnhancement] = useState(false);
	const [audioState, setAudioState] = useState<
		"error" | "loading" | "paused" | "playing"
	>("paused");
	const [fleetMotionEnabled, setFleetMotionEnabled] = useState(!reducedMotion);
	const [fleetMotionMode, setFleetMotionMode] =
		useState<PosterFleetMotionMode>("drift");
	const [fleetMotionResetToken, setFleetMotionResetToken] = useState(0);
	const [sidebarExpanded, setSidebarExpanded] = useState(false);
	const [tourMode, setTourMode] = useState<
		"complete" | "idle" | "paused" | "playing"
	>("idle");
	const [resetSpinToken, setResetSpinToken] = useState(0);
	const [activeTourStopIndex, setActiveTourStopIndex] = useState(0);
	const [tourProgress, setTourProgress] = useState(0);
	const stageRef = useRef<HTMLDivElement>(null);
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const stageInView = useInView(stageRef, {
		amount: 0.24,
	});
	const stageSeen = useInView(stageRef, {
		amount: 0.34,
		once: true,
	});
	const activeTourStop =
		tourMode === "idle" ? null : (posterTourStops[activeTourStopIndex] ?? null);
	const effectiveFleetMotionMode =
		activeTourStop?.motionMode ?? fleetMotionMode;
	const activeTourGlow = activeTourStop
		? {
				background: `radial-gradient(circle, ${activeTourStop.glowColor}, transparent 70%)`,
			}
		: undefined;
	const activeTourHotspotId =
		activeTourStop && "hotspotId" in activeTourStop
			? activeTourStop.hotspotId
			: null;

	const syncTourProgress = useCallback((nextProgress: number) => {
		const clampedProgress = Math.min(Math.max(nextProgress, 0), 1);

		if (
			Math.abs(tourProgressRef.current - clampedProgress) < 0.01 &&
			clampedProgress !== 0 &&
			clampedProgress !== 1
		) {
			return;
		}

		tourProgressRef.current = clampedProgress;
		setTourProgress(clampedProgress);
	}, []);

	const clearTourFrame = useCallback(() => {
		if (tourFrameRef.current !== null) {
			window.cancelAnimationFrame(tourFrameRef.current);
			tourFrameRef.current = null;
		}

		tourStopStartedAtRef.current = null;
	}, []);

	const ensureSoundtrack = useCallback(() => {
		if (audioElementRef.current || typeof window === "undefined") {
			return audioElementRef.current;
		}

		const soundtrack = new Audio("/Giant%20Swing%20Low.mp3");
		soundtrack.preload = "metadata";

		const handleEnded = () => {
			setAudioState("paused");
		};

		const handleError = () => {
			setAudioState("error");
		};

		const handlePause = () => {
			setAudioState("paused");
		};

		const handlePlay = () => {
			setAudioState("playing");
		};

		soundtrack.addEventListener("ended", handleEnded);
		soundtrack.addEventListener("error", handleError);
		soundtrack.addEventListener("pause", handlePause);
		soundtrack.addEventListener("play", handlePlay);

		teardownSoundtrackRef.current = () => {
			soundtrack.removeEventListener("ended", handleEnded);
			soundtrack.removeEventListener("error", handleError);
			soundtrack.removeEventListener("pause", handlePause);
			soundtrack.removeEventListener("play", handlePlay);
			soundtrack.pause();
			soundtrack.currentTime = 0;

			if (audioElementRef.current === soundtrack) {
				audioElementRef.current = null;
			}
		};

		audioElementRef.current = soundtrack;

		return soundtrack;
	}, []);

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
		ensureSoundtrack();

		return () => {
			teardownSoundtrackRef.current?.();
			teardownSoundtrackRef.current = null;
		};
	}, [ensureSoundtrack]);

	useEffect(
		() => () => {
			clearTourFrame();
		},
		[clearTourFrame],
	);

	useEffect(() => {
		if (tourMode !== "complete") return;
		const timer = window.setTimeout(() => {
			setTourMode("idle");
			setActiveTourStopIndex(0);
		}, 1400);
		return () => window.clearTimeout(timer);
	}, [tourMode]);

	useEffect(() => {
		if (tourMode !== "playing" || !activeTourStop) {
			return;
		}

		const step = (timestamp: number) => {
			if (tourStopStartedAtRef.current === null) {
				tourStopStartedAtRef.current =
					timestamp - tourElapsedWithinStopRef.current;
			}

			const elapsed = timestamp - tourStopStartedAtRef.current;
			tourElapsedWithinStopRef.current = elapsed;
			syncTourProgress(elapsed / activeTourStop.durationMs);

			if (elapsed >= activeTourStop.durationMs) {
				const nextStopIndex = activeTourStopIndex + 1;
				tourStopStartedAtRef.current = null;
				tourElapsedWithinStopRef.current = 0;

				if (nextStopIndex < posterTourStopCount) {
					syncTourProgress(0);
					setActiveTourStopIndex(nextStopIndex);
				} else {
					syncTourProgress(1);
					setTourMode("complete");
				}

				tourFrameRef.current = null;
				return;
			}

			tourFrameRef.current = window.requestAnimationFrame(step);
		};

		tourFrameRef.current = window.requestAnimationFrame(step);

		return () => {
			clearTourFrame();
		};
	}, [
		activeTourStop,
		activeTourStopIndex,
		clearTourFrame,
		syncTourProgress,
		tourMode,
	]);

	const handleSidebarToggle = () => {
		setSidebarExpanded((currentValue) => !currentValue);
	};

	const handleAudioToggle = useCallback(async () => {
		const soundtrack = ensureSoundtrack();

		if (!soundtrack || audioState === "loading") {
			return;
		}

		if (audioState === "playing") {
			soundtrack.pause();
			return;
		}

		soundtrack.volume = 0.42;

		try {
			setAudioState("loading");
			await soundtrack.play();
		} catch {
			setAudioState("error");
		}
	}, [audioState, ensureSoundtrack]);

	const handleFleetMotionToggle = () => {
		if (!fleetMotionEnabled) {
			setFleetMotionResetToken((currentValue) => currentValue + 1);
		}

		setFleetMotionEnabled((currentValue) => !currentValue);
	};

	const handleFleetMotionReset = () => {
		setFleetMotionResetToken((currentValue) => currentValue + 1);
		setResetSpinToken((currentValue) => currentValue + 1);
	};

	const handleFleetMotionModeChange = (nextMode: PosterFleetMotionMode) => {
		if (fleetMotionMode === nextMode) {
			return;
		}

		setFleetMotionMode(nextMode);
		setFleetMotionResetToken((currentValue) => currentValue + 1);
	};

	const startTour = useCallback(() => {
		clearTourFrame();
		tourElapsedWithinStopRef.current = 0;
		syncTourProgress(0);
		setActiveTourStopIndex(0);
		setFleetMotionEnabled(true);
		setFleetMotionResetToken((currentValue) => currentValue + 1);
		setTourMode("playing");
	}, [clearTourFrame, syncTourProgress]);

	const pauseTour = useCallback(() => {
		clearTourFrame();
		setTourMode("paused");
	}, [clearTourFrame]);

	const resumeTour = useCallback(() => {
		setFleetMotionEnabled(true);
		setTourMode("playing");
	}, []);

	const handleTourToggle = useCallback(() => {
		if (tourMode === "playing") {
			pauseTour();
			return;
		}

		if (tourMode === "paused") {
			resumeTour();
			return;
		}

		if (tourMode === "complete") {
			setTourMode("idle");
			setActiveTourStopIndex(0);
			return;
		}

		startTour();
	}, [pauseTour, resumeTour, startTour, tourMode]);

	const orbitModeSelected = effectiveFleetMotionMode === "orbit";
	const guideToggleLabel = sidebarExpanded ? "Hide guide" : "Open guide";
	const currentRouteLabel = activeTourStop
		? "Guided tour"
		: orbitModeSelected
			? "Ring excursion"
			: "Scenic drift";
	const journeyToggleLabel = fleetMotionEnabled ? "Pause drift" : "Play drift";
	const tourToggleLabel =
		tourMode === "playing"
			? "Pause tour"
			: tourMode === "paused"
				? "Resume tour"
				: tourMode === "complete"
					? "Tour complete"
					: "Guided tour";
	const tourToggleIcon =
		tourMode === "playing" ? "❚❚" : tourMode === "paused" ? "▶" : "✦";
	const soundtrackButtonLabel =
		audioState === "playing"
			? "Pause soundtrack"
			: audioState === "loading"
				? "Starting soundtrack"
				: audioState === "error"
					? "Retry soundtrack"
					: "Play soundtrack";
	const audioBadgeStateLabel =
		audioState === "playing"
			? "Playing"
			: audioState === "loading"
				? "Starting"
				: audioState === "error"
					? "Retry"
					: "Listen";
	const motionModeCopy = orbitModeSelected
		? "Watch the excursion craft slip beyond the poster edge and return for another graceful pass around Saturn's rings."
		: "Watch the excursion craft drift across the bright travel lanes like shuttles gliding between observation decks.";
	const motionPanelLabel = activeTourStop ? "Guided stop" : "Scenic route";
	const motionPanelCopy = activeTourStop
		? `${activeTourStop.title}. ${activeTourStop.body}`
		: motionModeCopy;
	const motionPanelStatus = activeTourStop
		? `Stop ${String(activeTourStopIndex + 1).padStart(2, "0")}`
		: fleetMotionEnabled
			? "Cruising"
			: "At rest";
	const motionPanelToolbarNote = activeTourStop
		? `Current stop: ${activeTourStop.title}. The guide is steering ${
				effectiveFleetMotionMode === "orbit"
					? "an orbiting ring pass"
					: "a scenic drift"
			} while the travel card cues the next sighting.`
		: `Current course: ${currentRouteLabel}. Quick controls now live in the top bar, ready whenever you want to open the guide, change route, pause the procession, or restart the voyage.`;

	return (
		<section
			className="experience-shell"
			data-sidebar-expanded={sidebarExpanded ? "true" : "false"}
			data-tour-mode={tourMode}
		>
			<motion.div
				className="experience-topbar"
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ...revealTransition, delay: 0.12 }}
			>
				<button
					aria-label={guideToggleLabel}
					aria-controls="experience-sidebar-content"
					aria-expanded={sidebarExpanded}
					className={`experience-topbar-button experience-topbar-button--guide${
						sidebarExpanded ? " experience-topbar-button--active" : ""
					}`}
					onClick={handleSidebarToggle}
					type="button"
				>
					<span aria-hidden="true" className="experience-topbar-button__icon">
						{sidebarExpanded ? "←" : "☰"}
					</span>
					<span className="experience-topbar-button__label">
						{guideToggleLabel}
					</span>
				</button>

				<div
					aria-label="Route mode controls"
					className="experience-topbar-segment"
				>
					<button
						disabled={activeTourStop !== null}
						aria-pressed={!orbitModeSelected}
						className={`experience-topbar-segment__button${
							!orbitModeSelected
								? " experience-topbar-segment__button--active"
								: ""
						}`}
						onClick={() => {
							handleFleetMotionModeChange("drift");
						}}
						type="button"
					>
						Scenic
						<span className="experience-topbar-segment__sublabel">drift</span>
					</button>
					<button
						disabled={activeTourStop !== null}
						aria-pressed={orbitModeSelected}
						className={`experience-topbar-segment__button${
							orbitModeSelected
								? " experience-topbar-segment__button--active"
								: ""
						}`}
						onClick={() => {
							handleFleetMotionModeChange("orbit");
						}}
						type="button"
					>
						Rings
						<span className="experience-topbar-segment__sublabel">orbit</span>
					</button>
				</div>

				<div className="experience-topbar-divider" aria-hidden="true" />

				<button
					aria-label={tourToggleLabel}
					aria-pressed={activeTourStop !== null}
					className={`experience-topbar-button experience-topbar-button--tour${
						activeTourStop
							? " experience-topbar-button--active"
							: " experience-topbar-button--cta"
					}`}
					onClick={handleTourToggle}
					type="button"
				>
					<span aria-hidden="true" className="experience-topbar-button__icon">
						{tourToggleIcon}
					</span>
					<span className="experience-topbar-button__label">
						{tourToggleLabel}
					</span>
				</button>

				<div className="experience-topbar-divider" aria-hidden="true" />

				<button
					aria-label={journeyToggleLabel}
					aria-pressed={fleetMotionEnabled}
					className={`experience-topbar-button${
						fleetMotionEnabled ? " experience-topbar-button--active" : ""
					}`}
					onClick={handleFleetMotionToggle}
					type="button"
				>
					<span aria-hidden="true" className="experience-topbar-button__icon">
						{fleetMotionEnabled ? "❚❚" : "▶"}
					</span>
					<span className="experience-topbar-button__label">
						{journeyToggleLabel}
					</span>
				</button>

				<button
					aria-label="Reset drift animation"
					className="experience-topbar-button"
					onClick={handleFleetMotionReset}
					type="button"
				>
					<motion.span
						aria-hidden="true"
						className="experience-topbar-button__icon"
						animate={{ rotate: -resetSpinToken * 360 }}
						transition={{ duration: 0.45, ease: "easeInOut" }}
					>
						↺
					</motion.span>
					<span className="experience-topbar-button__label">Reset</span>
				</button>

				<button
					aria-label={soundtrackButtonLabel}
					aria-pressed={audioState === "playing"}
					className={`experience-audio-tour-badge${
						audioState === "playing"
							? " experience-audio-tour-badge--active"
							: audioState === "error"
								? " experience-audio-tour-badge--error"
								: ""
					}`}
					disabled={audioState === "loading"}
					onClick={() => {
						void handleAudioToggle();
					}}
					type="button"
				>
					<span
						aria-hidden="true"
						className="experience-audio-tour-badge__stamp"
					>
						♪
					</span>
					<span className="experience-audio-tour-badge__copy">
						<span className="experience-audio-tour-badge__eyebrow">
							Vintage
						</span>
						<span className="experience-audio-tour-badge__title">
							Audio Tour
						</span>
						<span className="experience-audio-tour-badge__status">
							{audioBadgeStateLabel}
						</span>
					</span>
				</button>
			</motion.div>
			<div className="experience-grid">
				<motion.aside
					className="experience-panel"
					aria-label="Travel guide sidebar"
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={revealTransition}
				>
					<div className="experience-panel__chrome">
						<p className="experience-panel__rail-label">Travel guide</p>
						<p className="experience-panel__route-chip">{currentRouteLabel}</p>
					</div>

					<div
						aria-hidden={!sidebarExpanded}
						className="experience-panel__content"
						id="experience-sidebar-content"
					>
						<p className="experience-eyebrow">Celestial travel bureau</p>
						<h1 className="experience-title">The Grand Tour</h1>
						<p className="experience-lede">
							Pack lightly and look up: this guide invites curious travelers on
							a once-in-a-lifetime holiday past Jupiter&apos;s glow,
							Saturn&apos;s rings, Uranus&apos;s hush, and Neptune&apos;s blue
							dusk.
						</p>

						<div className="pill-row" aria-label="Tour highlights">
							{platformHighlights.map((highlight) => (
								<span className="pill" key={highlight}>
									{highlight}
								</span>
							))}
						</div>

						<div className="experience-status">
							<p className="experience-label">What awaits</p>
							<p className="experience-note">
								The voyage already shimmers with glowing lanes, passing craft,
								and postcard-worthy worlds, with room for more detours,
								discoveries, and delightful surprises.
							</p>
						</div>

						<div className="experience-motion-controls">
							<div className="experience-motion-controls__header">
								<div>
									<p className="experience-motion-controls__label">
										{motionPanelLabel}
									</p>
									<p className="experience-motion-controls__copy">
										{motionPanelCopy}
									</p>
								</div>
								<span
									className={`experience-motion-controls__status${
										fleetMotionEnabled || activeTourStop
											? " experience-motion-controls__status--active"
											: ""
									}`}
								>
									{motionPanelStatus}
								</span>
							</div>
							<p className="experience-motion-controls__toolbar-note">
								{motionPanelToolbarNote}
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
					</div>
				</motion.aside>

				<motion.div
					className="experience-stage"
					ref={stageRef}
					initial={{ opacity: 0, scale: 0.985 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ ...revealTransition, delay: 0.08 }}
				>
					<motion.div
						className="experience-glow"
						style={activeTourGlow}
						animate={
							reducedMotion ? undefined : { opacity: [0.38, 0.62, 0.38] }
						}
						transition={slowFloat(10)}
					/>

					{activeTourStop ? (
						<motion.div
							key={activeTourStop.id}
							className="experience-tour-card-shell"
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ ...revealTransition, delay: 0.06 }}
						>
							<PosterTourCard
								progress={tourProgress}
								stop={activeTourStop}
								stopCount={posterTourStopCount}
								stopIndex={activeTourStopIndex}
								tourMode={
							tourMode === "paused"
								? "paused"
								: tourMode === "complete"
									? "complete"
									: "playing"
						}
							/>
						</motion.div>
					) : null}

					<PosterScene
						enableEnhancement={enableEnhancement && stageInView}
						fleetMotionEnabled={fleetMotionEnabled}
						fleetMotionMode={effectiveFleetMotionMode}
						fleetMotionResetToken={fleetMotionResetToken}
						pointerEngaged={false}
						pointerX={pointerX}
						pointerY={pointerY}
						reducedMotion={reducedMotion}
						tourAccentColor={activeTourStop?.accentColor ?? null}
						tourChoreography={activeTourStop?.choreography ?? null}
						tourFocusTarget={activeTourStop?.focusTarget ?? null}
						tourHotspotId={activeTourHotspotId}
						tourMode={tourMode === "complete" ? "playing" : tourMode}
					/>
				</motion.div>
			</div>
		</section>
	);
}
