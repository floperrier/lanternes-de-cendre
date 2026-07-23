import { describe, expect, it } from "vitest";

import { projeterPilotage } from "../application/pilotage";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";

function resoudreEvenementActif(
  etat: EtatCampagne,
  choixId?: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement narratif actif.");
  }
  const choixParDefaut: Record<string, string> = {
    "prologue.signaux-sous-la-cendre": "accueillir",
    "prologue.reponse-du-phare": "consigner-harmonique",
    "prologue.filtres-de-la-veille": "proteger-foyers",
    "prologue.ilyana-au-clapet": "confier-clapet",
    "veille-basse.la-place-sous-le-phare": "accueillir",
    "veille-basse.la-porte-des-filtres": "renforcer-sas",
    "veille-basse.les-registres-du-reflux": "copier-registres",
    "veille-basse.maelys-et-le-coffret": "confier-coffret",
  };
  const resolution = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId: choixId ?? choixParDefaut[evenementId]!,
  }).etat;
  return appliquerCommande(resolution, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

function arriverAVeilleBasse(): EtatCampagne {
  let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  for (let index = 0; index < 4; index += 1) {
    etat = resoudreEvenementActif(etat);
  }
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "chaussee-de-veille-basse",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 120,
  }).etat;
}

function franchirJalonLocal(
  etat: EtatCampagne,
  secondesReelles: number,
): EtatCampagne {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles,
  }).etat;
}

