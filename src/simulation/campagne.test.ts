import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
} from "./campagne";
import { creerInfrastructureInitiale } from "./infrastructure";
import { creerEtatDesExpeditionsInitial } from "./expeditions";
import { creerEtatInitialDeVeilleBasse } from "./veilleBasse";
import { creerEtatDeHautPuitsInitial } from "./hautPuits";
import { creerEtatInitialDeLaTrameDeFer } from "./trameFer";
import { creerEtatInitialDeTraverseLibre } from "./traverseLibre";

describe("Graine de campagne", () => {
  it("crée le même état initial sérialisable pour CENDRE-01", () => {
    const etat = creerCampagneInitiale("CENDRE-01");

    expect(JSON.parse(JSON.stringify(etat))).toEqual({
      version: 10,
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
            "intendance",
            "foyers",
            "machines",
            "atelier-operations",
          ],
        },
      },
      narration: {
        evenementActif: null,
        evenementsJoues: [],
        faitsDeCampagne: [],
      },
      crises: {
        approvisionnementEau: "assure",
        faitAnnonceurHistoriqueIgnore: false,
        alerte: null,
        criseActive: null,
        cicatrices: [],
        recuperations: [],
      },
      pilotage: {
        economie: {
          stocks: {
            vivres: {
              quantite: 920,
              unite: "rations",
              fluxParHeure: -46,
              reliquatDeFlux: 0,
            },
            eau: {
              quantite: 760,
              unite: "litres",
              fluxParHeure: -38,
              reliquatDeFlux: 0,
            },
            combustible: {
              quantite: 540,
              unite: "litres",
              fluxParHeure: -30,
              reliquatDeFlux: 0,
            },
            materiaux: {
              quantite: 84,
              unite: "pieces",
              fluxParHeure: -2,
              reliquatDeFlux: 0,
            },
            remedes: {
              quantite: 36,
              unite: "doses",
              fluxParHeure: -1,
              reliquatDeFlux: 0,
            },
          },
          capacites: {
            chaleur: {
              production: 78,
              demande: 70,
              unite: "kilowatts",
            },
            "main-d-oeuvre": {
              production: 12,
              demande: 9,
              unite: "equipes",
            },
            charge: { production: 80, demande: 68, unite: "tonnes" },
          },
          entretien: {
            equipesMobilisees: 2,
            materiauxParHeure: 2,
          },
          prochainJalon: {
            nom: "Halte du puits sec",
            atteintA: 10_800,
            incertitude: {
              source: "Relevé de route du Phare",
              releveeA: 0,
              variationFluxPourcent: 10,
              explication: "Consommation variable de ±10 % selon la cendre",
            },
          },
        },
        doctrine: {
          rationnement: { position: "mesure", transition: null },
          allure: { position: "soutenue", transition: null },
          entretien: { position: "equilibre", transition: null },
          "delestage-thermique": {
            position: "equilibre",
            transition: null,
          },
        },
        incidentActif: {
          id: "purification.pompe-instable",
          titre: "Pompe de purification instable",
          cause: "Usure du joint de la pompe de purification",
          priorite: "preserver-habitants",
          annonceA: 0,
          echeance: 120,
          incertitude: {
            source: "Inspection de l’Atelier",
            releveeA: 0,
            observation: "Rupture possible avant la Halte du puits sec",
          },
        },
      },
      infrastructure: creerInfrastructureInitiale(),
      routes: expect.objectContaining({
        position: "halte-du-puits-sec",
        etatsReels: {
          "digue-des-puits": "praticable",
          "chaussee-de-veille-basse": "degrade",
          "chemin-des-vanniers": "praticable",
          "chenal-des-vannes": "praticable",
          "nacelles-de-veille-basse": "degrade",
          "chemin-de-l-hospice": "praticable",
          "chenal-de-l-hospice": "degrade",
          "conduite-du-deversoir": "praticable",
          "passage-de-la-ligne-zero": "praticable",
          "piste-des-levees": "degrade",
          "rampe-de-barriere-neuve": "praticable",
          "voie-des-ponts-lourds": "degrade",
          "embranchement-de-pompe-neuve": "degrade",
          "galerie-des-reservoirs": "degrade",
          "rocade-du-marche": "praticable",
          "voie-des-citernes": "degrade",
          "ligne-du-signal-zero": "praticable",
          "voie-des-contremaitres": "degrade",
          "traverse-des-porteurs": "degrade",
          "rocade-des-regulateurs": "praticable",
          "derivation-des-puits": "degrade",
          "faisceau-de-l-aiguillage-zero": "praticable",
          "passage-de-la-couronne-muette": "praticable",
        },
        engagements: [],
        jalons: [],
      }),
      echeances: [],
      expeditions: creerEtatDesExpeditionsInitial(),
      veilleBasse: creerEtatInitialDeVeilleBasse(),
      hautPuits: creerEtatDeHautPuitsInitial(),
      trameDeFer: creerEtatInitialDeLaTrameDeFer(),
      traverseLibre: creerEtatInitialDeTraverseLibre(),
      devenirsDesSites: null,
      fluxPseudoAleatoires: {
        "evenements-narratifs": {
          algorithme: "xoshiro128**",
          version: 1,
          etat: expect.arrayContaining([
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
            expect.any(Number),
          ]),
        },
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
    const etatAccelere = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;

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

describe("Engagement de route et Jalon du monde", () => {
  it("interdit de déployer la Halte pendant une traversée", () => {
    const enTraversee = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "engagement-de-route.confirmer",
        tronconId: "digue-des-puits",
      },
    ).etat;

    expect(() =>
      appliquerCommande(enTraversee, { type: "halte.deployer" }),
    ).toThrow("pendant une traversée");
  });

  it("interdit une traversée tant que la Halte est déployée ou un Chantier actif", () => {
    const enPause = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    const enHalte = appliquerCommande(enPause, {
      type: "halte.deployer",
    }).etat;

    expect(() =>
      appliquerCommande(enHalte, {
        type: "engagement-de-route.confirmer",
        tronconId: "digue-des-puits",
      }),
    ).toThrow("Halte doit être repliée");

    const enChantier = appliquerCommande(enHalte, {
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "haute",
    }).etat;
    expect(() =>
      appliquerCommande(enChantier, {
        type: "engagement-de-route.confirmer",
        tronconId: "digue-des-puits",
      }),
    ).toThrow("tout Chantier terminé");
  });

  it("annule le reliquat quand la consommation de route épuise exactement un stock", () => {
    const avantEngagement = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 71_622,
      },
    ).etat;

    expect(avantEngagement.pilotage.economie.stocks.eau).toMatchObject({
      quantite: 4,
      reliquatDeFlux: -36,
    });

    const engagement = appliquerCommande(avantEngagement, {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;

    expect(engagement.pilotage.economie.stocks.eau).toMatchObject({
      quantite: 0,
      reliquatDeFlux: 0,
    });
  });

  it("suspend le convoi à la confirmation puis condamne le retour au Jalon", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");

    const engagement = appliquerCommande(etatInitial, {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    });

    expect(engagement.etat.tempsDuConvoi.vitesse).toBe(0);
    expect(engagement.etat.pilotage.economie.stocks.combustible.quantite).toBe(
      537,
    );
    expect(engagement.etat.pilotage.economie.stocks.eau.quantite).toBe(756);
    expect(engagement.etat.routes.engagements[0]).toMatchObject({
      tronconId: "digue-des-puits",
      arriveeA: 360,
      statut: "en-cours",
    });
    expect(engagement.evenements).toEqual([
      {
        type: "engagement-de-route.confirme",
        engagementId: "engagement-1",
        tronconId: "digue-des-puits",
        origine: "halte-du-puits-sec",
        destination: "haut-puits",
        arriveeA: 360,
        consommationsAppliquees: { combustible: 3, eau: 4 },
      },
      {
        type: "temps-du-convoi.vitesse-modifiee",
        vitessePrecedente: 1,
        vitesse: 0,
      },
    ]);

    const reparti = appliquerCommande(engagement.etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    const arrivee = appliquerCommande(reparti, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    });

    expect(arrivee.etat.routes.position).toBe("haut-puits");
    expect(arrivee.etat.routes.etatsReels["digue-des-puits"]).toBe("coupe");
    expect(arrivee.evenements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "jalon-du-monde.atteint",
          moment: 360,
        }),
        expect.objectContaining({
          type: "etat-de-route.modifie",
          cause: "front-de-cendre.condamnation-arriere",
        }),
      ]),
    );
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
            effets: {
              materiels: [],
              humains: [{ type: "habitants.modifies", variation: 6 }],
            },
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

describe("parcours narratif de la Démonstration", () => {
  it("enchaîne quatre familles de prologue puis le conflit des Bassins au premier Jalon", () => {
    let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;

    const choixDuPrologue = [
      ["prologue.signaux-sous-la-cendre", "accueillir"],
      ["prologue.reponse-du-phare", "consigner-harmonique"],
      ["prologue.filtres-de-la-veille", "proteger-foyers"],
      ["prologue.ilyana-au-clapet", "confier-clapet"],
    ] as const;
    for (const [evenementId, choixId] of choixDuPrologue) {
      expect(etat.narration.evenementActif).toBe(evenementId);
      etat = appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId,
        choixId,
      }).etat;
      if (evenementId !== "prologue.ilyana-au-clapet") {
        etat = appliquerCommande(etat, {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 1,
        }).etat;
      }
    }
    expect(etat.narration.evenementActif).toBeNull();

    etat = appliquerCommande(etat, {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;

    expect(etat.routes.position).toBe("haut-puits");
    expect(etat.narration.evenementActif).toBe(
      "bassins-fendus.eau-de-haut-puits",
    );
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins-fendus.eau-de-haut-puits",
      choixId: "promettre-partage",
    }).etat;
    expect(etat.narration.evenementsJoues).toEqual([
      "prologue.signaux-sous-la-cendre",
      "prologue.reponse-du-phare",
      "prologue.filtres-de-la-veille",
      "prologue.ilyana-au-clapet",
      "bassins-fendus.eau-de-haut-puits",
    ]);
  });

  it("refuse le deuxième Tronçon tant que le récit irréversible de la branche reste actif", () => {
    let etat = creerCampagneInitiale("CENDRE-01");
    etat = appliquerCommande(etat, {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;

    expect(() =>
      appliquerCommande(etat, {
        type: "engagement-de-route.confirmer",
        tronconId: "chemin-des-vanniers",
      }),
    ).toThrow(
      "Le récit de la branche doit être résolu avant cet Engagement irréversible.",
    );
  });
});
