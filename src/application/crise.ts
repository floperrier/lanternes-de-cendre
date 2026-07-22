import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  DEFINITIONS_DES_REPONSES_A_LA_CRISE,
  reponseALaCriseEstViable,
  type GarantieDeRecuperation,
  type IdentifiantDeReponseALaCrise,
} from "../simulation/crise";

export interface ProjectionDeReponseALaCrise {
  readonly id: IdentifiantDeReponseALaCrise;
  readonly intention: string;
  readonly coutConnu: string;
  readonly consequence: string;
  readonly mitigation: string;
  readonly pireConsequence: string;
  readonly attribution: string;
  readonly dernierRecours: boolean;
  readonly viable: boolean;
  readonly refus: string | null;
}

export interface ProjectionDeCriseActive {
  readonly id: "penurie-eau.pompe-purification";
  readonly titre: string;
  readonly cause: string;
  readonly chaineVisible: readonly string[];
  readonly instruction: string;
  readonly reponses: readonly ProjectionDeReponseALaCrise[];
}

export interface ProjectionDesCrises {
  readonly alerte: {
    readonly titre: string;
    readonly cause: string;
    readonly echeance: string;
  } | null;
  readonly active: ProjectionDeCriseActive | null;
  readonly cicatrices: readonly {
    readonly id: string;
    readonly titre: string;
    readonly cause: string;
    readonly consequence: string;
  }[];
  readonly recuperations: readonly {
    readonly id: string;
    readonly garantie: string;
    readonly destination: string;
    readonly horizon: string;
    readonly condition: string;
    readonly statut: string;
  }[];
}

const TEXTES = {
  fr: {
    alerteTitre: "Aggravation annoncée — purification instable",
    alerteCause:
      "La pompe maintenue en service peut contaminer la réserve dans une fenêtre de décision.",
    criseTitre: "Crise — Eau purifiée contaminée",
    criseCause:
      "Le débit maintenu malgré le joint dégradé a contaminé la réserve.",
    chaine: [
      "Pompe maintenue en service malgré le joint dégradé.",
      "Contamination annoncée pendant une fenêtre de décision.",
      "Rupture : 16 L restent utilisables.",
    ],
    instruction:
      "Le Temps du convoi est suspendu. Choisissez une réponse irréversible.",
    reponses: {
      "isoler-et-rationner": {
        intention: "Isoler le circuit et rationner l’Eau",
        coutConnu: "4 Matériaux",
        consequence: "La purification reste indisponible et l’Eau sous tension.",
        mitigation: "Le Socle de survie distribue les 16 L restants.",
        pireConsequence:
          "Une nouvelle pénurie surviendra sans capacité de purification.",
        attribution: "Équipes de purification",
      },
      "mobiliser-les-remedes": {
        intention: "Mobiliser les Remèdes pour maintenir la mobilité",
        coutConnu: "5 Remèdes",
        consequence: "Les soins du prochain Tronçon seront fragilisés.",
        mitigation: "La mobilité minimale vers Haut-Puits est préservée.",
        pireConsequence: "Une blessure future manquera de traitement.",
        attribution: "Équipes médicales",
      },
      "evacuer-les-foyers-exposes": {
        intention: "Évacuer les Foyers exposés vers Haut-Puits",
        coutConnu: "8 Habitants évacués",
        consequence: "Les Foyers perdent durablement huit Habitants.",
        mitigation: "Une aide extérieure précise reste accessible.",
        pireConsequence:
          "Haut-Puits peut accueillir les évacués sans garantir leur retour.",
        attribution: "Foyers exposés du convoi",
      },
    },
    refus: "Ressources insuffisantes pour cette réponse.",
    cicatrices: {
      "cicatrice.rationnement-deau": "Rationnement de l’Eau",
      "cicatrice.reserve-de-remedes-entamee": "Réserve de Remèdes entamée",
      "cicatrice.evacuation-des-foyers": "Évacuation des Foyers",
    },
    consequencesCicatrices: {
      "cicatrice.rationnement-deau":
        "L’Eau reste rationnée jusqu’à la remise en service de la purification.",
      "cicatrice.reserve-de-remedes-entamee":
        "La réserve médicale entamée fragilise les soins du prochain Tronçon.",
      "cicatrice.evacuation-des-foyers":
        "Huit Habitants manquent désormais aux Foyers après l’évacuation.",
    },
    causes: {
      "crise.purification.isoler-et-rationner": "Isolement et rationnement",
      "crise.purification.mobiliser-les-remedes": "Remèdes mobilisés",
      "crise.purification.evacuer-les-foyers-exposes":
        "Évacuation de dernier recours",
    },
    garanties: {
      "socle-de-survie": "Socle de survie préservé",
      "mobilite-minimale": "Mobilité minimale préservée",
      "aide-exterieure-identifiee": "Aide extérieure identifiée",
    },
    destinations: {
      "halte-du-puits-sec": "Halte du puits sec",
      "haut-puits": "Haut-Puits",
    },
    conditionsRecuperation: {
      "socle-de-survie":
        "Construire ou obtenir une capacité de purification.",
      "mobilite-minimale":
        "Rejoindre Haut-Puits et négocier l’accès à sa citerne.",
      "aide-exterieure-identifiee":
        "Demander l’accueil et l’Eau d’urgence de Haut-Puits.",
    },
    horizon: (nombre: number) => `sous ${nombre} Tronçon${nombre > 1 ? "s" : ""}`,
    statut: "Récupération amorcée",
  },
  en: {
    alerteTitre: "Escalation announced — unstable purification",
    alerteCause:
      "Keeping the pump running may contaminate the reserve within one decision window.",
    criseTitre: "Crisis — Purified water contaminated",
    criseCause:
      "Keeping the flow despite the degraded seal contaminated the reserve.",
    chaine: [
      "Pump kept running despite its degraded seal.",
      "Contamination announced for one decision window.",
      "Shortage: 16 L remain usable.",
    ],
    instruction:
      "Convoy Time is paused. Choose an irreversible response.",
    reponses: {
      "isoler-et-rationner": {
        intention: "Isolate the circuit and ration Water",
        coutConnu: "4 Materials",
        consequence: "Purification stays offline and Water remains strained.",
        mitigation: "The survival baseline distributes the remaining 16 L.",
        pireConsequence:
          "Another shortage will follow without purification capacity.",
        attribution: "Purification crews",
      },
      "mobiliser-les-remedes": {
        intention: "Use Remedies to preserve mobility",
        coutConnu: "5 Remedies",
        consequence: "Care during the next segment will be weakened.",
        mitigation: "Minimum mobility toward High Well is preserved.",
        pireConsequence: "A future injury may go untreated.",
        attribution: "Medical crews",
      },
      "evacuer-les-foyers-exposes": {
        intention: "Evacuate exposed Hearths toward High Well",
        coutConnu: "8 inhabitants evacuated",
        consequence: "The Hearths permanently lose eight inhabitants.",
        mitigation: "Specific outside help remains reachable.",
        pireConsequence:
          "High Well may shelter the evacuees without ensuring their return.",
        attribution: "Exposed Convoy Hearths",
      },
    },
    refus: "Available resources cannot cover this response.",
    cicatrices: {
      "cicatrice.rationnement-deau": "Water rationing",
      "cicatrice.reserve-de-remedes-entamee": "Remedy reserve depleted",
      "cicatrice.evacuation-des-foyers": "Hearth evacuation",
    },
    consequencesCicatrices: {
      "cicatrice.rationnement-deau":
        "Water remains rationed until purification is restored.",
      "cicatrice.reserve-de-remedes-entamee":
        "The depleted medical reserve weakens care on the next segment.",
      "cicatrice.evacuation-des-foyers":
        "Eight inhabitants are now missing from the Hearths after evacuation.",
    },
    causes: {
      "crise.purification.isoler-et-rationner": "Isolation and rationing",
      "crise.purification.mobiliser-les-remedes": "Remedies mobilized",
      "crise.purification.evacuer-les-foyers-exposes":
        "Last-resort evacuation",
    },
    garanties: {
      "socle-de-survie": "Survival baseline preserved",
      "mobilite-minimale": "Minimum mobility preserved",
      "aide-exterieure-identifiee": "Identified outside help",
    },
    destinations: {
      "halte-du-puits-sec": "Dry Well Halt",
      "haut-puits": "High Well",
    },
    conditionsRecuperation: {
      "socle-de-survie": "Build or obtain purification capacity.",
      "mobilite-minimale":
        "Reach High Well and negotiate access to its cistern.",
      "aide-exterieure-identifiee":
        "Request emergency shelter and Water from High Well.",
    },
    horizon: (nombre: number) =>
      `within ${nombre} route segment${nombre > 1 ? "s" : ""}`,
    statut: "Recovery underway",
  },
} as const;

