import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";

export interface ProjectionDeVeilleBasse {
  readonly visible: boolean;
  readonly titre: string;
  readonly libelles: {
    readonly pressions: string;
    readonly marche: string;
    readonly devenir: string;
    readonly origine: string;
    readonly destination: string;
    readonly taille: string;
    readonly etatDominant: string;
    readonly specialite: string;
    readonly memoire: string;
    readonly integration: string;
    readonly decision: string;
    readonly position: string;
    readonly releve: string;
    readonly revelation: string;
  };
  readonly colonie: {
    readonly nom: string;
    readonly type: string;
    readonly statut: string;
    readonly pressions: readonly string[];
    readonly marche: readonly string[];
    readonly archives: string;
    readonly techniciens: string;
    readonly avertissement: string | null;
  };
  readonly hospice: {
    readonly nom: string;
    readonly type: string;
    readonly besoin: string;
    readonly devenir: string;
  };
  readonly cohorte: {
    readonly nom: string;
    readonly origine: string;
    readonly destination: string;
    readonly taille: string;
    readonly etatDominant: string;
    readonly specialite: string;
    readonly memoire: string;
    readonly integration: string;
  };
  readonly maelys: {
    readonly nom: string;
    readonly decision: string;
    readonly position: string;
    readonly releve: string;
  };
  readonly revelationsEssentielles: readonly string[];
}

const PROJECTION_MASQUEE: ProjectionDeVeilleBasse = {
  visible: false,
  titre: "",
  libelles: {
    pressions: "",
    marche: "",
    devenir: "",
    origine: "",
    destination: "",
    taille: "",
    etatDominant: "",
    specialite: "",
    memoire: "",
    integration: "",
    decision: "",
    position: "",
    releve: "",
    revelation: "",
  },
  colonie: {
    nom: "",
    type: "",
    statut: "",
    pressions: [],
    marche: [],
    archives: "",
    techniciens: "",
    avertissement: null,
  },
  hospice: { nom: "", type: "", besoin: "", devenir: "" },
  cohorte: {
    nom: "",
    origine: "",
    destination: "",
    taille: "",
    etatDominant: "",
    specialite: "",
    memoire: "",
    integration: "",
  },
  maelys: { nom: "", decision: "", position: "", releve: "" },
  revelationsEssentielles: [],
};

export function projeterVeilleBasse(
  etat: EtatCampagne,
  langue: Langue,
): ProjectionDeVeilleBasse {
  const presentations = lirePresentationsPremium();
  if (presentations === null) {
    return PROJECTION_MASQUEE;
  }
  const textes = presentations.veilleBasse[langue];
  const veilleBasse = etat.veilleBasse;
  return {
    visible: etat.routes.position === "veille-basse",
    titre: textes.titre,
    libelles: {
      pressions: textes.libellePressions,
      marche: textes.libelleMarche,
      devenir: textes.libelleDevenir,
      origine: textes.libelleOrigine,
      destination: textes.libelleDestination,
      taille: textes.libelleTaille,
      etatDominant: textes.libelleEtatDominant,
      specialite: textes.libelleSpecialite,
      memoire: textes.libelleMemoire,
      integration: textes.libelleIntegration,
      decision: textes.libelleDecision,
      position: textes.libellePosition,
      releve: textes.libelleReleve,
      revelation: textes.libelleRevelation,
    },
    colonie: {
      nom: textes.veilleBasse,
      type: textes.typeColonie,
      statut: textes.statuts[veilleBasse.colonie.statut],
      pressions: veilleBasse.colonie.pressions.map(
        (pression) => textes.pressions[pression],
      ),
      marche: veilleBasse.colonie.marche
        .filter((offre) => offre.statut === "disponible")
        .map((offre) => textes.marche[offre.id]),
      archives: textes.archives[veilleBasse.colonie.archives.etat],
      techniciens: `${veilleBasse.colonie.techniciens.equipesDisponibles} ${textes.equipes} — ${
        textes.affectations[veilleBasse.colonie.techniciens.affectation]
      }`,
      avertissement:
        veilleBasse.colonie.avertissementDePerte === null
          ? null
          : textes.avertissement,
    },
    hospice: {
      nom: textes.hospice,
      type: textes.typeHospice,
      besoin: textes.besoin,
      devenir: textes.devenirs[veilleBasse.hospiceDuSillon.devenir],
    },
    cohorte: {
      nom: textes.cohorte,
      origine: textes.origine,
      destination: textes.destinations[veilleBasse.cohorte.destination],
      taille: `${veilleBasse.cohorte.taille} ${textes.personnes}`,
      etatDominant: textes.etatDominant,
      specialite: textes.specialite,
      memoire: textes.memoires[veilleBasse.cohorte.memoire],
      integration: textes.integrations[veilleBasse.cohorte.integration.statut],
    },
    maelys: {
      nom: textes.maelys,
      decision:
        textes.decisionsDeMaelys[veilleBasse.maelysRive.decision ?? "aucune"],
      position: textes.positionsDeMaelys[veilleBasse.maelysRive.position],
      releve:
        textes.relevesDeMaelys[veilleBasse.maelysRive.releveDeLHospice],
    },
    revelationsEssentielles:
      veilleBasse.revelationsEssentielles.length === 0
        ? []
        : [textes.revelation],
  };
}
