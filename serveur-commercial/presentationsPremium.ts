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
  trame: {
    fr: {
      titre: "Grand-Aiguillage",
      statuts: {
        "sous-controle-republicain": "Atelier sous contrôle républicain",
        "atelier-negocie": "Atelier négocié",
      },
      relations: {
        fermee: "Fermée",
        transactionnelle: "Transactionnelle",
        cooperative: "Coopérative",
      },
      eau: {
        critique: "Eau de refroidissement critique",
        rationnee: "Eau de refroidissement rationnée",
        stabilisee: "Eau de refroidissement stabilisée",
      },
      requisitions: {
        actives: "Réquisitions actives",
        prioritaires: "Réquisitions prioritaires",
        encadrees: "Réquisitions encadrées",
      },
      engagements: {
        "permis-de-circulation-republicain":
          "Permis républicain de circulation",
        "droit-local-de-passage": "Droit local de passage contesté",
        "taxe-des-lanternes": "Taxe des lanternes",
        "priorite-aux-requisitions": "Priorité aux réquisitions",
        "controle-de-pompe-neuve": "Contrôle républicain de Pompe-Neuve",
        "service-lourd-du-train-outil": "Service lourd du Train-outil",
        "monopole-de-l-aiguillage-zero": "Monopole de l’Aiguillage Zéro",
        "charte-de-circulation-partagee":
          "Charte de circulation partagée",
        "transport-autonome-aiguillage-zero":
          "Transport autonome de l’Aiguillage Zéro",
      },
      voies: {
        "train-outil": "Usinage par le Train-outil",
        "reparation-locale": "Réparation par les ateliers locaux",
        "attelage-federe": "Transport par l’Attelage fédéré",
      },
      servicesLourdsRestants: "{nombre} services lourds restants",
      reserveDeRefroidissementRestante:
        "{nombre} réserve de refroidissement restante",
      occasionTrainOutil:
        "Train-outil — {nombre} services lourds et un Engagement",
      occasionAttelageFedere: "Attelage fédéré — {nombre} Matériaux",
      libelles: {
        eyebrow: "Colonie · Trame de Fer",
        republique: "République du Rail",
        pressions: "Pressions",
        marche: "Marché",
        engagements: "Engagements de la Trame",
        aucunEngagement: "Aucun",
        piece: "Pièce de régulation",
        voieAOuvrir: "Voie à ouvrir",
      },
    },
    en: {
      titre: "Grand Junction",
      statuts: {
        "sous-controle-republicain": "Workshop under republican control",
        "atelier-negocie": "Negotiated workshop",
      },
      relations: {
        fermee: "Closed",
        transactionnelle: "Transactional",
        cooperative: "Cooperative",
      },
      eau: {
        critique: "Cooling water critical",
        rationnee: "Cooling water rationed",
        stabilisee: "Cooling water stabilized",
      },
      requisitions: {
        actives: "Requisitions active",
        prioritaires: "Requisitions prioritized",
        encadrees: "Requisitions constrained",
      },
      engagements: {
        "permis-de-circulation-republicain": "Republican circulation permit",
        "droit-local-de-passage": "Contested local right of passage",
        "taxe-des-lanternes": "Lantern tax",
        "priorite-aux-requisitions": "Requisition priority",
        "controle-de-pompe-neuve": "New Pump republican inspection",
        "service-lourd-du-train-outil": "Tool Train heavy service",
        "monopole-de-l-aiguillage-zero": "Zero Junction monopoly",
        "charte-de-circulation-partagee":
          "Shared circulation charter",
        "transport-autonome-aiguillage-zero":
          "Zero Junction autonomous transport",
      },
      voies: {
        "train-outil": "Machining by the Tool Train",
        "reparation-locale": "Repair by local workshops",
        "attelage-federe": "Transport by the Federated Hauler",
      },
      servicesLourdsRestants: "{nombre} heavy services remaining",
      reserveDeRefroidissementRestante:
        "{nombre} cooling reserve remaining",
      occasionTrainOutil:
        "Tool Train — {nombre} heavy services and a Commitment",
      occasionAttelageFedere: "Federated Hauler — {nombre} Materials",
      libelles: {
        eyebrow: "Colony · Iron Weave",
        republique: "Rail Republic",
        pressions: "Pressures",
        marche: "Market",
        engagements: "Iron Weave commitments",
        aucunEngagement: "None",
        piece: "Regulation part",
        voieAOuvrir: "Route to be opened",
      },
    },
  },
  traverse: {
    fr: {
      titre: "Traverse-Libre",
      statuts: {
        fragile: "Colonie fragile",
        stabilisee: "Colonie stabilisée",
        autonome: "Colonie autonome",
      },
      relationsPuits: {
        fermee: "Fermée",
        transactionnelle: "Transactionnelle",
        cooperative: "Coopérative",
      },
      relationsRepublique: {
        fermee: "Fermée",
        transactionnelle: "Transactionnelle",
        cooperative: "Coopérative",
      },
      filtres: {
        critiques: "Filtres critiques",
        rationnes: "Filtres rationnés",
        stabilises: "Filtres stabilisés",
      },
      isolement: {
        menace: "Isolement menaçant",
        endigue: "Isolement endigué",
        leve: "Isolement levé",
      },
      contournements: {
        inconnu: "Inconnu",
        releve: "Relevé mais fermé",
        praticable: "Praticable",
      },
      routes: {
        degradee: "Galerie dégradée",
        reparee: "Galerie étayée",
        contournee: "Galerie contournée",
      },
      aides: {
        aucune: "Aucune",
        discrete: "Discrète",
        publique: "Publique",
      },
      dependances: {
        critique: "critique",
        assuree: "assurée",
        contournee: "contournée",
        fermes: "fermés",
        precaires: "précaires",
        autonomes: "autonomes",
      },
      lotsDeFiltres: "{nombre} lots de filtres manquants",
      lotsDeRemedes: "{nombre} lots de remèdes manquants",
      reservesDEau: "{nombre} réserves d’Eau disponibles",
      libelles: {
        eyebrow: "Colonie · Embranchement autonome",
        pressions: "Pressions",
        marche: "Marché borné",
        dependances: "Dépendances au rail",
        contournement: "Contournement",
        route: "Route secondaire",
        aide: "Aide reçue",
        puitsLibres: "Puits Libres",
        republique: "République du Rail",
        filtres: "Filtres",
        remedes: "Remèdes",
        debouches: "Débouchés",
      },
    },
    en: {
      titre: "Free Crossing",
      statuts: {
        fragile: "Fragile colony",
        stabilisee: "Stabilized colony",
        autonome: "Autonomous colony",
      },
      relationsPuits: {
        fermee: "Closed",
        transactionnelle: "Transactional",
        cooperative: "Cooperative",
      },
      relationsRepublique: {
        fermee: "Closed",
        transactionnelle: "Transactional",
        cooperative: "Cooperative",
      },
      filtres: {
        critiques: "Filters critical",
        rationnes: "Filters rationed",
        stabilises: "Filters stabilized",
      },
      isolement: {
        menace: "Isolation threatening",
        endigue: "Isolation contained",
        leve: "Isolation lifted",
      },
      contournements: {
        inconnu: "Unknown",
        releve: "Surveyed but closed",
        praticable: "Passable",
      },
      routes: {
        degradee: "Gallery degraded",
        reparee: "Gallery shored up",
        contournee: "Gallery bypassed",
      },
      aides: {
        aucune: "None",
        discrete: "Discreet",
        publique: "Public",
      },
      dependances: {
        critique: "critical",
        assuree: "secured",
        contournee: "bypassed",
        fermes: "closed",
        precaires: "precarious",
        autonomes: "autonomous",
      },
      lotsDeFiltres: "{nombre} filter lots missing",
      lotsDeRemedes: "{nombre} medicine lots missing",
      reservesDEau: "{nombre} Water reserves available",
      libelles: {
        eyebrow: "Colony · Autonomous branch",
        pressions: "Pressures",
        marche: "Finite market",
        dependances: "Rail dependencies",
        contournement: "Bypass",
        route: "Secondary route",
        aide: "Aid received",
        puitsLibres: "Free Wells",
        republique: "Rail Republic",
        filtres: "Filters",
        remedes: "Medicine",
        debouches: "Outlets",
      },
    },
  },
  convergence: {
    fr: {
      titres: {
        marche: "Marché des Traverses",
        signal: "Signal-Zéro",
      },
      offresOfficielles: {
        ouverte_services:
          "1 échange · service lourd issu de Grand-Aiguillage",
        ouverte_coupleur:
          "1 échange · coupleur garanti par le registre républicain",
        epuisee: "Offre officielle épuisée",
      },
      offresClandestines: {
        ouverte_besoin:
          "1 échange · dernier lot de filtres destiné à Traverse-Libre",
        ouverte_surplus:
          "1 échange · filtres sans marque ou accès à la transmission",
        epuisee: "Offre clandestine épuisée",
      },
      interfaces: {
        inconnue: "Interface non relevée",
        rail: "Fréquence du Rail lue · verrouillage lourd documenté",
        puits:
          "Fréquence des Puits Libres lue · dégagement manuel documenté",
      },
      traces: {
        aucune: "Aucune rupture clandestine relevée",
        latente:
          "Bascule des manifestes · fil rompu et plombs déplacés",
        scellee: "Preuve complète conservée sous les scellés d’Ilyana",
        transmise:
          "Preuve transmise · attribution possible dès l’Aiguillage Zéro",
      },
      echosDeGrandAiguillage: {
        monopole: "Coupleur et Train-outil sous contrôle républicain",
        monopole_attelage:
          "Train-outil sous contrôle républicain · Attelage fédéré disponible en recours",
        ateliers: "Cote locale et ateliers négociés",
        ateliers_attelage:
          "Ateliers négociés · Attelage fédéré préparé pour le transport",
        attelage: "Attelage fédéré préparé pour le transport",
        absent: "Aucune préparation visitée · services initiaux seulement",
      },
      echosDeTraverseLibre: {
        contournement: "Contournement praticable et débouchés autonomes",
        contournement_public:
          "Contournement praticable · aide publique opposable au Rail",
        galerie: "Galerie étayée, liaison ferroviaire précaire",
        galerie_publique:
          "Galerie étayée · aide publique opposable au Rail",
        filtres: "Filtres reçus, dépendance partiellement desserrée",
        absent: "Colonie non visitée · besoins critiques encore visibles",
      },
      optionsDuClimax: {
        monopole: "Monopole républicain préparé",
        charte: "Charte de circulation partagée préparée",
        vol: "Vol avec contournement préparé",
        transport: "Transport autonome coûteux toujours disponible",
        transport_attelage:
          "Transport autonome fiabilisé par l’Attelage fédéré",
        transport_galerie:
          "Transport autonome par Galerie étayée · risque réduit",
        transport_attelage_galerie:
          "Transport autonome par Attelage fédéré et Galerie étayée",
      },
      libelles: {
        eyebrowMarche: "Jonction · Échanges finis",
        eyebrowSignal: "Enclave · Ligne Zéro",
        offreOfficielle: "Comptoir officiel",
        offreClandestine: "Bascule clandestine",
        interface: "Interface de la Ligne Zéro",
        trace: "Trace attribuable",
        echoGrandAiguillage: "Écho de Grand-Aiguillage",
        echoTraverseLibre: "Écho de Traverse-Libre",
        options: "Options préparées pour l’Aiguillage Zéro",
      },
    },
    en: {
      titres: {
        marche: "Sleeper Market",
        signal: "Zero Signal",
      },
      offresOfficielles: {
        ouverte_services:
          "1 trade · heavy service preserved from Grand Junction",
        ouverte_coupleur:
          "1 trade · coupler guaranteed by the republican register",
        epuisee: "Official offer exhausted",
      },
      offresClandestines: {
        ouverte_besoin:
          "1 trade · final filter lot intended for Free Crossing",
        ouverte_surplus:
          "1 trade · unmarked filters or access to the transmission",
        epuisee: "Clandestine offer exhausted",
      },
      interfaces: {
        inconnue: "Interface not surveyed",
        rail: "Rail frequency read · heavy locking documented",
        puits:
          "Free Wells frequency read · manual release documented",
      },
      traces: {
        aucune: "No clandestine break recorded",
        latente: "Manifest scales · broken wire and displaced seals",
        scellee: "Complete evidence held under Ilyana’s seals",
        transmise:
          "Evidence transmitted · attribution possible at Zero Junction",
      },
      echosDeGrandAiguillage: {
        monopole: "Coupler and Tool Train under republican control",
        monopole_attelage:
          "Tool Train under republican control · Federated Hauler available as fallback",
        ateliers: "Local dimension and negotiated workshops",
        ateliers_attelage:
          "Negotiated workshops · Federated Hauler prepared for transport",
        attelage: "Federated Hauler prepared for transport",
        absent: "No visited preparation · only initial services remain",
      },
      echosDeTraverseLibre: {
        contournement: "Passable bypass and autonomous outlets",
        contournement_public:
          "Passable bypass · public aid enforceable against the Rail",
        galerie: "Shored Gallery with a precarious railway link",
        galerie_publique:
          "Shored Gallery · public aid enforceable against the Rail",
        filtres: "Filters received, dependency partly loosened",
        absent: "Unvisited colony · critical needs remain visible",
      },
      optionsDuClimax: {
        monopole: "Republican monopoly prepared",
        charte: "Shared circulation charter prepared",
        vol: "Theft with bypass prepared",
        transport: "Costly autonomous transport always available",
        transport_attelage:
          "Autonomous transport secured by the Federated Hauler",
        transport_galerie:
          "Autonomous transport through the Shored Gallery · reduced risk",
        transport_attelage_galerie:
          "Autonomous transport through the Federated Hauler and Shored Gallery",
      },
      libelles: {
        eyebrowMarche: "Junction · Finite trades",
        eyebrowSignal: "Enclave · Zero Line",
        offreOfficielle: "Official counter",
        offreClandestine: "Clandestine scales",
        interface: "Zero Line interface",
        trace: "Attributable Trace",
        echoGrandAiguillage: "Grand Junction echo",
        echoTraverseLibre: "Free Crossing echo",
        options: "Options prepared for Zero Junction",
      },
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
  aiguillage: {
    fr: {
      titre: "Aiguillage Zéro",
      eyebrow: "Climax · Trame de Fer",
      solutions: {
        monopole: "Monopole républicain",
        charte: "Charte de circulation partagée",
        vol: "Vol et contournement",
        transport: "Transport autonome",
        attente: "Accord du Conseil en attente",
      },
      nomsDesSites: {
        barriereNeuve: "Barrière-Neuve",
        dortoirDixSept: "Dortoir Dix-Sept",
        pompeNeuve: "Pompe-Neuve",
        marcheDesTraverses: "Marché des Traverses",
        signalZero: "Signal-Zéro",
      },
      devenirsDeSites: {
        actif: "actif",
        evacue: "évacué",
        absorbe: "absorbé",
        abandonne: "abandonné",
      },
      formats: {
        grandAiguillage: "{statut} · {relation}",
        traverseLibre: "{statut} · {relation}",
        sites: "{sites}",
        routesOuvertes:
          "{nombre} Routes consignées · porte de la Couronne ouverte · retour verrouillé",
        routesFermees:
          "{nombre} Routes consignées · porte aval fermée jusqu’à la consignation",
        relations: "Rail : {rail} · Puits : {puits}",
        echoPlanifie:
          "Retour de l’accord régional et du registre de sortie planifié dans la Couronne muette",
        echoAConsigner: "Écho futur à consigner",
        detteTransport: "Dette de transport : {deficit} Matériaux",
      },
      soupcons: {
        trace: "Trace clandestine attribuable",
        aucun: "Aucun Soupçon clandestin",
      },
      aucunEngagement: "Aucun",
      libelles: {
        accordRegional: "Accord régional",
        grandAiguillage: "Grand-Aiguillage · sortie",
        traverseLibre: "Traverse-Libre · sortie",
        sites: "Sites",
        routes: "Routes",
        engagements: "Engagements",
        relations: "Relations",
        soupcons: "Soupçons clandestins",
        echoFutur: "Écho futur",
      },
      couts: {
        monopoleTrain:
          "Coût appliqué : {cout} Matériaux grâce au Train-outil préparé.",
        monopoleSansTrain:
          "Coût appliqué : {cout} Matériaux faute de Train-outil préparé.",
        transportAttelage:
          "Coût appliqué : {cout} Matériaux grâce à l’Attelage fédéré ; déficit de {deficit} transformé en dette, sans bloquer le passage.",
        transportSansAttelage:
          "Coût appliqué : {cout} Matériaux ; déficit de {deficit} transformé en dette, sans bloquer le passage.",
      },
    },
    en: {
      titre: "Zero Junction",
      eyebrow: "Climax · Iron Weave",
      solutions: {
        monopole: "Republican monopoly",
        charte: "Shared circulation charter",
        vol: "Theft and bypass",
        transport: "Autonomous transport",
        attente: "Council arrangement pending",
      },
      nomsDesSites: {
        barriereNeuve: "New Barrier",
        dortoirDixSept: "Dormitory Seventeen",
        pompeNeuve: "New Pump",
        marcheDesTraverses: "Sleeper Market",
        signalZero: "Zero Signal",
      },
      devenirsDeSites: {
        actif: "active",
        evacue: "evacuated",
        absorbe: "absorbed",
        abandonne: "abandoned",
      },
      formats: {
        grandAiguillage: "{statut} · {relation}",
        traverseLibre: "{statut} · {relation}",
        sites: "{sites}",
        routesOuvertes:
          "{nombre} Routes recorded · Crown gate open · return locked",
        routesFermees:
          "{nombre} Routes recorded · downstream gate closed until recording",
        relations: "Rail: {rail} · Wells: {puits}",
        echoPlanifie:
          "Regional arrangement and exit-register return planned in the Silent Crown",
        echoAConsigner: "Future echo to record",
        detteTransport: "Transport debt: {deficit} Materials",
      },
      soupcons: {
        trace: "Attributable clandestine Trace",
        aucun: "No clandestine Suspicion",
      },
      aucunEngagement: "None",
      libelles: {
        accordRegional: "Regional arrangement",
        grandAiguillage: "Grand Junction · exit",
        traverseLibre: "Free Crossing · exit",
        sites: "Sites",
        routes: "Routes",
        engagements: "Commitments",
        relations: "Relationships",
        soupcons: "Clandestine Suspicions",
        echoFutur: "Future echo",
      },
      couts: {
        monopoleTrain:
          "Applied cost: {cout} Materials thanks to the prepared Tool Train.",
        monopoleSansTrain:
          "Applied cost: {cout} Materials without a prepared Tool Train.",
        transportAttelage:
          "Applied cost: {cout} Materials thanks to the Federated Hauler; {deficit} shortfall becomes debt without blocking passage.",
        transportSansAttelage:
          "Applied cost: {cout} Materials; {deficit} shortfall becomes debt without blocking passage.",
      },
    },
  },
  couronne: {
    fr: {
      titre: "Approches de la Couronne",
      eyebrow: "Couronne muette · Deux voies",
      besoins: {
        "pieces-de-voie": "Pièces de voie et abris de quai",
        "filtres-de-sanctuaire": "Filtres du sanctuaire et relevés étanches",
      },
      interactions: {
        "en-attente": "interaction principale en attente",
        "mandat-republicain": "mandat ferroviaire ratifié",
        "atelier-commun": "atelier de voie commun ouvert",
        "sanctuaire-renforce": "sanctuaire renforcé",
        "releves-evacues": "relevés et gardiens évacués",
      },
      devenirs: {
        indetermine: "devenir encore indéterminé",
        actif: "actif",
        evacue: "évacué",
        absorbe: "absorbé",
        abandonne: "abandonné",
      },
      delegations: {
        absente: "absente",
        conditionnelle: "sous conditions",
        mandatee: "mandatée",
      },
      diagnostics: {
        inconnu: "Les trois montages du Nœud restent à comparer.",
        "socles-cartographies":
          "Berceau, Étalon et Précipitateur sont cartographiés sans sélection finale.",
        "compatibilites-etablies":
          "Les compatibilités des trois montages sont établies sans sélection finale.",
      },
      projets: {
        berceauDAncrage: "Berceau d’ancrage",
        etalonDeReaccord: "Étalon de réaccord",
        precipitateurEmbarque: "Précipitateur embarqué",
      },
      statutsDePreparation: {
        indisponible: "indisponible avec les moyens préservés",
        preparable: "préparable",
        amorce: "amorcé",
        reporte: "plans conservés pour une préparation ultérieure",
      },
      gardesDesPlans: {
        indecise: "Garde des plans encore indécise",
        ilyana: "Plans confiés à Ilyana sous scellés",
        equipes: "Plans répartis entre les équipes de la Cité-caravane",
      },
      formats: {
        site: "{besoin} · {interaction} · {devenir}",
        delegations:
          "République : {republique} · Pèlerins : {pelerins} · Puits Libres : {puits}",
        preparatif: "{projet} : {statut}",
      },
      libelles: {
        teteDeLigne: "Tête-de-Ligne",
        veilleDesTrois: "Veille-des-Trois",
        delegations: "Délégations héritées",
        diagnostic: "Diagnostic du Nœud",
        preparatifs: "Projets de transformation",
        gardeDesPlans: "Histoire de Compagnon",
      },
    },
    en: {
      titre: "Silent Crown Approaches",
      eyebrow: "Silent Crown · Two routes",
      besoins: {
        "pieces-de-voie": "Track parts and platform shelters",
        "filtres-de-sanctuaire": "Sanctuary filters and sealed surveys",
      },
      interactions: {
        "en-attente": "main interaction pending",
        "mandat-republicain": "rail mandate ratified",
        "atelier-commun": "shared track workshop opened",
        "sanctuaire-renforce": "sanctuary reinforced",
        "releves-evacues": "surveys and keepers evacuated",
      },
      devenirs: {
        indetermine: "future still undetermined",
        actif: "active",
        evacue: "evacuated",
        absorbe: "absorbed",
        abandonne: "abandoned",
      },
      delegations: {
        absente: "absent",
        conditionnelle: "conditional",
        mandatee: "mandated",
      },
      diagnostics: {
        inconnu: "The Node’s three assemblies still need comparison.",
        "socles-cartographies":
          "Cradle, Standard and Precipitator are mapped without selecting a final Solution.",
        "compatibilites-etablies":
          "Compatibility for all three assemblies is established without selecting a final Solution.",
      },
      projets: {
        berceauDAncrage: "Anchoring Cradle",
        etalonDeReaccord: "Retuning Standard",
        precipitateurEmbarque: "Mobile Precipitator",
      },
      statutsDePreparation: {
        indisponible: "unavailable with preserved means",
        preparable: "ready to prepare",
        amorce: "started",
        reporte: "plans retained for later preparation",
      },
      gardesDesPlans: {
        indecise: "Custody of the plans remains undecided",
        ilyana: "Plans entrusted to Ilyana under seal",
        equipes: "Plans distributed among Caravan-city teams",
      },
      formats: {
        site: "{besoin} · {interaction} · {devenir}",
        delegations:
          "Republic: {republique} · Pilgrims: {pelerins} · Free Wells: {puits}",
        preparatif: "{projet}: {statut}",
      },
      libelles: {
        teteDeLigne: "Railhead",
        veilleDesTrois: "Threefold Watch",
        delegations: "Inherited delegations",
        diagnostic: "Node diagnostic",
        preparatifs: "Transformation Projects",
        gardeDesPlans: "Companion Story",
      },
    },
  },
  voieColonies: {
    fr: {
      titre: "Voie des Colonies",
      eyebrow: "Couronne muette · Serres-de-Verre et Seuil",
      besoins: {
        "eau-pieces-equipes": "Eau, pièces et équipes coordonnées",
      },
      interactions: {
        "ralliement-en-attente": "ralliement en attente",
        "coalition-ralliee": "coalition des Colonies ralliée",
        "passage-force": "passage forcé sans coalition",
      },
      devenirs: {
        indetermine: "devenir indéterminé",
        "carrefour-allie": "carrefour allié",
        epuise: "serres épuisées par le passage",
      },
      retours: {
        delegation: "délégation présente",
        rapport: "rapport transmis",
        penurie: "pénurie rendue visible",
        requisition: "ordre de réquisition",
        atelier: "atelier représenté",
        autonomie: "délégation autonome",
        "habitants-du-seuil": "habitants représentés sur place",
      },
      cohortes: {
        absente: "aucune Cohorte au ralliement",
        integree: "Cohorte intégrée avec équipes de charpente étanche",
        redirigee: "Cohorte redirigée revenue par un rapport",
        refusee: "Cohorte refusée revenue par sa pénurie",
      },
      voies: {
        credible: "voie commune jugée crédible",
        fragile: "fragile — seul le recours coûteux est garanti",
      },
      booleens: { true: "oui", false: "non" },
      statutsDuSeuil: { fragile: "fragile", stable: "stable" },
      pressions: {
        "abris-satures": "abris saturés",
        "pieces-rares": "pièces rares",
        "delegations-rivales": "délégations rivales",
      },
      marches: {
        limite: "limité à un échange",
        rationne: "sous rationnement",
        epuise: "épuisé",
      },
      abris: {
        satures: "saturés",
        partages: "partagés avec les délégations",
        "reserves-au-convoi": "réservés au convoi",
      },
      releves: {
        inconnus: "encore inconnus",
        recoupes: "recopiés et recoupés",
        "conserves-separes": "conservés par séries séparées",
      },
      revendications: {
        "voix-revendiquee": "voix du Seuil revendiquée",
        "voix-garantie": "voix du Seuil garantie",
        "tutelle-contestee": "tutelle du convoi contestée",
      },
      acces: {
        "non-prepare": "accès du Nœud non préparé",
        "voie-alliee": "voie alliée entretenue par les Colonies",
        "breche-couteuse": "brèche coûteuse tenue par les Habitants",
      },
      gardes: {
        indecise: "garde du registre indécise",
        maelys: "registre confié à Maëlys et transmissible",
        commune: "registre commun réparti entre les délégations",
      },
      formats: {
        serres: "{besoin} · {interaction} · {devenir}",
        retour: "{colonie} : {retour}",
        credibilite:
          "Voie {voie} · {alliances} alliances · {equipes} équipes · Eau : {eau} · pièces : {pieces}",
        seuil:
          "État {statut} · Pressions : {pressions} · Marché {marche} · Abris {abris} · Relevés {releves} · {revendication}",
      },
      nomsDesColonies: {
        hautPuits: "Haut-Puits",
        veilleBasse: "Veille-Basse",
        grandAiguillage: "Grand-Aiguillage",
        traverseLibre: "Traverse-Libre",
        seuil: "Le Seuil",
      },
      libelles: {
        serres: "Serres-de-Verre",
        retours: "Retour des cinq Colonies",
        cohorte: "Cohorte",
        credibilite: "Crédibilité de la voie",
        seuil: "Colonie du Seuil",
        acces: "Préparation de l’accès",
        garde: "Registre des ralliés",
      },
    },
    en: {
      titre: "Colony Route",
      eyebrow: "Silent Crown · Glasshouses and Threshold",
      besoins: {
        "eau-pieces-equipes": "Water, parts, and coordinated crews",
      },
      interactions: {
        "ralliement-en-attente": "rally pending",
        "coalition-ralliee": "Colony coalition rallied",
        "passage-force": "passage forced without a coalition",
      },
      devenirs: {
        indetermine: "future undetermined",
        "carrefour-allie": "allied crossroads",
        epuise: "glasshouses exhausted by the passage",
      },
      retours: {
        delegation: "delegation present",
        rapport: "report relayed",
        penurie: "shortage made visible",
        requisition: "requisition order",
        atelier: "workshop represented",
        autonomie: "autonomous delegation",
        "habitants-du-seuil": "residents represented on site",
      },
      cohortes: {
        absente: "no Cohort at the rally",
        integree: "integrated Cohort with sealed-frame crews",
        redirigee: "redirected Cohort returned through a report",
        refusee: "refused Cohort returned through its shortage",
      },
      voies: {
        credible: "shared route judged credible",
        fragile: "fragile — only the costly fallback is guaranteed",
      },
      booleens: { true: "yes", false: "no" },
      statutsDuSeuil: { fragile: "fragile", stable: "stable" },
      pressions: {
        "abris-satures": "saturated shelters",
        "pieces-rares": "scarce parts",
        "delegations-rivales": "rival delegations",
      },
      marches: {
        limite: "limited to one exchange",
        rationne: "under rationing",
        epuise: "exhausted",
      },
      abris: {
        satures: "saturated",
        partages: "shared with the delegations",
        "reserves-au-convoi": "reserved for the caravan",
      },
      releves: {
        inconnus: "still unknown",
        recoupes: "copied and cross-checked",
        "conserves-separes": "kept as separate series",
      },
      revendications: {
        "voix-revendiquee": "Threshold’s voice claimed",
        "voix-garantie": "Threshold’s voice guaranteed",
        "tutelle-contestee": "caravan authority challenged",
      },
      acces: {
        "non-prepare": "Node access unprepared",
        "voie-alliee": "allied route maintained by the Colonies",
        "breche-couteuse": "costly breach held by Inhabitants",
      },
      gardes: {
        indecise: "custody of the register undecided",
        maelys: "register entrusted to Maëlys and transferable",
        commune: "shared register distributed among the delegations",
      },
      formats: {
        serres: "{besoin} · {interaction} · {devenir}",
        retour: "{colonie}: {retour}",
        credibilite:
          "{voie} route · {alliances} alliances · {equipes} crews · Water: {eau} · parts: {pieces}",
        seuil:
          "{statut} · Pressures: {pressions} · {marche} market · {abris} shelters · Surveys {releves} · {revendication}",
      },
      nomsDesColonies: {
        hautPuits: "High Well",
        veilleBasse: "Lower Watch",
        grandAiguillage: "Grand Junction",
        traverseLibre: "Free Crossing",
        seuil: "Threshold",
      },
      libelles: {
        serres: "Glasshouses",
        retours: "Return of the five Colonies",
        cohorte: "Cohort",
        credibilite: "Route credibility",
        seuil: "Threshold Colony",
        acces: "Access preparation",
        garde: "Rallied parties register",
      },
    },
  },
  ouvertureCouronne: {
    fr: {
      titre: "Ouverture de la Couronne",
      eyebrow: "Anneau intérieur · dernier Conseil et Nœud central",
      nomsDesOuvertures: {
        ferroviaire: "Voie ferroviaire",
        phares: "Voie des Phares",
        colonies: "Voie des Colonies",
        breche: "Brèche de secours",
      },
      statutsDesOuvertures: {
        indisponible: "ouverture indisponible",
        risquee: "ouverture risquée",
        preparee: "ouverture préparée",
        "toujours-disponible": "recours toujours disponible",
      },
      acteurs: {
        republique: "délégation de la République",
        "atelier-commun": "atelier commun de Tête-de-Ligne",
        pelerins: "Pèlerins du sanctuaire",
        releveurs: "releveurs des Trois Veilles",
        coalition: "coalition des cinq Colonies",
        "delegations-fragiles": "délégations sans équipes coordonnées",
        absents: "aucun acteur mandaté",
        breche: "équipes de démolition du convoi",
      },
      couts: {
        ferroviaire: "{materiaux} Matériaux",
        phares: "{eau} Eau",
        colonies: "{eau} Eau et {materiaux} Matériaux",
        breche:
          "dommages irréversibles aux bus de réaccord et collecteurs du Précipitateur",
      },
      projets: {
        berceau: "Berceau d’ancrage",
        etalon: "Étalon de réaccord",
        precipitateur: "Précipitateur embarqué",
      },
      diagnostics: {
        "portance-inconnue": "portance encore inconnue",
        "portance-confirmee": "portance confirmée",
        "frequences-inconnues": "fréquences encore inconnues",
        "frequences-calibrees": "fréquences calibrées",
        "decharges-inconnues": "décharges encore inconnues",
        "decharges-cartographiees": "décharges cartographiées",
      },
      preparations: {
        absente: "préparation absente",
        amorcee: "préparation amorcée",
        calibree: "préparation calibrée",
        assemble: "préparation assemblée",
      },
      reductions: {
        berceau: "4 Matériaux sur la voie ferroviaire",
        etalon: "6 Eau sur la voie des Phares",
        precipitateur: "2 Eau et 2 Matériaux sur la voie des Colonies",
        aucune: "aucune réduction",
      },
      delegations: {
        absente: "siège vide",
        conditionnelle: "voix conditionnelle",
        mandatee: "voix mandatée",
      },
      ouverturesChoisies: {
        aucune: "aucune ouverture décidée",
        ferroviaire: "arc ferroviaire retenu",
        phares: "synchronisation des Phares retenue",
        colonies: "Porte des Colonies retenue",
        breche: "brèche de secours retenue",
      },
      noeud: {
        inaccessible: "Nœud encore inaccessible",
        intact: "Nœud atteint avec ses organes préservés",
        contraint: "Nœud atteint sous contrainte",
        endommage:
          "Nœud atteint mais bus de réaccord et collecteurs de précipitation détruits",
      },
      solutions: {
        ancrer: "Ancrer le cœur",
        reaccorder: "Réaccorder le réseau",
        precipiter: "Faire tomber la cendre",
      },
      statutsDesSolutions: {
        preparee: "préparation favorable",
        risquee: "issue explicitement risquée",
        impossible: "issue rendue impossible",
      },
      gardes: {
        indecise: "garde de la clef encore indécise",
        gardiennes: "clef confiée à des gardiennes transmissibles",
        collective: "clef consignée entre les équipes",
      },
      formats: {
        ouverture: "{nom} — {statut} · {acteurs} · Coût : {cout}",
        projet:
          "{projet} — {diagnostic} · {preparation} · réduction : {reduction}",
        conseil:
          "République : {republique} · Pèlerins : {pelerins} · Puits Libres : {puits}",
        solution: "{solution} — {statut}",
      },
      libelles: {
        ouvertures: "Voies d’accès consignées",
        projets: "Projets de transformation",
        conseil: "Représentation au dernier Conseil",
        choix: "Ouverture retenue",
        noeud: "État du Nœud",
        solutions: "Conséquences sur les Solutions",
        garde: "Garde de la clef",
      },
    },
    en: {
      titre: "Opening the Crown",
      eyebrow: "Inner Ring · final Council and Central Node",
      nomsDesOuvertures: {
        ferroviaire: "Rail route",
        phares: "Beacon route",
        colonies: "Colony route",
        breche: "Emergency breach",
      },
      statutsDesOuvertures: {
        indisponible: "opening unavailable",
        risquee: "risky opening",
        preparee: "prepared opening",
        "toujours-disponible": "fallback always available",
      },
      acteurs: {
        republique: "Republic delegation",
        "atelier-commun": "Railhead shared workshop",
        pelerins: "sanctuary Pilgrims",
        releveurs: "Three Watches surveyors",
        coalition: "five-Colony coalition",
        "delegations-fragiles": "delegations without coordinated crews",
        absents: "no mandated actor",
        breche: "caravan demolition crews",
      },
      couts: {
        ferroviaire: "{materiaux} Materials",
        phares: "{eau} Water",
        colonies: "{eau} Water and {materiaux} Materials",
        breche:
          "irreversible damage to the retuning buses and Precipitator collectors",
      },
      projets: {
        berceau: "Anchoring Cradle",
        etalon: "Retuning Standard",
        precipitateur: "Onboard Precipitator",
      },
      diagnostics: {
        "portance-inconnue": "load remains unknown",
        "portance-confirmee": "load confirmed",
        "frequences-inconnues": "frequencies remain unknown",
        "frequences-calibrees": "frequencies calibrated",
        "decharges-inconnues": "discharges remain unknown",
        "decharges-cartographiees": "discharges mapped",
      },
      preparations: {
        absente: "preparation absent",
        amorcee: "preparation started",
        calibree: "preparation calibrated",
        assemble: "preparation assembled",
      },
      reductions: {
        berceau: "4 Materials on the rail route",
        etalon: "6 Water on the Beacon route",
        precipitateur: "2 Water and 2 Materials on the Colony route",
        aucune: "no reduction",
      },
      delegations: {
        absente: "empty seat",
        conditionnelle: "conditional voice",
        mandatee: "mandated voice",
      },
      ouverturesChoisies: {
        aucune: "no opening decided",
        ferroviaire: "rail arc selected",
        phares: "Beacon synchronization selected",
        colonies: "Colony Gate selected",
        breche: "emergency breach selected",
      },
      noeud: {
        inaccessible: "Node still inaccessible",
        intact: "Node reached with its organs preserved",
        contraint: "Node reached under strain",
        endommage:
          "Node reached with retuning buses and precipitation collectors destroyed",
      },
      solutions: {
        ancrer: "Anchor the core",
        reaccorder: "Retune the network",
        precipiter: "Bring down the ash",
      },
      statutsDesSolutions: {
        preparee: "favorable preparation",
        risquee: "explicitly risky outcome",
        impossible: "outcome made impossible",
      },
      gardes: {
        indecise: "key custody still undecided",
        gardiennes: "key entrusted to transferable keepers",
        collective: "key recorded among the crews",
      },
      formats: {
        ouverture: "{nom} — {statut} · {acteurs} · Cost: {cout}",
        projet:
          "{projet} — {diagnostic} · {preparation} · reduction: {reduction}",
        conseil:
          "Republic: {republique} · Pilgrims: {pelerins} · Free Wells: {puits}",
        solution: "{solution} — {statut}",
      },
      libelles: {
        ouvertures: "Recorded access paths",
        projets: "Transformation Projects",
        conseil: "Representation at the final Council",
        choix: "Selected opening",
        noeud: "Node state",
        solutions: "Consequences for the Solutions",
        garde: "Key custody",
      },
    },
  },
  finale: {
    fr: {
      titre: "Contrat final du Nœud",
      eyebrow: "Cœur mécanique · trois Solutions sans tirage",
      solutions: {
        ancrer: "Ancrer le cœur",
        reaccorder: "Réaccorder le réseau",
        precipiter: "Faire tomber la cendre",
      },
      statuts: {
        preparee: "Solution finale préparée",
        risquee: "Solution finale risquée",
        impossible: "Solution finale impossible",
      },
      disponibilites: {
        selectionnable: "sélection permise par les causes",
        "non-selectionnable": "sélection interdite par les causes",
      },
      causes: {
        "berceau-amorce": "Berceau d’ancrage amorcé",
        "berceau-absent": "Berceau d’ancrage absent",
        "etalon-calibre": "Étalon de réaccord calibré",
        "etalon-absent": "Étalon de réaccord absent",
        "precipitateur-assemble": "Précipitateur embarqué assemblé",
        "precipitateur-absent": "Précipitateur embarqué absent",
        "noeud-preserve": "organes du Nœud préservés",
        "noeud-contraint": "organes du Nœud sous contrainte",
        "noeud-endommage":
          "bus et collecteurs du Nœud détruits par la brèche",
        "coalition-presente": "coalition des cinq Colonies mandatée",
        "coalition-absente": "coalition des Colonies non préparée",
        "accord-partage": "accord régional de partage établi",
        "accord-ferme": "accord régional fermé ou centralisé",
        "specialistes-reaccord-reunis":
          "spécialistes de fréquence et d’atelier réunis",
        "specialistes-reaccord-absents":
          "spécialistes du Réaccord non réunis",
        "engagements-reaccord-actifs":
          "Engagements régionaux applicables au maillage",
        "engagements-reaccord-absents":
          "aucun Engagement applicable au maillage",
        "connaissance-reseau-etablie":
          "fonction du Réseau ancien et de ses décharges établie",
        "connaissance-reseau-absente":
          "fonction environnementale du Réseau encore lacunaire",
        "ligne-zero-relevee": "Ligne Zéro relevée dans les Bassins",
        "ligne-zero-absente": "référence de la Ligne Zéro absente",
        "confinement-bassins-prepare":
          "confinement et Décanteur documentés dans les Bassins",
        "confinement-bassins-absent":
          "conséquences des dépôts sans confinement préparé",
        "gouvernance-bassins-partagee":
          "contrôle partagé des bassins consigné",
        "gouvernance-bassins-contrainte":
          "contrôle coercitif des bassins consigné",
        "gouvernance-bassins-absente":
          "aucune autorité crédible sur les bassins",
        "ressources-suffisantes": "coût déterminé couvert",
        "materiaux-insuffisants": "Matériaux sous le coût déterminé",
        "eau-insuffisante": "Eau sous le coût déterminé",
        "habitants-insuffisants": "Habitants sous la marge d’exposition",
      },
      ressources: {
        eau: "Eau requise",
        materiaux: "Matériaux requis",
        habitants: "Habitants comptés au coût final",
      },
      selections: {
        aucune: "aucune Solution irréversible engagée",
        "ancrage-prepare": "Ancrage préparé irréversiblement engagé",
        "ancrage-risque": "Ancrage risqué irréversiblement engagé",
        "reaccord-prepare":
          "Réaccord préparé irréversiblement engagé",
        "reaccord-risque":
          "Réaccord risqué irréversiblement engagé",
        "precipitation-preparee":
          "Précipitation préparée irréversiblement engagée",
        "precipitation-risquee":
          "Précipitation risquée irréversiblement engagée",
      },
      variantes: {
        aucune: "variante finale encore indécise",
        "refuge-commun": "Refuge commun",
        "citadelle-de-cendre": "Citadelle de cendre",
        "dernier-rempart": "Dernier Rempart",
        constellation: "Constellation",
        "reseau-de-fer": "Réseau de fer",
        "veilles-dispersees": "Veilles dispersées",
        "ciel-rendu": "Ciel rendu",
        "terre-des-sacrifies": "Terre des sacrifiés",
        "pluie-noire": "Pluie noire",
      },
      stabilites: {
        stable: "stabilité technique partagée",
        fortifiee: "stabilité technique fortifiée",
        "sous-contrainte": "stabilité technique sous contrainte",
        maillee: "stabilité du maillage entretenue",
        rigide: "stabilité du maillage rigide",
        fragmentee: "stabilité fragmentée entre les Veilles",
        progressive: "précipitation lente et confinée",
        forcee: "précipitation stable par contrainte",
        dispersee: "retombées noires dispersées",
      },
      controles: {
        partage: "contrôle politique distribué",
        centralise: "contrôle politique centralisé",
        equipes: "contrôle gardé par les équipes",
        coalition: "réseau détenu par la coalition",
        republique: "réseau détenu par la République",
        "sans-proprietaire": "aucun propriétaire du réseau entier",
        "conseil-des-bassins":
          "bassins administrés par leur Conseil",
        "autorite-du-noeud":
          "bassins assignés par l’autorité du Nœud",
        fracture: "contrôle politique fracturé",
      },
      sortsDuCoeur: {
        immobilise: "cœur immobilisé dans le Refuge",
        verrouille: "cœur verrouillé par la Citadelle",
        sollicite: "cœur maintenu sous sollicitation",
        relaye: "cœur relayé par la Constellation",
        subordonne: "cœur subordonné au Réseau de fer",
        fragmente: "fonction du cœur fragmentée entre les Veilles",
        preserve: "cœur mobile préservé mais périodiquement arrêté",
        expose: "cœur mobile exposé par le débit forcé",
        consume: "cœur mobile consumé par la conversion",
      },
      coutsHumains: {
        contenu: "coût humain contenu",
        inegal: "coût humain réparti inégalement",
        eleve: "coût humain durablement élevé",
      },
      aucunBilan:
        "Aucun bilan final : la Dernière négociation reste ouverte.",
      formats: {
        solution: "{solution} — {statut} · {disponibilite}",
        cout:
          "Coût déterminé : {eau} Eau · {materiaux} Matériaux · {habitants} Habitants",
        bilan:
          "{stabilite} · {controle} · {sortDuCoeur} · {coutHumain}",
      },
      libelles: {
        solutions: "États des trois Solutions",
        causes: "Causes consultables",
        selection: "Solution engagée",
        negociation: "Options crédibles de la Dernière négociation",
        variante: "Variante de la Solution",
        bilan: "Stabilité, contrôle, sort du cœur et coût humain",
      },
    },
    en: {
      titre: "Final Node contract",
      eyebrow: "Mechanical heart · three Solutions without a roll",
      solutions: {
        ancrer: "Anchor the heart",
        reaccorder: "Retune the network",
        precipiter: "Bring down the ash",
      },
      statuts: {
        preparee: "prepared final Solution",
        risquee: "risky final Solution",
        impossible: "impossible final Solution",
      },
      disponibilites: {
        selectionnable: "selection permitted by established causes",
        "non-selectionnable": "selection barred by established causes",
      },
      causes: {
        "berceau-amorce": "Anchoring Cradle started",
        "berceau-absent": "Anchoring Cradle absent",
        "etalon-calibre": "Retuning Standard calibrated",
        "etalon-absent": "Retuning Standard absent",
        "precipitateur-assemble": "Onboard Precipitator assembled",
        "precipitateur-absent": "Onboard Precipitator absent",
        "noeud-preserve": "Node organs preserved",
        "noeud-contraint": "Node organs under strain",
        "noeud-endommage":
          "Node buses and collectors destroyed by the breach",
        "coalition-presente": "five-Colony coalition mandated",
        "coalition-absente": "Colony coalition not prepared",
        "accord-partage": "regional sharing agreement established",
        "accord-ferme": "regional agreement closed or centralized",
        "specialistes-reaccord-reunis":
          "frequency and workshop specialists assembled",
        "specialistes-reaccord-absents":
          "Retuning specialists not assembled",
        "engagements-reaccord-actifs":
          "regional Commitments applicable to the mesh",
        "engagements-reaccord-absents":
          "no Commitment applicable to the mesh",
        "connaissance-reseau-etablie":
          "Ancient Network function and discharges established",
        "connaissance-reseau-absente":
          "environmental function of the Network still incomplete",
        "ligne-zero-relevee": "Zero Line surveyed in the Basins",
        "ligne-zero-absente": "Zero Line reference absent",
        "confinement-bassins-prepare":
          "containment and Settler documented in the Basins",
        "confinement-bassins-absent":
          "deposit consequences without prepared containment",
        "gouvernance-bassins-partagee":
          "shared control of the basins recorded",
        "gouvernance-bassins-contrainte":
          "coercive control of the basins recorded",
        "gouvernance-bassins-absente":
          "no credible authority over the basins",
        "ressources-suffisantes": "determined cost covered",
        "materiaux-insuffisants": "Materials below determined cost",
        "eau-insuffisante": "Water below determined cost",
        "habitants-insuffisants": "Inhabitants below exposure margin",
      },
      ressources: {
        eau: "Required Water",
        materiaux: "Required Materials",
        habitants: "Exposed Inhabitants",
      },
      selections: {
        aucune: "no irreversible Solution committed",
        "ancrage-prepare": "prepared Anchoring irreversibly committed",
        "ancrage-risque": "risky Anchoring irreversibly committed",
        "reaccord-prepare":
          "prepared Retuning irreversibly committed",
        "reaccord-risque":
          "risky Retuning irreversibly committed",
        "precipitation-preparee":
          "prepared Precipitation irreversibly committed",
        "precipitation-risquee":
          "risky Precipitation irreversibly committed",
      },
      variantes: {
        aucune: "final variant still undecided",
        "refuge-commun": "Common Refuge",
        "citadelle-de-cendre": "Ash Citadel",
        "dernier-rempart": "Last Rampart",
        constellation: "Constellation",
        "reseau-de-fer": "Iron Network",
        "veilles-dispersees": "Scattered Watches",
        "ciel-rendu": "Returned Sky",
        "terre-des-sacrifies": "Land of the Sacrificed",
        "pluie-noire": "Black Rain",
      },
      stabilites: {
        stable: "shared technical stability",
        fortifiee: "fortified technical stability",
        "sous-contrainte": "technical stability under strain",
        maillee: "maintained mesh stability",
        rigide: "rigid mesh stability",
        fragmentee: "stability fragmented among the Watches",
        progressive: "slow and contained precipitation",
        forcee: "precipitation stabilized through coercion",
        dispersee: "black fallout dispersed",
      },
      controles: {
        partage: "distributed political control",
        centralise: "centralized political control",
        equipes: "control held by the crews",
        coalition: "network owned by the coalition",
        republique: "network owned by the Republic",
        "sans-proprietaire": "no owner of the whole network",
        "conseil-des-bassins":
          "basins administered by their Council",
        "autorite-du-noeud":
          "basins assigned by the Node authority",
        fracture: "fractured political control",
      },
      sortsDuCoeur: {
        immobilise: "heart immobilized within the Refuge",
        verrouille: "heart locked by the Citadel",
        sollicite: "heart kept under load",
        relaye: "heart relayed by the Constellation",
        subordonne: "heart subordinated to the Iron Network",
        fragmente: "heart function fragmented among the Watches",
        preserve: "mobile heart preserved but periodically stopped",
        expose: "mobile heart exposed by forced flow",
        consume: "mobile heart consumed by conversion",
      },
      coutsHumains: {
        contenu: "contained human cost",
        inegal: "unequally distributed human cost",
        eleve: "lastingly high human cost",
      },
      aucunBilan:
        "No final assessment: the Last Negotiation remains open.",
      formats: {
        solution: "{solution} — {statut} · {disponibilite}",
        cout:
          "Determined cost: {eau} Water · {materiaux} Materials · {habitants} Inhabitants",
        bilan:
          "{stabilite} · {controle} · {sortDuCoeur} · {coutHumain}",
      },
      libelles: {
        solutions: "States of the three Solutions",
        causes: "Consultable causes",
        selection: "Committed Solution",
        negociation: "Credible Last Negotiation options",
        variante: "Solution variant",
        bilan: "Stability, control, heart outcome, and human cost",
      },
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
