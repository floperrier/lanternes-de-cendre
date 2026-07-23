export type IntentionCommerciale = "acheter" | "restaurer";
export type IssueDePaiementDeTest = "accepte" | "refuse";

export interface AccesLuDuService {
  readonly premium: boolean;
  readonly identiteId: string;
  readonly preuveLocale?: string;
}

export interface PortDuServiceCommercial {
  readonly demanderLien: (
    email: string,
    intention: IntentionCommerciale,
  ) => Promise<{ readonly jetonDeTest?: string }>;
  readonly verifierLien: (jeton: string) => Promise<AccesLuDuService>;
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
  readonly chargerContenuComplet: () => Promise<{
    readonly version: number;
  }>;
}

export interface PortDuStockageAccesPremium {
  readonly lire: () => string | null;
  readonly enregistrer: (valeur: string) => void;
  readonly effacer: () => void;
}

export type EtatDuControleurAccesPremium =
  | { readonly statut: "demonstration" }
  | {
      readonly statut: "lien-envoye";
      readonly intention: IntentionCommerciale;
      readonly jetonDeTestDisponible: boolean;
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
        | "service-indisponible";
      readonly explication: string;
    };

export interface ControleurAccesPremium {
  readonly lireEtat: () => EtatDuControleurAccesPremium;
  readonly sabonner: (ecouteur: () => void) => () => void;
  readonly possedeAccesPremium: () => boolean;
  readonly demanderLien: (
    email: string,
    intention: IntentionCommerciale,
  ) => Promise<void>;
  readonly verifierLienDeTest: () => Promise<void>;
  readonly finaliserPaiementDeTest: (
    issue: IssueDePaiementDeTest,
  ) => Promise<void>;
  readonly actualiserAcces: () => Promise<void>;
}

export interface OptionsDuControleurAccesPremium {
  readonly service: PortDuServiceCommercial;
  readonly stockage: PortDuStockageAccesPremium;
}

interface AccesPersistant {
  readonly version: 1;
  readonly identiteId: string;
  readonly preuveLocale: string;
  readonly versionDuContenu: number;
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
      Number.isSafeInteger(valeur.versionDuContenu)
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
}: OptionsDuControleurAccesPremium): ControleurAccesPremium {
  const accesPersistant = lireAccesPersistant(stockage);
  let etat: EtatDuControleurAccesPremium =
    accesPersistant === null
      ? { statut: "demonstration" }
      : {
          statut: "premium",
          identiteId: accesPersistant.identiteId,
          provenance: "hors-ligne",
        };
  let jetonDeTest: string | undefined;
  let intentionCourante: IntentionCommerciale | undefined;
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
    stockage.enregistrer(
      JSON.stringify({
        version: 1,
        identiteId: acces.identiteId,
        preuveLocale: acces.preuveLocale,
        versionDuContenu: contenu.version,
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

  return {
    lireEtat: () => etat,
    sabonner: (ecouteur) => {
      ecouteurs.add(ecouteur);
      return () => ecouteurs.delete(ecouteur);
    },
    possedeAccesPremium: () => etat.statut === "premium",
    demanderLien: async (email, intention) => {
      try {
        const resultat = await service.demanderLien(email, intention);
        intentionCourante = intention;
        jetonDeTest = resultat.jetonDeTest;
        publier({
          statut: "lien-envoye",
          intention,
          jetonDeTestDisponible: jetonDeTest !== undefined,
        });
      } catch (erreur) {
        publier({
          statut: "erreur",
          code: "service-indisponible",
          explication: explicationDErreur(erreur),
        });
      }
    },
    verifierLienDeTest: async () => {
      if (jetonDeTest === undefined || intentionCourante === undefined) {
        publier({
          statut: "erreur",
          code: "lien-invalide",
          explication: "Le lien de connexion est absent ou a expiré.",
        });
        return;
      }
      try {
        const acces = await service.verifierLien(jetonDeTest);
        jetonDeTest = undefined;
        if (acces.premium) {
          await accorder(acces);
          return;
        }
        if (intentionCourante === "restaurer") {
          publier({
            statut: "erreur",
            code: "acces-introuvable",
            explication: "Aucun achat permanent n’est associé à ce compte.",
          });
          return;
        }
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
          void paiement.attendreConfirmation.then(
            attendreDroitApresWebhook,
          );
        }
      } catch (erreur) {
        publier({
          statut: "erreur",
          code: "lien-invalide",
          explication: explicationDErreur(erreur),
        });
      }
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
