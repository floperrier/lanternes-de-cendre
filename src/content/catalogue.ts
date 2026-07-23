import catalogueGenere from "./catalogue.generated";
import {
  figerProfondement,
  type CatalogueDEvenements,
  type ConseilDuCatalogue,
  type EvenementDuCatalogue,
  type Langue,
  type TextesDInstallation,
} from "./types";

export let catalogueDEvenements = figerProfondement(
  catalogueGenere as CatalogueDEvenements,
);
const IDS_D_EVENEMENTS_DE_BASE = new Set(
  catalogueGenere.evenements.map(({ id }) => id as string),
);
const IDS_DE_CONSEILS_DE_BASE = new Set(
  catalogueGenere.conseils.map(({ id }) => id as string),
);

export type EvenementStructurel = Pick<
  EvenementDuCatalogue,
  | "id"
  | "fenetre"
  | "conditions"
  | "periodeEligibilite"
  | "priorite"
  | "acteurs"
  | "choix"
>;

export interface ContenuPremiumNarratif {
  readonly version: 1;
  readonly catalogue: {
    readonly evenements: readonly EvenementDuCatalogue[];
    readonly conseils: readonly ConseilDuCatalogue[];
    readonly libellesTransversaux: Readonly<
      Record<
        Langue,
        {
          readonly journal: CatalogueDEvenements["libellesTransversaux"][Langue]["journal"];
        }
      >
    >;
  };
}

export function installerContenuPremiumNarratif(
  valeur: unknown,
): ContenuPremiumNarratif {
  const contenu = valeur as Partial<ContenuPremiumNarratif>;
  const catalogue = contenu.catalogue;
  if (
    contenu.version !== 1 ||
    catalogue === undefined ||
    !Array.isArray(catalogue.evenements) ||
    (catalogue.conseils !== undefined &&
      !Array.isArray(catalogue.conseils)) ||
    catalogue.libellesTransversaux === undefined ||
    !["fr", "en"].every((langue) => {
      const journal =
        catalogue.libellesTransversaux?.[langue as Langue]?.journal;
      return (
        journal !== undefined &&
        ["titres", "causes", "acteurs", "cibles"].every((champ) => {
          const dictionnaire =
            journal[champ as keyof typeof journal];
          return (
            dictionnaire !== null &&
            typeof dictionnaire === "object" &&
            Object.values(dictionnaire).every(
              (libelle) => typeof libelle === "string",
            )
          );
        })
      );
    }) ||
    catalogue.evenements.some(
      (evenement) =>
        evenement === null ||
        typeof evenement !== "object" ||
        typeof evenement.id !== "string" ||
        evenement.id.length === 0,
    ) ||
    (catalogue.conseils ?? []).some(
      (conseil) =>
        conseil === null ||
        typeof conseil !== "object" ||
        typeof conseil.id !== "string" ||
        conseil.id.length === 0,
    )
  ) {
    throw new Error("contenu-premium-narratif-invalide");
  }

  const evenementsPremium =
    catalogue.evenements as readonly EvenementDuCatalogue[];
  const idsPremium = new Set(evenementsPremium.map(({ id }) => id));
  const conseilsPremium =
    (catalogue.conseils ?? []) as readonly ConseilDuCatalogue[];
  const idsDeConseilsPremium = new Set(
    conseilsPremium.map(({ id }) => id),
  );
  if (
    idsPremium.size !== evenementsPremium.length ||
    [...idsPremium].some((id) => IDS_D_EVENEMENTS_DE_BASE.has(id)) ||
    idsDeConseilsPremium.size !== conseilsPremium.length ||
    [...idsDeConseilsPremium].some((id) =>
      IDS_DE_CONSEILS_DE_BASE.has(id)
    )
  ) {
    throw new Error("contenu-premium-narratif-duplique");
  }

  const fusionnerJournal = (langue: Langue) => {
    const base = catalogueDEvenements.libellesTransversaux[langue];
    const premium = catalogue.libellesTransversaux![langue]!.journal;
    return {
      ...base,
      journal: {
        titres: { ...base.journal.titres, ...premium.titres },
        causes: { ...base.journal.causes, ...premium.causes },
        acteurs: { ...base.journal.acteurs, ...premium.acteurs },
        cibles: { ...base.journal.cibles, ...premium.cibles },
      },
    };
  };

  catalogueDEvenements = figerProfondement({
    ...catalogueDEvenements,
    evenements: [
      ...catalogueDEvenements.evenements.filter(
        ({ id }) => !idsPremium.has(id),
      ),
      ...evenementsPremium,
    ],
    conseils: [
      ...catalogueDEvenements.conseils.filter(
        ({ id }) => !idsDeConseilsPremium.has(id),
      ),
      ...conseilsPremium,
    ],
    libellesTransversaux: {
      fr: fusionnerJournal("fr"),
      en: fusionnerJournal("en"),
    },
  });
  return contenu as ContenuPremiumNarratif;
}

export function trouverEvenement(
  id: string,
): EvenementDuCatalogue | undefined {
  return catalogueDEvenements.evenements.find((evenement) => evenement.id === id);
}

export function executerAvecEvenementsStructurelsTemporaires<T>(
  evenements: readonly EvenementStructurel[],
  action: () => T,
): T {
  const catalogueInitial = catalogueDEvenements;
  const ids = new Set(evenements.map(({ id }) => id));
  catalogueDEvenements = figerProfondement({
    ...catalogueInitial,
    evenements: [
      ...catalogueInitial.evenements.filter(({ id }) => !ids.has(id)),
      ...evenements,
    ] as unknown as readonly EvenementDuCatalogue[],
  });
  try {
    return action();
  } finally {
    catalogueDEvenements = catalogueInitial;
  }
}

export function trouverTextesDInstallation(
  id: string,
  langue: Langue,
): TextesDInstallation | undefined {
  return catalogueDEvenements.installations.find(
    (installation) => installation.id === id,
  )?.textes[langue];
}

export function trouverConseil(id: string): ConseilDuCatalogue | undefined {
  return catalogueDEvenements.conseils.find((conseil) => conseil.id === id);
}
