import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { IdentifiantDeReponseALaCrise } from "./crise";

function annoncerRupture(): EtatCampagne {
  return appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "maintenir-debit",
  }).etat;
}

function declencherCrise(): EtatCampagne {
  const checkpoint = appliquerCommande(annoncerRupture(), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 181,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
}

function declencherCriseApresPrologue(): EtatCampagne {
  let etat = annoncerRupture();
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  const choixDuPrologue = [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const;
  for (const [evenementId, choixId] of choixDuPrologue) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    if (evenementId !== "prologue.ilyana-au-clapet") {
      etat = appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      }).etat;
    }
  }
  const checkpoint = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 117,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
}

function resoudreCrise(
  etat: EtatCampagne,
  reponseId: IdentifiantDeReponseALaCrise,
): EtatCampagne {
  return appliquerCommande(etat, {
    type: "crise.resoudre",
    criseId: "penurie-eau.pompe-purification",
    reponseId,
  }).etat;
}

function parcourir(
  etat: EtatCampagne,
  tronconId: "digue-des-puits" | "chaussee-de-veille-basse",
  secondes: number,
): ReturnType<typeof appliquerCommande> {
  const engagement = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId,
  }).etat;
  const enMarche = appliquerCommande(engagement, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(enMarche, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: secondes / 4,
  });
}

