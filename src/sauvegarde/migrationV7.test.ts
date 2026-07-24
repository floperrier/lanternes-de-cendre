import { describe, expect, it, vi } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { executerAvecTronconsTemporaires } from "../simulation/routes";
import { VERSION_SIMULATION_AVANT_DEVERSOIR } from "../simulation/versions";
import { TRONCONS_HISTORIQUES_V6 } from "./catalogueHistoriqueV6";
import { promouvoirEtatV7VersCourant } from "./migration";
import { importerSauvegarde } from "./portable";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
} from "./sauvegarde";
import {
  lireEtatCourant,
  type EtatCampagneV7,
} from "./validation";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

function normaliserEnV7(etat: EtatCampagne): Record<string, unknown> {
  const historique = structuredClone(etat) as unknown as {
    version: number;
    devenirsDesSites?: unknown;
    trameDeFer?: unknown;
    traverseLibre?: unknown;
    narration: { causaliteHistorique?: unknown };
    hautPuits: { projetRegional?: unknown };
    veilleBasse: {
      cohorte: { orientationRegionale?: unknown };
    };
    routes: {
      topologieHistorique?: unknown;
      etatsReels: Record<string, unknown>;
    };
  };
  historique.version = VERSION_SIMULATION_AVANT_DEVERSOIR;
  delete historique.devenirsDesSites;
  delete historique.trameDeFer;
  delete historique.traverseLibre;
  delete historique.routes.etatsReels["embranchement-de-pompe-neuve"];
  delete historique.routes.etatsReels["galerie-des-reservoirs"];
  delete historique.routes.etatsReels["rocade-du-marche"];
  delete historique.routes.etatsReels["voie-des-citernes"];
  delete historique.routes.etatsReels["ligne-du-signal-zero"];
  delete historique.routes.etatsReels["voie-des-contremaitres"];
  delete historique.routes.etatsReels["traverse-des-porteurs"];
  delete historique.routes.etatsReels["rocade-des-regulateurs"];
  delete historique.routes.etatsReels["derivation-des-puits"];
  delete historique.routes.etatsReels["faisceau-de-l-aiguillage-zero"];
  delete historique.routes.etatsReels["passage-de-la-couronne-muette"];
  delete historique.routes.etatsReels["voie-de-tete-de-ligne"];
  delete historique.routes.etatsReels["chemin-des-trois-veilles"];
  delete historique.routes.etatsReels["piste-des-serres-de-verre"];
  delete historique.routes.etatsReels["rampe-du-seuil"];
  delete historique.narration.causaliteHistorique;
  delete historique.hautPuits.projetRegional;
  delete historique.veilleBasse.cohorte.orientationRegionale;
  delete historique.routes.topologieHistorique;
  for (const routeId of [
    "chemin-de-l-hospice",
    "chenal-de-l-hospice",
    "conduite-du-deversoir",
    "passage-de-la-ligne-zero",
    "piste-des-levees",
    "rampe-de-barriere-neuve",
    "voie-des-ponts-lourds",
  ]) {
    delete historique.routes.etatsReels[routeId];
  }
  return historique as unknown as Record<string, unknown>;
}