function formaterEcheance(secondes: number, langue: Langue): string {
  const minutes = Math.ceil(secondes / 60);
  return langue === "fr"
    ? `dans ${minutes} min`
    : `in ${minutes} min`;
}

function libellerGarantie(
  garantie: GarantieDeRecuperation,
  langue: Langue,
): string {
  return TEXTES[langue].garanties[garantie];
}

export function projeterCrises(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDesCrises {
  const textes = TEXTES[langue];
  const alerte = etat.crises.alerte;
  const active = etat.crises.criseActive;
  return {
    alerte:
      alerte === null || active !== null
        ? null
        : {
            titre: textes.alerteTitre,
            cause: textes.alerteCause,
            echeance: formaterEcheance(
              Math.max(0, alerte.ruptureA - etat.tempsDuConvoi.secondes),
              langue,
            ),
          },
    active:
      active === null
        ? null
        : {
            id: active.id,
            titre: textes.criseTitre,
            cause: textes.criseCause,
            chaineVisible: textes.chaine,
            instruction: textes.instruction,
            reponses: DEFINITIONS_DES_REPONSES_A_LA_CRISE.map((reponse) => {
              const viable = reponseALaCriseEstViable(
                reponse,
                etat.pilotage,
                etat.citeCaravane.habitants,
              );
              return {
                id: reponse.id,
                ...textes.reponses[reponse.id],
                dernierRecours: reponse.dernierRecours,
                viable,
                refus: viable ? null : textes.refus,
              };
            }),
          },
    cicatrices: etat.crises.cicatrices.map((cicatrice) => ({
      id: cicatrice.id,
      titre: textes.cicatrices[cicatrice.id],
      cause: textes.causes[cicatrice.cause],
      consequence: textes.consequencesCicatrices[cicatrice.id],
    })),
    recuperations: etat.crises.recuperations.map((recuperation) => ({
      id: recuperation.id,
      garantie: libellerGarantie(recuperation.garantie, langue),
      destination: textes.destinations[recuperation.destination],
      horizon: textes.horizon(recuperation.horizonTroncons),
      condition: textes.conditionsRecuperation[recuperation.garantie],
      statut: textes.statut,
    })),
  };
}
