import { DatabaseSync } from "node:sqlite";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  creerDonneesCommercialesSqlite,
  VERSION_SCHEMA_COMMERCIAL,
} from "./stockage";

function creerSchemaV1(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE commandes_commerciales (
      commande_id TEXT PRIMARY KEY,
      identite_id TEXT NOT NULL,
      price_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantite INTEGER NOT NULL,
      devise TEXT NOT NULL,
      total TEXT NOT NULL
    ) STRICT;
    CREATE TABLE droits_commerciaux (
      identite_id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      permanent INTEGER NOT NULL CHECK (permanent = 1)
    ) STRICT;
    CREATE TABLE evenements_paddle (
      evenement_id TEXT PRIMARY KEY
    ) STRICT;
    INSERT INTO droits_commerciaux (
      identite_id, transaction_id, permanent
    ) VALUES ('identite-v1', 'transaction-v1', 1);
    PRAGMA user_version = 1;
  `);
}

describe("migrations du stockage commercial SQLite", () => {
  it("migre atomiquement V1 vers V2 sans perdre l’Accès premium", () => {
    const database = new DatabaseSync(":memory:");
    creerSchemaV1(database);

    const donnees = creerDonneesCommercialesSqlite(database);

    expect(
      database.prepare("PRAGMA user_version").get(),
    ).toEqual({ user_version: VERSION_SCHEMA_COMMERCIAL });
    expect(
      database
        .prepare("PRAGMA table_info(droits_commerciaux)")
        .all()
        .map((colonne) => (colonne as { name: string }).name),
    ).toContain("attribue_a");
    expect(donnees.trouverDroit("identite-v1")).toEqual({
      identiteId: "identite-v1",
      transactionId: "transaction-v1",
      permanent: true,
    });
    donnees.fermer();
  });

  it("refuse une base future sans modifier sa version, son journal ni son schéma", async () => {
    const racine = await mkdtemp(join(tmpdir(), "lanternes-schema-futur-"));
    const chemin = join(racine, "commercial.sqlite");
    const database = new DatabaseSync(chemin);
    try {
      database.exec(`
        PRAGMA journal_mode = DELETE;
        CREATE TABLE table_future (id INTEGER PRIMARY KEY) STRICT;
        PRAGMA user_version = 99;
      `);
      const schemaAvant = database
        .prepare(
          "SELECT type, name, sql FROM sqlite_schema ORDER BY type, name",
        )
        .all();

      expect(() => creerDonneesCommercialesSqlite(database)).toThrow(
        /version commerciale 99/i,
      );

      expect(database.prepare("PRAGMA user_version").get()).toEqual({
        user_version: 99,
      });
      expect(database.prepare("PRAGMA journal_mode").get()).toEqual({
        journal_mode: "delete",
      });
      expect(
        database
          .prepare(
            "SELECT type, name, sql FROM sqlite_schema ORDER BY type, name",
          )
          .all(),
      ).toEqual(schemaAvant);
    } finally {
      database.close();
      await rm(racine, { recursive: true, force: true });
    }
  });
});
