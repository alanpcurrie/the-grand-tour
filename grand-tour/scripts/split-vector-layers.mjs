import { mkdir } from "node:fs/promises";
import { basename, resolve } from "node:path";

import { loadConfig, optimize } from "svgo";
import { svgPathBbox } from "svg-path-bbox";

const cli = parseCliArgs(Bun.argv.slice(2));
const projectRoot = resolve(import.meta.dir, "..");
const inputArg =
	cli.positionals[0] ?? "./public/reference/generated/grand-tour-vtracer.svg";
const outputArg = cli.positionals[1] ?? "./public/reference/generated/layers";
const inputPath = resolve(projectRoot, inputArg);
const outputDir = resolve(projectRoot, outputArg);
const inputFile = Bun.file(inputPath);
const inputStem = basename(inputPath, ".svg");
const manifestPath = resolve(outputDir, `${inputStem}.layer-manifest.json`);
const layeredSvgPath = resolve(outputDir, `${inputStem}.layered.svg`);
const svgoConfigPath = resolve(projectRoot, "svgo.config.mjs");

if (!(await inputFile.exists())) {
	throw new Error(`Layer split source SVG not found: ${inputPath}`);
}

await mkdir(outputDir, { recursive: true });

const svgoConfig = (await loadConfig(svgoConfigPath, projectRoot)) ?? {
	multipass: true,
	plugins: ["preset-default", "sortAttrs"],
};

const svgText = await inputFile.text();
const svgMatch = svgText.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);

if (!svgMatch) {
	throw new Error(`Unable to parse SVG root from ${inputPath}`);
}

const [, svgAttrsText, svgInner] = svgMatch;
const svgAttrs = parseAttributes(svgAttrsText);
const canvas = getCanvasMetrics(svgAttrs);
const pathRegex = /<path\b([\s\S]*?)(?:\/>|><\/path>)/gi;
const rawPaths = [...svgInner.matchAll(pathRegex)];

const layerOrder = [
	"background",
	"orbits",
	"planets",
	"stripes",
	"fleet",
	"footer",
	"micro",
	"residual",
];

const posterTokens = [
	createToken("paper", "#faead0", "background"),
	createToken("paper-light", "#f7f0df", "background"),
	createToken("ink", "#16151b", "ink"),
	createToken("navy", "#0c1c2c", "ink"),
	createToken("ship-cream", "#cbb48f", "fleet"),
	createToken("green-a", "#89b941", "planet"),
	createToken("green-b", "#81ae39", "planet"),
	createToken("mist", "#b0cbc2", "stripe"),
	createToken("turquoise", "#00989a", "planet"),
	createToken("cyan", "#0198ad", "planet"),
	createToken("yellow", "#fba631", "warm"),
	createToken("orange", "#e26239", "warm"),
	createToken("red", "#ec1f26", "orbit"),
	createToken("magenta", "#761c59", "orbit"),
	createToken("violet", "#3a1a48", "orbit"),
];

const totalCanvasArea = canvas.width * canvas.height;
const draftEntries = rawPaths.map((pathMatch, index) =>
	createPathEntry({
		canvas,
		index,
		pathMatch,
		posterTokens,
		totalCanvasArea,
	}),
);
const residualReducedEntries = draftEntries.map((entry) =>
	finalizeEntry(entry),
);
const residualReducerSummary = summarizeResidualReducer(residualReducedEntries);
const entries = applySpatialReducer({
	canvas,
	entries: residualReducedEntries,
});
const layers = Object.fromEntries(layerOrder.map((layerId) => [layerId, []]));

for (const entry of entries) {
	layers[entry.layerId].push(entry);
}

const spatialReducerSummary = summarizeSpatialReducer({
	entries,
	residualReducedEntries,
});

const layerSummaries = [];

