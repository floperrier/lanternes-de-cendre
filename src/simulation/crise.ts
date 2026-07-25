import type { FaitDeCampagne } from "./faits";
import type { IdentifiantDePlateformeMobile } from "./infrastructure";
import type { EtatPilotage, IdentifiantDeStock } from "./pilotage";
import type { DenouementDeCampagne } from "./denouement";

export const IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE =
  "penurie-eau.pompe-purification" as const;
export const IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE =
  "veille-basse.accueil-sous-penurie" as const;
export const IDENTIFIANT_DE_LA_CRISE_DE_TRAME =
  "trame-fer.cascade-materielle" as const;
export const IDENTIFIANT_DE_LA_CRISE_DU_HALO =
  "couronne-muette.saturation-du-halo" as const;
export const IDENTIFIANT_DE_LA_CRISE_TERMINALE =
  "extinction-du-phare" as const;
export const FAIT_ANNONCANT_LA_CRISE =
  "incident.purification.pompe-instable.debit-maintenu" as const;
export const FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE =
  "veille-basse.cohorte-accueillie" as const;
export const FAIT_ANNONCANT_LA_CRISE_DE_TRAME =
  "trame.grand-aiguillage.refroidissement-rationne" as const;
export const FAITS_ANNONCANT_LA_CRISE_DU_HALO = [
  "couronne.ouverture.clef-confiee-aux-gardiennes",
  "couronne.ouverture.clef-collective",
] as const;
export const FAITS_PREPARANT_UNE_AIDE_EXTERIEURE = [
  "couronne.colonies.voie-alliee-preparee",
  "trame.aiguillage-zero.charte-partagee",
  "couronne.tete-de-ligne.mandat-republicain",
] as const;
export const IDENTIFIANTS_DE_FAITS_DE_CRISE = [
  "crise.purification.eau-contaminee",
  "crise.purification.isoler-et-rationner",
  "crise.purification.mobiliser-les-remedes",
  "crise.purification.evacuer-les-foyers-exposes",
  "crise.veille-basse.accueil-sous-penurie",
  "crise.veille-basse.partager-reserves-cohorte",
  "crise.veille-basse.renforcer-accueil",
  "crise.trame.cascade-materielle",
  "crise.trame.etayer-chassis",
  "crise.trame.detacher-plateforme",
  "crise.couronne.saturation-du-halo",
  "crise.couronne.stabiliser-anneau-du-halo",
  "crise.couronne.relayer-halo-par-les-veilleurs",
  "crise.couronne.condamner-couronne-exterieure",
  "crise.extinction-du-phare",
  "defaite.extinction.evacuations-du-coeur",
  "defaite.extinction.transmission-sous-halo",
  "defaite.extinction.aide-exterieure-sollicitee",
] as const;
export const IDENTIFIANTS_DE_FAITS_DE_RECUPERATION = [
  "crise.recuperation.socle-de-survie.accomplie",
  "crise.recuperation.socle-de-survie.manquee",
  "crise.recuperation.mobilite-minimale.accomplie",
  "crise.recuperation.mobilite-minimale.manquee",
  "crise.recuperation.aide-exterieure-identifiee.accomplie",
  "crise.recuperation.aide-exterieure-identifiee.manquee",
  "crise.recuperation.cohorte-hydratee.accomplie",
  "crise.recuperation.cohorte-hydratee.manquee",
  "crise.recuperation.accueil-stabilise.accomplie",
  "crise.recuperation.accueil-stabilise.manquee",
  "crise.recuperation.charge-repartie-trame.accomplie",
  "crise.recuperation.charge-repartie-trame.manquee",
  "crise.recuperation.attelage-recale-trame.accomplie",
  "crise.recuperation.attelage-recale-trame.manquee",
  "crise.recuperation.halo-reparti-au-noeud.accomplie",
  "crise.recuperation.halo-reparti-au-noeud.manquee",
  "crise.recuperation.releve-des-veilleurs-au-noeud.accomplie",
  "crise.recuperation.releve-des-veilleurs-au-noeud.manquee",
  "crise.recuperation.passage-interieur-preserve.accomplie",
  "crise.recuperation.passage-interieur-preserve.manquee",
] as const;

export type IdentifiantDeCrise =
  | typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE
  | typeof IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE
  | typeof IDENTIFIANT_DE_LA_CRISE_DE_TRAME
  | typeof IDENTIFIANT_DE_LA_CRISE_DU_HALO
  | typeof IDENTIFIANT_DE_LA_CRISE_TERMINALE;
