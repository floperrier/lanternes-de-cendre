import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import sharp from "sharp";
import { parseDocument } from "yaml";

import {
  BUNDLES_PUBLICS,
  IDENTIFIANTS_DE_BUNDLES,
  type IdentifiantDeBundle,
  type IdentifiantDeBundleRegional,
} from "../src/assets/catalogueBundles";
import { BUNDLES_PREMIUM } from "../serveur-commercial/bundlesPremium";
import { CONTENU_PREMIUM_V1_JSON } from "../serveur-commercial/contenuPremium";

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MIO = 1_048_576;
const BUNDLES_REGIONAUX = [
  "bassins",
  "trame",
  "couronne",
  "finale",
] as const satisfies readonly IdentifiantDeBundleRegional[];

interface Configuration {
  readonly version: 1;
  readonly limites: {
    readonly shell_octets: number;
    readonly premiere_scene_octets: number;
    readonly bundle_regional_octets: number;
    readonly cache_complet_octets: number;
    readonly textures_actives_decodees_octets: number;
    readonly atlas_dimension_preferee: number;
    readonly atlas_dimension_maximale: number;
    readonly premiere_scene_secondes: number;
    readonly images_par_seconde_cible: number;
    readonly images_par_seconde_minimales: number;
  };
  readonly derogations: readonly {
    readonly id: string;
    readonly regle: "approbation-assets";
    readonly version_cible: string;
    readonly inventaire_sha256: string;
    readonly suivi: string;
    readonly justification: string;
  }[];
}

interface AssetDuManifest {
  readonly id: string;
  readonly fichier: string;
  readonly alternative: string;
  readonly contient_texte: false;
  readonly provenance: string;
}

interface AssetAVerifier {
  readonly url: string;
  readonly chemin: string;
  readonly provenance: string;
  readonly champEmpreinte?: "atlasJsonSha256";
  readonly alternative?: string;
  readonly atlas: boolean;
}

interface Metrique {
  readonly valeur: number;
  readonly limite: number;
  readonly conforme: boolean;
}

interface EntreeDuManifestVite {
  readonly file: string;
  readonly isEntry?: boolean;
  readonly imports?: readonly string[];
  readonly dynamicImports?: readonly string[];
  readonly css?: readonly string[];
  readonly assets?: readonly string[];
}

function lireYaml<T>(chemin: string): T {
  const document = parseDocument(
    readFileSync(resolve(racine, chemin), "utf8"),
    { schema: "core", uniqueKeys: true, prettyErrors: true },
  );
  if (document.errors.length > 0) {
    throw document.errors[0];
  }
  return document.toJS() as T;
}

function sha256(valeur: string | Buffer): string {
  return createHash("sha256").update(valeur).digest("hex");
}

function listerFichiers(chemin: string): string[] {
  return readdirSync(chemin, { withFileTypes: true }).flatMap((entree) => {
    const enfant = resolve(chemin, entree.name);
    return entree.isDirectory() ? listerFichiers(enfant) : [enfant];
  });
}

function cheminPhysique(url: string): string {
  return url.startsWith("/api/commercial/assets/")
    ? resolve(racine, "serveur-commercial/assets", basename(url))
    : resolve(racine, "public", url.slice(1));
}

function metric(valeur: number, limite: number): Metrique {
  return { valeur, limite, conforme: valeur <= limite };
}

function tailleUnique(chemins: Iterable<string>): number {
  return [...new Set(chemins)].reduce(
    (total, chemin) => total + statSync(chemin).size,
    0,
  );
}

function verifierConfiguration(valeur: unknown): asserts valeur is Configuration {
  const configuration = valeur as Partial<Configuration>;
  if (
    configuration.version !== 1 ||
    configuration.limites === undefined ||
    !Object.values(configuration.limites).every(
      (limite) => typeof limite === "number" && limite > 0,
    ) ||
    !Array.isArray(configuration.derogations)
  ) {
    throw new Error("content/assets/budgets.yaml est invalide");
  }
}

