export {
  FORMAT_EMPREINTE_DETERMINISTE,
  VERSION_EMPREINTE_DETERMINISTE,
} from "./versions";

export function calculerEmpreinteFnv1a32V1(texte: string): number {
  let empreinte = 0x811c9dc5;

  for (const octet of new TextEncoder().encode(texte)) {
    empreinte ^= octet;
    empreinte = Math.imul(empreinte, 0x01000193);
  }

  return empreinte >>> 0;
}

export function formaterEmpreinteFnv1a32V1(texte: string): string {
  return calculerEmpreinteFnv1a32V1(texte)
    .toString(16)
    .padStart(8, "0");
}
