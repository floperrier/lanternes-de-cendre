import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import type { FaitDeCampagne } from "../simulation/faits";
import { creerCampagneInitiale } from "../simulation/campagne";
import { Epilogue } from "../ui/Epilogue";
import { projeterEpilogue } from "./epilogue";

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

describe("projection accessible de l’Épilogue", () => {
  it("localise d’abord les trois axes, puis les retours causaux", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      tempsDuConvoi: { secondes: 1800, vitesse: 0 as const },
      denouement: {
        statut: "solution-finale" as const,
        solution: "ancrer" as const,
        variante: "refuge-commun" as const,
        cause: "finale.ancrage.la-derniere-negociation",
        moment: 1800,
      },
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
          fait("trame.signal-zero.trace-transmise"),
          fait("finale.ancrage.selection-preparee"),
          fait("finale.ancrage.refuge-commun"),
          fait("epilogue.revelation.registre-rendu-public"),
          fait("epilogue.compagnons.devenirs-partages"),
        ],
      },
    };

    const projection = projeterEpilogue(etat, "fr");

    expect(projection.visible).toBe(true);
    expect(projection.denouement).toEqual({
      titre: "Dénouement de campagne",
      statut: "Campagne conclue",
      solution: {
        libelle: "Solution finale",
        valeur: "Ancrer le cœur",
      },
      variante: {
        libelle: "Variante",
        valeur: "Refuge commun",
      },
      cause: {
        libelle: "Cause",
        valeur: "Dernière négociation de l’Ancrage",
      },
      moment: {
        libelle: "Moment du Dénouement",
        valeur: "30:00",
      },
    });
    expect(projection.axes.map(({ libelle }) => libelle)).toEqual([
      "Stabilité technique",
      "Contrôle politique",
      "Coût humain",
    ]);
    expect(projection.axes.map(({ valeur }) => valeur)).toEqual([
      "stabilité technique partagée",
      "contrôle politique distribué",
      "coût humain contenu",
    ]);
    expect(projection.compagnons.map(({ nom }) => nom)).toEqual([
      "Ilyana Voss",
    ]);
    expect(projection.compagnons[0]?.lien).toBeNull();
    expect(projection.retours.map(({ id }) => id)).toEqual([
      "colonies",
      "sites",
      "cohortes",
      "factions",
      "engagements",
      "traces",
    ]);
    expect(
      projection.retours
        .flatMap(({ elements }) => elements)
        .every(({ causes }) => causes.length > 0),
    ).toBe(true);

    const html = renderToStaticMarkup(
      createElement(Epilogue, { projection, langue: "fr" }),
    );
    expect(html).toContain("Dénouement de campagne");
    expect(html).toContain("Ancrer le cœur");
    expect(html).toContain("Bilan de la Solution");
  });

  it("localise le même contrat en anglais", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...initial,
      tempsDuConvoi: { secondes: 1800, vitesse: 0 as const },
      denouement: {
        statut: "solution-finale" as const,
        solution: "reaccorder" as const,
        variante: "constellation" as const,
        cause: "finale.reaccord.la-derniere-negociation-du-reseau",
        moment: 1800,
      },
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
          fait("prologue.cohorte-accueillie"),
          fait("bassins.conseil.reserves-partagees"),
          fait("finale.reaccord.selection-preparee"),
          fait("finale.reaccord.constellation"),
          fait("epilogue.revelation.copies-confiees-aux-colonies"),
          fait("epilogue.compagnons.devenirs-confies"),
        ],
      },
    };

    const projection = projeterEpilogue(etat, "en");

    expect(projection.titre).toBe("Campaign Epilogue");
    expect(projection.denouement).toMatchObject({
      titre: "Campaign denouement",
      statut: "Campaign concluded",
      solution: {
        libelle: "Final Solution",
        valeur: "Retune the network",
      },
      variante: {
        libelle: "Variant",
        valeur: "Constellation",
      },
    });
    expect(projection.axes[0]).toEqual({
      id: "stabilite-technique",
      libelle: "Technical stability",
      valeur: "maintained mesh stability",
    });
    expect(
      projection.retours
        .find(({ id }) => id === "engagements")
        ?.elements,
    ).toContainEqual({
      id: "transport-autonome-aiguillage-zero",
      nom: "Zero Junction autonomous transport",
      devenir: "active",
      causes: [
        "Last persistent state — Zero Junction autonomous transport : active",
      ],
    });
    expect(
      projection.retours
        .find(({ id }) => id === "engagements")
        ?.elements,
    ).toContainEqual({
      id: "bassins.conseil.reserves-partagees",
      nom: "Reserves shared at the Sluice Council",
      devenir: "active",
      causes: ["Reserves shared at the Sluice Council"],
    });
    expect(
      projection.retours
        .find(({ id }) => id === "cohortes")
        ?.elements.find(({ id }) => id === "cohorte-de-refugies")
        ?.causes,
    ).toEqual(["First Cohort welcomed into the caravan-city"]);
  });
});
