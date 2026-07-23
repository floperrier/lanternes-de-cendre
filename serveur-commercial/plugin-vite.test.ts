import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer as creerServeurTcp } from "node:net";

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

async function choisirPortLibre(): Promise<number> {
  const serveur = creerServeurTcp();
  return new Promise((resolve, reject) => {
    serveur.once("error", reject);
    serveur.listen(0, "127.0.0.1", () => {
      const adresse = serveur.address();
      if (adresse === null || typeof adresse === "string") {
        serveur.close();
        reject(new Error("port-libre-indisponible"));
        return;
      }
      serveur.close((erreur) =>
        erreur === undefined ? resolve(adresse.port) : reject(erreur),
      );
    });
  });
}

afterEach(async () => {
  await Promise.all(serveurs.splice(0).map((serveur) => serveur.close()));
  await Promise.all(
    dossiersTemporaires.splice(0).map((dossier) =>
      rm(dossier, { recursive: true, force: true }),
    ),
  );
});

describe("plugin Vite du service commercial", () => {
  it("ne révèle pas les noms d’assets premium sans Accès premium", async () => {
    const dossier = await mkdtemp(join(tmpdir(), "lanternes-plugin-"));
    const port = await choisirPortLibre();
    dossiersTemporaires.push(dossier);
    const serveur = await createServer({
      configFile: false,
      logLevel: "silent",
      plugins: [
        creerPluginCommercial({
          mode: "test",
          origineApplication: `http://127.0.0.1:${port}`,
          cheminBaseDeDonnees: join(dossier, "commercial.sqlite"),
          produit: PRODUIT_DE_TEST,
        }),
      ],
      server: {
        host: "127.0.0.1",
        port,
        strictPort: true,
      },
    });
    serveurs.push(serveur);
    await serveur.listen();
    const adresse = serveur.httpServer!.address();
    if (adresse === null || typeof adresse === "string") {
      throw new Error("adresse-vite-indisponible");
    }
    const origine = `http://127.0.0.1:${adresse.port}`;

    const [assetExistant, assetInconnu] = await Promise.all([
      fetch(
        `${origine}/api/commercial/assets/veille-basse-cohorte.webp`,
      ),
      fetch(`${origine}/api/commercial/assets/asset-inconnu.webp`),
    ]);

    expect({
      existant: {
        statut: assetExistant.status,
        corps: await assetExistant.json(),
      },
      inconnu: {
        statut: assetInconnu.status,
        corps: await assetInconnu.json(),
      },
    }).toEqual({
      existant: {
        statut: 401,
        corps: { erreur: "session-commerciale-absente" },
      },
      inconnu: {
        statut: 401,
        corps: { erreur: "session-commerciale-absente" },
      },
    });

    const demandeDeLien = await fetch(`${origine}/api/commercial/lien`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "veilleuse-sans-acces@example.test",
        intention: "acheter",
      }),
    });
    const { urlDeTest } = (await demandeDeLien.json()) as {
      readonly urlDeTest: string;
    };
    const verification = await fetch(urlDeTest, { redirect: "manual" });
    const cookie = verification.headers.get("set-cookie")?.split(";")[0];
    if (cookie === undefined) {
      throw new Error("cookie-de-session-absent");
    }
    const [assetExistantSansAcces, assetInconnuSansAcces] = await Promise.all([
      fetch(
        `${origine}/api/commercial/assets/veille-basse-cohorte.webp`,
        { headers: { Cookie: cookie } },
      ),
      fetch(`${origine}/api/commercial/assets/asset-inconnu.webp`, {
        headers: { Cookie: cookie },
      }),
    ]);

    expect({
      existant: {
        statut: assetExistantSansAcces.status,
        corps: await assetExistantSansAcces.json(),
      },
      inconnu: {
        statut: assetInconnuSansAcces.status,
        corps: await assetInconnuSansAcces.json(),
      },
    }).toEqual({
      existant: {
        statut: 403,
        corps: { erreur: "acces-premium-requis" },
      },
      inconnu: {
        statut: 403,
        corps: { erreur: "acces-premium-requis" },
      },
    });

    const paiement = await fetch(`${origine}/api/commercial/paiement`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    const { transactionId } = (await paiement.json()) as {
      readonly transactionId: string;
    };
    await fetch(`${origine}/api/commercial/paiement-test`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId, issue: "accepte" }),
    });
    const [assetAutorise, assetInconnuAvecAcces] = await Promise.all([
      fetch(
        `${origine}/api/commercial/assets/veille-basse-cohorte.webp`,
        { headers: { Cookie: cookie } },
      ),
      fetch(`${origine}/api/commercial/assets/asset-inconnu.webp`, {
        headers: { Cookie: cookie },
      }),
    ]);
    const tailleAssetAutorise = (
      await assetAutorise.arrayBuffer()
    ).byteLength;

    expect({
      existant: {
        statut: assetAutorise.status,
        type: assetAutorise.headers.get("content-type"),
      },
      inconnu: {
        statut: assetInconnuAvecAcces.status,
        corps: await assetInconnuAvecAcces.json(),
      },
    }).toEqual({
      existant: {
        statut: 200,
        type: "image/webp",
      },
      inconnu: {
        statut: 404,
        corps: { erreur: "introuvable" },
      },
    });
    expect(tailleAssetAutorise).toBeGreaterThan(0);
  });

  it("applique la limitation Better Auth à la route de magic link", async () => {
    const dossier = await mkdtemp(join(tmpdir(), "lanternes-plugin-"));
    const port = await choisirPortLibre();
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
        port,
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
