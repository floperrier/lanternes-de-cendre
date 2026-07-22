import { describe, expect, it } from "vitest";

import { reprendreApplicationCampagne } from "../application/application";
import { projeterPilotage } from "../application/pilotage";
import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
} from "../simulation/campagne";
import { exporterSauvegarde, importerSauvegarde } from "./portable";
import { creerReproductionInitiale, rejouerReproduction } from "./replay";
import { creerSauvegarde } from "./snapshot";

describe("sauvegarde du premier Conseil", () => {
  it("reprend l’Affectation, la décision et leur causalité par replay", () => {
    const snapshot = creerCampagneInitiale("CENDRE-01");
    const commandes: readonly CommandeCampagne[] = [
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
      {
        type: "conseil.decider",
        conseilId: "conseil.premiere-veille",
        sujetId: "purification-et-partage-de-l-eau",
        decisionId: "securiser-circuit",
      },
    ];
    let etat = snapshot;
    const reproduction = creerReproductionInitiale(snapshot);
    const commandesDeReproduction = commandes.map((commande, sequence) => {
      etat = appliquerCommande(etat, commande).etat;
      return { sequence, commande, empreinteApres: empreinteEtat(etat) };
    });
    const sauvegarde = creerSauvegarde(etat, {
      ...reproduction,
      commandes: commandesDeReproduction,
    });

    const importation = importerSauvegarde(exporterSauvegarde(sauvegarde));

    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      return;
    }
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat,
      empreinte: empreinteEtat(etat),
    });
    expect(
      importation.sauvegarde.etat.narration.faitsDeCampagne.at(-1),
    ).toMatchObject({
      id: "conseil.premiere-veille.circuit-securise",
      cause: "conseil.premiere-veille",
      acteurs: ["porte-lanterne", "ilyana-voss"],
      cible: "intendance",
    });
    const applicationReprise = reprendreApplicationCampagne(
      importation.sauvegarde.etat,
    );
    expect(
      projeterPilotage(applicationReprise.lireEtat(), "fr").journalCausal.at(
        -1,
      ),
    ).toMatchObject({
      titre: "Conseil — circuit de purification sécurisé",
      cause: "Conseil de la première veille",
      acteurs: ["Porte-Lanterne", "Ilyana Voss"],
      cible: "Intendance",
      moment: "00:00",
    });
    expect(
      projeterPilotage(applicationReprise.lireEtat(), "en").journalCausal.at(
        -1,
      ),
    ).toMatchObject({
      titre: "Council — purification circuit secured",
      cause: "First Watch Council",
      acteurs: ["Lantern-Bearer", "Ilyana Voss"],
      cible: "Stewardship",
      moment: "00:00",
    });
  });

  it("rejette une décision de Conseil sans Affectation causale", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const etatAffecte = appliquerCommande(etatInitial, {
      type: "compagnon.affecter",
      compagnonId: "ilyana-voss",
      quartierId: "intendance",
    }).etat;
    const etatDecide = appliquerCommande(etatAffecte, {
      type: "conseil.decider",
      conseilId: "conseil.premiere-veille",
      sujetId: "purification-et-partage-de-l-eau",
      decisionId: "maintenir-distribution",
    }).etat;
    const etatFalsifie = {
      ...etatDecide,
      narration: {
        ...etatDecide.narration,
        faitsDeCampagne: etatDecide.narration.faitsDeCampagne.slice(1),
      },
    };
    const sauvegarde = creerSauvegarde(
      etatFalsifie,
      creerReproductionInitiale(etatFalsifie),
    );

    expect(
      importerSauvegarde(exporterSauvegarde(sauvegarde)).statut,
    ).toBe("invalide");
  });

  it("rejette un Fait du Conseil dont les acteurs sont falsifiés", () => {
    const etatAffecte = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ).etat;
    const affectation = etatAffecte.narration.faitsDeCampagne[0]!;
    const etatFalsifie = {
      ...etatAffecte,
      narration: {
        ...etatAffecte.narration,
        faitsDeCampagne: [
          { ...affectation, acteurs: ["porte-lanterne"] },
        ],
      },
    };
    const sauvegarde = creerSauvegarde(
      etatFalsifie,
      creerReproductionInitiale(etatFalsifie),
    );

    expect(
      importerSauvegarde(exporterSauvegarde(sauvegarde)).statut,
    ).toBe("invalide");
  });

  it("rejette une décision placée avant son Affectation au même moment", () => {
    const etatAffecte = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ).etat;
    const etatDecide = appliquerCommande(etatAffecte, {
      type: "conseil.decider",
      conseilId: "conseil.premiere-veille",
      sujetId: "purification-et-partage-de-l-eau",
      decisionId: "securiser-circuit",
    }).etat;
    const faitsInverses = [...etatDecide.narration.faitsDeCampagne].reverse();
    const etatFalsifie = {
      ...etatDecide,
      narration: {
        ...etatDecide.narration,
        faitsDeCampagne: faitsInverses,
      },
    };
    const sauvegarde = creerSauvegarde(
      etatFalsifie,
      creerReproductionInitiale(etatFalsifie),
    );

    expect(
      importerSauvegarde(exporterSauvegarde(sauvegarde)).statut,
    ).toBe("invalide");
  });
});
