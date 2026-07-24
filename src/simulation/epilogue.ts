import type { EtatCampagne } from "./campagne";
import { reconstruireEtatDuContratFinal } from "./finale";
import {
  calculerDevenirsDesSitesDesBassins,
  calculerDevenirsDesSitesDeLaTrame,
} from "./sites";
import {
  LIENS_DU_VIVIER,
  type IdentifiantDeCompagnon,
} from "./vivier";
import { reconstruireEtatDeLaVoieDesColonies } from "./voieColonies";

export type StatutDUnCompagnonDansLEpilogue =
  | "recrute"
  | "mort"
  | "parti"
  | "absent";

export interface LienPourEpilogue {
  readonly id: string;
  readonly avec: IdentifiantDeCompagnon;
  readonly etat: string;
}

export interface RancunePourEpilogue {
  readonly id: string;
  readonly cause: string;
  readonly cible: "porte-lanterne" | IdentifiantDeCompagnon;
  readonly reparation: string;
}

export interface EtatDUnCompagnonPourEpilogue {
  readonly id: IdentifiantDeCompagnon;
  readonly statut: StatutDUnCompagnonDansLEpilogue;
  readonly sante: string;
  readonly projet: string;
  readonly lien: LienPourEpilogue | null;
  readonly rancune: RancunePourEpilogue | null;
}

export interface DevenirDUnCompagnon {
  readonly id: IdentifiantDeCompagnon;
  readonly statut: Exclude<StatutDUnCompagnonDansLEpilogue, "absent">;
  readonly sante: string;
  readonly projet: string;
  readonly lien: LienPourEpilogue | null;
  readonly rancune: RancunePourEpilogue | null;
}

function lienEstEcrit(
  compagnonId: IdentifiantDeCompagnon,
  lien: LienPourEpilogue,
): boolean {
  return LIENS_DU_VIVIER.some(
    (candidat) =>
      candidat.id === lien.id &&
      candidat.compagnons.some((id) => id === compagnonId) &&
      candidat.compagnons.some((id) => id === lien.avec) &&
      (candidat.etats as readonly string[]).includes(lien.etat),
  );
}

export function restituerDevenirsDesCompagnons(
  etats: readonly EtatDUnCompagnonPourEpilogue[],
): readonly DevenirDUnCompagnon[] {
  const presents = new Set(
    etats
      .filter(({ statut }) => statut !== "absent")
      .map(({ id }) => id),
  );

  return etats.flatMap((compagnon) => {
    if (compagnon.statut === "absent") {
      return [];
    }
    const lien =
      compagnon.lien !== null &&
      presents.has(compagnon.lien.avec) &&
      lienEstEcrit(compagnon.id, compagnon.lien)
        ? compagnon.lien
        : null;
    const rancune =
      compagnon.rancune !== null &&
      (compagnon.rancune.cible === "porte-lanterne" ||
        (lien !== null && compagnon.rancune.cible === lien.avec))
        ? compagnon.rancune
        : null;
    return [
      {
        id: compagnon.id,
        statut: compagnon.statut,
        sante: compagnon.sante,
        projet: compagnon.projet,
        lien,
        rancune,
      },
    ];
  });
}

export interface RetourModulaireDeLEpilogue {
  readonly id: string;
  readonly etat: string;
  readonly causes: readonly string[];
}

export interface EtatDeLEpilogue {
  readonly visible: boolean;
  readonly axes: readonly {
    readonly id:
      | "stabilite-technique"
      | "controle-politique"
      | "cout-humain";
    readonly valeur: string;
  }[];
  readonly sortDuCoeur: string;
  readonly revelation: string;
  readonly compagnons: readonly DevenirDUnCompagnon[];
  readonly retours: {
    readonly colonies: readonly RetourModulaireDeLEpilogue[];
    readonly sites: readonly RetourModulaireDeLEpilogue[];
    readonly cohortes: readonly RetourModulaireDeLEpilogue[];
    readonly factions: readonly RetourModulaireDeLEpilogue[];
    readonly engagements: readonly RetourModulaireDeLEpilogue[];
    readonly traces: readonly RetourModulaireDeLEpilogue[];
  };
}

const FAITS_D_ACHEVEMENT_DE_L_EPILOGUE = [
  "epilogue.compagnons.devenirs-partages",
  "epilogue.compagnons.devenirs-confies",
] as const;

