import { mkdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import {
	posterAssetGroups,
	posterAssets,
	posterHeroAssetIds,
	posterImplementedAssetIds,
} from "../src/lib/posterAssetInventory.ts";

const cli = parseCliArgs(Bun.argv.slice(2));
const projectRoot = resolve(import.meta.dir, "..");
const manifestArg =
	cli.positionals[0] ??
	"./public/reference/generated/layers/grand-tour-vtracer.layer-manifest.json";
const jsonOutputArg =
	cli.positionals[1] ??
	"./public/reference/generated/layers/grand-tour-vtracer.asset-inventory.json";
const markdownOutputArg =
	cli.positionals[2] ?? "./docs/poster-asset-inventory.md";
const manifestPath = resolve(projectRoot, manifestArg);
const jsonOutputPath = resolve(projectRoot, jsonOutputArg);
const markdownOutputPath = resolve(projectRoot, markdownOutputArg);
const manifestFile = Bun.file(manifestPath);

if (!(await manifestFile.exists())) {
	throw new Error(`Asset inventory source manifest not found: ${manifestPath}`);
}

await mkdir(dirname(jsonOutputPath), { recursive: true });
await mkdir(dirname(markdownOutputPath), { recursive: true });

const layerManifest = JSON.parse(await manifestFile.text());
const groupLookup = new Map(
	posterAssetGroups.map((group) => [group.id, group]),
);
const layerLookup = new Map(
	(layerManifest.layers ?? []).map((layer) => [layer.id, layer]),
);
const heroSet = new Set(posterHeroAssetIds);
const implementedSet = new Set(posterImplementedAssetIds);
const resolvedAssets = posterAssets.map((asset) => {
	const sourceLayers = asset.sourceLayerIds.map((layerId) => {
		const layer = layerLookup.get(layerId);

		return {
			id: layerId,
			available: Boolean(layer),
			file: layer?.file ?? null,
			count: layer?.count ?? 0,
			approxCoverage: layer?.approxCoverage ?? 0,
		};
	});
	const totalSourceCount = sourceLayers.reduce(
		(sum, layer) => sum + layer.count,
		0,
	);

	return {
		...asset,
		groupLabel: groupLookup.get(asset.groupId)?.label ?? asset.groupId,
		hero: heroSet.has(asset.id),
		implemented: implementedSet.has(asset.id),
		sourceLayers,
		totalSourceCount,
		sourceLayerSummary:
			sourceLayers.length > 0
				? sourceLayers
						.map((layer) =>
							layer.available
								? `${layer.id} (${layer.count})`
								: `${layer.id} (missing)`,
						)
						.join(", ")
				: "manual authoring",
	};
});

const heroAssets = posterHeroAssetIds
	.map((assetId) => resolvedAssets.find((asset) => asset.id === assetId))
	.filter(Boolean);

const summary = {
	assetCount: resolvedAssets.length,
	heroAssetCount: heroAssets.length,
	implementedAssetCount: resolvedAssets.filter((asset) => asset.implemented)
		.length,
	countsByAction: countBy(resolvedAssets, (asset) => asset.recommendedAction),
	countsByGroup: countBy(resolvedAssets, (asset) => asset.groupId),
	countsByImplementation: countBy(resolvedAssets, (asset) =>
		asset.implemented ? "implemented" : "planned",
	),
	countsByActivationPhase: countBy(
		resolvedAssets,
		(asset) => asset.activationPhase,
	),
	countsByPriority: countBy(resolvedAssets, (asset) => asset.cleanupPriority),
	sourceLayerUsage: countBy(
		resolvedAssets.flatMap((asset) => asset.sourceLayerIds),
		(layerId) => layerId,
	),
};

const inventory = {
	generatedAt: new Date().toISOString(),
	input: {
		layerManifestPath: manifestPath,
		layerManifestRelativePath: relative(projectRoot, manifestPath),
	},
	splitContext: {
		residualReducer: layerManifest.residualReducer ?? null,
		spatialReducer: layerManifest.spatialReducer ?? null,
		layerFiles: (layerManifest.layers ?? []).map((layer) => ({
			id: layer.id,
			file: layer.file,
			count: layer.count,
			approxCoverage: layer.approxCoverage,
		})),
	},
	summary,
	heroBuildOrder: heroAssets.map((asset, index) => ({
		step: index + 1,
		id: asset.id,
		label: asset.label,
		implemented: asset.implemented,
		recommendedAction: asset.recommendedAction,
		finalFormat: asset.finalFormat,
		groupId: asset.groupId,
		activationPhase: asset.activationPhase,
		sourceLayerSummary: asset.sourceLayerSummary,
	})),
	assets: resolvedAssets,
};

await Bun.write(jsonOutputPath, `${JSON.stringify(inventory, null, 2)}\n`);
await Bun.write(markdownOutputPath, buildMarkdown({ inventory, projectRoot }));

console.log(`Built poster asset inventory from ${manifestPath}`);
console.log(`Asset inventory JSON: ${jsonOutputPath}`);
console.log(`Asset inventory Markdown: ${markdownOutputPath}`);
console.table(
	Object.entries(summary.countsByAction).map(([action, count]) => ({
		action,
		count,
	})),
);
console.table(
	heroAssets.map((asset, index) => ({
		step: index + 1,
		asset: asset.label,
		action: asset.recommendedAction,
		layers: asset.sourceLayerSummary,
	})),
);

function buildMarkdown({ inventory, projectRoot }) {
	const lines = [
		"# Poster asset inventory",
		"",
		`Generated from \`${relative(projectRoot, manifestPath)}\` on ${inventory.generatedAt}.`,
		"",
		"## Snapshot",
		"",
		`- Canonical assets: **${inventory.summary.assetCount}**`,
		`- Hero-first assets: **${inventory.summary.heroAssetCount}**`,
		`- Implemented in scene: **${inventory.summary.implementedAssetCount}**`,
		`- Residual reducer: **${inventory.splitContext.residualReducer?.primaryResidualCount ?? 0}** primary residual → **${inventory.splitContext.residualReducer?.remainingResidualCount ?? 0}** after heuristic cleanup`,
		`- Spatial reducer: **${inventory.splitContext.spatialReducer?.inputResidualCount ?? 0}** input residual → **${inventory.splitContext.spatialReducer?.remainingResidualCount ?? 0}** remaining`,
		"",
		"## Authoring mix",
		"",
		...Object.entries(inventory.summary.countsByAction).map(
			([action, count]) => `- \`${action}\`: ${count}`,
		),
		"",
		"## Implementation status",
		"",
		...Object.entries(inventory.summary.countsByImplementation).map(
			([status, count]) => `- \`${status}\`: ${count}`,
		),
		"",
		"## Hero-first build order",
		"",
		...inventory.heroBuildOrder.map(
			(asset) =>
				`${asset.step}. **${asset.label}** — \`${asset.recommendedAction}\`, final format \`${asset.finalFormat}\`, source ${asset.sourceLayerSummary}${asset.implemented ? " _(already implemented)_" : ""}`,
		),
		"",
		"## Group breakdown",
		"",
	];

	for (const group of posterAssetGroups) {
		const assets = inventory.assets.filter(
			(asset) => asset.groupId === group.id,
		);
		lines.push(`### ${group.label}`);
		lines.push("");
		lines.push(group.description);
		lines.push("");
		lines.push(
			"| Asset | Status | Action | Format | Priority | Activation | Layers | Notes |",
		);
		lines.push("| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |");
		for (const asset of assets) {
			lines.push(
				`| ${escapeTable(asset.label)} | \`${asset.implemented ? "implemented" : "planned"}\` | \`${asset.recommendedAction}\` | \`${asset.finalFormat}\` | \`${asset.cleanupPriority}\` | \`${asset.activationPhase}\` | ${escapeTable(asset.sourceLayerSummary)} | ${escapeTable(asset.notes)} |`,
			);
		}
		lines.push("");
	}

	lines.push("## Immediate production decisions");
	lines.push("");
	lines.push(
		"- **Ships should be redrawn** as authored SVG React components before any travel animation work.",
	);
	lines.push(
		"- **Title and footer copy should stay semantic** in HTML/CSS so accessibility and responsive layout stay sane.",
	);
	lines.push(
		"- **Stripes are best rebuilt procedurally** as clean SVG bands rather than promoted directly from trace output.",
	);
	lines.push(
		"- **Hero planets and orbit arcs can borrow the traced split as reference**, but should still be cleaned or re-authored before motion is layered in.",
	);
	lines.push("");

	return `${lines.join("\n")}\n`;
}

function countBy(values, selector) {
	return Object.fromEntries(
		Object.entries(
			values.reduce((counts, value) => {
				const key = selector(value);
				counts[key] = (counts[key] ?? 0) + 1;
				return counts;
			}, {}),
		).sort((left, right) => right[1] - left[1]),
	);
}

function escapeTable(value) {
	return String(value).replaceAll("|", "\\|");
}

function parseCliArgs(args) {
	return {
		options: {},
		positionals: args.filter((arg) => !arg.startsWith("--")),
	};
}
