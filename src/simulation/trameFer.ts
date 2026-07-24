export type RelationAvecLaRepublique =
  | "fermee"
  | "transactionnelle"
  | "cooperative";

export type IdentifiantDEngagementDeLaTrame =
  | "permis-de-circulation-republicain"
  | "droit-local-de-passage"
  | "taxe-des-lanternes"
  | "priorite-aux-requisitions"
  | "controle-de-pompe-neuve"
  | "service-lourd-du-train-outil"
  | "monopole-de-l-aiguillage-zero"
  | "charte-de-circulation-partagee"
  | "transport-autonome-aiguillage-zero";

export interface EngagementDeLaTrame {
  readonly id: IdentifiantDEngagementDeLaTrame;
  readonly prisA: number;
  readonly avec:
    | "republique-du-rail"
    | "ateliers-grand-aiguillage"
    | "puits-libres";
  readonly statut: "actif";
}

export type VoieDAccesALaPiece =
  | "train-outil"
  | "reparation-locale"
  | "attelage-federe";

export interface EtatDeLaTrameDeFer {
  readonly relationRepublique: RelationAvecLaRepublique;
  readonly engagements: readonly EngagementDeLaTrame[];
  readonly grandAiguillage: {
    readonly statut: "sous-controle-republicain" | "atelier-negocie";
    readonly pressions: {
      readonly eauDeRefroidissement: "critique" | "rationnee" | "stabilisee";
      readonly requisitions: "actives" | "prioritaires" | "encadrees";
    };
    readonly marche: {
      readonly servicesLourdsRestants: number;
      readonly eauDeRefroidissementRestante: number;
    };
    readonly dependanceEauDeRefroidissement:
      | "critique"
      | "rationnee"
      | "securisee";
  };
  readonly pieceDeRegulation: {
    readonly voiesOuvertes: readonly VoieDAccesALaPiece[];
    readonly monopoleRepublicain: boolean;
  };
  readonly occasions: {
    readonly trainOutil: {
      readonly statut: "inconnue" | "annoncee" | "reservee";
      readonly coutServicesLourds: 2;
      readonly engagementRequis: "service-lourd-du-train-outil";
    };
    readonly attelageFedere: {
      readonly statut: "inconnue" | "annoncee";
      readonly coutMateriaux: 8;
    };
  };
}

export function creerEtatInitialDeLaTrameDeFer(): EtatDeLaTrameDeFer {
  return {
    relationRepublique: "fermee",
    engagements: [],
    grandAiguillage: {
      statut: "sous-controle-republicain",
      pressions: {
        eauDeRefroidissement: "critique",
        requisitions: "actives",
      },
      marche: {
        servicesLourdsRestants: 2,
        eauDeRefroidissementRestante: 1,
      },
      dependanceEauDeRefroidissement: "critique",
    },
    pieceDeRegulation: {
      voiesOuvertes: [],
      monopoleRepublicain: false,
    },
    occasions: {
      trainOutil: {
        statut: "inconnue",
        coutServicesLourds: 2,
        engagementRequis: "service-lourd-du-train-outil",
      },
      attelageFedere: {
        statut: "inconnue",
        coutMateriaux: 8,
      },
    },
  };
}

function ajouterEngagement(
  etat: EtatDeLaTrameDeFer,
  engagement: EngagementDeLaTrame,
): EtatDeLaTrameDeFer {
  return etat.engagements.some(({ id }) => id === engagement.id)
    ? etat
    : { ...etat, engagements: [...etat.engagements, engagement] };
}

function ajouterVoie(
  etat: EtatDeLaTrameDeFer,
  voie: VoieDAccesALaPiece,
): EtatDeLaTrameDeFer {
  const voiesOuvertes = etat.pieceDeRegulation.voiesOuvertes.includes(voie)
    ? etat.pieceDeRegulation.voiesOuvertes
    : [...etat.pieceDeRegulation.voiesOuvertes, voie];
  return {
    ...etat,
    pieceDeRegulation: {
      voiesOuvertes,
      monopoleRepublicain:
        voiesOuvertes.length === 1 && voiesOuvertes[0] === "train-outil",
    },
  };
}

