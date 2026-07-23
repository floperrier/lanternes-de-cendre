import {
  createHmac,
  createPrivateKey,
  randomBytes,
  sign,
  timingSafeEqual,
} from "node:crypto";

import { EMPREINTE_CONTENU_PREMIUM_V1 } from "./contenuPremium";
import {
  creerDonneesCommercialesMemoire,
  type CommandeCommerciale,
  type PortDeDonneesCommerciales,
} from "./stockage";

export type TypeDeWebhookPaddle =
  | "transaction.completed"
  | "transaction.payment_failed";

export interface ConfigurationDuProduit {
  readonly priceId: string;
  readonly productId: string;
  readonly quantite: 1;
  readonly devise: "EUR";
  readonly total: "1999";
}

interface ChargeUtilePaddle {
  readonly event_id: string;
  readonly event_type: TypeDeWebhookPaddle;
  readonly data: {
    readonly id: string;
    readonly status: "completed" | "past_due";
    readonly currency_code: string;
    readonly items: readonly {
      readonly price: {
        readonly id: string;
        readonly product_id: string;
        readonly unit_price: {
          readonly amount: string;
          readonly currency_code: string;
        };
        readonly billing_cycle: null | unknown;
      };
      readonly quantity: number;
    }[];
    readonly details: {
      readonly totals: {
        readonly grand_total: string;
        readonly currency_code: string;
      };
    };
    readonly custom_data?: {
      readonly identite_id?: string;
      readonly commande_id?: string;
    };
  };
}

export interface OptionsDuServiceCommercial {
  readonly secretWebhook: string;
  readonly clePriveeDeRecu: string;
  readonly produit: ConfigurationDuProduit;
  readonly donnees?: PortDeDonneesCommerciales;
  readonly maintenant?: () => number;
}

export interface ResultatDAcces {
  readonly premium: boolean;
  readonly identiteId: string;
  readonly preuveLocale?: string;
}

export interface DiagnosticCommercial {
  readonly droits: readonly {
    readonly identiteId: string;
    readonly permanent: true;
    readonly transactionId: string;
  }[];
}

export interface ServiceCommercial {
  readonly demarrerPaiement: (identiteId: string) => CommandeCommerciale;
  readonly traiterWebhookPaddle: (requete: {
    readonly corpsBrut: string;
    readonly signature: string;
  }) => { readonly statut: "traite" | "duplique" | "ignore" };
  readonly lireAcces: (identiteId: string) => ResultatDAcces;
  readonly signerWebhookDeTest: (corpsBrut: string) => string;
  readonly lireDiagnostic: () => DiagnosticCommercial;
}

const DUREE_MAXIMALE_SIGNATURE_MS = 5 * 60 * 1_000;
const PLACEHOLDERS_INTERDITS = [
  "remplacer",
  "change-me",
  "placeholder",
  "secret-webhook-paddle-test",
];

function nouveauJeton(): string {
  return randomBytes(32).toString("base64url");
}

