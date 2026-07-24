import type { EtatCampagne } from "./campagne";
import type { EffetDEvenement } from "../content/types";
import { reconstruireEtatDesApprochesDeLaCouronne } from "./couronne";
import { reconstruireEtatDeLaVoieDesColonies } from "./voieColonies";

export type StatutDUneOuverture =
  | "indisponible"
  | "risquee"
  | "preparee";

export type IdentifiantDUneOuverture =
  | "ferroviaire"
  | "phares"
  | "colonies"
  | "breche";

export interface EtatDeLOuvertureDeLaCouronne {
  readonly ouvertures: {
    readonly ferroviaire: {
      readonly statut: StatutDUneOuverture;
      readonly acteurs: "republique" | "atelier-commun" | "absents";
      readonly materiaux: number;
    };
    readonly phares: {
      readonly statut: StatutDUneOuverture;
      readonly acteurs: "pelerins" | "releveurs" | "absents";
      readonly eau: number;
    };
    readonly colonies: {
      readonly statut: StatutDUneOuverture;
      readonly acteurs: "coalition" | "delegations-fragiles" | "absents";
      readonly eau: number;
      readonly materiaux: number;
    };
    readonly breche: {
      readonly statut: "toujours-disponible";
    };
  };
  readonly projets: {
    readonly berceau: {
      readonly diagnostic: "portance-inconnue" | "portance-confirmee";
      readonly preparation: "absente" | "amorcee";
      readonly reduction: number;
    };
    readonly etalon: {
      readonly diagnostic: "frequences-inconnues" | "frequences-calibrees";
      readonly preparation: "absente" | "calibree";
      readonly reduction: number;
    };
    readonly precipitateur: {
      readonly diagnostic: "decharges-inconnues" | "decharges-cartographiees";
      readonly preparation: "absente" | "assemble";
      readonly reduction: number;
    };
  };
  readonly conseil: {
    readonly republique: "absente" | "conditionnelle" | "mandatee";
    readonly pelerins: "absente" | "conditionnelle" | "mandatee";
    readonly puitsLibres: "absente" | "conditionnelle" | "mandatee";
  };
  readonly ouvertureChoisie: IdentifiantDUneOuverture | "aucune";
  readonly noeud: "inaccessible" | "intact" | "contraint" | "endommage";
  readonly solutions: {
    readonly ancrer: "preparee" | "risquee";
    readonly reaccorder: "preparee" | "risquee" | "impossible";
    readonly precipiter: "preparee" | "risquee";
  };
  readonly gardeDeLaClef: "indecise" | "gardiennes" | "collective";
}

type ContexteDeLOuverture = Pick<
  EtatCampagne,
  | "trameDeFer"
  | "traverseLibre"
  | "veilleBasse"
  | "hautPuits"
  | "pilotage"
  | "narration"
>;

function idsDeFaits(
  contexte: ContexteDeLOuverture,
): ReadonlySet<string> {
  return new Set(
    contexte.narration.faitsDeCampagne.map(({ id }) => id),
  );
}

function ouvertureChoisie(
  faits: ReadonlySet<string>,
): IdentifiantDUneOuverture | "aucune" {
  if (
    faits.has("couronne.ouverture.rail-ouverte")
  ) {
    return "ferroviaire";
  }
  if (
    faits.has("couronne.ouverture.phares-ouvertes")
  ) {
    return "phares";
  }
  if (
    faits.has("couronne.ouverture.colonies-ouvertes")
  ) {
    return "colonies";
  }
  return faits.has("couronne.ouverture.breche-ouverte")
    ? "breche"
    : "aucune";
}

