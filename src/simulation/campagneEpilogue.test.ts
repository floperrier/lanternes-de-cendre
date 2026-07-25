import { describe, expect, it } from "vitest";

import { projeterEpilogue } from "../application/epilogue";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { FaitDeCampagne } from "./faits";
import { VARIANTES_FINALES_MAJEURES } from "./finale";

const VARIANTES = [
  [
    "finale.ancrage.refuge-commun",
    "finale.ancrage.la-derniere-negociation",
  ],
  [
    "finale.ancrage.citadelle-de-cendre",
    "finale.ancrage.la-derniere-negociation",
  ],
  [
    "finale.ancrage.dernier-rempart",
    "finale.ancrage.la-derniere-negociation",
  ],
  [
    "finale.reaccord.constellation",
    "finale.reaccord.la-derniere-negociation-du-reseau",
  ],
  [
    "finale.reaccord.reseau-de-fer",
    "finale.reaccord.la-derniere-negociation-du-reseau",
  ],
  [
    "finale.reaccord.veilles-dispersees",
    "finale.reaccord.la-derniere-negociation-du-reseau",
  ],
  [
    "finale.precipitation.ciel-rendu",
    "finale.precipitation.la-derniere-negociation-des-bassins",
  ],
  [
    "finale.precipitation.terre-des-sacrifies",
    "finale.precipitation.la-derniere-negociation-des-bassins",
  ],
  [
    "finale.precipitation.pluie-noire",
    "finale.precipitation.la-derniere-negociation-des-bassins",
  ],
] as const;

function fait(id: string): FaitDeCampagne {
  return {
    id,
    cause: "test.epilogue",
    acteurs: ["porte-lanterne"],
    cible: "coeur-du-noeud",
    moment: 4200,
    effets: { materiels: [], humains: [] },
  };
}

function apresVariante(
  variante: string,
  evenementDeConclusion: string,
): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-EPILOGUE");
  const selection = variante.startsWith("finale.ancrage.")
    ? "finale.ancrage.selection-preparee"
    : variante.startsWith("finale.reaccord.")
      ? "finale.reaccord.selection-preparee"
      : "finale.precipitation.selection-preparee";
  return {
    ...initial,
    tempsDuConvoi: { secondes: 4200, vitesse: 0 },
    routes: { ...initial.routes, position: "noeud-central" },
    narration: {
      ...initial.narration,
      evenementActif: null,
      evenementsJoues: [
        "finale.ancrage.le-contrat-des-trois-solutions",
        "finale.ancrage.choisir-d-ancrer-le-coeur",
        evenementDeConclusion,
      ],
      faitsDeCampagne: [
        fait(selection),
        fait(variante),
        fait("compagnon.ilyana-voss.affectee-intendance"),
      ],
    },
  };
}

function reveiller(etat: EtatCampagne): EtatCampagne {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

function choisir(etat: EtatCampagne, choixId: string): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement actif.");
  }
  return appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId,
  }).etat;
}

describe("parcours de l’Épilogue", () => {
  it("couvre exactement les neuf variantes majeures publiées par la bêta", () => {
    expect(
      VARIANTES.map(([variante]) => variante.split(".").at(-1)),
    ).toEqual(VARIANTES_FINALES_MAJEURES);
  });

  it("distingue l’arrivée au Nœud du Dénouement réussi et le rend irréversible", () => {
    const initiale = creerCampagneInitiale("CENDRE-DENOUEMENT");
    const arriveeAuNoeud = {
      ...initiale,
      routes: { ...initiale.routes, position: "noeud-central" as const },
    };

    expect(initiale.denouement).toEqual({ statut: "en-cours" });
    expect(arriveeAuNoeud.denouement).toEqual({ statut: "en-cours" });

    const revelation = reveiller(
      apresVariante(...VARIANTES[0]),
    );
    const veille = reveiller(
      choisir(revelation, "rendre-registre-public"),
    );
    const conclue = choisir(
      {
        ...veille,
        tempsDuConvoi: { ...veille.tempsDuConvoi, vitesse: 4 },
      },
      "partager-les-devenirs",
    );

    expect(conclue.denouement).toEqual({
      statut: "solution-finale",
      solution: "ancrer",
      variante: "refuge-commun",
      cause: "finale.ancrage.la-derniere-negociation",
      moment: 4200,
    });
    expect(conclue.tempsDuConvoi.vitesse).toBe(0);

    const empreinteAvantRefus = JSON.stringify(conclue);
    expect(() =>
      appliquerCommande(conclue, {
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 1,
      }),
    ).toThrow("La Campagne est déjà dénouée.");
    expect(JSON.stringify(conclue)).toBe(empreinteAvantRefus);
  });

  it.each(VARIANTES)(
    "garantit la révélation après %s",
    (variante, evenementDeConclusion) => {
      const revelation = reveiller(
        apresVariante(variante, evenementDeConclusion),
      );

      expect(revelation.narration.evenementActif).toBe(
        "epilogue.revelation.le-registre-des-rejets",
      );
    },
  );

  it("enchaîne révélation, histoire collective et restitution finale", () => {
    const revelation = reveiller(
      apresVariante(...VARIANTES[0]),
    );
    const veille = reveiller(
      choisir(revelation, "rendre-registre-public"),
    );
    expect(veille.narration.evenementActif).toBe(
      "epilogue.compagnons.le-dernier-tour-de-veille",
    );

    const conclue = choisir(veille, "partager-les-devenirs");
    expect(projeterEpilogue(conclue, "fr")).toMatchObject({
      visible: true,
      axes: [
        { libelle: "Stabilité technique" },
        { libelle: "Contrôle politique" },
        { libelle: "Coût humain" },
      ],
    });
    expect(conclue.narration.faitsDeCampagne.map(({ id }) => id)).toContain(
      "epilogue.compagnons.devenirs-partages",
    );
  });
});
