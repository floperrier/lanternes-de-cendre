import { describe, expect, it, vi } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";
import { VERSION_SIMULATION_AVANT_NACELLES } from "../simulation/versions";
import { creerEtatInitialDeLaTrameDeFer } from "../simulation/trameFer";
import { creerEtatInitialDeTraverseLibre } from "../simulation/traverseLibre";
import { importerSauvegarde } from "./portable";
import { lireEtatCourant } from "./validation";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_NACELLES,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

function sansRouteBasse(etat: EtatCampagne) {
  const { trameDeFer, traverseLibre, ...sansTrame } = etat;
  void trameDeFer;
  void traverseLibre;
  const {
    "nacelles-de-veille-basse": routeBasse,
    "chemin-de-l-hospice": cheminDeLHospice,
    "chenal-de-l-hospice": chenalDeLHospice,
    "conduite-du-deversoir": routeDuDeversoir,
    "passage-de-la-ligne-zero": passageRegional,
    "piste-des-levees": pisteDesLevees,
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    ...etatsReelsV6
  } = sansTrame.routes.etatsReels;
  void routeBasse;
  void cheminDeLHospice;
  void chenalDeLHospice;
  void routeDuDeversoir;
  void passageRegional;
  void pisteDesLevees;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  return {
    ...sansTrame,
    version: VERSION_SIMULATION_AVANT_NACELLES,
    routes: { ...sansTrame.routes, etatsReels: etatsReelsV6 },
  };
}

function creerArchiveV6() {
  const snapshot = sansRouteBasse(
    creerCampagneInitiale("CENDRE-MIGRATION-V6"),
  );
  const commande = {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  } as const;
  const etatApres = sansRouteBasse(
    appliquerCommande(
      {
        ...snapshot,
        version: VERSIONS_DU_SNAPSHOT_COURANT.simulation,
        trameDeFer: creerEtatInitialDeLaTrameDeFer(),
        traverseLibre: creerEtatInitialDeTraverseLibre(),
      },
      commande,
    ).etat,
  );
  return {
    format: FORMAT_SAUVEGARDE,
    id: "archive-v6",
    version: VERSION_SAUVEGARDE_AVANT_NACELLES,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_NACELLES,
    },
    graine: etatApres.graine,
    horloge: { secondes: etatApres.tempsDuConvoi.secondes },
    etat: etatApres,
    reproduction: {
      snapshot,
      empreinteSnapshot: empreinteEtat(
        snapshot as unknown as EtatCampagne,
      ),
      commandes: [
        {
          sequence: 0,
          commande,
          empreinteApres: empreinteEtat(
            etatApres as unknown as EtatCampagne,
          ),
        },
      ],
    },
    empreinte: empreinteEtat(etatApres as unknown as EtatCampagne),
  };
}

function atteindreLesVanniers(): EtatCampagne {
  let etat = appliquerCommande(
    creerCampagneInitiale("CENDRE-MIGRATION-NACELLES"),
    { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
  ).etat;
  const prologue = [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const;
  for (const [evenementId, choixId] of prologue) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: evenementId === "prologue.ilyana-au-clapet" ? 0 : 1,
    }).etat;
  }
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "digue-des-puits",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 90,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId: "bassins-fendus.eau-de-haut-puits",
    choixId: "promettre-partage",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 1,
  }).etat;
  const halte = [
    ["bassins.haut-puits.pacte-des-citernes", "ouvrir-citerne"],
    ["bassins.haut-puits.vanniers-du-panache", "confiner-boues"],
    ["bassins.haut-puits.boues-du-decanteur", "consigner-decanteur"],
    ["bassins.haut-puits.ilyana-et-la-vanne", "lui-confier-registre"],
  ] as const;
  for (const [evenementId, choixId] of halte) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 1,
    }).etat;
  }
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "chemin-des-vanniers",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 105,
  }).etat;
}

function creerArchiveV6ApresLeChenal() {
  const snapshot = sansRouteBasse(atteindreLesVanniers());
  const commandes: CommandeCampagne[] = [
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chenal-des-vannes",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 75 },
  ];
  let etat = snapshot;
  const reproduction = [];
  for (const [sequence, commande] of commandes.entries()) {
    const avant = {
      ...etat,
      version: VERSIONS_DU_SNAPSHOT_COURANT.simulation,
    } as EtatCampagne;
    let apres = appliquerCommande(avant, commande, {
      coutsDesNacelles: "historiques-v6",
    }).etat;
    if (
      avant.narration.evenementActif === null &&
      apres.narration.evenementActif?.startsWith("bassins.nacelles.") ===
        true
    ) {
      apres = {
        ...apres,
        narration: { ...apres.narration, evenementActif: null },
      };
    }
    etat = sansRouteBasse(apres);
    reproduction.push({
      sequence,
      commande,
      empreinteApres: empreinteEtat(etat as unknown as EtatCampagne),
    });
  }
  const archive = {
    format: FORMAT_SAUVEGARDE,
    id: "archive-v6-apres-chenal",
    version: VERSION_SAUVEGARDE_AVANT_NACELLES,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_NACELLES,
    },
    graine: etat.graine,
    horloge: { secondes: etat.tempsDuConvoi.secondes },
    etat,
    reproduction: {
      snapshot,
      empreinteSnapshot: empreinteEtat(
        snapshot as unknown as EtatCampagne,
      ),
      commandes: reproduction,
    },
    empreinte: empreinteEtat(etat as unknown as EtatCampagne),
  };
  return archive;
}

