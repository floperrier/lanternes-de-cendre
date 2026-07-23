import { describe, expect, it } from "vitest";

import {
  accueillirOuOrienterLaCohorte,
  creerEtatInitialDeVeilleBasse,
  deciderPourMaelys,
  franchirJalonDeVeilleBasse,
  laisserPasserLOccasionDIntervenir,
  menacerVeilleBasse,
  perdreVeilleBasse,
  traiterEcheancesDeVeilleBasse,
} from "./veilleBasse";

describe("Veille-Basse et la Cohorte du Sillon", () => {
  it("expose la Colonie fragile, ses deux Pressions et la Cohorte persistante", () => {
    expect(creerEtatInitialDeVeilleBasse()).toEqual({
      colonie: {
        id: "veille-basse",
        statut: "fragile",
        pressions: ["afflux-deplaces", "filtres-satures"],
        marche: [
          {
            id: "filtres-contre-releve",
            statut: "disponible",
            cout: "releve-du-phare-mobile",
            gain: "filtres-etanches",
          },
          {
            id: "renfort-contre-materiaux",
            statut: "disponible",
            cout: "materiaux-de-charpente",
            gain: "renfort-des-techniciens",
          },
        ],
        archives: {
          etat: "scellees",
          revelationEssentielle: null,
        },
        techniciens: {
          equipesDisponibles: 2,
          affectation: "maintien-des-filtres",
        },
        avertissementDePerte: null,
      },
      hospiceDuSillon: {
        id: "hospice-du-sillon",
        besoin: "places-filtrees",
        devenir: "ouvert",
      },
      cohorte: {
        id: "cohorte-du-sillon",
        origine: "camp-des-digues",
        destination: "veille-basse",
        taille: 18,
        etatDominant: "epuisee",
        specialite: "charpente-etanche",
        memoire: "aucune",
        integration: {
          statut: "en-attente",
          chargeDAccueil: null,
          equipesIntegrees: 0,
        },
      },
      maelysRive: {
        decision: null,
        position: "veille-basse",
        releveDeLHospice: "non-planifie",
      },
      consequencesDifferees: [],
      revelationsEssentielles: [],
    });
  });

  it("transforme l’accueil en Charge puis en équipes après l’intégration annoncée", () => {
    const accueil = accueillirOuOrienterLaCohorte(
      creerEtatInitialDeVeilleBasse(),
      "accueillir",
      1_000,
    );

    expect(accueil.etat.cohorte).toMatchObject({
      memoire: "aidee",
      destination: "cite-caravane",
      integration: {
        statut: "charge-accueil",
        chargeDAccueil: {
          habitants: 18,
          commenceA: 1_000,
          integrationPrevueA: 1_600,
          cause: "veille-basse.la-place-sous-le-phare",
        },
        equipesIntegrees: 0,
      },
    });
    expect(
      traiterEcheancesDeVeilleBasse(accueil.etat, 1_000, 1_599).etat.cohorte
        .integration.statut,
    ).toBe("charge-accueil");

    const integration = traiterEcheancesDeVeilleBasse(
      accueil.etat,
      1_000,
      1_600,
    );

    expect(integration.etat.cohorte.integration).toEqual({
      statut: "equipes-integrees",
      chargeDAccueil: null,
      equipesIntegrees: 2,
    });
    expect(integration.evenements).toContainEqual({
      type: "cohorte.integration-terminee",
      cohorteId: "cohorte-du-sillon",
      equipesCreees: 2,
      cause: "veille-basse.la-place-sous-le-phare",
      moment: 1_600,
    });
  });

  it.each([
    {
      decision: "refuser" as const,
      memoire: "refusee",
      destination: "hors-de-veille-basse",
      consequenceId: "veille-basse.cohorte-refusee-revient-aux-portes",
      devenirHospice: "ouvert",
    },
    {
      decision: "rediriger" as const,
      memoire: "redirigee",
      destination: "hospice-du-sillon",
      consequenceId: "veille-basse.hospice-accueille-la-cohorte",
      devenirHospice: "sous-charge",
    },
  ])(
    "rend la conséquence différée d’un choix « $decision » attribuable",
    ({
      decision,
      memoire,
      destination,
      consequenceId,
      devenirHospice,
    }) => {
      const decisionPrise = accueillirOuOrienterLaCohorte(
        creerEtatInitialDeVeilleBasse(),
        decision,
        2_000,
      );

      expect(decisionPrise.etat.cohorte).toMatchObject({
        memoire,
        destination,
      });
      const manifestation = franchirJalonDeVeilleBasse(
        decisionPrise.etat,
        2_600,
      );

      expect(manifestation.evenements).toContainEqual({
        type: "consequence-differee.manifestee",
        consequenceId,
        cause: `veille-basse.cohorte-${decision === "refuser" ? "refusee" : "redirigee"}`,
        moment: 2_600,
      });
      expect(manifestation.etat.hospiceDuSillon.devenir).toBe(
        devenirHospice,
      );
      expect(
        manifestation.etat.consequencesDifferees[0],
      ).toMatchObject({
        programmeeA: 2_000,
        jalonPrevuA: 2_600,
        manifesteeA: 2_600,
        statut: "manifestee",
      });
    },
  );

  it.each([
    {
      decision: "confier-coffret" as const,
      memoire: "coffret-confie",
      position: "hospice-du-sillon",
      releve: "rapide-en-cours",
      equipes: 1,
      jalon: 4_300,
    },
    {
      decision: "garder-equipes" as const,
      memoire: "equipes-prioritaires",
      position: "veille-basse",
      releve: "lent-en-cours",
      equipes: 2,
      jalon: 4_600,
    },
  ])(
    "rend persistante la voie « $decision » de Maëlys jusqu’au Jalon suivant",
    ({ decision, memoire, position, releve, equipes, jalon }) => {
      const decidee = deciderPourMaelys(
        creerEtatInitialDeVeilleBasse(),
        decision,
        4_000,
      );

      expect(decidee.maelysRive).toEqual({
        decision: memoire,
        position,
        releveDeLHospice: releve,
      });
      expect(decidee.colonie.techniciens.equipesDisponibles).toBe(equipes);

      const terminee = franchirJalonDeVeilleBasse(decidee, jalon).etat;
      expect(terminee.maelysRive).toEqual({
        decision: memoire,
        position: "veille-basse",
        releveDeLHospice: "termine",
      });
      expect(terminee.colonie.techniciens.equipesDisponibles).toBe(2);
    },
  );

  it("interdit de perdre Veille-Basse avant avertissement et occasion d’intervention", () => {
    const initial = creerEtatInitialDeVeilleBasse();

    expect(() => perdreVeilleBasse(initial, 3_000)).toThrow(
      "Veille-Basse doit être avertie",
    );

    const avertie = menacerVeilleBasse(
      initial,
      "veille-basse.cohorte-refusee-revient-aux-portes",
      3_000,
    );
    expect(avertie.colonie).toMatchObject({
      statut: "fragile",
      avertissementDePerte: {
        avertiA: 3_000,
        cause: "veille-basse.cohorte-refusee-revient-aux-portes",
        occasionDIntervention: "offerte",
      },
    });
    expect(() => perdreVeilleBasse(avertie, 3_001)).toThrow(
      "occasion d’intervention",
    );

    const occasionIgnoree = laisserPasserLOccasionDIntervenir(
      avertie,
      3_600,
    );
    expect(
      franchirJalonDeVeilleBasse(occasionIgnoree, 3_899).etat.colonie
        .statut,
    ).toBe("fragile");
    expect(
      franchirJalonDeVeilleBasse(occasionIgnoree, 3_900).etat.colonie
        .statut,
    ).toBe("perdue");
  });
});
