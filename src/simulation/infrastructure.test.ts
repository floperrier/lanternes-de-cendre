import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import {
  CATALOGUE_D_INSTALLATIONS,
  compterEmplacements,
  trouverEmplacement,
} from "./infrastructure";

function deployerHalte(etat = creerCampagneInitiale("CENDRE-01")) {
  const enPause = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 0,
  }).etat;
  return appliquerCommande(enPause, { type: "halte.deployer" }).etat;
}

function engagerCondenseur(etat = deployerHalte()) {
  return appliquerCommande(etat, {
    type: "chantier.engager",
    ordre: {
      type: "construction",
      definitionId: "condenseur-thermique",
      emplacementId: "intendance.polyvalent",
    },
    priorite: "haute",
  }).etat;
}

function reprendreTemps(etat: EtatCampagne) {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 1,
  }).etat;
}

describe("structure physique initiale de la Cité-caravane", () => {
  it("porte cinq Plateformes, quatre Quartiers, huit installations et quatre Emplacements libres", () => {
    const etat = creerCampagneInitiale("CENDRE-01");
    const emplacements = etat.infrastructure.plateformes.flatMap(
      (plateforme) => plateforme.emplacements,
    );

    expect(etat.citeCaravane.formation.plateformes).toEqual([
      "phare",
      "intendance",
      "foyers",
      "machines",
      "atelier-operations",
    ]);
    expect(etat.infrastructure.plateformes).toHaveLength(5);
    expect(
      etat.infrastructure.plateformes.filter(
        (plateforme) => plateforme.type === "standard",
      ),
    ).toHaveLength(4);
    expect(
      etat.infrastructure.quartiers.map((quartier) => quartier.id),
    ).toEqual(["intendance", "foyers", "machines", "atelier-operations"]);
    expect(compterEmplacements(etat.infrastructure)).toEqual({
      techniques: 4,
      habitables: 4,
      polyvalents: 4,
      installations: 8,
      libres: 4,
    });
    expect(
      emplacements.filter((emplacement) => emplacement.installation === null),
    ).toHaveLength(4);
    expect(
      emplacements.reduce(
        (total, emplacement) =>
          total +
          (emplacement.installation === null
            ? 0
            : CATALOGUE_D_INSTALLATIONS[emplacement.installation.definitionId]
                .effetsEconomiques.demandeDeMainDOeuvre),
        0,
      ),
    ).toBe(etat.pilotage.economie.capacites["main-d-oeuvre"].demande);
  });

  it("donne à chaque installation un Contrat commun et trois états matériels", () => {
    for (const definition of Object.values(CATALOGUE_D_INSTALLATIONS)) {
      expect(definition).toMatchObject({
        postesRequis: expect.any(Number),
        effetThermique: expect.any(Number),
        charge: expect.stringMatching(/^(faible|normale|forte)$/),
        entretien: expect.stringMatching(/^(faible|normal|fort)$/),
      });
      expect(
        Object.values(definition.effetsEconomiques.fluxDeStocks).some(
          (variation) => variation !== 0,
        ) ||
          definition.effetsEconomiques.demandeDeChaleur !== 0 ||
          definition.effetsEconomiques.demandeDeMainDOeuvre !== 0 ||
          definition.effetsEconomiques.demandeDeCharge !== 0 ||
          definition.effetsEconomiques.equipesDEntretien !== 0 ||
          definition.effetsEconomiques.materiauxDEntretienParHeure !== 0,
      ).toBe(true);
    }
  });
});

