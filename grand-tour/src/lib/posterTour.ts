import type {
	PosterFleetMotionMode,
	PosterFleetShipId,
	PosterRouteStripeId,
} from "./posterFlightPaths";
import type { PosterHotspotId } from "./posterHotspots";

export type PosterTourStopId =
	| "departure-lounge"
	| "jupiter-window"
	| "saturn-ring-crossing"
	| "uranus-relay"
	| "neptune-dusk";

export type PosterTourFocusTarget =
	| "departure"
	| "jupiter"
	| "saturn"
	| "uranus"
	| "neptune";

export type PosterTourSceneFrame = {
	scale: number;
	xPercent: number;
	yPercent: number;
	rotateDeg?: number;
	breathScale?: number;
	breathXPercent?: number;
	breathYPercent?: number;
};

export type PosterTourShipCue = {
	shipId: PosterFleetShipId;
	paceMultiplier?: number;
	delayOffset?: number;
	driftX?: number;
	driftY?: number;
	scaleBoost?: number;
	rotateBias?: number;
};

export type PosterTourChoreography = {
	featuredShipId: PosterFleetShipId;
	featuredRouteIds: readonly PosterRouteStripeId[];
	fleetPaceMultiplier?: number;
	sceneFrame: PosterTourSceneFrame;
	shipCues: readonly PosterTourShipCue[];
};

export type PosterTourStop = {
	id: PosterTourStopId;
	eyebrow: string;
	title: string;
	body: string;
	durationMs: number;
	motionMode: PosterFleetMotionMode;
	focusTarget: PosterTourFocusTarget;
	accentColor: string;
	glowColor: string;
	choreography: PosterTourChoreography;
	hotspotId?: PosterHotspotId;
};

