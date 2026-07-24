import { parseDocument } from "yaml";

import {
  FAMILLES_D_EVENEMENTS,
  LANGUES,
  STATUTS_APPROBATION_ASSET,
  VERSION_CONTENU_COURANTE,
  figerProfondement,
  type AssetCompile,
  type CatalogueDEvenements,
  type ChoixDEvenement,
  type ConseilDuCatalogue,
  type ConditionDEvenement,
  type ConditionDeVariante,
  type EffetDEvenement,
  type EvenementDuCatalogue,
  type Langue,
  type InstallationDuCatalogue,
  type StatutApprobationAsset,
  type TexteCompile,
  type TextesDUnEvenement,
} from "./types";
import { extraireVariables } from "./texte";

export type CodeErreurDeContenu =
  | "schema"
  | "reference"
  | "effet"
  | "texte"
  | "variable"
  | "traduction"
  | "asset";

export class ErreurDeContenu extends Error {
  constructor(
    readonly code: CodeErreurDeContenu,
    message: string,
  ) {
    super(message);
    this.name = "ErreurDeContenu";
  }
}

export interface SourcesDuCatalogue {
  readonly evenements: string;
  readonly infrastructure: string;
  readonly conseils: string;
  readonly references: string;
  readonly traductions: Readonly<Record<Langue, string>>;
  readonly assets: string;
  readonly provenances: Readonly<Record<string, string>>;
  readonly cheminDeProvenanceAsset?: (chemin: string) => string;
  readonly assetExiste: (chemin: string) => boolean;
  readonly empreinteAsset: (chemin: string) => string;
  readonly tailleAsset: (chemin: string) => number;
}

type ObjetSource = Record<string, unknown>;

interface ReferencesCompilees {
  readonly acteurs: ReadonlySet<string>;
  readonly quartiers: ReadonlySet<string>;
  readonly fenetres: ReadonlySet<string>;
  readonly lieux: ReadonlySet<string>;
  readonly destinationsEcho: ReadonlySet<string>;
  readonly faits: ReadonlySet<string>;
}

interface TraductionCompilee {
  readonly textes: Readonly<Record<string, string>>;
}

interface AssetSource {
  readonly id: string;
  readonly fichier: string;
  readonly octetsTransferes: number;
  readonly alternative: string;
  readonly contientTexte: false;
  readonly provenance: AssetCompile["provenance"];
}

const FAMILLES = new Set<string>(FAMILLES_D_EVENEMENTS);
const STATUTS_APPROBATION = new Set<string>(STATUTS_APPROBATION_ASSET);
const VARIABLES_DU_CONTEXTE = new Set(["habitants"]);

function echouer(
  code: CodeErreurDeContenu,
  chemin: string,
  detail: string,
): never {
  throw new ErreurDeContenu(code, `${chemin} — ${detail}`);
}

function parserYaml(source: string, nom: string): unknown {
  const document = parseDocument(source, {
    schema: "core",
    uniqueKeys: true,
    prettyErrors: true,
  });

  if (document.errors.length > 0) {
    echouer("schema", nom, document.errors[0]?.message ?? "YAML invalide");
  }

  return document.toJS();
}

function parserProvenance(source: string, nom: string): unknown {
  try {
    return JSON.parse(source);
  } catch (erreur) {
    echouer(
      "asset",
      nom,
      erreur instanceof Error ? erreur.message : "JSON invalide",
    );
  }
}

function objet(valeur: unknown, chemin: string): ObjetSource {
  if (
    valeur === null ||
    typeof valeur !== "object" ||
    Array.isArray(valeur)
  ) {
    echouer("schema", chemin, "objet attendu");
  }

  return valeur as ObjetSource;
}

function tableau(valeur: unknown, chemin: string): readonly unknown[] {
  if (!Array.isArray(valeur)) {
    echouer("schema", chemin, "liste attendue");
  }

  return valeur;
}

function chaine(valeur: unknown, chemin: string): string {
  if (typeof valeur !== "string" || valeur.trim() === "") {
    echouer("schema", chemin, "texte non vide attendu");
  }

  return valeur;
}

function nombre(valeur: unknown, chemin: string): number {
  if (typeof valeur !== "number" || !Number.isFinite(valeur)) {
    echouer("schema", chemin, "nombre fini attendu");
  }

  return valeur;
}

function booleen(valeur: unknown, chemin: string): boolean {
  if (typeof valeur !== "boolean") {
    echouer("schema", chemin, "booléen attendu");
  }

  return valeur;
}

function chaineOuNull(valeur: unknown, chemin: string): string | null {
  return valeur === null ? null : chaine(valeur, chemin);
}

function chaines(valeur: unknown, chemin: string): readonly string[] {
  return tableau(valeur, chemin).map((element, index) =>
    chaine(element, `${chemin}/${index}`),
  );
}

function verifierVersion(racine: ObjetSource, chemin: string): void {
  if (racine.version !== VERSION_CONTENU_COURANTE) {
    echouer(
      "schema",
      `${chemin}/version`,
      `la version ${VERSION_CONTENU_COURANTE} est requise`,
    );
  }
}

function compilerReferences(source: string): ReferencesCompilees {
  const racine = objet(parserYaml(source, "references.yaml"), "references.yaml");
  verifierVersion(racine, "references.yaml");

  return {
    acteurs: new Set(chaines(racine.acteurs, "references.yaml/acteurs")),
    quartiers: new Set(chaines(racine.quartiers, "references.yaml/quartiers")),
    fenetres: new Set(chaines(racine.fenetres, "references.yaml/fenetres")),
    lieux: new Set(chaines(racine.lieux, "references.yaml/lieux")),
    destinationsEcho: new Set(
      chaines(
        racine.destinations_echo,
        "references.yaml/destinations_echo",
      ),
    ),
    faits: new Set(chaines(racine.faits, "references.yaml/faits")),
  };
}

