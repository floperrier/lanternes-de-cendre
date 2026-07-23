import { describe, expect, it } from "vitest";

import assets from "../../content/assets/manifest.yaml?raw";
import conseils from "../../content/conseils/premiere-veille.yaml?raw";
import evenements from "../../content/evenements/prologue.yaml?raw";
import infrastructure from "../../content/infrastructure.yaml?raw";
import traductionEn from "../../content/locales/en.yaml?raw";
import traductionFr from "../../content/locales/fr.yaml?raw";
import references from "../../content/references.yaml?raw";
import provenanceCoupeHabitee from "../../docs/assets/cite-caravane.provenance.json?raw";
import provenanceHautPuits from "../../docs/assets/bassins-haut-puits.provenance.json?raw";
import provenanceFiltres from "../../docs/assets/prologue-filtres-de-la-veille.provenance.json?raw";
import provenanceIlyana from "../../docs/assets/prologue-ilyana-au-clapet.provenance.json?raw";
import provenanceReponse from "../../docs/assets/prologue-reponse-du-phare.provenance.json?raw";
import provenanceVeilleBasseArchives from "../../docs/assets/veille-basse-archives.provenance.json?raw";
import provenanceVeilleBasseCohorte from "../../docs/assets/veille-basse-cohorte.provenance.json?raw";
import provenanceVeilleBasseMaelys from "../../docs/assets/veille-basse-maelys.provenance.json?raw";
import provenanceVeilleBassePorte from "../../docs/assets/veille-basse-porte.provenance.json?raw";
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
    "docs/assets/prologue-reponse-du-phare.provenance.json":
      provenanceReponse,
    "docs/assets/prologue-filtres-de-la-veille.provenance.json":
      provenanceFiltres,
    "docs/assets/prologue-ilyana-au-clapet.provenance.json": provenanceIlyana,
    "docs/assets/bassins-haut-puits.provenance.json": provenanceHautPuits,
    "docs/assets/veille-basse-cohorte.provenance.json":
      provenanceVeilleBasseCohorte,
    "docs/assets/veille-basse-porte.provenance.json":
      provenanceVeilleBassePorte,
    "docs/assets/veille-basse-archives.provenance.json":
      provenanceVeilleBasseArchives,
    "docs/assets/veille-basse-maelys.provenance.json":
      provenanceVeilleBasseMaelys,
  },
  assetExiste: (chemin) =>
    [
      "/assets/cite-caravane.png",
      "/assets/prologue-reponse-du-phare.webp",
      "/assets/prologue-filtres-de-la-veille.webp",
      "/assets/prologue-ilyana-au-clapet.webp",
      "/assets/bassins-haut-puits.webp",
      "/assets/veille-basse-cohorte.webp",
      "/assets/veille-basse-porte.webp",
      "/assets/veille-basse-archives.webp",
      "/assets/veille-basse-maelys.webp",
    ].includes(chemin),
  empreinteAsset: (chemin) =>
    ({
      "/assets/cite-caravane.png":
        "adf24fde903c2af3c3e476fc4ed149260d58c146685078e3d97e0380cb337f34",
      "/assets/prologue-reponse-du-phare.webp":
        "f1a488452e4f59b21580975c129234e446c417570aec6a8090c001582ca3d216",
      "/assets/prologue-filtres-de-la-veille.webp":
        "2d0ce4d83e2ebe5175de64861ac56cc3138ee0935d02ab5c6a1fa8462a3ed461",
      "/assets/prologue-ilyana-au-clapet.webp":
        "e61f18f77e360e9fd454dad5e16536f18bbcdaa13ee1875cbcf65d4c598449b2",
      "/assets/bassins-haut-puits.webp":
        "1538d10da74331d41bfe2ddbe88198c96e796115eb10a02dbeb35155cab9b5a9",
      "/assets/veille-basse-cohorte.webp":
        "f595550d62faa755e30250d9e2b52aaaa549ff8d9f17b44ee027e38f841bc8a6",
      "/assets/veille-basse-porte.webp":
        "6005fd7eb2736df10bb68147c2ae1fac47bbc34eeccca7dcc6d841f9226944f2",
      "/assets/veille-basse-archives.webp":
        "78c082dd0cae64868e0bac44a0dcabb4c626dba277d57f08280aa80032f89848",
      "/assets/veille-basse-maelys.webp":
        "3ad5cda3a39479cf5f9ceb03b75ae9ec7a3ce395c7a58fe68e6f92e3070886d8",
    })[chemin] ?? "0".repeat(64),
  tailleAsset: () => 256_000,
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
    expect(catalogue.evenements).toHaveLength(5);
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
