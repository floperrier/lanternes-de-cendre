import { describe, expect, it } from "vitest";

import type { FaitDeCampagne } from "./faits";
import { creerCampagneInitiale } from "./campagne";
import {
  reconstruireEpilogue,
  restituerDevenirsDesCompagnons,
  type EtatDUnCompagnonPourEpilogue,
} from "./epilogue";

function fait(id: string): FaitDeCampagne {
  return {
    id,
    cause: `cause:${id}`,
    acteurs: ["porte-lanterne"],
    cible: "epilogue",
    moment: 1800,
    effets: { materiels: [], humains: [] },
  };
}

describe("devenirs des Compagnons", () => {
  it("restitue recrutés, morts et partis sans relation inventée", () => {
    const compagnons: readonly EtatDUnCompagnonPourEpilogue[] = [
      {
        id: "ilyana-voss",
        statut: "recrute",
        sante: "stabilisee",
        projet: "accompli",
        lien: {
          id: "registre-et-releve",
          avec: "maelys-rive",
          etat: "depot-commun",
        },
        rancune: null,
      },
      {
        id: "maelys-rive",
        statut: "absent",
        sante: "inconnue",
        projet: "inconnu",
        lien: null,
        rancune: null,
      },
      {
        id: "sira-vel",
        statut: "mort",
        sante: "mort-en-mission",
        projet: "transmis",
        lien: null,
        rancune: {
          id: "promesse-de-soin-rompue",
          cause: "fait.test",
          cible: "porte-lanterne",
          reparation: "nommer-la-dette",
        },
      },
      {
        id: "noor-selan",
        statut: "parti",
        sante: "convalescente",
        projet: "poursuivi-ailleurs",
        lien: {
          id: "relation-inexistante",
          avec: "bastien-roux",
          etat: "invente",
        },
        rancune: {
          id: "cible-sans-lien",
          cause: "fait.test",
          cible: "bastien-roux",
          reparation: "impossible",
        },
      },
    ];

    expect(restituerDevenirsDesCompagnons(compagnons)).toEqual([
      {
        id: "ilyana-voss",
        statut: "recrute",
        sante: "stabilisee",
        projet: "accompli",
        lien: null,
        rancune: null,
      },
      {
        id: "sira-vel",
        statut: "mort",
        sante: "mort-en-mission",
        projet: "transmis",
        lien: null,
        rancune: {
          id: "promesse-de-soin-rompue",
          cause: "fait.test",
          cible: "porte-lanterne",
          reparation: "nommer-la-dette",
        },
      },
      {
        id: "noor-selan",
        statut: "parti",
        sante: "convalescente",
        projet: "poursuivi-ailleurs",
        lien: null,
        rancune: null,
      },
    ]);
  });
});

describe("Épilogue de campagne", () => {
  it("place les trois axes avant tous les retours modulaires et garde leurs causes", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      narration: {
        ...initial.narration,
        evenementsJoues: [
          "couronne.ouverture.ilyana-maelys-et-la-clef",
          "epilogue.compagnons.le-dernier-tour-de-veille",
        ],
        faitsDeCampagne: [
          fait("compagnon.ilyana-voss.affectee-intendance"),
          fait("veille-basse.maelys-mission-confiee"),
          fait("couronne.ouverture.clef-collective"),
          fait("bassins.haut-puits.pacte-partage"),
          fait("veille-basse.cohorte-accueillie"),
          fait("trame.aiguillage-zero.charte-partagee"),
          fait("trame.signal-zero.trace-transmise"),
          fait("finale.ancrage.selection-preparee"),
          fait("finale.ancrage.refuge-commun"),
          fait("epilogue.revelation.registre-rendu-public"),
          fait("epilogue.compagnons.devenirs-partages"),
        ],
      },
    };

    const epilogue = reconstruireEpilogue(etat);

    expect(epilogue.visible).toBe(true);
    expect(epilogue.axes).toEqual([
      { id: "stabilite-technique", valeur: "stable" },
      { id: "controle-politique", valeur: "partage" },
      { id: "cout-humain", valeur: "contenu" },
    ]);
    expect(epilogue.compagnons.map(({ id }) => id)).toEqual([
      "ilyana-voss",
    ]);
    expect(epilogue.compagnons[0]?.lien).toBeNull();
    expect(epilogue.retours.colonies).toHaveLength(5);
    expect(epilogue.retours.sites).toHaveLength(12);
    expect(epilogue.retours.cohortes).toHaveLength(2);
    expect(epilogue.retours.factions).toHaveLength(3);
    expect(epilogue.retours.traces).toContainEqual(
      expect.objectContaining({
        id: "trame.signal-zero.trace-transmise",
        causes: ["trame.signal-zero.trace-transmise"],
      }),
    );
    for (const retour of Object.values(epilogue.retours).flat()) {
      expect(retour.causes.length).toBeGreaterThan(0);
    }
  });

  it("reste masqué tant que le récit collectif n’a pas consigné les devenirs", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      narration: {
        ...initial.narration,
        faitsDeCampagne: [
          fait("finale.precipitation.selection-risquee"),
          fait("finale.precipitation.pluie-noire"),
          fait("epilogue.revelation.copies-confiees-aux-colonies"),
        ],
      },
    };

    expect(reconstruireEpilogue(etat).visible).toBe(false);
  });

  it("ne transforme pas les choix de Maëlys en recrutement ou départ", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      narration: {
        ...initial.narration,
        faitsDeCampagne: [
          fait("veille-basse.maelys-mission-confiee"),
          fait("couronne.seuil.registre-commun"),
          fait("finale.reaccord.selection-preparee"),
          fait("finale.reaccord.constellation"),
          fait("epilogue.revelation.registre-rendu-public"),
          fait("epilogue.compagnons.devenirs-partages"),
        ],
      },
    };

    const epilogue = reconstruireEpilogue(etat);

    expect(epilogue.compagnons.map(({ id }) => id)).toEqual([
      "ilyana-voss",
    ]);
    expect(
      epilogue.retours.colonies.find(({ id }) => id === "seuil")?.causes,
    ).toContain("couronne.seuil.registre-commun");
    expect(epilogue.retours.engagements).toContainEqual({
      id: "couronne.seuil.registre-commun",
      etat: "actif",
      causes: ["couronne.seuil.registre-commun"],
    });
  });

  it("fusionne un Engagement sémantique et son Fait sans doublon", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      trameDeFer: {
        ...initial.trameDeFer,
        engagements: [
          {
            id: "transport-autonome-aiguillage-zero" as const,
            prisA: 1200,
            avec: "puits-libres" as const,
            statut: "actif" as const,
          },
        ],
      },
      narration: {
        ...initial.narration,
        faitsDeCampagne: [
          fait("trame.aiguillage-zero.engagement-transport-autonome"),
          fait("finale.reaccord.selection-preparee"),
          fait("finale.reaccord.constellation"),
          fait("epilogue.revelation.registre-rendu-public"),
          fait("epilogue.compagnons.devenirs-partages"),
        ],
      },
    };

    expect(reconstruireEpilogue(etat).retours.engagements).toEqual([
      {
        id: "transport-autonome-aiguillage-zero",
        etat: "actif",
        causes: [
          "etat:transport-autonome-aiguillage-zero:actif",
          "trame.aiguillage-zero.engagement-transport-autonome",
        ],
      },
    ]);
  });
});