export function reconstruireEtatDeLOuvertureDeLaCouronne(
  contexte: ContexteDeLOuverture,
): EtatDeLOuvertureDeLaCouronne {
  const faits = idsDeFaits(contexte);
  const approches =
    reconstruireEtatDesApprochesDeLaCouronne(contexte);
  const voieDesColonies =
    reconstruireEtatDeLaVoieDesColonies(contexte);
  const berceauAmorce = faits.has(
    "couronne.approches.berceau-amorce",
  );
  const etalonCalibre = faits.has(
    "couronne.approches.etalon-calibre",
  );
  const precipitateurAssemble = faits.has(
    "couronne.approches.precipitateur-assemble",
  );
  const railDisponible =
    faits.has("couronne.tete-de-ligne.mandat-republicain") ||
    faits.has("couronne.tete-de-ligne.atelier-commun");
  const pharesDisponibles =
    faits.has("couronne.veille-des-trois.sanctuaire-renforce") ||
    faits.has("couronne.veille-des-trois.releves-evacues");
  const coloniesDisponibles = faits.has(
    "couronne.colonies.voie-alliee-preparee",
  );
  const choix = ouvertureChoisie(faits);
  const ouvertureMaitrisee =
    (faits.has("couronne.ouverture.rail-ouverte") &&
      berceauAmorce) ||
    (faits.has("couronne.ouverture.phares-ouvertes") &&
      etalonCalibre) ||
    (faits.has("couronne.ouverture.colonies-ouvertes") &&
      precipitateurAssemble);
  const ouvertureForcee =
    choix !== "aucune" && choix !== "breche" && !ouvertureMaitrisee;
  const brecheOuverte = faits.has(
    "couronne.ouverture.breche-ouverte",
  );

  return {
    ouvertures: {
      ferroviaire: {
        statut: !railDisponible
          ? "indisponible"
          : berceauAmorce
            ? "preparee"
            : "risquee",
        acteurs: faits.has(
          "couronne.tete-de-ligne.mandat-republicain",
        )
          ? "republique"
          : faits.has("couronne.tete-de-ligne.atelier-commun")
            ? "atelier-commun"
            : "absents",
        materiaux: berceauAmorce ? 2 : 6,
      },
      phares: {
        statut: !pharesDisponibles
          ? "indisponible"
          : etalonCalibre
            ? "preparee"
            : "risquee",
        acteurs: faits.has(
          "couronne.veille-des-trois.sanctuaire-renforce",
        )
          ? "pelerins"
          : faits.has(
                "couronne.veille-des-trois.releves-evacues",
              )
            ? "releveurs"
            : "absents",
        eau: etalonCalibre ? 2 : 8,
      },
      colonies: {
        statut: !coloniesDisponibles
          ? "indisponible"
          : precipitateurAssemble
            ? "preparee"
            : "risquee",
        acteurs: coloniesDisponibles
          ? "coalition"
          : voieDesColonies.serresDeVerre.interaction ===
                "passage-force"
            ? "delegations-fragiles"
            : "absents",
        eau: precipitateurAssemble ? 2 : 4,
        materiaux: precipitateurAssemble ? 2 : 4,
      },
      breche: { statut: "toujours-disponible" },
    },
    projets: {
      berceau: {
        diagnostic: berceauAmorce
          ? "portance-confirmee"
          : "portance-inconnue",
        preparation: berceauAmorce ? "amorcee" : "absente",
        reduction: berceauAmorce ? 4 : 0,
      },
      etalon: {
        diagnostic: etalonCalibre
          ? "frequences-calibrees"
          : "frequences-inconnues",
        preparation: etalonCalibre ? "calibree" : "absente",
        reduction: etalonCalibre ? 6 : 0,
      },
      precipitateur: {
        diagnostic: precipitateurAssemble
          ? "decharges-cartographiees"
          : "decharges-inconnues",
        preparation: precipitateurAssemble ? "assemble" : "absente",
        reduction: precipitateurAssemble ? 4 : 0,
      },
    },
    conseil: {
      republique: approches.delegations.republique,
      pelerins: approches.delegations.pelerins,
      puitsLibres: coloniesDisponibles
        ? "mandatee"
        : approches.delegations.puitsLibres,
    },
    ouvertureChoisie: choix,
    noeud: brecheOuverte
      ? "endommage"
      : ouvertureForcee
        ? "contraint"
        : ouvertureMaitrisee
          ? "intact"
          : "inaccessible",
    solutions: {
      ancrer:
        berceauAmorce && !brecheOuverte ? "preparee" : "risquee",
      reaccorder: brecheOuverte
        ? "impossible"
        : etalonCalibre
          ? "preparee"
          : "risquee",
      precipiter:
        precipitateurAssemble && !brecheOuverte
          ? "preparee"
          : "risquee",
    },
    gardeDeLaClef: faits.has(
      "couronne.ouverture.clef-confiee-aux-gardiennes",
    )
      ? "gardiennes"
      : faits.has("couronne.ouverture.clef-collective")
        ? "collective"
        : "indecise",
  };
}

