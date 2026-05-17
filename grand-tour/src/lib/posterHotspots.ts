import type {
	PosterFleetShipId,
	PosterRouteStripeId,
} from "./posterFlightPaths";

export type PosterHotspotKind = "ship" | "planet";

export type PosterHotspotFrame = {
	top: string;
	left: string;
	width: string;
	height: string;
	radius: string;
};

export type PosterHotspotFact = {
	label: string;
	value: string;
};

export type PosterHotspot = {
	id: string;
	kind: PosterHotspotKind;
	eyebrow: string;
	title: string;
	description: string;
	accent: string;
	relatedRouteIds: readonly PosterRouteStripeId[];
	shipId?: PosterFleetShipId;
	triggerFrame: PosterHotspotFrame;
	focusFrame: PosterHotspotFrame;
	facts: readonly PosterHotspotFact[];
};

export const posterHotspots = [
	{
		id: "fleet-alpha-spotlight",
		kind: "ship",
		eyebrow: "Fleet spotlight",
		title: "Fleet Alpha arrowliner",
		description:
			"The hero cruiser rides the warm mid-route corridor toward the first gravity-assist window.",
		accent: "#e26239",
		relatedRouteIds: ["mid-route"],
		shipId: "fleet-alpha",
		triggerFrame: {
			top: "38.5%",
			left: "12.3%",
			width: "36.8%",
			height: "8.4%",
			radius: "999px",
		},
		focusFrame: {
			top: "39.3%",
			left: "13.8%",
			width: "33.8%",
			height: "7%",
			radius: "999px",
		},
		facts: [
			{ label: "Route", value: "Mid route" },
			{ label: "Role", value: "Passenger lead" },
		],
	},
	{
		id: "fleet-beta-spotlight",
		kind: "ship",
		eyebrow: "Fleet spotlight",
		title: "Fleet Beta scout dart",
		description:
			"A quick skip-burn courier slicing the orange lane to scout the next alignment.",
		accent: "#81ae39",
		relatedRouteIds: ["middle-orange"],
		shipId: "fleet-beta",
		triggerFrame: {
			top: "24.4%",
			left: "39.6%",
			width: "18.4%",
			height: "7.2%",
			radius: "999px",
		},
		focusFrame: {
			top: "24.9%",
			left: "40.6%",
			width: "16.4%",
			height: "6.2%",
			radius: "999px",
		},
		facts: [
			{ label: "Lane", value: "Middle orange" },
			{ label: "Job", value: "Scout burn" },
		],
	},
	{
		id: "fleet-gamma-spotlight",
		kind: "ship",
		eyebrow: "Fleet spotlight",
		title: "Fleet Gamma observatory shuttle",
		description:
			"The shuttle glides along the cool center-teal corridor, trading speed for a better view.",
		accent: "#00989a",
		relatedRouteIds: ["center-teal"],
		shipId: "fleet-gamma",
		triggerFrame: {
			top: "30.1%",
			left: "36.4%",
			width: "28.8%",
			height: "8.4%",
			radius: "999px",
		},
		focusFrame: {
			top: "31%",
			left: "37.6%",
			width: "26.2%",
			height: "7%",
			radius: "999px",
		},
		facts: [
			{ label: "Lane", value: "Center teal" },
			{ label: "Mood", value: "Observation pass" },
		],
	},
	{
		id: "fleet-delta-spotlight",
		kind: "ship",
		eyebrow: "Fleet spotlight",
		title: "Fleet Delta courier",
		description:
			"The red-tipped dart stitches together the green corridors that carry the poster into the footer horizon.",
		accent: "#ec1f26",
		relatedRouteIds: ["mid-green", "footer-lane"],
		shipId: "fleet-delta",
		triggerFrame: {
			top: "46.2%",
			left: "50.2%",
			width: "13.4%",
			height: "6%",
			radius: "999px",
		},
		focusFrame: {
			top: "46.7%",
			left: "50.9%",
			width: "11.6%",
			height: "5.2%",
			radius: "999px",
		},
		facts: [
			{ label: "Corridor", value: "Green to footer" },
			{ label: "Task", value: "Long-haul relay" },
		],
	},
	{
		id: "solar-launch-dossier",
		kind: "planet",
		eyebrow: "Launch dossier",
		title: "Solar departure window",
		description:
			"The warm ignition point at the poster’s edge establishes the travel vector for every active lane.",
		accent: "#e26239",
		relatedRouteIds: ["mid-route"],
		triggerFrame: {
			top: "43.8%",
			left: "7.2%",
			width: "5%",
			height: "5%",
			radius: "50%",
		},
		focusFrame: {
			top: "33.4%",
			left: "-2.2%",
			width: "21.5%",
			height: "21.5%",
			radius: "50%",
		},
		facts: [
			{ label: "Assist", value: "Helio slingshot" },
			{ label: "Signal", value: "Warm beacons" },
		],
	},
	{
		id: "jupiter-dossier",
		kind: "planet",
		eyebrow: "Planet dossier",
		title: "Jupiter gravity well",
		description:
			"The dominant green mass is the poster’s central assist body, collecting ships and route bands into one field.",
		accent: "#1a7d56",
		relatedRouteIds: ["middle-orange", "center-teal", "mid-green"],
		triggerFrame: {
			top: "53.6%",
			left: "60.6%",
			width: "5.4%",
			height: "5.4%",
			radius: "50%",
		},
		focusFrame: {
			top: "18.6%",
			left: "15.2%",
			width: "60.5%",
			height: "60.5%",
			radius: "50%",
		},
		facts: [
			{ label: "Assist", value: "Primary swingby" },
			{ label: "Lanes", value: "Orange · teal · green" },
		],
	},
	{
		id: "neptune-dossier",
		kind: "planet",
		eyebrow: "Planet dossier",
		title: "Neptune dusk hemisphere",
		description:
			"The violet body on the right edge turns the poster into a night-side arrival, framed by the outer orbit arcs.",
		accent: "#5f3572",
		relatedRouteIds: ["mid-route", "footer-lane"],
		triggerFrame: {
			top: "40.1%",
			left: "82.3%",
			width: "5.2%",
			height: "5.2%",
			radius: "50%",
		},
		focusFrame: {
			top: "12%",
			left: "67%",
			width: "33%",
			height: "56%",
			radius: "50%",
		},
		facts: [
			{ label: "Orbit", value: "Outer arc frame" },
			{ label: "Arrival", value: "Footer approach" },
		],
	},
	{
		id: "uranus-dossier",
		kind: "planet",
		eyebrow: "Planet dossier",
		title: "Uranus relay node",
		description:
			"The magenta token acts like a plotted waypoint, keeping the lower poster from drifting into pure atmosphere.",
		accent: "#761c59",
		relatedRouteIds: ["footer-lane"],
		triggerFrame: {
			top: "77.2%",
			left: "46.2%",
			width: "4.8%",
			height: "4.8%",
			radius: "50%",
		},
		focusFrame: {
			top: "73%",
			left: "42%",
			width: "14%",
			height: "14%",
			radius: "50%",
		},
		facts: [
			{ label: "Role", value: "Waypoint marker" },
			{ label: "Lane", value: "Footer relay" },
		],
	},
] as const satisfies readonly PosterHotspot[];

export type PosterHotspotId = (typeof posterHotspots)[number]["id"];
