import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parseDocument } from "yaml";

export const RACINE_PROJET = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export type QualiteGeneration = "low" | "medium" | "high";
export type TailleGeneration = "1024x1024" | "1536x1024" | "1024x1536";
export type NoyauRedimensionnement = "nearest" | "lanczos3";
export type StatutPublication = "draft" | "approved";

export interface SpecificationSprite {
  readonly id: string;
  readonly seed: string;
  readonly prompt: string;
  readonly generation: {
    readonly model: "gpt-image-1.5";
    readonly quality: QualiteGeneration;
    readonly size: TailleGeneration;
    readonly frames: number;
    readonly slotSize: number;
  };
  readonly production: {
    readonly frameSize: number;
    readonly anchor: "bottom-center";
    readonly fps: number;
    readonly loop: boolean;
    readonly alphaThreshold: number;
    readonly padding: number;
    readonly kernel: NoyauRedimensionnement;
    readonly lockFrame1: boolean;
    readonly maxDimensionDrift: number;
  };
  readonly publication: {
    readonly status: StatutPublication;
    readonly reviewer: string | null;
  };
}

type Dictionnaire = Record<string, unknown>;

function objet(valeur: unknown, chemin: string): Dictionnaire {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    throw new Error(`${chemin} doit être un objet`);
  }
  return valeur as Dictionnaire;
}

function chaine(valeur: unknown, chemin: string): string {
  if (typeof valeur !== "string" || valeur.trim() === "") {
    throw new Error(`${chemin} doit être une chaîne non vide`);
  }
  return valeur;
}

function nombreEntier(
  valeur: unknown,
  chemin: string,
  minimum: number,
): number {
  if (!Number.isInteger(valeur) || Number(valeur) < minimum) {
    throw new Error(`${chemin} doit être un entier supérieur ou égal à ${minimum}`);
  }
  return Number(valeur);
}

function nombre(
  valeur: unknown,
  chemin: string,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof valeur !== "number" ||
    !Number.isFinite(valeur) ||
    valeur < minimum ||
    valeur > maximum
  ) {
    throw new Error(`${chemin} doit être compris entre ${minimum} et ${maximum}`);
  }
  return valeur;
}

function booleen(valeur: unknown, chemin: string): boolean {
  if (typeof valeur !== "boolean") {
    throw new Error(`${chemin} doit être un booléen`);
  }
  return valeur;
}

function valeurParmi<T extends string>(
  valeur: unknown,
  valeurs: readonly T[],
  chemin: string,
): T {
  if (typeof valeur !== "string" || !valeurs.includes(valeur as T)) {
    throw new Error(`${chemin} doit valoir ${valeurs.join(" ou ")}`);
  }
  return valeur as T;
}