for (const layerId of layerOrder) {
	const entries = layers[layerId];
	const countsByToken = countBy(
		entries,
		(entry) => entry.token?.name ?? "unmapped",
	);
	const countsByFill = countBy(entries, (entry) => entry.fill ?? "none");
	const outputFile = `${inputStem}.${layerId}.svg`;

	if (entries.length > 0) {
		const rawLayerSvg = buildSvgDocument({
			canvas,
			title: `${inputStem} — ${layerId}`,
			content: entries.map((entry) => entry.markup).join(""),
		});
		const optimizedLayerSvg = optimize(rawLayerSvg, {
			path: resolve(outputDir, outputFile),
			...svgoConfig,
		}).data;
		await Bun.write(resolve(outputDir, outputFile), optimizedLayerSvg);
	}

	layerSummaries.push({
		id: layerId,
		file: entries.length > 0 ? outputFile : null,
		count: entries.length,
		approxCoverage: Number(
			entries
				.reduce((sum, entry) => sum + (entry.metrics?.areaRatio ?? 0), 0)
				.toFixed(4),
		),
		countsByToken,
		countsByFill,
		samples: entries.slice(0, 5).map((entry) => ({
			index: entry.index,
			fill: entry.fill,
			token: entry.token?.name ?? null,
			primaryLayer: entry.primaryLayerId,
			stage: entry.classificationStage,
			residualRule: entry.residualRuleId,
			spatialRule: entry.spatialRuleId,
			reason: entry.reason,
			bbox: entry.bbox,
		})),
	});
}

const layeredSvg = buildSvgDocument({
	canvas,
	title: `${inputStem} — layered split`,
	content: layerOrder
		.map((layerId) => {
			const entries = layers[layerId];
			return `<g id="${layerId}" data-count="${entries.length}">${entries
				.map((entry) => entry.markup)
				.join("")}</g>`;
		})
		.join(""),
});

const optimizedLayeredSvg = optimize(layeredSvg, {
	path: layeredSvgPath,
	...svgoConfig,
}).data;

await Bun.write(layeredSvgPath, optimizedLayeredSvg);

const manifest = {
	generatedAt: new Date().toISOString(),
	input: {
		file: basename(inputPath),
		path: inputPath,
	},
	canvas,
	layerOrder,
	thresholdNotes: [
		"This split is heuristic and uses nearest-palette color mapping plus rough bbox-based shape rules.",
		"A second-pass residual reducer now promotes high-confidence leftovers into stripes, fleet, planets, orbits, footer, and background buckets.",
		"A third-pass spatial reducer only reassigns remaining residual paths when they almost perfectly align to an already-classified shape's bounding box.",
		"It is intended for cleanup and authoring support, not as a guaranteed semantic segmentation.",
		"The Rust VTracer output is preferred as the input because it yields fewer, larger shapes than the JS fallback.",
	],
	residualReducer: residualReducerSummary,
	spatialReducer: spatialReducerSummary,
	layers: layerSummaries,
};

await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Split vector layers from ${inputPath}`);
console.log(
	`Residual reducer reassigned ${residualReducerSummary.reassignedCount} paths and left ${residualReducerSummary.remainingResidualCount} in residual.`,
);
console.log(
	`Spatial reducer reassigned ${spatialReducerSummary.reassignedCount} more paths and left ${spatialReducerSummary.remainingResidualCount} in residual.`,
);
console.table(
	layerSummaries.map((layer) => ({
		layer: layer.id,
		count: layer.count,
		approxCoverage: layer.approxCoverage,
		file: layer.file ?? "(empty)",
	})),
);
console.log(`Layered SVG: ${layeredSvgPath}`);
console.log(`Layer manifest: ${manifestPath}`);

function buildSvgDocument({ canvas, title, content }) {
	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="${canvas.viewBox}">`,
		`<title>${escapeXml(title)}</title>`,
		content,
		"</svg>",
	].join("");
}

function classifyPrimaryLayer({ token, metrics }) {
	if (!metrics) {
		return "residual";
	}

	if (
		metrics.areaRatio > 0.82 ||
		(token?.family === "background" && metrics.areaRatio > 0.35)
	) {
		return "background";
	}

	if (
		metrics.centerYRatio > 0.79 ||
		(token?.family === "ink" &&
			metrics.centerYRatio > 0.68 &&
			metrics.widthRatio > 0.08)
	) {
		return "footer";
	}

	if (
		metrics.areaRatio < 0.00005 ||
		(metrics.widthRatio < 0.012 && metrics.heightRatio < 0.012)
	) {
		return "micro";
	}

	if (
		(token?.family === "orbit" ||
			(token?.family === "ink" && metrics.centerXRatio > 0.42)) &&
		metrics.heightRatio > 0.22 &&
		metrics.widthRatio > 0.035 &&
		metrics.aspect < 1.4
	) {
		return "orbits";
	}

	if (
		metrics.widthRatio > 0.18 &&
		metrics.heightRatio < 0.055 &&
		metrics.aspect > 3
	) {
		return "stripes";
	}

	if (
		metrics.widthRatio > 0.05 &&
		metrics.heightRatio > 0.05 &&
		metrics.aspect > 0.55 &&
		metrics.aspect < 1.8 &&
		metrics.centerYRatio > 0.08 &&
		metrics.centerYRatio < 0.78 &&
		(token?.family === "planet" ||
			token?.family === "warm" ||
			token?.family === "orbit")
	) {
		return "planets";
	}

	if (
		metrics.widthRatio > 0.025 &&
		metrics.widthRatio < 0.26 &&
		metrics.heightRatio > 0.012 &&
		metrics.heightRatio < 0.09 &&
		metrics.aspect > 1.2 &&
		metrics.centerYRatio > 0.15 &&
		metrics.centerYRatio < 0.72
	) {
		return "fleet";
	}

	if (token?.family === "background") {
		return "background";
	}

	return "residual";
}

