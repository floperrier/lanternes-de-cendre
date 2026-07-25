import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer as creerServeurTcp } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { expect, test } from "@playwright/test";

async function choisirPortLibre(): Promise<number> {
  const serveur = creerServeurTcp();
  return new Promise((resolve, reject) => {
    serveur.once("error", reject);
    serveur.listen(0, "127.0.0.1", () => {
      const adresse = serveur.address();
      if (adresse === null || typeof adresse === "string") {
        serveur.close();
        reject(new Error("port-libre-indisponible"));
        return;
      }
      serveur.close((erreur) =>
        erreur === undefined ? resolve(adresse.port) : reject(erreur),
      );
    });
  });
}

async function lancerAvecEnvironnement(
  environnement: Readonly<Record<string, string | undefined>>,
): Promise<{
  readonly arreteAvantEcoute: boolean;
  readonly code: number | null;
  readonly sortie: string;
}> {
  const port = await choisirPortLibre();
  const processus = spawn(
    process.execPath,
    [resolve("dist-beta/server/serveur.mjs")],
    {
      cwd: resolve("dist-beta"),
      env: {
        ...process.env,
        HOST: "127.0.0.1",
        PORT: String(port),
        ...environnement,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let sortie = "";
  processus.stdout?.on("data", (morceau) => {
    sortie += morceau.toString();
  });
  processus.stderr?.on("data", (morceau) => {
    sortie += morceau.toString();
  });
  const arreteAvantEcoute = await Promise.race([
    new Promise<true>((resolve) =>
      processus.once("exit", () => resolve(true)),
    ),
    new Promise<false>((resolve) =>
      setTimeout(() => resolve(false), 1_500),
    ),
  ]);
  if (!arreteAvantEcoute) {
    processus.kill("SIGTERM");
    await new Promise<void>((resolve) =>
      processus.once("exit", () => resolve()),
    );
  }
  return {
    arreteAvantEcoute,
    code: processus.exitCode,
    sortie,
  };
}

test("le binaire déployé refuse un mode commercial inconnu avant d’écouter", async () => {
  const resultat = await lancerAvecEnvironnement({
    BETA_COMMERCIAL_MODE: "prodution",
  });

  expect(resultat).toMatchObject({
    arreteAvantEcoute: true,
    code: 1,
    sortie: expect.stringMatching(/mode commercial inconnu/i),
  });
});

test("le binaire déployé refuse des références Paddle vides en production", async () => {
  const racine = await mkdtemp(join(tmpdir(), "lanternes-config-prod-"));
  try {
    const resultat = await lancerAvecEnvironnement({
      BETA_COMMERCIAL_MODE: "production",
      COMMERCIAL_ORIGIN: "https://beta.example.test",
      COMMERCIAL_DATABASE_PATH: join(racine, "commercial.sqlite"),
      PADDLE_CLIENT_TOKEN: "live_7d279f61a3499fed520f7cd8c08",
      PADDLE_WEBHOOK_SECRET:
        "9vWN7kuUPHXCjogIq6Z5afE8eLwY1xQ3dRo0nTmB",
      PADDLE_PRICE_ID: "",
      PADDLE_PRODUCT_ID: "",
      PREMIUM_RECEIPT_PRIVATE_KEY:
        "-----BEGIN PRIVATE KEY-----\\nMC4CAQAwBQYDK2VwBCIEIGoBdws9nVuf8ZvtDfSPHmd6e3/2jumRQA4HMdla7eEZ\\n-----END PRIVATE KEY-----",
      BETTER_AUTH_SECRET:
        "uF2w7Jp9xK4mN8qR5sV1yB6dG3hL0cZtA9eQ",
      EMAIL_DELIVERY_URL: "https://email.example.test/send",
      EMAIL_DELIVERY_TOKEN: "jeton-de-production",
    });

    expect(resultat).toMatchObject({
      arreteAvantEcoute: true,
      code: 1,
      sortie: expect.stringMatching(/Paddle/i),
    });
  } finally {
    await rm(racine, { recursive: true, force: true });
  }
});

test("le binaire déployé refuse une base temporaire ou un jeton email vide", async () => {
  const racine = await mkdtemp(join(tmpdir(), "lanternes-config-vide-"));
  const base = {
    BETA_COMMERCIAL_MODE: "production",
    COMMERCIAL_ORIGIN: "https://beta.example.test",
    COMMERCIAL_DATABASE_PATH: join(racine, "commercial.sqlite"),
    PADDLE_CLIENT_TOKEN: "live_7d279f61a3499fed520f7cd8c08",
    PADDLE_WEBHOOK_SECRET:
      "9vWN7kuUPHXCjogIq6Z5afE8eLwY1xQ3dRo0nTmB",
    PADDLE_PRICE_ID: "pri_01hv0vax6rv18t4tamj848ne4d",
    PADDLE_PRODUCT_ID: "pro_01htz88xpr0mm7b3ta2pjkr7w2",
    PREMIUM_RECEIPT_PRIVATE_KEY:
      "-----BEGIN PRIVATE KEY-----\\nMC4CAQAwBQYDK2VwBCIEIGoBdws9nVuf8ZvtDfSPHmd6e3/2jumRQA4HMdla7eEZ\\n-----END PRIVATE KEY-----",
    BETTER_AUTH_SECRET:
      "uF2w7Jp9xK4mN8qR5sV1yB6dG3hL0cZtA9eQ",
    EMAIL_DELIVERY_URL: "https://email.example.test/send",
    EMAIL_DELIVERY_TOKEN: "jeton-de-production",
  } as const;

  try {
    for (const [variable, environnement, motif] of [
      [
        "COMMERCIAL_DATABASE_PATH",
        { ...base, COMMERCIAL_DATABASE_PATH: undefined },
        /base de données/i,
      ],
      [
        "COMMERCIAL_DATABASE_PATH",
        { ...base, COMMERCIAL_DATABASE_PATH: "" },
        /base de données/i,
      ],
      [
        "EMAIL_DELIVERY_TOKEN",
        { ...base, EMAIL_DELIVERY_TOKEN: "" },
        /jeton.*email/i,
      ],
    ] as const) {
      const resultat = await lancerAvecEnvironnement(environnement);
      expect(
        resultat,
        `${variable} vide doit arrêter le binaire avant l’écoute.`,
      ).toMatchObject({
        arreteAvantEcoute: true,
        code: 1,
        sortie: expect.stringMatching(motif),
      });
    }
  } finally {
    await rm(racine, { recursive: true, force: true });
  }
});
