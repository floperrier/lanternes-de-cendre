import {
  lirePresentationsPremium,
  type TextesDeHautPuits,
} from "../content/presentationsPremium";
import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import type {
  IdentifiantDOffreDeHautPuits,
  PressionLocaleDeHautPuits,
} from "../simulation/hautPuits";
import type { IdentifiantDeStock } from "../simulation/pilotage";
import { trouverEngagementDeRouteActif } from "../simulation/routes";

export interface ProjectionDeHautPuits {
  readonly visible: boolean;
  readonly titre: string;
  readonly libelleColonie: string;
  readonly libelleStatut: string;
  readonly libelleDevenir: string;
  readonly libellePressions: string;
  readonly libelleRelation: string;
  readonly libelleEngagements: string;
  readonly libelleProjets: string;
  readonly libelleProjetChoisi: string;
  readonly aucunEngagement: string;
  readonly aucunProjetChoisi: string;
  readonly colonie: {
    readonly statut: string;
    readonly devenir: string;
    readonly pressions: readonly string[];
    readonly relationPublique: string;
    readonly engagementsDiplomatiques: readonly string[];
  };
  readonly marche: {
    readonly titre: string;
    readonly action: string;
    readonly epuisee: string;
    readonly echangesRestants: string;
    readonly offres: readonly {
      readonly id: IdentifiantDOffreDeHautPuits;
      readonly besoin: string;
      readonly echangesRestants: 0 | 1;
      readonly mouvements: readonly string[];
      readonly disponible: boolean;
    }[];
  };
  readonly projets: readonly string[];
  readonly projetChoisi: string | null;
  readonly negociation: {
    readonly titre: string;
    readonly ouverte: boolean;
    readonly tranchee: string;
    readonly instruction: string;
    readonly decisions: readonly {
      readonly id: "partager-eau" | "proteger-reserves";
      readonly libelle: string;
      readonly consequence: string;
    }[];
  };
}

const PROJECTION_MASQUEE: ProjectionDeHautPuits = {
  visible: false,
  titre: "",
  libelleColonie: "",
  libelleStatut: "",
  libelleDevenir: "",
  libellePressions: "",
  libelleRelation: "",
  libelleEngagements: "",
  libelleProjets: "",
  libelleProjetChoisi: "",
  aucunEngagement: "",
  aucunProjetChoisi: "",
  colonie: {
    statut: "",
    devenir: "",
    pressions: [],
    relationPublique: "",
    engagementsDiplomatiques: [],
  },
  marche: {
    titre: "",
    action: "",
    epuisee: "",
    echangesRestants: "",
    offres: [],
  },
  projets: [],
  projetChoisi: null,
  negociation: {
    titre: "",
    ouverte: false,
    tranchee: "",
    instruction: "",
    decisions: [],
  },
};

function formaterMoment(secondes: number): string {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = secondes % 60;
  return `${minutes.toString().padStart(2, "0")}:${secondesRestantes
    .toString()
    .padStart(2, "0")}`;
}

function formaterMouvement(
  stock: IdentifiantDeStock,
  variation: number,
  textes: TextesDeHautPuits,
): string {
  const signe = variation >= 0 ? "+" : "−";
  const unite = stock === "eau" || stock === "combustible" ? " L" : "";
  return `${textes.stocks[stock]} ${signe}${Math.abs(variation)}${unite}`;
}

function offreEstDisponible(
  etat: EtatCampagne,
  offre: EtatCampagne["hautPuits"]["marche"]["offres"][number],
): boolean {
  return (
    offre.echangesRestants > 0 &&
    offre.mouvements.every(
      ({ stock, variation }) =>
        variation >= 0 ||
        etat.pilotage.economie.stocks[stock].quantite >= -variation,
    )
  );
}

export function projeterHautPuits(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeHautPuits {
  const presentations = lirePresentationsPremium();
  if (presentations === null) {
    return PROJECTION_MASQUEE;
  }
  const textes = presentations.hautPuits[langue];
  const hautPuits = etat.hautPuits;
  const projetChoisi = hautPuits.projetChoisi;
  return {
    visible:
      etat.routes.position === "haut-puits" &&
      trouverEngagementDeRouteActif(etat.routes) === undefined,
    titre: textes.titre,
    libelleColonie: textes.colonie,
    libelleStatut: textes.statut,
    libelleDevenir: textes.devenir,
    libellePressions: textes.pressions,
    libelleRelation: textes.relation,
    libelleEngagements: textes.engagements,
    libelleProjets: textes.projets,
    libelleProjetChoisi: textes.projetChoisi,
    aucunEngagement: textes.aucunEngagement,
    aucunProjetChoisi: textes.aucunProjetChoisi,
    colonie: {
      statut: textes.statuts[hautPuits.colonie.statut],
      devenir: textes.devenirs[hautPuits.colonie.devenir],
      pressions: hautPuits.colonie.pressions.map(
        (pression: PressionLocaleDeHautPuits) =>
          textes.pressionsLocales[pression],
      ),
      relationPublique: textes.relations[hautPuits.relationPublique],
      engagementsDiplomatiques: hautPuits.engagementsDiplomatiques.map(
        ({ prisA }) =>
          textes.engagement.replace("{moment}", formaterMoment(prisA)),
      ),
    },
    marche: {
      titre: textes.marche,
      action: textes.echanger,
      epuisee: textes.epuisee,
      echangesRestants: textes.echangesRestants,
      offres: hautPuits.marche.offres.map((offre) => ({
        id: offre.id,
        besoin: textes.besoins[offre.besoin],
        echangesRestants: offre.echangesRestants,
        mouvements: offre.mouvements.map(({ stock, variation }) =>
          formaterMouvement(stock, variation, textes),
        ),
        disponible: offreEstDisponible(etat, offre),
      })),
    },
    projets: hautPuits.projetsTransformationDisponibles.map(
      (projet) => textes.projetsPossibles[projet],
    ),
    projetChoisi:
      projetChoisi === null ? null : textes.projetsChoisis[projetChoisi],
    negociation: {
      titre: textes.negociation,
      ouverte: hautPuits.colonie.devenir === "negociation-ouverte",
      tranchee: textes.tranchee,
      instruction: textes.instruction,
      decisions: (["partager-eau", "proteger-reserves"] as const).map(
        (id) => ({
          id,
          ...textes.decisions[id],
        }),
      ),
    },
  };
}
