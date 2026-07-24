import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import type { EffetMaterielDeFait } from "../simulation/faits";
import {
  preparatifsDeLaCouronneSontCausaux,
  type ObjetInconnu,
} from "./validation";

function fait(
  id: string,
  moment: number,
  materiels: readonly EffetMaterielDeFait[] = [],
): ObjetInconnu {
  return {
    id,
    cause: `test.${id}`,
    acteurs: ["porte-lanterne"],
    cible: "plans-des-trois-montages",
    moment,
    effets: { materiels, humains: [] },
  };
}

function valider(
  faits: readonly ObjetInconnu[],
  perteManifesteeA: number | null = null,
) {
  const etat = creerCampagneInitiale("CENDRE-VALIDATION-COURONNE");
  return preparatifsDeLaCouronneSontCausaux(
    faits,
    etat.infrastructure,
    etat.routes,
    etat.expeditions,
    etat.hautPuits,
    perteManifesteeA === null
      ? etat.veilleBasse
      : {
          ...etat.veilleBasse,
          consequencesDifferees: [
            {
              id: "veille-basse.perte-apres-intervention-refusee",
              cause: "veille-basse.intervention-refusee",
              programmeeA: 100,
              jalonPrevuA: perteManifesteeA,
              manifesteeA: perteManifesteeA,
              statut: "manifestee",
            },
          ],
        },
  );
}

const cout = (variation: number): EffetMaterielDeFait => ({
  type: "stock.modifie",
  stock: "materiaux",
  variation,
});

describe("validation causale des préparatifs de la Couronne", () => {
  it("rejette les concessions locales devenues indisponibles avant leur choix", () => {
    expect(
      valider([
        fait("trame.aiguillage-zero.charte-partagee", 50),
        fait("trame.aiguillage-zero.trace-du-vol", 100),
        fait("couronne.tete-de-ligne.mandat-republicain", 200),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("trame.aiguillage-zero.charte-partagee", 50),
        fait("couronne.tete-de-ligne.mandat-republicain", 100),
        fait("trame.aiguillage-zero.trace-du-vol", 200),
      ]),
    ).toBe(true);
    expect(
      valider([
        fait("couronne.tete-de-ligne.mandat-republicain", 100),
      ]),
    ).toBe(false);
    expect(
      valider(
        [fait("couronne.veille-des-trois.sanctuaire-renforce", 200)],
        150,
      ),
    ).toBe(false);
    expect(
      valider(
        [fait("couronne.veille-des-trois.sanctuaire-renforce", 200)],
        250,
      ),
    ).toBe(true);
  });

  it.each([
    [
      "couronne.approches.berceau-amorce",
      8,
      ["trame.aiguillage-zero.charte-partagee"],
    ],
    [
      "couronne.approches.etalon-calibre",
      6,
      [
        "trame.signal-zero.interface-rail-lue",
        "trame.signal-zero.echos-conserves",
      ],
    ],
    [
      "couronne.approches.precipitateur-assemble",
      10,
      ["bassins.deversoir.ligne-zero-relevee"],
    ],
  ] as const)(
    "accepte %s seulement avec spécialiste, coût exact et stock suffisant",
    (id, montant, prerequis) => {
      const faitsAvant = prerequis.map((faitId, index) =>
        fait(faitId, 100 + index),
      );
      expect(
        valider([
          ...faitsAvant,
          fait(id, 200, [cout(-montant)]),
        ]),
      ).toBe(true);
      expect(valider([fait(id, 200, [cout(-montant)])])).toBe(false);
      expect(
        valider([
          ...faitsAvant,
          fait("test.stock-presque-epuise", 150, [cout(-80)]),
          fait(id, 200, [cout(-montant)]),
        ]),
      ).toBe(false);
      expect(
        valider([
          ...faitsAvant,
          fait(id, 200, [cout(-(montant - 1))]),
        ]),
      ).toBe(false);
    },
  );
});