export function appliquerDecisionDeLaTrameDeFer(
  etat: EtatDeLaTrameDeFer,
  evenementId: string,
  choixId: string,
  moment: number,
): EtatDeLaTrameDeFer {
  if (evenementId === "trame.pompe-neuve.l-embranchement-sans-garde") {
    return choixId === "faire-verifier-aiguillage"
      ? ajouterEngagement(
          { ...etat, relationRepublique: "transactionnelle" },
          {
            id: "controle-de-pompe-neuve",
            prisA: moment,
            avec: "republique-du-rail",
            statut: "actif",
          },
        )
      : etat;
  }

  if (evenementId === "trame.pompe-neuve.les-filtres-du-rail") {
    const acteConnu = choixId === "inscrire-livraison";
    const romptUnEngagement =
      choixId === "livrer-discretement" &&
      etat.engagements.some(
        ({ avec }) => avec === "republique-du-rail",
      );
    return acteConnu || romptUnEngagement
      ? { ...etat, relationRepublique: "fermee" }
      : etat;
  }

  if (evenementId === "trame.traverse-libre.maelys-et-le-manifeste") {
    const acteConnu = choixId === "publier-manifeste";
    const romptUnEngagement =
      choixId === "sceller-registre" &&
      etat.engagements.some(
        ({ avec }) => avec === "republique-du-rail",
      );
    return acteConnu || romptUnEngagement
      ? { ...etat, relationRepublique: "fermee" }
      : etat;
  }

  if (evenementId === "trame.barriere-neuve.le-permis-des-essieux") {
    return ajouterEngagement(
      {
        ...etat,
        relationRepublique:
          choixId === "prendre-permis"
            ? "transactionnelle"
            : etat.relationRepublique,
      },
      {
        id:
          choixId === "prendre-permis"
            ? "permis-de-circulation-republicain"
            : "droit-local-de-passage",
        prisA: moment,
        avec:
          choixId === "prendre-permis"
            ? "republique-du-rail"
            : "ateliers-grand-aiguillage",
        statut: "actif",
      },
    );
  }

  if (evenementId === "trame.barriere-neuve.la-taxe-des-lanternes") {
    const requisition = choixId === "accepter-requisition";
    return ajouterEngagement(
      {
        ...etat,
        relationRepublique: "transactionnelle",
        grandAiguillage: {
          ...etat.grandAiguillage,
          pressions: {
            ...etat.grandAiguillage.pressions,
            requisitions: requisition ? "prioritaires" : "actives",
          },
        },
      },
      {
        id: requisition
          ? "priorite-aux-requisitions"
          : "taxe-des-lanternes",
        prisA: moment,
        avec: "republique-du-rail",
        statut: "actif",
      },
    );
  }

  if (evenementId === "trame.grand-aiguillage.la-piece-sans-serie") {
    if (choixId === "appeler-train-outil") {
      return ajouterVoie(
        ajouterEngagement(
          {
            ...etat,
            grandAiguillage: {
              ...etat.grandAiguillage,
              marche: {
                ...etat.grandAiguillage.marche,
                servicesLourdsRestants: 0,
              },
            },
            occasions: {
              ...etat.occasions,
              trainOutil: { ...etat.occasions.trainOutil, statut: "annoncee" },
            },
          },
          {
            id: "service-lourd-du-train-outil",
            prisA: moment,
            avec: "republique-du-rail",
            statut: "actif",
          },
        ),
        "train-outil",
      );
    }
    return ajouterVoie(
      {
        ...etat,
        grandAiguillage: {
          ...etat.grandAiguillage,
          statut: "atelier-negocie",
          marche: {
            ...etat.grandAiguillage.marche,
            servicesLourdsRestants: 0,
          },
        },
      },
      "reparation-locale",
    );
  }

  if (evenementId === "trame.grand-aiguillage.l-eau-des-machines") {
    const rationnee = choixId === "rationner-refroidissement";
    return {
      ...etat,
      grandAiguillage: {
        ...etat.grandAiguillage,
        pressions: {
          eauDeRefroidissement: rationnee ? "rationnee" : "stabilisee",
          requisitions: rationnee
            ? "encadrees"
            : etat.grandAiguillage.pressions.requisitions,
        },
        marche: {
          ...etat.grandAiguillage.marche,
          eauDeRefroidissementRestante: rationnee ? 1 : 0,
        },
        dependanceEauDeRefroidissement: rationnee
          ? "rationnee"
          : "securisee",
      },
    };
  }

  if (evenementId === "trame.grand-aiguillage.ilyana-et-l-attelage") {
    if (choixId === "former-attelage") {
      return ajouterVoie(
        {
          ...etat,
          occasions: {
            ...etat.occasions,
            attelageFedere: {
              ...etat.occasions.attelageFedere,
              statut: "annoncee",
            },
          },
        },
        "attelage-federe",
      );
    }
    return ajouterVoie(
      {
        ...etat,
        occasions: {
          ...etat.occasions,
          trainOutil: { ...etat.occasions.trainOutil, statut: "reservee" },
        },
      },
      "train-outil",
    );
  }

  if (evenementId === "trame.aiguillage-zero.le-conseil-des-voies") {
    if (choixId === "accorder-monopole") {
      return ajouterEngagement(
        { ...etat, relationRepublique: "cooperative" },
        {
          id: "monopole-de-l-aiguillage-zero",
          prisA: moment,
          avec: "republique-du-rail",
          statut: "actif",
        },
      );
    }
    if (choixId === "etablir-charte") {
      return ajouterEngagement(
        { ...etat, relationRepublique: "cooperative" },
        {
          id: "charte-de-circulation-partagee",
          prisA: moment,
          avec:
            etat.grandAiguillage.statut === "atelier-negocie"
              ? "ateliers-grand-aiguillage"
              : "puits-libres",
          statut: "actif",
        },
      );
    }
    if (choixId === "soustraire-piece") {
      return { ...etat, relationRepublique: "fermee" };
    }
    if (choixId === "assurer-transport-autonome") {
      return ajouterEngagement(
        { ...etat, relationRepublique: "transactionnelle" },
        {
          id: "transport-autonome-aiguillage-zero",
          prisA: moment,
          avec: "puits-libres",
          statut: "actif",
        },
      );
    }
  }

  return etat;
}

