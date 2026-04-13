import { fileURLToPath } from "node:url";

import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  base: "/",
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;

          if (/\/(react|react-dom)\//.test(id)) return "vendor";
          if (id.includes("@mantine/")) return "mantine";
          if (id.includes("@dnd-kit/")) return "dnd";
          if (
            id.includes("@react-oauth/google") ||
            id.includes("@googleworkspace/")
          )
            return "google";
          if (id.includes("i18next") || id.includes("react-i18next"))
            return "i18n";
          if (id.includes("/zustand/") || id.includes("/zod/")) return "state";
          if (id.includes("@tabler/icons-react")) return "icons";
          return undefined;
        },
      },
    },
  },
});
