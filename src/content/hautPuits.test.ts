import { describe, expect, it } from "vitest";

import { projeterPilotage } from "../application/pilotage";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "../simulation/campagne";
import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS_DU_LOT_HAUT_PUITS = [
  "bassins.haut-puits.pacte-des-citernes",
  "bassins.haut-puits.vanniers-du-panache",
  "bassins.haut-puits.boues-du-decanteur",
  "bassins.haut-puits.ilyana-et-la-vanne",
] as const;

function lireLotHautPuits() {
  return IDS_DU_LOT_HAUT_PUITS.map((id) =>
    catalogueDEvenements.evenements.find(
      (evenement) => evenement.id === id,
    ),
  );
}

describe("lot narratif de Haut-Puits", () => {
  it("reste absent du catalogue statique livré à la Démonstration", () => {
    expect(
      catalogueDeBase.evenements.map(({ id }) => id),
    ).not.toEqual(expect.arrayContaining([...IDS_DU_LOT_HAUT_PUITS]));
    expect(JSON.stringify(catalogueDeBase)).not.toContain(
      "/api/commercial/assets/",
    );
  });

  it("compile exactement deux conflits, une conséquence et une histoire de Compagnon", () => {
    const lot = lireLotHautPuits();

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "conflits-regionaux",
      "conflits-regionaux",
      "consequences-systemiques",
      "histoires-de-compagnons",
    ]);
  });

  it("livre les quatre fiches bilingues, illustrées et traçables", () => {
    const lot = lireLotHautPuits();

    for (const evenement of lot) {
      expect(evenement?.choix).toHaveLength(2);
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      const asset = evenement?.asset;
      expect(asset).not.toBeNull();
      expect(asset).toMatchObject({
        contientTexte: false,
        provenance: {
          droits: "OpenAI Terms of Use — output assigned to the user",
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
        alternatives: {
          fr: expect.any(String),
          en: expect.any(String),
        },
      });
      expect(asset?.fichier).toMatch(
        /^\/(?:assets|api\/commercial\/assets)\/.+\.webp$/,
      );
    }
    expect(
      new Set(lot.map((evenement) => evenement?.asset?.fichier)).size,
    ).toBe(4);
  });

  it("enchaîne le lot jusqu’aux projets régionaux et au Conseil des Vannes", () => {
    const lot = lireLotHautPuits();

    expect(lot.map((evenement) => evenement?.faitsLus)).toEqual([
      [
        "bassins.haut-puits.partage-promis",
        "bassins.haut-puits.reserves-protegees",
      ],
      [
        "bassins.haut-puits.pacte-partage",
        "bassins.haut-puits.pacte-autonomie",
      ],
      [
        "bassins.haut-puits.panache-confine",
        "bassins.haut-puits.panache-derive",
      ],
      [
        "bassins.haut-puits.decanteur-documente",
        "bassins.haut-puits.arche-documentee",
      ],
    ]);
    expect(lot[0]?.consequenceDifferee.type).toBe("conseil-des-vannes");
    expect(lot[3]?.consequenceDifferee.type).toBe("conseil-des-vannes");
    expect(lot[2]?.textes.fr.presentation.modele).toContain(
      "Décanteur itinérant",
    );
    expect(lot[2]?.textes.fr.presentation.modele).toContain(
      "Arche des déplacés",
    );
  });

  it("projette les huit Faits et leurs causes dans le Journal bilingue", () => {
    const parcours = [
      [
        ["bassins.haut-puits.pacte-des-citernes", "ouvrir-citerne"],
        ["bassins.haut-puits.vanniers-du-panache", "confiner-boues"],
        ["bassins.haut-puits.boues-du-decanteur", "consigner-decanteur"],
        ["bassins.haut-puits.ilyana-et-la-vanne", "lui-confier-registre"],
      ],
      [
        ["bassins.haut-puits.pacte-des-citernes", "garantir-autonomie"],
        ["bassins.haut-puits.vanniers-du-panache", "deriver-panache"],
        ["bassins.haut-puits.boues-du-decanteur", "adapter-arche"],
        [
          "bassins.haut-puits.ilyana-et-la-vanne",
          "garder-arbitrage-collectif",
        ],
      ],
    ] as const;

    for (const [index, decisions] of parcours.entries()) {
      const initial = creerCampagneInitiale(`CENDRE-0${index + 1}`);
      let etat: EtatCampagne = {
        ...initial,
        tempsDuConvoi: { ...initial.tempsDuConvoi, secondes: 360 },
        routes: { ...initial.routes, position: "haut-puits" },
        narration: {
          evenementActif: null,
          evenementsJoues: ["bassins-fendus.eau-de-haut-puits"],
          faitsDeCampagne: [
            {
              id:
                index === 0
                  ? "bassins.haut-puits.partage-promis"
                  : "bassins.haut-puits.reserves-protegees",
              cause: "bassins-fendus.eau-de-haut-puits",
              acteurs: ["porte-lanterne", "puits-libres"],
              cible: "habitants-haut-puits",
              moment: 360,
              effets: { materiels: [], humains: [] },
            },
          ],
        },
      };

      for (const [evenementId, choixId] of decisions) {
        etat = appliquerCommande(etat, {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 0,
        }).etat;
        etat = appliquerCommande(etat, {
          type: "evenement-narratif.choisir",
          evenementId,
          choixId,
        }).etat;

        const fait = etat.narration.faitsDeCampagne.at(-1);
        expect(fait).toBeDefined();
        for (const langue of ["fr", "en"] as const) {
          const entree = projeterPilotage(etat, langue).journalCausal.at(-1);
          expect(entree?.titre).not.toBe(fait?.id);
          expect(entree?.cause).not.toBe(fait?.cause);
        }
      }

      if (index === 0) {
        expect(
          etat.narration.faitsDeCampagne.find(
            (fait) => fait.id === "bassins.haut-puits.pacte-partage",
          )?.effets.materiels,
        ).toEqual([
          { type: "stock.modifie", stock: "eau", variation: -30 },
        ]);
      }
    }
  });
});
