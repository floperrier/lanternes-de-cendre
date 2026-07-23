import { describe, expect, it } from "vitest";

import {
  creerControleurAccesPremium,
  type PortDuServiceCommercial,
  type PortDuStockageAccesPremium,
} from "./controleur";

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
} {
  const appels: string[] = [];
  let premium = false;
  return {
    appels,
    demanderLien: async (_email, intention) => {
      appels.push(`lien:${intention}`);
      return { jetonDeTest: "jeton-magique" };
    },
    verifierLien: async () => {
      appels.push("verifier");
      return {
        premium,
        identiteId: "usr_veilleuse",
        ...(premium ? { preuveLocale: "preuve-restauree" } : {}),
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
      return { version: 1 };
    },
  };
}

describe("contrôleur d’Accès premium", () => {
  it("débloque immédiatement après le webhook sans recréer la Campagne", async () => {
    const stockage = creerStockageMemoire();
    const service = creerPortCommercial();
    const controleur = creerControleurAccesPremium({ service, stockage });

    await controleur.demanderLien(EMAIL, "acheter");
    await controleur.verifierLienDeTest();
    await controleur.finaliserPaiementDeTest("accepte");

    expect(controleur.lireEtat()).toMatchObject({
      statut: "premium",
      identiteId: "usr_veilleuse",
      provenance: "verifiee",
    });
    expect(service.appels).toEqual([
      "lien:acheter",
      "verifier",
      "paiement",
      "issue:accepte",
      "contenu",
    ]);
  });

  it("conserve une preuve hors ligne sans email ni donnée de Campagne", async () => {
    const stockage = creerStockageMemoire();
    const service = creerPortCommercial();
    const controleur = creerControleurAccesPremium({ service, stockage });
    await controleur.demanderLien(EMAIL, "acheter");
    await controleur.verifierLienDeTest();
    await controleur.finaliserPaiementDeTest("accepte");

    const valeurPersistante = stockage.lireBrut();
    expect(valeurPersistante).not.toBeNull();
    expect(valeurPersistante).not.toContain(EMAIL);
    expect(valeurPersistante).not.toMatch(/campagne|graine|snapshot/i);

    const horsLigne = creerControleurAccesPremium({
      service: {
        ...service,
        lireAcces: async () => {
          throw new Error("hors ligne");
        },
      },
      stockage: creerStockageMemoire(valeurPersistante),
    });
    expect(horsLigne.lireEtat()).toMatchObject({
      statut: "premium",
      provenance: "hors-ligne",
    });
  });

  it("laisse la Démonstration verrouillée après un refus", async () => {
    const controleur = creerControleurAccesPremium({
      service: creerPortCommercial(),
      stockage: creerStockageMemoire(),
    });
    await controleur.demanderLien("refus@example.test", "acheter");
    await controleur.verifierLienDeTest();
    await controleur.finaliserPaiementDeTest("refuse");

    expect(controleur.lireEtat()).toMatchObject({
      statut: "erreur",
      code: "paiement-refuse",
    });
    expect(controleur.possedeAccesPremium()).toBe(false);
  });

  it("restaure un achat existant sans démarrer un nouveau paiement", async () => {
    const service = creerPortCommercial();
    await service.finaliserPaiementDeTest("txn_precedente", "accepte");
    const controleur = creerControleurAccesPremium({
      service,
      stockage: creerStockageMemoire(),
    });

    await controleur.demanderLien(EMAIL, "restaurer");
    await controleur.verifierLienDeTest();

    expect(controleur.lireEtat()).toMatchObject({
      statut: "premium",
      provenance: "verifiee",
    });
    expect(service.appels).not.toContain("paiement");
  });
});

const EMAIL = "veilleuse@example.test";
