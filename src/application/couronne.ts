import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import { reconstruireEtatDesApprochesDeLaCouronne } from "../simulation/couronne";

export interface ProjectionDesApprochesDeLaCouronne {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly teteDeLigne: string;
  readonly veilleDesTrois: string;
  readonly delegations: string;
  readonly diagnostic: string;
  readonly preparatifs: readonly string[];
  readonly gardeDesPlans: string;
  readonly libelles: Readonly<
    Record<
      | "teteDeLigne"
      | "veilleDesTrois"
      | "delegations"
      | "diagnostic"
      | "preparatifs"
      | "gardeDesPlans",
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

export function projeterApprochesDeLaCouronne(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDesApprochesDeLaCouronne {
  const visible =
    etat.routes.position === "tete-de-ligne" ||
    etat.routes.position === "veille-des-trois";
  const textes =
    lirePresentationsPremium()?.couronne?.[langue];
  const libellesVides = {
    teteDeLigne: "",
    veilleDesTrois: "",
    delegations: "",
    diagnostic: "",
    preparatifs: "",
    gardeDesPlans: "",
  };
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      teteDeLigne: "",
      veilleDesTrois: "",
      delegations: "",
      diagnostic: "",
      preparatifs: [],
      gardeDesPlans: "",
      libelles: libellesVides,
    };
  }

  const approche = reconstruireEtatDesApprochesDeLaCouronne(etat);
  return {
    visible: true,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    teteDeLigne: formater(textes.formats.site, {
      besoin: textes.besoins[approche.teteDeLigne.besoin]!,
      interaction:
        textes.interactions[approche.teteDeLigne.interaction]!,
      devenir: textes.devenirs[approche.teteDeLigne.devenir]!,
    }),
    veilleDesTrois: formater(textes.formats.site, {
      besoin: textes.besoins[approche.veilleDesTrois.besoin]!,
      interaction:
        textes.interactions[approche.veilleDesTrois.interaction]!,
      devenir: textes.devenirs[approche.veilleDesTrois.devenir]!,
    }),
    delegations: formater(textes.formats.delegations, {
      republique: textes.delegations[approche.delegations.republique]!,
      pelerins: textes.delegations[approche.delegations.pelerins]!,
      puits: textes.delegations[approche.delegations.puitsLibres]!,
    }),
    diagnostic: textes.diagnostics[approche.diagnostic]!,
    preparatifs: [
      formater(textes.formats.preparatif, {
        projet: textes.projets.berceauDAncrage!,
        statut:
          textes.statutsDePreparation[
            approche.preparatifs.berceauDAncrage
          ]!,
      }),
      formater(textes.formats.preparatif, {
        projet: textes.projets.etalonDeReaccord!,
        statut:
          textes.statutsDePreparation[
            approche.preparatifs.etalonDeReaccord
          ]!,
      }),
      formater(textes.formats.preparatif, {
        projet: textes.projets.precipitateurEmbarque!,
        statut:
          textes.statutsDePreparation[
            approche.preparatifs.precipitateurEmbarque
          ]!,
      }),
    ],
    gardeDesPlans: textes.gardesDesPlans[approche.gardeDesPlans]!,
    libelles:
      textes.libelles as ProjectionDesApprochesDeLaCouronne["libelles"],
  };
}
