import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type {
  ApplicationCampagne,
  ProjectionEvenementNarratif,
} from "../application/application";
import { RubanNarratif } from "./RubanNarratif";

function application(
  commandeAutorisee: boolean,
): ApplicationCampagne {
  return {
    lireEtat: () => {
      throw new Error("État non requis par ce test de présentation.");
    },
    commandeEstAutorisee: () => commandeAutorisee,
    envoyerCommande: () => {
      throw new Error("Commande non attendue au rendu serveur.");
    },
    sabonner: () => () => undefined,
    sabonnerAuxCommandes: () => () => undefined,
  };
}

function evenement(id: string): ProjectionEvenementNarratif {
  return {
    id,
    origine: "Le cœur du Nœud",
    libelleIntentions: "Décision",
    titre: "Choisir",
    presentation: "Le contrat attend.",
    variante: "Aucun tirage.",
    informations: [],
    asset: null,
    choix: [
      {
        id: "selectionner-ancrage-risque",
        intention: "Ancrer le cœur",
        coutsConnus: ["10 Matériaux · 8 Habitants"],
      },
    ],
  };
}

describe("ruban narratif de la décision finale", () => {
  it("désactive le choix et explique le checkpoint en attente", () => {
    const html = renderToStaticMarkup(
      createElement(RubanNarratif, {
        application: application(false),
        evenement: evenement(
          "finale.ancrage.choisir-d-ancrer-le-coeur",
        ),
        langue: "fr",
      }),
    );

    expect(html).toContain("disabled");
    expect(html).toContain(
      "Le point de reprise doit être enregistré avant cette décision.",
    );
  });

  it("n’attribue pas un autre refus au checkpoint final", () => {
    const html = renderToStaticMarkup(
      createElement(RubanNarratif, {
        application: application(false),
        evenement: evenement("autre-evenement"),
        langue: "fr",
      }),
    );

    expect(html).toContain("disabled");
    expect(html).not.toContain("point de reprise");
  });
});
