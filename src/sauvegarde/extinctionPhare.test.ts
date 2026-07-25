import { describe, expect, it } from "vitest";

import {
  executerCampagneHeadless,
  STRATEGIES_D_EQUILIBRAGE,
} from "../diagnostic/equilibrageCampagne";
import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
} from "../simulation/campagne";
import {
  creerSauvegarde,
  exporterSauvegarde,
  importerSauvegarde,
  rejouerReproduction,
} from "./sauvegarde";
import { lireEtatCourant, lireSnapshotCourant } from "./validation";

describe("persistance de l’Extinction du Phare", () => {
  it("exporte, importe et rejoue exactement la Défaite sans rouvrir la Campagne", () => {
    const strategie = STRATEGIES_D_EQUILIBRAGE.find(
      ({ id }) => id === "opportunisme-marchand",
    )!;
    const campagne = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
      tracerEmpreintes: true,
    });
    const snapshot = creerCampagneInitiale(campagne.graine);
    let etat = snapshot;
    for (const etape of campagne.commandes) {
      expect(etape.statut).toBe("appliquee");
      etat = appliquerCommande(etat, etape.commande).etat;
    }
    const reproduction = {
      snapshot,
      empreinteSnapshot: empreinteEtat(snapshot),
      commandes: campagne.commandes.map(
        ({ sequence, commande, empreinteEtat: empreinteApres }) => ({
          sequence,
          commande,
          empreinteApres,
        }),
      ),
    };

    expect(etat).toMatchObject({
      version: 17,
      denouement: { statut: "defaite" },
      citeCaravane: { phare: "eteint" },
      crises: {
        alerte: null,
        criseActive: null,
        historique: expect.arrayContaining([
          expect.objectContaining({
            id: "extinction-du-phare",
          }),
        ]),
      },
    });
    expect(lireSnapshotCourant(snapshot)).toEqual(snapshot);
    expect(lireEtatCourant(etat)).toEqual(etat);
    expect(rejouerReproduction(reproduction)).toEqual({
      statut: "termine",
      etat,
      empreinte: empreinteEtat(etat),
    });

    const importation = importerSauvegarde(
      exporterSauvegarde(creerSauvegarde(etat, reproduction)),
    );
    expect(importation).toMatchObject({
      statut: "compatible",
      sauvegarde: {
        version: 17,
        etat: {
          denouement: { statut: "defaite" },
          citeCaravane: { phare: "eteint" },
        },
      },
    });
  });
});