export type IdentifiantDeFaitDeCrise =
  (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[number];
export type IdentifiantDeReponseALaCrise =
  | "isoler-et-rationner"
  | "mobiliser-les-remedes"
  | "evacuer-les-foyers-exposes"
  | "partager-reserves-cohorte"
  | "renforcer-accueil"
  | "etayer-chassis"
  | "detacher-plateforme"
  | "stabiliser-anneau-du-halo"
  | "relayer-halo-par-les-veilleurs"
  | "condamner-couronne-exterieure"
  | "evacuer-le-coeur"
  | "transmettre-sous-le-halo"
  | "solliciter-aide-exterieure";
export type GarantieDeRecuperation =
  | "socle-de-survie"
  | "mobilite-minimale"
  | "aide-exterieure-identifiee"
  | "cohorte-hydratee"
  | "accueil-stabilise"
  | "charge-repartie-trame"
  | "attelage-recale-trame"
  | "halo-reparti-au-noeud"
  | "releve-des-veilleurs-au-noeud"
  | "passage-interieur-preserve";
export type ConditionDeRecuperation =
  | "halte-de-purification"
  | "rejoindre-haut-puits"
  | "demander-aide-haut-puits"
  | "ouvrir-hospice-veille-basse"
  | "renforcer-sas-veille-basse"
  | "rejoindre-marche-des-traverses"
  | "rejoindre-signal-zero"
  | "rejoindre-noeud-central";
export type StatutDeRecuperation = "amorcee" | "accomplie" | "manquee";

export interface CoutAppliqueAUneRecuperation {
  readonly stock: IdentifiantDeStock;
  readonly quantite: number;
}

export interface AlerteDeCrise {
  readonly id: IdentifiantDeCrise;
  readonly cause: string;
  readonly annonceeA: number;
  readonly ruptureA: number;
  readonly chaineVisible: readonly {
    readonly id: string;
    readonly cause: string;
    readonly irreversible: boolean;
  }[];
}

export interface CriseActive {
  readonly id: IdentifiantDeCrise;
  readonly cause: AlerteDeCrise["cause"];
  readonly declencheeA: number;
  readonly faitProduit:
    | "crise.purification.eau-contaminee"
    | "crise.veille-basse.accueil-sous-penurie"
    | "crise.trame.cascade-materielle"
    | "crise.couronne.saturation-du-halo"
    | "crise.extinction-du-phare";
  readonly chaineVisible: readonly {
    readonly id: string;
    readonly cause: string;
    readonly irreversible: boolean;
  }[];
}

export interface CicatriceDeCampagne {
  readonly id:
    | "cicatrice.rationnement-deau"
    | "cicatrice.reserve-de-remedes-entamee"
    | "cicatrice.evacuation-des-foyers"
    | "cicatrice.reserves-partagees-veille-basse"
    | "cicatrice.capacites-accueil-saturees"
    | "cicatrice.chassis-etaye-dans-l-urgence"
    | "cicatrice.plateforme-detachee-trame"
    | "cicatrice.halo-bride-par-les-etais"
    | "cicatrice.veilleurs-lies-au-halo"
    | "cicatrice.couronne-exterieure-condamnee";
  readonly cause:
    | "crise.purification.isoler-et-rationner"
    | "crise.purification.mobiliser-les-remedes"
    | "crise.purification.evacuer-les-foyers-exposes"
    | "crise.veille-basse.partager-reserves-cohorte"
    | "crise.veille-basse.renforcer-accueil"
    | "crise.trame.etayer-chassis"
    | "crise.trame.detacher-plateforme"
    | "crise.couronne.stabiliser-anneau-du-halo"
    | "crise.couronne.relayer-halo-par-les-veilleurs"
    | "crise.couronne.condamner-couronne-exterieure";
  readonly acquiseA: number;
  readonly irreversible: true;
}

export interface RecuperationDeCrise {
  readonly id: string;
  readonly cause: CicatriceDeCampagne["id"];
  readonly garantie: GarantieDeRecuperation;
  readonly destination:
    | "halte-du-puits-sec"
    | "haut-puits"
    | "veille-basse"
    | "marche-des-traverses"
    | "signal-zero"
    | "noeud-central";
  readonly condition: ConditionDeRecuperation;
  readonly horizonTroncons: 1 | 2;
  readonly coutAttendu: "deux-materiaux" | "cout-du-troncon";
  readonly amorceeA: number;
  readonly statut: StatutDeRecuperation;
  readonly accomplieA: number | null;
  readonly manqueeA: number | null;
  readonly faitResultat: string | null;
  readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
}

export interface CriseHistorique {
  readonly id: IdentifiantDeCrise;
  readonly cause: CriseActive["cause"];
  readonly declencheeA: number;
  readonly faitDeclenchement: CriseActive["faitProduit"];
  readonly resolueA: number;
  readonly reponseId: IdentifiantDeReponseALaCrise;
  readonly faitResolution:
    | CicatriceDeCampagne["cause"]
    | "defaite.extinction.evacuations-du-coeur"
    | "defaite.extinction.transmission-sous-halo"
    | "defaite.extinction.aide-exterieure-sollicitee";
}

export interface EtatDesCrises {
  readonly approvisionnementEau: "assure" | "sous-tension" | "rupture";
  readonly faitAnnonceurHistoriqueIgnore: boolean;
  readonly crisesSequentiellesHistoriquesIgnorees: boolean;
  readonly crisesDeTrameHistoriquesIgnorees: boolean;
  readonly crisesDuHaloHistoriquesIgnorees: boolean;
  readonly alerte: AlerteDeCrise | null;
  readonly criseActive: CriseActive | null;
  readonly historique: readonly CriseHistorique[];
  readonly cicatrices: readonly CicatriceDeCampagne[];
  readonly recuperations: readonly RecuperationDeCrise[];
}

interface CoutDeReponse {
  readonly stock?: IdentifiantDeStock;
  readonly quantite?: number;
  readonly habitants?: number;
  readonly plateformes?: number;
}

export interface DefinitionDeReponseALaCrise {
  readonly criseId: IdentifiantDeCrise;
  readonly id: IdentifiantDeReponseALaCrise;
  readonly faitProduit: CriseHistorique["faitResolution"];
  readonly acteurs: readonly string[];
  readonly cible: string;
  readonly dernierRecours: boolean;
  readonly cout: CoutDeReponse;
  readonly cicatrice?: Omit<CicatriceDeCampagne, "cause" | "acquiseA">;
  readonly recuperation?: Pick<
    RecuperationDeCrise,
    | "garantie"
    | "destination"
    | "condition"
    | "horizonTroncons"
    | "coutAttendu"
  >;
  readonly terminale?: true;
  readonly aideExterieureRequise?: true;
  readonly devenirs?: Extract<
    DenouementDeCampagne,
    { readonly statut: "defaite" }
  >["devenirs"];
}

export const DEFINITIONS_DES_REPONSES_A_LA_CRISE: readonly DefinitionDeReponseALaCrise[] = [
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
    id: "isoler-et-rationner",
    faitProduit: "crise.purification.isoler-et-rationner",
    acteurs: ["porte-lanterne", "equipes-purification"],
    cible: "pompe-purification",
    dernierRecours: false,
    cout: { stock: "materiaux", quantite: 4 },
    cicatrice: {
      id: "cicatrice.rationnement-deau",
      irreversible: true,
    },
    recuperation: {
      garantie: "socle-de-survie",
      destination: "halte-du-puits-sec",
      condition: "halte-de-purification",
      horizonTroncons: 2,
      coutAttendu: "deux-materiaux",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
    id: "mobiliser-les-remedes",
    faitProduit: "crise.purification.mobiliser-les-remedes",
    acteurs: ["porte-lanterne", "equipes-medicales"],
    cible: "pompe-purification",
    dernierRecours: false,
    cout: { stock: "remedes", quantite: 5 },
    cicatrice: {
      id: "cicatrice.reserve-de-remedes-entamee",
      irreversible: true,
    },
    recuperation: {
      garantie: "mobilite-minimale",
      destination: "haut-puits",
      condition: "rejoindre-haut-puits",
      horizonTroncons: 2,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
    id: "evacuer-les-foyers-exposes",
    faitProduit: "crise.purification.evacuer-les-foyers-exposes",
    acteurs: ["porte-lanterne", "foyers-exposes"],
    cible: "foyers-du-convoi",
    dernierRecours: true,
    cout: { habitants: 8 },
    cicatrice: {
      id: "cicatrice.evacuation-des-foyers",
      irreversible: true,
    },
    recuperation: {
      garantie: "aide-exterieure-identifiee",
      destination: "haut-puits",
      condition: "demander-aide-haut-puits",
      horizonTroncons: 1,
      coutAttendu: "deux-materiaux",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
    id: "partager-reserves-cohorte",
    faitProduit: "crise.veille-basse.partager-reserves-cohorte",
    acteurs: ["porte-lanterne", "cohorte-du-sillon"],
    cible: "reserves-de-veille-basse",
    dernierRecours: false,
    cout: { stock: "vivres", quantite: 6 },
    cicatrice: {
      id: "cicatrice.reserves-partagees-veille-basse",
      irreversible: true,
    },
    recuperation: {
      garantie: "cohorte-hydratee",
      destination: "veille-basse",
      condition: "ouvrir-hospice-veille-basse",
      horizonTroncons: 1,
      coutAttendu: "deux-materiaux",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
    id: "renforcer-accueil",
    faitProduit: "crise.veille-basse.renforcer-accueil",
    acteurs: ["porte-lanterne", "techniciens-veille-basse"],
    cible: "capacites-accueil-veille-basse",
    dernierRecours: false,
    cout: { stock: "materiaux", quantite: 5 },
    cicatrice: {
      id: "cicatrice.capacites-accueil-saturees",
      irreversible: true,
    },
    recuperation: {
      garantie: "accueil-stabilise",
      destination: "veille-basse",
      condition: "renforcer-sas-veille-basse",
      horizonTroncons: 2,
      coutAttendu: "deux-materiaux",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
    id: "etayer-chassis",
    faitProduit: "crise.trame.etayer-chassis",
    acteurs: ["porte-lanterne", "equipes-entretien"],
    cible: "chassis-de-la-cite-caravane",
    dernierRecours: false,
    cout: { stock: "materiaux", quantite: 7 },
    cicatrice: {
      id: "cicatrice.chassis-etaye-dans-l-urgence",
      irreversible: true,
    },
    recuperation: {
      garantie: "charge-repartie-trame",
      destination: "marche-des-traverses",
      condition: "rejoindre-marche-des-traverses",
      horizonTroncons: 1,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
    id: "detacher-plateforme",
    faitProduit: "crise.trame.detacher-plateforme",
    acteurs: ["porte-lanterne", "equipes-entretien"],
    cible: "plateforme-mobile-detachee",
    dernierRecours: false,
    cout: { plateformes: 1 },
    cicatrice: {
      id: "cicatrice.plateforme-detachee-trame",
      irreversible: true,
    },
    recuperation: {
      garantie: "attelage-recale-trame",
      destination: "signal-zero",
      condition: "rejoindre-signal-zero",
      horizonTroncons: 2,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DU_HALO,
    id: "stabiliser-anneau-du-halo",
    faitProduit: "crise.couronne.stabiliser-anneau-du-halo",
    acteurs: ["porte-lanterne", "equipes-entretien-du-phare"],
    cible: "anneau-du-halo",
    dernierRecours: false,
    cout: { stock: "materiaux", quantite: 6 },
    cicatrice: {
      id: "cicatrice.halo-bride-par-les-etais",
      irreversible: true,
    },
    recuperation: {
      garantie: "halo-reparti-au-noeud",
      destination: "noeud-central",
      condition: "rejoindre-noeud-central",
      horizonTroncons: 1,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DU_HALO,
    id: "relayer-halo-par-les-veilleurs",
    faitProduit: "crise.couronne.relayer-halo-par-les-veilleurs",
    acteurs: ["porte-lanterne", "veilleurs-de-la-couronne"],
    cible: "veille-du-halo",
    dernierRecours: false,
    cout: { habitants: 5 },
    cicatrice: {
      id: "cicatrice.veilleurs-lies-au-halo",
      irreversible: true,
    },
    recuperation: {
      garantie: "releve-des-veilleurs-au-noeud",
      destination: "noeud-central",
      condition: "rejoindre-noeud-central",
      horizonTroncons: 1,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_DU_HALO,
    id: "condamner-couronne-exterieure",
    faitProduit: "crise.couronne.condamner-couronne-exterieure",
    acteurs: ["porte-lanterne", "foyers-de-la-couronne"],
    cible: "couronne-exterieure",
    dernierRecours: true,
    cout: { habitants: 11 },
    cicatrice: {
      id: "cicatrice.couronne-exterieure-condamnee",
      irreversible: true,
    },
    recuperation: {
      garantie: "passage-interieur-preserve",
      destination: "noeud-central",
      condition: "rejoindre-noeud-central",
      horizonTroncons: 1,
      coutAttendu: "cout-du-troncon",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_TERMINALE,
    id: "evacuer-le-coeur",
    faitProduit: "defaite.extinction.evacuations-du-coeur",
    acteurs: ["porte-lanterne", "foyers-du-coeur"],
    cible: "evacuation-prioritaire-du-coeur",
    dernierRecours: true,
    cout: { habitants: 14 },
    terminale: true,
    devenirs: {
      habitants: "evacuation-prioritaire",
      coeur: "abandonne",
      connaissances: "registres-emportes",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_TERMINALE,
    id: "transmettre-sous-le-halo",
    faitProduit: "defaite.extinction.transmission-sous-halo",
    acteurs: ["porte-lanterne", "equipes-du-phare"],
    cible: "derniere-transmission-du-halo",
    dernierRecours: true,
    cout: { habitants: 28 },
    terminale: true,
    devenirs: {
      habitants: "transmission-sacrificielle",
      coeur: "eteint-apres-transmission",
      connaissances: "transmises-aux-colonies",
    },
  },
  {
    criseId: IDENTIFIANT_DE_LA_CRISE_TERMINALE,
    id: "solliciter-aide-exterieure",
    faitProduit: "defaite.extinction.aide-exterieure-sollicitee",
    acteurs: ["porte-lanterne", "allies-de-la-couronne"],
    cible: "evacuation-alliee-du-coeur",
    dernierRecours: true,
    cout: { habitants: 9 },
    terminale: true,
    aideExterieureRequise: true,
    devenirs: {
      habitants: "evacuation-alliee",
      coeur: "confie-aux-allies",
      connaissances: "copies-partagees",
    },
  },
] as const;

export type EvenementDeCrise =
  | {
      readonly type: "crise.aggravation-annoncee";
      readonly criseId: IdentifiantDeCrise;
      readonly cause: AlerteDeCrise["cause"];
      readonly ruptureA: number;
      readonly maillonIrreversible: string;
    }
  | {
      readonly type: "crise.checkpoint-requis";
      readonly criseId: IdentifiantDeCrise;
      readonly cause: AlerteDeCrise["cause"];
      readonly moment: number;
      readonly sauvegardeAtomiqueRequise: true;
    }
  | {
      readonly type: "crise.declenchee";
      readonly criseId: IdentifiantDeCrise;
      readonly cause: AlerteDeCrise["cause"];
      readonly moment: number;
      readonly sauvegardeAtomiqueRequise: true;
      readonly faitProduit: CriseActive["faitProduit"];
      readonly maillonIrreversible: string;
    }
  | {
      readonly type: "crise.resolue";
      readonly criseId: IdentifiantDeCrise;
      readonly reponseId: IdentifiantDeReponseALaCrise;
      readonly moment: number;
      readonly faitProduit: Exclude<
        IdentifiantDeFaitDeCrise,
        | "crise.purification.eau-contaminee"
        | "crise.veille-basse.accueil-sous-penurie"
        | "crise.trame.cascade-materielle"
        | "crise.couronne.saturation-du-halo"
      >;
      readonly cicatriceId: CicatriceDeCampagne["id"];
      readonly garantie: GarantieDeRecuperation;
      readonly maillonIrreversible: CicatriceDeCampagne["id"];
    }
  | {
      readonly type: "crise.terminale-resolue";
      readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_TERMINALE;
      readonly reponseId:
        | "evacuer-le-coeur"
        | "transmettre-sous-le-halo"
        | "solliciter-aide-exterieure";
      readonly moment: number;
      readonly faitProduit:
        | "defaite.extinction.evacuations-du-coeur"
        | "defaite.extinction.transmission-sous-halo"
        | "defaite.extinction.aide-exterieure-sollicitee";
      readonly maillonIrreversible: "phare.eteint";
    }
  | {
      readonly type: "crise.recuperation-accomplie";
      readonly recuperationId: string;
      readonly garantie: GarantieDeRecuperation;
      readonly cause: CicatriceDeCampagne["id"];
      readonly moment: number;
      readonly faitProduit: string;
      readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
    }
  | {
      readonly type: "crise.recuperation-manquee";
      readonly recuperationId: string;
      readonly garantie: GarantieDeRecuperation;
      readonly cause: CicatriceDeCampagne["id"];
      readonly moment: number;
      readonly faitProduit: string;
      readonly horizonTroncons: 1 | 2;
    };

export type ActionSignificativeDeRecuperation =
  | {
      readonly type: "halte-deployee";
      readonly destination: "halte-du-puits-sec" | "haut-puits";
    }
  | {
      readonly type: "troncon-termine";
      readonly destination: string;
      readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
    }
  | {
      readonly type: "aide-demandee-haut-puits";
    }
  | {
      readonly type:
        | "hospice-ouvert-veille-basse"
        | "sas-renforce-veille-basse";
    };

export interface ContexteDEvaluationDesRecuperations {
  readonly moment: number;
  readonly action: ActionSignificativeDeRecuperation | null;
  readonly momentsDesTronconsTermines: readonly number[];
  readonly materiauxDisponibles: number;
  readonly demandeDAideEnAttente: boolean;
}

export interface ContexteMaterielDeCrise {
  readonly momentCourant: number;
  readonly position: string;
  readonly margeDeCharge: number;
  readonly doctrineEntretien: "preventif" | "equilibre" | "urgence";
  readonly materiauxDisponibles: number;
  readonly plateformesDisponibles: number;
  readonly dernierTronconTermine: string | null;
  readonly etatDuDernierTroncon: "praticable" | "degrade" | "coupe" | null;
  readonly phare?: "actif" | "halo-sature" | "eteint";
  readonly habitantsDisponibles?: number;
}

export interface TransitionDesRecuperations {
  readonly etat: EtatDesCrises;
  readonly variationsDeStocks: readonly {
    readonly stock: IdentifiantDeStock;
    readonly variation: number;
  }[];
  readonly faits: readonly FaitDeCampagne[];
  readonly evenements: readonly EvenementDeCrise[];
}

export interface CommandeDeResolutionDeCrise {
  readonly type: "crise.resoudre";
  readonly criseId: IdentifiantDeCrise;
  readonly reponseId: IdentifiantDeReponseALaCrise;
}

export interface CommandeDeDeclenchementDeCrise {
  readonly type: "crise.declencher";
  readonly criseId: IdentifiantDeCrise;
}

export function creerEtatDesCrisesInitial(): EtatDesCrises {
  return {
    approvisionnementEau: "assure",
    faitAnnonceurHistoriqueIgnore: false,
    crisesSequentiellesHistoriquesIgnorees: false,
    crisesDeTrameHistoriquesIgnorees: false,
    crisesDuHaloHistoriquesIgnorees: false,
    alerte: null,
    criseActive: null,
    historique: [],
    cicatrices: [],
    recuperations: [],
  };
}

export function reconstruireHistoriqueDesCrises(
  faits: readonly FaitDeCampagne[],
): readonly CriseHistorique[] {
  const crises = [
    {
      id: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
      cause: FAIT_ANNONCANT_LA_CRISE,
      faitDeclenchement: "crise.purification.eau-contaminee",
    },
    {
      id: IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
      cause: FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
      faitDeclenchement: "crise.veille-basse.accueil-sous-penurie",
    },
    {
      id: IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
      cause: FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
      faitDeclenchement: "crise.trame.cascade-materielle",
    },
    {
      id: IDENTIFIANT_DE_LA_CRISE_DU_HALO,
      cause: FAITS_ANNONCANT_LA_CRISE_DU_HALO[0],
      faitDeclenchement: "crise.couronne.saturation-du-halo",
    },
  ] as const;
  return crises.flatMap((crise) => {
    const declenchement = faits.find(
      (fait) => fait.id === crise.faitDeclenchement,
    );
    const definition = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
      (candidate) =>
        candidate.criseId === crise.id &&
        faits.some((fait) => fait.id === candidate.faitProduit),
    );
    const resolution =
      definition === undefined
        ? undefined
        : faits.find((fait) => fait.id === definition.faitProduit);
    if (
      declenchement === undefined ||
      definition === undefined ||
      resolution === undefined
    ) {
      return [];
    }
    return [
      {
        id: crise.id,
        cause:
          (crise.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO
            ? declenchement.cause
            : crise.cause) as CriseHistorique["cause"],
        declencheeA: declenchement.moment,
        faitDeclenchement: crise.faitDeclenchement,
        resolueA: resolution.moment,
        reponseId: definition.id,
        faitResolution: definition.faitProduit,
      },
    ];
  });
}

export function annoncerCriseApresFaits(
  etat: EtatDesCrises,
  faits: readonly FaitDeCampagne[],
  contexteMateriel?: ContexteMaterielDeCrise,
  options: {
    readonly extinction?: "historique";
  } = {},
): {
  readonly etat: EtatDesCrises;
  readonly evenements: readonly EvenementDeCrise[];
} {
  if (etat.alerte !== null || etat.criseActive !== null) {
    return { etat, evenements: [] };
  }
  const idsHistoriques = new Set(etat.historique.map(({ id }) => id));
  const faitDePurification = faits.find(
    (candidat) => candidat.id === FAIT_ANNONCANT_LA_CRISE,
  );
  const faitDeVeilleBasse = faits.find(
    (candidat) =>
      candidat.id === FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
  );
  const faitDeTrame = faits.find(
    (candidat) => candidat.id === FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
  );
  const faitDuHalo = [...faits]
    .reverse()
    .find((candidat) =>
      FAITS_ANNONCANT_LA_CRISE_DU_HALO.includes(
        candidat.id as (typeof FAITS_ANNONCANT_LA_CRISE_DU_HALO)[number],
      ),
    );
  let alerte: AlerteDeCrise | null = null;
  let maillonIrreversible = "";
  if (
    !etat.faitAnnonceurHistoriqueIgnore &&
    !idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE) &&
    faitDePurification !== undefined
  ) {
    alerte = {
      id: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
      cause: FAIT_ANNONCANT_LA_CRISE,
      annonceeA: faitDePurification.moment,
      ruptureA: faitDePurification.moment + 180,
      chaineVisible: [
        {
          id: "pompe-purification.degradee",
          cause: FAIT_ANNONCANT_LA_CRISE,
          irreversible: true,
        },
        {
          id: "eau.purifiee.contamination-annoncee",
          cause: "pompe-purification.degradee",
          irreversible: false,
        },
      ],
    };
    maillonIrreversible = "pompe-purification.degradee";
  } else if (
    idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE) &&
    !idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE) &&
    !etat.crisesSequentiellesHistoriquesIgnorees &&
    etat.approvisionnementEau !== "assure" &&
    faitDeVeilleBasse !== undefined
  ) {
    alerte = {
      id: IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE,
      cause: FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
      annonceeA: faitDeVeilleBasse.moment,
      ruptureA: faitDeVeilleBasse.moment + 120,
      chaineVisible: [
        {
          id: "veille-basse.cohorte-accueillie-sous-penurie",
          cause: FAIT_ANNONCANT_LA_CRISE_DE_VEILLE_BASSE,
          irreversible: true,
        },
        {
          id: "veille-basse.capacite-accueil-saturee-annoncee",
          cause: "veille-basse.cohorte-accueillie-sous-penurie",
          irreversible: false,
        },
      ],
    };
    maillonIrreversible =
      "veille-basse.cohorte-accueillie-sous-penurie";
  } else if (
    idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE) &&
    idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE) &&
    !idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DE_TRAME) &&
    !etat.crisesDeTrameHistoriquesIgnorees &&
    faitDeTrame !== undefined &&
    contexteMateriel?.position === "grand-aiguillage" &&
    contexteMateriel.margeDeCharge <= 12 &&
    contexteMateriel.doctrineEntretien !== "preventif" &&
    contexteMateriel.materiauxDisponibles >= 7 &&
    contexteMateriel.plateformesDisponibles > 1 &&
    contexteMateriel.dernierTronconTermine ===
      "voie-des-ponts-lourds" &&
    (contexteMateriel.etatDuDernierTroncon === "degrade" ||
      contexteMateriel.etatDuDernierTroncon === "coupe")
  ) {
    alerte = {
      id: IDENTIFIANT_DE_LA_CRISE_DE_TRAME,
      cause: FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
      annonceeA: contexteMateriel.momentCourant,
      ruptureA: contexteMateriel.momentCourant + 120,
      chaineVisible: [
        {
          id: "trame.ponts-lourds-fatigues",
          cause: "voie-des-ponts-lourds.degradee",
          irreversible: true,
        },
        {
          id: "trame.charge-sans-marge",
          cause: "trame.ponts-lourds-fatigues",
          irreversible: false,
        },
        {
          id: "trame.refroidissement-differe",
          cause: FAIT_ANNONCANT_LA_CRISE_DE_TRAME,
          irreversible: false,
        },
      ],
    };
    maillonIrreversible = "trame.ponts-lourds-fatigues";
  } else if (
    !idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_DU_HALO) &&
    !idsHistoriques.has(IDENTIFIANT_DE_LA_CRISE_TERMINALE) &&
    !etat.crisesDuHaloHistoriquesIgnorees &&
    faitDuHalo !== undefined &&
    contexteMateriel?.position === "anneau-interieur" &&
    contexteMateriel.phare === "actif" &&
    etat.cicatrices.length > 0 &&
    etat.recuperations.length > 0
  ) {
    const ouverture = [...faits]
      .reverse()
      .find((fait) =>
        [
          "couronne.ouverture.rail-ouverte",
          "couronne.ouverture.phares-ouvertes",
          "couronne.ouverture.colonies-ouvertes",
          "couronne.ouverture.breche-ouverte",
        ].includes(fait.id),
      );
    if (ouverture !== undefined) {
      const cicatrices = etat.cicatrices.map((cicatrice) => ({
        id: cicatrice.id,
        cause: cicatrice.cause,
        irreversible: true,
      }));
      const recuperations = etat.recuperations.map((recuperation) => ({
        id: `recuperation.${recuperation.garantie}.${recuperation.statut}`,
        cause: recuperation.cause,
        irreversible: recuperation.statut === "manquee",
      }));
      const recuperationManquee = [...etat.recuperations]
        .reverse()
        .find(
          (recuperation) =>
            recuperation.statut === "manquee" &&
            recuperation.faitResultat !== null,
        );
      const nombreDeRecuperationsManquees = etat.recuperations.filter(
        (recuperation) => recuperation.statut === "manquee",
      ).length;
      const habitantsDisponibles =
        contexteMateriel.habitantsDisponibles ??
        Number.POSITIVE_INFINITY;
      const reponsesDeSurvieDisponibles = [
        contexteMateriel.materiauxDisponibles >= 6 &&
          nombreDeRecuperationsManquees < 2,
        recuperationManquee === undefined && habitantsDisponibles > 5,
        habitantsDisponibles > 11,
      ].filter(Boolean).length;
      const extinctionEstInevitable =
        recuperationManquee !== undefined &&
        etat.historique.length > 0 &&
        reponsesDeSurvieDisponibles < 2 &&
        options.extinction !== "historique";
      if (extinctionEstInevitable) {
        const indisponibilites = [
          ...(contexteMateriel.materiauxDisponibles < 6 ||
          nombreDeRecuperationsManquees >= 2
            ? [
                {
                  id: "reponse.stabiliser-anneau-du-halo.indisponible",
                  cause:
                    recuperationManquee.faitResultat ??
                    recuperationManquee.cause,
                  irreversible: false,
                },
              ]
            : []),
          {
            id: "reponse.relayer-halo-par-les-veilleurs.indisponible",
            cause:
              recuperationManquee.faitResultat ??
              recuperationManquee.cause,
            irreversible: true,
          },
          ...(habitantsDisponibles <= 11
            ? [
                {
                  id: "reponse.condamner-couronne-exterieure.indisponible",
                  cause:
                    recuperationManquee.faitResultat ??
                    recuperationManquee.cause,
                  irreversible: false,
                },
              ]
            : []),
        ];
        alerte = {
          id: IDENTIFIANT_DE_LA_CRISE_TERMINALE,
          cause:
            recuperationManquee.faitResultat ??
            recuperationManquee.cause,
          annonceeA: contexteMateriel.momentCourant,
          ruptureA: contexteMateriel.momentCourant + 120,
          chaineVisible: [
            {
              id: ouverture.id,
              cause: faitDuHalo.id,
              irreversible:
                ouverture.id === "couronne.ouverture.breche-ouverte",
            },
            ...cicatrices,
            ...recuperations,
            ...indisponibilites,
            {
              id: "phare.extinction-annoncee",
              cause: indisponibilites.at(-1)?.id ?? ouverture.id,
              irreversible: true,
            },
          ],
        };
        maillonIrreversible =
          recuperationManquee.faitResultat ??
          recuperationManquee.cause;
      } else {
      alerte = {
        id: IDENTIFIANT_DE_LA_CRISE_DU_HALO,
        cause:
          faitDuHalo.id as (typeof FAITS_ANNONCANT_LA_CRISE_DU_HALO)[number],
        annonceeA: contexteMateriel.momentCourant,
        ruptureA: contexteMateriel.momentCourant + 120,
        chaineVisible: [
          {
            id: ouverture.id,
            cause: faitDuHalo.id,
            irreversible:
              ouverture.id === "couronne.ouverture.breche-ouverte",
          },
          ...cicatrices,
          ...recuperations,
          {
            id: "phare.halo-sature-annonce",
            cause:
              recuperations.at(-1)?.id ??
              cicatrices.at(-1)?.id ??
              ouverture.id,
            irreversible: false,
          },
        ],
      };
      maillonIrreversible =
        cicatrices.at(-1)?.id ?? ouverture.id;
      }
    }
  }
  if (alerte === null) {
    return { etat, evenements: [] };
  }
  return {
    etat: {
      ...etat,
      approvisionnementEau:
        alerte.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO ||
        alerte.id === IDENTIFIANT_DE_LA_CRISE_TERMINALE
          ? etat.approvisionnementEau
          : "sous-tension",
      alerte,
    },
    evenements: [
      {
        type: "crise.aggravation-annoncee",
        criseId: alerte.id,
        cause: alerte.cause,
        ruptureA: alerte.ruptureA,
        maillonIrreversible,
      },
    ],
  };
}

export function ignorerFaitAnnonceurHistorique(
  etat: EtatDesCrises,
): EtatDesCrises {
  return { ...etat, faitAnnonceurHistoriqueIgnore: true };
}

export function criseAttendSonCheckpoint(
  etat: EtatDesCrises,
  moment: number,
): boolean {
  return (
    etat.criseActive === null &&
    etat.alerte !== null &&
    etat.alerte.ruptureA <= moment
  );
}

export function prochaineSecondeDeCrise(
  etat: EtatDesCrises,
  secondeFinaleDemandee: number,
): number | undefined {
  const ruptureA = etat.alerte?.ruptureA;
  return ruptureA !== undefined && ruptureA <= secondeFinaleDemandee
    ? ruptureA
    : undefined;
}

export function declencherCrise(
  etat: EtatDesCrises,
  eauDisponible: number,
  moment: number,
): {
  readonly etat: EtatDesCrises;
  readonly variationDEau: number;
  readonly fait: FaitDeCampagne;
  readonly evenement: EvenementDeCrise;
} | undefined {
  const alerte = etat.alerte;
  if (alerte === null || alerte.ruptureA !== moment) {
    return undefined;
  }
  const estPurification =
    alerte.id === IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
  const estVeilleBasse =
    alerte.id === IDENTIFIANT_DE_LA_CRISE_DE_VEILLE_BASSE;
  const estHalo = alerte.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO;
  const estExtinction =
    alerte.id === IDENTIFIANT_DE_LA_CRISE_TERMINALE;
  const variationDEau = estPurification
    ? Math.min(0, 16 - eauDisponible)
    : 0;
  const faitProduit = estPurification
    ? "crise.purification.eau-contaminee"
    : estVeilleBasse
      ? "crise.veille-basse.accueil-sous-penurie"
      : estExtinction
        ? "crise.extinction-du-phare"
      : estHalo
        ? "crise.couronne.saturation-du-halo"
        : "crise.trame.cascade-materielle";
  const fait: FaitDeCampagne = {
    id: faitProduit,
    cause: alerte.cause,
    acteurs: estPurification
      ? ["equipes-purification", "foyers-du-convoi"]
      : estVeilleBasse
        ? ["cohorte-du-sillon", "techniciens-veille-basse"]
        : estExtinction
          ? ["foyers-du-coeur", "equipes-du-phare"]
        : estHalo
          ? ["veilleurs-de-la-couronne", "equipes-du-phare"]
        : ["equipes-entretien", "ateliers-grand-aiguillage"],
    cible: estPurification
      ? "reserve-deau-purifiee"
      : estVeilleBasse
        ? "capacites-accueil-veille-basse"
        : estExtinction
          ? "phare-de-la-cite-caravane"
        : estHalo
          ? "halo-du-phare"
        : "chassis-de-la-cite-caravane",
    moment,
    effets: {
      materiels: estPurification
        ? [
            {
              type: "stock.modifie",
              stock: "eau",
              variation: variationDEau,
            },
          ]
        : [],
      humains: [{ type: "habitants.exposes", nombre: 0 }],
    },
  };
  const criseActive: CriseActive = {
    id: alerte.id,
    cause: alerte.cause,
    declencheeA: moment,
    faitProduit,
    chaineVisible: [
      ...alerte.chaineVisible,
      {
        id: estPurification
          ? "eau.purifiee.contaminee"
          : estVeilleBasse
            ? "veille-basse.reserves-et-accueil-en-rupture"
            : estExtinction
              ? "phare.extinction-imminente"
            : estHalo
              ? "phare.halo-sature"
            : "trame.chassis-en-cascade",
        cause: estPurification
          ? "eau.purifiee.contamination-annoncee"
          : estVeilleBasse
            ? "veille-basse.capacite-accueil-saturee-annoncee"
            : estExtinction
              ? "phare.extinction-annoncee"
            : estHalo
              ? "phare.halo-sature-annonce"
            : "trame.refroidissement-differe",
        irreversible: true,
      },
    ],
  };
  return {
    etat: {
      ...etat,
      approvisionnementEau: estPurification
        ? "rupture"
        : etat.approvisionnementEau,
      criseActive,
    },
    variationDEau,
    fait,
    evenement: {
      type: "crise.declenchee",
      criseId: criseActive.id,
      cause: criseActive.cause,
      moment,
      sauvegardeAtomiqueRequise: true,
      faitProduit: criseActive.faitProduit,
      maillonIrreversible: estPurification
        ? "eau.purifiee.contaminee"
        : estVeilleBasse
          ? "veille-basse.reserves-et-accueil-en-rupture"
          : estExtinction
            ? "phare.extinction-imminente"
          : estHalo
            ? "phare.halo-sature"
          : "trame.chassis-en-cascade",
    },
  };
}

function trouverReponse(
  id: IdentifiantDeReponseALaCrise,
  criseId: IdentifiantDeCrise,
): DefinitionDeReponseALaCrise {
  const reponse = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
    (candidate) => candidate.id === id && candidate.criseId === criseId,
  );
  if (reponse === undefined) {
    throw new Error(`La réponse de Crise « ${id} » est inconnue.`);
  }
  return reponse;
}

export function listerDefinitionsDesReponsesALaCrise(
  criseId: IdentifiantDeCrise,
): readonly DefinitionDeReponseALaCrise[] {
  return DEFINITIONS_DES_REPONSES_A_LA_CRISE.filter(
    (reponse) => reponse.criseId === criseId,
  );
}

export function reponseALaCriseEstViable(
  reponse: DefinitionDeReponseALaCrise,
  pilotage: EtatPilotage,
  habitants: number,
  plateformes = Number.POSITIVE_INFINITY,
  plateformesDetachables = Math.max(0, plateformes - 1),
  aideExterieurePreparee = false,
): boolean {
  if (reponse.aideExterieureRequise) {
    return aideExterieurePreparee;
  }
  if (reponse.terminale) {
    return true;
  }
  if (reponse.cout.stock !== undefined) {
    return (
      pilotage.economie.stocks[reponse.cout.stock].quantite >=
      (reponse.cout.quantite ?? 0)
    );
  }
  if (reponse.cout.plateformes !== undefined) {
    return (
      plateformes > reponse.cout.plateformes &&
      plateformesDetachables >= reponse.cout.plateformes
    );
  }
  return habitants > (reponse.cout.habitants ?? 0);
}

export function resoudreCrise(
  etat: EtatDesCrises,
  pilotage: EtatPilotage,
  habitants: number,
  plateformes: number,
  commande: CommandeDeResolutionDeCrise,
  moment: number,
  plateformesDisponibles?: readonly IdentifiantDePlateformeMobile[],
): {
  readonly etat: EtatDesCrises;
  readonly variationDeStock:
    | { readonly stock: IdentifiantDeStock; readonly variation: number }
    | undefined;
  readonly variationDHabitants: number;
  readonly plateformeADetacher: IdentifiantDePlateformeMobile | null;
  readonly fait: FaitDeCampagne;
  readonly evenement: EvenementDeCrise;
} {
  const crise = etat.criseActive;
  if (crise === null || crise.id !== commande.criseId) {
    throw new Error(`La Crise « ${commande.criseId} » n’est pas active.`);
  }
  const reponse = trouverReponse(commande.reponseId, crise.id);
  if (
    reponse.terminale ||
    reponse.cicatrice === undefined ||
    reponse.recuperation === undefined
  ) {
    throw new Error(
      "La réponse terminale doit être résolue par le Dénouement.",
    );
  }
  if (
    !reponseALaCriseEstViable(
      reponse,
      pilotage,
      habitants,
      plateformes,
      plateformesDisponibles?.length,
    )
  ) {
    throw new Error("Les ressources disponibles ne couvrent pas cette réponse.");
  }
  const faitProduit =
    reponse.faitProduit as CicatriceDeCampagne["cause"];
  const variationDeStock =
    reponse.cout.stock === undefined
      ? undefined
      : {
          stock: reponse.cout.stock,
          variation: -(reponse.cout.quantite ?? 0),
        };
  const variationDHabitants = -(reponse.cout.habitants ?? 0);
  let plateformeADetacher: IdentifiantDePlateformeMobile | null =
    null;
  if (reponse.cout.plateformes !== undefined) {
    const candidate =
      plateformesDisponibles?.find(
        (plateforme) => plateforme === "intendance",
      ) ?? plateformesDisponibles?.[0];
    if (candidate === undefined) {
      throw new Error("Aucune Plateforme libre ne peut être détachée.");
    }
    plateformeADetacher = candidate;
  }
  const fait: FaitDeCampagne = {
    id: faitProduit,
    cause: crise.id,
    acteurs: reponse.acteurs,
    cible: reponse.cible,
    moment,
    effets: {
      materiels:
        variationDeStock !== undefined
          ? [{ type: "stock.modifie", ...variationDeStock }]
          : plateformeADetacher === null
            ? []
            : [
                {
                  type: "plateforme.detachee",
                  plateforme: plateformeADetacher,
                },
              ],
      humains:
        variationDHabitants === 0
          ? []
          : [{ type: "habitants.modifies", variation: variationDHabitants }],
    },
  };
  const cicatrice: CicatriceDeCampagne = {
    ...reponse.cicatrice,
    cause: faitProduit,
    acquiseA: moment,
  };
  const recuperation: RecuperationDeCrise = {
    ...reponse.recuperation,
    id: `recuperation.${etat.recuperations.length + 1}`,
    cause: cicatrice.id,
    amorceeA: moment,
    statut: "amorcee",
    accomplieA: null,
    manqueeA: null,
    faitResultat: null,
    coutApplique: [],
  };
  return {
    etat: {
      ...etat,
      approvisionnementEau:
        crise.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO
          ? etat.approvisionnementEau
          : "sous-tension",
      alerte: null,
      criseActive: null,
      historique: [
        ...etat.historique,
        {
          id: crise.id,
          cause: crise.cause,
          declencheeA: crise.declencheeA,
          faitDeclenchement: crise.faitProduit,
          resolueA: moment,
          reponseId: reponse.id,
          faitResolution: faitProduit,
        },
      ],
      cicatrices: [...etat.cicatrices, cicatrice],
      recuperations: [...etat.recuperations, recuperation],
    },
    variationDeStock,
    variationDHabitants,
    plateformeADetacher,
    fait,
    evenement: {
      type: "crise.resolue",
      criseId: crise.id,
      reponseId: reponse.id,
      moment,
      faitProduit,
      cicatriceId: cicatrice.id,
      garantie: recuperation.garantie,
      maillonIrreversible: cicatrice.id,
    },
  };
}

export function aideExterieureEstPreparee(
  faits: readonly FaitDeCampagne[],
): boolean {
  return faits.some((fait) =>
    FAITS_PREPARANT_UNE_AIDE_EXTERIEURE.includes(
      fait.id as (typeof FAITS_PREPARANT_UNE_AIDE_EXTERIEURE)[number],
    ),
  );
}

export function resoudreCriseTerminale(
  etat: EtatDesCrises,
  pilotage: EtatPilotage,
  habitants: number,
  commande: CommandeDeResolutionDeCrise,
  moment: number,
  aideExterieurePreparee: boolean,
): {
  readonly etat: EtatDesCrises;
  readonly variationDHabitants: number;
  readonly denouement: Extract<
    DenouementDeCampagne,
    { readonly statut: "defaite" }
  >;
  readonly fait: FaitDeCampagne;
  readonly evenement: EvenementDeCrise;
} {
  const crise = etat.criseActive;
  if (
    crise === null ||
    crise.id !== IDENTIFIANT_DE_LA_CRISE_TERMINALE ||
    commande.criseId !== IDENTIFIANT_DE_LA_CRISE_TERMINALE
  ) {
    throw new Error(
      `La Crise terminale « ${commande.criseId} » n’est pas active.`,
    );
  }
  const reponse = trouverReponse(commande.reponseId, crise.id);
  if (
    !reponse.terminale ||
    reponse.devenirs === undefined ||
    !reponseALaCriseEstViable(
      reponse,
      pilotage,
      habitants,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      aideExterieurePreparee,
    )
  ) {
    throw new Error(
      reponse.aideExterieureRequise
        ? "Aucune alliance antérieure ne peut soutenir cette réponse."
        : "Cette réponse ne peut pas conclure la Crise terminale.",
    );
  }
  const perteDHabitants = Math.min(
    habitants,
    reponse.cout.habitants ?? 0,
  );
  const faitProduit = reponse.faitProduit as
    | "defaite.extinction.evacuations-du-coeur"
    | "defaite.extinction.transmission-sous-halo"
    | "defaite.extinction.aide-exterieure-sollicitee";
  const reponseId = reponse.id as
    | "evacuer-le-coeur"
    | "transmettre-sous-le-halo"
    | "solliciter-aide-exterieure";
  const fait: FaitDeCampagne = {
    id: faitProduit,
    cause: crise.cause,
    acteurs: reponse.acteurs,
    cible: reponse.cible,
    moment,
    effets: {
      materiels: [],
      humains:
        perteDHabitants === 0
          ? []
          : [
              {
                type: "habitants.modifies",
                variation: -perteDHabitants,
              },
            ],
    },
  };
  const denouement = {
    statut: "defaite",
    choix: reponseId,
    cause: crise.cause,
    moment,
    devenirs: reponse.devenirs,
  } as const;
  return {
    etat: {
      ...etat,
      alerte: null,
      criseActive: null,
      historique: [
        ...etat.historique,
        {
          id: crise.id,
          cause: crise.cause,
          declencheeA: crise.declencheeA,
          faitDeclenchement: crise.faitProduit,
          resolueA: moment,
          reponseId,
          faitResolution: faitProduit,
        },
      ],
    },
    variationDHabitants: -perteDHabitants,
    denouement,
    fait,
    evenement: {
      type: "crise.terminale-resolue",
      criseId: IDENTIFIANT_DE_LA_CRISE_TERMINALE,
      reponseId,
      moment,
      faitProduit,
      maillonIrreversible: "phare.eteint",
    },
  };
}

function identifiantDeFaitDeRecuperation(
  recuperation: RecuperationDeCrise,
  statut: Exclude<StatutDeRecuperation, "amorcee">,
): (typeof IDENTIFIANTS_DE_FAITS_DE_RECUPERATION)[number] {
  return `crise.recuperation.${recuperation.garantie}.${statut}` as
    (typeof IDENTIFIANTS_DE_FAITS_DE_RECUPERATION)[number];
}

function actionAccomplitRecuperation(
  recuperation: RecuperationDeCrise,
  action: ActionSignificativeDeRecuperation | null,
): boolean {
  if (action === null) {
    return false;
  }
  if (recuperation.condition === "halte-de-purification") {
    return (
      action.type === "halte-deployee" &&
      action.destination === recuperation.destination
    );
  }
  if (recuperation.condition === "rejoindre-haut-puits") {
    return (
      action.type === "troncon-termine" &&
      action.destination === recuperation.destination
    );
  }
  if (
    recuperation.condition === "rejoindre-marche-des-traverses" ||
    recuperation.condition === "rejoindre-signal-zero" ||
    recuperation.condition === "rejoindre-noeud-central"
  ) {
    return (
      action.type === "troncon-termine" &&
      action.destination === recuperation.destination
    );
  }
  if (recuperation.condition === "demander-aide-haut-puits") {
    return action.type === "aide-demandee-haut-puits";
  }
  if (recuperation.condition === "ouvrir-hospice-veille-basse") {
    return action.type === "hospice-ouvert-veille-basse";
  }
  return action.type === "sas-renforce-veille-basse";
}

function coutPourAccomplir(
  recuperation: RecuperationDeCrise,
  contexte: ContexteDEvaluationDesRecuperations,
): readonly CoutAppliqueAUneRecuperation[] | undefined {
  if (recuperation.coutAttendu === "deux-materiaux") {
    return contexte.materiauxDisponibles >= 2
      ? [{ stock: "materiaux", quantite: 2 }]
      : undefined;
  }
  return contexte.action?.type === "troncon-termine"
    ? contexte.action.coutApplique
    : undefined;
}

function creerFaitDeResultat(
  recuperation: RecuperationDeCrise,
  statut: Exclude<StatutDeRecuperation, "amorcee">,
  moment: number,
  coutApplique: readonly CoutAppliqueAUneRecuperation[],
): FaitDeCampagne {
  const acteurs =
    recuperation.garantie === "socle-de-survie"
      ? ["porte-lanterne", "equipes-purification"]
      : recuperation.garantie === "mobilite-minimale"
        ? ["porte-lanterne", "equipes-medicales"]
        : recuperation.garantie === "aide-exterieure-identifiee"
          ? ["porte-lanterne", "habitants-haut-puits"]
          : recuperation.garantie === "cohorte-hydratee"
            ? ["porte-lanterne", "cohorte-du-sillon"]
            : recuperation.garantie === "accueil-stabilise"
              ? ["porte-lanterne", "techniciens-veille-basse"]
              : ["porte-lanterne", "equipes-entretien"];
  const cible =
    recuperation.garantie === "socle-de-survie"
      ? "pompe-purification"
      : recuperation.garantie === "mobilite-minimale"
        ? "haut-puits"
        : recuperation.garantie === "aide-exterieure-identifiee"
          ? "foyers-exposes"
          : recuperation.garantie === "cohorte-hydratee"
            ? "hospice-du-sillon"
            : recuperation.garantie === "accueil-stabilise"
              ? "sas-de-veille-basse"
              : recuperation.destination;
  return {
    id: identifiantDeFaitDeRecuperation(recuperation, statut),
    cause: recuperation.cause,
    acteurs,
    cible,
    moment,
    effets: {
      materiels:
        statut === "accomplie" &&
        recuperation.coutAttendu === "deux-materiaux"
          ? coutApplique.map(({ stock, quantite }) => ({
              type: "stock.modifie" as const,
              stock,
              variation: -quantite,
            }))
          : [],
      humains: [],
    },
  };
}

export function evaluerRecuperationsDeCrise(
  etat: EtatDesCrises,
  contexte: ContexteDEvaluationDesRecuperations,
): TransitionDesRecuperations {
  const faits: FaitDeCampagne[] = [];
  const evenements: EvenementDeCrise[] = [];
  const variationsDeStocks: {
    stock: IdentifiantDeStock;
    variation: number;
  }[] = [];
  let materiauxDisponibles = contexte.materiauxDisponibles;
  let approvisionnementEau = etat.approvisionnementEau;

  const recuperations = etat.recuperations.map((recuperation) => {
    if (recuperation.statut !== "amorcee") {
      return recuperation;
    }

    if (actionAccomplitRecuperation(recuperation, contexte.action)) {
      const coutApplique = coutPourAccomplir(recuperation, {
        ...contexte,
        materiauxDisponibles,
      });
      if (coutApplique !== undefined) {
        const fait = creerFaitDeResultat(
          recuperation,
          "accomplie",
          contexte.moment,
          coutApplique,
        );
        for (const cout of coutApplique) {
          if (
            recuperation.coutAttendu === "deux-materiaux" &&
            cout.stock === "materiaux"
          ) {
            variationsDeStocks.push({
              stock: cout.stock,
              variation: -cout.quantite,
            });
            materiauxDisponibles -= cout.quantite;
          }
        }
        faits.push(fait);
        evenements.push({
          type: "crise.recuperation-accomplie",
          recuperationId: recuperation.id,
          garantie: recuperation.garantie,
          cause: recuperation.cause,
          moment: contexte.moment,
          faitProduit: fait.id,
          coutApplique,
        });
        if (
          recuperation.garantie === "socle-de-survie" ||
          recuperation.garantie === "mobilite-minimale" ||
          recuperation.garantie === "aide-exterieure-identifiee"
        ) {
          approvisionnementEau = "assure";
        }
        return {
          ...recuperation,
          statut: "accomplie" as const,
          accomplieA: contexte.moment,
          faitResultat: fait.id,
          coutApplique,
        };
      }
    }

    const tronconsParcourus = contexte.momentsDesTronconsTermines.filter(
      (moment) => moment > recuperation.amorceeA,
    ).length;
    const actionDAideEncorePossible =
      recuperation.condition === "demander-aide-haut-puits" &&
      contexte.demandeDAideEnAttente;
    if (
      tronconsParcourus < recuperation.horizonTroncons ||
      actionDAideEncorePossible
    ) {
      return recuperation;
    }

    const fait = creerFaitDeResultat(
      recuperation,
      "manquee",
      contexte.moment,
      [],
    );
    faits.push(fait);
    evenements.push({
      type: "crise.recuperation-manquee",
      recuperationId: recuperation.id,
      garantie: recuperation.garantie,
      cause: recuperation.cause,
      moment: contexte.moment,
      faitProduit: fait.id,
      horizonTroncons: recuperation.horizonTroncons,
    });
    return {
      ...recuperation,
      statut: "manquee" as const,
      manqueeA: contexte.moment,
      faitResultat: fait.id,
      coutApplique: [],
    };
  });

  return {
    etat: { ...etat, approvisionnementEau, recuperations },
    variationsDeStocks,
    faits,
    evenements,
  };
}
