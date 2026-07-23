import { relative } from "node:path";

import {
  lireCatalogue,
  RACINE_PROJET,
  trouverSprite,
} from "./catalogue";
import {
  cheminApercu,
  genererBrouillon,
  importerPlanche,
  publierSprite,
  traiterPlancheExistante,
  verifierCataloguePublie,
} from "./pipeline";

function exigerId(id: string | undefined, commande: string): string {
  if (id === undefined || id.trim() === "") {
    throw new Error(`usage : npm run sprites:${commande} -- <id>`);
  }
  return id;
}

async function main(): Promise<void> {
  const [commande, idSource, ...options] = process.argv.slice(2);
  const catalogue = await lireCatalogue();

  switch (commande) {
    case "draft": {
      const id = exigerId(idSource, "draft");
      const resultat = await genererBrouillon(
        RACINE_PROJET,
        trouverSprite(catalogue, id),
        { force: options.includes("--force") },
      );
      console.log(
        resultat.cacheHit
          ? `Génération réutilisée depuis le cache : ${id}`
          : `Nouvelle génération créée : ${id}`,
      );
      console.log(`Aperçu : ${relative(RACINE_PROJET, resultat.preview)}`);
      break;
    }
    case "process": {
      const id = exigerId(idSource, "process");
      const resultat = await traiterPlancheExistante(
        RACINE_PROJET,
        trouverSprite(catalogue, id),
      );
      console.log(`Planche traitée : ${id}`);
      console.log(`Aperçu : ${relative(RACINE_PROJET, resultat.preview)}`);
      break;
    }
    case "ingest": {
      const id = exigerId(idSource, "ingest");
      const source = options.find((option) => !option.startsWith("--"));
      if (source === undefined) {
        throw new Error(
          "usage : npm run sprites:ingest -- <id> <image> [--seed-from-frame-1]",
        );
      }
      const resultat = await importerPlanche(
        RACINE_PROJET,
        trouverSprite(catalogue, id),
        source,
        { seedFromFrame1: options.includes("--seed-from-frame-1") },
      );
      console.log(`Planche importée : ${id}`);
      console.log(`Aperçu : ${relative(RACINE_PROJET, resultat.preview)}`);
      break;
    }
    case "preview": {
      const id = exigerId(idSource, "preview");
      const sprite = trouverSprite(catalogue, id);
      await traiterPlancheExistante(RACINE_PROJET, sprite);
      console.log(
        `Aperçu : ${relative(RACINE_PROJET, cheminApercu(RACINE_PROJET, sprite))}`,
      );
      break;
    }
    case "publish": {
      const id = exigerId(idSource, "publish");
      await publierSprite(RACINE_PROJET, trouverSprite(catalogue, id));
      console.log(`Sprite publié : ${id}`);
      break;
    }
    case "check": {
      if (idSource === undefined) {
        await verifierCataloguePublie(RACINE_PROJET, catalogue);
        console.log(`${catalogue.length} sprite(s) vérifié(s)`);
      } else {
        const sprite = trouverSprite(catalogue, idSource);
        await verifierCataloguePublie(RACINE_PROJET, [sprite]);
        console.log(`Sprite vérifié : ${idSource}`);
      }
      break;
    }
    default:
      throw new Error(
        "commande attendue : draft, ingest, process, preview, publish ou check",
      );
  }
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