function classifyResidualLayer({ token, metrics }) {
	if (!metrics) {
		return null;
	}

	if (
		metrics.centerYRatio > 0.82 ||
		(metrics.centerYRatio > 0.74 &&
			metrics.widthRatio < 0.16 &&
			metrics.heightRatio < 0.09)
	) {
		return {
			layerId: "footer",
			ruleId: "residual-footer-spillover",
		};
	}

	if (
		token?.family === "background" &&
		(metrics.areaRatio > 0.002 ||
			metrics.widthRatio > 0.2 ||
			metrics.heightRatio > 0.03)
	) {
		return {
			layerId: "background",
			ruleId: "residual-background-spillover",
		};
	}

	if (
		token?.family === "fleet" &&
		metrics.widthRatio < 0.42 &&
		metrics.heightRatio < 0.1 &&
		metrics.aspect > 1.35 &&
		metrics.centerYRatio > 0.18 &&
		metrics.centerYRatio < 0.72
	) {
		return {
			layerId: "fleet",
			ruleId: "residual-fleet-hull",
		};
	}

	if (
		token?.family === "orbit" &&
		metrics.widthRatio > 0.16 &&
		metrics.heightRatio > 0.08 &&
		metrics.aspect < 3.4 &&
		metrics.centerYRatio > 0.1 &&
		metrics.centerYRatio < 0.78
	) {
		return {
			layerId: "orbits",
			ruleId: "residual-orbit-arc",
		};
	}

	if (
		metrics.widthRatio > 0.14 &&
		metrics.heightRatio < 0.14 &&
		metrics.aspect > 2.6 &&
		metrics.centerYRatio < 0.82 &&
		token?.family !== "background" &&
		token?.family !== "ink"
	) {
		return {
			layerId: "stripes",
			ruleId: "residual-horizontal-band",
		};
	}

	if (
		isOneOf(token?.family, ["planet", "warm", "orbit"]) &&
		metrics.widthRatio > 0.07 &&
		metrics.heightRatio > 0.04 &&
		metrics.aspect > 0.35 &&
		metrics.aspect < 3.6 &&
		metrics.centerYRatio > 0.1 &&
		metrics.centerYRatio < 0.76
	) {
		return {
			layerId: "planets",
			ruleId: "residual-planet-body",
		};
	}

	if (
		isOneOf(token?.family, ["fleet", "planet", "stripe", "warm"]) &&
		metrics.widthRatio > 0.022 &&
		metrics.widthRatio < 0.22 &&
		metrics.heightRatio > 0.004 &&
		metrics.heightRatio < 0.06 &&
		metrics.aspect > 1.35 &&
		metrics.centerYRatio > 0.14 &&
		metrics.centerYRatio < 0.72
	) {
		return {
			layerId: "fleet",
			ruleId: "residual-fleet-fragment",
		};
	}

	if (
		metrics.areaRatio < 0.00008 ||
		(metrics.widthRatio < 0.016 && metrics.heightRatio < 0.016)
	) {
		return {
			layerId: "micro",
			ruleId: "residual-micro-cleanup",
		};
	}

	return null;
}

