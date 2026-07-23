import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";

import {
  creerPluginCommercial,
  resoudreOrigineDeDeveloppement,
  validerConfigurationServeurCommercial,
} from "./plugin-vite";
import {
  CLE_PRIVEE_DE_RECU_DE_TEST,
  PRODUIT_DE_TEST,
} from "./service";

const dossiersTemporaires: string[] = [];
const serveurs: ViteDevServer[] = [];

afterEach(async () => {
  await Promise.all(serveurs.splice(0).map((serveur) => serveur.close()));
  await Promise.all(
    dossiersTemporaires.splice(0).map((dossier) =>
      rm(dossier, { recursive: true, force: true }),
    ),
  );
});

describe("plugin Vite du service commercial", () => {
  it("applique la limitation Better Auth à la route de magic link", async () => {
    const dossier = await mkdtemp(join(tmpdir(), "lanternes-plugin-"));
    dossiersTemporaires.push(dossier);
    const serveur = await createServer({
      configFile: false,
      logLevel: "silent",
      plugins: [
        creerPluginCommercial({
          mode: "test",
          origineApplication: "http://127.0.0.1:4173",
          cheminBaseDeDonnees: join(dossier, "commercial.sqlite"),
          produit: PRODUIT_DE_TEST,
        }),
      ],
      server: {
        host: "127.0.0.1",
        port: 0,
        strictPort: true,
      },
    });
    serveurs.push(serveur);
    await serveur.listen();
    const adresse = serveur.httpServer!.address();
    if (adresse === null || typeof adresse === "string") {
      throw new Error("adresse-vite-indisponible");
    }
    const url = `http://127.0.0.1:${adresse.port}/api/commercial/lien`;
    const statuts: number[] = [];

    for (let index = 0; index < 6; index += 1) {
      const reponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `veilleuse-${index}@example.test`,
          intention: "acheter",
        }),
      });
      statuts.push(reponse.status);
    }

    expect(statuts).toEqual([202, 202, 202, 202, 202, 429]);
  });

  it("dérive les magic links du port Vite résolu", () => {
    expect(
      resoudreOrigineDeDeveloppement({
        host: "127.0.0.1",
        port: 4400,
        https: false,
      }),
    ).toBe("http://127.0.0.1:4400");
  });

  it("refuse HTTP pour l'application et l'email en production", () => {
    const base = {
      mode: "production",
      secretWebhook: "9vWN7kuUPHXCjogIq6Z5afE8eLwY1xQ3dRo0nTmB",
      clePriveeDeRecu: CLE_PRIVEE_DE_RECU_DE_TEST,
      secretBetterAuth: "uF2w7Jp9xK4mN8qR5sV1yB6dG3hL0cZtA9eQ",
      livraisonEmail: {
        url: "https://email.example.test/send",
        jeton: "jeton-de-test",
      },
    } as const;

    expect(() =>
      validerConfigurationServeurCommercial({
        ...base,
        origineApplication: "http://jeu.example.test",
      }),
    ).toThrow(/HTTPS/);
    expect(() =>
      validerConfigurationServeurCommercial({
        ...base,
        origineApplication: "https://jeu.example.test",
        livraisonEmail: {
          ...base.livraisonEmail,
          url: "http://email.example.test/send",
        },
      }),
    ).toThrow(/HTTPS/);
  });
});
