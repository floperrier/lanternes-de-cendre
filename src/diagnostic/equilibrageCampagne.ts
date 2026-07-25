import {
  trouverConseil,
  trouverEvenement,
} from "../content/catalogue";
import {
  appliquerCommande,
  choixNarratifEstDisponible,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EvenementDeDomaine,
  type EtatCampagne,
  type GraineDeCampagne,
} from "../simulation/campagne";
import {
  COMPAGNON_DE_REFERENCE,
  IDENTIFIANT_DU_CONSEIL_DES_VANNES,
  PREMIER_CONSEIL,
  compagnonEstAffecte,
  conseilDesVannesEstConvoque,
  conseilDesVannesEstTermine,
  conseilEstTermine,
  decisionDuConseilDesVannesEstDisponible,
} from "../simulation/conseil";
import {
  DEFINITIONS_DES_REPONSES_A_LA_CRISE,
  aideExterieureEstPreparee,
  IDENTIFIANT_DE_LA_CRISE_DU_HALO,
  IDENTIFIANT_DE_LA_CRISE_TERMINALE,
  reponseALaCriseEstViable,
  type IdentifiantDeCrise,
  type IdentifiantDeReponseALaCrise,
} from "../simulation/crise";
import { empreinteValeurDeterministe } from "../simulation/empreinte";
import { listerPlateformesMobilesDetachables } from "../simulation/infrastructure";
import { SECONDES_PAR_HEURE } from "../simulation/pilotage";
import {
  listerTronconsEngageables,
  trouverEngagementDeRouteActif,
  trouverTronconDeRoute,
  type IdentifiantDeLieu,
  type IdentifiantDeTroncon,
} from "../simulation/routes";
import { routeAvalDesBassinsEstPreparee } from "../simulation/nacelles";

export const VERSION_FORMAT_CAMPAGNE_HEADLESS = 1 as const;
export const VERSION_REGLES_D_EQUILIBRAGE_COURANTE = 4 as const;
const VERSION_REGLES_LIGNE_ZERO_PRESERVEE = 2 as const;
const VERSION_REGLES_EXTINCTION_DU_PHARE = 3 as const;
const VERSION_REGLES_CALIBRAGE_CAUSAL = 4 as const;
export const NOMBRE_DE_GRAINES_STANDARD = 256 as const;
export const NOMBRE_DE_GRAINES_NOCTURNE = 2_048 as const;

export const HISTORIQUE_DES_REGLES_D_EQUILIBRAGE = [
  {
    version: 1,
    changements: [
      "référence causale : sorties directes de la Trame et Signal-Zéro accessibles depuis chaque branche",
      "la Ligne Zéro exige encore le relevé de sa conduite",
    ],
  },
  {
    version: VERSION_REGLES_LIGNE_ZERO_PRESERVEE,
    changements: [
      "la Ligne Zéro accepte les deux résolutions causales du Déversoir",
    ],
  },
  {
    version: VERSION_REGLES_EXTINCTION_DU_PHARE,
    changements: [
      "l’Extinction du Phare conclut les stratégies qui ont manqué une Récupération et perdu leurs réponses de survie",
      "la fréquence terminale, la non-arrivée et l’échec stratégique sont mesurés séparément",
    ],
  },
  {
    version: VERSION_REGLES_CALIBRAGE_CAUSAL,
    changements: [
      "la cascade matérielle reste disponible sur la branche haute lorsque Veille-Basse a été évitée",
      "six sondes déterministes couvrent la décision risquée de maintenir le débit, dont deux Récupérations immédiates et quatre pénuries persistantes",
    ],
  },
] as const;

export type ExperienceDEquilibrage =
  | "premiere-campagne"
  | "campagne-rejouee";

export interface ItineraireDEquilibrage {
  readonly id: string;
  readonly troncons: readonly IdentifiantDeTroncon[];
}

export interface StrategieDEquilibrage {
  readonly id: string;
  readonly experience: ExperienceDEquilibrage;
  readonly itineraire: ItineraireDEquilibrage;
  readonly affinites: readonly string[];
  readonly solutionFinale: "ancrage" | "reaccord" | "precipitation";
  readonly incident:
    | "laisser-doctrine"
    | "securiser-pompe"
    | "maintenir-debit";
  readonly reponsesDeCrise: readonly IdentifiantDeReponseALaCrise[];
  readonly affecteCompagnon: boolean;
  readonly haltesApresTroncons: readonly number[];
  readonly dureeDeHalte: number;
}

const BASSINS_HAUTS = [
  "digue-des-puits",
  "chemin-des-vanniers",
  "chenal-des-vannes",
  "conduite-du-deversoir",
] as const;
const BASSINS_BAS = [
  "chaussee-de-veille-basse",
  "chemin-de-l-hospice",
  "chenal-de-l-hospice",
  "conduite-du-deversoir",
] as const;
const TRAME_RAIL_MARCHE = [
  "passage-de-la-ligne-zero",
  "rampe-de-barriere-neuve",
  "voie-des-ponts-lourds",
  "rocade-du-marche",
  "ligne-du-signal-zero",
  "faisceau-de-l-aiguillage-zero",
  "passage-de-la-couronne-muette",
] as const;
const TRAME_RAIL_DIRECTE = [
  "piste-des-levees",
  "rampe-de-barriere-neuve",
  "voie-des-ponts-lourds",
  "rocade-des-regulateurs",
  "faisceau-de-l-aiguillage-zero",
  "passage-de-la-couronne-muette",
] as const;
const TRAME_LIBRE_MARCHE = [
  "piste-des-levees",
  "embranchement-de-pompe-neuve",
  "galerie-des-reservoirs",
  "voie-des-citernes",
  "ligne-du-signal-zero",
  "faisceau-de-l-aiguillage-zero",
  "passage-de-la-couronne-muette",
] as const;
const TRAME_LIBRE_DIRECTE = [
  "passage-de-la-ligne-zero",
  "embranchement-de-pompe-neuve",
  "galerie-des-reservoirs",
  "derivation-des-puits",
  "faisceau-de-l-aiguillage-zero",
  "passage-de-la-couronne-muette",
] as const;
const COURONNE_TETE = [
  "voie-de-tete-de-ligne",
  "arc-ferroviaire-du-noeud",
  "passage-de-la-couronne-ouverte",
] as const;
const COURONNE_VEILLES = [
  "chemin-des-trois-veilles",
  "galerie-des-trois-phares",
  "passage-de-la-couronne-ouverte",
] as const;
const COURONNE_VEILLES_BRECHE = [
  "chemin-des-trois-veilles",
  "galerie-des-trois-phares",
  "breche-de-secours-du-noeud",
] as const;
const COURONNE_SEUIL = [
  "piste-des-serres-de-verre",
  "rampe-du-seuil",
  "porte-logistique-du-seuil",
  "breche-de-secours-du-noeud",
] as const;

function itineraire(
  id: string,
  ...parties: readonly (readonly IdentifiantDeTroncon[])[]
): ItineraireDEquilibrage {
  return { id, troncons: parties.flat() };
}

const ITINERAIRES = {
  hautsRailTete: itineraire(
    "hauts-rail-marche-tete",
    BASSINS_HAUTS,
    TRAME_RAIL_MARCHE,
    COURONNE_TETE,
  ),
  basRailVeilles: itineraire(
    "bas-rail-direct-veilles",
    BASSINS_BAS,
    TRAME_RAIL_DIRECTE,
    COURONNE_VEILLES,
  ),
  hautsLibreSeuil: itineraire(
    "hauts-libre-marche-seuil",
    BASSINS_HAUTS,
    TRAME_LIBRE_MARCHE,
    COURONNE_SEUIL,
  ),
  basLibreTete: itineraire(
    "bas-libre-direct-tete",
    BASSINS_BAS,
    TRAME_LIBRE_DIRECTE,
    COURONNE_TETE,
  ),
  hautsRailVeilles: itineraire(
    "hauts-rail-direct-veilles",
    BASSINS_HAUTS,
    TRAME_RAIL_DIRECTE,
    COURONNE_VEILLES,
  ),
  hautsRailVeillesBreche: itineraire(
    "hauts-rail-direct-veilles-breche",
    BASSINS_HAUTS,
    TRAME_RAIL_DIRECTE,
    COURONNE_VEILLES_BRECHE,
  ),
  basLibreSeuil: itineraire(
    "bas-libre-marche-seuil",
    BASSINS_BAS,
    TRAME_LIBRE_MARCHE,
    COURONNE_SEUIL,
  ),
  hautsLibreTete: itineraire(
    "hauts-libre-direct-tete",
    BASSINS_HAUTS,
    TRAME_LIBRE_DIRECTE,
    COURONNE_TETE,
  ),
  basRailSeuil: itineraire(
    "bas-rail-marche-seuil",
    BASSINS_BAS,
    TRAME_RAIL_MARCHE,
    COURONNE_SEUIL,
  ),
  hautsRailSeuil: itineraire(
    "hauts-rail-marche-seuil",
    BASSINS_HAUTS,
    TRAME_RAIL_MARCHE,
    COURONNE_SEUIL,
  ),
  basLibreVeilles: itineraire(
    "bas-libre-direct-veilles",
    BASSINS_BAS,
    TRAME_LIBRE_DIRECTE,
    COURONNE_VEILLES,
  ),
} as const;

