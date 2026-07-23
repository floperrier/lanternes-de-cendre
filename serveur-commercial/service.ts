import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export type IntentionDuLien = "acheter" | "restaurer";
export type TypeDeWebhookPaddle =
  | "transaction.completed"
  | "transaction.payment_failed";

interface LienMagique {
  readonly empreinte: string;
  readonly email: string;
  readonly intention: IntentionDuLien;
  readonly expireA: number;
}

interface Identite {
  readonly identiteId: string;
  readonly email: string;
}

interface DroitPermanent {
  readonly identiteId: string;
  readonly permanent: true;
  readonly transactionId: string;
}

interface Transaction {
  readonly transactionId: string;
  readonly identiteId: string;
}

interface Session {
  readonly session: string;
  readonly identiteId: string;
}

interface ChargeUtilePaddle {
  readonly event_id: string;
  readonly event_type: TypeDeWebhookPaddle;
  readonly data: {
    readonly id: string;
    readonly custom_data?: {
      readonly identite_id?: string;
      readonly commande_id?: string;
    };
  };
}

export interface OptionsDuServiceCommercial {
  readonly secretWebhook: string;
  readonly secretPreuveLocale: string;
  readonly maintenant?: () => number;
}

export interface DemandeDeLien {
  readonly email: string;
  readonly intention: IntentionDuLien;
}

export interface ResultatDeLienDeTest {
  readonly statut: "envoye";
  readonly jetonDeTest: string;
}

export interface ResultatDIdentite {
  readonly session: string;
  readonly identiteId: string;
  readonly intention: IntentionDuLien;
}

export interface ResultatDAcces {
  readonly premium: boolean;
  readonly identiteId: string;
  readonly preuveLocale?: string;
}

export interface DiagnosticCommercial {
  readonly identites: readonly Identite[];
  readonly droits: readonly DroitPermanent[];
}

export interface ServiceCommercial {
  readonly demanderLien: (
    demande: DemandeDeLien,
  ) => Promise<ResultatDeLienDeTest>;
  readonly verifierLien: (jeton: string) => ResultatDIdentite;
  readonly demarrerPaiement: (session: string) => Transaction;
  readonly traiterWebhookPaddle: (requete: {
    readonly corpsBrut: string;
    readonly signature: string;
  }) => { readonly statut: "traite" | "duplique" | "ignore" };
  readonly lireAcces: (session: string) => ResultatDAcces;
  readonly signerWebhookDeTest: (corpsBrut: string) => string;
  readonly lireDiagnostic: () => DiagnosticCommercial;
}

const DUREE_DU_LIEN_MAGIQUE_MS = 5 * 60 * 1_000;
const DUREE_MAXIMALE_SIGNATURE_MS = 5 * 60 * 1_000;

function normaliserEmail(email: string): string {
  const normalise = email.trim().toLocaleLowerCase("en-US");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalise)) {
    throw new Error("adresse-email-invalide");
  }
  return normalise;
}

function nouveauJeton(): string {
  return randomBytes(32).toString("base64url");
}

function empreinte(jeton: string): string {
  return createHash("sha256").update(jeton).digest("base64url");
}

function comparerSignatures(attendue: string, recue: string): boolean {
  const attendueOctets = Buffer.from(attendue, "hex");
  const recueOctets = Buffer.from(recue, "hex");
  return (
    attendueOctets.length === recueOctets.length &&
    timingSafeEqual(attendueOctets, recueOctets)
  );
}

function lireSignature(signature: string): {
  readonly horodatage: number;
  readonly hachages: readonly string[];
} {
  const parties = signature.split(",");
  const horodatageTexte = parties
    .find((partie) => partie.startsWith("ts="))
    ?.slice(3);
  const hachages = parties
    .filter((partie) => partie.startsWith("h1="))
    .map((partie) => partie.slice(3));
  const horodatage = Number.parseInt(horodatageTexte ?? "", 10);
  if (!Number.isSafeInteger(horodatage) || hachages.length === 0) {
    throw new Error("signature-webhook-invalide");
  }
  return { horodatage, hachages };
}

function parserChargeUtile(corpsBrut: string): ChargeUtilePaddle {
  const valeur = JSON.parse(corpsBrut) as Partial<ChargeUtilePaddle>;
  if (
    typeof valeur.event_id !== "string" ||
    (valeur.event_type !== "transaction.completed" &&
      valeur.event_type !== "transaction.payment_failed") ||
    typeof valeur.data?.id !== "string"
  ) {
    throw new Error("charge-utile-paddle-invalide");
  }
  return valeur as ChargeUtilePaddle;
}

export function creerCorpsDeWebhookPaddle({
  evenementId,
  transactionId,
  identiteId,
  commandeId,
  type,
}: {
  readonly evenementId: string;
  readonly transactionId: string;
  readonly identiteId: string;
  readonly commandeId?: string;
  readonly type: TypeDeWebhookPaddle;
}): string {
  return JSON.stringify({
    event_id: evenementId,
    event_type: type,
    data: {
      id: transactionId,
      custom_data: {
        identite_id: identiteId,
        ...(commandeId === undefined
          ? {}
          : { commande_id: commandeId }),
      },
    },
  });
}