function classifySpatialLayer({ canvas, entry, targetEntries }) {
	if (!entry.bbox || !entry.metrics) {
		return null;
	}

	const sourceArea = entry.bbox.width * entry.bbox.height;

	if (sourceArea <= 0) {
		return null;
	}

	const canvasDiagonal = Math.hypot(canvas.width, canvas.height);
	const spatialCandidates = targetEntries
		.filter(
			(target) =>
				target.index !== entry.index &&
				target.bbox &&
				target.metrics &&
				target.layerId !== "residual" &&
				target.layerId !== "micro" &&
				(target.layerId !== "background" ||
					entry.token?.family === "background"),
		)
		.map((target) => {
			const overlap = getBboxIntersectionArea(entry.bbox, target.bbox);
			const targetArea = target.bbox.width * target.bbox.height;
			const overlapRatio = sourceArea > 0 ? overlap / sourceArea : 0;
			const containmentRatio =
				Math.min(sourceArea, targetArea) > 0
					? overlap / Math.min(sourceArea, targetArea)
					: 0;
			const gap = getBboxGapDistance(entry.bbox, target.bbox);
			const gapRatio = canvasDiagonal > 0 ? gap / canvasDiagonal : 0;
			const centerDeltaY = Math.abs(
				entry.metrics.centerYRatio - target.metrics.centerYRatio,
			);
			const sameFamily = Boolean(
				entry.token?.family &&
					target.token?.family &&
					entry.token.family === target.token.family,
			);

			return {
				centerDeltaY,
				containmentRatio,
				gapRatio,
				layerId: target.layerId,
				overlapRatio,
				ruleId: "spatial-bbox-alignment",
				sameFamily,
				score:
					containmentRatio * 3 +
					overlapRatio * 2 +
					(sameFamily ? 0.6 : 0) +
					Math.max(0, 0.18 - centerDeltaY) * 2 -
					gapRatio * 8,
				targetIndex: target.index,
				targetLayerId: target.layerId,
			};
		})
		.sort((left, right) => right.score - left.score);

	const bestCandidate = spatialCandidates[0];

	if (!bestCandidate) {
		return null;
	}

	const hasStrongAlignment =
		bestCandidate.containmentRatio >= 0.95 &&
		bestCandidate.overlapRatio >= 0.95 &&
		bestCandidate.gapRatio <= 0.0005;

	if (!hasStrongAlignment) {
		return null;
	}

	if (
		bestCandidate.layerId === "background" &&
		entry.token?.family !== "background"
	) {
		return null;
	}

	return bestCandidate;
}

function countBy(entries, selector) {
	return Object.fromEntries(
		Object.entries(
			entries.reduce((counts, entry) => {
				const key = selector(entry);
				counts[key] = (counts[key] ?? 0) + 1;
				return counts;
			}, {}),
		).sort((left, right) => right[1] - left[1]),
	);
}

function createPathEntry({
	canvas,
	index,
	pathMatch,
	posterTokens,
	totalCanvasArea,
}) {
	const pathMarkup = pathMatch[0];
	const pathAttrs = parseAttributes(pathMatch[1]);
	const pathData = pathAttrs.d;

	if (!pathData) {
		return {
			index,
			markup: pathMarkup,
			fill: pathAttrs.fill ?? null,
			token: null,
			bbox: null,
			metrics: null,
			primaryLayerId: "residual",
			issueCode: "missing-path-data",
		};
	}

	const fillColor = pathAttrs.fill ?? pathAttrs.stroke ?? "#000000";
	const parsedColor = parseColor(fillColor);
	const token = parsedColor
		? findNearestToken(parsedColor, posterTokens)
		: null;

	let bbox = null;
	let issueCode = null;

	try {
		const [minX, minY, maxX, maxY] = svgPathBbox(pathData);
		bbox = {
			minX,
			minY,
			maxX,
			maxY,
			width: Math.max(0, maxX - minX),
			height: Math.max(0, maxY - minY),
		};
	} catch {
		issueCode = "missing-bbox";
	}

	const metrics = bbox
		? describeMetrics({ bbox, canvas, totalCanvasArea })
		: null;

	return {
		index,
		markup: pathMarkup,
		fill: fillColor,
		token,
		bbox,
		metrics,
		primaryLayerId: classifyPrimaryLayer({ token, metrics }),
		issueCode,
	};
}

function createToken(name, hex, family) {
	return { name, hex, family, rgb: hexToRgb(hex) };
}

function describeMetrics({ bbox, canvas, totalCanvasArea }) {
	const widthRatio = bbox.width / canvas.width;
	const heightRatio = bbox.height / canvas.height;
	const area = bbox.width * bbox.height;
	const centerX = bbox.minX + bbox.width / 2;
	const centerY = bbox.minY + bbox.height / 2;

	return {
		widthRatio,
		heightRatio,
		areaRatio: area / totalCanvasArea,
		centerXRatio: centerX / canvas.width,
		centerYRatio: centerY / canvas.height,
		aspect: bbox.width / Math.max(bbox.height, 0.0001),
	};
}

