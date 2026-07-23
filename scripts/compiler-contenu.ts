import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument, stringify } from "yaml";

import { compilerCatalogue } from "../src/content/compiler";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (chemin: string) => readFileSync(resolve(racine, chemin), "utf8");
const fusionnerEvenements = (chemins: readonly string[]): string => {
  const evenements = chemins.flatMap((chemin) => {
    const document = parseDocument(lire(chemin), {
      schema: "core",
      uniqueKeys: true,
    });
    if (document.errors.length > 0) {
      throw document.errors[0];
    }
    const source = document.toJS() as {
      readonly version?: unknown;
      readonly evenements?: unknown;
    };
    if (source.version !== 1 || !Array.isArray(source.evenements)) {
      throw new Error(`${chemin} — catalogue d’Événements invalide`);
    }
    return source.evenements;
  });
  return stringify({ version: 1, evenements });
};
const catalogue = compilerCatalogue({
  evenements: fusionnerEvenements([
    "content/evenements/prologue.yaml",
    "content/evenements/veille-basse.yaml",
  ]),
  infrastructure: lire("content/infrastructure.yaml"),
  conseils: lire("content/conseils/premiere-veille.yaml"),
  references: lire("content/references.yaml"),
  traductions: {
    fr: lire("content/locales/fr.yaml"),
    en: lire("content/locales/en.yaml"),
  },
  assets: lire("content/assets/manifest.yaml"),
  provenances: {
    "docs/assets/cite-caravane.provenance.json": lire(
      "docs/assets/cite-caravane.provenance.json",
    ),
    "docs/assets/prologue-reponse-du-phare.provenance.json": lire(
      "docs/assets/prologue-reponse-du-phare.provenance.json",
    ),
    "docs/assets/prologue-filtres-de-la-veille.provenance.json": lire(
      "docs/assets/prologue-filtres-de-la-veille.provenance.json",
    ),
    "docs/assets/prologue-ilyana-au-clapet.provenance.json": lire(
      "docs/assets/prologue-ilyana-au-clapet.provenance.json",
    ),
    "docs/assets/bassins-haut-puits.provenance.json": lire(
      "docs/assets/bassins-haut-puits.provenance.json",
    ),
    "docs/assets/veille-basse-cohorte.provenance.json": lire(
      "docs/assets/veille-basse-cohorte.provenance.json",
    ),
    "docs/assets/veille-basse-porte.provenance.json": lire(
      "docs/assets/veille-basse-porte.provenance.json",
    ),
    "docs/assets/veille-basse-archives.provenance.json": lire(
      "docs/assets/veille-basse-archives.provenance.json",
    ),
    "docs/assets/veille-basse-maelys.provenance.json": lire(
      "docs/assets/veille-basse-maelys.provenance.json",
    ),
  },
  assetExiste: (chemin) =>
    existsSync(resolve(racine, "public", chemin.replace(/^\//, ""))),
  empreinteAsset: (chemin) =>
    createHash("sha256")
      .update(readFileSync(resolve(racine, "public", chemin.replace(/^\//, ""))))
      .digest("hex"),
  tailleAsset: (chemin) =>
    statSync(resolve(racine, "public", chemin.replace(/^\//, ""))).size,
});
const destination = resolve(racine, "src/content/catalogue.generated.ts");
const sortie = `// Ce fichier est généré par npm run content:compile.\nexport default ${JSON.stringify(catalogue, null, 2)} as const;\n`;

if (!existsSync(destination) || readFileSync(destination, "utf8") !== sortie) {
  writeFileSync(destination, sortie);
}

console.log(
  `${catalogue.evenements.length} Événement narratif et ${catalogue.conseils.length} Conseil compilés dans ${destination}`,
);
