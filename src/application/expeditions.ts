import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  COMPROMIS_D_ORDRE_VANNES_GRISES,
  type IdentifiantDExpedition,
} from "../simulation/expeditions";
import type {
  IntentionDOrdreDistant,
  RapportDExpedition,
} from "../simulation/expeditions";
import type { IdentifiantDeStock } from "../simulation/pilotage";

export interface ProjectionDExpedition {
  readonly id: IdentifiantDExpedition;
  readonly statut: EtatCampagne["expeditions"]["operations"][0]["statut"];
  readonly statutLibelle: string;
  readonly titre: string;
  readonly libelles: {
    readonly expedition: string;
    readonly atelier: string;
    readonly mandat: string;
    readonly objectif: string;
    readonly repli: string;
    readonly responsable: string;
    readonly groupe: string;
    readonly equipement: string;
    readonly autonomie: string;
    readonly seuil: string;
    readonly prevision: string;
    readonly coutsConnus: string;
    readonly duree: string;
    readonly gain: string;
    readonly risque: string;
    readonly mitigation: string;
    readonly pireConsequence: string;
    readonly rapports: string;
    readonly cause: string;
    readonly bilan: string;
    readonly prevu: string;
    readonly realise: string;
    readonly ecart: string;
    readonly ecartsAutonomes: string;
    readonly ordres: string;
    readonly blessures: string;
    readonly renseignements: string;
    readonly engagements: string;
    readonly cicatrices: string;
    readonly aucun: string;
    readonly faitConnu: string;
    readonly source: string;
    readonly recommandation: string;
    readonly enjeuPersonnel: string;
    readonly decision: string;
    readonly recommandee: string;
  };
  readonly mandat: {
    readonly objectif: string;
    readonly issueDeRepli: string;
    readonly responsable: string;
    readonly groupe: string;
    readonly equipement: string;
    readonly enveloppeAutonomie: string;
    readonly seuilDeRepli: string;
  };
  readonly prevision: {
    readonly coutsConnus: readonly string[];
    readonly duree: {
      readonly intervalle: string;
      readonly source: string;
      readonly age: string;
    };
    readonly gain: {
      readonly intervalle: string;
      readonly source: string;
      readonly age: string;
    };
    readonly risque: {
      readonly nom: string;
      readonly mitigation: string;
      readonly pireConsequence: string;
    };
  };
  readonly actionPrincipale: string | null;
  readonly actionPrincipaleDisponible: boolean;
  readonly refusLancement: string | null;
  readonly suivi: {
    readonly progressionPourcent: number;
    readonly progression: string;
    readonly duree: string;
    readonly contact: string;
    readonly rapports: readonly {
      readonly type: RapportDExpedition["type"];
      readonly moment: string;
      readonly titre: string;
      readonly cause: string;
    }[];
  } | null;
  readonly ordreImportant: {
    readonly titre: string;
    readonly faitConnu: string;
    readonly source: string;
    readonly recommandation: string;
    readonly enjeuPersonnel: string;
    readonly regleTemps: string;
    readonly options: readonly {
      readonly id: IntentionDOrdreDistant;
      readonly intention: string;
      readonly consequences: string;
      readonly source: string;
      readonly age: string;
      readonly recommandee: boolean;
    }[];
  } | null;
  readonly bilan: {
    readonly titre: string;
    readonly duree: { readonly prevue: string; readonly realisee: string };
    readonly gain: { readonly prevu: string; readonly realise: string };
    readonly causeEcart: string;
    readonly ecarts: readonly string[];
    readonly couts: readonly string[];
    readonly ordres: readonly string[];
    readonly blessures: readonly string[];
    readonly renseignements: readonly string[];
    readonly engagements: readonly string[];
    readonly cicatrices: readonly string[];
  } | null;
}