const FAITS_DE_REVELATION = [
  "epilogue.revelation.registre-rendu-public",
  "epilogue.revelation.copies-confiees-aux-colonies",
] as const;

const FAITS_D_ENGAGEMENT_RESTITUES = [
  "bassins.haut-puits.pacte-partage",
  "bassins.haut-puits.pacte-autonomie",
  "bassins.nacelles.accord-regional",
  "bassins.nacelles.passage-restreint",
  "bassins.conseil.reserves-partagees",
  "bassins.conseil.vannes-contraintes",
  "trame.aiguillage-zero.monopole-republicain",
  "trame.aiguillage-zero.charte-partagee",
  "trame.aiguillage-zero.engagement-transport-autonome",
  "couronne.colonies.voie-alliee-preparee",
  "couronne.tete-de-ligne.mandat-republicain",
  "couronne.seuil.registre-confie-a-maelys",
  "couronne.seuil.registre-commun",
] as const;

const FAITS_DE_TRACE_RESTITUES = [
  "bassins.nacelles.trace-laiton-persistante",
  "trame.marche.trace-bascule-clandestine",
  "trame.signal-zero.trace-sous-scelles",
  "trame.signal-zero.trace-transmise",
  "trame.aiguillage-zero.trace-du-vol",
] as const;

export const FAITS_MAJEURS_DE_L_EPILOGUE = [
  "finale.ancrage.refuge-commun",
  "finale.ancrage.citadelle-de-cendre",
  "finale.ancrage.dernier-rempart",
  "finale.reaccord.constellation",
  "finale.reaccord.reseau-de-fer",
  "finale.reaccord.veilles-dispersees",
  "finale.precipitation.ciel-rendu",
  "finale.precipitation.terre-des-sacrifies",
  "finale.precipitation.pluie-noire",
  "veille-basse.cohorte-accueillie",
  "veille-basse.cohorte-refusee",
  "veille-basse.cohorte-redirigee",
  "veille-basse.intervention-refusee",
  ...FAITS_D_ENGAGEMENT_RESTITUES,
  ...FAITS_DE_TRACE_RESTITUES,
] as const;

export const CATEGORIES_DE_RETOUR_PAR_FAIT_MAJEUR: Readonly<
  Record<(typeof FAITS_MAJEURS_DE_L_EPILOGUE)[number], string>
> = {
  "finale.ancrage.refuge-commun": "solution",
  "finale.ancrage.citadelle-de-cendre": "solution",
  "finale.ancrage.dernier-rempart": "solution",
  "finale.reaccord.constellation": "solution",
  "finale.reaccord.reseau-de-fer": "solution",
  "finale.reaccord.veilles-dispersees": "solution",
  "finale.precipitation.ciel-rendu": "solution",
  "finale.precipitation.terre-des-sacrifies": "solution",
  "finale.precipitation.pluie-noire": "solution",
  "veille-basse.cohorte-accueillie": "cohorte",
  "veille-basse.cohorte-refusee": "cohorte",
  "veille-basse.cohorte-redirigee": "cohorte",
  "veille-basse.intervention-refusee": "colonie",
  "couronne.seuil.registre-confie-a-maelys": "engagement",
  "couronne.seuil.registre-commun": "engagement",
  "bassins.haut-puits.pacte-partage": "engagement",
  "bassins.haut-puits.pacte-autonomie": "engagement",
  "bassins.nacelles.accord-regional": "engagement",
  "bassins.nacelles.passage-restreint": "engagement",
  "bassins.conseil.reserves-partagees": "engagement",
  "bassins.conseil.vannes-contraintes": "engagement",
  "trame.aiguillage-zero.monopole-republicain": "engagement",
  "trame.aiguillage-zero.charte-partagee": "engagement",
  "trame.aiguillage-zero.engagement-transport-autonome": "engagement",
  "couronne.colonies.voie-alliee-preparee": "engagement",
  "couronne.tete-de-ligne.mandat-republicain": "engagement",
  "bassins.nacelles.trace-laiton-persistante": "trace",
  "trame.marche.trace-bascule-clandestine": "trace",
  "trame.signal-zero.trace-sous-scelles": "trace",
  "trame.signal-zero.trace-transmise": "trace",
  "trame.aiguillage-zero.trace-du-vol": "trace",
};

