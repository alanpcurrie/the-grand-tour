// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	site: "https://alanpcurrie.github.io",
	base: "/the-grand-tour",
	vite: {
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("/node_modules/")) {
							return;
						}

						if (id.includes("/three/") || id.includes("/three-stdlib/")) {
							return "three-vendor";
						}

						if (
							id.includes("/@react-three/") ||
							id.includes("/react-reconciler/") ||
							id.includes("/maath/") ||
							id.includes("/camera-controls/") ||
							id.includes("/meshline/") ||
							id.includes("/suspend-react/") ||
							id.includes("/zustand/")
						) {
							return "r3f-vendor";
						}

						if (id.includes("/motion/")) {
							return "motion-vendor";
						}

						if (
							id.includes("/react/") ||
							id.includes("/react-dom/") ||
							id.includes("/scheduler/")
						) {
							return "react-vendor";
						}
					},
				},
			},
		},
	},
});
