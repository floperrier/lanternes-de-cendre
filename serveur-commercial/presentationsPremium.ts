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