function construireInventaire(
  manifest: readonly AssetDuManifest[],
): Map<string, AssetAVerifier> {
  const inventaire = new Map<string, AssetAVerifier>();
  for (const asset of manifest) {
    const existant = inventaire.get(asset.fichier);
    if (
      existant !== undefined &&
      existant.provenance !== asset.provenance
    ) {
      throw new Error(
        `${asset.fichier} possède plusieurs fiches de provenance`,
      );
    }
    inventaire.set(asset.fichier, {
      url: asset.fichier,
      chemin: cheminPhysique(asset.fichier),
      provenance: asset.provenance,
      alternative: asset.alternative,
      atlas: false,
    });
  }

  const techniques: readonly AssetAVerifier[] = [
    {
      url: "/assets/ui/atlas-bassins-fendus.webp",
      chemin: cheminPhysique("/assets/ui/atlas-bassins-fendus.webp"),
      provenance: "docs/assets/ui-immersive.provenance.json",
      atlas: true,
    },
    {
      url: "/assets/ui/ilyana-voss.webp",
      chemin: cheminPhysique("/assets/ui/ilyana-voss.webp"),
      provenance: "docs/assets/ui-immersive.provenance.json",
      atlas: false,
    },
    {
      url: "/assets/ui/metal-cendre.webp",
      chemin: cheminPhysique("/assets/ui/metal-cendre.webp"),
      provenance: "docs/assets/ui-immersive.provenance.json",
      atlas: false,
    },
    {
      url: "/assets/ui/lanterne.svg",
      chemin: cheminPhysique("/assets/ui/lanterne.svg"),
      provenance: "docs/assets/ui-lanterne.provenance.json",
      atlas: false,
    },
    {
      url: "/assets/sprites/cite.fumee-01.png",
      chemin: cheminPhysique("/assets/sprites/cite.fumee-01.png"),
      provenance: "docs/assets/sprites/cite.fumee-01.provenance.json",
      atlas: true,
    },
    {
      url: "/assets/sprites/cite.fumee-01.json",
      chemin: cheminPhysique("/assets/sprites/cite.fumee-01.json"),
      provenance: "docs/assets/sprites/cite.fumee-01.provenance.json",
      champEmpreinte: "atlasJsonSha256",
      atlas: false,
    },
  ];
  for (const asset of techniques) {
    inventaire.set(asset.url, asset);
  }
  return inventaire;
}

function trouverEntreeDeProvenance(
  fiche: Record<string, unknown>,
  cheminRelatif: string,
): Record<string, unknown> {
  if (Array.isArray(fiche.assets)) {
    const entree = fiche.assets.find(
      (candidate) =>
        candidate !== null &&
        typeof candidate === "object" &&
        (candidate as { readonly asset?: unknown }).asset === cheminRelatif,
    );
    if (entree === undefined) {
      throw new Error(`provenance absente pour ${cheminRelatif}`);
    }
    return {
      ...fiche,
      ...(entree as Record<string, unknown>),
      approval:
        (entree as Record<string, unknown>).approval ?? fiche.approval,
    };
  }
  return fiche;
}

function empreinteDesApprobations(
  nonApprouves: readonly {
    readonly chemin: string;
    readonly empreinte: string;
    readonly statut: string;
  }[],
): string {
  return sha256(
    [...nonApprouves]
      .sort((gauche, droite) =>
        gauche.chemin.localeCompare(droite.chemin),
      )
      .map(
        ({ chemin, empreinte, statut }) =>
          `${chemin}\0${empreinte}\0${statut}`,
      )
      .join("\n"),
  );
}

function collecterFichiersDuGrapheVite(
  manifest: Readonly<Record<string, EntreeDuManifestVite>>,
  racines: readonly string[],
): Set<string> {
  const resultat = new Set<string>();
  const visiter = (cle: string) => {
    const entree = manifest[cle];
    if (entree === undefined || resultat.has(entree.file)) {
      return;
    }
    resultat.add(entree.file);
    entree.css?.forEach((fichier) => resultat.add(fichier));
    entree.assets?.forEach((fichier) => resultat.add(fichier));
    entree.imports?.forEach(visiter);
  };
  racines.forEach(visiter);
  return resultat;
}

