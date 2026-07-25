import { catalogueDEvenements } from "../content/catalogue";
import {
  lirePresentationsPremium,
  type TextesDeLExtinction,
} from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  reconstruireEpilogue,
  type RetourModulaireDeLEpilogue,
} from "../simulation/epilogue";
import {
  projeterPilotage,
  type ProjectionDuJournalCausal,
} from "./pilotage";

export interface ProjectionDeLEpilogue {
  readonly visible: boolean;
  readonly denouement: {
    readonly titre: string;
    readonly statut: string;
    readonly solution: {
      readonly libelle: string;
      readonly valeur: string;
    };
    readonly variante: {
      readonly libelle: string;
      readonly valeur: string;
    };
    readonly cause: {
      readonly libelle: string;
      readonly valeur: string;
    };
    readonly moment: {
      readonly libelle: string;
      readonly valeur: string;
    };
  } | null;
  readonly defaite: {
    readonly titre: string;
    readonly habitants: string;
    readonly coeur: string;
    readonly connaissances: string;
    readonly journalCausal: readonly ProjectionDuJournalCausal[];
  } | null;
  readonly titre: string;
  readonly eyebrow: string;
  readonly introduction: string;
  readonly axes: readonly {
    readonly id:
      | "stabilite-technique"
      | "controle-politique"
      | "cout-humain";
    readonly libelle: string;
    readonly valeur: string;
  }[];
  readonly sortDuCoeur: {
    readonly libelle: string;
    readonly valeur: string;
  };
  readonly revelation: {
    readonly libelle: string;
    readonly valeur: string;
  };
  readonly compagnons: readonly {
    readonly id: string;
    readonly nom: string;
    readonly statut: string;
    readonly sante: string;
    readonly projet: string;
    readonly lien: string | null;
    readonly rancune: string | null;
  }[];
  readonly retours: readonly {
    readonly id:
      | "colonies"
      | "sites"
      | "cohortes"
      | "factions"
      | "engagements"
      | "traces";
    readonly titre: string;
    readonly elements: readonly {
      readonly id: string;
      readonly nom: string;
      readonly devenir: string;
      readonly causes: readonly string[];
    }[];
  }[];
  readonly libelles: Readonly<Record<string, string>>;
}

const PROJECTION_MASQUEE: ProjectionDeLEpilogue = {
  visible: false,
  denouement: null,
  defaite: null,
  titre: "",
  eyebrow: "",
  introduction: "",
  axes: [],
  sortDuCoeur: { libelle: "", valeur: "" },
  revelation: { libelle: "", valeur: "" },
  compagnons: [],
  retours: [],
  libelles: {},
};

const TEXTES_DU_DENOUEMENT = {
  fr: {
    titre: "Dénouement de campagne",
    statut: "Campagne conclue",
    libelles: {
      solution: "Solution finale",
      variante: "Variante",
      cause: "Cause",
      moment: "Moment du Dénouement",
    },
    causes: {
      "finale.ancrage.la-derniere-negociation":
        "Dernière négociation de l’Ancrage",
      "finale.reaccord.la-derniere-negociation-du-reseau":
        "Dernière négociation du Réaccord",
      "finale.precipitation.la-derniere-negociation-des-bassins":
        "Dernière négociation de la Précipitation",
    },
  },
  en: {
    titre: "Campaign denouement",
    statut: "Campaign concluded",
    libelles: {
      solution: "Final Solution",
      variante: "Variant",
      cause: "Cause",
      moment: "Denouement time",
    },
    causes: {
      "finale.ancrage.la-derniere-negociation":
        "Final negotiation for Anchoring the heart",
      "finale.reaccord.la-derniere-negociation-du-reseau":
        "Final negotiation for Retuning the network",
      "finale.precipitation.la-derniere-negociation-des-bassins":
        "Final negotiation for Bringing down the ash",
    },
  },
} as const;

function libellerCauseDExtinction(
  cause: string,
  textes: TextesDeLExtinction["denouement"],
): string {
  const recuperationManquee = cause.match(
    /^crise\.recuperation\.(.+)\.manquee$/,
  );
  if (recuperationManquee === null) {
    return humaniserIdentifiant(cause);
  }
  const garantie =
    textes.garanties[recuperationManquee[1] ?? ""];
  if (garantie === undefined) {
    return humaniserIdentifiant(cause);
  }
  return `${textes.recuperationManquee} — ${garantie}`;
}

