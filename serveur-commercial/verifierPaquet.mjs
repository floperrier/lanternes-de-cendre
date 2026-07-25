import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function listerFichiers(racine) {
  const entrees = await readdir(racine, { withFileTypes: true });
  return (
    await Promise.all(
      entrees.map(async (entree) => {
        if (
          entree.isDirectory() &&
          (entree.name === "node_modules" || entree.name === "data")
        ) {
          return [];
        }
        const chemin = join(racine, entree.name);
        return entree.isDirectory()
          ? listerFichiers(chemin)
          : [chemin];
      }),
    )
  ).flat();
}

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifeste = JSON.parse(
  await readFile(join(racine, "manifeste-beta.json"), "utf8"),
);
const attendus = new Set(manifeste.fichiers.map(({ chemin }) => chemin));

for (const fichier of manifeste.fichiers) {
  const contenu = await readFile(resolve(racine, fichier.chemin));
  const empreinte = createHash("sha256").update(contenu).digest("hex");
  if (
    contenu.byteLength !== fichier.octets ||
    empreinte !== fichier.sha256
  ) {
    throw new Error(`empreinte invalide: ${fichier.chemin}`);
  }
}

const presents = (await listerFichiers(racine))
  .map((chemin) => relative(racine, chemin).replaceAll("\\", "/"))
  .filter((chemin) => chemin !== "manifeste-beta.json");
const inattendus = presents.filter((chemin) => !attendus.has(chemin));
const absents = [...attendus].filter(
  (chemin) => !presents.includes(chemin),
);
if (inattendus.length > 0 || absents.length > 0) {
  throw new Error(
    `inventaire divergent: inattendus=${inattendus.join(",")} absents=${absents.join(",")}`,
  );
}
console.log("Empreintes de la bêta commerciale conformes.");
