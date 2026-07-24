import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterContratFinal } from "../application/finale";
import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "./campagne";
import type { FaitDeCampagne } from "./faits";
import { reconstruireEtatDuContratFinal } from "./finale";

function fait(id: string, moment = 4_000): FaitDeCampagne {
  return {
    id,
    cause: "test.preparation-finale",
    acteurs: ["porte-lanterne"],
    cible: "coeur-du-noeud",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function preparer(
  faits: readonly string[],
  materiaux = 84,
  habitants = 184,
  eau = 84,
): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-FINALE");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 4_200, vitesse: 0 },
    citeCaravane: { ...initial.citeCaravane, habitants },
    routes: { ...initial.routes, position: "noeud-central" },
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
          eau: {
            ...initial.pilotage.economie.stocks.eau,
            quantite: eau,
          },
        },
      },
    },
    narration: {
      ...initial.narration,
      faitsDeCampagne: faits.map((id) => fait(id)),
    },
  };
}

function reveiller(etat: EtatCampagne) {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  });
}

function choisir(etat: EtatCampagne, choixId: string): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement actif.");
  }
  return reveiller(
    appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat,
  ).etat;
}

function atteindreLaSelection(etat: EtatCampagne): EtatCampagne {
  return choisir(
    reveiller(etat).etat,
    "publier-causes-des-solutions",
  );
}

describe("finale — Ancrer le cœur", () => {
  it("publie trois Solutions et exige un checkpoint avant tout choix irréversible", () => {
    const transition = reveiller(
      preparer(["couronne.approches.berceau-amorce"]),
    );

    expect(transition.evenements[0]).toEqual({
      type: "finale.checkpoint-requis",
      moment: 4_200,
      sauvegardeAtomiqueRequise: true,
    });
    expect(transition.evenements[1]).toMatchObject({
      type: "evenement-narratif.declenche",
      evenementId:
        "finale.ancrage.le-contrat-des-trois-solutions",
    });
    const projection = projeterContratFinal(transition.etat);
    expect(projection.solutions).toHaveLength(3);
    expect(projection.solutions.every(({ causes }) => causes.length > 0))
      .toBe(true);
  });

  it("Ancre une préparation au coût exact puis n’expose que les négociations crédibles", () => {
    const selection = atteindreLaSelection(
      preparer([
        "couronne.approches.berceau-amorce",
        "couronne.ouverture.clef-collective",
        "couronne.colonies.voie-alliee-preparee",
        "trame.aiguillage-zero.charte-partagee",
        "couronne.tete-de-ligne.mandat-republicain",
      ]),
    );
    const choix = projeterCampagne(selection).evenementNarratif?.choix;
    expect(choix).toEqual(
      expect.arrayContaining([
      expect.objectContaining({
        id: "selectionner-ancrage-prepare",
        coutsConnus: [expect.stringContaining("4 Matériaux")],
      }),
      ]),
    );
    const materiauxAvant =
      selection.pilotage.economie.stocks.materiaux.quantite;
    const negociation = choisir(
      selection,
      "selectionner-ancrage-prepare",
    );
    expect(
      negociation.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 4);
    expect(
      projeterCampagne(negociation).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "negocier-refuge-commun",
      "negocier-citadelle-de-cendre",
      "tenir-dernier-rempart",
    ]);

    const conclue = choisir(negociation, "negocier-refuge-commun");
    expect(reconstruireEtatDuContratFinal(conclue)).toMatchObject({
      selection: "ancrage-prepare",
      varianteFinale: "refuge-commun",
      bilan: {
        stabilite: "stable",
        controle: "partage",
        coutHumain: "contenu",
      },
    });
  });

  it("annonce et applique le coût risqué sans tirage final ni Compagnon requis", () => {
    const selection = atteindreLaSelection(
      preparer(["couronne.ouverture.breche-ouverte"]),
    );
    expect(
      projeterCampagne(selection).evenementNarratif?.choix,
    ).toEqual([
      expect.objectContaining({
        id: "selectionner-ancrage-risque",
        coutsConnus: [
          expect.stringContaining("10 Matériaux"),
        ],
      }),
    ]);
    expect(
      projeterCampagne(selection).evenementNarratif?.choix[0]
        ?.coutsConnus[0],
    ).toContain("8 Habitants");

    const materiauxAvant =
      selection.pilotage.economie.stocks.materiaux.quantite;
    const habitantsAvant = selection.citeCaravane.habitants;
    const negociation = choisir(
      selection,
      "selectionner-ancrage-risque",
    );
    expect(
      negociation.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 10);
    expect(negociation.citeCaravane.habitants).toBe(
      habitantsAvant - 8,
    );
    expect(
      projeterCampagne(negociation).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["tenir-dernier-rempart"]);

    const conclue = choisir(negociation, "tenir-dernier-rempart");
    expect(reconstruireEtatDuContratFinal(conclue)).toMatchObject({
      selection: "ancrage-risque",
      varianteFinale: "dernier-rempart",
      bilan: {
        stabilite: "sous-contrainte",
        controle: "equipes",
        coutHumain: "eleve",
      },
    });
  });

  it("laisse une Solution impossible consultable mais non sélectionnable", () => {
    const selection = atteindreLaSelection(
      preparer(["couronne.approches.berceau-amorce"], 3),
    );
    expect(
      projeterCampagne(selection).evenementNarratif?.choix,
    ).toEqual([]);
    expect(
      reconstruireEtatDuContratFinal(selection).solutions.ancrer,
    ).toMatchObject({
      statut: "impossible",
      selectionnable: false,
      cout: { materiaux: 4, eau: 0, habitants: 0 },
      causes: expect.arrayContaining(["materiaux-insuffisants"]),
    });
    expect(
      projeterContratFinal(selection).solutions.find(
        ({ id }) => id === "ancrer",
      )?.resume,
    ).toContain("impossible");
  });

  it("fige le diagnostic du contrat avant d’en déduire le coût payé", () => {
    const selection = atteindreLaSelection(
      preparer(["couronne.approches.berceau-amorce"], 4),
    );
    const apresPaiement = choisir(
      selection,
      "selectionner-ancrage-prepare",
    );

    expect(
      apresPaiement.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(0);
    expect(
      reconstruireEtatDuContratFinal(apresPaiement).solutions
        .ancrer,
    ).toMatchObject({
      statut: "preparee",
      selectionnable: true,
      causes: expect.arrayContaining(["ressources-suffisantes"]),
    });
  });

  it("reproduit exactement la même conclusion depuis le même état", () => {
    const origine = preparer([
      "couronne.approches.berceau-amorce",
      "couronne.ouverture.clef-collective",
      "trame.aiguillage-zero.charte-partagee",
    ]);
    const conclure = () => {
      let etat = atteindreLaSelection(origine);
      etat = choisir(etat, "selectionner-ancrage-prepare");
      return choisir(etat, "negocier-refuge-commun");
    };

    const premiere = conclure();
    const seconde = conclure();
    expect(empreinteEtat(premiere)).toBe(empreinteEtat(seconde));
    expect(premiere).toEqual(seconde);
  });
});

