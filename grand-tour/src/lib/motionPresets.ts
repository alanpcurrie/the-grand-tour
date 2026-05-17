export const pointerSpring = {
	stiffness: 120,
	damping: 24,
	mass: 0.8,
} as const;

export const slowFloat = (duration: number, delay = 0) => ({
	duration,
	delay,
	repeat: Number.POSITIVE_INFINITY,
	repeatType: "mirror" as const,
	ease: "easeInOut" as const,
});

export const revealTransition = {
	duration: 0.8,
	ease: "easeOut" as const,
};
