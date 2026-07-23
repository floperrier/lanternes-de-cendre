import { describe, expect, it } from "vitest";

import { catalogueDEvenements, trouverConseil } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS_DU_LOT_DU_DEVERSOIR = [
  "bassins.deversoir.la-conduite-zero",
  "bassins.deversoir.la-tempete-aux-vannes",
  "bassins.deversoir.le-chassis-des-bassins",
  "bassins.deversoir.le-passage-sans-retour",
] as const;

describe("lot du Déversoir Noir et Conseil des Vannes", () => {
  it("ajoute quatre Événements premium portant les fonctions régionales attendues", () => {
    expect(catalogueDeBase.evenements.map(({ id }) => id)).not.toEqual(
      expect.arrayContaining([...IDS_DU_LOT_DU_DEVERSOIR]),
    );
    const lot = IDS_DU_LOT_DU_DEVERSOIR.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "mystere-des-phares",
      "conflits-regionaux",
      "consequences-systemiques",
      "consequences-systemiques",
    ]);
    expect(
      catalogueDEvenements.evenements.filter((evenement) =>
        evenement.id.startsWith("bassins.deversoir."),
      ),
    ).toHaveLength(4);
  });

  it("compile un Conseil premium à quatre décisions sans le révéler au catalogue gratuit", () => {
    expect(
      catalogueDeBase.conseils.map(({ id }) => id),
    ).not.toContain("conseil.des-vannes");

    const conseil = trouverConseil("conseil.des-vannes");
    expect(conseil?.sujets).toHaveLength(1);
    expect(
      conseil?.sujets[0]?.decisions.map(({ id, faitProduit }) => ({
        id,
        faitProduit,
      })),
    ).toEqual([
      {
        id: "partager-reserves",
        faitProduit: "bassins.conseil.reserves-partagees",
      },
      {
        id: "reparer-decanteur",
        faitProduit: "bassins.conseil.decanteur-repare",
      },
      {
        id: "reorienter-cohorte",
        faitProduit: "bassins.conseil.cohorte-reorientee",
      },
      {
        id: "contraindre-vannes",
        faitProduit: "bassins.conseil.vannes-contraintes",
      },
    ]);
  });

  it("fait revenir la maintenance commune comme obligation politique au Déversoir", () => {
    const tempete = catalogueDEvenements.evenements.find(
      (evenement) =>
        evenement.id === "bassins.deversoir.la-tempete-aux-vannes",
    );

    expect(tempete?.faitsLus).toContain(
      "bassins.nacelles.conseil-maintenance-commune",
    );
    expect(tempete?.variantes[0]).toEqual({
      id: "maintenance-commune",
      condition: {
        type: "fait-present",
        fait: "bassins.nacelles.conseil-maintenance-commune",
      },
    });
    expect(
      tempete?.textes.fr.variantes["maintenance-commune"].modele,
    ).toContain("chaque Colonie");
    expect(
      tempete?.textes.en.variantes["maintenance-commune"].modele,
    ).toContain("each Colony");
  });

  it("livre quatre assets bilingues traçables et non expirables", () => {
    for (const id of IDS_DU_LOT_DU_DEVERSOIR) {
      const evenement = catalogueDEvenements.evenements.find(
        (candidat) => candidat.id === id,
      );
      expect(evenement?.periodeEligibilite.fin).toBe(2_147_483_647);
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      expect(evenement?.asset).toMatchObject({
        contientTexte: false,
        fichier: expect.stringMatching(
          /^\/api\/commercial\/assets\/.+\.webp$/,
        ),
        provenance: {
          droits: "OpenAI Terms of Use — output assigned to the user",
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
      });
    }
  });
});
