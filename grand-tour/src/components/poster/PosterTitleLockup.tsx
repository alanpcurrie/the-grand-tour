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
					<span>{posterCopy.badgePrefix}</span>
					<span className="poster-badge-value">{posterCopy.badgeValue}</span>
					<span>{posterCopy.badgeSuffix}</span>
				</div>
				<div className="poster-boarding">{posterCopy.boarding}</div>
			</div>
		</div>
	);
}