describe("migration v6 vers la liaison des Nacelles", () => {
  it("rejette un coût persisté atteignable ailleurs mais faux dans son contexte causal", () => {
    const engagement = appliquerCommande(atteindreLesVanniers(), {
      type: "engagement-de-route.confirmer",
      tronconId: "chenal-des-vannes",
    }).etat;
    expect(engagement.routes.engagements.at(-1)?.consommationsAppliquees)
      .toEqual({ combustible: 4, eau: 6 });
    expect(lireEtatCourant(engagement)).toEqual(engagement);

    const falsifie: EtatCampagne = {
      ...engagement,
      routes: {
        ...engagement.routes,
        engagements: engagement.routes.engagements.map(
          (candidat, index) =>
            index === engagement.routes.engagements.length - 1
              ? {
                  ...candidat,
                  consommationsAppliquees: {
                    combustible: 5,
                    eau: 6,
                  },
                }
              : candidat,
        ),
      },
      pilotage: {
        ...engagement.pilotage,
        economie: {
          ...engagement.pilotage.economie,
          stocks: {
            ...engagement.pilotage.economie.stocks,
            combustible: {
              ...engagement.pilotage.economie.stocks.combustible,
              quantite:
                engagement.pilotage.economie.stocks.combustible.quantite -
                1,
            },
          },
        },
      },
    };

    expect(lireEtatCourant(falsifie)).toBeUndefined();
  });

  it("rejoue l’archive puis ajoute la branche basse sans altérer la progression", () => {
    const resultat = importerSauvegarde(
      `${JSON.stringify(creerArchiveV6())}\n`,
    );

    expect(resultat.statut).toBe("migree");
    if (resultat.statut !== "migree") {
      return;
    }
    expect(resultat.sauvegarde.version).toBe(
      VERSION_SAUVEGARDE_COURANTE,
    );
    expect(resultat.sauvegarde.etat.version).toBe(
      VERSIONS_DU_SNAPSHOT_COURANT.simulation,
    );
    expect(
      resultat.sauvegarde.etat.routes.etatsReels[
        "nacelles-de-veille-basse"
      ],
    ).toBe("degrade");
    expect(resultat.sauvegarde.etat.narration.evenementActif).toBe(
      "prologue.signaux-sous-la-cendre",
    );
    expect(resultat.sauvegarde.reproduction.commandes).toEqual([]);
  });

  it("refuse une empreinte de replay v6 forgée", () => {
    const archive = creerArchiveV6();
    archive.reproduction.commandes[0]!.empreinteApres = "00000000";

    expect(
      importerSauvegarde(`${JSON.stringify(archive)}\n`),
    ).toMatchObject({
      statut: "invalide",
      explication: "La sauvegarde v6 est incomplète ou incohérente.",
    });
  });

  it("préserve le coût historique d’un chenal déjà traversé et rend la v7 réimportable", () => {
    const resultat = importerSauvegarde(
      `${JSON.stringify(creerArchiveV6ApresLeChenal())}\n`,
    );

    expect(resultat.statut).toBe("migree");
    if (resultat.statut !== "migree") {
      return;
    }
    expect(
      resultat.sauvegarde.etat.routes.etatsReels,
    ).not.toHaveProperty("nacelles-de-veille-basse");
    expect(resultat.sauvegarde.etat.routes.position).toBe(
      "relais-des-vannes",
    );
    expect(
      importerSauvegarde(`${JSON.stringify(resultat.sauvegarde)}\n`),
    ).toMatchObject({ statut: "compatible" });
  });

  it("rejoue Haut-Puits et le chenal sans charger le catalogue premium", async () => {
    const archive = creerArchiveV6ApresLeChenal();
    const archiveAvantLeChenal = creerArchiveV6();

    vi.resetModules();
    const catalogue = await import("../content/catalogue");
    const routes = await import("../simulation/routes");
    const { importerSauvegarde: importerSansPremium } =
      await import("./portable");

    expect(
      catalogue.catalogueDEvenements.evenements.some(({ id }) =>
        id.startsWith("bassins.haut-puits."),
      ),
    ).toBe(false);
    expect(
      routes.TRONCONS_DE_ROUTE.some(
        ({ id }) => id === "chenal-des-vannes",
      ),
    ).toBe(false);

    const resultat = importerSansPremium(`${JSON.stringify(archive)}\n`);
    const resultatAvantLeChenal = importerSansPremium(
      `${JSON.stringify(archiveAvantLeChenal)}\n`,
    );

    expect(resultat).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: VERSION_SAUVEGARDE_COURANTE,
        etat: {
          version: VERSIONS_DU_SNAPSHOT_COURANT.simulation,
          routes: { position: "relais-des-vannes" },
          narration: {
            evenementsJoues: expect.arrayContaining([
              "bassins.haut-puits.ilyana-et-la-vanne",
            ]),
          },
        },
      },
    });
    expect(resultatAvantLeChenal).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: {
          routes: {
            etatsReels: {
              "nacelles-de-veille-basse": "degrade",
            },
          },
        },
      },
    });
    expect(
      catalogue.catalogueDEvenements.evenements.some(({ id }) =>
        id.startsWith("bassins.haut-puits."),
      ),
    ).toBe(false);
    expect(
      routes.TRONCONS_DE_ROUTE.some(
        ({ id }) => id === "chenal-des-vannes",
      ),
    ).toBe(false);
  });
});
