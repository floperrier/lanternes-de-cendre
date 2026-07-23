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
import provenanceDecanteur from "../../docs/assets/haut-puits-decanteur.provenance.json?raw";
import provenanceIlyanaHautPuits from "../../docs/assets/haut-puits-ilyana.provenance.json?raw";
import provenanceVanniers from "../../docs/assets/haut-puits-vanniers.provenance.json?raw";
import provenanceNacellesCompagnes from "../../docs/assets/nacelles-compagnes.provenance.json?raw";
import provenanceNacellesDeuxRives from "../../docs/assets/nacelles-deux-rives.provenance.json?raw";
import provenanceNacellesFrein from "../../docs/assets/nacelles-frein.provenance.json?raw";
import provenanceNacellesTrace from "../../docs/assets/nacelles-trace.provenance.json?raw";
import provenanceDeversoirChassis from "../../docs/assets/deversoir-chassis.provenance.json?raw";
import provenanceDeversoirConseil from "../../docs/assets/deversoir-conseil.provenance.json?raw";
import provenanceDeversoirLigneZero from "../../docs/assets/deversoir-ligne-zero.provenance.json?raw";
import provenanceDeversoirPassage from "../../docs/assets/deversoir-passage.provenance.json?raw";
import provenanceTrameAttelageFedere from "../../docs/assets/trame-attelage-federe.provenance.json?raw";
import provenanceTrameBarrierePermis from "../../docs/assets/trame-barriere-permis.provenance.json?raw";
import provenanceTrameBarriereTaxe from "../../docs/assets/trame-barriere-taxe.provenance.json?raw";
import provenanceTrameEauMachines from "../../docs/assets/trame-eau-machines.provenance.json?raw";
import provenanceTramePieceRegulation from "../../docs/assets/trame-piece-regulation.provenance.json?raw";
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
    "docs/assets/haut-puits-vanniers.provenance.json": provenanceVanniers,
    "docs/assets/haut-puits-decanteur.provenance.json": provenanceDecanteur,
    "docs/assets/haut-puits-ilyana.provenance.json":
      provenanceIlyanaHautPuits,
    "docs/assets/nacelles-deux-rives.provenance.json":
      provenanceNacellesDeuxRives,
    "docs/assets/nacelles-frein.provenance.json": provenanceNacellesFrein,
    "docs/assets/nacelles-trace.provenance.json": provenanceNacellesTrace,
    "docs/assets/nacelles-compagnes.provenance.json":
      provenanceNacellesCompagnes,
    "docs/assets/deversoir-ligne-zero.provenance.json":
      provenanceDeversoirLigneZero,
    "docs/assets/deversoir-conseil.provenance.json":
      provenanceDeversoirConseil,
    "docs/assets/deversoir-chassis.provenance.json":
      provenanceDeversoirChassis,
    "docs/assets/deversoir-passage.provenance.json":
      provenanceDeversoirPassage,
    "docs/assets/trame-barriere-permis.provenance.json":
      provenanceTrameBarrierePermis,
    "docs/assets/trame-barriere-taxe.provenance.json":
      provenanceTrameBarriereTaxe,
    "docs/assets/trame-piece-regulation.provenance.json":
      provenanceTramePieceRegulation,
    "docs/assets/trame-eau-machines.provenance.json":
      provenanceTrameEauMachines,
    "docs/assets/trame-attelage-federe.provenance.json":
      provenanceTrameAttelageFedere,
  },
  cheminDeProvenanceAsset: (chemin) =>
    chemin.startsWith("/api/commercial/assets/")
      ? `serveur-commercial/assets/${chemin.split("/").at(-1)}`
      : `public${chemin}`,
  assetExiste: (chemin) =>
    [
      "/assets/cite-caravane.png",
      "/assets/prologue-reponse-du-phare.webp",
      "/assets/prologue-filtres-de-la-veille.webp",
      "/assets/prologue-ilyana-au-clapet.webp",
      "/assets/bassins-haut-puits.webp",
      "/api/commercial/assets/veille-basse-cohorte.webp",
      "/api/commercial/assets/veille-basse-porte.webp",
      "/api/commercial/assets/veille-basse-archives.webp",
      "/api/commercial/assets/veille-basse-maelys.webp",
      "/api/commercial/assets/haut-puits-vanniers.webp",
      "/api/commercial/assets/haut-puits-decanteur.webp",
      "/api/commercial/assets/haut-puits-ilyana.webp",
      "/api/commercial/assets/nacelles-deux-rives.webp",
      "/api/commercial/assets/nacelles-frein.webp",
      "/api/commercial/assets/nacelles-trace.webp",
      "/api/commercial/assets/nacelles-compagnes.webp",
      "/api/commercial/assets/deversoir-ligne-zero.webp",
      "/api/commercial/assets/deversoir-conseil.webp",
      "/api/commercial/assets/deversoir-chassis.webp",
      "/api/commercial/assets/deversoir-passage.webp",
      "/api/commercial/assets/trame-barriere-permis.webp",
      "/api/commercial/assets/trame-barriere-taxe.webp",
      "/api/commercial/assets/trame-piece-regulation.webp",
      "/api/commercial/assets/trame-eau-machines.webp",
      "/api/commercial/assets/trame-attelage-federe.webp",
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
      "/api/commercial/assets/veille-basse-cohorte.webp":
        "f595550d62faa755e30250d9e2b52aaaa549ff8d9f17b44ee027e38f841bc8a6",
      "/api/commercial/assets/veille-basse-porte.webp":
        "6005fd7eb2736df10bb68147c2ae1fac47bbc34eeccca7dcc6d841f9226944f2",
      "/api/commercial/assets/veille-basse-archives.webp":
        "78c082dd0cae64868e0bac44a0dcabb4c626dba277d57f08280aa80032f89848",
      "/api/commercial/assets/veille-basse-maelys.webp":
        "3ad5cda3a39479cf5f9ceb03b75ae9ec7a3ce395c7a58fe68e6f92e3070886d8",
      "/api/commercial/assets/haut-puits-vanniers.webp":
        "788daf8b7565d4a79373816542b3cc9ff27a8bffa80a619fc9acbe711765ee57",
      "/api/commercial/assets/haut-puits-decanteur.webp":
        "9543f42946840cfa2ef894bce527d9c52db6a2fe6a026e90ca49145d539a9327",
      "/api/commercial/assets/haut-puits-ilyana.webp":
        "5b97d81678fa990d6289f36a79a4d34b24e7be92b0fc75fd43168eea6c9e5e4e",
      "/api/commercial/assets/nacelles-deux-rives.webp":
        "e0ef9c1eae5553779db0e9aed19590ebb84debf0657409eb1b3e5fea50b295c0",
      "/api/commercial/assets/nacelles-frein.webp":
        "4869a9a069f961680a2745fa67b58d6b4c8c8723728aacd5ee2c9b717f20e0ae",
      "/api/commercial/assets/nacelles-trace.webp":
        "c9b0b18fa91eb93a818c638e9648e47f4ebde3f6504f403c5b8cd4942b8afc32",
      "/api/commercial/assets/nacelles-compagnes.webp":
        "0b2531363f5f561118a8a656ce36d331d960f204c0c7165ad83f61a7b6363d9b",
      "/api/commercial/assets/deversoir-ligne-zero.webp":
        "e267303bf7451cbdb4bc82e28d23cef13992994231d7c836b9bfd39cba2f3c82",
      "/api/commercial/assets/deversoir-conseil.webp":
        "b887ca0bc7a20f5a2eb820e7b019617d5fdfc87d5b46078beaff35a47b5da22a",
      "/api/commercial/assets/deversoir-chassis.webp":
        "38f5768f518bfad2617a2b1c1c7c60a76250078c880e8dd20c507e8c1f5ec7b5",
      "/api/commercial/assets/deversoir-passage.webp":
        "34038892ac53eb9a5b22b9d41f3ba1787c29cda98097beb5dd2c175955df1aa4",
      "/api/commercial/assets/trame-barriere-permis.webp":
        "0f75eaf191fec9cf8e94663f83e3896f64fd420597988fcac0dacc6abc8e2a14",
      "/api/commercial/assets/trame-barriere-taxe.webp":
        "bf36f074c30b6b0068a2c0164de024dd5ab66052cb9205bf79c1b36ac5c6a30b",
      "/api/commercial/assets/trame-piece-regulation.webp":
        "55183d51ad02a7b0b08fe2cd1c82f911b36b7d4a96bf240a4a3f279b5e6f6ab8",
      "/api/commercial/assets/trame-eau-machines.webp":
        "5f9e8cac790b8aed4b537ab24dc60f8ed97cf4ce12bef69263c1663e97725085",
      "/api/commercial/assets/trame-attelage-federe.webp":
        "9ac372ba941e1645495dbf01d8c818e6d04b8ccf3af02af116c15a85a72b70cb",
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
    expect(catalogue.conseils).toHaveLength(2);
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
