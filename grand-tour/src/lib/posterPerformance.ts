export type PosterPerformanceTier = "high" | "low" | "medium";

type PosterPerformanceHint = {
	deviceMemory?: number;
	hardwareConcurrency?: number;
	reducedMotion?: boolean;
	userAgent?: string;
	width?: number;
};

export function detectPosterPerformanceTier({
	deviceMemory,
	hardwareConcurrency,
	reducedMotion = false,
	userAgent = "",
	width,
}: PosterPerformanceHint): PosterPerformanceTier {
	if (reducedMotion) {
		return "low";
	}

	const cores = hardwareConcurrency ?? 6;
	const memory = deviceMemory ?? 6;
	const compactViewport = typeof width === "number" && width <= 720;
	const mobileUserAgent = /android|iphone|ipad|mobile/i.test(userAgent);

	if (compactViewport || mobileUserAgent || cores <= 4) {
		return "low";
	}

	if (cores >= 8 && memory >= 8) {
		return "high";
	}

	return "medium";
}
