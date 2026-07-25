import type { Langue } from "./types";

type DictionnaireDeTextes = Readonly<Record<string, string>>;

export interface TextesDeCriseDeVeilleBasse {
  readonly alerteTitre: string;
  readonly alerteCause: string;
  readonly titre: string;
  readonly cause: string;
  readonly chaine: readonly string[];
  readonly maillons?: DictionnaireDeTextes;
  readonly reponses: Readonly<
    Record<
      string,
      {
        readonly intention: string;
        readonly coutConnu: string;
        readonly consequence: string;
        readonly mitigation: string;
        readonly pireConsequence: string;
        readonly attribution: string;
      }
    >
  >;
  readonly cicatrices: DictionnaireDeTextes;
  readonly consequencesCicatrices: DictionnaireDeTextes;
  readonly causes: DictionnaireDeTextes;
  readonly garanties: DictionnaireDeTextes;
  readonly destinations?: DictionnaireDeTextes;
  readonly conditionsRecuperation: DictionnaireDeTextes;
}

export interface TextesDeHautPuits {
  readonly titre: string;
  readonly colonie: string;
  readonly statut: string;
  readonly devenir: string;
  readonly pressions: string;
  readonly relation: string;
  readonly engagements: string;
  readonly projets: string;
  readonly projetChoisi: string;
  readonly aucunEngagement: string;
  readonly aucunProjetChoisi: string;
  readonly marche: string;
  readonly echanger: string;
  readonly epuisee: string;
  readonly echangesRestants: string;
  readonly negociation: string;
  readonly tranchee: string;
  readonly instruction: string;
  readonly statuts: DictionnaireDeTextes;
  readonly devenirs: DictionnaireDeTextes;
  readonly pressionsLocales: DictionnaireDeTextes;
  readonly relations: DictionnaireDeTextes;
  readonly besoins: DictionnaireDeTextes;
  readonly stocks: DictionnaireDeTextes;
  readonly projetsPossibles: DictionnaireDeTextes;
  readonly projetsChoisis: DictionnaireDeTextes;
  readonly decisions: Readonly<
    Record<
      string,
      {
        readonly libelle: string;
        readonly consequence: string;
      }
    >
  >;
  readonly engagement: string;
}

export interface TextesDeVeilleBasse {
  readonly crise: TextesDeCriseDeVeilleBasse;
  readonly titre: string;
  readonly veilleBasse: string;
  readonly typeColonie: string;
  readonly statuts: DictionnaireDeTextes;
  readonly pressions: DictionnaireDeTextes;
  readonly marche: DictionnaireDeTextes;
  readonly archives: DictionnaireDeTextes;
  readonly affectations: DictionnaireDeTextes;
  readonly equipes: string;
  readonly avertissement: string;
  readonly hospice: string;
  readonly typeHospice: string;
  readonly besoin: string;
  readonly devenirs: DictionnaireDeTextes;
  readonly cohorte: string;
  readonly destinations: DictionnaireDeTextes;
  readonly origine: string;
  readonly personnes: string;
  readonly etatDominant: string;
  readonly specialite: string;
  readonly memoires: DictionnaireDeTextes;
  readonly integrations: DictionnaireDeTextes;
  readonly revelation: string;
  readonly maelys: string;
  readonly decisionsDeMaelys: DictionnaireDeTextes;
  readonly positionsDeMaelys: DictionnaireDeTextes;
  readonly relevesDeMaelys: DictionnaireDeTextes;
  readonly libellePressions: string;
  readonly libelleMarche: string;
  readonly libelleDevenir: string;
  readonly libelleOrigine: string;
  readonly libelleDestination: string;
  readonly libelleTaille: string;
  readonly libelleEtatDominant: string;
  readonly libelleSpecialite: string;
  readonly libelleMemoire: string;
  readonly libelleIntegration: string;
  readonly libelleDecision: string;
  readonly libellePosition: string;
  readonly libelleReleve: string;
  readonly libelleRevelation: string;
}