function escapeXml(value) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function explainClassification({
	finalLayerId,
	issueCode,
	metrics,
	primaryLayerId,
	residualRuleId,
	spatialRuleId,
	spatialTargetLayerId,
	spatialOverlapRatio,
	spatialContainmentRatio,
	spatialGapRatio,
	token,
}) {
	if (issueCode) {
		return issueCode;
	}

	if (!metrics) {
		return "missing-metrics";
	}

	const metricSummary = `${token?.name ?? "unmapped"}; w=${metrics.widthRatio.toFixed(3)}; h=${metrics.heightRatio.toFixed(3)}; y=${metrics.centerYRatio.toFixed(3)}`;

	if (residualRuleId) {
		return `${residualRuleId}; primary=${primaryLayerId}; ${metricSummary}`;
	}

	if (spatialRuleId) {
		return `${spatialRuleId}; target=${spatialTargetLayerId}; overlap=${spatialOverlapRatio?.toFixed(3) ?? "n/a"}; contain=${spatialContainmentRatio?.toFixed(3) ?? "n/a"}; gap=${spatialGapRatio?.toFixed(4) ?? "n/a"}; primary=${primaryLayerId}; ${metricSummary}`;
	}

	if (primaryLayerId !== finalLayerId) {
		return `${primaryLayerId}->${finalLayerId}; ${metricSummary}`;
	}

	return metricSummary;
}

function finalizeEntry(entry) {
	const residualDecision =
		entry.primaryLayerId === "residual"
			? classifyResidualLayer({ token: entry.token, metrics: entry.metrics })
			: null;
	const layerId = residualDecision?.layerId ?? entry.primaryLayerId;
	const classificationStage = residualDecision ? "residual-reducer" : "primary";

	return {
		...entry,
		classificationStage,
		layerId,
		reason: explainClassification({
			finalLayerId: layerId,
			issueCode: entry.issueCode,
			metrics: entry.metrics,
			primaryLayerId: entry.primaryLayerId,
			residualRuleId: residualDecision?.ruleId ?? null,
			spatialRuleId: null,
			spatialTargetLayerId: null,
			spatialOverlapRatio: null,
			spatialContainmentRatio: null,
			spatialGapRatio: null,
			token: entry.token,
		}),
		residualRuleId: residualDecision?.ruleId ?? null,
		spatialRuleId: null,
		spatialTargetLayerId: null,
		spatialOverlapRatio: null,
		spatialContainmentRatio: null,
		spatialGapRatio: null,
	};
}

function applySpatialReducer({ canvas, entries }) {
	const targetEntries = entries.filter(
		(entry) => entry.layerId !== "residual" && entry.layerId !== "micro",
	);

	return entries.map((entry) => {
		if (entry.layerId !== "residual") {
			return entry;
		}

		const spatialDecision = classifySpatialLayer({
			canvas,
			entry,
			targetEntries,
		});

		if (!spatialDecision) {
			return entry;
		}

		return {
			...entry,
			classificationStage: "spatial-reducer",
			layerId: spatialDecision.layerId,
			reason: explainClassification({
				finalLayerId: spatialDecision.layerId,
				issueCode: entry.issueCode,
				metrics: entry.metrics,
				primaryLayerId: entry.primaryLayerId,
				residualRuleId: entry.residualRuleId,
				spatialRuleId: spatialDecision.ruleId,
				spatialTargetLayerId: spatialDecision.targetLayerId,
				spatialOverlapRatio: spatialDecision.overlapRatio,
				spatialContainmentRatio: spatialDecision.containmentRatio,
				spatialGapRatio: spatialDecision.gapRatio,
				token: entry.token,
			}),
			spatialRuleId: spatialDecision.ruleId,
			spatialTargetLayerId: spatialDecision.targetLayerId,
			spatialOverlapRatio: spatialDecision.overlapRatio,
			spatialContainmentRatio: spatialDecision.containmentRatio,
			spatialGapRatio: spatialDecision.gapRatio,
		};
	});
}

function findNearestToken(color, tokens) {
	let best = tokens[0];
	let bestDistance = Number.POSITIVE_INFINITY;

	for (const token of tokens) {
		const distance = rgbDistance(color, token.rgb);

		if (distance < bestDistance) {
			bestDistance = distance;
			best = token;
		}
	}

	return best;
}

