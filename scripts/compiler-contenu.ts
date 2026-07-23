import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument, stringify } from "yaml";

import { compilerCatalogue } from "../src/content/compiler";
import type {
  CatalogueDEvenements,
  EvenementDuCatalogue,
  Langue,
} from "../src/content/types";
import {
  LIEUX_PREMIUM,
  NOMS_D_ASSETS_PREMIUM,
  TRONCONS_PREMIUM,
} from "../serveur-commercial/donneesPremium";
import { PRESENTATIONS_PREMIUM } from "../serveur-commercial/presentationsPremium";

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

const CHEMINS_D_EVENEMENTS_DE_BASE = [
  "content/evenements/prologue.yaml",
] as const;
const CHEMINS_D_EVENEMENTS_PREMIUM = [
  "content/evenements/veille-basse.yaml",
  "content/evenements/haut-puits.yaml",
  "content/evenements/nacelles.yaml",
  "content/evenements/deversoir.yaml",
  "content/evenements/trame-fer.yaml",
] as const;
const provenances = {
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
  "docs/assets/haut-puits-vanniers.provenance.json": lire(
    "docs/assets/haut-puits-vanniers.provenance.json",
  ),
  "docs/assets/haut-puits-decanteur.provenance.json": lire(
    "docs/assets/haut-puits-decanteur.provenance.json",
  ),
  "docs/assets/haut-puits-ilyana.provenance.json": lire(
    "docs/assets/haut-puits-ilyana.provenance.json",
  ),
  "docs/assets/nacelles-deux-rives.provenance.json": lire(
    "docs/assets/nacelles-deux-rives.provenance.json",
  ),
  "docs/assets/nacelles-frein.provenance.json": lire(
    "docs/assets/nacelles-frein.provenance.json",
  ),
  "docs/assets/nacelles-trace.provenance.json": lire(
    "docs/assets/nacelles-trace.provenance.json",
  ),
  "docs/assets/nacelles-compagnes.provenance.json": lire(
    "docs/assets/nacelles-compagnes.provenance.json",
  ),
  "docs/assets/deversoir-ligne-zero.provenance.json": lire(
    "docs/assets/deversoir-ligne-zero.provenance.json",
  ),
  "docs/assets/deversoir-conseil.provenance.json": lire(
    "docs/assets/deversoir-conseil.provenance.json",
  ),
  "docs/assets/deversoir-chassis.provenance.json": lire(
    "docs/assets/deversoir-chassis.provenance.json",
  ),
  "docs/assets/deversoir-passage.provenance.json": lire(
    "docs/assets/deversoir-passage.provenance.json",
  ),
  "docs/assets/trame-barriere-permis.provenance.json": lire(
    "docs/assets/trame-barriere-permis.provenance.json",
  ),
  "docs/assets/trame-barriere-taxe.provenance.json": lire(
    "docs/assets/trame-barriere-taxe.provenance.json",
  ),
  "docs/assets/trame-piece-regulation.provenance.json": lire(
    "docs/assets/trame-piece-regulation.provenance.json",
  ),
  "docs/assets/trame-eau-machines.provenance.json": lire(
    "docs/assets/trame-eau-machines.provenance.json",
  ),
  "docs/assets/trame-attelage-federe.provenance.json": lire(
    "docs/assets/trame-attelage-federe.provenance.json",
  ),
};

function cheminPhysiqueAsset(chemin: string): string {
  return chemin.startsWith("/api/commercial/assets/")
    ? `serveur-commercial/assets/${basename(chemin)}`
    : `public${chemin}`;
}

const catalogueComplet = compilerCatalogue({
  evenements: fusionnerEvenements([
    ...CHEMINS_D_EVENEMENTS_DE_BASE,
    ...CHEMINS_D_EVENEMENTS_PREMIUM,
  ]),
  infrastructure: lire("content/infrastructure.yaml"),
  conseils: lire("content/conseils/premiere-veille.yaml"),
  references: lire("content/references.yaml"),
  traductions: {
    fr: lire("content/locales/fr.yaml"),
    en: lire("content/locales/en.yaml"),
  },
  assets: lire("content/assets/manifest.yaml"),
  provenances,
  cheminDeProvenanceAsset: cheminPhysiqueAsset,
  assetExiste: (chemin) =>
    existsSync(resolve(racine, cheminPhysiqueAsset(chemin))),
  empreinteAsset: (chemin) =>
    createHash("sha256")
      .update(readFileSync(resolve(racine, cheminPhysiqueAsset(chemin))))
      .digest("hex"),
  tailleAsset: (chemin) =>
    statSync(resolve(racine, cheminPhysiqueAsset(chemin))).size,
});

