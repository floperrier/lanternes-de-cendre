import type { Langue } from "../content/types";
import type { CommandeCampagne, EtatCampagne } from "../simulation/campagne";
import {
  LIEUX_DE_ROUTE,
  listerTronconsEngageables,
  trouverTronconDeRoute,
  type IdentifiantDeLieu,
  type IdentifiantDeTroncon,
  type RenseignementDeRoute,
} from "../simulation/routes";
import {
  calculerOffreDesNacelles,
  routeAvalDesBassinsEstPreparee,
} from "../simulation/nacelles";

export interface RenseignementDeRouteProjete {
  readonly source: string;
  readonly age: string;
  readonly fiabilite: string;
  readonly etat: string;
  readonly meteo: string;
  readonly panache: string;
  readonly danger: string;
  readonly controlePolitique: string;
}

export interface TronconProjete {
  readonly id: IdentifiantDeTroncon;
  readonly destination: string;
  readonly connexion: string;
  readonly duree: string;
  readonly consommation: string;
  readonly engageable: boolean;
  readonly renseignements: readonly RenseignementDeRouteProjete[];
  readonly bilan: {
    readonly consequencesConnues: readonly string[];
    readonly incertitudes: readonly {
      readonly valeur: string;
      readonly source: string;
      readonly age: string;
    }[];
  };
}

export interface ProjectionDeLAtlas {
  readonly titre: string;
  readonly position: string;
  readonly libellePosition: string;
  readonly libelleRenseignements: string;
  readonly libelleBilan: string;
  readonly libelleConnu: string;
  readonly libelleIncertain: string;
  readonly libelleVueListe: string;
  readonly actionEtudier: string;
  readonly actionConfirmer: string;
  readonly actionAnnuler: string;
  readonly avertissementIrreversible: string;
  readonly engagement: {
    readonly destination: string;
    readonly arrivee: string;
    readonly retour: string;
  } | null;
  readonly dernierJalon: {
    readonly moment: string;
    readonly cause: string;
  } | null;
  readonly troncons: readonly TronconProjete[];
}

const TEXTES = {
  fr: {
    titre: "Atlas d’exploitation",
    position: "Position",
    renseignements: "Renseignements de route",
    bilan: "Bilan prévisionnel",
    connu: "Conséquences connues",
    incertain: "Intervalles incertains",
    vueListe: "Vue DOM en liste de l’Atlas",
    etudier: "Étudier l’Engagement vers",
    confirmer: "Confirmer l’Engagement sans retour vers",
    annuler: "Annuler",
    avertissement:
      "Cet Engagement est irréversible hors Crise explicite et suspendra le Temps du convoi.",
    retour: "Aucun demi-tour normal",
    causeFront: "Front de cendre — accès arrière condamné",
  },
  en: {
    titre: "Operations Atlas",
    position: "Position",
    renseignements: "Route intelligence",
    bilan: "Forecast",
    connu: "Known consequences",
    incertain: "Uncertain ranges",
    vueListe: "DOM list view of the Atlas",
    etudier: "Review the commitment to",
    confirmer: "Confirm the no-return commitment to",
    annuler: "Cancel",
    avertissement:
      "This commitment is irreversible outside an explicit Crisis and will pause convoy time.",
    retour: "No normal U-turn",
    causeFront: "Ash Front — rear access condemned",
  },
} as const;

const LIBELLES = {
  fr: {
    fiabilite: {
      confirme: "Confirmé",
      ancien: "Ancien",
      rapporte: "Rapporté",
    },
    etat: { praticable: "Praticable", degrade: "Dégradé" },
    meteo: {
      "cendre-basse": "Cendre basse",
      "rafales-de-cendre": "Rafales de cendre",
    },
    panache: {
      "derive-vers-est": "Dérive vers l’est",
      absent: "Aucun panache signalé",
      incertain: "Panache incertain",
    },
    danger: {
      saumure: "Nappe de saumure",
      visibilite: "Visibilité réduite",
    },
    controle: {
      "puits-libres": "Puits Libres",
      "pelerins-de-cendre": "Pèlerins de Cendre",
    },
    combustible: "Combustible",
    eau: "Eau",
    source: {
      "vigie-du-phare": "Vigie du Phare",
      "messagers-de-haut-puits": "Messagers de Haut-Puits",
      "relais-des-pelerins": "Relais des Pèlerins de Cendre",
    },
  },
  en: {
    fiabilite: {
      confirme: "Confirmed",
      ancien: "Old",
      rapporte: "Reported",
    },
    etat: { praticable: "Passable", degrade: "Degraded" },
    meteo: {
      "cendre-basse": "Low ash",
      "rafales-de-cendre": "Ash gusts",
    },
    panache: {
      "derive-vers-est": "Drifting east",
      absent: "No plume reported",
      incertain: "Uncertain plume",
    },
    danger: {
      saumure: "Brine sheet",
      visibilite: "Reduced visibility",
    },
    controle: {
      "puits-libres": "Free Wells",
      "pelerins-de-cendre": "Ash Pilgrims",
    },
    combustible: "Fuel",
    eau: "Water",
    source: {
      "vigie-du-phare": "Lighthouse Watch",
      "messagers-de-haut-puits": "High Well Messengers",
      "relais-des-pelerins": "Ash Pilgrims Relay",
    },
  },
} as const;