const TEXTES = {
  fr: {
    titre: "Station des Vannes Grises",
    objectif: "Rétablir un débit exploitable",
    issueDeRepli: "Cartographier l’accès et rentrer",
    groupe: "4 Habitants",
    equipement: "Filtres doubles",
    enveloppeAutonomie: "Écart réversible ≤ 45 min et au plus 1 Remède",
    seuilDeRepli: "Repli à la première blessure",
    coutOpportunite: "Coût d’opportunité : Liora quitte Atelier–Opérations",
    sourceDuree: "Itinéraire des Vanniers",
    sourceGain: "Débit mesuré par les Vanniers",
    risque: "Exposition à la cendre — marquée",
    pireConsequence: "Blessure d’un membre de l’équipe",
    actionLancer: "Confirmer le mandat et lancer",
    stocksInsuffisants:
      "Départ impossible : les coûts connus exacts dépassent les stocks disponibles.",
    statuts: {
      prete: "Prête au départ",
      "en-cours": "En opération",
      "ordre-requis": "Ordre requis",
      retour: "Retour autonome",
      terminee: "Bilan reçu",
    },
    contact: {
      "en-cours": "Radio stable",
      "ordre-requis": "Équipe en attente",
      retour: "Retour autonome",
      terminee: "Équipe revenue",
    },
    rapports: {
      depart: "Mandat confirmé",
      "jalon.canal-sec": "Canal sec atteint",
      "ecart.passerelle-rompue": "Passerelle rompue : détour autonome",
      "ecart.sas-contamine": "Sas contaminé traité sans ordre",
      "ecart.salle-des-pompes-alimentee":
        "Ordre demandé depuis le hall filtré",
      "ordre.couper-contourner": "Ordre transmis : couper puis contourner",
      "ordre.forcer-galerie": "Ordre transmis : forcer la galerie",
      "ordre.ordonner-repli": "Ordre transmis : repli",
    },
    ordre: {
      titre: "La salle des pompes est encore alimentée",
      faitConnu: "Galerie praticable encore 20 à 35 min.",
      source: "Capteur de l’équipe — maintenant",
      recommandation: "Couper l’alimentation et préserver l’équipe.",
      enjeuPersonnel: "Ne pas franchir le seuil de blessure promis.",
      regleTemps:
        "L’Expédition attend ; le Temps du convoi continue et reste suspendable manuellement.",
      sourceOptions: "Projection de Liora",
      ageOptions: "maintenant",
      options: {
        "couper-contourner": {
          intention: "Couper puis contourner",
          exposition: "exposition réduite",
        },
        "forcer-galerie": {
          intention: "Forcer la galerie",
          exposition: "exposition forte",
        },
        "ordonner-repli": {
          intention: "Ordonner le repli",
          exposition: "renseignement conservé",
        },
      },
    },
    bilan: {
      titres: {
        "couper-contourner": "Pompe partiellement réamorcée",
        "forcer-galerie": "Pompe réamorcée sous exposition",
        "ordonner-repli": "Équipe rentrée sans la pompe",
      },
      causes: {
        "couper-contourner":
          "Alimentation coupée ; débit réduit, retour sûr.",
        "forcer-galerie":
          "Galerie forcée ; une exposition a été traitée.",
        "ordonner-repli": "Repli ordonné avant la salle des pompes.",
      },
      blessures: {
        "exposition-cendre-traitee": "Exposition à la cendre traitée",
      },
      renseignements: {
        "debit-reduit-vannes-grises-confirme":
          "Débit réduit des Vannes Grises confirmé",
        "debit-fort-vannes-grises-confirme":
          "Débit fort des Vannes Grises confirmé",
        "salle-des-pompes-balisee": "Salle des pompes balisée",
      },
      cicatrices: {
        "liora.exposition-prolongee": "Liora — exposition prolongée",
      },
      ecarts: {
        "passerelle-rompue": "Passerelle rompue : détour réversible",
        "sas-contamine": "Sas contaminé : filtre double engagé",
        "alimentation-coupee": "Alimentation coupée : débit réduit",
        "galerie-forcee": "Galerie forcée : exposition traitée",
        "repli-ordonne": "Repli ordonné : équipe intacte",
      },
    },
  },
  en: {
    titre: "Grey Sluices Station",
    objectif: "Restore a usable flow",
    issueDeRepli: "Map the access and return",
    groupe: "4 inhabitants",
    equipement: "Double filters",
    enveloppeAutonomie: "Reversible deviation ≤ 45 min and at most 1 Remedy",
    seuilDeRepli: "Withdraw at the first injury",
    coutOpportunite: "Opportunity cost: Liora leaves Workshop–Operations",
    sourceDuree: "Sluice Keepers’ itinerary",
    sourceGain: "Flow measured by the Sluice Keepers",
    risque: "Ash exposure — marked",
    pireConsequence: "Injury to one team member",
    actionLancer: "Confirm mandate and launch",
    stocksInsuffisants:
      "Departure unavailable: exact known costs exceed available stocks.",
    statuts: {
      prete: "Ready to depart",
      "en-cours": "In operation",
      "ordre-requis": "Order required",
      retour: "Autonomous return",
      terminee: "Report received",
    },
    contact: {
      "en-cours": "Radio stable",
      "ordre-requis": "Team waiting",
      retour: "Autonomous return",
      terminee: "Team returned",
    },
    rapports: {
      depart: "Mandate confirmed",
      "jalon.canal-sec": "Dry channel reached",
      "ecart.passerelle-rompue": "Broken footbridge: autonomous detour",
      "ecart.sas-contamine": "Contaminated airlock handled without an order",
      "ecart.salle-des-pompes-alimentee":
        "Order requested from the filtered hall",
      "ordre.couper-contourner": "Order sent: cut power and go around",
      "ordre.forcer-galerie": "Order sent: force through the gallery",
      "ordre.ordonner-repli": "Order sent: withdraw",
    },
    ordre: {
      titre: "The pump room is still powered",
      faitConnu: "The gallery remains passable for 20 to 35 min.",
      source: "Team sensor — now",
      recommandation: "Cut the power and preserve the team.",
      enjeuPersonnel: "Do not cross the promised injury threshold.",
      regleTemps:
        "The Expedition waits; Convoy Time continues and can still be paused manually.",
      sourceOptions: "Liora’s projection",
      ageOptions: "now",
      options: {
        "couper-contourner": {
          intention: "Cut power and go around",
          exposition: "reduced exposure",
        },
        "forcer-galerie": {
          intention: "Force through the gallery",
          exposition: "high exposure",
        },
        "ordonner-repli": {
          intention: "Order a withdrawal",
          exposition: "intelligence retained",
        },
      },
    },
    bilan: {
      titres: {
        "couper-contourner": "Pump partially restarted",
        "forcer-galerie": "Pump restarted under exposure",
        "ordonner-repli": "Team returned without the pump",
      },
      causes: {
        "couper-contourner": "Power cut; reduced flow, safe return.",
        "forcer-galerie": "Gallery forced; one exposure was treated.",
        "ordonner-repli": "Withdrawal ordered before the pump room.",
      },
      blessures: {
        "exposition-cendre-traitee": "Treated ash exposure",
      },
      renseignements: {
        "debit-reduit-vannes-grises-confirme":
          "Reduced Grey Sluices flow confirmed",
        "debit-fort-vannes-grises-confirme":
          "Strong Grey Sluices flow confirmed",
        "salle-des-pompes-balisee": "Pump room marked",
      },
      cicatrices: {
        "liora.exposition-prolongee": "Liora — prolonged exposure",
      },
      ecarts: {
        "passerelle-rompue": "Broken footbridge: reversible detour",
        "sas-contamine": "Contaminated airlock: double filter used",
        "alimentation-coupee": "Power cut: reduced flow",
        "galerie-forcee": "Gallery forced: exposure treated",
        "repli-ordonne": "Withdrawal ordered: team intact",
      },
    },
  },
} as const;

