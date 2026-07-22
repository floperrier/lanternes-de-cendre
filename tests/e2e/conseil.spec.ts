import { expect, test } from "@playwright/test";

test("un Compagnon affecté éclaire un Conseil dont la décision survit à la reprise", async ({
  page,
}) => {
  await page.goto("/");

  const compagnon = page.getByRole("region", {
    name: "Compagnon — Ilyana Voss",
  });
  await expect(compagnon).toContainText("Intendance");
  await expect(compagnon).toContainText("Diplomatie");
  await expect(compagnon).toContainText(
    "Minutieuse, jusqu’à l’intransigeance",
  );
  await expect(compagnon).toContainText("Brûlures de cendre stabilisées");

  const affecter = compagnon.getByRole("button", {
    name: "Affecter à l’Intendance",
  });
  await affecter.focus();
  await page.keyboard.press("Enter");

  await expect(compagnon).toContainText(
    "Le clapet secondaire peut isoler la pompe douze minutes",
  );
  const conseil = page.getByRole("region", {
    name: "Conseil de la première veille",
  });
  await expect(
    conseil.getByRole("heading", { name: "Conseil de la première veille" }),
  ).toBeFocused();
  await expect(conseil.getByText("Fait connu", { exact: true })).toBeVisible();
  await expect(conseil.getByText("Source", { exact: true })).toBeVisible();
  await expect(
    conseil.getByText("Recommandation morale", { exact: true }),
  ).toBeVisible();
  await expect(
    conseil.getByText("Enjeu personnel", { exact: true }),
  ).toBeVisible();
  await expect(conseil).toContainText("Relevé de pression");

  const decider = conseil.getByRole("button", {
    name: "Prioriser la sécurisation du circuit",
  });
  await decider.focus();
  await page.keyboard.press("Enter");

  await expect(conseil).toBeHidden();
  const journal = page.getByText("Journal causal (2)");
  await journal.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Conseil — circuit de purification sécurisé"),
  ).toBeVisible();
  const decisionDansLeJournal = page
    .locator(".journal-causal article")
    .filter({ hasText: "Conseil — circuit de purification sécurisé" });
  await expect(
    decisionDansLeJournal.getByText("Cause — Conseil de la première veille"),
  ).toBeVisible();
  await expect(
    decisionDansLeJournal.getByText(
      "Acteurs — Porte-Lanterne, Ilyana Voss",
    ),
  ).toBeVisible();
  await expect(
    decisionDansLeJournal.getByText("Cible — Intendance"),
  ).toBeVisible();

  const sauvegarde = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  const sauvegarder = sauvegarde.getByRole("button", {
    name: "Sauvegarder",
  });
  await sauvegarder.focus();
  await page.keyboard.press("Enter");
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();
  await page.reload();

  const journalRepris = page.getByText("Journal causal (2)");
  await journalRepris.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Conseil — circuit de purification sécurisé"),
  ).toBeVisible();
  const decisionReprise = page
    .locator(".journal-causal article")
    .filter({ hasText: "Conseil — circuit de purification sécurisé" });
  await expect(
    decisionReprise.getByText("Cause — Conseil de la première veille"),
  ).toBeVisible();
});

test("le Compagnon et le ruban du Conseil suivent la langue anglaise", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English" }).click();

  const compagnon = page.getByRole("region", {
    name: "Companion — Ilyana Voss",
  });
  await expect(compagnon).toContainText("Major skill");
  await expect(compagnon).toContainText("Stewardship");
  await compagnon
    .getByRole("button", { name: "Assign to Stewardship" })
    .click();

  const conseil = page.getByRole("region", { name: "First Watch Council" });
  await expect(
    conseil.getByRole("heading", { name: "First Watch Council" }),
  ).toBeFocused();
  await expect(conseil.getByText("Known fact", { exact: true })).toBeVisible();
  await expect(
    conseil.getByText("Moral recommendation", { exact: true }),
  ).toBeVisible();
  await expect(
    conseil.getByText("Personal stake", { exact: true }),
  ).toBeVisible();
  await expect(
    conseil.getByRole("group", { name: "Lantern-Bearer decision" }),
  ).toBeVisible();
  await expect(conseil).not.toContainText("Réponse ouverte");

  await conseil.getByRole("button", { name: "Prioritize circuit safety" }).click();
  const journal = page.getByText("Causal journal (2)");
  await journal.click();
  const decisionDansLeJournal = page
    .locator(".journal-causal article")
    .filter({ hasText: "Council — purification circuit secured" });
  await expect(
    decisionDansLeJournal.getByText("Cause — First Watch Council"),
  ).toBeVisible();
  await expect(
    decisionDansLeJournal.getByText("Actors — Lantern-Bearer, Ilyana Voss"),
  ).toBeVisible();
  await expect(
    decisionDansLeJournal.getByText("Target — Stewardship"),
  ).toBeVisible();
  await expect(decisionDansLeJournal).not.toContainText(/Cause — Conseil|Acteurs|Cible/);
});
