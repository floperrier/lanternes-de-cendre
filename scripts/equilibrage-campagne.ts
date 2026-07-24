import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { gunzip, gzip } from "node:zlib";
import { promisify } from "node:util";

import { CONTENU_PREMIUM_V1 } from "../serveur-commercial/cataloguePremiumComplet";
import { installerContenuPremiumComplet } from "../src/commercial/contenuPremium";
import {
  NOMBRE_DE_GRAINES_NOCTURNE,
  NOMBRE_DE_GRAINES_STANDARD,
  STRATEGIES_D_EQUILIBRAGE,
  VERSION_REGLES_D_EQUILIBRAGE_COURANTE,
  comparerPassesDEquilibrage,
  executerPasseDEquilibrage,
  rejouerPasseAvecCommandesImposees,
  validerReferenceDEquilibrage,
  type ComparaisonDePassesDEquilibrage,
  type PasseDEquilibrage,
  type ResultatDeCampagneHeadless,
  type ValidationDeReferenceDEquilibrage,
} from "../src/diagnostic/equilibrageCampagne";

const compresser = promisify(gzip);
const decompresser = promisify(gunzip);

interface OptionsDeLigneDeCommande {
  readonly nombreDeGraines: number;
  readonly prefixeDeGraine: string;
  readonly versionRegles: number;
  readonly cheminDuResume: string | null;
  readonly cheminDeReferenceAEcrire: string | null;
  readonly cheminDeReferenceALire: string | null;
  readonly comparerVersionPrecedente: boolean;
}

function lireEntier(argument: string | undefined, option: string): number {
  const valeur = Number(argument);
  if (!Number.isSafeInteger(valeur) || valeur <= 0) {
    throw new Error(`${option} exige un entier strictement positif.`);
  }
  return valeur;
}

function analyserArguments(
  argumentsDeLigne: readonly string[],
): OptionsDeLigneDeCommande {
  let nombreDeGraines: number = NOMBRE_DE_GRAINES_STANDARD;
  let prefixeDeGraine = "EQUILIBRAGE";
  let versionRegles: number = VERSION_REGLES_D_EQUILIBRAGE_COURANTE;
  let cheminDuResume: string | null = null;
  let cheminDeReferenceAEcrire: string | null = null;
  let cheminDeReferenceALire: string | null = null;
  let comparerVersionPrecedente = false;
  for (let index = 0; index < argumentsDeLigne.length; index += 1) {
    const argument = argumentsDeLigne[index];
    if (argument === "--nocturne") {
      nombreDeGraines = NOMBRE_DE_GRAINES_NOCTURNE;
    } else if (argument === "--comparer-version-precedente") {
      comparerVersionPrecedente = true;
    } else if (argument === "--graines") {
      nombreDeGraines = lireEntier(argumentsDeLigne[++index], "--graines");
    } else if (argument === "--prefixe") {
      prefixeDeGraine = argumentsDeLigne[++index] ?? "";
      if (prefixeDeGraine.length === 0) {
        throw new Error("--prefixe exige une valeur non vide.");
      }
    } else if (argument === "--version-regles") {
      versionRegles = lireEntier(
        argumentsDeLigne[++index],
        "--version-regles",
      );
      if (versionRegles > VERSION_REGLES_D_EQUILIBRAGE_COURANTE) {
        throw new Error(
          `La version de règles maximale est ${VERSION_REGLES_D_EQUILIBRAGE_COURANTE}.`,
        );
      }
    } else if (argument === "--resume") {
      cheminDuResume = argumentsDeLigne[++index] ?? null;
      if (cheminDuResume === null) {
        throw new Error("--resume exige un chemin.");
      }
    } else if (argument === "--ecrire-reference") {
      cheminDeReferenceAEcrire = argumentsDeLigne[++index] ?? null;
      if (cheminDeReferenceAEcrire === null) {
        throw new Error("--ecrire-reference exige un chemin.");
      }
    } else if (argument === "--reference") {
      cheminDeReferenceALire = argumentsDeLigne[++index] ?? null;
      if (cheminDeReferenceALire === null) {
        throw new Error("--reference exige un chemin.");
      }
    } else {
      throw new Error(`Option d’équilibrage inconnue : ${argument}`);
    }
  }
  return {
    nombreDeGraines,
    prefixeDeGraine,
    versionRegles,
    cheminDuResume,
    cheminDeReferenceAEcrire,
    cheminDeReferenceALire,
    comparerVersionPrecedente,
  };
}

