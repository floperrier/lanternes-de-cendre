import { describe, expect, it } from "vitest";

import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  listerTronconsEngageables,
  traiterJalonsDeRoute,
  type EtatDesRoutes,
  type IdentifiantDeTroncon,
} from "./routes";

function parcourir(
  troncons: readonly IdentifiantDeTroncon[],
): EtatDesRoutes {
  let routes = creerEtatDesRoutesInitial();
  let seconde = 0;
  for (const tronconId of troncons) {
    const engagement = confirmerEngagementDeRoute(
      routes,
      tronconId,
      seconde,
    ).etat;
    const arrivee = engagement.engagements.at(-1)?.arriveeA;
    if (arrivee === undefined) {
      throw new Error("L’Engagement de route attendu est absent.");
    }
    routes = traiterJalonsDeRoute(
      engagement,
      seconde,
      arrivee,
    ).etat;
    seconde = arrivee;
  }
  return routes;
}

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
        destination: "les-vanniers",
        tronconId: "chemin-des-vanniers",
      },
      {
        destination: "veille-basse",
        tronconId: "nacelles-de-veille-basse",
      },
    ]);
    expect(
      nouvellesDestinations.find(
        ({ troncon }) => troncon.id === "chemin-des-vanniers",
      )?.troncon,
    ).toMatchObject({
      consequenceDuHalo: {
        fr: expect.stringContaining("panache"),
        en: expect.stringContaining("plume"),
      },
      renseignements: [
        expect.objectContaining({
          releveA: 0,
          source: "eclaireurs-de-haut-puits",
        }),
      ],
    });
    expect(nouvellesDestinations).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ destination: "halte-du-puits-sec" }),
      ]),
    );

    const versLesVanniers = confirmerEngagementDeRoute(
      auJalon.etat,
      "chemin-des-vanniers",
      420,
    ).etat;
    const auxVanniers = traiterJalonsDeRoute(
      versLesVanniers,
      420,
      840,
    ).etat;
    expect(
      listerTronconsEngageables(auxVanniers).map(
        ({ destination, troncon }) => ({
          destination,
          tronconId: troncon.id,
        }),
      ),
    ).toEqual([
      {
        destination: "relais-des-vannes",
        tronconId: "chenal-des-vannes",
      },
    ]);

    const versLeRelais = confirmerEngagementDeRoute(
      auxVanniers,
      "chenal-des-vannes",
      840,
    ).etat;
    const auRelais = traiterJalonsDeRoute(
      versLeRelais,
      840,
      1_140,
    ).etat;
    expect(auRelais.position).toBe("relais-des-vannes");
    expect(listerTronconsEngageables(auRelais)).toEqual([
      expect.objectContaining({
        destination: "deversoir-noir",
        troncon: expect.objectContaining({
          id: "conduite-du-deversoir",
        }),
      }),
    ]);
  });

  it("ouvre depuis Veille-Basse la liaison aval vers Haut-Puits et la voie de l’Hospice", () => {
    const engagement = confirmerEngagementDeRoute(
      creerEtatDesRoutesInitial(),
      "chaussee-de-veille-basse",
      0,
    ).etat;
    const aVeilleBasse = traiterJalonsDeRoute(
      engagement,
      0,
      480,
    ).etat;

    expect(
      listerTronconsEngageables(aVeilleBasse).map(
        ({ troncon, destination }) => ({
          tronconId: troncon.id,
          destination,
        }),
      ),
    ).toEqual([
      {
        tronconId: "nacelles-de-veille-basse",
        destination: "haut-puits",
      },
      {
        tronconId: "chemin-de-l-hospice",
        destination: "hospice-du-sillon",
      },
    ]);
  });

  it("offre une Ligne Zéro optionnelle pour le passage direct vers la Trame", () => {
    const initial = creerEtatDesRoutesInitial();
    const depuisLeRelais = {
      ...initial,
      position: "relais-des-vannes" as const,
    };
    const versLeDeversoir = confirmerEngagementDeRoute(
      depuisLeRelais,
      "conduite-du-deversoir",
      1_000,
    ).etat;
    const auDeversoir = traiterJalonsDeRoute(
      versLeDeversoir,
      1_000,
      1_360,
    ).etat;

    expect(
      listerTronconsEngageables(auDeversoir).map(
        ({ troncon, destination }) => ({
          tronconId: troncon.id,
          destination,
        }),
      ),
    ).toEqual([
      {
        tronconId: "passage-de-la-ligne-zero",
        destination: "lisiere-trame-de-fer",
      },
      {
        tronconId: "piste-des-levees",
        destination: "lisiere-trame-de-fer",
      },
    ]);

    const versLaTrame = confirmerEngagementDeRoute(
      auDeversoir,
      "passage-de-la-ligne-zero",
      1_360,
    ).etat;
    const aLaTrame = traiterJalonsDeRoute(
      versLaTrame,
      1_360,
      1_840,
    ).etat;
    expect(aLaTrame.position).toBe("lisiere-trame-de-fer");
    expect(listerTronconsEngageables(aLaTrame)).toEqual([]);
  });

  it.each([
    [
      "branche naturelle de Haut-Puits",
      [
        "digue-des-puits",
        "chemin-des-vanniers",
        "chenal-des-vannes",
        "conduite-du-deversoir",
        "passage-de-la-ligne-zero",
      ],
      5,
    ],
    [
      "branche naturelle de Veille-Basse",
      [
        "chaussee-de-veille-basse",
        "chemin-de-l-hospice",
        "chenal-de-l-hospice",
        "conduite-du-deversoir",
        "piste-des-levees",
      ],
      5,
    ],
    [
      "liaison coûteuse depuis Haut-Puits",
      [
        "digue-des-puits",
        "nacelles-de-veille-basse",
        "chemin-de-l-hospice",
        "chenal-de-l-hospice",
        "conduite-du-deversoir",
        "passage-de-la-ligne-zero",
      ],
      6,
    ],
    [
      "liaison coûteuse depuis Veille-Basse",
      [
        "chaussee-de-veille-basse",
        "nacelles-de-veille-basse",
        "chemin-des-vanniers",
        "chenal-des-vannes",
        "conduite-du-deversoir",
        "piste-des-levees",
      ],
      6,
    ],
  ] as const)(
    "maintient %s dans un budget exact de %i Tronçons",
    (_nom, troncons, nombreAttendu) => {
      const routes = parcourir(troncons);

      expect(routes.position).toBe("lisiere-trame-de-fer");
      expect(routes.engagements).toHaveLength(nombreAttendu);
      expect(routes.jalons).toHaveLength(nombreAttendu);
      expect(listerTronconsEngageables(routes)).toEqual([]);
    },
  );

  it("rejoint aussi la Trame par les Levées sans traverser la Ligne Zéro", () => {
    const initial = creerEtatDesRoutesInitial();
    const auDeversoir = {
      ...initial,
      position: "deversoir-noir" as const,
    };
    const versLaTrame = confirmerEngagementDeRoute(
      auDeversoir,
      "piste-des-levees",
      0,
    ).etat;
    const aLaTrame = traiterJalonsDeRoute(
      versLaTrame,
      0,
      540,
    ).etat;
    expect(aLaTrame.position).toBe("lisiere-trame-de-fer");
    expect(
      aLaTrame.engagements.map(({ tronconId }) => tronconId),
    ).not.toContain("passage-de-la-ligne-zero");
  });

  it("relie les deux Colonies en aval sans retour arrière", () => {
    const initial = creerEtatDesRoutesInitial();
    const aVeilleBasse = {
      ...initial,
      position: "veille-basse" as const,
    };
    const versHautPuits = confirmerEngagementDeRoute(
      aVeilleBasse,
      "nacelles-de-veille-basse",
      0,
    ).etat;
    const aHautPuits = traiterJalonsDeRoute(
      versHautPuits,
      0,
      360,
    ).etat;

    expect(aHautPuits.position).toBe("haut-puits");
    expect(
      listerTronconsEngageables(aHautPuits).map(
        ({ troncon, destination }) => ({
          tronconId: troncon.id,
          destination,
        }),
      ),
    ).toEqual([
      {
        tronconId: "chemin-des-vanniers",
        destination: "les-vanniers",
      },
    ]);
  });
});
