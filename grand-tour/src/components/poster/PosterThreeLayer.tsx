import { AdaptiveDpr, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, CanvasTexture, MathUtils, Texture } from "three";
import type {
	Group,
	Points,
	Sprite as ThreeSprite,
	SpriteMaterial as ThreeSpriteMaterial,
} from "three";

import {
	posterFlightPaths,
	posterRouteSignals,
	type PosterFleetShipId,
	type PosterFlightPath,
	type PosterRouteSignal,
	type PosterRouteStripeId,
} from "../../lib/posterFlightPaths";
import {
	posterHotspots,
	type PosterHotspot,
	type PosterHotspotFrame,
	type PosterHotspotId,
} from "../../lib/posterHotspots";
import {
	detectPosterPerformanceTier,
	type PosterPerformanceTier,
} from "../../lib/posterPerformance";
import { stripes, type StripeLayer } from "../../lib/posterScene";

type PosterThreeLayerProps = {
	activeHotspotId?: PosterHotspotId | null;
	activeRouteIds?: readonly PosterRouteStripeId[];
	activeShipId?: PosterFleetShipId | null;
	pointerEngaged: boolean;
	pointerX: MotionValue<number>;
	pointerY: MotionValue<number>;
	reducedMotion: boolean;
};

type PosterAtmosphereSceneProps = {
	activeHotspotId: PosterHotspotId | null;
	burstHotspotId: PosterHotspotId | null;
	burstToken: number;
	activeRouteIds: readonly PosterRouteStripeId[];
	activeShipId: PosterFleetShipId | null;
	pointerX: MotionValue<number>;
	pointerY: MotionValue<number>;
	tier: PosterPerformanceTier;
};

type GlowSpriteProps = {
	centerXPercent: number;
	centerYPercent: number;
	color: string;
	heightPercent: number;
	opacity: number;
	rotation?: number;
	texture: Texture;
	widthPercent: number;
	z?: number;
};

type RouteRibbonFXProps = {
	activeRouteIds: readonly PosterRouteStripeId[];
	activeShipId: PosterFleetShipId | null;
	glowTexture: Texture;
	hasSelection: boolean;
	path: PosterFlightPath;
	signal: PosterRouteSignal;
	stripe: StripeLayer;
	tier: PosterPerformanceTier;
};

type ShipWakeFXProps = {
	activeRouteIds: readonly PosterRouteStripeId[];
	activeShipId: PosterFleetShipId | null;
	frame: PosterHotspotFrame;
	glowTexture: Texture;
	hasSelection: boolean;
	path: PosterFlightPath;
	tier: PosterPerformanceTier;
};

type HotspotPulseFXProps = {
	burstToken: number;
	glowTexture: Texture;
	hotspot: PosterHotspot;
	isPinned: boolean;
	tier: PosterPerformanceTier;
};

const PARTICLE_COUNTS: Record<PosterPerformanceTier, number> = {
	high: 96,
	low: 36,
	medium: 64,
};

const DPR_BY_TIER: Record<PosterPerformanceTier, number | [number, number]> = {
	high: [1, 1.5],
	low: 1,
	medium: [1, 1.25],
};

const TRAVEL_KEYFRAME_TIMES = [0, 0.28, 0.56, 0.82, 1] as const;

const SHIP_WAKE_ROTATION_DEGREES: Record<PosterFleetShipId, number> = {
	"fleet-alpha": -2,
	"fleet-beta": -4,
	"fleet-delta": -5,
	"fleet-gamma": -2,
};

const SHIP_WAKE_LENGTH_MULTIPLIER: Record<PosterFleetShipId, number> = {
	"fleet-alpha": 0.48,
	"fleet-beta": 0.72,
	"fleet-delta": 0.78,
	"fleet-gamma": 0.58,
};

const stripeLookup = new Map(stripes.map((stripe) => [stripe.id, stripe]));

const hotspotLookup = new Map(
	posterHotspots.map((hotspot) => [hotspot.id, hotspot]),
);

const shipFocusLookup = new Map<PosterFleetShipId, PosterHotspotFrame>(
	posterHotspots.flatMap((hotspot) => {
		if (hotspot.kind !== "ship" || !hotspot.shipId) {
			return [];
		}

		return [[hotspot.shipId, hotspot.focusFrame] as const];
	}),
);

const shipRouteLookup = new Map<
	PosterFleetShipId,
	readonly PosterRouteStripeId[]
>(
	posterFlightPaths.map((path) => [
		path.id,
		posterRouteSignals
			.filter((signal) => signal.shipId === path.id)
			.map((signal) => signal.stripeId),
	]),
);

