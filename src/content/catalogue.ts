import catalogueGenere from "./catalogue.generated";
import {
  figerProfondement,
  type CatalogueDEvenements,
  type EvenementDuCatalogue,
  type Langue,
  type TextesDInstallation,
} from "./types";

export const catalogueDEvenements = figerProfondement(
  catalogueGenere as CatalogueDEvenements,
);

export function trouverEvenement(
  id: string,
): EvenementDuCatalogue | undefined {
  return catalogueDEvenements.evenements.find((evenement) => evenement.id === id);
}

export function trouverTextesDInstallation(
  id: string,
  langue: Langue,
): TextesDInstallation | undefined {
  return catalogueDEvenements.installations.find(
    (installation) => installation.id === id,
  )?.textes[langue];
}
