import { describe, expect, it } from "vitest";

import {
  creerControleurAccesPremium,
  type IntentionCommerciale,
  type PortDuServiceCommercial,
  type PortDuStockageAccesPremium,
} from "./controleur";

const EMAIL = "veilleuse@example.test";
const CONTENU = { version: 1, catalogue: { routes: ["protegee"] } };

function creerStockageMemoire(
  initiale: string | null = null,
): PortDuStockageAccesPremium & { lireBrut: () => string | null } {
  let valeur = initiale;
  return {
    lire: () => valeur,
    enregistrer: (nouvelleValeur) => {
      valeur = nouvelleValeur;
    },
    effacer: () => {
      valeur = null;
    },
    lireBrut: () => valeur,
  };
}

function creerPortCommercial(): PortDuServiceCommercial & {
  readonly appels: string[];
  readonly definirRetour: (intention: IntentionCommerciale) => void;
  readonly accorder: () => void;
} {
  const appels: string[] = [];
  let premium = false;
  let retour: IntentionCommerciale | null = null;
  return {
    appels,
    definirRetour: (intention) => {
      retour = intention;
    },
    accorder: () => {
      premium = true;
    },
    demanderLien: async (_email, intention) => {
      appels.push(`lien:${intention}`);
      return { urlDeTest: "https://auth.test/lien" };
    },
    ouvrirLien: () => {
      appels.push("ouvrir-lien");
    },
    reprendreApresLien: async () => {
      appels.push("reprendre-identite");
      if (retour === null) {
        return null;
      }
      const intention = retour;
      retour = null;
      return {
        intention,
        acces: {
          premium,
          identiteId: "usr_veilleuse",
          ...(premium ? { preuveLocale: "preuve-achat" } : {}),
        },
      };
    },
    demarrerPaiement: async () => {
      appels.push("paiement");
      return { mode: "test", transactionId: "txn_achat" };
    },
    finaliserPaiementDeTest: async (_transactionId, issue) => {
      appels.push(`issue:${issue}`);
      premium = issue === "accepte";
    },
    lireAcces: async () => ({
      premium,
      identiteId: "usr_veilleuse",
      ...(premium ? { preuveLocale: "preuve-achat" } : {}),
    }),
    chargerContenuComplet: async () => {
      appels.push("contenu");
      return CONTENU;
    },
  };
}

function creerControleur(
  service: ReturnType<typeof creerPortCommercial>,
  stockage = creerStockageMemoire(),
) {
  const contenusInstalles: unknown[] = [];
  return {
    controleur: creerControleurAccesPremium({
      service,
      stockage,
      verifierPreuveLocale: async ({ recu, contenu }) =>
        recu === "preuve-achat" &&
        JSON.stringify(contenu) === JSON.stringify(CONTENU),
      installerContenuComplet: (contenu) => {
        contenusInstalles.push(contenu);
      },
    }),
    stockage,
    contenusInstalles,
  };
}

describe("contrôleur d’Accès premium", () => {
  it("débloque après le retour du magic link et le webhook", async () => {
    const service = creerPortCommercial();
    const premierePage = creerControleur(service);
    await premierePage.controleur.demanderLien(EMAIL, "acheter");
    premierePage.controleur.ouvrirLienDeTest();
    service.definirRetour("acheter");

    const retourDuLien = creerControleur(service, premierePage.stockage);
    await retourDuLien.controleur.initialiser();
    await retourDuLien.controleur.finaliserPaiementDeTest("accepte");

    expect(retourDuLien.controleur.lireEtat()).toMatchObject({
      statut: "premium",
      identiteId: "usr_veilleuse",
      provenance: "verifiee",
    });
    expect(retourDuLien.contenusInstalles).toEqual([CONTENU]);
    expect(service.appels).toEqual([
      "lien:acheter",
      "ouvrir-lien",
      "reprendre-identite",
      "paiement",
      "issue:accepte",
      "contenu",
    ]);
  });

  it("conserve un reçu et son contenu hors ligne sans email ni Campagne", async () => {
    const service = creerPortCommercial();
    service.accorder();
    service.definirRetour("restaurer");
    const enLigne = creerControleur(service);
    await enLigne.controleur.initialiser();

    const valeurPersistante = enLigne.stockage.lireBrut();
    expect(valeurPersistante).not.toBeNull();
    expect(valeurPersistante).not.toContain(EMAIL);
    expect(valeurPersistante).not.toMatch(/campagne|graine|snapshot/i);

    const horsLigne = creerControleur(
      service,
      creerStockageMemoire(valeurPersistante),
    );
    await horsLigne.controleur.initialiser();
    expect(horsLigne.controleur.lireEtat()).toMatchObject({
      statut: "premium",
      provenance: "hors-ligne",
    });
    expect(horsLigne.contenusInstalles).toEqual([CONTENU]);
  });

  it("rejette et efface un reçu local forgé", async () => {
    const service = creerPortCommercial();
    const stockage = creerStockageMemoire(
      JSON.stringify({
        version: 1,
        identiteId: "usr_forge",
        preuveLocale: "preuve-forgee",
        contenu: CONTENU,
      }),
    );
    const { controleur } = creerControleur(service, stockage);

    await controleur.initialiser();

    expect(controleur.possedeAccesPremium()).toBe(false);
    expect(controleur.lireEtat()).toEqual({ statut: "demonstration" });
    expect(stockage.lireBrut()).toBeNull();
  });

  it("invalide sans planter un ancien contenu signé devenu incompatible", async () => {
    const service = creerPortCommercial();
    const stockage = creerStockageMemoire(
      JSON.stringify({
        version: 1,
        identiteId: "usr_historique",
        preuveLocale: "preuve-achat",
        contenu: CONTENU,
      }),
    );
    const controleur = creerControleurAccesPremium({
      service,
      stockage,
      verifierPreuveLocale: async () => true,
      installerContenuComplet: () => {
        throw new Error("presentations-premium-invalides");
      },
    });

    await expect(controleur.initialiser()).resolves.toBeUndefined();

    expect(controleur.lireEtat()).toEqual({ statut: "demonstration" });
    expect(stockage.lireBrut()).toBeNull();
  });

  it("laisse la Démonstration verrouillée après un refus", async () => {
    const service = creerPortCommercial();
    service.definirRetour("acheter");
    const { controleur } = creerControleur(service);
    await controleur.initialiser();
    await controleur.finaliserPaiementDeTest("refuse");

    expect(controleur.lireEtat()).toMatchObject({
      statut: "erreur",
      code: "paiement-refuse",
    });
    expect(controleur.possedeAccesPremium()).toBe(false);
  });

  it("restaure un achat existant sans démarrer un nouveau paiement", async () => {
    const service = creerPortCommercial();
    service.accorder();
    service.definirRetour("restaurer");
    const { controleur } = creerControleur(service);

    await controleur.initialiser();

    expect(controleur.lireEtat()).toMatchObject({
      statut: "premium",
      provenance: "verifiee",
    });
    expect(service.appels).not.toContain("paiement");
  });
});
