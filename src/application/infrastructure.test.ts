import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
} from "../simulation/campagne";
import {
  projeterImplantationPixi,
  projeterInfrastructure,
} from "./infrastructure";

describe("projection de l’infrastructure", () => {
  it("expose les Plateformes, les fiches d’installation et les Emplacements libres", () => {
    const projection = projeterInfrastructure(
      creerCampagneInitiale("CENDRE-01"),
    );

    expect(projection.plateformes).toHaveLength(5);
    expect(projection.installations).toHaveLength(8);
    expect(projection.emplacementsLibres).toHaveLength(4);
    expect(projection.installations[0]).toMatchObject({
      nom: expect.any(String),
      service: expect.any(String),
      transformationsDeStocks: expect.any(Array),
      postesRequis: expect.any(Number),
      effetThermique: expect.any(Number),
      charge: expect.any(String),
      entretien: expect.any(String),
      consequences: {
        operationnelle: expect.any(String),
        degradee: expect.any(String),
        "hors-service": expect.any(String),
      },
    });
  });

  it("projette les textes compilés dans la langue demandée", () => {
    const projection = projeterInfrastructure(
      creerCampagneInitiale("CENDRE-01"),
      "en",
    );

    expect(projection.installations[0]).toMatchObject({
      nom: "Preserving kitchen",
      service: "Prepare and preserve the caravan-city's rations.",
      transformationsDeStocks: ["Raw food → preserved rations"],
    });
    expect(projection.definitionsConstructibles).toContainEqual({
      id: "condenseur-thermique",
      nom: "Thermal condenser",
    });
    expect(projection.plateformes.map((plateforme) => plateforme.nom)).toEqual([
      "Lighthouse Platform",
      "Stewardship",
      "Hearths",
      "Machinery",
      "Workshop–Operations",
    ]);
  });

  it("projette le rythme et les ressources d’un Chantier après reprise", () => {
    let etat = creerCampagneInitiale("CENDRE-01");
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    etat = appliquerCommande(etat, {
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "haute",
    }).etat;
    etat = appliquerCommande(
      appliquerCommande(etat, {
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 1,
      }).etat,
      { type: "temps-du-convoi.ecouler", secondesReelles: 30 },
    ).etat;

    expect(projeterInfrastructure(etat).chantierActif).toMatchObject({
      priorite: "Haute",
      progressionPourcent: 50,
      materiauxConsommes: 6,
      coutMateriaux: 12,
      secondesRestantes: 30,
    });

    const termine = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    }).etat;
    expect(
      projeterInfrastructure(termine).installations.find(
        (installation) =>
          installation.definitionId === "condenseur-thermique",
      ),
    ).toMatchObject({ charge: "forte" });
  });

  it("change l’implantation PixiJS après un déplacement sans changer le total", () => {
    let etat = creerCampagneInitiale("CENDRE-01");
    const avant = projeterInfrastructure(etat);
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    etat = appliquerCommande(etat, {
      type: "chantier.engager",
      ordre: {
        type: "deplacement",
        origineId: "intendance.technique",
        destinationId: "foyers.polyvalent",
      },
      priorite: "haute",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    }).etat;
    const apres = projeterInfrastructure(etat);

    expect(apres.installations).toHaveLength(avant.installations.length);
    expect(projeterImplantationPixi(apres)).not.toBe(
      projeterImplantationPixi(avant),
    );
    expect(
      apres.plateformes
        .find((plateforme) => plateforme.id === "foyers")
        ?.emplacements.find(
          (emplacement) => emplacement.id === "foyers.polyvalent",
        )?.installation,
    ).toBe("Station de filtration");
  });
});
