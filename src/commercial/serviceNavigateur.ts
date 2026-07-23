import {
  type IntentionCommerciale,
  type IssueDePaiementDeTest,
  type PortDuServiceCommercial,
} from "./controleur";

async function requeteJson<Resultat>(
  url: string,
  initialisation?: RequestInit,
): Promise<Resultat> {
  const reponse = await fetch(url, {
    credentials: "same-origin",
    ...initialisation,
    headers: {
      "Content-Type": "application/json",
      ...initialisation?.headers,
    },
  });
  const resultat = (await reponse.json()) as Resultat & {
    readonly erreur?: string;
  };
  if (!reponse.ok) {
    throw new Error(resultat.erreur ?? `Erreur HTTP ${reponse.status}`);
  }
  return resultat;
}

export function creerPortDuServiceCommercialNavigateur(): PortDuServiceCommercial {
  return {
    demanderLien: async (
      email: string,
      intention: IntentionCommerciale,
    ) =>
      requeteJson("/api/commercial/lien", {
        method: "POST",
        body: JSON.stringify({ email, intention }),
      }),
    verifierLien: async (jeton) =>
      requeteJson(
        `/api/commercial/lien?jeton=${encodeURIComponent(jeton)}`,
      ),
    demarrerPaiement: async () => {
      const paiement = await requeteJson<
        | {
            readonly mode: "test";
            readonly transactionId: string;
          }
        | {
            readonly mode: "paddle";
            readonly clientToken: string;
            readonly priceId: string;
            readonly identiteId: string;
            readonly commandeId: string;
          }
      >("/api/commercial/paiement", {
        method: "POST",
      });
      if (paiement.mode === "test") {
        return paiement;
      }

      const { initializePaddle } = await import("@paddle/paddle-js");
      let confirmer: (() => void) | undefined;
      const attendreConfirmation = new Promise<void>((resoudre) => {
        confirmer = resoudre;
      });
      const paddle = await initializePaddle({
        environment: paiement.clientToken.startsWith("test_")
          ? "sandbox"
          : "production",
        token: paiement.clientToken,
        eventCallback: (evenement) => {
          if (evenement.name === "checkout.completed") {
            confirmer?.();
          }
        },
      });
      if (paddle === undefined) {
        throw new Error("paddle-indisponible");
      }
      paddle.Checkout.open({
        items: [{ priceId: paiement.priceId, quantity: 1 }],
        customData: {
          identite_id: paiement.identiteId,
          commande_id: paiement.commandeId,
        },
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "fr",
          successUrl: window.location.href,
        },
      });
      return { mode: "paddle", attendreConfirmation };
    },
    finaliserPaiementDeTest: async (
      transactionId: string,
      issue: IssueDePaiementDeTest,
    ) => {
      await requeteJson("/api/commercial/paiement-test", {
        method: "POST",
        body: JSON.stringify({ transactionId, issue }),
      });
    },
    lireAcces: async () => requeteJson("/api/commercial/acces"),
    chargerContenuComplet: async () =>
      requeteJson("/api/commercial/contenu-complet"),
  };
}

const CLE_DU_STOCKAGE = "lanternes-de-cendre.acces-premium.v1";

export const stockageNavigateurAccesPremium = {
  lire: () => window.localStorage.getItem(CLE_DU_STOCKAGE),
  enregistrer: (valeur: string) =>
    window.localStorage.setItem(CLE_DU_STOCKAGE, valeur),
  effacer: () => window.localStorage.removeItem(CLE_DU_STOCKAGE),
};
