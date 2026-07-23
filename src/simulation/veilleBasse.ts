export type StatutDeColonie = "prospere" | "stable" | "fragile" | "perdue";

export type PressionDeVeilleBasse =
  | "afflux-deplaces"
  | "filtres-satures"
  | "cohorte-aux-portes";

export type IdentifiantOffreDeVeilleBasse =
  | "filtres-contre-releve"
  | "renfort-contre-materiaux";

export interface EtatDeVeilleBasse {
  readonly colonie: {
    readonly id: "veille-basse";
    readonly statut: StatutDeColonie;
    readonly pressions: readonly PressionDeVeilleBasse[];
    readonly marche: readonly {
      readonly id: IdentifiantOffreDeVeilleBasse;
      readonly statut: "disponible" | "epuisee";
      readonly cout: string;
      readonly gain: string;
    }[];
    readonly archives: {
      readonly etat: "scellees" | "ouvertes";
      readonly revelationEssentielle:
        | null
        | "reseau-ancien.deplacement-vers-peripheries";
    };
    readonly techniciens: {
      readonly equipesDisponibles: number;
      readonly affectation:
        | "maintien-des-filtres"
        | "renfort-des-sas"
        | "lecture-des-archives";
    };
    readonly avertissementDePerte: {
      readonly avertiA: number;
      readonly cause: string;
      readonly occasionDIntervention: "offerte" | "ignoree" | "saisie";
    } | null;
  };
  readonly hospiceDuSillon: {
    readonly id: "hospice-du-sillon";
    readonly besoin: "places-filtrees";
    readonly devenir: "ouvert" | "sous-charge" | "renforce";
  };
  readonly cohorte: {
    readonly id: "cohorte-du-sillon";
    readonly origine: "camp-des-digues";
    readonly destination:
      | "veille-basse"
      | "cite-caravane"
      | "hospice-du-sillon"
      | "hors-de-veille-basse";
    readonly taille: 18;
    readonly etatDominant: "epuisee";
    readonly specialite: "charpente-etanche";
    readonly memoire: "aucune" | "aidee" | "refusee" | "redirigee";
    readonly integration: {
      readonly statut:
        | "en-attente"
        | "charge-accueil"
        | "equipes-integrees"
        | "refusee"
        | "redirigee";
      readonly chargeDAccueil: {
        readonly habitants: 18;
        readonly commenceA: number;
        readonly integrationPrevueA: number;
        readonly cause: "veille-basse.la-place-sous-le-phare";
      } | null;
      readonly equipesIntegrees: number;
    };
  };
  readonly maelysRive: {
    readonly decision:
      | null
      | "coffret-confie"
      | "equipes-prioritaires";
    readonly position: "veille-basse" | "hospice-du-sillon";
    readonly releveDeLHospice:
      | "non-planifie"
      | "rapide-en-cours"
      | "lent-en-cours"
      | "termine";
  };
  readonly consequencesDifferees: readonly ConsequenceDiffereeDeVeilleBasse[];
  readonly revelationsEssentielles: readonly string[];
}

export interface ConsequenceDiffereeDeVeilleBasse {
  readonly id:
    | "veille-basse.cohorte-refusee-revient-aux-portes"
    | "veille-basse.hospice-accueille-la-cohorte"
    | "veille-basse.maelys-termine-le-releve"
    | "veille-basse.equipes-terminent-le-releve"
    | "veille-basse.perte-apres-intervention-refusee";
  readonly cause:
    | "veille-basse.cohorte-refusee"
    | "veille-basse.cohorte-redirigee"
    | "veille-basse.maelys-mission-confiee"
    | "veille-basse.maelys-equipes-prioritaires"
    | "veille-basse.intervention-refusee";
  readonly programmeeA: number;
  readonly jalonPrevuA: number;
  readonly manifesteeA: number | null;
  readonly statut: "attendue" | "manifestee";
}

export type EvenementDeVeilleBasse =
  | {
      readonly type: "cohorte.integration-terminee";
      readonly cohorteId: "cohorte-du-sillon";
      readonly equipesCreees: 2;
      readonly cause: "veille-basse.la-place-sous-le-phare";
      readonly moment: number;
    }
  | {
      readonly type: "consequence-differee.manifestee";
      readonly consequenceId: ConsequenceDiffereeDeVeilleBasse["id"];
      readonly cause: ConsequenceDiffereeDeVeilleBasse["cause"];
      readonly moment: number;
    }
  | {
      readonly type: "jalon-du-monde.atteint";
      readonly jalonId: string;
      readonly cause: ConsequenceDiffereeDeVeilleBasse["cause"];
      readonly moment: number;
    };

export interface TransitionDeVeilleBasse {
  readonly etat: EtatDeVeilleBasse;
  readonly evenements: readonly EvenementDeVeilleBasse[];
}

export type DecisionPourLaCohorte =
  | "accueillir"
  | "refuser"
  | "rediriger";

export type InterventionPourVeilleBasse =
  | "renforcer-sas"
  | "ouvrir-hospice";

export type DecisionSurLesArchives =
  | "copier-registres"
  | "laisser-registres";

