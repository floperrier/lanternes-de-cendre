import { describe, expect, it } from "vitest";

import {
  appliquerCommandeAHautPuits,
  creerEtatDeHautPuitsInitial,
} from "../simulation/hautPuits";
import {
  appliquerCommande,
  creerCampagneInitiale,
} from "../simulation/campagne";
import { creerPilotageInitial } from "../simulation/pilotage";
import { estCommande, lireEtatCourant } from "./validation";
import { estEtatDeHautPuits } from "./validationHautPuits";

function atteindreLePacteDesCiternes() {
  let etat = creerCampagneInitiale("CENDRE-01");
  const trajet = [
    {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 90 },
  ] as const;
  for (const commande of trajet) {
    etat = appliquerCommande(etat, commande).etat;
  }
  const prologue = [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
    ["bassins-fendus.eau-de-haut-puits", "promettre-partage"],
  ] as const;
  for (const [evenementId, choixId] of prologue) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 0,
    }).etat;
  }
  return etat;
}

function atteindreHautPuitsAvecTroisLitresDEau() {
  return appliquerCommande(atteindreLePacteDesCiternes(), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 17_760,
  }).etat;
}

describe("validation de Haut-Puits", () => {
  it("accepte les états initiaux et les transitions causales du Marché", () => {
    const initial = creerEtatDeHautPuitsInitial();
    expect(estEtatDeHautPuits(initial, 0)).toBe(true);

    const echange = appliquerCommandeAHautPuits(
      initial,
      creerPilotageInitial().economie.stocks,
      {
        type: "haut-puits.marche.echanger",
        offreId: "eau-contre-materiaux",
      },
      12,
    );
    expect(estEtatDeHautPuits(echange.etat, 12)).toBe(true);
  });

  it("refuse les pressions, offres et engagements forgés", () => {
    const initial = creerEtatDeHautPuitsInitial();
    expect(
      estEtatDeHautPuits(
        {
          ...initial,
          colonie: {
            ...initial.colonie,
            pressions: [
              "autonomie-hydrique-menacee",
              "reserves-entamees",
              "familles-ecartees",
            ],
          },
        },
        0,
      ),
    ).toBe(false);
    expect(
      estEtatDeHautPuits(
        {
          ...initial,
          marche: {
            offres: [
              {
                ...initial.marche.offres[0],
                mouvements: [{ stock: "eau", variation: 999 }],
              },
              initial.marche.offres[1],
            ],
          },
        },
        0,
      ),
    ).toBe(false);
    expect(
      estEtatDeHautPuits(
        {
          ...initial,
          engagementsDiplomatiques: [
            {
              id: "haut-puits.partage-au-conseil-des-vannes",
              prisA: 60,
              echoPrevu: "conseil-des-vannes",
            },
          ],
        },
        30,
      ),
    ).toBe(false);
    expect(
      estEtatDeHautPuits(
        {
          ...initial,
          projetChoisi: "decanteur-itinerant",
        },
        0,
      ),
    ).toBe(false);
  });

  it("valide strictement les commandes rejouables de Haut-Puits", () => {
    expect(
      estCommande({
        type: "haut-puits.marche.echanger",
        offreId: "eau-contre-remedes",
      }),
    ).toBe(true);
    expect(
      estCommande({
        type: "haut-puits.negociation.decider",
        decision: "partager-eau",
      }),
    ).toBe(false);
    expect(
      estCommande({
        type: "haut-puits.marche.echanger",
        offreId: "eau-infinie",
      }),
    ).toBe(false);
    expect(
      estCommande({
        type: "haut-puits.negociation.decider",
        decision: "annuler",
      }),
    ).toBe(false);
  });

  it("reconstruit les mouvements de stocks persistés du Marché", () => {
    let surPlace = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;
    surPlace = appliquerCommande(surPlace, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    surPlace = appliquerCommande(surPlace, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;
    const apresEchange = appliquerCommande(surPlace, {
      type: "haut-puits.marche.echanger",
      offreId: "eau-contre-materiaux",
    }).etat;

    expect(lireEtatCourant(apresEchange)).toBeDefined();
    expect(
      lireEtatCourant({
        ...apresEchange,
        pilotage: {
          ...apresEchange.pilotage,
          economie: {
            ...apresEchange.pilotage.economie,
            stocks: {
              ...apresEchange.pilotage.economie.stocks,
              eau: {
                ...apresEchange.pilotage.economie.stocks.eau,
                quantite:
                  apresEchange.pilotage.economie.stocks.eau.quantite + 1,
              },
            },
          },
        },
      }),
    ).toBeUndefined();
  });

  it("refuse un échange horodaté hors de Haut-Puits", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const echangeForge = appliquerCommandeAHautPuits(
      initial.hautPuits,
      initial.pilotage.economie.stocks,
      {
        type: "haut-puits.marche.echanger",
        offreId: "eau-contre-materiaux",
      },
      0,
    );

    expect(
      lireEtatCourant({
        ...initial,
        hautPuits: echangeForge.etat,
        pilotage: {
          ...initial.pilotage,
          economie: {
            ...initial.pilotage.economie,
            stocks: echangeForge.stocks,
          },
        },
      }),
    ).toBeUndefined();
  });

  it("exige que la décision politique provienne du Pacte narratif", () => {
    const pacte = atteindreLePacteDesCiternes();
    const resolu = appliquerCommande(pacte, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.pacte-des-citernes",
      choixId: "ouvrir-citerne",
    }).etat;
    expect(lireEtatCourant(resolu)).toBeDefined();

    const decisionSansFait = appliquerCommandeAHautPuits(
      pacte.hautPuits,
      pacte.pilotage.economie.stocks,
      {
        type: "haut-puits.negociation.decider",
        decision: "proteger-reserves",
      },
      pacte.tempsDuConvoi.secondes,
    );
    expect(
      lireEtatCourant({
        ...pacte,
        hautPuits: decisionSansFait.etat,
      }),
    ).toBeUndefined();
  });

  it("accepte un échange puis un départ partageant le même timestamp", () => {
    let etat = appliquerCommande(atteindreLePacteDesCiternes(), {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.pacte-des-citernes",
      choixId: "garantir-autonomie",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 17_760,
    }).etat;
    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(3);

    etat = appliquerCommande(etat, {
      type: "haut-puits.marche.echanger",
      offreId: "eau-contre-materiaux",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "engagement-de-route.confirmer",
      tronconId: "chemin-des-vanniers",
    }).etat;

    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(58);
    expect(lireEtatCourant(etat)).toBeDefined();
  });

  it("accepte un échange puis le Pacte partageant le même timestamp", () => {
    let etat = atteindreHautPuitsAvecTroisLitresDEau();
    etat = appliquerCommande(etat, {
      type: "haut-puits.marche.echanger",
      offreId: "eau-contre-materiaux",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.pacte-des-citernes",
      choixId: "ouvrir-citerne",
    }).etat;

    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(33);
    expect(lireEtatCourant(etat)).toBeDefined();
  });

  it("accepte le Pacte puis un échange partageant le même timestamp", () => {
    let etat = atteindreHautPuitsAvecTroisLitresDEau();
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.pacte-des-citernes",
      choixId: "ouvrir-citerne",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "haut-puits.marche.echanger",
      offreId: "eau-contre-materiaux",
    }).etat;

    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(60);
    expect(lireEtatCourant(etat)).toBeDefined();
  });
});