export function PosterThreeLayer({
	activeHotspotId = null,
	activeRouteIds = [],
	activeShipId = null,
	pointerEngaged,
	pointerX,
	pointerY,
	reducedMotion,
}: PosterThreeLayerProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [tier, setTier] = useState<PosterPerformanceTier>("medium");
	const [burstHotspotId, setBurstHotspotId] = useState<PosterHotspotId | null>(
		null,
	);
	const [burstToken, setBurstToken] = useState(0);
	const shouldAnimate =
		pointerEngaged || activeHotspotId !== null || burstHotspotId !== null;

	useEffect(() => {
		setIsMounted(true);

		if (typeof window === "undefined") {
			return;
		}

		const navigatorWithMemory = navigator as Navigator & {
			deviceMemory?: number;
		};

		setTier(
			detectPosterPerformanceTier({
				deviceMemory: navigatorWithMemory.deviceMemory,
				hardwareConcurrency: navigator.hardwareConcurrency,
				reducedMotion,
				userAgent: navigator.userAgent,
				width: window.innerWidth,
			}),
		);
	}, [reducedMotion]);

	useEffect(() => {
		if (!activeHotspotId) {
			return;
		}

		setBurstHotspotId(activeHotspotId);
		setBurstToken((currentToken) => currentToken + 1);

		const burstTimer = window.setTimeout(() => {
			setBurstHotspotId((currentHotspotId) =>
				currentHotspotId === activeHotspotId ? null : currentHotspotId,
			);
		}, 1120);

		return () => {
			window.clearTimeout(burstTimer);
		};
	}, [activeHotspotId]);

	if (!isMounted || reducedMotion) {
		return null;
	}

	return (
		<div
			className={`poster-three-layer poster-three-layer--${tier}`}
			aria-hidden="true"
		>
			<Canvas
				className="poster-three-layer__canvas"
				orthographic
				dpr={DPR_BY_TIER[tier]}
				frameloop={shouldAnimate ? "always" : "demand"}
				gl={{
					alpha: true,
					antialias: false,
					depth: false,
					powerPreference: "high-performance",
					premultipliedAlpha: true,
					stencil: false,
				}}
			>
				<AdaptiveDpr pixelated />
				<PosterAtmosphereScene
					activeHotspotId={activeHotspotId}
					burstHotspotId={burstHotspotId}
					burstToken={burstToken}
					activeRouteIds={activeRouteIds}
					activeShipId={activeShipId}
					pointerX={pointerX}
					pointerY={pointerY}
					tier={tier}
				/>
			</Canvas>
		</div>
	);
}

