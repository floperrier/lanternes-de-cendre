import { describe, expect, it } from "vitest";

import {
  FORMAT_EMPREINTE_DETERMINISTE,
  VERSION_EMPREINTE_DETERMINISTE,
  calculerEmpreinteFnv1a32V1,
  formaterEmpreinteFnv1a32V1,
} from "./empreinte";

describe("empreinte déterministe FNV-1a", () => {
  it("suit les vecteurs 32 bits de référence et un format versionné", () => {
    expect(calculerEmpreinteFnv1a32V1("")).toBe(0x811c9dc5);
    expect(calculerEmpreinteFnv1a32V1("hello")).toBe(0x4f9f2cab);
    expect(formaterEmpreinteFnv1a32V1("hello")).toBe("4f9f2cab");
    expect(VERSION_EMPREINTE_DETERMINISTE).toBe(1);
    expect(FORMAT_EMPREINTE_DETERMINISTE).toBe("fnv1a-32-hex-v1");
  });
});
