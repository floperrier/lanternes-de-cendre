import { describe, expect, it } from "vitest";

import { creerApplicationCampagne } from "../application/application";
import { creerReproductionInitiale, creerSauvegarde } from "./sauvegarde";
import {
  ErreurQuotaSauvegarde,
  creerArchivePersistante,
  creerPortDePersistanceMemoire,
  type ArchivePersistante,
} from "./persistance";

function creerArchive(id: string, version = 2): ArchivePersistante {
  return {
    id,
    version,
    contenu: JSON.stringify({ id, version }),
  };
}

describe("port de persistance en mémoire", () => {
  it("conserve atomiquement les deux snapshots courants les plus récents", async () => {
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 2 });

    await port.enregistrer(creerArchive("premier"));
    await port.enregistrer(creerArchive("deuxieme"));
    await port.enregistrer(creerArchive("troisieme"));

    await expect(port.lister()).resolves.toEqual([
      creerArchive("troisieme"),
      creerArchive("deuxieme"),
    ]);
    await expect(port.lirePlusRecente()).resolves.toEqual(
      creerArchive("troisieme"),
    );
  });

  it("ne supprime jamais une archive de version incompatible pendant la rotation", async () => {
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });
    const future = creerArchive("future", 99);

    await port.enregistrer(future);
    await port.enregistrer(creerArchive("courante-1"));
    await port.enregistrer(creerArchive("courante-2"));

    await expect(port.lister()).resolves.toEqual([
      creerArchive("courante-2"),
      future,
    ]);
  });

  it("isole une sous-version protégée d'un snapshot courant de même identité", async () => {
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });
    const protegee: ArchivePersistante = {
      id: "identite-partagee",
      version: 2,
      contenu: "sous-version-future",
      protegeeDeLaRotation: true,
    };

    await port.enregistrer(protegee);
    await port.enregistrer({
      id: "identite-partagee",
      version: 2,
      contenu: "snapshot-courant",
    });

    await expect(port.lister()).resolves.toEqual([
      {
        id: "identite-partagee",
        version: 2,
        contenu: "snapshot-courant",
      },
      protegee,
    ]);
  });

  it("ne remplace pas un snapshot courant homonyme par une autre archive future", async () => {
    const port = creerPortDePersistanceMemoire({ nombreDeSnapshots: 1 });
    const courante = creerArchive("identite-partagee");
    const future: ArchivePersistante = {
      ...courante,
      contenu: "sous-version-future-distincte",
    };

    await port.enregistrer(courante);
    await port.protegerDeLaRotation(future);

    await expect(port.lister()).resolves.toEqual([
      {
        ...future,
        protegeeDeLaRotation: true,
      },
      courante,
    ]);
  });

  it("laisse les snapshots précédents intacts si le quota refuse l'écriture", async () => {
    const port = creerPortDePersistanceMemoire({
      nombreDeSnapshots: 3,
      quotaOctets: 160,
    });
    const initiale = creerArchive("initiale");
    await port.enregistrer(initiale);

    await expect(
      port.enregistrer({
        id: "trop-volumineuse",
        version: 2,
        contenu: "x".repeat(500),
      }),
    ).rejects.toBeInstanceOf(ErreurQuotaSauvegarde);
    await expect(port.lister()).resolves.toEqual([initiale]);
  });

  it("archive une sauvegarde courante sans altérer son export portable", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const sauvegarde = creerSauvegarde(
      application.lireEtat(),
      creerReproductionInitiale(application.lireEtat()),
    );

    const archive = creerArchivePersistante(sauvegarde);

    expect(JSON.parse(archive.contenu)).toEqual(sauvegarde);
    expect(archive).toMatchObject({
      id: sauvegarde.id,
      version: 2,
    });
  });
});
