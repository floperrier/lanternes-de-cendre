import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import sharp, { type Blend, type OverlayOptions } from "sharp";

import type { NoyauRedimensionnement } from "./catalogue";

export interface LimitesPixels {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface CadreNormalise {
  readonly image: Buffer;
  readonly limitesSource: LimitesPixels;
}

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function pixelsRgba(
  entree: Buffer | string,
): Promise<{
  readonly data: Buffer;
  readonly width: number;
  readonly height: number;
  readonly channels: number;
}> {
  const resultat = await sharp(entree)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    data: resultat.data,
    width: resultat.info.width,
    height: resultat.info.height,
    channels: resultat.info.channels,
  };
}

export async function limitesAlpha(
  entree: Buffer | string,
  seuil: number,
): Promise<LimitesPixels | null> {
  const { data, width, height, channels } = await pixelsRgba(entree);
  let gauche = width;
  let droite = -1;
  let haut = height;
  let bas = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * channels + 3] > seuil) {
        gauche = Math.min(gauche, x);
        droite = Math.max(droite, x);
        haut = Math.min(haut, y);
        bas = Math.max(bas, y);
      }
    }
  }

  if (droite < gauche || bas < haut) {
    return null;
  }
  return {
    left: gauche,
    top: haut,
    width: droite - gauche + 1,
    height: bas - haut + 1,
  };
}

