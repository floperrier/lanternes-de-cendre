import type { GraineDeCampagne } from "./graine";
import { calculerEmpreinteFnv1a32V1 } from "./empreinte";
import { VERSION_ALEATOIRE_COURANTE } from "./versions";

export interface FluxPseudoAleatoire {
  readonly algorithme: "xoshiro128**";
  readonly version: typeof VERSION_ALEATOIRE_COURANTE;
  readonly etat: readonly [number, number, number, number];
}

export interface TiragePseudoAleatoire {
  readonly valeur: number;
  readonly flux: FluxPseudoAleatoire;
}

function rotationGauche32(valeur: number, decalage: number): number {
  return (
    (valeur << decalage) |
    (valeur >>> (32 - decalage))
  ) >>> 0;
}

function deriverMotDeGraine(
  graine: GraineDeCampagne,
  nomDuFlux: string,
  index: number,
): number {
  let valeur = calculerEmpreinteFnv1a32V1(
    `${graine}\u0000${nomDuFlux}\u0000${index}`,
  );

  // Mélange final de MurmurHash3 pour ne pas transmettre les corrélations du
  // texte de la Graine à l'état initial du générateur.
  valeur ^= valeur >>> 16;
  valeur = Math.imul(valeur, 0x85ebca6b);
  valeur ^= valeur >>> 13;
  valeur = Math.imul(valeur, 0xc2b2ae35);
  valeur ^= valeur >>> 16;

  return valeur >>> 0;
}

export function creerFluxPseudoAleatoire(
  graine: GraineDeCampagne,
  nomDuFlux: string,
): FluxPseudoAleatoire {
  const etat = [0, 1, 2, 3].map((index) =>
    deriverMotDeGraine(graine, nomDuFlux, index),
  ) as [number, number, number, number];

  if (etat.every((mot) => mot === 0)) {
    etat[0] = 0x9e3779b9;
  }

  return {
    algorithme: "xoshiro128**",
    version: VERSION_ALEATOIRE_COURANTE,
    etat,
  };
}

/**
 * Transition immuable de xoshiro128** 1.1, d'après l'implémentation de
 * référence de David Blackman et Sebastiano Vigna.
 */
export function tirerEntierNonSigne(
  flux: FluxPseudoAleatoire,
): TiragePseudoAleatoire {
  const [mot0, mot1, mot2, mot3] = flux.etat;
  const valeur = Math.imul(
    rotationGauche32(Math.imul(mot1, 5) >>> 0, 7),
    9,
  ) >>> 0;
  const temporaire = (mot1 << 9) >>> 0;
  const prochainMot2Intermediaire = (mot2 ^ mot0) >>> 0;
  const prochainMot3Intermediaire = (mot3 ^ mot1) >>> 0;
  const prochainMot1 = (mot1 ^ prochainMot2Intermediaire) >>> 0;
  const prochainMot0 = (mot0 ^ prochainMot3Intermediaire) >>> 0;
  const prochainMot2 =
    (prochainMot2Intermediaire ^ temporaire) >>> 0;
  const prochainMot3 = rotationGauche32(prochainMot3Intermediaire, 11);

  return {
    valeur,
    flux: {
      algorithme: flux.algorithme,
      version: flux.version,
      etat: [
        prochainMot0,
        prochainMot1,
        prochainMot2,
        prochainMot3,
      ],
    },
  };
}
