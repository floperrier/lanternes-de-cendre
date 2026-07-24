import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS = [
  "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
  "trame.aiguillage-zero.le-conseil-des-voies",
  "trame.aiguillage-zero.le-passage-de-la-couronne",
] as const;

describe("Aiguillage Zéro", () => {
  it("compile exactement une révélation, un conflit et une conséquence", () => {
    const lot = IDS.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );
    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "mystere-des-phares",
      "conflits-regionaux",
      "consequences-systemiques",
    ]);
    expect(
      catalogueDEvenements.evenements.filter(({ id }) =>
        id.startsWith("trame."),
      ),
    ).toHaveLength(18);
  });

  it("conserve le climax et ses trois assets hors du catalogue gratuit", () => {
    expect(JSON.stringify(catalogueDeBase)).not.toMatch(
      /Aiguillage Zéro|Zero Junction|Couronne muette|Silent Crown|Relations de la Trame|Iron Weave relationships|Sites de la Trame|Iron Weave Sites|Routes de la Trame|Iron Weave Routes/,
    );
    for (const id of IDS) {
      const evenement = catalogueDEvenements.evenements.find(
        (candidat) => candidat.id === id,
      );
      expect(evenement?.asset).toMatchObject({
        contientTexte: false,
        fichier: expect.stringMatching(
          /^\/api\/commercial\/assets\/trame-aiguillage-.+\.webp$/,
        ),
        alternatives: {
          fr: expect.any(String),
          en: expect.any(String),
        },
        provenance: {
          droits: "OpenAI Terms of Use — output assigned to the user",
          statutApprobation: "pending-pull-request-review",
        },
      });
    }
  });

  it("porte quatre accords et un registre de sortie agrégé avec écho futur", () => {
    const conseil = catalogueDEvenements.evenements.find(
      ({ id }) => id === IDS[1],
    );
    const passage = catalogueDEvenements.evenements.find(
      ({ id }) => id === IDS[2],
    );
    expect(conseil?.choix.map(({ id }) => id)).toEqual([
      "accorder-monopole",
      "etablir-charte",
      "soustraire-piece",
      "assurer-transport-autonome",
    ]);
    for (const choix of conseil?.choix ?? []) {
      expect(choix.faitsProduits.length).toBeGreaterThanOrEqual(1);
      expect(choix.faitsProduits.length).toBeLessThanOrEqual(2);
    }
    for (const choix of passage?.choix ?? []) {
      expect(choix.faitsProduits).toHaveLength(2);
      expect(choix.faitsProduits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cible: "registre-de-sortie-de-la-trame",
          }),
          {
            id: "trame.aiguillage-zero.retours-couronne-planifies",
            cible: "couronne-muette",
          },
        ]),
      );
    }
  });
});
