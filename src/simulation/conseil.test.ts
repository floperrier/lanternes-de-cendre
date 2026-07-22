import { describe, expect, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "./campagne";
import {
  COMPAGNON_DE_REFERENCE,
  selectionnerVoixPertinentes,
} from "./conseil";
import {
  QUARTIER_INTENDANCE,
  QUARTIERS_MOBILES_CANONIQUES,
} from "./quartiers";

describe("Compagnon de référence", () => {
  it("porte une identité narrative complète sans jauge d’affinité", () => {
    expect(COMPAGNON_DE_REFERENCE).toEqual({
      id: "ilyana-voss",
      nom: "Ilyana Voss",
      competences: {
        majeure: "intendance",
        secondaire: "diplomatie",
      },
      trait: "minutieuse-intransigeante",
      conviction: "eau-sure-pour-tous",
      projet: "circuit-de-purification-redondant",
      etatPersonnel: {
        id: "brulures-de-cendre-stabilisees",
        contrainte: "eviter-eau-contaminee",
        voieDeSoin: "filtres-et-repos-en-halo",
      },
    });
    expect(COMPAGNON_DE_REFERENCE).not.toHaveProperty("affinite");
  });

  it("affecte à l’Intendance canonique sans remplacer son fonctionnement", () => {
    expect(QUARTIERS_MOBILES_CANONIQUES.map((quartier) => quartier.id)).toEqual(
      ["intendance", "foyers", "machines", "atelier-operations"],
    );
    expect(QUARTIER_INTENDANCE).toEqual({
      id: "intendance",
      occupation: {
        type: "tete-de-quartier",
        compagnonsMaximum: 1,
        quartierFonctionnelSansCompagnon: true,
      },
    });
  });

  it("devient affectée à l’Intendance par un Fait de campagne", () => {
    const transition = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "compagnon.affecter",
      compagnonId: "ilyana-voss",
      quartierId: "intendance",
    });

    expect(transition.etat.narration.faitsDeCampagne).toEqual([
      {
        id: "compagnon.ilyana-voss.affectee-intendance",
        cause: "affectation.porte-lanterne",
        acteurs: ["porte-lanterne", "ilyana-voss"],
        cible: "intendance",
        moment: 0,
        effets: { materiels: [], humains: [] },
      },
    ]);
    expect(transition.evenements).toEqual([
      {
        type: "compagnon.affectation-confirmee",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
        faitProduit: "compagnon.ilyana-voss.affectee-intendance",
        moment: 0,
      },
    ]);
  });
});

describe("pertinence des voix au Conseil", () => {
  it("retient au plus deux voix selon le score puis l’identifiant", () => {
    const voix = selectionnerVoixPertinentes([
      { compagnonId: "sira", criteres: ["competence-majeure"] },
      {
        compagnonId: "ilyana-voss",
        criteres: ["affectation-au-quartier", "competence-majeure"],
      },
      { compagnonId: "bastien", criteres: ["competence-majeure"] },
      { compagnonId: "noor", criteres: ["competence-secondaire"] },
    ]);

    expect(voix).toEqual([
      {
        compagnonId: "ilyana-voss",
        criteres: ["affectation-au-quartier", "competence-majeure"],
      },
      { compagnonId: "bastien", criteres: ["competence-majeure"] },
    ]);
  });
});

describe("premier Conseil", () => {
  it("inscrit la décision du Porte-Lanterne comme Fait causal", () => {
    const etatAffecte = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ).etat;

    const transition = appliquerCommande(etatAffecte, {
      type: "conseil.decider",
      conseilId: "conseil.premiere-veille",
      sujetId: "purification-et-partage-de-l-eau",
      decisionId: "securiser-circuit",
    });

    expect(transition.etat.narration.faitsDeCampagne.at(-1)).toEqual({
      id: "conseil.premiere-veille.circuit-securise",
      cause: "conseil.premiere-veille",
      acteurs: ["porte-lanterne", "ilyana-voss"],
      cible: "intendance",
      moment: 0,
      effets: { materiels: [], humains: [] },
    });
    expect(transition.evenements).toEqual([
      {
        type: "conseil.decision-inscrite",
        conseilId: "conseil.premiere-veille",
        sujetId: "purification-et-partage-de-l-eau",
        decisionId: "securiser-circuit",
        faitProduit: "conseil.premiere-veille.circuit-securise",
        moment: 0,
      },
    ]);
    expect(transition.etat).not.toHaveProperty("affinite");
  });

  it("refuse une décision sans Compagnon affecté", () => {
    expect(() =>
      appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
        type: "conseil.decider",
        conseilId: "conseil.premiere-veille",
        sujetId: "purification-et-partage-de-l-eau",
        decisionId: "maintenir-distribution",
      }),
    ).toThrow("Affectation");
  });
});