describe("branche jouable de Veille-Basse", () => {
  it("déclenche le conflit de Veille-Basse et jamais celui de Haut-Puits", () => {
    const arrivee = arriverAVeilleBasse();

    expect(arrivee.routes.position).toBe("veille-basse");
    expect(arrivee.narration.evenementActif).toBe(
      "veille-basse.la-place-sous-le-phare",
    );
    expect(arrivee.narration.evenementsJoues).not.toContain(
      "bassins-fendus.eau-de-haut-puits",
    );
  });

  it("mémorise l’accueil dans l’état de Campagne puis crée deux équipes à l’échéance", () => {
    let etat = resoudreEvenementActif(arriverAVeilleBasse(), "accueillir");

    expect(etat.veilleBasse.cohorte).toMatchObject({
      origine: "camp-des-digues",
      destination: "cite-caravane",
      taille: 18,
      etatDominant: "epuisee",
      specialite: "charpente-etanche",
      memoire: "aidee",
      integration: {
        statut: "charge-accueil",
        equipesIntegrees: 0,
      },
    });
    expect(etat.narration.evenementActif).toBeNull();
    expect(etat.citeCaravane.habitants).toBe(190);
    const jalonAttendu = etat.tempsDuConvoi.secondes + 600;

    const integration = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 151,
    });
    etat = integration.etat;
    expect(etat.veilleBasse.cohorte.integration.statut).toBe(
      "equipes-integrees",
    );
    expect(etat.citeCaravane.habitants).toBe(208);
    expect(
      etat.veilleBasse.colonie.avertissementDePerte?.avertiA,
    ).toBe(jalonAttendu);
    for (let index = 0; index < 3; index += 1) {
      etat = resoudreEvenementActif(etat);
    }
    expect(etat.veilleBasse.cohorte.integration).toEqual({
      statut: "equipes-integrees",
      chargeDAccueil: null,
      equipesIntegrees: 2,
    });
    expect(integration.evenements).toContainEqual(
      expect.objectContaining({
        type: "cohorte.integration-terminee",
        cause: "veille-basse.la-place-sous-le-phare",
      }),
    );
  });

  it("révèle le sacrifice des périphéries quelle que soit la décision sur les registres", () => {
    for (const choixId of ["copier-registres", "laisser-registres"]) {
      let etat = resoudreEvenementActif(arriverAVeilleBasse(), "rediriger");
      etat = franchirJalonLocal(etat, 150);
      etat = resoudreEvenementActif(etat, "ouvrir-hospice");
      etat = resoudreEvenementActif(etat, choixId);

      expect(etat.veilleBasse.colonie.archives).toEqual({
        etat: "ouvertes",
        revelationEssentielle:
          "reseau-ancien.deplacement-vers-peripheries",
      });
      expect(etat.veilleBasse.revelationsEssentielles).toContain(
        "reseau-ancien.deplacement-vers-peripheries",
      );
      expect(etat.narration.evenementActif).toBe(
        "veille-basse.maelys-et-le-coffret",
      );
    }
  });

  it.each([
    {
      decision: "refuser",
      consequence: "veille-basse.cohorte-refusee-revient-aux-portes",
      intervention: "renforcer-sas",
      statut: "stable",
      hospice: "ouvert",
    },
    {
      decision: "rediriger",
      consequence: "veille-basse.hospice-accueille-la-cohorte",
      intervention: "ouvrir-hospice",
      statut: "fragile",
      hospice: "renforce",
    },
  ] as const)(
    "manifeste au Jalon puis récupère la conséquence du choix « $decision »",
    ({ decision, consequence, intervention, statut, hospice }) => {
      let etat = resoudreEvenementActif(arriverAVeilleBasse(), decision);

      expect(etat.narration.evenementActif).toBeNull();
      expect(etat.veilleBasse.consequencesDifferees).toContainEqual(
        expect.objectContaining({
          id: consequence,
          statut: "attendue",
        }),
      );

      etat = franchirJalonLocal(etat, 150);
      expect(etat.narration.evenementActif).toBe(
        "veille-basse.la-porte-des-filtres",
      );
      expect(etat.veilleBasse.consequencesDifferees).toContainEqual(
        expect.objectContaining({
          id: consequence,
          statut: "manifestee",
        }),
      );
      expect(
        etat.veilleBasse.colonie.avertissementDePerte
          ?.occasionDIntervention,
      ).toBe("offerte");

      etat = resoudreEvenementActif(etat, intervention);
      expect(etat.veilleBasse.colonie).toMatchObject({
        statut,
        avertissementDePerte: {
          occasionDIntervention: "saisie",
        },
      });
      expect(etat.veilleBasse.hospiceDuSillon.devenir).toBe(hospice);
    },
  );

  it.each([
    {
      choix: "confier-coffret",
      decision: "coffret-confie",
      releve: "rapide-en-cours",
      equipes: 1,
    },
    {
      choix: "garder-equipes",
      decision: "equipes-prioritaires",
      releve: "lent-en-cours",
      equipes: 2,
    },
  ] as const)(
    "joue et persiste la voie de Maëlys « $choix »",
    ({ choix, decision, releve, equipes }) => {
      let etat = resoudreEvenementActif(arriverAVeilleBasse(), "accueillir");
      etat = franchirJalonLocal(etat, 150);
      etat = resoudreEvenementActif(etat, "renforcer-sas");
      etat = resoudreEvenementActif(etat, "copier-registres");
      const evenementId = etat.narration.evenementActif;
      if (evenementId !== "veille-basse.maelys-et-le-coffret") {
        throw new Error("L’histoire de Maëlys devrait être active.");
      }

      etat = appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId,
        choixId: choix,
      }).etat;

      expect(etat.veilleBasse.maelysRive).toMatchObject({
        decision,
        releveDeLHospice: releve,
      });
      expect(etat.veilleBasse.colonie.techniciens.equipesDisponibles).toBe(
        equipes,
      );
      for (const langue of ["fr", "en"] as const) {
        expect(() => projeterPilotage(etat, langue)).not.toThrow();
      }

      expect(etat.veilleBasse.consequencesDifferees.at(-1)).toMatchObject({
        statut: "attendue",
      });
      etat = franchirJalonLocal(
        etat,
        choix === "confier-coffret" ? 75 : 150,
      );
      expect(etat.veilleBasse.maelysRive.releveDeLHospice).toBe("termine");
      expect(etat.veilleBasse.colonie.techniciens.equipesDisponibles).toBe(2);
    },
  );

  it("peut perdre Veille-Basse seulement au Jalon suivant une occasion explicitement ignorée", () => {
    let etat = resoudreEvenementActif(arriverAVeilleBasse(), "refuser");
    etat = franchirJalonLocal(etat, 150);
    etat = resoudreEvenementActif(etat, "renoncer-intervention");

    expect(etat.veilleBasse.colonie).toMatchObject({
      statut: "fragile",
      avertissementDePerte: {
        occasionDIntervention: "ignoree",
      },
    });
    expect(etat.veilleBasse.consequencesDifferees.at(-1)).toMatchObject({
      id: "veille-basse.perte-apres-intervention-refusee",
      statut: "attendue",
    });

    etat = franchirJalonLocal(etat, 75);
    expect(etat.veilleBasse.colonie.statut).toBe("perdue");
  });
});
