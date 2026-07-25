import { expect, test } from "@playwright/test";

test("le paquet déployé publie sa version et sert les routes de Campagne", async ({
  page,
  request,
}) => {
  const sante = await request.get("/api/beta/sante");
  expect(sante.status()).toBe(200);
  expect(await sante.json()).toMatchObject({
    statut: "prete",
    version: "0.1.0",
    commit: expect.stringMatching(/^[a-f0-9]{7,64}$/),
    sourcePropre: expect.any(Boolean),
  });

  await page.goto("/campagne/CENDRE-BETA");
  await expect(
    page.getByRole("region", { name: "Cité-caravane" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});
