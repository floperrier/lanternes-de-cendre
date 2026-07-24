import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cpus, platform, release } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, type ChildProcess } from "node:child_process";
import { performance } from "node:perf_hooks";

import { chromium } from "@playwright/test";
import { parseDocument } from "yaml";

import {
  executerScenariosSentinelles,
  obtenirScenariosSentinelles,
} from "../src/diagnostic/scenariosSentinelles";
import { CONTENU_PREMIUM_V1 } from "../serveur-commercial/cataloguePremiumComplet";
import { installerContenuPremiumComplet } from "../src/commercial/contenuPremium";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number.parseInt(
  process.env.PERFORMANCE_PORT ?? "4174",
  10,
);
const origine = `http://127.0.0.1:${port}`;
const debitDixMegabits = (10 * 1_000_000) / 8;

interface ConfigurationDePerformance {
  readonly version: 1;
  readonly limites: {
    readonly premiere_scene_secondes: number;
    readonly images_par_seconde_cible: number;
    readonly images_par_seconde_minimales: number;
    readonly commande_interface_millisecondes: number;
    readonly scenarios_sentinelles_millisecondes: number;
  };
}

function lireConfiguration(): ConfigurationDePerformance {
  const document = parseDocument(
    readFileSync(
      resolve(racine, "content/assets/budgets.yaml"),
      "utf8",
    ),
    { schema: "core", uniqueKeys: true },
  );
  if (document.errors.length > 0) {
    throw document.errors[0];
  }
  return document.toJS() as ConfigurationDePerformance;
}

async function attendreServeur(
  processus: ChildProcess,
  journal: () => string,
): Promise<void> {
  const expiration = performance.now() + 15_000;
  while (performance.now() < expiration) {
    if (processus.exitCode !== null) {
      throw new Error(
        `vite preview s’est arrêté (${processus.exitCode})\n${journal()}`,
      );
    }
    try {
      const reponse = await fetch(origine);
      if (reponse.ok) {
        return;
      }
    } catch {
      // Le port n’est pas encore ouvert.
    }
    await new Promise((resoudre) => setTimeout(resoudre, 100));
  }
  throw new Error(`vite preview n’a pas démarré\n${journal()}`);
}

async function arreterServeur(processus: ChildProcess): Promise<void> {
  if (processus.exitCode !== null) {
    return;
  }
  processus.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resoudre) =>
      processus.once("exit", () => resoudre()),
    ),
    new Promise<void>((resoudre) =>
      setTimeout(() => {
        processus.kill("SIGKILL");
        resoudre();
      }, 2_000),
    ),
  ]);
}

