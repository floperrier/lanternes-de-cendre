import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import { reconstruireEtatDeLOuvertureDeLaCouronne } from "../simulation/ouvertureCouronne";

export interface ProjectionDeLOuvertureDeLaCouronne {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly ouvertures: readonly string[];
  readonly projets: readonly string[];
  readonly conseil: string;
  readonly choix: string;
  readonly noeud: string;
  readonly solutions: readonly string[];
  readonly garde: string;
  readonly libelles: Readonly<
    Record<
      | "ouvertures"
      | "projets"
      | "conseil"
      | "choix"
      | "noeud"
      | "solutions"
      | "garde",
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

export function projeterOuvertureDeLaCouronne(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeLOuvertureDeLaCouronne {
  const visible =
    etat.routes.position === "anneau-interieur" ||
    etat.routes.position === "noeud-central";
  const textes =
    lirePresentationsPremium()?.ouvertureCouronne?.[langue];
  const libellesVides = {
    ouvertures: "",
    projets: "",
    conseil: "",
    choix: "",
    noeud: "",
    solutions: "",
    garde: "",
  };
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      ouvertures: [],
      projets: [],
      conseil: "",
      choix: "",
      noeud: "",
      solutions: [],
      garde: "",
      libelles: libellesVides,
    };
  }

  const ouverture =
    reconstruireEtatDeLOuvertureDeLaCouronne(etat);
  const formaterOuverture = (
    nom: "ferroviaire" | "phares" | "colonies" | "breche",
    statut: string,
    acteurs: string,
    cout: string,
  ) =>
    formater(textes.formats.ouverture, {
      nom: textes.nomsDesOuvertures[nom]!,
      statut: textes.statutsDesOuvertures[statut]!,
      acteurs: textes.acteurs[acteurs]!,
      cout,
    });
  const projets = [
    ["berceau", ouverture.projets.berceau],
    ["etalon", ouverture.projets.etalon],
    ["precipitateur", ouverture.projets.precipitateur],
  ] as const;

  return {
    visible: true,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    ouvertures: [
      formaterOuverture(
        "ferroviaire",
        ouverture.ouvertures.ferroviaire.statut,
        ouverture.ouvertures.ferroviaire.acteurs,
        formater(textes.couts.ferroviaire!, {
          materiaux: String(
            ouverture.ouvertures.ferroviaire.materiaux,
          ),
        }),
      ),
      formaterOuverture(
        "phares",
        ouverture.ouvertures.phares.statut,
        ouverture.ouvertures.phares.acteurs,
        formater(textes.couts.phares!, {
          eau: String(ouverture.ouvertures.phares.eau),
        }),
      ),
      formaterOuverture(
        "colonies",
        ouverture.ouvertures.colonies.statut,
        ouverture.ouvertures.colonies.acteurs,
        formater(textes.couts.colonies!, {
          eau: String(ouverture.ouvertures.colonies.eau),
          materiaux: String(
            ouverture.ouvertures.colonies.materiaux,
          ),
        }),
      ),
      formaterOuverture(
        "breche",
        ouverture.ouvertures.breche.statut,
        "breche",
        textes.couts.breche!,
      ),
    ],
    projets: projets.map(([nom, projet]) =>
      formater(textes.formats.projet, {
        projet: textes.projets[nom]!,
        diagnostic: textes.diagnostics[projet.diagnostic]!,
        preparation: textes.preparations[projet.preparation]!,
        reduction:
          textes.reductions[
            projet.preparation === "absente" ? "aucune" : nom
          ]!,
      }),
    ),
    conseil: formater(textes.formats.conseil, {
      republique:
        textes.delegations[ouverture.conseil.republique]!,
      pelerins: textes.delegations[ouverture.conseil.pelerins]!,
      puits: textes.delegations[ouverture.conseil.puitsLibres]!,
    }),
    choix:
      textes.ouverturesChoisies[ouverture.ouvertureChoisie]!,
    noeud: textes.noeud[ouverture.noeud]!,
    solutions: (
      [
        ["ancrer", ouverture.solutions.ancrer],
        ["reaccorder", ouverture.solutions.reaccorder],
        ["precipiter", ouverture.solutions.precipiter],
      ] as const
    ).map(([solution, statut]) =>
      formater(textes.formats.solution, {
        solution: textes.solutions[solution]!,
        statut: textes.statutsDesSolutions[statut]!,
      }),
    ),
    garde: textes.gardes[ouverture.gardeDeLaClef]!,
    libelles:
      textes.libelles as ProjectionDeLOuvertureDeLaCouronne["libelles"],
  };
}
