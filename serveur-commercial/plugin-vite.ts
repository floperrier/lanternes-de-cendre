import { randomUUID } from "node:crypto";
import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";

import type { Plugin } from "vite";

import {
  creerCorpsDeWebhookPaddle,
  creerServiceCommercial,
  type ServiceCommercial,
} from "./service";

const NOM_DU_COOKIE = "lc_session";
const CORPS_MAXIMAL = 64 * 1_024;

interface OptionsDuPluginCommercial {
  readonly mode: string;
  readonly paddleClientToken?: string;
  readonly paddlePriceId?: string;
  readonly secretWebhook?: string;
  readonly secretPreuveLocale?: string;
}

function envoyerJson(
  reponse: ServerResponse,
  statut: number,
  valeur: unknown,
) {
  reponse.statusCode = statut;
  reponse.setHeader("Content-Type", "application/json; charset=utf-8");
  reponse.setHeader("Cache-Control", "no-store");
  reponse.end(JSON.stringify(valeur));
}

async function lireCorps(requete: IncomingMessage): Promise<string> {
  const morceaux: Buffer[] = [];
  let taille = 0;
  for await (const morceau of requete) {
    const octets = Buffer.isBuffer(morceau)
      ? morceau
      : Buffer.from(morceau);
    taille += octets.length;
    if (taille > CORPS_MAXIMAL) {
      throw new Error("corps-trop-volumineux");
    }
    morceaux.push(octets);
  }
  return Buffer.concat(morceaux).toString("utf8");
}

function lireSession(requete: IncomingMessage): string {
  const cookie = requete.headers.cookie
    ?.split(";")
    .map((partie) => partie.trim())
    .find((partie) => partie.startsWith(`${NOM_DU_COOKIE}=`));
  const session = cookie?.slice(NOM_DU_COOKIE.length + 1);
  if (session === undefined || session.length === 0) {
    throw new Error("session-commerciale-absente");
  }
  return decodeURIComponent(session);
}

function refuserMethode(reponse: ServerResponse) {
  envoyerJson(reponse, 405, { erreur: "methode-non-autorisee" });
}

