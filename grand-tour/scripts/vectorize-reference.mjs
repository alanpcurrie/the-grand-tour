import { mkdir } from "node:fs/promises";
import { basename, resolve } from "node:path";

import ImageTracer from "imagetracerjs";
import { PNG } from "pngjs";
import { loadConfig, optimize } from "svgo";

const cli = parseCliArgs(Bun.argv.slice(2));
const projectRoot = resolve(import.meta.dir, "..");
const sourceArg =
	cli.positionals[0] ?? "../legacy/src/assets/images/grand_tour.tif";
const outputArg = cli.positionals[1] ?? "./public/reference/generated";
const requestedEngine = cli.options.engine ?? "auto";
const sourcePath = resolve(projectRoot, sourceArg);
const outputDir = resolve(projectRoot, outputArg);
const traceSourcePath = resolve(outputDir, "grand-tour-trace-source.png");
const manifestPath = resolve(outputDir, "svg-manifest.json");
const svgoConfigPath = resolve(projectRoot, "svgo.config.mjs");
const vtracerBinaryPath = resolve(
	projectRoot,
	".tools/vtracer-cli/bin/vtracer",
);

if (!["auto", "all", "imagetracer", "vtracer"].includes(requestedEngine)) {
	throw new Error(
		`Unsupported engine \"${requestedEngine}\". Use auto, all, imagetracer, or vtracer.`,
	);
}

if (process.platform === "darwin" || process.platform === "win32") {
	Bun.Image.backend = "system";
}

const source = Bun.file(sourcePath);

if (!(await source.exists())) {
	throw new Error(`Source image not found: ${sourcePath}`);
}

await mkdir(outputDir, { recursive: true });

const hasVtracer = await Bun.file(vtracerBinaryPath).exists();

if (requestedEngine === "vtracer" && !hasVtracer) {
	throw new Error(
		`Rust VTracer backend requested but not installed. Run \"bun run poster:install-vtracer\" first.`,
	);
}

const svgoConfig = (await loadConfig(svgoConfigPath, projectRoot)) ?? {
	multipass: true,
	plugins: [
		{
			name: "preset-default",
			params: {
				overrides: {
					cleanupIds: false,
				},
			},
		},
		"sortAttrs",
	],
};

const metadata = await source.image().metadata();
const traceSourceBytes = await source
	.image()
	.resize(1600, 1600, { fit: "inside", filter: "mitchell" })
	.png({ palette: true, colors: 24, dither: false, compressionLevel: 6 })
	.bytes();

await Bun.write(traceSourcePath, traceSourceBytes);

const png = PNG.sync.read(Buffer.from(traceSourceBytes));
const imageData = {
	width: png.width,
	height: png.height,
	data: png.data,
};

const posterPalette = [
	"#16151b",
	"#0c1c2c",
	"#faead0",
	"#f7f0df",
	"#cbb48f",
	"#89b941",
	"#81ae39",
	"#b0cbc2",
	"#00989a",
	"#0198ad",
	"#fba631",
	"#e26239",
	"#ec1f26",
	"#761c59",
	"#3a1a48",
];

const preferredEngine = hasVtracer ? "vtracer" : "imagetracer";
const vtracerVersion = hasVtracer
	? readVtracerVersion(vtracerBinaryPath)
	: null;
const variants = [];

if (
	requestedEngine === "auto" ||
	requestedEngine === "all" ||
	requestedEngine === "vtracer"
) {
	if (hasVtracer) {
		variants.push({
			engine: "vtracer",
			name: "grand-tour-vtracer.svg",
			description:
				"Rust VTracer poster preset traced from the Bun-generated PNG reference.",
			options: {
				preset: "poster",
				colormode: "color",
				hierarchical: "stacked",
				mode: "spline",
				filterSpeckle: 6,
				colorPrecision: 6,
				gradientStep: 16,
				cornerThreshold: 60,
				segmentLength: 4,
				spliceThreshold: 45,
				pathPrecision: 1,
			},
		});
	}
}

if (
	requestedEngine === "auto" ||
	requestedEngine === "all" ||
	requestedEngine === "imagetracer"
) {
	variants.push(...getImageTracerVariants(posterPalette));
}

if (variants.length === 0) {
	throw new Error(
		`No vectorization variants selected. Requested engine: ${requestedEngine}.`,
	);
}

const written = [];

for (const variant of variants) {
	const rawSvg =
		variant.engine === "vtracer"
			? await vectorizeWithVTracer({
					traceSourcePath,
					outputDir,
					variant,
					vtracerBinaryPath,
				})
			: ImageTracer.imagedataToSVG(imageData, variant.options);
	const optimizedSvg = optimize(rawSvg, {
		path: resolve(outputDir, variant.name),
		...svgoConfig,
	}).data;
	const rawBytes = Buffer.byteLength(rawSvg);
	const bytes = await Bun.write(resolve(outputDir, variant.name), optimizedSvg);
	written.push({
		engine: variant.engine,
		file: variant.name,
		description: variant.description,
		rawBytes,
		bytes,
		savedBytes: rawBytes - bytes,
	});
}

