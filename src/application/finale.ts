import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  reconstruireEtatDuContratFinal,
  type IdentifiantDeSolutionFinale,
} from "../simulation/finale";

export interface ProjectionDuContratFinal {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly solutions: readonly {
    readonly id: IdentifiantDeSolutionFinale;
    readonly resume: string;
    readonly cout: string;
    readonly causes: readonly string[];
  }[];
  readonly selection: string;
  readonly negociation: readonly string[];
  readonly variante: string;
  readonly bilan: string;
  readonly libelles: Readonly<
    Record<
      | "solutions"
      | "causes"
      | "selection"
      | "negociation"
      | "variante"
      | "bilan",
      string
    >
  >;
}

function formater(
  modele: string,
  variables: Readonly<Record<string, string>>,
): string {
  return Object.entries(variables).reduce(
    (texte, [nom, valeur]) =>
      texte.replaceAll(`{${nom}}`, valeur),
    modele,
  );
}

export function projeterContratFinal(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDuContratFinal {
  const textes = lirePresentationsPremium()?.finale?.[langue];
  const visible = etat.routes.position === "noeud-central";
  const libellesVides = {
    solutions: "",
    causes: "",
    selection: "",
    negociation: "",
    variante: "",
    bilan: "",
  };
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      solutions: [],
      selection: "",
      negociation: [],
      variante: "",
      bilan: "",
      libelles: libellesVides,
    };
  }

  const finale = reconstruireEtatDuContratFinal(etat);
  const solutions = (
    ["ancrer", "reaccorder", "precipiter"] as const
  ).map((id) => {
    const solution = finale.solutions[id];
    return {
      id,
      resume: formater(textes.formats.solution, {
        solution: textes.solutions[id]!,
        statut: textes.statuts[solution.statut]!,
        disponibilite:
          textes.disponibilites[
            solution.selectionnable
              ? "selectionnable"
              : "non-selectionnable"
          ]!,
      }),
      cout: formater(textes.formats.cout, {
        eau: String(solution.cout.eau),
        materiaux: String(solution.cout.materiaux),
        habitants: String(solution.cout.habitants),
      }),
      causes: solution.causes.map(
        (cause) => textes.causes[cause]!,
      ),
    };
  });
  const bilan =
    finale.bilan === undefined
      ? textes.aucunBilan
      : formater(textes.formats.bilan, {
          stabilite: textes.stabilites[finale.bilan.stabilite]!,
          controle: textes.controles[finale.bilan.controle]!,
          coutHumain:
            textes.coutsHumains[finale.bilan.coutHumain]!,
        });

  return {
    visible: true,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    solutions,
    selection: textes.selections[finale.selection]!,
    negociation: finale.optionsDeNegociation.map(
      (option) => textes.variantes[option]!,
    ),
    variante: textes.variantes[finale.varianteDAncrage]!,
    bilan,
    libelles:
      textes.libelles as ProjectionDuContratFinal["libelles"],
  };
}
