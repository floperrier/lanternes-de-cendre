import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

import type { Plugin } from "vite";

import { creerAuthentificationCommerciale } from "./authentification";
import { CONTENU_PREMIUM_V1 } from "./contenuPremium";
import {
  creerCorpsDeWebhookPaddle,
  creerServiceCommercial,
  type ConfigurationDuProduit,
  type ServiceCommercial,
} from "./service";
import { creerDonneesCommercialesSqlite } from "./stockage";

const CORPS_MAXIMAL = 64 * 1_024;

interface OptionsDuPluginCommercial {
  readonly mode: string;
  readonly origineApplication: string;
  readonly cheminBaseDeDonnees: string;
  readonly paddleClientToken?: string;
  readonly secretWebhook?: string;
  readonly clePriveeDeRecu?: string;
  readonly secretBetterAuth?: string;
  readonly produit: ConfigurationDuProduit;
  readonly livraisonEmail?: {
    readonly url: string;
    readonly jeton: string;
  };
}

type AuthCommerciale = ReturnType<
  typeof creerAuthentificationCommerciale
>;

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

function convertirEntetes(requete: IncomingMessage): Headers {
  const entetes = new Headers();
  for (let index = 0; index < requete.rawHeaders.length; index += 2) {
    const nom = requete.rawHeaders[index];
    const valeur = requete.rawHeaders[index + 1];
    if (nom !== undefined && valeur !== undefined) {
      entetes.append(nom, valeur);
    }
  }
  if (requete.socket.remoteAddress !== undefined) {
    entetes.set("x-real-ip", requete.socket.remoteAddress);
  }
  return entetes;
}

async function transmettreReponseWeb(
  source: Response,
  cible: ServerResponse,
) {
  cible.statusCode = source.status;
  source.headers.forEach((valeur, nom) => {
    if (nom !== "set-cookie") {
      cible.setHeader(nom, valeur);
    }
  });
  const entetesEtendues = source.headers as Headers & {
    readonly getSetCookie?: () => string[];
  };
  const cookies = entetesEtendues.getSetCookie?.() ?? [];
  if (cookies.length > 0) {
    cible.setHeader("Set-Cookie", cookies);
  } else {
    const cookieUnique = source.headers.get("set-cookie");
    if (cookieUnique !== null) {
      cible.setHeader("Set-Cookie", cookieUnique);
    }
  }
  cible.end(Buffer.from(await source.arrayBuffer()));
}

async function gererBetterAuth(
  authentification: AuthCommerciale,
  requete: IncomingMessage,
  reponse: ServerResponse,
  url: URL,
) {
  const methode = requete.method ?? "GET";
  const corps =
    methode === "GET" || methode === "HEAD"
      ? undefined
      : await lireCorps(requete);
  const demande = new Request(url, {
    method: methode,
    headers: convertirEntetes(requete),
    ...(corps === undefined ? {} : { body: corps }),
    redirect: "manual",
  });
  await transmettreReponseWeb(
    await authentification.handler(demande),
    reponse,
  );
}

function refuserMethode(reponse: ServerResponse) {
  envoyerJson(reponse, 405, { erreur: "methode-non-autorisee" });
}