export const STRATEGIES_D_EQUILIBRAGE = [
  {
    id: "prudence-causale",
    experience: "premiere-campagne",
    itineraire: ITINERAIRES.hautsRailTete,
    affinites: [
      "conserver",
      "amorcer",
      "securiser",
      "relever",
      "consigner",
      "publier",
      "partager",
      "refuge",
    ],
    solutionFinale: "ancrage",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "isoler-et-rationner",
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "mobiliser-les-remedes",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [0, 4, 11],
    dureeDeHalte: 180,
  },
  {
    id: "solidarite-mobile",
    experience: "premiere-campagne",
    itineraire: ITINERAIRES.basRailVeilles,
    affinites: [
      "accueillir",
      "partager",
      "commun",
      "confier",
      "coalition",
      "constellation",
    ],
    solutionFinale: "reaccord",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "mobiliser-les-remedes",
      "isoler-et-rationner",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [4],
    dureeDeHalte: 240,
  },
  {
    id: "ingenierie-du-phare",
    experience: "premiere-campagne",
    itineraire: ITINERAIRES.hautsLibreSeuil,
    affinites: [
      "diagnostic",
      "reparer",
      "interface",
      "rail",
      "ancrage",
      "technique",
    ],
    solutionFinale: "ancrage",
    incident: "securiser-pompe",
    reponsesDeCrise: [
      "renforcer-accueil",
      "partager-reserves-cohorte",
      "isoler-et-rationner",
      "mobiliser-les-remedes",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [4, 8, 12],
    dureeDeHalte: 120,
  },
  {
    id: "autonomie-des-colonies",
    experience: "premiere-campagne",
    itineraire: ITINERAIRES.basLibreTete,
    affinites: [
      "autonomie",
      "libre",
      "separer",
      "repartir",
      "copies",
      "veilles",
    ],
    solutionFinale: "reaccord",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "mobiliser-les-remedes",
      "evacuer-les-foyers-exposes",
      "isoler-et-rationner",
    ],
    affecteCompagnon: false,
    haltesApresTroncons: [],
    dureeDeHalte: 0,
  },
  {
    id: "vitesse-sous-contrainte",
    experience: "premiere-campagne",
    itineraire: ITINERAIRES.hautsRailVeillesBreche,
    affinites: [
      "direct",
      "maintenir",
      "forcer",
      "passage",
      "risque",
      "rempart",
    ],
    solutionFinale: "ancrage",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "isoler-et-rationner",
      "renforcer-accueil",
      "partager-reserves-cohorte",
      "evacuer-les-foyers-exposes",
      "mobiliser-les-remedes",
    ],
    affecteCompagnon: false,
    haltesApresTroncons: [0],
    dureeDeHalte: 0,
  },
  {
    id: "diplomatie-des-rives",
    experience: "campagne-rejouee",
    itineraire: ITINERAIRES.basLibreSeuil,
    affinites: [
      "negocier",
      "charte",
      "delegations",
      "partager",
      "administrer",
      "ciel",
    ],
    solutionFinale: "precipitation",
    incident: "laisser-doctrine",
    reponsesDeCrise: [
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "isoler-et-rationner",
      "mobiliser-les-remedes",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [4, 11],
    dureeDeHalte: 300,
  },
  {
    id: "sobriete-materielle",
    experience: "campagne-rejouee",
    itineraire: ITINERAIRES.hautsLibreTete,
    affinites: [
      "economiser",
      "conserver",
      "rationner",
      "recuperer",
      "autonome",
      "dispersees",
    ],
    solutionFinale: "reaccord",
    incident: "securiser-pompe",
    reponsesDeCrise: [
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "evacuer-les-foyers-exposes",
      "mobiliser-les-remedes",
      "isoler-et-rationner",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [7],
    dureeDeHalte: 120,
  },
  {
    id: "opportunisme-marchand",
    experience: "campagne-rejouee",
    itineraire: ITINERAIRES.basRailSeuil,
    affinites: [
      "accueillir",
      "rationner",
      "acheter",
      "echanger",
      "prendre",
      "monopole",
      "citadelle",
      "reserves",
    ],
    solutionFinale: "ancrage",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "etayer-chassis",
      "detacher-plateforme",
      "renforcer-accueil",
      "partager-reserves-cohorte",
      "mobiliser-les-remedes",
      "isoler-et-rationner",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [],
    dureeDeHalte: 0,
  },
  {
    id: "rupture-du-front",
    experience: "campagne-rejouee",
    itineraire: ITINERAIRES.hautsRailSeuil,
    affinites: [
      "forcer",
      "contraindre",
      "sacrifier",
      "rompre",
      "pluie",
      "risque",
    ],
    solutionFinale: "precipitation",
    incident: "maintenir-debit",
    reponsesDeCrise: [
      "isoler-et-rationner",
      "renforcer-accueil",
      "partager-reserves-cohorte",
      "evacuer-les-foyers-exposes",
      "mobiliser-les-remedes",
    ],
    affecteCompagnon: false,
    haltesApresTroncons: [],
    dureeDeHalte: 0,
  },
  {
    id: "memoire-des-veilles",
    experience: "campagne-rejouee",
    itineraire: ITINERAIRES.basLibreVeilles,
    affinites: [
      "consigner",
      "memoire",
      "confier",
      "registre",
      "colonies",
      "constellation",
    ],
    solutionFinale: "reaccord",
    incident: "laisser-doctrine",
    reponsesDeCrise: [
      "partager-reserves-cohorte",
      "renforcer-accueil",
      "mobiliser-les-remedes",
      "isoler-et-rationner",
      "evacuer-les-foyers-exposes",
    ],
    affecteCompagnon: true,
    haltesApresTroncons: [4, 10],
    dureeDeHalte: 180,
  },
] as const satisfies readonly StrategieDEquilibrage[];

function strategieSelonVersion(
  strategie: StrategieDEquilibrage,
  versionRegles: number,
): StrategieDEquilibrage {
  if (versionRegles >= VERSION_REGLES_CALIBRAGE_CAUSAL) {
    return strategie;
  }
  if (strategie.id === "prudence-causale") {
    return {
      ...strategie,
      affinites: [
        "securiser",
        "relever",
        "consigner",
        "publier",
        "partager",
        "refuge",
      ],
      incident: "securiser-pompe",
      reponsesDeCrise: [
        "partager-reserves-cohorte",
        "renforcer-accueil",
        "isoler-et-rationner",
        "mobiliser-les-remedes",
        "evacuer-les-foyers-exposes",
      ],
      haltesApresTroncons: [4, 11],
    };
  }
  if (strategie.id === "vitesse-sous-contrainte") {
    return {
      ...strategie,
      reponsesDeCrise: [
        "renforcer-accueil",
        "partager-reserves-cohorte",
        "evacuer-les-foyers-exposes",
        "mobiliser-les-remedes",
        "isoler-et-rationner",
      ],
      haltesApresTroncons: [],
    };
  }
  if (
    strategie.id === "solidarite-mobile" ||
    strategie.id === "autonomie-des-colonies"
  ) {
    return { ...strategie, incident: "laisser-doctrine" };
  }
  if (strategie.id === "opportunisme-marchand") {
    return {
      ...strategie,
      affinites: [
        "rationner",
        "acheter",
        "echanger",
        "prendre",
        "monopole",
        "citadelle",
        "reserves",
      ],
    };
  }
  if (strategie.id === "rupture-du-front") {
    return {
      ...strategie,
      reponsesDeCrise: [
        "renforcer-accueil",
        "partager-reserves-cohorte",
        "evacuer-les-foyers-exposes",
        "isoler-et-rationner",
        "mobiliser-les-remedes",
      ],
    };
  }
  return strategie;
}

export interface EtapeDeCampagneHeadless {
  readonly sequence: number;
  readonly commande: CommandeCampagne;
  readonly statut: "appliquee" | "refusee";
  readonly empreinteEtat: string;
  readonly empreinteEvenements: string;
  readonly erreur?: string;
}

export interface MetriquesDeCampagneHeadless {
  readonly tronconsParcourus: number;
  readonly tronconsSousTension: number;
  readonly crises: number;
  readonly crisesParIdentifiant: Readonly<
    Record<IdentifiantDeCrise, number>
  >;
  readonly crisesCausalesEtUniques: boolean;
  readonly arriveeAuNoeud: boolean;
  readonly defaiteStrategique: boolean;
  readonly secondesActives: number;
  readonly secondesDeChargeDEntretien: number;
  readonly dureesDeHalte: readonly number[];
  readonly faitsAvecCause: number;
  readonly faitsTotaux: number;
  readonly motifsNarratifs: readonly string[];
  readonly selectionsStrategiques: readonly SelectionStrategiqueHeadless[];
  readonly coutsFinaux: CoutsVectorielsHeadless;
  readonly coutFinal: number;
}

export interface CoutsVectorielsHeadless {
  readonly stocks: Readonly<Record<string, number>>;
  readonly habitants: number;
  readonly cicatrices: number;
}

export interface SelectionStrategiqueHeadless {
  readonly contexteId: string;
  readonly optionId: string;
  readonly optionsDisponibles: readonly string[];
}

export interface ResultatDeCampagneHeadless {
  readonly format: "lanternes-de-cendre.campagne-headless";
  readonly version: typeof VERSION_FORMAT_CAMPAGNE_HEADLESS;
  readonly versionRegles: number;
  readonly graine: string;
  readonly strategieId: string;
  readonly experience: ExperienceDEquilibrage;
  readonly statut: "terminee" | "impasse" | "erreur";
  readonly raisonDEchec: string | null;
  readonly positionFinale: IdentifiantDeLieu;
  readonly denouementFinal: EtatCampagne["denouement"];
  readonly commandes: readonly EtapeDeCampagneHeadless[];
  readonly faitsFinaux: readonly string[];
  readonly metriques: MetriquesDeCampagneHeadless;
  readonly recuperationsGratuites: number;
  readonly bouclesSondees: number;
  readonly bouclesProfitables: number;
  readonly empreinteFinale: string;
}

interface AccumulateurDeMetriques {
  tronconsParcourus: number;
  tronconsSousTension: number;
  crises: number;
  crisesParIdentifiant: Record<IdentifiantDeCrise, number>;
  secondesActives: number;
  secondesDeChargeDEntretien: number;
  dureesDeHalte: number[];
  motifsNarratifs: string[];
  selectionsStrategiques: SelectionStrategiqueHeadless[];
  recuperationsGratuites: number;
  bouclesSondees: number;
  bouclesProfitables: number;
}

export interface OptionsDeCampagneHeadless {
  readonly graine: GraineDeCampagne;
  readonly strategie: StrategieDEquilibrage;
  readonly versionRegles?: number;
  readonly limiteDeCommandes?: number;
  readonly tracerEmpreintes?: boolean;
  readonly commandesImposees?: readonly CommandeCampagne[];
}

function scoreStable(texte: string): number {
  return Number.parseInt(empreinteValeurDeterministe(texte), 16);
}

function scoreDAffinite(
  strategie: StrategieDEquilibrage,
  graine: string,
  contexte: string,
  option: string,
): number {
  const optionNormalisee = option.toLocaleLowerCase("fr");
  const affinite = strategie.affinites.reduce(
    (score, mot, index) =>
      optionNormalisee.includes(mot)
        ? score + 100_000 - index * 1_000
        : score,
    0,
  );
  const finale =
    contexte === "finale.ancrage.choisir-d-ancrer-le-coeur" &&
    optionNormalisee.includes(strategie.solutionFinale)
      ? 1_000_000
      : 0;
  return (
    finale +
    affinite +
    (scoreStable(`${graine}:${strategie.id}:${contexte}:${option}`) % 10_000)
  );
}

function choisirOption(
  strategie: StrategieDEquilibrage,
  graine: string,
  contexte: string,
  options: readonly string[],
): string | undefined {
  return [...options].sort(
    (gauche, droite) =>
      scoreDAffinite(strategie, graine, contexte, droite) -
        scoreDAffinite(strategie, graine, contexte, gauche) ||
      (gauche < droite ? -1 : gauche > droite ? 1 : 0),
  )[0];
}

function choisirOptionPourItineraire(
  strategie: StrategieDEquilibrage,
  evenementId: string,
  versionRegles: number,
): string | undefined {
  if (
    evenementId === "bassins.deversoir.la-conduite-zero" &&
    strategie.itineraire.troncons.includes("passage-de-la-ligne-zero") &&
    versionRegles < VERSION_REGLES_LIGNE_ZERO_PRESERVEE
  ) {
    return "relever-interface";
  }
  if (
    evenementId !==
    "couronne.ouverture.le-dernier-conseil-de-la-couronne"
  ) {
    return undefined;
  }
  const dernierTroncon = strategie.itineraire.troncons.at(-1);
  if (dernierTroncon === "breche-de-secours-du-noeud") {
    return "ouvrir-breche-de-secours";
  }
  const tronconPrecedent = strategie.itineraire.troncons.at(-2);
  if (tronconPrecedent === "arc-ferroviaire-du-noeud") {
    return "ouvrir-par-les-rails";
  }
  if (tronconPrecedent === "galerie-des-trois-phares") {
    return "ouvrir-par-les-phares";
  }
  return "ouvrir-par-les-colonies";
}

interface VecteurDeRessources {
  readonly stocks: Readonly<Record<string, number>>;
  readonly habitants: number;
  readonly cicatrices: number;
}

function capturerRessources(etat: EtatCampagne): VecteurDeRessources {
  return {
    stocks: Object.fromEntries(
      Object.entries(etat.pilotage.economie.stocks).map(
        ([id, stock]) => [id, stock.quantite],
      ),
    ),
    habitants: etat.citeCaravane.habitants,
    cicatrices: etat.crises.cicatrices.length,
  };
}

function capturerRessourcesExactes(
  etat: EtatCampagne,
): VecteurDeRessources {
  return {
    stocks: Object.fromEntries(
      Object.entries(etat.pilotage.economie.stocks).map(
        ([id, stock]) => [
          id,
          stock.quantite * SECONDES_PAR_HEURE + stock.reliquatDeFlux,
        ],
      ),
    ),
    habitants: etat.citeCaravane.habitants,
    cicatrices: etat.crises.cicatrices.length,
  };
}

function calculerCoutsVectoriels(
  reference: VecteurDeRessources,
  courantes: VecteurDeRessources,
): CoutsVectorielsHeadless {
  return {
    stocks: Object.fromEntries(
      Object.entries(reference.stocks).map(
        ([id, quantiteInitiale]) => [
          id,
          Math.max(
            0,
            quantiteInitiale - (courantes.stocks[id] ?? 0),
          ) / Math.max(1, quantiteInitiale),
        ],
      ),
    ),
    habitants:
      Math.max(0, reference.habitants - courantes.habitants) /
      Math.max(1, reference.habitants),
    cicatrices: Math.max(
      0,
      courantes.cicatrices - reference.cicatrices,
    ),
  };
}

function coutNormalise(couts: CoutsVectorielsHeadless): number {
  return (
    Object.values(couts.stocks).reduce(
      (total, cout) => total + cout,
      0,
    ) +
    couts.habitants +
    couts.cicatrices
  );
}

function besoinsSontSousTension(etat: EtatCampagne): boolean {
  if (etat.crises.approvisionnementEau !== "assure") {
    return true;
  }
  const autonomies = Object.values(etat.pilotage.economie.stocks)
    .filter(({ fluxParHeure }) => fluxParHeure < 0)
    .map(({ quantite, fluxParHeure }) => quantite / Math.abs(fluxParHeure));
  return autonomies.filter((heures) => heures < 8).length >= 2;
}

function resolutionAUnCout(
  avant: EtatCampagne,
  apres: EtatCampagne,
): boolean {
  const ressourcesAvant = capturerRessources(avant);
  const ressourcesApres = capturerRessources(apres);
  return (
    Object.entries(ressourcesAvant.stocks).some(
      ([id, quantite]) => (ressourcesApres.stocks[id] ?? 0) < quantite,
    ) ||
    ressourcesApres.habitants < ressourcesAvant.habitants ||
    ressourcesApres.cicatrices > ressourcesAvant.cicatrices
  );
}

type EvenementDeRecuperationAccomplie = Extract<
  EvenementDeDomaine,
  { readonly type: "crise.recuperation-accomplie" }
>;

export function recuperationAUnCoutReel(
  avant: EtatCampagne,
  apres: EtatCampagne,
  evenement: EvenementDeRecuperationAccomplie,
): boolean {
  if (
    evenement.coutApplique.length === 0 ||
    evenement.coutApplique.some(
      ({ quantite }) => !Number.isFinite(quantite) || quantite <= 0,
    )
  ) {
    return false;
  }
  const engagementPaye = apres.routes.engagements.find(
    ({ statut, arriveeA }) =>
      statut === "termine" && arriveeA === evenement.moment,
  );
  return evenement.coutApplique.every(({ stock, quantite }) => {
    const quantiteAvant =
      avant.pilotage.economie.stocks[stock].quantite;
    const quantiteApres =
      apres.pilotage.economie.stocks[stock].quantite;
    if (quantiteAvant - quantiteApres >= quantite) {
      return true;
    }
    if (stock !== "combustible" && stock !== "eau") {
      return false;
    }
    if (engagementPaye === undefined) {
      return false;
    }
    const tronconPaye = trouverTronconDeRoute(engagementPaye.tronconId);
    const coutDeRoute =
      engagementPaye.consommationsAppliquees?.[stock] ??
      (stock === "combustible"
        ? tronconPaye.consommationConnue.quantite
        : tronconPaye.consommationIncertaine.quantiteReelle);
    return coutDeRoute === quantite;
  });
}

function ressourcesSontUneAmeliorationStricte(
  reference: VecteurDeRessources,
  candidate: VecteurDeRessources,
): boolean {
  const stocksNeReculentPas = Object.entries(reference.stocks).every(
    ([id, quantite]) => (candidate.stocks[id] ?? 0) >= quantite,
  );
  const auMoinsUneAmelioration =
    Object.entries(reference.stocks).some(
      ([id, quantite]) => (candidate.stocks[id] ?? 0) > quantite,
    ) || candidate.habitants > reference.habitants;
  return (
    stocksNeReculentPas &&
    candidate.habitants >= reference.habitants &&
    candidate.cicatrices <= reference.cicatrices &&
    auMoinsUneAmelioration
  );
}

export function detecterBoucleProfitable(
  avant: EtatCampagne,
  apres: EtatCampagne,
): boolean {
  return ressourcesSontUneAmeliorationStricte(
    capturerRessourcesExactes(avant),
    capturerRessourcesExactes(apres),
  );
}

export function sonderBouclesSemantiques(
  etatInitial: EtatCampagne,
): {
  readonly bouclesSondees: number;
  readonly bouclesProfitables: number;
} {
  const empreinteEconomiqueHorsQuantites = (etat: EtatCampagne) =>
    empreinteValeurDeterministe({
      capacites: etat.pilotage.economie.capacites,
      entretien: etat.pilotage.economie.entretien,
      flux: Object.fromEntries(
        Object.entries(etat.pilotage.economie.stocks).map(([id, stock]) => [
          id,
          stock.fluxParHeure,
        ]),
      ),
    });
  const cycles: readonly {
    readonly commandes: readonly CommandeCampagne[];
    readonly estReferme: (
      avant: EtatCampagne,
      apres: EtatCampagne,
    ) => boolean;
  }[] = [
    {
      commandes: [
        {
          type: "doctrine.regler",
          politique: "allure",
          position: "prudente",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 30 },
        {
          type: "doctrine.regler",
          politique: "allure",
          position: "soutenue",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 30 },
      ],
      estReferme: (avant, apres) =>
        empreinteValeurDeterministe(avant.pilotage.doctrine) ===
          empreinteValeurDeterministe(apres.pilotage.doctrine) &&
        empreinteEconomiqueHorsQuantites(avant) ===
          empreinteEconomiqueHorsQuantites(apres),
    },
    {
      commandes: [
        { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
        { type: "halte.deployer" },
        {
          type: "chantier.engager",
          ordre: {
            type: "construction",
            definitionId: "condenseur-thermique",
            emplacementId: "intendance.polyvalent",
          },
          priorite: "haute",
        },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 1 },
        { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
        {
          type: "chantier.engager",
          ordre: {
            type: "demontage",
            emplacementId: "intendance.polyvalent",
          },
          priorite: "haute",
        },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 1 },
        { type: "temps-du-convoi.ecouler", secondesReelles: 30 },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
        { type: "halte.replier" },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 1 },
      ],
      estReferme: (avant, apres) => {
        const emplacementAvant =
          avant.infrastructure.plateformes
            .flatMap(({ emplacements }) => emplacements)
            .find(({ id }) => id === "intendance.polyvalent")
            ?.installation ?? null;
        const emplacementApres =
          apres.infrastructure.plateformes
            .flatMap(({ emplacements }) => emplacements)
            .find(({ id }) => id === "intendance.polyvalent")
            ?.installation ?? null;
        return (
          avant.tempsDuConvoi.vitesse === apres.tempsDuConvoi.vitesse &&
          avant.infrastructure.deploiement ===
            apres.infrastructure.deploiement &&
          apres.infrastructure.chantierActif === null &&
          empreinteValeurDeterministe(emplacementAvant) ===
            empreinteValeurDeterministe(emplacementApres) &&
          empreinteEconomiqueHorsQuantites(avant) ===
            empreinteEconomiqueHorsQuantites(apres)
        );
      },
    },
  ];
  let bouclesSondees = 0;
  let bouclesProfitables = 0;
  for (const cycle of cycles) {
    let etat = etatInitial;
    try {
      for (const commande of cycle.commandes) {
        etat = appliquerCommande(etat, commande).etat;
      }
      if (!cycle.estReferme(etatInitial, etat)) {
        continue;
      }
      bouclesSondees += 1;
      if (detecterBoucleProfitable(etatInitial, etat)) {
        bouclesProfitables += 1;
      }
    } catch {
      // Un cycle qui n'est pas disponible à ce checkpoint n'est pas sondé.
    }
  }
  return { bouclesSondees, bouclesProfitables };
}

