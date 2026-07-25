import { describe, expect, it } from "vitest";

import {
  catalogueDEvenements,
  installerContenuPremiumNarratif,
} from "./catalogue";
import { installerPresentationsPremium } from "./presentationsPremium";

const JOURNAL_VIDE = {
  titres: {},
  causes: {},
  acteurs: {},
  cibles: {},
};

const PRESENTATION_CRISE_VALIDE = {
  alerteTitre: "Alerte",
  alerteCause: "Cause de l’alerte",
  titre: "Crise",
  cause: "Cause de la crise",
  chaine: ["Fait", "Aggravation", "Rupture"],
  reponses: {
    "partager-reserves-cohorte": {
      intention: "Partager",
      coutConnu: "6 Vivres",
      consequence: "Réserves entamées",
      mitigation: "Cohorte protégée",
      pireConsequence: "Autonomie réduite",
      attribution: "Cohorte",
    },
    "renforcer-accueil": {
      intention: "Renforcer",
      coutConnu: "5 Matériaux",
      consequence: "Capacité entamée",
      mitigation: "Sas protégés",
      pireConsequence: "Réparations réduites",
      attribution: "Techniciens",
    },
  },
  cicatrices: dictionnaire(
    "cicatrice.reserves-partagees-veille-basse",
    "cicatrice.capacites-accueil-saturees",
  ),
  consequencesCicatrices: dictionnaire(
    "cicatrice.reserves-partagees-veille-basse",
    "cicatrice.capacites-accueil-saturees",
  ),
  causes: dictionnaire(
    "crise.veille-basse.partager-reserves-cohorte",
    "crise.veille-basse.renforcer-accueil",
  ),
  garanties: dictionnaire("cohorte-hydratee", "accueil-stabilise"),
  conditionsRecuperation: dictionnaire(
    "cohorte-hydratee",
    "accueil-stabilise",
  ),
};

const PRESENTATIONS_VALIDES = {
  hautPuits: { fr: { titre: "Haut-Puits" }, en: { titre: "High Well" } },
  veilleBasse: {
    fr: { titre: "Veille-Basse", crise: PRESENTATION_CRISE_VALIDE },
    en: { titre: "Lower Watch", crise: PRESENTATION_CRISE_VALIDE },
  },
  deversoir: {
    fr: { titre: "Déversoir Noir" },
    en: { titre: "Black Spillway" },
  },
};

function dictionnaire(...cles: readonly string[]) {
  return Object.fromEntries(cles.map((cle) => [cle, cle]));
}

const PRESENTATION_OUVERTURE_VALIDE = {
  titre: "Ouverture de la Couronne",
  eyebrow: "Anneau intérieur",
  nomsDesOuvertures: dictionnaire(
    "ferroviaire",
    "phares",
    "colonies",
    "breche",
  ),
  statutsDesOuvertures: dictionnaire(
    "indisponible",
    "risquee",
    "preparee",
    "toujours-disponible",
  ),
  acteurs: dictionnaire(
    "republique",
    "atelier-commun",
    "pelerins",
    "releveurs",
    "coalition",
    "delegations-fragiles",
    "absents",
    "breche",
  ),
  couts: dictionnaire("ferroviaire", "phares", "colonies", "breche"),
  projets: dictionnaire("berceau", "etalon", "precipitateur"),
  diagnostics: dictionnaire(
    "portance-inconnue",
    "portance-confirmee",
    "frequences-inconnues",
    "frequences-calibrees",
    "decharges-inconnues",
    "decharges-cartographiees",
  ),
  preparations: dictionnaire(
    "absente",
    "amorcee",
    "calibree",
    "assemble",
  ),
  reductions: dictionnaire(
    "aucune",
    "berceau",
    "etalon",
    "precipitateur",
  ),
  delegations: dictionnaire("absente", "conditionnelle", "mandatee"),
  ouverturesChoisies: dictionnaire(
    "aucune",
    "ferroviaire",
    "phares",
    "colonies",
    "breche",
  ),
  noeud: dictionnaire(
    "inaccessible",
    "intact",
    "contraint",
    "endommage",
  ),
  solutions: dictionnaire("ancrer", "reaccorder", "precipiter"),
  statutsDesSolutions: dictionnaire(
    "preparee",
    "risquee",
    "impossible",
  ),
  gardes: dictionnaire("indecise", "gardiennes", "collective"),
  formats: dictionnaire("ouverture", "projet", "conseil", "solution"),
  libelles: dictionnaire(
    "ouvertures",
    "projets",
    "conseil",
    "choix",
    "noeud",
    "solutions",
    "garde",
  ),
};

