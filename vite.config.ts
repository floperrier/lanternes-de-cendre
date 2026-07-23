import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { creerPluginCommercial } from "./serveur-commercial/plugin-vite";

export default defineConfig(({ mode }) => {
  const environnement = loadEnv(mode, process.cwd(), "");
  const lire = (nom: string) =>
    process.env[nom] ?? environnement[nom];
  const port = Number.parseInt(
    lire("PLAYWRIGHT_PORT") ?? "5173",
    10,
  );
  return {
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
    plugins: [
      react(),
      creerPluginCommercial({
        mode,
        origineApplication: lire("COMMERCIAL_ORIGIN"),
        cheminBaseDeDonnees:
          lire("COMMERCIAL_DATABASE_PATH") ??
          `.scratch/commercial-${port}.sqlite`,
        paddleClientToken: lire("PADDLE_CLIENT_TOKEN"),
        secretWebhook: lire("PADDLE_WEBHOOK_SECRET"),
        clePriveeDeRecu:
          lire("PREMIUM_RECEIPT_PRIVATE_KEY")?.replaceAll(
            "\\n",
            "\n",
          ),
        secretBetterAuth: lire("BETTER_AUTH_SECRET"),
        produit: {
          priceId:
            lire("PADDLE_PRICE_ID") ?? "pri_lanternes_v1_test",
          productId:
            lire("PADDLE_PRODUCT_ID") ?? "pro_lanternes_v1",
          quantite: 1,
          devise: "EUR",
          total: "1999",
        },
        livraisonEmail:
          lire("EMAIL_DELIVERY_URL") === undefined ||
          lire("EMAIL_DELIVERY_TOKEN") === undefined
            ? undefined
            : {
                url: lire("EMAIL_DELIVERY_URL")!,
                jeton: lire("EMAIL_DELIVERY_TOKEN")!,
              },
      }),
    ],
    test: {
      environment: "node",
      setupFiles: ["./tests/support/initialiser.ts"],
      include: [
        "src/**/*.test.ts",
        "scripts/**/*.test.ts",
        "serveur-commercial/**/*.test.ts",
      ],
    },
  };
});