function motifDeChoix(choixId: string): string {
  return choixId.split("-")[0] ?? choixId;
}

function campagneEstTerminee(etat: EtatCampagne): boolean {
  return etat.denouement.statut !== "en-cours";
}

function choisirReponseDeCrise(
  etat: EtatCampagne,
  strategie: StrategieDEquilibrage,
): IdentifiantDeReponseALaCrise {
  const reponsesViables = listerReponsesDeCriseViables(etat);
  for (const reponseId of strategie.reponsesDeCrise) {
    if (reponsesViables.includes(reponseId)) {
      return reponseId;
    }
  }
  const premiereReponseViable = reponsesViables[0];
  if (premiereReponseViable === undefined) {
    throw new Error(`Aucune réponse viable pour « ${etat.crises.criseActive?.id} ».`);
  }
  return premiereReponseViable;
}

function listerReponsesDeCriseViables(
  etat: EtatCampagne,
): IdentifiantDeReponseALaCrise[] {
  const criseActive = etat.crises.criseActive;
  if (criseActive === null) {
    return [];
  }
  return DEFINITIONS_DES_REPONSES_A_LA_CRISE.filter((definition) =>
    definition.criseId === criseActive.id &&
    reponseALaCriseEstViable(
      definition,
      etat.pilotage,
      etat.citeCaravane.habitants,
      etat.citeCaravane.formation.plateformes.length,
      listerPlateformesMobilesDetachables(etat.infrastructure).filter(
        (plateforme) =>
          etat.citeCaravane.formation.plateformes.includes(plateforme),
      ).length,
      aideExterieureEstPreparee(etat.narration.faitsDeCampagne),
    ),
  ).map(({ id }) => id);
}

