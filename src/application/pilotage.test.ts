import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
} from "../simulation/campagne";
import { projeterPilotage } from "./pilotage";

describe("projection du pilotage du convoi", () => {
  it("présente les Autonomies et marges avant les détails sourcés", () => {
    const projection = projeterPilotage(
      creerCampagneInitiale("CENDRE-01"),
    );

    expect(projection.autonomies).toEqual([
      { id: "vivres", nom: "Vivres", valeur: "20 h" },
      { id: "eau", nom: "Eau", valeur: "20 h" },
      { id: "combustible", nom: "Combustible", valeur: "18 h" },
      { id: "materiaux", nom: "Matériaux", valeur: "42 h" },
      { id: "remedes", nom: "Remèdes", valeur: "36 h" },
    ]);
    expect(projection.marges).toEqual([
      { id: "chaleur", nom: "Chaleur", valeur: "+8 kW" },
      {
        id: "main-d-oeuvre",
        nom: "Main-d’œuvre",
        valeur: "+3 équipes",
      },
      { id: "charge", nom: "Charge", valeur: "+12 t" },
    ]);
    expect(projection.details).toMatchObject({
      prochainJalon: "Halte du puits sec dans 3 h",
      entretien: "2 équipes mobilisées · 2 Matériaux par heure",
      incertitude: {
        source: "Relevé de route du Phare",
        age: "relevé maintenant",
        explication: "Consommation variable de ±10 % selon la cendre",
      },
      stocks: [
        {
          id: "vivres",
          quantite: "920 rations",
          flux: "−46 rations/h",
          prevision: "768–796 rations",
        },
        {
          id: "eau",
          quantite: "760 L",
          flux: "−38 L/h",
          prevision: "634–658 L",
        },
        {
          id: "combustible",
          quantite: "540 L",
          flux: "−30 L/h",
          prevision: "441–459 L",
        },
        {
          id: "materiaux",
          quantite: "84 pièces",
          flux: "−2 pièces/h",
          prevision: "77–79 pièces",
        },
        {
          id: "remedes",
          quantite: "36 doses",
          flux: "−1 dose/h",
          prevision: "32–34 doses",
        },
      ],
    });
  });

  it("consomme les Vivres avec le Temps sans améliorer artificiellement la prévision", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const previsionInitiale = projeterPilotage(etatInitial).details.stocks[0];

    const apresUneHeure = appliquerCommande(etatInitial, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 3_600,
    }).etat;
    const projection = projeterPilotage(apresUneHeure);

    expect(apresUneHeure.pilotage.economie.stocks.vivres.quantite).toBe(874);
    expect(
      Object.fromEntries(
        Object.entries(apresUneHeure.pilotage.economie.stocks).map(
          ([id, stock]) => [id, stock.quantite],
        ),
      ),
    ).toEqual({
      vivres: 874,
      eau: 722,
      combustible: 510,
      materiaux: 80,
      remedes: 35,
    });
    expect(projection.autonomies[0]).toEqual({
      id: "vivres",
      nom: "Vivres",
      valeur: "19 h",
    });
    expect(projection.details.stocks[0]).toMatchObject({
      quantite: "874 rations",
      prevision: "768–796 rations",
    });
    expect(projection.details.stocks[0]?.prevision).toBe(
      previsionInitiale?.prevision,
    );
  });

  it("projette le reliquat de flux dès la première seconde", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const previsionInitiale =
      projeterPilotage(etatInitial).details.stocks[0]?.prevision;

    const apresUneSeconde = appliquerCommande(etatInitial, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 1,
    }).etat;
    const projection = projeterPilotage(apresUneSeconde);

    expect(apresUneSeconde.pilotage.economie.stocks.vivres).toMatchObject({
      quantite: 920,
      reliquatDeFlux: -46,
    });
    expect(projection.autonomies[0]?.valeur).toBe("19 h");
    expect(projection.details.stocks[0]?.prevision).toBe(previsionInitiale);
  });

  it("donne un titre localisable au Fait de la cohorte orientée", () => {
    const avecEvenement = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
    ).etat;
    const orientee = appliquerCommande(avecEvenement, {
      type: "evenement-narratif.choisir",
      evenementId: "prologue.signaux-sous-la-cendre",
      choixId: "orienter",
    }).etat;

    const entree = projeterPilotage(orientee).journalCausal[0];
    expect(entree).toEqual({
      id: "prologue.cohorte-orientee",
      titre: "Cohorte orientée vers Veille-Basse",
      cause: "Des signaux sous la cendre",
      acteurs: ["Porte-Lanterne", "Cohorte de réfugiés"],
      cible: "Cohorte de réfugiés",
      effetsMateriels: [],
      effetsHumains: [],
      moment: "01:00",
    });
    expect(entree?.titre).not.toContain("prologue.");
    expect(projeterPilotage(orientee, "en").journalCausal[0]?.titre).toBe(
      "Cohort directed to Veille-Basse",
    );
  });

  it("possède un titre joueur pour chaque Fait actuellement productible", () => {
    const creerFaitNarratif = (choixId: "accueillir" | "orienter") => {
      const avecEvenement = appliquerCommande(
        creerCampagneInitiale("CENDRE-01"),
        { type: "temps-du-convoi.ecouler", secondesReelles: 60 },
      ).etat;
      return appliquerCommande(avecEvenement, {
        type: "evenement-narratif.choisir",
        evenementId: "prologue.signaux-sous-la-cendre",
        choixId,
      }).etat;
    };
    const creerFaitDIncident = (
      ordre: "securiser-pompe" | "maintenir-debit",
    ) =>
      appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
        type: "incident.ordonner",
        incidentId: "purification.pompe-instable",
        ordre,
      }).etat;
    const circuitIsole = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      { type: "temps-du-convoi.ecouler", secondesReelles: 120 },
    ).etat;

    const entrees = [
      creerFaitNarratif("accueillir"),
      creerFaitNarratif("orienter"),
      creerFaitDIncident("securiser-pompe"),
      creerFaitDIncident("maintenir-debit"),
      circuitIsole,
    ].flatMap((etat) => projeterPilotage(etat).journalCausal);

    expect(
      Object.fromEntries(entrees.map(({ id, titre }) => [id, titre])),
    ).toEqual({
      "prologue.cohorte-accueillie": "Cohorte accueillie",
      "prologue.cohorte-orientee": "Cohorte orientée vers Veille-Basse",
      "incident.purification.pompe-instable.securisee":
        "Pompe de purification — joint remplacé",
      "incident.purification.pompe-instable.debit-maintenu":
        "Pompe de purification — débit maintenu",
      "incident.purification.pompe-instable.circuit-isole":
        "Pompe de purification — circuit isolé",
    });
    for (const entree of entrees) {
      expect(entree.titre).not.toBe(entree.id);
    }
  });

  it("projette les quatre politiques, l'Incident et le Journal causal", () => {
    const etatInitial = creerCampagneInitiale("CENDRE-01");
    const projectionInitiale = projeterPilotage(etatInitial);

    expect(projectionInitiale.doctrine).toEqual([
      {
        id: "rationnement",
        nom: "Rationnement",
        position: "Mesuré",
        options: [
          { id: "genereux", nom: "Généreux" },
          { id: "mesure", nom: "Mesuré" },
          { id: "strict", nom: "Strict" },
        ],
        transition: null,
      },
      {
        id: "allure",
        nom: "Allure",
        position: "Soutenue",
        options: [
          { id: "prudente", nom: "Prudente" },
          { id: "soutenue", nom: "Soutenue" },
          { id: "forcee", nom: "Forcée" },
        ],
        transition: null,
      },
      {
        id: "entretien",
        nom: "Entretien",
        position: "Équilibré",
        options: [
          { id: "preventif", nom: "Préventif" },
          { id: "equilibre", nom: "Équilibré" },
          { id: "urgence", nom: "Urgence" },
        ],
        transition: null,
      },
      {
        id: "delestage-thermique",
        nom: "Délestage thermique",
        position: "Équilibre",
        options: [
          { id: "foyers", nom: "Foyers prioritaires" },
          { id: "equilibre", nom: "Équilibre" },
          { id: "machines", nom: "Machines prioritaires" },
        ],
        transition: null,
      },
    ]);
    expect(projectionInitiale.incident).toEqual({
      id: "purification.pompe-instable",
      titre: "Pompe de purification instable",
      cause: "Usure du joint de la pompe de purification",
      priorite: "Préserver les Habitants",
      echeance: "dans 2 min",
      incertitude: {
        source: "Inspection de l’Atelier",
        age: "relevée maintenant",
        observation: "Rupture possible avant la Halte du puits sec",
      },
      ordres: [
        {
          id: "securiser-pompe",
          nom: "Sécuriser la pompe",
          coutConnu: "3 Matériaux",
        },
        {
          id: "maintenir-debit",
          nom: "Maintenir le débit",
          coutConnu: "2 Habitants sous surveillance médicale",
        },
      ],
    });
    expect(projectionInitiale.journalCausal).toEqual([]);

    const transitionDeDoctrine = appliquerCommande(etatInitial, {
      type: "doctrine.regler",
      politique: "entretien",
      position: "preventif",
    });
    expect(
      projeterPilotage(transitionDeDoctrine.etat).doctrine[2]?.transition,
    ).toEqual({ position: "Préventif", delai: "30 s" });

    const resolution = appliquerCommande(transitionDeDoctrine.etat, {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "securiser-pompe",
    });
    expect("journalCausal" in resolution.etat.pilotage).toBe(false);
    expect(resolution.etat.narration.faitsDeCampagne).toEqual([
      {
        id: "incident.purification.pompe-instable.securisee",
        cause: "purification.pompe-instable",
        acteurs: ["porte-lanterne", "equipes-entretien"],
        cible: "pompe-purification",
        moment: 0,
        effets: {
          materiels: [
            {
              type: "stock.modifie",
              stock: "materiaux",
              variation: -3,
            },
            {
              type: "installation.etat-modifie",
              installation: "pompe-purification",
              etat: "securisee",
            },
          ],
          humains: [{ type: "habitants.exposes", nombre: 0 }],
        },
      },
    ]);
    const projectionResolue = projeterPilotage(resolution.etat);
    expect(projectionResolue.incident).toBeNull();
    expect(projectionResolue.journalCausal).toEqual([
      {
        id: "incident.purification.pompe-instable.securisee",
        titre: "Pompe de purification — joint remplacé",
        cause: "Usure du joint de la pompe de purification",
        acteurs: ["Porte-Lanterne", "Équipes d’entretien"],
        cible: "Pompe de purification",
        effetsMateriels: [
          "3 Matériaux consommés",
          "Pompe de purification sécurisée",
        ],
        effetsHumains: ["Aucun Habitant exposé"],
        moment: "00:00",
      },
    ]);
  });
});
