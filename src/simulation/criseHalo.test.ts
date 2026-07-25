import { describe, expect, it } from "vitest";

import { projeterCrises } from "../application/crise";
import { projeterPilotage } from "../application/pilotage";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import { creerEtatDesCrisesInitial } from "./crise";
import type { FaitDeCampagne } from "./faits";

function fait(id: string, moment = 5_000): FaitDeCampagne {
  return {
    id,
    cause: "couronne.ouverture.le-dernier-conseil-de-la-couronne",
    acteurs: ["porte-lanterne", "delegations-de-la-couronne"],
    cible: "verrous-du-noeud",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function etatEligible(
  graine = "CENDRE-HALO",
  materiaux = 12,
): EtatCampagne {
  const initial = creerCampagneInitiale(graine);
  return {
    ...initial,
    tempsDuConvoi: { secondes: 5_000, vitesse: 1 },
    routes: { ...initial.routes, position: "anneau-interieur" },
    pilotage: {
      ...initial.pilotage,
      economie: {
        ...initial.pilotage.economie,
        stocks: {
          ...initial.pilotage.economie.stocks,
          materiaux: {
            ...initial.pilotage.economie.stocks.materiaux,
            quantite: materiaux,
          },
        },
      },
    },
    narration: {
      ...initial.narration,
      faitsDeCampagne: [
        fait("couronne.veille-des-trois.sanctuaire-renforce", 4_600),
        fait("couronne.approches.etalon-calibre", 4_700),
        fait("couronne.ouverture.phares-ouvertes", 4_900),
        fait("couronne.ouverture.clef-collective", 5_000),
      ],
    },
    crises: {
      ...creerEtatDesCrisesInitial(),
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
          statut: "accomplie",
          accomplieA: 1_100,
          manqueeA: null,
          faitResultat:
            "crise.recuperation.socle-de-survie.accomplie",
          coutApplique: [{ stock: "materiaux", quantite: 2 }],
        },
      ],
    },
  };
}

function annoncer(etat: EtatCampagne): EtatCampagne {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 2,
  }).etat;
}

function atteindreLaCrise(etat = etatEligible()): EtatCampagne {
  const alerte = annoncer(etat);
  const checkpoint = appliquerCommande(alerte, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "couronne-muette.saturation-du-halo",
  }).etat;
}