function construireConseilDisponible(etat: EtatCampagne) {
  const faits = etat.narration.faitsDeCampagne;
  const conseilDesVannes = trouverConseil(
    IDENTIFIANT_DU_CONSEIL_DES_VANNES,
  );
  if (
    etat.routes.position === "deversoir-noir" &&
    etat.narration.evenementActif === null &&
    conseilDesVannes !== undefined &&
    conseilDesVannesEstConvoque(faits) &&
    !conseilDesVannesEstTermine(faits)
  ) {
    return conseilDesVannes;
  }
  return compagnonEstAffecte(faits) && !conseilEstTermine(faits)
    ? PREMIER_CONSEIL
    : null;
}

export function executerCampagneHeadless({
  graine,
  strategie: strategieDeclaree,
  versionRegles = VERSION_REGLES_D_EQUILIBRAGE_COURANTE,
  limiteDeCommandes = 320,
  tracerEmpreintes = true,
  commandesImposees,
}: OptionsDeCampagneHeadless): ResultatDeCampagneHeadless {
  const strategie = strategieSelonVersion(
    strategieDeclaree,
    versionRegles,
  );
  let etat = creerCampagneInitiale(graine);
  const ressourcesInitiales = capturerRessources(etat);
  const sondageDesBoucles = sonderBouclesSemantiques(etat);
  const commandes: EtapeDeCampagneHeadless[] = [];
  const metriques: AccumulateurDeMetriques = {
    tronconsParcourus: 0,
    tronconsSousTension: 0,
    crises: 0,
    crisesParIdentifiant: {
      "penurie-eau.pompe-purification": 0,
      "veille-basse.accueil-sous-penurie": 0,
      "trame-fer.cascade-materielle": 0,
      "couronne-muette.saturation-du-halo": 0,
      "extinction-du-phare": 0,
    },
    secondesActives: 0,
    secondesDeChargeDEntretien: 0,
    dureesDeHalte: [],
    motifsNarratifs: [],
    selectionsStrategiques: [],
    recuperationsGratuites: 0,
    bouclesSondees: sondageDesBoucles.bouclesSondees,
    bouclesProfitables: sondageDesBoucles.bouclesProfitables,
  };
  const ressourcesParPosition = new Map<
    IdentifiantDeLieu,
    VecteurDeRessources
  >();
  const haltesEffectuees = new Set<number>();
  let indexRoute = 0;
  let incidentTraite = false;
  let attentesDeVeilleBasse = 0;
  let nombreDeCommandesExecutees = 0;
  let indexDeCommandeImposee = 0;
  let commandeImposeeRefusee = false;
  let debutDeHalteImposee: number | null = null;
  let raisonDEchec: string | null = null;
  let statut: ResultatDeCampagneHeadless["statut"] = "impasse";

  const enregistrerSelection = (
    contexteId: string,
    optionId: string,
    optionsDisponibles: readonly string[],
  ): void => {
    metriques.selectionsStrategiques.push({
      contexteId,
      optionId,
      optionsDisponibles: [...optionsDisponibles].sort(),
    });
  };

  const executer = (commande: CommandeCampagne): boolean => {
    const avant = etat;
    try {
      if (
        versionRegles < VERSION_REGLES_LIGNE_ZERO_PRESERVEE &&
        commande.type === "engagement-de-route.confirmer" &&
        commande.tronconId === "passage-de-la-ligne-zero" &&
        !etat.narration.faitsDeCampagne.some(
          ({ id }) => id === "bassins.deversoir.ligne-zero-relevee",
        )
      ) {
        throw new Error(
          "La version historique exigeait le relevé de la Ligne Zéro.",
        );
      }
      const transition = appliquerCommande(
        etat,
        commande,
        versionRegles < VERSION_REGLES_EXTINCTION_DU_PHARE
          ? { crises: "historiques-v15" }
          : versionRegles < VERSION_REGLES_CALIBRAGE_CAUSAL
            ? { crises: "historiques-v16" }
            : {},
      );
      etat = transition.etat;
      if (
        commandesImposees !== undefined &&
        commande.type === "halte.deployer"
      ) {
        debutDeHalteImposee = etat.tempsDuConvoi.secondes;
      } else if (
        commandesImposees !== undefined &&
        commande.type === "halte.replier" &&
        debutDeHalteImposee !== null
      ) {
        metriques.dureesDeHalte.push(
          etat.tempsDuConvoi.secondes - debutDeHalteImposee,
        );
        debutDeHalteImposee = null;
      }
      const deltaTemps =
        etat.tempsDuConvoi.secondes - avant.tempsDuConvoi.secondes;
      if (deltaTemps > 0) {
        metriques.secondesActives += deltaTemps;
        const economie = avant.pilotage.economie;
        const partDEntretien = Math.min(
          1,
          economie.entretien.equipesMobilisees /
            Math.max(1, economie.capacites["main-d-oeuvre"].production),
        );
        metriques.secondesDeChargeDEntretien +=
          deltaTemps * partDEntretien;
      }
      for (const evenement of transition.evenements) {
        if (
          evenement.type === "jalon-du-monde.atteint" &&
          evenement.jalonId.startsWith("jalon-route-")
        ) {
          metriques.tronconsParcourus += 1;
          if (besoinsSontSousTension(etat)) {
            metriques.tronconsSousTension += 1;
          }
          const ressourcesCourantes = capturerRessourcesExactes(etat);
          const ressourcesPrecedentes = ressourcesParPosition.get(
            etat.routes.position,
          );
          if (
            ressourcesPrecedentes !== undefined &&
            ressourcesSontUneAmeliorationStricte(
              ressourcesPrecedentes,
              ressourcesCourantes,
            )
          ) {
            metriques.bouclesProfitables += 1;
          }
          ressourcesParPosition.set(
            etat.routes.position,
            ressourcesCourantes,
          );
        }
        if (evenement.type === "crise.declenchee") {
          metriques.crises += 1;
          metriques.crisesParIdentifiant[evenement.criseId] += 1;
        }
        if (evenement.type === "evenement-narratif.choix-resolu") {
          metriques.motifsNarratifs.push(motifDeChoix(evenement.choixId));
        }
      }
      if (
        transition.evenements.some(
          ({ type }) => type === "crise.resolue",
        ) &&
        !resolutionAUnCout(avant, etat)
      ) {
        metriques.recuperationsGratuites += 1;
      }
      for (const evenement of transition.evenements) {
        if (
          evenement.type === "crise.recuperation-accomplie" &&
          !recuperationAUnCoutReel(avant, etat, evenement)
        ) {
          metriques.recuperationsGratuites += 1;
        }
      }
      commandes.push({
        sequence: nombreDeCommandesExecutees,
        commande,
        statut: "appliquee",
        empreinteEtat: tracerEmpreintes ? empreinteEtat(etat) : "compacte",
        empreinteEvenements: tracerEmpreintes
          ? empreinteValeurDeterministe(transition.evenements)
          : "compacte",
      });
      if (!tracerEmpreintes && commandes.length > 12) {
        commandes.shift();
      }
      nombreDeCommandesExecutees += 1;
      return true;
    } catch (erreur) {
      const message = erreur instanceof Error ? erreur.message : String(erreur);
      commandes.push({
        sequence: nombreDeCommandesExecutees,
        commande,
        statut: "refusee",
        empreinteEtat: empreinteEtat(etat),
        empreinteEvenements: empreinteValeurDeterministe([]),
        erreur: message,
      });
      if (!tracerEmpreintes && commandes.length > 12) {
        commandes.shift();
      }
      nombreDeCommandesExecutees += 1;
      raisonDEchec = message;
      statut = "erreur";
      return false;
    }
  };

  const verifierSuiteNarrative = (): boolean =>
    executer({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 0,
    });

  const effectuerHalte = (duree: number): boolean => {
    const debut = etat.tempsDuConvoi.secondes;
    const commandesDeHalte: readonly CommandeCampagne[] = [
      { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
      { type: "halte.deployer" },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 1 },
      { type: "temps-du-convoi.ecouler", secondesReelles: duree },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
      { type: "halte.replier" },
    ];
    for (const commande of commandesDeHalte) {
      if (!executer(commande)) {
        return false;
      }
    }
    metriques.dureesDeHalte.push(etat.tempsDuConvoi.secondes - debut);
    return true;
  };

  for (let garde = 0; garde < limiteDeCommandes; garde += 1) {
    if (commandesImposees !== undefined) {
      const commande = commandesImposees[indexDeCommandeImposee];
      if (commande === undefined) {
        if (commandeImposeeRefusee) {
          break;
        }
        if (campagneEstTerminee(etat)) {
          statut = "terminee";
          raisonDEchec = null;
        } else {
          raisonDEchec = "journal-de-commandes-epuise";
          statut = "impasse";
        }
        break;
      }
      indexDeCommandeImposee += 1;
      if (commandeImposeeRefusee) {
        commandes.push({
          sequence: nombreDeCommandesExecutees,
          commande,
          statut: "refusee",
          empreinteEtat: empreinteEtat(etat),
          empreinteEvenements: empreinteValeurDeterministe([]),
          erreur: "non-executee-apres-premiere-divergence",
        });
        nombreDeCommandesExecutees += 1;
      } else if (!executer(commande)) {
        commandeImposeeRefusee = true;
      }
      continue;
    }

    if (campagneEstTerminee(etat)) {
      statut = "terminee";
      raisonDEchec = null;
      break;
    }

    if (etat.crises.criseActive !== null) {
      const criseId = etat.crises.criseActive.id;
      const reponseId = choisirReponseDeCrise(etat, strategie);
      const optionsDisponibles = listerReponsesDeCriseViables(etat);
      if (!executer({
        type: "crise.resoudre",
        criseId,
        reponseId,
      })) {
        break;
      }
      enregistrerSelection(
        `crise:${criseId}`,
        reponseId,
        optionsDisponibles,
      );
      continue;
    }

    if (
      etat.crises.alerte !== null &&
      etat.crises.alerte.ruptureA <= etat.tempsDuConvoi.secondes
    ) {
      if (
        !executer({
          type: "crise.declencher",
          criseId: etat.crises.alerte.id,
        })
      ) {
        break;
      }
      continue;
    }

    if (etat.narration.evenementActif !== null) {
      const evenement = trouverEvenement(etat.narration.evenementActif);
      const choixDisponibles =
        evenement?.choix
          .filter(
            (choix) =>
              (evenement.id !==
                "bassins.deversoir.le-chassis-des-bassins" ||
                choix.id !== "sceller-transformation" ||
                (etat.hautPuits.projetRegional?.statut === "retenu" &&
                  etat.pilotage.economie.stocks.materiaux.quantite >= 12)) &&
              choixNarratifEstDisponible(etat, evenement.id, choix),
          )
          .map(({ id }) => id) ?? [];
      const choixPlanifie = choisirOptionPourItineraire(
        strategie,
        etat.narration.evenementActif,
        versionRegles,
      );
      const choixId =
        choixPlanifie !== undefined &&
        choixDisponibles.includes(choixPlanifie)
          ? choixPlanifie
          : choisirOption(
              strategie,
              graine,
              etat.narration.evenementActif,
              choixDisponibles,
            );
      if (choixId === undefined) {
        raisonDEchec = `aucun-choix:${etat.narration.evenementActif}`;
        statut = "impasse";
        break;
      }
      const evenementId = etat.narration.evenementActif;
      if (!executer({
        type: "evenement-narratif.choisir",
        evenementId,
        choixId,
      })) {
        break;
      }
      enregistrerSelection(
        `evenement:${evenementId}`,
        choixId,
        choixDisponibles,
      );
      if (!campagneEstTerminee(etat) && !verifierSuiteNarrative()) {
        break;
      }
      continue;
    }

    if (
      etat.crises.alerte !== null &&
      (versionRegles >= VERSION_REGLES_CALIBRAGE_CAUSAL ||
        etat.crises.alerte.id === IDENTIFIANT_DE_LA_CRISE_DU_HALO ||
        etat.crises.alerte.id === IDENTIFIANT_DE_LA_CRISE_TERMINALE)
    ) {
      if (
        etat.tempsDuConvoi.vitesse !== 4 &&
        !executer({
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 4,
        })
      ) {
        break;
      }
      if (
        !executer({
          type: "temps-du-convoi.ecouler",
          secondesReelles: Math.ceil(
            (etat.crises.alerte.ruptureA -
              etat.tempsDuConvoi.secondes) /
              4,
          ),
        })
      ) {
        break;
      }
      continue;
    }

    const engagement = trouverEngagementDeRouteActif(etat.routes);
    if (engagement !== undefined) {
      if (
        etat.tempsDuConvoi.vitesse !== 4 &&
        !executer({
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 4,
        })
      ) {
        break;
      }
      if (
        !executer({
          type: "temps-du-convoi.ecouler",
          secondesReelles: Math.max(
            0,
            Math.ceil(
              (engagement.arriveeA - etat.tempsDuConvoi.secondes) / 4,
            ),
          ),
        })
      ) {
        break;
      }
      continue;
    }

    if (!incidentTraite && etat.pilotage.incidentActif !== null) {
      incidentTraite = true;
      const incidentId = etat.pilotage.incidentActif.id;
      const optionsDisponibles = [
        "laisser-doctrine",
        "securiser-pompe",
        "maintenir-debit",
      ] as const;
      if (strategie.incident === "laisser-doctrine") {
        enregistrerSelection(
          `incident:${incidentId}`,
          strategie.incident,
          optionsDisponibles,
        );
      } else if (!executer({
          type: "incident.ordonner",
          incidentId,
          ordre: strategie.incident,
      })) {
        break;
      } else {
        enregistrerSelection(
          `incident:${incidentId}`,
          strategie.incident,
          optionsDisponibles,
        );
      }
      continue;
    }
    incidentTraite ||= etat.pilotage.incidentActif === null;

    const compagnonIndisponible = etat.narration.faitsDeCampagne.some(
      ({ id }) => id === "compagnon.ilyana-voss.indisponible",
    );
    if (
      strategie.affecteCompagnon &&
      !compagnonEstAffecte(etat.narration.faitsDeCampagne) &&
      !compagnonIndisponible
    ) {
      if (
        !executer({
          type: "compagnon.affecter",
          compagnonId: COMPAGNON_DE_REFERENCE.id,
          quartierId: PREMIER_CONSEIL.compagnon.affectation.quartier,
        })
      ) {
        break;
      }
      continue;
    }

    const conseil = construireConseilDisponible(etat);
    const decisions =
      conseil?.sujets.flatMap((sujet) =>
        sujet.decisions
          .filter(
            (decision) =>
              conseil.id !== IDENTIFIANT_DU_CONSEIL_DES_VANNES ||
              decisionDuConseilDesVannesEstDisponible(
                decision.id,
                etat.narration.faitsDeCampagne,
              ),
          )
          .map((decision) => ({
            sujetId: sujet.id,
            decisionId: decision.id,
          })),
      ) ?? [];
    if (conseil !== null && decisions.length > 0) {
      const decisionId = choisirOption(
        strategie,
        graine,
        conseil.id,
        decisions.map(({ decisionId }) => decisionId),
      );
      const decision = decisions.find(
        (candidate) => candidate.decisionId === decisionId,
      );
      if (decision === undefined) {
        break;
      }
      if (!executer({
        type: "conseil.decider",
        conseilId: conseil.id,
        sujetId: decision.sujetId,
        decisionId: decision.decisionId,
      })) {
        break;
      }
      enregistrerSelection(
        `conseil:${conseil.id}`,
        decision.decisionId,
        decisions.map(({ decisionId: id }) => id),
      );
      if (!verifierSuiteNarrative()) {
        break;
      }
      continue;
    }

    if (etat.tempsDuConvoi.secondes < 60) {
      if (
        !executer({
          type: "temps-du-convoi.ecouler",
          secondesReelles: 60 - etat.tempsDuConvoi.secondes,
        })
      ) {
        break;
      }
      continue;
    }

    if (
      strategie.haltesApresTroncons.includes(
        metriques.tronconsParcourus,
      ) &&
      !haltesEffectuees.has(metriques.tronconsParcourus)
    ) {
      haltesEffectuees.add(metriques.tronconsParcourus);
      if (!effectuerHalte(strategie.dureeDeHalte)) {
        break;
      }
      continue;
    }

    const tronconId = strategie.itineraire.troncons[indexRoute];
    const engageables = listerTronconsEngageables(etat.routes);
    const faits = etat.narration.faitsDeCampagne.map(({ id }) => id);
    const estPrepare = (candidat: IdentifiantDeTroncon) =>
      !(
        versionRegles < VERSION_REGLES_LIGNE_ZERO_PRESERVEE &&
        candidat === "passage-de-la-ligne-zero" &&
        !faits.includes("bassins.deversoir.ligne-zero-relevee")
      ) &&
      routeAvalDesBassinsEstPreparee(
          candidat,
          etat.narration.evenementActif,
          faits,
        );
    const candidatPlanifie = engageables.find(
      ({ troncon }) =>
        troncon.id === tronconId && estPrepare(troncon.id),
    );
    if (tronconId !== undefined && candidatPlanifie !== undefined) {
      const positionDeDepart = etat.routes.position;
      if (!executer({
        type: "engagement-de-route.confirmer",
        tronconId: candidatPlanifie.troncon.id,
      })) {
        break;
      }
      enregistrerSelection(
        `route:${positionDeDepart}`,
        candidatPlanifie.troncon.id,
        engageables
          .filter(({ troncon }) => estPrepare(troncon.id))
          .map(({ troncon }) => troncon.id),
      );
      indexRoute += 1;
      continue;
    }

    if (
      etat.routes.position === "veille-basse" &&
      attentesDeVeilleBasse < 5
    ) {
      if (
        etat.tempsDuConvoi.vitesse !== 4 &&
        !executer({
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 4,
        })
      ) {
        break;
      }
      if (etat.tempsDuConvoi.vitesse !== 4) {
        continue;
      }
      attentesDeVeilleBasse += 1;
      if (
        !executer({
          type: "temps-du-convoi.ecouler",
          secondesReelles: 150,
        })
      ) {
        break;
      }
      continue;
    }

    const empreinteAvant = empreinteEtat(etat);
    if (!verifierSuiteNarrative()) {
      break;
    }
    if (
      etat.narration.evenementActif === null &&
      empreinteEtat(etat) === empreinteAvant
    ) {
      raisonDEchec = `aucune-commande:${etat.routes.position}:${
        tronconId ?? "fin-itineraire"
      }:${engageables.map(({ troncon }) => troncon.id).join(",")}`;
      statut = "impasse";
      break;
    }
  }

  if (
    statut !== "terminee" &&
    raisonDEchec === null &&
    nombreDeCommandesExecutees >= limiteDeCommandes
  ) {
    raisonDEchec = `limite-commandes:${limiteDeCommandes}`;
  }

  const faitsFinaux = etat.narration.faitsDeCampagne.map(({ id }) => id);
  const faitsAvecCause = etat.narration.faitsDeCampagne.filter(
    ({ cause }) => cause.length > 0,
  ).length;
  const coutsFinaux = calculerCoutsVectoriels(
    ressourcesInitiales,
    capturerRessources(etat),
  );
  const coutFinal = coutNormalise(coutsFinaux);
  const crisesCausalesEtUniques =
    Object.values(metriques.crisesParIdentifiant).every(
      (occurrences) => occurrences <= 1,
    ) &&
    Object.values(metriques.crisesParIdentifiant).reduce(
      (total, occurrences) => total + occurrences,
      0,
    ) === metriques.crises &&
    (metriques.crisesParIdentifiant[
      "trame-fer.cascade-materielle"
    ] === 0 ||
      (faitsFinaux.includes(
        "trame.grand-aiguillage.refroidissement-rationne",
      ) &&
        faitsFinaux.includes("crise.trame.cascade-materielle") &&
        faitsFinaux.some(
          (id) =>
            id === "crise.trame.etayer-chassis" ||
            id === "crise.trame.detacher-plateforme",
        ) &&
        faitsFinaux.some((id) =>
          id.startsWith("crise.recuperation.") &&
          (id.includes("charge-repartie-trame") ||
            id.includes("attelage-recale-trame")),
        ))) &&
    (metriques.crisesParIdentifiant[IDENTIFIANT_DE_LA_CRISE_DU_HALO] ===
      0 ||
      (faitsFinaux.includes("crise.couronne.saturation-du-halo") &&
        faitsFinaux.some(
          (id) =>
            id === "couronne.ouverture.clef-collective" ||
            id ===
              "couronne.ouverture.clef-confiee-aux-gardiennes",
        ) &&
        faitsFinaux.some(
          (id) =>
            id === "crise.couronne.stabiliser-anneau-du-halo" ||
            id ===
              "crise.couronne.relayer-halo-par-les-veilleurs" ||
            id === "crise.couronne.condamner-couronne-exterieure",
        ))) &&
    (metriques.crisesParIdentifiant[
      IDENTIFIANT_DE_LA_CRISE_TERMINALE
    ] === 0 ||
      (faitsFinaux.includes("crise.extinction-du-phare") &&
        faitsFinaux.some((id) =>
          id.startsWith("crise.recuperation.") &&
          id.endsWith(".manquee"),
        ) &&
        faitsFinaux.some((id) =>
          id.startsWith("defaite.extinction."),
        ) &&
        etat.denouement.statut === "defaite"));
  return {
    format: "lanternes-de-cendre.campagne-headless",
    version: VERSION_FORMAT_CAMPAGNE_HEADLESS,
    versionRegles,
    graine,
    strategieId: strategie.id,
    experience: strategie.experience,
    statut,
    raisonDEchec,
    positionFinale: etat.routes.position,
    denouementFinal: etat.denouement,
    commandes,
    faitsFinaux,
    metriques: {
      tronconsParcourus: metriques.tronconsParcourus,
      tronconsSousTension: metriques.tronconsSousTension,
      crises: metriques.crises,
      crisesParIdentifiant: metriques.crisesParIdentifiant,
      crisesCausalesEtUniques,
      arriveeAuNoeud: etat.routes.position === "noeud-central",
      defaiteStrategique: etat.denouement.statut === "defaite",
      secondesActives: metriques.secondesActives,
      secondesDeChargeDEntretien:
        metriques.secondesDeChargeDEntretien,
      dureesDeHalte: metriques.dureesDeHalte,
      faitsAvecCause,
      faitsTotaux: etat.narration.faitsDeCampagne.length,
      motifsNarratifs: metriques.motifsNarratifs,
      selectionsStrategiques: metriques.selectionsStrategiques,
      coutsFinaux,
      coutFinal,
    },
    recuperationsGratuites: metriques.recuperationsGratuites,
    bouclesSondees: metriques.bouclesSondees,
    bouclesProfitables: metriques.bouclesProfitables,
    empreinteFinale: empreinteEtat(etat),
  };
}