function idsDesFaits(etat: EtatCampagne): ReadonlySet<string> {
  return new Set(
    etat.narration.faitsDeCampagne.map(({ id }) => id),
  );
}

function causesPresentes(
  faits: ReadonlySet<string>,
  candidates: readonly string[],
  causeDEtat: string,
): readonly string[] {
  const presentes = candidates.filter((id) => faits.has(id));
  return presentes.length > 0 ? presentes : [causeDEtat];
}

function reconstruireCompagnons(
  faits: ReadonlySet<string>,
): readonly DevenirDUnCompagnon[] {
  const ilyanaContredite =
    faits.has("prologue.ilyana-contredite") &&
    faits.has("bassins.haut-puits.ilyana-contredite");

  return restituerDevenirsDesCompagnons([
    {
      id: "ilyana-voss",
      statut: "recrute",
      sante: faits.has("prologue.ilyana-ecoutee")
        ? "brulures-surveillees"
        : "brulures-stabilisees",
      projet:
        faits.has("couronne.approches.plans-confies-a-ilyana") ||
        faits.has("couronne.ouverture.clef-collective")
          ? "accompli"
          : ilyanaContredite
          ? "abandonne"
          : "poursuivi",
      lien: null,
      rancune:
        ilyanaContredite &&
        !faits.has("couronne.approches.plans-confies-a-ilyana")
          ? {
              id: "parole-de-l-eau-ecartee",
              cause: "bassins.haut-puits.ilyana-contredite",
              cible: "porte-lanterne",
              reparation: "confier-les-comptes-a-la-communaute",
            }
          : null,
    },
    {
      id: "maelys-rive",
      statut: "absent",
      sante: "inconnue",
      projet: "inconnu",
      lien: null,
      rancune: null,
    },
    ...([
      "sira-vel",
      "bastien-roux",
      "noor-selan",
      "elian-morne",
      "ava-cendre",
      "tomas-rail",
      "nadia-silex",
      "ysee-orbe",
    ] as const).map((id) => ({
      id,
      statut: "absent" as const,
      sante: "inconnue",
      projet: "inconnu",
      lien: null,
      rancune: null,
    })),
  ]);
}