describe("Crise de pénurie et récupération", () => {
  it("annonce la chaîne puis ne progresse que d’un maillon irréversible par fenêtre", () => {
    const annonce = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    });

    expect(annonce.etat.crises).toMatchObject({
      approvisionnementEau: "sous-tension",
      alerte: {
        cause: "incident.purification.pompe-instable.debit-maintenu",
        annonceeA: 0,
        ruptureA: 180,
      },
      criseActive: null,
    });
    expect(annonce.evenements).toContainEqual(
      expect.objectContaining({
        type: "crise.aggravation-annoncee",
        maillonIrreversible: "pompe-purification.degradee",
      }),
    );

    const avantRupture = appliquerCommande(annonce.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 179,
    });
    expect(avantRupture.etat.crises.criseActive).toBeNull();
    expect(avantRupture.etat.tempsDuConvoi.secondes).toBe(179);

    const checkpoint = appliquerCommande(avantRupture.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 2,
    });
    expect(checkpoint.etat.tempsDuConvoi).toEqual({
      secondes: 180,
      vitesse: 0,
    });
    expect(checkpoint.etat.crises).toMatchObject({
      approvisionnementEau: "sous-tension",
      criseActive: null,
    });
    expect(checkpoint.etat.pilotage.economie.stocks.eau.quantite).toBe(759);
    expect(checkpoint.evenements).toContainEqual(
      expect.objectContaining({
        type: "crise.checkpoint-requis",
        sauvegardeAtomiqueRequise: true,
      }),
    );

    const rupture = appliquerCommande(checkpoint.etat, {
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    });
    expect(rupture.etat.crises).toMatchObject({
      approvisionnementEau: "rupture",
      criseActive: {
        id: "penurie-eau.pompe-purification",
        declencheeA: 180,
        cause: "incident.purification.pompe-instable.debit-maintenu",
      },
    });
    expect(rupture.etat.pilotage.economie.stocks.eau.quantite).toBe(16);
    expect(
      rupture.evenements.filter(
        (evenement) => "maillonIrreversible" in evenement,
      ),
    ).toEqual([
      expect.objectContaining({
        type: "crise.declenchee",
        maillonIrreversible: "eau.purifiee.contaminee",
      }),
    ]);
    expect(() =>
      appliquerCommande(rupture.etat, {
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 1,
      }),
    ).toThrow("Crise doit être résolue");
  });

  it("borne une grande avance à la rupture sans tirage caché ni cascade terminale", () => {
    const annonce = annoncerRupture();
    const fluxAvant = annonce.fluxPseudoAleatoires;
    const habitantsAvant = annonce.citeCaravane.habitants;

    const checkpoint = appliquerCommande(annonce, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 10_000,
    });

    expect(checkpoint.etat.tempsDuConvoi).toEqual({
      secondes: 180,
      vitesse: 0,
    });
    expect(checkpoint.etat.fluxPseudoAleatoires).toEqual(fluxAvant);
    expect(checkpoint.etat.citeCaravane.habitants).toBe(habitantsAvant);
    expect(
      checkpoint.etat.narration.faitsDeCampagne.filter((fait) =>
        fait.id.startsWith("crise."),
      ),
    ).toHaveLength(0);
    expect(
      checkpoint.evenements.filter(
        (evenement) => evenement.type === "crise.checkpoint-requis",
      ),
    ).toHaveLength(1);

    const rupture = appliquerCommande(checkpoint.etat, {
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    });
    expect(
      rupture.etat.narration.faitsDeCampagne.filter((fait) =>
        fait.id.startsWith("crise."),
      ),
    ).toHaveLength(1);
    expect(rupture.etat.fluxPseudoAleatoires).toEqual(fluxAvant);
  });

  it.each([
    ["isoler-et-rationner", "materiaux", 4, "socle-de-survie"],
    ["mobiliser-les-remedes", "remedes", 5, "mobilite-minimale"],
  ] as const)(
    "résout par %s avec un coût net et une récupération amorcée",
    (reponseId, stockId, cout, garantie) => {
      const enCrise = declencherCrise();
      const avant = enCrise.pilotage.economie.stocks[stockId].quantite;

      const resolution = appliquerCommande(enCrise, {
        type: "crise.resoudre",
        criseId: "penurie-eau.pompe-purification",
        reponseId,
      });

      expect(
        resolution.etat.pilotage.economie.stocks[stockId].quantite,
      ).toBe(avant - cout);
      expect(resolution.etat.crises).toMatchObject({
        approvisionnementEau: "sous-tension",
        alerte: null,
        criseActive: null,
        cicatrices: [
          expect.objectContaining({
            cause: expect.stringContaining(reponseId),
          }),
        ],
        recuperations: [
          expect.objectContaining({
            garantie,
            horizonTroncons: expect.any(Number),
            statut: "amorcee",
          }),
        ],
      });
      expect(resolution.etat.tempsDuConvoi.vitesse).toBe(0);
      expect(resolution.evenements).toContainEqual(
        expect.objectContaining({
          type: "crise.resolue",
          reponseId,
        }),
      );
    },
  );

  it("offre un dernier recours attribué sans effacer la Cicatrice", () => {
    const enCrise = declencherCrise();
    const habitantsAvant = enCrise.citeCaravane.habitants;
    const reponseId: IdentifiantDeReponseALaCrise =
      "evacuer-les-foyers-exposes";

    const resolution = appliquerCommande(enCrise, {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId,
    });

    expect(resolution.etat.citeCaravane.habitants).toBe(habitantsAvant - 8);
    expect(resolution.etat.crises.cicatrices[0]).toMatchObject({
      id: "cicatrice.evacuation-des-foyers",
      irreversible: true,
    });
    expect(resolution.etat.crises.recuperations[0]).toMatchObject({
      garantie: "aide-exterieure-identifiee",
      destination: "haut-puits",
      horizonTroncons: 1,
    });
    expect(resolution.etat.narration.faitsDeCampagne.at(-1)).toMatchObject({
      acteurs: ["porte-lanterne", "foyers-exposes"],
      cible: "foyers-du-convoi",
      effets: {
        humains: [{ type: "habitants.modifies", variation: -8 }],
      },
    });
  });

  it("accomplit le Socle de survie par une Halte coûteuse, produit un Fait et ne paie qu’une fois", () => {
    const apresResolution = resoudreCrise(
      declencherCrise(),
      "isoler-et-rationner",
    );
    const materiauxAvant =
      apresResolution.pilotage.economie.stocks.materiaux.quantite;

    const accomplissement = appliquerCommande(apresResolution, {
      type: "halte.deployer",
    });

    expect(
      accomplissement.etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 2);
    expect(accomplissement.etat.crises.recuperations[0]).toMatchObject({
      statut: "accomplie",
      condition: "halte-de-purification",
      accomplieA: 180,
      faitResultat:
        "crise.recuperation.socle-de-survie.accomplie",
      coutApplique: [{ stock: "materiaux", quantite: 2 }],
    });
    expect(accomplissement.etat.crises.cicatrices).toEqual(
      apresResolution.crises.cicatrices,
    );
    expect(accomplissement.etat.narration.faitsDeCampagne.at(-1)).toMatchObject({
      id: "crise.recuperation.socle-de-survie.accomplie",
      cause: "cicatrice.rationnement-deau",
      effets: {
        materiels: [
          { type: "stock.modifie", stock: "materiaux", variation: -2 },
        ],
      },
    });
    expect(accomplissement.evenements).toContainEqual(
      expect.objectContaining({
        type: "crise.recuperation-accomplie",
        recuperationId: "recuperation.1",
      }),
    );

    const repetition = appliquerCommande(accomplissement.etat, {
      type: "halte.deployer",
    });
    expect(repetition.etat).toEqual(accomplissement.etat);
    expect(repetition.evenements).toEqual([]);
  });

  it("n’accomplit pas le Socle avec une commande redondante quand la Halte était déjà déployée", () => {
    let etat = creerCampagneInitiale("CENDRE-01");
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    etat = appliquerCommande(etat, {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 181,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    }).etat;
    etat = resoudreCrise(etat, "isoler-et-rationner");
    const materiauxAvant =
      etat.pilotage.economie.stocks.materiaux.quantite;

    const commandeRedondante = appliquerCommande(etat, {
      type: "halte.deployer",
    });

    expect(commandeRedondante.etat.crises.recuperations[0]?.statut).toBe(
      "amorcee",
    );
    expect(
      commandeRedondante.etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant);
    expect(commandeRedondante.evenements).toEqual([]);
  });

  it("accomplit la mobilité à Haut-Puits avec le coût réel du Tronçon", () => {
    const apresResolution = resoudreCrise(
      declencherCrise(),
      "mobiliser-les-remedes",
    );

    const arrivee = parcourir(
      apresResolution,
      "digue-des-puits",
      360,
    );

    expect(arrivee.etat.routes.position).toBe("haut-puits");
    expect(arrivee.etat.crises.recuperations[0]).toMatchObject({
      statut: "accomplie",
      condition: "rejoindre-haut-puits",
      faitResultat:
        "crise.recuperation.mobilite-minimale.accomplie",
      coutApplique: [
        { stock: "combustible", quantite: 3 },
        { stock: "eau", quantite: 4 },
      ],
    });
    expect(arrivee.etat.narration.faitsDeCampagne.at(-1)).toMatchObject({
      id: "crise.recuperation.mobilite-minimale.accomplie",
      effets: { materiels: [], humains: [] },
    });
  });

  it("laisse la demande d’aide ouverte au Jalon puis l’accomplit par le partage", () => {
    const apresResolution = resoudreCrise(
      declencherCriseApresPrologue(),
      "evacuer-les-foyers-exposes",
    );
    const arrivee = parcourir(
      apresResolution,
      "digue-des-puits",
      360,
    ).etat;

    expect(arrivee.narration.evenementActif).toBe(
      "bassins-fendus.eau-de-haut-puits",
    );
    expect(arrivee.crises.recuperations[0]?.statut).toBe("amorcee");
    const materiauxAvant =
      arrivee.pilotage.economie.stocks.materiaux.quantite;

    const aide = appliquerCommande(arrivee, {
      type: "evenement-narratif.choisir",
      evenementId: "bassins-fendus.eau-de-haut-puits",
      choixId: "promettre-partage",
    });

    expect(aide.etat.pilotage.economie.stocks.materiaux.quantite).toBe(
      materiauxAvant - 2,
    );
    expect(aide.etat.crises.recuperations[0]).toMatchObject({
      statut: "accomplie",
      condition: "demander-aide-haut-puits",
      faitResultat:
        "crise.recuperation.aide-exterieure-identifiee.accomplie",
      coutApplique: [{ stock: "materiaux", quantite: 2 }],
    });
  });

  it("manque définitivement la demande d’aide au mauvais premier Jalon", () => {
    const apresResolution = resoudreCrise(
      declencherCriseApresPrologue(),
      "evacuer-les-foyers-exposes",
    );

    const echec = parcourir(
      apresResolution,
      "chaussee-de-veille-basse",
      480,
    );

    expect(echec.etat.routes.position).toBe("veille-basse");
    expect(echec.etat.crises.recuperations[0]).toMatchObject({
      statut: "manquee",
      manqueeA: 660,
      faitResultat:
        "crise.recuperation.aide-exterieure-identifiee.manquee",
      coutApplique: [],
    });
    expect(echec.etat.crises.cicatrices).toEqual(
      apresResolution.crises.cicatrices,
    );
    expect(echec.etat.narration.faitsDeCampagne.at(-1)).toMatchObject({
      id: "crise.recuperation.aide-exterieure-identifiee.manquee",
      cause: "cicatrice.evacuation-des-foyers",
      effets: { materiels: [], humains: [] },
    });

    const plusTard = appliquerCommande(echec.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 10,
    });
    expect(plusTard.etat.crises.recuperations).toEqual(
      echec.etat.crises.recuperations,
    );
    expect(
      plusTard.etat.narration.faitsDeCampagne.filter((fait) =>
        fait.id.endsWith(".manquee"),
      ),
    ).toHaveLength(1);
  });
});
