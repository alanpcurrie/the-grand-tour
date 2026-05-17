import { mkdir } from "node:fs/promises";
import { basename, resolve } from "node:path";

const projectRoot = resolve(import.meta.dir, "..");
const sourceArg = Bun.argv[2] ?? "../legacy/src/assets/images/grand_tour.tif";
const outputArg = Bun.argv[3] ?? "./public/reference/generated";
const sourcePath = resolve(projectRoot, sourceArg);
const outputDir = resolve(projectRoot, outputArg);

if (process.platform === "darwin" || process.platform === "win32") {
	Bun.Image.backend = "system";
}

const source = Bun.file(sourcePath);

if (!(await source.exists())) {
	throw new Error(`Source image not found: ${sourcePath}`);
}

const metadata = await source.image().metadata();

await mkdir(outputDir, { recursive: true });

const outputs = [
	{
		name: "grand-tour-preview.png",
		description:
			"General preview render for design review and tracing reference.",
		run: (input) =>
			input
				.image()
				.resize(1600, 1600, { fit: "inside", filter: "lanczos3" })
				.png({ compressionLevel: 6 })
				.write(resolve(outputDir, "grand-tour-preview.png")),
	},
	{
		name: "grand-tour-palette-64.png",
		description:
			"Indexed 64-color PNG; useful before segmentation or vector tracing.",
		run: (input) =>
			input
				.image()
				.resize(1600, 1600, { fit: "inside", filter: "mitchell" })
				.png({ palette: true, colors: 64, dither: false, compressionLevel: 6 })
				.write(resolve(outputDir, "grand-tour-palette-64.png")),
	},
	{
		name: "grand-tour-palette-24.png",
		description:
			"More aggressively reduced color pass for isolating poster bands and planets.",
		run: (input) =>
			input
				.image()
				.resize(1600, 1600, { fit: "inside", filter: "mitchell" })
				.png({ palette: true, colors: 24, dither: false, compressionLevel: 6 })
				.write(resolve(outputDir, "grand-tour-palette-24.png")),
	},
	{
		name: "grand-tour-grayscale.png",
		description: "Greyscale pass for contrast studies and manual tracing prep.",
		run: (input) =>
			input
				.image()
				.resize(1600, 1600, { fit: "inside", filter: "lanczos2" })
				.modulate({ brightness: 1.04, saturation: 0 })
				.png({ compressionLevel: 6 })
				.write(resolve(outputDir, "grand-tour-grayscale.png")),
	},
	{
		name: "grand-tour-lqip.txt",
		description: "Small inline placeholder data URL for reference workflows.",
		run: async (input) => {
			const dataUrl = await input.image().placeholder();
			return Bun.write(
				resolve(outputDir, "grand-tour-lqip.txt"),
				`${dataUrl}\n`,
			);
		},
	},
];

const written = [];

for (const output of outputs) {
	const bytes = await output.run(source);
	written.push({
		file: output.name,
		description: output.description,
		bytes,
	});
}

const manifest = {
	extractedAt: new Date().toISOString(),
	bunVersion: Bun.version,
	platform: process.platform,
	backend: Bun.Image.backend,
	source: {
		file: basename(sourcePath),
		path: sourcePath,
		metadata,
	},
	outputs: written,
	limitations: [
		"Bun.Image can decode TIFF natively on macOS and Windows, but it does not emit SVG.",
		"Bun.Image is excellent for normalization, resizing, palette reduction, and preview generation.",
		"Actual raster-to-vector tracing still needs a separate step such as Potrace, VTracer, Inkscape, or Illustrator.",
	],
};

await Bun.write(
	resolve(outputDir, "manifest.json"),
	`${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Prepared poster reference assets from ${sourcePath}`);
console.table(written);
console.log(`Manifest: ${resolve(outputDir, "manifest.json")}`);