function compilerTraduction(
  langue: Langue,
  source: string,
): TraductionCompilee {
  const nom = `${langue}.yaml`;
  const racine = objet(parserYaml(source, nom), nom);
  verifierVersion(racine, nom);

  if (racine.locale !== langue) {
    echouer("schema", `${nom}/locale`, `la locale ${langue} est requise`);
  }

  const textesSource = objet(racine.textes, `${nom}/textes`);
  const textes: Record<string, string> = {};

  for (const [cle, valeur] of Object.entries(textesSource)) {
    textes[cle] = chaine(valeur, `${nom}/textes/${cle}`);
  }

  return { textes };
}

function compilerLibellesTransversaux(
  traductions: Readonly<Record<Langue, TraductionCompilee>>,
): CatalogueDEvenements["libellesTransversaux"] {
  const extraireDictionnaire = (
    langue: Langue,
    prefixe: string,
  ): Readonly<Record<string, string>> =>
    Object.fromEntries(
      Object.entries(traductions[langue].textes)
        .filter(([cle]) => cle.startsWith(prefixe))
        .map(([cle, valeur]) => [cle.slice(prefixe.length), valeur]),
    );
  const traduire = (langue: Langue, cle: string): string => {
    const valeur = traductions[langue].textes[cle];
    if (valeur === undefined) {
      return echouer("traduction", `${langue}.yaml/textes/${cle}`, "clé absente");
    }
    return valeur;
  };

  return Object.fromEntries(
    LANGUES.map((langue) => [
      langue,
      {
        demonstration: {
          surtitre: traduire(langue, "interface.demonstration.surtitre"),
          titre: traduire(langue, "interface.demonstration.titre"),
          explication: traduire(
            langue,
            "interface.demonstration.explication",
          ),
        },
        journal: {
          titres: extraireDictionnaire(langue, "journal.titre."),
          causes: extraireDictionnaire(langue, "journal.cause."),
          acteurs: extraireDictionnaire(langue, "journal.acteur."),
          cibles: extraireDictionnaire(langue, "journal.cible."),
        },
      },
    ]),
  ) as CatalogueDEvenements["libellesTransversaux"];
}

function compilerAssets(
  source: string,
  provenances: Readonly<Record<string, string>>,
  cheminDeProvenanceAsset: (chemin: string) => string,
  assetExiste: (chemin: string) => boolean,
  empreinteAsset: (chemin: string) => string,
  tailleAsset: (chemin: string) => number,
): ReadonlyMap<string, AssetSource> {
  const nom = "assets/manifest.yaml";
  const racine = objet(parserYaml(source, nom), nom);
  verifierVersion(racine, nom);
  const resultat = new Map<string, AssetSource>();

  tableau(racine.assets, `${nom}/assets`).forEach((valeur, index) => {
    const chemin = `${nom}/assets/${index}`;
    const sourceAsset = objet(valeur, chemin);
    const id = chaine(sourceAsset.id, `${chemin}/id`);

    if (resultat.has(id)) {
      echouer("asset", `${chemin}/id`, `identifiant dupliqué « ${id} »`);
    }
    if (sourceAsset.contient_texte !== false) {
      echouer(
        "asset",
        `${chemin}/contient_texte`,
        "un asset de contenu ne peut incorporer aucun texte nécessaire",
      );
    }

    const fichier = chaine(sourceAsset.fichier, `${chemin}/fichier`);
    if (
      (!fichier.startsWith("/assets/") &&
        !fichier.startsWith("/api/commercial/assets/")) ||
      fichier.includes("..")
    ) {
      echouer(
        "asset",
        `${chemin}/fichier`,
        "le fichier doit rester sous /assets/ ou /api/commercial/assets/",
      );
    }

    const ficheProvenance = chaine(
      sourceAsset.provenance,
      `${chemin}/provenance`,
    );
    const sourceProvenance = provenances[ficheProvenance];
    if (sourceProvenance === undefined) {
      echouer(
        "asset",
        `${chemin}/provenance`,
        `fiche absente « ${ficheProvenance} »`,
      );
    }
    const provenanceSource = objet(
      parserProvenance(sourceProvenance, ficheProvenance),
      ficheProvenance,
    );
    const cheminDeProvenance = cheminDeProvenanceAsset(fichier);
    if (provenanceSource.asset !== cheminDeProvenance) {
      echouer(
        "asset",
        `${ficheProvenance}/asset`,
        `la fiche ne décrit pas « ${cheminDeProvenance} »`,
      );
    }
    const approbation = objet(
      provenanceSource.approval,
      `${ficheProvenance}/approval`,
    );

    const statutApprobation = chaine(
      approbation.status,
      `${ficheProvenance}/approval/status`,
    );
    if (!STATUTS_APPROBATION.has(statutApprobation)) {
      echouer(
        "asset",
        `${ficheProvenance}/approval/status`,
        `statut inconnu « ${statutApprobation} »`,
      );
    }
    const reviseur = chaineOuNull(
      approbation.reviewer,
      `${ficheProvenance}/approval/reviewer`,
    );
    if (statutApprobation === "approved" && reviseur === null) {
      echouer(
        "asset",
        `${ficheProvenance}/approval/reviewer`,
        "un asset approuvé doit nommer son réviseur",
      );
    }
    const empreinteSha256 = chaine(
      provenanceSource.sha256,
      `${ficheProvenance}/sha256`,
    );
    if (!/^[0-9a-f]{64}$/.test(empreinteSha256)) {
      echouer(
        "asset",
        `${ficheProvenance}/sha256`,
        "empreinte SHA-256 invalide",
      );
    }
    if (!assetExiste(fichier)) {
      echouer("asset", `${chemin}/fichier`, `fichier absent « ${fichier} »`);
    }
    if (empreinteAsset(fichier) !== empreinteSha256) {
      echouer(
        "asset",
        `${ficheProvenance}/sha256`,
        `l’empreinte ne correspond pas à « ${fichier} »`,
      );
    }

    resultat.set(id, {
      id,
      fichier,
      octetsTransferes: tailleAsset(fichier),
      alternative: chaine(
        sourceAsset.alternative,
        `${chemin}/alternative`,
      ),
      contientTexte: false,
      provenance: {
        fiche: ficheProvenance,
        creeLe: chaine(
          provenanceSource.createdAt,
          `${ficheProvenance}/createdAt`,
        ),
        outil: chaine(
          provenanceSource.tool,
          `${ficheProvenance}/tool`,
        ),
        modele: chaine(
          provenanceSource.model,
          `${ficheProvenance}/model`,
        ),
        usage: chaine(
          provenanceSource.useCase,
          `${ficheProvenance}/useCase`,
        ),
        entree: chaine(
          provenanceSource.input,
          `${ficheProvenance}/input`,
        ),
        prompt: chaine(
          provenanceSource.prompt,
          `${ficheProvenance}/prompt`,
        ),
        droits: chaine(
          provenanceSource.rights,
          `${ficheProvenance}/rights`,
        ),
        empreinteSha256,
        statutApprobation: statutApprobation as StatutApprobationAsset,
        reviseur,
      },
    });
  });

  return resultat;
}

