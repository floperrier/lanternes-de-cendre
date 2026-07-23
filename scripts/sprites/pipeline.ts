import { createHash } from "node:crypto";
import {
  access,
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, relative, resolve } from "node:path";

import OpenAI, { toFile } from "openai";
import sharp from "sharp";

import {
  dimensionsGeneration,
  resoudreDansProjet,
  type SpecificationSprite,
} from "./catalogue";
import {
  construireApercu,
  construireAtlas,
  creerCanvasEdition,
  limitesAlpha,
  normaliserPlanche,
} from "./images";

interface CheminsSprite {
  readonly seed: string;
  readonly seedProvenance: string;
  readonly prompt: string;
  readonly travail: string;
  readonly canvas: string;
  readonly raw: string;
  readonly cache: string;
  readonly frames: string;
  readonly atlasPng: string;
  readonly atlasJson: string;
  readonly preview: string;
  readonly publicPng: string;
  readonly publicJson: string;
  readonly provenance: string;
}

interface CacheGeneration {
  readonly inputSha256: string;
  readonly rawSha256: string;
  readonly createdAt: string;
  readonly model: string;
}

const VERSION_PROMPT = 1;

function chemins(racine: string, sprite: SpecificationSprite): CheminsSprite {
  const travail = resolve(racine, "art/sprites/work", sprite.id);
  return {
    seed: resoudreDansProjet(racine, sprite.seed, `${sprite.id}/seed`),
    seedProvenance: resolve(
      racine,
      "docs/assets/sprites",
      `${sprite.id}.seed.provenance.json`,
    ),
    prompt: resoudreDansProjet(racine, sprite.prompt, `${sprite.id}/prompt`),
    travail,
    canvas: resolve(travail, "edit-canvas.png"),
    raw: resolve(travail, "raw.png"),
    cache: resolve(travail, "generation.json"),
    frames: resolve(travail, "frames"),
    atlasPng: resolve(travail, "production", `${sprite.id}.png`),
    atlasJson: resolve(travail, "production", `${sprite.id}.json`),
    preview: resolve(travail, "preview.png"),
    publicPng: resolve(racine, "public/assets/sprites", `${sprite.id}.png`),
    publicJson: resolve(racine, "public/assets/sprites", `${sprite.id}.json`),
    provenance: resolve(
      racine,
      "docs/assets/sprites",
      `${sprite.id}.provenance.json`,
    ),
  };
}

async function existe(chemin: string): Promise<boolean> {
  try {
    await access(chemin);
    return true;
  } catch {
    return false;
  }
}

export function sha256(contenu: Buffer | string): string {
  return createHash("sha256").update(contenu).digest("hex");
}

function promptComplet(sprite: SpecificationSprite, prompt: string): string {
  return `${prompt.trim()}

Contraintes invariantes de production :
- produire une seule planche horizontale de ${sprite.generation.frames} cases égales ;
- conserver exactement le même sujet, la même direction, la même silhouette, les mêmes proportions et la même famille de palette ;
- utiliser la première case fournie comme image d’ancrage ;
- fond entièrement transparent ;
- aucune scène, aucun cadre, aucun texte, aucune étiquette, aucun logo ;
- une seule phase lisible de l’action par case ;
- rendu final pour un jeu 2D, pas une illustration de concept.

La planche entière doit contenir exactement ${sprite.generation.frames} images et former une boucle fluide.`;
}

async function empreinteEntree(
  sprite: SpecificationSprite,
  seed: Buffer,
  prompt: string,
): Promise<string> {
  return sha256(
    Buffer.concat([
      seed,
      Buffer.from(prompt),
      Buffer.from(
        JSON.stringify({
          version: VERSION_PROMPT,
          generation: sprite.generation,
          production: {
            anchor: sprite.production.anchor,
            lockFrame1: sprite.production.lockFrame1,
          },
        }),
      ),
    ]),
  );
}

async function lireCache(chemin: string): Promise<CacheGeneration | null> {
  if (!(await existe(chemin))) {
    return null;
  }
  try {
    return JSON.parse(await readFile(chemin, "utf8")) as CacheGeneration;
  } catch {
    return null;
  }
}

