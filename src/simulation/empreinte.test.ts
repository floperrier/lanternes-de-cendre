import { describe, expect, it } from "vitest";

import {
  FORMAT_EMPREINTE_DETERMINISTE,
  VERSION_EMPREINTE_DETERMINISTE,
  calculerEmpreinteFnv1a32V1,
  empreinteValeurDeterministe,
  formaterEmpreinteFnv1a32V1,
  serialiserCanonicalement,
} from "./empreinte";

describe("empreinte déterministe FNV-1a", () => {
  it("suit les vecteurs 32 bits de référence et un format versionné", () => {
    expect(calculerEmpreinteFnv1a32V1("")).toBe(0x811c9dc5);
    expect(calculerEmpreinteFnv1a32V1("hello")).toBe(0x4f9f2cab);
    expect(formaterEmpreinteFnv1a32V1("hello")).toBe("4f9f2cab");
    expect(VERSION_EMPREINTE_DETERMINISTE).toBe(1);
    expect(FORMAT_EMPREINTE_DETERMINISTE).toBe("fnv1a-32-hex-v1");
  });

  it("canonise les objets indépendamment de leur ordre d’insertion", () => {
    expect(serialiserCanonicalement({ b: 2, a: [{ d: 4, c: 3 }] })).toBe(
      '{"a":[{"c":3,"d":4}],"b":2}',
    );
    expect(empreinteValeurDeterministe({ b: 2, a: 1 })).toBe(
      empreinteValeurDeterministe({ a: 1, b: 2 }),
    );
  });

  it("distingue les valeurs absentes, indéfinies et non JSON", () => {
    const tableauCreux: unknown[] = [];
    tableauCreux.length = 1;

    expect(serialiserCanonicalement([])).not.toBe(
      serialiserCanonicalement([undefined]),
    );
    expect(serialiserCanonicalement(tableauCreux)).not.toBe(
      serialiserCanonicalement([undefined]),
    );
    expect(empreinteValeurDeterministe([Number.NaN])).not.toBe(
      empreinteValeurDeterministe([null]),
    );
    expect(serialiserCanonicalement([Symbol("x")])).not.toBe(
      serialiserCanonicalement([]),
    );
    expect(serialiserCanonicalement([() => undefined])).not.toBe(
      serialiserCanonicalement([]),
    );
    expect(serialiserCanonicalement([new Date(0)])).not.toBe(
      serialiserCanonicalement([{}]),
    );
  });

  it("représente les cycles sans récursion infinie", () => {
    const cyclique: { soi?: unknown } = {};
    cyclique.soi = cyclique;

    expect(serialiserCanonicalement(cyclique)).toBe('{"soi":reference:0}');
  });

  it("préserve la cible des références cycliques", () => {
    const racineMutuelle: { suivante?: unknown } = {};
    const enfantMutuel: { suivante?: unknown } = {};
    racineMutuelle.suivante = enfantMutuel;
    enfantMutuel.suivante = racineMutuelle;

    const racineAutoReferencee: { suivante?: unknown } = {};
    const enfantAutoReference: { suivante?: unknown } = {};
    racineAutoReferencee.suivante = enfantAutoReference;
    enfantAutoReference.suivante = enfantAutoReference;

    expect(serialiserCanonicalement(racineMutuelle)).not.toBe(
      serialiserCanonicalement(racineAutoReferencee),
    );
  });
});
