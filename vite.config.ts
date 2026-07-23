import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { creerPluginCommercial } from "./serveur-commercial/plugin-vite";

export default defineConfig(({ mode }) => {
  const environnement = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      creerPluginCommercial({
        mode,
        paddleClientToken: environnement.PADDLE_CLIENT_TOKEN,
        paddlePriceId: environnement.PADDLE_PRICE_ID,
        secretWebhook: environnement.PADDLE_WEBHOOK_SECRET,
        secretPreuveLocale: environnement.PREMIUM_RECEIPT_SECRET,
      }),
    ],
    test: {
      environment: "node",
      include: [
        "src/**/*.test.ts",
        "serveur-commercial/**/*.test.ts",
      ],
    },
  };
});
