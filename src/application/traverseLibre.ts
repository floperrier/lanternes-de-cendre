import type { Langue } from "../content/types";
import { lirePresentationsPremium } from "../content/presentationsPremium";
import type { EtatCampagne } from "../simulation/campagne";

export interface ProjectionDeTraverseLibre {
  readonly visible: boolean;
  readonly titre: string;
  readonly statut: string;
  readonly pressions: readonly string[];
  readonly marche: readonly string[];
  readonly dependances: readonly string[];
  readonly contournement: string;
  readonly route: string;
  readonly aide: string;
  readonly relationPuitsLibres: string;
  readonly relationRepublique: string;
  readonly libelles: {
    readonly eyebrow: string;
    readonly pressions: string;
    readonly marche: string;
    readonly dependances: string;
    readonly contournement: string;
    readonly route: string;
    readonly aide: string;
    readonly puitsLibres: string;
    readonly republique: string;
    readonly filtres: string;
    readonly remedes: string;
    readonly debouches: string;
  };
}

export function projeterTraverseLibre(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeTraverseLibre {
  const visible =
    etat.routes.position === "traverse-libre" &&
    !etat.routes.engagements.some(({ statut }) => statut === "en-cours");
  const textes = lirePresentationsPremium()?.traverse?.[langue];
  if (!visible || textes === undefined) {
    return {
      visible: false,
      titre: "",
      statut: "",
      pressions: [],
      marche: [],
      dependances: [],
      contournement: "",
      route: "",
      aide: "",
      relationPuitsLibres: "",
      relationRepublique: "",
      libelles: {
        eyebrow: "",
        pressions: "",
        marche: "",
        dependances: "",
        contournement: "",
        route: "",
        aide: "",
        puitsLibres: "",
        republique: "",
        filtres: "",
        remedes: "",
        debouches: "",
      },
    };
  }

  const traverse = etat.traverseLibre;
  const remplacerNombre = (modele: string, nombre: number) =>
    modele.replace("{nombre}", String(nombre));
  return {
    visible: true,
    titre: textes.titre,
    statut: textes.statuts[traverse.statut]!,
    pressions: [
      textes.filtres[traverse.pressions.filtres]!,
      textes.isolement[traverse.pressions.isolement]!,
    ],
    marche: [
      remplacerNombre(
        textes.lotsDeFiltres,
        traverse.marche.lotsDeFiltresManquants,
      ),
      remplacerNombre(
        textes.lotsDeRemedes,
        traverse.marche.lotsDeRemedesManquants,
      ),
      remplacerNombre(
        textes.reservesDEau,
        traverse.marche.reservesDEauDisponibles,
      ),
    ],
    dependances: [
      `${textes.libelles.filtres} : ${textes.dependances[traverse.dependancesAuRail.filtres]!}`,
      `${textes.libelles.remedes} : ${textes.dependances[traverse.dependancesAuRail.remedes]!}`,
      `${textes.libelles.debouches} : ${textes.dependances[traverse.dependancesAuRail.debouches]!}`,
    ],
    contournement: textes.contournements[traverse.contournement]!,
    route: textes.routes[traverse.routeSecondaire.statut]!,
    aide: textes.aides[traverse.aide.statut]!,
    relationPuitsLibres:
      textes.relationsPuits[traverse.relationPuitsLibres]!,
    relationRepublique:
      textes.relationsRepublique[etat.trameDeFer.relationRepublique]!,
    libelles: textes.libelles,
  };
}
