import type { IdentifiantDeLieu } from "../simulation/routes";

export const IDENTIFIANTS_DE_BUNDLES = [
  "commun",
  "bassins",
  "trame",
  "couronne",
  "finale",
  "a-la-demande",
] as const;

export type IdentifiantDeBundle =
  (typeof IDENTIFIANTS_DE_BUNDLES)[number];
export type IdentifiantDeBundleRegional = Exclude<
  IdentifiantDeBundle,
  "commun" | "a-la-demande"
>;

export const BUNDLES_PUBLICS = {
  commun: [
    "/assets/cite-caravane.png",
    "/assets/ui/atlas-bassins-fendus.webp",
    "/assets/ui/ilyana-voss.webp",
    "/assets/ui/lanterne.svg",
    "/assets/ui/metal-cendre.webp",
    "/assets/sprites/cite.fumee-01.json",
    "/assets/sprites/cite.fumee-01.png",
  ],
  bassins: ["/assets/bassins-haut-puits.webp"],
  trame: [],
  couronne: [],
  finale: [],
  "a-la-demande": [
    "/assets/prologue-reponse-du-phare.webp",
    "/assets/prologue-filtres-de-la-veille.webp",
    "/assets/prologue-ilyana-au-clapet.webp",
  ],
} as const satisfies Readonly<
  Record<IdentifiantDeBundle, readonly string[]>
>;

export interface ContenuPremiumDesBundles {
  readonly version: 1;
  readonly catalogue: {
    readonly bundles?: Partial<
      Readonly<Record<IdentifiantDeBundleRegional, readonly string[]>>
    >;
  };
}

let bundlesPremium: Readonly<
  Partial<Record<IdentifiantDeBundleRegional, readonly string[]>>
> = {};

function estUnBundleRegional(
  valeur: string,
): valeur is IdentifiantDeBundleRegional {
  return (
    valeur === "bassins" ||
    valeur === "trame" ||
    valeur === "couronne" ||
    valeur === "finale"
  );
}

export function installerBundlesPremium(valeur: unknown): void {
  const contenu = valeur as Partial<ContenuPremiumDesBundles>;
  const bundles = contenu.catalogue?.bundles;
  if (bundles === undefined) {
    bundlesPremium = {};
    return;
  }
  const entrees = Object.entries(bundles);
  if (
    contenu.version !== 1 ||
    entrees.some(
      ([id, assets]) =>
        !estUnBundleRegional(id) ||
        !Array.isArray(assets) ||
        assets.some(
          (asset) =>
            typeof asset !== "string" ||
            !asset.startsWith("/api/commercial/assets/") ||
            asset.includes(".."),
        ),
    )
  ) {
    throw new Error("bundles-premium-invalides");
  }
  const assets = entrees.flatMap(([, membres]) => membres ?? []);
  if (new Set(assets).size !== assets.length) {
    throw new Error("asset-premium-dans-plusieurs-bundles");
  }
  bundlesPremium = Object.fromEntries(
    entrees.map(([id, membres]) => [id, [...(membres ?? [])]]),
  );
}

const LIEUX_DES_BASSINS: ReadonlySet<IdentifiantDeLieu> = new Set([
  "halte-du-puits-sec",
  "haut-puits",
  "veille-basse",
  "hospice-du-sillon",
  "les-vanniers",
  "relais-des-vannes",
  "deversoir-noir",
]);
const LIEUX_DE_LA_TRAME: ReadonlySet<IdentifiantDeLieu> = new Set([
  "lisiere-trame-de-fer",
  "barriere-neuve",
  "grand-aiguillage",
  "pompe-neuve",
  "traverse-libre",
  "marche-des-traverses",
  "signal-zero",
  "aiguillage-zero",
]);
const LIEUX_DE_LA_COURONNE: ReadonlySet<IdentifiantDeLieu> = new Set([
  "couronne-muette",
  "tete-de-ligne",
  "veille-des-trois",
  "serres-de-verre",
  "seuil",
  "anneau-interieur",
]);

export function determinerBundleRegional(
  position: IdentifiantDeLieu,
): IdentifiantDeBundleRegional {
  if (LIEUX_DES_BASSINS.has(position)) {
    return "bassins";
  }
  if (LIEUX_DE_LA_TRAME.has(position)) {
    return "trame";
  }
  if (LIEUX_DE_LA_COURONNE.has(position)) {
    return "couronne";
  }
  return "finale";
}

export function listerAssetsDuBundle(
  id: IdentifiantDeBundle,
): readonly string[] {
  if (id === "commun" || id === "a-la-demande") {
    return BUNDLES_PUBLICS[id];
  }
  return [...BUNDLES_PUBLICS[id], ...(bundlesPremium[id] ?? [])];
}