async function mesurerPerformance(): Promise<void> {
  const configuration = lireConfiguration();
  installerContenuPremiumComplet(CONTENU_PREMIUM_V1);
  let sortieServeur = "";
  const serveur = spawn(
    process.execPath,
    [
      resolve(racine, "node_modules/vite/bin/vite.js"),
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: racine,
      env: {
        ...process.env,
        PERFORMANCE_PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  serveur.stdout?.on("data", (morceau: Buffer) => {
    sortieServeur += morceau.toString();
  });
  serveur.stderr?.on("data", (morceau: Buffer) => {
    sortieServeur += morceau.toString();
  });

  let navigateur: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  const erreurs: string[] = [];
  try {
    await attendreServeur(serveur, () => sortieServeur);
    navigateur = await chromium.launch({ headless: true });
    const contexte = await navigateur.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "no-preference",
    });
    const page = await contexte.newPage();
    const session = await contexte.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.clearBrowserCache");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 40,
      downloadThroughput: debitDixMegabits,
      uploadThroughput: debitDixMegabits,
      connectionType: "cellular4g",
    });

    const debutNavigation = performance.now();
    await page.goto(origine, { waitUntil: "domcontentloaded" });
    await Promise.all([
      page
        .locator('[data-testid="coupe-habitee"][data-ready="true"]')
        .waitFor(),
      page
        .locator('[data-testid="atlas-pixi"][data-ready="true"]')
        .waitFor(),
    ]);
    const premiereSceneSecondes =
      (performance.now() - debutNavigation) / 1_000;
    if (
      premiereSceneSecondes >
      configuration.limites.premiere_scene_secondes
    ) {
      erreurs.push(
        `première scène ${premiereSceneSecondes.toFixed(2)} s > ${configuration.limites.premiere_scene_secondes} s`,
      );
    }

    const commandeMillisecondes = await page.evaluate<number>(`
      new Promise((resoudre, rejeter) => {
        const bouton = document.querySelector(
          'button[aria-label="Vitesse 4×"]',
        );
        const coupe = document.querySelector(
          '[data-testid="coupe-habitee"]',
        );
        if (!(bouton instanceof HTMLButtonElement) || coupe === null) {
          rejeter(new Error("commande-performance-absente"));
          return;
        }
        const debut = performance.now();
        const terminer = () => {
          if (coupe.getAttribute("data-vitesse") !== "4") {
            return false;
          }
          resoudre(performance.now() - debut);
          return true;
        };
        const observateur = new MutationObserver(() => {
          if (terminer()) {
            observateur.disconnect();
          }
        });
        observateur.observe(coupe, {
          attributes: true,
          attributeFilter: ["data-vitesse"],
        });
        bouton.click();
        if (terminer()) {
          observateur.disconnect();
        }
      })
    `);
    await page
      .locator('[data-testid="coupe-habitee"][data-vitesse="4"]')
      .waitFor();
    if (
      commandeMillisecondes >
      configuration.limites.commande_interface_millisecondes
    ) {
      erreurs.push(
        `commande UI ${commandeMillisecondes.toFixed(1)} ms > ${configuration.limites.commande_interface_millisecondes} ms`,
      );
    }

    await page.waitForLoadState("networkidle");
    const coupe = page.locator(
      '[data-testid="coupe-habitee"][data-render-fps]',
    );
    await coupe.waitFor();
    const echantillonAvantStabilisation =
      await coupe.getAttribute("data-render-sample");
    await page.waitForFunction(
      (echantillon) =>
        document
          .querySelector('[data-testid="coupe-habitee"]')
          ?.getAttribute("data-render-sample") !== echantillon,
      echantillonAvantStabilisation,
    );
    const mesureDeRendu = await coupe.evaluate((element) => ({
      imagesParSeconde: Number(
        (element as HTMLElement).dataset.renderFps,
      ),
      intervalleMedian: Number(
        (element as HTMLElement).dataset.renderFrameMedianMs,
      ),
      intervalleP95: Number(
        (element as HTMLElement).dataset.renderFrameP95Ms,
      ),
    }));
    const {
      imagesParSeconde,
      intervalleMedian,
      intervalleP95,
    } = mesureDeRendu;
    if (
      imagesParSeconde <
      configuration.limites.images_par_seconde_minimales
    ) {
      erreurs.push(
        `rendu ${imagesParSeconde.toFixed(1)} i/s < ${configuration.limites.images_par_seconde_minimales} i/s`,
      );
    }
    const ressources = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entree) => {
          const ressource = entree as PerformanceResourceTiming;
          return {
            nom: ressource.name,
            octetsTransferes: ressource.transferSize,
            octetsEncodes: ressource.encodedBodySize,
            dureeMillisecondes: ressource.duration,
          };
        }),
    );

    const debutScenarios = performance.now();
    const resultats = executerScenariosSentinelles();
    const scenariosMillisecondes = performance.now() - debutScenarios;
    const divergences = resultats.filter(
      ({ statut }) => statut !== "conforme",
    ).length;
    const commandes = obtenirScenariosSentinelles().reduce(
      (total, scenario) =>
        total +
        scenario.conduites.prudente.commandes.length +
        scenario.conduites.risquee.commandes.length,
      0,
    );
    if (divergences > 0) {
      erreurs.push(`${divergences} scénarios sentinelles divergents`);
    }
    if (
      scenariosMillisecondes >
      configuration.limites.scenarios_sentinelles_millisecondes
    ) {
      erreurs.push(
        `scénarios maximaux ${scenariosMillisecondes.toFixed(1)} ms > ${configuration.limites.scenarios_sentinelles_millisecondes} ms`,
      );
    }

    const rapport = {
      format: "lanternes-de-cendre.performance-campagne",
      version: 1,
      genereLe: new Date().toISOString(),
      statut: erreurs.length === 0 ? "conforme" : "echec",
      machineDeReference: {
        systeme: `${platform()} ${release()}`,
        processeur: cpus()[0]?.model ?? "inconnu",
        navigateur: await navigateur.version(),
        reseau: {
          debitBitsParSeconde: 10_000_000,
          latenceMillisecondes: 40,
          cacheFroid: true,
        },
      },
      premiereScene: {
        secondes: premiereSceneSecondes,
        limiteSecondes:
          configuration.limites.premiere_scene_secondes,
        conforme:
          premiereSceneSecondes <=
          configuration.limites.premiere_scene_secondes,
        ressources: {
          nombre: ressources.length,
          octetsTransferes: ressources.reduce(
            (total, ressource) =>
              total + ressource.octetsTransferes,
            0,
          ),
          octetsEncodes: ressources.reduce(
            (total, ressource) => total + ressource.octetsEncodes,
            0,
          ),
        },
      },
      commande: {
        millisecondes: commandeMillisecondes,
        limiteMillisecondes:
          configuration.limites.commande_interface_millisecondes,
      },
      rendu: {
        cibleImagesParSeconde:
          configuration.limites.images_par_seconde_cible,
        minimumImagesParSeconde:
          configuration.limites.images_par_seconde_minimales,
        imagesParSeconde,
        intervalleMedianMillisecondes: intervalleMedian,
        intervalleP95Millisecondes: intervalleP95,
        source: "ticker PixiJS plafonné à 60 i/s",
      },
      simulationAcceleree: {
        scenarios: resultats.length,
        commandes,
        millisecondes: scenariosMillisecondes,
        millisecondesParCommande:
          commandes === 0 ? 0 : scenariosMillisecondes / commandes,
        limiteMillisecondes:
          configuration.limites.scenarios_sentinelles_millisecondes,
        divergences,
      },
      erreurs,
    } as const;
    const destination = resolve(
      racine,
      "artifacts/budgets/performance.json",
    );
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, `${JSON.stringify(rapport, null, 2)}\n`);
    console.log(
      [
        `Première scène à 10 Mbit/s: ${premiereSceneSecondes.toFixed(2)} s / ${configuration.limites.premiere_scene_secondes} s`,
        `Commande Vitesse 4×: ${commandeMillisecondes.toFixed(1)} ms / ${configuration.limites.commande_interface_millisecondes} ms`,
        `Rendu médian: ${imagesParSeconde.toFixed(1)} i/s (cible ${configuration.limites.images_par_seconde_cible})`,
        `Scénarios maximaux: ${scenariosMillisecondes.toFixed(1)} ms pour ${commandes} commandes`,
      ].join("\n"),
    );
    await contexte.close();
  } finally {
    await navigateur?.close();
    await arreterServeur(serveur);
  }
  if (erreurs.length > 0) {
    throw new Error(`Performance non conforme:\n- ${erreurs.join("\n- ")}`);
  }
}

await mesurerPerformance();
