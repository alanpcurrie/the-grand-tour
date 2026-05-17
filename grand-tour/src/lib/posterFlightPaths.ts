export type PosterFleetShipId =
	| "fleet-alpha"
	| "fleet-beta"
	| "fleet-gamma"
	| "fleet-delta";

export type PosterRouteStripeId =
	| "middle-orange"
	| "center-teal"
	| "mid-route"
	| "mid-green"
	| "footer-lane";

export type PosterFlightPath = {
	id: PosterFleetShipId;
	label: string;
	duration: number;
	delay: number;
	zIndex: number;
	xKeyframes: readonly number[];
	yKeyframes: readonly number[];
	rotateKeyframes: readonly number[];
	scaleKeyframes: readonly number[];
	wakeAccent: string;
	wakeGlow: string;
	wakeSpark: string;
};

export type PosterRouteSignal = {
	id: string;
	shipId: PosterFleetShipId;
	stripeId: PosterRouteStripeId;
	accent: string;
	glow: string;
	beam: string;
	node: string;
	markerFractions: readonly number[];
	phaseOffset?: number;
	zIndexBoost?: number;
};

export const posterFlightPaths: readonly PosterFlightPath[] = [
	{
		id: "fleet-alpha",
		label: "Fleet Alpha",
		duration: 21,
		delay: 0.2,
		zIndex: 19,
		xKeyframes: [0, 16, 34, 12, 0],
		yKeyframes: [0, -10, -4, 9, 0],
		rotateKeyframes: [0, 1.4, -0.4, 0.8, 0],
		scaleKeyframes: [1, 1.018, 1.028, 1.01, 1],
		wakeAccent: "rgba(226, 98, 57, 0.96)",
		wakeGlow: "rgba(226, 98, 57, 0.26)",
		wakeSpark: "rgba(255, 240, 214, 0.92)",
	},
	{
		id: "fleet-beta",
		label: "Fleet Beta",
		duration: 18,
		delay: 0.7,
		zIndex: 20,
		xKeyframes: [0, 10, 22, 6, 0],
		yKeyframes: [0, -12, -6, 6, 0],
		rotateKeyframes: [-1, 0.4, -0.2, -1.4, -1],
		scaleKeyframes: [1, 1.012, 1.024, 1.006, 1],
		wakeAccent: "rgba(129, 174, 57, 0.94)",
		wakeGlow: "rgba(129, 174, 57, 0.24)",
		wakeSpark: "rgba(246, 250, 221, 0.9)",
	},
	{
		id: "fleet-gamma",
		label: "Fleet Gamma",
		duration: 19,
		delay: 0.35,
		zIndex: 21,
		xKeyframes: [0, 18, 10, -2, 0],
		yKeyframes: [0, -8, -18, -4, 0],
		rotateKeyframes: [1, 2.2, 0.6, 1.5, 1],
		scaleKeyframes: [1, 1.016, 1.03, 1.01, 1],
		wakeAccent: "rgba(0, 152, 154, 0.96)",
		wakeGlow: "rgba(0, 152, 154, 0.24)",
		wakeSpark: "rgba(228, 254, 255, 0.92)",
	},
	{
		id: "fleet-delta",
		label: "Fleet Delta",
		duration: 20,
		delay: 1,
		zIndex: 19,
		xKeyframes: [0, 12, 28, 8, 0],
		yKeyframes: [0, -6, -16, -2, 0],
		rotateKeyframes: [-3, -1.4, -4.2, -2.2, -3],
		scaleKeyframes: [1, 1.01, 1.022, 1.004, 1],
		wakeAccent: "rgba(236, 31, 38, 0.96)",
		wakeGlow: "rgba(236, 31, 38, 0.24)",
		wakeSpark: "rgba(255, 232, 220, 0.92)",
	},
];

export const posterRouteSignals: readonly PosterRouteSignal[] = [
	{
		id: "alpha-mid-route",
		shipId: "fleet-alpha",
		stripeId: "mid-route",
		accent: "rgba(226, 98, 57, 0.98)",
		glow: "rgba(226, 98, 57, 0.24)",
		beam: "rgba(255, 247, 235, 0.72)",
		node: "rgba(250, 234, 208, 0.96)",
		markerFractions: [11, 51, 85],
		zIndexBoost: 5,
	},
	{
		id: "beta-middle-orange",
		shipId: "fleet-beta",
		stripeId: "middle-orange",
		accent: "rgba(251, 166, 49, 0.98)",
		glow: "rgba(251, 166, 49, 0.22)",
		beam: "rgba(255, 249, 236, 0.7)",
		node: "rgba(129, 174, 57, 0.96)",
		markerFractions: [16, 52, 88],
		phaseOffset: 0.15,
		zIndexBoost: 4,
	},
	{
		id: "gamma-center-teal",
		shipId: "fleet-gamma",
		stripeId: "center-teal",
		accent: "rgba(0, 152, 154, 0.98)",
		glow: "rgba(0, 152, 154, 0.22)",
		beam: "rgba(232, 253, 255, 0.74)",
		node: "rgba(147, 238, 244, 0.94)",
		markerFractions: [14, 52, 82],
		phaseOffset: 0.2,
		zIndexBoost: 5,
	},
	{
		id: "delta-mid-green",
		shipId: "fleet-delta",
		stripeId: "mid-green",
		accent: "rgba(129, 174, 57, 0.96)",
		glow: "rgba(129, 174, 57, 0.22)",
		beam: "rgba(245, 252, 227, 0.72)",
		node: "rgba(255, 238, 225, 0.92)",
		markerFractions: [18, 56, 88],
		phaseOffset: 0.1,
		zIndexBoost: 4,
	},
	{
		id: "delta-footer-lane",
		shipId: "fleet-delta",
		stripeId: "footer-lane",
		accent: "rgba(129, 174, 57, 0.88)",
		glow: "rgba(129, 174, 57, 0.18)",
		beam: "rgba(247, 251, 227, 0.68)",
		node: "rgba(236, 31, 38, 0.88)",
		markerFractions: [18, 52, 82],
		phaseOffset: 0.8,
		zIndexBoost: 3,
	},
];