function PosterAtmosphereScene({
	activeHotspotId,
	burstHotspotId,
	burstToken,
	activeRouteIds,
	activeShipId,
	pointerX,
	pointerY,
	tier,
}: PosterAtmosphereSceneProps) {
	const rootRef = useRef<Group>(null);
	const dustRef = useRef<Points>(null);
	const routeGlowRef = useRef<Group>(null);
	const viewport = useThree((state) => state.viewport);
	const glowTexture = useMemo(() => createGlowTexture(), []);
	const particleCount = PARTICLE_COUNTS[tier];
	const particleData = useMemo(
		() => buildParticleField(particleCount, viewport.width, viewport.height),
		[particleCount, viewport.height, viewport.width],
	);
	const particleSize = useMemo(
		() =>
			Math.max(
				1.4,
				viewport.width *
					(tier === "high" ? 0.0038 : tier === "medium" ? 0.0032 : 0.0028),
			),
		[tier, viewport.width],
	);
	const particleOpacity =
		tier === "high" ? 0.28 : tier === "medium" ? 0.24 : 0.2;
	const hasSelection = activeShipId !== null || activeRouteIds.length > 0;
	const highlightedHotspotId = activeHotspotId ?? burstHotspotId;
	const highlightedHotspot = highlightedHotspotId
		? (hotspotLookup.get(highlightedHotspotId) ?? null)
		: null;

	useEffect(() => {
		return () => {
			glowTexture.dispose();
		};
	}, [glowTexture]);

	useFrame((state, delta) => {
		const pointerShiftX = pointerX.get() * viewport.width * 0.028;
		const pointerShiftY = -pointerY.get() * viewport.height * 0.024;

		if (rootRef.current) {
			rootRef.current.position.x = MathUtils.damp(
				rootRef.current.position.x,
				pointerShiftX,
				4,
				delta,
			);
			rootRef.current.position.y = MathUtils.damp(
				rootRef.current.position.y,
				pointerShiftY,
				4,
				delta,
			);
		}

		if (dustRef.current) {
			dustRef.current.rotation.z +=
				delta * (tier === "high" ? 0.02 : tier === "medium" ? 0.016 : 0.012);
		}

		if (routeGlowRef.current) {
			const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
			routeGlowRef.current.scale.x = MathUtils.damp(
				routeGlowRef.current.scale.x,
				pulse,
				3,
				delta,
			);
			routeGlowRef.current.scale.y = MathUtils.damp(
				routeGlowRef.current.scale.y,
				1 + Math.sin(state.clock.elapsedTime * 0.95) * 0.02,
				3,
				delta,
			);
		}
	});

	return (
		<>
			<OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} />
			<group ref={rootRef}>
				<points ref={dustRef} frustumCulled={false} renderOrder={1}>
					<bufferGeometry>
						<bufferAttribute
							attach="attributes-position"
							args={[particleData.positions, 3]}
						/>
						<bufferAttribute
							attach="attributes-color"
							args={[particleData.colors, 3]}
						/>
					</bufferGeometry>
					<pointsMaterial
						blending={AdditiveBlending}
						depthWrite={false}
						opacity={particleOpacity}
						size={particleSize}
						sizeAttenuation={false}
						transparent
						toneMapped={false}
						vertexColors
					/>
				</points>

				<GlowSprite
					centerXPercent={10}
					centerYPercent={41}
					color="#f49e63"
					heightPercent={22}
					opacity={tier === "high" ? 0.28 : 0.22}
					texture={glowTexture}
					widthPercent={28}
					z={0.1}
				/>
				<GlowSprite
					centerXPercent={45.45}
					centerYPercent={40}
					color="#64d8e4"
					heightPercent={34}
					opacity={tier === "high" ? 0.18 : 0.14}
					rotation={-0.14}
					texture={glowTexture}
					widthPercent={48}
					z={0.12}
				/>
				<GlowSprite
					centerXPercent={87}
					centerYPercent={42}
					color="#5d2f69"
					heightPercent={70}
					opacity={tier === "high" ? 0.16 : 0.12}
					texture={glowTexture}
					widthPercent={46}
					z={0.08}
				/>

				<group ref={routeGlowRef}>
					<GlowSprite
						centerXPercent={47}
						centerYPercent={35.5}
						color="#f0a26b"
						heightPercent={7}
						opacity={tier === "high" ? 0.14 : 0.1}
						texture={glowTexture}
						widthPercent={92}
						z={0.2}
					/>
					<GlowSprite
						centerXPercent={46}
						centerYPercent={35.3}
						color="#82d7df"
						heightPercent={3.4}
						opacity={tier === "high" ? 0.12 : 0.09}
						texture={glowTexture}
						widthPercent={34}
						z={0.22}
					/>
				</group>

				<GlowSprite
					centerXPercent={52}
					centerYPercent={68}
					color="#f09558"
					heightPercent={11}
					opacity={tier === "high" ? 0.12 : 0.08}
					texture={glowTexture}
					widthPercent={96}
					z={0.1}
				/>

				{posterRouteSignals.map((signal) => {
					const stripe = stripeLookup.get(signal.stripeId);
					const path = posterFlightPaths.find(
						(candidatePath) => candidatePath.id === signal.shipId,
					);

					if (!stripe || !path) {
						return null;
					}

					return (
						<RouteRibbonFX
							key={`route-ribbon-${signal.id}`}
							activeRouteIds={activeRouteIds}
							activeShipId={activeShipId}
							glowTexture={glowTexture}
							hasSelection={hasSelection}
							path={path}
							signal={signal}
							stripe={stripe}
							tier={tier}
						/>
					);
				})}

				{posterFlightPaths.map((path) => {
					const frame = shipFocusLookup.get(path.id);

					if (!frame) {
						return null;
					}

					return (
						<ShipWakeFX
							key={`ship-wake-${path.id}`}
							activeRouteIds={activeRouteIds}
							activeShipId={activeShipId}
							frame={frame}
							glowTexture={glowTexture}
							hasSelection={hasSelection}
							path={path}
							tier={tier}
						/>
					);
				})}

				{highlightedHotspot ? (
					<HotspotPulseFX
						burstToken={burstToken}
						glowTexture={glowTexture}
						hotspot={highlightedHotspot}
						isPinned={activeHotspotId === highlightedHotspot.id}
						tier={tier}
					/>
				) : null}
			</group>
		</>
	);
}

function GlowSprite({
	centerXPercent,
	centerYPercent,
	color,
	heightPercent,
	opacity,
	rotation = 0,
	texture,
	widthPercent,
	z = 0,
}: GlowSpriteProps) {
	const viewport = useThree((state) => state.viewport);
	const position = useMemo<[number, number, number]>(
		() => [
			percentToSceneX(centerXPercent, viewport.width),
			percentToSceneY(centerYPercent, viewport.height),
			z,
		],
		[centerXPercent, centerYPercent, viewport.height, viewport.width, z],
	);
	const scale = useMemo<[number, number, number]>(
		() => [
			viewport.width * (widthPercent / 100),
			viewport.height * (heightPercent / 100),
			1,
		],
		[heightPercent, viewport.height, viewport.width, widthPercent],
	);

	return (
		<sprite position={position} scale={scale} renderOrder={2}>
			<spriteMaterial
				blending={AdditiveBlending}
				color={color}
				depthWrite={false}
				map={texture}
				opacity={opacity}
				rotation={rotation}
				transparent
				toneMapped={false}
			/>
		</sprite>
	);
}