export async function creerCanvasEdition(
  seed: string,
  sortie: string,
  largeur: number,
  hauteur: number,
  frames: number,
  slotSize: number,
): Promise<void> {
  const largeurBande = frames * slotSize;
  if (largeurBande > largeur || slotSize > hauteur) {
    throw new Error("les cases du canvas d’édition dépassent ses dimensions");
  }

  const seedRedimensionne = await sharp(seed)
    .ensureAlpha()
    .resize({
      width: slotSize,
      height: slotSize,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer({ resolveWithObject: true });
  const left = Math.floor((largeur - largeurBande) / 2);
  const top =
    Math.floor((hauteur - slotSize) / 2) +
    Math.floor((slotSize - seedRedimensionne.info.height) / 2);

  await mkdir(dirname(sortie), { recursive: true });
  await sharp({
    create: {
      width: largeur,
      height: hauteur,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite([{ input: seedRedimensionne.data, left, top }])
    .png()
    .toFile(sortie);
}

async function recadrer(
  entree: Buffer | string,
  limites: LimitesPixels,
): Promise<Buffer> {
  return sharp(entree)
    .extract(limites)
    .ensureAlpha()
    .png()
    .toBuffer();
}

async function composerCadre(
  contenu: Buffer,
  largeurSource: number,
  hauteurSource: number,
  frameSize: number,
  padding: number,
  echelle: number,
  kernel: NoyauRedimensionnement,
): Promise<Buffer> {
  const largeur = Math.max(1, Math.round(largeurSource * echelle));
  const hauteur = Math.max(1, Math.round(hauteurSource * echelle));
  const redimensionne = await sharp(contenu)
    .resize({
      width: largeur,
      height: hauteur,
      fit: "fill",
      kernel:
        kernel === "nearest" ? sharp.kernel.nearest : sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: frameSize,
      height: frameSize,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite([
      {
        input: redimensionne,
        left: Math.floor((frameSize - largeur) / 2),
        top: frameSize - padding - hauteur,
      },
    ])
    .png()
    .toBuffer();
}

export async function normaliserPlanche(options: {
  readonly input: string;
  readonly seed: string;
  readonly frames: number;
  readonly frameSize: number;
  readonly padding: number;
  readonly alphaThreshold: number;
  readonly kernel: NoyauRedimensionnement;
  readonly lockFrame1: boolean;
  readonly outDir: string;
}): Promise<readonly CadreNormalise[]> {
  const metadonnees = await sharp(options.input).metadata();
  if (metadonnees.width === undefined || metadonnees.height === undefined) {
    throw new Error("dimensions de planche introuvables");
  }
  const largeurCase = metadonnees.width / options.frames;
  if (!Number.isInteger(largeurCase)) {
    throw new Error("la largeur de la planche n’est pas divisible par le nombre de cases");
  }

  const planche = await readFile(options.input);
  const sources: Array<{ image: Buffer; limites: LimitesPixels }> = [];
  for (let index = 0; index < options.frames; index += 1) {
    const caseSource = await sharp(planche)
      .extract({
        left: index * largeurCase,
        top: 0,
        width: largeurCase,
        height: metadonnees.height,
      })
      .ensureAlpha()
      .png()
      .toBuffer();
    const limites = await limitesAlpha(caseSource, options.alphaThreshold);
    if (limites === null) {
      throw new Error(`aucun contenu détecté dans la case ${index + 1}`);
    }
    sources.push({ image: caseSource, limites });
  }

  if (options.lockFrame1) {
    const seedBuffer = await readFile(options.seed);
    const limites = await limitesAlpha(seedBuffer, options.alphaThreshold);
    if (limites === null) {
      throw new Error("aucun contenu détecté dans le seed");
    }
    sources[0] = { image: seedBuffer, limites };
  }

  const largeurMax = Math.max(...sources.map(({ limites }) => limites.width));
  const hauteurMax = Math.max(...sources.map(({ limites }) => limites.height));
  const espace = options.frameSize - options.padding * 2;
  const echelle = Math.min(espace / largeurMax, espace / hauteurMax);
  await mkdir(options.outDir, { recursive: true });

  const cadres: CadreNormalise[] = [];
  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    const contenu = await recadrer(source.image, source.limites);
    const image = await composerCadre(
      contenu,
      source.limites.width,
      source.limites.height,
      options.frameSize,
      options.padding,
      echelle,
      options.kernel,
    );
    await writeFile(
      `${options.outDir}/${String(index + 1).padStart(2, "0")}.png`,
      image,
    );
    cadres.push({ image, limitesSource: source.limites });
  }
  return cadres;
}

export async function construireAtlas(
  id: string,
  cadres: readonly Buffer[],
  frameSize: number,
  sortiePng: string,
  sortieJson: string,
  fps: number,
  loop: boolean,
): Promise<void> {
  await mkdir(dirname(sortiePng), { recursive: true });
  const superpositions: OverlayOptions[] = cadres.map((input, index) => ({
    input,
    left: index * frameSize,
    top: 0,
  }));
  await sharp({
    create: {
      width: cadres.length * frameSize,
      height: frameSize,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite(superpositions)
    .png()
    .toFile(sortiePng);

  const noms = cadres.map(
    (_cadre, index) => `${id}-${String(index).padStart(2, "0")}`,
  );
  const frames = Object.fromEntries(
    noms.map((nom, index) => [
      nom,
      {
        frame: {
          x: index * frameSize,
          y: 0,
          w: frameSize,
          h: frameSize,
        },
        rotated: false,
        trimmed: false,
        spriteSourceSize: { x: 0, y: 0, w: frameSize, h: frameSize },
        sourceSize: { w: frameSize, h: frameSize },
        anchor: { x: 0.5, y: 1 },
      },
    ]),
  );
  await writeFile(
    sortieJson,
    `${JSON.stringify(
      {
        frames,
        animations: { [id]: noms },
        meta: {
          app: "lanternes-de-cendre/sprites",
          version: "1",
          image: `${id}.png`,
          scale: "1",
          animation: { fps, loop },
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function couleurDamier(x: number, y: number, taille: number): readonly number[] {
  const claire = [240, 243, 246, 255] as const;
  const sombre = [225, 230, 235, 255] as const;
  return (Math.floor(x / taille) + Math.floor(y / taille)) % 2 === 0
    ? claire
    : sombre;
}

export async function construireApercu(
  cadres: readonly Buffer[],
  frameSize: number,
  sortie: string,
  gap = 8,
): Promise<void> {
  const largeur = cadres.length * frameSize + Math.max(0, cadres.length - 1) * gap;
  const hauteur = frameSize;
  const pixels = Buffer.alloc(largeur * hauteur * 4);
  for (let y = 0; y < hauteur; y += 1) {
    for (let x = 0; x < largeur; x += 1) {
      const couleur = couleurDamier(x, y, 16);
      const offset = (y * largeur + x) * 4;
      pixels[offset] = couleur[0];
      pixels[offset + 1] = couleur[1];
      pixels[offset + 2] = couleur[2];
      pixels[offset + 3] = couleur[3];
    }
  }
  const superpositions: OverlayOptions[] = cadres.map((input, index) => ({
    input,
    left: index * (frameSize + gap),
    top: 0,
    blend: "over" as Blend,
  }));
  await mkdir(dirname(sortie), { recursive: true });
  await sharp(pixels, {
    raw: { width: largeur, height: hauteur, channels: 4 },
  })
    .composite(superpositions)
    .png()
    .toFile(sortie);
}
