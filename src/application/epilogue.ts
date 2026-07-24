import { catalogueDEvenements } from "../content/catalogue";
import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  reconstruireEpilogue,
  type RetourModulaireDeLEpilogue,
} from "../simulation/epilogue";

export interface ProjectionDeLEpilogue {
  readonly visible: boolean;
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

  return {
    visible: true,
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
