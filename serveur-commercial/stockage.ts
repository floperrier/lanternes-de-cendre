import type { DatabaseSync } from "node:sqlite";

export const VERSION_SCHEMA_COMMERCIAL = Number.parseInt("2", 10);

export interface CommandeCommerciale {
  readonly commandeId: string;
  readonly identiteId: string;
  readonly priceId: string;
  readonly productId: string;
  readonly quantite: 1;
  readonly devise: "EUR";
  readonly total: "1999";
}

export interface DroitCommercial {
  readonly identiteId: string;
  readonly permanent: true;
  readonly transactionId: string;
}

export interface PortDeDonneesCommerciales {
  readonly enregistrerCommande: (commande: CommandeCommerciale) => void;
  readonly trouverCommande: (
    commandeId: string,
  ) => CommandeCommerciale | undefined;
  readonly enregistrerDroit: (droit: DroitCommercial) => void;
  readonly trouverDroit: (
    identiteId: string,
  ) => DroitCommercial | undefined;
  readonly evenementEstTraite: (evenementId: string) => boolean;
  readonly marquerEvenementTraite: (evenementId: string) => void;
  readonly listerDroits: () => readonly DroitCommercial[];
  readonly fermer: () => void;
}

export function creerDonneesCommercialesMemoire(): PortDeDonneesCommerciales {
  const commandes = new Map<string, CommandeCommerciale>();
  const droits = new Map<string, DroitCommercial>();
  const evenements = new Set<string>();
  return {
    enregistrerCommande: (commande) => {
      commandes.set(commande.commandeId, commande);
    },
    trouverCommande: (commandeId) => commandes.get(commandeId),
    enregistrerDroit: (droit) => {
      if (!droits.has(droit.identiteId)) {
        droits.set(droit.identiteId, droit);
      }
    },
    trouverDroit: (identiteId) => droits.get(identiteId),
    evenementEstTraite: (evenementId) => evenements.has(evenementId),
    marquerEvenementTraite: (evenementId) => {
      evenements.add(evenementId);
    },
    listerDroits: () => [...droits.values()],
    fermer: () => undefined,
  };
}

interface LigneDeCommande {
  readonly commande_id: string;
  readonly identite_id: string;
  readonly price_id: string;
  readonly product_id: string;
  readonly quantite: number;
  readonly devise: string;
  readonly total: string;
}

interface LigneDeDroit {
  readonly identite_id: string;
  readonly transaction_id: string;
}

function lireVersionSchema(database: DatabaseSync): number {
  const resultat = database
    .prepare("PRAGMA user_version")
    .get() as { readonly user_version: number };
  return resultat.user_version;
}

function migrerSchemaCommercial(database: DatabaseSync): void {
  const versionInitiale = lireVersionSchema(database);
  if (versionInitiale > VERSION_SCHEMA_COMMERCIAL) {
    throw new Error(
      `Version commerciale ${versionInitiale} plus récente que ${VERSION_SCHEMA_COMMERCIAL}.`,
    );
  }
  database.exec("PRAGMA journal_mode = WAL;");

  database.exec("BEGIN IMMEDIATE;");
  try {
    let version = versionInitiale;
    if (version === 0) {
      database.exec(`
        CREATE TABLE IF NOT EXISTS commandes_commerciales (
          commande_id TEXT PRIMARY KEY,
          identite_id TEXT NOT NULL,
          price_id TEXT NOT NULL,
          product_id TEXT NOT NULL,
          quantite INTEGER NOT NULL,
          devise TEXT NOT NULL,
          total TEXT NOT NULL
        ) STRICT;
        CREATE TABLE IF NOT EXISTS droits_commerciaux (
          identite_id TEXT PRIMARY KEY,
          transaction_id TEXT NOT NULL,
          permanent INTEGER NOT NULL CHECK (permanent = 1)
        ) STRICT;
        CREATE TABLE IF NOT EXISTS evenements_paddle (
          evenement_id TEXT PRIMARY KEY
        ) STRICT;
        PRAGMA user_version = 1;
      `);
      version = 1;
    }
    if (version < 2 && VERSION_SCHEMA_COMMERCIAL >= 2) {
      database.exec(`
        ALTER TABLE droits_commerciaux
        ADD COLUMN attribue_a TEXT NOT NULL DEFAULT 'migration-v1';
        PRAGMA user_version = 2;
      `);
    }
    database.exec("COMMIT;");
  } catch (erreur) {
    database.exec("ROLLBACK;");
    throw erreur;
  }
}

export function creerDonneesCommercialesSqlite(
  database: DatabaseSync,
): PortDeDonneesCommerciales {
  migrerSchemaCommercial(database);
  const insererCommande = database.prepare(`
    INSERT OR REPLACE INTO commandes_commerciales (
      commande_id, identite_id, price_id, product_id, quantite, devise, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const lireCommande = database.prepare(`
    SELECT commande_id, identite_id, price_id, product_id, quantite, devise, total
    FROM commandes_commerciales WHERE commande_id = ?
  `);
  const insererDroit = database.prepare(`
    INSERT OR IGNORE INTO droits_commerciaux (
      identite_id, transaction_id, permanent
    ) VALUES (?, ?, 1)
  `);
  const lireDroit = database.prepare(`
    SELECT identite_id, transaction_id
    FROM droits_commerciaux WHERE identite_id = ?
  `);
  const evenementExiste = database.prepare(`
    SELECT 1 AS present FROM evenements_paddle WHERE evenement_id = ?
  `);
  const insererEvenement = database.prepare(`
    INSERT OR IGNORE INTO evenements_paddle (evenement_id) VALUES (?)
  `);
  const listerDroits = database.prepare(`
    SELECT identite_id, transaction_id FROM droits_commerciaux
    ORDER BY identite_id
  `);

  const projeterCommande = (
    ligne: LigneDeCommande | undefined,
  ): CommandeCommerciale | undefined =>
    ligne === undefined
      ? undefined
      : {
          commandeId: ligne.commande_id,
          identiteId: ligne.identite_id,
          priceId: ligne.price_id,
          productId: ligne.product_id,
          quantite: 1,
          devise: "EUR",
          total: ligne.total as "1999",
        };

  const projeterDroit = (
    ligne: LigneDeDroit | undefined,
  ): DroitCommercial | undefined =>
    ligne === undefined
      ? undefined
      : {
          identiteId: ligne.identite_id,
          transactionId: ligne.transaction_id,
          permanent: true,
        };

  return {
    enregistrerCommande: (commande) => {
      insererCommande.run(
        commande.commandeId,
        commande.identiteId,
        commande.priceId,
        commande.productId,
        commande.quantite,
        commande.devise,
        commande.total,
      );
    },
    trouverCommande: (commandeId) =>
      projeterCommande(
        lireCommande.get(commandeId) as LigneDeCommande | undefined,
      ),
    enregistrerDroit: (droit) => {
      insererDroit.run(droit.identiteId, droit.transactionId);
    },
    trouverDroit: (identiteId) =>
      projeterDroit(
        lireDroit.get(identiteId) as LigneDeDroit | undefined,
      ),
    evenementEstTraite: (evenementId) =>
      evenementExiste.get(evenementId) !== undefined,
    marquerEvenementTraite: (evenementId) => {
      insererEvenement.run(evenementId);
    },
    listerDroits: () =>
      (listerDroits.all() as unknown as LigneDeDroit[]).map(
        (ligne) => projeterDroit(ligne)!,
      ),
    fermer: () => database.close(),
  };
}
