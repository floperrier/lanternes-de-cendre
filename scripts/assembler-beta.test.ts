import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  assemblerBeta,
  verifierPaquetBeta,
} from "./assembler-beta";

const repertoiresTemporaires: string[] = [];

async function creerFixture(): Promise<{
  readonly racine: string;
  readonly sortie: string;
}> {
  const racine = await mkdtemp(join(tmpdir(), "lanternes-assemblage-"));
  repertoiresTemporaires.push(racine);
  await mkdir(join(racine, "dist/assets"), { recursive: true });
  await mkdir(join(racine, "dist/.vite"), { recursive: true });
  await mkdir(join(racine, "dist-server"), { recursive: true });
  await mkdir(join(racine, "serveur-commercial/assets"), {
    recursive: true,
  });
  await mkdir(join(racine, "artifacts/budgets"), {
    recursive: true,
  });
  await mkdir(join(racine, "artifacts/equilibrage"), {
    recursive: true,
  });
  await mkdir(join(racine, "docs"), { recursive: true });
  await writeFile(
    join(racine, "dist/index.html"),
    '<script type="module" src="/assets/app-abc123.js"></script>',
  );
  await writeFile(
    join(racine, "dist/assets/app-abc123.js"),
    "console.log('beta');",
  );
  await writeFile(
    join(racine, "dist/.vite/manifest.json"),
    JSON.stringify({
      "src/main.tsx": {
        file: "assets/app-abc123.js",
        isEntry: true,
      },
    }),
  );
  await writeFile(
    join(racine, "dist-server/serveur.mjs"),
    "export const serveur = true;",
  );
  await writeFile(
    join(racine, "serveur-commercial/assets/premium.webp"),
    "premium",
  );
  await writeFile(
    join(racine, "serveur-commercial/verifierPaquet.mjs"),
    await readFile(
      new URL(
        "../serveur-commercial/verifierPaquet.mjs",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await writeFile(
    join(racine, "artifacts/budgets/campagne.json"),
    '{"statut":"conforme"}',
  );
  await writeFile(
    join(racine, "artifacts/budgets/performance.json"),
    '{"statut":"conforme"}',
  );
  await writeFile(
    join(racine, "artifacts/equilibrage/standard.json"),
    '{"referenceEquilibree":true}',
  );
  await writeFile(
    join(racine, "docs/beta-commerciale.md"),
    "# Bêta commerciale\n\n## Support\n\nProcédure.\n\n## Retour arrière\n\nProcédure.",
  );
  await writeFile(
    join(racine, "package.json"),
    JSON.stringify({
      name: "lanternes-de-cendre",
      version: "0.1.0",
      type: "module",
      engines: { node: ">=22.12.0" },
      dependencies: { react: "19.2.7" },
      scripts: {
        check: "qualite",
        "equilibrage:nightly": "nocturne",
        "beta:verifier": "beta",
      },
    }),
  );
  await writeFile(
    join(racine, "package-lock.json"),
    JSON.stringify({
      name: "lanternes-de-cendre",
      version: "0.1.0",
      lockfileVersion: 3,
      packages: {
        "": {
          name: "lanternes-de-cendre",
          version: "0.1.0",
          dependencies: { react: "19.2.7" },
        },
        "node_modules/react": {
          version: "19.2.7",
          license: "MIT",
        },
      },
    }),
  );
  return { racine, sortie: join(racine, "dist-beta") };
}

afterEach(async () => {
  await Promise.all(
    repertoiresTemporaires.splice(0).map((repertoire) =>
      rm(repertoire, { recursive: true, force: true }),
    ),
  );
});

describe("assemblage de la bêta commerciale", () => {
  it("produit un paquet autonome inventorié avec versions, licences et neuf fins", async () => {
    const fixture = await creerFixture();
    const resultat = await assemblerBeta({
      ...fixture,
      commit: "abc123",
    });
    const manifeste = JSON.parse(
      await readFile(
        join(fixture.sortie, "manifeste-beta.json"),
        "utf8",
      ),
    ) as {
      readonly commit: string;
      readonly sourcePropre: boolean;
      readonly fichiers: readonly {
        readonly chemin: string;
        readonly sha256: string;
      }[];
      readonly campagne: {
        readonly dureeCibleHeures: readonly [number, number];
        readonly variantesFinales: readonly string[];
      };
      readonly versions: {
        readonly commercial: number;
      };
      readonly procedures: {
        readonly support: string;
        readonly retourArriere: string;
      };
    };
    const licences = JSON.parse(
      await readFile(
        join(fixture.sortie, "licences-tierces.json"),
        "utf8",
      ),
    ) as { readonly dependances: readonly unknown[] };

    expect(resultat.statut).toBe("conforme");
    expect(manifeste.commit).toBe("abc123");
    expect(manifeste.sourcePropre).toBe(true);
    expect(manifeste.campagne.dureeCibleHeures).toEqual([10, 12]);
    expect(manifeste.campagne.variantesFinales).toHaveLength(9);
    expect(manifeste.versions.commercial).toBe(2);
    expect(manifeste.fichiers.map(({ chemin }) => chemin)).toEqual(
      expect.arrayContaining([
        "public/index.html",
        "public/assets/app-abc123.js",
        "server/serveur.mjs",
        "server/assets/premium.webp",
      ]),
    );
    expect(
      manifeste.fichiers.every(({ sha256 }) =>
        /^[a-f0-9]{64}$/.test(sha256),
      ),
    ).toBe(true);
    expect(licences.dependances).toHaveLength(1);
    expect(manifeste.procedures).toEqual({
      support: "docs/beta-commerciale.md#support",
      retourArriere: "docs/beta-commerciale.md#retour-arrière",
    });
    await expect(verifierPaquetBeta(fixture.sortie)).resolves.toEqual({
      statut: "conforme",
    });
    expect(
      execFileSync(
        process.execPath,
        [join(fixture.sortie, "server/verifierPaquet.mjs")],
        { cwd: fixture.sortie, encoding: "utf8" },
      ),
    ).toContain("conformes");
  });

  it("bloque un paquet qui contient un placeholder", async () => {
    const fixture = await creerFixture();
    await writeFile(
      join(fixture.racine, "dist/index.html"),
      "<main>TODO remplacer ce placeholder</main>",
    );

    await expect(
      assemblerBeta({ ...fixture, commit: "abc123" }),
    ).rejects.toThrow("placeholder bloquant");
  });

  it("détecte toute altération avant un déploiement", async () => {
    const fixture = await creerFixture();
    await assemblerBeta({ ...fixture, commit: "abc123" });
    await writeFile(
      join(fixture.sortie, "public/assets/app-abc123.js"),
      "console.log('paquet altéré');",
    );

    await expect(verifierPaquetBeta(fixture.sortie)).rejects.toThrow(
      "empreinte invalide",
    );
  });
});