export function creerServiceCommercial({
  secretWebhook,
  secretPreuveLocale,
  maintenant = Date.now,
}: OptionsDuServiceCommercial): ServiceCommercial {
  if (secretWebhook.length < 32 || secretPreuveLocale.length < 32) {
    throw new Error("Les secrets commerciaux doivent contenir 32 caractères.");
  }

  const liens = new Map<string, LienMagique>();
  const identitesParEmail = new Map<string, Identite>();
  const sessions = new Map<string, Session>();
  const transactions = new Map<string, Transaction>();
  const droits = new Map<string, DroitPermanent>();
  const evenementsTraites = new Set<string>();

  const trouverSession = (session: string): Session => {
    const trouvee = sessions.get(session);
    if (trouvee === undefined) {
      throw new Error("session-commerciale-invalide");
    }
    return trouvee;
  };

  const signer = (corpsBrut: string, horodatage = maintenant()) => {
    const secondes = Math.floor(horodatage / 1_000);
    const hachage = createHmac("sha256", secretWebhook)
      .update(`${secondes}:${corpsBrut}`)
      .digest("hex");
    return `ts=${secondes},h1=${hachage}`;
  };

  return {
    demanderLien: async ({ email, intention }) => {
      const emailNormalise = normaliserEmail(email);
      const jeton = nouveauJeton();
      const cle = empreinte(jeton);
      liens.set(cle, {
        empreinte: cle,
        email: emailNormalise,
        intention,
        expireA: maintenant() + DUREE_DU_LIEN_MAGIQUE_MS,
      });
      return { statut: "envoye", jetonDeTest: jeton };
    },
    verifierLien: (jeton) => {
      const cle = empreinte(jeton);
      const lien = liens.get(cle);
      liens.delete(cle);
      if (lien === undefined || lien.expireA < maintenant()) {
        throw new Error("lien-magique-invalide-ou-expire");
      }
      let identite = identitesParEmail.get(lien.email);
      if (identite === undefined) {
        identite = {
          identiteId: `usr_${nouveauJeton().slice(0, 16)}`,
          email: lien.email,
        };
        identitesParEmail.set(lien.email, identite);
      }
      const session = `ses_${nouveauJeton()}`;
      sessions.set(session, {
        session,
        identiteId: identite.identiteId,
      });
      return {
        session,
        identiteId: identite.identiteId,
        intention: lien.intention,
      };
    },
    demarrerPaiement: (session) => {
      const identite = trouverSession(session);
      const transaction: Transaction = {
        transactionId: `txn_${nouveauJeton().slice(0, 16)}`,
        identiteId: identite.identiteId,
      };
      transactions.set(transaction.transactionId, transaction);
      return transaction;
    },
    traiterWebhookPaddle: ({ corpsBrut, signature }) => {
      const { horodatage, hachages } = lireSignature(signature);
      if (
        Math.abs(maintenant() - horodatage * 1_000) >
        DUREE_MAXIMALE_SIGNATURE_MS
      ) {
        throw new Error("signature-webhook-expiree");
      }
      const attendue = createHmac("sha256", secretWebhook)
        .update(`${horodatage}:${corpsBrut}`)
        .digest("hex");
      if (
        !hachages.some((hachage) =>
          comparerSignatures(attendue, hachage),
        )
      ) {
        throw new Error("signature-webhook-invalide");
      }

      const chargeUtile = parserChargeUtile(corpsBrut);
      if (evenementsTraites.has(chargeUtile.event_id)) {
        return { statut: "duplique" };
      }

      if (chargeUtile.event_type !== "transaction.completed") {
        evenementsTraites.add(chargeUtile.event_id);
        return { statut: "ignore" };
      }
      const transaction = transactions.get(chargeUtile.data.id);
      const transactionParCommande =
        chargeUtile.data.custom_data?.commande_id === undefined
          ? undefined
          : transactions.get(chargeUtile.data.custom_data.commande_id);
      const transactionAuthentifiee =
        transaction ?? transactionParCommande;
      if (
        transactionAuthentifiee === undefined ||
        chargeUtile.data.custom_data?.identite_id !==
          transactionAuthentifiee.identiteId
      ) {
        throw new Error("transaction-paddle-inconnue");
      }
      if (!droits.has(transactionAuthentifiee.identiteId)) {
        droits.set(transactionAuthentifiee.identiteId, {
          identiteId: transactionAuthentifiee.identiteId,
          permanent: true,
          transactionId: chargeUtile.data.id,
        });
      }
      evenementsTraites.add(chargeUtile.event_id);
      return { statut: "traite" };
    },
    lireAcces: (session) => {
      const identite = trouverSession(session);
      if (!droits.has(identite.identiteId)) {
        return { premium: false, identiteId: identite.identiteId };
      }
      const preuveLocale = createHmac("sha256", secretPreuveLocale)
        .update(`premium:${identite.identiteId}`)
        .digest("base64url");
      return {
        premium: true,
        identiteId: identite.identiteId,
        preuveLocale,
      };
    },
    signerWebhookDeTest: signer,
    lireDiagnostic: () => ({
      identites: [...identitesParEmail.values()],
      droits: [...droits.values()],
    }),
  };
}

export function creerServiceCommercialDeTest(): ServiceCommercial {
  return creerServiceCommercial({
    secretWebhook: "secret-webhook-paddle-test-32-caracteres",
    secretPreuveLocale: "secret-preuve-locale-test-32-caracteres",
  });
}
