import { expect, test } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
} from "../../src/simulation/campagne";

test("la Coupe habitée expose son état indispensable dans le DOM", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Les Lanternes de Cendre",
    }),
  ).toBeVisible();
  const coupeHabitee = page.getByTestId("coupe-habitee");
  await expect(coupeHabitee).toBeVisible();
  await expect(coupeHabitee).toHaveAttribute("data-ready", "true");

  const etatTextuel = page.getByRole("region", { name: "Cité-caravane" });
  await expect(etatTextuel).toContainText("Phare — actif");
  await expect(etatTextuel).toContainText(
    "Formation en grappe — 5 plateformes",
  );
  await expect(etatTextuel).toContainText("Habitants — 184");
});

test("les styles structurants de l’Atlas et du temps sont appliqués", async ({
  page,
}) => {
  await page.goto("/");

  const atlas = page.getByRole("region", { name: "Atlas d’exploitation" });
  await expect(atlas).toHaveCSS("position", "relative");
  await expect(atlas).toHaveCSS("overflow", "auto");

  const expedition = atlas.getByRole("region", {
    name: "Expédition — Station des Vannes Grises",
  });
  await expect(expedition).toHaveCSS("display", "grid");

  const commandesDuTemps = page.locator(".commandes-du-temps");
  await expect(commandesDuTemps).toHaveCSS("display", "grid");
});

test("le Temps du convoi se pilote à la souris et au clavier", async ({
  page,
}) => {
  await page.goto("/");

  const horloge = page.locator(".commandes-du-temps > time");
  const pause = page.getByRole("button", { name: "Pause" });
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("En pause").first()).toBeVisible();

  const heureSuspendue = await horloge.textContent();
  await page.waitForTimeout(1_100);
  await expect(horloge).toHaveText(heureSuspendue ?? "00:00");

  const vitesseDouble = page.getByRole("button", { name: "Vitesse 2×" });
  await vitesseDouble.focus();
  await page.keyboard.press("Enter");
  await expect(vitesseDouble).toHaveAttribute("aria-pressed", "true");

  await expect
    .poll(async () => horloge.textContent(), { timeout: 2_500 })
    .not.toBe(heureSuspendue);
});

test("les mêmes commandes donnent le même état sous Node et Chromium", async ({
  page,
}) => {
  const commandes: CommandeCampagne[] = [
    {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    },
    {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    },
  ];
  let etatNode = creerCampagneInitiale("CENDRE-01");

  for (const commande of commandes) {
    etatNode = appliquerCommande(etatNode, commande).etat;
  }

  await page.goto("/");
  const resultatNavigateur = await page.evaluate(
    async ({ commandesNavigateur }) => {
      const urlSimulation = "/src/simulation/campagne.ts";
      const simulation = (await import(
        /* @vite-ignore */ urlSimulation
      )) as typeof import("../../src/simulation/campagne");
      let etat = simulation.creerCampagneInitiale("CENDRE-01");

      for (const commande of commandesNavigateur) {
        etat = simulation.appliquerCommande(etat, commande).etat;
      }

      return {
        etat,
        empreinte: simulation.empreinteEtat(etat),
      };
    },
    { commandesNavigateur: commandes },
  );

  expect(resultatNavigateur).toEqual({
    etat: etatNode,
    empreinte: empreinteEtat(etatNode),
  });
  expect(resultatNavigateur.empreinte).toBe("dfd44622");
});

test("un Événement bilingue expose ses coûts et accepte une intention au clavier", async ({
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(15_000);

  const evenement = page.getByRole("region", {
    name: "Des signaux sous la cendre",
  });
  await expect(evenement).toBeVisible();
  await expect(evenement).toContainText(
    "Coût connu : 6 places occupées dans les Foyers.",
  );
  await expect(
    evenement.getByRole("img", {
      name: /Coupe habitée de la Cité-caravane/,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "English" }).click();
  const evenementAnglais = page.getByRole("region", {
    name: "Signals beneath the ash",
  });
  await expect(evenementAnglais).toHaveAttribute("lang", "en");
  await expect(evenementAnglais).toContainText(
    "Known cost: 6 places occupied in the living quarters.",
  );
  await expect(evenementAnglais).toContainText("Lighthouse");

  const accueillir = evenementAnglais.getByRole("button", {
    name: "Open the living quarters",
  });
  await accueillir.focus();
  await page.keyboard.press("Enter");

  await expect(evenementAnglais).toBeHidden();
  await expect(
    page.getByRole("region", { name: "Cité-caravane" }),
  ).toContainText("Habitants — 190");
});