const idsDeBase = new Set(
  (
    parseDocument(fusionnerEvenements(CHEMINS_D_EVENEMENTS_DE_BASE)).toJS() as {
      readonly evenements: readonly { readonly id: string }[];
    }
  ).evenements.map(({ id }) => id),
);
const evenementsDeBase = catalogueComplet.evenements.filter(({ id }) =>
  idsDeBase.has(id),
);
const evenementsPremium = catalogueComplet.evenements.filter(
  ({ id }) => !idsDeBase.has(id),
);
const conseilsDeBase = catalogueComplet.conseils.filter(
  ({ id }) => id === "conseil.premiere-veille",
);
const conseilsPremium = catalogueComplet.conseils.filter(
  ({ id }) => id !== "conseil.premiere-veille",
);

function idsDeFaits(evenements: readonly EvenementDuCatalogue[]): Set<string> {
  return new Set(
    evenements.flatMap((evenement) =>
      evenement.choix.flatMap((choix) =>
        choix.faitsProduits.map(({ id }) => id),
      ),
    ),
  );
}

function acteurs(evenements: readonly EvenementDuCatalogue[]): Set<string> {
  return new Set(evenements.flatMap((evenement) => evenement.acteurs));
}

function cibles(evenements: readonly EvenementDuCatalogue[]): Set<string> {
  return new Set(
    evenements.flatMap((evenement) =>
      evenement.choix.flatMap((choix) =>
        choix.faitsProduits.map(({ cible }) => cible),
      ),
    ),
  );
}

function filtrerDictionnaire(
  dictionnaire: Readonly<Record<string, string>>,
  retenir: (cle: string) => boolean,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(dictionnaire).filter(([cle]) => retenir(cle)),
  );
}

const faitsPremium = new Set([
  ...idsDeFaits(evenementsPremium),
  ...conseilsPremium.flatMap((conseil) =>
    conseil.sujets.flatMap((sujet) =>
      sujet.decisions.map((decision) => decision.faitProduit)
    )
  ),
]);
const causesPremium = new Set([
  ...evenementsPremium.map(({ id }) => id),
  ...conseilsPremium.map(({ id }) => id),
]);
const acteursDeBase = acteurs(evenementsDeBase);
const acteursPremium = acteurs(evenementsPremium);
const acteursExclusifsPremium = new Set(
  [...acteursPremium].filter((id) => !acteursDeBase.has(id)),
);
const ciblesDeBase = cibles(evenementsDeBase);
const ciblesPremium = cibles(evenementsPremium);
const ciblesExclusivesPremium = new Set(
  [...ciblesPremium].filter((id) => !ciblesDeBase.has(id)),
);

type JournalCompile =
  CatalogueDEvenements["libellesTransversaux"][Langue]["journal"];

function journalDeBase(langue: Langue): JournalCompile {
  const journal = catalogueComplet.libellesTransversaux[langue].journal;
  return {
    titres: filtrerDictionnaire(
      journal.titres,
      (id) => !faitsPremium.has(id),
    ),
    causes: filtrerDictionnaire(
      journal.causes,
      (id) => !causesPremium.has(id),
    ),
    acteurs: filtrerDictionnaire(
      journal.acteurs,
      (id) => !acteursExclusifsPremium.has(id),
    ),
    cibles: filtrerDictionnaire(
      journal.cibles,
      (id) => !ciblesExclusivesPremium.has(id),
    ),
  };
}

function journalPremium(langue: Langue): JournalCompile {
  const journal = catalogueComplet.libellesTransversaux[langue].journal;
  return {
    titres: filtrerDictionnaire(journal.titres, (id) => faitsPremium.has(id)),
    causes: filtrerDictionnaire(
      journal.causes,
      (id) => causesPremium.has(id),
    ),
    acteurs: filtrerDictionnaire(
      journal.acteurs,
      (id) => acteursPremium.has(id),
    ),
    cibles: filtrerDictionnaire(
      journal.cibles,
      (id) => ciblesPremium.has(id),
    ),
  };
}

const catalogueDeBase: CatalogueDEvenements = {
  ...catalogueComplet,
  evenements: evenementsDeBase,
  conseils: conseilsDeBase,
  libellesTransversaux: {
    fr: {
      ...catalogueComplet.libellesTransversaux.fr,
      journal: journalDeBase("fr"),
    },
    en: {
      ...catalogueComplet.libellesTransversaux.en,
      journal: journalDeBase("en"),
    },
  },
};
const cataloguePremiumNarratif = {
  version: 1,
  evenements: evenementsPremium,
  conseils: conseilsPremium,
  libellesTransversaux: {
    fr: { journal: journalPremium("fr") },
    en: { journal: journalPremium("en") },
  },
} as const;

function collecterChaines(
  valeur: unknown,
  inclureLesCles = false,
): string[] {
  if (typeof valeur === "string") {
    return [valeur];
  }
  if (Array.isArray(valeur)) {
    return valeur.flatMap((membre) =>
      collecterChaines(membre, inclureLesCles),
    );
  }
  if (valeur === null || typeof valeur !== "object") {
    return [];
  }
  return Object.entries(valeur).flatMap(([cle, membre]) => [
    ...(inclureLesCles ? [cle] : []),
    ...collecterChaines(membre, inclureLesCles),
  ]);
}

