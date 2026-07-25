import { describe, expect, it } from "vitest";

import { projeterCrises } from "../application/crise";
import { projeterEpilogue } from "../application/epilogue";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import { creerEtatDesCrisesInitial } from "./crise";
import type { FaitDeCampagne } from "./faits";

function fait(id: string, moment = 5_000): FaitDeCampagne {
  return {
    id,
    cause: "crise.recuperation.socle-de-survie.manquee",
    acteurs: ["porte-lanterne", "equipes-du-phare"],
    cible: "halo-du-phare",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function etatAuBordDeLExtinction({
  materiaux = 0,
  recuperation = "manquee",
  aide = false,
}: {
  readonly materiaux?: number;
  readonly recuperation?: "accomplie" | "manquee";
  readonly aide?: boolean;
} = {}): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-EXTINCTION");
  const faitResultat =
    `crise.recuperation.socle-de-survie.${recuperation}` as const;
  return {
    ...initial,
    tempsDuConvoi: { secondes: 5_000, vitesse: 1 },
    routes: { ...initial.routes, position: "anneau-interieur" },
    pilotage: {
      ...initial.pilotage,
      economie: {
        ...initial.pilotage.economie,
        stocks: {
          ...initial.pilotage.economie.stocks,
          materiaux: {
            ...initial.pilotage.economie.stocks.materiaux,
            quantite: materiaux,
          },
        },
      },
    },
    narration: {
      ...initial.narration,
      faitsDeCampagne: [
        fait("couronne.ouverture.breche-ouverte", 4_900),
        fait("couronne.ouverture.clef-collective", 4_950),
        fait(faitResultat, 4_980),
        ...(aide
          ? [fait("couronne.colonies.voie-alliee-preparee", 4_990)]
          : []),
      ],
    },
    crises: {
      ...creerEtatDesCrisesInitial(),
      historique: [
        {
          id: "penurie-eau.pompe-purification",
          cause: "incident.purification.pompe-instable.debit-maintenu",
          declencheeA: 900,
          faitDeclenchement: "crise.purification.eau-contaminee",
          resolueA: 900,
          reponseId: "isoler-et-rationner",
          faitResolution: "crise.purification.isoler-et-rationner",
        },
      ],
      cicatrices: [
        {
          id: "cicatrice.rationnement-deau",
          cause: "crise.purification.isoler-et-rationner",
          acquiseA: 900,
          irreversible: true,
        },
      ],
      recuperations: [
        {
          id: "recuperation.1",
          cause: "cicatrice.rationnement-deau",
          garantie: "socle-de-survie",
          destination: "halte-du-puits-sec",
          condition: "halte-de-purification",
          horizonTroncons: 2,
          coutAttendu: "deux-materiaux",
          amorceeA: 900,
          statut: recuperation,
          accomplieA: recuperation === "accomplie" ? 1_100 : null,
          manqueeA: recuperation === "manquee" ? 1_100 : null,
          faitResultat,
          coutApplique:
            recuperation === "accomplie"
              ? [{ stock: "materiaux", quantite: 2 }]
              : [],
        },
      ],
    },
  };
}

function annoncer(etat: EtatCampagne): EtatCampagne {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 2,
  }).etat;
}

function atteindreLExtinction(etat = etatAuBordDeLExtinction()): EtatCampagne {
  const alerte = annoncer(etat);
  const checkpoint = appliquerCommande(alerte, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "extinction-du-phare",
  }).etat;
}