function verifierSecret(secret: string) {
  const minuscules = secret.toLocaleLowerCase("en-US");
  if (
    secret.length < 32 ||
    new Set(secret).size < 16 ||
    PLACEHOLDERS_INTERDITS.some((placeholder) =>
      minuscules.includes(placeholder),
    )
  ) {
    throw new Error(
      "Le secret Paddle doit contenir au moins 32 caractères à forte entropie.",
    );
  }
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
  const parties = signature.split(",").map((partie) => partie.trim());
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

function transactionCorrespond(
  chargeUtile: ChargeUtilePaddle,
  commande: CommandeCommerciale,
): boolean {
  const [ligne] = chargeUtile.data.items;
  return (
    chargeUtile.data.status === "completed" &&
    chargeUtile.data.currency_code === commande.devise &&
    chargeUtile.data.items.length === 1 &&
    ligne?.price.id === commande.priceId &&
    ligne.price.product_id === commande.productId &&
    ligne.price.unit_price.amount === commande.total &&
    ligne.price.unit_price.currency_code === commande.devise &&
    ligne.price.billing_cycle === null &&
    ligne.quantity === commande.quantite &&
    chargeUtile.data.details.totals.grand_total === commande.total &&
    chargeUtile.data.details.totals.currency_code === commande.devise
  );
}

function encoderBase64Url(valeur: string | Buffer): string {
  return Buffer.from(valeur).toString("base64url");
}

function signerRecu(
  clePriveeDeRecu: string,
  identiteId: string,
): string {
  const chargeUtile = encoderBase64Url(
    JSON.stringify({
      version: 1,
      sujet: identiteId,
      portee: "acces-premium-permanent",
      contenu: EMPREINTE_CONTENU_PREMIUM_V1,
    }),
  );
  const signature = sign(
    null,
    Buffer.from(chargeUtile),
    createPrivateKey(clePriveeDeRecu),
  );
  return `${chargeUtile}.${encoderBase64Url(signature)}`;
}

export function creerCorpsDeWebhookPaddle({
  evenementId,
  transactionId,
  identiteId,
  commandeId,
  type,
  produit = PRODUIT_DE_TEST,
}: {
  readonly evenementId: string;
  readonly transactionId: string;
  readonly identiteId: string;
  readonly commandeId?: string;
  readonly type: TypeDeWebhookPaddle;
  readonly produit?: ConfigurationDuProduit;
}): string {
  return JSON.stringify({
    event_id: evenementId,
    event_type: type,
    data: {
      id: transactionId,
      status:
        type === "transaction.completed" ? "completed" : "past_due",
      currency_code: produit.devise,
      items: [
        {
          price: {
            id: produit.priceId,
            product_id: produit.productId,
            unit_price: {
              amount: produit.total,
              currency_code: produit.devise,
            },
            billing_cycle: null,
          },
          quantity: produit.quantite,
        },
      ],
      details: {
        totals: {
          grand_total: produit.total,
          currency_code: produit.devise,
        },
      },
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
  clePriveeDeRecu,
  produit,
  donnees = creerDonneesCommercialesMemoire(),
  maintenant = Date.now,
}: OptionsDuServiceCommercial): ServiceCommercial {
  verifierSecret(secretWebhook);
  createPrivateKey(clePriveeDeRecu);

  const signerWebhook = (
    corpsBrut: string,
    horodatage = maintenant(),
  ) => {
    const secondes = Math.floor(horodatage / 1_000);
    const hachage = createHmac("sha256", secretWebhook)
      .update(`${secondes}:${corpsBrut}`)
      .digest("hex");
    return `ts=${secondes},h1=${hachage}`;
  };

  return {
    demarrerPaiement: (identiteId) => {
      if (identiteId.length === 0) {
        throw new Error("identite-commerciale-invalide");
      }
      const commande: CommandeCommerciale = {
        commandeId: `cmd_${nouveauJeton().slice(0, 16)}`,
        identiteId,
        ...produit,
      };
      donnees.enregistrerCommande(commande);
      return commande;
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
      if (donnees.evenementEstTraite(chargeUtile.event_id)) {
        return { statut: "duplique" };
      }
      if (chargeUtile.event_type !== "transaction.completed") {
        donnees.marquerEvenementTraite(chargeUtile.event_id);
        return { statut: "ignore" };
      }

      const commandeId =
        chargeUtile.data.custom_data?.commande_id ??
        chargeUtile.data.id;
      const commande = donnees.trouverCommande(commandeId);
      if (
        commande === undefined ||
        chargeUtile.data.custom_data?.identite_id !==
          commande.identiteId
      ) {
        throw new Error("transaction-paddle-inconnue");
      }
      if (!transactionCorrespond(chargeUtile, commande)) {
        throw new Error("produit-paddle-inattendu");
      }
      donnees.enregistrerDroit({
        identiteId: commande.identiteId,
        permanent: true,
        transactionId: chargeUtile.data.id,
      });
      donnees.marquerEvenementTraite(chargeUtile.event_id);
      return { statut: "traite" };
    },
    lireAcces: (identiteId) =>
      donnees.trouverDroit(identiteId) === undefined
        ? { premium: false, identiteId }
        : {
            premium: true,
            identiteId,
            preuveLocale: signerRecu(clePriveeDeRecu, identiteId),
          },
    signerWebhookDeTest: signerWebhook,
    lireDiagnostic: () => ({ droits: donnees.listerDroits() }),
  };
}

export const PRODUIT_DE_TEST: ConfigurationDuProduit = {
  priceId: "pri_lanternes_v1_test",
  productId: "pro_lanternes_v1",
  quantite: 1,
  devise: "EUR",
  total: "1999",
};

export const CLE_PRIVEE_DE_RECU_DE_TEST = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIGoBdws9nVuf8ZvtDfSPHmd6e3/2jumRQA4HMdla7eEZ
-----END PRIVATE KEY-----`;

export function creerServiceCommercialDeTest(
  donnees = creerDonneesCommercialesMemoire(),
): ServiceCommercial {
  return creerServiceCommercial({
    secretWebhook:
      "9vWN7kuUPHXCjogIq6Z5afE8eLwY1xQ3dRo0nTmB",
    clePriveeDeRecu: CLE_PRIVEE_DE_RECU_DE_TEST,
    produit: PRODUIT_DE_TEST,
    donnees,
  });
}
