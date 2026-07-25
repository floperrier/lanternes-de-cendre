import type { Langue } from "../content/types";
import {
  lirePresentationsPremium,
  type TextesDeCriseDeVeilleBasse,
} from "../content/presentationsPremium";
import type { EtatCampagne } from "../simulation/campagne";
import {
  aideExterieureEstPreparee,
  IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
  IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
  IDENTIFIANT_DE_LA_CRISE_DU_HALO,
  IDENTIFIANT_DE_LA_CRISE_TERMINALE,
  listerDefinitionsDesReponsesALaCrise,
  reponseALaCriseEstViable,
  type GarantieDeRecuperation,
  type IdentifiantDeCrise,
  type IdentifiantDeReponseALaCrise,
} from "../simulation/crise";
import { listerPlateformesMobilesDetachables } from "../simulation/infrastructure";

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
  readonly id: IdentifiantDeCrise;
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
    readonly chaineVisible: readonly string[];
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
    readonly cout: string;
    readonly cause: string;
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
      "veille-basse": "Veille-Basse",
    },
    conditionsRecuperation: {
      "socle-de-survie":
        "Déployer la Halte au puits sec.",
      "mobilite-minimale":
        "Achever le Tronçon vers Haut-Puits.",
      "aide-exterieure-identifiee":
        "Demander l’accueil et l’Eau d’urgence de Haut-Puits.",
    },
    horizon: (nombre: number) => `sous ${nombre} Tronçon${nombre > 1 ? "s" : ""}`,
    statutsRecuperation: {
      amorcee: "Récupération amorcée",
      accomplie: "Récupération accomplie",
      manquee: "Récupération manquée",
    },
    coutsRecuperation: {
      deuxMateriaux: {
        amorcee: "2 Matériaux",
        accomplie: "2 Matériaux engagés",
        manquee: "2 Matériaux étaient requis",
      },
      trajetAttendu: (destination: string) =>
        `Coût du Tronçon vers ${destination}`,
      trajetManque: "Le coût du Tronçon n’a pas été engagé",
      trajetAccompli: (combustible: number, eau: number) =>
        `${combustible} Combustible + ${eau} Eau consommés`,
    },
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
      "veille-basse": "Veille-Basse",
    },
    conditionsRecuperation: {
      "socle-de-survie": "Deploy the Halt at Dry Well.",
      "mobilite-minimale":
        "Complete the route segment to High Well.",
      "aide-exterieure-identifiee":
        "Request emergency shelter and Water from High Well.",
    },
    horizon: (nombre: number) =>
      `within ${nombre} route segment${nombre > 1 ? "s" : ""}`,
    statutsRecuperation: {
      amorcee: "Recovery underway",
      accomplie: "Recovery accomplished",
      manquee: "Recovery missed",
    },
    coutsRecuperation: {
      deuxMateriaux: {
        amorcee: "2 Materials",
        accomplie: "2 Materials committed",
        manquee: "2 Materials were required",
      },
      trajetAttendu: (destination: string) =>
        `Cost of the route segment to ${destination}`,
      trajetManque: "The route segment cost was not committed",
      trajetAccompli: (combustible: number, eau: number) =>
        `${combustible} Fuel + ${eau} Water consumed`,
    },
  },
} as const;

type PresentationDeReponse =
  TextesDeCriseDeVeilleBasse["reponses"][string];
type PresentationDeCrise = {
  readonly alerteTitre: string;
  readonly alerteCause: string;
  readonly titre: string;
  readonly cause: string;
  readonly chaine: readonly string[];
  readonly maillons?: Readonly<Record<string, string>>;
  readonly reponses: Readonly<Record<string, PresentationDeReponse>>;
};

const PRESENTATION_DE_REPONSE_MASQUEE: PresentationDeReponse = {
  intention: "",
  coutConnu: "",
  consequence: "",
  mitigation: "",
  pireConsequence: "",
  attribution: "",
};

function trouverTexte(
  textesPublics: Readonly<Record<string, string>>,
  textesPremium: Readonly<Record<string, string>> | undefined,
  id: string,
): string {
  return textesPublics[id] ?? textesPremium?.[id] ?? "";
}

function formaterEcheance(secondes: number, langue: Langue): string {
  const minutes = Math.ceil(secondes / 60);
  return langue === "fr"
    ? `dans ${minutes} min`
    : `in ${minutes} min`;
}

