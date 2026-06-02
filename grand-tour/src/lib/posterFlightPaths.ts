export type PosterFleetShipId =
	| "fleet-alpha"
	| "fleet-beta"
	| "fleet-gamma"
	| "fleet-delta";

export type PosterFleetMotionMode = "drift" | "orbit";

export type PosterRouteStripeId =
	| "middle-orange"
	| "center-teal"
	| "mid-route"
	| "mid-green"
	| "footer-lane";

export type PosterOrbitLoop = {
	duration: number;
	times: readonly number[];
	xPercentKeyframes: readonly number[];
	yPercentKeyframes: readonly number[];
	rotateKeyframes: readonly number[];
	scaleKeyframes: readonly number[];
	opacityKeyframes: readonly number[];
};

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
	orbitLoop: PosterOrbitLoop;
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
		xKeyframes: [0, 20, 46, 26, 0],
		yKeyframes: [0, -4, -2, 3, 0],
		rotateKeyframes: [0, 0.7, -0.2, 0.4, 0],
		scaleKeyframes: [1, 1.014, 1.022, 1.008, 1],
		wakeAccent: "rgba(226, 98, 57, 0.96)",
		wakeGlow: "rgba(226, 98, 57, 0.26)",
		wakeSpark: "rgba(255, 240, 214, 0.92)",
		orbitLoop: {
			duration: 24,
			times: [0, 0.28, 0.46, 0.5, 1],
			xPercentKeyframes: [0, -52, -118, 118, 0],
			yPercentKeyframes: [0, -0.4, -1.1, 1.2, 0],
			rotateKeyframes: [0, -0.6, -1.4, 0.8, 0],
			scaleKeyframes: [1, 1.018, 0.97, 0.972, 1],
			opacityKeyframes: [1, 0.92, 0.12, 0.18, 1],
		},
	},
	{
		id: "fleet-beta",
		label: "Fleet Beta",
		duration: 18,
		delay: 0.7,
		zIndex: 20,
		xKeyframes: [0, 14, 30, 18, 0],
		yKeyframes: [0, -3, -5, 2, 0],
		rotateKeyframes: [-1, -0.4, -0.7, -1.2, -1],
		scaleKeyframes: [1, 1.01, 1.018, 1.004, 1],
		wakeAccent: "rgba(129, 174, 57, 0.94)",
		wakeGlow: "rgba(129, 174, 57, 0.24)",
		wakeSpark: "rgba(246, 250, 221, 0.9)",
		orbitLoop: {
			duration: 22,
			times: [0, 0.3, 0.48, 0.52, 1],
			xPercentKeyframes: [0, -48, -116, 120, 0],
			yPercentKeyframes: [0, -0.2, -0.9, 1.1, 0],
			rotateKeyframes: [-1, -1.6, -2.8, 0.4, -1],
			scaleKeyframes: [1, 1.012, 0.968, 0.97, 1],
			opacityKeyframes: [1, 0.88, 0.1, 0.16, 1],
		},
	},
	{
		id: "fleet-gamma",
		label: "Fleet Gamma",
		duration: 19,
		delay: 0.35,
		zIndex: 21,
		xKeyframes: [0, 18, 36, 20, 0],
		yKeyframes: [0, -4, -8, -2, 0],
		rotateKeyframes: [1, 1.6, 0.8, 1.2, 1],
		scaleKeyframes: [1, 1.014, 1.022, 1.008, 1],
		wakeAccent: "rgba(0, 152, 154, 0.96)",
		wakeGlow: "rgba(0, 152, 154, 0.24)",
		wakeSpark: "rgba(228, 254, 255, 0.92)",
		orbitLoop: {
			duration: 23,
			times: [0, 0.26, 0.45, 0.5, 1],
			xPercentKeyframes: [0, -50, -120, 122, 0],
			yPercentKeyframes: [0, -0.6, -1.4, 1.4, 0],
			rotateKeyframes: [1, 0.2, -0.9, 1.8, 1],
			scaleKeyframes: [1, 1.016, 0.966, 0.972, 1],
			opacityKeyframes: [1, 0.9, 0.1, 0.16, 1],
		},
	},
	{
		id: "fleet-delta",
		label: "Fleet Delta",
		duration: 20,
		delay: 1,
		zIndex: 19,
		xKeyframes: [0, 16, 34, 18, 0],
		yKeyframes: [0, -2, -6, 1, 0],
		rotateKeyframes: [-3, -2.4, -3.4, -2.8, -3],
		scaleKeyframes: [1, 1.008, 1.016, 1.003, 1],
		wakeAccent: "rgba(236, 31, 38, 0.96)",
		wakeGlow: "rgba(236, 31, 38, 0.24)",
		wakeSpark: "rgba(255, 232, 220, 0.92)",
		orbitLoop: {
			duration: 24,
			times: [0, 0.32, 0.5, 0.54, 1],
			xPercentKeyframes: [0, -46, -114, 118, 0],
			yPercentKeyframes: [0, 0.1, -0.8, 1.3, 0],
			rotateKeyframes: [-3, -3.6, -4.8, -1.6, -3],
			scaleKeyframes: [1, 1.01, 0.97, 0.974, 1],
			opacityKeyframes: [1, 0.86, 0.1, 0.15, 1],
		},
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
