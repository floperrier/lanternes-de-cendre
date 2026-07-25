export type IntentionCommerciale = "acheter" | "restaurer";
export type IssueDePaiementDeTest = "accepte" | "refuse";

export interface AccesLuDuService {
  readonly premium: boolean;
  readonly identiteId: string;
  readonly preuveLocale?: string;
}

export interface ContenuCompletProtege {
  readonly version: number;
  readonly catalogue: unknown;
}

export interface PortDuServiceCommercial {
  readonly demanderLien: (
    email: string,
    intention: IntentionCommerciale,
  ) => Promise<{ readonly urlDeTest?: string }>;
  readonly ouvrirLien: (url: string) => void;
  readonly reprendreApresLien: () => Promise<{
    readonly intention: IntentionCommerciale;
    readonly acces: AccesLuDuService;
  } | null>;
  readonly demarrerPaiement: () => Promise<
    | { readonly mode: "test"; readonly transactionId: string }
    | {
        readonly mode: "paddle";
        readonly attendreConfirmation?: Promise<void>;
      }
  >;
  readonly finaliserPaiementDeTest: (
    transactionId: string,
    issue: IssueDePaiementDeTest,
  ) => Promise<void>;
  readonly lireAcces: () => Promise<AccesLuDuService>;
  readonly chargerContenuComplet: () => Promise<ContenuCompletProtege>;
}

export interface PortDuStockageAccesPremium {
  readonly lire: () => string | null;
  readonly enregistrer: (valeur: string) => void;
  readonly effacer: () => void;
}

export type EtatDuControleurAccesPremium =
  | { readonly statut: "verification-locale" }
  | { readonly statut: "demonstration" }
  | {
      readonly statut: "lien-envoye";
      readonly intention: IntentionCommerciale;
      readonly lienDeTestDisponible: boolean;
    }
  | {
      readonly statut: "paiement-test";
      readonly transactionId: string;
    }
  | { readonly statut: "attente-paiement" }
  | {
      readonly statut: "premium";
      readonly identiteId: string;
      readonly provenance: "hors-ligne" | "verifiee";
    }
  | {
      readonly statut: "erreur";
      readonly code:
        | "lien-invalide"
        | "acces-introuvable"
        | "paiement-refuse"
        | "preuve-invalide"
        | "service-indisponible";
      readonly explication: string;
    };

export interface ControleurAccesPremium {
  readonly lireEtat: () => EtatDuControleurAccesPremium;
  readonly sabonner: (ecouteur: () => void) => () => void;
  readonly possedeAccesPremium: () => boolean;
  readonly initialiser: () => Promise<void>;
  readonly demanderLien: (
    email: string,
    intention: IntentionCommerciale,
  ) => Promise<void>;
  readonly ouvrirLienDeTest: () => void;
  readonly finaliserPaiementDeTest: (
    issue: IssueDePaiementDeTest,
  ) => Promise<void>;
  readonly actualiserAcces: () => Promise<void>;
}

export interface OptionsDuControleurAccesPremium {
  readonly service: PortDuServiceCommercial;
  readonly stockage: PortDuStockageAccesPremium;
  readonly verifierPreuveLocale: (entree: {
    readonly recu: string;
    readonly identiteId: string;
    readonly contenu: ContenuCompletProtege;
  }) => Promise<boolean>;
  readonly installerContenuComplet: (
    contenu: ContenuCompletProtege,
  ) => void;
}

interface AccesPersistant {
  readonly version: 1;
  readonly identiteId: string;
  readonly preuveLocale: string;
  readonly contenu: ContenuCompletProtege;
}

function lireAccesPersistant(
  stockage: PortDuStockageAccesPremium,
): AccesPersistant | null {
  const brut = stockage.lire();
  if (brut === null) {
    return null;
  }
  try {
    const valeur = JSON.parse(brut) as Partial<AccesPersistant>;
    if (
      valeur.version === 1 &&
      typeof valeur.identiteId === "string" &&
      typeof valeur.preuveLocale === "string" &&
      typeof valeur.contenu === "object" &&
      valeur.contenu !== null
    ) {
      return valeur as AccesPersistant;
    }
  } catch {
    // Une preuve illisible ne doit jamais ouvrir le contenu.
  }
  stockage.effacer();
  return null;
}

function explicationDErreur(erreur: unknown): string {
  return erreur instanceof Error
    ? erreur.message
    : "Le service commercial est momentanément indisponible.";
}