export type DecisionPourMaelys =
  | "confier-coffret"
  | "garder-equipes";

const DELAI_D_INTEGRATION = 600;
const DELAI_DE_CONSEQUENCE_DE_COHORTE = 600;
const DELAI_DU_RELEVE_RAPIDE = 300;
const DELAI_DU_RELEVE_LENT = 600;
const DELAI_AVANT_PERTE = 300;

export function creerEtatInitialDeVeilleBasse(): EtatDeVeilleBasse {
  return {
    colonie: {
      id: "veille-basse",
      statut: "fragile",
      pressions: ["afflux-deplaces", "filtres-satures"],
      marche: [
        {
          id: "filtres-contre-releve",
          statut: "disponible",
          cout: "releve-du-phare-mobile",
          gain: "filtres-etanches",
        },
        {
          id: "renfort-contre-materiaux",
          statut: "disponible",
          cout: "materiaux-de-charpente",
          gain: "renfort-des-techniciens",
        },
      ],
      archives: {
        etat: "scellees",
        revelationEssentielle: null,
      },
      techniciens: {
        equipesDisponibles: 2,
        affectation: "maintien-des-filtres",
      },
      avertissementDePerte: null,
    },
    hospiceDuSillon: {
      id: "hospice-du-sillon",
      besoin: "places-filtrees",
      devenir: "ouvert",
    },
    cohorte: {
      id: "cohorte-du-sillon",
      origine: "camp-des-digues",
      destination: "veille-basse",
      taille: 18,
      etatDominant: "epuisee",
      specialite: "charpente-etanche",
      memoire: "aucune",
      integration: {
        statut: "en-attente",
        chargeDAccueil: null,
        equipesIntegrees: 0,
      },
    },
    maelysRive: {
      decision: null,
      position: "veille-basse",
      releveDeLHospice: "non-planifie",
    },
    consequencesDifferees: [],
    revelationsEssentielles: [],
  };
}

export function accueillirOuOrienterLaCohorte(
  etat: EtatDeVeilleBasse,
  decision: DecisionPourLaCohorte,
  moment: number,
): TransitionDeVeilleBasse {
  if (etat.cohorte.memoire !== "aucune") {
    throw new Error("La Cohorte du Sillon a déjà reçu une réponse.");
  }

  if (decision === "accueillir") {
    return {
      etat: {
        ...etat,
        cohorte: {
          ...etat.cohorte,
          destination: "cite-caravane",
          memoire: "aidee",
          integration: {
            statut: "charge-accueil",
            chargeDAccueil: {
              habitants: 18,
              commenceA: moment,
              integrationPrevueA: moment + DELAI_D_INTEGRATION,
              cause: "veille-basse.la-place-sous-le-phare",
            },
            equipesIntegrees: 0,
          },
        },
      },
      evenements: [],
    };
  }

  const estUnRefus = decision === "refuser";
  const consequence: ConsequenceDiffereeDeVeilleBasse = estUnRefus
    ? {
        id: "veille-basse.cohorte-refusee-revient-aux-portes",
        cause: "veille-basse.cohorte-refusee",
        programmeeA: moment,
        jalonPrevuA: moment + DELAI_DE_CONSEQUENCE_DE_COHORTE,
        manifesteeA: null,
        statut: "attendue",
      }
    : {
        id: "veille-basse.hospice-accueille-la-cohorte",
        cause: "veille-basse.cohorte-redirigee",
        programmeeA: moment,
        jalonPrevuA: moment + DELAI_DE_CONSEQUENCE_DE_COHORTE,
        manifesteeA: null,
        statut: "attendue",
      };

  return {
    etat: {
      ...etat,
      cohorte: {
        ...etat.cohorte,
        destination: estUnRefus
          ? "hors-de-veille-basse"
          : "hospice-du-sillon",
        memoire: estUnRefus ? "refusee" : "redirigee",
        integration: {
          statut: estUnRefus ? "refusee" : "redirigee",
          chargeDAccueil: null,
          equipesIntegrees: 0,
        },
      },
      consequencesDifferees: [...etat.consequencesDifferees, consequence],
    },
    evenements: [],
  };
}

export function menacerVeilleBasse(
  etat: EtatDeVeilleBasse,
  cause: string,
  moment: number,
): EtatDeVeilleBasse {
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      pressions: ["cohorte-aux-portes", "filtres-satures"],
      avertissementDePerte: {
        avertiA: moment,
        cause,
        occasionDIntervention: "offerte",
      },
    },
  };
}

export function preparerInterventionPourVeilleBasse(
  etat: EtatDeVeilleBasse,
  moment: number,
): EtatDeVeilleBasse {
  if (etat.colonie.avertissementDePerte !== null) {
    return etat;
  }
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      avertissementDePerte: {
        avertiA: moment,
        cause: "veille-basse.la-porte-des-filtres",
        occasionDIntervention: "offerte",
      },
    },
  };
}

