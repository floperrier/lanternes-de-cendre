export interface EtatDeTraverseLibre {
  readonly statut: "fragile" | "stabilisee" | "autonome";
  readonly approche: "inconnue" | "balises-libres" | "controle-republicain";
  readonly pressions: {
    readonly filtres: "critiques" | "rationnes" | "stabilises";
    readonly isolement: "menace" | "endigue" | "leve";
  };
  readonly marche: {
    readonly lotsDeFiltresManquants: number;
    readonly lotsDeRemedesManquants: number;
    readonly reservesDEauDisponibles: number;
  };
  readonly contournement: "inconnu" | "releve" | "praticable";
  readonly dependancesAuRail: {
    readonly filtres: "critique" | "assuree" | "contournee";
    readonly remedes: "critique" | "assuree" | "contournee";
    readonly debouches: "fermes" | "precaires" | "autonomes";
  };
  readonly routeSecondaire: {
    readonly statut: "degradee" | "reparee" | "contournee";
    readonly issueCouteuse:
      | "materiaux-de-reparation"
      | "dette-de-filtres"
      | null;
  };
  readonly aide: {
    readonly statut: "aucune" | "discrete" | "publique";
    readonly connueDeLaRepublique: boolean;
  };
  readonly relationPuitsLibres:
    | "fermee"
    | "transactionnelle"
    | "cooperative";
  readonly registre: "aucun" | "public" | "scelle";
}

export function creerEtatInitialDeTraverseLibre(): EtatDeTraverseLibre {
  return {
    statut: "fragile",
    approche: "inconnue",
    pressions: {
      filtres: "critiques",
      isolement: "menace",
    },
    marche: {
      lotsDeFiltresManquants: 2,
      lotsDeRemedesManquants: 1,
      reservesDEauDisponibles: 3,
    },
    contournement: "inconnu",
    dependancesAuRail: {
      filtres: "critique",
      remedes: "critique",
      debouches: "fermes",
    },
    routeSecondaire: {
      statut: "degradee",
      issueCouteuse: null,
    },
    aide: {
      statut: "aucune",
      connueDeLaRepublique: false,
    },
    relationPuitsLibres: "fermee",
    registre: "aucun",
  };
}

export function appliquerDecisionDeTraverseLibre(
  etat: EtatDeTraverseLibre,
  evenementId: string,
  choixId: string,
): EtatDeTraverseLibre {
  if (evenementId === "trame.pompe-neuve.l-embranchement-sans-garde") {
    return {
      ...etat,
      approche:
        choixId === "suivre-balises-libres"
          ? "balises-libres"
          : "controle-republicain",
      relationPuitsLibres:
        choixId === "suivre-balises-libres"
          ? "transactionnelle"
          : etat.relationPuitsLibres,
    };
  }

  if (evenementId === "trame.pompe-neuve.les-filtres-du-rail") {
    const publique = choixId === "inscrire-livraison";
    return {
      ...etat,
      statut: "stabilisee",
      pressions: {
        ...etat.pressions,
        filtres: publique ? "stabilises" : "rationnes",
      },
      marche: {
        ...etat.marche,
        lotsDeFiltresManquants: publique ? 0 : 1,
        lotsDeRemedesManquants: publique ? 0 : etat.marche.lotsDeRemedesManquants,
      },
      dependancesAuRail: {
        ...etat.dependancesAuRail,
        filtres: publique ? "assuree" : etat.dependancesAuRail.filtres,
        remedes: publique ? "assuree" : etat.dependancesAuRail.remedes,
      },
      aide: {
        statut: publique ? "publique" : "discrete",
        connueDeLaRepublique: publique || etat.aide.connueDeLaRepublique,
      },
      relationPuitsLibres: "cooperative",
    };
  }

  if (evenementId === "trame.traverse-libre.le-reservoir-sous-la-voie") {
    return choixId === "lever-vanne-du-contournement"
      ? {
          ...etat,
          contournement: "releve",
          marche: {
            ...etat.marche,
            reservesDEauDisponibles: 2,
          },
        }
      : etat;
  }

  if (evenementId === "trame.traverse-libre.la-galerie-qui-cede") {
    const reparee = choixId === "etayer-galerie";
    return {
      ...etat,
      statut: reparee ? "stabilisee" : "autonome",
      pressions: {
        ...etat.pressions,
        isolement: reparee ? "endigue" : "leve",
      },
      contournement: reparee ? etat.contournement : "praticable",
      dependancesAuRail: {
        ...etat.dependancesAuRail,
        debouches: reparee ? "precaires" : "autonomes",
      },
      routeSecondaire: {
        statut: reparee ? "reparee" : "contournee",
        issueCouteuse: reparee
          ? "materiaux-de-reparation"
          : "dette-de-filtres",
      },
    };
  }

  if (evenementId === "trame.traverse-libre.maelys-et-le-manifeste") {
    const publique = choixId === "publier-manifeste";
    return {
      ...etat,
      aide: {
        statut:
          publique || etat.aide.statut === "publique"
            ? "publique"
            : "discrete",
        connueDeLaRepublique:
          publique || etat.aide.connueDeLaRepublique,
      },
      relationPuitsLibres: "cooperative",
      registre: publique ? "public" : "scelle",
    };
  }

  return etat;
}

const DECISION_PAR_FAIT = {
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
  "trame.traverse-libre.contournement-releve": [
    "trame.traverse-libre.le-reservoir-sous-la-voie",
    "lever-vanne-du-contournement",
  ],
  "trame.traverse-libre.vanne-preservee": [
    "trame.traverse-libre.le-reservoir-sous-la-voie",
    "preserver-vanne",
  ],
  "trame.traverse-libre.galerie-etayee": [
    "trame.traverse-libre.la-galerie-qui-cede",
    "etayer-galerie",
  ],
  "trame.traverse-libre.contournement-ouvert": [
    "trame.traverse-libre.la-galerie-qui-cede",
    "ouvrir-contournement",
  ],
  "trame.traverse-libre.manifeste-public": [
    "trame.traverse-libre.maelys-et-le-manifeste",
    "publier-manifeste",
  ],
  "trame.traverse-libre.registre-scelle": [
    "trame.traverse-libre.maelys-et-le-manifeste",
    "sceller-registre",
  ],
} as const;

export function reconstruireEtatDeTraverseLibre(
  faits: readonly { readonly id: string }[],
): EtatDeTraverseLibre {
  return faits.reduce((etat, fait) => {
    const decision =
      DECISION_PAR_FAIT[fait.id as keyof typeof DECISION_PAR_FAIT];
    return decision === undefined
      ? etat
      : appliquerDecisionDeTraverseLibre(etat, decision[0], decision[1]);
  }, creerEtatInitialDeTraverseLibre());
}
