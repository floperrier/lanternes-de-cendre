import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import inventaire from "../serveur-commercial/frontierePremium.generated";

const dossierDeDistribution = fileURLToPath(
  new URL("../dist/", import.meta.url),
);
const extensionsTextuelles = new Set([
  ".css",
  ".html",
  ".js",
  ".map",
]);

function extensionDe(chemin: string): string {
  const index = chemin.lastIndexOf(".");
  return index === -1 ? "" : chemin.slice(index);
}

async function listerFichiers(dossier: string): Promise<string[]> {
  const entrees = await readdir(dossier, { withFileTypes: true });
  return (
    await Promise.all(
      entrees.map((entree) => {
        const chemin = join(dossier, entree.name);
        return entree.isDirectory() ? listerFichiers(chemin) : [chemin];
      }),
    )
  ).flat();
}

const fichiersPublies = await listerFichiers(dossierDeDistribution);
const fichiersTextuels = fichiersPublies.filter((fichier) =>
  extensionsTextuelles.has(extensionDe(fichier)),
);
const contenus = await Promise.all(
  fichiersTextuels.map(async (fichier) => ({
    chemin: relative(dossierDeDistribution, fichier),
    contenu: await readFile(fichier, "utf8"),
  })),
);

const fragmentsTrouves = inventaire.fragments.flatMap((fragment) => {
  const fichiers = contenus
    .filter(({ contenu }) => contenu.includes(fragment))
    .map(({ chemin }) => chemin);
  return fichiers.length === 0 ? [] : [{ fragment, fichiers }];
});

if (fragmentsTrouves.length > 0) {
  throw new Error(
    [
      "La distribution gratuite contient du contenu premium :",
      ...fragmentsTrouves.map(
        ({ fragment, fichiers }) =>
          `- ${JSON.stringify(fragment)} dans ${fichiers.join(", ")}`,
      ),
    ].join("\n"),
  );
}

const assetsPublies = fichiersPublies.flatMap((fichier) => {
  const nomPublie = basename(fichier);
  const nomsProteges = inventaire.nomsDAssets.filter((nomProtege) => {
    const indexExtension = nomProtege.lastIndexOf(".");
    const baseProtegee =
      indexExtension === -1
        ? nomProtege
        : nomProtege.slice(0, indexExtension);
    return (
      nomPublie.includes(nomProtege) ||
      nomPublie.includes(baseProtegee)
    );
  });
  return nomsProteges.length === 0
    ? []
    : [
        `${relative(dossierDeDistribution, fichier)} (${nomsProteges.join(", ")})`,
      ];
});

if (assetsPublies.length > 0) {
  throw new Error(
    `La distribution gratuite publie des illustrations premium : ${assetsPublies.join(", ")}`,
  );
}

console.log(
  `${inventaire.fragments.length} fragments et ${inventaire.nomsDAssets.length} assets premium sont absents de la distribution gratuite.`,
);