function nommerLieu(id: IdentifiantDeLieu, langue: Langue): string {
  const lieu = LIEUX_DE_ROUTE[id];
  if (lieu === undefined) {
    throw new Error(`Le Lieu de route « ${id} » n’est pas chargé.`);
  }
  return lieu.nom[langue];
}

function formaterDuree(secondes: number, langue: Langue): string {
  const minutes = Math.ceil(secondes / 60);
  return langue === "fr" ? `${minutes} min` : `${minutes} min`;
}

function formaterAge(
  releveA: number,
  secondeCourante: number,
  langue: Langue,
): string {
  const age = Math.max(0, secondeCourante - releveA);
  if (age < 60) {
    return langue === "fr" ? "relevé maintenant" : "observed now";
  }
  if (age < 3_600) {
    const minutes = Math.floor(age / 60);
    return langue === "fr"
      ? `relevé il y a ${minutes} min`
      : `observed ${minutes} min ago`;
  }
  const heures = Math.floor(age / 3_600);
  return langue === "fr"
    ? `relevé il y a ${heures} h`
    : `observed ${heures} h ago`;
}

function projeterRenseignement(
  renseignement: RenseignementDeRoute,
  secondeCourante: number,
  langue: Langue,
): RenseignementDeRouteProjete {
  const libelles = LIBELLES[langue];
  const libellesPremium = renseignement.libelles?.[langue];
  const source =
    libellesPremium?.source ??
    libelles.source[
      renseignement.source as keyof typeof libelles.source
    ];
  const danger =
    libellesPremium?.danger ??
    libelles.danger[
      renseignement.danger as keyof typeof libelles.danger
    ];
  const controlePolitique =
    libellesPremium?.controlePolitique ??
    libelles.controle[
      renseignement.controlePolitique as keyof typeof libelles.controle
    ];
  if (
    source === undefined ||
    danger === undefined ||
    controlePolitique === undefined
  ) {
    throw new Error(
      `Les libellés du Renseignement « ${renseignement.id} » ne sont pas chargés.`,
    );
  }
  return {
    source,
    age: formaterAge(renseignement.releveA, secondeCourante, langue),
    fiabilite: libelles.fiabilite[renseignement.fiabilite],
    etat: libelles.etat[renseignement.etatAnnonce],
    meteo: libelles.meteo[renseignement.meteo],
    panache: libelles.panache[renseignement.panache],
    danger,
    controlePolitique,
  };
}

