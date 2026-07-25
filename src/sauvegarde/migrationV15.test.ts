import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { VERSION_SIMULATION_AVANT_EXTINCTION_DU_PHARE } from "../simulation/versions";
import {
  migrerSauvegardeV15,
  promouvoirEtatV15VersCourant,
} from "./migration";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_EXTINCTION_DU_PHARE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import type { EtatCampagneV15, ObjetInconnu } from "./validation";

function normaliserEnV15(etat: EtatCampagne): EtatCampagneV15 {
  return {
    ...etat,
    version: VERSION_SIMULATION_AVANT_EXTINCTION_DU_PHARE,
  };
}

function archiveV15(etat: EtatCampagne): ObjetInconnu {
  const etatV15 = normaliserEnV15(etat);
  const empreinte = empreinteEtat(etatV15 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v15-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_EXTINCTION_DU_PHARE,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_EXTINCTION_DU_PHARE,
    },
    graine: etatV15.graine,
    horloge: { secondes: etatV15.tempsDuConvoi.secondes },
    etat: etatV15,
    reproduction: {
      snapshot: etatV15,
      empreinteSnapshot: empreinte,
      commandes: [],
    },
    empreinte,
  };
}

describe("migration v15 avant l’Extinction du Phare", () => {
  it("promeut une archive v15 valide sans altérer son état", () => {
    const initiale = creerCampagneInitiale("MIGRATION-V15");
    const migration = migrerSauvegardeV15(archiveV15(initiale));

    expect(migration).toBeDefined();
    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      versions: { simulation: 16 },
      etat: {
        version: 16,
        denouement: { statut: "en-cours" },
        citeCaravane: { phare: "actif" },
      },
      reproduction: { commandes: [] },
    });
  });

  it("neutralise l’Extinction rétroactive dans tous les rejeux historiques", () => {
    const initiale = creerCampagneInitiale("MIGRATION-V15-HALO");
    const etatV15 = normaliserEnV15({
      ...initiale,
      tempsDuConvoi: { secondes: 5_000, vitesse: 1 },
      routes: { ...initiale.routes, position: "anneau-interieur" },
      pilotage: {
        ...initiale.pilotage,
        economie: {
          ...initiale.pilotage.economie,
          stocks: {
            ...initiale.pilotage.economie.stocks,
            materiaux: {
              ...initiale.pilotage.economie.stocks.materiaux,
              quantite: 0,
            },
          },
        },
      },
      narration: {
        ...initiale.narration,
        faitsDeCampagne: [
          {
            id: "couronne.ouverture.breche-ouverte",
            cause: "couronne.ouverture.le-diagnostic-des-verrous",
            acteurs: ["porte-lanterne"],
            cible: "couronne-muette",
            moment: 4_900,
            effets: { materiels: [], humains: [] },
          },
          {
            id: "couronne.ouverture.clef-collective",
            cause: "couronne.ouverture.ilyana-maelys-et-la-clef",
            acteurs: ["porte-lanterne"],
            cible: "clef-du-noeud",
            moment: 4_950,
            effets: { materiels: [], humains: [] },
          },
        ],
      },
      crises: {
        ...initiale.crises,
        historique: [
          {
            id: "penurie-eau.pompe-purification",
            cause: "incident.purification.pompe-instable.debit-maintenu",
            declencheeA: 900,
            faitDeclenchement: "crise.purification.eau-contaminee",
            resolueA: 900,
            reponseId: "isoler-et-rationner",
            faitResolution: "crise.purification.isoler-et-rationner",
          },
        ],
        cicatrices: [
          {
            id: "cicatrice.rationnement-deau",
            cause: "crise.purification.isoler-et-rationner",
            acquiseA: 900,
            irreversible: true,
          },
        ],
        recuperations: [
          {
            id: "recuperation.1",
            cause: "cicatrice.rationnement-deau",
            garantie: "socle-de-survie",
            destination: "halte-du-puits-sec",
            condition: "halte-de-purification",
            horizonTroncons: 2,
            coutAttendu: "deux-materiaux",
            amorceeA: 900,
            statut: "manquee",
            accomplieA: null,
            manqueeA: 1_100,
            faitResultat:
              "crise.recuperation.socle-de-survie.manquee",
            coutApplique: [],
          },
        ],
      },
    });
    const courant = promouvoirEtatV15VersCourant(etatV15);
    for (const crises of [
      "historiques-v13",
      "historiques-v14",
      "historiques-v15",
    ] as const) {
      const transition = appliquerCommande(
        courant,
        {
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 2,
        },
        { crises },
      );

      expect(transition.etat.crises.alerte?.id).not.toBe(
        "extinction-du-phare",
      );
      expect(transition.etat.denouement.statut).toBe("en-cours");
    }
  });
});