export const posterTourStops = [
	{
		id: "departure-lounge",
		eyebrow: "Departure lounge",
		title: "Golden Departure",
		body: "Board beneath the warming lanes as the first leg of the excursion wakes and points outward.",
		durationMs: 7800,
		motionMode: "drift",
		focusTarget: "departure",
		accentColor: "#e26239",
		glowColor: "rgba(226, 98, 57, 0.3)",
		choreography: {
			featuredShipId: "fleet-alpha",
			featuredRouteIds: ["mid-route", "middle-orange"],
			fleetPaceMultiplier: 0.97,
			sceneFrame: {
				scale: 1.075,
				xPercent: 6.15,
				yPercent: 3.60,
				rotateDeg: -0.55,
				breathScale: 0.012,
				breathXPercent: 0.26,
				breathYPercent: 0.18,
			},
			shipCues: [
				{
					shipId: "fleet-alpha",
					paceMultiplier: 0.93,
					driftX: 6,
					driftY: -3,
					scaleBoost: 0.024,
					rotateBias: -1,
				},
				{
					shipId: "fleet-beta",
					paceMultiplier: 1.02,
					delayOffset: -0.08,
					driftX: 3,
					driftY: -1.5,
					scaleBoost: 0.012,
					rotateBias: -0.45,
				},
			],
		},
		hotspotId: "solar-launch-dossier",
	},
	{
		id: "jupiter-window",
		eyebrow: "Jupiter window",
		title: "Gravity Well Promenade",
		body: "Skim the great green assist body where orange, teal, and green corridors gather into one stately sweep.",
		durationMs: 8200,
		motionMode: "drift",
		focusTarget: "jupiter",
		accentColor: "#1a7d56",
		glowColor: "rgba(26, 125, 86, 0.24)",
		choreography: {
			featuredShipId: "fleet-gamma",
			featuredRouteIds: ["middle-orange", "center-teal", "mid-green"],
			fleetPaceMultiplier: 0.98,
			sceneFrame: {
				scale: 1.11,
				xPercent: 1.24,
				yPercent: 1.67,
				rotateDeg: -0.3,
				breathScale: 0.014,
				breathXPercent: 0.2,
				breathYPercent: 0.16,
			},
			shipCues: [
				{
					shipId: "fleet-gamma",
					paceMultiplier: 0.91,
					driftX: 4,
					driftY: -3,
					scaleBoost: 0.02,
					rotateBias: 0.85,
				},
				{
					shipId: "fleet-alpha",
					paceMultiplier: 0.96,
					driftX: 2.6,
					driftY: -1.4,
					scaleBoost: 0.014,
					rotateBias: 0.4,
				},
				{
					shipId: "fleet-beta",
					paceMultiplier: 1.01,
					delayOffset: -0.06,
					driftX: 3.2,
					driftY: -2,
					scaleBoost: 0.01,
					rotateBias: -0.4,
				},
			],
		},
		hotspotId: "jupiter-dossier",
	},
	{
		id: "saturn-ring-crossing",
		eyebrow: "Ring crossing",
		title: "Saturn Ring Crossing",
		body: "The route bends into a rose-violet pass, slipping beyond the poster edge and returning in a graceful orbital loop.",
		durationMs: 9200,
		motionMode: "orbit",
		focusTarget: "saturn",
		accentColor: "#761c59",
		glowColor: "rgba(118, 28, 89, 0.28)",
		choreography: {
			featuredShipId: "fleet-beta",
			featuredRouteIds: ["mid-route", "center-teal"],
			fleetPaceMultiplier: 0.92,
			sceneFrame: {
				scale: 1.095,
				xPercent: -4.70,
				yPercent: 5.68,
				rotateDeg: 0.55,
				breathScale: 0.016,
				breathXPercent: 0.28,
				breathYPercent: 0.22,
			},
			shipCues: [
				{
					shipId: "fleet-beta",
					paceMultiplier: 0.88,
					driftX: -4,
					driftY: -2.6,
					scaleBoost: 0.022,
					rotateBias: -1.2,
				},
				{
					shipId: "fleet-gamma",
					paceMultiplier: 0.94,
					driftX: -3.2,
					driftY: -2.2,
					scaleBoost: 0.016,
					rotateBias: 1,
				},
				{
					shipId: "fleet-alpha",
					paceMultiplier: 0.97,
					driftX: -2.8,
					driftY: -1.8,
					scaleBoost: 0.014,
					rotateBias: -0.65,
				},
			],
		},
	},
	{
		id: "uranus-relay",
		eyebrow: "Relay node",
		title: "Uranus Relay",
		body: "Pause at the magenta waypoint where the lower lanes hold steady and the tour turns from spectacle into signal.",
		durationMs: 7600,
		motionMode: "drift",
		focusTarget: "uranus",
		accentColor: "#761c59",
		glowColor: "rgba(118, 28, 89, 0.22)",
		choreography: {
			featuredShipId: "fleet-delta",
			featuredRouteIds: ["footer-lane", "mid-green"],
			fleetPaceMultiplier: 1.01,
			sceneFrame: {
				scale: 1.1,
				xPercent: 0.60,
				yPercent: -7.20,
				rotateDeg: -0.22,
				breathScale: 0.013,
				breathXPercent: 0.18,
				breathYPercent: 0.26,
			},
			shipCues: [
				{
					shipId: "fleet-delta",
					paceMultiplier: 0.9,
					driftX: 2.8,
					driftY: -4.2,
					scaleBoost: 0.024,
					rotateBias: -1.1,
				},
				{
					shipId: "fleet-gamma",
					paceMultiplier: 0.96,
					driftX: 1.8,
					driftY: -2.4,
					scaleBoost: 0.014,
					rotateBias: 0.55,
				},
			],
		},
		hotspotId: "uranus-dossier",
	},
	{
		id: "neptune-dusk",
		eyebrow: "Twilight arrival",
		title: "Neptune Dusk",
		body: "At the far violet edge the excursion quiets into blue dusk, long shadows, and a final postcard-worthy arrival.",
		durationMs: 8400,
		motionMode: "drift",
		focusTarget: "neptune",
		accentColor: "#5f3572",
		glowColor: "rgba(95, 53, 114, 0.28)",
		choreography: {
			featuredShipId: "fleet-delta",
			featuredRouteIds: ["mid-route", "footer-lane"],
			fleetPaceMultiplier: 0.95,
			sceneFrame: {
				scale: 1.09,
				xPercent: -8.08,
				yPercent: 1.92,
				rotateDeg: 0.38,
				breathScale: 0.014,
				breathXPercent: 0.24,
				breathYPercent: 0.16,
			},
			shipCues: [
				{
					shipId: "fleet-delta",
					paceMultiplier: 0.89,
					delayOffset: -0.12,
					driftX: -3.4,
					driftY: -2.2,
					scaleBoost: 0.024,
					rotateBias: -0.85,
				},
				{
					shipId: "fleet-alpha",
					paceMultiplier: 0.95,
					driftX: -2.4,
					driftY: -1.4,
					scaleBoost: 0.016,
					rotateBias: -0.4,
				},
			],
		},
		hotspotId: "neptune-dossier",
	},
] as const satisfies readonly PosterTourStop[];

export const posterTourStopCount = posterTourStops.length;

export const getPosterTourStopByIndex = (index: number) =>
	posterTourStops[index] ?? null;
