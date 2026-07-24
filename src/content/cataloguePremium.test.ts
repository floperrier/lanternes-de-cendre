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
});
