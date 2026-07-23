import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const dossier = new URL("../dist/assets/", import.meta.url);
const fichiers = (await readdir(dossier)).filter((fichier) =>
  fichier.endsWith(".js"),
);
const javascript = (
  await Promise.all(
    fichiers.map((fichier) =>
      readFile(join(dossier.pathname, fichier), "utf8"),
    ),
  )
).join("\n");
const fragmentsProteges = [
  "Relais des Vannes",
  "Sluice Relay",
  "vannes-haut-puits-0",
  "Ornières profondes",
  "Deep ruts",
];
const fragmentsTrouves = fragmentsProteges.filter((fragment) =>
  javascript.includes(fragment),
);

if (fragmentsTrouves.length > 0) {
  throw new Error(
    `Le bundle gratuit contient du contenu premium : ${fragmentsTrouves.join(", ")}`,
  );
}

console.log("Le bundle gratuit ne contient pas le catalogue premium.");