const PRESENTATION_FINALE_VALIDE = {
  titre: "Contrat final",
  eyebrow: "Cœur du Nœud",
  solutions: dictionnaire("ancrer", "reaccorder", "precipiter"),
  statuts: dictionnaire("preparee", "risquee", "impossible"),
  disponibilites: dictionnaire(
    "selectionnable",
    "non-selectionnable",
  ),
  causes: dictionnaire(
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
  ),
  ressources: dictionnaire("eau", "materiaux", "habitants"),
  selections: dictionnaire(
    "aucune",
    "ancrage-prepare",
    "ancrage-risque",
    "reaccord-prepare",
    "reaccord-risque",
    "precipitation-preparee",
    "precipitation-risquee",
  ),
  variantes: dictionnaire(
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
  ),
  stabilites: dictionnaire(
    "stable",
    "fortifiee",
    "sous-contrainte",
    "maillee",
    "rigide",
    "fragmentee",
    "progressive",
    "forcee",
    "dispersee",
  ),
  controles: dictionnaire(
    "partage",
    "centralise",
    "equipes",
    "coalition",
    "republique",
    "sans-proprietaire",
    "conseil-des-bassins",
    "autorite-du-noeud",
    "fracture",
  ),
  sortsDuCoeur: dictionnaire(
    "immobilise",
    "verrouille",
    "sollicite",
    "relaye",
    "subordonne",
    "fragmente",
    "preserve",
    "expose",
    "consume",
  ),
  coutsHumains: dictionnaire("contenu", "inegal", "eleve"),
  aucunBilan: "Aucun bilan",
  formats: dictionnaire("solution", "cout", "bilan"),
  libelles: dictionnaire(
    "solutions",
    "causes",
    "selection",
    "negociation",
    "variante",
    "bilan",
  ),
};

const PRESENTATION_EPILOGUE_VALIDE = {
  titre: "Épilogue",
  eyebrow: "Bilan",
  introduction: "Conséquences de la Campagne.",
  revelation: "Révélation finale.",
  libelles: dictionnaire(
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
  ),
  axes: dictionnaire(
    "stabilite-technique",
    "controle-politique",
    "cout-humain",
  ),
  noms: dictionnaire("ilyana-voss"),
  statutsDeCompagnons: dictionnaire("recrute"),
  etats: dictionnaire("stable"),
  liens: dictionnaire("registre-et-releve"),
  rancunes: dictionnaire("parole-de-l-eau-ecartee"),
  reparations: dictionnaire("confier-les-comptes-a-la-communaute"),
  causesDEtat: "Dernier état persistant",
  aucun: "aucun",
};

function lot(conseils?: readonly unknown[]) {
  return {
    version: 1,
    catalogue: {
      evenements: [],
      ...(conseils === undefined ? {} : { conseils }),
      libellesTransversaux: {
        fr: { journal: JOURNAL_VIDE },
        en: { journal: JOURNAL_VIDE },
      },
    },
  };
}

