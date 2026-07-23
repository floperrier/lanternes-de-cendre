import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { afterEach, describe, expect, it } from "vitest";

import {
  CLE_PRIVEE_DE_RECU_DE_TEST,
  PRODUIT_DE_TEST,
  creerCorpsDeWebhookPaddle,
  creerServiceCommercial,
  creerServiceCommercialDeTest,
} from "./service";
import { creerDonneesCommercialesSqlite } from "./stockage";

const IDENTITE = "usr_veilleuse";
const dossiersTemporaires: string[] = [];

afterEach(async () => {
  await Promise.all(
    dossiersTemporaires.splice(0).map((dossier) =>
      rm(dossier, { recursive: true, force: true }),
    ),
  );
});

function completerPaiement(
  service: ReturnType<typeof creerServiceCommercialDeTest>,
  evenementId = "evt_achat",
) {
  const commande = service.demarrerPaiement(IDENTITE);
  const corpsBrut = creerCorpsDeWebhookPaddle({
    evenementId,
    transactionId: `txn_${evenementId}`,
    commandeId: commande.commandeId,
    identiteId: IDENTITE,
    type: "transaction.completed",
  });
  return {
    commande,
    corpsBrut,
    signature: service.signerWebhookDeTest(corpsBrut),
  };
}

describe("service commercial", () => {
  it("accorde un Accès premium permanent après le webhook Paddle authentifié", () => {
    const service = creerServiceCommercialDeTest();
    const paiement = completerPaiement(service);

    expect(
      service.traiterWebhookPaddle({
        corpsBrut: paiement.corpsBrut,
        signature: paiement.signature,
      }),
    ).toEqual({ statut: "traite" });
    expect(service.lireAcces(IDENTITE)).toMatchObject({
      premium: true,
      identiteId: IDENTITE,
      preuveLocale: expect.stringMatching(/^[^.]+\.[^.]+$/),
    });
  });

  it("rend le webhook idempotent et ne crée qu'un droit", () => {
    const service = creerServiceCommercialDeTest();
    const paiement = completerPaiement(service, "evt_duplique");

    expect(
      service.traiterWebhookPaddle({
        corpsBrut: paiement.corpsBrut,
        signature: paiement.signature,
      }),
    ).toEqual({ statut: "traite" });
    expect(
      service.traiterWebhookPaddle({
        corpsBrut: paiement.corpsBrut,
        signature: paiement.signature,
      }),
    ).toEqual({ statut: "duplique" });
    expect(service.lireDiagnostic().droits).toHaveLength(1);
  });

  it("persiste le droit et l'idempotence après redémarrage du service", async () => {
    const dossier = await mkdtemp(join(tmpdir(), "lanternes-commerce-"));
    dossiersTemporaires.push(dossier);
    const chemin = join(dossier, "commerce.sqlite");
    const donnees1 = creerDonneesCommercialesSqlite(
      new DatabaseSync(chemin),
    );
    const service1 = creerServiceCommercialDeTest(donnees1);
    const paiement = completerPaiement(service1, "evt_redemarrage");
    service1.traiterWebhookPaddle({
      corpsBrut: paiement.corpsBrut,
      signature: paiement.signature,
    });
    donnees1.fermer();

    const donnees2 = creerDonneesCommercialesSqlite(
      new DatabaseSync(chemin),
    );
    const service2 = creerServiceCommercialDeTest(donnees2);
    expect(service2.lireAcces(IDENTITE).premium).toBe(true);
    expect(
      service2.traiterWebhookPaddle({
        corpsBrut: paiement.corpsBrut,
        signature: paiement.signature,
      }),
    ).toEqual({ statut: "duplique" });
    donnees2.fermer();
  });

  it("n'accorde aucun droit après un paiement refusé", () => {
    const service = creerServiceCommercialDeTest();
    const commande = service.demarrerPaiement(IDENTITE);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_refus",
      transactionId: "txn_refus",
      commandeId: commande.commandeId,
      identiteId: IDENTITE,
      type: "transaction.payment_failed",
    });

    expect(
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: service.signerWebhookDeTest(corpsBrut),
      }),
    ).toEqual({ statut: "ignore" });
    expect(service.lireAcces(IDENTITE)).toEqual({
      premium: false,
      identiteId: IDENTITE,
    });
  });

  it("rejette une autre référence, un autre produit ou un total inattendu", () => {
    const service = creerServiceCommercialDeTest();
    const commande = service.demarrerPaiement(IDENTITE);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_mauvais_produit",
      transactionId: "txn_mauvais_produit",
      commandeId: commande.commandeId,
      identiteId: IDENTITE,
      type: "transaction.completed",
      produit: {
        ...PRODUIT_DE_TEST,
        priceId: "pri_autre_produit",
        total: "1999",
      },
    });

    expect(() =>
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: service.signerWebhookDeTest(corpsBrut),
      }),
    ).toThrow("produit-paddle-inattendu");
    expect(service.lireAcces(IDENTITE).premium).toBe(false);
  });

  it("rejette une signature forgée", () => {
    const service = creerServiceCommercialDeTest();
    const paiement = completerPaiement(service, "evt_forge");

    expect(() =>
      service.traiterWebhookPaddle({
        corpsBrut: paiement.corpsBrut,
        signature: `ts=${Math.floor(Date.now() / 1_000)},h1=${"0".repeat(64)}`,
      }),
    ).toThrow("signature-webhook-invalide");
    expect(service.lireAcces(IDENTITE).premium).toBe(false);
  });

  it("sépare les droits de toute donnée personnelle ou de Campagne", () => {
    const service = creerServiceCommercialDeTest();
    const paiement = completerPaiement(service, "evt_separation");
    service.traiterWebhookPaddle({
      corpsBrut: paiement.corpsBrut,
      signature: paiement.signature,
    });

    const diagnostic = service.lireDiagnostic();
    expect(diagnostic.droits).toEqual([
      {
        identiteId: IDENTITE,
        permanent: true,
        transactionId: "txn_evt_separation",
      },
    ]);
    expect(JSON.stringify(diagnostic)).not.toMatch(
      /email|campagne|graine|snapshot|commande/i,
    );
  });

  it("refuse les placeholders de secrets même s'ils sont assez longs", () => {
    expect(() =>
      creerServiceCommercial({
        secretWebhook:
          "remplacer-par-un-secret-de-32-caracteres-minimum",
        clePriveeDeRecu: CLE_PRIVEE_DE_RECU_DE_TEST,
        produit: PRODUIT_DE_TEST,
      }),
    ).toThrow(/forte entropie/);
  });
});