export function interventionDeVeilleBasseEstPrete(
  etat: EtatDeVeilleBasse,
): boolean {
  if (etat.cohorte.memoire === "aidee") {
    return etat.cohorte.integration.statut === "equipes-integrees";
  }
  const consequenceAttendue =
    etat.cohorte.memoire === "refusee"
      ? "veille-basse.cohorte-refusee-revient-aux-portes"
      : etat.cohorte.memoire === "redirigee"
        ? "veille-basse.hospice-accueille-la-cohorte"
        : null;
  return (
    consequenceAttendue !== null &&
    etat.consequencesDifferees.some(
      (consequence) =>
        consequence.id === consequenceAttendue &&
        consequence.statut === "manifestee",
    )
  );
}

export function intervenirPourVeilleBasse(
  etat: EtatDeVeilleBasse,
  intervention: InterventionPourVeilleBasse,
  moment: number,
): EtatDeVeilleBasse {
  const avertie =
    etat.colonie.avertissementDePerte === null
      ? preparerInterventionPourVeilleBasse(etat, moment)
      : etat;
  const avertissement = avertie.colonie.avertissementDePerte!;
  if (
    avertissement.occasionDIntervention !== "offerte" ||
    avertie.colonie.statut === "perdue"
  ) {
    throw new Error("L’occasion d’intervention n’est plus disponible.");
  }
  if (intervention === "renforcer-sas") {
    return {
      ...avertie,
      colonie: {
        ...avertie.colonie,
        statut: "stable",
        pressions: ["afflux-deplaces"],
        techniciens: {
          ...avertie.colonie.techniciens,
          affectation: "renfort-des-sas",
        },
        avertissementDePerte: {
          ...avertissement,
          occasionDIntervention: "saisie",
        },
      },
    };
  }
  return {
    ...avertie,
    colonie: {
      ...avertie.colonie,
      pressions: ["filtres-satures"],
      avertissementDePerte: {
        ...avertissement,
        occasionDIntervention: "saisie",
      },
    },
    hospiceDuSillon: {
      ...avertie.hospiceDuSillon,
      devenir: "renforce",
    },
  };
}

export function revelerLesRegistresDuReflux(
  etat: EtatDeVeilleBasse,
  decision: DecisionSurLesArchives,
): EtatDeVeilleBasse {
  void decision;
  const revelation = "reseau-ancien.deplacement-vers-peripheries" as const;
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      archives: {
        etat: "ouvertes",
        revelationEssentielle: revelation,
      },
      techniciens: {
        ...etat.colonie.techniciens,
        affectation: "lecture-des-archives",
      },
    },
    revelationsEssentielles: etat.revelationsEssentielles.includes(
      revelation,
    )
      ? etat.revelationsEssentielles
      : [...etat.revelationsEssentielles, revelation],
  };
}

export function deciderPourMaelys(
  etat: EtatDeVeilleBasse,
  decision: DecisionPourMaelys,
  moment: number,
): EtatDeVeilleBasse {
  if (etat.maelysRive.decision !== null) {
    throw new Error("L’histoire de Maëlys Rive a déjà été tranchée.");
  }
  const confierLeCoffret = decision === "confier-coffret";
  const consequence: ConsequenceDiffereeDeVeilleBasse = confierLeCoffret
    ? {
        id: "veille-basse.maelys-termine-le-releve",
        cause: "veille-basse.maelys-mission-confiee",
        programmeeA: moment,
        jalonPrevuA: moment + DELAI_DU_RELEVE_RAPIDE,
        manifesteeA: null,
        statut: "attendue",
      }
    : {
        id: "veille-basse.equipes-terminent-le-releve",
        cause: "veille-basse.maelys-equipes-prioritaires",
        programmeeA: moment,
        jalonPrevuA: moment + DELAI_DU_RELEVE_LENT,
        manifesteeA: null,
        statut: "attendue",
      };
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      techniciens: {
        equipesDisponibles:
          etat.colonie.techniciens.equipesDisponibles -
          (confierLeCoffret ? 1 : 0),
        affectation: confierLeCoffret
          ? "lecture-des-archives"
          : "maintien-des-filtres",
      },
    },
    maelysRive: {
      decision: confierLeCoffret
        ? "coffret-confie"
        : "equipes-prioritaires",
      position: confierLeCoffret
        ? "hospice-du-sillon"
        : "veille-basse",
      releveDeLHospice: confierLeCoffret
        ? "rapide-en-cours"
        : "lent-en-cours",
    },
    consequencesDifferees: [...etat.consequencesDifferees, consequence],
  };
}

export function laisserPasserLOccasionDIntervenir(
  etat: EtatDeVeilleBasse,
  moment: number,
): EtatDeVeilleBasse {
  const avertissement = etat.colonie.avertissementDePerte;
  if (
    avertissement === null ||
    avertissement.occasionDIntervention !== "offerte" ||
    moment < avertissement.avertiA
  ) {
    throw new Error("Aucune occasion d’intervention ne peut être ignorée.");
  }
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      avertissementDePerte: {
        ...avertissement,
        occasionDIntervention: "ignoree",
      },
    },
    consequencesDifferees: [
      ...etat.consequencesDifferees,
      {
        id: "veille-basse.perte-apres-intervention-refusee",
        cause: "veille-basse.intervention-refusee",
        programmeeA: moment,
        jalonPrevuA: moment + DELAI_AVANT_PERTE,
        manifesteeA: null,
        statut: "attendue",
      },
    ],
  };
}

