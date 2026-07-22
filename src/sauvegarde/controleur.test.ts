import { describe, expect, it } from "vitest";

import { creerApplicationCampagne } from "../application/application";
import { empreinteEtat } from "../simulation/campagne";
import {
  creerControleurDeSessionCampagne,
  type EtatDuControleurDeSession,
} from "./controleur";
import {
  creerPortDePersistanceMemoire,
  type ArchivePersistante,
  type PortDePersistanceSauvegardes,
} from "./persistance";
import {
  creerReproductionInitiale,
  importerSauvegarde,
} from "./sauvegarde";
import { exporterCampagne } from "./session";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
} from "./types";

function applicationOuverte(etat: EtatDuControleurDeSession) {
  if (etat.statut !== "ouverte") {
    throw new Error("Le contrôleur devrait avoir ouvert la Campagne.");
  }
  return etat.ouverture.application;
}

function suivreReproduction(
  application: ReturnType<typeof creerApplicationCampagne>,
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

describe("contrôleur de session persistante", () => {
  it("coalesce les écritures et repart du dernier checkpoint", async () => {
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 5 });
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();
    const application = applicationOuverte(controleur.lireEtat());

    for (let index = 0; index < 20; index += 1) {
      application.envoyerCommande({
        type: "temps-du-convoi.regler-vitesse",
        vitesse: index % 2 === 0 ? 2 : 4,
      });
    }
    await controleur.sauvegarderMaintenant();

    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    });
    await controleur.sauvegarderMaintenant();
    const archive = await port.lirePlusRecente();
    if (archive === null) {
      throw new Error("Le checkpoint devrait être persisté.");
    }
    const importation = importerSauvegarde(archive.contenu);
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      throw new Error("Le checkpoint devrait être compatible.");
    }
    expect(importation.sauvegarde.reproduction.commandes).toHaveLength(1);
    expect(importation.sauvegarde.reproduction.snapshot.tempsDuConvoi).toEqual({
      secondes: 0,
      vitesse: 4,
    });
    controleur.fermer();
  });

  it("termine l'ancienne écriture avant de persister l'application importée", async () => {
    const memoire = creerPortDePersistanceMemoire({ nombreDeSnapshots: 5 });
    let debloquer: (() => void) | undefined;
    let signalerBlocage: (() => void) | undefined;
    const ecritureBloquee = new Promise<void>((resolve) => {
      signalerBlocage = resolve;
    });
    let bloquerProchaineEcriture = false;
    const port: PortDePersistanceSauvegardes = {
      ...memoire,
      enregistrer: async (archive: ArchivePersistante) => {
        if (bloquerProchaineEcriture) {
          bloquerProchaineEcriture = false;
          signalerBlocage?.();
          await new Promise<void>((resolve) => {
            debloquer = resolve;
          });
        }
        await memoire.enregistrer(archive);
      },
    };
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();
    const application = applicationOuverte(controleur.lireEtat());
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    bloquerProchaineEcriture = true;
    const ancienneEcriture = controleur.sauvegarderMaintenant();
    await ecritureBloquee;

    const source = creerApplicationCampagne("CENDRE-01");
    const reproductionSource = suivreReproduction(source);
    source.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    source.envoyerCommande({
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    });
    const archiveImportee = exporterCampagne(source, reproductionSource);
    const importationEnAttente = controleur.importer(archiveImportee);
    debloquer?.();
    await ancienneEcriture;
    await importationEnAttente;

    const derniere = await memoire.lirePlusRecente();
    if (derniere === null) {
      throw new Error("L’import devrait être le dernier snapshot.");
    }
    const resultat = importerSauvegarde(derniere.contenu);
    expect(resultat.statut).toBe("compatible");
    if (resultat.statut !== "compatible") {
      throw new Error("L’import final devrait être compatible.");
    }
    expect(resultat.sauvegarde.etat.citeCaravane.habitants).toBe(190);
    expect(
      applicationOuverte(controleur.lireEtat()).lireEtat().citeCaravane
        .habitants,
    ).toBe(190);
    controleur.fermer();
  });

  it("exporte l'état courant même si le stockage local est sans place", async () => {
    const port = creerPortDePersistanceMemoire({ quotaOctets: 1 });
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();

    expect(importerSauvegarde(controleur.exporter())).toMatchObject({
      statut: "compatible",
      sauvegarde: { graine: "CENDRE-01" },
    });
    controleur.fermer();
  });

  it("sérialise une sauvegarde manuelle déclenchée pendant la persistance d'un import", async () => {
    const memoire = creerPortDePersistanceMemoire({ nombreDeSnapshots: 5 });
    let debloquerImport: (() => void) | undefined;
    let signalerImportEcrit: (() => void) | undefined;
    const importEcrit = new Promise<void>((resolve) => {
      signalerImportEcrit = resolve;
    });
    let bloquerImport = false;
    const port: PortDePersistanceSauvegardes = {
      ...memoire,
      enregistrer: async (archive) => {
        await memoire.enregistrer(archive);
        const contenu = JSON.parse(archive.contenu) as {
          readonly etat?: { readonly citeCaravane?: { readonly habitants?: number } };
        };
        if (
          bloquerImport &&
          contenu.etat?.citeCaravane?.habitants === 190
        ) {
          bloquerImport = false;
          signalerImportEcrit?.();
          await new Promise<void>((resolve) => {
            debloquerImport = resolve;
          });
        }
      },
    };
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();

    const source = creerApplicationCampagne("CENDRE-01");
    const reproductionSource = suivreReproduction(source);
    source.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    source.envoyerCommande({
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    });
    bloquerImport = true;
    const importation = controleur.importer(
      exporterCampagne(source, reproductionSource),
    );
    await importEcrit;
    const sauvegardeConcurrente = controleur.sauvegarderMaintenant();
    await Promise.resolve();
    debloquerImport?.();
    await Promise.all([importation, sauvegardeConcurrente]);

    const derniere = await memoire.lirePlusRecente();
    if (derniere === null) {
      throw new Error("Un snapshot final devrait être disponible.");
    }
    const resultat = importerSauvegarde(derniere.contenu);
    expect(resultat.statut).toBe("compatible");
    if (resultat.statut !== "compatible") {
      throw new Error("Le snapshot final devrait être compatible.");
    }
    expect(resultat.sauvegarde.etat.citeCaravane.habitants).toBe(190);
    controleur.fermer();
  });

  it("applique dans l'ordre deux imports concurrents avant la fermeture et la reprise", async () => {
    const memoire = creerPortDePersistanceMemoire({ nombreDeSnapshots: 5 });
    let debloquerPremierImport: (() => void) | undefined;
    let signalerPremierImportEcrit: (() => void) | undefined;
    const premierImportEcrit = new Promise<void>((resolve) => {
      signalerPremierImportEcrit = resolve;
    });
    let bloquerPremierImport = true;
    const port: PortDePersistanceSauvegardes = {
      ...memoire,
      enregistrer: async (archive) => {
        await memoire.enregistrer(archive);
        const contenu = JSON.parse(archive.contenu) as {
          readonly etat?: {
            readonly citeCaravane?: { readonly habitants?: number };
          };
        };
        if (
          bloquerPremierImport &&
          contenu.etat?.citeCaravane?.habitants === 190
        ) {
          bloquerPremierImport = false;
          signalerPremierImportEcrit?.();
          await new Promise<void>((resolve) => {
            debloquerPremierImport = resolve;
          });
        }
      },
    };
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();

    const source = creerApplicationCampagne("CENDRE-01");
    const reproductionSource = suivreReproduction(source);
    source.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    source.envoyerCommande({
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    });
    const premierImport = controleur.importer(
      exporterCampagne(source, reproductionSource),
    );
    await premierImportEcrit;
    const secondImport = controleur.importer("{ import invalide }");
    debloquerPremierImport?.();

    await expect(premierImport).resolves.toMatchObject({
      statut: "compatible",
    });
    await expect(secondImport).resolves.toMatchObject({ statut: "invalide" });
    expect(
      applicationOuverte(controleur.lireEtat()).lireEtat().citeCaravane
        .habitants,
    ).toBe(190);
    controleur.fermer();

    const controleurReouvert = creerControleurDeSessionCampagne({
      port: memoire,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleurReouvert.attendreOuverture();
    expect(
      applicationOuverte(controleurReouvert.lireEtat()).lireEtat()
        .citeCaravane.habitants,
    ).toBe(190);
    controleurReouvert.fermer();
  });

  it("conserve la cause d'incompatibilité avec l'erreur de quota", async () => {
    const controleur = creerControleurDeSessionCampagne({
      port: creerPortDePersistanceMemoire({ quotaOctets: 1 }),
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();

    await controleur.importer(`{
  "format": "lanternes-de-cendre.sauvegarde",
  "id": "future-sans-place",
  "version": 99
}`);

    expect(controleur.lireEtat()).toMatchObject({
      statut: "ouverte",
      erreurSauvegarde: expect.stringMatching(/version 99.*espace disponible/),
    });
    controleur.fermer();
  });

  it("publie une erreur asynchrone survenue après un export réussi", async () => {
    const memoire = creerPortDePersistanceMemoire();
    let refuser = false;
    const port: PortDePersistanceSauvegardes = {
      ...memoire,
      enregistrer: async (archive) => {
        if (refuser) {
          throw new Error("IndexedDB indisponible après l’export.");
        }
        await memoire.enregistrer(archive);
      },
    };
    const controleur = creerControleurDeSessionCampagne({
      port,
      graine: "CENDRE-01",
      delaiDEcriture: 60_000,
    });
    await controleur.attendreOuverture();
    expect(importerSauvegarde(controleur.exporter()).statut).toBe(
      "compatible",
    );

    refuser = true;
    const application = applicationOuverte(controleur.lireEtat());
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    });
    await expect(controleur.sauvegarderMaintenant()).rejects.toThrow(
      "IndexedDB indisponible après l’export.",
    );
    expect(controleur.lireEtat()).toMatchObject({
      statut: "ouverte",
      erreurSauvegarde: "IndexedDB indisponible après l’export.",
    });
    controleur.fermer();
  });
});
