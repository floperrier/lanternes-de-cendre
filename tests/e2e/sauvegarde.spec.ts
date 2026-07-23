import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

import { TAILLE_MAX_ARCHIVE_SAUVEGARDE } from "../../src/sauvegarde/sauvegarde";
import { installerHorlogeFixe } from "./horloge";

const archiveV1 = readFileSync(
  new URL("../../src/sauvegarde/fixtures/sauvegarde-v1.json", import.meta.url),
  "utf8",
);
const sauvegardeV1 = JSON.parse(archiveV1) as { readonly id: string };

test("IndexedDB applique le même contrat tournant et protège les archives incompatibles", async ({
  page,
}) => {
  await page.goto("/");

  const resultat = await page.evaluate(async () => {
    const modulePersistance = await import(
      "/src/sauvegarde/persistance.ts"
    );
    const moduleSession = await import("/src/sauvegarde/session.ts");
    const moduleEmpreinte = await import("/src/simulation/empreinte.ts");
    const nomDeBase = "lanternes-de-cendre-contrat-e2e";
    const port = modulePersistance.creerPortDePersistanceIndexedDb({
      nomDeBase,
      nombreDeSnapshots: 2,
    });
    const creerArchive = (id: string, version = 6) => ({
      id,
      version,
      contenu: JSON.stringify({ id, version }),
    });

    const creerFutureMajeure = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-majeure-homonyme",
        version: 99,
        padding,
      });
    const futureMajeureA = creerFutureMajeure("contenu-a");
    const futureMajeureB = creerFutureMajeure("contenu-b");
    await Promise.all([
      moduleSession.importerCampagne(port, futureMajeureA),
      moduleSession.importerCampagne(port, futureMajeureB),
    ]);
    await moduleSession.importerCampagne(port, futureMajeureA);
    const creerArchiveCollision = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "meme-id",
        version: 2,
        versions: { simulation: 7 },
        padding,
      });
    const archiveA = creerArchiveCollision("16siydtuodeik");
    const archiveB = creerArchiveCollision("1qk2bgrpzapgu");
    const importsConcurrents = await Promise.all([
      moduleSession.importerCampagne(port, archiveA),
      moduleSession.importerCampagne(port, archiveB),
    ]);
    const reimport = await moduleSession.importerCampagne(port, archiveA);
    const statuts = [
      ...importsConcurrents.map((importation) => importation.statut),
      reimport.statut,
    ];
    await port.enregistrer(creerArchive("premier"));
    await port.enregistrer(creerArchive("deuxieme"));
    await port.enregistrer(creerArchive("troisieme"));
    const avantFermeture = await port.lister();
    port.fermer();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const portReouvert = modulePersistance.creerPortDePersistanceIndexedDb({
      nomDeBase,
      nombreDeSnapshots: 2,
    });
    const apresReouverture = await portReouvert.lister();
    portReouvert.fermer();
    return {
      statuts,
      empreintes: [
        moduleEmpreinte.formaterEmpreinteFnv1a32V1(archiveA),
        moduleEmpreinte.formaterEmpreinteFnv1a32V1(archiveB),
      ],
      avantFermeture,
      apresReouverture,
    };
  });

  expect(resultat.statuts).toEqual([
    "incompatible",
    "incompatible",
    "incompatible",
  ]);
  expect(resultat.empreintes).toEqual(["4014d717", "4014d717"]);
  const archivesAttendues = [
    {
      id: "troisieme",
      version: 6,
      contenu: JSON.stringify({ id: "troisieme", version: 6 }),
    },
    {
      id: "deuxieme",
      version: 6,
      contenu: JSON.stringify({ id: "deuxieme", version: 6 }),
    },
    {
      id: "meme-id",
      version: 2,
      contenu: JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "meme-id",
        version: 2,
        versions: { simulation: 7 },
        padding: "1qk2bgrpzapgu",
      }),
      protegeeDeLaRotation: true,
    },
    {
      id: "meme-id",
      version: 2,
      contenu: JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "meme-id",
        version: 2,
        versions: { simulation: 7 },
        padding: "16siydtuodeik",
      }),
      protegeeDeLaRotation: true,
    },
    {
      id: "future-majeure-homonyme",
      version: 99,
      contenu: JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-majeure-homonyme",
        version: 99,
        padding: "contenu-b",
      }),
      protegeeDeLaRotation: true,
    },
    {
      id: "future-majeure-homonyme",
      version: 99,
      contenu: JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-majeure-homonyme",
        version: 99,
        padding: "contenu-a",
      }),
      protegeeDeLaRotation: true,
    },
  ];
  expect(resultat.avantFermeture).toEqual(archivesAttendues);
  expect(resultat.apresReouverture).toEqual(archivesAttendues);
});

