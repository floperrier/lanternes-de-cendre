import catalogueGenere from "./catalogue.generated";
import {
  figerProfondement,
  type CatalogueDEvenements,
  type EvenementDuCatalogue,
} from "./types";

export const catalogueDEvenements = figerProfondement(
  catalogueGenere as CatalogueDEvenements,
);

export function trouverEvenement(
  id: string,
): EvenementDuCatalogue | undefined {
  return catalogueDEvenements.evenements.find((evenement) => evenement.id === id);
}
