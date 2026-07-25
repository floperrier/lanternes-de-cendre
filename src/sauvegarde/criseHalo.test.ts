import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  empreinteEtat,
  type CommandeCampagne,
} from "../simulation/campagne";
import { obtenirScenariosSentinelles } from "../diagnostic/scenariosSentinelles";
import { projeterPilotage } from "../application/pilotage";
import {
  creerSauvegarde,
  exporterSauvegarde,
  importerSauvegarde,
  rejouerReproduction,
} from "./sauvegarde";
import { lireEtatCourant, lireSnapshotCourant } from "./validation";

describe("persistance de la saturation du Halo", () => {
  it("sauvegarde, exporte, importe et rejoue exactement la réponse et sa Récupération", () => {
    const scenario = obtenirScenariosSentinelles().find(
      ({ id }) => id === "saturation-halo",
    )!;
    const commandes = scenario.conduites.prudente.commandes.map(
      ({ commande }) => commande,
    );
    let etat = scenario.snapshot;
    const journal = commandes.map(
      (commande: CommandeCampagne, sequence: number) => {
        etat = appliquerCommande(etat, commande).etat;
        return {
          sequence,
          commande,
          empreinteApres: empreinteEtat(etat),
        };
      },
    );
    const reproduction = {
      snapshot: scenario.snapshot,
      empreinteSnapshot: empreinteEtat(scenario.snapshot),
      commandes: journal,
    };

    expect(lireSnapshotCourant(scenario.snapshot)).toBeDefined();
    expect(lireEtatCourant(etat)).toBeDefined();
    expect(rejouerReproduction(reproduction)).toEqual({
      statut: "termine",
      etat,
      empreinte: empreinteEtat(etat),
    });

    const importation = importerSauvegarde(
      exporterSauvegarde(creerSauvegarde(etat, reproduction)),
    );
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      return;
    }
    expect(importation.sauvegarde.etat.crises).toMatchObject({
      historique: expect.arrayContaining([
        expect.objectContaining({
          id: "couronne-muette.saturation-du-halo",
          reponseId: "stabiliser-anneau-du-halo",
        }),
      ]),
      cicatrices: expect.arrayContaining([
        expect.objectContaining({
          id: "cicatrice.halo-bride-par-les-etais",
        }),
      ]),
      recuperations: expect.arrayContaining([
        expect.objectContaining({
          garantie: "halo-reparti-au-noeud",
          statut: "accomplie",
          faitResultat:
            "crise.recuperation.halo-reparti-au-noeud.accomplie",
        }),
      ]),
    });
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat,
      empreinte: empreinteEtat(etat),
    });
    expect(projeterPilotage(etat, "fr").journalCausal.at(-1)).toMatchObject({
      titre: "Récupération — charge du Halo répartie au Nœud",
      cause: "Halo bridé par les étais",
      cible: "Nœud central",
    });
    expect(projeterPilotage(etat, "en").journalCausal.at(-1)).toMatchObject({
      titre: "Recovery — Halo load redistributed at the Node",
      cause: "Halo constrained by braces",
      cible: "Central Node",
    });
  });
});
