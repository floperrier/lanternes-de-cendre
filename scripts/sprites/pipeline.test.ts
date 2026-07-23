import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  parserCatalogue,
  type SpecificationSprite,
} from "./catalogue";
import { limitesAlpha } from "./images";
import {
  publierSprite,
  traiterPlancheExistante,
  verifierProduction,
} from "./pipeline";

function specification(
  statut: "draft" | "approved" = "draft",
): SpecificationSprite {
  return {
    id: "test.fumee",
    seed: "art/sprites/seeds/fumee.png",
    prompt: "art/sprites/prompts/fumee.md",
    generation: {
      model: "gpt-image-1.5",
      quality: "low",
      size: "1024x1024",
      frames: 4,
      slotSize: 256,
    },
    production: {
      frameSize: 64,
      anchor: "bottom-center",
      fps: 6,
      loop: true,
      alphaThreshold: 8,
      padding: 4,
      kernel: "lanczos3",
      lockFrame1: true,
      maxDimensionDrift: 0.7,
    },
    publication: {
      status: statut,
      reviewer: statut === "approved" ? "Test" : null,
    },
  };
}

async function rectangle(
  width: number,
  height: number,
  color: string,
): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color,
    },
  })
    .png()
    .toBuffer();
}

async function preparerProjet(): Promise<string> {
  const racine = await mkdtemp(resolve(tmpdir(), "lanternes-sprites-"));
  await mkdir(resolve(racine, "art/sprites/seeds"), { recursive: true });
  await mkdir(resolve(racine, "art/sprites/prompts"), { recursive: true });
  await mkdir(resolve(racine, "art/sprites/work/test.fumee"), {
    recursive: true,
  });
  await writeFile(
    resolve(racine, "art/sprites/seeds/fumee.png"),
    await rectangle(30, 48, "#734f32"),
  );
  await writeFile(
    resolve(racine, "art/sprites/prompts/fumee.md"),
    "Animer une fumée.",
  );

  const cadres = await Promise.all([
    rectangle(42, 70, "#9aa5ad"),
    rectangle(48, 76, "#99a4ac"),
    rectangle(54, 82, "#98a3ab"),
    rectangle(46, 74, "#97a2aa"),
  ]);
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(
      cadres.map((input, index) => ({
        input,
        left: index * 256 + 96,
        top: 480 - index * 3,
      })),
    )
    .png()
    .toFile(resolve(racine, "art/sprites/work/test.fumee/raw.png"));
  return racine;
}

describe("pipeline de sprites", () => {
  it("rejette les identifiants dupliqués dans le catalogue", () => {
    const entree = `
version: 1
sprites:
  - &sprite
    id: test.fumee
    seed: seed.png
    prompt: prompt.md
    generation:
      model: gpt-image-1.5
      quality: low
      size: 1024x1024
      frames: 4
      slot_size: 256
    production:
      frame_size: 64
      anchor: bottom-center
      fps: 6
      loop: true
      alpha_threshold: 8
      padding: 4
      kernel: lanczos3
      lock_frame_1: true
      max_dimension_drift: 0.7
    publication:
      status: draft
      reviewer: null
  - *sprite
`;
    expect(() => parserCatalogue(entree)).toThrow(
      "identifiant de sprite dupliqué",
    );
  });

  it("normalise, ancre et construit un atlas PixiJS", async () => {
    const racine = await preparerProjet();
    const sprite = specification();
    const resultat = await traiterPlancheExistante(racine, sprite);

    const frame = resolve(
      racine,
      "art/sprites/work/test.fumee/frames/02.png",
    );
    const metadata = await sharp(frame).metadata();
    expect(metadata.width).toBe(64);
    expect(metadata.height).toBe(64);
    const limites = await limitesAlpha(frame, 8);
    expect(limites).not.toBeNull();
    expect((limites?.top ?? 0) + (limites?.height ?? 0)).toBe(60);

    const atlas = JSON.parse(
      await readFile(
        resolve(
          racine,
          "art/sprites/work/test.fumee/production/test.fumee.json",
        ),
        "utf8",
      ),
    ) as { animations: Record<string, string[]> };
    expect(atlas.animations["test.fumee"]).toHaveLength(4);
    expect(resultat.preview.endsWith("preview.png")).toBe(true);
    await verifierProduction(racine, sprite, false);
  });

  it("bloque un brouillon et publie un sprite approuvé avec provenance", async () => {
    const racine = await preparerProjet();
    await traiterPlancheExistante(racine, specification());
    await expect(publierSprite(racine, specification())).rejects.toThrow(
      "doit être approved",
    );

    const approuve = specification("approved");
    await publierSprite(racine, approuve);
    await verifierProduction(racine, approuve, true);
    const provenance = JSON.parse(
      await readFile(
        resolve(
          racine,
          "docs/assets/sprites/test.fumee.provenance.json",
        ),
        "utf8",
      ),
    ) as { approval: { status: string; reviewer: string } };
    expect(provenance.approval).toEqual({
      status: "approved",
      reviewer: "Test",
    });
  });
});