test("IndexedDB normalise les anciennes clés protégées sans perdre les contenus distincts", async ({
  page,
}) => {
  await page.goto("/");

  const resultat = await page.evaluate(async () => {
    const modulePersistance = await import(
      "/src/sauvegarde/persistance.ts"
    );
    const moduleSession = await import("/src/sauvegarde/session.ts");
    const nomDeBase = "lanternes-de-cendre-doublons-historiques-e2e";
    const port = modulePersistance.creerPortDePersistanceIndexedDb({
      nomDeBase,
      nombreDeSnapshots: 1,
    });
    await port.lister();
    const creerFuture = (padding: string) =>
      JSON.stringify({
        format: "lanternes-de-cendre.sauvegarde",
        id: "future-historique",
        version: 99,
        padding,
      });
    const futureA = creerFuture("contenu-a");
    const futureB = creerFuture("contenu-b");
    const base = await new Promise<IDBDatabase>((resolve, reject) => {
      const requete = indexedDB.open(nomDeBase, 1);
      requete.onsuccess = () => resolve(requete.result);
      requete.onerror = () => reject(requete.error);
    });
    const transaction = base.transaction("sauvegardes", "readwrite");
    const magasin = transaction.objectStore("sauvegardes");
    const creerArchiveHistorique = (contenu: string) => ({
      id: "future-historique",
      version: 99,
      contenu,
      protegeeDeLaRotation: true as const,
    });
    magasin.put({
      cle: "ancienne-cle-a-1",
      ordre: 1,
      archive: creerArchiveHistorique(futureA),
    });
    magasin.put({
      cle: "ancienne-cle-a-2",
      ordre: 2,
      archive: creerArchiveHistorique(futureA),
    });
    magasin.put({
      cle: "ancienne-cle-b",
      ordre: 3,
      archive: creerArchiveHistorique(futureB),
    });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
      transaction.onerror = () => reject(transaction.error);
    });
    base.close();

    const lireCles = async () => {
      const baseDeLecture = await new Promise<IDBDatabase>((resolve, reject) => {
        const requete = indexedDB.open(nomDeBase, 1);
        requete.onsuccess = () => resolve(requete.result);
        requete.onerror = () => reject(requete.error);
      });
      const transactionDeLecture = baseDeLecture.transaction(
        "sauvegardes",
        "readonly",
      );
      const requete = transactionDeLecture
        .objectStore("sauvegardes")
        .getAllKeys();
      const cles = await new Promise<IDBValidKey[]>((resolve, reject) => {
        requete.onsuccess = () => resolve(requete.result);
        requete.onerror = () => reject(requete.error);
      });
      baseDeLecture.close();
      return cles.map(String);
    };

    await moduleSession.ouvrirCampagne(port, "CENDRE-01");
    const apresNormalisation = await port.lister();
    const clesApresNormalisation = await lireCles();
    port.fermer();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const portReouvert = modulePersistance.creerPortDePersistanceIndexedDb({
      nomDeBase,
      nombreDeSnapshots: 1,
    });
    await moduleSession.ouvrirCampagne(portReouvert, "CENDRE-01");
    const apresReouverture = await portReouvert.lister();
    const clesApresReouverture = await lireCles();
    portReouvert.fermer();
    return {
      futureA,
      futureB,
      apresNormalisation,
      apresReouverture,
      clesApresNormalisation,
      clesApresReouverture,
    };
  });

  for (const archives of [
    resultat.apresNormalisation,
    resultat.apresReouverture,
  ]) {
    expect(archives).toHaveLength(2);
    expect(archives.map((archive) => archive.contenu)).toEqual(
      expect.arrayContaining([resultat.futureA, resultat.futureB]),
    );
    expect(archives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ protegeeDeLaRotation: true }),
      ]),
    );
  }
  for (const cles of [
    resultat.clesApresNormalisation,
    resultat.clesApresReouverture,
  ]) {
    expect(cles).toHaveLength(2);
    expect(cles.every((cle) => !cle.startsWith("ancienne-cle"))).toBe(true);
  }
});

