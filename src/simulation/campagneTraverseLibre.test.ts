import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterTraverseLibre } from "../application/traverseLibre";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { IdentifiantDeTroncon } from "./routes";
import {
  appliquerDecisionDeLaTrameDeFer,
  creerEtatInitialDeLaTrameDeFer,
} from "./trameFer";
import {
  appliquerDecisionDeTraverseLibre,
  creerEtatInitialDeTraverseLibre,
} from "./traverseLibre";

function aLaLisiere(): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-TRAVERSE");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 4 },
    routes: { ...initial.routes, position: "lisiere-trame-de-fer" },
    narration: {
      ...initial.narration,
      faitsDeCampagne: [
        {
          id: "bassins.deversoir.ligne-zero-relevee",
          cause: "bassins.deversoir.la-conduite-zero",
          acteurs: ["porte-lanterne"],
          cible: "conduite-de-la-ligne-zero",
          moment: 2_000,
          effets: { materiels: [], humains: [] },
        },
      ],
    },
  };
}

function voyager(
  etat: EtatCampagne,
  tronconId: IdentifiantDeTroncon,
): EtatCampagne {
  const engage = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId,
  }).etat;
  const enMarche = appliquerCommande(engage, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(enMarche, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 300,
  }).etat;
}

function resoudreEtContinuer(
  etat: EtatCampagne,
  choixId: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement de Traverse-Libre n’est actif.");
  }
  const resolu = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId,
  }).etat;
  return appliquerCommande(resolu, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

describe("embranchement autonome de Traverse-Libre", () => {
  it("rend les cinq Événements jouables et conserve réservoirs, dépendances, marché et contournement", () => {
    let etat = voyager(
      aLaLisiere(),
      "embranchement-de-pompe-neuve",
    );
    expect(etat.routes.position).toBe("pompe-neuve");
    expect(etat.narration.evenementActif).toBe(
      "trame.pompe-neuve.l-embranchement-sans-garde",
    );
    etat = resoudreEtContinuer(etat, "suivre-balises-libres");
    etat = resoudreEtContinuer(etat, "livrer-discretement");
    etat = resoudreEtContinuer(etat, "lever-vanne-du-contournement");

    etat = {
      ...etat,
      routes: {
        ...etat.routes,
        etatsReels: {
          ...etat.routes.etatsReels,
          "galerie-des-reservoirs": "coupe",
        },
      },
      pilotage: {
        ...etat.pilotage,
        economie: {
          ...etat.pilotage.economie,
          stocks: {
            ...etat.pilotage.economie.stocks,
            materiaux: {
              ...etat.pilotage.economie.stocks.materiaux,
              quantite: 0,
            },
          },
        },
      },
    };
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.find(
        ({ id }) => id === "etayer-galerie",
      ),
    ).toMatchObject({
      disponible: false,
      indisponibilite: "Stock insuffisant pour ce coût.",
    });
    etat = resoudreEtContinuer(etat, "ouvrir-contournement");
    expect(etat.routes.etatsReels["galerie-des-reservoirs"]).toBe(
      "degrade",
    );

    etat = voyager(etat, "galerie-des-reservoirs");
    expect(etat.routes.position).toBe("traverse-libre");
    etat = resoudreEtContinuer(etat, "sceller-registre");

    expect(etat.traverseLibre).toMatchObject({
      statut: "autonome",
      approche: "balises-libres",
      pressions: {
        filtres: "rationnes",
        isolement: "leve",
      },
      marche: {
        lotsDeFiltresManquants: 1,
        lotsDeRemedesManquants: 1,
        reservesDEauDisponibles: 2,
      },
      contournement: "praticable",
      dependancesAuRail: {
        filtres: "critique",
        remedes: "critique",
        debouches: "autonomes",
      },
      routeSecondaire: {
        statut: "contournee",
        issueCouteuse: "dette-de-filtres",
      },
      aide: {
        statut: "discrete",
        connueDeLaRepublique: false,
      },
      relationPuitsLibres: "cooperative",
      registre: "scelle",
    });
    expect(projeterTraverseLibre(etat)).toMatchObject({
      visible: true,
      titre: "Traverse-Libre",
      statut: "Colonie autonome",
      pressions: ["Filtres rationnés", "Isolement levé"],
      contournement: "Praticable",
      route: "Galerie contournée",
    });
    expect(projeterTraverseLibre(etat, "en")).toMatchObject({
      titre: "Free Crossing",
      statut: "Autonomous colony",
      pressions: ["Filters rationed", "Isolation lifted"],
      libelles: {
        marche: "Finite market",
        dependances: "Rail dependencies",
      },
    });
  });

  it("ne ferme la relation républicaine que pour un acte connu ou une rupture d’Engagement", () => {
    const initial = creerEtatInitialDeLaTrameDeFer();
    const discretSansEngagement = appliquerDecisionDeLaTrameDeFer(
      initial,
      "trame.pompe-neuve.les-filtres-du-rail",
      "livrer-discretement",
      1,
    );
    expect(discretSansEngagement.relationRepublique).toBe(
      initial.relationRepublique,
    );

    const avecControle = appliquerDecisionDeLaTrameDeFer(
      initial,
      "trame.pompe-neuve.l-embranchement-sans-garde",
      "faire-verifier-aiguillage",
      1,
    );
    expect(avecControle.engagements.map(({ id }) => id)).toEqual([
      "controle-de-pompe-neuve",
    ]);
    expect(
      appliquerDecisionDeLaTrameDeFer(
        avecControle,
        "trame.pompe-neuve.les-filtres-du-rail",
        "livrer-discretement",
        2,
      ).relationRepublique,
    ).toBe("fermee");
    expect(
      appliquerDecisionDeLaTrameDeFer(
        avecControle,
        "trame.pompe-neuve.les-filtres-du-rail",
        "inscrire-livraison",
        2,
      ).relationRepublique,
    ).toBe("fermee");

    const engagementLocal = appliquerDecisionDeLaTrameDeFer(
      initial,
      "trame.barriere-neuve.le-permis-des-essieux",
      "demander-droit-local",
      1,
    );
    expect(
      appliquerDecisionDeLaTrameDeFer(
        { ...engagementLocal, relationRepublique: "cooperative" },
        "trame.pompe-neuve.les-filtres-du-rail",
        "livrer-discretement",
        2,
      ).relationRepublique,
    ).toBe("cooperative");
  });

  it("sépare le renseignement de l’aide et ne rend jamais une aide publique discrète", () => {
    const apresControle = appliquerDecisionDeTraverseLibre(
      creerEtatInitialDeTraverseLibre(),
      "trame.pompe-neuve.l-embranchement-sans-garde",
      "faire-verifier-aiguillage",
    );
    expect(apresControle).toMatchObject({
      approche: "controle-republicain",
      contournement: "inconnu",
      aide: {
        statut: "aucune",
        connueDeLaRepublique: false,
      },
    });

    const aidePublique = appliquerDecisionDeTraverseLibre(
      apresControle,
      "trame.pompe-neuve.les-filtres-du-rail",
      "inscrire-livraison",
    );
    const registreScelle = appliquerDecisionDeTraverseLibre(
      aidePublique,
      "trame.traverse-libre.maelys-et-le-manifeste",
      "sceller-registre",
    );
    expect(registreScelle).toMatchObject({
      aide: {
        statut: "publique",
        connueDeLaRepublique: true,
      },
      registre: "scelle",
    });
  });
});
