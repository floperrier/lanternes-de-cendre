import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import { projeterHautPuits } from "./hautPuits";

describe("projection de Haut-Puits", () => {
  it("rend la Colonie, son Marché fini et ses devenirs consultables", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const projection = projeterHautPuits({
      ...etatInitial,
      routes: { ...etatInitial.routes, position: "haut-puits" },
    });

    expect(projection).toMatchObject({
      visible: true,
      titre: "Haut-Puits",
      colonie: {
        statut: "Stable",
        devenir: "Négociation ouverte",
        pressions: ["Autonomie hydrique menacée"],
        relationPublique: "Transactionnelle",
        engagementsDiplomatiques: [],
      },
      marche: {
        titre: "Marché de l’eau",
        offres: [
          {
            id: "eau-contre-materiaux",
            besoin: "Pièces de filtration",
            echangesRestants: 1,
            mouvements: ["Eau +60 L", "Matériaux −8"],
            disponible: true,
          },
          {
            id: "eau-contre-remedes",
            besoin: "Remèdes pour les puisatiers",
            echangesRestants: 1,
            mouvements: ["Eau +35 L", "Remèdes −4"],
            disponible: true,
          },
        ],
      },
      projets: [
        "Décanteur itinérant — possibilité à étudier",
        "Arche des déplacés — possibilité à étudier",
      ],
      projetChoisi: null,
      negociation: {
        ouverte: true,
        decisions: [
          expect.objectContaining({ id: "partager-eau" }),
          expect.objectContaining({ id: "proteger-reserves" }),
        ],
      },
    });
  });

  it("reste masquée hors de Haut-Puits et localise les échos diplomatiques", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    expect(projeterHautPuits(etatInitial, "en").visible).toBe(false);
    expect(
      projeterHautPuits({
        ...etatInitial,
        routes: {
          ...etatInitial.routes,
          position: "haut-puits",
          engagements: [
            {
              id: "engagement-1",
              tronconId: "chemin-des-vanniers",
              origine: "haut-puits",
              destination: "les-vanniers",
              engageA: 0,
              arriveeA: 420,
              statut: "en-cours",
            },
          ],
        },
      }).visible,
    ).toBe(false);

    const projection = projeterHautPuits(
      {
        ...etatInitial,
        routes: { ...etatInitial.routes, position: "haut-puits" },
        hautPuits: {
          ...etatInitial.hautPuits,
          engagementsDiplomatiques: [
            {
              id: "haut-puits.partage-au-conseil-des-vannes",
              prisA: 390,
              echoPrevu: "conseil-des-vannes",
            },
          ],
        },
      },
      "en",
    );
    expect(projection.colonie.engagementsDiplomatiques).toEqual([
      "Water-sharing pledge — to be echoed at the Sluice Council (06:30)",
    ]);
  });
});