async function verifierBudgets(): Promise<void> {
  const erreurs: string[] = [];
  const avertissements: string[] = [];
  const configurationInconnue = lireYaml<unknown>(
    "content/assets/budgets.yaml",
  );
  verifierConfiguration(configurationInconnue);
  const configuration = configurationInconnue;
  const packageJson = JSON.parse(
    readFileSync(resolve(racine, "package.json"), "utf8"),
  ) as { readonly version: string };
  const sourceManifest = lireYaml<{
    readonly version: number;
    readonly assets: readonly AssetDuManifest[];
  }>("content/assets/manifest.yaml");
  if (sourceManifest.version !== 1) {
    erreurs.push("content/assets/manifest.yaml doit rester en version 1");
  }
  const inventaire = construireInventaire(sourceManifest.assets);

  const bundles: Readonly<Record<IdentifiantDeBundle, readonly string[]>> = {
    commun: BUNDLES_PUBLICS.commun,
    bassins: [
      ...BUNDLES_PUBLICS.bassins,
      ...BUNDLES_PREMIUM.bassins,
    ],
    trame: [...BUNDLES_PUBLICS.trame, ...BUNDLES_PREMIUM.trame],
    couronne: [
      ...BUNDLES_PUBLICS.couronne,
      ...BUNDLES_PREMIUM.couronne,
    ],
    finale: [
      ...BUNDLES_PUBLICS.finale,
      ...BUNDLES_PREMIUM.finale,
    ],
    "a-la-demande": BUNDLES_PUBLICS["a-la-demande"],
  };
  const urlsDesBundles = IDENTIFIANTS_DE_BUNDLES.flatMap(
    (id) => bundles[id],
  );
  const doublons = urlsDesBundles.filter(
    (url, index) => urlsDesBundles.indexOf(url) !== index,
  );
  if (doublons.length > 0) {
    erreurs.push(
      `assets présents dans plusieurs bundles: ${[...new Set(doublons)].join(", ")}`,
    );
  }
  for (const url of inventaire.keys()) {
    if (!urlsDesBundles.includes(url)) {
      erreurs.push(`asset sans bundle: ${url}`);
    }
  }
  for (const url of urlsDesBundles) {
    if (!inventaire.has(url)) {
      erreurs.push(`bundle référence un asset sans provenance: ${url}`);
    }
  }
  const physiquesAttendues = [
    ...listerFichiers(resolve(racine, "public/assets")),
    ...listerFichiers(resolve(racine, "serveur-commercial/assets")),
  ].filter((chemin) => basename(chemin) !== ".gitkeep");
  for (const chemin of physiquesAttendues) {
    if (![...inventaire.values()].some((asset) => asset.chemin === chemin)) {
      erreurs.push(
        `fichier physique absent de l’inventaire: ${relative(racine, chemin)}`,
      );
    }
  }

  const traductions = {
    fr: lireYaml<{ readonly textes: Readonly<Record<string, string>> }>(
      "content/locales/fr.yaml",
    ).textes,
    en: lireYaml<{ readonly textes: Readonly<Record<string, string>> }>(
      "content/locales/en.yaml",
    ).textes,
  };
  for (const asset of sourceManifest.assets) {
    if (
      asset.contient_texte !== false ||
      traductions.fr[asset.alternative]?.trim() === "" ||
      traductions.fr[asset.alternative] === undefined ||
      traductions.en[asset.alternative]?.trim() === "" ||
      traductions.en[asset.alternative] === undefined
    ) {
      erreurs.push(
        `alternative bilingue essentielle absente: ${asset.id}`,
      );
    }
  }

  const nonApprouves: {
    readonly chemin: string;
    readonly empreinte: string;
    readonly statut: string;
  }[] = [];
  let approuves = 0;
  const taillesDecodees = new Map<string, number>();
  const dimensions = new Map<string, { largeur: number; hauteur: number }>();
  for (const asset of inventaire.values()) {
    if (!existsSync(asset.chemin)) {
      erreurs.push(`asset absent: ${relative(racine, asset.chemin)}`);
      continue;
    }
    const cheminProvenance = resolve(racine, asset.provenance);
    if (!existsSync(cheminProvenance)) {
      erreurs.push(`provenance absente: ${asset.provenance}`);
      continue;
    }
    const fiche = JSON.parse(
      readFileSync(cheminProvenance, "utf8"),
    ) as Record<string, unknown>;
    const cheminRelatif = relative(racine, asset.chemin);
    const entree = trouverEntreeDeProvenance(fiche, cheminRelatif);
    const champEmpreinte = asset.champEmpreinte ?? "sha256";
    const empreinteAttendue = entree[champEmpreinte];
    const empreinteReelle = sha256(readFileSync(asset.chemin));
    if (empreinteAttendue !== empreinteReelle) {
      erreurs.push(`empreinte invalide: ${cheminRelatif}`);
    }
    for (const champ of ["createdAt", "tool", "useCase", "rights"] as const) {
      if (
        typeof entree[champ] !== "string" ||
        entree[champ].trim() === ""
      ) {
        erreurs.push(`${asset.provenance} — champ ${champ} absent`);
      }
    }
    const approbation =
      entree.approval !== null && typeof entree.approval === "object"
        ? (entree.approval as Record<string, unknown>)
        : {};
    const statut =
      typeof approbation.status === "string"
        ? approbation.status
        : "absente";
    if (
      statut === "approved" &&
      typeof approbation.reviewer === "string" &&
      approbation.reviewer.trim() !== ""
    ) {
      approuves += 1;
    } else {
      nonApprouves.push({
        chemin: cheminRelatif,
        empreinte: empreinteReelle,
        statut,
      });
    }

    if ([".png", ".webp", ".jpg", ".jpeg"].includes(extname(asset.chemin))) {
      const metadata = await sharp(asset.chemin).metadata();
      const largeur = metadata.width ?? 0;
      const hauteur = metadata.height ?? 0;
      dimensions.set(asset.url, { largeur, hauteur });
      taillesDecodees.set(asset.url, largeur * hauteur * 4);
      if (
        largeur > configuration.limites.atlas_dimension_maximale ||
        hauteur > configuration.limites.atlas_dimension_maximale
      ) {
        erreurs.push(
          `texture au-delà de ${configuration.limites.atlas_dimension_maximale} px: ${asset.url}`,
        );
      }
      if (
        asset.atlas &&
        (largeur > configuration.limites.atlas_dimension_preferee ||
          hauteur > configuration.limites.atlas_dimension_preferee)
      ) {
        avertissements.push(
          `atlas au-dessus de la préférence ${configuration.limites.atlas_dimension_preferee} px: ${asset.url}`,
        );
      }
    }
  }

  const empreinteApprobations = empreinteDesApprobations(nonApprouves);
  const derogation = configuration.derogations.find(
    ({ regle }) => regle === "approbation-assets",
  );
  if (nonApprouves.length > 0) {
    if (
      derogation === undefined ||
      derogation.version_cible !== packageJson.version ||
      derogation.inventaire_sha256 !== empreinteApprobations
    ) {
      erreurs.push(
        `approbations manquantes (${nonApprouves.length}); empreinte de dérogation attendue: ${empreinteApprobations}`,
      );
    } else {
      avertissements.push(
        `${nonApprouves.length} assets couverts par ${derogation.id} jusqu’à la version ${derogation.version_cible}`,
      );
    }
  }

  const cheminManifestVite = resolve(
    racine,
    "dist/.vite/manifest.json",
  );
  if (!existsSync(cheminManifestVite)) {
    erreurs.push("dist/.vite/manifest.json absent; exécuter vite build");
  }
  const manifestVite = existsSync(cheminManifestVite)
    ? (JSON.parse(
        readFileSync(cheminManifestVite, "utf8"),
      ) as Readonly<Record<string, EntreeDuManifestVite>>)
    : {};
  const entreePrincipale = Object.entries(manifestVite).find(
    ([, entree]) => entree.isEntry,
  )?.[0];
  if (entreePrincipale === undefined) {
    erreurs.push("entrée Vite absente du manifeste de build");
  }
  const fichiersDuShell =
    entreePrincipale === undefined
      ? new Set<string>()
      : collecterFichiersDuGrapheVite(manifestVite, [entreePrincipale]);
  fichiersDuShell.add("index.html");
  const clesPixi = Object.keys(manifestVite).filter(
    (cle) =>
      cle.endsWith("src/ui/CoupeHabitee.tsx") ||
      cle.endsWith("src/ui/AtlasPixi.tsx"),
  );
  const fichiersPremiereScene = new Set([
    ...fichiersDuShell,
    ...collecterFichiersDuGrapheVite(manifestVite, clesPixi),
  ]);
  const cheminsDuShell = [...fichiersDuShell].map((fichier) =>
    resolve(racine, "dist", fichier),
  );
  const cheminsDuCodeDePremiereScene = [...fichiersPremiereScene].map(
    (fichier) => resolve(racine, "dist", fichier),
  );
  const cheminsDesAssetsCommuns = bundles.commun.map(cheminPhysique);
  const octetsDuShell = tailleUnique(
    cheminsDuShell.filter(existsSync),
  );
  const octetsDePremiereScene = tailleUnique([
    ...cheminsDuCodeDePremiereScene.filter(existsSync),
    ...cheminsDesAssetsCommuns,
    ...BUNDLES_PUBLICS.bassins.map(cheminPhysique),
  ]);
  const octetsParBundle = Object.fromEntries(
    BUNDLES_REGIONAUX.map((id) => [
      id,
      tailleUnique(bundles[id].map(cheminPhysique)),
    ]),
  ) as Readonly<Record<IdentifiantDeBundleRegional, number>>;
  const fichiersDuCache = [
    ...listerFichiers(resolve(racine, "dist")).filter(
      (chemin) => !chemin.endsWith("manifest.json"),
    ),
    ...listerFichiers(resolve(racine, "serveur-commercial/assets")),
  ];
  const octetsDuCacheComplet =
    tailleUnique(fichiersDuCache) +
    Buffer.byteLength(CONTENU_PREMIUM_V1_JSON);

  const ordreRegional: readonly IdentifiantDeBundleRegional[] = [
    "bassins",
    "trame",
    "couronne",
    "finale",
  ];
  const textureALaDemandeMaximale = Math.max(
    0,
    ...bundles["a-la-demande"].map(
      (url) => taillesDecodees.get(url) ?? 0,
    ),
  );
  const texturesActives = Object.fromEntries(
    ordreRegional.map((id, index) => {
      const suivant = ordreRegional[index + 1];
      const urls = [
        ...bundles.commun,
        ...bundles[id],
        ...(suivant === undefined ? [] : bundles[suivant]),
      ];
      return [
        id,
        [...new Set(urls)].reduce(
          (total, url) => total + (taillesDecodees.get(url) ?? 0),
          0,
        ) + textureALaDemandeMaximale,
      ];
    }),
  ) as Readonly<Record<IdentifiantDeBundleRegional, number>>;
  const maximumTexturesActives = Math.max(...Object.values(texturesActives));

  const metriques = {
    shell: metric(octetsDuShell, configuration.limites.shell_octets),
    premiereScene: metric(
      octetsDePremiereScene,
      configuration.limites.premiere_scene_octets,
    ),
    cacheComplet: metric(
      octetsDuCacheComplet,
      configuration.limites.cache_complet_octets,
    ),
    texturesActives: metric(
      maximumTexturesActives,
      configuration.limites.textures_actives_decodees_octets,
    ),
  };
  for (const [nom, mesure] of Object.entries(metriques)) {
    if (!mesure.conforme) {
      erreurs.push(`${nom}: ${mesure.valeur} > ${mesure.limite} octets`);
    }
  }
  for (const [id, valeur] of Object.entries(octetsParBundle)) {
    if (valeur > configuration.limites.bundle_regional_octets) {
      erreurs.push(
        `bundle ${id}: ${valeur} > ${configuration.limites.bundle_regional_octets} octets`,
      );
    }
  }

  const rapport = {
    format: "lanternes-de-cendre.budgets-campagne",
    version: 1,
    genereLe: new Date().toISOString(),
    statut: erreurs.length === 0 ? "conforme" : "echec",
    configuration: {
      version: configuration.version,
      premiereSceneSecondes:
        configuration.limites.premiere_scene_secondes,
      imagesParSecondeCible:
        configuration.limites.images_par_seconde_cible,
      imagesParSecondeMinimales:
        configuration.limites.images_par_seconde_minimales,
    },
    transferts: {
      ...metriques,
      bundles: Object.fromEntries(
        Object.entries(octetsParBundle).map(([id, valeur]) => [
          id,
          metric(
            valeur,
            configuration.limites.bundle_regional_octets,
          ),
        ]),
      ),
      contenuPremiumOctets: Buffer.byteLength(CONTENU_PREMIUM_V1_JSON),
    },
    textures: {
      dimensions: Object.fromEntries(dimensions),
      activesParRegion: texturesActives,
      maximumActif: metriques.texturesActives,
    },
    qualite: {
      assetsInventories: inventaire.size,
      approuves,
      sousDerogation: nonApprouves.length,
      empreinteApprobations,
      traductions: ["fr", "en"],
      audio: {
        fichiers: 0,
        octets: 0,
        explication:
          "Aucune piste audio n’est référencée dans cette version de campagne.",
      },
    },
    avertissements,
    erreurs,
  } as const;
  const destination = resolve(
    racine,
    "artifacts/budgets/campagne.json",
  );
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${JSON.stringify(rapport, null, 2)}\n`);

  const afficherMio = (octets: number) => `${(octets / MIO).toFixed(2)} Mio`;
  console.log(
    [
      `Shell ${afficherMio(octetsDuShell)} / 4.00 Mio`,
      `Première scène ${afficherMio(octetsDePremiereScene)} / 12.00 Mio`,
      ...BUNDLES_REGIONAUX.map(
        (id) =>
          `Bundle ${id} ${afficherMio(octetsParBundle[id])} / 30.00 Mio`,
      ),
      `Cache complet ${afficherMio(octetsDuCacheComplet)} / 150.00 Mio`,
      `Textures actives max ${afficherMio(maximumTexturesActives)} / 256.00 Mio`,
      `Provenance ${approuves} approuvés, ${nonApprouves.length} sous dérogation`,
    ].join("\n"),
  );
  avertissements.forEach((message) => console.warn(`AVERTISSEMENT: ${message}`));
  if (erreurs.length > 0) {
    throw new Error(`Budgets de campagne non conformes:\n- ${erreurs.join("\n- ")}`);
  }
}

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  await verifierBudgets();
}

export { empreinteDesApprobations, verifierBudgets };