async function ecrireJson(chemin: string, valeur: unknown): Promise<void> {
  const cheminAbsolu = resolve(chemin);
  await mkdir(dirname(cheminAbsolu), { recursive: true });
  const contenu = Buffer.from(`${JSON.stringify(valeur, null, 2)}\n`);
  await writeFile(
    cheminAbsolu,
    extname(cheminAbsolu) === ".gz"
      ? await compresser(contenu, { level: 9 })
      : contenu,
  );
}

async function lirePasse(chemin: string): Promise<PasseDEquilibrage> {
  const cheminAbsolu = resolve(chemin);
  const contenu = await readFile(cheminAbsolu);
  const json =
    extname(cheminAbsolu) === ".gz"
      ? (await decompresser(contenu)).toString("utf8")
      : contenu.toString("utf8");
  const valeur = JSON.parse(json) as Partial<PasseDEquilibrage>;
  if (
    valeur.format !== "lanternes-de-cendre.passe-equilibrage" ||
    valeur.version !== 1 ||
    !Array.isArray(valeur.campagnes)
  ) {
    throw new Error("La référence d’équilibrage est invalide.");
  }
  return valeur as PasseDEquilibrage;
}

function mediane(valeurs: readonly number[]): number {
  if (valeurs.length === 0) {
    return 0;
  }
  const triees = [...valeurs].sort((gauche, droite) => gauche - droite);
  const milieu = Math.floor(triees.length / 2);
  return triees.length % 2 === 0
    ? (triees[milieu - 1]! + triees[milieu]!) / 2
    : triees[milieu]!;
}

function resumerStrategie(
  campagnes: readonly ResultatDeCampagneHeadless[],
) {
  return {
    campagnes: campagnes.length,
    terminees: campagnes.filter(({ statut }) => statut === "terminee").length,
    tauxDArriveeAuNoeud:
      campagnes.length === 0
        ? 0
        : campagnes.filter(({ metriques }) => metriques.arriveeAuNoeud)
            .length / campagnes.length,
    crisesMedianes: mediane(
      campagnes.map(({ metriques }) => metriques.crises),
    ),
    tensionMediane: mediane(
      campagnes.map(({ metriques }) =>
        metriques.tronconsParcourus === 0
          ? 0
          : metriques.tronconsSousTension /
            metriques.tronconsParcourus,
      ),
    ),
    coutMedian: mediane(
      campagnes.map(({ metriques }) => metriques.coutFinal),
    ),
  };
}

function construireResume(
  passe: PasseDEquilibrage,
  passePrecedente: PasseDEquilibrage | null,
  comparaison: ComparaisonDePassesDEquilibrage | null,
  validationReference: ValidationDeReferenceDEquilibrage | null,
) {
  const alertesDeBandes = Object.entries(passe.metriques).flatMap(
    ([metrique, mesure]) =>
      mesure.nature === "mesure-directe" &&
      mesure.dansLaCible === false
        ? [
            {
              metrique,
              mediane: mesure.mediane,
              cible: mesure.cible,
            },
          ]
        : [],
  );
  const indicateursProxy = Object.entries(passe.metriques).flatMap(
    ([metrique, mesure]) =>
      mesure.nature === "proxy-headless"
        ? [{ metrique, ...mesure }]
        : [],
  );
  const anomalies = passe.campagnes
    .filter(({ statut }) => statut !== "terminee")
    .map((campagne) => ({
      graine: campagne.graine,
      strategieId: campagne.strategieId,
      statut: campagne.statut,
      raison: campagne.raisonDEchec,
      commandes: campagne.commandes
        .slice(-12)
        .map(({ commande }) => commande),
      empreinteFinale: campagne.empreinteFinale,
    }));
  return {
    format: "lanternes-de-cendre.rapport-equilibrage",
    version: 1,
    versionRegles: passe.versionRegles,
    referenceEquilibree: alertesDeBandes.length === 0,
    matrice: passe.matrice,
    strategies: Object.fromEntries(
      STRATEGIES_D_EQUILIBRAGE.map((strategie) => [
        strategie.id,
        {
          experience: strategie.experience,
          itineraire: strategie.itineraire.id,
          ...resumerStrategie(
            passe.campagnes.filter(
              ({ strategieId }) => strategieId === strategie.id,
            ),
          ),
        },
      ]),
    ),
    metriques: passe.metriques,
    alertesDeBandes,
    indicateursProxy,
    invariants: passe.invariants,
    validationVersionsSuccessives: [
      ...(passePrecedente === null
        ? []
        : [
            {
              versionRegles: passePrecedente.versionRegles,
              invariants: passePrecedente.invariants,
            },
          ]),
      {
        versionRegles: passe.versionRegles,
        invariants: passe.invariants,
      },
    ],
    dominances: passe.dominances,
    anomalies,
    validationReference,
    comparaison,
  };
}

