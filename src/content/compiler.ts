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
  type ConditionDEvenement,
  type EffetDEvenement,
  type EvenementDuCatalogue,
  type Langue,
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
  readonly references: string;
  readonly traductions: Readonly<Record<Langue, string>>;
  readonly assets: string;
  readonly provenances: Readonly<Record<string, string>>;
  readonly assetExiste: (chemin: string) => boolean;
  readonly empreinteAsset: (chemin: string) => string;
}

type ObjetSource = Record<string, unknown>;

interface ReferencesCompilees {
  readonly acteurs: ReadonlySet<string>;
  readonly fenetres: ReadonlySet<string>;
  readonly destinationsEcho: ReadonlySet<string>;
  readonly faits: ReadonlySet<string>;
}

interface TraductionCompilee {
  readonly textes: Readonly<Record<string, string>>;
}

interface AssetSource {
  readonly id: string;
  readonly fichier: string;
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
    fenetres: new Set(chaines(racine.fenetres, "references.yaml/fenetres")),
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

function compilerAssets(
  source: string,
  provenances: Readonly<Record<string, string>>,
  assetExiste: (chemin: string) => boolean,
  empreinteAsset: (chemin: string) => string,
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
    if (!fichier.startsWith("/assets/") || fichier.includes("..")) {
      echouer(
        "asset",
        `${chemin}/fichier`,
        "le fichier doit rester sous /assets/",
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
    if (provenanceSource.asset !== `public${fichier}`) {
      echouer(
        "asset",
        `${ficheProvenance}/asset`,
        `la fiche ne décrit pas « public${fichier} »`,
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

  return echouer("reference", `${chemin}/type`, `condition inconnue « ${type} »`);
}

function compilerEffet(source: unknown, chemin: string): EffetDEvenement {
  const effet = objet(source, chemin);
  const type = chaine(effet.type, `${chemin}/type`);

  if (type !== "habitants.modifier") {
    echouer("effet", `${chemin}/type`, `effet inconnu « ${type} »`);
  }

  return {
    type,
    valeur: nombre(effet.valeur, `${chemin}/valeur`),
  };
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
    condition.type === "fait-present" ? [condition.fait] : [],
  );
  if (!memesValeurs(faitsLus, faitsTestes)) {
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
  if (choixSources.length < 2 || choixSources.length > 4) {
    echouer("schema", `${chemin}/choix`, "deux à quatre intentions requises");
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

  const variantesSource = tableau(
    evenement.variantes,
    `${chemin}/variantes`,
  ).map((variante, varianteIndex) => {
    const cheminVariante = `${chemin}/variantes/${varianteIndex}`;
    const valeur = objet(variante, cheminVariante);
    return {
      id: chaine(valeur.id, `${cheminVariante}/id`),
      condition: chaine(valeur.condition, `${cheminVariante}/condition`),
      presentation: valeur.presentation,
    };
  });
  if (variantesSource.length === 0) {
    echouer("schema", `${chemin}/variantes`, "au moins une variante requise");
  }

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
    sources.assetExiste,
    sources.empreinteAsset,
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

  return figerProfondement({
    version: VERSION_CONTENU_COURANTE,
    evenements,
  });
}
