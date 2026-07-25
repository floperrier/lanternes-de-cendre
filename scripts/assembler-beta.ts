import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  join,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";

import { VERSION_CONTENU_COURANTE } from "../src/content/types";
import { VARIANTES_FINALES_MAJEURES } from "../src/simulation/finale";
import {
  VERSION_ALEATOIRE_COURANTE,
  VERSION_EMPREINTE_DETERMINISTE,
  VERSION_SIMULATION_COURANTE,
} from "../src/simulation/versions";
import { VERSION_SAUVEGARDE_COURANTE } from "../src/sauvegarde/version";
import { VERSION_SCHEMA_COMMERCIAL } from "../serveur-commercial/stockage";

interface OptionsDAssemblage {
  readonly racine: string;
  readonly sortie: string;
  readonly commit: string;
  readonly sourcePropre?: boolean;
}

interface EntreeDeFichier {
  readonly chemin: string;
  readonly octets: number;
  readonly sha256: string;
}

interface ManifesteDeBeta {
  readonly fichiers: readonly EntreeDeFichier[];
}

interface PaquetNpm {
  readonly version?: string;
  readonly license?: string;
  readonly dev?: boolean;
}

interface PackageLock {
  readonly packages: Readonly<Record<string, PaquetNpm>>;
}

const EXTENSIONS_TEXTUELLES = new Set([
  ".html",
  ".md",
]);
const PLACEHOLDER_BLOQUANT =
  /\b(?:TODO|FIXME|placeholder|lorem ipsum|à compléter|a completer)\b/i;

function sha256(contenu: string | Buffer): string {
  return createHash("sha256").update(contenu).digest("hex");
}

function extension(chemin: string): string {
  const nom = chemin.split("/").at(-1) ?? "";
  const point = nom.lastIndexOf(".");
  return point < 0 ? "" : nom.slice(point).toLocaleLowerCase("en-US");
}

async function listerFichiers(racine: string): Promise<string[]> {
  const entrees = await readdir(racine, { withFileTypes: true });
  const fichiers = await Promise.all(
    entrees.map(async (entree) => {
      const chemin = join(racine, entree.name);
      return entree.isDirectory()
        ? listerFichiers(chemin)
        : [chemin];
    }),
  );
  return fichiers.flat();
}

function nomDuPaquet(chemin: string): string {
  const morceaux = chemin.slice("node_modules/".length).split("/");
  return morceaux[0]?.startsWith("@")
    ? `${morceaux[0]}/${morceaux[1]}`
    : morceaux[0] ?? chemin;
}

async function verifierRapport(
  chemin: string,
  conforme: (rapport: Record<string, unknown>) => boolean,
): Promise<void> {
  const rapport = JSON.parse(await readFile(chemin, "utf8")) as Record<
    string,
    unknown
  >;
  if (!conforme(rapport)) {
    throw new Error(`rapport non conforme: ${chemin}`);
  }
}

async function verifierSources(
  racine: string,
  packageJson: {
    readonly scripts?: Readonly<Record<string, string>>;
  },
): Promise<void> {
  const scripts = packageJson.scripts ?? {};
  for (const commande of [
    "check",
    "equilibrage:nightly",
    "beta:verifier",
  ]) {
    if (typeof scripts[commande] !== "string") {
      throw new Error(`automatisation absente: ${commande}`);
    }
  }
  await verifierRapport(
    join(racine, "artifacts/budgets/campagne.json"),
    ({ statut }) => statut === "conforme",
  );
  await verifierRapport(
    join(racine, "artifacts/budgets/performance.json"),
    ({ statut }) => statut === "conforme",
  );
  await verifierRapport(
    join(racine, "artifacts/equilibrage/standard.json"),
    ({ referenceEquilibree }) => referenceEquilibree === true,
  );
}

async function inventerPaquet(
  sortie: string,
): Promise<EntreeDeFichier[]> {
  const fichiers = await listerFichiers(sortie);
  return Promise.all(
    fichiers
      .sort((gauche, droite) => gauche.localeCompare(droite))
      .map(async (chemin) => {
        const contenu = await readFile(chemin);
        const cheminRelatif = relative(sortie, chemin).replaceAll("\\", "/");
        if (
          cheminRelatif !== "server/serveur.mjs" &&
          EXTENSIONS_TEXTUELLES.has(extension(cheminRelatif)) &&
          PLACEHOLDER_BLOQUANT.test(contenu.toString("utf8"))
        ) {
          throw new Error(
            `placeholder bloquant dans ${cheminRelatif}`,
          );
        }
        return {
          chemin: cheminRelatif,
          octets: contenu.byteLength,
          sha256: sha256(contenu),
        };
      }),
  );
}