test("le joueur reprend après fermeture puis importe son export dans un stockage vide", async ({
  browser,
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Cité-caravane" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(15_000);
  await expect(
    page.getByRole("region", { name: "Des signaux sous la cendre" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause" }).click();
  const tempsSauvegarde = await page
    .locator(".commandes-du-temps > time")
    .textContent();
  if (tempsSauvegarde === null) {
    throw new Error("Le Temps du convoi n’est pas affiché.");
  }
  await page.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(
    page
      .getByRole("region", { name: "Sauvegarde de Campagne" })
      .getByRole("status"),
  ).toHaveText("Sauvegarde à jour.");

  await page.reload();
  await expect(
    page.getByRole("region", { name: "Des signaux sous la cendre" }),
  ).toBeVisible();
  await expect(page.locator(".commandes-du-temps > time")).toHaveText(
    tempsSauvegarde,
  );

  await page
    .getByRole("region", { name: "Des signaux sous la cendre" })
    .getByRole("button", { name: "Ouvrir les Foyers" })
    .click();
  await expect(
    page.getByRole("region", { name: "Cité-caravane" }),
  ).toContainText("Habitants — 190");
  await page.clock.runFor(300);
  await expect(
    page
      .getByRole("region", { name: "Sauvegarde de Campagne" })
      .getByRole("status"),
  ).toHaveText("Sauvegarde à jour.");

  const telechargementAttendu = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter" }).click();
  const telechargement = await telechargementAttendu;
  const cheminExport = await telechargement.path();
  if (cheminExport === null) {
    throw new Error("L’export portable n’a pas produit de fichier.");
  }

  const contexteVide = await browser.newContext();
  const pageVide = await contexteVide.newPage();
  await pageVide.goto(new URL(page.url()).origin);
  await expect(
    pageVide.getByRole("region", { name: "Cité-caravane" }),
  ).toContainText("Habitants — 184");
  await pageVide
    .getByLabel("Choisir une sauvegarde à importer")
    .setInputFiles(cheminExport);

  await expect(
    pageVide.getByRole("region", { name: "Cité-caravane" }),
  ).toContainText("Habitants — 190");
  await expect(
    pageVide
      .getByRole("region", { name: "Sauvegarde de Campagne" })
      .getByRole("status"),
  ).toHaveText("Sauvegarde importée et reprise.");
  await contexteVide.close();
});

test("une sauvegarde incompatible reste réexportable avec une explication", async ({
  page,
}) => {
  await page.goto("/");
  const archiveOriginale = `{
  "format": "lanternes-de-cendre.sauvegarde",
  "id": "future",
  "version": 99,
  "donnees": { "intacte": true }
}`;

  const importeur = page.getByLabel("Choisir une sauvegarde à importer");
  await importeur.setInputFiles({
    name: "trop-volumineuse.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(TAILLE_MAX_ARCHIVE_SAUVEGARDE + 1),
  });
  const panneau = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await expect(panneau.getByRole("status")).toHaveText(
    "Le fichier dépasse la limite de 8 Mio.",
  );

  await importeur.setInputFiles({
      name: "future.json",
      mimeType: "application/json",
      buffer: Buffer.from(archiveOriginale),
  });

  await expect(panneau.getByRole("status")).toContainText("version 99");
  const telechargementAttendu = page.waitForEvent("download");
  await panneau.getByRole("button", { name: "Réexporter l’original" }).click();
  const telechargement = await telechargementAttendu;
  expect(telechargement.suggestedFilename()).toBe(
    "lanternes-de-cendre-future-original.json",
  );
});

test("l’original d’une sauvegarde migrée reste réexportable", async ({
  page,
}) => {
  await page.goto("/");
  const panneau = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await page
    .getByLabel("Choisir une sauvegarde à importer")
    .setInputFiles({
      name: "campagne-v1.json",
      mimeType: "application/json",
      buffer: Buffer.from(archiveV1),
    });

  await expect(panneau.getByRole("status")).toContainText(
    "Sauvegarde migrée et reprise",
  );
  const telechargementAttendu = page.waitForEvent("download");
  await panneau.getByRole("button", { name: "Réexporter l’original" }).click();
  const telechargement = await telechargementAttendu;
  expect(telechargement.suggestedFilename()).toBe(
    `lanternes-de-cendre-${sauvegardeV1.id}-original.json`,
  );
  const cheminTelecharge = await telechargement.path();
  if (cheminTelecharge === null) {
    throw new Error("Le téléchargement migré devrait être lisible sur disque.");
  }
  expect(readFileSync(cheminTelecharge, "utf8")).toBe(archiveV1);
});
