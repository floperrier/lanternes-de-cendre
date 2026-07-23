import { describe, expect, it } from "vitest";

import {
  creerCorpsDeWebhookPaddle,
  creerServiceCommercialDeTest,
} from "./service";

const EMAIL = "veilleuse@example.test";

async function identifier(
  service: ReturnType<typeof creerServiceCommercialDeTest>,
  email = EMAIL,
) {
  const demande = await service.demanderLien({
    email,
    intention: "acheter",
  });
  return service.verifierLien(demande.jetonDeTest);
}

describe("service commercial", () => {
  it("accorde un Accès premium permanent après le webhook Paddle authentifié", async () => {
    const service = creerServiceCommercialDeTest();
    const identite = await identifier(service);
    const paiement = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_achat",
      transactionId: paiement.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.completed",
    });

    expect(
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: service.signerWebhookDeTest(corpsBrut),
      }),
    ).toEqual({ statut: "traite" });
    expect(service.lireAcces(identite.session)).toMatchObject({
      premium: true,
      identiteId: identite.identiteId,
      preuveLocale: expect.any(String),
    });
  });

  it("rend le webhook idempotent et ne crée qu'un droit", async () => {
    const service = creerServiceCommercialDeTest();
    const identite = await identifier(service);
    const paiement = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_duplique",
      transactionId: paiement.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.completed",
    });
    const signature = service.signerWebhookDeTest(corpsBrut);

    expect(
      service.traiterWebhookPaddle({ corpsBrut, signature }),
    ).toEqual({ statut: "traite" });
    expect(
      service.traiterWebhookPaddle({ corpsBrut, signature }),
    ).toEqual({ statut: "duplique" });
    expect(service.lireDiagnostic().droits).toHaveLength(1);
  });

  it("relie la transaction Paddle officielle à la commande créée avant le checkout", async () => {
    const service = creerServiceCommercialDeTest();
    const identite = await identifier(service);
    const commande = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_transaction_officielle",
      transactionId: "txn_paddle_officielle",
      commandeId: commande.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.completed",
    });

    expect(
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: service.signerWebhookDeTest(corpsBrut),
      }),
    ).toEqual({ statut: "traite" });
    expect(service.lireDiagnostic().droits).toEqual([
      {
        identiteId: identite.identiteId,
        permanent: true,
        transactionId: "txn_paddle_officielle",
      },
    ]);
  });

  it("rejette une signature forgée et un lien magique rejoué", async () => {
    const service = creerServiceCommercialDeTest();
    const demande = await service.demanderLien({
      email: EMAIL,
      intention: "acheter",
    });
    const identite = service.verifierLien(demande.jetonDeTest);
    expect(() => service.verifierLien(demande.jetonDeTest)).toThrow(
      "lien-magique-invalide-ou-expire",
    );
    const paiement = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_forge",
      transactionId: paiement.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.completed",
    });

    expect(() =>
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: `ts=${Math.floor(Date.now() / 1_000)},h1=${"0".repeat(64)}`,
      }),
    ).toThrow("signature-webhook-invalide");
    expect(service.lireAcces(identite.session).premium).toBe(false);
  });

  it("n'accorde aucun droit après un paiement refusé", async () => {
    const service = creerServiceCommercialDeTest();
    const identite = await identifier(service, "refus@example.test");
    const paiement = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_refus",
      transactionId: paiement.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.payment_failed",
    });

    expect(
      service.traiterWebhookPaddle({
        corpsBrut,
        signature: service.signerWebhookDeTest(corpsBrut),
      }),
    ).toEqual({ statut: "ignore" });
    expect(service.lireAcces(identite.session)).toEqual({
      premium: false,
      identiteId: identite.identiteId,
    });
  });

  it("restaure le droit dans une nouvelle session sans transférer la progression", async () => {
    const service = creerServiceCommercialDeTest();
    const premiereIdentite = await identifier(service);
    const paiement = service.demarrerPaiement(premiereIdentite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_restauration",
      transactionId: paiement.transactionId,
      identiteId: premiereIdentite.identiteId,
      type: "transaction.completed",
    });
    service.traiterWebhookPaddle({
      corpsBrut,
      signature: service.signerWebhookDeTest(corpsBrut),
    });

    const restauration = await service.demanderLien({
      email: EMAIL,
      intention: "restaurer",
    });
    const deuxiemeIdentite = service.verifierLien(
      restauration.jetonDeTest,
    );

    expect(deuxiemeIdentite.session).not.toBe(premiereIdentite.session);
    expect(deuxiemeIdentite.identiteId).toBe(
      premiereIdentite.identiteId,
    );
    expect(service.lireAcces(deuxiemeIdentite.session).premium).toBe(true);
  });

  it("sépare les données personnelles, les droits et toute donnée de Campagne", async () => {
    const service = creerServiceCommercialDeTest();
    const identite = await identifier(service);
    const paiement = service.demarrerPaiement(identite.session);
    const corpsBrut = creerCorpsDeWebhookPaddle({
      evenementId: "evt_separation",
      transactionId: paiement.transactionId,
      identiteId: identite.identiteId,
      type: "transaction.completed",
    });
    service.traiterWebhookPaddle({
      corpsBrut,
      signature: service.signerWebhookDeTest(corpsBrut),
    });

    const diagnostic = service.lireDiagnostic();
    expect(diagnostic.identites).toEqual([
      { identiteId: identite.identiteId, email: EMAIL },
    ]);
    expect(diagnostic.droits).toEqual([
      {
        identiteId: identite.identiteId,
        permanent: true,
        transactionId: paiement.transactionId,
      },
    ]);
    expect(JSON.stringify(diagnostic)).not.toMatch(
      /campagne|graine|snapshot|commande/i,
    );
  });
});
