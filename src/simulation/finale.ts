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
  | "specialistes-reaccord-reunis"
  | "specialistes-reaccord-absents"
  | "engagements-reaccord-actifs"
  | "engagements-reaccord-absents"
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

export type VarianteDeReaccord =
  | "constellation"
  | "reseau-de-fer"
  | "veilles-dispersees";

export type VarianteFinale =
  | VarianteDAncrage
  | VarianteDeReaccord;

export type SelectionDeSolutionFinale =
  | "aucune"
  | "ancrage-prepare"
  | "ancrage-risque"
  | "reaccord-prepare"
  | "reaccord-risque";

export interface EtatDuContratFinal {
  readonly solutions: Readonly<
    Record<IdentifiantDeSolutionFinale, EtatDUneSolutionFinale>
  >;
  readonly selection: SelectionDeSolutionFinale;
  readonly optionsDeNegociation: readonly VarianteFinale[];
  readonly varianteFinale: VarianteFinale | "aucune";
  readonly bilan:
    | {
        readonly stabilite:
          | "stable"
          | "fortifiee"
          | "sous-contrainte"
          | "maillee"
          | "rigide"
          | "fragmentee";
        readonly controle:
          | "partage"
          | "centralise"
          | "equipes"
          | "coalition"
          | "republique"
          | "sans-proprietaire";
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

function coalitionDuReaccordEstPresente(
  faits: ReadonlySet<string>,
): boolean {
  return faits.has("couronne.colonies.voie-alliee-preparee");
}

function specialistesDuReaccordSontReunis(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("couronne.tete-de-ligne.atelier-commun") ||
    faits.has("trame.grand-aiguillage.train-outil-annonce") ||
    faits.has("couronne.veille-des-trois.sanctuaire-renforce")
  );
}

function engagementDuReaccordEstActif(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("trame.aiguillage-zero.charte-partagee") ||
    faits.has(
      "trame.aiguillage-zero.engagement-transport-autonome",
    ) ||
    faits.has("couronne.tete-de-ligne.mandat-republicain") ||
    faits.has("trame.aiguillage-zero.monopole-republicain")
  );
}

export function reaccordEstPrepare(
  faits: ReadonlySet<string>,
): boolean {
  return (
    faits.has("couronne.approches.etalon-calibre") &&
    !faits.has("couronne.ouverture.breche-ouverte") &&
    specialistesDuReaccordSontReunis(faits) &&
    (coalitionDuReaccordEstPresente(faits) ||
      engagementDuReaccordEstActif(faits))
  );
}

export function constellationEstCredible(
  faits: ReadonlySet<string>,
): boolean {
  return (
    coalitionDuReaccordEstPresente(faits) &&
    (faits.has("trame.aiguillage-zero.charte-partagee") ||
      faits.has(
        "trame.aiguillage-zero.engagement-transport-autonome",
      ))
  );
}