describe("installation du contenu narratif premium", () => {
  it("réinstalle un même Conseil premium sans le dupliquer", () => {
    const contenu = lot([{ id: "conseil.test-reentrant" }]);

    installerContenuPremiumNarratif(contenu);
    installerContenuPremiumNarratif(contenu);

    expect(
      catalogueDEvenements.conseils.filter(
        ({ id }) => id === "conseil.test-reentrant",
      ),
    ).toHaveLength(1);
  });

  it("accepte encore un payload V1 historique dépourvu de Conseils", () => {
    expect(() => installerContenuPremiumNarratif(lot())).not.toThrow();
  });

  it("rejette une présentation de Veille-Basse historique ou mal typée", () => {
    const installerAvec = (veilleBasse: unknown) =>
      installerPresentationsPremium({
        version: 1,
        catalogue: {
          evenements: [],
          presentations: {
            hautPuits: PRESENTATIONS_VALIDES.hautPuits,
            veilleBasse,
          },
        },
      });
    const { crise: _crise, ...frHistorique } =
      PRESENTATIONS_VALIDES.veilleBasse.fr;
    void _crise;

    expect(() =>
      installerAvec({
        fr: frHistorique,
        en: PRESENTATIONS_VALIDES.veilleBasse.en,
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerAvec({
        fr: ["texte"],
        en: PRESENTATIONS_VALIDES.veilleBasse.en,
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerAvec({
        fr: {
          ...PRESENTATIONS_VALIDES.veilleBasse.fr,
          crise: {
            ...PRESENTATION_CRISE_VALIDE,
            chaine: [{ texte: "objet-interdit" }],
          },
        },
        en: PRESENTATIONS_VALIDES.veilleBasse.en,
      }),
    ).toThrow("presentations-premium-invalides");
  });

  it("exige la présentation du Déversoir seulement pour les lots qui le contiennent", () => {
    const presentationsHistoriques = {
      hautPuits: PRESENTATIONS_VALIDES.hautPuits,
      veilleBasse: PRESENTATIONS_VALIDES.veilleBasse,
    };
    expect(() =>
      installerPresentationsPremium({
        version: 1,
        catalogue: {
          evenements: [],
          presentations: presentationsHistoriques,
        },
      }),
    ).not.toThrow();
    expect(() =>
      installerPresentationsPremium({
        version: 1,
        catalogue: {
          evenements: [{ id: "bassins.deversoir.le-conseil" }],
          presentations: presentationsHistoriques,
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        version: 1,
        catalogue: {
          evenements: [{ id: "bassins.deversoir.le-conseil" }],
          presentations: PRESENTATIONS_VALIDES,
        },
      }),
    ).not.toThrow();
  });

  it("exige la présentation du climax pour un lot Aiguillage Zéro", () => {
    const presentationsDeTrame = {
      hautPuits: PRESENTATIONS_VALIDES.hautPuits,
      veilleBasse: PRESENTATIONS_VALIDES.veilleBasse,
      trame: {
        fr: { titre: "Trame de Fer" },
        en: { titre: "Iron Weave" },
      },
    };
    const lotAiguillage = {
      version: 1,
      catalogue: {
        evenements: [
          { id: "trame.aiguillage-zero.le-conseil-des-voies" },
        ],
        presentations: presentationsDeTrame,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotAiguillage),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotAiguillage,
        catalogue: {
          ...lotAiguillage.catalogue,
          presentations: {
            ...presentationsDeTrame,
            aiguillage: {
              fr: { titre: "Aiguillage Zéro" },
              en: { titre: "Zero Junction" },
            },
          },
        },
      }),
    ).not.toThrow();
  });

  it("exige la présentation des approches pour un lot de la Couronne", () => {
    const presentationsSansCouronne = {
      hautPuits: PRESENTATIONS_VALIDES.hautPuits,
      veilleBasse: PRESENTATIONS_VALIDES.veilleBasse,
    };
    const lotCouronne = {
      version: 1,
      catalogue: {
        evenements: [
          {
            id: "couronne.tete-de-ligne.le-decret-du-dernier-quai",
          },
        ],
        presentations: presentationsSansCouronne,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotCouronne),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotCouronne,
        catalogue: {
          ...lotCouronne.catalogue,
          presentations: {
            ...presentationsSansCouronne,
            couronne: {
              fr: { titre: "Approches de la Couronne" },
              en: { titre: "Silent Crown Approaches" },
            },
          },
        },
      }),
    ).not.toThrow();
  });

  it("exige la présentation de la voie des Colonies pour le lot du Seuil", () => {
    const presentationsDeCouronne = {
      hautPuits: PRESENTATIONS_VALIDES.hautPuits,
      veilleBasse: PRESENTATIONS_VALIDES.veilleBasse,
      couronne: {
        fr: { titre: "Approches de la Couronne" },
        en: { titre: "Silent Crown Approaches" },
      },
    };
    const lotDuSeuil = {
      version: 1,
      catalogue: {
        evenements: [
          {
            id: "couronne.seuil.le-marche-des-abris",
          },
        ],
        presentations: presentationsDeCouronne,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotDuSeuil),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotDuSeuil,
        catalogue: {
          ...lotDuSeuil.catalogue,
          presentations: {
            ...presentationsDeCouronne,
            voieColonies: {
              fr: { titre: "Voie des Colonies" },
              en: { titre: "Colony Route" },
            },
          },
        },
      }),
    ).not.toThrow();
  });

  it("exige la présentation de l’Ouverture pour le lot du dernier Conseil", () => {
    const presentationsDeCouronne = {
      hautPuits: PRESENTATIONS_VALIDES.hautPuits,
      veilleBasse: PRESENTATIONS_VALIDES.veilleBasse,
      couronne: {
        fr: { titre: "Approches de la Couronne" },
        en: { titre: "Silent Crown Approaches" },
      },
    };
    const lotOuverture = {
      version: 1,
      catalogue: {
        evenements: [
          {
            id: "couronne.ouverture.le-diagnostic-des-verrous",
          },
        ],
        presentations: presentationsDeCouronne,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotOuverture),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotOuverture,
        catalogue: {
          ...lotOuverture.catalogue,
          presentations: {
            ...presentationsDeCouronne,
            ouvertureCouronne: {
              fr: { titre: "Ouverture de la Couronne" },
              en: { titre: "Opening the Crown" },
            },
          },
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotOuverture,
        catalogue: {
          ...lotOuverture.catalogue,
          presentations: {
            ...presentationsDeCouronne,
            ouvertureCouronne:
              {
                fr: PRESENTATION_OUVERTURE_VALIDE,
                en: PRESENTATION_OUVERTURE_VALIDE,
              },
          },
        },
      }),
    ).not.toThrow();
  });

  it("exige le contrat complet pour un lot de finale", () => {
    const lotFinal = {
      version: 1,
      catalogue: {
        evenements: [
          {
            id: "finale.ancrage.le-contrat-des-trois-solutions",
          },
        ],
        presentations: PRESENTATIONS_VALIDES,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotFinal),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotFinal,
        catalogue: {
          ...lotFinal.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            finale: {
              fr: { titre: "Contrat incomplet" },
              en: { titre: "Incomplete contract" },
            },
          },
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotFinal,
        catalogue: {
          ...lotFinal.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            finale: {
              fr: PRESENTATION_FINALE_VALIDE,
              en: PRESENTATION_FINALE_VALIDE,
            },
          },
        },
      }),
    ).not.toThrow();
  });

  it("exige le contrat complet pour un lot d’Épilogue", () => {
    const lotEpilogue = {
      version: 1,
      catalogue: {
        evenements: [
          {
            id: "epilogue.revelation.le-registre-des-rejets",
          },
        ],
        presentations: PRESENTATIONS_VALIDES,
      },
    };

    expect(() =>
      installerPresentationsPremium(lotEpilogue),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotEpilogue,
        catalogue: {
          ...lotEpilogue.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            epilogue: {
              fr: PRESENTATION_EPILOGUE_VALIDE,
              en: PRESENTATION_EPILOGUE_VALIDE,
            },
          },
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotEpilogue,
        catalogue: {
          ...lotEpilogue.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            finale: {
              fr: PRESENTATION_FINALE_VALIDE,
              en: PRESENTATION_FINALE_VALIDE,
            },
            epilogue: {
              fr: {
                titre: "Épilogue incomplet",
                eyebrow: "Bilan",
                introduction: "Conséquences.",
                revelation: "Révélation.",
                causesDEtat: "Dernier état",
                aucun: "aucun",
              },
              en: {
                titre: "Incomplete epilogue",
                eyebrow: "Assessment",
                introduction: "Consequences.",
                revelation: "Revelation.",
                causesDEtat: "Last state",
                aucun: "none",
              },
            },
          },
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotEpilogue,
        catalogue: {
          ...lotEpilogue.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            finale: {
              fr: PRESENTATION_FINALE_VALIDE,
              en: PRESENTATION_FINALE_VALIDE,
            },
            epilogue: {
              fr: {
                ...PRESENTATION_EPILOGUE_VALIDE,
                noms: {
                  "ilyana-voss": {
                    valeurImbriquee: "Ilyana Voss",
                  },
                },
              },
              en: PRESENTATION_EPILOGUE_VALIDE,
            },
          },
        },
      }),
    ).toThrow("presentations-premium-invalides");
    expect(() =>
      installerPresentationsPremium({
        ...lotEpilogue,
        catalogue: {
          ...lotEpilogue.catalogue,
          presentations: {
            ...PRESENTATIONS_VALIDES,
            finale: {
              fr: PRESENTATION_FINALE_VALIDE,
              en: PRESENTATION_FINALE_VALIDE,
            },
            epilogue: {
              fr: PRESENTATION_EPILOGUE_VALIDE,
              en: PRESENTATION_EPILOGUE_VALIDE,
            },
          },
        },
      }),
    ).not.toThrow();
  });
});
