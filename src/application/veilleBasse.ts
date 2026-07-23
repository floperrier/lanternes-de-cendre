import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";

export interface ProjectionDeVeilleBasse {
  readonly titre: string;
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

const TEXTES = {
  fr: {
    titre: "Veille-Basse et l’Hospice du Sillon",
    veilleBasse: "Veille-Basse",
    typeColonie: "Colonie",
    statuts: {
      prospere: "Prospère",
      stable: "Stable",
      fragile: "Fragile",
      perdue: "Perdue",
    },
    pressions: {
      "afflux-deplaces": "Afflux de déplacés",
      "filtres-satures": "Filtres saturés",
      "cohorte-aux-portes": "Cohorte aux portes",
    },
    marche: {
      "filtres-contre-releve":
        "Échanger un relevé du Phare mobile contre des filtres étanches",
      "renfort-contre-materiaux":
        "Échanger des Matériaux de charpente contre le renfort des techniciens",
    },
    archives: {
      scellees: "Archives scellées",
      ouvertes: "Archives ouvertes — déplacement des cendres documenté",
    },
    affectations: {
      "maintien-des-filtres": "maintien des filtres",
      "renfort-des-sas": "renfort des sas",
      "lecture-des-archives": "lecture des archives",
    },
    equipes: "équipes",
    avertissement: "Perte annoncée — occasion d’intervention",
    hospice: "Hospice du Sillon",
    typeHospice: "Site habité secondaire",
    besoin: "Places filtrées",
    devenirs: {
      ouvert: "Ouvert",
      "sous-charge": "Sous Charge d’accueil",
      renforce: "Renforcé",
    },
    cohorte: "Cohorte du Sillon",
    destinations: {
      "veille-basse": "Veille-Basse",
      "cite-caravane": "Cité-caravane",
      "hospice-du-sillon": "Hospice du Sillon",
      "hors-de-veille-basse": "Routes hors de Veille-Basse",
    },
    origine: "Camp des Digues",
    personnes: "personnes",
    etatDominant: "Épuisée",
    specialite: "Charpente étanche",
    memoires: {
      aucune: "Aucune décision",
      aidee: "Aide reçue",
      refusee: "Refusée",
      redirigee: "Redirigée",
    },
    integrations: {
      "en-attente": "En attente",
      "charge-accueil": "Charge d’accueil active",
      "equipes-integrees": "2 équipes intégrées",
      refusee: "Refusée",
      redirigee: "Redirigée",
    },
    revelation: "Le Réseau ancien déplaçait la cendre vers les périphéries",
    maelys: "Maëlys Rive",
    decisionsDeMaelys: {
      aucune: "Décision en attente",
      "coffret-confie": "Coffret confié à Maëlys",
      "equipes-prioritaires": "Équipes envoyées sans Maëlys",
    },
    positionsDeMaelys: {
      "veille-basse": "À Veille-Basse",
      "hospice-du-sillon": "En mission à l’Hospice du Sillon",
    },
    relevesDeMaelys: {
      "non-planifie": "Relevé non planifié",
      "rapide-en-cours": "Relevé rapide en cours",
      "lent-en-cours": "Relevé lent en cours",
      termine: "Relevé de l’Hospice terminé",
    },
  },
  en: {
    titre: "Lower Watch and Sillon Hospice",
    veilleBasse: "Lower Watch",
    typeColonie: "Colony",
    statuts: {
      prospere: "Prosperous",
      stable: "Stable",
      fragile: "Fragile",
      perdue: "Lost",
    },
    pressions: {
      "afflux-deplaces": "Displaced influx",
      "filtres-satures": "Saturated filters",
      "cohorte-aux-portes": "Cohort at the gates",
    },
    marche: {
      "filtres-contre-releve":
        "Trade a mobile Lighthouse survey for sealed filters",
      "renfort-contre-materiaux":
        "Trade framing Materials for technician support",
    },
    archives: {
      scellees: "Archives sealed",
      ouvertes: "Archives opened — ash displacement documented",
    },
    affectations: {
      "maintien-des-filtres": "filter maintenance",
      "renfort-des-sas": "airlock reinforcement",
      "lecture-des-archives": "archive review",
    },
    equipes: "teams",
    avertissement: "Loss announced — intervention opportunity",
    hospice: "Sillon Hospice",
    typeHospice: "Secondary inhabited site",
    besoin: "Filtered spaces",
    devenirs: {
      ouvert: "Open",
      "sous-charge": "Under Welcoming Load",
      renforce: "Reinforced",
    },
    cohorte: "Sillon Cohort",
    destinations: {
      "veille-basse": "Lower Watch",
      "cite-caravane": "Caravan-city",
      "hospice-du-sillon": "Sillon Hospice",
      "hors-de-veille-basse": "Roads beyond Lower Watch",
    },
    origine: "Dike Camp",
    personnes: "people",
    etatDominant: "Exhausted",
    specialite: "Sealed-frame carpentry",
    memoires: {
      aucune: "No decision",
      aidee: "Help received",
      refusee: "Refused",
      redirigee: "Redirected",
    },
    integrations: {
      "en-attente": "Waiting",
      "charge-accueil": "Welcoming Load active",
      "equipes-integrees": "2 teams integrated",
      refusee: "Refused",
      redirigee: "Redirected",
    },
    revelation: "The Ancient Network displaced ash toward the peripheries",
    maelys: "Maëlys Rive",
    decisionsDeMaelys: {
      aucune: "Decision pending",
      "coffret-confie": "Survey case entrusted to Maëlys",
      "equipes-prioritaires": "Teams sent without Maëlys",
    },
    positionsDeMaelys: {
      "veille-basse": "At Lower Watch",
      "hospice-du-sillon": "On mission at Sillon Hospice",
    },
    relevesDeMaelys: {
      "non-planifie": "Survey not planned",
      "rapide-en-cours": "Fast survey in progress",
      "lent-en-cours": "Slow survey in progress",
      termine: "Hospice survey completed",
    },
  },
} as const;

export function projeterVeilleBasse(
  etat: EtatCampagne,
  langue: Langue,
): ProjectionDeVeilleBasse {
  const textes = TEXTES[langue];
  const veilleBasse = etat.veilleBasse;
  return {
    titre: textes.titre,
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
      destination:
        textes.destinations[veilleBasse.cohorte.destination],
      taille: `${veilleBasse.cohorte.taille} ${textes.personnes}`,
      etatDominant: textes.etatDominant,
      specialite: textes.specialite,
      memoire: textes.memoires[veilleBasse.cohorte.memoire],
      integration:
        textes.integrations[veilleBasse.cohorte.integration.statut],
    },
    maelys: {
      nom: textes.maelys,
      decision:
        textes.decisionsDeMaelys[
          veilleBasse.maelysRive.decision ?? "aucune"
        ],
      position: textes.positionsDeMaelys[veilleBasse.maelysRive.position],
      releve:
        textes.relevesDeMaelys[
          veilleBasse.maelysRive.releveDeLHospice
        ],
    },
    revelationsEssentielles:
      veilleBasse.revelationsEssentielles.length === 0
        ? []
        : [textes.revelation],
  };
}
