import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { compilerCatalogue } from "../src/content/compiler";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (chemin: string) => readFileSync(resolve(racine, chemin), "utf8");
const catalogue = compilerCatalogue({
  evenements: lire("content/evenements/prologue.yaml"),
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
  },
  assetExiste: (chemin) =>
    existsSync(resolve(racine, "public", chemin.replace(/^\//, ""))),
  empreinteAsset: (chemin) =>
    createHash("sha256")
      .update(readFileSync(resolve(racine, "public", chemin.replace(/^\//, ""))))
      .digest("hex"),
});
const destination = resolve(racine, "src/content/catalogue.generated.ts");
const sortie = `// Ce fichier est généré par npm run content:compile.\nexport default ${JSON.stringify(catalogue, null, 2)} as const;\n`;

if (!existsSync(destination) || readFileSync(destination, "utf8") !== sortie) {
  writeFileSync(destination, sortie);
}

console.log(
  `${catalogue.evenements.length} Événement narratif compilé dans ${destination}`,
);