function creerArchiveV7Avancee() {
  const commandes = [
    { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "accueillir",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.reponse-du-phare",
      choixId: "consigner-harmonique",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.filtres-de-la-veille",
      choixId: "proteger-foyers",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.ilyana-au-clapet",
      choixId: "confier-clapet",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 90 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins-fendus.eau-de-haut-puits",
      choixId: "promettre-partage",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.pacte-des-citernes",
      choixId: "ouvrir-citerne",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.vanniers-du-panache",
      choixId: "confiner-boues",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.boues-du-decanteur",
      choixId: "consigner-decanteur",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.haut-puits.ilyana-et-la-vanne",
      choixId: "lui-confier-registre",
    },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chemin-des-vanniers",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 105 },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chenal-des-vannes",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 75 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.nacelles.le-poids-des-deux-rives",
      choixId: "partager-contrepoids",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.nacelles.le-frein-sous-la-cendre",
      choixId: "baliser-frein",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.nacelles.la-main-sur-le-frein",
      choixId: "reparer-publiquement",
    },
    { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.nacelles.deux-voix-dans-le-cable",
      choixId: "porter-passage-partage",
    },
  ] as const;
  const snapshotCourant = creerCampagneInitiale(
    "CENDRE-MIGRATION-V7-AVANCEE",
  );
  const snapshot = normaliserEnV7(snapshotCourant);
  let etatCourant = snapshotCourant;
  const entrees = commandes.map((commande, sequence) => {
    try {
      etatCourant = appliquerCommande(etatCourant, commande).etat;
    } catch (erreur) {
      throw new Error(
        `Commande v7 avancée ${sequence} (${commande.type}) impossible`,
        { cause: erreur },
      );
    }
    const etatV7 = normaliserEnV7(etatCourant);
    return {
      sequence,
      commande,
      empreinteApres: empreinteEtat(
        etatV7 as unknown as EtatCampagne,
      ),
    };
  });
  const etat = normaliserEnV7(etatCourant);
  return {
    format: FORMAT_SAUVEGARDE,
    id: "archive-v7-avancee",
    version: VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_DEVERSOIR,
    },
    graine: etatCourant.graine,
    horloge: { secondes: etatCourant.tempsDuConvoi.secondes },
    etat,
    reproduction: {
      snapshot,
      empreinteSnapshot: empreinteEtat(
        snapshot as unknown as EtatCampagne,
      ),
      commandes: entrees,
    },
    empreinte: empreinteEtat(etat as unknown as EtatCampagne),
  };
}

function creerArchiveV7DeLaBrancheBasse() {
  return executerAvecTronconsTemporaires(
    TRONCONS_HISTORIQUES_V6,
    () => {
      const commandes = [
        { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "prologue.signaux-sous-la-cendre",
          choixId: "accueillir",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "prologue.reponse-du-phare",
          choixId: "consigner-harmonique",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "prologue.filtres-de-la-veille",
          choixId: "proteger-foyers",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "prologue.ilyana-au-clapet",
          choixId: "confier-clapet",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
        {
          type: "engagement-de-route.confirmer",
          tronconId: "chaussee-de-veille-basse",
        },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
        { type: "temps-du-convoi.ecouler", secondesReelles: 120 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "veille-basse.la-place-sous-le-phare",
          choixId: "accueillir",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 151 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "veille-basse.la-porte-des-filtres",
          choixId: "renforcer-sas",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "veille-basse.les-registres-du-reflux",
          choixId: "copier-registres",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "evenement-narratif.choisir",
          evenementId: "veille-basse.maelys-et-le-coffret",
          choixId: "confier-coffret",
        },
        { type: "temps-du-convoi.ecouler", secondesReelles: 1 },
        {
          type: "engagement-de-route.confirmer",
          tronconId: "nacelles-de-veille-basse",
        },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
        { type: "temps-du-convoi.ecouler", secondesReelles: 90 },
      ] as const;
      const snapshotCourant = creerCampagneInitiale(
        "CENDRE-MIGRATION-V7-BASSE",
      );
      const snapshot = normaliserEnV7(snapshotCourant);
      let etatCourant = snapshotCourant;
      const entrees = commandes.map((commande, sequence) => {
        etatCourant = appliquerCommande(etatCourant, commande).etat;
        const etatV7 = normaliserEnV7(etatCourant);
        return {
          sequence,
          commande,
          empreinteApres: empreinteEtat(
            etatV7 as unknown as EtatCampagne,
          ),
        };
      });
      const etat = normaliserEnV7(etatCourant);
      return {
        format: FORMAT_SAUVEGARDE,
        id: "archive-v7-branche-basse",
        version: VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
        versions: {
          ...VERSIONS_DU_SNAPSHOT_COURANT,
          simulation: VERSION_SIMULATION_AVANT_DEVERSOIR,
        },
        graine: etatCourant.graine,
        horloge: { secondes: etatCourant.tempsDuConvoi.secondes },
        etat,
        reproduction: {
          snapshot,
          empreinteSnapshot: empreinteEtat(
            snapshot as unknown as EtatCampagne,
          ),
          commandes: entrees,
        },
        empreinte: empreinteEtat(etat as unknown as EtatCampagne),
      };
    },
  );
}

function creerArchiveV7() {
  const snapshotCourant = creerCampagneInitiale("CENDRE-MIGRATION-V7");
  const commande = {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  } as const;
  const etatCourant = appliquerCommande(snapshotCourant, commande).etat;
  const snapshot = normaliserEnV7(snapshotCourant);
  const etat = normaliserEnV7(etatCourant);
  return {
    format: FORMAT_SAUVEGARDE,
    id: "archive-v7",
    version: VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_DEVERSOIR,
    },
    graine: etatCourant.graine,
    horloge: { secondes: etatCourant.tempsDuConvoi.secondes },
    etat,
    reproduction: {
      snapshot,
      empreinteSnapshot: empreinteEtat(
        snapshot as unknown as EtatCampagne,
      ),
      commandes: [
        {
          sequence: 0,
          commande,
          empreinteApres: empreinteEtat(etat as unknown as EtatCampagne),
        },
      ],
    },
    empreinte: empreinteEtat(etat as unknown as EtatCampagne),
  };
}

