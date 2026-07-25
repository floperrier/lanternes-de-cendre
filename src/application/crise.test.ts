import { describe, expect, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "../simulation/campagne";
import { projeterCrises } from "./crise";
import { projeterPilotage } from "./pilotage";

function etatEnCrise() {
  let etat = creerCampagneInitiale("CENDRE-01");
  etat = appliquerCommande(etat, {
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "maintenir-debit",
  }).etat;
  const checkpoint = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 180,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
}

function etatEnCriseAVeilleBasse(
  declencherLaCrise = true,
) {
  let etat = appliquerCommande(
    creerCampagneInitiale("CENDRE-CRISE-VEILLE-BASSE"),
    {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    },
  ).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  for (const [evenementId, choixId] of [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    if (evenementId !== "prologue.ilyana-au-clapet") {
      etat = appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      }).etat;
    }
  }
  for (const commande of [
    { type: "temps-du-convoi.ecouler", secondesReelles: 117 },
    {
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    },
    {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chaussee-de-veille-basse",
    },
    { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
    { type: "temps-du-convoi.ecouler", secondesReelles: 120 },
    {
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "accueillir",
    },
  ] as const) {
    etat = appliquerCommande(etat, commande).etat;
  }
  if (!declencherLaCrise) {
    return etat;
  }
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 30,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "veille-basse.accueil-sous-penurie",
  }).etat;
  return etat;
}

