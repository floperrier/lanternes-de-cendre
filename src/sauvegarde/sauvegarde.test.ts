import { describe, expect, it } from "vitest";

import {
  creerApplicationCampagne,
  projeterCampagne,
  reprendreApplicationCampagne,
  type ApplicationCampagne,
} from "../application/application";
import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";
import { tirerEntierNonSigne } from "../simulation/aleatoire";
import sauvegardeV1 from "./fixtures/sauvegarde-v1.json";
import {
  creerSauvegarde,
  creerReproductionInitiale,
  exporterSauvegarde,
  importerSauvegarde,
  rejouerReproduction,
  TAILLE_MAX_ARCHIVE_SAUVEGARDE,
} from "./sauvegarde";
import type { CommandeDeReproduction, ReproductionDeCampagne } from "./types";
import { lireEtatCourant } from "./validation";

interface EtatV2HistoriqueMutable {
  version: number;
  infrastructure?: unknown;
  routes?: unknown;
  citeCaravane: { formation: { plateformes: string[] } };
}

interface ArchiveV2HistoriqueMutable {
  version: number;
  etat: EtatV2HistoriqueMutable;
  empreinte: string;
  versions: { simulation: number };
  reproduction: {
    snapshot: EtatV2HistoriqueMutable;
    empreinteSnapshot: string;
  };
}

function suivreReproduction(
  application: ApplicationCampagne,
): ReproductionDeCampagne {
  const initiale = creerReproductionInitiale(application.lireEtat());
  const commandes: CommandeDeReproduction[] = [];
  application.sabonnerAuxCommandes((commande, etat) => {
    commandes.push({
      sequence: commandes.length,
      commande,
      empreinteApres: empreinteEtat(etat),
    });
  });
  return { ...initiale, commandes };
}

function retirerRoutes(etat: EtatCampagne): Record<string, unknown> {
  const sansRoutes = { ...etat } as Record<string, unknown>;
  delete sansRoutes.routes;
  delete sansRoutes.infrastructure;
  sansRoutes.citeCaravane = {
    ...etat.citeCaravane,
    formation: {
      type: "grappe",
      plateformes: [
        "phare",
        "foyers",
        "atelier",
        "serres",
        "reservoirs",
        "vigie",
        "forge",
      ],
    },
  };
  return sansRoutes;
}

function retirerSeulementRoutes(etat: EtatCampagne): Record<string, unknown> {
  const sansRoutes = { ...etat } as Record<string, unknown>;
  delete sansRoutes.routes;
  return sansRoutes;
}

function avecReliquatHistoriqueDeMateriaux(
  etat: Record<string, unknown>,
  reliquatDeFlux: number,
): Record<string, unknown> {
  const copie = structuredClone(etat) as Record<string, unknown> & {
    pilotage: {
      economie: {
        stocks: { materiaux: { reliquatDeFlux: number } };
      };
    };
  };
  copie.pilotage.economie.stocks.materiaux.reliquatDeFlux = reliquatDeFlux;
  return copie;
}

function reordonnerProprietes(valeur: unknown): unknown {
  if (Array.isArray(valeur)) {
    return valeur.map(reordonnerProprietes);
  }
  if (valeur !== null && typeof valeur === "object") {
    return Object.fromEntries(
      Object.entries(valeur)
        .reverse()
        .map(([cle, membre]) => [cle, reordonnerProprietes(membre)]),
    );
  }
  return valeur;
}

