import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "dist-server",
    ssr: "serveur-commercial/serveurProduction.ts",
    target: "node22",
    rollupOptions: {
      output: {
        entryFileNames: "serveur.mjs",
      },
    },
  },
});