describe("Extinction du Phare", () => {
  it("exige une Récupération manquée et moins de deux réponses capables de préserver la Cité-caravane", () => {
    const terminale = annoncer(etatAuBordDeLExtinction());
    expect(terminale.crises.alerte).toMatchObject({
      id: "extinction-du-phare",
      cause: "crise.recuperation.socle-de-survie.manquee",
      annonceeA: 5_000,
      ruptureA: 5_120,
      chaineVisible: expect.arrayContaining([
        expect.objectContaining({
          id: "recuperation.socle-de-survie.manquee",
        }),
        expect.objectContaining({
          id: "reponse.stabiliser-anneau-du-halo.indisponible",
        }),
        expect.objectContaining({
          id: "reponse.relayer-halo-par-les-veilleurs.indisponible",
        }),
      ]),
    });

    expect(
      annoncer(
        etatAuBordDeLExtinction({ recuperation: "accomplie" }),
      ).crises.alerte?.id,
    ).toBe("couronne-muette.saturation-du-halo");
    expect(
      annoncer(etatAuBordDeLExtinction({ materiaux: 12 })).crises
        .alerte?.id,
    ).toBe("couronne-muette.saturation-du-halo");

    const premiereCrise = etatAuBordDeLExtinction();
    expect(
      annoncer({
        ...premiereCrise,
        crises: {
          ...creerEtatDesCrisesInitial(),
          recuperations: premiereCrise.crises.recuperations,
        },
      }).crises.alerte,
    ).toBeNull();
  });

  it("laisse toujours répartir les pertes puis éteint le Phare sans créer de Récupération", () => {
    const extinction = atteindreLExtinction();
    expect(extinction).toMatchObject({
      tempsDuConvoi: { secondes: 5_120, vitesse: 0 },
      citeCaravane: { phare: "halo-sature" },
      crises: {
        criseActive: { id: "extinction-du-phare" },
      },
    });
    const projection = projeterCrises(extinction, "fr").active;
    expect(projection).toMatchObject({
      titre: "Crise terminale — Extinction du Phare",
      cause: expect.stringContaining("Récupération manquée"),
      reponses: [
        expect.objectContaining({
          id: "evacuer-le-coeur",
          viable: true,
        }),
        expect.objectContaining({
          id: "transmettre-sous-le-halo",
          viable: true,
        }),
      ],
    });
    expect(projection?.reponses.map(({ id }) => id)).toEqual([
      "evacuer-le-coeur",
      "transmettre-sous-le-halo",
    ]);

    const habitantsAvant = extinction.citeCaravane.habitants;
    const recuperationsAvant = extinction.crises.recuperations;
    const defaite = appliquerCommande(extinction, {
      type: "crise.resoudre",
      criseId: "extinction-du-phare",
      reponseId: "evacuer-le-coeur",
    }).etat;
    expect(defaite.citeCaravane).toMatchObject({
      phare: "eteint",
      habitants: habitantsAvant - 14,
    });
    expect(defaite.denouement).toEqual({
      statut: "defaite",
      choix: "evacuer-le-coeur",
      cause: "crise.recuperation.socle-de-survie.manquee",
      moment: 5_120,
      devenirs: {
        habitants: "evacuation-prioritaire",
        coeur: "abandonne",
        connaissances: "registres-emportes",
      },
    });
    expect(defaite.crises.recuperations).toEqual(recuperationsAvant);
    expect(defaite.narration.faitsDeCampagne.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "crise.extinction-du-phare",
        "defaite.extinction.evacuations-du-coeur",
      ]),
    );
    expect(() =>
      appliquerCommande(defaite, {
        type: "temps-du-convoi.regler-vitesse",
        vitesse: 1,
      }),
    ).toThrow("déjà dénouée");
  });

  it("rend l’aide préparée coûteuse et projette un bilan causal bilingue consultable", () => {
    const extinctionAvecAide = atteindreLExtinction(
      etatAuBordDeLExtinction({ aide: true }),
    );
    expect(
      projeterCrises(extinctionAvecAide, "en").active?.reponses.at(-1),
    ).toMatchObject({
      id: "solliciter-aide-exterieure",
      viable: true,
      coutConnu: "9 inhabitants assigned to the allied evacuation",
    });

    const defaite = appliquerCommande(extinctionAvecAide, {
      type: "crise.resoudre",
      criseId: "extinction-du-phare",
      reponseId: "solliciter-aide-exterieure",
    }).etat;
    expect(defaite.denouement).toMatchObject({
      statut: "defaite",
      choix: "solliciter-aide-exterieure",
      devenirs: {
        habitants: "evacuation-alliee",
        coeur: "confie-aux-allies",
        connaissances: "copies-partagees",
      },
    });

    expect(projeterEpilogue(defaite, "fr")).toMatchObject({
      visible: true,
      denouement: {
        titre: "Dénouement de campagne — Défaite",
        statut: "Campagne terminée avant le Nœud",
        solution: {
          libelle: "Choix terminal",
          valeur: "Solliciter l’aide extérieure",
        },
        cause: {
          libelle: "Cause de l’Extinction",
          valeur: "Récupération échouée — Socle de survie attendu",
        },
      },
      defaite: {
        titre: "Bilan de l’Extinction du Phare",
        habitants: expect.stringContaining("alliance"),
        coeur: expect.stringContaining("alliés"),
        connaissances: expect.stringContaining("copies"),
        journalCausal: expect.arrayContaining([
          expect.objectContaining({
            id: "crise.recuperation.socle-de-survie.manquee",
          }),
          expect.objectContaining({
            id: "couronne.colonies.voie-alliee-preparee",
          }),
          expect.objectContaining({
            titre: "Extinction du Phare",
          }),
          expect.objectContaining({
            id: "defaite.extinction.aide-exterieure-sollicitee",
          }),
        ]),
      },
    });
    expect(projeterEpilogue(defaite, "en").denouement).toMatchObject({
      solution: {
        libelle: "Terminal choice",
        valeur: "Call on external aid",
      },
      cause: {
        libelle: "Cause of Extinction",
        valeur: "Failed recovery — Expected survival baseline",
      },
    });
    expect(projeterEpilogue(defaite, "en").defaite).toMatchObject({
      titre: "Lighthouse Extinction report",
      habitants: expect.stringContaining("allied"),
    });

  });
});
