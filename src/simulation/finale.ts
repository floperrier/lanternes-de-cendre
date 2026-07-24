import type { EtatCampagne } from "./campagne";
import { reconstruireEtatDeLOuvertureDeLaCouronne } from "./ouvertureCouronne";

export type IdentifiantDeSolutionFinale =
  | "ancrer"
  | "reaccorder"
  | "precipiter";

export type StatutDeSolutionFinale =
  | "preparee"
  | "risquee"
  | "impossible";

export type CauseDeSolutionFinale =
  | "berceau-amorce"
  | "berceau-absent"
  | "etalon-calibre"
  | "etalon-absent"
  | "precipitateur-assemble"
  | "precipitateur-absent"
  | "noeud-preserve"
  | "noeud-contraint"
  | "noeud-endommage"
  | "coalition-presente"
  | "coalition-absente"
  | "accord-partage"
  | "accord-ferme"
  | "ligne-zero-relevee"
  | "ligne-zero-absente"
  | "ressources-suffisantes"
  | "materiaux-insuffisants"
  | "eau-insuffisante"
  | "habitants-insuffisants";

export interface CoutDeSolutionFinale {
  readonly eau: number;
  readonly materiaux: number;
  readonly habitants: number;
}

export interface EtatDUneSolutionFinale {
  readonly statut: StatutDeSolutionFinale;
  readonly causes: readonly CauseDeSolutionFinale[];
  readonly cout: CoutDeSolutionFinale;
  readonly selectionnable: boolean;
}

export type VarianteDAncrage =
  | "refuge-commun"
  | "citadelle-de-cendre"
  | "dernier-rempart";

export interface EtatDuContratFinal {
  readonly solutions: Readonly<
    Record<IdentifiantDeSolutionFinale, EtatDUneSolutionFinale>
  >;
  readonly selection: "aucune" | "ancrage-prepare" | "ancrage-risque";
  readonly optionsDeNegociation: readonly VarianteDAncrage[];
  readonly varianteDAncrage: VarianteDAncrage | "aucune";
  readonly bilan:
    | {
        readonly stabilite:
          | "stable"
          | "fortifiee"
          | "sous-contrainte";
        readonly controle: "partage" | "centralise" | "equipes";
        readonly coutHumain: "contenu" | "inegal" | "eleve";
      }
    | undefined;
}

type ContexteDeFinale = Pick<
  EtatCampagne,
  | "citeCaravane"
  | "narration"
  | "pilotage"
  | "trameDeFer"
  | "traverseLibre"
  | "veilleBasse"
  | "hautPuits"
>;

export const COUTS_DES_SOLUTIONS_FINALES = {
  ancrer: {
    preparee: { eau: 0, materiaux: 4, habitants: 0 },
    risquee: { eau: 0, materiaux: 10, habitants: 8 },
  },
  reaccorder: {
    preparee: { eau: 4, materiaux: 4, habitants: 0 },
    risquee: { eau: 10, materiaux: 8, habitants: 0 },
  },
  precipiter: {
    preparee: { eau: 6, materiaux: 6, habitants: 0 },
    risquee: { eau: 12, materiaux: 10, habitants: 6 },
  },
} as const;

export function ancrageEstPrepare(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("couronne.approches.berceau-amorce") &&
    !faits.has("couronne.ouverture.breche-ouverte")
  );
}

export function refugeCommunEstCredible(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("couronne.ouverture.clef-collective") &&
    (faits.has("couronne.colonies.voie-alliee-preparee") ||
      faits.has("trame.aiguillage-zero.charte-partagee") ||
      faits.has(
        "trame.aiguillage-zero.engagement-transport-autonome",
      ))
  );
}

export function citadelleDeCendreEstCredible(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("couronne.tete-de-ligne.mandat-republicain") ||
    faits.has("trame.aiguillage-zero.monopole-republicain")
  );
}

function idsDeFaits(
  contexte: ContexteDeFinale,
): ReadonlySet<string> {
  return new Set(
    contexte.narration.faitsDeCampagne.map(({ id }) => id),
  );
}

function causesDuNoeud(
  noeud: ReturnType<
    typeof reconstruireEtatDeLOuvertureDeLaCouronne
  >["noeud"],
): CauseDeSolutionFinale {
  return noeud === "endommage"
    ? "noeud-endommage"
    : noeud === "contraint"
      ? "noeud-contraint"
      : "noeud-preserve";
}