export interface MesureAgregee {
  readonly unite:
    | "ratio-troncons"
    | "nombre-par-campagne"
    | "ratio-campagnes"
    | "ratio-charge-equipes"
    | "secondes"
    | "ratio-faits-causes"
    | "ratio-motifs-repetes";
  readonly mediane: number;
  readonly p25: number;
  readonly p75: number;
  readonly nombreDEchantillons: number;
  readonly cible: {
    readonly minimum: number | null;
    readonly maximum: number | null;
  };
  readonly dansLaCible: boolean | null;
  readonly nature: "mesure-directe" | "proxy-headless";
}

export interface MetriquesAgregeesDEquilibrage {
  readonly besoinsSousTension: MesureAgregee;
  readonly crises: MesureAgregee;
  readonly arriveeAuNoeud: MesureAgregee & {
    readonly premieresCampagnes: number;
    readonly campagnesRejouees: number;
  };
  readonly entretienRepetitif: MesureAgregee;
  readonly dureeDesHaltes: MesureAgregee;
  readonly comprehensionCausale: MesureAgregee;
  readonly repetition: MesureAgregee;
}

export interface InvariantsDEquilibrage {
  readonly sansImpasse: boolean;
  readonly sansErreur: boolean;
  readonly sansRecuperationGratuite: boolean;
  readonly sansBoucleProfitable: boolean;
  readonly crisesUniquesEtCausales: boolean;
}

