import type { CSSProperties } from "react";

export type ShipModel = "arrow" | "shuttle" | "dart";

export type PlanetLayer = {
	id: string;
	width: string;
	height: string;
	top: string;
	left: string;
	background: string;
	opacity: number;
	float: number;
	zIndex: number;
	mixBlendMode?: CSSProperties["mixBlendMode"];
	blur?: string;
};

export type StripeLayer = {
	id: string;
	top: string;
	left: string;
	width: string;
	height: string;
	color: string;
	opacity: number;
	drift: number;
	duration: number;
	delay: number;
	zIndex: number;
};

export type ShipLayer = {
	id: string;
	model: ShipModel;
	top: string;
	left: string;
	width: string;
	rotation: number;
	scale: number;
	accent: string;
	drift: number;
	duration: number;
	delay: number;
	zIndex: number;
};

export const posterCopy = {
	kicker: "A once in a lifetime getaway",
	title: "The Grand Tour",
	itinerary: ["Jupiter", "Saturn", "Uranus", "Neptune"],
	subheading: "Experience the charm of gravity assists",
	badgePrefix: "Every",
	badgeValue: "175",
	badgeSuffix: "years",
	boarding: "Now boarding",
	missionEyebrow: "Route dossier",
	missionDetails: [
		{
			label: "Departures",
			value: "Earth orbit terminal",
		},
		{
			label: "Travel",
			value: "Gravity-assist arcs",
		},
		{
			label: "Viewing",
			value: "Outer planet flybys",
		},
	],
} as const;

export const platformHighlights = [
	"Window-seat views",
	"Ring-side cruising",
	"Golden departures",
	"Starlit stopovers",
	"Postcard planets",
	"Twilight flybys",
] as const;

export const buildPhases = [
	{
		title: "Departure lounge",
		detail:
			"Find your seat, unfold the star map, and let the colors of the route settle in before lift-off.",
	},
	{
		title: "Promenade deck",
		detail:
			"Watch golden lanes, gentle glows, and passing ships turn the poster into a living window on the voyage.",
	},
	{
		title: "Guided sightings",
		detail:
			"Linger over notable worlds, elegant craft, and secret routes for little discoveries along the way.",
	},
	{
		title: "Storybook excursion",
		detail:
			"Follow the journey from planet to planet as the grand itinerary opens like a beautifully stamped travel journal.",
	},
] as const;

export const planets: PlanetLayer[] = [
	{
		id: "red-sun-core",
		width: "22%",
		height: "22%",
		top: "38%",
		left: "-1%",
		background:
			"radial-gradient(circle, rgba(236,31,38,0.94), rgba(198,33,50,0.82) 60%, rgba(22,21,27,0.45) 100%)",
		opacity: 0.96,
		float: 3,
		zIndex: 5,
		mixBlendMode: "multiply",
	},
	{
		id: "main-green",
		width: "60%",
		height: "60%",
		top: "20%",
		left: "15%",
		background:
			"radial-gradient(circle at 38% 34%, rgba(14,126,87,0.84), rgba(2,99,71,0.96) 52%, rgba(3,76,54,0.94) 100%)",
		opacity: 0.94,
		float: 8,
		zIndex: 6,
		mixBlendMode: "multiply",
	},
	{
		id: "turquoise-lens",
		width: "46%",
		height: "46%",
		top: "26%",
		left: "29%",
		background:
			"radial-gradient(circle, rgba(0,152,154,0.34), rgba(1,152,173,0.76) 70%, rgba(1,152,173,0.86) 100%)",
		opacity: 0.74,
		float: 10,
		zIndex: 9,
		mixBlendMode: "normal",
	},
	{
		id: "yellow-sweep",
		width: "52%",
		height: "26%",
		top: "62%",
		left: "23%",
		background:
			"radial-gradient(circle at 40% 40%, rgba(251,166,49,0.98), rgba(251,166,49,0.68) 58%, rgba(251,166,49,0.08) 100%)",
		opacity: 0.8,
		float: 6,
		zIndex: 4,
		mixBlendMode: "multiply",
		blur: "0.4px",
	},
	{
		id: "violet-right",
		width: "52%",
		height: "88%",
		top: "18%",
		left: "65%",
		background:
			"radial-gradient(circle at 35% 45%, rgba(59,33,68,0.18), rgba(58,26,72,0.52) 44%, rgba(38,18,51,0.86) 100%)",
		opacity: 0.82,
		float: 5,
		zIndex: 13,
		mixBlendMode: "multiply",
	},
	{
		id: "magenta-token",
		width: "14%",
		height: "14%",
		top: "73%",
		left: "42%",
		background:
			"radial-gradient(circle, rgba(118,28,89,0.92), rgba(88,18,86,0.86) 62%, rgba(118,28,89,0.6) 100%)",
		opacity: 0.9,
		float: 5,
		zIndex: 18,
		mixBlendMode: "multiply",
	},
	{
		id: "teal-dot",
		width: "6%",
		height: "6%",
		top: "74%",
		left: "6%",
		background:
			"radial-gradient(circle, rgba(1,152,173,1), rgba(0,152,154,0.92))",
		opacity: 0.88,
		float: 4,
		zIndex: 17,
		mixBlendMode: "normal",
	},
];