const LIBELLES: Readonly<Record<Langue, ProjectionDExpedition["libelles"]>> = {
  fr: {
    expedition: "Expédition",
    atelier: "Atelier–Opérations · Opération cartographiée",
    mandat: "Mandat borné",
    objectif: "Objectif",
    repli: "Issue de repli",
    responsable: "Responsable",
    groupe: "Groupe agrégé",
    equipement: "Équipement",
    autonomie: "Enveloppe d’autonomie",
    seuil: "Seuil de repli",
    prevision: "Bilan prévisionnel",
    coutsConnus: "Coûts connus exacts",
    duree: "Durée incertaine",
    gain: "Gain incertain",
    risque: "Risque nommé",
    mitigation: "Mitigation",
    pireConsequence: "Pire conséquence",
    rapports: "Rapports fixes et écarts autonomes",
    cause: "Cause",
    bilan: "Bilan de retour",
    prevu: "Prévu",
    realise: "Réalisé",
    ecart: "Cause de l’écart",
    ecartsAutonomes: "Écarts et conséquences",
    ordres: "Ordres",
    blessures: "Blessures",
    renseignements: "Renseignements",
    engagements: "Engagements",
    cicatrices: "Cicatrices",
    aucun: "Aucun",
    faitConnu: "Fait connu",
    source: "Source",
    recommandation: "Recommandation",
    enjeuPersonnel: "Enjeu personnel",
    decision: "Intention du Porte-Lanterne",
    recommandee: "Recommandé",
  },
  en: {
    expedition: "Expedition",
    atelier: "Workshop–Operations · Mapped operation",
    mandat: "Bounded mandate",
    objectif: "Objective",
    repli: "Fallback outcome",
    responsable: "Lead",
    groupe: "Aggregated group",
    equipement: "Equipment",
    autonomie: "Autonomy envelope",
    seuil: "Withdrawal threshold",
    prevision: "Forecast",
    coutsConnus: "Exact known costs",
    duree: "Uncertain duration",
    gain: "Uncertain gain",
    risque: "Named risk",
    mitigation: "Mitigation",
    pireConsequence: "Worst consequence",
    rapports: "Fixed reports and autonomous deviations",
    cause: "Cause",
    bilan: "Return report",
    prevu: "Expected",
    realise: "Actual",
    ecart: "Cause of deviation",
    ecartsAutonomes: "Deviations and consequences",
    ordres: "Orders",
    blessures: "Injuries",
    renseignements: "Intelligence",
    engagements: "Commitments",
    cicatrices: "Scars",
    aucun: "None",
    faitConnu: "Known fact",
    source: "Source",
    recommandation: "Recommendation",
    enjeuPersonnel: "Personal stake",
    decision: "Lantern-Bearer intent",
    recommandee: "Recommended",
  },
};