export interface PasseDEquilibrage {
  readonly format: "lanternes-de-cendre.passe-equilibrage";
  readonly version: 1;
  readonly versionRegles: number;
  readonly matrice: {
    readonly graines: number;
    readonly strategies: number;
    readonly campagnesAttendues: number;
    readonly campagnesExecutees: number;
  };
  readonly campagnes: readonly ResultatDeCampagneHeadless[];
  readonly metriques: MetriquesAgregeesDEquilibrage;
  readonly invariants: InvariantsDEquilibrage;
  readonly dominances: readonly AlerteDeDominance[];
}

function quantile(valeurs: readonly number[], proportion: number): number {
  if (valeurs.length === 0) {
    return 0;
  }
  const triees = [...valeurs].sort((gauche, droite) => gauche - droite);
  const position = (triees.length - 1) * proportion;
  const inferieur = Math.floor(position);
  const superieur = Math.ceil(position);
  const poids = position - inferieur;
  return (
    triees[inferieur]! * (1 - poids) + triees[superieur]! * poids
  );
}

function mesure(
  valeurs: readonly number[],
  unite: MesureAgregee["unite"],
  cible: MesureAgregee["cible"],
  nature: MesureAgregee["nature"] = "mesure-directe",
): MesureAgregee {
  const mediane = quantile(valeurs, 0.5);
  const dansLaCible =
    cible.minimum === null && cible.maximum === null
      ? null
      : (cible.minimum === null || mediane >= cible.minimum) &&
        (cible.maximum === null || mediane <= cible.maximum);
  return {
    unite,
    mediane,
    p25: quantile(valeurs, 0.25),
    p75: quantile(valeurs, 0.75),
    nombreDEchantillons: valeurs.length,
    cible,
    dansLaCible,
    nature,
  };
}

function taux(
  campagnes: readonly ResultatDeCampagneHeadless[],
  predicat: (campagne: ResultatDeCampagneHeadless) => boolean,
): number {
  return campagnes.length === 0
    ? 0
    : campagnes.filter(predicat).length / campagnes.length;
}

function calculerMetriquesAgregees(
  campagnes: readonly ResultatDeCampagneHeadless[],
): MetriquesAgregeesDEquilibrage {
  const premieres = campagnes.filter(
    ({ experience }) => experience === "premiere-campagne",
  );
  const rejouees = campagnes.filter(
    ({ experience }) => experience === "campagne-rejouee",
  );
  const tauxDArrivee = (groupe: readonly ResultatDeCampagneHeadless[]) =>
    taux(groupe, ({ metriques }) => metriques.arriveeAuNoeud);
  const premiereArrivee = tauxDArrivee(premieres);
  const arriveeRejouee = tauxDArrivee(rejouees);
  const arrivee = mesure(
    [tauxDArrivee(campagnes)],
    "ratio-campagnes",
    { minimum: 0.65, maximum: 0.95 },
  );
  return {
    besoinsSousTension: mesure(
      campagnes.map(({ metriques }) =>
        metriques.tronconsParcourus === 0
          ? 0
          : metriques.tronconsSousTension /
            metriques.tronconsParcourus,
      ),
      "ratio-troncons",
      { minimum: 0.3, maximum: 0.5 },
    ),
    crises: mesure(
      campagnes.map(({ metriques }) => metriques.crises),
      "nombre-par-campagne",
      { minimum: 3, maximum: 5 },
    ),
    arriveeAuNoeud: {
      ...arrivee,
      dansLaCible:
        premiereArrivee >= 0.65 &&
        premiereArrivee <= 0.8 &&
        arriveeRejouee >= 0.8 &&
        arriveeRejouee <= 0.95,
      premieresCampagnes: premiereArrivee,
      campagnesRejouees: arriveeRejouee,
    },
    entretienRepetitif: mesure(
      campagnes.map(({ metriques }) =>
        metriques.secondesActives === 0
          ? 0
          : metriques.secondesDeChargeDEntretien /
            metriques.secondesActives,
      ),
      "ratio-charge-equipes",
      { minimum: null, maximum: 0.25 },
      "proxy-headless",
    ),
    dureeDesHaltes: mesure(
      campagnes.flatMap(({ metriques }) => metriques.dureesDeHalte),
      "secondes",
      { minimum: null, maximum: null },
    ),
    comprehensionCausale: mesure(
      campagnes.map(({ metriques }) =>
        metriques.faitsTotaux === 0
          ? 1
          : metriques.faitsAvecCause / metriques.faitsTotaux,
      ),
      "ratio-faits-causes",
      { minimum: null, maximum: null },
      "proxy-headless",
    ),
    repetition: mesure(
      campagnes.map(({ metriques }) => {
        const total = metriques.motifsNarratifs.length;
        if (total === 0) {
          return 0;
        }
        return (
          (total - new Set(metriques.motifsNarratifs).size) / total
        );
      }),
      "ratio-motifs-repetes",
      { minimum: null, maximum: null },
      "proxy-headless",
    ),
  };
}