function memesValeurs(
  gauche: readonly string[],
  droite: readonly string[],
): boolean {
  const gaucheUnique = new Set(gauche);
  const droiteUnique = new Set(droite);

  return (
    gaucheUnique.size === droiteUnique.size &&
    [...gaucheUnique].every((valeur) => droiteUnique.has(valeur))
  );
}

function compilerTexte(
  source: unknown,
  chemin: string,
  traductions: Readonly<Record<Langue, TraductionCompilee>>,
  langue: Langue,
): TexteCompile {
  const reference = objet(source, chemin);
  const cle = chaine(reference.cle, `${chemin}/cle`);
  const variables = chaines(reference.variables, `${chemin}/variables`);
  const valeursSource =
    reference.valeurs === undefined
      ? {}
      : objet(reference.valeurs, `${chemin}/valeurs`);
  const valeurs: Record<string, string | number> = {};

  for (const [variable, valeur] of Object.entries(valeursSource)) {
    if (typeof valeur !== "string" && typeof valeur !== "number") {
      echouer(
        "schema",
        `${chemin}/valeurs/${variable}`,
        "texte ou nombre attendu",
      );
    }
    valeurs[variable] = valeur;
  }

  const modeleFrancais = traductions.fr.textes[cle];
  if (modeleFrancais === undefined) {
    echouer("texte", chemin, `clé française absente « ${cle} »`);
  }
  const modele = traductions[langue].textes[cle];
  if (modele === undefined) {
    echouer("traduction", chemin, `traduction ${langue} absente « ${cle} »`);
  }
  const variablesModele = extraireVariables(modele);
  if (!memesValeurs(variables, variablesModele)) {
    echouer(
      "variable",
      chemin,
      `variables déclarées [${variables.join(", ")}] incompatibles avec « ${modele} »`,
    );
  }
  const variablesStatiques = Object.keys(valeurs);
  if (variablesStatiques.some((variable) => !variables.includes(variable))) {
    echouer(
      "variable",
      `${chemin}/valeurs`,
      "une valeur est fournie pour une variable non déclarée",
    );
  }
  const variablesSansValeur = variables.filter(
    (variable) =>
      valeurs[variable] === undefined && !VARIABLES_DU_CONTEXTE.has(variable),
  );
  if (variablesSansValeur.length > 0) {
    echouer(
      "variable",
      `${chemin}/valeurs`,
      `valeur absente pour [${variablesSansValeur.join(", ")}]`,
    );
  }

  return { cle, modele, variables, valeurs };
}

function verifierReference(
  ensemble: ReadonlySet<string>,
  valeur: string,
  chemin: string,
): void {
  if (!ensemble.has(valeur)) {
    echouer("reference", chemin, `référence inconnue « ${valeur} »`);
  }
}

function compilerCondition(
  source: unknown,
  chemin: string,
  references: ReferencesCompilees,
): ConditionDEvenement {
  const condition = objet(source, chemin);
  const type = chaine(condition.type, `${chemin}/type`);

  if (type === "temps-au-moins") {
    return {
      type,
      secondes: nombre(condition.secondes, `${chemin}/secondes`),
    };
  }
  if (type === "fait-present") {
    const fait = chaine(condition.fait, `${chemin}/fait`);
    verifierReference(references.faits, fait, `${chemin}/fait`);
    return { type, fait };
  }
  if (type === "un-des-faits-present") {
    const faits = chaines(condition.faits, `${chemin}/faits`);
    if (faits.length < 2) {
      echouer(
        "schema",
        `${chemin}/faits`,
        "au moins deux Faits alternatifs sont requis",
      );
    }
    faits.forEach((fait, index) =>
      verifierReference(references.faits, fait, `${chemin}/faits/${index}`),
    );
    return { type, faits };
  }
  if (type === "lieu-present") {
    const lieu = chaine(condition.lieu, `${chemin}/lieu`);
    verifierReference(references.lieux, lieu, `${chemin}/lieu`);
    return { type, lieu };
  }

  return echouer("reference", `${chemin}/type`, `condition inconnue « ${type} »`);
}

function compilerEffet(source: unknown, chemin: string): EffetDEvenement {
  const effet = objet(source, chemin);
  const type = chaine(effet.type, `${chemin}/type`);

  if (type === "habitants.modifier") {
    return {
      type,
      valeur: nombre(effet.valeur, `${chemin}/valeur`),
    };
  }
  if (type === "stock.modifier") {
    const stock = chaine(effet.stock, `${chemin}/stock`);
    if (
      !["vivres", "eau", "combustible", "materiaux", "remedes"].includes(
        stock,
      )
    ) {
      echouer("effet", `${chemin}/stock`, `stock inconnu « ${stock} »`);
    }
    return {
      type,
      stock: stock as Extract<
        EffetDEvenement,
        { readonly type: "stock.modifier" }
      >["stock"],
      valeur: nombre(effet.valeur, `${chemin}/valeur`),
    };
  }

  return echouer("effet", `${chemin}/type`, `effet inconnu « ${type} »`);
}