function getCanvasMetrics(attrs) {
	const width = attrs.width ? Number.parseFloat(attrs.width) : null;
	const height = attrs.height ? Number.parseFloat(attrs.height) : null;
	const viewBox =
		attrs.viewBox ?? (width && height ? `0 0 ${width} ${height}` : null);

	if (!viewBox) {
		throw new Error("SVG root is missing width/height and viewBox metadata.");
	}

	const parts = viewBox.split(/\s+/).map(Number.parseFloat);

	if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
		throw new Error(`Invalid SVG viewBox: ${viewBox}`);
	}

	return {
		width: width ?? parts[2],
		height: height ?? parts[3],
		viewBox,
	};
}

function isOneOf(value, options) {
	return value ? options.includes(value) : false;
}

function parseAttributes(text) {
	const attributes = {};
	const attrRegex = /([:\w-]+)=("([^"]*)"|'([^']*)')/g;

	for (const match of text.matchAll(attrRegex)) {
		attributes[match[1]] = match[3] ?? match[4] ?? "";
	}

	return attributes;
}

function parseCliArgs(args) {
	return {
		options: {},
		positionals: args.filter((arg) => !arg.startsWith("--")),
	};
}

function parseColor(value) {
	if (!value || value === "none") {
		return null;
	}

	if (value.startsWith("#")) {
		return hexToRgb(value);
	}

	const rgbMatch = value.match(
		/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i,
	);

	if (rgbMatch) {
		return {
			r: Number.parseFloat(rgbMatch[1]),
			g: Number.parseFloat(rgbMatch[2]),
			b: Number.parseFloat(rgbMatch[3]),
		};
	}

	return null;
}

function hexToRgb(hex) {
	const normalized = hex.replace(/^#/, "");
	const value =
		normalized.length === 3
			? normalized
					.split("")
					.map((channel) => channel + channel)
					.join("")
			: normalized;

	if (!/^[0-9a-fA-F]{6}$/.test(value)) {
		throw new Error(`Invalid hex color: ${hex}`);
	}

	return {
		r: Number.parseInt(value.slice(0, 2), 16),
		g: Number.parseInt(value.slice(2, 4), 16),
		b: Number.parseInt(value.slice(4, 6), 16),
	};
}

function rgbDistance(left, right) {
	return Math.hypot(left.r - right.r, left.g - right.g, left.b - right.b);
}

function getBboxIntersectionArea(left, right) {
	const width = Math.max(
		0,
		Math.min(left.maxX, right.maxX) - Math.max(left.minX, right.minX),
	);
	const height = Math.max(
		0,
		Math.min(left.maxY, right.maxY) - Math.max(left.minY, right.minY),
	);

	return width * height;
}

function getBboxGapDistance(left, right) {
	const dx = Math.max(
		0,
		Math.max(left.minX - right.maxX, right.minX - left.maxX),
	);
	const dy = Math.max(
		0,
		Math.max(left.minY - right.maxY, right.minY - left.maxY),
	);

	return Math.hypot(dx, dy);
}

function summarizeResidualReducer(entries) {
	const residualSourceEntries = entries.filter(
		(entry) => entry.primaryLayerId === "residual",
	);
	const reassignedEntries = residualSourceEntries.filter(
		(entry) => entry.layerId !== "residual",
	);
	const remainingResidualEntries = residualSourceEntries.filter(
		(entry) => entry.layerId === "residual",
	);

	return {
		enabled: true,
		primaryResidualCount: residualSourceEntries.length,
		reassignedCount: reassignedEntries.length,
		remainingResidualCount: remainingResidualEntries.length,
		countsByLayer: countBy(reassignedEntries, (entry) => entry.layerId),
		countsByRule: countBy(
			reassignedEntries,
			(entry) => entry.residualRuleId ?? "unmapped",
		),
	};
}

function summarizeSpatialReducer({ entries, residualReducedEntries }) {
	const residualInputEntries = residualReducedEntries.filter(
		(entry) => entry.layerId === "residual",
	);
	const reassignedEntries = entries.filter(
		(entry) => entry.classificationStage === "spatial-reducer",
	);
	const remainingResidualEntries = entries.filter(
		(entry) => entry.layerId === "residual",
	);

	return {
		enabled: true,
		inputResidualCount: residualInputEntries.length,
		reassignedCount: reassignedEntries.length,
		remainingResidualCount: remainingResidualEntries.length,
		thresholds: {
			maxGapRatio: 0.0005,
			minContainmentRatio: 0.95,
			minOverlapRatio: 0.95,
		},
		countsByLayer: countBy(reassignedEntries, (entry) => entry.layerId),
		countsByRule: countBy(
			reassignedEntries,
			(entry) => entry.spatialRuleId ?? "unmapped",
		),
	};
}
