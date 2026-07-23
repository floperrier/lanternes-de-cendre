import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import { projeterVeilleBasse } from "./veilleBasse";

describe("projection accessible de Veille-Basse", () => {
  it("expose en français les Pressions, le Marché, les archives, les techniciens et la Cohorte", () => {
    const projection = projeterVeilleBasse(
      creerCampagneInitiale("CENDRE-01"),
      "fr",
    );

    expect(projection).toEqual({
      titre: "Veille-Basse et l’Hospice du Sillon",
      colonie: {
        nom: "Veille-Basse",
        type: "Colonie",
        statut: "Fragile",
        pressions: ["Afflux de déplacés", "Filtres saturés"],
        marche: [
          "Échanger un relevé du Phare mobile contre des filtres étanches",
          "Échanger des Matériaux de charpente contre le renfort des techniciens",
        ],
        archives: "Archives scellées",
        techniciens:
          "2 équipes — maintien des filtres",
        avertissement: null,
      },
      hospice: {
        nom: "Hospice du Sillon",
        type: "Site habité secondaire",
        besoin: "Places filtrées",
        devenir: "Ouvert",
      },
      cohorte: {
        nom: "Cohorte du Sillon",
        origine: "Camp des Digues",
        destination: "Veille-Basse",
        taille: "18 personnes",
        etatDominant: "Épuisée",
        specialite: "Charpente étanche",
        memoire: "Aucune décision",
        integration: "En attente",
      },
      maelys: {
        nom: "Maëlys Rive",
        decision: "Décision en attente",
        position: "À Veille-Basse",
        releve: "Relevé non planifié",
      },
      revelationsEssentielles: [],
    });
  });

  it("fournit la même information en anglais sans dépendre d’une image", () => {
    const projection = projeterVeilleBasse(
      creerCampagneInitiale("CENDRE-01"),
      "en",
    );

    expect(projection).toMatchObject({
      titre: "Lower Watch and Sillon Hospice",
      colonie: {
        type: "Colony",
        statut: "Fragile",
        pressions: ["Displaced influx", "Saturated filters"],
        archives: "Archives sealed",
      },
      hospice: {
        type: "Secondary inhabited site",
        besoin: "Filtered spaces",
      },
      cohorte: {
        origine: "Dike Camp",
        taille: "18 people",
        etatDominant: "Exhausted",
        specialite: "Sealed-frame carpentry",
        memoire: "No decision",
      },
      maelys: {
        decision: "Decision pending",
        position: "At Lower Watch",
        releve: "Survey not planned",
      },
    });
  });
});