export function verifierInvariantsDEquilibrage(
  campagnes: readonly ResultatDeCampagneHeadless[],
): InvariantsDEquilibrage {
  return {
    sansImpasse: campagnes.every(({ statut }) => statut !== "impasse"),
    sansErreur: campagnes.every(({ statut }) => statut !== "erreur"),
    sansRecuperationGratuite: campagnes.every(
      ({ recuperationsGratuites }) => recuperationsGratuites === 0,
    ),
    sansBoucleProfitable: campagnes.every(
      ({ bouclesSondees, bouclesProfitables }) =>
        bouclesSondees > 0 && bouclesProfitables === 0,
    ),
    crisesUniquesEtCausales: campagnes.every(
      ({ metriques }) => metriques.crisesCausalesEtUniques,
    ),
  };
}

export interface CandidatADominance {
  readonly strategieId: string;
  readonly frequenceDeSelection: number;
  readonly tauxDeReussite: number;
  readonly tauxDeReussiteTemoin: number;
  readonly expositionComparable: boolean;
  readonly coutCompensatoire: boolean;
}

export interface AlerteDeDominance extends CandidatADominance {
  readonly gainDeReussite: number;
  readonly seuils: {
    readonly frequenceStrictementSuperieureA: 0.65;
    readonly gainStrictementSuperieurA: 0.1;
    readonly expositionComparable: true;
    readonly sansCoutCompensatoire: true;
  };
}

export function detecterStrategieDominante(
  candidats: readonly CandidatADominance[],
): readonly AlerteDeDominance[] {
  return candidats.flatMap((candidat) => {
    const gainDeReussite =
      candidat.tauxDeReussite - candidat.tauxDeReussiteTemoin;
    return candidat.frequenceDeSelection > 0.65 &&
      gainDeReussite > 0.1 &&
      candidat.expositionComparable &&
      !candidat.coutCompensatoire
      ? [
          {
            ...candidat,
            gainDeReussite,
            seuils: {
              frequenceStrictementSuperieureA: 0.65,
              gainStrictementSuperieurA: 0.1,
              expositionComparable: true,
              sansCoutCompensatoire: true,
            },
          },
        ]
      : [];
  });
}

function dimensionsDeCout(
  couts: CoutsVectorielsHeadless,
): Readonly<Record<string, number>> {
  return {
    ...Object.fromEntries(
      Object.entries(couts.stocks).map(([id, valeur]) => [
        `stock:${id}`,
        valeur,
      ]),
    ),
    habitants: couts.habitants,
    cicatrices: couts.cicatrices,
  };
}

function possedeUnCoutCompensatoire(
  selectionnees: readonly ResultatDeCampagneHeadless[],
  temoins: readonly ResultatDeCampagneHeadless[],
): boolean {
  const dimensions = new Set(
    [...selectionnees, ...temoins].flatMap((campagne) =>
      Object.keys(dimensionsDeCout(campagne.metriques.coutsFinaux)),
    ),
  );
  return [...dimensions].some((dimension) => {
    const medianeSelectionnee = quantile(
      selectionnees.map(
        (campagne) =>
          dimensionsDeCout(campagne.metriques.coutsFinaux)[dimension] ?? 0,
      ),
      0.5,
    );
    const medianeTemoin = quantile(
      temoins.map(
        (campagne) =>
          dimensionsDeCout(campagne.metriques.coutsFinaux)[dimension] ?? 0,
      ),
      0.5,
    );
    return medianeSelectionnee > medianeTemoin + 1e-9;
  });
}

export function calculerDominancesDEquilibrage(
  campagnes: readonly ResultatDeCampagneHeadless[],
): readonly AlerteDeDominance[] {
  const observations = campagnes.flatMap((campagne) =>
    campagne.metriques.selectionsStrategiques.map((selection) => ({
      campagne,
      selection,
      strate: `${campagne.experience}\u0000${selection.optionsDisponibles.join("\u0000")}`,
    })),
  );
  const candidats = new Map(
    observations.map(({ selection }) => [
      `${selection.contexteId}\u0000${selection.optionId}`,
      selection,
    ]),
  );
  return detecterStrategieDominante(
    [...candidats.values()].map((candidat) => {
      const exposees = observations.filter(
        ({ selection }) =>
          selection.contexteId === candidat.contexteId &&
          selection.optionsDisponibles.includes(candidat.optionId),
      );
      const selectionnees = exposees.filter(
        ({ selection }) => selection.optionId === candidat.optionId,
      );
      const temoins = exposees.filter(
        ({ selection }) => selection.optionId !== candidat.optionId,
      );
      const stratesSelectionnees = new Set(
        selectionnees.map(({ strate }) => strate),
      );
      const stratesTemoins = new Set(temoins.map(({ strate }) => strate));
      const stratesComparables = new Set(
        [...stratesSelectionnees].filter((strate) =>
          stratesTemoins.has(strate),
        ),
      );
      const selectionneesComparables = selectionnees.filter(({ strate }) =>
        stratesComparables.has(strate),
      );
      const temoinsComparables = temoins.filter(({ strate }) =>
        stratesComparables.has(strate),
      );
      const nombreDExpositions =
        selectionneesComparables.length + temoinsComparables.length;
      const campagnesSelectionnees = selectionneesComparables.map(
        ({ campagne }) => campagne,
      );
      const campagnesTemoins = temoinsComparables.map(
        ({ campagne }) => campagne,
      );
      return {
        strategieId: `${candidat.contexteId}:${candidat.optionId}`,
        frequenceDeSelection:
          nombreDExpositions === 0
            ? 0
            : selectionneesComparables.length / nombreDExpositions,
        tauxDeReussite: taux(
          campagnesSelectionnees,
          ({ metriques }) => metriques.arriveeAuNoeud,
        ),
        tauxDeReussiteTemoin: taux(
          campagnesTemoins,
          ({ metriques }) => metriques.arriveeAuNoeud,
        ),
        expositionComparable:
          selectionneesComparables.length > 0 &&
          temoinsComparables.length > 0,
        coutCompensatoire: possedeUnCoutCompensatoire(
          campagnesSelectionnees,
          campagnesTemoins,
        ),
      };
    }),
  );
}

export interface OptionsDePasseDEquilibrage {
  readonly nombreDeGraines?: number;
  readonly prefixeDeGraine?: string;
  readonly strategies?: readonly StrategieDEquilibrage[];
  readonly versionRegles?: number;
  readonly conserverTraces?: boolean;
}

export function executerPasseDEquilibrage({
  nombreDeGraines = NOMBRE_DE_GRAINES_STANDARD,
  prefixeDeGraine = "EQUILIBRAGE",
  strategies = STRATEGIES_D_EQUILIBRAGE,
  versionRegles = VERSION_REGLES_D_EQUILIBRAGE_COURANTE,
  conserverTraces = true,
}: OptionsDePasseDEquilibrage = {}): PasseDEquilibrage {
  if (!Number.isSafeInteger(nombreDeGraines) || nombreDeGraines <= 0) {
    throw new Error("Le nombre de Graines doit être un entier strictement positif.");
  }
  if (strategies.length === 0) {
    throw new Error("La passe d’équilibrage exige au moins une stratégie.");
  }
  const campagnes: ResultatDeCampagneHeadless[] = [];
  for (let index = 0; index < nombreDeGraines; index += 1) {
    const graine = `${prefixeDeGraine}-${index.toString().padStart(6, "0")}`;
    for (const strategie of strategies) {
      const campagne = executerCampagneHeadless({
        graine,
        strategie,
        versionRegles,
        tracerEmpreintes: conserverTraces,
      });
      campagnes.push(
        conserverTraces
          ? campagne
          : {
              ...campagne,
              commandes:
                campagne.statut === "terminee" ? [] : campagne.commandes,
              faitsFinaux: [],
            },
      );
    }
  }
  return {
    format: "lanternes-de-cendre.passe-equilibrage",
    version: 1,
    versionRegles,
    matrice: {
      graines: nombreDeGraines,
      strategies: strategies.length,
      campagnesAttendues: nombreDeGraines * strategies.length,
      campagnesExecutees: campagnes.length,
    },
    campagnes,
    metriques: calculerMetriquesAgregees(campagnes),
    invariants: verifierInvariantsDEquilibrage(campagnes),
    dominances: calculerDominancesDEquilibrage(campagnes),
  };
}