function collecterModelesNarratifs(valeur: unknown): string[] {
  if (Array.isArray(valeur)) {
    return valeur.flatMap(collecterModelesNarratifs);
  }
  if (valeur === null || typeof valeur !== "object") {
    return [];
  }
  return Object.entries(valeur).flatMap(([cle, membre]) =>
    cle === "modele" && typeof membre === "string"
      ? [membre]
      : collecterModelesNarratifs(membre),
  );
}

const chainesDuCatalogueDeBase = collecterChaines(catalogueDeBase, true);
const fragmentsPublicsPartages = new Set([
  "Ash Pilgrims",
  "Combustible",
  "Decision",
  "Destination",
  "Filter House",
  "Integration",
  "Location",
  "Lower Watch",
  "Materials",
  "Maison des Filtres",
  "Matériaux",
  "Nacelles",
  "Pèlerins de Cendre",
  "Position",
  "Pressions",
  "Remedies",
  "Veille-Basse",
  "evacuated",
  "personnes",
]);

function fragmentEstDejaPublic(fragment: string): boolean {
  return (
    fragmentsPublicsPartages.has(fragment) ||
    chainesDuCatalogueDeBase.some((chaine) => chaine.includes(fragment))
  );
}

const fragmentsNarratifsProteges = [
  ...cataloguePremiumNarratif.evenements.flatMap((evenement) => [
    ...(evenement.asset === null
      ? []
      : [
          evenement.asset.fichier,
          ...collecterChaines(evenement.asset.alternatives),
          evenement.asset.provenance.entree,
          evenement.asset.provenance.prompt,
        ]),
    ...collecterModelesNarratifs(evenement.textes),
  ]),
  ...cataloguePremiumNarratif.conseils.flatMap((conseil) =>
    collecterModelesNarratifs(conseil.textes)
  ),
  ...collecterChaines(cataloguePremiumNarratif.libellesTransversaux),
].filter(
  (fragment) =>
    fragment.length >= 12 && !fragmentEstDejaPublic(fragment),
);
const fragmentsDesRoutesProtegees = [
  ...LIEUX_PREMIUM.flatMap((lieu) => [
    lieu.nom.fr,
    lieu.nom.en,
  ]),
  ...TRONCONS_PREMIUM.flatMap((troncon) => [
    ...(!("consequenceDuHalo" in troncon)
      ? []
      : [
          troncon.consequenceDuHalo.fr,
          troncon.consequenceDuHalo.en,
        ]),
    ...(!("libellesDOptions" in troncon)
      ? []
      : collecterChaines(troncon.libellesDOptions)),
    ...troncon.renseignements.flatMap((renseignement) => [
      renseignement.libelles.fr.source,
      renseignement.libelles.fr.danger,
      renseignement.libelles.fr.controlePolitique,
      renseignement.libelles.en.source,
      renseignement.libelles.en.danger,
      renseignement.libelles.en.controlePolitique,
    ]),
  ]),
];
const fragmentsDesPresentationsProtegees = collecterChaines(
  PRESENTATIONS_PREMIUM,
).filter(
  (fragment) =>
    fragment.length >= 8 && !fragmentEstDejaPublic(fragment),
);
const inventaireDeFrontierePremium = {
  version: 1,
  fragments: [
    ...new Set([
      ...fragmentsNarratifsProteges,
      ...fragmentsDesRoutesProtegees,
      ...fragmentsDesPresentationsProtegees,
      ...NOMS_D_ASSETS_PREMIUM,
    ]),
  ].sort(),
  nomsDAssets: [...NOMS_D_ASSETS_PREMIUM].sort(),
} as const;

function ecrireSiModifiee(destination: string, valeur: unknown): void {
  const sortie = `// Ce fichier est généré par npm run content:compile.\nexport default ${JSON.stringify(valeur, null, 2)} as const;\n`;
  if (!existsSync(destination) || readFileSync(destination, "utf8") !== sortie) {
    writeFileSync(destination, sortie);
  }
}

const destinationDeBase = resolve(racine, "src/content/catalogue.generated.ts");
const destinationPremium = resolve(
  racine,
  "serveur-commercial/cataloguePremium.generated.ts",
);
const destinationInventairePremium = resolve(
  racine,
  "serveur-commercial/frontierePremium.generated.ts",
);
ecrireSiModifiee(destinationDeBase, catalogueDeBase);
ecrireSiModifiee(destinationPremium, cataloguePremiumNarratif);
ecrireSiModifiee(
  destinationInventairePremium,
  inventaireDeFrontierePremium,
);

console.log(
  `${evenementsDeBase.length} Événements de base et ${evenementsPremium.length} Événements premium compilés`,
);
