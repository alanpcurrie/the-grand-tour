import type { CSSProperties } from "react";

import type { PosterTourStop } from "../../lib/posterTour";

type PosterTourCardProps = {
	progress: number;
	stop: PosterTourStop;
	stopCount: number;
	stopIndex: number;
	tourMode: "complete" | "paused" | "playing";
};

export function PosterTourCard({
	progress,
	stop,
	stopCount,
	stopIndex,
	tourMode,
}: PosterTourCardProps) {
	const clampedProgress = Math.min(Math.max(progress, 0), 1);
	const cardStyle = {
		"--experience-tour-accent": stop.accentColor,
	} as CSSProperties;
	const progressLabel = `${String(stopIndex + 1).padStart(2, "0")} / ${String(
		stopCount,
	).padStart(2, "0")}`;
	const statusLabel =
		tourMode === "complete"
			? "Tour complete ✦"
			: tourMode === "paused"
				? "Tour paused"
				: stop.motionMode === "orbit"
					? "Ring choreography"
					: "Scenic passage";

	return (
		<section
			aria-atomic="true"
			aria-live="polite"
			className={`experience-tour-card${
				tourMode === "paused" ? " experience-tour-card--paused" : ""
			}${tourMode === "complete" ? " experience-tour-card--complete" : ""}`}
			style={cardStyle}
		>
			<div className="experience-tour-card__header">
				<p className="experience-tour-card__eyebrow">{stop.eyebrow}</p>
				<p className="experience-tour-card__count">{progressLabel}</p>
			</div>
			<h2 className="experience-tour-card__title">{stop.title}</h2>
			<p className="experience-tour-card__body">{stop.body}</p>
			<div className="experience-tour-card__footer">
				<div aria-hidden="true" className="experience-tour-card__meter">
					<span
						className="experience-tour-card__meter-fill"
						style={{ transform: `scaleX(${clampedProgress})` }}
					/>
				</div>
				<p className="experience-tour-card__status">{statusLabel}</p>
			</div>
		</section>
	);
}
