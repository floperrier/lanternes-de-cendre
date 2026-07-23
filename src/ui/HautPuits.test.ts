import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { projeterHautPuits } from "../application/hautPuits";
import {
  ACCES_AU_CONTENU_COMPLET,
  reprendreApplicationCampagne,
} from "../application/application";
import { creerCampagneInitiale } from "../simulation/campagne";
import { HautPuits } from "./HautPuits";

describe("surface accessible de Haut-Puits", () => {
  it("expose la Colonie, le Marché et les décisions dans le DOM", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const etat = {
      ...etatInitial,
      routes: { ...etatInitial.routes, position: "haut-puits" as const },
    };
    const html = renderToStaticMarkup(
      createElement(HautPuits, {
        application: reprendreApplicationCampagne(etat, {
          politiqueDAcces: ACCES_AU_CONTENU_COMPLET,
        }),
        projection: projeterHautPuits(etat),
      }),
    );

    expect(html).toContain('<section class="haut-puits"');
    expect(html).toContain("<h2");
    expect(html).toContain("Marché de l’eau");
    expect(html).toContain("Pièces de filtration");
    expect(html).toContain("Échanges restants : 1");
    expect(html).toContain(
      'aria-label="Conclure l’échange — Pièces de filtration"',
    );
    expect(html).toContain("Transformations possibles");
    expect(html).toContain("Aucune transformation imposée.");
    expect(html).toContain("Partager l’eau");
    expect(html).toContain("Protéger les réserves");
    expect(html).toContain("Événement narratif associé");
    expect(html).not.toContain("Le pacte des citernes");
    expect(html.match(/<button/g)).toHaveLength(2);
  });

  it("ne rend aucune surface lorsque le convoi est ailleurs", () => {
    const etat = creerCampagneInitiale("CENDRE-01");
    expect(
      renderToStaticMarkup(
        createElement(HautPuits, {
          application: reprendreApplicationCampagne(etat),
          projection: projeterHautPuits(etat),
        }),
      ),
    ).toBe("");
  });
});