function construireRetours(
  etat: EtatCampagne,
  faits: ReadonlySet<string>,
): EtatDeLEpilogue["retours"] {
  const voieDesColonies = reconstruireEtatDeLaVoieDesColonies(etat);
  const sitesDesBassins =
    etat.devenirsDesSites ??
    calculerDevenirsDesSitesDesBassins({
      routes: etat.routes,
      veilleBasse: etat.veilleBasse,
      faits: [...faits],
    });
  const sitesDeLaTrame =
    sitesDesBassins.trameDeFer ??
    calculerDevenirsDesSitesDeLaTrame({
      routes: etat.routes,
      faits: [...faits],
    });

  const colonies: readonly RetourModulaireDeLEpilogue[] = [
    {
      id: "haut-puits",
      etat: `${etat.hautPuits.colonie.statut}:${etat.hautPuits.colonie.devenir}`,
      causes: causesPresentes(
        faits,
        [
          "bassins.haut-puits.pacte-partage",
          "bassins.haut-puits.pacte-autonomie",
          "bassins.haut-puits.panache-confine",
          "bassins.haut-puits.panache-derive",
        ],
        `etat:haut-puits:${etat.hautPuits.colonie.statut}`,
      ),
    },
    {
      id: "veille-basse",
      etat: etat.veilleBasse.colonie.statut,
      causes: causesPresentes(
        faits,
        [
          "veille-basse.sas-renforce",
          "veille-basse.hospice-ouvert",
          "veille-basse.intervention-refusee",
        ],
        `etat:veille-basse:${etat.veilleBasse.colonie.statut}`,
      ),
    },
    {
      id: "grand-aiguillage",
      etat: etat.trameDeFer.grandAiguillage.statut,
      causes: causesPresentes(
        faits,
        [
          "trame.grand-aiguillage.reparation-locale-ouverte",
          "trame.aiguillage-zero.charte-partagee",
          "trame.aiguillage-zero.monopole-republicain",
        ],
        `etat:grand-aiguillage:${etat.trameDeFer.grandAiguillage.statut}`,
      ),
    },
    {
      id: "traverse-libre",
      etat: etat.traverseLibre.statut,
      causes: causesPresentes(
        faits,
        [
          "trame.traverse-libre.galerie-etayee",
          "trame.traverse-libre.contournement-ouvert",
          "trame.aiguillage-zero.charte-partagee",
          "trame.aiguillage-zero.monopole-republicain",
        ],
        `etat:traverse-libre:${etat.traverseLibre.statut}`,
      ),
    },
    {
      id: "seuil",
      etat: `${voieDesColonies.seuil.statut}:${voieDesColonies.seuil.revendication}`,
      causes: causesPresentes(
        faits,
        [
          "couronne.seuil.marche-rationne",
          "couronne.seuil.dernieres-pieces-achetees",
          "couronne.seuil.registre-confie-a-maelys",
          "couronne.seuil.registre-commun",
          "couronne.ouverture.clef-collective",
        ],
        `etat:seuil:${voieDesColonies.seuil.statut}`,
      ),
    },
  ];

  const sites: readonly RetourModulaireDeLEpilogue[] = [
    ["maison-des-filtres", sitesDesBassins.maisonDesFiltres],
    ["les-vanniers", sitesDesBassins.vanniers],
    ["hospice-du-sillon", sitesDesBassins.hospiceDuSillon],
    ["nacelles", sitesDesBassins.nacelles],
    ["barriere-neuve", sitesDeLaTrame.barriereNeuve],
    ["dortoir-dix-sept", sitesDeLaTrame.dortoirDixSept],
    ["pompe-neuve", sitesDeLaTrame.pompeNeuve],
    ["marche-des-traverses", sitesDeLaTrame.marcheDesTraverses],
    ["signal-zero", sitesDeLaTrame.signalZero],
    [
      "tete-de-ligne",
      faits.has("couronne.tete-de-ligne.atelier-commun")
        ? "atelier-commun"
        : faits.has("couronne.tete-de-ligne.mandat-republicain")
          ? "sous-mandat"
          : "evacue",
    ],
    [
      "veille-des-trois",
      faits.has("couronne.veille-des-trois.sanctuaire-renforce")
        ? "sanctuaire-renforce"
        : faits.has("couronne.veille-des-trois.releves-evacues")
          ? "releves-evacues"
          : "abandonne",
    ],
    ["serres-de-verre", voieDesColonies.serresDeVerre.devenir],
  ].map(([id, devenir]) => ({
    id,
    etat: devenir,
    causes: causesPresentes(
      faits,
      [
        ...faits,
      ].filter(
        (fait) =>
          fait.includes(id) ||
          (id === "nacelles" && fait.startsWith("bassins.nacelles.")) ||
          (id === "dortoir-dix-sept" &&
            fait.startsWith("trame.barriere-neuve.")),
      ),
      `etat:${id}:${devenir}`,
    ),
  }));

  const cohortes: readonly RetourModulaireDeLEpilogue[] = [
    {
      id: "cohorte-de-refugies",
      etat: faits.has("prologue.cohorte-accueillie")
        ? "accueillie"
        : "orientee",
      causes: causesPresentes(
        faits,
        [
          "prologue.cohorte-accueillie",
          "prologue.cohorte-orientee",
        ],
        "etat:cohorte-de-refugies:orientee",
      ),
    },
    {
      id: "cohorte-du-sillon",
      etat: etat.veilleBasse.cohorte.integration.statut,
      causes: causesPresentes(
        faits,
        [
          "veille-basse.cohorte-accueillie",
          "veille-basse.cohorte-refusee",
          "veille-basse.cohorte-redirigee",
          "bassins.conseil.cohorte-reorientee",
        ],
        `etat:cohorte-du-sillon:${etat.veilleBasse.cohorte.integration.statut}`,
      ),
    },
  ];

  const factions: readonly RetourModulaireDeLEpilogue[] = [
    {
      id: "puits-libres",
      etat: faits.has("trame.aiguillage-zero.monopole-republicain")
        ? "hostile"
        : etat.traverseLibre.relationPuitsLibres,
      causes: causesPresentes(
        faits,
        [
          "trame.aiguillage-zero.charte-partagee",
          "trame.aiguillage-zero.monopole-republicain",
          "trame.aiguillage-zero.engagement-transport-autonome",
        ],
        `etat:puits-libres:${etat.traverseLibre.relationPuitsLibres}`,
      ),
    },
    {
      id: "pelerins-de-cendre",
      etat: faits.has("couronne.ouverture.phares-ouvertes")
        ? "mandates"
        : faits.has("veille-basse.intervention-refusee")
          ? "endeuilles"
          : "guides",
      causes: causesPresentes(
        faits,
        [
          "couronne.ouverture.phares-ouvertes",
          "veille-basse.intervention-refusee",
          "veille-basse.registres-copies",
          "veille-basse.registres-laisses",
        ],
        "etat:pelerins-de-cendre:guides",
      ),
    },
    {
      id: "republique-du-rail",
      etat: faits.has("trame.aiguillage-zero.monopole-republicain")
        ? "dominante"
        : faits.has("trame.aiguillage-zero.charte-partagee")
          ? "encadree"
          : etat.trameDeFer.relationRepublique,
      causes: causesPresentes(
        faits,
        [
          "trame.aiguillage-zero.monopole-republicain",
          "trame.aiguillage-zero.charte-partagee",
          "couronne.tete-de-ligne.mandat-republicain",
        ],
        `etat:republique-du-rail:${etat.trameDeFer.relationRepublique}`,
      ),
    },
  ];

  const engagementsDeLaTrame =
    etat.trameDeFer.engagements.map(({ id }) => ({
      id,
      etat: "actif",
      causes: [`etat:${id}:actif`],
    }));
  const idDUnEngagementParFait: Readonly<Record<string, string>> = {
    "trame.aiguillage-zero.monopole-republicain":
      "monopole-de-l-aiguillage-zero",
    "trame.aiguillage-zero.charte-partagee":
      "charte-de-circulation-partagee",
    "trame.aiguillage-zero.engagement-transport-autonome":
      "transport-autonome-aiguillage-zero",
  };
  const engagementsParFait = FAITS_D_ENGAGEMENT_RESTITUES
    .filter((id) => faits.has(id))
    .map((faitId) => ({
      id: idDUnEngagementParFait[faitId] ?? faitId,
      etat: "actif",
      causes: [faitId],
    }));
  const engagements = [
    ...engagementsDeLaTrame,
    ...engagementsParFait,
  ].reduce<RetourModulaireDeLEpilogue[]>((fusionnes, engagement) => {
    const index = fusionnes.findIndex(
      ({ id }) => id === engagement.id,
    );
    if (index === -1) {
      return [...fusionnes, engagement];
    }
    const existant = fusionnes[index]!;
    return fusionnes.map((candidat, candidatIndex) =>
      candidatIndex === index
        ? {
            ...existant,
            causes: [
              ...new Set([
                ...existant.causes,
                ...engagement.causes,
              ]),
            ],
          }
        : candidat,
    );
  }, []);
  const traces = FAITS_DE_TRACE_RESTITUES
    .filter((id) => faits.has(id))
    .map((id) => ({
      id,
      etat: id.endsWith("transmise")
        ? "attribuee"
        : id.endsWith("sous-scelles")
          ? "sous-scelles"
          : "persistante",
      causes: [id],
    }));

  return {
    colonies,
    sites,
    cohortes,
    factions,
    engagements,
    traces,
  };
}