function creerGestionnaire(
  service: ServiceCommercial,
  authentification: AuthCommerciale,
  liensDeTest: Map<string, string>,
  options: OptionsDuPluginCommercial,
) {
  const commandesDeTest = new Map<
    string,
    { readonly identiteId: string }
  >();
  const modePaiement =
    options.paddleClientToken !== undefined ? "paddle" : "test";

  const lireIdentite = async (requete: IncomingMessage) => {
    const session = await authentification.api.getSession({
      headers: convertirEntetes(requete),
    });
    if (session === null) {
      throw new Error("session-commerciale-absente");
    }
    return session.user.id;
  };

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
      if (url.pathname.startsWith("/api/auth/")) {
        await gererBetterAuth(authentification, requete, reponse, url);
        return true;
      }

      if (url.pathname === "/api/commercial/lien") {
        if (requete.method !== "POST") {
          refuserMethode(reponse);
          return true;
        }
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
        const email = corps.email.trim().toLocaleLowerCase("en-US");
        liensDeTest.delete(email);
        await authentification.api.signInMagicLink({
          body: {
            email,
            callbackURL: `${options.origineApplication}/?commerce=${corps.intention}`,
          },
          headers: convertirEntetes(requete),
        });
        const urlDeTest = liensDeTest.get(email);
        liensDeTest.delete(email);
        envoyerJson(reponse, 202, {
          statut: "envoye",
          ...(options.mode === "production"
            ? {}
            : { urlDeTest }),
        });
        return true;
      }

      if (url.pathname === "/api/commercial/paiement") {
        if (requete.method !== "POST") {
          refuserMethode(reponse);
          return true;
        }
        const identiteId = await lireIdentite(requete);
        const commande = service.demarrerPaiement(identiteId);
        commandesDeTest.set(commande.commandeId, { identiteId });
        envoyerJson(
          reponse,
          200,
          modePaiement === "test"
            ? {
                mode: "test",
                transactionId: commande.commandeId,
              }
            : {
                mode: "paddle",
                clientToken: options.paddleClientToken,
                priceId: options.produit.priceId,
                identiteId,
                commandeId: commande.commandeId,
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
        const identiteId = await lireIdentite(requete);
        const corps = JSON.parse(await lireCorps(requete)) as {
          readonly transactionId?: string;
          readonly issue?: "accepte" | "refuse";
        };
        const commande =
          corps.transactionId === undefined
            ? undefined
            : commandesDeTest.get(corps.transactionId);
        if (
          commande === undefined ||
          commande.identiteId !== identiteId ||
          corps.transactionId === undefined ||
          (corps.issue !== "accepte" && corps.issue !== "refuse")
        ) {
          envoyerJson(reponse, 400, { erreur: "paiement-test-invalide" });
          return true;
        }
        const corpsBrut = creerCorpsDeWebhookPaddle({
          evenementId: `evt_${randomUUID()}`,
          transactionId: `txn_${randomUUID()}`,
          commandeId: corps.transactionId,
          identiteId,
          type:
            corps.issue === "accepte"
              ? "transaction.completed"
              : "transaction.payment_failed",
          produit: options.produit,
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
          service.lireAcces(await lireIdentite(requete)),
        );
        return true;
      }

      if (url.pathname === "/api/commercial/contenu-complet") {
        if (requete.method !== "GET") {
          refuserMethode(reponse);
          return true;
        }
        const acces = service.lireAcces(await lireIdentite(requete));
        if (!acces.premium) {
          envoyerJson(reponse, 403, { erreur: "acces-premium-requis" });
          return true;
        }
        envoyerJson(reponse, 200, CONTENU_PREMIUM_V1);
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
    async configureServer(serveur) {
      const secretWebhook =
        options.secretWebhook ??
        (options.mode === "production"
          ? undefined
          : "9vWN7kuUPHXCjogIq6Z5afE8eLwY1xQ3dRo0nTmB");
      const clePriveeDeRecu =
        options.clePriveeDeRecu ??
        (options.mode === "production"
          ? undefined
          : `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGoBdws9nVuf8ZvtDfSPHmd6e3/2jumRQA4HMdla7eEZ
-----END PRIVATE KEY-----`);
      const secretBetterAuth =
        options.secretBetterAuth ??
        (options.mode === "production"
          ? undefined
          : "uF2w7Jp9xK4mN8qR5sV1yB6dG3hL0cZtA9eQ");
      if (
        secretWebhook === undefined ||
        clePriveeDeRecu === undefined ||
        secretBetterAuth === undefined
      ) {
        throw new Error(
          "Les secrets commerciaux sont obligatoires en production.",
        );
      }
      if (
        options.mode === "production" &&
        options.livraisonEmail === undefined
      ) {
        throw new Error(
          "Un expéditeur de magic links est obligatoire en production.",
        );
      }

      mkdirSync(dirname(options.cheminBaseDeDonnees), {
        recursive: true,
      });
      const database = new DatabaseSync(options.cheminBaseDeDonnees);
      const donnees = creerDonneesCommercialesSqlite(database);
      database.exec(`
        CREATE TABLE IF NOT EXISTS audit_auth (
          id INTEGER PRIMARY KEY,
          evenement TEXT NOT NULL,
          identifiant TEXT NOT NULL,
          cree_a TEXT NOT NULL
        ) STRICT;
      `);
      const auditer = database.prepare(`
        INSERT INTO audit_auth (evenement, identifiant, cree_a)
        VALUES (?, ?, ?)
      `);
      const liensDeTest = new Map<string, string>();
      const authentification = creerAuthentificationCommerciale({
        baseUrl: `${options.origineApplication}/api/auth`,
        origineApplication: options.origineApplication,
        secret: secretBetterAuth,
        database,
        cookiesSecurises: options.origineApplication.startsWith("https://"),
        envoyerLien: async ({ email, url }) => {
          if (options.mode !== "production") {
            liensDeTest.set(email.toLocaleLowerCase("en-US"), url);
            return;
          }
          const livraison = options.livraisonEmail!;
          const reponse = await fetch(livraison.url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${livraison.jeton}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              template: "lanternes-magic-link",
              variables: { url },
            }),
          });
          if (!reponse.ok) {
            throw new Error("livraison-magic-link-echouee");
          }
        },
        auditer: async (evenement, identifiant) => {
          auditer.run(evenement, identifiant, new Date().toISOString());
        },
      });
      const contexte = await authentification.$context;
      await contexte.runMigrations();
      const service = creerServiceCommercial({
        secretWebhook,
        clePriveeDeRecu,
        produit: options.produit,
        donnees,
      });
      const gerer = creerGestionnaire(
        service,
        authentification,
        liensDeTest,
        options,
      );
      serveur.httpServer?.once("close", () => donnees.fermer());
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
