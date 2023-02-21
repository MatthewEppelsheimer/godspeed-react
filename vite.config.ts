import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],

	define: {
		// By default, Vite doesn't include NodeJS shims required by Draft.js
		// @see https://github.com/vitejs/vite/discussions/5912#discussioncomment-2908994
		// @TODO remove after migration away from Draft.js
		global: {},
	},
});