function compilerEvenement(
  source: unknown,
  index: number,
  references: ReferencesCompilees,
  traductions: Readonly<Record<Langue, TraductionCompilee>>,
  assets: ReadonlyMap<string, AssetSource>,
): EvenementDuCatalogue {
  const chemin = `evenements.yaml/evenements/${index}`;
  const evenement = objet(source, chemin);
  const id = chaine(evenement.id, `${chemin}/id`);
  const famille = chaine(evenement.famille, `${chemin}/famille`);
  if (!FAMILLES.has(famille as EvenementDuCatalogue["famille"])) {
    echouer("schema", `${chemin}/famille`, `famille inconnue « ${famille} »`);
  }

  const fenetre = chaine(evenement.fenetre, `${chemin}/fenetre`);
  verifierReference(references.fenetres, fenetre, `${chemin}/fenetre`);
  const destinationEcho = chaine(
    evenement.destination_echo,
    `${chemin}/destination_echo`,
  );
  verifierReference(
    references.destinationsEcho,
    destinationEcho,
    `${chemin}/destination_echo`,
  );
  const acteurs = chaines(evenement.acteurs, `${chemin}/acteurs`);
  acteurs.forEach((acteur, acteurIndex) =>
    verifierReference(
      references.acteurs,
      acteur,
      `${chemin}/acteurs/${acteurIndex}`,
    ),
  );

  const conditionsSource = objet(
    evenement.conditions,
    `${chemin}/conditions`,
  );
  const compilerConditions = (nom: "requises" | "interdites") =>
    tableau(conditionsSource[nom], `${chemin}/conditions/${nom}`).map(
      (condition, conditionIndex) =>
        compilerCondition(
          condition,
          `${chemin}/conditions/${nom}/${conditionIndex}`,
          references,
        ),
    );
  const conditions = {
    requises: compilerConditions("requises"),
    interdites: compilerConditions("interdites"),
  };
  const informations = tableau(
    evenement.informations,
    `${chemin}/informations`,
  ).map((information, informationIndex) => {
    const informationSource = objet(
      information,
      `${chemin}/informations/${informationIndex}`,
    );
    const sourceInformation = chaine(
      informationSource.source,
      `${chemin}/informations/${informationIndex}/source`,
    );
    verifierReference(
      references.acteurs,
      sourceInformation,
      `${chemin}/informations/${informationIndex}/source`,
    );
    return { source: sourceInformation, texte: informationSource.texte };
  });
  const variantesSource = tableau(
    evenement.variantes,
    `${chemin}/variantes`,
  ).map((variante, varianteIndex) => {
    const cheminVariante = `${chemin}/variantes/${varianteIndex}`;
    const valeur = objet(variante, cheminVariante);
    const conditionSource = chaine(
      valeur.condition,
      `${cheminVariante}/condition`,
    );
    let condition: ConditionDeVariante;
    if (conditionSource === "toujours") {
      condition = { type: "toujours" };
    } else {
      const prefixe = "fait-present:";
      if (!conditionSource.startsWith(prefixe)) {
        echouer(
          "reference",
          `${cheminVariante}/condition`,
          `condition de variante inconnue « ${conditionSource} »`,
        );
      }
      const fait = conditionSource.slice(prefixe.length);
      verifierReference(
        references.faits,
        fait,
        `${cheminVariante}/condition`,
      );
      condition = { type: "fait-present", fait };
    }
    return {
      id: chaine(valeur.id, `${cheminVariante}/id`),
      condition,
      presentation: valeur.presentation,
    };
  });
  if (variantesSource.length === 0) {
    echouer("schema", `${chemin}/variantes`, "au moins une variante requise");
  }
  const faitsLus = chaines(evenement.faits_lus, `${chemin}/faits_lus`);
  faitsLus.forEach((fait, faitIndex) =>
    verifierReference(
      references.faits,
      fait,
      `${chemin}/faits_lus/${faitIndex}`,
    ),
  );
  const faitsTestes = [
    ...conditions.requises,
    ...conditions.interdites,
  ].flatMap((condition) =>
    condition.type === "fait-present"
      ? [condition.fait]
      : condition.type === "un-des-faits-present"
        ? condition.faits
        : [],
  );
  const faitsTestesParLesVariantes = variantesSource.flatMap((variante) =>
    variante.condition.type === "fait-present"
      ? [variante.condition.fait]
      : [],
  );
  if (!memesValeurs(faitsLus, [...faitsTestes, ...faitsTestesParLesVariantes])) {
    echouer(
      "schema",
      `${chemin}/faits_lus`,
      "les faits lus doivent correspondre exactement aux faits testés par les conditions",
    );
  }

  const choixSources = tableau(evenement.choix, `${chemin}/choix`).map(
    (choix, choixIndex) => ({
      chemin: `${chemin}/choix/${choixIndex}`,
      valeur: objet(choix, `${chemin}/choix/${choixIndex}`),
    }),
  );
  const maximumDIntentions =
    id === "finale.ancrage.choisir-d-ancrer-le-coeur" ? 6 : 4;
  if (
    choixSources.length < 2 ||
    choixSources.length > maximumDIntentions
  ) {
    echouer(
      "schema",
      `${chemin}/choix`,
      `deux à ${maximumDIntentions} intentions requises`,
    );
  }
  const choix: ChoixDEvenement[] = choixSources.map(
    ({ valeur, chemin: cheminChoix }) => {
      const idChoix = chaine(valeur.id, `${cheminChoix}/id`);
      const faitsProduits = tableau(
        valeur.faits_produits,
        `${cheminChoix}/faits_produits`,
      ).map((faitProduit, faitIndex) => {
        const cheminFait = `${cheminChoix}/faits_produits/${faitIndex}`;
        const fait = objet(faitProduit, cheminFait);
        const idFait = chaine(fait.id, `${cheminFait}/id`);
        const cible = chaine(fait.cible, `${cheminFait}/cible`);
        verifierReference(references.faits, idFait, `${cheminFait}/id`);
        verifierReference(references.acteurs, cible, `${cheminFait}/cible`);
        return { id: idFait, cible };
      });

      return {
        id: idChoix,
        effets: tableau(valeur.effets, `${cheminChoix}/effets`).map(
          (effet, effetIndex) =>
            compilerEffet(effet, `${cheminChoix}/effets/${effetIndex}`),
        ),
        faitsProduits,
      };
    },
  );

  const compilerTextes = (langue: Langue): TextesDUnEvenement => {
    const textesChoix = Object.fromEntries(
      choixSources.map(({ valeur, chemin: cheminChoix }) => {
        const idChoix = chaine(valeur.id, `${cheminChoix}/id`);
        return [
          idChoix,
          {
            intention: compilerTexte(
              valeur.intention,
              `${cheminChoix}/intention`,
              traductions,
              langue,
            ),
            coutsConnus: tableau(
              valeur.couts_connus,
              `${cheminChoix}/couts_connus`,
            ).map((cout, coutIndex) =>
              compilerTexte(
                cout,
                `${cheminChoix}/couts_connus/${coutIndex}`,
                traductions,
                langue,
              ),
            ),
          },
        ];
      }),
    );

    return {
      origine: compilerTexte(
        evenement.origine,
        `${chemin}/origine`,
        traductions,
        langue,
      ),
      libelleIntentions: compilerTexte(
        evenement.libelle_intentions,
        `${chemin}/libelle_intentions`,
        traductions,
        langue,
      ),
      titre: compilerTexte(
        evenement.titre,
        `${chemin}/titre`,
        traductions,
        langue,
      ),
      presentation: compilerTexte(
        evenement.presentation,
        `${chemin}/presentation`,
        traductions,
        langue,
      ),
      informations: informations.map((information, informationIndex) =>
        compilerTexte(
          information.texte,
          `${chemin}/informations/${informationIndex}/texte`,
          traductions,
          langue,
        ),
      ),
      variantes: Object.fromEntries(
        variantesSource.map((variante, varianteIndex) => [
          variante.id,
          compilerTexte(
            variante.presentation,
            `${chemin}/variantes/${varianteIndex}/presentation`,
            traductions,
            langue,
          ),
        ]),
      ),
      choix: textesChoix,
    };
  };
  const textes: Record<Langue, TextesDUnEvenement> = {
    fr: compilerTextes("fr"),
    en: compilerTextes("en"),
  };

  const asset: AssetCompile | null = (() => {
    if (evenement.asset === undefined) {
      return null;
    }

    const idAsset = chaine(evenement.asset, `${chemin}/asset`);
    const sourceAsset = assets.get(idAsset);
    if (sourceAsset === undefined) {
      echouer("asset", `${chemin}/asset`, `asset inconnu « ${idAsset} »`);
    }
    const alternatives = Object.fromEntries(
      LANGUES.map((langue) => {
        const alternative = traductions[langue].textes[sourceAsset.alternative];
        if (alternative === undefined) {
          echouer(
            langue === "fr" ? "texte" : "traduction",
            `${chemin}/asset`,
            `alternative ${langue} absente « ${sourceAsset.alternative} »`,
          );
        }
        return [langue, alternative];
      }),
    ) as Record<Langue, string>;

    return {
      id: sourceAsset.id,
      fichier: sourceAsset.fichier,
      octetsTransferes: sourceAsset.octetsTransferes,
      contientTexte: false,
      alternatives,
      provenance: sourceAsset.provenance,
    };
  })();
  const periode = objet(
    evenement.periode_eligibilite,
    `${chemin}/periode_eligibilite`,
  );
  const consequenceDifferee = objet(
    evenement.consequence_differee,
    `${chemin}/consequence_differee`,
  );
  const cibleConsequence = chaine(
    consequenceDifferee.cible,
    `${chemin}/consequence_differee/cible`,
  );
  verifierReference(
    references.acteurs,
    cibleConsequence,
    `${chemin}/consequence_differee/cible`,
  );
  const recuperation = objet(
    evenement.recuperation,
    `${chemin}/recuperation`,
  );

  return {
    id,
    famille: famille as EvenementDuCatalogue["famille"],
    themes: chaines(evenement.themes, `${chemin}/themes`),
    fonction: chaine(evenement.fonction, `${chemin}/fonction`),
    fenetre,
    conditions,
    periodeEligibilite: {
      debut: nombre(periode.debut, `${chemin}/periode_eligibilite/debut`),
      fin: nombre(periode.fin, `${chemin}/periode_eligibilite/fin`),
    },
    priorite: nombre(evenement.priorite, `${chemin}/priorite`),
    epuisement:
      evenement.epuisement === "unique"
        ? "unique"
        : echouer("schema", `${chemin}/epuisement`, "« unique » attendu"),
    acteurs,
    sourcesInformations: informations.map((information) => information.source),
    faitsLus,
    choix,
    consequenceDifferee: {
      type: chaine(
        consequenceDifferee.type,
        `${chemin}/consequence_differee/type`,
      ),
      cible: cibleConsequence,
    },
    recuperation: {
      type: chaine(recuperation.type, `${chemin}/recuperation/type`),
    },
    variantes: variantesSource.map(({ id: idVariante, condition }) => ({
      id: idVariante,
      condition,
    })),
    destinationEcho,
    asset,
    textes,
  };
}