function ressourcesSuffisantes(
  contexte: ContexteDeFinale,
  cout: CoutDeSolutionFinale,
): boolean {
  return (
    contexte.pilotage.economie.stocks.eau.quantite >= cout.eau &&
    contexte.pilotage.economie.stocks.materiaux.quantite >=
      cout.materiaux &&
    contexte.citeCaravane.habitants > cout.habitants
  );
}

function causesDeRessources(
  contexte: ContexteDeFinale,
  cout: CoutDeSolutionFinale,
): readonly CauseDeSolutionFinale[] {
  const causes: CauseDeSolutionFinale[] = [];
  if (
    contexte.pilotage.economie.stocks.materiaux.quantite <
    cout.materiaux
  ) {
    causes.push("materiaux-insuffisants");
  }
  if (contexte.pilotage.economie.stocks.eau.quantite < cout.eau) {
    causes.push("eau-insuffisante");
  }
  if (contexte.citeCaravane.habitants <= cout.habitants) {
    causes.push("habitants-insuffisants");
  }
  return causes.length === 0 ? ["ressources-suffisantes"] : causes;
}

function exclureCoutFinalDejaPaye(
  contexte: ContexteDeFinale,
  faits: ReadonlySet<string>,
): ContexteDeFinale {
  const statut = faits.has("finale.ancrage.selection-preparee")
    ? "preparee"
    : faits.has("finale.ancrage.selection-risquee")
      ? "risquee"
      : undefined;
  if (statut === undefined) {
    return contexte;
  }
  const cout =
    COUTS_DES_SOLUTIONS_FINALES.ancrer[statut];
  return {
    ...contexte,
    citeCaravane: {
      ...contexte.citeCaravane,
      habitants: contexte.citeCaravane.habitants + cout.habitants,
    },
    pilotage: {
      ...contexte.pilotage,
      economie: {
        ...contexte.pilotage.economie,
        stocks: {
          ...contexte.pilotage.economie.stocks,
          eau: {
            ...contexte.pilotage.economie.stocks.eau,
            quantite:
              contexte.pilotage.economie.stocks.eau.quantite +
              cout.eau,
          },
          materiaux: {
            ...contexte.pilotage.economie.stocks.materiaux,
            quantite:
              contexte.pilotage.economie.stocks.materiaux.quantite +
              cout.materiaux,
          },
        },
      },
    },
  };
}

function construireSolution(
  contexte: ContexteDeFinale,
  structurePreparee: boolean,
  impossibleStructurellement: boolean,
  causes: readonly CauseDeSolutionFinale[],
  couts: {
    readonly preparee: CoutDeSolutionFinale;
    readonly risquee: CoutDeSolutionFinale;
  },
): EtatDUneSolutionFinale {
  const statutStructurel = structurePreparee ? "preparee" : "risquee";
  const cout = couts[statutStructurel];
  const ressourcesDisponibles = ressourcesSuffisantes(contexte, cout);
  const statut =
    impossibleStructurellement || !ressourcesDisponibles
      ? "impossible"
      : statutStructurel;
  return {
    statut,
    cout,
    causes: [
      ...causes,
      ...causesDeRessources(contexte, cout),
    ],
    selectionnable: statut !== "impossible",
  };
}

function trouverVariante(
  faits: ReadonlySet<string>,
): VarianteDAncrage | "aucune" {
  if (faits.has("finale.ancrage.refuge-commun")) {
    return "refuge-commun";
  }
  if (faits.has("finale.ancrage.citadelle-de-cendre")) {
    return "citadelle-de-cendre";
  }
  return faits.has("finale.ancrage.dernier-rempart")
    ? "dernier-rempart"
    : "aucune";
}

