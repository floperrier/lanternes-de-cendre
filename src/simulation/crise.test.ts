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
});