const RETOURS_VIDES: EtatDeLEpilogue["retours"] = {
  colonies: [],
  sites: [],
  cohortes: [],
  factions: [],
  engagements: [],
  traces: [],
};

export function reconstruireEpilogue(etat: EtatCampagne): EtatDeLEpilogue {
  const faits = idsDesFaits(etat);
  const visible = FAITS_D_ACHEVEMENT_DE_L_EPILOGUE.some((id) =>
    faits.has(id),
  );
  const finale = reconstruireEtatDuContratFinal(etat);
  if (!visible || finale.bilan === undefined) {
    return {
      visible: false,
      axes: [],
      sortDuCoeur: "inconnu",
      revelation: "inconnue",
      compagnons: [],
      retours: RETOURS_VIDES,
    };
  }

  return {
    visible: true,
    axes: [
      {
        id: "stabilite-technique",
        valeur: finale.bilan.stabilite,
      },
      {
        id: "controle-politique",
        valeur: finale.bilan.controle,
      },
      {
        id: "cout-humain",
        valeur: finale.bilan.coutHumain,
      },
    ],
    sortDuCoeur: finale.bilan.sortDuCoeur,
    revelation:
      FAITS_DE_REVELATION.find((id) => faits.has(id)) ??
      "inconnue",
    compagnons: reconstruireCompagnons(faits),
    retours: construireRetours(etat, faits),
  };
}