export interface TextesDeTrameDeFer {
  readonly crise: TextesDeCriseDeVeilleBasse;
  readonly titre: string;
  readonly statuts: DictionnaireDeTextes;
  readonly relations: DictionnaireDeTextes;
  readonly eau: DictionnaireDeTextes;
  readonly requisitions: DictionnaireDeTextes;
  readonly engagements: DictionnaireDeTextes;
  readonly voies: DictionnaireDeTextes;
  readonly servicesLourdsRestants: string;
  readonly reserveDeRefroidissementRestante: string;
  readonly occasionTrainOutil: string;
  readonly occasionAttelageFedere: string;
  readonly libelles: {
    readonly eyebrow: string;
    readonly republique: string;
    readonly pressions: string;
    readonly marche: string;
    readonly engagements: string;
    readonly aucunEngagement: string;
    readonly piece: string;
    readonly voieAOuvrir: string;
  };
}

export interface TextesDeTraverseLibre {
  readonly titre: string;
  readonly statuts: DictionnaireDeTextes;
  readonly relationsPuits: DictionnaireDeTextes;
  readonly relationsRepublique: DictionnaireDeTextes;
  readonly filtres: DictionnaireDeTextes;
  readonly isolement: DictionnaireDeTextes;
  readonly contournements: DictionnaireDeTextes;
  readonly routes: DictionnaireDeTextes;
  readonly aides: DictionnaireDeTextes;
  readonly dependances: DictionnaireDeTextes;
  readonly lotsDeFiltres: string;
  readonly lotsDeRemedes: string;
  readonly reservesDEau: string;
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

export interface TextesDeConvergenceDeLaTrame {
  readonly titres: {
    readonly marche: string;
    readonly signal: string;
  };
  readonly offresOfficielles: DictionnaireDeTextes;
  readonly offresClandestines: DictionnaireDeTextes;
  readonly interfaces: DictionnaireDeTextes;
  readonly traces: DictionnaireDeTextes;
  readonly echosDeGrandAiguillage: DictionnaireDeTextes;
  readonly echosDeTraverseLibre: DictionnaireDeTextes;
  readonly optionsDuClimax: DictionnaireDeTextes;
  readonly libelles: {
    readonly eyebrowMarche: string;
    readonly eyebrowSignal: string;
    readonly offreOfficielle: string;
    readonly offreClandestine: string;
    readonly interface: string;
    readonly trace: string;
    readonly echoGrandAiguillage: string;
    readonly echoTraverseLibre: string;
    readonly options: string;
  };
}

export interface TextesDeLAiguillageZero {
  readonly titre: string;
  readonly eyebrow: string;
  readonly solutions: DictionnaireDeTextes;
  readonly nomsDesSites: DictionnaireDeTextes;
  readonly devenirsDeSites: DictionnaireDeTextes;
  readonly formats: {
    readonly grandAiguillage: string;
    readonly traverseLibre: string;
    readonly sites: string;
    readonly routesOuvertes: string;
    readonly routesFermees: string;
    readonly relations: string;
    readonly echoPlanifie: string;
    readonly echoAConsigner: string;
    readonly detteTransport: string;
  };
  readonly soupcons: DictionnaireDeTextes;
  readonly aucunEngagement: string;
  readonly libelles: DictionnaireDeTextes;
  readonly couts: DictionnaireDeTextes;
}

export interface TextesDesApprochesDeLaCouronne {
  readonly crise?: TextesDeCriseDeVeilleBasse;
  readonly titre: string;
  readonly eyebrow: string;
  readonly besoins: DictionnaireDeTextes;
  readonly interactions: DictionnaireDeTextes;
  readonly devenirs: DictionnaireDeTextes;
  readonly delegations: DictionnaireDeTextes;
  readonly diagnostics: DictionnaireDeTextes;
  readonly projets: DictionnaireDeTextes;
  readonly statutsDePreparation: DictionnaireDeTextes;
  readonly gardesDesPlans: DictionnaireDeTextes;
  readonly formats: {
    readonly site: string;
    readonly delegations: string;
    readonly preparatif: string;
  };
  readonly libelles: DictionnaireDeTextes;
}

export interface TextesDeLaVoieDesColonies {
  readonly titre: string;
  readonly eyebrow: string;
  readonly besoins: DictionnaireDeTextes;
  readonly interactions: DictionnaireDeTextes;
  readonly devenirs: DictionnaireDeTextes;
  readonly retours: DictionnaireDeTextes;
  readonly cohortes: DictionnaireDeTextes;
  readonly voies: DictionnaireDeTextes;
  readonly booleens: DictionnaireDeTextes;
  readonly statutsDuSeuil: DictionnaireDeTextes;
  readonly pressions: DictionnaireDeTextes;
  readonly marches: DictionnaireDeTextes;
  readonly abris: DictionnaireDeTextes;
  readonly releves: DictionnaireDeTextes;
  readonly revendications: DictionnaireDeTextes;
  readonly acces: DictionnaireDeTextes;
  readonly gardes: DictionnaireDeTextes;
  readonly formats: {
    readonly serres: string;
    readonly retour: string;
    readonly credibilite: string;
    readonly seuil: string;
  };
  readonly nomsDesColonies: DictionnaireDeTextes;
  readonly libelles: DictionnaireDeTextes;
}

export interface TextesDeLOuvertureDeLaCouronne {
  readonly titre: string;
  readonly eyebrow: string;
  readonly nomsDesOuvertures: DictionnaireDeTextes;
  readonly statutsDesOuvertures: DictionnaireDeTextes;
  readonly acteurs: DictionnaireDeTextes;
  readonly couts: DictionnaireDeTextes;
  readonly projets: DictionnaireDeTextes;
  readonly diagnostics: DictionnaireDeTextes;
  readonly preparations: DictionnaireDeTextes;
  readonly reductions: DictionnaireDeTextes;
  readonly delegations: DictionnaireDeTextes;
  readonly ouverturesChoisies: DictionnaireDeTextes;
  readonly noeud: DictionnaireDeTextes;
  readonly solutions: DictionnaireDeTextes;
  readonly statutsDesSolutions: DictionnaireDeTextes;
  readonly gardes: DictionnaireDeTextes;
  readonly formats: {
    readonly ouverture: string;
    readonly projet: string;
    readonly conseil: string;
    readonly solution: string;
  };
  readonly libelles: DictionnaireDeTextes;
}

export interface TextesDuContratFinal {
  readonly titre: string;
  readonly eyebrow: string;
  readonly solutions: DictionnaireDeTextes;
  readonly statuts: DictionnaireDeTextes;
  readonly disponibilites: DictionnaireDeTextes;
  readonly causes: DictionnaireDeTextes;
  readonly ressources: DictionnaireDeTextes;
  readonly selections: DictionnaireDeTextes;
  readonly variantes: DictionnaireDeTextes;
  readonly stabilites: DictionnaireDeTextes;
  readonly controles: DictionnaireDeTextes;
  readonly sortsDuCoeur: DictionnaireDeTextes;
  readonly coutsHumains: DictionnaireDeTextes;
  readonly aucunBilan: string;
  readonly formats: {
    readonly solution: string;
    readonly cout: string;
    readonly bilan: string;
  };
  readonly libelles: DictionnaireDeTextes;
}

export interface TextesDeLEpilogue {
  readonly titre: string;
  readonly eyebrow: string;
  readonly introduction: string;
  readonly revelation: string;
  readonly libelles: DictionnaireDeTextes;
  readonly axes: DictionnaireDeTextes;
  readonly noms: DictionnaireDeTextes;
  readonly statutsDeCompagnons: DictionnaireDeTextes;
  readonly etats: DictionnaireDeTextes;
  readonly liens: DictionnaireDeTextes;
  readonly rancunes: DictionnaireDeTextes;
  readonly reparations: DictionnaireDeTextes;
  readonly causesDEtat: string;
  readonly aucun: string;
}

export interface PresentationsPremium {
  readonly hautPuits: Readonly<Record<Langue, TextesDeHautPuits>>;
  readonly veilleBasse: Readonly<Record<Langue, TextesDeVeilleBasse>>;
  readonly trame?: Readonly<Record<Langue, TextesDeTrameDeFer>>;
  readonly traverse?: Readonly<Record<Langue, TextesDeTraverseLibre>>;
  readonly convergence?: Readonly<
    Record<Langue, TextesDeConvergenceDeLaTrame>
  >;
  readonly aiguillage?: Readonly<
    Record<Langue, TextesDeLAiguillageZero>
  >;
  readonly couronne?: Readonly<
    Record<Langue, TextesDesApprochesDeLaCouronne>
  >;
  readonly voieColonies?: Readonly<
    Record<Langue, TextesDeLaVoieDesColonies>
  >;
  readonly ouvertureCouronne?: Readonly<
    Record<Langue, TextesDeLOuvertureDeLaCouronne>
  >;
  readonly finale?: Readonly<Record<Langue, TextesDuContratFinal>>;
  readonly epilogue?: Readonly<Record<Langue, TextesDeLEpilogue>>;
  readonly deversoir?: Readonly<
    Record<
      Langue,
      {
        readonly nomsDesLieux: DictionnaireDeTextes;
        readonly lieuxTraverses: string;
        readonly lieuxNonRejoints: string;
        readonly aucunLieu: string;
        readonly etatDesColonies: string;
        readonly occasions: string;
        readonly ligneZeroEmportee: string;
        readonly ligneZeroNonEmportee: string;
        readonly projetNonRetenu: string;
        readonly projets: DictionnaireDeTextes;
        readonly statutsDeProjet: DictionnaireDeTextes;
        readonly statutsDeColonie: DictionnaireDeTextes;
        readonly devenirsDeHautPuits: DictionnaireDeTextes;
        readonly devenirsDeHospice: DictionnaireDeTextes;
        readonly destinationsDeCohorte: DictionnaireDeTextes;
        readonly etatsDArchives: DictionnaireDeTextes;
        readonly nomDePlateforme: string;
        readonly servicesDeProjet: DictionnaireDeTextes;
        readonly contraintesDeProjet: DictionnaireDeTextes;
        readonly devenirsDeSites: DictionnaireDeTextes;
      }
    >
  >;
}

let presentationsInstallees: PresentationsPremium | null = null;

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

function estArbreDeTextes(valeur: unknown): boolean {
  if (typeof valeur === "string") {
    return valeur.length > 0;
  }
  return (
    estObjet(valeur) &&
    Object.keys(valeur).length > 0 &&
    Object.values(valeur).every(estArbreDeTextes)
  );
}

function estDictionnaireAvecCles(
  valeur: unknown,
  cles: readonly string[],
): boolean {
  return (
    estObjet(valeur) &&
    cles.every(
      (cle) =>
        typeof valeur[cle] === "string" &&
        (valeur[cle] as string).length > 0,
    )
  );
}

function estPresentationDeCriseDeVeilleBasse(
  valeur: unknown,
): boolean {
  if (
    !estObjet(valeur) ||
    !["alerteTitre", "alerteCause", "titre", "cause"].every(
      (champ) =>
        typeof valeur[champ] === "string" &&
        (valeur[champ] as string).length > 0,
    ) ||
    !Array.isArray(valeur.chaine) ||
    valeur.chaine.length !== 3 ||
    !valeur.chaine.every(
      (maillon) => typeof maillon === "string" && maillon.length > 0,
    ) ||
    !estObjet(valeur.reponses)
  ) {
    return false;
  }
  const champsDeReponse = [
    "intention",
    "coutConnu",
    "consequence",
    "mitigation",
    "pireConsequence",
    "attribution",
  ] as const;
  const reponses = valeur.reponses as Record<string, unknown>;
  if (
    !["partager-reserves-cohorte", "renforcer-accueil"].every(
      (id) =>
        estObjet(reponses[id]) &&
        champsDeReponse.every(
          (champ) =>
            typeof (reponses[id] as Record<string, unknown>)[
              champ
            ] === "string" &&
            (
              (reponses[id] as Record<string, unknown>)[
                champ
              ] as string
            ).length > 0,
        ),
    )
  ) {
    return false;
  }
  const cicatrices = [
    "cicatrice.reserves-partagees-veille-basse",
    "cicatrice.capacites-accueil-saturees",
  ] as const;
  const causes = [
    "crise.veille-basse.partager-reserves-cohorte",
    "crise.veille-basse.renforcer-accueil",
  ] as const;
  const garanties = [
    "cohorte-hydratee",
    "accueil-stabilise",
  ] as const;
  return (
    estDictionnaireAvecCles(valeur.cicatrices, cicatrices) &&
    estDictionnaireAvecCles(
      valeur.consequencesCicatrices,
      cicatrices,
    ) &&
    estDictionnaireAvecCles(valeur.causes, causes) &&
    estDictionnaireAvecCles(valeur.garanties, garanties) &&
    estDictionnaireAvecCles(
      valeur.conditionsRecuperation,
      garanties,
    )
  );
}

function estPresentationDeVeilleBasse(valeur: unknown): boolean {
  if (!estObjet(valeur)) {
    return false;
  }
  const { crise, ...autresTextes } = valeur;
  return (
    estArbreDeTextes(autresTextes) &&
    estPresentationDeCriseDeVeilleBasse(crise)
  );
}

function estPresentationDeTrame(valeur: unknown): boolean {
  if (!estObjet(valeur)) {
    return false;
  }
  const { crise, ...autresTextes } = valeur;
  if (
    !estArbreDeTextes(autresTextes) ||
    !estObjet(crise) ||
    !["alerteTitre", "alerteCause", "titre", "cause"].every(
      (champ) =>
        typeof crise[champ] === "string" &&
        (crise[champ] as string).length > 0,
    ) ||
    !Array.isArray(crise.chaine) ||
    crise.chaine.length !== 4 ||
    !crise.chaine.every(
      (maillon) => typeof maillon === "string" && maillon.length > 0,
    ) ||
    !estObjet(crise.reponses)
  ) {
    return false;
  }
  const champsDeReponse = [
    "intention",
    "coutConnu",
    "consequence",
    "mitigation",
    "pireConsequence",
    "attribution",
  ] as const;
  const reponses = crise.reponses as Record<string, unknown>;
  const cicatrices = [
    "cicatrice.chassis-etaye-dans-l-urgence",
    "cicatrice.plateforme-detachee-trame",
  ] as const;
  const causes = [
    "crise.trame.etayer-chassis",
    "crise.trame.detacher-plateforme",
  ] as const;
  const garanties = [
    "charge-repartie-trame",
    "attelage-recale-trame",
  ] as const;
  return (
    ["etayer-chassis", "detacher-plateforme"].every(
      (id) =>
        estObjet(reponses[id]) &&
        champsDeReponse.every(
          (champ) =>
            typeof (reponses[id] as Record<string, unknown>)[champ] ===
              "string" &&
            (
              (reponses[id] as Record<string, unknown>)[champ] as string
            ).length > 0,
        ),
    ) &&
    estDictionnaireAvecCles(crise.cicatrices, cicatrices) &&
    estDictionnaireAvecCles(
      crise.consequencesCicatrices,
      cicatrices,
    ) &&
    estDictionnaireAvecCles(crise.causes, causes) &&
    estDictionnaireAvecCles(crise.garanties, garanties) &&
    estDictionnaireAvecCles(crise.destinations, [
      "marche-des-traverses",
      "signal-zero",
    ]) &&
    estDictionnaireAvecCles(
      crise.conditionsRecuperation,
      garanties,
    )
  );
}

function estDictionnaireDeTextesNonVide(valeur: unknown): boolean {
  return (
    estObjet(valeur) &&
    Object.keys(valeur).length > 0 &&
    Object.values(valeur).every(
      (texte) => typeof texte === "string" && texte.length > 0,
    )
  );
}

function estPresentationDeCouronne(valeur: unknown): boolean {
  if (!estObjet(valeur)) {
    return false;
  }
  if (!("crise" in valeur)) {
    return estArbreDeTextes(valeur);
  }
  const { crise, ...autresTextes } = valeur;
  if (
    !estArbreDeTextes(autresTextes) ||
    !estObjet(crise) ||
    !["alerteTitre", "alerteCause", "titre", "cause"].every(
      (champ) =>
        typeof crise[champ] === "string" &&
        (crise[champ] as string).length > 0,
    ) ||
    !Array.isArray(crise.chaine) ||
    crise.chaine.length !== 4 ||
    !crise.chaine.every(
      (maillon) => typeof maillon === "string" && maillon.length > 0,
    ) ||
    !estDictionnaireDeTextesNonVide(crise.maillons) ||
    !estObjet(crise.reponses)
  ) {
    return false;
  }
  const champsDeReponse = [
    "intention",
    "coutConnu",
    "consequence",
    "mitigation",
    "pireConsequence",
    "attribution",
  ] as const;
  const reponses = crise.reponses as Record<string, unknown>;
  const idsDeReponse = [
    "stabiliser-anneau-du-halo",
    "relayer-halo-par-les-veilleurs",
    "condamner-couronne-exterieure",
  ] as const;
  const cicatrices = [
    "cicatrice.halo-bride-par-les-etais",
    "cicatrice.veilleurs-lies-au-halo",
    "cicatrice.couronne-exterieure-condamnee",
  ] as const;
  const causes = [
    "crise.couronne.stabiliser-anneau-du-halo",
    "crise.couronne.relayer-halo-par-les-veilleurs",
    "crise.couronne.condamner-couronne-exterieure",
  ] as const;
  const garanties = [
    "halo-reparti-au-noeud",
    "releve-des-veilleurs-au-noeud",
    "passage-interieur-preserve",
  ] as const;
  return (
    idsDeReponse.every(
      (id) =>
        estObjet(reponses[id]) &&
        champsDeReponse.every(
          (champ) =>
            typeof (reponses[id] as Record<string, unknown>)[champ] ===
              "string" &&
            (
              (reponses[id] as Record<string, unknown>)[champ] as string
            ).length > 0,
        ),
    ) &&
    estDictionnaireAvecCles(crise.cicatrices, cicatrices) &&
    estDictionnaireAvecCles(
      crise.consequencesCicatrices,
      cicatrices,
    ) &&
    estDictionnaireAvecCles(crise.causes, causes) &&
    estDictionnaireAvecCles(crise.garanties, garanties) &&
    estDictionnaireAvecCles(crise.destinations, ["noeud-central"]) &&
    estDictionnaireAvecCles(
      crise.conditionsRecuperation,
      garanties,
    )
  );
}

function estPresentationDeLOuvertureDeLaCouronne(
  valeur: unknown,
): boolean {
  if (
    !estObjet(valeur) ||
    typeof valeur.titre !== "string" ||
    valeur.titre.length === 0 ||
    typeof valeur.eyebrow !== "string" ||
    valeur.eyebrow.length === 0
  ) {
    return false;
  }
  return [
    [
      "nomsDesOuvertures",
      ["ferroviaire", "phares", "colonies", "breche"],
    ],
    [
      "statutsDesOuvertures",
      ["indisponible", "risquee", "preparee", "toujours-disponible"],
    ],
    [
      "acteurs",
      [
        "republique",
        "atelier-commun",
        "pelerins",
        "releveurs",
        "coalition",
        "delegations-fragiles",
        "absents",
        "breche",
      ],
    ],
    ["couts", ["ferroviaire", "phares", "colonies", "breche"]],
    ["projets", ["berceau", "etalon", "precipitateur"]],
    [
      "diagnostics",
      [
        "portance-inconnue",
        "portance-confirmee",
        "frequences-inconnues",
        "frequences-calibrees",
        "decharges-inconnues",
        "decharges-cartographiees",
      ],
    ],
    ["preparations", ["absente", "amorcee", "calibree", "assemble"]],
    ["reductions", ["aucune", "berceau", "etalon", "precipitateur"]],
    ["delegations", ["absente", "conditionnelle", "mandatee"]],
    [
      "ouverturesChoisies",
      ["aucune", "ferroviaire", "phares", "colonies", "breche"],
    ],
    ["noeud", ["inaccessible", "intact", "contraint", "endommage"]],
    ["solutions", ["ancrer", "reaccorder", "precipiter"]],
    [
      "statutsDesSolutions",
      ["preparee", "risquee", "impossible"],
    ],
    ["gardes", ["indecise", "gardiennes", "collective"]],
    ["formats", ["ouverture", "projet", "conseil", "solution"]],
    [
      "libelles",
      [
        "ouvertures",
        "projets",
        "conseil",
        "choix",
        "noeud",
        "solutions",
        "garde",
      ],
    ],
  ].every(([champ, cles]) =>
    estDictionnaireAvecCles(
      valeur[champ as string],
      cles as readonly string[],
    ),
  );
}

function estPresentationDuContratFinal(valeur: unknown): boolean {
  if (
    !estObjet(valeur) ||
    typeof valeur.titre !== "string" ||
    valeur.titre.length === 0 ||
    typeof valeur.eyebrow !== "string" ||
    valeur.eyebrow.length === 0 ||
    typeof valeur.aucunBilan !== "string" ||
    valeur.aucunBilan.length === 0
  ) {
    return false;
  }
  return [
    ["solutions", ["ancrer", "reaccorder", "precipiter"]],
    ["statuts", ["preparee", "risquee", "impossible"]],
    ["disponibilites", ["selectionnable", "non-selectionnable"]],
    [
      "causes",
      [
        "berceau-amorce",
        "berceau-absent",
        "etalon-calibre",
        "etalon-absent",
        "precipitateur-assemble",
        "precipitateur-absent",
        "noeud-preserve",
        "noeud-contraint",
        "noeud-endommage",
        "coalition-presente",
        "coalition-absente",
        "accord-partage",
        "accord-ferme",
        "specialistes-reaccord-reunis",
        "specialistes-reaccord-absents",
        "engagements-reaccord-actifs",
        "engagements-reaccord-absents",
        "connaissance-reseau-etablie",
        "connaissance-reseau-absente",
        "ligne-zero-relevee",
        "ligne-zero-absente",
        "confinement-bassins-prepare",
        "confinement-bassins-absent",
        "gouvernance-bassins-partagee",
        "gouvernance-bassins-contrainte",
        "gouvernance-bassins-absente",
        "ressources-suffisantes",
        "materiaux-insuffisants",
        "eau-insuffisante",
        "habitants-insuffisants",
      ],
    ],
    ["ressources", ["eau", "materiaux", "habitants"]],
    [
      "selections",
      [
        "aucune",
        "ancrage-prepare",
        "ancrage-risque",
        "reaccord-prepare",
        "reaccord-risque",
        "precipitation-preparee",
        "precipitation-risquee",
      ],
    ],
    [
      "variantes",
      [
        "aucune",
        "refuge-commun",
        "citadelle-de-cendre",
        "dernier-rempart",
        "constellation",
        "reseau-de-fer",
        "veilles-dispersees",
        "ciel-rendu",
        "terre-des-sacrifies",
        "pluie-noire",
      ],
    ],
    [
      "stabilites",
      [
        "stable",
        "fortifiee",
        "sous-contrainte",
        "maillee",
        "rigide",
        "fragmentee",
        "progressive",
        "forcee",
        "dispersee",
      ],
    ],
    [
      "controles",
      [
        "partage",
        "centralise",
        "equipes",
        "coalition",
        "republique",
        "sans-proprietaire",
        "conseil-des-bassins",
        "autorite-du-noeud",
        "fracture",
      ],
    ],
    [
      "sortsDuCoeur",
      [
        "immobilise",
        "verrouille",
        "sollicite",
        "relaye",
        "subordonne",
        "fragmente",
        "preserve",
        "expose",
        "consume",
      ],
    ],
    ["coutsHumains", ["contenu", "inegal", "eleve"]],
    ["formats", ["solution", "cout", "bilan"]],
    [
      "libelles",
      ["solutions", "causes", "selection", "negociation", "variante", "bilan"],
    ],
  ].every(([champ, cles]) =>
    estDictionnaireAvecCles(
      valeur[champ as string],
      cles as readonly string[],
    ),
  );
}

function estPresentationDeLEpilogue(valeur: unknown): boolean {
  if (
    !estObjet(valeur) ||
    ![
      "titre",
      "eyebrow",
      "introduction",
      "revelation",
      "causesDEtat",
      "aucun",
    ].every(
      (champ) =>
        typeof valeur[champ] === "string" &&
        (valeur[champ] as string).length > 0,
    )
  ) {
    return false;
  }
  if (
    ![
      "noms",
      "statutsDeCompagnons",
      "etats",
      "liens",
      "rancunes",
      "reparations",
    ].every((champ) =>
      estDictionnaireDeTextesNonVide(valeur[champ]),
    )
  ) {
    return false;
  }
  return [
    [
      "libelles",
      [
        "axes",
        "sort-du-coeur",
        "revelation",
        "compagnons",
        "colonies",
        "sites",
        "cohortes",
        "factions",
        "engagements",
        "traces",
        "statut",
        "sante",
        "projet",
        "lien",
        "rancune",
        "causes",
      ],
    ],
    [
      "axes",
      [
        "stabilite-technique",
        "controle-politique",
        "cout-humain",
      ],
    ],
  ].every(([champ, cles]) =>
    estDictionnaireAvecCles(
      valeur[champ as string],
      cles as readonly string[],
    ),
  );
}

export function lirePresentationsPremium(): PresentationsPremium | null {
  return presentationsInstallees;
}

export function installerPresentationsPremium(valeur: unknown): void {
  const catalogue = estObjet(valeur) ? valeur.catalogue : undefined;
  const presentations = estObjet(catalogue)
    ? catalogue.presentations
    : undefined;
  const evenements = estObjet(catalogue) ? catalogue.evenements : undefined;
  const inclutLeDeversoir =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("bassins.deversoir."),
    );
  const inclutLaTrame =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("trame."),
    );
  const inclutTraverse =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        (evenement.id.startsWith("trame.pompe-neuve.") ||
          evenement.id.startsWith("trame.traverse-libre.")),
    );
  const inclutConvergence =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        (evenement.id.startsWith("trame.marche.") ||
          evenement.id.startsWith("trame.signal-zero.")),
    );
  const inclutAiguillage =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("trame.aiguillage-zero."),
    );
  const inclutCouronne =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("couronne."),
    );
  const inclutVoieColonies =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        (evenement.id.startsWith("couronne.serres-de-verre.") ||
          evenement.id.startsWith("couronne.seuil.") ||
          evenement.id.startsWith("couronne.colonies.")),
    );
  const inclutOuvertureDeLaCouronne =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("couronne.ouverture."),
    );
  const inclutFinale =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("finale."),
    );
  const inclutEpilogue =
    Array.isArray(evenements) &&
    evenements.some(
      (evenement) =>
        estObjet(evenement) &&
        typeof evenement.id === "string" &&
        evenement.id.startsWith("epilogue."),
    );
  const surfacesAttendues = [
    "hautPuits",
    "veilleBasse",
    ...(inclutLeDeversoir ? ["deversoir"] : []),
    ...(inclutLaTrame ? ["trame"] : []),
    ...(inclutTraverse ? ["traverse"] : []),
    ...(inclutConvergence ? ["convergence"] : []),
    ...(inclutAiguillage ? ["aiguillage"] : []),
    ...(inclutCouronne ? ["couronne"] : []),
    ...(inclutVoieColonies ? ["voieColonies"] : []),
    ...(inclutOuvertureDeLaCouronne
      ? ["ouvertureCouronne"]
      : []),
    ...(inclutFinale || inclutEpilogue ? ["finale"] : []),
    ...(inclutEpilogue ? ["epilogue"] : []),
  ];
  if (
    !estObjet(presentations) ||
    !surfacesAttendues.every((surface) => {
      return (
        estObjet(presentations[surface]) &&
        ["fr", "en"].every((langue) => {
          const presentation = (
            presentations[surface] as Record<string, unknown>
          )[langue];
          if (!estObjet(presentation)) {
            return false;
          }
          return surface === "veilleBasse"
            ? estPresentationDeVeilleBasse(presentation)
            : surface === "trame"
              ? estPresentationDeTrame(presentation)
            : surface === "couronne"
              ? estPresentationDeCouronne(presentation)
            : surface === "ouvertureCouronne"
              ? estPresentationDeLOuvertureDeLaCouronne(
                  presentation,
                )
              : surface === "finale"
                ? estPresentationDuContratFinal(presentation)
                : surface === "epilogue"
                  ? estPresentationDeLEpilogue(presentation)
                  : estArbreDeTextes(presentation);
        })
      );
    })
  ) {
    throw new Error("presentations-premium-invalides");
  }
  presentationsInstallees = presentations as unknown as PresentationsPremium;
}
