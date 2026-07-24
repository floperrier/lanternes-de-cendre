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

const PRESENTATIONS_VALIDES = {
  hautPuits: { fr: { titre: "Haut-Puits" }, en: { titre: "High Well" } },
  veilleBasse: {
    fr: { titre: "Veille-Basse" },
    en: { titre: "Lower Watch" },
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
    "ligne-zero-relevee",
    "ligne-zero-absente",
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
  ),
  variantes: dictionnaire(
    "aucune",
    "refuge-commun",
    "citadelle-de-cendre",
    "dernier-rempart",
  ),
  stabilites: dictionnaire(
    "stable",
    "fortifiee",
    "sous-contrainte",
  ),
  controles: dictionnaire("partage", "centralise", "equipes"),
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
});
