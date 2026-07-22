import { describe, expect, it } from "vitest";

import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  listerTronconsEngageables,
  traiterJalonsDeRoute,
} from "./routes";

describe("Engagement de route", () => {
  it("conserve l’état réel séparé de Renseignements datés et attribués", () => {
    const routes = creerEtatDesRoutesInitial();

    expect(routes.etatsReels["digue-des-puits"]).toBe("praticable");
    expect(routes.renseignements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          tronconId: "digue-des-puits",
          source: "vigie-du-phare",
          releveA: 0,
          etatAnnonce: "praticable",
        }),
        expect.objectContaining({
          tronconId: "digue-des-puits",
          source: "messagers-de-haut-puits",
          releveA: -7_200,
          etatAnnonce: "degrade",
        }),
      ]),
    );
    expect(listerTronconsEngageables(routes).map(({ troncon }) => troncon.id))
      .toEqual(["digue-des-puits", "chaussee-de-veille-basse"]);
  });

  it("condamne causalement l’accès arrière au Jalon et ouvre la liaison aval", () => {
    const routesInitiales = creerEtatDesRoutesInitial();
    const engagement = confirmerEngagementDeRoute(
      routesInitiales,
      "digue-des-puits",
      30,
    );

    expect(engagement.etat.engagements).toEqual([
      {
        id: "engagement-1",
        tronconId: "digue-des-puits",
        origine: "halte-du-puits-sec",
        destination: "haut-puits",
        engageA: 30,
        arriveeA: 390,
        statut: "en-cours",
      },
    ]);
    expect(engagement.evenements).toEqual([
      {
        type: "engagement-de-route.confirme",
        engagementId: "engagement-1",
        tronconId: "digue-des-puits",
        origine: "halte-du-puits-sec",
        destination: "haut-puits",
        arriveeA: 390,
        consommationsAppliquees: { combustible: 3, eau: 4 },
      },
    ]);

    const avantJalon = traiterJalonsDeRoute(engagement.etat, 30, 389);
    expect(avantJalon.etat).toBe(engagement.etat);
    expect(avantJalon.evenements).toEqual([]);

    const auJalon = traiterJalonsDeRoute(engagement.etat, 30, 420);
    expect(auJalon.etat.position).toBe("haut-puits");
    expect(auJalon.etat.etatsReels["digue-des-puits"]).toBe("coupe");
    expect(auJalon.etat.engagements[0]).toMatchObject({ statut: "termine" });
    expect(auJalon.etat.jalons).toEqual([
      {
        id: "jalon-route-1",
        type: "fin-de-troncon",
        moment: 390,
        tronconId: "digue-des-puits",
        cause: "front-de-cendre.condamnation-arriere",
      },
    ]);
    expect(auJalon.evenements).toEqual([
      {
        type: "jalon-du-monde.atteint",
        jalonId: "jalon-route-1",
        moment: 390,
        cause: "engagement-1",
      },
      {
        type: "etat-de-route.modifie",
        tronconId: "digue-des-puits",
        etatPrecedent: "praticable",
        etat: "coupe",
        cause: "front-de-cendre.condamnation-arriere",
        moment: 390,
      },
    ]);

    const nouvellesDestinations = listerTronconsEngageables(auJalon.etat);
    expect(
      nouvellesDestinations.map(({ destination, troncon }) => ({
        destination,
        tronconId: troncon.id,
      })),
    ).toEqual([
      {
        destination: "relais-des-vannes",
        tronconId: "chenal-des-vannes",
      },
    ]);
    expect(nouvellesDestinations).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ destination: "halte-du-puits-sec" }),
      ]),
    );
  });
});