export async function genererBrouillon(
  racine: string,
  sprite: SpecificationSprite,
  options: { readonly force?: boolean } = {},
): Promise<{ readonly cacheHit: boolean; readonly preview: string }> {
  const fichiers = chemins(racine, sprite);
  const seed = await readFile(fichiers.seed);
  const promptSource = await readFile(fichiers.prompt, "utf8");
  const prompt = promptComplet(sprite, promptSource);
  const inputSha256 = await empreinteEntree(sprite, seed, prompt);
  const cache = await lireCache(fichiers.cache);

  let cacheHit = false;
  if (
    !options.force &&
    cache?.inputSha256 === inputSha256 &&
    (await existe(fichiers.raw)) &&
    sha256(await readFile(fichiers.raw)) === cache.rawSha256
  ) {
    cacheHit = true;
  } else {
    if (process.env.OPENAI_API_KEY === undefined) {
      throw new Error(
        "OPENAI_API_KEY est absente. Configure-la ou place une planche dans " +
          `${relative(racine, fichiers.raw)} puis lance sprites:process.`,
      );
    }
    const [largeur, hauteur] = dimensionsGeneration(sprite.generation.size);
    await creerCanvasEdition(
      fichiers.seed,
      fichiers.canvas,
      largeur,
      hauteur,
      sprite.generation.frames,
      sprite.generation.slotSize,
    );
    const client = new OpenAI();
    const resultat = await client.images.edit({
      model: sprite.generation.model,
      image: await toFile(
        await readFile(fichiers.canvas),
        `${sprite.id}-edit-canvas.png`,
        { type: "image/png" },
      ),
      prompt,
      background: "transparent",
      input_fidelity: "high",
      output_format: "png",
      quality: sprite.generation.quality,
      size: sprite.generation.size,
    });
    const base64 = resultat.data?.[0]?.b64_json;
    if (base64 === undefined) {
      throw new Error("l’API Images n’a retourné aucune image");
    }
    const raw = Buffer.from(base64, "base64");
    await mkdir(dirname(fichiers.raw), { recursive: true });
    await writeFile(fichiers.raw, raw);
    const cacheGeneration: CacheGeneration = {
      inputSha256,
      rawSha256: sha256(raw),
      createdAt: new Date().toISOString(),
      model: sprite.generation.model,
    };
    await writeFile(
      fichiers.cache,
      `${JSON.stringify(cacheGeneration, null, 2)}\n`,
      "utf8",
    );
  }

  await traiterPlancheExistante(racine, sprite);
  return { cacheHit, preview: fichiers.preview };
}

export async function traiterPlancheExistante(
  racine: string,
  sprite: SpecificationSprite,
): Promise<{ readonly preview: string }> {
  const fichiers = chemins(racine, sprite);
  if (!(await existe(fichiers.raw))) {
    throw new Error(
      `planche absente : ${relative(racine, fichiers.raw)}. Lance sprites:draft.`,
    );
  }
  const [largeur, hauteur] = dimensionsGeneration(sprite.generation.size);
  const metadata = await sharp(fichiers.raw).metadata();
  if (metadata.width !== largeur || metadata.height !== hauteur) {
    throw new Error(
      `la planche ${sprite.id} mesure ${metadata.width}x${metadata.height}, ` +
        `${largeur}x${hauteur} attendu`,
    );
  }

  const cadres = await normaliserPlanche({
    input: fichiers.raw,
    seed: fichiers.seed,
    frames: sprite.generation.frames,
    frameSize: sprite.production.frameSize,
    padding: sprite.production.padding,
    alphaThreshold: sprite.production.alphaThreshold,
    kernel: sprite.production.kernel,
    lockFrame1: sprite.production.lockFrame1,
    outDir: fichiers.frames,
  });
  const images = cadres.map(({ image }) => image);
  await construireAtlas(
    sprite.id,
    images,
    sprite.production.frameSize,
    fichiers.atlasPng,
    fichiers.atlasJson,
    sprite.production.fps,
    sprite.production.loop,
  );
  await construireApercu(
    images,
    sprite.production.frameSize,
    fichiers.preview,
  );
  await verifierProduction(racine, sprite, false);
  return { preview: fichiers.preview };
}

