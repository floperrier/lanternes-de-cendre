import { installerContenuPremiumNarratif } from "../content/catalogue";
import { installerPresentationsPremium } from "../content/presentationsPremium";
import { installerContenuPremiumDesRoutes } from "../simulation/routes";
import { installerBundlesPremium } from "../assets/catalogueBundles";

export function installerContenuPremiumComplet(valeur: unknown): void {
  installerContenuPremiumDesRoutes(valeur);
  installerContenuPremiumNarratif(valeur);
  installerPresentationsPremium(valeur);
  installerBundlesPremium(valeur);
}