export function perdreVeilleBasse(
  etat: EtatDeVeilleBasse,
  moment: number,
): EtatDeVeilleBasse {
  const avertissement = etat.colonie.avertissementDePerte;
  if (avertissement === null) {
    throw new Error(
      "Veille-Basse doit être avertie avant de pouvoir devenir perdue.",
    );
  }
  if (
    avertissement.occasionDIntervention !== "ignoree" ||
    moment <= avertissement.avertiA
  ) {
    throw new Error(
      "L’occasion d’intervention doit avoir été offerte puis ignorée.",
    );
  }
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      statut: "perdue",
    },
  };
}

function integrerLaCohorte(
  etat: EtatDeVeilleBasse,
  moment: number,
): TransitionDeVeilleBasse {
  return {
    etat: {
      ...etat,
      cohorte: {
        ...etat.cohorte,
        integration: {
          statut: "equipes-integrees",
          chargeDAccueil: null,
          equipesIntegrees: 2,
        },
      },
    },
    evenements: [
      {
        type: "cohorte.integration-terminee",
        cohorteId: "cohorte-du-sillon",
        equipesCreees: 2,
        cause: "veille-basse.la-place-sous-le-phare",
        moment,
      },
    ],
  };
}

function manifesterConsequence(
  etat: EtatDeVeilleBasse,
  consequence: ConsequenceDiffereeDeVeilleBasse,
  moment: number,
): EtatDeVeilleBasse {
  if (consequence.id === "veille-basse.hospice-accueille-la-cohorte") {
    return {
      ...etat,
      hospiceDuSillon: {
        ...etat.hospiceDuSillon,
        devenir: "sous-charge",
      },
    };
  }
  if (
    consequence.id === "veille-basse.cohorte-refusee-revient-aux-portes"
  ) {
    return menacerVeilleBasse(etat, consequence.id, moment);
  }
  if (
    consequence.id === "veille-basse.perte-apres-intervention-refusee"
  ) {
    return perdreVeilleBasse(etat, moment);
  }
  return {
    ...etat,
    colonie: {
      ...etat.colonie,
      techniciens: {
        ...etat.colonie.techniciens,
        equipesDisponibles:
          etat.colonie.techniciens.equipesDisponibles +
          (consequence.id === "veille-basse.maelys-termine-le-releve"
            ? 1
            : 0),
      },
    },
    maelysRive: {
      ...etat.maelysRive,
      position: "veille-basse",
      releveDeLHospice: "termine",
    },
  };
}

export function traiterEcheancesDeVeilleBasse(
  etat: EtatDeVeilleBasse,
  secondeInitiale: number,
  secondeFinale: number,
): TransitionDeVeilleBasse {
  let nouvelEtat = etat;
  const evenements: EvenementDeVeilleBasse[] = [];
  const charge = nouvelEtat.cohorte.integration.chargeDAccueil;
  if (
    charge !== null &&
    charge.integrationPrevueA > secondeInitiale &&
    charge.integrationPrevueA <= secondeFinale
  ) {
    const integration = integrerLaCohorte(
      nouvelEtat,
      charge.integrationPrevueA,
    );
    nouvelEtat = integration.etat;
    evenements.push(...integration.evenements);
  }

  const jalonsLocaux = [
    ...new Set(
      nouvelEtat.consequencesDifferees
        .filter(
          (consequence) =>
            consequence.statut === "attendue" &&
            consequence.jalonPrevuA > secondeInitiale &&
            consequence.jalonPrevuA <= secondeFinale,
        )
        .map((consequence) => consequence.jalonPrevuA),
    ),
  ].sort((gauche, droite) => gauche - droite);
  for (const momentDuJalon of jalonsLocaux) {
    const jalon = franchirJalonDeVeilleBasse(
      nouvelEtat,
      momentDuJalon,
    );
    nouvelEtat = jalon.etat;
    evenements.push(...jalon.evenements);
  }

  return { etat: nouvelEtat, evenements };
}

export function franchirJalonDeVeilleBasse(
  etat: EtatDeVeilleBasse,
  moment: number,
): TransitionDeVeilleBasse {
  let nouvelEtat = etat;
  const evenements: EvenementDeVeilleBasse[] = [];
  for (const consequence of etat.consequencesDifferees) {
    if (
      consequence.statut !== "attendue" ||
      consequence.jalonPrevuA !== moment
    ) {
      continue;
    }
    nouvelEtat = manifesterConsequence(nouvelEtat, consequence, moment);
    nouvelEtat = {
      ...nouvelEtat,
      consequencesDifferees: nouvelEtat.consequencesDifferees.map(
        (candidate) =>
          candidate.id === consequence.id
            ? {
                ...candidate,
                manifesteeA: moment,
                statut: "manifestee",
              }
            : candidate,
      ),
    };
    evenements.push(
      {
        type: "jalon-du-monde.atteint",
        jalonId: `jalon-veille-basse-${consequence.id}`,
        cause: consequence.cause,
        moment,
      },
      {
        type: "consequence-differee.manifestee",
        consequenceId: consequence.id,
        cause: consequence.cause,
        moment,
      },
    );
  }
  return { etat: nouvelEtat, evenements };
}

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return (
    valeur !== null &&
    typeof valeur === "object" &&
    !Array.isArray(valeur)
  );
}

