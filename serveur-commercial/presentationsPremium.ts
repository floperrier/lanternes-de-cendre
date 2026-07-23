import type { PresentationsPremium } from "../src/content/presentationsPremium";

export const PRESENTATIONS_PREMIUM = {
  hautPuits: {
    fr: {
      titre: "Haut-Puits",
      colonie: "Colonie",
      statut: "Statut",
      devenir: "Devenir",
      pressions: "Pressions locales",
      relation: "Relation publique",
      engagements: "Engagements diplomatiques",
      projets: "Transformations possibles",
      projetChoisi: "Transformation choisie",
      aucunEngagement: "Aucun engagement diplomatique.",
      aucunProjetChoisi: "Aucune transformation imposée.",
      marche: "Marché de l’eau",
      echanger: "Conclure l’échange",
      epuisee: "Offre épuisée",
      echangesRestants: "Échanges restants",
      negociation: "Négociation de l’eau",
      tranchee: "La négociation est tranchée.",
      instruction: "Ce choix se tranche dans l’Événement narratif associé.",
      statuts: { stable: "Stable", fragile: "Fragile", perdue: "Perdue" },
      devenirs: {
        "negociation-ouverte": "Négociation ouverte",
        "partage-organise": "Partage organisé",
        "reserves-protegees": "Réserves protégées",
      },
      pressionsLocales: {
        "autonomie-hydrique-menacee": "Autonomie hydrique menacée",
        "reserves-entamees": "Réserves entamées",
        "familles-ecartees": "Familles écartées",
      },
      relations: {
        fermee: "Fermée",
        transactionnelle: "Transactionnelle",
        cooperative: "Coopérative",
      },
      besoins: {
        "pieces-de-filtration": "Pièces de filtration",
        "remedes-pour-les-puisatiers": "Remèdes pour les puisatiers",
      },
      stocks: {
        vivres: "Vivres",
        eau: "Eau",
        combustible: "Combustible",
        materiaux: "Matériaux",
        remedes: "Remèdes",
      },
      projetsPossibles: {
        "decanteur-itinerant": "Décanteur itinérant — possibilité à étudier",
        "arche-des-deplaces": "Arche des déplacés — possibilité à étudier",
      },
      projetsChoisis: {
        "decanteur-itinerant": "Décanteur itinérant",
        "arche-des-deplaces": "Arche des déplacés",
      },
      decisions: {
        "partager-eau": {
          libelle: "Partager l’eau",
          consequence:
            "−30 L d’eau ; relation coopérative ; engagement au Conseil des Vannes.",
        },
        "proteger-reserves": {
          libelle: "Protéger les réserves",
          consequence:
            "Haut-Puits reste stable ; la relation publique se ferme.",
        },
      },
      engagement:
        "Engagement de partage de l’eau — écho prévu au Conseil des Vannes ({moment})",
    },
    en: {
      titre: "High Well",
      colonie: "Colony",
      statut: "Status",
      devenir: "Fate",
      pressions: "Local pressures",
      relation: "Public relationship",
      engagements: "Diplomatic commitments",
      projets: "Possible transformations",
      projetChoisi: "Chosen transformation",
      aucunEngagement: "No diplomatic commitment.",
      aucunProjetChoisi: "No transformation imposed.",
      marche: "Water Market",
      echanger: "Complete trade",
      epuisee: "Offer exhausted",
      echangesRestants: "Trades remaining",
      negociation: "Water negotiation",
      tranchee: "The negotiation is settled.",
      instruction: "This choice is settled in the associated narrative Event.",
      statuts: { stable: "Stable", fragile: "Fragile", perdue: "Lost" },
      devenirs: {
        "negociation-ouverte": "Negotiation open",
        "partage-organise": "Sharing organized",
        "reserves-protegees": "Reserves protected",
      },
      pressionsLocales: {
        "autonomie-hydrique-menacee": "Water autonomy threatened",
        "reserves-entamees": "Reserves depleted",
        "familles-ecartees": "Families turned away",
      },
      relations: {
        fermee: "Closed",
        transactionnelle: "Transactional",
        cooperative: "Cooperative",
      },
      besoins: {
        "pieces-de-filtration": "Filter parts",
        "remedes-pour-les-puisatiers": "Remedies for the well crews",
      },
      stocks: {
        vivres: "Food",
        eau: "Water",
        combustible: "Fuel",
        materiaux: "Materials",
        remedes: "Remedies",
      },
      projetsPossibles: {
        "decanteur-itinerant": "Travelling Settler — possibility to assess",
        "arche-des-deplaces": "Displaced People’s Ark — possibility to assess",
      },
      projetsChoisis: {
        "decanteur-itinerant": "Travelling Settler",
        "arche-des-deplaces": "Displaced People’s Ark",
      },
      decisions: {
        "partager-eau": {
          libelle: "Share the water",
          consequence:
            "−30 L water; cooperative relationship; Sluice Council pledge.",
        },
        "proteger-reserves": {
          libelle: "Protect the reserves",
          consequence:
            "High Well remains stable; the public relationship closes.",
        },
      },
      engagement:
        "Water-sharing pledge — to be echoed at the Sluice Council ({moment})",
    },
  },
  veilleBasse: {
    fr: {
      titre: "Veille-Basse et l’Hospice du Sillon",
      veilleBasse: "Veille-Basse",
      typeColonie: "Colonie",
      statuts: {
        prospere: "Prospère",
        stable: "Stable",
        fragile: "Fragile",
        perdue: "Perdue",
      },
      pressions: {
        "afflux-deplaces": "Afflux de déplacés",
        "filtres-satures": "Filtres saturés",
        "cohorte-aux-portes": "Cohorte aux portes",
      },
      marche: {
        "filtres-contre-releve":
          "Échanger un relevé du Phare mobile contre des filtres étanches",
        "renfort-contre-materiaux":
          "Échanger des Matériaux de charpente contre le renfort des techniciens",
      },
      archives: {
        scellees: "Archives scellées",
        ouvertes: "Archives ouvertes — déplacement des cendres documenté",
      },
      affectations: {
        "maintien-des-filtres": "maintien des filtres",
        "renfort-des-sas": "renfort des sas",
        "lecture-des-archives": "lecture des archives",
      },
      equipes: "équipes",
      avertissement: "Perte annoncée — occasion d’intervention",
      hospice: "Hospice du Sillon",
      typeHospice: "Site habité secondaire",
      besoin: "Places filtrées",
      devenirs: {
        ouvert: "Ouvert",
        "sous-charge": "Sous Charge d’accueil",
        renforce: "Renforcé",
      },
      cohorte: "Cohorte du Sillon",
      destinations: {
        "veille-basse": "Veille-Basse",
        "cite-caravane": "Cité-caravane",
        "hospice-du-sillon": "Hospice du Sillon",
        nacelles: "Nacelles",
        "hors-de-veille-basse": "Routes hors de Veille-Basse",
      },
      origine: "Camp des Digues",
      personnes: "personnes",
      etatDominant: "Épuisée",
      specialite: "Charpente étanche",
      memoires: {
        aucune: "Aucune décision",
        aidee: "Aide reçue",
        refusee: "Refusée",
        redirigee: "Redirigée",
      },
      integrations: {
        "en-attente": "En attente",
        "charge-accueil": "Charge d’accueil active",
        "equipes-integrees": "2 équipes intégrées",
        refusee: "Refusée",
        redirigee: "Redirigée",
      },
      revelation:
        "Le Réseau ancien déplaçait la cendre vers les périphéries",
      maelys: "Maëlys Rive",
      decisionsDeMaelys: {
        aucune: "Décision en attente",
        "coffret-confie": "Coffret confié à Maëlys",
        "equipes-prioritaires": "Équipes envoyées sans Maëlys",
      },
      positionsDeMaelys: {
        "veille-basse": "À Veille-Basse",
        "hospice-du-sillon": "En mission à l’Hospice du Sillon",
      },
      relevesDeMaelys: {
        "non-planifie": "Relevé non planifié",
        "rapide-en-cours": "Relevé rapide en cours",
        "lent-en-cours": "Relevé lent en cours",
        termine: "Relevé de l’Hospice terminé",
      },
      libellePressions: "Pressions",
      libelleMarche: "Marché de besoins",
      libelleDevenir: "Devenir",
      libelleOrigine: "Origine",
      libelleDestination: "Destination",
      libelleTaille: "Taille",
      libelleEtatDominant: "État dominant",
      libelleSpecialite: "Spécialité",
      libelleMemoire: "Mémoire",
      libelleIntegration: "Intégration",
      libelleDecision: "Décision",
      libellePosition: "Position",
      libelleReleve: "Relevé",
      libelleRevelation: "Révélation essentielle",
    },
    en: {
      titre: "Lower Watch and Sillon Hospice",
      veilleBasse: "Lower Watch",
      typeColonie: "Colony",
      statuts: {
        prospere: "Prosperous",
        stable: "Stable",
        fragile: "Fragile",
        perdue: "Lost",
      },
      pressions: {
        "afflux-deplaces": "Displaced influx",
        "filtres-satures": "Saturated filters",
        "cohorte-aux-portes": "Cohort at the gates",
      },
      marche: {
        "filtres-contre-releve":
          "Trade a mobile Lighthouse survey for sealed filters",
        "renfort-contre-materiaux":
          "Trade framing Materials for technician support",
      },
      archives: {
        scellees: "Archives sealed",
        ouvertes: "Archives opened — ash displacement documented",
      },
      affectations: {
        "maintien-des-filtres": "filter maintenance",
        "renfort-des-sas": "airlock reinforcement",
        "lecture-des-archives": "archive review",
      },
      equipes: "teams",
      avertissement: "Loss announced — intervention opportunity",
      hospice: "Sillon Hospice",
      typeHospice: "Secondary inhabited site",
      besoin: "Filtered spaces",
      devenirs: {
        ouvert: "Open",
        "sous-charge": "Under Welcoming Load",
        renforce: "Reinforced",
      },
      cohorte: "Sillon Cohort",
      destinations: {
        "veille-basse": "Lower Watch",
        "cite-caravane": "Caravan-city",
        "hospice-du-sillon": "Sillon Hospice",
        "hors-de-veille-basse": "Roads beyond Lower Watch",
      },
      origine: "Dike Camp",
      personnes: "people",
      etatDominant: "Exhausted",
      specialite: "Sealed-frame carpentry",
      memoires: {
        aucune: "No decision",
        aidee: "Help received",
        refusee: "Refused",
        redirigee: "Redirected",
      },
      integrations: {
        "en-attente": "Waiting",
        "charge-accueil": "Welcoming Load active",
        "equipes-integrees": "2 teams integrated",
        refusee: "Refused",
        redirigee: "Redirected",
      },
      revelation:
        "The Ancient Network displaced ash toward the peripheries",
      maelys: "Maëlys Rive",
      decisionsDeMaelys: {
        aucune: "Decision pending",
        "coffret-confie": "Survey case entrusted to Maëlys",
        "equipes-prioritaires": "Teams sent without Maëlys",
      },
      positionsDeMaelys: {
        "veille-basse": "At Lower Watch",
        "hospice-du-sillon": "On mission at Sillon Hospice",
      },
      relevesDeMaelys: {
        "non-planifie": "Survey not planned",
        "rapide-en-cours": "Fast survey in progress",
        "lent-en-cours": "Slow survey in progress",
        termine: "Hospice survey completed",
      },
      libellePressions: "Pressures",
      libelleMarche: "Needs market",
      libelleDevenir: "Fate",
      libelleOrigine: "Origin",
      libelleDestination: "Destination",
      libelleTaille: "Size",
      libelleEtatDominant: "Dominant condition",
      libelleSpecialite: "Specialty",
      libelleMemoire: "Memory",
      libelleIntegration: "Integration",
      libelleDecision: "Decision",
      libellePosition: "Location",
      libelleReleve: "Survey",
      libelleRevelation: "Essential revelation",
    },
  },
  deversoir: {
    fr: {
      nomsDesLieux: {
        "halte-du-puits-sec": "Maison des Filtres",
        "haut-puits": "Haut-Puits",
        "les-vanniers": "Les Vanniers",
        "veille-basse": "Veille-Basse",
        "hospice-du-sillon": "Hospice du Sillon",
        nacelles: "Nacelles",
        "relais-des-vannes": "Relais des Vannes",
        "deversoir-noir": "Déversoir Noir",
      },
      lieuxTraverses: "Lieux traversés puis quittés : {lieux}.",
      lieuxNonRejoints: "Lieux non rejoints : {lieux}.",
      aucunLieu: "aucun",
      etatDesColonies:
        "Colonies : Haut-Puits est {hautPuitsStatut} ({hautPuitsDevenir}) ; Veille-Basse est {veilleBasseStatut}, son Hospice est {hospiceDevenir} et la destination de la Cohorte est {cohorteDestination}.",
      occasions:
        "Occasions encore ouvertes : relevé de la Ligne Zéro {ligneZero} ; transformation régionale {projet} ; archives de Veille-Basse {archives}.",
      ligneZeroEmportee: "emporté vers la Trame de Fer",
      ligneZeroNonEmportee: "non emporté",
      projetNonRetenu: "non retenue",
      projets: {
        "decanteur-itinerant": "Décanteur itinérant",
        "arche-des-deplaces": "Arche des déplacés",
      },
      statutsDeProjet: {
        retenu: "retenue, encore inachevée",
        scelle: "scellée dans le châssis",
      },
      statutsDeColonie: {
        prospere: "prospère",
        stable: "stable",
        fragile: "fragile",
        perdue: "perdue",
      },
      devenirsDeHautPuits: {
        "negociation-ouverte": "négociation ouverte",
        "partage-organise": "partage organisé",
        "reserves-protegees": "réserves protégées",
      },
      devenirsDeHospice: {
        ouvert: "ouvert",
        "sous-charge": "sous charge",
        renforce: "renforcé",
      },
      destinationsDeCohorte: {
        "veille-basse": "Veille-Basse",
        "cite-caravane": "Cité-caravane",
        "hospice-du-sillon": "Hospice du Sillon",
        "hors-de-veille-basse": "routes au-delà de Veille-Basse",
      },
      etatsDArchives: {
        scellees: "restées scellées",
        ouvertes: "désormais consultables",
      },
      nomDePlateforme: "Châssis régional des Bassins",
      servicesDeProjet: {
        "purification-mobile":
          "Purification mobile des eaux troubles sur la route.",
        "accueil-deplaces":
          "Accueil étanche durable des déplacés et de leurs métiers.",
      },
      contraintesDeProjet: {
        "entretien-hydraulique-dedie":
          "Une équipe hydraulique reste affectée au châssis indivisible.",
        "charge-habitable-permanente":
          "La capacité habitable du châssis ne peut plus être réaffectée.",
      },
      devenirsDeSites: {
        actif: "actif",
        evacue: "évacué",
        absorbe: "absorbé",
        abandonne: "abandonné",
      },
    },
    en: {
      nomsDesLieux: {
        "halte-du-puits-sec": "Filter House",
        "haut-puits": "High Well",
        "les-vanniers": "The Basketmakers",
        "veille-basse": "Lower Watch",
        "hospice-du-sillon": "Sillon Hospice",
        nacelles: "Cableways",
        "relais-des-vannes": "Sluice Relay",
        "deversoir-noir": "Black Spillway",
      },
      lieuxTraverses: "Places crossed and left behind: {lieux}.",
      lieuxNonRejoints: "Places not reached: {lieux}.",
      aucunLieu: "none",
      etatDesColonies:
        "Colonies: High Well is {hautPuitsStatut} ({hautPuitsDevenir}); Lower Watch is {veilleBasseStatut}, its Hospice is {hospiceDevenir}, and the Cohort’s destination is {cohorteDestination}.",
      occasions:
        "Open opportunities: Zero Line survey {ligneZero}; regional transformation {projet}; Lower Watch archives {archives}.",
      ligneZeroEmportee: "carried forward for the Iron Weave",
      ligneZeroNonEmportee: "not carried forward",
      projetNonRetenu: "not selected",
      projets: {
        "decanteur-itinerant": "Mobile settler",
        "arche-des-deplaces": "Ark for the displaced",
      },
      statutsDeProjet: {
        retenu: "selected, still unfinished",
        scelle: "sealed into the chassis",
      },
      statutsDeColonie: {
        prospere: "thriving",
        stable: "stable",
        fragile: "fragile",
        perdue: "lost",
      },
      devenirsDeHautPuits: {
        "negociation-ouverte": "negotiation open",
        "partage-organise": "sharing organized",
        "reserves-protegees": "reserves protected",
      },
      devenirsDeHospice: {
        ouvert: "open",
        "sous-charge": "under load",
        renforce: "reinforced",
      },
      destinationsDeCohorte: {
        "veille-basse": "Lower Watch",
        "cite-caravane": "Caravan-city",
        "hospice-du-sillon": "Sillon Hospice",
        "hors-de-veille-basse": "roads beyond Lower Watch",
      },
      etatsDArchives: {
        scellees: "left sealed",
        ouvertes: "now available for consultation",
      },
      nomDePlateforme: "Basins regional chassis",
      servicesDeProjet: {
        "purification-mobile":
          "Mobile purification of murky water along the road.",
        "accueil-deplaces":
          "Durable sealed shelter for displaced people and their trades.",
      },
      contraintesDeProjet: {
        "entretien-hydraulique-dedie":
          "One hydraulic team remains assigned to the indivisible chassis.",
        "charge-habitable-permanente":
          "The chassis’ living capacity can no longer be reassigned.",
      },
      devenirsDeSites: {
        actif: "active",
        evacue: "evacuated",
        absorbe: "absorbed",
        abandonne: "abandoned",
      },
    },
  },
} as const satisfies PresentationsPremium;
