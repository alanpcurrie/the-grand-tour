export type PosterAssetGroupId =
	| "foundation"
	| "celestial"
	| "stripes"
	| "fleet"
	| "type";

export type PosterAssetSourceLayerId =
	| "background"
	| "orbits"
	| "planets"
	| "stripes"
	| "fleet"
	| "footer"
	| "micro"
	| "residual";

export type PosterAssetAction =
	| "procedural-html-css"
	| "procedural-svg"
	| "clean-from-trace"
	| "redraw-svg"
	| "hybrid-trace-to-svg";

export type PosterAssetFormat =
	| "html-css"
	| "svg-component"
	| "svg-path"
	| "css-background"
	| "react-component";

export type PosterAssetPriority = "hero" | "high" | "medium" | "low";

export type PosterAssetDepthTier =
	| "background"
	| "midground"
	| "foreground"
	| "overlay";

export type PosterAssetActivationPhase =
	| "static-poster"
	| "ambient-motion"
	| "interactive-depth"
	| "scroll-story";

export type PosterAssetInteractivity = "none" | "hover" | "hotspot" | "focus";

export type PosterAsset = {
	id: string;
	label: string;
	groupId: PosterAssetGroupId;
	compositionRole: string;
	sourceLayerIds: readonly PosterAssetSourceLayerId[];
	sceneRefs: readonly string[];
	recommendedAction: PosterAssetAction;
	finalFormat: PosterAssetFormat;
	cleanupPriority: PosterAssetPriority;
	depthTier: PosterAssetDepthTier;
	activationPhase: PosterAssetActivationPhase;
	interactivity: PosterAssetInteractivity;
	notes: string;
};

export type PosterAssetGroup = {
	id: PosterAssetGroupId;
	label: string;
	description: string;
};

export const posterAssetGroups = [
	{
		id: "foundation",
		label: "Foundation & paper",
		description:
			"Base poster substrate, texture, and large compositional fields that make the piece read as print-first before animation starts.",
	},
	{
		id: "celestial",
		label: "Celestial bodies & orbits",
		description:
			"Hero planets, orbit arcs, and colored lenses that define the poster's central silhouette and depth cues.",
	},
	{
		id: "stripes",
		label: "Routes & horizontal bands",
		description:
			"High-contrast travel lanes, route accents, and footer bands that can be rebuilt as crisp authored geometry.",
	},
	{
		id: "fleet",
		label: "Fleet silhouettes",
		description:
			"Named ship assets that should become clean SVG components before any travel or hover choreography is added.",
	},
	{
		id: "type",
		label: "Type, badges & footer copy",
		description:
			"Accessible text systems, lockups, and badge treatments that should not stay trapped inside traced SVG paths.",
	},
] as const satisfies readonly PosterAssetGroup[];