export function reseauDeFerEstCredible(
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
  const selection = faits.has("finale.ancrage.selection-preparee")
    ? ({ solution: "ancrer", statut: "preparee" } as const)
    : faits.has("finale.ancrage.selection-risquee")
      ? ({ solution: "ancrer", statut: "risquee" } as const)
      : faits.has("finale.reaccord.selection-preparee")
        ? ({ solution: "reaccorder", statut: "preparee" } as const)
        : faits.has("finale.reaccord.selection-risquee")
          ? ({ solution: "reaccorder", statut: "risquee" } as const)
          : undefined;
  if (selection === undefined) {
    return contexte;
  }
  const cout =
    COUTS_DES_SOLUTIONS_FINALES[selection.solution][
      selection.statut
    ];
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
): VarianteFinale | "aucune" {
  if (faits.has("finale.ancrage.refuge-commun")) {
    return "refuge-commun";
  }
  if (faits.has("finale.ancrage.citadelle-de-cendre")) {
    return "citadelle-de-cendre";
  }
  if (faits.has("finale.ancrage.dernier-rempart")) {
    return "dernier-rempart";
  }
  if (faits.has("finale.reaccord.constellation")) {
    return "constellation";
  }
  if (faits.has("finale.reaccord.reseau-de-fer")) {
    return "reseau-de-fer";
  }
  return faits.has("finale.reaccord.veilles-dispersees")
    ? "veilles-dispersees"
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
  const specialistesDuReaccord =
    specialistesDuReaccordSontReunis(faits);
  const engagementDuReaccord =
    engagementDuReaccordEstActif(faits);
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
      reaccordEstPrepare(faits),
      noeudEndommage,
      [
        etalon ? "etalon-calibre" : "etalon-absent",
        coalition ? "coalition-presente" : "coalition-absente",
        accordPartage ? "accord-partage" : "accord-ferme",
        specialistesDuReaccord
          ? "specialistes-reaccord-reunis"
          : "specialistes-reaccord-absents",
        engagementDuReaccord
          ? "engagements-reaccord-actifs"
          : "engagements-reaccord-absents",
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

  const selection: SelectionDeSolutionFinale = faits.has(
    "finale.ancrage.selection-preparee",
  )
    ? "ancrage-prepare"
    : faits.has("finale.ancrage.selection-risquee")
      ? "ancrage-risque"
      : faits.has("finale.reaccord.selection-preparee")
        ? "reaccord-prepare"
        : faits.has("finale.reaccord.selection-risquee")
          ? "reaccord-risque"
          : "aucune";
  const ancrageSelectionne = selection.startsWith("ancrage-");
  const reaccordSelectionne = selection.startsWith("reaccord-");
  const partageCredible = refugeCommunEstCredible(faits);
  const citadelleCredible = citadelleDeCendreEstCredible(faits);
  const optionsDeNegociation: VarianteFinale[] = ancrageSelectionne
    ? ([
        ...(selection === "ancrage-prepare" && partageCredible
          ? (["refuge-commun"] as const)
          : []),
        ...(citadelleCredible
          ? (["citadelle-de-cendre"] as const)
          : []),
        "dernier-rempart",
      ] as const)
    : reaccordSelectionne
      ? ([
          ...(selection === "reaccord-prepare" &&
          constellationEstCredible(faits)
            ? (["constellation"] as const)
            : []),
          ...(reseauDeFerEstCredible(faits)
            ? (["reseau-de-fer"] as const)
            : []),
          "veilles-dispersees",
        ] as const)
      : [];
  const varianteFinale = trouverVariante(faits);
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
    constellation: {
      stabilite: "maillee",
      controle: "coalition",
      coutHumain: "contenu",
    },
    "reseau-de-fer": {
      stabilite: "rigide",
      controle: "republique",
      coutHumain: "inegal",
    },
    "veilles-dispersees": {
      stabilite: "fragmentee",
      controle: "sans-proprietaire",
      coutHumain: "eleve",
    },
  } as const;

  return {
    solutions,
    selection,
    optionsDeNegociation,
    varianteFinale,
    bilan:
      varianteFinale === "aucune"
        ? undefined
        : bilans[varianteFinale],
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
  if (choixId === "selectionner-reaccord-prepare") {
    return finale.solutions.reaccorder.statut === "preparee";
  }
  if (choixId === "selectionner-reaccord-risque") {
    return finale.solutions.reaccorder.statut === "risquee";
  }
  const variantes: Readonly<Record<string, VarianteFinale>> = {
    "negocier-refuge-commun": "refuge-commun",
    "negocier-citadelle-de-cendre": "citadelle-de-cendre",
    "tenir-dernier-rempart": "dernier-rempart",
    "mailler-la-constellation": "constellation",
    "confier-le-reseau-de-fer": "reseau-de-fer",
    "separer-les-veilles": "veilles-dispersees",
  };
  const variante = variantes[choixId];
  return variante === undefined
    ? true
    : finale.optionsDeNegociation.includes(variante);
}
