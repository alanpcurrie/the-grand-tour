import { posterCopy } from "../../lib/posterScene";

export function PosterTitleLockup() {
	return (
		<div className="poster-title-lockup" data-asset-id="title-lockup">
			<p className="poster-kicker">{posterCopy.kicker}</p>
			<h2 className="poster-title">{posterCopy.title}</h2>
			<div className="poster-title-underline" />
			<div className="poster-footer-row">
				<div>
					<p className="poster-itinerary">
						{posterCopy.itinerary.map((stop, index) => (
							<span key={stop}>
								{index > 0 ? <span className="poster-slash"> / </span> : null}
								{stop}
							</span>
						))}
					</p>
					<p className="poster-subheading">{posterCopy.subheading}</p>
				</div>
				<div className="poster-badge">
					<span className="poster-badge__label poster-badge__label--start">
						{posterCopy.badgePrefix}
					</span>
					<span className="poster-badge-value">
						<span className="poster-badge-value__ring" />
						<span className="poster-badge-value__text">
							{posterCopy.badgeValue}
						</span>
					</span>
					<span className="poster-badge__label poster-badge__label--end">
						{posterCopy.badgeSuffix}
					</span>
				</div>
				<div className="poster-boarding">
					<span className="poster-boarding__inner" />
					<span className="poster-boarding__text">{posterCopy.boarding}</span>
				</div>
			</div>
		</div>
	);
}