export const posterAssets = [
	{
		id: "paper-field",
		label: "Paper field",
		groupId: "foundation",
		compositionRole:
			"Main poster substrate and off-white field behind every other layer.",
		sourceLayerIds: ["background"],
		sceneRefs: [],
		recommendedAction: "procedural-html-css",
		finalFormat: "css-background",
		cleanupPriority: "hero",
		depthTier: "background",
		activationPhase: "static-poster",
		interactivity: "none",
		notes:
			"Use traced background only as color reference; final implementation should be a CSS background with optional scanned paper noise.",
	},
	{
		id: "paper-grain-overlay",
		label: "Paper grain overlay",
		groupId: "foundation",
		compositionRole:
			"Very light print texture pass that keeps the remake feeling tactile.",
		sourceLayerIds: ["background", "micro"],
		sceneRefs: [],
		recommendedAction: "procedural-html-css",
		finalFormat: "css-background",
		cleanupPriority: "medium",
		depthTier: "overlay",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Treat this as a controlled overlay, not a traced asset; a tiled noise texture or film-grain shader is the safer path.",
	},
	{
		id: "red-sun-core",
		label: "Red sun core",
		groupId: "celestial",
		compositionRole:
			"Lower-left hot core that anchors the composition and provides the warm launch energy.",
		sourceLayerIds: ["planets"],
		sceneRefs: ["red-sun-core"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-component",
		cleanupPriority: "hero",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Rebuild as a radial gradient and masked circle stack; the traced silhouette is reference, not final geometry.",
	},
	{
		id: "main-green-body",
		label: "Main green planetary body",
		groupId: "celestial",
		compositionRole:
			"Dominant green planet mass that holds the center of the poster.",
		sourceLayerIds: ["planets"],
		sceneRefs: ["main-green"],
		recommendedAction: "hybrid-trace-to-svg",
		finalFormat: "svg-component",
		cleanupPriority: "hero",
		depthTier: "midground",
		activationPhase: "interactive-depth",
		interactivity: "hotspot",
		notes:
			"Use the traced layer for silhouette guidance, but hand-author the final gradient stops and edge cleanup.",
	},
	{
		id: "turquoise-lens",
		label: "Turquoise lens overlay",
		groupId: "celestial",
		compositionRole:
			"Cooling lens flare layer that adds translucency across the main planet cluster.",
		sourceLayerIds: ["planets"],
		sceneRefs: ["turquoise-lens"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-component",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Best rebuilt as translucent circles and blur-safe masks so motion stays smooth and predictable.",
	},
	{
		id: "yellow-sweep",
		label: "Yellow sweep",
		groupId: "celestial",
		compositionRole:
			"Warm lower sweep that helps transition from the planetary cluster into the footer bands.",
		sourceLayerIds: ["planets", "stripes"],
		sceneRefs: ["yellow-sweep"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-component",
		cleanupPriority: "high",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Prefer a controlled radial gradient shape instead of keeping the traced feathered edges.",
	},
	{
		id: "violet-right-mass",
		label: "Violet right mass",
		groupId: "celestial",
		compositionRole:
			"Large purple body on the right edge that gives the poster its asymmetrical depth.",
		sourceLayerIds: ["planets", "orbits"],
		sceneRefs: ["violet-right"],
		recommendedAction: "hybrid-trace-to-svg",
		finalFormat: "svg-component",
		cleanupPriority: "hero",
		depthTier: "foreground",
		activationPhase: "interactive-depth",
		interactivity: "hotspot",
		notes:
			"Keep the traced silhouette only as layout guidance, then author a cleaner right-side gradient shell.",
	},
	{
		id: "magenta-token",
		label: "Magenta token",
		groupId: "celestial",
		compositionRole:
			"Small lower-center planet/token accent that acts like a waypoint in the composition.",
		sourceLayerIds: ["planets"],
		sceneRefs: ["magenta-token"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-component",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "interactive-depth",
		interactivity: "hotspot",
		notes:
			"Keep this crisp and simple so it can support hover or focus behavior later without artifacting.",
	},
	{
		id: "teal-dot",
		label: "Teal waypoint dot",
		groupId: "celestial",
		compositionRole:
			"Tiny accent dot near the lower left that helps the poster feel plotted rather than random.",
		sourceLayerIds: ["planets", "micro"],
		sceneRefs: ["teal-dot"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "low",
		depthTier: "foreground",
		activationPhase: "interactive-depth",
		interactivity: "hover",
		notes:
			"This can be rebuilt as a tiny authored circle; no reason to preserve traced noise here.",
	},
	{
		id: "outer-right-orbit-arc",
		label: "Outer right orbit arc",
		groupId: "celestial",
		compositionRole:
			"Tall right-hand orbit silhouette that frames the purple mass and the route story.",
		sourceLayerIds: ["orbits"],
		sceneRefs: [],
		recommendedAction: "clean-from-trace",
		finalFormat: "svg-path",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"This is one of the few traced assets worth cleaning directly because the orbital contour is already readable.",
	},
	{
		id: "mid-violet-orbit-arc",
		label: "Mid violet orbit arc",
		groupId: "celestial",
		compositionRole:
			"Secondary violet orbit slice that helps carve depth around the middle of the poster.",
		sourceLayerIds: ["orbits"],
		sceneRefs: [],
		recommendedAction: "clean-from-trace",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Smooth the bezier path and simplify anchor count before using this in motion work.",
	},
	{
		id: "magenta-route-column",
		label: "Magenta route column",
		groupId: "celestial",
		compositionRole:
			"Vertical magenta route accent that helps connect the right side into the central cluster.",
		sourceLayerIds: ["orbits", "stripes"],
		sceneRefs: [],
		recommendedAction: "clean-from-trace",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "scroll-story",
		interactivity: "focus",
		notes:
			"Keep it authored enough that it can support subtle line-travel animation without wobbling.",
	},
	{
		id: "top-teal-stripe",
		label: "Top teal stripe",
		groupId: "stripes",
		compositionRole:
			"Small upper route accent that kicks off the top travel lanes.",
		sourceLayerIds: ["stripes"],
		sceneRefs: ["top-teal"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"A simple rectangle/path with motion-safe transforms is better than traced texture for these bands.",
	},
	{
		id: "top-muted-stripe",
		label: "Top muted stripe",
		groupId: "stripes",
		compositionRole:
			"Wide desaturated top lane that stabilizes the header area.",
		sourceLayerIds: ["stripes", "background"],
		sceneRefs: ["top-muted"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Rebuild as a clean band with opacity control instead of carrying through paper noise.",
	},
	{
		id: "top-red-stripe",
		label: "Top red stripe",
		groupId: "stripes",
		compositionRole:
			"Warm top band that introduces the route language before the big planetary forms take over.",
		sourceLayerIds: ["stripes"],
		sceneRefs: ["top-red"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Keep this crisp; it is a good early candidate for line shimmer and subtle offset motion.",
	},
	{
		id: "middle-orange-stripe",
		label: "Middle orange stripe",
		groupId: "stripes",
		compositionRole:
			"Broad orange mid-band that slices through the main planet cluster.",
		sourceLayerIds: ["stripes", "planets"],
		sceneRefs: ["middle-orange"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"This is visually important enough that the authored version should be exact and animation-ready.",
	},
	{
		id: "center-teal-stripe",
		label: "Center teal stripe",
		groupId: "stripes",
		compositionRole:
			"Central teal route slice that helps tie the cool lens colors back into the travel lanes.",
		sourceLayerIds: ["stripes"],
		sceneRefs: ["center-teal"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"A clean authored stripe will read better than traced pixels once it begins to drift.",
	},
	{
		id: "mid-route-stripe",
		label: "Mid route stripe",
		groupId: "stripes",
		compositionRole:
			"Long center route that can later carry travel or scroll-linked motion.",
		sourceLayerIds: ["stripes"],
		sceneRefs: ["mid-route"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "hero",
		depthTier: "foreground",
		activationPhase: "scroll-story",
		interactivity: "focus",
		notes:
			"This is a core motion rig candidate, so keep it geometric and easy to animate along its axis.",
	},
	{
		id: "mid-green-stripe",
		label: "Mid green stripe",
		groupId: "stripes",
		compositionRole:
			"Green lane supporting the lower half of the main cluster and fleet region.",
		sourceLayerIds: ["stripes"],
		sceneRefs: ["mid-green"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Treat as a reusable band component with only width, color, and opacity changing.",
	},
	{
		id: "bottom-orange-stripe",
		label: "Bottom orange stripe",
		groupId: "stripes",
		compositionRole:
			"Large footer-adjacent orange lane that gives the bottom third its warmth and forward motion.",
		sourceLayerIds: ["stripes", "footer"],
		sceneRefs: ["bottom-orange"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "high",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"This should be a single authored band, not a cluster of traced fragments.",
	},
	{
		id: "footer-lane-stripe",
		label: "Footer lane stripe",
		groupId: "stripes",
		compositionRole:
			"Lower green lane used to transition from the artwork into the footer copy.",
		sourceLayerIds: ["stripes", "footer"],
		sceneRefs: ["footer-lane"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"This can live in the same reusable stripe system as the other route bands.",
	},
	{
		id: "footer-red-stripe",
		label: "Footer red stripe",
		groupId: "stripes",
		compositionRole:
			"Bottom red travel lane that helps frame the footer lockup.",
		sourceLayerIds: ["stripes", "footer"],
		sceneRefs: ["footer-red"],
		recommendedAction: "procedural-svg",
		finalFormat: "svg-path",
		cleanupPriority: "medium",
		depthTier: "midground",
		activationPhase: "ambient-motion",
		interactivity: "none",
		notes:
			"Keep authored so the bottom third can scale responsively without weird traced artifacts.",
	},
	{
		id: "fleet-alpha-arrow",
		label: "Fleet Alpha arrow ship",
		groupId: "fleet",
		compositionRole:
			"Primary left-of-center ship silhouette and the first fleet hero asset.",
		sourceLayerIds: ["fleet"],
		sceneRefs: ["fleet-alpha"],
		recommendedAction: "redraw-svg",
		finalFormat: "react-component",
		cleanupPriority: "hero",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Redraw this fully as authored SVG; traced fleet shapes are reference only and not clean enough for hero use.",
	},
	{
		id: "fleet-beta-dart",
		label: "Fleet Beta dart ship",
		groupId: "fleet",
		compositionRole:
			"Upper mid-size dart silhouette that helps establish travel direction.",
		sourceLayerIds: ["fleet"],
		sceneRefs: ["fleet-beta"],
		recommendedAction: "redraw-svg",
		finalFormat: "react-component",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Keep geometry simple enough that tilt and drift feel elegant rather than twitchy.",
	},
	{
		id: "fleet-gamma-shuttle",
		label: "Fleet Gamma shuttle ship",
		groupId: "fleet",
		compositionRole:
			"Central shuttle variant that gives the fleet a different silhouette family.",
		sourceLayerIds: ["fleet"],
		sceneRefs: ["fleet-gamma"],
		recommendedAction: "redraw-svg",
		finalFormat: "react-component",
		cleanupPriority: "high",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"Author this separately from the darts so the fleet feels intentionally designed, not duplicated.",
	},
	{
		id: "fleet-delta-dart",
		label: "Fleet Delta dart ship",
		groupId: "fleet",
		compositionRole:
			"Lower-right dart accent that supports the feeling of movement across the poster.",
		sourceLayerIds: ["fleet"],
		sceneRefs: ["fleet-delta"],
		recommendedAction: "redraw-svg",
		finalFormat: "react-component",
		cleanupPriority: "medium",
		depthTier: "foreground",
		activationPhase: "ambient-motion",
		interactivity: "hover",
		notes:
			"This can reuse some structural motifs from Fleet Beta, but it should still be an authored component.",
	},
	{
		id: "kicker-copy",
		label: "Kicker copy",
		groupId: "type",
		compositionRole: "Small introductory line above the main title.",
		sourceLayerIds: ["footer"],
		sceneRefs: ["posterCopy.kicker"],
		recommendedAction: "procedural-html-css",
		finalFormat: "html-css",
		cleanupPriority: "medium",
		depthTier: "overlay",
		activationPhase: "static-poster",
		interactivity: "none",
		notes:
			"Keep this as semantic HTML text so it stays sharp, accessible, and easy to restyle responsively.",
	},
	{
		id: "title-lockup",
		label: "Title lockup",
		groupId: "type",
		compositionRole: "Main Grand Tour headline and its typographic staging.",
		sourceLayerIds: ["footer"],
		sceneRefs: ["posterCopy.title"],
		recommendedAction: "procedural-html-css",
		finalFormat: "html-css",
		cleanupPriority: "hero",
		depthTier: "overlay",
		activationPhase: "static-poster",
		interactivity: "hover",
		notes:
			"Typography should stay accessible and layout-driven; do not keep it trapped in traced SVG paths.",
	},
	{
		id: "itinerary-block",
		label: "Itinerary block",
		groupId: "type",
		compositionRole: "Planet list and travel order callout beneath the title.",
		sourceLayerIds: ["footer"],
		sceneRefs: ["posterCopy.itinerary"],
		recommendedAction: "procedural-html-css",
		finalFormat: "html-css",
		cleanupPriority: "high",
		depthTier: "overlay",
		activationPhase: "static-poster",
		interactivity: "none",
		notes:
			"This is better authored as semantic markup so it can evolve into an interactive chapter list later.",
	},
	{
		id: "gravity-subheading",
		label: "Gravity assist subheading",
		groupId: "type",
		compositionRole:
			"Secondary explanatory line that adds charm and context to the poster.",
		sourceLayerIds: ["footer"],
		sceneRefs: ["posterCopy.subheading"],
		recommendedAction: "procedural-html-css",
		finalFormat: "html-css",
		cleanupPriority: "medium",
		depthTier: "overlay",
		activationPhase: "static-poster",
		interactivity: "none",
		notes:
			"Keep this copy editable and accessible rather than baking it into artwork.",
	},
	{
		id: "years-badge",
		label: "Every 175 years badge",
		groupId: "type",
		compositionRole: "Numerical badge that punctuates the title region.",
		sourceLayerIds: ["footer", "micro"],
		sceneRefs: [
			"posterCopy.badgePrefix",
			"posterCopy.badgeValue",
			"posterCopy.badgeSuffix",
		],
		recommendedAction: "procedural-svg",
		finalFormat: "react-component",
		cleanupPriority: "high",
		depthTier: "overlay",
		activationPhase: "interactive-depth",
		interactivity: "hover",
		notes:
			"Build the badge shape as SVG but keep the text accessible and editable within the component.",
	},
	{
		id: "boarding-badge",
		label: "Boarding badge",
		groupId: "type",
		compositionRole:
			"Small boarding callout that can later become an entry point into a detail state.",
		sourceLayerIds: ["footer", "micro"],
		sceneRefs: ["posterCopy.boarding"],
		recommendedAction: "procedural-svg",
		finalFormat: "react-component",
		cleanupPriority: "medium",
		depthTier: "overlay",
		activationPhase: "interactive-depth",
		interactivity: "focus",
		notes:
			"This is a nice candidate for a hoverable micro-interaction once the static poster is locked.",
	},
	{
		id: "footer-mission-copy",
		label: "Footer mission copy",
		groupId: "type",
		compositionRole:
			"Lower lockup and route detail copy that grounds the poster with mission-era context.",
		sourceLayerIds: ["footer"],
		sceneRefs: [],
		recommendedAction: "procedural-html-css",
		finalFormat: "html-css",
		cleanupPriority: "high",
		depthTier: "overlay",
		activationPhase: "static-poster",
		interactivity: "none",
		notes:
			"Treat as semantic layout copy, then layer authored divider lines beneath it as needed.",
	},
] as const satisfies readonly PosterAsset[];

export const posterHeroAssetIds = [
	"paper-field",
	"red-sun-core",
	"main-green-body",
	"violet-right-mass",
	"mid-route-stripe",
	"fleet-alpha-arrow",
	"title-lockup",
] as const;

export const posterImplementedAssetIds = [
	"paper-field",
	"paper-grain-overlay",
	"red-sun-core",
	"main-green-body",
	"turquoise-lens",
	"yellow-sweep",
	"violet-right-mass",
	"magenta-token",
	"teal-dot",
	"outer-right-orbit-arc",
	"mid-violet-orbit-arc",
	"magenta-route-column",
	"top-teal-stripe",
	"top-muted-stripe",
	"top-red-stripe",
	"middle-orange-stripe",
	"center-teal-stripe",
	"mid-route-stripe",
	"mid-green-stripe",
	"bottom-orange-stripe",
	"footer-lane-stripe",
	"footer-red-stripe",
	"fleet-alpha-arrow",
	"fleet-beta-dart",
	"fleet-gamma-shuttle",
	"fleet-delta-dart",
	"kicker-copy",
	"title-lockup",
	"itinerary-block",
	"gravity-subheading",
	"years-badge",
	"boarding-badge",
	"footer-mission-copy",
] as const;