const DECISION_PAR_FAIT = {
  "trame.barriere-neuve.permis-republicain": [
    "trame.barriere-neuve.le-permis-des-essieux",
    "prendre-permis",
  ],
  "trame.barriere-neuve.droit-local-conteste": [
    "trame.barriere-neuve.le-permis-des-essieux",
    "demander-droit-local",
  ],
  "trame.barriere-neuve.taxe-des-lanternes": [
    "trame.barriere-neuve.la-taxe-des-lanternes",
    "payer-taxe",
  ],
  "trame.barriere-neuve.priorite-aux-requisitions": [
    "trame.barriere-neuve.la-taxe-des-lanternes",
    "accepter-requisition",
  ],
  "trame.grand-aiguillage.train-outil-annonce": [
    "trame.grand-aiguillage.la-piece-sans-serie",
    "appeler-train-outil",
  ],
  "trame.grand-aiguillage.reparation-locale-ouverte": [
    "trame.grand-aiguillage.la-piece-sans-serie",
    "ouvrir-reparation-locale",
  ],
  "trame.grand-aiguillage.refroidissement-securise": [
    "trame.grand-aiguillage.l-eau-des-machines",
    "acheter-refroidissement",
  ],
  "trame.grand-aiguillage.refroidissement-rationne": [
    "trame.grand-aiguillage.l-eau-des-machines",
    "rationner-refroidissement",
  ],
  "trame.grand-aiguillage.attelage-federe-annonce": [
    "trame.grand-aiguillage.ilyana-et-l-attelage",
    "former-attelage",
  ],
  "trame.grand-aiguillage.train-outil-reserve": [
    "trame.grand-aiguillage.ilyana-et-l-attelage",
    "reserver-train-outil",
  ],
  "trame.pompe-neuve.balises-libres-suivies": [
    "trame.pompe-neuve.l-embranchement-sans-garde",
    "suivre-balises-libres",
  ],
  "trame.pompe-neuve.aiguillage-signale": [
    "trame.pompe-neuve.l-embranchement-sans-garde",
    "faire-verifier-aiguillage",
  ],
  "trame.pompe-neuve.filtres-livres-discretement": [
    "trame.pompe-neuve.les-filtres-du-rail",
    "livrer-discretement",
  ],
  "trame.pompe-neuve.livraison-inscrite": [
    "trame.pompe-neuve.les-filtres-du-rail",
    "inscrire-livraison",
  ],
  "trame.traverse-libre.manifeste-public": [
    "trame.traverse-libre.maelys-et-le-manifeste",
    "publier-manifeste",
  ],
  "trame.traverse-libre.registre-scelle": [
    "trame.traverse-libre.maelys-et-le-manifeste",
    "sceller-registre",
  ],
  "trame.aiguillage-zero.monopole-republicain": [
    "trame.aiguillage-zero.le-conseil-des-voies",
    "accorder-monopole",
  ],
  "trame.aiguillage-zero.charte-partagee": [
    "trame.aiguillage-zero.le-conseil-des-voies",
    "etablir-charte",
  ],
  "trame.aiguillage-zero.piece-soustraite": [
    "trame.aiguillage-zero.le-conseil-des-voies",
    "soustraire-piece",
  ],
  "trame.aiguillage-zero.transport-autonome": [
    "trame.aiguillage-zero.le-conseil-des-voies",
    "assurer-transport-autonome",
  ],
} as const;

export function reconstruireEtatDeLaTrameDeFer(
  faits: readonly {
    readonly id: string;
    readonly moment: number;
  }[],
): EtatDeLaTrameDeFer {
  return faits.reduce((etat, fait) => {
    const decision =
      DECISION_PAR_FAIT[fait.id as keyof typeof DECISION_PAR_FAIT];
    return decision === undefined
      ? etat
      : appliquerDecisionDeLaTrameDeFer(
          etat,
          decision[0],
          decision[1],
          fait.moment,
        );
  }, creerEtatInitialDeLaTrameDeFer());
}