function compilerInstallations(
  source: string,
  traductions: Readonly<Record<Langue, TraductionCompilee>>,
): readonly InstallationDuCatalogue[] {
  const nom = "infrastructure.yaml";
  const racine = objet(parserYaml(source, nom), nom);
  verifierVersion(racine, nom);
  const identifiants = new Set<string>();

  return tableau(racine.installations, `${nom}/installations`).map(
    (valeur, index) => {
      const chemin = `${nom}/installations/${index}`;
      const installation = objet(valeur, chemin);
      const id = chaine(installation.id, `${chemin}/id`);
      if (identifiants.has(id)) {
        echouer("schema", `${chemin}/id`, `identifiant dupliqué « ${id} »`);
      }
      identifiants.add(id);
      const consequences = objet(
        installation.consequences,
        `${chemin}/consequences`,
      );
      const compilerTextes = (langue: Langue) => ({
        nom: compilerTexte(
          installation.nom,
          `${chemin}/nom`,
          traductions,
          langue,
        ),
        service: compilerTexte(
          installation.service,
          `${chemin}/service`,
          traductions,
          langue,
        ),
        transformationsDeStocks: tableau(
          installation.transformations_de_stocks,
          `${chemin}/transformations_de_stocks`,
        ).map((texte, texteIndex) =>
          compilerTexte(
            texte,
            `${chemin}/transformations_de_stocks/${texteIndex}`,
            traductions,
            langue,
          ),
        ),
        consequences: {
          operationnelle: compilerTexte(
            consequences.operationnelle,
            `${chemin}/consequences/operationnelle`,
            traductions,
            langue,
          ),
          degradee: compilerTexte(
            consequences.degradee,
            `${chemin}/consequences/degradee`,
            traductions,
            langue,
          ),
          "hors-service": compilerTexte(
            consequences["hors-service"],
            `${chemin}/consequences/hors-service`,
            traductions,
            langue,
          ),
        },
      });

      return {
        id,
        textes: { fr: compilerTextes("fr"), en: compilerTextes("en") },
      };
    },
  );
}