export const stripes: StripeLayer[] = [
	{
		id: "top-teal",
		top: "7%",
		left: "60%",
		width: "42%",
		height: "0.45%",
		color: "rgba(1, 152, 173, 0.95)",
		opacity: 0.88,
		drift: -20,
		duration: 15,
		delay: 0,
		zIndex: 17,
	},
	{
		id: "top-muted",
		top: "14%",
		left: "25%",
		width: "74%",
		height: "1.2%",
		color: "rgba(176, 203, 194, 0.82)",
		opacity: 0.72,
		drift: 24,
		duration: 18,
		delay: 0.2,
		zIndex: 9,
	},
	{
		id: "top-red",
		top: "16%",
		left: "14%",
		width: "66%",
		height: "1.4%",
		color: "rgba(236, 31, 38, 0.86)",
		opacity: 0.88,
		drift: -26,
		duration: 14,
		delay: 0.4,
		zIndex: 14,
	},
	{
		id: "middle-orange",
		top: "25%",
		left: "20%",
		width: "80%",
		height: "1.6%",
		color: "rgba(251, 166, 49, 0.88)",
		opacity: 0.82,
		drift: 28,
		duration: 16,
		delay: 0.8,
		zIndex: 11,
	},
	{
		id: "center-teal",
		top: "28%",
		left: "33%",
		width: "34%",
		height: "1.2%",
		color: "rgba(1, 152, 173, 0.86)",
		opacity: 0.76,
		drift: -18,
		duration: 20,
		delay: 0.5,
		zIndex: 16,
	},
	{
		id: "mid-route",
		top: "35%",
		left: "3%",
		width: "88%",
		height: "0.95%",
		color: "rgba(226, 98, 57, 0.92)",
		opacity: 0.8,
		drift: 32,
		duration: 13,
		delay: 0.1,
		zIndex: 12,
	},
	{
		id: "mid-green",
		top: "41%",
		left: "16%",
		width: "52%",
		height: "1.25%",
		color: "rgba(129, 174, 57, 0.92)",
		opacity: 0.78,
		drift: -22,
		duration: 17,
		delay: 0.3,
		zIndex: 10,
	},
	{
		id: "bottom-orange",
		top: "67%",
		left: "0%",
		width: "100%",
		height: "1.9%",
		color: "rgba(251, 166, 49, 0.92)",
		opacity: 0.92,
		drift: 18,
		duration: 19,
		delay: 0.7,
		zIndex: 3,
	},
	{
		id: "footer-lane",
		top: "74.5%",
		left: "18%",
		width: "64%",
		height: "1.15%",
		color: "rgba(129, 174, 57, 0.84)",
		opacity: 0.8,
		drift: -20,
		duration: 21,
		delay: 0.9,
		zIndex: 7,
	},
	{
		id: "footer-red",
		top: "76.4%",
		left: "8%",
		width: "92%",
		height: "1.5%",
		color: "rgba(236, 31, 38, 0.88)",
		opacity: 0.86,
		drift: 28,
		duration: 14,
		delay: 0.2,
		zIndex: 8,
	},
];

export const ships: ShipLayer[] = [
	{
		id: "fleet-alpha",
		model: "arrow",
		top: "42.5%",
		left: "16%",
		width: "26%",
		rotation: 0,
		scale: 1,
		accent: "#e26239",
		drift: 10,
		duration: 9,
		delay: 0,
		zIndex: 18,
	},
	{
		id: "fleet-beta",
		model: "dart",
		top: "28.4%",
		left: "40%",
		width: "18%",
		rotation: -1,
		scale: 0.96,
		accent: "#81ae39",
		drift: 8,
		duration: 8,
		delay: 0.45,
		zIndex: 19,
	},
	{
		id: "fleet-gamma",
		model: "shuttle",
		top: "34%",
		left: "39%",
		width: "22%",
		rotation: 1,
		scale: 1.02,
		accent: "#00989a",
		drift: 7,
		duration: 10,
		delay: 0.2,
		zIndex: 20,
	},
	{
		id: "fleet-delta",
		model: "dart",
		top: "53.4%",
		left: "47%",
		width: "16%",
		rotation: -3,
		scale: 0.92,
		accent: "#ec1f26",
		drift: 9,
		duration: 9.5,
		delay: 0.8,
		zIndex: 18,
	},
];
