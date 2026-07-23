import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { describe, expect, it } from "vitest";

import { creerAuthentificationCommerciale } from "./authentification";

const ORIGINE = "http://localhost:4173";

async function creerAuth(
  database: DatabaseSync = new DatabaseSync(":memory:"),
) {
  const messages: { email: string; url: string }[] = [];
  const auth = creerAuthentificationCommerciale({
    baseUrl: `${ORIGINE}/api/auth`,
    origineApplication: ORIGINE,
    secret: "mT8qL2vN7sR4xK9cD1gH6jP3wF0yB5eZaU",
    database,
    cookiesSecurises: false,
    envoyerLien: async (message) => {
      messages.push(message);
    },
    auditer: async () => undefined,
  });
  const contexte = await auth.$context;
  await contexte.runMigrations();
  return { auth, database, messages };
}

async function creerSession(
  contexte: Awaited<ReturnType<typeof creerAuth>>,
  callback = "acheter",
) {
  await contexte.auth.api.signInMagicLink({
    body: {
      email: "veilleuse@example.test",
      callbackURL: `${ORIGINE}/?commerce=${callback}`,
    },
    headers: new Headers({
      origin: ORIGINE,
      "x-real-ip": "127.0.0.1",
    }),
  });
  const verification = await contexte.auth.handler(
    new Request(contexte.messages.at(-1)!.url, { redirect: "manual" }),
  );
  const cookie = verification.headers.get("set-cookie")!.split(";")[0]!;
  const session = await contexte.auth.api.getSession({
    headers: new Headers({ cookie }),
  });
  return { verification, cookie, session };
}

describe("authentification commerciale Better Auth", () => {
  it("envoie un magic link, crée une session HttpOnly et consomme le lien une fois", async () => {
    const { auth, database, messages } = await creerAuth();
    await auth.api.signInMagicLink({
      body: {
        email: "veilleuse@example.test",
        callbackURL: `${ORIGINE}/?commerce=acheter`,
      },
      headers: new Headers({
        origin: ORIGINE,
        "x-real-ip": "127.0.0.1",
      }),
    });

    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      email: "veilleuse@example.test",
      url: expect.stringContaining("/api/auth/magic-link/verify?token="),
    });
    const verification = await auth.handler(
      new Request(messages[0]!.url, { redirect: "manual" }),
    );
    expect(verification.status).toBe(302);
    expect(verification.headers.get("location")).toBe(
      `${ORIGINE}/?commerce=acheter`,
    );
    const setCookie = verification.headers.get("set-cookie");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    const cookie = setCookie!.split(";")[0]!;
    const session = await auth.api.getSession({
      headers: new Headers({ cookie }),
    });
    expect(session?.user).toMatchObject({
      email: "veilleuse@example.test",
      emailVerified: true,
    });

    const rejeu = await auth.handler(
      new Request(messages[0]!.url, { redirect: "manual" }),
    );
    expect(rejeu.status).toBe(302);
    expect(rejeu.headers.get("location")).toContain("INVALID_TOKEN");
    database.close();
  });

  it("retrouve la même identité après redémarrage dans une autre session", async () => {
    const dossier = await mkdtemp(join(tmpdir(), "lanternes-auth-"));
    const chemin = join(dossier, "auth.sqlite");
    try {
      const premierContexte = await creerAuth(new DatabaseSync(chemin));
      const premiereSession = await creerSession(premierContexte);
      const premierIdentifiant = premiereSession.session?.user.id;
      premierContexte.database.close();

      const secondContexte = await creerAuth(new DatabaseSync(chemin));
      const secondeSession = await creerSession(
        secondContexte,
        "restaurer",
      );
      expect(secondeSession.session?.user.id).toBe(premierIdentifiant);
      expect(secondeSession.cookie).not.toBe(premiereSession.cookie);
      secondContexte.database.close();
    } finally {
      await rm(dossier, { recursive: true, force: true });
    }
  });
});
