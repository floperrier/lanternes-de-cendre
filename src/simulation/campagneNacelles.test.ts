import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
  type FaitDeCampagne,
} from "./campagne";
import { listerTronconsEngageables } from "./routes";

const EVENEMENTS_ANTERIEURS = [
  "prologue.signaux-sous-la-cendre",
  "prologue.reponse-du-phare",
  "prologue.filtres-de-la-veille",
  "prologue.ilyana-au-clapet",
  "veille-basse.la-place-sous-le-phare",
  "veille-basse.la-porte-des-filtres",
  "veille-basse.les-registres-du-reflux",
  "veille-basse.maelys-et-le-coffret",
  "bassins.haut-puits.pacte-des-citernes",
  "bassins.haut-puits.vanniers-du-panache",
  "bassins.haut-puits.boues-du-decanteur",
  "bassins.haut-puits.ilyana-et-la-vanne",
] as const;

function fait(id: string): FaitDeCampagne {
  return {
    id,
    cause: "preparation-des-nacelles",
    acteurs: ["porte-lanterne"],
    cible: "nacelliers-des-vannes",
    moment: 900,
    effets: { materiels: [], humains: [] },
  };
}

function preparerApprocheHaute(): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-NACELLES");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 40_000, vitesse: 1 },
    routes: { ...initial.routes, position: "les-vanniers" },
    hautPuits: {
      ...initial.hautPuits,
      relationPublique: "cooperative",
    },
    narration: {
      evenementActif: null,
      evenementsJoues: EVENEMENTS_ANTERIEURS,
      faitsDeCampagne: [
        fait("bassins.haut-puits.panache-confine"),
        fait("bassins.haut-puits.ilyana-garante"),
      ],
    },
  };
}

function resoudreEtDeclencherSuite(
  etat: EtatCampagne,
  choixId: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement des Nacelles n’est actif.");
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

function atteindreVeilleBasseApresSonRecit(): EtatCampagne {
  let etat = appliquerCommande(creerCampagneInitiale("CENDRE-NACELLES-BASSE"), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  const choix = new Map([
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
    ["veille-basse.la-place-sous-le-phare", "accueillir"],
    ["veille-basse.la-porte-des-filtres", "renforcer-sas"],
    ["veille-basse.les-registres-du-reflux", "copier-registres"],
    ["veille-basse.maelys-et-le-coffret", "confier-coffret"],
  ]);
  for (let index = 0; index < 4; index += 1) {
    const evenementId = etat.narration.evenementActif!;
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId: choix.get(evenementId)!,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 1,
    }).etat;
  }
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "chaussee-de-veille-basse",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 120,
  }).etat;
  {
    const evenementId = etat.narration.evenementActif!;
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId: choix.get(evenementId)!,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 151,
    }).etat;
  }
  for (let index = 0; index < 3; index += 1) {
    const evenementId = etat.narration.evenementActif!;
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId: choix.get(evenementId)!,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 1,
    }).etat;
  }
  return etat;
}

describe("convergence jouable aux Nacelles", () => {
  it("applique le coût causal dans un nouvel Engagement puis condamne tout retour", () => {
    const avant = preparerApprocheHaute();
    const combustibleAvant =
      avant.pilotage.economie.stocks.combustible.quantite;
    const eauAvant = avant.pilotage.economie.stocks.eau.quantite;

    const engagement = appliquerCommande(avant, {
      type: "engagement-de-route.confirmer",
      tronconId: "chenal-des-vannes",
    });

    expect(engagement.evenements).toContainEqual(
      expect.objectContaining({
        type: "engagement-de-route.confirme",
        tronconId: "chenal-des-vannes",
        origine: "les-vanniers",
        destination: "relais-des-vannes",
        consommationsAppliquees: { combustible: 4, eau: 6 },
      }),
    );
    expect(
      engagement.etat.pilotage.economie.stocks.combustible.quantite,
    ).toBe(combustibleAvant - 4);
    expect(engagement.etat.pilotage.economie.stocks.eau.quantite).toBe(
      eauAvant - 6,
    );

    const enMouvement = appliquerCommande(engagement.etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    const arrivee = appliquerCommande(enMouvement, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 75,
    }).etat;

    expect(arrivee.routes.position).toBe("relais-des-vannes");
    expect(arrivee.routes.etatsReels["chenal-des-vannes"]).toBe("coupe");
    expect(listerTronconsEngageables(arrivee.routes)).toEqual([]);
    expect(arrivee.narration.evenementActif).toBe(
      "bassins.nacelles.le-poids-des-deux-rives",
    );
  });

  it("rend aussi la branche basse atteignable avec sa Cohorte et son coût figé", () => {
    const avant = atteindreVeilleBasseApresSonRecit();
    const combustibleAvant =
      avant.pilotage.economie.stocks.combustible.quantite;
    const eauAvant = avant.pilotage.economie.stocks.eau.quantite;

    let etat = appliquerCommande(avant, {
      type: "engagement-de-route.confirmer",
      tronconId: "nacelles-de-veille-basse",
    }).etat;

    expect(etat.routes.engagements.at(-1)).toMatchObject({
      origine: "veille-basse",
      destination: "relais-des-vannes",
      consommationsAppliquees: { combustible: 5, eau: 7 },
    });
    expect(etat.pilotage.economie.stocks.combustible.quantite).toBe(
      combustibleAvant - 5,
    );
    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(
      eauAvant - 7,
    );

    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;

    expect(etat.routes.position).toBe("relais-des-vannes");
    expect(etat.narration.evenementActif).toBe(
      "bassins.nacelles.le-poids-des-deux-rives",
    );
  });

  it("n’offre l’Intervention clandestine qu’après la Cible et conserve sa Trace jusqu’au Conseil", () => {
    let etat = appliquerCommande(preparerApprocheHaute(), {
      type: "engagement-de-route.confirmer",
      tronconId: "chenal-des-vannes",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 75,
    }).etat;

    expect(etat.narration.evenementActif).toBe(
      "bassins.nacelles.le-poids-des-deux-rives",
    );
    expect(
      etat.narration.faitsDeCampagne.some((candidat) =>
        candidat.id.startsWith("bassins.nacelles.cible-frein-"),
      ),
    ).toBe(false);

    etat = resoudreEtDeclencherSuite(etat, "partager-contrepoids");
    expect(etat.narration.evenementActif).toBe(
      "bassins.nacelles.le-frein-sous-la-cendre",
    );
    etat = resoudreEtDeclencherSuite(etat, "baliser-frein");
    expect(etat.narration.evenementActif).toBe(
      "bassins.nacelles.la-main-sur-le-frein",
    );
    expect(
      etat.narration.faitsDeCampagne.some(
        (candidat) =>
          candidat.id === "bassins.nacelles.cible-frein-balisee" &&
          candidat.cible === "frein-magnetique-des-nacelles",
      ),
    ).toBe(true);

    etat = resoudreEtDeclencherSuite(
      etat,
      "intervenir-clandestinement",
    );
    expect(etat.narration.evenementActif).toBe(
      "bassins.nacelles.deux-voix-dans-le-cable",
    );
    expect(
      etat.narration.faitsDeCampagne.some(
        (candidat) =>
          candidat.id === "bassins.nacelles.trace-laiton-persistante",
      ),
    ).toBe(true);
    etat = resoudreEtDeclencherSuite(etat, "porter-passage-partage");
    expect(etat.narration.faitsDeCampagne.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "bassins.nacelles.trace-laiton-persistante",
        "bassins.nacelles.conseil-passage-partage",
      ]),
    );
  });
});
