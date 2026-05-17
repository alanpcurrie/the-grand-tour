import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";

import {
	posterHotspots,
	type PosterHotspot,
	type PosterHotspotId,
} from "../../lib/posterHotspots";

type PosterInteractiveHotspotsProps = {
	activeHotspotId: PosterHotspotId | null;
	selectedHotspotId: PosterHotspotId | null;
	onClearSelection: () => void;
	onHotspotPreviewEnd: (id: PosterHotspotId) => void;
	onHotspotPreviewStart: (id: PosterHotspotId) => void;
	onHotspotToggle: (id: PosterHotspotId) => void;
	reducedMotion: boolean;
};

const hotspotLookup = new Map(
	posterHotspots.map((hotspot) => [hotspot.id, hotspot]),
);

function frameStyle(frame: PosterHotspot["triggerFrame"], accent: string) {
	return {
		"--hotspot-accent": accent,
		top: frame.top,
		left: frame.left,
		width: frame.width,
		height: frame.height,
		borderRadius: frame.radius,
	} as CSSProperties;
}

function renderCard(
	activeHotspot: PosterHotspot,
	selected: boolean,
	onClearSelection: () => void,
) {
	return (
		<motion.aside
			className={`poster-hotspot-card${selected ? " poster-hotspot-card--selected" : ""}`}
			style={{ "--hotspot-accent": activeHotspot.accent } as CSSProperties}
			initial={{ opacity: 0, y: -10, scale: 0.97 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -8, scale: 0.98 }}
			transition={{ duration: 0.22, ease: "easeOut" }}
		>
			<p className="poster-hotspot-card__eyebrow">{activeHotspot.eyebrow}</p>
			<h3 className="poster-hotspot-card__title">{activeHotspot.title}</h3>
			<p className="poster-hotspot-card__description">
				{activeHotspot.description}
			</p>
			<ul className="poster-hotspot-card__facts">
				{activeHotspot.facts.map((fact) => (
					<li className="poster-hotspot-card__fact" key={fact.label}>
						<span className="poster-hotspot-card__fact-label">
							{fact.label}
						</span>
						<span className="poster-hotspot-card__fact-value">
							{fact.value}
						</span>
					</li>
				))}
			</ul>
			<div className="poster-hotspot-card__footer">
				<span className="poster-hotspot-card__hint">
					{selected
						? "Pinned dossier"
						: "Hover or focus to preview · click to pin"}
				</span>
				{selected ? (
					<button
						type="button"
						className="poster-hotspot-card__close"
						onClick={onClearSelection}
					>
						Close
					</button>
				) : null}
			</div>
		</motion.aside>
	);
}

export function PosterInteractiveHotspots({
	activeHotspotId,
	selectedHotspotId,
	onClearSelection,
	onHotspotPreviewEnd,
	onHotspotPreviewStart,
	onHotspotToggle,
	reducedMotion,
}: PosterInteractiveHotspotsProps) {
	const activeHotspot = activeHotspotId
		? (hotspotLookup.get(activeHotspotId) ?? null)
		: null;

	return (
		<div
			className="poster-hotspot-layer"
			aria-label="Interactive poster hotspots"
		>
			{posterHotspots.map((hotspot) => {
				const isActive = activeHotspotId === hotspot.id;
				const isSelected = selectedHotspotId === hotspot.id;

				return (
					<button
						key={hotspot.id}
						type="button"
						className={`poster-hotspot poster-hotspot--${hotspot.kind}${
							isActive ? " poster-hotspot--active" : ""
						}${isSelected ? " poster-hotspot--selected" : ""}`}
						style={frameStyle(hotspot.triggerFrame, hotspot.accent)}
						aria-label={`${hotspot.title} hotspot`}
						aria-pressed={isSelected}
						onPointerEnter={() => onHotspotPreviewStart(hotspot.id)}
						onPointerLeave={() => onHotspotPreviewEnd(hotspot.id)}
						onFocus={() => onHotspotPreviewStart(hotspot.id)}
						onBlur={() => onHotspotPreviewEnd(hotspot.id)}
						onClick={() => onHotspotToggle(hotspot.id)}
					>
						<motion.span
							className="poster-hotspot__pulse"
							initial={false}
							animate={
								isActive
									? {
											opacity: [0.34, 0.78, 0.34],
											scale: [0.88, 1.12, 0.88],
										}
									: reducedMotion
										? { opacity: 0.18, scale: 1 }
										: {
												opacity: [0.08, 0.22, 0.08],
												scale: [0.94, 1.02, 0.94],
											}
							}
							transition={{
								duration: isActive ? 1.8 : 3.8,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
						<span className="poster-hotspot__dot" />
					</button>
				);
			})}

			<AnimatePresence>
				{activeHotspot ? (
					<motion.div
						className={`poster-hotspot-focus poster-hotspot-focus--${activeHotspot.kind}`}
						style={frameStyle(activeHotspot.focusFrame, activeHotspot.accent)}
						initial={{ opacity: 0, scale: 0.94 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.97 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
					>
						<span className="poster-hotspot-focus__halo" />
						<span className="poster-hotspot-focus__ring" />
					</motion.div>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{activeHotspot
					? renderCard(
							activeHotspot,
							selectedHotspotId === activeHotspot.id,
							onClearSelection,
						)
					: null}
			</AnimatePresence>
		</div>
	);
}