describe("Crise de saturation du Halo", () => {
  it("dérive une alerte locale des faits de la Couronne, du Phare et des héritages régionaux", () => {
    const alerteA = annoncer(etatEligible("GRAINE-A"));
    const alerteB = annoncer(etatEligible("GRAINE-B"));

    expect(alerteA.crises.alerte).toMatchObject({
      id: "couronne-muette.saturation-du-halo",
      cause: "couronne.ouverture.clef-collective",
      annonceeA: 5_000,
      ruptureA: 5_120,
      chaineVisible: expect.arrayContaining([
        expect.objectContaining({
          id: "couronne.ouverture.phares-ouvertes",
        }),
        expect.objectContaining({
          id: "cicatrice.rationnement-deau",
        }),
        expect.objectContaining({
          id: "recuperation.socle-de-survie.accomplie",
        }),
        expect.objectContaining({ id: "phare.halo-sature-annonce" }),
      ]),
    });
    expect(alerteB.crises.alerte).toEqual(alerteA.crises.alerte);
    expect(alerteA.crises.approvisionnementEau).toBe("assure");

    const sansCicatrice = etatEligible();
    expect(
      annoncer({
        ...sansCicatrice,
        crises: {
          ...sansCicatrice.crises,
          historique: [],
          cicatrices: [],
          recuperations: [],
        },
      }).crises.alerte,
    ).toBeNull();

    const phareDejaSature = etatEligible();
    expect(
      annoncer({
        ...phareDejaSature,
        citeCaravane: {
          ...phareDejaSature.citeCaravane,
          phare: "halo-sature",
        },
      }).crises.alerte,
    ).toBeNull();
  });

  it("attend les Crises antérieures et interdit l’engagement vers le Nœud avant la résolution", () => {
    const alerte = annoncer(etatEligible());
    expect(() =>
      appliquerCommande(alerte, {
        type: "engagement-de-route.confirmer",
        tronconId: "passage-de-la-couronne-ouverte",
      }),
    ).toThrow("saturation du Halo");

    const avecCriseAnterieure = etatEligible();
    const avecCriseActive = {
      ...avecCriseAnterieure,
      crises: {
        ...avecCriseAnterieure.crises,
        criseActive: {
          id: "penurie-eau.pompe-purification" as const,
          cause:
            "incident.purification.pompe-instable.debit-maintenu" as const,
          declencheeA: 5_000,
          faitProduit: "crise.purification.eau-contaminee" as const,
          chaineVisible: [],
        },
      },
    };
    expect(() => annoncer(avecCriseActive)).toThrow(
      "La Crise doit être résolue",
    );
    expect(avecCriseActive.crises.alerte).toBeNull();
  });

  it("suspend le Temps au checkpoint et conserve deux réponses coûteuses quand les Matériaux manquent", () => {
    const enCrise = atteindreLaCrise(etatEligible("CENDRE-HALO-PAUVRE", 0));
    expect(enCrise.tempsDuConvoi).toEqual({
      secondes: 5_120,
      vitesse: 0,
    });
    expect(enCrise.citeCaravane.phare).toBe("halo-sature");

    const habitants = enCrise.citeCaravane.habitants;
    const releve = appliquerCommande(enCrise, {
      type: "crise.resoudre",
      criseId: "couronne-muette.saturation-du-halo",
      reponseId: "relayer-halo-par-les-veilleurs",
    }).etat;
    expect(releve.citeCaravane).toMatchObject({
      habitants: habitants - 5,
      phare: "actif",
    });
    expect(releve.crises).toMatchObject({
      alerte: null,
      criseActive: null,
      cicatrices: expect.arrayContaining([
        expect.objectContaining({
          id: "cicatrice.veilleurs-lies-au-halo",
        }),
      ]),
      recuperations: expect.arrayContaining([
        expect.objectContaining({
          garantie: "releve-des-veilleurs-au-noeud",
          destination: "noeud-central",
          condition: "rejoindre-noeud-central",
          statut: "amorcee",
        }),
      ]),
    });

    const dernierRecours = appliquerCommande(
      atteindreLaCrise(etatEligible("CENDRE-HALO-RECOURS", 0)),
      {
        type: "crise.resoudre",
        criseId: "couronne-muette.saturation-du-halo",
        reponseId: "condamner-couronne-exterieure",
      },
    ).etat;
    expect(dernierRecours.citeCaravane.habitants).toBe(habitants - 11);
    expect(dernierRecours.crises.cicatrices.at(-1)?.id).toBe(
      "cicatrice.couronne-exterieure-condamnee",
    );
  });

  it("ne survient qu’une fois après sa résolution", () => {
    const resolu = appliquerCommande(atteindreLaCrise(), {
      type: "crise.resoudre",
      criseId: "couronne-muette.saturation-du-halo",
      reponseId: "stabiliser-anneau-du-halo",
    }).etat;
    expect(annoncer(resolu).crises.alerte).toBeNull();
  });

  it("projette en français et en anglais la chaîne réelle, les coûts et la Récupération", () => {
    const alerte = annoncer(etatEligible());
    expect(projeterCrises(alerte, "fr").alerte).toMatchObject({
      titre: "Aggravation annoncée — saturation du Halo",
      cause: expect.stringContaining("fragilités régionales"),
      echeance: "dans 2 min",
      chaineVisible: expect.arrayContaining([
        expect.stringContaining("Phares"),
        expect.stringContaining("rationnement"),
        expect.stringContaining("Socle de survie"),
        expect.stringContaining("deux minutes locales"),
      ]),
    });

    const enCrise = atteindreLaCrise(etatEligible());
    expect(projeterCrises(enCrise, "en").active).toMatchObject({
      titre: "Crisis — Silent Crown Halo saturation",
      cause: expect.stringContaining("Scars"),
      chaineVisible: expect.arrayContaining([
        expect.stringContaining("Water rationing"),
        expect.stringContaining("Convoy Time is paused"),
      ]),
      reponses: [
        expect.objectContaining({
          id: "stabiliser-anneau-du-halo",
          coutConnu: "6 Materials",
          viable: true,
        }),
        expect.objectContaining({
          id: "relayer-halo-par-les-veilleurs",
          coutConnu: "5 inhabitants assigned",
          viable: true,
        }),
        expect.objectContaining({
          id: "condamner-couronne-exterieure",
          dernierRecours: true,
          viable: true,
        }),
      ],
    });

    const resolu = appliquerCommande(enCrise, {
      type: "crise.resoudre",
      criseId: "couronne-muette.saturation-du-halo",
      reponseId: "relayer-halo-par-les-veilleurs",
    }).etat;
    expect(projeterCrises(resolu, "fr").recuperations.at(-1)).toMatchObject({
      garantie: "Relève des Veilleurs au Nœud",
      destination: "Nœud central",
      condition: "Atteindre le Nœud central pour organiser la relève.",
      cout: "Coût du Tronçon vers Nœud central",
    });
    expect(
      projeterPilotage(resolu, "fr").journalCausal.slice(-2),
    ).toMatchObject([
      {
        titre: "Crise de la Couronne — saturation du Halo",
        cause: "Clef du Nœud consignée collectivement",
        cible: "Halo du Phare",
      },
      {
        titre: "Crise du Halo — veille humaine relayée",
        cause: "Saturation du Halo dans la Couronne muette",
        cible: "Veille du Halo",
      },
    ]);
    expect(
      projeterPilotage(resolu, "en").journalCausal.at(-1),
    ).toMatchObject({
      titre: "Halo crisis — human watch relayed",
      cause: "Halo saturation in the Silent Crown",
      cible: "Halo watch",
    });
  });
});