function libellerGarantie(
  garantie: GarantieDeRecuperation,
  langue: Langue,
  textesPremium:
    | Pick<TextesDeCriseDeVeilleBasse, "garanties">
    | undefined,
): string {
  return trouverTexte(
    TEXTES[langue].garanties,
    textesPremium?.garanties,
    garantie,
  );
}

function libellerCoutDeRecuperation(
  recuperation: EtatCampagne["crises"]["recuperations"][number],
  langue: Langue,
  destination: string,
): string {
  const textes = TEXTES[langue].coutsRecuperation;
  if (recuperation.coutAttendu === "deux-materiaux") {
    return textes.deuxMateriaux[recuperation.statut];
  }
  if (recuperation.statut === "amorcee") {
    return textes.trajetAttendu(destination);
  }
  if (recuperation.statut === "manquee") {
    return textes.trajetManque;
  }
  const combustible =
    recuperation.coutApplique.find(
      ({ stock }) => stock === "combustible",
    )?.quantite ?? 0;
  const eau =
    recuperation.coutApplique.find(({ stock }) => stock === "eau")
      ?.quantite ?? 0;
  return textes.trajetAccompli(combustible, eau);
}

export function projeterCrises(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDesCrises {
  const textes = TEXTES[langue];
  const presentationsPremium = lirePresentationsPremium();
  const textesDeVeilleBasse =
    presentationsPremium?.veilleBasse[langue].crise;
  const textesDeTrame =
    presentationsPremium?.trame?.[langue].crise;
  const textesDuHalo =
    presentationsPremium?.couronne?.[langue].crise;
  const textesDeLExtinction =
    presentationsPremium?.extinction?.[langue].crise;
  const textesPremium = {
    cicatrices: {
      ...textesDeVeilleBasse?.cicatrices,
      ...textesDeTrame?.cicatrices,
      ...textesDuHalo?.cicatrices,
    },
    consequencesCicatrices: {
      ...textesDeVeilleBasse?.consequencesCicatrices,
      ...textesDeTrame?.consequencesCicatrices,
      ...textesDuHalo?.consequencesCicatrices,
    },
    causes: {
      ...textesDeVeilleBasse?.causes,
      ...textesDeTrame?.causes,
      ...textesDuHalo?.causes,
    },
    garanties: {
      ...textesDeVeilleBasse?.garanties,
      ...textesDeTrame?.garanties,
      ...textesDuHalo?.garanties,
    },
    conditionsRecuperation: {
      ...textesDeVeilleBasse?.conditionsRecuperation,
      ...textesDeTrame?.conditionsRecuperation,
      ...textesDuHalo?.conditionsRecuperation,
    },
    destinations: {
      ...textesDeVeilleBasse?.destinations,
      ...textesDeTrame?.destinations,
      ...textesDuHalo?.destinations,
    },
  };
  const alerte = etat.crises.alerte;
  const active = etat.crises.criseActive;
  const alerteDeVeilleBasse =
    alerte?.id === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE;
  const alerteDeTrame =
    alerte?.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME;
  const alerteDuHalo =
    alerte?.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO;
  const alerteDeLExtinction =
    alerte?.id === IDENTIFIANT_DE_LA_CRISE_TERMINALE;
  const criseDeVeilleBasse =
    active?.id === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE;
  const criseDeTrame =
    active?.id === IDENTIFIANT_DE_LA_CRISE_DE_TRAME;
  const criseDuHalo =
    active?.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO;
  const criseDeLExtinction =
    active?.id === IDENTIFIANT_DE_LA_CRISE_TERMINALE;
  const presentationDeLAlerte: PresentationDeCrise | undefined =
    alerteDeLExtinction
      ? textesDeLExtinction
      : alerteDeTrame
        ? textesDeTrame
        : alerteDuHalo
          ? textesDuHalo
          : alerteDeVeilleBasse
            ? textesDeVeilleBasse
            : undefined;
  const presentationDeLaCrise: PresentationDeCrise | undefined =
    criseDeLExtinction
      ? textesDeLExtinction
      : criseDeTrame
        ? textesDeTrame
        : criseDuHalo
          ? textesDuHalo
          : criseDeVeilleBasse
            ? textesDeVeilleBasse
            : undefined;
  const projeterChaine = (
    chaine: readonly { readonly id: string }[],
    presentation: PresentationDeCrise | undefined,
    extinction: boolean,
  ): readonly string[] =>
    presentation?.maillons === undefined
      ? (presentation?.chaine ?? textes.chaine).slice(0, chaine.length)
      : chaine.map(({ id }) => {
          const libelleDirect = presentation.maillons?.[id];
          if (libelleDirect !== undefined || !extinction) {
            return libelleDirect ?? id;
          }
          const cicatrice = trouverTexte(
            textes.cicatrices,
            textesPremium.cicatrices,
            id,
          );
          if (cicatrice.length > 0) {
            return cicatrice;
          }
          const recuperation = id.match(
            /^recuperation\.(.+)\.(accomplie|manquee)$/,
          );
          if (recuperation !== null) {
            const garantie = recuperation[1] as GarantieDeRecuperation;
            const statut = recuperation[2] as "accomplie" | "manquee";
            return `${libellerGarantie(
              garantie,
              langue,
              textesPremium,
            )} — ${textes.statutsRecuperation[statut]}`;
          }
          return id;
        });
  return {
    alerte:
      alerte === null || active !== null
        ? null
        : {
            titre:
              presentationDeLAlerte?.alerteTitre ??
              textes.alerteTitre,
            cause:
              presentationDeLAlerte?.alerteCause ??
              textes.alerteCause,
            chaineVisible: projeterChaine(
              alerte.chaineVisible,
              presentationDeLAlerte,
              alerteDeLExtinction,
            ),
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
            titre:
              presentationDeLaCrise?.titre ?? textes.criseTitre,
            cause:
              presentationDeLaCrise?.cause ?? textes.criseCause,
            chaineVisible: projeterChaine(
              active.chaineVisible,
              presentationDeLaCrise,
              criseDeLExtinction,
            ),
            instruction: textes.instruction,
            reponses: listerDefinitionsDesReponsesALaCrise(
              active.id,
            )
              .filter(
                (reponse) =>
                  !reponse.aideExterieureRequise ||
                  aideExterieureEstPreparee(
                    etat.narration.faitsDeCampagne,
                  ),
              )
              .map((reponse) => {
              const viable = reponseALaCriseEstViable(
                reponse,
                etat.pilotage,
                etat.citeCaravane.habitants,
                etat.citeCaravane.formation.plateformes.length,
                listerPlateformesMobilesDetachables(
                  etat.infrastructure,
                ).filter((plateforme) =>
                  etat.citeCaravane.formation.plateformes.includes(
                    plateforme,
                  ),
                ).length,
                aideExterieureEstPreparee(
                  etat.narration.faitsDeCampagne,
                ),
              );
              const presentations = (
                presentationDeLaCrise?.reponses ?? textes.reponses
              ) as
                | Readonly<Record<string, PresentationDeReponse>>
                | undefined;
              const presentation =
                presentations?.[reponse.id] ??
                PRESENTATION_DE_REPONSE_MASQUEE;
              return {
                id: reponse.id,
                ...presentation,
                dernierRecours: reponse.dernierRecours,
                viable,
                refus: viable ? null : textes.refus,
              };
              }),
          },
    cicatrices: etat.crises.cicatrices.map((cicatrice) => ({
      id: cicatrice.id,
      titre: trouverTexte(
        textes.cicatrices,
        textesPremium.cicatrices,
        cicatrice.id,
      ),
      cause: trouverTexte(
        textes.causes,
        textesPremium.causes,
        cicatrice.cause,
      ),
      consequence: trouverTexte(
        textes.consequencesCicatrices,
        textesPremium.consequencesCicatrices,
        cicatrice.id,
      ),
    })),
    recuperations: etat.crises.recuperations.map((recuperation) => {
      const destination = trouverTexte(
        textes.destinations,
        textesPremium.destinations,
        recuperation.destination,
      );
      return {
        id: recuperation.id,
        garantie: libellerGarantie(
          recuperation.garantie,
          langue,
          textesPremium,
        ),
        destination,
        horizon: textes.horizon(recuperation.horizonTroncons),
        condition: trouverTexte(
          textes.conditionsRecuperation,
          textesPremium.conditionsRecuperation,
          recuperation.garantie,
        ),
        cout: libellerCoutDeRecuperation(
          recuperation,
          langue,
          destination,
        ),
        cause: trouverTexte(
          textes.cicatrices,
          textesPremium.cicatrices,
          recuperation.cause,
        ),
        statut: textes.statutsRecuperation[recuperation.statut],
      };
    }),
  };
}
