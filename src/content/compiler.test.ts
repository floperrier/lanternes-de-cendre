import { describe, expect, it } from "vitest";

import assets from "../../content/assets/manifest.yaml?raw";
import conseils from "../../content/conseils/premiere-veille.yaml?raw";
import evenements from "../../content/evenements/prologue.yaml?raw";
import infrastructure from "../../content/infrastructure.yaml?raw";
import traductionEn from "../../content/locales/en.yaml?raw";
import traductionFr from "../../content/locales/fr.yaml?raw";
import references from "../../content/references.yaml?raw";
import provenanceCoupeHabitee from "../../docs/assets/cite-caravane.provenance.json?raw";
import {
  ErreurDeContenu,
  compilerCatalogue,
  type CodeErreurDeContenu,
  type SourcesDuCatalogue,
} from "./compiler";

const sourcesValides: SourcesDuCatalogue = {
  evenements,
  infrastructure,
  conseils,
  references,
  traductions: {
    fr: traductionFr,
    en: traductionEn,
  },
  assets,
  provenances: {
    "docs/assets/cite-caravane.provenance.json": provenanceCoupeHabitee,
  },
  assetExiste: (chemin) => chemin === "/assets/cite-caravane.png",
  empreinteAsset: () =>
    "adf24fde903c2af3c3e476fc4ed149260d58c146685078e3d97e0380cb337f34",
};

function avecSource(
  champ: keyof Pick<
    SourcesDuCatalogue,
    "evenements" | "conseils" | "references" | "assets"
  >,
  transformer: (source: string) => string,
): SourcesDuCatalogue {
  return {
    ...sourcesValides,
    [champ]: transformer(sourcesValides[champ]),
  };
}