const PRESSIONS = new Set<PressionDeVeilleBasse>([
  "afflux-deplaces",
  "filtres-satures",
  "cohorte-aux-portes",
]);
const STATUTS_DE_COLONIE = new Set<StatutDeColonie>([
  "prospere",
  "stable",
  "fragile",
  "perdue",
]);
const OFFRES_DU_MARCHE = new Set<IdentifiantOffreDeVeilleBasse>([
  "filtres-contre-releve",
  "renfort-contre-materiaux",
]);

function estCausaliteDeVeilleBasseRespectee(
  etat: EtatDeVeilleBasse,
  secondeCourante: number,
  faitsDeCampagne: readonly {
    readonly id: string;
    readonly moment: number;
  }[],
): boolean {
  const fait = (id: string) =>
    faitsDeCampagne.find((candidate) => candidate.id === id);
  const consequence = (id: ConsequenceDiffereeDeVeilleBasse["id"]) =>
    etat.consequencesDifferees.find((candidate) => candidate.id === id);
  const consequenceEstCauseePar = (
    consequenceTrouvee: ConsequenceDiffereeDeVeilleBasse | undefined,
    faitCausal: { readonly id: string; readonly moment: number } | undefined,
    cause: ConsequenceDiffereeDeVeilleBasse["cause"],
    delai: number,
  ) =>
    consequenceTrouvee !== undefined &&
    faitCausal !== undefined &&
    consequenceTrouvee.cause === cause &&
    consequenceTrouvee.programmeeA === faitCausal.moment &&
    consequenceTrouvee.jalonPrevuA === faitCausal.moment + delai;

  const faitsDeDecisionDeCohorte = [
    "veille-basse.cohorte-accueillie",
    "veille-basse.cohorte-refusee",
    "veille-basse.cohorte-redirigee",
  ].map(fait).filter((candidate) => candidate !== undefined);
  if (faitsDeDecisionDeCohorte.length > 1) {
    return false;
  }

  const cohorte = etat.cohorte;
  const faitAccueil = fait("veille-basse.cohorte-accueillie");
  const faitRefus = fait("veille-basse.cohorte-refusee");
  const faitRedirection = fait("veille-basse.cohorte-redirigee");
  const consequenceDuRefus = consequence(
    "veille-basse.cohorte-refusee-revient-aux-portes",
  );
  const consequenceDeRedirection = consequence(
    "veille-basse.hospice-accueille-la-cohorte",
  );
  if (cohorte.memoire === "aucune") {
    if (
      faitsDeDecisionDeCohorte.length !== 0 ||
      cohorte.destination !== "veille-basse" ||
      cohorte.integration.statut !== "en-attente" ||
      consequenceDuRefus !== undefined ||
      consequenceDeRedirection !== undefined
    ) {
      return false;
    }
  } else if (cohorte.memoire === "aidee") {
    const integrationPrevueA =
      faitAccueil === undefined
        ? -1
        : faitAccueil.moment + DELAI_D_INTEGRATION;
    if (
      faitAccueil === undefined ||
      cohorte.destination !== "cite-caravane" ||
      !["charge-accueil", "equipes-integrees"].includes(
        cohorte.integration.statut,
      ) ||
      consequenceDuRefus !== undefined ||
      consequenceDeRedirection !== undefined ||
      (cohorte.integration.statut === "charge-accueil" &&
        (cohorte.integration.chargeDAccueil?.commenceA !==
          faitAccueil.moment ||
          cohorte.integration.chargeDAccueil.integrationPrevueA !==
            integrationPrevueA)) ||
      (cohorte.integration.statut === "equipes-integrees" &&
        integrationPrevueA > secondeCourante)
    ) {
      return false;
    }
  } else if (cohorte.memoire === "refusee") {
    if (
      faitRefus === undefined ||
      cohorte.destination !== "hors-de-veille-basse" ||
      cohorte.integration.statut !== "refusee" ||
      !consequenceEstCauseePar(
        consequenceDuRefus,
        faitRefus,
        "veille-basse.cohorte-refusee",
        DELAI_DE_CONSEQUENCE_DE_COHORTE,
      ) ||
      consequenceDeRedirection !== undefined
    ) {
      return false;
    }
  } else if (
    faitRedirection === undefined ||
    cohorte.destination !== "hospice-du-sillon" ||
    cohorte.integration.statut !== "redirigee" ||
    !consequenceEstCauseePar(
      consequenceDeRedirection,
      faitRedirection,
      "veille-basse.cohorte-redirigee",
      DELAI_DE_CONSEQUENCE_DE_COHORTE,
    ) ||
    consequenceDuRefus !== undefined
  ) {
    return false;
  }

  const faitSas = fait("veille-basse.sas-renforce");
  const faitHospice = fait("veille-basse.hospice-ouvert");
  const faitInterventionRefusee = fait(
    "veille-basse.intervention-refusee",
  );
  const decisionsDIntervention = [
    faitSas,
    faitHospice,
    faitInterventionRefusee,
  ].filter((candidate) => candidate !== undefined);
  if (decisionsDIntervention.length > 1) {
    return false;
  }
  const momentDeLOccasion =
    cohorte.memoire === "aidee" &&
    cohorte.integration.statut === "equipes-integrees" &&
    faitAccueil !== undefined
      ? faitAccueil.moment + DELAI_D_INTEGRATION
      : cohorte.memoire === "refusee" &&
          consequenceDuRefus?.statut === "manifestee"
        ? consequenceDuRefus.manifesteeA
        : cohorte.memoire === "redirigee" &&
            consequenceDeRedirection?.statut === "manifestee"
          ? consequenceDeRedirection.manifesteeA
          : null;
  const avertissement = etat.colonie.avertissementDePerte;
  const causeDeLOccasion =
    cohorte.memoire === "refusee"
      ? "veille-basse.cohorte-refusee-revient-aux-portes"
      : "veille-basse.la-porte-des-filtres";
  if (
    (momentDeLOccasion === null && avertissement !== null) ||
    (momentDeLOccasion !== null &&
      (avertissement === null ||
        avertissement.avertiA !== momentDeLOccasion ||
        avertissement.cause !== causeDeLOccasion)) ||
    (decisionsDIntervention.length === 0 &&
      momentDeLOccasion !== null &&
      avertissement?.occasionDIntervention !== "offerte")
  ) {
    return false;
  }
  const momentDeDecision = decisionsDIntervention[0]?.moment;
  if (
    momentDeDecision !== undefined &&
    (momentDeLOccasion === null ||
      momentDeDecision < momentDeLOccasion ||
      (faitInterventionRefusee === undefined
        ? avertissement?.occasionDIntervention !== "saisie"
        : avertissement?.occasionDIntervention !== "ignoree"))
  ) {
    return false;
  }
  const consequenceDePerte = consequence(
    "veille-basse.perte-apres-intervention-refusee",
  );
  if (
    faitInterventionRefusee === undefined
      ? consequenceDePerte !== undefined
      : !consequenceEstCauseePar(
          consequenceDePerte,
          faitInterventionRefusee,
          "veille-basse.intervention-refusee",
          DELAI_AVANT_PERTE,
        )
  ) {
    return false;
  }
  const perteManifestee = consequenceDePerte?.statut === "manifestee";
  const sasRenforce = faitSas !== undefined;
  const hospiceOuvert = faitHospice !== undefined;
  if (
    perteManifestee
      ? etat.colonie.statut !== "perdue"
      : etat.colonie.statut === "perdue" ||
        ((sasRenforce &&
      (etat.colonie.statut !== "stable" ||
        etat.colonie.pressions.join("|") !== "afflux-deplaces")) ||
      (hospiceOuvert &&
        (etat.colonie.statut !== "fragile" ||
          etat.colonie.pressions.join("|") !== "filtres-satures")))
  ) {
    return false;
  }
  if (
    !perteManifestee &&
    !(sasRenforce || hospiceOuvert) &&
    (etat.colonie.statut !== "fragile" ||
      etat.colonie.pressions.join("|") !==
        (consequenceDuRefus?.statut === "manifestee"
          ? "cohorte-aux-portes|filtres-satures"
          : "afflux-deplaces|filtres-satures"))
  ) {
    return false;
  }
  const redirectionManifestee =
    consequenceDeRedirection?.statut === "manifestee";
  if (
    (etat.hospiceDuSillon.devenir === "sous-charge") !==
      (redirectionManifestee && !hospiceOuvert) ||
    (etat.hospiceDuSillon.devenir === "renforce") !== hospiceOuvert
  ) {
    return false;
  }

  const revelationCopiee = fait("veille-basse.registres-copies") !== undefined;
  const revelationLaissee =
    fait("veille-basse.registres-laisses") !== undefined;
  if (
    revelationCopiee === revelationLaissee &&
    etat.colonie.archives.etat === "ouvertes"
  ) {
    return false;
  }
  if (
    etat.colonie.archives.etat === "ouvertes" &&
    !(revelationCopiee || revelationLaissee)
  ) {
    return false;
  }
  if (
    etat.colonie.archives.etat === "scellees" &&
    (revelationCopiee || revelationLaissee)
  ) {
    return false;
  }
  const affectationAttendue =
    etat.maelysRive.decision === "equipes-prioritaires"
      ? "maintien-des-filtres"
      : revelationCopiee || revelationLaissee
        ? "lecture-des-archives"
        : sasRenforce
          ? "renfort-des-sas"
          : "maintien-des-filtres";
  if (etat.colonie.techniciens.affectation !== affectationAttendue) {
    return false;
  }

  const faitMission = fait("veille-basse.maelys-mission-confiee");
  const faitEquipes = fait(
    "veille-basse.maelys-equipes-prioritaires",
  );
  const missionConfiee = faitMission !== undefined;
  const equipesPrioritaires = faitEquipes !== undefined;
  if (missionConfiee && equipesPrioritaires) {
    return false;
  }
  const consequenceDeMaelys = consequence(
    "veille-basse.maelys-termine-le-releve",
  );
  const consequenceDesEquipes = consequence(
    "veille-basse.equipes-terminent-le-releve",
  );
  if (!missionConfiee && !equipesPrioritaires) {
    return (
      etat.maelysRive.decision === null &&
      etat.maelysRive.position === "veille-basse" &&
      etat.maelysRive.releveDeLHospice === "non-planifie" &&
      consequenceDeMaelys === undefined &&
      consequenceDesEquipes === undefined &&
      etat.colonie.techniciens.equipesDisponibles === 2
    );
  }
  if (missionConfiee) {
    const terminee = consequenceDeMaelys?.statut === "manifestee";
    return (
      etat.maelysRive.decision === "coffret-confie" &&
      etat.maelysRive.position ===
        (terminee ? "veille-basse" : "hospice-du-sillon") &&
      etat.maelysRive.releveDeLHospice ===
        (terminee ? "termine" : "rapide-en-cours") &&
      consequenceEstCauseePar(
        consequenceDeMaelys,
        faitMission,
        "veille-basse.maelys-mission-confiee",
        DELAI_DU_RELEVE_RAPIDE,
      ) &&
      consequenceDesEquipes === undefined &&
      etat.colonie.techniciens.equipesDisponibles === (terminee ? 2 : 1)
    );
  }
  const terminee = consequenceDesEquipes?.statut === "manifestee";
  return (
    etat.maelysRive.decision === "equipes-prioritaires" &&
    etat.maelysRive.position === "veille-basse" &&
    etat.maelysRive.releveDeLHospice ===
      (terminee ? "termine" : "lent-en-cours") &&
    consequenceEstCauseePar(
      consequenceDesEquipes,
      faitEquipes,
      "veille-basse.maelys-equipes-prioritaires",
      DELAI_DU_RELEVE_LENT,
    ) &&
    consequenceDeMaelys === undefined &&
    etat.colonie.techniciens.equipesDisponibles === 2
  );
}