export function creerControleurAccesPremium({
  service,
  stockage,
  verifierPreuveLocale,
  installerContenuComplet,
}: OptionsDuControleurAccesPremium): ControleurAccesPremium {
  const accesPersistant = lireAccesPersistant(stockage);
  let etat: EtatDuControleurAccesPremium =
    accesPersistant === null
      ? { statut: "demonstration" }
      : { statut: "verification-locale" };
  let urlDeTest: string | undefined;
  const ecouteurs = new Set<() => void>();

  const publier = (nouvelEtat: EtatDuControleurAccesPremium) => {
    etat = nouvelEtat;
    ecouteurs.forEach((ecouteur) => ecouteur());
  };

  const accorder = async (acces: AccesLuDuService) => {
    if (!acces.premium || acces.preuveLocale === undefined) {
      throw new Error("acces-premium-introuvable");
    }
    const contenu = await service.chargerContenuComplet();
    if (
      !(await verifierPreuveLocale({
        recu: acces.preuveLocale,
        identiteId: acces.identiteId,
        contenu,
      }))
    ) {
      throw new Error("preuve-premium-invalide");
    }
    installerContenuComplet(contenu);
    stockage.enregistrer(
      JSON.stringify({
        version: 1,
        identiteId: acces.identiteId,
        preuveLocale: acces.preuveLocale,
        contenu,
      } satisfies AccesPersistant),
    );
    publier({
      statut: "premium",
      identiteId: acces.identiteId,
      provenance: "verifiee",
    });
  };

  const actualiserAcces = async () => {
    try {
      const acces = await service.lireAcces();
      if (!acces.premium) {
        publier({
          statut: "erreur",
          code: "acces-introuvable",
          explication: "Aucun Accès premium n’est associé à ce compte.",
        });
        return;
      }
      await accorder(acces);
    } catch (erreur) {
      publier({
        statut: "erreur",
        code: "service-indisponible",
        explication: explicationDErreur(erreur),
      });
    }
  };

  const attendreDroitApresWebhook = async () => {
    for (let tentative = 0; tentative < 20; tentative += 1) {
      try {
        const acces = await service.lireAcces();
        if (acces.premium) {
          await accorder(acces);
          return;
        }
      } catch {
        // Le webhook et sa projection peuvent être momentanément décalés.
      }
      await new Promise((resoudre) => window.setTimeout(resoudre, 500));
    }
  };

  const commencerPaiement = async () => {
    const paiement = await service.demarrerPaiement();
    publier(
      paiement.mode === "test"
        ? {
            statut: "paiement-test",
            transactionId: paiement.transactionId,
          }
        : { statut: "attente-paiement" },
    );
    if (
      paiement.mode === "paddle" &&
      paiement.attendreConfirmation !== undefined
    ) {
      void paiement.attendreConfirmation.then(attendreDroitApresWebhook);
    }
  };

  return {
    lireEtat: () => etat,
    sabonner: (ecouteur) => {
      ecouteurs.add(ecouteur);
      return () => ecouteurs.delete(ecouteur);
    },
    possedeAccesPremium: () => etat.statut === "premium",
    initialiser: async () => {
      if (accesPersistant !== null) {
        const valide = await verifierPreuveLocale({
          recu: accesPersistant.preuveLocale,
          identiteId: accesPersistant.identiteId,
          contenu: accesPersistant.contenu,
        });
        if (valide) {
          try {
            installerContenuComplet(accesPersistant.contenu);
            publier({
              statut: "premium",
              identiteId: accesPersistant.identiteId,
              provenance: "hors-ligne",
            });
            return;
          } catch {
            // Un payload signé d’une ancienne version peut ne plus
            // satisfaire le schéma de contenu courant.
          }
        }
        stockage.effacer();
        publier({ statut: "demonstration" });
      }

      try {
        const retour = await service.reprendreApresLien();
        if (retour === null) {
          return;
        }
        if (retour.acces.premium) {
          await accorder(retour.acces);
        } else if (retour.intention === "acheter") {
          await commencerPaiement();
        } else {
          publier({
            statut: "erreur",
            code: "acces-introuvable",
            explication:
              "Aucun achat permanent n’est associé à ce compte.",
          });
        }
      } catch (erreur) {
        publier({
          statut: "erreur",
          code: "lien-invalide",
          explication: explicationDErreur(erreur),
        });
      }
    },
    demanderLien: async (email, intention) => {
      try {
        const resultat = await service.demanderLien(email, intention);
        urlDeTest = resultat.urlDeTest;
        publier({
          statut: "lien-envoye",
          intention,
          lienDeTestDisponible: urlDeTest !== undefined,
        });
      } catch (erreur) {
        publier({
          statut: "erreur",
          code: "service-indisponible",
          explication: explicationDErreur(erreur),
        });
      }
    },
    ouvrirLienDeTest: () => {
      if (urlDeTest === undefined) {
        publier({
          statut: "erreur",
          code: "lien-invalide",
          explication: "Le lien de connexion est absent ou a expiré.",
        });
        return;
      }
      service.ouvrirLien(urlDeTest);
    },
    finaliserPaiementDeTest: async (issue) => {
      if (etat.statut !== "paiement-test") {
        return;
      }
      const transactionId = etat.transactionId;
      try {
        await service.finaliserPaiementDeTest(transactionId, issue);
        if (issue === "refuse") {
          publier({
            statut: "erreur",
            code: "paiement-refuse",
            explication:
              "Le paiement a été refusé. Aucun débit ni Accès premium n’a été créé.",
          });
          return;
        }
        await accorder(await service.lireAcces());
      } catch (erreur) {
        publier({
          statut: "erreur",
          code: "service-indisponible",
          explication: explicationDErreur(erreur),
        });
      }
    },
    actualiserAcces,
  };
}
