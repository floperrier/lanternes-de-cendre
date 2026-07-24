import type { EtatCampagne } from "./campagne";

export type RetourDUneColonie =
  | "delegation"
  | "rapport"
  | "penurie"
  | "requisition"
  | "atelier"
  | "autonomie"
  | "habitants-du-seuil";

export interface EtatDeLaVoieDesColonies {
  readonly serresDeVerre: {
    readonly besoin: "eau-pieces-equipes";
    readonly interaction:
      | "ralliement-en-attente"
      | "coalition-ralliee"
      | "passage-force";
    readonly devenir: "indetermine" | "carrefour-allie" | "epuise";
  };
  readonly retours: {
    readonly hautPuits: RetourDUneColonie;
    readonly veilleBasse: RetourDUneColonie;
    readonly grandAiguillage: RetourDUneColonie;
    readonly traverseLibre: RetourDUneColonie;
    readonly seuil: "habitants-du-seuil";
  };
  readonly cohorte:
    | "absente"
    | "integree"
    | "redirigee"
    | "refusee";
  readonly credibilite: {
    readonly alliances: number;
    readonly equipes: number;
    readonly eauPreservee: boolean;
    readonly piecesPreservees: boolean;
    readonly voie: "credible" | "fragile";
  };
  readonly seuil: {
    readonly statut: "fragile" | "stable";
    readonly pressions: readonly (
      | "abris-satures"
      | "pieces-rares"
      | "delegations-rivales"
    )[];
    readonly marche: "limite" | "rationne" | "epuise";
    readonly abris: "satures" | "partages" | "reserves-au-convoi";
    readonly relevesDuNoeud:
      | "inconnus"
      | "recoupes"
      | "conserves-separes";
    readonly revendication:
      | "voix-revendiquee"
      | "voix-garantie"
      | "tutelle-contestee";
  };
  readonly accesAuNoeud:
    | "non-prepare"
    | "voie-alliee"
    | "breche-couteuse";
  readonly gardeDuRegistre: "indecise" | "maelys" | "commune";
}

interface ContexteDeLaVoieDesColonies {
  readonly hautPuits: EtatCampagne["hautPuits"];
  readonly veilleBasse: EtatCampagne["veilleBasse"];
  readonly trameDeFer: EtatCampagne["trameDeFer"];
  readonly traverseLibre: EtatCampagne["traverseLibre"];
  readonly pilotage: EtatCampagne["pilotage"];
  readonly narration: EtatCampagne["narration"];
}

function idsDeFaits(
  contexte: ContexteDeLaVoieDesColonies,
): ReadonlySet<string> {
  return new Set(
    contexte.narration.faitsDeCampagne.map(({ id }) => id),
  );
}