describe("projection des Crises", () => {
  it("rend la chaîne, deux réponses coûteuses et le dernier recours sans pourcentage", () => {
    const projection = projeterCrises(etatEnCrise(), "fr");

    expect(projection.active).toMatchObject({
      titre: "Crise — Eau purifiée contaminée",
      cause:
        "Le débit maintenu malgré le joint dégradé a contaminé la réserve.",
      chaineVisible: [
        expect.stringContaining("Pompe maintenue en service"),
        expect.stringContaining("Contamination annoncée"),
        expect.stringContaining("16 L restent utilisables"),
      ],
      reponses: [
        expect.objectContaining({
          id: "isoler-et-rationner",
          coutConnu: "4 Matériaux",
          dernierRecours: false,
          viable: true,
        }),
        expect.objectContaining({
          id: "mobiliser-les-remedes",
          coutConnu: "5 Remèdes",
          dernierRecours: false,
          viable: true,
        }),
        expect.objectContaining({
          id: "evacuer-les-foyers-exposes",
          coutConnu: "8 Habitants évacués",
          dernierRecours: true,
          viable: true,
          attribution: "Foyers exposés du convoi",
        }),
      ],
    });
    expect(JSON.stringify(projection)).not.toMatch(/%/);
  });

  it("conserve la Cicatrice et la voie de récupération après la décision", () => {
    const etat = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    }).etat;

    const projection = projeterCrises(etat, "en");

    expect(projection.active).toBeNull();
    expect(projection.cicatrices).toEqual([
      expect.objectContaining({
        titre: "Water rationing",
        cause: "Isolation and rationing",
        consequence:
          "Water remains rationed until purification is restored.",
      }),
    ]);
    expect(projection.recuperations).toEqual([
      expect.objectContaining({
        garantie: "Survival baseline preserved",
        horizon: "within 2 route segments",
        statut: "Recovery underway",
        condition: "Deploy the Halt at Dry Well.",
        cout: "2 Materials",
        cause: "Water rationing",
      }),
    ]);
  });

  it("distingue une Récupération accomplie et manquée avec son coût et sa cause", () => {
    const socleAmorce = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    }).etat;
    const socleAccompli = appliquerCommande(socleAmorce, {
      type: "halte.deployer",
    }).etat;

    expect(projeterCrises(socleAccompli, "fr").recuperations).toEqual([
      expect.objectContaining({
        statut: "Récupération accomplie",
        cout: "2 Matériaux engagés",
        cause: "Rationnement de l’Eau",
      }),
    ]);

    let aideManquee = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "evacuer-les-foyers-exposes",
    }).etat;
    aideManquee = appliquerCommande(aideManquee, {
      type: "engagement-de-route.confirmer",
      tronconId: "chaussee-de-veille-basse",
    }).etat;
    aideManquee = appliquerCommande(aideManquee, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    aideManquee = appliquerCommande(aideManquee, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 120,
    }).etat;

    expect(projeterCrises(aideManquee, "en").recuperations).toEqual([
      expect.objectContaining({
        statut: "Recovery missed",
        cout: "2 Materials were required",
        cause: "Hearth evacuation",
      }),
    ]);
  });

  it("rend les Faits de Crise lisibles dans le Journal causal bilingue", () => {
    const etat = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "mobiliser-les-remedes",
    }).etat;

    expect(
      projeterPilotage(etat, "fr").journalCausal.slice(-2),
    ).toMatchObject([
      {
        titre: "Réserve d’Eau — contamination isolée",
        acteurs: ["Équipes de purification", "Foyers du convoi"],
        cible: "Réserve d’Eau purifiée",
      },
      {
        titre: "Crise de purification — Remèdes mobilisés",
        cause: "Crise de pénurie d’Eau",
      },
    ]);
    expect(
      projeterPilotage(etat, "en").journalCausal.slice(-2),
    ).toMatchObject([
      { titre: "Water reserve — contamination isolated" },
      { titre: "Purification crisis — Remedies mobilized" },
    ]);
  });

  it("distingue la Crise de Veille-Basse, ses deux réponses et sa trace bilingue", () => {
    const enCrise = etatEnCriseAVeilleBasse();

    expect(projeterCrises(enCrise, "fr").active).toMatchObject({
      id: "veille-basse.accueil-sous-penurie",
      titre: "Crise — Cohorte accueillie sous pénurie",
      cause:
        "L’accueil décidé sous pénurie a saturé simultanément les réserves et les sas filtrés.",
      chaineVisible: [
        expect.stringContaining("Cohorte"),
        expect.stringContaining("capacités d’accueil"),
        expect.stringContaining("arbitrés"),
      ],
      reponses: [
        expect.objectContaining({
          id: "partager-reserves-cohorte",
          coutConnu: "6 Vivres",
          attribution: "Cohorte du Sillon",
        }),
        expect.objectContaining({
          id: "renforcer-accueil",
          coutConnu: "5 Matériaux",
          attribution: "Techniciens de Veille-Basse",
        }),
      ],
    });

    const resolu = appliquerCommande(enCrise, {
      type: "crise.resoudre",
      criseId: "veille-basse.accueil-sous-penurie",
      reponseId: "partager-reserves-cohorte",
    }).etat;
    expect(projeterCrises(resolu, "en")).toMatchObject({
      active: null,
      cicatrices: [
        expect.anything(),
        expect.objectContaining({
          titre: "Reserves shared at Veille-Basse",
          cause: "Emergency Provisions shared",
        }),
      ],
      recuperations: [
        expect.anything(),
        expect.objectContaining({
          garantie: "Cohort hydrated",
          destination: "Veille-Basse",
          condition: "Open Sillon Hospice.",
          statut: "Recovery underway",
        }),
      ],
    });
    expect(
      projeterPilotage(resolu, "en").journalCausal.slice(-2),
    ).toMatchObject([
      { titre: "Veille-Basse crisis — shelter under shortage" },
      { titre: "Veille-Basse crisis — Provisions shared with the Cohort" },
    ]);
  });

  it("rend la chaîne causale de Veille-Basse dès son alerte", () => {
    expect(
      projeterCrises(etatEnCriseAVeilleBasse(false), "fr").alerte,
    ).toMatchObject({
      titre: "Aggravation annoncée — accueil sous pénurie",
      chaineVisible: [
        expect.stringContaining("Cohorte"),
        expect.stringContaining("capacités d’accueil"),
      ],
    });
  });
});
