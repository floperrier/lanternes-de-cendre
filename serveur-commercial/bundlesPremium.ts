import { NOMS_D_ASSETS_PREMIUM } from "./donneesPremium";

type BundleRegional = "bassins" | "trame" | "couronne" | "finale";

function determinerBundle(nom: string): BundleRegional {
  if (
    nom.startsWith("veille-basse-") ||
    nom.startsWith("haut-puits-") ||
    nom.startsWith("nacelles-") ||
    nom.startsWith("deversoir-")
  ) {
    return "bassins";
  }
  if (nom.startsWith("trame-")) {
    return "trame";
  }
  if (nom.startsWith("couronne-")) {
    return "couronne";
  }
  if (nom.startsWith("finale-") || nom.startsWith("epilogue-")) {
    return "finale";
  }
  throw new Error(`asset-premium-sans-bundle:${nom}`);
}

function lister(id: BundleRegional): readonly string[] {
  return NOMS_D_ASSETS_PREMIUM.filter(
    (nom) => determinerBundle(nom) === id,
  ).map((nom) => `/api/commercial/assets/${nom}`);
}

export const BUNDLES_PREMIUM: Readonly<
  Record<BundleRegional, readonly string[]>
> = {
  bassins: lister("bassins"),
  trame: lister("trame"),
  couronne: lister("couronne"),
  finale: lister("finale"),
};