function formaterNombre(nombre: number, langue: Langue): string {
  return nombre.toLocaleString(langue === "fr" ? "fr-FR" : "en-GB", {
    maximumFractionDigits: 1,
  });
}

function formaterDuree(secondes: number, langue: Langue): string {
  const heures = Math.floor(secondes / 3_600);
  const minutes = Math.floor((secondes % 3_600) / 60);
  return langue === "fr"
    ? `${heures} h ${minutes.toString().padStart(2, "0")}`
    : `${heures} h ${minutes.toString().padStart(2, "0")}`;
}

function formaterAge(
  releveA: number,
  secondeCourante: number,
  langue: Langue,
): string {
  const jours = Math.max(0, Math.floor((secondeCourante - releveA) / 86_400));
  return langue === "fr"
    ? `relevé il y a ${jours} j`
    : `observed ${jours} d ago`;
}

function formaterCout(
  stock: IdentifiantDeStock,
  variation: number,
  langue: Langue,
): string {
  const signe = variation < 0 ? "−" : "+";
  const valeur = formaterNombre(Math.abs(variation), langue);
  if (stock === "eau") {
    return `${langue === "fr" ? "Eau" : "Water"} : ${signe}${valeur} L`;
  }
  if (stock === "materiaux") {
    return `${langue === "fr" ? "Matériaux" : "Materials"} : ${signe}${valeur} ${langue === "fr" ? "pièces" : "parts"}`;
  }
  if (stock === "remedes") {
    const unite = Math.abs(variation) === 1 ? "dose" : "doses";
    return `${langue === "fr" ? "Remèdes" : "Remedies"} : ${signe}${valeur} ${unite}`;
  }
  if (stock === "combustible") {
    return `${langue === "fr" ? "Combustible" : "Fuel"} : ${signe}${valeur} L`;
  }
  return `${langue === "fr" ? "Vivres" : "Provisions"} : ${signe}${valeur} ${langue === "fr" ? "rations" : "rations"}`;
}

