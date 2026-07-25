import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";
import { creerEtatInitialDeVeilleBasse } from "../simulation/veilleBasse";
import { creerEtatDeHautPuitsInitial } from "../simulation/hautPuits";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
  importerSauvegarde,
  rejouerReproduction,
} from "./sauvegarde";
import { lireEtatCourant } from "./validation";

function normaliserEnV4(etat: EtatCampagne): Record<string, unknown> {
  const ancien = { ...etat } as Record<string, unknown>;
  ancien.version = 4;
  delete ancien.denouement;
  delete ancien.veilleBasse;
  delete ancien.hautPuits;
  delete ancien.trameDeFer;
  delete ancien.traverseLibre;
  ancien.routes = sansRoutesDeLaTrame(etat);
  return ancien;
}

function normaliserEnV5(etat: EtatCampagne): Record<string, unknown> {
  const ancien = { ...etat } as Record<string, unknown>;
  ancien.version = 5;
  delete ancien.denouement;
  delete ancien.hautPuits;
  delete ancien.trameDeFer;
  delete ancien.traverseLibre;
  ancien.routes = sansRoutesDeLaTrame(etat);
  return ancien;
}

function sansRoutesDeLaTrame(etat: EtatCampagne): EtatCampagne["routes"] {
  const {
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    "rocade-du-marche": rocadeDuMarche,
    "voie-des-citernes": voieDesCiternes,
    "ligne-du-signal-zero": ligneDuSignalZero,
    "voie-des-contremaitres": voieDesContremaitres,
    "traverse-des-porteurs": traverseDesPorteurs,
    "rocade-des-regulateurs": rocadeDesRegulateurs,
    "derivation-des-puits": derivationDesPuits,
    ...etatsReels
  } = etat.routes.etatsReels;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  void rocadeDuMarche;
  void voieDesCiternes;
  void ligneDuSignalZero;
  void voieDesContremaitres;
  void traverseDesPorteurs;
  void rocadeDesRegulateurs;
  void derivationDesPuits;
  return { ...etat.routes, etatsReels };
}

function resoudreEvenementActif(
  etat: EtatCampagne,
  choixId?: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement narratif actif.");
  }
  const choixParDefaut: Record<string, string> = {
    "prologue.signaux-sous-la-cendre": "accueillir",
    "prologue.reponse-du-phare": "consigner-harmonique",
    "prologue.filtres-de-la-veille": "proteger-foyers",
    "prologue.ilyana-au-clapet": "confier-clapet",
  };
  const resolu = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId: choixId ?? choixParDefaut[evenementId]!,
  }).etat;
  return appliquerCommande(resolu, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

function arriverAVeilleBasse(): EtatCampagne {
  let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  for (let index = 0; index < 4; index += 1) {
    etat = resoudreEvenementActif(etat);
  }
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "chaussee-de-veille-basse",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 120,
  }).etat;
}

function arriverAVeilleBasseEtRediriger(): EtatCampagne {
  let etat = arriverAVeilleBasse();
  etat = resoudreEvenementActif(etat, "rediriger");
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 150,
  }).etat;
}

function appliquerCommeEnV4(
  etat: EtatCampagne,
  commande: CommandeCampagne,
): EtatCampagne {
  const applique = appliquerCommande(etat, commande).etat;
  const ancienEvenementEstEligible =
    applique.tempsDuConvoi.secondes >= 360 &&
    applique.tempsDuConvoi.secondes <= 24_000 &&
    applique.routes.jalons.length > 0 &&
    !applique.narration.evenementsJoues.includes(
      "bassins-fendus.eau-de-haut-puits",
    ) &&
    applique.narration.faitsDeCampagne.some(
      (fait) =>
        fait.id === "prologue.ilyana-ecoutee" ||
        fait.id === "prologue.ilyana-contredite",
    );
  return applique.narration.evenementActif?.startsWith("veille-basse.")
    ? {
        ...applique,
        narration: {
          ...applique.narration,
          evenementActif: ancienEvenementEstEligible
            ? "bassins-fendus.eau-de-haut-puits"
            : null,
        },
      }
    : applique;
}