describe("Déploiement de halte et Chantiers structurels", () => {
  it("explique pourquoi toute opération structurelle est refusée en voyage", () => {
    const enVoyage = creerCampagneInitiale("CENDRE-01");
    const ordres = [
      {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      {
        type: "demontage",
        emplacementId: "machines.technique-2",
      },
      {
        type: "deplacement",
        origineId: "intendance.technique",
        destinationId: "foyers.polyvalent",
      },
    ] as const;

    for (const ordre of ordres) {
      expect(() =>
        appliquerCommande(enVoyage, {
          type: "chantier.engager",
          ordre,
          priorite: "normale",
        }),
      ).toThrow("Déploiement de halte");
    }
  });

  it("exige l’immobilité pour déployer la Halte puis accepte les trois ordres", () => {
    const enVoyage = creerCampagneInitiale("CENDRE-01");
    expect(() =>
      appliquerCommande(enVoyage, { type: "halte.deployer" }),
    ).toThrow("suspendre le Temps du convoi");

    const enHalte = deployerHalte(enVoyage);
    expect(enHalte.infrastructure.deploiement).toBe("halte");

    const ordres = [
      {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      {
        type: "demontage",
        emplacementId: "machines.technique-2",
      },
      {
        type: "deplacement",
        origineId: "intendance.technique",
        destinationId: "foyers.polyvalent",
      },
    ] as const;
    for (const ordre of ordres) {
      const transition = appliquerCommande(enHalte, {
        type: "chantier.engager",
        ordre,
        priorite: "normale",
      });
      expect(transition.etat.infrastructure.chantierActif).toMatchObject({
        ordre,
        priorite: "normale",
      });
    }
  });

  it.each([
    ["Emplacement", (etat: EtatCampagne) => etat, "intendance.technique"],
    [
      "Charge",
      (etat: EtatCampagne): EtatCampagne => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            capacites: {
              ...etat.pilotage.economie.capacites,
              charge: {
                ...etat.pilotage.economie.capacites.charge,
                demande: 78,
              },
            },
          },
        },
      }),
      "intendance.polyvalent",
    ],
    [
      "Main-d’œuvre",
      (etat: EtatCampagne): EtatCampagne => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            capacites: {
              ...etat.pilotage.economie.capacites,
              "main-d-oeuvre": {
                ...etat.pilotage.economie.capacites["main-d-oeuvre"],
                demande: 11,
              },
            },
          },
        },
      }),
      "intendance.polyvalent",
    ],
    [
      "Chaleur",
      (etat: EtatCampagne): EtatCampagne => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            capacites: {
              ...etat.pilotage.economie.capacites,
              chaleur: {
                ...etat.pilotage.economie.capacites.chaleur,
                demande: 75,
              },
            },
          },
        },
      }),
      "intendance.polyvalent",
    ],
    [
      "Entretien",
      (etat: EtatCampagne): EtatCampagne => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            capacites: {
              ...etat.pilotage.economie.capacites,
              "main-d-oeuvre": {
                ...etat.pilotage.economie.capacites["main-d-oeuvre"],
                demande: 10,
              },
            },
          },
        },
      }),
      "intendance.polyvalent",
    ],
  ] as const)(
    "refuse le Chantier quand la contrainte de %s est dépassée",
    (contrainte, modifier, emplacementId) => {
      const etat = modifier(deployerHalte());
      expect(() =>
        appliquerCommande(etat, {
          type: "chantier.engager",
          ordre: {
            type: "construction",
            definitionId: "condenseur-thermique",
            emplacementId,
          },
          priorite: "haute",
        }),
      ).toThrow(contrainte);
    },
  );

  it("protège la dernière fonction vitale et réserve les Matériaux d’un déplacement", () => {
    const enHalte = deployerHalte();
    expect(() =>
      appliquerCommande(enHalte, {
        type: "chantier.engager",
        ordre: { type: "demontage", emplacementId: "intendance.technique" },
        priorite: "normale",
      }),
    ).toThrow("dernière fonction vitale");

    const sansMateriaux: EtatCampagne = {
      ...enHalte,
      pilotage: {
        ...enHalte.pilotage,
        economie: {
          ...enHalte.pilotage.economie,
          stocks: {
            ...enHalte.pilotage.economie.stocks,
            materiaux: {
              ...enHalte.pilotage.economie.stocks.materiaux,
              quantite: 4,
            },
          },
        },
      },
    };
    expect(() =>
      appliquerCommande(sansMateriaux, {
        type: "chantier.engager",
        ordre: {
          type: "deplacement",
          origineId: "intendance.technique",
          destinationId: "foyers.polyvalent",
        },
        priorite: "normale",
      }),
    ).toThrow("Matériaux disponibles");
  });

  it("consomme au rythme prévu puis transforme silhouette et économie sans muter les états antérieurs", () => {
    const chantierEngage = reprendreTemps(engagerCondenseur());
    const aMiParcours = appliquerCommande(chantierEngage, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    });

    expect(chantierEngage.pilotage.economie.stocks.materiaux.quantite).toBe(84);
    expect(aMiParcours.etat.infrastructure.chantierActif).toMatchObject({
      progression: 30,
      dureePrevue: 60,
      materiauxConsommes: 6,
      coutMateriaux: 12,
    });
    expect(aMiParcours.etat.pilotage.economie.stocks.materiaux.quantite).toBe(
      78,
    );

    const achevement = appliquerCommande(aMiParcours.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    });
    const emplacement = trouverEmplacement(
      achevement.etat.infrastructure,
      "intendance.polyvalent",
    );

    expect(achevement.etat.infrastructure.chantierActif).toBeNull();
    expect(achevement.etat.infrastructure.chantiersTermines).toHaveLength(1);
    expect(emplacement.installation).toMatchObject({
      definitionId: "condenseur-thermique",
      etatMateriel: "operationnelle",
      installeeA: 60,
    });
    expect(achevement.etat.pilotage.economie).toMatchObject({
      stocks: {
        eau: { fluxParHeure: -30 },
        combustible: { fluxParHeure: -32 },
        materiaux: { quantite: 72 },
      },
      capacites: {
        chaleur: { demande: 74 },
        "main-d-oeuvre": { demande: 11 },
        charge: { demande: 72 },
      },
      entretien: { equipesMobilisees: 3, materiauxParHeure: 3 },
    });
    expect(achevement.evenements).toContainEqual(
      expect.objectContaining({
        type: "chantier.termine",
        installationId: "intendance.polyvalent.condenseur-thermique",
        moment: 60,
      }),
    );
    expect(aMiParcours.etat.infrastructure.chantierActif).not.toBeNull();
  });
});
