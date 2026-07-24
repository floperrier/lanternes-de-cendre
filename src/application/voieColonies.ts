import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import { reconstruireEtatDeLaVoieDesColonies } from "../simulation/voieColonies";

export interface ProjectionDeLaVoieDesColonies {
  readonly visible: boolean;
  readonly titre: string;
  readonly eyebrow: string;
  readonly serres: string;
  readonly retours: readonly string[];
  readonly cohorte: string;
  readonly credibilite: string;
  readonly seuil: string;
  readonly acces: string;
  readonly garde: string;
  readonly libelles: Readonly<
    Record<
      | "serres"
      | "retours"
      | "cohorte"
      | "credibilite"
      | "seuil"
      | "acces"
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

export function projeterVoieDesColonies(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeLaVoieDesColonies {
  const visible =
    etat.routes.position === "serres-de-verre" ||
    etat.routes.position === "seuil";
  const textes =
    lirePresentationsPremium()?.voieColonies?.[langue];
  const libellesVides = {
    serres: "",
    retours: "",
    cohorte: "",
    credibilite: "",
    seuil: "",
    acces: "",
    garde: "",
  };
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      eyebrow: "",
      serres: "",
      retours: [],
      cohorte: "",
      credibilite: "",
      seuil: "",
      acces: "",
      garde: "",
      libelles: libellesVides,
    };
  }

  const voie = reconstruireEtatDeLaVoieDesColonies(etat);
  const retours = Object.entries(voie.retours).map(
    ([colonie, retour]) =>
      formater(textes.formats.retour, {
        colonie: textes.nomsDesColonies[colonie]!,
        retour: textes.retours[retour]!,
      }),
  );
  return {
    visible: true,
    titre: textes.titre,
    eyebrow: textes.eyebrow,
    serres: formater(textes.formats.serres, {
      besoin: textes.besoins[voie.serresDeVerre.besoin]!,
      interaction:
        textes.interactions[voie.serresDeVerre.interaction]!,
      devenir: textes.devenirs[voie.serresDeVerre.devenir]!,
    }),
    retours,
    cohorte: textes.cohortes[voie.cohorte]!,
    credibilite: formater(textes.formats.credibilite, {
      voie: textes.voies[voie.credibilite.voie]!,
      alliances: String(voie.credibilite.alliances),
      equipes: String(voie.credibilite.equipes),
      eau: textes.booleens[String(voie.credibilite.eauPreservee)]!,
      pieces:
        textes.booleens[String(voie.credibilite.piecesPreservees)]!,
    }),
    seuil: formater(textes.formats.seuil, {
      statut: textes.statutsDuSeuil[voie.seuil.statut]!,
      pressions: voie.seuil.pressions
        .map((pression) => textes.pressions[pression]!)
        .join(", "),
      marche: textes.marches[voie.seuil.marche]!,
      abris: textes.abris[voie.seuil.abris]!,
      releves: textes.releves[voie.seuil.relevesDuNoeud]!,
      revendication:
        textes.revendications[voie.seuil.revendication]!,
    }),
    acces: textes.acces[voie.accesAuNoeud]!,
    garde: textes.gardes[voie.gardeDuRegistre]!,
    libelles:
      textes.libelles as ProjectionDeLaVoieDesColonies["libelles"],
  };
}