function lireSpecification(
  valeur: unknown,
  index: number,
): SpecificationSprite {
  const chemin = `sprites/${index}`;
  const source = objet(valeur, chemin);
  const id = chaine(source.id, `${chemin}/id`);
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id)) {
    throw new Error(
      `${chemin}/id doit utiliser uniquement minuscules, chiffres, points et tirets`,
    );
  }

  const generation = objet(source.generation, `${chemin}/generation`);
  const production = objet(source.production, `${chemin}/production`);
  const publication = objet(source.publication, `${chemin}/publication`);
  const reviewerSource = publication.reviewer;
  if (
    reviewerSource !== null &&
    reviewerSource !== undefined &&
    (typeof reviewerSource !== "string" || reviewerSource.trim() === "")
  ) {
    throw new Error(`${chemin}/publication/reviewer doit être null ou non vide`);
  }

  const specification: SpecificationSprite = {
    id,
    seed: chaine(source.seed, `${chemin}/seed`),
    prompt: chaine(source.prompt, `${chemin}/prompt`),
    generation: {
      model: valeurParmi(
        generation.model,
        ["gpt-image-1.5"] as const,
        `${chemin}/generation/model`,
      ),
      quality: valeurParmi(
        generation.quality,
        ["low", "medium", "high"] as const,
        `${chemin}/generation/quality`,
      ),
      size: valeurParmi(
        generation.size,
        ["1024x1024", "1536x1024", "1024x1536"] as const,
        `${chemin}/generation/size`,
      ),
      frames: nombreEntier(
        generation.frames,
        `${chemin}/generation/frames`,
        2,
      ),
      slotSize: nombreEntier(
        generation.slot_size,
        `${chemin}/generation/slot_size`,
        16,
      ),
    },
    production: {
      frameSize: nombreEntier(
        production.frame_size,
        `${chemin}/production/frame_size`,
        16,
      ),
      anchor: valeurParmi(
        production.anchor,
        ["bottom-center"] as const,
        `${chemin}/production/anchor`,
      ),
      fps: nombre(production.fps, `${chemin}/production/fps`, 1, 60),
      loop: booleen(production.loop, `${chemin}/production/loop`),
      alphaThreshold: nombreEntier(
        production.alpha_threshold,
        `${chemin}/production/alpha_threshold`,
        0,
      ),
      padding: nombreEntier(
        production.padding,
        `${chemin}/production/padding`,
        0,
      ),
      kernel: valeurParmi(
        production.kernel,
        ["nearest", "lanczos3"] as const,
        `${chemin}/production/kernel`,
      ),
      lockFrame1: booleen(
        production.lock_frame_1,
        `${chemin}/production/lock_frame_1`,
      ),
      maxDimensionDrift: nombre(
        production.max_dimension_drift,
        `${chemin}/production/max_dimension_drift`,
        0,
        1,
      ),
    },
    publication: {
      status: valeurParmi(
        publication.status,
        ["draft", "approved"] as const,
        `${chemin}/publication/status`,
      ),
      reviewer:
        reviewerSource === null || reviewerSource === undefined
          ? null
          : reviewerSource,
    },
  };

  const [largeur, hauteur] = dimensionsGeneration(specification.generation.size);
  if (specification.generation.frames * specification.generation.slotSize > largeur) {
    throw new Error(`${chemin}: les cases ne tiennent pas dans la largeur générée`);
  }
  if (specification.generation.slotSize > hauteur) {
    throw new Error(`${chemin}: une case dépasse la hauteur générée`);
  }
  if (
    specification.production.padding * 2 >=
    specification.production.frameSize
  ) {
    throw new Error(`${chemin}: le padding ne laisse aucune place au sprite`);
  }
  if (specification.production.alphaThreshold > 254) {
    throw new Error(`${chemin}: alpha_threshold doit être inférieur à 255`);
  }

  return specification;
}

export function parserCatalogue(source: string): readonly SpecificationSprite[] {
  const document = parseDocument(source, { schema: "core", uniqueKeys: true });
  if (document.errors.length > 0) {
    throw document.errors[0];
  }
  const racine = objet(document.toJS(), "catalogue");
  if (racine.version !== 1) {
    throw new Error("catalogue/version doit valoir 1");
  }
  if (!Array.isArray(racine.sprites)) {
    throw new Error("catalogue/sprites doit être une liste");
  }
  const sprites = racine.sprites.map(lireSpecification);
  const ids = new Set<string>();
  for (const sprite of sprites) {
    if (ids.has(sprite.id)) {
      throw new Error(`identifiant de sprite dupliqué : ${sprite.id}`);
    }
    ids.add(sprite.id);
  }
  return sprites;
}

export async function lireCatalogue(
  racine = RACINE_PROJET,
): Promise<readonly SpecificationSprite[]> {
  const chemin =
    process.env.SPRITE_CATALOGUE ?? "art/sprites/catalogue.yaml";
  const fichier = resoudreDansProjet(racine, chemin, "SPRITE_CATALOGUE");
  return parserCatalogue(await readFile(fichier, "utf8"));
}

export function trouverSprite(
  sprites: readonly SpecificationSprite[],
  id: string,
): SpecificationSprite {
  const sprite = sprites.find((candidat) => candidat.id === id);
  if (sprite === undefined) {
    throw new Error(`sprite inconnu : ${id}`);
  }
  return sprite;
}

export function resoudreDansProjet(
  racine: string,
  chemin: string,
  libelle: string,
): string {
  if (isAbsolute(chemin)) {
    throw new Error(`${libelle} doit être relatif au projet`);
  }
  const resultat = resolve(racine, chemin);
  const relatif = relative(racine, resultat);
  if (relatif.startsWith("..") || isAbsolute(relatif)) {
    throw new Error(`${libelle} sort du projet`);
  }
  return resultat;
}

export function dimensionsGeneration(
  taille: TailleGeneration,
): readonly [number, number] {
  const [largeur, hauteur] = taille.split("x").map(Number);
  return [largeur, hauteur];
}
