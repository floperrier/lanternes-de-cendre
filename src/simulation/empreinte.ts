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
  return calculerEmpreinteFnv1a32V1(texte).toString(16).padStart(8, "0");
}

export function serialiserCanonicalement(valeur: unknown): string {
  const objetsEnCours: object[] = [];

  const serialiser = (element: unknown): string => {
    if (element === undefined) {
      return "undefined";
    }
    if (typeof element === "number" && !Number.isFinite(element)) {
      return `number:${String(element)}`;
    }
    if (typeof element === "bigint") {
      return `bigint:${element.toString()}`;
    }
    if (typeof element === "symbol") {
      const cleGlobale = Symbol.keyFor(element);
      return cleGlobale === undefined
        ? `symbol-local:${JSON.stringify(element.description ?? "")}`
        : `symbol-global:${JSON.stringify(cleGlobale)}`;
    }
    if (typeof element === "function") {
      return `function:${JSON.stringify(
        Function.prototype.toString.call(element),
      )}`;
    }
    if (element === null || typeof element !== "object") {
      return JSON.stringify(element);
    }

    const reference = objetsEnCours.indexOf(element);
    if (reference !== -1) {
      return `reference:${reference}`;
    }
    objetsEnCours.push(element);
    try {
      if (Array.isArray(element)) {
        const elements = Array.from({ length: element.length }, (_, index) =>
          Object.prototype.hasOwnProperty.call(element, index)
            ? serialiser(element[index])
            : "array-hole",
        );
        return `[${elements.join(",")}]`;
      }
      if (element instanceof Date) {
        return `date:${Number.isNaN(element.getTime()) ? "invalid" : element.toISOString()}`;
      }
      if (element instanceof RegExp) {
        return `regexp:${JSON.stringify(element.source)}:${element.flags}`;
      }
      if (element instanceof Map) {
        const entrees = [...element.entries()]
          .map(
            ([cle, valeurAssociee]) =>
              `[${serialiser(cle)},${serialiser(valeurAssociee)}]`,
          )
          .sort();
        return `map:[${entrees.join(",")}]`;
      }
      if (element instanceof Set) {
        const valeurs = [...element.values()].map(serialiser).sort();
        return `set:[${valeurs.join(",")}]`;
      }
      if (element instanceof ArrayBuffer) {
        return `array-buffer:[${[...new Uint8Array(element)].join(",")}]`;
      }
      if (ArrayBuffer.isView(element)) {
        const octets = new Uint8Array(
          element.buffer,
          element.byteOffset,
          element.byteLength,
        );
        return `typed-array:${element.constructor.name}:[${[...octets].join(
          ",",
        )}]`;
      }

      const objet = element as Record<string, unknown>;
      const membres = Object.keys(objet)
        .sort()
        .map((cle) => `${JSON.stringify(cle)}:${serialiser(objet[cle])}`);
      const prototype = Object.getPrototypeOf(element) as {
        constructor?: { name?: string };
      } | null;
      if (prototype === Object.prototype) {
        return `{${membres.join(",")}}`;
      }
      if (prototype === null) {
        return `object-null-prototype:{${membres.join(",")}}`;
      }
      const constructeur = prototype.constructor?.name ?? "anonymous";
      return `instance:${JSON.stringify(constructeur)}:${JSON.stringify(
        String(element),
      )}:{${membres.join(",")}}`;
    } finally {
      objetsEnCours.pop();
    }
  };

  return serialiser(valeur);
}

export function empreinteValeurDeterministe(valeur: unknown): string {
  return formaterEmpreinteFnv1a32V1(serialiserCanonicalement(valeur));
}
