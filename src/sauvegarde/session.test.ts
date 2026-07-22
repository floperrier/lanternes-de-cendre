import { describe, expect, it } from "vitest";

import {
  projeterCampagne,
  type ApplicationCampagne,
} from "../application/application";
import { empreinteEtat } from "../simulation/campagne";
import { formaterEmpreinteFnv1a32V1 } from "../simulation/empreinte";
import sauvegardeV1 from "./fixtures/sauvegarde-v1.json";
import {
  creerPortDePersistanceMemoire,
  type ArchivePersistante,
  type PortDePersistanceSauvegardes,
} from "./persistance";
import {
  creerSauvegarde,
  exporterSauvegarde,
  importerSauvegarde,
  TAILLE_MAX_ARCHIVE_SAUVEGARDE,
} from "./sauvegarde";
import {
  exporterCampagne,
  importerCampagne,
  ouvrirCampagne,
  sauvegarderCampagne,
} from "./session";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
} from "./types";

function suivreReproduction(
  application: ApplicationCampagne,
  reproductionInitiale: ReproductionDeCampagne,
): ReproductionDeCampagne {
  const commandes: CommandeDeReproduction[] = [
    ...reproductionInitiale.commandes,
  ];
  application.sabonnerAuxCommandes((commande, etat) => {
    commandes.push({
      sequence: commandes.length,
      commande,
      empreinteApres: empreinteEtat(etat),
    });
  });
  return { ...reproductionInitiale, commandes };
}

function creerArchiveV1Volumineuse(nombreDeCommandes: number): string {
  const archive = structuredClone(sauvegardeV1);
  archive.reproduction.commandes = Array.from(
    { length: nombreDeCommandes },
    (_, sequence) => ({
      sequence,
      commande: {
        type: "temps-du-convoi.regler-vitesse" as const,
        vitesse: 4 as const,
      },
    }),
  );
  return JSON.stringify(archive);
}