function creerGestionnaire(
  service: ServiceCommercial,
  options: OptionsDuPluginCommercial,
) {
  const transactions = new Map<
    string,
    { readonly identiteId: string }
  >();
  const modePaiement =
    options.paddleClientToken !== undefined &&
    options.paddlePriceId !== undefined
      ? "paddle"
      : "test";

  return async (
    requete: IncomingMessage,
    reponse: ServerResponse,
  ): Promise<boolean> => {
    const url = new URL(
      requete.url ?? "/",
      `http://${requete.headers.host ?? "localhost"}`,
    );
    if (!url.pathname.startsWith("/api/")) {
      return false;
    }

    try {
      if (url.pathname === "/api/commercial/lien") {
        if (requete.method === "POST") {
          const corps = JSON.parse(await lireCorps(requete)) as {
            readonly email?: string;
            readonly intention?: "acheter" | "restaurer";
          };
          if (
            typeof corps.email !== "string" ||
            (corps.intention !== "acheter" &&
              corps.intention !== "restaurer")
          ) {
            envoyerJson(reponse, 400, { erreur: "demande-invalide" });
            return true;
          }
          const resultat = await service.demanderLien({
            email: corps.email,
            intention: corps.intention,
          });
          envoyerJson(reponse, 202, {
            statut: resultat.statut,
            ...(options.mode === "production"
              ? {}
              : { jetonDeTest: resultat.jetonDeTest }),
          });
          return true;
        }
        if (requete.method === "GET") {
          const jeton = url.searchParams.get("jeton");
          if (jeton === null) {
            envoyerJson(reponse, 400, { erreur: "jeton-absent" });
            return true;
          }
          const identite = service.verifierLien(jeton);
          const acces = service.lireAcces(identite.session);
          reponse.setHeader(
            "Set-Cookie",
            `${NOM_DU_COOKIE}=${encodeURIComponent(identite.session)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
          );
          envoyerJson(reponse, 200, acces);
          return true;
        }
        refuserMethode(reponse);
        return true;
      }

      if (url.pathname === "/api/commercial/paiement") {
        if (requete.method !== "POST") {
          refuserMethode(reponse);
          return true;
        }
        const transaction = service.demarrerPaiement(
          lireSession(requete),
        );
        transactions.set(transaction.transactionId, {
          identiteId: transaction.identiteId,
        });
        envoyerJson(
          reponse,
          200,
          modePaiement === "test"
            ? {
                mode: "test",
                transactionId: transaction.transactionId,
              }
            : {
                mode: "paddle",
                clientToken: options.paddleClientToken,
                priceId: options.paddlePriceId,
                identiteId: transaction.identiteId,
                commandeId: transaction.transactionId,
              },
        );
        return true;
      }

      if (url.pathname === "/api/commercial/paiement-test") {
        if (options.mode === "production") {
          envoyerJson(reponse, 404, { erreur: "introuvable" });
          return true;
        }
        if (requete.method !== "POST") {
          refuserMethode(reponse);
          return true;
        }
        lireSession(requete);
        const corps = JSON.parse(await lireCorps(requete)) as {
          readonly transactionId?: string;
          readonly issue?: "accepte" | "refuse";
        };
        const transaction =
          corps.transactionId === undefined
            ? undefined
            : transactions.get(corps.transactionId);
        if (
          transaction === undefined ||
          corps.transactionId === undefined ||
          (corps.issue !== "accepte" && corps.issue !== "refuse")
        ) {
          envoyerJson(reponse, 400, { erreur: "paiement-test-invalide" });
          return true;
        }
        const corpsBrut = creerCorpsDeWebhookPaddle({
          evenementId: `evt_${randomUUID()}`,
          transactionId: corps.transactionId,
          identiteId: transaction.identiteId,
          type:
            corps.issue === "accepte"
              ? "transaction.completed"
              : "transaction.payment_failed",
        });
        service.traiterWebhookPaddle({
          corpsBrut,
          signature: service.signerWebhookDeTest(corpsBrut),
        });
        envoyerJson(reponse, 200, { statut: "traite" });
        return true;
      }

      if (url.pathname === "/api/commercial/acces") {
        if (requete.method !== "GET") {
          refuserMethode(reponse);
          return true;
        }
        envoyerJson(
          reponse,
          200,
          service.lireAcces(lireSession(requete)),
        );
        return true;
      }

      if (url.pathname === "/api/commercial/contenu-complet") {
        if (requete.method !== "GET") {
          refuserMethode(reponse);
          return true;
        }
        const acces = service.lireAcces(lireSession(requete));
        if (!acces.premium) {
          envoyerJson(reponse, 403, { erreur: "acces-premium-requis" });
          return true;
        }
        reponse.setHeader("Cache-Control", "private, max-age=86400");
        envoyerJson(reponse, 200, {
          version: 1,
          catalogue: "campagne-v1",
        });
        return true;
      }

      if (url.pathname === "/api/webhooks/paddle") {
        if (requete.method !== "POST") {
          refuserMethode(reponse);
          return true;
        }
        const signature = requete.headers["paddle-signature"];
        if (typeof signature !== "string") {
          envoyerJson(reponse, 400, { erreur: "signature-absente" });
          return true;
        }
        envoyerJson(
          reponse,
          200,
          service.traiterWebhookPaddle({
            corpsBrut: await lireCorps(requete),
            signature,
          }),
        );
        return true;
      }

      envoyerJson(reponse, 404, { erreur: "introuvable" });
      return true;
    } catch (erreur) {
      const message =
        erreur instanceof Error ? erreur.message : "erreur-commerciale";
      envoyerJson(
        reponse,
        message.includes("session") ? 401 : 400,
        { erreur: message },
      );
      return true;
    }
  };
}

export function creerPluginCommercial(
  options: OptionsDuPluginCommercial,
): Plugin {
  return {
    name: "lanternes-service-commercial",
    configureServer(serveur) {
      const secretWebhook =
        options.secretWebhook ??
        (options.mode === "production"
          ? undefined
          : "secret-webhook-paddle-dev-32-caracteres");
      const secretPreuveLocale =
        options.secretPreuveLocale ??
        (options.mode === "production"
          ? undefined
          : "secret-preuve-locale-dev-32-caracteres");
      if (
        secretWebhook === undefined ||
        secretPreuveLocale === undefined
      ) {
        throw new Error(
          "Les secrets commerciaux sont obligatoires en production.",
        );
      }
      const service = creerServiceCommercial({
        secretWebhook,
        secretPreuveLocale,
      });
      const gerer = creerGestionnaire(service, options);
      serveur.middlewares.use((requete, reponse, suivant) => {
        void gerer(requete, reponse)
          .then((traitee) => {
            if (!traitee) {
              suivant();
            }
          })
          .catch(suivant);
      });
    },
  };
}