export async function importerPlanche(
  racine: string,
  sprite: SpecificationSprite,
  source: string,
  options: { readonly seedFromFrame1?: boolean } = {},
): Promise<{ readonly preview: string }> {
  const fichiers = chemins(racine, sprite);
  const [largeur, hauteur] = dimensionsGeneration(sprite.generation.size);
  await mkdir(dirname(fichiers.raw), { recursive: true });
  const raw = await sharp(source)
    .ensureAlpha()
    .resize({
      width: largeur,
      height: hauteur,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();
  await writeFile(fichiers.raw, raw);

  if (options.seedFromFrame1) {
    const largeurCase = largeur / sprite.generation.frames;
    if (!Number.isInteger(largeurCase)) {
      throw new Error("la largeur générée n’est pas divisible en cases égales");
    }
    const premiereCase = await sharp(raw)
      .extract({ left: 0, top: 0, width: largeurCase, height: hauteur })
      .png()
      .toBuffer();
    const limites = await limitesAlpha(
      premiereCase,
      sprite.production.alphaThreshold,
    );
    if (limites === null) {
      throw new Error("impossible d’extraire un seed depuis la première case");
    }
    await mkdir(dirname(fichiers.seed), { recursive: true });
    await sharp(premiereCase)
      .extract(limites)
      .png()
      .toFile(fichiers.seed);
  }

  return traiterPlancheExistante(racine, sprite);
}

async function verifierFichierPng(
  chemin: string,
  largeur: number,
  hauteur: number,
  libelle: string,
): Promise<void> {
  const metadata = await sharp(chemin).metadata();
  if (
    metadata.width !== largeur ||
    metadata.height !== hauteur ||
    metadata.hasAlpha !== true
  ) {
    throw new Error(
      `${libelle} doit être un PNG RGBA de ${largeur}x${hauteur}`,
    );
  }
}

export async function verifierProduction(
  racine: string,
  sprite: SpecificationSprite,
  publiee = sprite.publication.status === "approved",
): Promise<void> {
  const fichiers = chemins(racine, sprite);
  const png = publiee ? fichiers.publicPng : fichiers.atlasPng;
  const json = publiee ? fichiers.publicJson : fichiers.atlasJson;
  await verifierFichierPng(
    png,
    sprite.production.frameSize * sprite.generation.frames,
    sprite.production.frameSize,
    `atlas ${sprite.id}`,
  );

  const atlas = JSON.parse(await readFile(json, "utf8")) as {
    readonly frames?: Record<string, unknown>;
    readonly animations?: Record<string, readonly string[]>;
    readonly meta?: { readonly image?: string };
  };
  if (
    Object.keys(atlas.frames ?? {}).length !== sprite.generation.frames ||
    atlas.animations?.[sprite.id]?.length !== sprite.generation.frames ||
    atlas.meta?.image !== `${sprite.id}.png`
  ) {
    throw new Error(`atlas JSON invalide pour ${sprite.id}`);
  }

  const dimensions: Array<{ width: number; height: number }> = [];
  for (let index = 0; index < sprite.generation.frames; index += 1) {
    const frame = publiee
      ? await sharp(png)
          .extract({
            left: index * sprite.production.frameSize,
            top: 0,
            width: sprite.production.frameSize,
            height: sprite.production.frameSize,
          })
          .png()
          .toBuffer()
      : await readFile(
          resolve(fichiers.frames, `${String(index + 1).padStart(2, "0")}.png`),
        );
    const limites = await limitesAlpha(
      frame,
      sprite.production.alphaThreshold,
    );
    if (limites === null) {
      throw new Error(`frame ${index + 1} vide pour ${sprite.id}`);
    }
    if (
      limites.left === 0 ||
      limites.top === 0 ||
      limites.left + limites.width === sprite.production.frameSize
    ) {
      throw new Error(`frame ${index + 1} coupée sur un bord pour ${sprite.id}`);
    }
    if (
      limites.top + limites.height !==
      sprite.production.frameSize - sprite.production.padding
    ) {
      throw new Error(`ancre basse instable dans la frame ${index + 1}`);
    }
    dimensions.push({ width: limites.width, height: limites.height });
  }

  const largeurMin = Math.min(...dimensions.map(({ width }) => width));
  const largeurMax = Math.max(...dimensions.map(({ width }) => width));
  const hauteurMin = Math.min(...dimensions.map(({ height }) => height));
  const hauteurMax = Math.max(...dimensions.map(({ height }) => height));
  const derive = Math.max(
    1 - largeurMin / largeurMax,
    1 - hauteurMin / hauteurMax,
  );
  if (derive > sprite.production.maxDimensionDrift) {
    throw new Error(
      `dérive de dimensions ${derive.toFixed(2)} supérieure à ` +
        `${sprite.production.maxDimensionDrift.toFixed(2)} pour ${sprite.id}`,
    );
  }

  if (publiee) {
    const provenance = JSON.parse(
      await readFile(fichiers.provenance, "utf8"),
    ) as {
      readonly asset?: string;
      readonly sha256?: string;
      readonly atlasJsonSha256?: string;
      readonly approval?: {
        readonly status?: string;
        readonly reviewer?: string | null;
      };
    };
    if (
      provenance.asset !==
        `public/assets/sprites/${basename(fichiers.publicPng)}` ||
      provenance.sha256 !== sha256(await readFile(fichiers.publicPng)) ||
      provenance.atlasJsonSha256 !==
        sha256(await readFile(fichiers.publicJson)) ||
      provenance.approval?.status !== "approved" ||
      provenance.approval.reviewer !== sprite.publication.reviewer
    ) {
      throw new Error(`provenance publiée invalide pour ${sprite.id}`);
    }
  }
}

export async function publierSprite(
  racine: string,
  sprite: SpecificationSprite,
): Promise<void> {
  if (
    sprite.publication.status !== "approved" ||
    sprite.publication.reviewer === null
  ) {
    throw new Error(
      `${sprite.id} doit être approved avec un reviewer avant publication`,
    );
  }
  await verifierProduction(racine, sprite, false);
  const fichiers = chemins(racine, sprite);
  await mkdir(dirname(fichiers.publicPng), { recursive: true });
  await mkdir(dirname(fichiers.provenance), { recursive: true });
  await copyFile(fichiers.atlasPng, fichiers.publicPng);
  await copyFile(fichiers.atlasJson, fichiers.publicJson);

  const prompt = await readFile(fichiers.prompt, "utf8");
  const provenance = {
    asset: `public/assets/sprites/${basename(fichiers.publicPng)}`,
    sha256: sha256(await readFile(fichiers.publicPng)),
    atlasJsonSha256: sha256(await readFile(fichiers.publicJson)),
    createdAt: new Date().toISOString().slice(0, 10),
    tool: "OpenAI Image API + scripts/sprites",
    model: sprite.generation.model,
    useCase: "sprite-animation",
    input: sprite.seed,
    prompt: prompt.trim(),
    production: {
      frames: sprite.generation.frames,
      frameSize: sprite.production.frameSize,
      anchor: sprite.production.anchor,
      fps: sprite.production.fps,
      loop: sprite.production.loop,
    },
    rights: "OpenAI Terms of Use — output assigned to the user",
    approval: {
      status: "approved",
      reviewer: sprite.publication.reviewer,
    },
  };
  await writeFile(
    fichiers.provenance,
    `${JSON.stringify(provenance, null, 2)}\n`,
    "utf8",
  );
  await verifierProduction(racine, sprite, true);
}

export async function verifierCataloguePublie(
  racine: string,
  sprites: readonly SpecificationSprite[],
): Promise<void> {
  for (const sprite of sprites) {
    const fichiers = chemins(racine, sprite);
    await access(fichiers.seed);
    await access(resoudreDansProjet(racine, sprite.prompt, `${sprite.id}/prompt`));
    const provenanceSeed = JSON.parse(
      await readFile(fichiers.seedProvenance, "utf8"),
    ) as { readonly asset?: string; readonly sha256?: string };
    if (
      provenanceSeed.asset !== relative(racine, fichiers.seed) ||
      provenanceSeed.sha256 !== sha256(await readFile(fichiers.seed))
    ) {
      throw new Error(`provenance du seed invalide pour ${sprite.id}`);
    }
    if (sprite.publication.status === "approved") {
      await verifierProduction(racine, sprite, true);
    }
  }
}

export function cheminApercu(
  racine: string,
  sprite: SpecificationSprite,
): string {
  return chemins(racine, sprite).preview;
}
