import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cp,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createServer as creerServeurTcp } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { expect, test } from "@playwright/test";

const sauvegardeConnue = await readFile(
  new URL("../../src/sauvegarde/fixtures/sauvegarde-v1.json", import.meta.url),
);

interface ManifesteBeta {
  readonly commit: string;
  readonly sourcePropre: boolean;
  readonly versions: Readonly<Record<string, number>>;
  readonly fichiers: readonly {
    readonly chemin: string;
    readonly octets: number;
    readonly sha256: string;
  }[];
  readonly [cle: string]: unknown;
}

function sha256(contenu: Buffer): string {
  return createHash("sha256").update(contenu).digest("hex");
}

async function creerPaquetPrecedent(
  source: string,
  destination: string,
): Promise<ManifesteBeta> {
  await cp(source, destination, { recursive: true });
  const cheminServeur = join(destination, "server/serveur.mjs");
  const serveurCourant = await readFile(cheminServeur, "utf8");
  const marqueurCourant =
    'var VERSION_SCHEMA_COMMERCIAL = Number.parseInt("2", 10);';
  const marqueurPrecedent =
    'var VERSION_SCHEMA_COMMERCIAL = Number.parseInt("1", 10);';
  if (!serveurCourant.includes(marqueurCourant)) {
    throw new Error(
      "Le binaire courant n’expose pas le marqueur de migration attendu.",
    );
  }
  const serveurPrecedent = Buffer.from(
    serveurCourant.replace(marqueurCourant, marqueurPrecedent),
  );
  await writeFile(cheminServeur, serveurPrecedent);

  const cheminManifeste = join(destination, "manifeste-beta.json");
  const manifeste = JSON.parse(
    await readFile(cheminManifeste, "utf8"),
  ) as ManifesteBeta;
  const precedent: ManifesteBeta = {
    ...manifeste,
    commit: "aaaaaaa",
    sourcePropre: true,
    versions: { ...manifeste.versions, commercial: 1 },
    fichiers: manifeste.fichiers.map((fichier) =>
      fichier.chemin === "server/serveur.mjs"
        ? {
            ...fichier,
            octets: serveurPrecedent.byteLength,
            sha256: sha256(serveurPrecedent),
          }
        : fichier,
    ),
  };
  await writeFile(
    cheminManifeste,
    `${JSON.stringify(precedent, null, 2)}\n`,
  );
  return precedent;
}

function lireVersionCommerciale(chemin: string): number {
  const database = new DatabaseSync(chemin, { readOnly: true });
  try {
    const resultat = database
      .prepare("PRAGMA user_version")
      .get() as { readonly user_version: number };
    return resultat.user_version;
  } finally {
    database.close();
  }
}

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

async function existe(chemin: string): Promise<boolean> {
  try {
    await stat(chemin);
    return true;
  } catch {
    return false;
  }
}