describe("session de Campagne persistante", () => {
  it("reprend après fermeture exactement le dernier snapshot atomique", async () => {
    const port = creerPortDePersistanceMemoire();
    const premiereSession = await ouvrirCampagne(port, "CENDRE-01");
    const reproduction = suivreReproduction(
      premiereSession.application,
      premiereSession.reproduction,
    );
    premiereSession.application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    premiereSession.application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });
    await sauvegarderCampagne(
      port,
      premiereSession.application,
      reproduction,
    );

    const sessionReprise = await ouvrirCampagne(port, "CENDRE-01");

    expect(sessionReprise.statut).toBe("reprise");
    expect(sessionReprise.application.lireEtat()).toEqual(
      premiereSession.application.lireEtat(),
    );
    expect(projeterCampagne(sessionReprise.application.lireEtat())).toEqual(
      projeterCampagne(premiereSession.application.lireEtat()),
    );
    expect(empreinteEtat(sessionReprise.application.lireEtat())).toBe(
      empreinteEtat(premiereSession.application.lireEtat()),
    );
  });

  it("importe l'export portable dans un stockage vide sans perdre la causalité", async () => {
    const portSource = creerPortDePersistanceMemoire();
    const source = await ouvrirCampagne(portSource, "CENDRE-01");
    const reproduction = suivreReproduction(
      source.application,
      source.reproduction,
    );
    source.application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    source.application.envoyerCommande({
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    });
    const exportPortable = exporterCampagne(
      source.application,
      reproduction,
    );
    const portDestination = creerPortDePersistanceMemoire();

    const importation = await importerCampagne(
      portDestination,
      exportPortable,
    );

    expect(importation.statut).toBe("compatible");
    if (
      importation.statut !== "compatible" &&
      importation.statut !== "migree"
    ) {
      throw new Error("L’export courant devrait être importé.");
    }
    expect(importation.application.lireEtat()).toEqual(
      source.application.lireEtat(),
    );
    expect(importation.reproduction).toEqual(reproduction);
    await expect(portDestination.lister()).resolves.toHaveLength(1);
  });

  it("conserve et explique une importation incompatible", async () => {
    const port = creerPortDePersistanceMemoire();
    const archiveOriginale = `{
  "format": "lanternes-de-cendre.sauvegarde",
  "id": "future",
  "version": 99
}`;

    const importation = await importerCampagne(port, archiveOriginale);

    expect(importation).toMatchObject({
      statut: "incompatible",
      archiveOriginale,
      explication: expect.stringContaining("version 99"),
    });
    await expect(port.lister()).resolves.toEqual([
      {
        id: "future",
        version: 99,
        contenu: archiveOriginale,
        protegeeDeLaRotation: true,
      },
    ]);

    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    expect(ouverture).toMatchObject({
      statut: "nouvelle",
      explication: expect.stringContaining("version 99"),
      archiveIncompatible: {
        contenu: archiveOriginale,
      },
    });

    await sauvegarderCampagne(
      port,
      ouverture.application,
      ouverture.reproduction,
    );
    const repriseAvecArchivePlusAncienne = await ouvrirCampagne(
      port,
      "CENDRE-01",
    );
    expect(repriseAvecArchivePlusAncienne).toMatchObject({
      statut: "reprise",
      explication: expect.stringContaining("version 99"),
      archiveIncompatible: {
        contenu: archiveOriginale,
      },
    });
  });

  it("rend toujours une archive future réexportable si sa persistance échoue", async () => {
    const portSansPlace = creerPortDePersistanceMemoire({ quotaOctets: 1 });
    const archiveOriginale = `{
  "format": "lanternes-de-cendre.sauvegarde",
  "id": "future-sans-place",
  "version": 99
}`;

    await expect(
      importerCampagne(portSansPlace, archiveOriginale),
    ).resolves.toMatchObject({
      statut: "incompatible",
      archiveOriginale,
      explication: expect.stringContaining("version 99"),
      erreurPersistance: expect.stringContaining("espace disponible"),
    });
    await expect(portSansPlace.lister()).resolves.toEqual([]);
  });

  it("reprend une migration valide même si son nouveau snapshot ne peut pas être persisté", async () => {
    const contenu = JSON.stringify(sauvegardeV1);
    const port: PortDePersistanceSauvegardes = {
      enregistrer: async () => {
        throw new Error("Quota refusé pendant la migration.");
      },
      protegerDeLaRotation: async () => undefined,
      lirePlusRecente: async () => ({
        id: sauvegardeV1.id,
        version: sauvegardeV1.version,
        contenu,
      }),
      lister: async () => [
        {
          id: sauvegardeV1.id,
          version: sauvegardeV1.version,
          contenu,
        },
      ],
      fermer: () => undefined,
    };

    await expect(ouvrirCampagne(port, "CENDRE-01")).resolves.toMatchObject({
      statut: "reprise",
      application: {
        lireEtat: expect.any(Function),
      },
      explication: expect.stringContaining(
        "Quota refusé pendant la migration.",
      ),
    });
  });

  it("compacte une migration issue d'une archive v1 de plus de 5 Mio", async () => {
    const archiveOriginale = creerArchiveV1Volumineuse(65_000);
    const tailleOriginale = new TextEncoder().encode(archiveOriginale).byteLength;
    expect(tailleOriginale).toBeGreaterThan(5 * 1024 * 1024);
    expect(tailleOriginale).toBeLessThan(TAILLE_MAX_ARCHIVE_SAUVEGARDE);

    const migration = importerSauvegarde(archiveOriginale);
    expect(migration.statut).toBe("migree");
    if (migration.statut !== "migree") {
      throw new Error("La grande archive v1 devrait être migrable.");
    }
    expect(
      new TextEncoder().encode(
        JSON.stringify(migration.sauvegarde, null, 2),
      ).byteLength,
    ).toBeGreaterThan(TAILLE_MAX_ARCHIVE_SAUVEGARDE);
    expect(() => exporterSauvegarde(migration.sauvegarde)).not.toThrow();

    const port = creerPortDePersistanceMemoire();
    await expect(
      importerCampagne(port, archiveOriginale),
    ).resolves.toMatchObject({ statut: "migree" });
  });

  it("reprend en mémoire si même l'archive migrée compacte dépasse 8 Mio", async () => {
    const archiveOriginale = creerArchiveV1Volumineuse(76_000);
    expect(
      new TextEncoder().encode(archiveOriginale).byteLength,
    ).toBeLessThan(TAILLE_MAX_ARCHIVE_SAUVEGARDE);
    const port = creerPortDePersistanceMemoire();
    await port.enregistrer({
      id: sauvegardeV1.id,
      version: sauvegardeV1.version,
      contenu: archiveOriginale,
    });

    await expect(ouvrirCampagne(port, "CENDRE-01")).resolves.toMatchObject({
      statut: "reprise",
      application: { lireEtat: expect.any(Function) },
      explication: expect.stringContaining(
        "L’archive produite dépasse la limite de 8 Mio.",
      ),
    });
  });

  it("protège de la rotation une archive à sous-version future", async () => {
    const source = await ouvrirCampagne(
      creerPortDePersistanceMemoire(),
      "CENDRE-01",
    );
    const sauvegarde = creerSauvegarde(
      source.application.lireEtat(),
      source.reproduction,
    );
    const archiveOriginale = JSON.stringify({
      ...sauvegarde,
      versions: { ...sauvegarde.versions, empreinte: 99 },
    });
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });

    await expect(
      importerCampagne(port, archiveOriginale),
    ).resolves.toMatchObject({
      statut: "incompatible",
      archiveOriginale,
      explication: expect.stringMatching(/empreinte.*99/),
    });
    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    ouverture.application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    await sauvegarderCampagne(
      port,
      ouverture.application,
      ouverture.reproduction,
    );
    ouverture.application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    });
    await sauvegarderCampagne(
      port,
      ouverture.application,
      ouverture.reproduction,
    );

    const archives = await port.lister();
    expect(archives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ contenu: archiveOriginale }),
      ]),
    );
    await expect(ouvrirCampagne(port, "CENDRE-01")).resolves.toMatchObject({
      archiveIncompatible: { contenu: archiveOriginale },
      explication: expect.stringMatching(/empreinte.*99/),
    });
  });

  it("protège à l'ouverture une sous-version future stockée sans marqueur", async () => {
    const source = await ouvrirCampagne(
      creerPortDePersistanceMemoire(),
      "CENDRE-01",
    );
    const sauvegarde = creerSauvegarde(
      source.application.lireEtat(),
      source.reproduction,
    );
    const archiveOriginale = JSON.stringify({
      ...sauvegarde,
      versions: { ...sauvegarde.versions, contenu: 99 },
    });
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });
    await port.enregistrer({
      id: sauvegarde.id,
      version: sauvegarde.version,
      contenu: archiveOriginale,
    });

    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    ouverture.application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    await sauvegarderCampagne(
      port,
      ouverture.application,
      ouverture.reproduction,
    );
    ouverture.application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    });
    await sauvegarderCampagne(
      port,
      ouverture.application,
      ouverture.reproduction,
    );

    expect(await port.lister()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contenu: archiveOriginale,
          protegeeDeLaRotation: true,
        }),
      ]),
    );
  });

  it("protège atomiquement toutes les sous-versions futures à l'ouverture", async () => {
    const source = await ouvrirCampagne(
      creerPortDePersistanceMemoire(),
      "CENDRE-01",
    );
    const sauvegarde = creerSauvegarde(
      source.application.lireEtat(),
      source.reproduction,
    );
    const creerFuture = (suffixe: string, versionContenu: number) =>
      JSON.stringify({
        ...sauvegarde,
        id: `${sauvegarde.id}-${suffixe}`,
        versions: {
          ...sauvegarde.versions,
          contenu: versionContenu,
        },
      });
    const futureA = creerFuture("future-a", 98);
    const futureB = creerFuture("future-b", 99);
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 3 });
    await port.enregistrer({
      id: `${sauvegarde.id}-future-a`,
      version: sauvegarde.version,
      contenu: futureA,
    });
    await port.enregistrer({
      id: `${sauvegarde.id}-future-b`,
      version: sauvegarde.version,
      contenu: futureB,
    });
    await sauvegarderCampagne(
      port,
      source.application,
      source.reproduction,
    );

    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    const apresProtection = await port.lister();
    expect(apresProtection).toHaveLength(3);
    expect(
      apresProtection.filter(
        (archive) => archive.contenu === futureA || archive.contenu === futureB,
      ),
    ).toEqual([
      expect.objectContaining({
        contenu: futureB,
        protegeeDeLaRotation: true,
      }),
      expect.objectContaining({
        contenu: futureA,
        protegeeDeLaRotation: true,
      }),
    ]);

    const reproduction = suivreReproduction(
      ouverture.application,
      ouverture.reproduction,
    );
    for (let index = 0; index < 4; index += 1) {
      ouverture.application.envoyerCommande({
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      });
      await sauvegarderCampagne(port, ouverture.application, reproduction);
    }
    port.fermer();

    const reprise = await ouvrirCampagne(port, "CENDRE-01");
    expect(reprise.statut).toBe("reprise");
    const apresReouverture = await port.lister();
    expect(apresReouverture).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ contenu: futureA }),
        expect.objectContaining({ contenu: futureB }),
      ]),
    );
    expect(
      apresReouverture.filter(
        (archive) => archive.contenu === futureA || archive.contenu === futureB,
      ),
    ).toHaveLength(2);
  });

  it("résout explicitement une collision FNV entre deux incompatibles homonymes", async () => {
    const creerArchiveCollision = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "meme-id",
        version: 2,
        versions: { simulation: 5 },
        padding,
      });
    const archiveA = creerArchiveCollision("1f8l--w6ndij");
    const archiveB = creerArchiveCollision("2f7t-gqiv95");
    expect(formaterEmpreinteFnv1a32V1(archiveA)).toBe("af02f567");
    expect(formaterEmpreinteFnv1a32V1(archiveB)).toBe("af02f567");
    expect(importerSauvegarde(archiveA).statut).toBe("incompatible");
    expect(importerSauvegarde(archiveB).statut).toBe("incompatible");

    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });
    await Promise.all([
      importerCampagne(port, archiveA),
      importerCampagne(port, archiveB),
    ]);
    await importerCampagne(port, archiveA);
    expect(
      (await port.lister()).filter(
        (archive) => archive.id === "meme-id" && archive.version === 2,
      ),
    ).toEqual([
      expect.objectContaining({ contenu: archiveB }),
      expect.objectContaining({ contenu: archiveA }),
    ]);

    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    const reproduction = suivreReproduction(
      ouverture.application,
      ouverture.reproduction,
    );
    for (let index = 0; index < 3; index += 1) {
      ouverture.application.envoyerCommande({
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      });
      await sauvegarderCampagne(port, ouverture.application, reproduction);
    }
    port.fermer();

    await ouvrirCampagne(port, "CENDRE-01");
    const collisionsApresReouverture = (await port.lister()).filter(
      (archive) => archive.id === "meme-id" && archive.version === 2,
    );
    expect(collisionsApresReouverture).toHaveLength(2);
    expect(collisionsApresReouverture.map((archive) => archive.contenu)).toEqual(
      expect.arrayContaining([archiveA, archiveB]),
    );
  });

  it("protège deux versions majeures futures homonymes sans les écraser", async () => {
    const creerFutureMajeure = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-majeure-homonyme",
        version: 99,
        padding,
      });
    const futureA = creerFutureMajeure("contenu-a");
    const futureB = creerFutureMajeure("contenu-b");
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });

    await Promise.all([
      importerCampagne(port, futureA),
      importerCampagne(port, futureB),
    ]);
    await importerCampagne(port, futureA);
    expect(
      (await port.lister()).filter(
        (archive) => archive.id === "future-majeure-homonyme",
      ),
    ).toEqual([
      expect.objectContaining({
        contenu: futureB,
        protegeeDeLaRotation: true,
      }),
      expect.objectContaining({
        contenu: futureA,
        protegeeDeLaRotation: true,
      }),
    ]);

    const ouverture = await ouvrirCampagne(port, "CENDRE-01");
    const reproduction = suivreReproduction(
      ouverture.application,
      ouverture.reproduction,
    );
    for (let index = 0; index < 3; index += 1) {
      ouverture.application.envoyerCommande({
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      });
      await sauvegarderCampagne(port, ouverture.application, reproduction);
    }
    port.fermer();
    await ouvrirCampagne(port, "CENDRE-01");

    const futuresApresReouverture = (await port.lister()).filter(
      (archive) => archive.id === "future-majeure-homonyme",
    );
    expect(futuresApresReouverture).toHaveLength(2);
    expect(futuresApresReouverture.map((archive) => archive.contenu)).toEqual(
      expect.arrayContaining([futureA, futureB]),
    );
  });

  it("renormalise à l'ouverture les incompatibles déjà marquées en dédupliquant le contenu", async () => {
    const creerFuture = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-historique",
        version: 99,
        padding,
      });
    const futureA = creerFuture("contenu-a");
    const futureB = creerFuture("contenu-b");
    const protections: ArchivePersistante[] = [];
    const creerArchiveHistorique = (contenu: string): ArchivePersistante => ({
      id: "future-historique",
      version: 99,
      contenu,
      protegeeDeLaRotation: true,
    });
    const port: PortDePersistanceSauvegardes = {
      enregistrer: async () => undefined,
      protegerDeLaRotation: async (archive) => {
        protections.push(archive);
      },
      lirePlusRecente: async () => null,
      lister: async () => [
        creerArchiveHistorique(futureA),
        creerArchiveHistorique(futureA),
        creerArchiveHistorique(futureB),
      ],
      fermer: () => undefined,
    };

    await ouvrirCampagne(port, "CENDRE-01");

    expect(protections.map((archive) => archive.contenu)).toEqual([
      futureA,
      futureB,
    ]);
  });
});
