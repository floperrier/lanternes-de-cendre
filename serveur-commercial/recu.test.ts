import { describe, expect, it } from "vitest";

import {
  creerCorpsDeWebhookPaddle,
  creerServiceCommercialDeTest,
} from "./service";
import { CONTENU_PREMIUM_V1 } from "./contenuPremium";
import { verifierRecuPremium } from "../src/commercial/recu";

function obtenirRecu() {
  const service = creerServiceCommercialDeTest();
  const identiteId = "usr_recu";
  const commande = service.demarrerPaiement(identiteId);
  const corpsBrut = creerCorpsDeWebhookPaddle({
    evenementId: "evt_recu",
    transactionId: "txn_recu",
    commandeId: commande.commandeId,
    identiteId,
    type: "transaction.completed",
  });
  service.traiterWebhookPaddle({
    corpsBrut,
    signature: service.signerWebhookDeTest(corpsBrut),
  });
  return {
    identiteId,
    recu: service.lireAcces(identiteId).preuveLocale!,
  };
}

describe("reçu premium hors ligne", () => {
  it("authentifie asymétriquement l'identité et le contenu protégé", async () => {
    const { identiteId, recu } = obtenirRecu();
    await expect(
      verifierRecuPremium({
        recu,
        identiteId,
        contenu: CONTENU_PREMIUM_V1,
      }),
    ).resolves.toBe(true);
  });

  it("rejette un reçu forgé ou réutilisé avec un autre contenu", async () => {
    const { identiteId, recu } = obtenirRecu();
    const [chargeUtile] = recu.split(".");
    await expect(
      verifierRecuPremium({
        recu: `${chargeUtile}.${"A".repeat(86)}`,
        identiteId,
        contenu: CONTENU_PREMIUM_V1,
      }),
    ).resolves.toBe(false);
    await expect(
      verifierRecuPremium({
        recu,
        identiteId,
        contenu: { ...CONTENU_PREMIUM_V1, version: 2 },
      }),
    ).resolves.toBe(false);
  });
});
