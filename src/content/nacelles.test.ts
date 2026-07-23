import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS_DU_LOT_DES_NACELLES = [
  "bassins.nacelles.le-poids-des-deux-rives",
  "bassins.nacelles.le-frein-sous-la-cendre",
  "bassins.nacelles.la-main-sur-le-frein",
  "bassins.nacelles.deux-voix-dans-le-cable",
] as const;
const IDS_DES_RECITS_QUI_VERROUILLENT_UNE_ROUTE = [
  "bassins.haut-puits.pacte-des-citernes",
  "bassins.haut-puits.vanniers-du-panache",
  "bassins.haut-puits.boues-du-decanteur",
  "bassins.haut-puits.ilyana-et-la-vanne",
  "veille-basse.la-place-sous-le-phare",
  "veille-basse.la-porte-des-filtres",
  "veille-basse.les-registres-du-reflux",
  "veille-basse.maelys-et-le-coffret",
  ...IDS_DU_LOT_DES_NACELLES,
] as const;

function lireLotDesNacelles() {
  return IDS_DU_LOT_DES_NACELLES.map((id) =>
    catalogueDEvenements.evenements.find(
      (evenement) => evenement.id === id,
    ),
  );
}

describe("lot narratif des Nacelles", () => {
  it("reste commercial et compile exactement les quatre fonctions éditoriales attendues", () => {
    expect(
      catalogueDeBase.evenements.map(({ id }) => id),
    ).not.toEqual(expect.arrayContaining([...IDS_DU_LOT_DES_NACELLES]));

    const lot = lireLotDesNacelles();
    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "conflits-regionaux",
      "mystere-des-phares",
      "consequences-systemiques",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter((evenement) =>
        evenement.id.startsWith("bassins.nacelles."),
      ),
    ).toHaveLength(4);
  });

  it("ne laisse expirer aucun récit requis après une route sans retour", () => {
    for (const id of IDS_DES_RECITS_QUI_VERROUILLENT_UNE_ROUTE) {
      expect(
        catalogueDEvenements.evenements.find(
          (evenement) => evenement.id === id,
        )?.periodeEligibilite.fin,
      ).toBe(2_147_483_647);
    }
  });

  it("fait recevoir au conflit l’écho majeur des deux branches", () => {
    const conflit = lireLotDesNacelles()[0];

    expect(conflit?.faitsLus).toEqual([
      "bassins.haut-puits.ilyana-garante",
      "bassins.haut-puits.ilyana-contredite",
      "veille-basse.maelys-mission-confiee",
      "veille-basse.maelys-equipes-prioritaires",
      "veille-basse.intervention-refusee",
    ]);
    expect(conflit?.variantes.slice(0, 5)).toEqual([
      {
        id: "echo-ilyana-garante",
        condition: {
          type: "fait-present",
          fait: "bassins.haut-puits.ilyana-garante",
        },
      },
      {
        id: "echo-ilyana-contredite",
        condition: {
          type: "fait-present",
          fait: "bassins.haut-puits.ilyana-contredite",
        },
      },
      {
        id: "echo-maelys-mission",
        condition: {
          type: "fait-present",
          fait: "veille-basse.maelys-mission-confiee",
        },
      },
      {
        id: "echo-maelys-equipes",
        condition: {
          type: "fait-present",
          fait: "veille-basse.maelys-equipes-prioritaires",
        },
      },
      {
        id: "echo-veille-abandonnee",
        condition: {
          type: "fait-present",
          fait: "veille-basse.intervention-refusee",
        },
      },
    ]);
    expect(
      new Set(
        conflit === undefined
          ? []
          : conflit.variantes.map(
              ({ id }) => conflit.textes.fr.variantes[id]?.modele,
            ),
      ).size,
    ).toBe(6);
    expect(conflit?.consequenceDifferee.type).toBe(
      "conseil-des-vannes",
    );
  });

  it("ne propose l’Intervention clandestine qu’après révélation du frein concret et produit une Trace", () => {
    const mystere = lireLotDesNacelles()[1];
    const systeme = lireLotDesNacelles()[2];

    expect(
      mystere?.choix.flatMap((choix) => choix.faitsProduits),
    ).toEqual([
      {
        id: "bassins.nacelles.cible-frein-balisee",
        cible: "frein-magnetique-des-nacelles",
      },
      {
        id: "bassins.nacelles.cible-frein-consignee",
        cible: "frein-magnetique-des-nacelles",
      },
    ]);
    expect(systeme?.faitsLus).toEqual([
      "bassins.nacelles.cible-frein-balisee",
      "bassins.nacelles.cible-frein-consignee",
    ]);
    expect(
      systeme?.choix.find(
        (choix) => choix.id === "intervenir-clandestinement",
      )?.faitsProduits,
    ).toEqual([
      {
        id: "bassins.nacelles.frein-transforme-clandestinement",
        cible: "frein-magnetique-des-nacelles",
      },
      {
        id: "bassins.nacelles.trace-laiton-persistante",
        cible: "nacelliers-des-vannes",
      },
    ]);
  });

  it("livre quatre assets premium bilingues, distincts, accessibles et traçables", () => {
    const lot = lireLotDesNacelles();

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
    ).toBe(4);
  });
});