async function attendreSante(
  origine: string,
  processus: ChildProcess,
  lireSortie: () => string,
): Promise<Record<string, unknown>> {
  for (let tentative = 0; tentative < 100; tentative += 1) {
    if (processus.exitCode !== null) {
      throw new Error(
        `Le serveur de rollback s’est arrêté (${processus.exitCode}). ${lireSortie()}`,
      );
    }
    try {
      const reponse = await fetch(`${origine}/api/beta/sante`);
      if (reponse.ok) {
        return (await reponse.json()) as Record<string, unknown>;
      }
    } catch {
      // Le port n'est pas encore ouvert.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Le serveur de rollback ne démarre pas. ${lireSortie()}`);
}

async function demarrerPaquet(
  paquet: string,
  baseDeDonnees: string,
): Promise<{
  readonly origine: string;
  readonly sante: Record<string, unknown>;
  readonly arreter: () => Promise<void>;
}> {
  const port = await choisirPortLibre();
  const origine = `http://127.0.0.1:${port}`;
  const processus = spawn(process.execPath, ["server/serveur.mjs"], {
    cwd: paquet,
    env: {
      ...process.env,
      BETA_COMMERCIAL_MODE: "test",
      COMMERCIAL_DATABASE_PATH: baseDeDonnees,
      HOST: "127.0.0.1",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let sortie = "";
  processus.stdout?.on("data", (morceau) => {
    sortie += morceau.toString();
  });
  processus.stderr?.on("data", (morceau) => {
    sortie += morceau.toString();
  });
  const sante = await attendreSante(origine, processus, () => sortie);
  return {
    origine,
    sante,
    arreter: async () => {
      if (processus.exitCode !== null) {
        return;
      }
      processus.kill("SIGTERM");
      await new Promise<void>((resolve, reject) => {
        const temporisation = setTimeout(() => {
          processus.kill("SIGKILL");
          reject(
            new Error(
              `Le serveur de rollback ne s’est pas arrêté. ${sortie}`,
            ),
          );
        }, 5_000);
        processus.once("exit", () => {
          clearTimeout(temporisation);
          resolve();
        });
      });
    },
  };
}

async function ouvrirSession(
  origine: string,
  email: string,
): Promise<string> {
  const demande = await fetch(`${origine}/api/commercial/lien`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origine,
    },
    body: JSON.stringify({ email, intention: "restaurer" }),
  });
  if (demande.status !== 202) {
    throw new Error(
      `La demande de magic link a répondu ${demande.status} : ${await demande.text()}`,
    );
  }
  const { urlDeTest } = (await demande.json()) as {
    readonly urlDeTest: string;
  };
  const verification = await fetch(urlDeTest, { redirect: "manual" });
  const cookie = verification.headers.get("set-cookie")?.split(";")[0];
  if (cookie === undefined) {
    throw new Error("La session de rollback n’a pas produit de cookie.");
  }
  return cookie;
}

async function acheterAcces(
  origine: string,
  cookie: string,
): Promise<void> {
  const paiement = await fetch(`${origine}/api/commercial/paiement`, {
    method: "POST",
    headers: { Cookie: cookie },
  });
  const { transactionId } = (await paiement.json()) as {
    readonly transactionId: string;
  };
  const attribution = await fetch(
    `${origine}/api/commercial/paiement-test`,
    {
      method: "POST",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId, issue: "accepte" }),
    },
  );
  expect(attribution.ok).toBe(true);
}

async function sauvegarderBase(
  base: string,
  destination: string,
): Promise<string[]> {
  const sauvegardes: string[] = [];
  for (const suffixe of ["", "-wal", "-shm"]) {
    const source = `${base}${suffixe}`;
    if (await existe(source)) {
      const cible = `${destination}${suffixe}`;
      await cp(source, cible);
      sauvegardes.push(suffixe);
    }
  }
  return sauvegardes;
}

async function restaurerBase(
  source: string,
  base: string,
  suffixes: readonly string[],
): Promise<void> {
  for (const suffixe of ["", "-wal", "-shm"]) {
    await rm(`${base}${suffixe}`, { force: true });
  }
  for (const suffixe of suffixes) {
    await cp(`${source}${suffixe}`, `${base}${suffixe}`);
  }
}

test("restaure le paquet précédent, sa base et les parcours critiques avant remise en trafic", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const racine = await mkdtemp(join(tmpdir(), "lanternes-rollback-"));
  const paquetPrecedent = join(racine, "paquet-precedent");
  const paquetCourant = join(racine, "paquet-courant");
  const base = join(racine, "commercial.sqlite");
  const sauvegarde = join(racine, "commercial-sauvegarde.sqlite");
  let serveur: Awaited<ReturnType<typeof demarrerPaquet>> | undefined;

  try {
    const sourceCourante = resolve("dist-beta");
    const manifestePrecedent = await creerPaquetPrecedent(
      sourceCourante,
      paquetPrecedent,
    );
    const installation = spawnSync(
      "npm",
      ["ci", "--omit=dev", "--ignore-scripts"],
      {
        cwd: paquetPrecedent,
        encoding: "utf8",
        timeout: 60_000,
      },
    );
    expect(
      {
        statut: installation.status,
        erreur: installation.error?.message,
        sortie: `${installation.stdout}\n${installation.stderr}`,
      },
      "Le paquet précédent doit pouvoir réinstaller ses dépendances d’exécution.",
    ).toMatchObject({ statut: 0, erreur: undefined });
    expect(
      spawnSync(
        process.execPath,
        ["server/verifierPaquet.mjs"],
        {
          cwd: paquetPrecedent,
          encoding: "utf8",
        },
      ).status,
    ).toBe(0);
    await cp(paquetPrecedent, paquetCourant, { recursive: true });
    await cp(
      join(sourceCourante, "server/serveur.mjs"),
      join(paquetCourant, "server/serveur.mjs"),
    );
    const manifesteCourantSource = JSON.parse(
      await readFile(
        join(sourceCourante, "manifeste-beta.json"),
        "utf8",
      ),
    ) as ManifesteBeta;
    const manifesteCourant: ManifesteBeta = {
      ...manifesteCourantSource,
      commit: "bbbbbbb",
      sourcePropre: true,
    };
    await writeFile(
      join(paquetCourant, "manifeste-beta.json"),
      `${JSON.stringify(manifesteCourant, null, 2)}\n`,
    );
    expect(
      manifestePrecedent.fichiers.find(
        ({ chemin }) => chemin === "server/serveur.mjs",
      )?.sha256,
    ).not.toBe(
      manifesteCourant.fichiers.find(
        ({ chemin }) => chemin === "server/serveur.mjs",
      )?.sha256,
    );
    expect(manifestePrecedent.versions.commercial).toBe(1);
    expect(manifesteCourant.versions.commercial).toBe(2);
    expect(
      spawnSync(
        process.execPath,
        ["server/verifierPaquet.mjs"],
        {
          cwd: paquetCourant,
          encoding: "utf8",
        },
      ).status,
    ).toBe(0);

    serveur = await demarrerPaquet(paquetPrecedent, base);
    expect(serveur.sante).toMatchObject({ commit: "aaaaaaa" });
    const emailConserve = "veilleuse-rollback@example.test";
    const cookieInitial = await ouvrirSession(
      serveur.origine,
      emailConserve,
    );
    await acheterAcces(serveur.origine, cookieInitial);
    expect(lireVersionCommerciale(base)).toBe(1);
    const fichiersDeBase = await sauvegarderBase(base, sauvegarde);
    expect(fichiersDeBase).toEqual(
      expect.arrayContaining(["", "-wal", "-shm"]),
    );
    await serveur.arreter();
    serveur = undefined;

    serveur = await demarrerPaquet(paquetCourant, base);
    expect(serveur.sante).toMatchObject({ commit: "bbbbbbb" });
    const cookieCourant = await ouvrirSession(
      serveur.origine,
      "mutation-courante@example.test",
    );
    await acheterAcces(serveur.origine, cookieCourant);
    expect(lireVersionCommerciale(base)).toBe(2);
    await serveur.arreter();
    serveur = undefined;

    await restaurerBase(sauvegarde, base, fichiersDeBase);
    expect(lireVersionCommerciale(base)).toBe(1);
    serveur = await demarrerPaquet(paquetPrecedent, base);
    expect(serveur.sante).toMatchObject({
      statut: "prete",
      commit: "aaaaaaa",
      sourcePropre: true,
    });
    expect((await fetch(serveur.origine)).status).toBe(200);
    expect(
      (await fetch(`${serveur.origine}/api/commercial/acces`)).status,
    ).toBe(401);

    const cookieRestaure = await ouvrirSession(
      serveur.origine,
      emailConserve,
    );
    const acces = await fetch(
      `${serveur.origine}/api/commercial/acces`,
      { headers: { Cookie: cookieRestaure } },
    );
    expect(await acces.json()).toMatchObject({ premium: true });

    await page.goto(serveur.origine);
    await expect(
      page.getByRole("region", { name: "Cité-caravane" }),
    ).toBeVisible();
    await page
      .getByLabel("Choisir une sauvegarde à importer")
      .setInputFiles({
        name: "sauvegarde-connue-v1.json",
        mimeType: "application/json",
        buffer: sauvegardeConnue,
      });
    await expect(
      page
        .getByRole("region", { name: "Sauvegarde de Campagne" })
        .getByRole("status"),
    ).toContainText("Sauvegarde migrée et reprise");
  } finally {
    await serveur?.arreter();
    await rm(racine, { recursive: true, force: true });
  }
});