function formaterMoment(secondes: number): string {
  const heures = Math.floor(secondes / 3_600);
  const minutes = Math.floor((secondes % 3_600) / 60);
  return `${heures.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

const INTENTIONS: readonly IntentionDOrdreDistant[] = [
  "couper-contourner",
  "forcer-galerie",
  "ordonner-repli",
];

function formaterCompromisDOrdre(
  intention: IntentionDOrdreDistant,
  langue: Langue,
): string {
  const compromis = COMPROMIS_D_ORDRE_VANNES_GRISES[intention];
  if (intention === "ordonner-repli") {
    return langue === "fr"
      ? "Coûts de départ perdus · renseignement conservé"
      : "Departure costs lost · intelligence retained";
  }
  const duree = compromis.dureeSupplementaireSecondes;
  const minutesMinimum = duree.minimum / 60;
  const minutesMaximum = duree.maximum / 60;
  const intervalleDuree =
    minutesMinimum === minutesMaximum
      ? `+${minutesMinimum} min ${langue === "fr" ? "exactes" : "exact"}`
      : `+${minutesMinimum}–${minutesMaximum} min ${langue === "fr" ? "estimées" : "estimated"}`;
  const gain = compromis.gainAutonomieEauJours;
  const intervalleGain = `${langue === "fr" ? "Eau" : "Water"} +${formaterNombre(gain.minimum, langue)}–${formaterNombre(gain.maximum, langue)} ${langue === "fr" ? "j estimés" : "d estimated"}`;
  return `${intervalleDuree} · ${intervalleGain} · ${TEXTES[langue].ordre.options[intention].exposition}`;
}

export function projeterExpedition(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDExpedition {
  const operation =
    etat.expeditions.operations.find(
      (candidate) => candidate.statut === "ordre-requis",
    ) ?? etat.expeditions.operations[0];
  if (operation === undefined) {
    throw new Error("Aucune Expédition n’est disponible dans la Campagne.");
  }
  const textes = TEXTES[langue];
  const prevision = operation.prevision;
  const coutsDisponibles = prevision.coutsConnus.every(
    ({ stock, variation }) =>
      variation >= 0 ||
      etat.pilotage.economie.stocks[stock].quantite >= -variation,
  );
  const suivi =
    operation.statut === "prete"
      ? null
      : {
          progressionPourcent: operation.progressionPourcent,
          progression: `${operation.progressionPourcent} %`,
          duree: formaterDuree(operation.dureeActiveSecondes, langue),
          contact: textes.contact[operation.statut],
          rapports: operation.rapports.map((rapport) => ({
            type: rapport.type,
            moment: formaterMoment(rapport.moment),
            titre:
              rapport.type === "retour"
                ? langue === "fr"
                  ? "Équipe revenue à Atelier–Opérations"
                  : "Team returned to Workshop–Operations"
                : rapport.type === "depart"
                  ? textes.rapports.depart
                  : textes.rapports[
                      rapport.cause as keyof typeof textes.rapports
                    ],
            cause: rapport.cause,
          })),
        };
  const ordreImportant =
    operation.statut === "ordre-requis"
      ? {
          titre: textes.ordre.titre,
          faitConnu: textes.ordre.faitConnu,
          source: textes.ordre.source,
          recommandation: textes.ordre.recommandation,
          enjeuPersonnel: textes.ordre.enjeuPersonnel,
          regleTemps: textes.ordre.regleTemps,
          options: INTENTIONS.map((id) => ({
            id,
            intention: textes.ordre.options[id].intention,
            consequences: formaterCompromisDOrdre(id, langue),
            source: textes.ordre.sourceOptions,
            age: textes.ordre.ageOptions,
            recommandee: id === "couper-contourner",
          })),
        }
      : null;
  const bilan =
    operation.statut === "terminee"
      ? (() => {
          const intention = operation.ordresDistants[0].intention;
          return {
            titre: textes.bilan.titres[intention],
            duree: {
              prevue: `${formaterDuree(operation.bilan.prevision.dureeSecondes.minimum, langue)}–${formaterDuree(operation.bilan.prevision.dureeSecondes.maximum, langue)}`,
              realisee: formaterDuree(
                operation.bilan.realise.dureeSecondes,
                langue,
              ),
            },
            gain: {
              prevu: `${langue === "fr" ? "Eau" : "Water"} : +${formaterNombre(operation.bilan.prevision.gainAutonomieEauJours.minimum, langue)}–${formaterNombre(operation.bilan.prevision.gainAutonomieEauJours.maximum, langue)} ${langue === "fr" ? "j d’Autonomie" : "d of Autonomy"}`,
              realise: `${langue === "fr" ? "Eau" : "Water"} : +${formaterNombre(operation.bilan.realise.gainAutonomieEauJours, langue)} ${langue === "fr" ? "j d’Autonomie" : "d of Autonomy"}`,
            },
            causeEcart: textes.bilan.causes[intention],
            ecarts: operation.bilan.ecarts.map(
              (ecart) =>
                textes.bilan.ecarts[
                  ecart.cause as keyof typeof textes.bilan.ecarts
                ] ?? `${ecart.cause} : ${ecart.consequence}`,
            ),
            couts: operation.bilan.couts.map(({ stock, variation }) =>
              formaterCout(stock, variation, langue),
            ),
            ordres: operation.bilan.ordres.map(
              (ordre) => textes.ordre.options[ordre].intention,
            ),
            blessures: operation.bilan.blessures.map(
              (blessure) =>
                textes.bilan.blessures[
                  blessure as keyof typeof textes.bilan.blessures
                ] ?? blessure,
            ),
            renseignements: operation.bilan.renseignements.map(
              (renseignement) =>
                textes.bilan.renseignements[
                  renseignement as keyof typeof textes.bilan.renseignements
                ] ?? renseignement,
            ),
            engagements: operation.bilan.engagements,
            cicatrices: operation.bilan.cicatrices.map(
              (cicatrice) =>
                textes.bilan.cicatrices[
                  cicatrice as keyof typeof textes.bilan.cicatrices
                ] ?? cicatrice,
            ),
          };
        })()
      : null;
  return {
    id: operation.id,
    statut: operation.statut,
    statutLibelle: textes.statuts[operation.statut],
    titre: textes.titre,
    libelles: LIBELLES[langue],
    mandat: {
      objectif: textes.objectif,
      issueDeRepli: textes.issueDeRepli,
      responsable: "Liora",
      groupe: textes.groupe,
      equipement: textes.equipement,
      enveloppeAutonomie: textes.enveloppeAutonomie,
      seuilDeRepli: textes.seuilDeRepli,
    },
    prevision: {
      coutsConnus: [
        ...prevision.coutsConnus.map(({ stock, variation }) =>
          formaterCout(stock, variation, langue),
        ),
        textes.coutOpportunite,
      ],
      duree: {
        intervalle: `${formaterDuree(prevision.dureeSecondes.minimum, langue)}–${formaterDuree(prevision.dureeSecondes.maximum, langue)}`,
        source: textes.sourceDuree,
        age: formaterAge(
          prevision.sourceDuree.releveA,
          etat.tempsDuConvoi.secondes,
          langue,
        ),
      },
      gain: {
        intervalle: `${langue === "fr" ? "Eau" : "Water"} : +${formaterNombre(prevision.gainAutonomieEauJours.minimum, langue)}–${formaterNombre(prevision.gainAutonomieEauJours.maximum, langue)} ${langue === "fr" ? "j d’Autonomie" : "d of Autonomy"}`,
        source: textes.sourceGain,
        age: formaterAge(
          prevision.sourceGain.releveA,
          etat.tempsDuConvoi.secondes,
          langue,
        ),
      },
      risque: {
        nom: textes.risque,
        mitigation: textes.equipement,
        pireConsequence: textes.pireConsequence,
      },
    },
    actionPrincipale: operation.statut === "prete" ? textes.actionLancer : null,
    actionPrincipaleDisponible:
      operation.statut === "prete" && coutsDisponibles,
    refusLancement:
      operation.statut === "prete" && !coutsDisponibles
        ? textes.stocksInsuffisants
        : null,
    suivi,
    ordreImportant,
    bilan,
  };
}
