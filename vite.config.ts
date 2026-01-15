import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mantine: [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/dates",
            "@mantine/form",
            "@mantine/modals",
          ],
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
          google: [
            "@react-oauth/google",
            "@googleworkspace/drive-picker-react",
            "@googleworkspace/drive-picker-element",
          ],
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
          ],
          state: ["zustand", "zod", "mantine-form-zod-resolver"],
          icons: ["@tabler/icons-react"],
        },
      },
    },
  },
});
