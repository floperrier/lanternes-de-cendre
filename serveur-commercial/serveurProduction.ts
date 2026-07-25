import { readFile, stat } from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import {
  extname,
  dirname,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

import {
  creerRuntimeCommercial,
  resoudreModeCommercial,
} from "./plugin-vite";

export type GestionnaireCommercial = (
  requete: IncomingMessage,
  reponse: ServerResponse,
) => Promise<boolean>;

export interface OptionsDuServeurDeProduction {
  readonly racineStatique: string;
  readonly version: string;
  readonly commit: string;
  readonly sourcePropre?: boolean;
  readonly gererCommercial: GestionnaireCommercial;
}

const TYPES_DE_CONTENU: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function securiser(reponse: ServerResponse): void {
  reponse.setHeader("X-Content-Type-Options", "nosniff");
  reponse.setHeader("X-Frame-Options", "DENY");
  reponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  reponse.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
}

function envoyerJson(
  reponse: ServerResponse,
  statut: number,
  valeur: unknown,
): void {
  reponse.statusCode = statut;
  reponse.setHeader("Content-Type", "application/json; charset=utf-8");
  reponse.setHeader("Cache-Control", "no-store");
  reponse.end(JSON.stringify(valeur));
}

function estCheminInvalide(urlBrute: string): boolean {
  const minuscules = urlBrute.toLocaleLowerCase("en-US");
  return (
    minuscules.includes("%2e") ||
    minuscules.includes("%2f") ||
    minuscules.includes("%5c") ||
    urlBrute.includes("\\") ||
    urlBrute.includes("\0")
  );
}

function cheminStatique(
  racine: string,
  pathname: string,
): string | undefined {
  let cheminDecode: string;
  try {
    cheminDecode = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
  const relatif = cheminDecode.replace(/^\/+/, "");
  if (relatif.split("/").includes("..")) {
    return undefined;
  }
  const chemin = resolve(racine, relatif);
  const position = relative(racine, chemin);
  if (
    position === ".." ||
    position.startsWith(`..${sep}`) ||
    position.length === 0
  ) {
    return position.length === 0 ? resolve(racine, "index.html") : undefined;
  }
  return chemin;
}

function estAssetEmpreinte(chemin: string): boolean {
  return /(?:^|\/)[^/]+-[A-Za-z0-9_-]{8,}\.[^/]+$/.test(
    chemin.replaceAll("\\", "/"),
  );
}

async function envoyerFichier(
  requete: IncomingMessage,
  reponse: ServerResponse,
  chemin: string,
  cache: string,
): Promise<boolean> {
  try {
    const informations = await stat(chemin);
    if (!informations.isFile()) {
      return false;
    }
    const contenu = await readFile(chemin);
    reponse.statusCode = 200;
    reponse.setHeader(
      "Content-Type",
      TYPES_DE_CONTENU[extname(chemin).toLocaleLowerCase("en-US")] ??
        "application/octet-stream",
    );
    reponse.setHeader("Content-Length", contenu.byteLength);
    reponse.setHeader("Cache-Control", cache);
    if (requete.method === "HEAD") {
      reponse.end();
    } else {
      reponse.end(contenu);
    }
    return true;
  } catch (erreur) {
    if (
      erreur instanceof Error &&
      "code" in erreur &&
      (erreur as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return false;
    }
    throw erreur;
  }
}

export function creerServeurDeProduction(
  options: OptionsDuServeurDeProduction,
) {
  const racine = resolve(options.racineStatique);
  return createServer((requete, reponse) => {
    void (async () => {
      securiser(reponse);
      const urlBrute = requete.url ?? "/";
      const cheminBrut = urlBrute.split(/[?#]/, 1)[0] ?? "/";
      if (estCheminInvalide(cheminBrut)) {
        envoyerJson(reponse, 400, { erreur: "chemin-invalide" });
        return;
      }
      const url = new URL(urlBrute, "http://localhost");

      if (url.pathname === "/api/beta/sante") {
        if (requete.method !== "GET" && requete.method !== "HEAD") {
          envoyerJson(reponse, 405, {
            erreur: "methode-non-autorisee",
          });
          return;
        }
        envoyerJson(reponse, 200, {
          statut: "prete",
        version: options.version,
        commit: options.commit,
        sourcePropre: options.sourcePropre ?? true,
        });
        return;
      }

      if (url.pathname.startsWith("/api/")) {
        if (await options.gererCommercial(requete, reponse)) {
          return;
        }
        envoyerJson(reponse, 404, { erreur: "introuvable" });
        return;
      }

      if (requete.method !== "GET" && requete.method !== "HEAD") {
        envoyerJson(reponse, 405, { erreur: "methode-non-autorisee" });
        return;
      }

      const chemin = cheminStatique(racine, url.pathname);
      if (
        chemin !== undefined &&
        (await envoyerFichier(
          requete,
          reponse,
          chemin,
          estAssetEmpreinte(chemin)
            ? "public, max-age=31536000, immutable"
            : "no-cache",
        ))
      ) {
        return;
      }

      if (extname(url.pathname) === "") {
        await envoyerFichier(
          requete,
          reponse,
          resolve(racine, "index.html"),
          "no-cache",
        );
        return;
      }
      envoyerJson(reponse, 404, { erreur: "introuvable" });
    })().catch((erreur: unknown) => {
      if (!reponse.headersSent) {
        envoyerJson(reponse, 500, { erreur: "erreur-interne" });
      } else {
        reponse.destroy(erreur instanceof Error ? erreur : undefined);
      }
    });
  });
}

interface ManifesteDeBeta {
  readonly versionProduit: string;
  readonly commit: string;
  readonly sourcePropre: boolean;
}

function entierPositif(valeur: string | undefined, repli: number): number {
  const resultat = Number.parseInt(valeur ?? String(repli), 10);
  if (!Number.isSafeInteger(resultat) || resultat <= 0 || resultat > 65_535) {
    throw new Error("port-serveur-invalide");
  }
  return resultat;
}

async function demarrerDepuisEnvironnement(): Promise<void> {
  const repertoireServeur = dirname(fileURLToPath(import.meta.url));
  const racineDuPaquet = resolve(repertoireServeur, "..");
  const manifeste = JSON.parse(
    await readFile(resolve(racineDuPaquet, "manifeste-beta.json"), "utf8"),
  ) as ManifesteDeBeta;
  const port = entierPositif(process.env.PORT, 3000);
  const hote = process.env.HOST ?? "0.0.0.0";
  const mode = resoudreModeCommercial(
    process.env.BETA_COMMERCIAL_MODE ?? "production",
  );
  const origineApplication =
    process.env.COMMERCIAL_ORIGIN ??
    (mode === "production"
      ? ""
      : `http://127.0.0.1:${port}`);
  const runtime = await creerRuntimeCommercial(
    {
      mode,
      origineApplication,
      cheminBaseDeDonnees:
        process.env.COMMERCIAL_DATABASE_PATH ??
        (mode === "production"
          ? ""
          : resolve(racineDuPaquet, "data/commercial.sqlite")),
      paddleClientToken: process.env.PADDLE_CLIENT_TOKEN,
      secretWebhook: process.env.PADDLE_WEBHOOK_SECRET,
      clePriveeDeRecu: process.env.PREMIUM_RECEIPT_PRIVATE_KEY?.replaceAll(
        "\\n",
        "\n",
      ),
      secretBetterAuth: process.env.BETTER_AUTH_SECRET,
      produit: {
        priceId:
          process.env.PADDLE_PRICE_ID ??
          (mode === "production" ? "" : "pri_lanternes_v1_test"),
        productId:
          process.env.PADDLE_PRODUCT_ID ??
          (mode === "production" ? "" : "pro_lanternes_v1_test"),
        quantite: 1,
        devise: "EUR",
        total: "1999",
      },
      livraisonEmail:
        process.env.EMAIL_DELIVERY_URL === undefined ||
        process.env.EMAIL_DELIVERY_TOKEN === undefined
          ? undefined
          : {
              url: process.env.EMAIL_DELIVERY_URL,
              jeton: process.env.EMAIL_DELIVERY_TOKEN,
            },
    },
    origineApplication,
  );
  const serveur = creerServeurDeProduction({
    racineStatique: resolve(racineDuPaquet, "public"),
    version: manifeste.versionProduit,
    commit: manifeste.commit,
    sourcePropre: manifeste.sourcePropre,
    gererCommercial: runtime.gerer,
  });
  let arretEnCours = false;
  const arreter = () => {
    if (arretEnCours) {
      return;
    }
    arretEnCours = true;
    serveur.close(() => {
      runtime.fermer();
      process.exitCode = 0;
    });
  };
  process.once("SIGINT", arreter);
  process.once("SIGTERM", arreter);
  await new Promise<void>((resoudre, rejeter) => {
    serveur.once("error", rejeter);
    serveur.listen(port, hote, () => {
      console.log(
        `Bêta ${manifeste.versionProduit} (${manifeste.commit}) prête sur ${hote}:${port}.`,
      );
      resoudre();
    });
  });
}

if (
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await demarrerDepuisEnvironnement();
}