const COMPETENCES_DE_COMPAGNON = new Set([
  "technique",
  "intendance",
  "soin",
  "terrain",
  "diplomatie",
]);
const CRITERES_DE_PERTINENCE_DU_CONSEIL = new Set([
  "affectation-au-quartier",
  "competence-majeure",
  "competence-secondaire",
  "conviction-concernee",
  "enjeu-personnel",
]);

function compilerConseil(
  source: unknown,
  index: number,
  references: ReferencesCompilees,
  traductions: Readonly<Record<Langue, TraductionCompilee>>,
): ConseilDuCatalogue {
  const chemin = `conseils.yaml/conseils/${index}`;
  const conseil = objet(source, chemin);
  const id = chaine(conseil.id, `${chemin}/id`);
  const compagnonSource = objet(conseil.compagnon, `${chemin}/compagnon`);
  const compagnonId = chaine(compagnonSource.id, `${chemin}/compagnon/id`);
  verifierReference(
    references.acteurs,
    compagnonId,
    `${chemin}/compagnon/id`,
  );
  const competences = objet(
    compagnonSource.competences,
    `${chemin}/compagnon/competences`,
  );
  const competenceMajeure = chaine(
    competences.majeure,
    `${chemin}/compagnon/competences/majeure`,
  );
  const competenceSecondaire = chaine(
    competences.secondaire,
    `${chemin}/compagnon/competences/secondaire`,
  );
  [competenceMajeure, competenceSecondaire].forEach((competence) => {
    if (!COMPETENCES_DE_COMPAGNON.has(competence)) {
      echouer(
        "reference",
        `${chemin}/compagnon/competences`,
        `compétence inconnue « ${competence} »`,
      );
    }
  });
  if (competenceMajeure === competenceSecondaire) {
    echouer(
      "schema",
      `${chemin}/compagnon/competences`,
      "les compétences majeure et secondaire doivent être distinctes",
    );
  }

  const etatPersonnelSource = objet(
    compagnonSource.etat_personnel,
    `${chemin}/compagnon/etat_personnel`,
  );
  const affectationSource = objet(
    compagnonSource.affectation,
    `${chemin}/compagnon/affectation`,
  );
  const quartier = chaine(
    affectationSource.quartier,
    `${chemin}/compagnon/affectation/quartier`,
  );
  verifierReference(
    references.quartiers,
    quartier,
    `${chemin}/compagnon/affectation/quartier`,
  );
  if (affectationSource.occupation !== "tete-de-quartier") {
    echouer(
      "schema",
      `${chemin}/compagnon/affectation/occupation`,
      "l’occupation « tete-de-quartier » est requise",
    );
  }
  const faitDAffectation = chaine(
    affectationSource.fait_produit,
    `${chemin}/compagnon/affectation/fait_produit`,
  );
  verifierReference(
    references.faits,
    faitDAffectation,
    `${chemin}/compagnon/affectation/fait_produit`,
  );

  const sujetsSources = tableau(conseil.sujets, `${chemin}/sujets`).map(
    (sujet, sujetIndex) => ({
      chemin: `${chemin}/sujets/${sujetIndex}`,
      valeur: objet(sujet, `${chemin}/sujets/${sujetIndex}`),
    }),
  );
  if (sujetsSources.length < 1 || sujetsSources.length > 3) {
    echouer("schema", `${chemin}/sujets`, "un à trois sujets requis");
  }
  const sujets = sujetsSources.map(({ chemin: cheminSujet, valeur }) => {
    const sujetId = chaine(valeur.id, `${cheminSujet}/id`);
    const voixSources = tableau(valeur.voix, `${cheminSujet}/voix`).map(
      (voix, voixIndex) => ({
        chemin: `${cheminSujet}/voix/${voixIndex}`,
        valeur: objet(voix, `${cheminSujet}/voix/${voixIndex}`),
      }),
    );
    if (voixSources.length < 1 || voixSources.length > 2) {
      echouer("schema", `${cheminSujet}/voix`, "une à deux voix requises");
    }
    const voix = voixSources.map(({ chemin: cheminVoix, valeur: voix }) => {
      const voixCompagnonId = chaine(
        voix.compagnon,
        `${cheminVoix}/compagnon`,
      );
      if (voixCompagnonId !== compagnonId) {
        echouer(
          "reference",
          `${cheminVoix}/compagnon`,
          `Compagnon inconnu « ${voixCompagnonId} »`,
        );
      }
      const criteres = chaines(voix.criteres, `${cheminVoix}/criteres`);
      criteres.forEach((critere, critereIndex) => {
        if (!CRITERES_DE_PERTINENCE_DU_CONSEIL.has(critere)) {
          echouer(
            "reference",
            `${cheminVoix}/criteres/${critereIndex}`,
            `critère inconnu « ${critere} »`,
          );
        }
      });
      return { compagnonId: voixCompagnonId, criteres };
    });
    const decisionsSources = tableau(
      valeur.decisions,
      `${cheminSujet}/decisions`,
    ).map((decision, decisionIndex) => ({
      chemin: `${cheminSujet}/decisions/${decisionIndex}`,
      valeur: objet(decision, `${cheminSujet}/decisions/${decisionIndex}`),
    }));
    if (decisionsSources.length < 2 || decisionsSources.length > 4) {
      echouer(
        "schema",
        `${cheminSujet}/decisions`,
        "deux à quatre décisions requises",
      );
    }
    const decisions = decisionsSources.map(
      ({ chemin: cheminDecision, valeur: decision }) => {
        const faitProduit = chaine(
          decision.fait_produit,
          `${cheminDecision}/fait_produit`,
        );
        verifierReference(
          references.faits,
          faitProduit,
          `${cheminDecision}/fait_produit`,
        );
        return {
          id: chaine(decision.id, `${cheminDecision}/id`),
          faitProduit,
          ouverteParAffectation: booleen(
            decision.ouverte_par_affectation,
            `${cheminDecision}/ouverte_par_affectation`,
          ),
        };
      },
    );
    return { id: sujetId, voix, decisions };
  });

  const compilerJournal = (
    journalSource: unknown,
    cheminJournal: string,
    langue: Langue,
  ) => {
    const journal = objet(journalSource, cheminJournal);
    return {
      titre: compilerTexte(
        journal.titre,
        `${cheminJournal}/titre`,
        traductions,
        langue,
      ),
      cause: compilerTexte(
        journal.cause,
        `${cheminJournal}/cause`,
        traductions,
        langue,
      ),
      acteurs: tableau(journal.acteurs, `${cheminJournal}/acteurs`).map(
        (acteur, acteurIndex) =>
          compilerTexte(
            acteur,
            `${cheminJournal}/acteurs/${acteurIndex}`,
            traductions,
            langue,
          ),
      ),
      cible: compilerTexte(
        journal.cible,
        `${cheminJournal}/cible`,
        traductions,
        langue,
      ),
    };
  };
  const compilerTextes = (langue: Langue) => {
    const textesCompagnon = objet(
      compagnonSource.textes,
      `${chemin}/compagnon/textes`,
    );
    const compilerTexteDuCompagnon = (cleSource: string) =>
      compilerTexte(
        textesCompagnon[cleSource],
        `${chemin}/compagnon/textes/${cleSource}`,
        traductions,
        langue,
      );
    const libellesSource = objet(conseil.libelles, `${chemin}/libelles`);
    const compilerLibelle = (cleSource: string) =>
      compilerTexte(
        libellesSource[cleSource],
        `${chemin}/libelles/${cleSource}`,
        traductions,
        langue,
      );
    const sujetsTextes = Object.fromEntries(
      sujetsSources.map(({ chemin: cheminSujet, valeur: sujet }, sujetIndex) => {
        const voixSources = tableau(sujet.voix, `${cheminSujet}/voix`);
        const decisionsSources = tableau(
          sujet.decisions,
          `${cheminSujet}/decisions`,
        );
        return [
          sujets[sujetIndex]!.id,
          {
            titre: compilerTexte(
              sujet.titre,
              `${cheminSujet}/titre`,
              traductions,
              langue,
            ),
            voix: Object.fromEntries(
              voixSources.map((voixBrute, voixIndex) => {
                const cheminVoix = `${cheminSujet}/voix/${voixIndex}`;
                const voix = objet(voixBrute, cheminVoix);
                const voixCompagnonId = sujets[sujetIndex]!.voix[voixIndex]!
                  .compagnonId;
                return [
                  voixCompagnonId,
                  {
                    faitConnu: compilerTexte(
                      voix.fait_connu,
                      `${cheminVoix}/fait_connu`,
                      traductions,
                      langue,
                    ),
                    source: compilerTexte(
                      voix.source,
                      `${cheminVoix}/source`,
                      traductions,
                      langue,
                    ),
                    dateSource: compilerTexte(
                      voix.date_source,
                      `${cheminVoix}/date_source`,
                      traductions,
                      langue,
                    ),
                    recommandationMorale: compilerTexte(
                      voix.recommandation_morale,
                      `${cheminVoix}/recommandation_morale`,
                      traductions,
                      langue,
                    ),
                    enjeuPersonnel: compilerTexte(
                      voix.enjeu_personnel,
                      `${cheminVoix}/enjeu_personnel`,
                      traductions,
                      langue,
                    ),
                  },
                ];
              }),
            ),
            decisions: Object.fromEntries(
              decisionsSources.map((decisionBrute, decisionIndex) => {
                const cheminDecision = `${cheminSujet}/decisions/${decisionIndex}`;
                const decision = objet(decisionBrute, cheminDecision);
                return [
                  sujets[sujetIndex]!.decisions[decisionIndex]!.id,
                  compilerTexte(
                    decision.libelle,
                    `${cheminDecision}/libelle`,
                    traductions,
                    langue,
                  ),
                ];
              }),
            ),
          },
        ];
      }),
    );
    const journal = Object.fromEntries([
      [
        faitDAffectation,
        compilerJournal(
          affectationSource.journal,
          `${chemin}/compagnon/affectation/journal`,
          langue,
        ),
      ],
      ...sujetsSources.flatMap(({ chemin: cheminSujet, valeur: sujet }, sujetIndex) =>
        tableau(sujet.decisions, `${cheminSujet}/decisions`).map(
          (decisionBrute, decisionIndex) => {
            const cheminDecision = `${cheminSujet}/decisions/${decisionIndex}`;
            const decision = objet(decisionBrute, cheminDecision);
            return [
              sujets[sujetIndex]!.decisions[decisionIndex]!.faitProduit,
              compilerJournal(
                decision.journal,
                `${cheminDecision}/journal`,
                langue,
              ),
            ] as const;
          },
        ),
      ),
    ]);

    return {
      titre: compilerTexte(
        conseil.titre,
        `${chemin}/titre`,
        traductions,
        langue,
      ),
      compagnon: {
        nom: compilerTexteDuCompagnon("nom"),
        competenceMajeure: compilerTexteDuCompagnon(
          "competence_majeure",
        ),
        competenceSecondaire: compilerTexteDuCompagnon(
          "competence_secondaire",
        ),
        trait: compilerTexteDuCompagnon("trait"),
        ambivalence: compilerTexteDuCompagnon("ambivalence"),
        conviction: compilerTexteDuCompagnon("conviction"),
        projet: compilerTexteDuCompagnon("projet"),
        etatPersonnel: compilerTexteDuCompagnon(
          "etat_personnel",
        ),
        contrainte: compilerTexteDuCompagnon("contrainte"),
        voieDeSoin: compilerTexteDuCompagnon("voie_de_soin"),
        quartier: compilerTexteDuCompagnon("quartier"),
        informationOuverte: compilerTexteDuCompagnon(
          "information_ouverte",
        ),
      },
      libelles: {
        typeCompagnon: compilerLibelle("type_compagnon"),
        competenceMajeure: compilerLibelle("competence_majeure"),
        competenceSecondaire: compilerLibelle("competence_secondaire"),
        trait: compilerLibelle("trait"),
        conviction: compilerLibelle("conviction"),
        projet: compilerLibelle("projet"),
        etatPersonnel: compilerLibelle("etat_personnel"),
        soin: compilerLibelle("soin"),
        affecter: compilerLibelle("affecter"),
        affectee: compilerLibelle("affectee"),
        informationOuverte: compilerLibelle("information_ouverte"),
        conseil: compilerLibelle("conseil"),
        faitConnu: compilerLibelle("fait_connu"),
        source: compilerLibelle("source"),
        recommandationMorale: compilerLibelle("recommandation_morale"),
        enjeuPersonnel: compilerLibelle("enjeu_personnel"),
        decision: compilerLibelle("decision"),
        reponseOuverte: compilerLibelle("reponse_ouverte"),
      },
      sujets: sujetsTextes,
      journal,
    };
  };

  return {
    id,
    compagnon: {
      id: compagnonId,
      competences: {
        majeure: competenceMajeure,
        secondaire: competenceSecondaire,
      },
      trait: chaine(compagnonSource.trait, `${chemin}/compagnon/trait`),
      conviction: chaine(
        compagnonSource.conviction,
        `${chemin}/compagnon/conviction`,
      ),
      projet: chaine(compagnonSource.projet, `${chemin}/compagnon/projet`),
      etatPersonnel: {
        id: chaine(etatPersonnelSource.id, `${chemin}/compagnon/etat_personnel/id`),
        contrainte: chaine(
          etatPersonnelSource.contrainte,
          `${chemin}/compagnon/etat_personnel/contrainte`,
        ),
        voieDeSoin: chaine(
          etatPersonnelSource.voie_de_soin,
          `${chemin}/compagnon/etat_personnel/voie_de_soin`,
        ),
      },
      affectation: {
        quartier,
        occupation: "tete-de-quartier",
        faitProduit: faitDAffectation,
        cause: chaine(
          affectationSource.cause,
          `${chemin}/compagnon/affectation/cause`,
        ),
      },
    },
    sujets,
    textes: {
      fr: compilerTextes("fr"),
      en: compilerTextes("en"),
    },
  };
}