describe("persistance de Veille-Basse", () => {
  it("refuse un Hospice sous Charge sans décision ni conséquence causale", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const falsifie: EtatCampagne = {
      ...initial,
      veilleBasse: {
        ...initial.veilleBasse,
        hospiceDuSillon: {
          ...initial.veilleBasse.hospiceDuSillon,
          devenir: "sous-charge",
        },
      },
    };

    expect(lireEtatCourant(falsifie)).toBeUndefined();
  });

  it("refuse des équipes intégrées avant les dix minutes annoncées", () => {
    const accueil = resoudreEvenementActif(
      arriverAVeilleBasse(),
      "accueillir",
    );
    expect(lireEtatCourant(accueil)).toEqual(accueil);
    const falsifie: EtatCampagne = {
      ...accueil,
      veilleBasse: {
        ...accueil.veilleBasse,
        cohorte: {
          ...accueil.veilleBasse.cohorte,
          integration: {
            statut: "equipes-integrees",
            chargeDAccueil: null,
            equipesIntegrees: 2,
          },
        },
      },
    };

    expect(lireEtatCourant(falsifie)).toBeUndefined();
    const integreApresDepassement = appliquerCommande(accueil, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 151,
    }).etat;
    expect(
      integreApresDepassement.veilleBasse.colonie
        .avertissementDePerte?.avertiA,
    ).toBe(accueil.tempsDuConvoi.secondes + 600);
    expect(lireEtatCourant(integreApresDepassement)).toEqual(
      integreApresDepassement,
    );
  });

  it("refuse les équipes partielles et une cause d’avertissement inventée", () => {
    const accueil = resoudreEvenementActif(
      arriverAVeilleBasse(),
      "accueillir",
    );
    const equipesPartielles: EtatCampagne = {
      ...accueil,
      veilleBasse: {
        ...accueil.veilleBasse,
        cohorte: {
          ...accueil.veilleBasse.cohorte,
          integration: {
            ...accueil.veilleBasse.cohorte.integration,
            equipesIntegrees: 1,
          },
        },
      },
    };
    expect(lireEtatCourant(equipesPartielles)).toBeUndefined();

    const integre = appliquerCommande(accueil, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 150,
    }).etat;
    const causeInventee: EtatCampagne = {
      ...integre,
      veilleBasse: {
        ...integre.veilleBasse,
        colonie: {
          ...integre.veilleBasse.colonie,
          avertissementDePerte: {
            ...integre.veilleBasse.colonie.avertissementDePerte!,
            cause: "veille-basse.cause-inventee",
          },
        },
      },
    };
    expect(lireEtatCourant(causeInventee)).toBeUndefined();
  });

  it("valide la cause propre au retour d’une cohorte refusée", () => {
    let etat = resoudreEvenementActif(arriverAVeilleBasse(), "refuser");
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 150,
    }).etat;

    expect(etat.veilleBasse.colonie.avertissementDePerte?.cause).toBe(
      "veille-basse.cohorte-refusee-revient-aux-portes",
    );
    expect(lireEtatCourant(etat)).toEqual(etat);
    expect(
      importerSauvegarde(
        exporterSauvegarde(
          creerSauvegarde(etat, creerReproductionInitiale(etat)),
        ),
      ).statut,
    ).toBe("compatible");
  });

  it("valide et exporte la perte causale après une occasion ignorée", () => {
    let etat = arriverAVeilleBasseEtRediriger();
    etat = resoudreEvenementActif(etat, "renoncer-intervention");
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 75,
    }).etat;

    expect(etat.veilleBasse.colonie.statut).toBe("perdue");
    expect(lireEtatCourant(etat)).toEqual(etat);
    const sauvegarde = creerSauvegarde(
      etat,
      creerReproductionInitiale(etat),
    );
    expect(importerSauvegarde(exporterSauvegarde(sauvegarde)).statut).toBe(
      "compatible",
    );
  });

  it("exporte, importe et rejoue l’état persistant de la Colonie et de la Cohorte", () => {
    const etat = arriverAVeilleBasseEtRediriger();
    const sauvegarde = creerSauvegarde(
      etat,
      creerReproductionInitiale(etat),
    );

    const importation = importerSauvegarde(
      exporterSauvegarde(sauvegarde),
    );

    expect(importation).toMatchObject({
      statut: "compatible",
      sauvegarde: {
        version: 14,
        etat: {
          version: 14,
          veilleBasse: {
            colonie: { statut: "fragile" },
            cohorte: {
              origine: "camp-des-digues",
              destination: "hospice-du-sillon",
              taille: 18,
            },
            hospiceDuSillon: { devenir: "sous-charge" },
          },
        },
        reproduction: {
          snapshot: {
            version: 14,
            veilleBasse: {
              cohorte: { specialite: "charpente-etanche" },
            },
          },
        },
      },
    });
    if (importation.statut !== "compatible") {
      throw new Error("La sauvegarde v7 devrait être compatible.");
    }
    expect(
      rejouerReproduction(importation.sauvegarde.reproduction),
    ).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
    });
  });

  it("promeut une sauvegarde v5 de Veille-Basse sans perdre sa Cohorte", () => {
    const etatCourant = arriverAVeilleBasseEtRediriger();
    const etatV5 = normaliserEnV5(etatCourant);
    const empreinteV5 = empreinteEtat(etatV5 as unknown as EtatCampagne);
    const archiveV5 = {
      format: "lanternes-de-cendre.sauvegarde",
      id: `CENDRE-01-${etatCourant.tempsDuConvoi.secondes}-${empreinteV5}`,
      version: 5,
      versions: {
        simulation: 5,
        contenu: 1,
        aleatoire: 1,
        empreinte: 1,
      },
      graine: "CENDRE-01",
      horloge: { secondes: etatCourant.tempsDuConvoi.secondes },
      etat: etatV5,
      reproduction: {
        snapshot: etatV5,
        empreinteSnapshot: empreinteV5,
        commandes: [],
      },
      empreinte: empreinteV5,
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV5));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: 14,
        etat: {
          version: 14,
          veilleBasse: etatCourant.veilleBasse,
          hautPuits: creerEtatDeHautPuitsInitial(),
        },
        reproduction: {
          snapshot: {
            version: 14,
            veilleBasse: etatCourant.veilleBasse,
            hautPuits: creerEtatDeHautPuitsInitial(),
          },
          commandes: [],
        },
      },
    });
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v5 devrait être migrée.");
    }
    expect(
      rejouerReproduction(importation.sauvegarde.reproduction),
    ).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
    });
  });

  it("promeut purement snapshot, état et commandes d’une archive v4", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const apresCommande = appliquerCommande(initial, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    }).etat;
    const snapshotV4 = normaliserEnV4(initial);
    const etatV4 = normaliserEnV4(apresCommande);
    const empreinteSnapshotV4 = empreinteEtat(
      snapshotV4 as unknown as EtatCampagne,
    );
    const empreinteEtatV4 = empreinteEtat(
      etatV4 as unknown as EtatCampagne,
    );
    const archiveV4 = {
      format: "lanternes-de-cendre.sauvegarde",
      id: `CENDRE-01-0-${empreinteEtatV4}`,
      version: 4,
      versions: {
        simulation: 4,
        contenu: 1,
        aleatoire: 1,
        empreinte: 1,
      },
      graine: "CENDRE-01",
      horloge: { secondes: 0 },
      etat: etatV4,
      reproduction: {
        snapshot: snapshotV4,
        empreinteSnapshot: empreinteSnapshotV4,
        commandes: [
          {
            sequence: 0,
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 2,
            },
            empreinteApres: empreinteEtatV4,
          },
        ],
      },
      empreinte: empreinteEtatV4,
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV4));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: 14,
        etat: {
          version: 14,
          tempsDuConvoi: { vitesse: 2 },
          veilleBasse: creerEtatInitialDeVeilleBasse(),
        },
        reproduction: {
          snapshot: {
            version: 14,
            veilleBasse: creerEtatInitialDeVeilleBasse(),
          },
          commandes: [
            {
              sequence: 0,
              commande: {
                type: "temps-du-convoi.regler-vitesse",
                vitesse: 2,
              },
            },
          ],
        },
      },
    });
    if (importation.statut !== "migree") {
      throw new Error("La sauvegarde v4 devrait être migrée.");
    }
    expect(
      rejouerReproduction(importation.sauvegarde.reproduction),
    ).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
    });
  });

  it("rejoue le routage narratif v4 qui ouvrait Haut-Puits même à Veille-Basse", () => {
    const commandes: CommandeCampagne[] = [
      { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "prologue.signaux-sous-la-cendre",
        choixId: "accueillir",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "prologue.reponse-du-phare",
        choixId: "consigner-harmonique",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
      {
        type: "evenement-narratif.choisir",
        evenementId: "prologue.filtres-de-la-veille",
        choixId: "proteger-foyers",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
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
        evenementId: "bassins-fendus.eau-de-haut-puits",
        choixId: "promettre-partage",
      },
      { type: "temps-du-convoi.ecouler", secondesReelles: 0 },
    ];
    const snapshot = creerCampagneInitiale("CENDRE-01");
    let etat = snapshot;
    const entrees = commandes.map((commande, sequence) => {
      etat = appliquerCommeEnV4(etat, commande);
      return {
        sequence,
        commande,
        empreinteApres: empreinteEtat(
          normaliserEnV4(etat) as unknown as EtatCampagne,
        ),
      };
    });
    const snapshotV4 = normaliserEnV4(snapshot);
    const etatV4 = normaliserEnV4(etat);
    const empreinteSnapshot = empreinteEtat(
      snapshotV4 as unknown as EtatCampagne,
    );
    const empreinte = empreinteEtat(etatV4 as unknown as EtatCampagne);
    const archiveV4 = {
      format: "lanternes-de-cendre.sauvegarde",
      id: `CENDRE-01-540-${empreinte}`,
      version: 4,
      versions: {
        simulation: 4,
        contenu: 1,
        aleatoire: 1,
        empreinte: 1,
      },
      graine: "CENDRE-01",
      horloge: { secondes: 540 },
      etat: etatV4,
      reproduction: {
        snapshot: snapshotV4,
        empreinteSnapshot,
        commandes: entrees,
      },
      empreinte,
    };

    const importation = importerSauvegarde(JSON.stringify(archiveV4));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: {
          routes: { position: "veille-basse" },
          narration: {
            evenementActif: null,
            causaliteHistorique: "eau-haut-puits-a-veille-basse",
            evenementsJoues: expect.arrayContaining([
              "bassins-fendus.eau-de-haut-puits",
            ]),
          },
        },
        reproduction: {
          commandes: [],
          snapshot: {
            narration: {
              evenementActif: null,
            },
          },
        },
      },
    });
    if (importation.statut !== "migree") {
      throw new Error("Le routage historique devrait être migré.");
    }
    const { causaliteHistorique, ...narrationSansProvenance } =
      importation.sauvegarde.etat.narration;
    expect(causaliteHistorique).toBe(
      "eau-haut-puits-a-veille-basse",
    );
    expect(
      lireEtatCourant({
        ...importation.sauvegarde.etat,
        narration: narrationSansProvenance,
      }),
    ).toBeUndefined();
    expect(
      lireEtatCourant({
        ...creerCampagneInitiale("MARQUEUR-ORPHELIN"),
        narration: {
          ...creerCampagneInitiale("MARQUEUR-ORPHELIN").narration,
          causaliteHistorique: "eau-haut-puits-a-veille-basse",
        },
      }),
    ).toBeUndefined();
    expect(
      rejouerReproduction(importation.sauvegarde.reproduction),
    ).toMatchObject({
      statut: "termine",
      etat: importation.sauvegarde.etat,
    });
    expect(
      importerSauvegarde(
        exporterSauvegarde(importation.sauvegarde),
      ).statut,
    ).toBe("compatible");
    let apresMigration = appliquerCommande(importation.sauvegarde.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 0,
    }).etat;
    expect(apresMigration.narration.evenementActif).toBe(
      "veille-basse.la-place-sous-le-phare",
    );
    apresMigration = appliquerCommande(apresMigration, {
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "accueillir",
    }).etat;
    expect(apresMigration.narration.causaliteHistorique).toBe(
      "eau-haut-puits-a-veille-basse",
    );
    const sauvegardeApresChoix = creerSauvegarde(
      apresMigration,
      creerReproductionInitiale(apresMigration),
    );
    expect(
      importerSauvegarde(
        exporterSauvegarde(sauvegardeApresChoix),
      ).statut,
    ).toBe("compatible");
  });
});