describe("migration v7 avant le Déversoir Noir", () => {
  it("valide le replay historique puis promeut explicitement l’état courant", () => {
    const importation = importerSauvegarde(
      JSON.stringify(creerArchiveV7()),
    );

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v7 devrait être migrée.");
    }
    expect(importation.sauvegarde).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      versions: { simulation: 10 },
      etat: {
        version: 10,
        devenirsDesSites: null,
        hautPuits: { projetRegional: null },
        routes: {
          etatsReels: {
            "chemin-de-l-hospice": "praticable",
            "conduite-du-deversoir": "praticable",
            "passage-de-la-ligne-zero": "praticable",
          },
        },
      },
      reproduction: {
        commandes: [],
        snapshot: { version: 10 },
      },
    });
  });

  it("refuse qu’une archive v7 contienne déjà un fait du Déversoir", () => {
    const archive = creerArchiveV7();
    const etat = archive.etat as {
      narration: { faitsDeCampagne: unknown[] };
    };
    etat.narration.faitsDeCampagne.push({
      id: "bassins.deversoir.passage-prepare",
      cause: "falsification",
      acteurs: [],
      cible: "deversoir-noir",
      moment: 60,
      effets: { materiels: [], humains: [] },
    });
    archive.empreinte = empreinteEtat(
      archive.etat as unknown as EtatCampagne,
    );

    expect(importerSauvegarde(JSON.stringify(archive))).toMatchObject({
      statut: "invalide",
      explication: expect.stringContaining("v7"),
    });
  });

  it("valide la Plateforme Standard immédiatement puis après un Chantier", () => {
    const archive = creerArchiveV7Avancee();
    let etat = promouvoirEtatV7VersCourant(
      archive.etat as unknown as EtatCampagneV7,
    );
    for (const commande of [
      {
        type: "engagement-de-route.confirmer",
        tronconId: "conduite-du-deversoir",
      },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
      { type: "temps-du-convoi.ecouler", secondesReelles: 90 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "bassins.deversoir.la-conduite-zero",
        choixId: "relever-interface",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "bassins.deversoir.la-tempete-aux-vannes",
        choixId: "convoquer-delegations",
      },
      {
        type: "conseil.decider",
        conseilId: "conseil.des-vannes",
        sujetId: "eau-cohorte-et-deversoir",
        decisionId: "contraindre-vannes",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "bassins.deversoir.le-chassis-des-bassins",
        choixId: "conserver-gabarits",
      },
    ] as const) {
      etat = appliquerCommande(etat, commande).etat;
    }

    expect(lireEtatCourant(etat)).toBeDefined();
    expect(etat.infrastructure.plateformes.at(-1)?.emplacements).toHaveLength(
      3,
    );

    for (const commande of [
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "bassins.deversoir.le-passage-sans-retour",
        choixId: "consigner-abandons",
      },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 0 },
      { type: "halte.deployer" },
      {
        type: "chantier.engager",
        ordre: {
          type: "construction",
          definitionId: "condenseur-thermique",
          emplacementId: "chassis-regional-des-bassins.technique",
        },
        priorite: "haute",
      },
    ] as const) {
      etat = appliquerCommande(etat, commande).etat;
    }
    expect(lireEtatCourant(etat)).toBeDefined();
    const chantierAnachronique = structuredClone(etat) as unknown as {
      narration: {
        faitsDeCampagne: Array<{ id: string; moment: number }>;
      };
      tempsDuConvoi: { secondes: number };
      infrastructure: {
        chantierActif: {
          id: string;
          ordre: { type: string };
          commenceA: number;
          progression: number;
          coutMateriaux: number;
          materiauxConsommes: number;
          dureePrevue: number;
        } | null;
      };
    };
    const faitDuChassis =
      chantierAnachronique.narration.faitsDeCampagne.find(
        (fait) => fait.id === "bassins.deversoir.gabarits-conserves",
      );
    const chantier = chantierAnachronique.infrastructure.chantierActif;
    if (faitDuChassis === undefined || chantier === null) {
      throw new Error("Le Châssis et son Chantier devraient être présents.");
    }
    chantier.commenceA = faitDuChassis.moment - 1;
    chantier.progression =
      chantierAnachronique.tempsDuConvoi.secondes - chantier.commenceA;
    chantier.materiauxConsommes = Math.floor(
      (chantier.coutMateriaux * chantier.progression) /
        chantier.dureePrevue,
    );
    chantier.id =
      `chantier.0.${chantier.commenceA}.${chantier.ordre.type}`;
    expect(lireEtatCourant(chantierAnachronique)).toBeUndefined();

    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;

    expect(etat.infrastructure.chantierActif).toBeNull();
    expect(
      etat.infrastructure.plateformes.at(-1)?.emplacements[1]?.installation,
    ).toMatchObject({ definitionId: "condenseur-thermique" });
    expect(lireEtatCourant(etat)).toBeDefined();
  });

  it("marque la topologie basse v7 et conserve ses provenances au prochain choix", () => {
    const importation = importerSauvegarde(
      JSON.stringify(creerArchiveV7DeLaBrancheBasse()),
    );

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: {
          routes: {
            position: "relais-des-vannes",
            topologieHistorique: "nacelles-v7",
          },
          narration: {
            evenementActif: "bassins.nacelles.le-poids-des-deux-rives",
          },
        },
      },
    });
    if (importation.statut !== "migree") {
      throw new Error("La branche basse v7 devrait être migrée.");
    }
    const apresChoix = appliquerCommande(importation.sauvegarde.etat, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins.nacelles.le-poids-des-deux-rives",
      choixId: "partager-contrepoids",
    }).etat;
    expect(apresChoix.routes.topologieHistorique).toBe("nacelles-v7");
    const sauvegarde = creerSauvegarde(
      apresChoix,
      creerReproductionInitiale(apresChoix),
    );
    expect(
      importerSauvegarde(exporterSauvegarde(sauvegarde)),
    ).toMatchObject({ statut: "compatible" });
  });

  it("rejoue Haut-Puits et les Nacelles avec le seul catalogue historique v7", async () => {
    const archive = creerArchiveV7Avancee();

    vi.resetModules();
    const catalogue = await import("../content/catalogue");
    const routes = await import("../simulation/routes");
    const { importerSauvegarde: importerSansPremium } =
      await import("./portable");

    expect(
      catalogue.catalogueDEvenements.evenements.some(({ id }) =>
        id.startsWith("bassins.nacelles."),
      ),
    ).toBe(false);
    expect(
      routes.TRONCONS_DE_ROUTE.some(
        ({ id }) => id === "chenal-des-vannes",
      ),
    ).toBe(false);

    expect(
      importerSansPremium(JSON.stringify(archive)),
    ).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: {
          routes: { position: "relais-des-vannes" },
          narration: {
            evenementsJoues: expect.arrayContaining([
              "bassins.haut-puits.ilyana-et-la-vanne",
              "bassins.nacelles.deux-voix-dans-le-cable",
            ]),
          },
        },
      },
    });
  });
});
