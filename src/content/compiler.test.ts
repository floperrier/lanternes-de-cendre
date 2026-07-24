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
import provenanceTramePompeRenseignement from "../../docs/assets/trame-pompe-renseignement.provenance.json?raw";
import provenanceTramePompeFiltres from "../../docs/assets/trame-pompe-filtres.provenance.json?raw";
import provenanceTrameTraverseReservoir from "../../docs/assets/trame-traverse-reservoir.provenance.json?raw";
import provenanceTrameTraverseGalerie from "../../docs/assets/trame-traverse-galerie.provenance.json?raw";
import provenanceTrameTraverseMaelys from "../../docs/assets/trame-traverse-maelys.provenance.json?raw";
import provenanceTrameMarcheOfficiel from "../../docs/assets/trame-marche-officiel.provenance.json?raw";
import provenanceTrameMarcheClandestin from "../../docs/assets/trame-marche-clandestin.provenance.json?raw";
import provenanceTrameSignalInterface from "../../docs/assets/trame-signal-interface.provenance.json?raw";
import provenanceTrameSignalEcho from "../../docs/assets/trame-signal-echo.provenance.json?raw";
import provenanceTrameSignalIlyana from "../../docs/assets/trame-signal-ilyana.provenance.json?raw";
import provenanceTrameAiguillageRevelation from "../../docs/assets/trame-aiguillage-revelation.provenance.json?raw";
import provenanceTrameAiguillageConseil from "../../docs/assets/trame-aiguillage-conseil.provenance.json?raw";
import provenanceTrameAiguillagePassage from "../../docs/assets/trame-aiguillage-passage.provenance.json?raw";
import provenanceFiltres from "../../docs/assets/prologue-filtres-de-la-veille.provenance.json?raw";
import provenanceIlyana from "../../docs/assets/prologue-ilyana-au-clapet.provenance.json?raw";
import provenanceReponse from "../../docs/assets/prologue-reponse-du-phare.provenance.json?raw";
import provenanceVeilleBasseArchives from "../../docs/assets/veille-basse-archives.provenance.json?raw";
import provenanceVeilleBasseCohorte from "../../docs/assets/veille-basse-cohorte.provenance.json?raw";
import provenanceVeilleBasseMaelys from "../../docs/assets/veille-basse-maelys.provenance.json?raw";
import provenanceVeilleBassePorte from "../../docs/assets/veille-basse-porte.provenance.json?raw";
import provenanceCouronneTeteDeLigne from "../../docs/assets/couronne-tete-de-ligne.provenance.json?raw";
import provenanceCouronneVeilleDesTrois from "../../docs/assets/couronne-veille-des-trois.provenance.json?raw";
import provenanceCouronneTroisSocles from "../../docs/assets/couronne-trois-socles.provenance.json?raw";
import provenanceCouronneMontages from "../../docs/assets/couronne-montages.provenance.json?raw";
import provenanceCouronneIlyanaPlans from "../../docs/assets/couronne-ilyana-plans.provenance.json?raw";
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
    "docs/assets/trame-pompe-renseignement.provenance.json":
      provenanceTramePompeRenseignement,
    "docs/assets/trame-pompe-filtres.provenance.json":
      provenanceTramePompeFiltres,
    "docs/assets/trame-traverse-reservoir.provenance.json":
      provenanceTrameTraverseReservoir,
    "docs/assets/trame-traverse-galerie.provenance.json":
      provenanceTrameTraverseGalerie,
    "docs/assets/trame-traverse-maelys.provenance.json":
      provenanceTrameTraverseMaelys,
    "docs/assets/trame-marche-officiel.provenance.json":
      provenanceTrameMarcheOfficiel,
    "docs/assets/trame-marche-clandestin.provenance.json":
      provenanceTrameMarcheClandestin,
    "docs/assets/trame-signal-interface.provenance.json":
      provenanceTrameSignalInterface,
    "docs/assets/trame-signal-echo.provenance.json":
      provenanceTrameSignalEcho,
    "docs/assets/trame-signal-ilyana.provenance.json":
      provenanceTrameSignalIlyana,
    "docs/assets/trame-aiguillage-revelation.provenance.json":
      provenanceTrameAiguillageRevelation,
    "docs/assets/trame-aiguillage-conseil.provenance.json":
      provenanceTrameAiguillageConseil,
    "docs/assets/trame-aiguillage-passage.provenance.json":
      provenanceTrameAiguillagePassage,
    "docs/assets/couronne-tete-de-ligne.provenance.json":
      provenanceCouronneTeteDeLigne,
    "docs/assets/couronne-veille-des-trois.provenance.json":
      provenanceCouronneVeilleDesTrois,
    "docs/assets/couronne-trois-socles.provenance.json":
      provenanceCouronneTroisSocles,
    "docs/assets/couronne-montages.provenance.json":
      provenanceCouronneMontages,
    "docs/assets/couronne-ilyana-plans.provenance.json":
      provenanceCouronneIlyanaPlans,
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
      "/api/commercial/assets/trame-pompe-renseignement.webp",
      "/api/commercial/assets/trame-pompe-filtres.webp",
      "/api/commercial/assets/trame-traverse-reservoir.webp",
      "/api/commercial/assets/trame-traverse-galerie.webp",
      "/api/commercial/assets/trame-traverse-maelys.webp",
      "/api/commercial/assets/trame-marche-officiel.webp",
      "/api/commercial/assets/trame-marche-clandestin.webp",
      "/api/commercial/assets/trame-signal-interface.webp",
      "/api/commercial/assets/trame-signal-echo.webp",
      "/api/commercial/assets/trame-signal-ilyana.webp",
      "/api/commercial/assets/trame-aiguillage-revelation.webp",
      "/api/commercial/assets/trame-aiguillage-conseil.webp",
      "/api/commercial/assets/trame-aiguillage-passage.webp",
      "/api/commercial/assets/couronne-tete-de-ligne.webp",
      "/api/commercial/assets/couronne-veille-des-trois.webp",
      "/api/commercial/assets/couronne-trois-socles.webp",
      "/api/commercial/assets/couronne-montages.webp",
      "/api/commercial/assets/couronne-ilyana-plans.webp",
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
      "/api/commercial/assets/trame-pompe-renseignement.webp":
        "a366d3b2b91475c334045a329aecab0e623aa70f40e9b004c95b864f44f82536",
      "/api/commercial/assets/trame-pompe-filtres.webp":
        "cefb31052cbd41c234e2b1769dd651011f4f3f561d07f944d2476b0349ebdf3c",
      "/api/commercial/assets/trame-traverse-reservoir.webp":
        "81ab748cfb9b6d4d10197f41dc951a02696294b598f7825c0b16ec3f947c26f8",
      "/api/commercial/assets/trame-traverse-galerie.webp":
        "388d4b27f7f16903ee66ba96bbf7a2c914a6124c5ad6c37578407e4ce8c7237d",
      "/api/commercial/assets/trame-traverse-maelys.webp":
        "9e3d5d12689026ca351135980f0ab7ff4f0f9d3d66a142a6b2b1dd8d05d7dbcb",
      "/api/commercial/assets/trame-marche-officiel.webp":
        "8c1895ebd7eab830471ee0563619413321d2409162abe0fe7c282eca9359b120",
      "/api/commercial/assets/trame-marche-clandestin.webp":
        "e09ff691de9ad52e14af96ef174355507cf7ab89a178d1018e31191e3fd316d2",
      "/api/commercial/assets/trame-signal-interface.webp":
        "2d726dbf3f1383f945f6041626255c6e437f65a86629fcbf0861670297832edd",
      "/api/commercial/assets/trame-signal-echo.webp":
        "bd84a33f788dd2378c92af72484a981709cbfa6757e8e8b5f4ffdf4e8832444e",
      "/api/commercial/assets/trame-signal-ilyana.webp":
        "e5bd7ec64459699fffc03747a5b06a1ab3829486c6b73697b7964f3acb7259a4",
      "/api/commercial/assets/trame-aiguillage-revelation.webp":
        "0e0fde04e468762ccc54a62a7cf8587f1e92daee5db71efdb9231d91cb1fcfb1",
      "/api/commercial/assets/trame-aiguillage-conseil.webp":
        "aa050b9be384a6bce66736fc74b3632f2367ec14266f09a523a68ea8ba9b42f0",
      "/api/commercial/assets/trame-aiguillage-passage.webp":
        "6b2d309c43c75866a62d055ec91810b0b3aecb756738e6a47fdb844546e94476",
      "/api/commercial/assets/couronne-tete-de-ligne.webp":
        "a922184cae7da8e8bc57fbc3e06a6cff72722a0d860eb8abe95992275930c4be",
      "/api/commercial/assets/couronne-veille-des-trois.webp":
        "1b0d5b00de63acbb6804e607ce5519a9cccc21c5ab65ad167e9f76eb4104cdac",
      "/api/commercial/assets/couronne-trois-socles.webp":
        "df8b3217ef846c7e432c3babe6e3f989d9c15cd9abfde839f66c6544a0b5a5bd",
      "/api/commercial/assets/couronne-montages.webp":
        "a28fb1fccb0b7ba754077409d660661b144078de69c647db5c7537d656ccf189",
      "/api/commercial/assets/couronne-ilyana-plans.webp":
        "8da26e9043037e64804279cdd1565280420bc1b5e2b7439691d2804487e8707f",
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
