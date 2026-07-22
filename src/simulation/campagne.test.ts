import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
} from "./campagne";

describe("Graine de campagne", () => {
  it("crée le même état initial sérialisable pour CENDRE-01", () => {
    const etat = creerCampagneInitiale("CENDRE-01");

    expect(JSON.parse(JSON.stringify(etat))).toEqual({
      version: 1,
      graine: "CENDRE-01",
      tempsDuConvoi: {
        secondes: 0,
        vitesse: 1,
      },
      citeCaravane: {
        habitants: 184,
        phare: "actif",
        formation: {
          type: "grappe",
          plateformes: [
            "phare",
            "foyers",
            "atelier",
            "serres",
            "reservoirs",
            "vigie",
            "forge",
          ],
        },
      },
      narration: {
        evenementActif: null,
        evenementsJoues: [],
        faitsDeCampagne: [],
      },
    });
  });
});

describe("commandes du Temps du convoi", () => {
  it("suspend le Temps du convoi sans modifier l'état précédent", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");

    const transition = appliquerCommande(etatInitial, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    });

    expect(etatInitial.tempsDuConvoi.vitesse).toBe(1);
    expect(transition.etat).not.toBe(etatInitial);
    expect(transition.etat.tempsDuConvoi).toEqual({
      secondes: 0,
      vitesse: 0,
    });
    expect(transition.evenements).toEqual([
      {
        type: "temps-du-convoi.vitesse-modifiee",
        vitessePrecedente: 1,
        vitesse: 0,
      },
    ]);
  });

  it("atteint la première minute selon la vitesse choisie", () => {
    const etatAccelere = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 4,
      },
    ).etat;

    const transition = appliquerCommande(etatAccelere, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });

    expect(transition.etat.tempsDuConvoi).toEqual({
      secondes: 60,
      vitesse: 4,
    });
    expect(transition.evenements).toEqual([
      {
        type: "temps-du-convoi.ecoule",
        secondeInitiale: 0,
        secondeFinale: 60,
      },
      {
        type: "temps-du-convoi.premiere-minute-atteinte",
        secondeAtteinte: 60,
      },
      {
        type: "evenement-narratif.declenche",
        evenementId: "prologue.signaux-sous-la-cendre",
        fenetre: "premiere-minute-atteinte",
      },
    ]);
    expect(transition.etat.narration.evenementActif).toBe(
      "prologue.signaux-sous-la-cendre",
    );
    expect(empreinteEtat(transition.etat)).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("Événement narratif de la première veille", () => {
  it("applique le même choix et le même Fait de campagne à état et Graine identiques", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const etatAvecEvenement = appliquerCommande(etatInitial, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;
    const commande = {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    } as const;

    const premiereTransition = appliquerCommande(etatAvecEvenement, commande);
    const secondeTransition = appliquerCommande(etatAvecEvenement, commande);

    expect(secondeTransition).toEqual(premiereTransition);
    expect(etatAvecEvenement.citeCaravane.habitants).toBe(184);
    expect(premiereTransition.etat).toMatchObject({
      citeCaravane: {
        habitants: 190,
      },
      narration: {
        evenementActif: null,
        evenementsJoues: ["prologue.signaux-sous-la-cendre"],
        faitsDeCampagne: [
          {
            id: "prologue.cohorte-accueillie",
            cause: "prologue.signaux-sous-la-cendre",
            acteurs: ["porte-lanterne", "cohorte-de-refugies"],
            cible: "cohorte-de-refugies",
            moment: 60,
          },
        ],
      },
    });
    expect(premiereTransition.evenements).toEqual([
      {
        type: "evenement-narratif.choix-resolu",
        evenementId: "prologue.signaux-sous-la-cendre",
        choixId: "accueillir",
        effets: [{ type: "habitants.modifier", valeur: 6 }],
        faitsProduits: ["prologue.cohorte-accueillie"],
      },
    ]);
  });
});