export function compilerCatalogue(
  sources: SourcesDuCatalogue,
): CatalogueDEvenements {
  const references = compilerReferences(sources.references);
  const traductions = Object.fromEntries(
    LANGUES.map((langue) => [
      langue,
      compilerTraduction(langue, sources.traductions[langue]),
    ]),
  ) as Record<Langue, TraductionCompilee>;
  const assets = compilerAssets(
    sources.assets,
    sources.provenances,
    sources.cheminDeProvenanceAsset ?? ((chemin) => `public${chemin}`),
    sources.assetExiste,
    sources.empreinteAsset,
    sources.tailleAsset,
  );
  const libellesTransversaux = compilerLibellesTransversaux(traductions);
  const installations = compilerInstallations(
    sources.infrastructure,
    traductions,
  );
  const racine = objet(
    parserYaml(sources.evenements, "evenements.yaml"),
    "evenements.yaml",
  );
  verifierVersion(racine, "evenements.yaml");
  const identifiants = new Set<string>();
  const evenements = tableau(
    racine.evenements,
    "evenements.yaml/evenements",
  ).map((evenement, index) => {
    const compile = compilerEvenement(
      evenement,
      index,
      references,
      traductions,
      assets,
    );
    if (identifiants.has(compile.id)) {
      echouer(
        "schema",
        `evenements.yaml/evenements/${index}/id`,
        `identifiant stable dupliqué « ${compile.id} »`,
      );
    }
    identifiants.add(compile.id);
    return compile;
  });

  if (evenements.length === 0) {
    echouer("schema", "evenements.yaml/evenements", "catalogue vide");
  }

  const racineDesConseils = objet(
    parserYaml(sources.conseils, "conseils.yaml"),
    "conseils.yaml",
  );
  verifierVersion(racineDesConseils, "conseils.yaml");
  const identifiantsDesConseils = new Set<string>();
  const conseils = tableau(
    racineDesConseils.conseils,
    "conseils.yaml/conseils",
  ).map((conseil, index) => {
    const compile = compilerConseil(
      conseil,
      index,
      references,
      traductions,
    );
    if (identifiantsDesConseils.has(compile.id)) {
      echouer(
        "schema",
        `conseils.yaml/conseils/${index}/id`,
        `identifiant stable dupliqué « ${compile.id} »`,
      );
    }
    identifiantsDesConseils.add(compile.id);
    return compile;
  });
  if (conseils.length === 0) {
    echouer("schema", "conseils.yaml/conseils", "catalogue vide");
  }

  return figerProfondement({
    version: VERSION_CONTENU_COURANTE,
    evenements,
    installations,
    conseils,
    libellesTransversaux,
  });
}