export function rejouerPasseAvecCommandesImposees(
  source: PasseDEquilibrage,
  versionRegles: number,
): PasseDEquilibrage {
  const strategies = new Map<string, StrategieDEquilibrage>(
    STRATEGIES_D_EQUILIBRAGE.map((strategie) => [strategie.id, strategie]),
  );
  const campagnes = source.campagnes.map((campagneSource) => {
    const strategie = strategies.get(campagneSource.strategieId);
    if (strategie === undefined) {
      throw new Error(
        `La stratégie « ${campagneSource.strategieId} » est inconnue.`,
      );
    }
    return executerCampagneHeadless({
      graine: campagneSource.graine,
      strategie,
      versionRegles,
      limiteDeCommandes: Math.max(320, campagneSource.commandes.length + 1),
      commandesImposees: campagneSource.commandes.map(
        ({ commande }) => commande,
      ),
    });
  });
  return {
    format: "lanternes-de-cendre.passe-equilibrage",
    version: 1,
    versionRegles,
    matrice: {
      ...source.matrice,
      campagnesExecutees: campagnes.length,
    },
    campagnes,
    metriques: calculerMetriquesAgregees(campagnes),
    invariants: verifierInvariantsDEquilibrage(campagnes),
    dominances: calculerDominancesDEquilibrage(campagnes),
  };
}

export interface PremiereDivergenceDEquilibrage {
  readonly sequence: number;
  readonly dimension: "commande" | "statut" | "etat" | "evenements" | "erreur";
  readonly empreinteReference: string;
  readonly empreinteCandidate: string;
  readonly explication: string;
}

export interface EcartDEquilibrage {
  readonly graine: string;
  readonly strategieId: string;
  readonly premiereDivergence: PremiereDivergenceDEquilibrage;
  readonly metriques: {
    readonly reference: MetriquesDeCampagneHeadless;
    readonly candidate: MetriquesDeCampagneHeadless;
  };
}

export interface CapsuleDEquilibrage {
  readonly format: "lanternes-de-cendre.capsule-equilibrage";
  readonly version: 1;
  readonly versionsRegles: {
    readonly reference: number;
    readonly candidate: number;
  };
  readonly graine: string;
  readonly strategieId: string;
  readonly commandes: readonly CommandeCampagne[];
  readonly premiereDivergence: PremiereDivergenceDEquilibrage;
}

export interface ComparaisonDePassesDEquilibrage {
  readonly format: "lanternes-de-cendre.comparaison-equilibrage";
  readonly version: 2;
  readonly versionsRegles: {
    readonly reference: number;
    readonly candidate: number;
  };
  readonly grainesEtCommandesIdentiques: boolean;
  readonly ecarts: readonly EcartDEquilibrage[];
  readonly capsules: readonly CapsuleDEquilibrage[];
  readonly porteeDeltaMetriques:
    | "campagnes-completes"
    | "indisponible-apres-divergence";
  readonly deltaMetriques: Readonly<
    Record<keyof MetriquesAgregeesDEquilibrage, number>
  > | null;
}

export interface ValidationDeReferenceDEquilibrage {
  readonly conforme: boolean;
  readonly empreinteReference: string;
  readonly empreinteRecalculee: string;
  readonly grainesEtCommandesIdentiques: boolean;
  readonly premiereDivergence: EcartDEquilibrage | null;
}

function cleDeCampagne(
  campagne: Pick<ResultatDeCampagneHeadless, "graine" | "strategieId">,
): string {
  return `${campagne.graine}\u0000${campagne.strategieId}`;
}

function premiereDivergence(
  reference: ResultatDeCampagneHeadless,
  candidate: ResultatDeCampagneHeadless,
): PremiereDivergenceDEquilibrage | null {
  const longueur = Math.max(
    reference.commandes.length,
    candidate.commandes.length,
  );
  for (let index = 0; index < longueur; index += 1) {
    const etapeReference = reference.commandes[index];
    const etapeCandidate = candidate.commandes[index];
    if (etapeReference === undefined || etapeCandidate === undefined) {
      return {
        sequence: index,
        dimension: "commande",
        empreinteReference: empreinteValeurDeterministe(
          etapeReference?.commande ?? null,
        ),
        empreinteCandidate: empreinteValeurDeterministe(
          etapeCandidate?.commande ?? null,
        ),
        explication:
          etapeReference === undefined
            ? "Le journal de référence est épuisé avant le journal candidat."
            : "Le journal candidat est épuisé avant le journal de référence.",
      };
    }
    if (
      empreinteValeurDeterministe(etapeReference.commande) !==
      empreinteValeurDeterministe(etapeCandidate.commande)
    ) {
      return {
        sequence: index,
        dimension: "commande",
        empreinteReference: empreinteValeurDeterministe(
          etapeReference.commande,
        ),
        empreinteCandidate: empreinteValeurDeterministe(
          etapeCandidate.commande,
        ),
        explication:
          "Les deux versions ne reçoivent pas la même commande à cette séquence.",
      };
    }
    const dimensions = [
      ["statut", etapeReference.statut, etapeCandidate.statut],
      ["etat", etapeReference.empreinteEtat, etapeCandidate.empreinteEtat],
      [
        "evenements",
        etapeReference.empreinteEvenements,
        etapeCandidate.empreinteEvenements,
      ],
      ["erreur", etapeReference.erreur ?? "", etapeCandidate.erreur ?? ""],
    ] as const;
    const divergence = dimensions.find(
      ([, valeurReference, valeurCandidate]) =>
        valeurReference !== valeurCandidate,
    );
    if (divergence !== undefined) {
      return {
        sequence: index,
        dimension: divergence[0],
        empreinteReference: divergence[1],
        empreinteCandidate: divergence[2],
        explication: expliquerDivergence(
          divergence[0],
          etapeReference,
          etapeCandidate,
        ),
      };
    }
  }
  return null;
}

function expliquerDivergence(
  dimension: Exclude<
    PremiereDivergenceDEquilibrage["dimension"],
    "commande"
  >,
  reference: EtapeDeCampagneHeadless,
  candidate: EtapeDeCampagneHeadless,
): string {
  const commande = JSON.stringify(candidate.commande);
  if (dimension === "statut") {
    const erreurReference =
      reference.erreur === undefined ? "" : ` : ${reference.erreur}`;
    const erreurCandidate =
      candidate.erreur === undefined ? "" : ` : ${candidate.erreur}`;
    return `Pour ${commande}, la référence est « ${reference.statut}${erreurReference} » et la candidate « ${candidate.statut}${erreurCandidate} ».`;
  }
  if (dimension === "etat") {
    return `La même commande ${commande} produit deux empreintes d’état différentes.`;
  }
  if (dimension === "evenements") {
    return `La même commande ${commande} produit deux suites d’événements différentes.`;
  }
  return `La même commande ${commande} produit l’erreur de référence « ${reference.erreur ?? "aucune"} » et l’erreur candidate « ${candidate.erreur ?? "aucune"} ».`;
}

export function comparerPassesDEquilibrage(
  reference: PasseDEquilibrage,
  candidate: PasseDEquilibrage,
): ComparaisonDePassesDEquilibrage {
  const candidatesParCle = new Map(
    candidate.campagnes.map((campagne) => [
      cleDeCampagne(campagne),
      campagne,
    ]),
  );
  let grainesEtCommandesIdentiques =
    reference.campagnes.length === candidate.campagnes.length;
  const ecarts: EcartDEquilibrage[] = [];
  const capsules: CapsuleDEquilibrage[] = [];
  for (const campagneReference of reference.campagnes) {
    const campagneCandidate = candidatesParCle.get(
      cleDeCampagne(campagneReference),
    );
    if (campagneCandidate === undefined) {
      grainesEtCommandesIdentiques = false;
      continue;
    }
    const commandesIdentiques =
      campagneReference.commandes.length ===
        campagneCandidate.commandes.length &&
      campagneReference.commandes.every(
        (etape, index) =>
          empreinteValeurDeterministe(etape.commande) ===
          empreinteValeurDeterministe(
            campagneCandidate.commandes[index]?.commande ?? null,
          ),
      );
    grainesEtCommandesIdentiques &&= commandesIdentiques;
    const divergence = premiereDivergence(
      campagneReference,
      campagneCandidate,
    );
    if (divergence === null) {
      continue;
    }
    ecarts.push({
      graine: campagneReference.graine,
      strategieId: campagneReference.strategieId,
      premiereDivergence: divergence,
      metriques: {
        reference: campagneReference.metriques,
        candidate: campagneCandidate.metriques,
      },
    });
    capsules.push({
      format: "lanternes-de-cendre.capsule-equilibrage",
      version: 1,
      versionsRegles: {
        reference: reference.versionRegles,
        candidate: candidate.versionRegles,
      },
      graine: campagneReference.graine,
      strategieId: campagneReference.strategieId,
      commandes: campagneReference.commandes
        .slice(0, divergence.sequence + 1)
        .map(({ commande }) => commande),
      premiereDivergence: divergence,
    });
  }
  const cles = Object.keys(reference.metriques) as Array<
    keyof MetriquesAgregeesDEquilibrage
  >;
  const campagnesCompletes = [...reference.campagnes, ...candidate.campagnes]
    .every(({ statut }) => statut === "terminee");
  return {
    format: "lanternes-de-cendre.comparaison-equilibrage",
    version: 2,
    versionsRegles: {
      reference: reference.versionRegles,
      candidate: candidate.versionRegles,
    },
    grainesEtCommandesIdentiques,
    ecarts,
    capsules,
    porteeDeltaMetriques: campagnesCompletes
      ? "campagnes-completes"
      : "indisponible-apres-divergence",
    deltaMetriques: campagnesCompletes
      ? (Object.fromEntries(
          cles.map((cle) => [
            cle,
            candidate.metriques[cle].mediane -
              reference.metriques[cle].mediane,
          ]),
        ) as Readonly<
          Record<keyof MetriquesAgregeesDEquilibrage, number>
        >)
      : null,
  };
}

export function validerReferenceDEquilibrage(
  reference: PasseDEquilibrage,
  recalculee: PasseDEquilibrage,
): ValidationDeReferenceDEquilibrage {
  const comparaison = comparerPassesDEquilibrage(reference, recalculee);
  const empreinteReference = empreinteValeurDeterministe(reference);
  const empreinteRecalculee = empreinteValeurDeterministe(recalculee);
  return {
    conforme:
      comparaison.grainesEtCommandesIdentiques &&
      comparaison.ecarts.length === 0 &&
      empreinteReference === empreinteRecalculee,
    empreinteReference,
    empreinteRecalculee,
    grainesEtCommandesIdentiques:
      comparaison.grainesEtCommandesIdentiques,
    premiereDivergence: comparaison.ecarts[0] ?? null,
  };
}