const manifest = {
	generatedAt: new Date().toISOString(),
	bunVersion: Bun.version,
	platform: process.platform,
	backend: Bun.Image.backend,
	requestedEngine,
	preferredEngine,
	toolchain: {
		imagetracer: {
			available: true,
			version: ImageTracer.versionnumber,
		},
		vtracer: {
			available: hasVtracer,
			binary: vtracerBinaryPath,
			version: vtracerVersion,
		},
	},
	source: {
		file: basename(sourcePath),
		path: sourcePath,
		metadata,
	},
	traceSource: {
		file: basename(traceSourcePath),
		path: traceSourcePath,
		metadata: {
			width: png.width,
			height: png.height,
			format: "png",
		},
	},
	outputs: written,
	variants: variants.map(({ engine, name, options, palette }) => ({
		engine,
		file: name,
		options,
		palette,
	})),
	notes: [
		"This pipeline runs under Bun and uses Bun.Image for TIFF decoding and preprocessing.",
		"Rust VTracer is preferred when the local CLI is installed via `bun run poster:install-vtracer`.",
		"ImageTracerJS remains available as the portable JavaScript fallback and comparison output.",
		"SVGO is used as a post-process optimizer on the traced SVG outputs.",
		"The tokenized variant is intended as a cleanup-friendly base, not a final production illustration.",
	],
};

await Bun.write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Vectorized poster source from ${sourcePath}`);
console.table(written);
console.log(`Trace source PNG: ${traceSourcePath}`);
console.log(`SVG manifest: ${manifestPath}`);

function getImageTracerVariants(palette) {
	return [
		{
			engine: "imagetracer",
			name: "grand-tour-traced.svg",
			description:
				"Auto-palette posterized SVG traced from a Bun-generated 24-color PNG.",
			options: {
				ltres: 1.5,
				qtres: 2,
				pathomit: 14,
				rightangleenhance: true,
				colorsampling: 0,
				numberofcolors: 24,
				colorquantcycles: 2,
				mincolorratio: 0,
				layering: 0,
				strokewidth: 0,
				linefilter: true,
				scale: 1,
				roundcoords: 1,
				viewbox: true,
				desc: true,
				blurradius: 2,
				blurdelta: 48,
			},
		},
		{
			engine: "imagetracer",
			name: "grand-tour-tokenized.svg",
			description:
				"SVG traced against a fixed Grand Tour-inspired palette for cleaner color grouping.",
			options: {
				ltres: 1.3,
				qtres: 2,
				pathomit: 12,
				rightangleenhance: true,
				colorsampling: 0,
				numberofcolors: palette.length,
				colorquantcycles: 1,
				mincolorratio: 0,
				layering: 0,
				strokewidth: 0,
				linefilter: true,
				scale: 1,
				roundcoords: 1,
				viewbox: true,
				desc: true,
				blurradius: 1,
				blurdelta: 32,
				pal: palette.map((hex) => hexToRgba(hex)),
			},
			palette,
		},
	];
}

async function vectorizeWithVTracer({
	traceSourcePath,
	outputDir,
	variant,
	vtracerBinaryPath,
}) {
	const outputPath = resolve(outputDir, variant.name);
	const command = [
		vtracerBinaryPath,
		"--input",
		traceSourcePath,
		"--output",
		outputPath,
		"--preset",
		variant.options.preset,
		"--colormode",
		variant.options.colormode,
		"--hierarchical",
		variant.options.hierarchical,
		"--mode",
		variant.options.mode,
		"--filter_speckle",
		String(variant.options.filterSpeckle),
		"--color_precision",
		String(variant.options.colorPrecision),
		"--gradient_step",
		String(variant.options.gradientStep),
		"--corner_threshold",
		String(variant.options.cornerThreshold),
		"--segment_length",
		String(variant.options.segmentLength),
		"--splice_threshold",
		String(variant.options.spliceThreshold),
		"--path_precision",
		String(variant.options.pathPrecision),
	];

	const result = Bun.spawnSync({
		cmd: command,
		cwd: projectRoot,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (result.exitCode !== 0) {
		throw new Error(
			[
				`VTracer failed for ${variant.name}.`,
				Buffer.from(result.stdout).toString("utf8").trim(),
				Buffer.from(result.stderr).toString("utf8").trim(),
			]
				.filter(Boolean)
				.join("\n"),
		);
	}

	return Bun.file(outputPath).text();
}

function readVtracerVersion(binaryPath) {
	const result = Bun.spawnSync({
		cmd: [binaryPath, "--version"],
		cwd: projectRoot,
		stdout: "pipe",
		stderr: "pipe",
	});

	if (result.exitCode !== 0) {
		return null;
	}

	return Buffer.from(result.stdout).toString("utf8").trim() || null;
}

function parseCliArgs(args) {
	const options = {};
	const positionals = [];

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];

		if (arg === "--engine") {
			options.engine = args[index + 1];
			index += 1;
			continue;
		}

		if (arg.startsWith("--engine=")) {
			options.engine = arg.slice("--engine=".length);
			continue;
		}

		positionals.push(arg);
	}

	return { options, positionals };
}

function hexToRgba(hex) {
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
		a: 255,
	};
}