function formaterMoment(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = secondes % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondesRestantes
    .toString()
    .padStart(2, "0")}`;
}

export function projeterAtlas(
  etat: EtatCampagne,
  langue: Langue = "fr",
  commandeEstAutorisee: (
    commande: Extract<
      CommandeCampagne,
      { readonly type: "engagement-de-route.confirmer" }
    >,
  ) => boolean = () => true,
): ProjectionDeLAtlas {
  const textes = TEXTES[langue];
  const libelles = LIBELLES[langue];
  const secondeCourante = etat.tempsDuConvoi.secondes;
  const engagement = etat.routes.engagements.find(
    (candidat) => candidat.statut === "en-cours",
  );
  const dernierJalon = etat.routes.jalons.at(-1);
  const offreDesNacelles = calculerOffreDesNacelles({
    position: etat.routes.position,
    hautPuits: etat.hautPuits,
    veilleBasse: etat.veilleBasse,
    faits: etat.narration.faitsDeCampagne.map((fait) => fait.id),
  });
  const tronconsAffiches =
    engagement === undefined
      ? listerTronconsEngageables(etat.routes).map((possibilite) => ({
          ...possibilite,
          engageable:
            routeAvalDesBassinsEstPreparee(
              possibilite.troncon.id,
              etat.narration.evenementActif,
              etat.narration.faitsDeCampagne.map((fait) => fait.id),
            ) &&
            commandeEstAutorisee({
              type: "engagement-de-route.confirmer",
              tronconId: possibilite.troncon.id,
            }),
        }))
      : [
          {
            troncon: trouverTronconDeRoute(engagement.tronconId),
            destination: engagement.destination,
            engageable: false,
          },
        ];

  return {
    titre: textes.titre,
    position: nommerLieu(etat.routes.position, langue),
    libellePosition: textes.position,
    libelleRenseignements: textes.renseignements,
    libelleBilan: textes.bilan,
    libelleConnu: textes.connu,
    libelleIncertain: textes.incertain,
    libelleVueListe: textes.vueListe,
    actionEtudier: textes.etudier,
    actionConfirmer: textes.confirmer,
    actionAnnuler: textes.annuler,
    avertissementIrreversible: textes.avertissement,
    engagement:
      engagement === undefined
        ? null
        : {
            destination: nommerLieu(engagement.destination, langue),
            arrivee:
              langue === "fr"
                ? `dans ${formaterDuree(
                    Math.max(0, engagement.arriveeA - secondeCourante),
                    langue,
                  )}`
                : `in ${formaterDuree(
                    Math.max(0, engagement.arriveeA - secondeCourante),
                    langue,
                  )}`,
            retour: textes.retour,
          },
    dernierJalon:
      dernierJalon === undefined
        ? null
        : {
            moment: formaterMoment(dernierJalon.moment),
            cause: textes.causeFront,
          },
    troncons: tronconsAffiches.map(
      ({ troncon, destination, engageable }) => {
        const offreContextuelle =
          offreDesNacelles?.tronconId === troncon.id
            ? offreDesNacelles
            : null;
        const renseignementsPersistes = etat.routes.renseignements.filter(
          (renseignement) => renseignement.tronconId === troncon.id,
        );
        const renseignements = [
          ...renseignementsPersistes,
          ...troncon.renseignements.filter(
            (renseignement) =>
              (offreContextuelle === null ||
                renseignement.id ===
                  offreContextuelle.renseignementId) &&
              !renseignementsPersistes.some(
                (persistant) => persistant.id === renseignement.id,
              ),
          ),
        ]
          .sort((gauche, droite) => droite.releveA - gauche.releveA);
        const sourceDeLIncertitude = renseignements.find(
          (renseignement) =>
            renseignement.id ===
            (offreContextuelle?.renseignementId ??
              troncon.consommationIncertaine.renseignementId),
        );
        if (sourceDeLIncertitude === undefined) {
          throw new Error(
            `Le Bilan du Tronçon « ${troncon.id} » n’a pas de source.`,
          );
        }
        const duree = formaterDuree(troncon.dureeSecondes, langue);
        const consommation =
          offreContextuelle === null
            ? `${troncon.consommationConnue.quantite} L ${
                langue === "fr" ? "de " : "of "
              }${libelles.combustible}`
            : `${offreContextuelle.consommations.combustible} L ${
                langue === "fr" ? "de " : "of "
              }${libelles.combustible} · ${
                offreContextuelle.consommations.eau
              } L ${langue === "fr" ? "d’" : "of "}${libelles.eau}`;
        const eau = `${troncon.consommationIncertaine.minimum}–${troncon.consommationIncertaine.maximum} L`;
        const optionsContextuelles =
          offreContextuelle === null
            ? []
            : offreContextuelle.options.map((option) => {
                const libelle =
                  troncon.libellesDOptions?.[langue]?.[option];
                if (libelle === undefined) {
                  throw new Error(
                    `Le libellé de l’option « ${option} » du Tronçon « ${troncon.id} » n’est pas chargé.`,
                  );
                }
                return libelle;
              });
        return {
          id: troncon.id,
          destination: nommerLieu(destination, langue),
          connexion: `${nommerLieu(etat.routes.position, langue)} → ${nommerLieu(
            destination,
            langue,
          )}`,
          duree,
          consommation,
          engageable,
          renseignements: renseignements.map((renseignement) =>
            projeterRenseignement(renseignement, secondeCourante, langue),
          ),
          bilan: {
            consequencesConnues: [
              ...(langue === "fr"
                ? [
                    `Durée exacte : ${duree}`,
                    `Consommation exacte : ${consommation}`,
                  ]
                : [
                    `Exact duration: ${duree}`,
                    `Exact consumption: ${consommation}`,
                  ]),
              ...(troncon.consequenceDuHalo === undefined
                ? []
                : [troncon.consequenceDuHalo[langue]]),
              ...optionsContextuelles,
            ],
            incertitudes: [
              ...(offreContextuelle === null
                ? [
                    {
                      valeur:
                        langue === "fr"
                          ? `${libelles.eau} estimée : ${eau}`
                          : `Estimated ${libelles.eau.toLowerCase()}: ${eau}`,
                      source: projeterRenseignement(
                        sourceDeLIncertitude,
                        secondeCourante,
                        langue,
                      ).source,
                      age: formaterAge(
                        sourceDeLIncertitude.releveA,
                        secondeCourante,
                        langue,
                      ),
                    },
                  ]
                : []),
            ],
          },
        };
      },
    ),
  };
}
