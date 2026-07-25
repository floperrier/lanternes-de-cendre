import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { creerServeurDeProduction } from "./serveurProduction";

const repertoiresTemporaires: string[] = [];

async function racineStatique(): Promise<string> {
  const racine = await mkdtemp(join(tmpdir(), "lanternes-beta-"));
  repertoiresTemporaires.push(racine);
  await writeFile(
    join(racine, "index.html"),
    '<!doctype html><main id="root">Bêta</main>',
  );
  await writeFile(
    join(racine, "app-abc12345.js"),
    "export const beta = true;",
  );
  return racine;
}

async function avecServeur(
  executer: (origine: string) => Promise<void>,
): Promise<void> {
  const serveur = creerServeurDeProduction({
    racineStatique: await racineStatique(),
    version: "0.1.0",
    commit: "abc123",
    gererCommercial: async (requete, reponse) => {
      if (requete.url !== "/api/commercial/acces") {
        return false;
      }
      reponse.statusCode = 200;
      reponse.setHeader("Content-Type", "application/json");
      reponse.end('{"premium":false}');
      return true;
    },
  });
  await new Promise<void>((resoudre) =>
    serveur.listen(0, "127.0.0.1", resoudre),
  );
  const adresse = serveur.address();
  if (adresse === null || typeof adresse === "string") {
    throw new Error("Le serveur de test n’a pas publié de port.");
  }
  try {
    await executer(`http://127.0.0.1:${adresse.port}`);
  } finally {
    await new Promise<void>((resoudre, rejeter) =>
      serveur.close((erreur) => (erreur ? rejeter(erreur) : resoudre())),
    );
  }
}

afterEach(async () => {
  await Promise.all(
    repertoiresTemporaires.splice(0).map((repertoire) =>
      rm(repertoire, { recursive: true, force: true }),
    ),
  );
});

describe("serveur de production de la bêta", () => {
  it("sert le shell, les routes SPA et les assets avec des caches distincts", async () => {
    await avecServeur(async (origine) => {
      const shell = await fetch(`${origine}/campagne/CENDRE-01`);
      expect(shell.status).toBe(200);
      expect(await shell.text()).toContain('id="root"');
      expect(shell.headers.get("cache-control")).toBe("no-cache");
      expect(shell.headers.get("x-content-type-options")).toBe("nosniff");
      expect(shell.headers.get("x-frame-options")).toBe("DENY");

      const asset = await fetch(`${origine}/app-abc12345.js`);
      expect(asset.status).toBe(200);
      expect(asset.headers.get("content-type")).toContain("text/javascript");
      expect(asset.headers.get("cache-control")).toBe(
        "public, max-age=31536000, immutable",
      );
      expect(await asset.text()).toContain("beta = true");
    });
  });

  it("expose une sonde versionnée et délègue uniquement les routes API", async () => {
    await avecServeur(async (origine) => {
      const sante = await fetch(`${origine}/api/beta/sante`);
      expect(await sante.json()).toEqual({
        statut: "prete",
        version: "0.1.0",
        commit: "abc123",
        sourcePropre: true,
      });
      const santeAvecRetourEncode = await fetch(
        `${origine}/api/beta/sante?retour=http%3A%2F%2Fjeu.example`,
      );
      expect(santeAvecRetourEncode.status).toBe(200);

      const acces = await fetch(`${origine}/api/commercial/acces`);
      expect(await acces.json()).toEqual({ premium: false });

      const methode = await fetch(`${origine}/app-abc12345.js`, {
        method: "POST",
      });
      expect(methode.status).toBe(405);
    });
  });

  it("refuse les traversées de chemin et ne révèle aucun fichier voisin", async () => {
    await avecServeur(async (origine) => {
      const reponse = await fetch(
        `${origine}/%2e%2e%2fpackage.json`,
        { redirect: "manual" },
      );
      expect([400, 404]).toContain(reponse.status);
      expect(await reponse.text()).not.toContain("lanternes-de-cendre");
    });
  });
});
