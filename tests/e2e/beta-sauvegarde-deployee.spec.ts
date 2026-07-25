import { readFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

const archiveV1 = readFileSync(
  new URL("../../src/sauvegarde/fixtures/sauvegarde-v1.json", import.meta.url),
  "utf8",
);
const sauvegardeV1 = JSON.parse(archiveV1) as { readonly id: string };

function panneauSauvegarde(page: Page) {
  return page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
}

async function attendreApplication(page: Page): Promise<void> {
  await expect(
    page.getByRole("region", { name: "Cité-caravane" }),
  ).toBeVisible();
}

async function sauvegarder(page: Page): Promise<void> {
  const panneau = panneauSauvegarde(page);
  await panneau.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(panneau.getByRole("status")).toHaveText(
    "Sauvegarde à jour.",
  );
}

async function lireTempsDuConvoi(page: Page): Promise<string> {
  const temps = await page
    .locator(".commandes-du-temps > time")
    .textContent();
  if (temps === null) {
    throw new Error("Le Temps du convoi n’est pas affiché.");
  }
  return temps;
}

async function avancerPuisSuspendre(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(1_000);
  await page.getByRole("button", { name: "Pause" }).click();
}

test("le build déployé migre une archive historique et préserve son original", async ({
  page,
}) => {
  await page.goto("/");
  await attendreApplication(page);
  const panneau = panneauSauvegarde(page);

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
  await panneau
    .getByRole("button", { name: "Réexporter l’original" })
    .click();
  const telechargement = await telechargementAttendu;
  expect(telechargement.suggestedFilename()).toBe(
    `lanternes-de-cendre-${sauvegardeV1.id}-original.json`,
  );
  const chemin = await telechargement.path();
  if (chemin === null) {
    throw new Error("L’archive historique réexportée est absente.");
  }
  expect(readFileSync(chemin, "utf8")).toBe(archiveV1);
});

test("un quota IndexedDB conserve le dernier point durable et permet la reprise", async ({
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");
  await attendreApplication(page);
  await avancerPuisSuspendre(page);
  await sauvegarder(page);
  const tempsDurable = await lireTempsDuConvoi(page);

  await page.evaluate(() => {
    const cible = window as typeof window & {
      restaurerPutIndexedDb?: () => void;
    };
    const original = IDBObjectStore.prototype.put;
    cible.restaurerPutIndexedDb = () => {
      Object.defineProperty(IDBObjectStore.prototype, "put", {
        configurable: true,
        writable: true,
        value: original,
      });
    };
    Object.defineProperty(IDBObjectStore.prototype, "put", {
      configurable: true,
      writable: true,
      value: () => {
        throw new DOMException(
          "Quota IndexedDB simulé sur le build déployé.",
          "QuotaExceededError",
        );
      },
    });
  });

  await avancerPuisSuspendre(page);
  await panneauSauvegarde(page)
    .getByRole("button", { name: "Sauvegarder" })
    .click();
  await expect(panneauSauvegarde(page).getByRole("status")).toContainText(
    "Quota IndexedDB simulé",
  );
  await page.evaluate(() => {
    const cible = window as typeof window & {
      restaurerPutIndexedDb?: () => void;
    };
    cible.restaurerPutIndexedDb?.();
  });

  await page.reload();
  await attendreApplication(page);
  await expect(page.locator(".commandes-du-temps > time")).toHaveText(
    tempsDurable,
  );
});

test("un snapshot interrompu ou corrompu retombe sur le point durable précédent", async ({
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");
  await attendreApplication(page);
  await avancerPuisSuspendre(page);
  await sauvegarder(page);
  const tempsPrecedent = await lireTempsDuConvoi(page);
  await avancerPuisSuspendre(page);
  await sauvegarder(page);
  expect(await lireTempsDuConvoi(page)).not.toBe(tempsPrecedent);

  const nombreDeSnapshots = await page.evaluate(async () => {
    const base = await new Promise<IDBDatabase>((resolve, reject) => {
      const requete = indexedDB.open("lanternes-de-cendre", 1);
      requete.onsuccess = () => resolve(requete.result);
      requete.onerror = () => reject(requete.error);
    });
    try {
      const transaction = base.transaction(
        "sauvegardes",
        "readwrite",
        { durability: "strict" },
      );
      const magasin = transaction.objectStore("sauvegardes");
      const enregistrements = await new Promise<
        {
          cle: string;
          ordre: number;
          archive: {
            id: string;
            version: number;
            contenu: string;
          };
        }[]
      >((resolve, reject) => {
        const requete = magasin.getAll();
        requete.onsuccess = () => resolve(requete.result);
        requete.onerror = () => reject(requete.error);
      });
      const [plusRecent] = enregistrements.sort(
        (gauche, droite) => droite.ordre - gauche.ordre,
      );
      if (plusRecent === undefined) {
        throw new Error("Aucun snapshot à corrompre.");
      }
      magasin.put({
        ...plusRecent,
        archive: {
          ...plusRecent.archive,
          contenu: '{"écriture":"interrompue"',
        },
      });
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error);
        transaction.onerror = () => reject(transaction.error);
      });
      return enregistrements.length;
    } finally {
      base.close();
    }
  });
  expect(nombreDeSnapshots).toBeGreaterThanOrEqual(2);

  await page.reload();
  await attendreApplication(page);
  await expect(page.locator(".commandes-du-temps > time")).toHaveText(
    tempsPrecedent,
  );
});
