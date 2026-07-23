import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterCompagnonEtConseil } from "../application/conseil";
import { projeterInfrastructure } from "../application/infrastructure";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
  type FaitDeCampagne,
} from "./campagne";

function fait(id: string): FaitDeCampagne {
  return {
    id,
    cause: "preparation-du-deversoir",
    acteurs: ["porte-lanterne"],
    cible: "relais-des-vannes",
    moment: 900,
    effets: { materiels: [], humains: [] },
  };
}

function auRelais(avecAccord = true): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-DEVERSOIR");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 1_200, vitesse: 1 },
    routes: { ...initial.routes, position: "relais-des-vannes" },
    narration: {
      evenementActif: null,
      evenementsJoues: [],
      faitsDeCampagne: [
        fait("compagnon.ilyana-voss.affectee-intendance"),
        fait("bassins.haut-puits.decanteur-documente"),
        ...(avecAccord
          ? [fait("bassins.nacelles.conseil-passage-partage")]
          : []),
      ],
    },
  };
}

function resoudreEtContinuer(
  etat: EtatCampagne,
  choixId: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement du Déversoir n’est actif.");
  }
  const resolu = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId,
  }).etat;
  return appliquerCommande(resolu, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

describe("passage du Déversoir Noir", () => {
  it("verrouille la conduite tant que les Nacelles n’ont pas porté un accord", () => {
    expect(() =>
      appliquerCommande(auRelais(false), {
        type: "engagement-de-route.confirmer",
        tronconId: "conduite-du-deversoir",
      }),
    ).toThrow("récit de la branche");
  });

  it("convertit le châssis refusé aux Projets majeurs en Plateforme standard", () => {
    const avantChassis = auRelais();
    const etat = appliquerCommande(
      {
        ...avantChassis,
        routes: {
          ...avantChassis.routes,
          position: "deversoir-noir",
        },
        narration: {
          ...avantChassis.narration,
          evenementActif: "bassins.deversoir.le-chassis-des-bassins",
        },
      },
      {
        type: "evenement-narratif.choisir",
        evenementId: "bassins.deversoir.le-chassis-des-bassins",
        choixId: "conserver-gabarits",
      },
    ).etat;

    expect(etat.citeCaravane.formation.plateformes).toHaveLength(6);
    expect(etat.infrastructure.plateformes.at(-1)).toMatchObject({
      id: "chassis-regional-des-bassins",
      type: "standard",
      quartierId: null,
      emplacements: [
        {
          id: "chassis-regional-des-bassins.habitable",
          categorie: "habitable",
          installation: null,
        },
        {
          id: "chassis-regional-des-bassins.technique",
          categorie: "technique",
          installation: null,
        },
        {
          id: "chassis-regional-des-bassins.polyvalent",
          categorie: "polyvalent",
          installation: null,
        },
      ],
    });
    expect(etat.hautPuits.projetRegional).toBeNull();
    expect(
      projeterInfrastructure(etat).plateformes.at(-1),
    ).toMatchObject({
      nom: "Châssis régional des Bassins",
      projetRegional: null,
    });
  });

  it("enchaîne le mystère, le conflit, le Conseil et deux conséquences avant le passage régional", () => {
    let etat = appliquerCommande(auRelais(), {
      type: "engagement-de-route.confirmer",
      tronconId: "conduite-du-deversoir",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;
    expect(etat.routes.position).toBe("deversoir-noir");
    expect(etat.narration.evenementActif).toBe(
      "bassins.deversoir.la-conduite-zero",
    );

    etat = resoudreEtContinuer(etat, "relever-interface");
    expect(etat.narration.evenementActif).toBe(
      "bassins.deversoir.la-tempete-aux-vannes",
    );
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.deversoir.la-tempete-aux-vannes",
      choixId: "convoquer-delegations",
    }).etat;

    expect(
      projeterCompagnonEtConseil(etat).conseil?.sujets[0]?.decisions.map(
        ({ id }) => id,
      ),
    ).toEqual(["reparer-decanteur", "contraindre-vannes"]);
    etat = appliquerCommande(etat, {
      type: "conseil.decider",
      conseilId: "conseil.des-vannes",
      sujetId: "eau-cohorte-et-deversoir",
      decisionId: "reparer-decanteur",
    }).etat;
    expect(etat.hautPuits.projetChoisi).toBe("decanteur-itinerant");
    expect(etat.hautPuits.projetRegional).toMatchObject({
      statut: "retenu",
    });

    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 0,
    }).etat;
    expect(etat.narration.evenementActif).toBe(
      "bassins.deversoir.le-chassis-des-bassins",
    );
    const materiauxAvantScellement =
      etat.pilotage.economie.stocks.materiaux.quantite;
    etat = resoudreEtContinuer(etat, "sceller-transformation");
    expect(etat.hautPuits.projetChoisi).toBe("decanteur-itinerant");
    expect(etat.hautPuits.projetRegional).toMatchObject({
      id: "decanteur-itinerant",
      statut: "scelle",
      coutMateriaux: 12,
    });
    expect(etat.pilotage.economie.stocks.materiaux.quantite).toBe(
      materiauxAvantScellement - 12,
    );
    expect(etat.citeCaravane.formation.plateformes).toHaveLength(6);
    expect(etat.infrastructure.plateformes).toHaveLength(6);
    expect(
      projeterInfrastructure(etat).plateformes.at(-1),
    ).toMatchObject({
      nom: "Châssis régional des Bassins",
      projetRegional: {
        service: expect.stringContaining("Purification mobile"),
        contrainte: expect.stringContaining("équipe hydraulique"),
      },
    });
    expect(etat.narration.evenementActif).toBe(
      "bassins.deversoir.le-passage-sans-retour",
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.informations,
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Haut-Puits"),
        expect.stringContaining("Maison des Filtres (abandonné)"),
        expect.stringContaining("Hospice du Sillon (abandonné)"),
        expect.stringContaining("Nacelles (actif)"),
        expect.stringContaining("Lieux non rejoints"),
        expect.stringContaining(
          "Décanteur itinérant, scellée dans le châssis",
        ),
      ]),
    );
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.deversoir.le-passage-sans-retour",
      choixId: "consigner-abandons",
    }).etat;
    expect(etat.devenirsDesSites).toEqual({
      maisonDesFiltres: "abandonne",
      vanniers: "abandonne",
      hospiceDuSillon: "abandonne",
      nacelles: "actif",
    });
    const devenirsScelles = etat.devenirsDesSites;

    const engagement = appliquerCommande(etat, {
      type: "engagement-de-route.confirmer",
      tronconId: "passage-de-la-ligne-zero",
    });
    expect(engagement.etat.routes.engagements.at(-1)).toMatchObject({
      tronconId: "passage-de-la-ligne-zero",
      origine: "deversoir-noir",
      destination: "lisiere-trame-de-fer",
    });
    expect(engagement.etat.devenirsDesSites).toEqual(devenirsScelles);
  });
});