function RouteRibbonFX({
	activeRouteIds,
	activeShipId,
	glowTexture,
	hasSelection,
	path,
	signal,
	stripe,
	tier,
}: RouteRibbonFXProps) {
	const viewport = useThree((state) => state.viewport);
	const groupRef = useRef<Group>(null);
	const glowRef = useRef<ThreeSprite>(null);
	const coreRef = useRef<ThreeSprite>(null);
	const sweepRef = useRef<ThreeSprite>(null);
	const nodeRefs = useRef<Array<ThreeSprite | null>>([]);
	const stripeFrame = useMemo(() => toPercentFrame(stripe), [stripe]);
	const isActive =
		activeShipId === signal.shipId || activeRouteIds.includes(signal.stripeId);
	const position = useMemo<[number, number, number]>(
		() => [
			percentToSceneX(stripeFrame.centerX, viewport.width),
			percentToSceneY(stripeFrame.centerY, viewport.height),
			0.18,
		],
		[stripeFrame.centerX, stripeFrame.centerY, viewport.height, viewport.width],
	);
	const stripeWidth = useMemo(
		() => viewport.width * (stripeFrame.width / 100),
		[stripeFrame.width, viewport.width],
	);
	const stripeHeight = useMemo(
		() => viewport.height * (stripeFrame.height / 100),
		[stripeFrame.height, viewport.height],
	);
	const glowScale = useMemo<[number, number, number]>(
		() => [
			stripeWidth * 0.98,
			Math.max(stripeHeight * 6.4, viewport.height * 0.018),
			1,
		],
		[stripeHeight, stripeWidth, viewport.height],
	);
	const coreScale = useMemo<[number, number, number]>(
		() => [
			stripeWidth * 0.76,
			Math.max(stripeHeight * 2.8, viewport.height * 0.0075),
			1,
		],
		[stripeHeight, stripeWidth, viewport.height],
	);
	const sweepScale = useMemo<[number, number, number]>(
		() => [
			Math.max(stripeWidth * 0.18, viewport.width * 0.08),
			Math.max(stripeHeight * 4.8, viewport.height * 0.018),
			1,
		],
		[stripeHeight, stripeWidth, viewport.height, viewport.width],
	);
	const nodeScale = useMemo<[number, number, number]>(() => {
		const nodeSize = Math.max(stripeHeight * 4.4, viewport.height * 0.013);

		return [nodeSize, nodeSize, 1];
	}, [stripeHeight, viewport.height]);
	const accentTone = useMemo(
		() => splitColorAlpha(signal.accent),
		[signal.accent],
	);
	const beamTone = useMemo(() => splitColorAlpha(signal.beam), [signal.beam]);
	const nodeTone = useMemo(() => splitColorAlpha(signal.node), [signal.node]);

	useFrame((state, delta) => {
		const elapsed = state.clock.elapsedTime;
		const ribbonProgress = loopProgress(
			elapsed,
			path.duration * 0.72,
			path.delay + (signal.phaseOffset ?? 0),
		);
		const pulse =
			0.96 + Math.sin(elapsed * 1.4 + ribbonProgress * Math.PI * 2) * 0.05;
		const opacityBase = isActive
			? tier === "high"
				? 0.22
				: tier === "medium"
					? 0.18
					: 0.14
			: hasSelection
				? 0.035
				: tier === "high"
					? 0.1
					: tier === "medium"
						? 0.08
						: 0.06;
		const sweepOpacity =
			opacityBase * (isActive ? 1.8 : 0.84) * bellCurve(ribbonProgress);

		if (groupRef.current) {
			groupRef.current.scale.x = MathUtils.damp(
				groupRef.current.scale.x,
				1 + (pulse - 1) * 0.2,
				5,
				delta,
			);
			groupRef.current.scale.y = MathUtils.damp(
				groupRef.current.scale.y,
				pulse,
				5,
				delta,
			);
		}

		dampSpriteOpacity(
			glowRef.current,
			opacityBase * 0.94 * accentTone.alpha,
			delta,
			5,
		);
		dampSpriteOpacity(
			coreRef.current,
			opacityBase * (isActive ? 0.9 : 0.64) * beamTone.alpha,
			delta,
			6,
		);

		if (sweepRef.current) {
			sweepRef.current.position.x = MathUtils.lerp(
				-stripeWidth * 0.42,
				stripeWidth * 0.42,
				ribbonProgress,
			);
			dampSpriteOpacity(sweepRef.current, sweepOpacity, delta, 7);
		}

		nodeRefs.current.forEach((node, index) => {
			if (!node) {
				return;
			}

			const nodePulse = 0.88 + Math.sin(elapsed * 2.4 + index * 0.7) * 0.16;
			const nodeOpacity =
				(isActive
					? opacityBase * (1.6 + Math.sin(elapsed * 2.1 + index * 0.4) * 0.2)
					: hasSelection
						? 0.03
						: opacityBase * 1.04) * nodeTone.alpha;

			node.scale.x = MathUtils.damp(
				node.scale.x,
				nodeScale[0] * nodePulse,
				8,
				delta,
			);
			node.scale.y = MathUtils.damp(
				node.scale.y,
				nodeScale[1] * nodePulse,
				8,
				delta,
			);
			dampSpriteOpacity(node, nodeOpacity, delta, 8);
		});
	});

	return (
		<group ref={groupRef} position={position} renderOrder={3}>
			<sprite ref={glowRef} scale={glowScale} renderOrder={3}>
				<spriteMaterial
					blending={AdditiveBlending}
					color={accentTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={coreRef}
				position={[0, 0, 0.02]}
				scale={coreScale}
				renderOrder={4}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={beamTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={sweepRef}
				position={[-stripeWidth * 0.42, 0, 0.03]}
				scale={sweepScale}
				renderOrder={5}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={nodeTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			{signal.markerFractions.map((fraction, index) => (
				<sprite
					key={`${signal.id}-gpu-node-${fraction}`}
					ref={(node) => {
						nodeRefs.current[index] = node;
					}}
					position={[
						MathUtils.lerp(-stripeWidth / 2, stripeWidth / 2, fraction / 100),
						0,
						0.04,
					]}
					scale={nodeScale}
					renderOrder={5}
				>
					<spriteMaterial
						blending={AdditiveBlending}
						color={nodeTone.color}
						depthWrite={false}
						map={glowTexture}
						opacity={0}
						transparent
						toneMapped={false}
					/>
				</sprite>
			))}
		</group>
	);
}

function ShipWakeFX({
	activeRouteIds,
	activeShipId,
	frame,
	glowTexture,
	hasSelection,
	path,
	tier,
}: ShipWakeFXProps) {
	const viewport = useThree((state) => state.viewport);
	const groupRef = useRef<Group>(null);
	const glowRef = useRef<ThreeSprite>(null);
	const coreRef = useRef<ThreeSprite>(null);
	const sparkRef = useRef<ThreeSprite>(null);
	const emberRef = useRef<ThreeSprite>(null);
	const shipFrame = useMemo(() => toPercentFrame(frame), [frame]);
	const relatedRouteIds = shipRouteLookup.get(path.id) ?? [];
	const isActive =
		activeShipId === path.id ||
		activeRouteIds.some((routeId) => relatedRouteIds.includes(routeId));
	const baseX = useMemo(
		() => percentToSceneX(shipFrame.centerX, viewport.width),
		[shipFrame.centerX, viewport.width],
	);
	const baseY = useMemo(
		() => percentToSceneY(shipFrame.centerY, viewport.height),
		[shipFrame.centerY, viewport.height],
	);
	const wakeLength = useMemo(
		() =>
			viewport.width *
			(shipFrame.width / 100) *
			SHIP_WAKE_LENGTH_MULTIPLIER[path.id],
		[path.id, shipFrame.width, viewport.width],
	);
	const wakeHeight = useMemo(
		() =>
			Math.max(
				viewport.height * (shipFrame.height / 100) * 0.55,
				viewport.height * 0.012,
			),
		[shipFrame.height, viewport.height],
	);
	const glowScale = useMemo<[number, number, number]>(
		() => [wakeLength, wakeHeight * 4.4, 1],
		[wakeHeight, wakeLength],
	);
	const coreScale = useMemo<[number, number, number]>(
		() => [wakeLength * 0.68, wakeHeight * 1.8, 1],
		[wakeHeight, wakeLength],
	);
	const sparkScale = useMemo<[number, number, number]>(() => {
		const sparkleSize = Math.max(wakeHeight * 1.3, viewport.height * 0.01);

		return [sparkleSize, sparkleSize, 1];
	}, [wakeHeight, viewport.height]);
	const emberScale = useMemo<[number, number, number]>(() => {
		const emberSize = Math.max(wakeHeight, viewport.height * 0.008);

		return [emberSize, emberSize, 1];
	}, [wakeHeight, viewport.height]);
	const baseRotation = useMemo(
		() => MathUtils.degToRad(SHIP_WAKE_ROTATION_DEGREES[path.id]),
		[path.id],
	);
	const wakeGlowTone = useMemo(
		() => splitColorAlpha(path.wakeGlow),
		[path.wakeGlow],
	);
	const wakeAccentTone = useMemo(
		() => splitColorAlpha(path.wakeAccent),
		[path.wakeAccent],
	);
	const wakeSparkTone = useMemo(
		() => splitColorAlpha(path.wakeSpark),
		[path.wakeSpark],
	);

	useFrame((state, delta) => {
		const elapsed = state.clock.elapsedTime;
		const travelProgress = loopProgress(elapsed, path.duration, path.delay);
		const xOffset = sampleKeyframes(path.xKeyframes, travelProgress);
		const yOffset = sampleKeyframes(path.yKeyframes, travelProgress);
		const rotateOffset = sampleKeyframes(path.rotateKeyframes, travelProgress);
		const scaleOffset = sampleKeyframes(path.scaleKeyframes, travelProgress);
		const opacityBase = isActive
			? tier === "high"
				? 0.24
				: tier === "medium"
					? 0.2
					: 0.16
			: hasSelection
				? 0.04
				: tier === "high"
					? 0.11
					: tier === "medium"
						? 0.09
						: 0.07;
		const wakePulse = 0.94 + Math.sin(elapsed * 2 + path.delay) * 0.08;

		if (groupRef.current) {
			groupRef.current.position.x = MathUtils.damp(
				groupRef.current.position.x,
				baseX + xOffset,
				5,
				delta,
			);
			groupRef.current.position.y = MathUtils.damp(
				groupRef.current.position.y,
				baseY - yOffset,
				5,
				delta,
			);
			groupRef.current.rotation.z = MathUtils.damp(
				groupRef.current.rotation.z,
				baseRotation + MathUtils.degToRad(rotateOffset),
				6,
				delta,
			);
			groupRef.current.scale.x = MathUtils.damp(
				groupRef.current.scale.x,
				scaleOffset,
				5,
				delta,
			);
			groupRef.current.scale.y = MathUtils.damp(
				groupRef.current.scale.y,
				0.96 + (scaleOffset - 1) * 0.55,
				5,
				delta,
			);
		}

		dampSpriteOpacity(
			glowRef.current,
			opacityBase * 0.94 * wakeGlowTone.alpha,
			delta,
			5,
		);
		dampSpriteOpacity(
			coreRef.current,
			opacityBase * 1.12 * wakeAccentTone.alpha,
			delta,
			6,
		);
		dampSpriteOpacity(
			sparkRef.current,
			opacityBase * 1.36 * wakeSparkTone.alpha,
			delta,
			7,
		);
		dampSpriteOpacity(
			emberRef.current,
			opacityBase * 0.9 * wakeAccentTone.alpha,
			delta,
			7,
		);

		if (sparkRef.current) {
			sparkRef.current.position.x = MathUtils.damp(
				sparkRef.current.position.x,
				-wakeLength * 0.48 + Math.sin(elapsed * 2.8 + path.delay) * 5,
				7,
				delta,
			);
			sparkRef.current.position.y = MathUtils.damp(
				sparkRef.current.position.y,
				wakeHeight * (0.16 + Math.sin(elapsed * 3.4 + path.delay) * 0.12),
				7,
				delta,
			);
			sparkRef.current.scale.x = MathUtils.damp(
				sparkRef.current.scale.x,
				sparkScale[0] * (wakePulse + 0.08),
				8,
				delta,
			);
			sparkRef.current.scale.y = MathUtils.damp(
				sparkRef.current.scale.y,
				sparkScale[1] * (wakePulse + 0.08),
				8,
				delta,
			);
		}

		if (emberRef.current) {
			emberRef.current.position.x = MathUtils.damp(
				emberRef.current.position.x,
				-wakeLength * 0.3 + Math.cos(elapsed * 2.2 + path.delay) * 3,
				7,
				delta,
			);
			emberRef.current.position.y = MathUtils.damp(
				emberRef.current.position.y,
				-wakeHeight * (0.12 + Math.sin(elapsed * 2.6 + path.delay) * 0.1),
				7,
				delta,
			);
		}
	});

	return (
		<group ref={groupRef} position={[baseX, baseY, 0.28]} renderOrder={6}>
			<sprite
				ref={glowRef}
				position={[-wakeLength * 0.28, 0, 0]}
				scale={glowScale}
				renderOrder={6}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={wakeGlowTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={coreRef}
				position={[-wakeLength * 0.18, 0, 0.02]}
				scale={coreScale}
				renderOrder={7}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={wakeAccentTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={sparkRef}
				position={[-wakeLength * 0.48, wakeHeight * 0.16, 0.03]}
				scale={sparkScale}
				renderOrder={8}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={wakeSparkTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={emberRef}
				position={[-wakeLength * 0.3, -wakeHeight * 0.12, 0.03]}
				scale={emberScale}
				renderOrder={8}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={wakeAccentTone.color}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
		</group>
	);
}

function HotspotPulseFX({
	burstToken,
	glowTexture,
	hotspot,
	isPinned,
	tier,
}: HotspotPulseFXProps) {
	const viewport = useThree((state) => state.viewport);
	const groupRef = useRef<Group>(null);
	const outerRef = useRef<ThreeSprite>(null);
	const innerRef = useRef<ThreeSprite>(null);
	const emberRef = useRef<ThreeSprite>(null);
	const burstProgressRef = useRef(1.2);
	const lastBurstTokenRef = useRef(burstToken);
	const frame = useMemo(
		() => toPercentFrame(hotspot.focusFrame),
		[hotspot.focusFrame],
	);
	const position = useMemo<[number, number, number]>(
		() => [
			percentToSceneX(frame.centerX, viewport.width),
			percentToSceneY(frame.centerY, viewport.height),
			0.34,
		],
		[frame.centerX, frame.centerY, viewport.height, viewport.width],
	);
	const burstWidth = useMemo(
		() =>
			viewport.width *
			((hotspot.kind === "ship" ? frame.width * 0.42 : frame.width * 0.28) /
				100),
		[frame.width, hotspot.kind, viewport.width],
	);
	const burstHeight = useMemo(
		() =>
			viewport.height *
			((hotspot.kind === "ship" ? frame.height * 0.72 : frame.height * 0.28) /
				100),
		[frame.height, hotspot.kind, viewport.height],
	);
	const outerScale = useMemo<[number, number, number]>(
		() => [
			Math.max(burstWidth, viewport.width * 0.08),
			Math.max(burstHeight, viewport.height * 0.028),
			1,
		],
		[burstHeight, burstWidth, viewport.height, viewport.width],
	);
	const innerScale = useMemo<[number, number, number]>(
		() => [outerScale[0] * 0.54, outerScale[1] * 0.54, 1],
		[outerScale],
	);
	const emberScale = useMemo<[number, number, number]>(
		() => [outerScale[0] * 0.34, outerScale[1] * 0.34, 1],
		[outerScale],
	);

	if (lastBurstTokenRef.current !== burstToken) {
		lastBurstTokenRef.current = burstToken;
		burstProgressRef.current = 0;
	}

	useFrame((state, delta) => {
		burstProgressRef.current = Math.min(
			burstProgressRef.current + delta / 1.05,
			1.18,
		);
		const burstProgress = Math.min(burstProgressRef.current, 1);
		const burstEnergy = Math.sin(burstProgress * Math.PI) ** 1.45;
		const pinnedPulse = isPinned
			? 0.94 + Math.sin(state.clock.elapsedTime * 2.1) * 0.08
			: 0.88;
		const outerOpacityBase =
			tier === "high" ? 0.22 : tier === "medium" ? 0.18 : 0.14;
		const innerOpacityBase =
			tier === "high" ? 0.2 : tier === "medium" ? 0.16 : 0.12;
		const emberOpacityBase =
			tier === "high" ? 0.16 : tier === "medium" ? 0.12 : 0.09;

		if (groupRef.current) {
			groupRef.current.scale.x = MathUtils.damp(
				groupRef.current.scale.x,
				pinnedPulse,
				5,
				delta,
			);
			groupRef.current.scale.y = MathUtils.damp(
				groupRef.current.scale.y,
				pinnedPulse,
				5,
				delta,
			);
		}

		if (outerRef.current) {
			outerRef.current.scale.x = MathUtils.damp(
				outerRef.current.scale.x,
				outerScale[0] * (0.78 + burstProgress * 0.74),
				6,
				delta,
			);
			outerRef.current.scale.y = MathUtils.damp(
				outerRef.current.scale.y,
				outerScale[1] * (0.78 + burstProgress * 0.74),
				6,
				delta,
			);
		}

		if (emberRef.current) {
			emberRef.current.position.y = MathUtils.damp(
				emberRef.current.position.y,
				burstHeight * (burstProgress * 0.18 - 0.04),
				7,
				delta,
			);
		}

		dampSpriteOpacity(
			outerRef.current,
			outerOpacityBase * burstEnergy + (isPinned ? outerOpacityBase * 0.44 : 0),
			delta,
			6,
		);
		dampSpriteOpacity(
			innerRef.current,
			innerOpacityBase * (0.32 + burstEnergy) +
				(isPinned ? innerOpacityBase * 0.62 : 0),
			delta,
			7,
		);
		dampSpriteOpacity(
			emberRef.current,
			emberOpacityBase * burstEnergy + (isPinned ? emberOpacityBase * 0.3 : 0),
			delta,
			7,
		);
	});

	return (
		<group ref={groupRef} position={position} renderOrder={9}>
			<sprite ref={outerRef} scale={outerScale} renderOrder={9}>
				<spriteMaterial
					blending={AdditiveBlending}
					color={hotspot.accent}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={innerRef}
				position={[0, 0, 0.02]}
				scale={innerScale}
				renderOrder={10}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color="#fff4df"
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
			<sprite
				ref={emberRef}
				position={[0, -burstHeight * 0.04, 0.03]}
				scale={emberScale}
				renderOrder={10}
			>
				<spriteMaterial
					blending={AdditiveBlending}
					color={hotspot.accent}
					depthWrite={false}
					map={glowTexture}
					opacity={0}
					transparent
					toneMapped={false}
				/>
			</sprite>
		</group>
	);
}

function buildParticleField(count: number, width: number, height: number) {
	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);
	const warm = [0xf4, 0xb3, 0x7b];
	const cool = [0x8a, 0xdb, 0xe2];
	const neutral = [0xfa, 0xea, 0xd0];

	for (let index = 0; index < count; index += 1) {
		const baseOffset = index * 3;
		const bias = Math.random();
		const x = MathUtils.randFloatSpread(width * 0.98);
		const y = MathUtils.randFloatSpread(height * 0.98);
		const depth = MathUtils.randFloat(-0.2, 0.2);
		const sourceColor = bias > 0.66 ? warm : bias > 0.34 ? cool : neutral;
		const intensity = MathUtils.randFloat(0.68, 1);

		positions[baseOffset] = x;
		positions[baseOffset + 1] = y;
		positions[baseOffset + 2] = depth;

		colors[baseOffset] = (sourceColor[0] / 255) * intensity;
		colors[baseOffset + 1] = (sourceColor[1] / 255) * intensity;
		colors[baseOffset + 2] = (sourceColor[2] / 255) * intensity;
	}

	return { colors, positions };
}

function createGlowTexture() {
	const size = 128;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;

	const context = canvas.getContext("2d");
	if (!context) {
		return new Texture();
	}

	const gradient = context.createRadialGradient(
		size / 2,
		size / 2,
		0,
		size / 2,
		size / 2,
		size / 2,
	);
	gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
	gradient.addColorStop(0.32, "rgba(255, 255, 255, 0.55)");
	gradient.addColorStop(0.68, "rgba(255, 255, 255, 0.12)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

	context.fillStyle = gradient;
	context.fillRect(0, 0, size, size);

	const texture = new CanvasTexture(canvas);
	texture.needsUpdate = true;
	texture.generateMipmaps = false;

	return texture;
}

function percentToSceneX(percent: number, width: number) {
	return (percent / 100 - 0.5) * width;
}

function percentToSceneY(percent: number, height: number) {
	return (0.5 - percent / 100) * height;
}

function toPercentFrame(
	frame: Pick<
		PosterHotspotFrame | StripeLayer,
		"height" | "left" | "top" | "width"
	>,
) {
	const top = parsePercent(frame.top);
	const left = parsePercent(frame.left);
	const width = parsePercent(frame.width);
	const height = parsePercent(frame.height);

	return {
		centerX: left + width / 2,
		centerY: top + height / 2,
		height,
		left,
		top,
		width,
	};
}

function parsePercent(value: string) {
	return Number.parseFloat(value);
}

function loopProgress(elapsedTime: number, duration: number, phaseOffset = 0) {
	const durationSafe = Math.max(duration, 0.001);
	const progress = (elapsedTime + phaseOffset) / durationSafe;

	return progress - Math.floor(progress);
}

function sampleKeyframes(values: readonly number[], progress: number) {
	if (values.length === 0) {
		return 0;
	}

	if (values.length === 1) {
		return values[0] ?? 0;
	}

	for (let index = 0; index < TRAVEL_KEYFRAME_TIMES.length - 1; index += 1) {
		const startTime = TRAVEL_KEYFRAME_TIMES[index] ?? 0;
		const endTime = TRAVEL_KEYFRAME_TIMES[index + 1] ?? 1;

		if (progress <= endTime) {
			const startValue = values[index] ?? values[0] ?? 0;
			const endValue = values[index + 1] ?? values[values.length - 1] ?? 0;
			const segmentProgress = MathUtils.clamp(
				(progress - startTime) / Math.max(endTime - startTime, 0.001),
				0,
				1,
			);

			return MathUtils.lerp(startValue, endValue, segmentProgress);
		}
	}

	return values[values.length - 1] ?? 0;
}

function bellCurve(progress: number) {
	return Math.sin(progress * Math.PI) ** 1.6;
}

function dampSpriteOpacity(
	sprite: ThreeSprite | null,
	targetOpacity: number,
	delta: number,
	smoothing: number,
) {
	if (!sprite) {
		return;
	}

	const material = sprite.material as ThreeSpriteMaterial;
	material.opacity = MathUtils.damp(
		material.opacity,
		targetOpacity,
		smoothing,
		delta,
	);
}

function splitColorAlpha(colorValue: string) {
	const rgbaMatch = colorValue.match(
		/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
	);

	if (!rgbaMatch) {
		return {
			alpha: 1,
			color: colorValue,
		};
	}

	const [, red = "255", green = "255", blue = "255", alpha = "1"] = rgbaMatch;

	return {
		alpha: Number.parseFloat(alpha),
		color: `rgb(${red}, ${green}, ${blue})`,
	};
}
