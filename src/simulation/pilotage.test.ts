import { describe, expect, expectTypeOf, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "./campagne";
import type { CommandeDeDoctrine } from "./pilotage";

describe("pilotage économique du Tronçon de route", () => {
  it("distingue les cinq stocks des trois capacités du convoi", () => {
    const etat = creerCampagneInitiale("CENDRE-01");

    expect(Object.keys(etat.pilotage.economie.stocks)).toEqual([
      "vivres",
      "eau",
      "combustible",
      "materiaux",
      "remedes",
    ]);
    expect(Object.keys(etat.pilotage.economie.capacites)).toEqual([
      "chaleur",
      "main-d-oeuvre",
      "charge",
    ]);
  });

  it("refuse une durée qui briserait l'horloge logique entière", () => {
    const etat = creerCampagneInitiale("CENDRE-01");

    expect(() =>
      appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: -1,
      }),
    ).toThrow("une durée entière positive ou nulle");
    expect(() =>
      appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 0.5,
      }),
    ).toThrow("une durée entière positive ou nulle");
  });

  it("borne chaque stock à zéro pendant un voyage prolongé", () => {
    const transition = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 100 * 3_600,
      },
    );

    for (const stock of Object.values(
      transition.etat.pilotage.economie.stocks,
    )) {
      expect(stock.quantite).toBe(0);
      expect(stock.reliquatDeFlux).toBe(0);
    }
  });
});

describe("Doctrine du convoi", () => {
  it("corrèle chaque politique à ses seules positions valides", () => {
    expectTypeOf<{
        readonly type: "doctrine.regler";
        readonly politique: "allure";
        readonly position: "strict";
      }>()
      .not.toMatchTypeOf<CommandeDeDoctrine>();

    expect(() =>
      appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
        type: "doctrine.regler",
        politique: "allure",
        position: "strict",
      } as unknown as CommandeDeDoctrine),
    ).toThrow("ne convient pas à la politique");
  });

  it("rejette une politique runtime inconnue avec une erreur du domaine", () => {
    expect(() =>
      appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
        type: "doctrine.regler",
        politique: "inconnue",
        position: "strict",
      } as unknown as CommandeDeDoctrine),
    ).toThrow("La politique « inconnue » est inconnue.");
  });

  it("rend visible la transition avant d'appliquer la nouvelle position", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");

    const engagement = appliquerCommande(etatInitial, {
      type: "doctrine.regler",
      politique: "entretien",
      position: "preventif",
    });

    expect(etatInitial.pilotage.doctrine.entretien).toEqual({
      position: "equilibre",
      transition: null,
    });
    expect(engagement.etat.pilotage.doctrine.entretien).toEqual({
      position: "equilibre",
      transition: {
        position: "preventif",
        appliqueA: 30,
      },
    });
    expect(engagement.evenements).toEqual([
      {
        type: "doctrine.transition-engagee",
        politique: "entretien",
        position: "preventif",
        appliqueA: 30,
      },
    ]);

    const avantEcheance = appliquerCommande(engagement.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 29,
    });
    expect(avantEcheance.etat.pilotage.doctrine.entretien.position).toBe(
      "equilibre",
    );

    const aEcheance = appliquerCommande(avantEcheance.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 1,
    });
    expect(aEcheance.etat.pilotage.doctrine.entretien).toEqual({
      position: "preventif",
      transition: null,
    });
    expect(aEcheance.evenements).toContainEqual({
      type: "doctrine.position-appliquee",
      politique: "entretien",
      position: "preventif",
      appliqueA: 30,
    });
  });
});

describe("Incident ordinaire", () => {
  it("résout l'échéance par la Doctrine sans effet irréversible silencieux", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");

    expect(etatInitial.pilotage.incidentActif).toMatchObject({
      id: "purification.pompe-instable",
      cause: "Usure du joint de la pompe de purification",
      priorite: "preserver-habitants",
      annonceA: 0,
      echeance: 120,
      incertitude: {
        source: "Inspection de l’Atelier",
        releveeA: 0,
      },
    });

    const transition = appliquerCommande(etatInitial, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 120,
    });

    expect(transition.etat.pilotage.incidentActif).toBeNull();
    expect(
      transition.etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(82);
    const resolution = {
      type: "incident.resolu",
      incidentId: "purification.pompe-instable",
      mode: "doctrine",
      decision: "isoler-circuit",
      cause: "purification.pompe-instable",
      facteurs: {
        entretien: "equilibre",
        priorite: "preserver-habitants",
        materiauxDisponibles: 84,
      },
      effets: {
        materiels: [
          { type: "stock.modifie", stock: "materiaux", variation: -2 },
          {
            type: "installation.etat-modifie",
            installation: "pompe-purification",
            etat: "stabilisee",
          },
        ],
        humains: [{ type: "habitants.exposes", nombre: 0 }],
      },
      faitProduit:
        "incident.purification.pompe-instable.circuit-isole",
      moment: 120,
    } as const;
    expect(transition.evenements).toContainEqual(resolution);
    expect(transition.etat.narration.faitsDeCampagne).toEqual([
      {
        id: "incident.purification.pompe-instable.circuit-isole",
        cause: "purification.pompe-instable",
        acteurs: ["porte-lanterne", "equipes-entretien"],
        cible: "pompe-purification",
        moment: 120,
        effets: resolution.effets,
      },
    ]);
  });

  it("accepte un ordre explicite avant l'échéance", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");

    const transition = appliquerCommande(etatInitial, {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "securiser-pompe",
    });

    expect(transition.etat.pilotage.incidentActif).toBeNull();
    expect(
      transition.etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(81);
    expect(transition.evenements).toEqual([
      expect.objectContaining({
        type: "incident.resolu",
        incidentId: "purification.pompe-instable",
        mode: "ordre-explicite",
        decision: "securiser-pompe",
        effets: {
          materiels: [
            { type: "stock.modifie", stock: "materiaux", variation: -3 },
            {
              type: "installation.etat-modifie",
              installation: "pompe-purification",
              etat: "securisee",
            },
          ],
          humains: [{ type: "habitants.exposes", nombre: 0 }],
        },
        faitProduit: "incident.purification.pompe-instable.securisee",
        moment: 0,
      }),
    ]);
    expect(transition.etat.narration.faitsDeCampagne).toHaveLength(1);
  });

  it("ordonne les effets irréversibles à leur échéance sans recalcul rétroactif", () => {
    const aUneMinuteQuarante = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 100,
      },
    ).etat;
    const doctrineEnTransition = appliquerCommande(aUneMinuteQuarante, {
      type: "doctrine.regler",
      politique: "entretien",
      position: "preventif",
    }).etat;

    const transition = appliquerCommande(doctrineEnTransition, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 31,
    });

    expect(
      transition.etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(82);
    expect(transition.etat.pilotage.doctrine.entretien.position).toBe(
      "preventif",
    );
    expect(
      transition.evenements.filter(
        (evenement) =>
          evenement.type === "incident.resolu" ||
          evenement.type === "doctrine.position-appliquee",
      ),
    ).toEqual([
      expect.objectContaining({
        type: "incident.resolu",
        decision: "isoler-circuit",
        moment: 120,
      }),
      {
        type: "doctrine.position-appliquee",
        politique: "entretien",
        position: "preventif",
        appliqueA: 130,
      },
    ]);
  });
});
