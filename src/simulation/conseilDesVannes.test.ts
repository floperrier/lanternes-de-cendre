import { describe, expect, it } from "vitest";

import { projeterCompagnonEtConseil } from "../application/conseil";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
  type FaitDeCampagne,
} from "./campagne";

function fait(id: string, moment = 10): FaitDeCampagne {
  return {
    id,
    cause: "preparation-du-conseil",
    acteurs: ["porte-lanterne"],
    cible: "conseil-des-vannes",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function preparerConseil(...faitsPreparatoires: string[]): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-CONSEIL-DES-VANNES");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 1_200, vitesse: 0 },
    routes: { ...initial.routes, position: "deversoir-noir" },
    narration: {
      evenementActif: null,
      evenementsJoues: [
        "bassins.deversoir.la-conduite-zero",
        "bassins.deversoir.la-tempete-aux-vannes",
      ],
      faitsDeCampagne: [
        {
          id: "compagnon.ilyana-voss.affectee-intendance",
          cause: "affectation.porte-lanterne",
          acteurs: ["porte-lanterne", "ilyana-voss"],
          cible: "intendance",
          moment: 0,
          effets: { materiels: [], humains: [] },
        },
        fait("bassins.deversoir.conseil-convoque", 1_190),
        ...faitsPreparatoires.map((id) => fait(id)),
      ],
    },
  };
}

describe("Conseil des Vannes", () => {
  it("ne projette que les décisions réellement préparées, plus la contrainte", () => {
    const projection = projeterCompagnonEtConseil(
      preparerConseil(
        "bassins.haut-puits.pacte-partage",
        "bassins.haut-puits.decanteur-documente",
      ),
    );

    expect(projection.conseil?.id).toBe("conseil.des-vannes");
    expect(
      projection.conseil?.sujets[0]?.decisions.map(({ id }) => id),
    ).toEqual([
      "partager-reserves",
      "reparer-decanteur",
      "contraindre-vannes",
    ]);
  });

  it("refuse une fausse option et conserve toujours la coercition explicite", () => {
    const etat = preparerConseil();
    expect(() =>
      appliquerCommande(etat, {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "reparer-decanteur",
      }),
    ).toThrow("pas été préparée");

    expect(
      projeterCompagnonEtConseil(etat).conseil?.sujets[0]?.decisions,
    ).toEqual([
      expect.objectContaining({ id: "contraindre-vannes" }),
    ]);
  });

  it("conserve une sortie coercitive même si Ilyana n’a pas été affectée", () => {
    const avecCompagnon = preparerConseil();
    const etat = {
      ...avecCompagnon,
      narration: {
        ...avecCompagnon.narration,
        faitsDeCampagne:
          avecCompagnon.narration.faitsDeCampagne.filter(
            (fait) =>
              fait.id !==
              "compagnon.ilyana-voss.affectee-intendance",
          ),
      },
    };

    expect(
      projeterCompagnonEtConseil(etat).conseil?.sujets[0]?.decisions,
    ).toEqual([
      expect.objectContaining({ id: "contraindre-vannes" }),
    ]);
    expect(
      appliquerCommande(etat, {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "contraindre-vannes",
      }).etat.narration.faitsDeCampagne.at(-1)?.id,
    ).toBe("bassins.conseil.vannes-contraintes");
  });

  it("inscrit le décanteur comme transformation majeure sans solution finale", () => {
    const transition = appliquerCommande(
      preparerConseil("bassins.haut-puits.decanteur-documente"),
      {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "reparer-decanteur",
      },
    );

    expect(transition.etat.hautPuits.projetChoisi).toBe(
      "decanteur-itinerant",
    );
    expect(transition.etat.hautPuits.projetRegional).toEqual({
      id: "decanteur-itinerant",
      statut: "retenu",
      retenuA: 1_200,
      scelleA: null,
      coutMateriaux: 0,
    });
    expect(transition.etat).not.toHaveProperty("solutionFinale");
    expect(transition.etat.narration.faitsDeCampagne.at(-1)).toMatchObject({
      id: "bassins.conseil.decanteur-repare",
      cause: "conseil.des-vannes",
      cible: "conseil-des-vannes",
    });
  });

  it("inscrit durablement la nouvelle orientation régionale de la Cohorte", () => {
    const transition = appliquerCommande(
      preparerConseil("veille-basse.cohorte-accueillie"),
      {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "reorienter-cohorte",
      },
    );

    expect(transition.etat.veilleBasse.cohorte.orientationRegionale).toBe(
      "arche-des-deplaces",
    );
    expect(transition.etat.hautPuits.projetRegional).toMatchObject({
      id: "arche-des-deplaces",
      statut: "retenu",
    });
  });

  it("rend les deux Colonies fragiles quand les réserves préparées sont partagées", () => {
    const transition = appliquerCommande(
      {
        ...preparerConseil("bassins.haut-puits.pacte-partage"),
        hautPuits: {
          ...preparerConseil().hautPuits,
          colonie: {
            ...preparerConseil().hautPuits.colonie,
            statut: "fragile",
            devenir: "partage-organise",
            pressions: ["reserves-entamees"],
          },
          relationPublique: "cooperative",
          engagementsDiplomatiques: [
            {
              id: "haut-puits.partage-au-conseil-des-vannes",
              prisA: 10,
              echoPrevu: "conseil-des-vannes",
            },
          ],
          decisionPriseA: 10,
        },
      },
      {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "partager-reserves",
      },
    );

    expect(transition.etat.hautPuits.colonie.statut).toBe("fragile");
    expect(transition.etat.veilleBasse.colonie.statut).toBe("fragile");
  });
});