describe("finale — Réaccorder le réseau", () => {
  const preparationPartagee = [
    "couronne.approches.etalon-calibre",
    "couronne.tete-de-ligne.atelier-commun",
    "couronne.colonies.voie-alliee-preparee",
    "trame.aiguillage-zero.charte-partagee",
    "couronne.tete-de-ligne.mandat-republicain",
  ] as const;

  it("prépare le Réaccord par plusieurs combinaisons d’appuis", () => {
    expect(
      reconstruireEtatDuContratFinal(
        preparer(preparationPartagee),
      ).solutions.reaccorder.statut,
    ).toBe("preparee");
    expect(
      reconstruireEtatDuContratFinal(
        preparer([
          "couronne.approches.etalon-calibre",
          "couronne.tete-de-ligne.mandat-republicain",
        ]),
      ).solutions.reaccorder.statut,
    ).toBe("risquee");
    expect(
      reconstruireEtatDuContratFinal(
        preparer([
          "couronne.approches.etalon-calibre",
          "couronne.tete-de-ligne.atelier-commun",
          "couronne.tete-de-ligne.mandat-republicain",
        ]),
      ).solutions.reaccorder.statut,
    ).toBe("preparee");
  });

  it("paie le Réaccord préparé puis n’expose que les propriétaires crédibles", () => {
    const selection = atteindreLaSelection(
      preparer(preparationPartagee),
    );
    expect(
      projeterCampagne(selection).evenementNarratif?.choix,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "selectionner-reaccord-prepare",
          coutsConnus: [
            expect.stringContaining("4 Eau et 4 Matériaux"),
          ],
        }),
      ]),
    );
    const eauAvant =
      selection.pilotage.economie.stocks.eau.quantite;
    const materiauxAvant =
      selection.pilotage.economie.stocks.materiaux.quantite;

    const negociation = choisir(
      selection,
      "selectionner-reaccord-prepare",
    );

    expect(
      negociation.pilotage.economie.stocks.eau.quantite,
    ).toBe(eauAvant - 4);
    expect(
      negociation.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 4);
    expect(
      projeterCampagne(negociation).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "mailler-la-constellation",
      "confier-le-reseau-de-fer",
      "separer-les-veilles",
    ]);

    const conclue = choisir(
      negociation,
      "mailler-la-constellation",
    );
    expect(reconstruireEtatDuContratFinal(conclue)).toMatchObject({
      selection: "reaccord-prepare",
      varianteFinale: "constellation",
      bilan: {
        stabilite: "maillee",
        controle: "coalition",
        coutHumain: "contenu",
      },
    });
  });

  it("rend le Réaccord risqué déterministe et garde les Veilles comme repli", () => {
    const origine = preparer([
      "couronne.approches.etalon-calibre",
    ]);
    const conclure = () => {
      const selection = atteindreLaSelection(origine);
      expect(
        projeterCampagne(selection).evenementNarratif?.choix,
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "selectionner-reaccord-risque",
            coutsConnus: [
              expect.stringContaining("10 Eau et 8 Matériaux"),
            ],
          }),
        ]),
      );
      const negociation = choisir(
        selection,
        "selectionner-reaccord-risque",
      );
      expect(
        projeterCampagne(negociation).evenementNarratif?.choix.map(
          ({ id }) => id,
        ),
      ).toEqual(["separer-les-veilles"]);
      return choisir(negociation, "separer-les-veilles");
    };

    const premiere = conclure();
    const seconde = conclure();
    expect(empreinteEtat(premiere)).toBe(empreinteEtat(seconde));
    expect(reconstruireEtatDuContratFinal(premiere)).toMatchObject({
      selection: "reaccord-risque",
      varianteFinale: "veilles-dispersees",
      bilan: {
        stabilite: "fragmentee",
        controle: "sans-proprietaire",
        coutHumain: "eleve",
      },
    });
  });

  it("nomme le monopole qui rend le Réseau de fer crédible", () => {
    const selection = atteindreLaSelection(
      preparer([
        "couronne.approches.etalon-calibre",
        "couronne.tete-de-ligne.atelier-commun",
        "trame.aiguillage-zero.monopole-republicain",
      ]),
    );
    const negociation = choisir(
      selection,
      "selectionner-reaccord-prepare",
    );
    const projection =
      projeterCampagne(negociation).evenementNarratif;

    expect(projection?.variante).toContain("monopole républicain");
    expect(projection?.choix.map(({ id }) => id)).toEqual([
      "confier-le-reseau-de-fer",
      "separer-les-veilles",
    ]);
  });

  it("interdit le Réaccord si la brèche a détruit les bus", () => {
    const selection = atteindreLaSelection(
      preparer([
        "couronne.approches.etalon-calibre",
        "couronne.colonies.voie-alliee-preparee",
        "trame.aiguillage-zero.charte-partagee",
        "couronne.ouverture.breche-ouverte",
      ]),
    );

    expect(
      projeterCampagne(selection).evenementNarratif?.choix.some(
        ({ id }) => id.startsWith("selectionner-reaccord"),
      ),
    ).toBe(false);
    expect(
      reconstruireEtatDuContratFinal(selection).solutions.reaccorder,
    ).toMatchObject({
      statut: "impossible",
      selectionnable: false,
      causes: expect.arrayContaining(["noeud-endommage"]),
    });
  });

  it("fige le diagnostic après le paiement exact en Eau et Matériaux", () => {
    const selection = atteindreLaSelection(
      preparer(preparationPartagee, 4, 184, 4),
    );
    const apresPaiement = choisir(
      selection,
      "selectionner-reaccord-prepare",
    );

    expect(
      apresPaiement.pilotage.economie.stocks.eau.quantite,
    ).toBe(0);
    expect(
      apresPaiement.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(0);
    expect(
      reconstruireEtatDuContratFinal(apresPaiement).solutions
        .reaccorder,
    ).toMatchObject({
      statut: "preparee",
      selectionnable: true,
      causes: expect.arrayContaining(["ressources-suffisantes"]),
    });
  });

  it.each([
    {
      nom: "préparé",
      faits: preparationPartagee,
      statut: "preparee",
      selection: "selectionner-reaccord-prepare",
      variante: "mailler-la-constellation",
    },
    {
      nom: "risqué",
      faits: ["couronne.approches.etalon-calibre"],
      statut: "risquee",
      selection: "selectionner-reaccord-risque",
      variante: "separer-les-veilles",
    },
    {
      nom: "impossible",
      faits: [
        "couronne.approches.etalon-calibre",
        "couronne.ouverture.breche-ouverte",
      ],
      statut: "impossible",
      selection: undefined,
      variante: undefined,
    },
  ] as const)(
    "rejoue l’état, les explications et l’empreinte du scénario $nom",
    ({ faits, statut, selection, variante }) => {
      const executer = () => {
        const auContrat = atteindreLaSelection(preparer(faits));
        const projection = projeterContratFinal(auContrat);
        const explications = projection.solutions.find(
          ({ id }) => id === "reaccorder",
        )?.causes;
        if (selection === undefined || variante === undefined) {
          return { etat: auContrat, explications };
        }
        const enNegociation = choisir(auContrat, selection);
        return {
          etat: choisir(enNegociation, variante),
          explications,
        };
      };

      const premiere = executer();
      const seconde = executer();

      expect(
        reconstruireEtatDuContratFinal(
          atteindreLaSelection(preparer(faits)),
        ).solutions.reaccorder.statut,
      ).toBe(statut);
      expect(premiere.explications).toEqual(seconde.explications);
      expect(premiere.explications).not.toHaveLength(0);
      expect(empreinteEtat(premiere.etat)).toBe(
        empreinteEtat(seconde.etat),
      );
      expect(premiere.etat).toEqual(seconde.etat);
    },
  );
});
