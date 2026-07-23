import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS_DU_LOT_DE_CONVERGENCE = [
  "trame.marche.les-services-de-la-voie-principale",
  "trame.marche.la-bascule-sans-manifeste",
  "trame.signal-zero.l-interface-aux-deux-frequences",
  "trame.signal-zero.les-deux-branches-dans-le-verre",
  "trame.signal-zero.ilyana-et-la-trace",
] as const;

describe("convergence de la Trame de Fer", () => {
  it("garde les lieux de convergence hors du catalogue gratuit", () => {
    expect(JSON.stringify(catalogueDeBase)).not.toMatch(
      /Marché des Traverses|Signal-Zéro|Sleeper Market|Zero Signal/,
    );
  });

  it("compile exactement deux conflits, un mystère, une conséquence et une histoire de Compagnon", () => {
    const lot = IDS_DU_LOT_DE_CONVERGENCE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "conflits-regionaux",
      "conflits-regionaux",
      "mystere-des-phares",
      "consequences-systemiques",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter((evenement) =>
        IDS_DU_LOT_DE_CONVERGENCE.includes(
          evenement.id as (typeof IDS_DU_LOT_DE_CONVERGENCE)[number],
        ),
      ),
    ).toHaveLength(5);
  });

  it("borne les deux offres et attache l’Intervention à une transmission concrète avec une Trace", () => {
    const officiel = catalogueDEvenements.evenements.find(
      ({ id }) =>
        id === "trame.marche.les-services-de-la-voie-principale",
    );
    const clandestin = catalogueDEvenements.evenements.find(
      ({ id }) => id === "trame.marche.la-bascule-sans-manifeste",
    );
    const intervention = clandestin?.choix.find(
      ({ id }) => id === "intervenir-sur-bascule",
    );

    expect(officiel?.epuisement).toBe("unique");
    expect(clandestin?.epuisement).toBe("unique");
    expect(intervention).toMatchObject({
      effets: [],
      faitsProduits: [
        {
          id: "trame.marche.trace-bascule-clandestine",
          cible: "bascule-des-manifestes",
        },
      ],
    });
    expect(
      clandestin?.textes.fr.choix["intervenir-sur-bascule"]
        ?.coutsConnus[0].modele,
    ).toContain("transmission concrète");
    expect(
      clandestin?.textes.en.choix["intervenir-sur-bascule"]
        ?.coutsConnus[0].modele,
    ).toContain("concrete transmission");
  });

  it("fait lire à la conséquence systémique les préparatifs majeurs des deux branches", () => {
    const systemique = catalogueDEvenements.evenements.find(
      ({ id }) =>
        id === "trame.signal-zero.les-deux-branches-dans-le-verre",
    );

    expect(systemique?.faitsLus).toEqual(
      expect.arrayContaining([
        "trame.grand-aiguillage.train-outil-annonce",
        "trame.grand-aiguillage.reparation-locale-ouverte",
        "trame.grand-aiguillage.attelage-federe-annonce",
        "trame.traverse-libre.galerie-etayee",
        "trame.traverse-libre.contournement-ouvert",
        "trame.traverse-libre.manifeste-public",
      ]),
    );
  });

  it("livre cinq assets premium bilingues, accessibles et traçables", () => {
    const lot = IDS_DU_LOT_DE_CONVERGENCE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );
    for (const evenement of lot) {
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      expect(evenement?.asset).toMatchObject({
        contientTexte: false,
        fichier: expect.stringMatching(
          /^\/api\/commercial\/assets\/.+\.webp$/,
        ),
        alternatives: {
          fr: expect.any(String),
          en: expect.any(String),
        },
        provenance: {
          droits: "OpenAI Terms of Use — output assigned to the user",
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
      });
    }
    expect(
      new Set(lot.map((evenement) => evenement?.asset?.fichier)).size,
    ).toBe(5);
  });
});