export async function assemblerBeta({
  racine,
  sortie,
  commit,
  sourcePropre = true,
}: OptionsDAssemblage): Promise<{ readonly statut: "conforme" }> {
  const racineResolue = resolve(racine);
  const sortieResolue = resolve(sortie);
  const positionSortie = relative(racineResolue, sortieResolue);
  if (
    positionSortie.length === 0 ||
    positionSortie === ".." ||
    positionSortie.startsWith("../") ||
    positionSortie.startsWith(`..\\`) ||
    !positionSortie.split(/[\\/]/).includes("dist-beta")
  ) {
    throw new Error("répertoire de sortie de bêta non sûr");
  }
  const packageJson = JSON.parse(
    await readFile(join(racineResolue, "package.json"), "utf8"),
  ) as {
    readonly name: string;
    readonly version: string;
    readonly type?: string;
    readonly engines?: Readonly<Record<string, string>>;
    readonly dependencies?: Readonly<Record<string, string>>;
    readonly scripts?: Readonly<Record<string, string>>;
  };
  const packageLock = JSON.parse(
    await readFile(join(racineResolue, "package-lock.json"), "utf8"),
  ) as PackageLock;
  await verifierSources(racineResolue, packageJson);
  if (!/^[a-f0-9]{6,64}$/i.test(commit)) {
    throw new Error("commit de bêta invalide");
  }

  await rm(sortieResolue, { recursive: true, force: true });
  await Promise.all([
    mkdir(join(sortieResolue, "docs"), { recursive: true }),
    mkdir(join(sortieResolue, "server"), { recursive: true }),
  ]);
  await Promise.all([
    cp(join(racineResolue, "dist"), join(sortieResolue, "public"), {
      recursive: true,
    }),
    cp(
      join(racineResolue, "dist-server"),
      join(sortieResolue, "server"),
      { recursive: true },
    ),
    cp(
      join(racineResolue, "serveur-commercial/assets"),
      join(sortieResolue, "server/assets"),
      { recursive: true },
    ),
    cp(
      join(racineResolue, "serveur-commercial/verifierPaquet.mjs"),
      join(sortieResolue, "server/verifierPaquet.mjs"),
    ),
    cp(
      join(racineResolue, "docs/beta-commerciale.md"),
      join(sortieResolue, "docs/beta-commerciale.md"),
    ),
  ]);
  await mkdir(join(sortieResolue, "preuves"), { recursive: true });
  await Promise.all([
    cp(
      join(racineResolue, "artifacts/budgets/campagne.json"),
      join(sortieResolue, "preuves/budgets-campagne.json"),
    ),
    cp(
      join(racineResolue, "artifacts/budgets/performance.json"),
      join(sortieResolue, "preuves/performance.json"),
    ),
    cp(
      join(racineResolue, "artifacts/equilibrage/standard.json"),
      join(sortieResolue, "preuves/equilibrage-standard.json"),
    ),
  ]);

  const dependances = Object.entries(packageLock.packages)
    .filter(
      ([chemin, paquet]) =>
        chemin.startsWith("node_modules/") && paquet.dev !== true,
    )
    .map(([chemin, paquet]) => {
      if (
        typeof paquet.version !== "string" ||
        typeof paquet.license !== "string"
      ) {
        throw new Error(`licence absente: ${chemin}`);
      }
      return {
        nom: nomDuPaquet(chemin),
        version: paquet.version,
        licence: paquet.license,
      };
    })
    .sort((gauche, droite) => gauche.nom.localeCompare(droite.nom));
  await writeFile(
    join(sortieResolue, "licences-tierces.json"),
    `${JSON.stringify(
      {
        format: "lanternes-de-cendre.licences-tierces",
        version: 1,
        dependances,
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    join(sortieResolue, "package.json"),
    `${JSON.stringify(
      {
        name: packageJson.name,
        version: packageJson.version,
        private: true,
        type: "module",
        engines: packageJson.engines,
        scripts: {
          start: "node server/serveur.mjs",
          "beta:verifier": "node server/verifierPaquet.mjs",
        },
        dependencies: packageJson.dependencies,
      },
      null,
      2,
    )}\n`,
  );
  await cp(
    join(racineResolue, "package-lock.json"),
    join(sortieResolue, "package-lock.json"),
  );

  const fichiers = await inventerPaquet(sortieResolue);
  const manifeste = {
    format: "lanternes-de-cendre.beta-commerciale",
    version: 1,
    versionProduit: packageJson.version,
    commit,
    sourcePropre,
    versions: {
      sauvegarde: VERSION_SAUVEGARDE_COURANTE,
      simulation: VERSION_SIMULATION_COURANTE,
      contenu: VERSION_CONTENU_COURANTE,
      aleatoire: VERSION_ALEATOIRE_COURANTE,
      empreinte: VERSION_EMPREINTE_DETERMINISTE,
      commercial: VERSION_SCHEMA_COMMERCIAL,
    },
    campagne: {
      dureeCibleHeures: [10, 12],
      variantesFinales: VARIANTES_FINALES_MAJEURES,
    },
    automatisations: {
      qualite: "npm run check",
      nocturne: "npm run equilibrage:nightly",
      paquet: "npm run beta:verifier",
    },
    procedures: {
      support: "docs/beta-commerciale.md#support",
      retourArriere: "docs/beta-commerciale.md#retour-arrière",
    },
    fichiers,
  };
  await writeFile(
    join(sortieResolue, "manifeste-beta.json"),
    `${JSON.stringify(manifeste, null, 2)}\n`,
  );
  return { statut: "conforme" };
}

export async function verifierPaquetBeta(
  sortie: string,
): Promise<{ readonly statut: "conforme" }> {
  const sortieResolue = resolve(sortie);
  const manifeste = JSON.parse(
    await readFile(join(sortieResolue, "manifeste-beta.json"), "utf8"),
  ) as ManifesteDeBeta;
  const attendus = new Set(
    manifeste.fichiers.map(({ chemin }) => chemin),
  );
  for (const fichier of manifeste.fichiers) {
    const chemin = resolve(sortieResolue, fichier.chemin);
    const position = relative(sortieResolue, chemin);
    if (
      position === ".." ||
      position.startsWith("../") ||
      position.startsWith(`..\\`)
    ) {
      throw new Error(`chemin hors paquet: ${fichier.chemin}`);
    }
    const contenu = await readFile(chemin);
    if (
      contenu.byteLength !== fichier.octets ||
      sha256(contenu) !== fichier.sha256
    ) {
      throw new Error(`empreinte invalide: ${fichier.chemin}`);
    }
  }
  const presents = (await listerFichiers(sortieResolue))
    .map((chemin) => relative(sortieResolue, chemin).replaceAll("\\", "/"))
    .filter((chemin) => chemin !== "manifeste-beta.json");
  const inattendus = presents.filter((chemin) => !attendus.has(chemin));
  const absents = [...attendus].filter(
    (chemin) => !presents.includes(chemin),
  );
  if (inattendus.length > 0 || absents.length > 0) {
    throw new Error(
      `inventaire de bêta divergent: inattendus=${inattendus.join(",")} absents=${absents.join(",")}`,
    );
  }
  return { statut: "conforme" };
}

async function commande(): Promise<void> {
  const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const commit =
    process.env.GIT_COMMIT ??
    process.env.GITHUB_SHA ??
    execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: racine,
      encoding: "utf8",
    }).trim();
  const sourcePropre =
    execFileSync("git", ["status", "--porcelain"], {
      cwd: racine,
      encoding: "utf8",
    }).trim().length === 0;
  if (process.env.CI && !sourcePropre) {
    throw new Error(
      "La bêta CI exige une source Git propre et entièrement identifiée.",
    );
  }
  if (process.argv.includes("--verifier")) {
    await verifierPaquetBeta(resolve(racine, "dist-beta"));
    console.log("Empreintes de la bêta commerciale conformes.");
    return;
  }
  await assemblerBeta({
    racine,
    sortie: resolve(racine, "dist-beta"),
    commit,
    sourcePropre,
  });
  console.log("Bêta commerciale assemblée dans dist-beta.");
}

if (
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await commande();
}