function passeEstConforme(passe: PasseDEquilibrage): boolean {
  return (
    passe.matrice.campagnesAttendues ===
      passe.matrice.campagnesExecutees &&
    Object.values(passe.invariants).every(Boolean) &&
    passe.dominances.length === 0
  );
}

const options = analyserArguments(process.argv.slice(2));
installerContenuPremiumComplet(CONTENU_PREMIUM_V1);
if (
  options.versionRegles === 1 &&
  (options.comparerVersionPrecedente ||
    options.cheminDeReferenceALire !== null)
) {
  throw new Error(
    "La première version de règles ne possède pas de version précédente à comparer.",
  );
}
const referencePersisted =
  options.cheminDeReferenceALire === null
    ? null
    : await lirePasse(options.cheminDeReferenceALire);

const doitConserverLesTraces =
  options.cheminDeReferenceAEcrire !== null ||
  referencePersisted !== null ||
  options.comparerVersionPrecedente;
const passe = executerPasseDEquilibrage({
  nombreDeGraines: options.nombreDeGraines,
  prefixeDeGraine: options.prefixeDeGraine,
  versionRegles: options.versionRegles,
  conserverTraces: doitConserverLesTraces,
});
const passePrecedente =
  options.versionRegles === 1
    ? null
    : executerPasseDEquilibrage({
        nombreDeGraines: options.nombreDeGraines,
        prefixeDeGraine: options.prefixeDeGraine,
        versionRegles: options.versionRegles - 1,
        conserverTraces: referencePersisted !== null,
      });

let comparaison: ComparaisonDePassesDEquilibrage | null = null;
let validationReference: ValidationDeReferenceDEquilibrage | null = null;
if (referencePersisted !== null) {
  if (
    referencePersisted.versionRegles + 1 !== options.versionRegles
  ) {
    throw new Error(
      `La référence doit porter la version de règles ${
        options.versionRegles - 1
      }.`,
    );
  }
  const clesDeReference = new Set(
    referencePersisted.campagnes.map(
      ({ graine, strategieId }) => `${graine}\u0000${strategieId}`,
    ),
  );
  const memesCampagnes =
    referencePersisted.campagnes.length === passe.campagnes.length &&
    passe.campagnes.every(({ graine, strategieId }) =>
      clesDeReference.has(`${graine}\u0000${strategieId}`),
    );
  if (!memesCampagnes) {
    throw new Error(
      "La référence et la candidate doivent employer les mêmes Graines et stratégies.",
    );
  }
  validationReference = validerReferenceDEquilibrage(
    referencePersisted,
    passePrecedente!,
  );
}
if (
  referencePersisted !== null ||
  options.comparerVersionPrecedente
) {
  const referenceRejouee = rejouerPasseAvecCommandesImposees(
    passe,
    options.versionRegles - 1,
  );
  comparaison = comparerPassesDEquilibrage(referenceRejouee, passe);
}

if (options.cheminDeReferenceAEcrire !== null) {
  await ecrireJson(options.cheminDeReferenceAEcrire, passe);
}

const resume = construireResume(
  passe,
  passePrecedente,
  comparaison,
  validationReference,
);
if (options.cheminDuResume !== null) {
  await ecrireJson(options.cheminDuResume, resume);
}

const comparaisonPourLaConsole =
  comparaison === null
    ? null
    : {
        ...comparaison,
        ecarts: comparaison.ecarts.slice(0, 5),
        capsules: comparaison.capsules.slice(0, 5),
        nombreDEcarts: comparaison.ecarts.length,
        nombreDeCapsules: comparaison.capsules.length,
        resultatsOmisDeLaConsole: Math.max(
          0,
          comparaison.ecarts.length - 5,
        ),
      };
console.log(
  JSON.stringify(
    { ...resume, comparaison: comparaisonPourLaConsole },
    null,
    2,
  ),
);

if (
  !passeEstConforme(passe) ||
  (passePrecedente !== null && !passeEstConforme(passePrecedente)) ||
  validationReference?.conforme === false ||
  (comparaison !== null && !comparaison.grainesEtCommandesIdentiques)
) {
  process.exitCode = 1;
}