export function reconstruireEtatDuContratFinal(
  contexte: ContexteDeFinale,
): EtatDuContratFinal {
  const faits = idsDeFaits(contexte);
  const contexteDuDiagnostic = exclureCoutFinalDejaPaye(
    contexte,
    faits,
  );
  const ouverture =
    reconstruireEtatDeLOuvertureDeLaCouronne(contexte);
  const noeud = causesDuNoeud(ouverture.noeud);
  const berceau = faits.has("couronne.approches.berceau-amorce");
  const etalon = faits.has("couronne.approches.etalon-calibre");
  const precipitateur = faits.has(
    "couronne.approches.precipitateur-assemble",
  );
  const coalition = faits.has(
    "couronne.colonies.voie-alliee-preparee",
  );
  const accordPartage =
    faits.has("trame.aiguillage-zero.charte-partagee") ||
    faits.has(
      "trame.aiguillage-zero.engagement-transport-autonome",
    );
  const ligneZero = faits.has(
    "bassins.deversoir.ligne-zero-relevee",
  );
  const noeudEndommage = ouverture.noeud === "endommage";

  const solutions = {
    ancrer: construireSolution(
      contexteDuDiagnostic,
      ancrageEstPrepare(faits),
      false,
      [berceau ? "berceau-amorce" : "berceau-absent", noeud],
      COUTS_DES_SOLUTIONS_FINALES.ancrer,
    ),
    reaccorder: construireSolution(
      contexteDuDiagnostic,
      etalon && coalition && accordPartage && !noeudEndommage,
      noeudEndommage,
      [
        etalon ? "etalon-calibre" : "etalon-absent",
        coalition ? "coalition-presente" : "coalition-absente",
        accordPartage ? "accord-partage" : "accord-ferme",
        noeud,
      ],
      COUTS_DES_SOLUTIONS_FINALES.reaccorder,
    ),
    precipiter: construireSolution(
      contexteDuDiagnostic,
      precipitateur && ligneZero && !noeudEndommage,
      false,
      [
        precipitateur
          ? "precipitateur-assemble"
          : "precipitateur-absent",
        ligneZero ? "ligne-zero-relevee" : "ligne-zero-absente",
        noeud,
      ],
      COUTS_DES_SOLUTIONS_FINALES.precipiter,
    ),
  } as const;

  const selection = faits.has(
    "finale.ancrage.selection-preparee",
  )
    ? "ancrage-prepare"
    : faits.has("finale.ancrage.selection-risquee")
      ? "ancrage-risque"
      : "aucune";
  const ancrageSelectionne = selection !== "aucune";
  const partageCredible = refugeCommunEstCredible(faits);
  const citadelleCredible = citadelleDeCendreEstCredible(faits);
  const optionsDeNegociation: VarianteDAncrage[] = ancrageSelectionne
    ? [
        ...(selection === "ancrage-prepare" && partageCredible
          ? (["refuge-commun"] as const)
          : []),
        ...(citadelleCredible
          ? (["citadelle-de-cendre"] as const)
          : []),
        "dernier-rempart",
      ]
    : [];
  const varianteDAncrage = trouverVariante(faits);
  const bilans = {
    "refuge-commun": {
      stabilite: "stable",
      controle: "partage",
      coutHumain: "contenu",
    },
    "citadelle-de-cendre": {
      stabilite: "fortifiee",
      controle: "centralise",
      coutHumain: "inegal",
    },
    "dernier-rempart": {
      stabilite: "sous-contrainte",
      controle: "equipes",
      coutHumain: "eleve",
    },
  } as const;

  return {
    solutions,
    selection,
    optionsDeNegociation,
    varianteDAncrage,
    bilan:
      varianteDAncrage === "aucune"
        ? undefined
        : bilans[varianteDAncrage],
  };
}

export function choixDeFinaleEstDisponible(
  contexte: ContexteDeFinale,
  choixId: string,
): boolean {
  const finale = reconstruireEtatDuContratFinal(contexte);
  if (choixId === "selectionner-ancrage-prepare") {
    return finale.solutions.ancrer.statut === "preparee";
  }
  if (choixId === "selectionner-ancrage-risque") {
    return finale.solutions.ancrer.statut === "risquee";
  }
  const variantes: Readonly<Record<string, VarianteDAncrage>> = {
    "negocier-refuge-commun": "refuge-commun",
    "negocier-citadelle-de-cendre": "citadelle-de-cendre",
    "tenir-dernier-rempart": "dernier-rempart",
  };
  const variante = variantes[choixId];
  return variante === undefined
    ? true
    : finale.optionsDeNegociation.includes(variante);
}
