import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterTrameDeFer } from "../application/trameFer";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { IdentifiantDeTroncon } from "./routes";

function aLaLisiere(): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-TRAME");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 4 },
    routes: { ...initial.routes, position: "lisiere-trame-de-fer" },
    narration: {
      ...initial.narration,
      faitsDeCampagne: [
        {
          id: "bassins.deversoir.ligne-zero-relevee",
          cause: "bassins.deversoir.la-conduite-zero",
          acteurs: ["porte-lanterne"],
          cible: "conduite-de-la-ligne-zero",
          moment: 2_000,
          effets: { materiels: [], humains: [] },
        },
      ],
    },
  };
}

function voyager(
  etat: EtatCampagne,
  tronconId: IdentifiantDeTroncon,
): EtatCampagne {
  const engage = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId,
  }).etat;
  const enMarche = appliquerCommande(engage, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(enMarche, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 300,
  }).etat;
}

function resoudreEtContinuer(
  etat: EtatCampagne,
  choixId: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement de la Trame de Fer n’est actif.");
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

function sansStock(
  etat: EtatCampagne,
  stock: "combustible" | "eau" | "materiaux",
): EtatCampagne {
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          ...etat.pilotage.economie.stocks,
          [stock]: {
            ...etat.pilotage.economie.stocks[stock],
            quantite: 0,
          },
        },
      },
    },
  };
}

describe("voie principale de la Trame de Fer", () => {
  it("fait jouer Barrière-Neuve puis conserve l’état politique et matériel de Grand-Aiguillage", () => {
    let etat = voyager(aLaLisiere(), "rampe-de-barriere-neuve");
    expect(etat.routes.position).toBe("barriere-neuve");
    expect(etat.narration.evenementActif).toBe(
      "trame.barriere-neuve.le-permis-des-essieux",
    );

    etat = resoudreEtContinuer(etat, "prendre-permis");
    expect(etat.narration.evenementActif).toBe(
      "trame.barriere-neuve.la-taxe-des-lanternes",
    );
    etat = resoudreEtContinuer(etat, "payer-taxe");

    expect(etat.trameDeFer.engagements.map(({ id }) => id)).toEqual([
      "permis-de-circulation-republicain",
      "taxe-des-lanternes",
    ]);
    expect(etat.trameDeFer.relationRepublique).toBe("transactionnelle");

    etat = voyager(etat, "voie-des-ponts-lourds");
    expect(etat.routes.position).toBe("grand-aiguillage");
    expect(etat.narration.evenementActif).toBe(
      "trame.grand-aiguillage.la-piece-sans-serie",
    );
    etat = resoudreEtContinuer(etat, "ouvrir-reparation-locale");
    etat = resoudreEtContinuer(etat, "rationner-refroidissement");
    etat = resoudreEtContinuer(etat, "former-attelage");

    expect(etat.trameDeFer.grandAiguillage).toMatchObject({
      statut: "atelier-negocie",
      pressions: {
        eauDeRefroidissement: "rationnee",
        requisitions: "encadrees",
      },
      marche: {
        servicesLourdsRestants: 0,
        eauDeRefroidissementRestante: 1,
      },
      dependanceEauDeRefroidissement: "rationnee",
    });
    expect(etat.trameDeFer.pieceDeRegulation.voiesOuvertes).toEqual(
      expect.arrayContaining(["reparation-locale", "attelage-federe"]),
    );
    expect(etat.trameDeFer.pieceDeRegulation.monopoleRepublicain).toBe(false);
    expect(etat.trameDeFer.occasions.attelageFedere).toMatchObject({
      statut: "annoncee",
      coutMateriaux: 8,
    });

    expect(projeterTrameDeFer(etat)).toMatchObject({
      visible: true,
      titre: "Grand-Aiguillage",
      relationRepublique: "Transactionnelle",
      pressions: [
        "Eau de refroidissement rationnée",
        "Réquisitions encadrées",
      ],
      occasions: expect.arrayContaining([
        expect.stringContaining("Attelage fédéré"),
      ]),
    });
    expect(projeterTrameDeFer(etat, "en")).toMatchObject({
      titre: "Grand Junction",
      relationRepublique: "Transactional",
      pressions: ["Cooling water rationed", "Requisitions constrained"],
      libelles: {
        marche: "Market",
        engagements: "Iron Weave commitments",
      },
    });
  });

  it("bloque les coûts sans stock tout en laissant une récupération et préserve le contrôle du Train-outil", () => {
    let etat = voyager(aLaLisiere(), "rampe-de-barriere-neuve");
    etat = resoudreEtContinuer(etat, "prendre-permis");

    etat = sansStock(etat, "combustible");
    const taxeProjetee = projeterCampagne(etat).evenementNarratif;
    expect(
      taxeProjetee?.choix.find(({ id }) => id === "payer-taxe"),
    ).toMatchObject({
      disponible: false,
      indisponibilite: "Stock insuffisant pour ce coût.",
    });
    expect(() =>
      appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId: "trame.barriere-neuve.la-taxe-des-lanternes",
        choixId: "payer-taxe",
      }),
    ).toThrow("stocks sont insuffisants");
    etat = resoudreEtContinuer(etat, "accepter-requisition");

    etat = voyager(etat, "voie-des-ponts-lourds");
    etat = resoudreEtContinuer(etat, "appeler-train-outil");
    expect(etat.trameDeFer.grandAiguillage).toMatchObject({
      statut: "sous-controle-republicain",
      marche: { servicesLourdsRestants: 0 },
    });

    etat = sansStock(etat, "eau");
    expect(() =>
      appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId: "trame.grand-aiguillage.l-eau-des-machines",
        choixId: "acheter-refroidissement",
      }),
    ).toThrow("stocks sont insuffisants");
    etat = resoudreEtContinuer(etat, "rationner-refroidissement");
    expect(etat.trameDeFer.grandAiguillage.statut).toBe(
      "sous-controle-republicain",
    );

    etat = sansStock(etat, "materiaux");
    expect(() =>
      appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId: "trame.grand-aiguillage.ilyana-et-l-attelage",
        choixId: "former-attelage",
      }),
    ).toThrow("stocks sont insuffisants");
    etat = resoudreEtContinuer(etat, "reserver-train-outil");
    expect(etat.narration.evenementActif).toBeNull();
    expect(etat.trameDeFer.occasions.trainOutil.statut).toBe("reservee");
  });
});