export function estEtatDeVeilleBasse(
  valeur: unknown,
  secondeCourante: number,
  faitsDeCampagne: readonly {
    readonly id: string;
    readonly moment: number;
  }[],
): valeur is EtatDeVeilleBasse {
  if (!estObjet(valeur)) {
    return false;
  }
  const colonie = valeur.colonie;
  const hospice = valeur.hospiceDuSillon;
  const cohorte = valeur.cohorte;
  const maelys = valeur.maelysRive;
  const consequences = valeur.consequencesDifferees;
  const revelations = valeur.revelationsEssentielles;
  if (
    !estObjet(colonie) ||
    colonie.id !== "veille-basse" ||
    !STATUTS_DE_COLONIE.has(colonie.statut as StatutDeColonie) ||
    !Array.isArray(colonie.pressions) ||
    colonie.pressions.length > 2 ||
    new Set(colonie.pressions).size !== colonie.pressions.length ||
    !colonie.pressions.every((pression) =>
      PRESSIONS.has(pression as PressionDeVeilleBasse),
    ) ||
    !Array.isArray(colonie.marche) ||
    colonie.marche.length !== 2 ||
    !colonie.marche.every(
      (offre) =>
        estObjet(offre) &&
        OFFRES_DU_MARCHE.has(offre.id as IdentifiantOffreDeVeilleBasse) &&
        (offre.statut === "disponible" || offre.statut === "epuisee") &&
        typeof offre.cout === "string" &&
        typeof offre.gain === "string",
    ) ||
    new Set(
      colonie.marche.map((offre) => (estObjet(offre) ? offre.id : null)),
    ).size !== colonie.marche.length ||
    !estObjet(colonie.archives) ||
    !["scellees", "ouvertes"].includes(String(colonie.archives.etat)) ||
    ![
      null,
      "reseau-ancien.deplacement-vers-peripheries",
    ].includes(colonie.archives.revelationEssentielle as string | null) ||
    !estObjet(colonie.techniciens) ||
    !Number.isInteger(colonie.techniciens.equipesDisponibles) ||
    Number(colonie.techniciens.equipesDisponibles) < 0 ||
    ![
      "maintien-des-filtres",
      "renfort-des-sas",
      "lecture-des-archives",
    ].includes(String(colonie.techniciens.affectation)) ||
    !estObjet(hospice) ||
    hospice.id !== "hospice-du-sillon" ||
    hospice.besoin !== "places-filtrees" ||
    !["ouvert", "sous-charge", "renforce"].includes(
      String(hospice.devenir),
    ) ||
    !estObjet(cohorte) ||
    cohorte.id !== "cohorte-du-sillon" ||
    cohorte.origine !== "camp-des-digues" ||
    ![
      "veille-basse",
      "cite-caravane",
      "hospice-du-sillon",
      "hors-de-veille-basse",
    ].includes(String(cohorte.destination)) ||
    cohorte.taille !== 18 ||
    cohorte.etatDominant !== "epuisee" ||
    cohorte.specialite !== "charpente-etanche" ||
    !["aucune", "aidee", "refusee", "redirigee"].includes(
      String(cohorte.memoire),
    ) ||
    !estObjet(cohorte.integration) ||
    ![
      "en-attente",
      "charge-accueil",
      "equipes-integrees",
      "refusee",
      "redirigee",
    ].includes(String(cohorte.integration.statut)) ||
    !Number.isInteger(cohorte.integration.equipesIntegrees) ||
    Number(cohorte.integration.equipesIntegrees) < 0 ||
    !estObjet(maelys) ||
    ![
      null,
      "coffret-confie",
      "equipes-prioritaires",
    ].includes(maelys.decision as string | null) ||
    !["veille-basse", "hospice-du-sillon"].includes(
      String(maelys.position),
    ) ||
    ![
      "non-planifie",
      "rapide-en-cours",
      "lent-en-cours",
      "termine",
    ].includes(String(maelys.releveDeLHospice)) ||
    !Array.isArray(consequences) ||
    !Array.isArray(revelations) ||
    !revelations.every(
      (revelation) =>
        revelation === "reseau-ancien.deplacement-vers-peripheries",
    ) ||
    new Set(revelations).size !== revelations.length
  ) {
    return false;
  }

  const avertissement = colonie.avertissementDePerte;
  if (
    avertissement !== null &&
    (!estObjet(avertissement) ||
      ![
        "veille-basse.la-porte-des-filtres",
        "veille-basse.cohorte-refusee-revient-aux-portes",
      ].includes(String(avertissement.cause)) ||
      typeof avertissement.avertiA !== "number" ||
      !Number.isInteger(avertissement.avertiA) ||
      avertissement.avertiA < 0 ||
      avertissement.avertiA > secondeCourante ||
      !["offerte", "ignoree", "saisie"].includes(
        String(avertissement.occasionDIntervention),
      ))
  ) {
    return false;
  }
  if (
    colonie.statut === "perdue" &&
    (!estObjet(avertissement) ||
      avertissement.occasionDIntervention !== "ignoree")
  ) {
    return false;
  }

  const charge = cohorte.integration.chargeDAccueil;
  if (cohorte.integration.statut === "charge-accueil") {
    if (
      !estObjet(charge) ||
      charge.habitants !== 18 ||
      !Number.isInteger(charge.commenceA) ||
      !Number.isInteger(charge.integrationPrevueA) ||
      Number(charge.commenceA) < 0 ||
      Number(charge.commenceA) > secondeCourante ||
      Number(charge.integrationPrevueA) <= Number(charge.commenceA) ||
      Number(charge.integrationPrevueA) <= secondeCourante ||
      charge.cause !== "veille-basse.la-place-sous-le-phare"
    ) {
      return false;
    }
  } else if (charge !== null) {
    return false;
  }
  if (
    (cohorte.integration.statut === "equipes-integrees"
      ? cohorte.integration.equipesIntegrees !== 2
      : cohorte.integration.equipesIntegrees !== 0)
  ) {
    return false;
  }

  if (
    !consequences.every(
      (consequence) =>
        estObjet(consequence) &&
        [
          "veille-basse.cohorte-refusee-revient-aux-portes",
          "veille-basse.hospice-accueille-la-cohorte",
          "veille-basse.maelys-termine-le-releve",
          "veille-basse.equipes-terminent-le-releve",
          "veille-basse.perte-apres-intervention-refusee",
        ].includes(String(consequence.id)) &&
        [
          "veille-basse.cohorte-refusee",
          "veille-basse.cohorte-redirigee",
          "veille-basse.maelys-mission-confiee",
          "veille-basse.maelys-equipes-prioritaires",
          "veille-basse.intervention-refusee",
        ].includes(String(consequence.cause)) &&
        Number.isInteger(consequence.programmeeA) &&
        Number(consequence.programmeeA) >= 0 &&
        Number(consequence.programmeeA) <= secondeCourante &&
        Number.isInteger(consequence.jalonPrevuA) &&
        Number(consequence.jalonPrevuA) > Number(consequence.programmeeA) &&
        (consequence.statut === "attendue" ||
          consequence.statut === "manifestee") &&
        (consequence.statut === "attendue"
          ? consequence.manifesteeA === null &&
            Number(consequence.jalonPrevuA) > secondeCourante
          : Number.isInteger(consequence.manifesteeA) &&
            Number(consequence.manifesteeA) ===
              Number(consequence.jalonPrevuA) &&
            Number(consequence.manifesteeA) <= secondeCourante),
    ) ||
    new Set(
      consequences.map((consequence) =>
        estObjet(consequence) ? consequence.id : null,
      ),
    ).size !== consequences.length
  ) {
    return false;
  }

  const revelationPresente = revelations.includes(
    "reseau-ancien.deplacement-vers-peripheries",
  );
  if (
    revelationPresente !==
      (colonie.archives.revelationEssentielle ===
        "reseau-ancien.deplacement-vers-peripheries") ||
    (colonie.archives.etat === "ouvertes") !== revelationPresente
  ) {
    return false;
  }

  return estCausaliteDeVeilleBasseRespectee(
    valeur as unknown as EtatDeVeilleBasse,
    secondeCourante,
    faitsDeCampagne,
  );
}