export function reconstruireEtatDeLaVoieDesColonies(
  contexte: ContexteDeLaVoieDesColonies,
): EtatDeLaVoieDesColonies {
  const faits = idsDeFaits(contexte);
  const hautPuitsAllie =
    contexte.hautPuits.relationPublique === "cooperative" &&
    contexte.hautPuits.colonie.statut !== "perdue";
  const veilleBasseAlliee =
    (contexte.veilleBasse.colonie.statut === "stable" ||
      contexte.veilleBasse.colonie.statut === "prospere") &&
    contexte.veilleBasse.colonie.techniciens.equipesDisponibles > 0;
  const grandAiguillageAllie =
    contexte.trameDeFer.grandAiguillage.statut === "atelier-negocie" ||
    contexte.trameDeFer.relationRepublique === "cooperative";
  const traverseLibreAlliee =
    contexte.traverseLibre.statut === "autonome" ||
    contexte.traverseLibre.relationPuitsLibres === "cooperative";
  const alliances = [
    hautPuitsAllie,
    veilleBasseAlliee,
    grandAiguillageAllie,
    traverseLibreAlliee,
  ].filter(Boolean).length;
  const equipesDeVeilleBasse = veilleBasseAlliee
    ? contexte.veilleBasse.colonie.techniciens.equipesDisponibles
    : 0;
  const equipes =
    equipesDeVeilleBasse +
    contexte.veilleBasse.cohorte.integration.equipesIntegrees +
    (contexte.trameDeFer.occasions.attelageFedere.statut ===
    "annoncee"
      ? 1
      : 0) +
    (contexte.traverseLibre.routeSecondaire.statut === "reparee"
      ? 1
      : 0);
  const eauPreservee =
    contexte.pilotage.economie.stocks.eau.quantite >= 10;
  const piecesPreservees =
    contexte.pilotage.economie.stocks.materiaux.quantite >= 8;
  const voie =
    alliances >= 2 && equipes >= 2 && eauPreservee && piecesPreservees
      ? "credible"
      : "fragile";
  const coalitionRalliee = faits.has(
    "couronne.serres-de-verre.coalition-ralliee",
  );
  const passageForce = faits.has(
    "couronne.serres-de-verre.passage-force",
  );
  const marcheRationne = faits.has(
    "couronne.seuil.marche-rationne",
  );
  const piecesAchetees = faits.has(
    "couronne.seuil.dernieres-pieces-achetees",
  );

  return {
    serresDeVerre: {
      besoin: "eau-pieces-equipes",
      interaction: coalitionRalliee
        ? "coalition-ralliee"
        : passageForce
          ? "passage-force"
          : "ralliement-en-attente",
      devenir: coalitionRalliee
        ? "carrefour-allie"
        : passageForce
          ? "epuise"
          : "indetermine",
    },
    retours: {
      hautPuits:
        contexte.hautPuits.colonie.statut === "perdue"
          ? "penurie"
          : hautPuitsAllie
            ? "delegation"
            : "rapport",
      veilleBasse:
        contexte.veilleBasse.colonie.statut === "perdue"
          ? "penurie"
          : veilleBasseAlliee
            ? "delegation"
            : "rapport",
      grandAiguillage:
        contexte.trameDeFer.grandAiguillage.statut ===
        "atelier-negocie"
          ? "atelier"
          : grandAiguillageAllie
            ? "delegation"
            : "requisition",
      traverseLibre:
        contexte.traverseLibre.statut === "autonome"
          ? "autonomie"
          : traverseLibreAlliee
            ? "delegation"
            : contexte.traverseLibre.statut === "fragile"
              ? "penurie"
              : "rapport",
      seuil: "habitants-du-seuil",
    },
    cohorte:
      contexte.veilleBasse.cohorte.integration.statut ===
      "equipes-integrees"
        ? "integree"
        : contexte.veilleBasse.cohorte.integration.statut ===
            "redirigee"
          ? "redirigee"
          : contexte.veilleBasse.cohorte.integration.statut ===
              "refusee"
            ? "refusee"
            : "absente",
    credibilite: {
      alliances,
      equipes,
      eauPreservee,
      piecesPreservees,
      voie,
    },
    seuil: {
      statut: marcheRationne ? "stable" : "fragile",
      pressions: marcheRationne
        ? ["pieces-rares"]
        : piecesAchetees
          ? ["abris-satures", "delegations-rivales"]
          : ["abris-satures", "pieces-rares"],
      marche: marcheRationne
        ? "rationne"
        : piecesAchetees
          ? "epuise"
          : "limite",
      abris: marcheRationne
        ? "partages"
        : piecesAchetees
          ? "reserves-au-convoi"
          : "satures",
      relevesDuNoeud: faits.has(
        "couronne.seuil.releves-recopies",
      )
        ? "recoupes"
        : faits.has("couronne.seuil.releves-separes")
          ? "conserves-separes"
          : "inconnus",
      revendication: marcheRationne
        ? "voix-garantie"
        : piecesAchetees
          ? "tutelle-contestee"
          : "voix-revendiquee",
    },
    accesAuNoeud: faits.has(
      "couronne.colonies.voie-alliee-preparee",
    )
      ? "voie-alliee"
      : faits.has("couronne.colonies.breche-couteuse-preparee")
        ? "breche-couteuse"
        : "non-prepare",
    gardeDuRegistre: faits.has(
      "couronne.seuil.registre-confie-a-maelys",
    )
      ? "maelys"
      : faits.has("couronne.seuil.registre-commun")
        ? "commune"
        : "indecise",
  };
}

export function choixDeLaVoieDesColoniesEstDisponible(
  contexte: ContexteDeLaVoieDesColonies,
  choixId: string,
): boolean {
  const etat = reconstruireEtatDeLaVoieDesColonies(contexte);
  if (choixId === "rallier-coalition") {
    return etat.credibilite.voie === "credible";
  }
  if (choixId === "engager-equipes-ralliees") {
    return (
      idsDeFaits(contexte).has(
        "couronne.serres-de-verre.coalition-ralliee",
      ) && etat.credibilite.alliances >= 2
    );
  }
  return true;
}