describe("compilateur du catalogue d’Événements narratifs", () => {
  it("compile les sources YAML bilingues en catalogue profondément immuable", () => {
    const catalogue = compilerCatalogue(sourcesValides);

    expect(catalogue.version).toBe(1);
    expect(catalogue.evenements).toHaveLength(1);
    expect(catalogue.installations).toHaveLength(9);
    expect(catalogue.conseils).toHaveLength(1);
    expect(catalogue.evenements[0]).toMatchObject({
      id: "prologue.signaux-sous-la-cendre",
      famille: "conflits-regionaux",
      fenetre: "premiere-minute-atteinte",
      acteurs: ["porte-lanterne", "cohorte-de-refugies"],
      faitsLus: [
        "prologue.cohorte-accueillie",
        "prologue.cohorte-orientee",
      ],
      destinationEcho: "journal-de-campagne",
      asset: {
        id: "prologue.signaux-sous-la-cendre",
        fichier: "/assets/cite-caravane.png",
        provenance: {
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
        alternatives: {
          fr: expect.stringContaining("Coupe habitée"),
          en: expect.stringContaining("Cutaway view"),
        },
      },
    });
    expect(catalogue.evenements[0]?.textes.fr.titre.modele).toBe(
      "Des signaux sous la cendre",
    );
    expect(catalogue.evenements[0]?.textes.en.presentation.modele).toContain(
      "{habitants} inhabitants",
    );
    expect(Object.isFrozen(catalogue)).toBe(true);
    expect(Object.isFrozen(catalogue.evenements)).toBe(true);
    expect(Object.isFrozen(catalogue.evenements[0]?.choix)).toBe(true);
    expect(catalogue.conseils[0]).toMatchObject({
      id: "conseil.premiere-veille",
      compagnon: {
        id: "ilyana-voss",
        competences: { majeure: "intendance", secondaire: "diplomatie" },
        affectation: {
          quartier: "intendance",
          occupation: "tete-de-quartier",
          faitProduit: "compagnon.ilyana-voss.affectee-intendance",
        },
      },
    });
    expect(catalogue.conseils[0]?.textes.en.titre.modele).toBe(
      "First Watch Council",
    );
    expect(Object.isFrozen(catalogue.conseils[0]?.textes.fr.sujets)).toBe(
      true,
    );
  });

  it("rejette une traduction manquante du Conseil", () => {
    const sources = {
      ...sourcesValides,
      traductions: {
        ...sourcesValides.traductions,
        en: sourcesValides.traductions.en.replace(
          /^ {2}conseil\.premiere-veille\.titre:.*\n/m,
          "",
        ),
      },
    };

    expect(() => compilerCatalogue(sources)).toThrowError(
      expect.objectContaining<Partial<ErreurDeContenu>>({
        code: "traduction",
      }),
    );
  });

  it("accepte un Événement sans asset", () => {
    const catalogue = compilerCatalogue(
      avecSource("evenements", (source) =>
        source.replace(
          "    asset: prologue.signaux-sous-la-cendre\n",
          "",
        ),
      ),
    );

    expect(catalogue.evenements[0]?.asset).toBeNull();
  });

  it("rejette un fait testé par une condition mais absent des faits lus", () => {
    const sources = avecSource("evenements", (source) =>
      source.replace(
        "    faits_lus:\n      - prologue.cohorte-accueillie\n      - prologue.cohorte-orientee",
        "    faits_lus:\n      - prologue.cohorte-accueillie",
      ),
    );

    expect(() => compilerCatalogue(sources)).toThrowError(
      expect.objectContaining<Partial<ErreurDeContenu>>({ code: "schema" }),
    );
  });

  it("valide le texte de chaque variante", () => {
    const sources = avecSource("evenements", (source) =>
      source.replace(
        "    destination_echo: journal-de-campagne",
        `      - id: secondaire
        condition: toujours
        presentation:
          cle: evenement.prologue.signaux.variante.absente
          variables: []
    destination_echo: journal-de-campagne`,
      ),
    );

    expect(() => compilerCatalogue(sources)).toThrowError(
      expect.objectContaining<Partial<ErreurDeContenu>>({ code: "texte" }),
    );
  });

  it("rejette un asset dont l’empreinte ne correspond pas à sa provenance", () => {
    expect(() =>
      compilerCatalogue({
        ...sourcesValides,
        empreinteAsset: () => "0".repeat(64),
      }),
    ).toThrowError(
      expect.objectContaining<Partial<ErreurDeContenu>>({ code: "asset" }),
    );
  });

  it.each([
    {
      famille: "schéma YAML",
      sources: avecSource("evenements", (source) =>
        source.replace(
          "  - id: prologue.signaux-sous-la-cendre",
          "  - identifiant: prologue.signaux-sous-la-cendre",
        ),
      ),
      code: "schema",
    },
    {
      famille: "référence",
      sources: avecSource("evenements", (source) =>
        source.replace("      - porte-lanterne", "      - acteur-inconnu"),
      ),
      code: "reference",
    },
    {
      famille: "effet",
      sources: avecSource("evenements", (source) =>
        source.replace("type: habitants.modifier", "type: effet.inconnu"),
      ),
      code: "effet",
    },
    {
      famille: "clé de texte",
      sources: avecSource("evenements", (source) =>
        source.replace(
          "evenement.prologue.signaux.titre",
          "evenement.prologue.signaux.absent",
        ),
      ),
      code: "texte",
    },
    {
      famille: "variable de texte",
      sources: avecSource("evenements", (source) =>
        source.replace("              - places", "              - habitants"),
      ),
      code: "variable",
    },
    {
      famille: "traduction",
      sources: {
        ...sourcesValides,
        traductions: {
          ...sourcesValides.traductions,
          en: sourcesValides.traductions.en.replace(
            /^ {2}evenement\.prologue\.signaux\.titre:.*\n/m,
            "",
          ),
        },
      },
      code: "traduction",
    },
    {
      famille: "asset",
      sources: avecSource("evenements", (source) =>
        source.replace(
          "asset: prologue.signaux-sous-la-cendre",
          "asset: asset-inconnu",
        ),
      ),
      code: "asset",
    },
  ])("rejette une erreur de $famille", ({ sources, code }) => {
    expect(() => compilerCatalogue(sources)).toThrowError(
      expect.objectContaining<Partial<ErreurDeContenu>>({
        code: code as CodeErreurDeContenu,
      }),
    );
  });
});