describe("sauvegarde portable", () => {
  it("refuse une Halte déployée pendant un Engagement de route actif", () => {
    const enTraversee = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "engagement-de-route.confirmer",
        tronconId: "digue-des-puits",
      },
    ).etat;
    const incoherent: EtatCampagne = {
      ...enTraversee,
      infrastructure: {
        ...enTraversee.infrastructure,
        deploiement: "halte",
      },
    };

    expect(lireEtatCourant(incoherent)).toBeUndefined();
  });

  it("refuse une installation finale sans historique de Chantier causal", () => {
    const falsifie = structuredClone(creerCampagneInitiale("CENDRE-01"));
    const plateformes = falsifie.infrastructure.plateformes as unknown as Array<{
      emplacements: Array<{
        id: string;
        installation: {
          id: string;
          definitionId: "condenseur-thermique";
          etatMateriel: "operationnelle";
          installeeA: number;
        } | null;
      }>;
    }>;
    const destination = plateformes
      .flatMap((plateforme) => plateforme.emplacements)
      .find((emplacement) => emplacement.id === "intendance.polyvalent");
    if (destination === undefined) {
      throw new Error("L’Emplacement initial attendu est absent.");
    }
    destination.installation = {
      id: "intendance.polyvalent.condenseur-thermique",
      definitionId: "condenseur-thermique",
      etatMateriel: "operationnelle",
      installeeA: 0,
    };

    expect(lireEtatCourant(falsifie)).toBeUndefined();
  });

  it("refuse un Chantier actif dont la cible n’existe pas", () => {
    let falsifie = creerCampagneInitiale("CENDRE-01");
    falsifie = appliquerCommande(falsifie, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    falsifie = appliquerCommande(falsifie, { type: "halte.deployer" }).etat;
    falsifie = appliquerCommande(falsifie, {
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "normale",
    }).etat;
    const mutation = structuredClone(falsifie) as unknown as {
      infrastructure: {
        chantierActif: {
          ordre: { emplacementId: string };
        };
      };
    };
    mutation.infrastructure.chantierActif.ordre.emplacementId =
      "emplacement-inexistant";

    expect(lireEtatCourant(mutation)).toBeUndefined();
  });

  it("refuse un historique causalement impossible faute de capacité", () => {
    let etat = creerCampagneInitiale("CENDRE-01");
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    etat = appliquerCommande(etat, {
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "haute",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;

    const avecChantierImpossible: EtatCampagne = {
      ...etat,
      infrastructure: {
        ...etat.infrastructure,
        chantierActif: {
          id: "chantier.1.60.construction",
          ordre: {
            type: "construction",
            definitionId: "condenseur-thermique",
            emplacementId: "foyers.polyvalent",
          },
          priorite: "haute",
          commenceA: 60,
          dureePrevue: 60,
          progression: 0,
          coutMateriaux: 12,
          materiauxConsommes: 0,
        },
      },
    };
    const termine = appliquerCommande(avecChantierImpossible, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;

    expect(termine.pilotage.economie.capacites["main-d-oeuvre"]).toMatchObject(
      { production: 12, demande: 13 },
    );
    expect(lireEtatCourant(termine)).toBeUndefined();
  });

  it("migre une sauvegarde v2 antérieure aux Plateformes constructibles", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const archive = JSON.parse(
      exporterSauvegarde(
        creerSauvegarde(
          application.lireEtat(),
          creerReproductionInitiale(application.lireEtat()),
        ),
      ),
    ) as ArchiveV2HistoriqueMutable;
    const plateformesLegacy = [
      "phare",
      "foyers",
      "atelier",
      "serres",
      "reservoirs",
      "vigie",
      "forge",
    ];
    for (const etat of [archive.etat, archive.reproduction.snapshot]) {
      delete etat.infrastructure;
      delete etat.routes;
      etat.version = 2;
      etat.citeCaravane.formation.plateformes = plateformesLegacy;
    }
    archive.version = 2;
    archive.versions.simulation = 2;
    archive.empreinte = empreinteEtat(
      archive.etat as unknown as EtatCampagne,
    );
    archive.reproduction.empreinteSnapshot = empreinteEtat(
      archive.reproduction.snapshot as unknown as EtatCampagne,
    );

    const importation = importerSauvegarde(JSON.stringify(archive));

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v2 historique devrait être migrée.");
    }
    expect(importation.sauvegarde.etat.infrastructure).toEqual(
      creerCampagneInitiale("CENDRE-01").infrastructure,
    );
    expect(importation.sauvegarde.etat.citeCaravane.formation.plateformes).toEqual([
      "phare",
      "intendance",
      "foyers",
      "machines",
      "atelier-operations",
    ]);
  });

  it("reprend un Chantier en cours avec sa priorité et ses ressources consommées", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    });
    application.envoyerCommande({ type: "halte.deployer" });
    application.envoyerCommande({
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "haute",
    });
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    });

    const archive = exporterSauvegarde(
      creerSauvegarde(application.lireEtat(), reproduction),
    );
    const importation = importerSauvegarde(archive);

    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      throw new Error("Le Chantier en cours devrait être reprenable.");
    }
    expect(
      importation.sauvegarde.etat.infrastructure.chantierActif,
    ).toMatchObject({
      priorite: "haute",
      progression: 30,
      materiauxConsommes: 6,
      coutMateriaux: 12,
    });
  });

  it("reprend l’économie transformée par un Chantier terminé", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    });
    application.envoyerCommande({ type: "halte.deployer" });
    application.envoyerCommande({
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "haute",
    });
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 120,
    });

    const importation = importerSauvegarde(
      exporterSauvegarde(
        creerSauvegarde(application.lireEtat(), reproduction),
      ),
    );

    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      throw new Error("L’économie transformée devrait être reprenable.");
    }
    expect(importation.sauvegarde.etat.pilotage.economie).toMatchObject({
      stocks: {
        eau: { fluxParHeure: -30 },
        combustible: { fluxParHeure: -32 },
      },
      capacites: {
        chaleur: { demande: 74 },
        "main-d-oeuvre": { demande: 11 },
        charge: { demande: 72 },
      },
      entretien: { equipesMobilisees: 3, materiauxParHeure: 3 },
    });
  });

  it("migre une sauvegarde v2 antérieure à l’Atlas vers la v3 rejouable", () => {
    const etatInitialV3 = creerApplicationCampagne("CENDRE-01").lireEtat();
    const etatInitialSansRoutes = retirerRoutes(etatInitialV3);
    const snapshotV2 = { ...etatInitialSansRoutes, version: 2 };
    const apresVitesseV3 = reprendreApplicationCampagne(etatInitialV3);
    apresVitesseV3.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    const apresVitesseSansRoutes = retirerRoutes(apresVitesseV3.lireEtat());
    const apresVitesseV2 = { ...apresVitesseSansRoutes, version: 2 };
    apresVitesseV3.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });
    const etatFinalSansRoutes = retirerRoutes(apresVitesseV3.lireEtat());
    const etatFinalV2 = { ...etatFinalSansRoutes, version: 2 };
    const empreinteSnapshotV2 = empreinteEtat(
      snapshotV2 as unknown as EtatCampagne,
    );
    const empreinteApresVitesseV2 = empreinteEtat(
      apresVitesseV2 as unknown as EtatCampagne,
    );
    const empreinteFinaleV2 = empreinteEtat(
      etatFinalV2 as unknown as EtatCampagne,
    );
    const archiveV2 = JSON.stringify({
      format: "lanternes-de-cendre.sauvegarde",
      id: "archive-v2-sans-atlas",
      version: 2,
      versions: { simulation: 2, contenu: 1, aleatoire: 1, empreinte: 1 },
      graine: "CENDRE-01",
      horloge: { secondes: 60 },
      etat: reordonnerProprietes(etatFinalV2),
      reproduction: {
        snapshot: snapshotV2,
        empreinteSnapshot: empreinteSnapshotV2,
        commandes: [
          {
            sequence: 0,
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 4,
            },
            empreinteApres: empreinteApresVitesseV2,
          },
          {
            sequence: 1,
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 15,
            },
            empreinteApres: empreinteFinaleV2,
          },
        ],
      },
      empreinte: empreinteFinaleV2,
    });

    const importation = importerSauvegarde(archiveV2);
    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v2 devrait migrer vers l’Atlas v3.");
    }
    expect(importation.sauvegarde).toMatchObject({
      version: 3,
      versions: { simulation: 3 },
      etat: {
        version: 3,
        routes: {
          position: "halte-du-puits-sec",
          engagements: [],
          jalons: [],
        },
      },
      reproduction: {
        snapshot: { version: 3, routes: { position: "halte-du-puits-sec" } },
        commandes: [
          { sequence: 0, commande: { type: "temps-du-convoi.regler-vitesse" } },
          { sequence: 1, commande: { type: "temps-du-convoi.ecouler" } },
        ],
      },
    });
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("migre une sauvegarde v2 de simulation 3 en préservant Infrastructure et Conseil", () => {
    const snapshot = creerCampagneInitiale("CENDRE-01");
    const snapshotAvantRoutes = retirerSeulementRoutes(snapshot);
    const commandes: readonly CommandeCampagne[] = [
      { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
      { type: "halte.deployer" },
      {
        type: "chantier.engager",
        ordre: {
          type: "construction",
          definitionId: "condenseur-thermique",
          emplacementId: "intendance.polyvalent",
        },
        priorite: "haute",
      },
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ];
    let etat = snapshot;
    const commandesAvantRoutes = commandes.map((commande, sequence) => {
      etat = appliquerCommande(etat, commande).etat;
      return {
        sequence,
        commande,
        empreinteApres: empreinteEtat(
          retirerSeulementRoutes(etat) as unknown as EtatCampagne,
        ),
      };
    });
    const etatAvantRoutes = retirerSeulementRoutes(etat);
    const empreinteSnapshot = empreinteEtat(
      snapshotAvantRoutes as unknown as EtatCampagne,
    );
    const empreinte = empreinteEtat(
      etatAvantRoutes as unknown as EtatCampagne,
    );
    const archive = JSON.stringify({
      format: "lanternes-de-cendre.sauvegarde",
      id: "archive-v2-infrastructure-conseil",
      version: 2,
      versions: { simulation: 3, contenu: 1, aleatoire: 1, empreinte: 1 },
      graine: "CENDRE-01",
      horloge: { secondes: 0 },
      etat: etatAvantRoutes,
      reproduction: {
        snapshot: snapshotAvantRoutes,
        empreinteSnapshot,
        commandes: commandesAvantRoutes,
      },
      empreinte,
    });

    const importation = importerSauvegarde(archive);

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde pré-Atlas devrait être migrée.");
    }
    expect(importation.sauvegarde.etat.routes).toEqual(snapshot.routes);
    expect(importation.sauvegarde.etat.infrastructure).toEqual(
      etat.infrastructure,
    );
    expect(importation.sauvegarde.etat.narration.faitsDeCampagne).toEqual(
      etat.narration.faitsDeCampagne,
    );
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("migre le reliquat historique laissé par l’épuisement exact d’un Chantier", () => {
    const snapshot = creerCampagneInitiale("CENDRE-01");
    const commandes: readonly CommandeCampagne[] = [
      {
        type: "incident.ordonner",
        incidentId: "purification.pompe-instable",
        ordre: "securiser-pompe",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 124_201 },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
      { type: "halte.deployer" },
      {
        type: "chantier.engager",
        ordre: {
          type: "construction",
          definitionId: "condenseur-thermique",
          emplacementId: "intendance.polyvalent",
        },
        priorite: "haute",
      },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 1 },
      { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
    ];
    let etat = snapshot;
    const commandesHistoriques = commandes.map((commande, sequence) => {
      etat = appliquerCommande(etat, commande).etat;
      const sansRoutes = retirerSeulementRoutes(etat);
      const etatHistorique =
        sequence === commandes.length - 1
          ? avecReliquatHistoriqueDeMateriaux(sansRoutes, -122)
          : sansRoutes;
      return {
        sequence,
        commande,
        empreinteApres: empreinteEtat(
          etatHistorique as unknown as EtatCampagne,
        ),
      };
    });
    const etatHistorique = avecReliquatHistoriqueDeMateriaux(
      retirerSeulementRoutes(etat),
      -122,
    );
    const snapshotAvantRoutes = retirerSeulementRoutes(snapshot);
    const archive = JSON.stringify({
      format: "lanternes-de-cendre.sauvegarde",
      id: "archive-v2-reliquat-chantier",
      version: 2,
      versions: { simulation: 3, contenu: 1, aleatoire: 1, empreinte: 1 },
      graine: "CENDRE-01",
      horloge: { secondes: 124_261 },
      etat: etatHistorique,
      reproduction: {
        snapshot: snapshotAvantRoutes,
        empreinteSnapshot: empreinteEtat(
          snapshotAvantRoutes as unknown as EtatCampagne,
        ),
        commandes: commandesHistoriques,
      },
      empreinte: empreinteEtat(etatHistorique as unknown as EtatCampagne),
    });

    const importation = importerSauvegarde(archive);

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("Le reliquat historique devrait être migré.");
    }
    expect(
      importation.sauvegarde.etat.pilotage.economie.stocks.materiaux,
    ).toMatchObject({ quantite: 0, reliquatDeFlux: 0 });
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("reprend exactement l'état, la projection et l'empreinte exportés", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });
    const sauvegarde = creerSauvegarde(application.lireEtat(), reproduction);

    expect(sauvegarde).toMatchObject({
      format: "lanternes-de-cendre.sauvegarde",
      version: 3,
      versions: {
        simulation: 3,
        contenu: 1,
        aleatoire: 1,
        empreinte: 1,
      },
      graine: "CENDRE-01",
      horloge: { secondes: 60 },
      etat: {
        version: 3,
        echeances: [],
        fluxPseudoAleatoires: {
          "evenements-narratifs": {
            algorithme: "xoshiro128**",
            version: 1,
          },
        },
      },
      empreinte: empreinteEtat(application.lireEtat()),
    });

    const importation = importerSauvegarde(exporterSauvegarde(sauvegarde));
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      throw new Error("La sauvegarde courante devrait être compatible.");
    }

    const applicationReprise = reprendreApplicationCampagne(
      importation.sauvegarde.etat,
    );
    expect(applicationReprise.lireEtat()).toEqual(application.lireEtat());
    expect(projeterCampagne(applicationReprise.lireEtat())).toEqual(
      projeterCampagne(application.lireEtat()),
    );
    expect(empreinteEtat(applicationReprise.lireEtat())).toBe(
      sauvegarde.empreinte,
    );
  });

  it("signale précisément la première commande dont l'empreinte diverge", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });
    const commandes = reproduction.commandes.map((entree, index) =>
      index === 1 ? { ...entree, empreinteApres: "00000000" } : entree,
    );

    expect(rejouerReproduction({ ...reproduction, commandes })).toMatchObject({
      statut: "divergence",
      indexCommande: 1,
      sequence: 1,
      commande: {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 15,
      },
      empreinteAttendue: "00000000",
      empreinteObtenue: expect.stringMatching(/^[0-9a-f]{8}$/),
    });
  });

  it("persiste et rejoue les commandes de Doctrine et d’Incident", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "doctrine.regler",
      politique: "entretien",
      position: "preventif",
    });
    application.envoyerCommande({
      type: "doctrine.regler",
      politique: "entretien",
      position: "equilibre",
    });
    application.envoyerCommande({
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "securiser-pompe",
    });
    const sauvegarde = creerSauvegarde(application.lireEtat(), reproduction);

    const importation = importerSauvegarde(exporterSauvegarde(sauvegarde));

    expect(importation.statut).toBe("compatible");
    expect(rejouerReproduction(reproduction)).toEqual({
      statut: "termine",
      etat: application.lireEtat(),
      empreinte: sauvegarde.empreinte,
    });
  });

  it("persiste et rejoue l’Engagement de route jusqu’au Jalon", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    });
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    });
    const sauvegarde = creerSauvegarde(
      application.lireEtat(),
      reproduction,
    );

    const importation = importerSauvegarde(exporterSauvegarde(sauvegarde));
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      throw new Error("L’Engagement sauvegardé devrait être compatible.");
    }
    expect(importation.sauvegarde.etat.routes).toMatchObject({
      position: "haut-puits",
      etatsReels: { "digue-des-puits": "coupe" },
      engagements: [
        expect.objectContaining({
          tronconId: "digue-des-puits",
          statut: "termine",
        }),
      ],
      jalons: [
        expect.objectContaining({
          type: "fin-de-troncon",
          cause: "front-de-cendre.condamnation-arriere",
        }),
      ],
    });
    expect(rejouerReproduction(reproduction)).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
      empreinte: sauvegarde.empreinte,
    });
  });

  it("valide chronologiquement un Engagement qui épuise exactement l’Eau", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = suivreReproduction(application);
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 71_622,
    });
    application.envoyerCommande({
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    });
    const sauvegarde = creerSauvegarde(
      application.lireEtat(),
      reproduction,
    );

    expect(sauvegarde.etat.pilotage.economie.stocks.eau).toMatchObject({
      quantite: 0,
      reliquatDeFlux: 0,
    });
    expect(importerSauvegarde(exporterSauvegarde(sauvegarde)).statut).toBe(
      "compatible",
    );
  });

  it("rejette un pilotage v2 structurellement invalide", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = creerReproductionInitiale(application.lireEtat());
    const sauvegarde = creerSauvegarde(application.lireEtat(), reproduction);
    const etatInvalide = structuredClone(sauvegarde.etat) as unknown as {
      pilotage: { economie: { stocks: { vivres: { quantite: unknown } } } };
    };
    etatInvalide.pilotage.economie.stocks.vivres.quantite = "invalide";
    const empreinteInvalide = empreinteEtat(
      etatInvalide as unknown as EtatCampagne,
    );
    const archiveInvalide = {
      ...sauvegarde,
      etat: etatInvalide,
      empreinte: empreinteInvalide,
      reproduction: {
        snapshot: etatInvalide,
        empreinteSnapshot: empreinteInvalide,
        commandes: [],
      },
    };

    expect(importerSauvegarde(JSON.stringify(archiveInvalide))).toMatchObject({
      statut: "invalide",
    });
  });

  it("rejette les références narratives inconnues d’un état v2", () => {
    const etatInitial = creerApplicationCampagne("CENDRE-01").lireEtat();
    const etatAvecEvenementInconnu: EtatCampagne = {
      ...etatInitial,
      narration: {
        ...etatInitial.narration,
        evenementActif: "evenement.inconnu",
      },
    };
    const etatAvecFaitInconnu: EtatCampagne = {
      ...etatInitial,
      narration: {
        ...etatInitial.narration,
        faitsDeCampagne: [
          {
            id: "fait.inconnu",
            cause: "cause.inconnue",
            acteurs: ["acteur-inconnu"],
            cible: "cible-inconnue",
            moment: 0,
            effets: { materiels: [], humains: [] },
          },
        ],
      },
    };

    for (const etat of [etatAvecEvenementInconnu, etatAvecFaitInconnu]) {
      const sauvegarde = creerSauvegarde(etat, creerReproductionInitiale(etat));
      expect(importerSauvegarde(exporterSauvegarde(sauvegarde))).toMatchObject({
        statut: "invalide",
      });
    }
  });

  it("rejette les incohérences temporelles et causales d’un état v2", () => {
    const applicationInitiale = creerApplicationCampagne("CENDRE-01");
    const etatInitial = applicationInitiale.lireEtat();
    const etatAuTempsAvanceSansPilotage: EtatCampagne = {
      ...etatInitial,
      tempsDuConvoi: { ...etatInitial.tempsDuConvoi, secondes: 600 },
    };
    const etatAvecFaitFalsifie: EtatCampagne = {
      ...etatInitial,
      narration: {
        ...etatInitial.narration,
        faitsDeCampagne: [
          {
            id: "prologue.cohorte-accueillie",
            cause: "cause.fausse",
            acteurs: ["acteur-faux"],
            cible: "cible-fausse",
            moment: 0,
            effets: {
              materiels: [
                {
                  type: "stock.modifie",
                  stock: "materiaux",
                  variation: 9_999,
                },
              ],
              humains: [{ type: "habitants.modifies", variation: -9_999 }],
            },
          },
        ],
      },
    };

    const etatSansIncidentNiResolution: EtatCampagne = {
      ...etatInitial,
      pilotage: { ...etatInitial.pilotage, incidentActif: null },
    };

    const applicationApresIncident = creerApplicationCampagne("CENDRE-01");
    applicationApresIncident.envoyerCommande({
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "securiser-pompe",
    });
    const etatApresIncident = applicationApresIncident.lireEtat();
    const etatAvecIncidentReinjecte: EtatCampagne = {
      ...etatApresIncident,
      pilotage: {
        ...etatApresIncident.pilotage,
        incidentActif: etatInitial.pilotage.incidentActif,
      },
    };

    const applicationApresChoix = creerApplicationCampagne("CENDRE-01");
    applicationApresChoix.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    applicationApresChoix.envoyerCommande({
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    });
    const etatApresChoix = applicationApresChoix.lireEtat();
    const etatAvecHabitantsFalsifies: EtatCampagne = {
      ...etatApresChoix,
      citeCaravane: { ...etatApresChoix.citeCaravane, habitants: 184 },
    };
    const etatAvecEvenementActifEtJoue: EtatCampagne = {
      ...etatApresChoix,
      narration: {
        ...etatApresChoix.narration,
        evenementActif: "prologue.signaux-sous-la-cendre",
      },
    };
    for (const etat of [
      etatAuTempsAvanceSansPilotage,
      etatAvecFaitFalsifie,
      etatSansIncidentNiResolution,
      etatAvecIncidentReinjecte,
      etatAvecHabitantsFalsifies,
      etatAvecEvenementActifEtJoue,
    ]) {
      const sauvegarde = creerSauvegarde(etat, creerReproductionInitiale(etat));
      expect(importerSauvegarde(exporterSauvegarde(sauvegarde))).toMatchObject({
        statut: "invalide",
      });
    }
  });

  it("conserve les échéances futures et les flux pseudo-aléatoires avancés", () => {
    const etatInitial = creerApplicationCampagne("CENDRE-01").lireEtat();
    const fluxAvance = tirerEntierNonSigne(
      etatInitial.fluxPseudoAleatoires["evenements-narratifs"],
    ).flux;
    const etatAvecOperationsPersistantes: EtatCampagne = {
      ...etatInitial,
      echeances: [
        {
          id: "vitesse-apres-alerte",
          secondeDEcheance: 30,
          cause: "test.echeance-future",
          commande: {
            type: "temps-du-convoi.regler-vitesse",
            vitesse: 2,
          },
        },
      ],
      fluxPseudoAleatoires: {
        "evenements-narratifs": fluxAvance,
      },
    };
    const sauvegarde = creerSauvegarde(
      etatAvecOperationsPersistantes,
      creerReproductionInitiale(etatAvecOperationsPersistantes),
    );

    expect(importerSauvegarde(exporterSauvegarde(sauvegarde))).toMatchObject({
      statut: "compatible",
      sauvegarde: {
        etat: {
          echeances: etatAvecOperationsPersistantes.echeances,
          fluxPseudoAleatoires:
            etatAvecOperationsPersistantes.fluxPseudoAleatoires,
        },
      },
    });
  });

  it("rejette un flux absorbant ou une commande d’échéance inexécutable", () => {
    const etatInitial = creerApplicationCampagne("CENDRE-01").lireEtat();
    const etatAvecFluxAbsorbant: EtatCampagne = {
      ...etatInitial,
      fluxPseudoAleatoires: {
        "evenements-narratifs": {
          ...etatInitial.fluxPseudoAleatoires["evenements-narratifs"],
          etat: [0, 0, 0, 0],
        },
      },
    };
    const etatAvecEcheanceInapplicable: EtatCampagne = {
      ...etatInitial,
      echeances: [
        {
          id: "duree-fractionnaire",
          secondeDEcheance: 30,
          cause: "test.commande-inapplicable",
          commande: {
            type: "temps-du-convoi.ecouler",
            secondesReelles: 0.5,
          },
        },
      ],
    };

    for (const etat of [etatAvecFluxAbsorbant, etatAvecEcheanceInapplicable]) {
      const sauvegarde = creerSauvegarde(etat, creerReproductionInitiale(etat));
      expect(importerSauvegarde(exporterSauvegarde(sauvegarde))).toMatchObject({
        statut: "invalide",
      });
    }
  });

  it("migre purement la fixture v1 en conservant sa causalité", () => {
    const original = structuredClone(sauvegardeV1);

    const importation = importerSauvegarde(JSON.stringify(sauvegardeV1));

    expect(sauvegardeV1).toEqual(original);
    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La fixture v1 devrait être migrée.");
    }
    expect(importation.sauvegarde).toMatchObject({
      version: 3,
      etat: {
        version: 3,
        tempsDuConvoi: { vitesse: 4 },
        echeances: [],
        fluxPseudoAleatoires: {
          "evenements-narratifs": {
            algorithme: "xoshiro128**",
            version: 1,
          },
        },
        pilotage: {
          doctrine: {
            entretien: { position: "equilibre", transition: null },
          },
          incidentActif: {
            id: "purification.pompe-instable",
          },
        },
      },
      reproduction: {
        snapshot: { version: 3 },
        commandes: [
          {
            sequence: 0,
            empreinteApres: expect.stringMatching(/^[0-9a-f]{8}$/),
          },
        ],
      },
    });
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat: importation.sauvegarde.etat,
      empreinte: importation.sauvegarde.empreinte,
    });
  });

  it("reconstruit le pilotage d’une v1 ayant déjà avancé dans le temps", () => {
    const archiveV1 = {
      ...structuredClone(sauvegardeV1),
      horloge: { secondes: 600 },
      etat: {
        ...structuredClone(sauvegardeV1.etat),
        tempsDuConvoi: { secondes: 600, vitesse: 1 },
        narration: {
          evenementActif: "prologue.signaux-sous-la-cendre",
          evenementsJoues: [],
          faitsDeCampagne: [],
        },
      },
      reproduction: {
        snapshot: structuredClone(sauvegardeV1.reproduction.snapshot),
        commandes: [
          {
            sequence: 0,
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 600,
            },
          },
        ],
      },
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV1));

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde temporelle v1 devrait être migrée.");
    }
    expect(importation.sauvegarde.etat).toMatchObject({
      tempsDuConvoi: { secondes: 600 },
      narration: {
        evenementActif: "prologue.signaux-sous-la-cendre",
        faitsDeCampagne: [
          {
            id: "incident.purification.pompe-instable.circuit-isole",
            moment: 120,
          },
        ],
      },
      pilotage: {
        economie: { stocks: { vivres: { quantite: 913 } } },
        incidentActif: null,
      },
    });
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("remplace les effets v1 malformés par les effets reconstruits", () => {
    const snapshot = {
      ...structuredClone(sauvegardeV1.reproduction.snapshot),
      tempsDuConvoi: { secondes: 60, vitesse: 1 },
      narration: {
        evenementActif: "prologue.signaux-sous-la-cendre",
        evenementsJoues: [],
        faitsDeCampagne: [],
      },
    };
    const etatPostChoix = {
      ...snapshot,
      citeCaravane: {
        ...snapshot.citeCaravane,
        habitants: 190,
      },
      narration: {
        evenementActif: null,
        evenementsJoues: ["prologue.signaux-sous-la-cendre"],
        faitsDeCampagne: [
          {
            id: "prologue.cohorte-accueillie",
            cause: "prologue.signaux-sous-la-cendre",
            acteurs: ["porte-lanterne", "cohorte-de-refugies"],
            cible: "cohorte-de-refugies",
            moment: 60,
            effets: "malformes",
          },
        ],
      },
    };
    const archiveV1 = {
      ...structuredClone(sauvegardeV1),
      horloge: { secondes: 60 },
      etat: etatPostChoix,
      reproduction: {
        snapshot: etatPostChoix,
        commandes: [],
      },
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV1));

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v1 avec Fait devrait être migrée.");
    }
    expect(
      importation.sauvegarde.etat.narration.faitsDeCampagne[0]?.effets,
    ).toEqual({
      materiels: [],
      humains: [{ type: "habitants.modifies", variation: 6 }],
    });
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("place l’Incident avant le choix legacy au même instant", () => {
    const etatPostChoix = {
      ...structuredClone(sauvegardeV1.reproduction.snapshot),
      tempsDuConvoi: { secondes: 120, vitesse: 1 },
      citeCaravane: {
        ...sauvegardeV1.reproduction.snapshot.citeCaravane,
        habitants: 190,
      },
      narration: {
        evenementActif: null,
        evenementsJoues: ["prologue.signaux-sous-la-cendre"],
        faitsDeCampagne: [
          {
            id: "prologue.cohorte-accueillie",
            cause: "prologue.signaux-sous-la-cendre",
            acteurs: ["porte-lanterne", "cohorte-de-refugies"],
            cible: "cohorte-de-refugies",
            moment: 120,
          },
        ],
      },
    };
    const archiveV1 = {
      ...structuredClone(sauvegardeV1),
      horloge: { secondes: 120 },
      etat: etatPostChoix,
      reproduction: { snapshot: etatPostChoix, commandes: [] },
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV1));

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("Le checkpoint legacy à t=120 devrait être migré.");
    }
    expect(
      importation.sauvegarde.etat.narration.faitsDeCampagne.map(
        (fait) => fait.id,
      ),
    ).toEqual([
      "incident.purification.pompe-instable.circuit-isole",
      "prologue.cohorte-accueillie",
    ]);
    expect(
      importerSauvegarde(exporterSauvegarde(importation.sauvegarde)).statut,
    ).toBe("compatible");
  });

  it("rejette un Fait legacy qui ne peut pas devenir une v2 compatible", () => {
    const faitInconnu = {
      id: "historique.inconnu",
      cause: "cause.inconnue",
      acteurs: ["acteur-inconnu"],
      cible: "cible-inconnue",
      moment: 0,
      effets: "malformes",
    };
    const archiveV1 = structuredClone(sauvegardeV1);
    archiveV1.etat.narration.faitsDeCampagne = [faitInconnu] as never[];
    archiveV1.reproduction.snapshot.narration.faitsDeCampagne = [
      faitInconnu,
    ] as never[];

    expect(importerSauvegarde(JSON.stringify(archiveV1))).toMatchObject({
      statut: "invalide",
    });
  });

  it.each([
    {
      nom: "une cause falsifiée",
      fait: {
        id: "prologue.cohorte-accueillie",
        cause: "cause.fausse",
        acteurs: ["porte-lanterne", "cohorte-de-refugies"],
        cible: "cohorte-de-refugies",
        moment: 0,
      },
    },
    {
      nom: "un moment postérieur à l’horloge",
      fait: {
        id: "prologue.cohorte-accueillie",
        cause: "prologue.signaux-sous-la-cendre",
        acteurs: ["porte-lanterne", "cohorte-de-refugies"],
        cible: "cohorte-de-refugies",
        moment: 1,
      },
    },
    {
      nom: "une causalité sans Événement joué ni effet sur la Cité",
      fait: {
        id: "prologue.cohorte-accueillie",
        cause: "prologue.signaux-sous-la-cendre",
        acteurs: ["porte-lanterne", "cohorte-de-refugies"],
        cible: "cohorte-de-refugies",
        moment: 0,
      },
    },
  ])("rejette un Fait legacy avec $nom", ({ fait }) => {
    const archiveV1 = structuredClone(sauvegardeV1);
    archiveV1.etat.narration.faitsDeCampagne = [fait] as never[];
    archiveV1.reproduction.snapshot.narration.faitsDeCampagne = [
      fait,
    ] as never[];

    expect(importerSauvegarde(JSON.stringify(archiveV1))).toMatchObject({
      statut: "invalide",
    });
  });

  it.each([
    {
      type: "doctrine.regler",
      politique: "entretien",
      position: "preventif",
    },
    {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "securiser-pompe",
    },
  ])("rejette la commande v2 $type dans un journal v1", (commande) => {
    const archiveV1 = structuredClone(sauvegardeV1);
    archiveV1.etat = structuredClone(archiveV1.reproduction.snapshot);
    archiveV1.reproduction.commandes = [{ sequence: 0, commande }] as never[];

    expect(importerSauvegarde(JSON.stringify(archiveV1))).toMatchObject({
      statut: "invalide",
    });
  });

  it("rejette une v1 qui omet un Fait produit par ses commandes", () => {
    const snapshot = {
      ...structuredClone(sauvegardeV1.reproduction.snapshot),
      tempsDuConvoi: { secondes: 60, vitesse: 1 },
      narration: {
        evenementActif: "prologue.signaux-sous-la-cendre",
        evenementsJoues: [],
        faitsDeCampagne: [],
      },
    };
    const archiveV1 = {
      ...structuredClone(sauvegardeV1),
      horloge: { secondes: 60 },
      etat: {
        ...snapshot,
        narration: {
          evenementActif: null,
          evenementsJoues: ["prologue.signaux-sous-la-cendre"],
          faitsDeCampagne: [],
        },
      },
      reproduction: {
        snapshot,
        commandes: [
          {
            sequence: 0,
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "prologue.signaux-sous-la-cendre",
              choixId: "orienter",
            },
          },
        ],
      },
    };

    expect(importerSauvegarde(JSON.stringify(archiveV1))).toMatchObject({
      statut: "invalide",
    });
  });

  it("conserve intacte et exportable une sauvegarde incompatible", () => {
    const archiveOriginale = `{
  "format": "lanternes-de-cendre.sauvegarde",
  "id": "campagne-future",
  "version": 99,
  "donnees": { "ne-pas-alterer": true }
}`;

    const importation = importerSauvegarde(archiveOriginale);

    expect(importation).toEqual({
      statut: "incompatible",
      id: "campagne-future",
      version: 99,
      archiveOriginale,
      explication:
        "Cette sauvegarde utilise la version 99, plus récente que la version 3 prise en charge. L’original est conservé et peut être réexporté.",
    });
  });

  it.each([
    ["simulation", 4],
    ["contenu", 2],
    ["aleatoire", 2],
    ["empreinte", 2],
  ] as const)(
    "classe la sous-version future %s comme incompatible avant validation",
    (sousVersion, versionFuture) => {
      const application = creerApplicationCampagne("CENDRE-01");
      const sauvegarde = creerSauvegarde(
        application.lireEtat(),
        creerReproductionInitiale(application.lireEtat()),
      );
      const archiveFuture = {
        ...sauvegarde,
        versions: {
          ...sauvegarde.versions,
          [sousVersion]: versionFuture,
        },
      };
      const archiveOriginale = JSON.stringify(archiveFuture);

      expect(importerSauvegarde(archiveOriginale)).toEqual({
        statut: "incompatible",
        id: sauvegarde.id,
        version: sauvegarde.version,
        archiveOriginale,
        explication: expect.stringMatching(
          new RegExp(`${sousVersion}.*${versionFuture}`),
        ),
      });
    },
  );

  it("refuse une archive surdimensionnée avant son analyse JSON", () => {
    const archive = "x".repeat(TAILLE_MAX_ARCHIVE_SAUVEGARDE + 1);

    expect(importerSauvegarde(archive)).toEqual({
      statut: "invalide",
      archiveOriginale: archive,
      explication: "Le fichier dépasse la limite de 8 Mio.",
    });
  });

  it("refuse symétriquement de produire une archive au-delà de 8 Mio", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const reproduction = creerReproductionInitiale(application.lireEtat());
    const sauvegarde = creerSauvegarde(application.lireEtat(), {
      ...reproduction,
      commandes: [
        {
          sequence: 0,
          commande: {
            type: "evenement-narratif.choisir",
            evenementId: "prologue.signaux-sous-la-cendre",
            choixId: "x".repeat(TAILLE_MAX_ARCHIVE_SAUVEGARDE),
          },
          empreinteApres: empreinteEtat(application.lireEtat()),
        },
      ],
    });

    expect(() => exporterSauvegarde(sauvegarde)).toThrow(
      "L’archive produite dépasse la limite de 8 Mio.",
    );
  });

  it("retourne une migration invalide si une commande est sémantiquement impossible", () => {
    const archive = structuredClone(sauvegardeV1);
    archive.reproduction.commandes = [
      {
        sequence: 0,
        commande: {
          type: "evenement-narratif.choisir",
          evenementId: "prologue.signaux-sous-la-cendre",
          choixId: "accueillir",
        },
      },
    ] as unknown as typeof archive.reproduction.commandes;

    expect(() => importerSauvegarde(JSON.stringify(archive))).not.toThrow();
    expect(importerSauvegarde(JSON.stringify(archive))).toMatchObject({
      statut: "invalide",
      explication: "La sauvegarde v1 est incomplète ou incohérente.",
    });
  });
});