function formaterMomentDuDenouement(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = secondes % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondesRestantes
    .toString()
    .padStart(2, "0")}`;
}

function humaniserIdentifiant(id: string): string {
  return id
    .split(/[.:-]/)
    .filter((fragment) => fragment.length > 0)
    .map(
      (fragment) =>
        fragment.charAt(0).toLocaleUpperCase() + fragment.slice(1),
    )
    .join(" ");
}

export function projeterEpilogue(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeLEpilogue {
  if (etat.denouement.statut === "defaite") {
    const textes =
      lirePresentationsPremium()?.extinction?.[langue].denouement;
    if (textes === undefined) {
      return PROJECTION_MASQUEE;
    }
    const journalCausal = projeterPilotage(etat, langue).journalCausal;
    return {
      visible: true,
      denouement: {
        titre: textes.denouementTitre,
        statut: textes.statut,
        solution: {
          libelle: textes.choix,
          valeur: textes.choixTerminaux[etat.denouement.choix] ?? "",
        },
        variante: {
          libelle: textes.issue,
          valeur: textes.defaite,
        },
        cause: {
          libelle: textes.cause,
          valeur: libellerCauseDExtinction(
            etat.denouement.cause,
            textes,
          ),
        },
        moment: {
          libelle: textes.moment,
          valeur: formaterMomentDuDenouement(etat.denouement.moment),
        },
      },
      defaite: {
        titre: textes.titre,
        habitants: textes.habitants[etat.denouement.devenirs.habitants],
        coeur: textes.coeur[etat.denouement.devenirs.coeur],
        connaissances:
          textes.connaissances[
            etat.denouement.devenirs.connaissances
          ],
        journalCausal,
      },
      titre: textes.titre,
      eyebrow: textes.eyebrow,
      introduction: textes.introduction,
      axes: [],
      sortDuCoeur: { libelle: "", valeur: "" },
      revelation: { libelle: "", valeur: "" },
      compagnons: [],
      retours: [],
      libelles: {},
    };
  }
  const epilogue = reconstruireEpilogue(etat);
  const presentations = lirePresentationsPremium();
  const textes = presentations?.epilogue?.[langue];
  const textesDeFinale = presentations?.finale?.[langue];
  const textesDeLaTrame = presentations?.trame?.[langue];
  if (!epilogue.visible || textes === undefined || textesDeFinale === undefined) {
    return PROJECTION_MASQUEE;
  }
  const journal =
    catalogueDEvenements.libellesTransversaux[langue].journal;
  const nommer = (id: string) =>
    textes.noms[id] ??
    textesDeLaTrame?.engagements[id] ??
    journal.titres[id] ??
    humaniserIdentifiant(id);
  const decrireEtat = (etatSemantique: string) =>
    etatSemantique
      .split(":")
      .map(
        (fragment) =>
          textes.etats[fragment] ?? humaniserIdentifiant(fragment),
      )
      .join(" · ");
  const decrireCause = (cause: string) => {
    if (cause.startsWith("etat:")) {
      const [, id, ...fragmentsDEtat] = cause.split(":");
      return `${textes.causesDEtat} — ${nommer(id ?? cause)} : ${decrireEtat(
        fragmentsDEtat.join(":"),
      )}`;
    }
    return nommer(cause);
  };
  const projeterRetour = (retour: RetourModulaireDeLEpilogue) => ({
    id: retour.id,
    nom: nommer(retour.id),
    devenir: decrireEtat(retour.etat),
    causes: retour.causes.map(decrireCause),
  });
  const valeursDesAxes = {
    "stabilite-technique": textesDeFinale.stabilites,
    "controle-politique": textesDeFinale.controles,
    "cout-humain": textesDeFinale.coutsHumains,
  } as const;
  const categories = [
    "colonies",
    "sites",
    "cohortes",
    "factions",
    "engagements",
    "traces",
  ] as const;
  const textesDuDenouement = TEXTES_DU_DENOUEMENT[langue];
  const denouement =
    etat.denouement.statut === "solution-finale"
      ? {
          titre: textesDuDenouement.titre,
          statut: textesDuDenouement.statut,
          solution: {
            libelle: textesDuDenouement.libelles.solution,
            valeur: textesDeFinale.solutions[etat.denouement.solution]!,
          },
          variante: {
            libelle: textesDuDenouement.libelles.variante,
            valeur: textesDeFinale.variantes[etat.denouement.variante]!,
          },
          cause: {
            libelle: textesDuDenouement.libelles.cause,
            valeur:
              textesDuDenouement.causes[
                etat.denouement
                  .cause as keyof typeof textesDuDenouement.causes
              ] ?? nommer(etat.denouement.cause),
          },
          moment: {
            libelle: textesDuDenouement.libelles.moment,
            valeur: formaterMomentDuDenouement(etat.denouement.moment),
          },
        }
      : null;

  return {
    visible: true,
    denouement,
    defaite: null,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    introduction: textes.introduction,
    axes: epilogue.axes.map((axe) => ({
      id: axe.id,
      libelle: textes.axes[axe.id]!,
      valeur:
        valeursDesAxes[axe.id][axe.valeur] ??
        decrireEtat(axe.valeur),
    })),
    sortDuCoeur: {
      libelle: textes.libelles["sort-du-coeur"]!,
      valeur:
        textesDeFinale.sortsDuCoeur[epilogue.sortDuCoeur] ??
        decrireEtat(epilogue.sortDuCoeur),
    },
    revelation: {
      libelle: textes.libelles.revelation!,
      valeur: textes.revelation,
    },
    compagnons: epilogue.compagnons.map((compagnon) => ({
      id: compagnon.id,
      nom: nommer(compagnon.id),
      statut:
        textes.statutsDeCompagnons[compagnon.statut] ??
        decrireEtat(compagnon.statut),
      sante: decrireEtat(compagnon.sante),
      projet: decrireEtat(compagnon.projet),
      lien:
        compagnon.lien === null
          ? null
          : `${textes.liens[compagnon.lien.id] ?? nommer(compagnon.lien.id)} — ${nommer(
              compagnon.lien.avec,
            )} : ${decrireEtat(compagnon.lien.etat)}`,
      rancune:
        compagnon.rancune === null
          ? null
          : `${
              textes.rancunes[compagnon.rancune.id] ??
              nommer(compagnon.rancune.id)
            } — ${decrireCause(compagnon.rancune.cause)} · ${
              textes.reparations[compagnon.rancune.reparation] ??
              decrireEtat(compagnon.rancune.reparation)
            }`,
    })),
    retours: categories.map((id) => ({
      id,
      titre: textes.libelles[id]!,
      elements: epilogue.retours[id].map(projeterRetour),
    })),
    libelles: { ...textes.libelles, aucun: textes.aucun },
  };
}
