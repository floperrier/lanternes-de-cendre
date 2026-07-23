import { describe, expect, it, vi } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";

function normaliserEnV5(etat: EtatCampagne): Record<string, unknown> {
  const ancien = { ...etat } as Record<string, unknown>;
  ancien.version = 5;
  delete ancien.hautPuits;
  ancien.routes = {
    ...etat.routes,
    etatsReels: {
      "digue-des-puits": etat.routes.etatsReels["digue-des-puits"],
      "chaussee-de-veille-basse":
        etat.routes.etatsReels["chaussee-de-veille-basse"],
    },
  };
  return ancien;
}

function creerArchiveV5DeVeilleBasse(): Record<string, unknown> {
  const commandes: readonly CommandeCampagne[] = [
    { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.reponse-du-phare",
      choixId: "consigner-harmonique",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.filtres-de-la-veille",
      choixId: "proteger-foyers",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.ilyana-au-clapet",
      choixId: "confier-clapet",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chaussee-de-veille-basse",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 120 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "rediriger",
    },
  ];
  const snapshot = creerCampagneInitiale("CENDRE-01");
  let etat = snapshot;
  const entrees = commandes.map((commande, sequence) => {
    etat = appliquerCommande(etat, commande).etat;
    return {
      sequence,
      commande,
      empreinteApres: empreinteEtat(
        normaliserEnV5(etat) as unknown as EtatCampagne,
      ),
    };
  });
  const snapshotV5 = normaliserEnV5(snapshot);
  const etatV5 = normaliserEnV5(etat);
  const empreinteSnapshot = empreinteEtat(
    snapshotV5 as unknown as EtatCampagne,
  );
  const empreinte = empreinteEtat(etatV5 as unknown as EtatCampagne);

  return {
    format: "lanternes-de-cendre.sauvegarde",
    id: `CENDRE-01-${etat.tempsDuConvoi.secondes}-${empreinte}`,
    version: 5,
    versions: {
      simulation: 5,
      contenu: 1,
      aleatoire: 1,
      empreinte: 1,
    },
    graine: "CENDRE-01",
    horloge: { secondes: etat.tempsDuConvoi.secondes },
    etat: etatV5,
    reproduction: {
      snapshot: snapshotV5,
      empreinteSnapshot,
      commandes: entrees,
    },
    empreinte,
  };
}

describe("migration v5 sans catalogue premium installé", () => {
  it("valide et rejoue l’historique de Veille-Basse sans charger sa prose", async () => {
    const archiveV5 = creerArchiveV5DeVeilleBasse();

    vi.resetModules();
    const catalogue = await import("../content/catalogue");
    const { importerSauvegarde, rejouerReproduction } =
      await import("./sauvegarde");

    expect(
      catalogue.catalogueDEvenements.evenements.some(({ id }) =>
        id.startsWith("veille-basse."),
      ),
    ).toBe(false);

    const importation = importerSauvegarde(JSON.stringify(archiveV5));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: 7,
        etat: {
          version: 7,
          narration: {
            evenementsJoues: expect.arrayContaining([
              "veille-basse.la-place-sous-le-phare",
            ]),
            faitsDeCampagne: expect.arrayContaining([
              expect.objectContaining({
                id: "veille-basse.cohorte-redirigee",
                cause: "veille-basse.la-place-sous-le-phare",
              }),
            ]),
          },
        },
      },
    });
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v5 devrait être migrée.");
    }
    expect(
      catalogue.catalogueDEvenements.evenements.some(({ id }) =>
        id.startsWith("veille-basse."),
      ),
    ).toBe(false);
    expect(
      rejouerReproduction(importation.sauvegarde.reproduction),
    ).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
    });

    const falsifie = structuredClone(archiveV5) as {
      reproduction: {
        commandes: Array<{ empreinteApres: string }>;
      };
    };
    falsifie.reproduction.commandes.at(-1)!.empreinteApres = "00000000";
    expect(importerSauvegarde(JSON.stringify(falsifie)).statut).toBe(
      "invalide",
    );
  });
});