export function choixDeLOuvertureDeLaCouronneEstDisponible(
  contexte: ContexteDeLOuverture,
  choixId: string,
): boolean {
  const etat = reconstruireEtatDeLOuvertureDeLaCouronne(contexte);
  const materiaux =
    contexte.pilotage.economie.stocks.materiaux.quantite;
  const eau = contexte.pilotage.economie.stocks.eau.quantite;
  const faits = idsDeFaits(contexte);
  const exigences: Readonly<
    Record<
      string,
      {
        readonly ouverture: StatutDUneOuverture;
        readonly attendu: StatutDUneOuverture;
        readonly ressources: boolean;
      }
    >
  > = {
    "ouvrir-par-les-rails": {
      ouverture: etat.ouvertures.ferroviaire.statut,
      attendu: etat.ouvertures.ferroviaire.statut,
      ressources:
        etat.ouvertures.ferroviaire.statut !== "indisponible" &&
        materiaux >= etat.ouvertures.ferroviaire.materiaux,
    },
    "ouvrir-par-les-phares": {
      ouverture: etat.ouvertures.phares.statut,
      attendu: etat.ouvertures.phares.statut,
      ressources:
        etat.ouvertures.phares.statut !== "indisponible" &&
        eau >= etat.ouvertures.phares.eau,
    },
    "ouvrir-par-les-colonies": {
      ouverture: etat.ouvertures.colonies.statut,
      attendu: etat.ouvertures.colonies.statut,
      ressources:
        etat.ouvertures.colonies.statut !== "indisponible" &&
        eau >= etat.ouvertures.colonies.eau &&
        materiaux >= etat.ouvertures.colonies.materiaux,
    },
  };
  const exigence = exigences[choixId];
  if (exigence !== undefined) {
    return (
      exigence.ouverture === exigence.attendu &&
      exigence.ressources
    );
  }
  if (choixId === "confier-clef-aux-gardiennes") {
    return (
      faits.has("couronne.approches.plans-confies-a-ilyana") ||
      faits.has("couronne.seuil.registre-confie-a-maelys")
    );
  }
  return true;
}

export function ajusterEffetsDeLOuvertureDeLaCouronne(
  contexte: ContexteDeLOuverture,
  evenementId: string,
  choixId: string,
  effets: readonly EffetDEvenement[],
): readonly EffetDEvenement[] {
  if (
    evenementId !==
    "couronne.ouverture.le-dernier-conseil-de-la-couronne"
  ) {
    return effets;
  }
  const ouverture =
    reconstruireEtatDeLOuvertureDeLaCouronne(contexte).ouvertures;
  const couts: Readonly<Record<string, Partial<Record<"eau" | "materiaux", number>>>> = {
    "ouvrir-par-les-rails": {
      materiaux: -ouverture.ferroviaire.materiaux,
    },
    "ouvrir-par-les-phares": {
      eau: -ouverture.phares.eau,
    },
    "ouvrir-par-les-colonies": {
      eau: -ouverture.colonies.eau,
      materiaux: -ouverture.colonies.materiaux,
    },
  };
  const cout = couts[choixId];
  return cout === undefined
    ? effets
    : effets.map((effet) =>
        effet.type === "stock.modifier" &&
        (effet.stock === "eau" || effet.stock === "materiaux") &&
        cout[effet.stock] !== undefined
          ? { ...effet, valeur: cout[effet.stock]! }
          : effet,
      );
}

export function passageFinalDeLaCouronneEstPrepare(
  tronconId: string,
  faits: readonly string[],
): boolean {
  const conseilTermine =
    faits.includes(
      "couronne.ouverture.clef-confiee-aux-gardiennes",
    ) || faits.includes("couronne.ouverture.clef-collective");
  if (!conseilTermine) {
    return false;
  }
  if (tronconId === "breche-de-secours-du-noeud") {
    return faits.includes("couronne.ouverture.breche-ouverte");
  }
  return [
    "couronne.ouverture.rail-ouverte",
    "couronne.ouverture.phares-ouvertes",
    "couronne.ouverture.colonies-ouvertes",
  ].some((id) => faits.includes(id));
}
