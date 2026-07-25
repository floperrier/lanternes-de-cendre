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
      crise: {
        alerteTitre: "Aggravation annoncée — cascade matérielle",
        alerteCause:
          "La Voie des Ponts Lourds a chargé un châssis sans marge ; l’entretien différé et le refroidissement rationné annoncent une rupture.",
        titre: "Crise — Cascade matérielle de la Trame",
        cause:
          "La Charge accumulée sur la route dégradée s’est propagée dans les châssis privés de refroidissement et d’entretien préventif.",
        chaine: [
          "La Voie des Ponts Lourds dégradée a transmis ses efforts aux châssis.",
          "La marge de Charge et l’entretien différé ne peuvent plus les absorber.",
          "Le refroidissement rationné laisse la déformation progresser.",
          "Rupture : plusieurs assemblages cèdent en cascade.",
        ],
        reponses: {
          "etayer-chassis": {
            intention: "Étayer les châssis dans l’urgence",
            coutConnu: "7 Matériaux",
            consequence:
              "Les étais restent une réparation visible et irréversible de la traversée.",
            mitigation:
              "La Charge peut être répartie au Marché des Traverses sous un Tronçon.",
            pireConsequence:
              "Sans répartition au prochain Tronçon, le transport autonome restera plus coûteux.",
            attribution: "Équipes d’entretien du convoi",
          },
          "detacher-plateforme": {
            intention: "Détacher une Plateforme mobile",
            coutConnu: "1 Plateforme",
            consequence:
              "La formation perd définitivement une Plateforme et ses capacités.",
            mitigation:
              "L’attelage allégé peut être recalé à Signal-Zéro sous deux Tronçons.",
            pireConsequence:
              "Sans recalage à Signal-Zéro, la perte ne soulagera aucun transport ultérieur.",
            attribution: "Équipes d’entretien et foyers de la Plateforme",
          },
        },
        cicatrices: {
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Châssis étayé dans l’urgence",
          "cicatrice.plateforme-detachee-trame":
            "Plateforme détachée dans la Trame",
        },
        consequencesCicatrices: {
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Les étais d’urgence restent visibles même après la répartition de la Charge.",
          "cicatrice.plateforme-detachee-trame":
            "La Plateforme perdue ne rejoint jamais la formation, même après le recalage.",
        },
        causes: {
          "crise.trame.etayer-chassis": "Étaiement d’urgence des châssis",
          "crise.trame.detacher-plateforme":
            "Détachement irréversible d’une Plateforme",
        },
        garanties: {
          "charge-repartie-trame": "Charge répartie dans la Trame",
          "attelage-recale-trame": "Attelage recalé à Signal-Zéro",
        },
        destinations: {
          "marche-des-traverses": "Marché des Traverses",
          "signal-zero": "Signal-Zéro",
        },
        conditionsRecuperation: {
          "charge-repartie-trame":
            "Achever le Tronçon vers le Marché des Traverses.",
          "attelage-recale-trame":
            "Atteindre Signal-Zéro sous deux Tronçons.",
        },
      },
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
      crise: {
        alerteTitre: "Escalation announced — material cascade",
        alerteCause:
          "The Heavy Bridges Track loaded a chassis with no margin; deferred maintenance and rationed cooling now announce failure.",
        titre: "Crisis — Iron Weave material cascade",
        cause:
          "Load accumulated on the degraded track propagated through chassis deprived of cooling and preventive maintenance.",
        chaine: [
          "The degraded Heavy Bridges Track transferred its strain to the chassis.",
          "The remaining Load margin and deferred maintenance can no longer absorb it.",
          "Rationed cooling lets the deformation keep spreading.",
          "Failure: several assemblies break in cascade.",
        ],
        reponses: {
          "etayer-chassis": {
            intention: "Shore up the chassis immediately",
            coutConnu: "7 Materials",
            consequence:
              "The braces remain a visible and irreversible scar of the crossing.",
            mitigation:
              "Load can be redistributed at Sleeper Market within one route segment.",
            pireConsequence:
              "Without redistribution on the next segment, autonomous transport stays more expensive.",
            attribution: "Convoy maintenance crews",
          },
          "detacher-plateforme": {
            intention: "Detach one mobile Platform",
            coutConnu: "1 Platform",
            consequence:
              "The formation permanently loses one Platform and its capacities.",
            mitigation:
              "The lighter consist can be realigned at Zero Signal within two segments.",
            pireConsequence:
              "Without realignment at Zero Signal, the loss will ease no later transport.",
            attribution: "Maintenance crews and the Platform’s Hearths",
          },
        },
        cicatrices: {
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Chassis shored up in an emergency",
          "cicatrice.plateforme-detachee-trame":
            "Platform detached in the Iron Weave",
        },
        consequencesCicatrices: {
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Emergency braces remain visible even after Load is redistributed.",
          "cicatrice.plateforme-detachee-trame":
            "The lost Platform never rejoins the formation, even after realignment.",
        },
        causes: {
          "crise.trame.etayer-chassis": "Emergency chassis shoring",
          "crise.trame.detacher-plateforme":
            "Irreversible Platform detachment",
        },
        garanties: {
          "charge-repartie-trame": "Load redistributed in the Iron Weave",
          "attelage-recale-trame": "Consist realigned at Zero Signal",
        },
        destinations: {
          "marche-des-traverses": "Sleeper Market",
          "signal-zero": "Zero Signal",
        },
        conditionsRecuperation: {
          "charge-repartie-trame":
            "Complete the route segment to Sleeper Market.",
          "attelage-recale-trame":
            "Reach Zero Signal within two route segments.",
        },
      },
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
      crise: {
        alerteTitre: "Aggravation annoncée — accueil sous pénurie",
        alerteCause:
          "La Cohorte accueillie épuise les réserves et les capacités filtrées de Veille-Basse.",
        titre: "Crise — Cohorte accueillie sous pénurie",
        cause:
          "L’accueil décidé sous pénurie a saturé simultanément les réserves et les sas filtrés.",
        chaine: [
          "La Cohorte a été accueillie alors que l’Eau restait sous tension.",
          "Les réserves et les capacités d’accueil ont atteint leur limite.",
          "Rupture : la Cohorte, les réserves et les sas doivent être arbitrés.",
        ],
        reponses: {
          "partager-reserves-cohorte": {
            intention: "Partager les Vivres d’urgence avec la Cohorte",
            coutConnu: "6 Vivres",
            consequence:
              "Les réserves du convoi restent durablement entamées à Veille-Basse.",
            mitigation:
              "La Cohorte traverse la pénurie immédiate sans nouvelle exposition.",
            pireConsequence:
              "Le prochain Tronçon commencera avec une autonomie de Vivres réduite.",
            attribution: "Cohorte du Sillon",
          },
          "renforcer-accueil": {
            intention: "Renforcer les capacités d’accueil filtrées",
            coutConnu: "5 Matériaux",
            consequence:
              "Les capacités de Veille-Basse restent saturées malgré le renfort.",
            mitigation:
              "Les sas séparent la Cohorte des zones les plus exposées.",
            pireConsequence:
              "Les réparations du prochain Tronçon manqueront de Matériaux.",
            attribution: "Techniciens de Veille-Basse",
          },
        },
        cicatrices: {
          "cicatrice.reserves-partagees-veille-basse":
            "Réserves partagées à Veille-Basse",
          "cicatrice.capacites-accueil-saturees":
            "Capacités d’accueil saturées",
        },
        consequencesCicatrices: {
          "cicatrice.reserves-partagees-veille-basse":
            "Le partage d’urgence réduit durablement les réserves disponibles après Veille-Basse.",
          "cicatrice.capacites-accueil-saturees":
            "Les sas filtrés restent marqués par la saturation de l’accueil.",
        },
        causes: {
          "crise.veille-basse.partager-reserves-cohorte":
            "Partage des Vivres d’urgence",
          "crise.veille-basse.renforcer-accueil":
            "Renfort des capacités d’accueil",
        },
        garanties: {
          "cohorte-hydratee": "Cohorte hydratée",
          "accueil-stabilise": "Accueil stabilisé",
        },
        conditionsRecuperation: {
          "cohorte-hydratee": "Ouvrir l’Hospice du Sillon.",
          "accueil-stabilise": "Renforcer les sas de Veille-Basse.",
        },
      },
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
      crise: {
        alerteTitre: "Escalation announced — shelter under shortage",
        alerteCause:
          "Welcoming the Cohort is exhausting Veille-Basse’s reserves and filtered shelter capacity.",
        titre: "Crisis — Cohort welcomed under shortage",
        cause:
          "Sheltering the Cohort during the shortage saturated both reserves and filtered airlocks.",
        chaine: [
          "The Cohort was welcomed while Water remained strained.",
          "Reserves and shelter capacity reached their limit.",
          "Shortage: the Cohort, reserves and airlocks now require an explicit trade-off.",
        ],
        reponses: {
          "partager-reserves-cohorte": {
            intention: "Share emergency Provisions with the Cohort",
            coutConnu: "6 Provisions",
            consequence:
              "Convoy reserves remain depleted after Veille-Basse.",
            mitigation:
              "The Cohort survives the immediate shortage without further exposure.",
            pireConsequence:
              "The next route segment begins with reduced Provisions autonomy.",
            attribution: "Sillon Cohort",
          },
          "renforcer-accueil": {
            intention: "Reinforce filtered shelter capacity",
            coutConnu: "5 Materials",
            consequence:
              "Veille-Basse’s shelter capacity remains scarred by saturation.",
            mitigation:
              "The airlocks separate the Cohort from the most exposed areas.",
            pireConsequence:
              "Repairs on the next route segment will lack Materials.",
            attribution: "Veille-Basse technicians",
          },
        },
        cicatrices: {
          "cicatrice.reserves-partagees-veille-basse":
            "Reserves shared at Veille-Basse",
          "cicatrice.capacites-accueil-saturees":
            "Shelter capacity saturated",
        },
        consequencesCicatrices: {
          "cicatrice.reserves-partagees-veille-basse":
            "Emergency sharing permanently reduces the reserves available after Veille-Basse.",
          "cicatrice.capacites-accueil-saturees":
            "The filtered airlocks remain scarred by shelter saturation.",
        },
        causes: {
          "crise.veille-basse.partager-reserves-cohorte":
            "Emergency Provisions shared",
          "crise.veille-basse.renforcer-accueil":
            "Shelter capacity reinforced",
        },
        garanties: {
          "cohorte-hydratee": "Cohort hydrated",
          "accueil-stabilise": "Shelter stabilized",
        },
        conditionsRecuperation: {
          "cohorte-hydratee": "Open Sillon Hospice.",
          "accueil-stabilise": "Reinforce Veille-Basse’s airlocks.",
        },
      },
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
      crise: {
        alerteTitre: "Aggravation annoncée — saturation du Halo",
        alerteCause:
          "L’ouverture consignée de la Couronne fait remonter dans le Halo les fragilités régionales et les récupérations inachevées.",
        titre: "Crise — Saturation du Halo de la Couronne",
        cause:
          "Le Phare actif ne peut plus absorber seul les contraintes accumulées par les voies, les Cicatrices et leurs Récupérations.",
        chaine: [
          "L’ouverture de la Couronne transmet ses contraintes au Halo.",
          "Les Cicatrices régionales s’y superposent.",
          "Les Récupérations antérieures modulent la saturation.",
          "Rupture locale : le Halo sature avant le Nœud.",
        ],
        maillons: {
          "couronne.ouverture.rail-ouverte":
            "L’ouverture ferroviaire charge les verrous intacts de la Couronne.",
          "couronne.ouverture.phares-ouvertes":
            "L’ouverture par les Phares accorde directement les verrous au Halo.",
          "couronne.ouverture.colonies-ouvertes":
            "L’ouverture par les Colonies répartit la charge entre des relais régionaux.",
          "couronne.ouverture.breche-ouverte":
            "La brèche de secours endommage irréversiblement le Nœud et surcharge son passage intérieur.",
          "cicatrice.rationnement-deau":
            "Le rationnement de l’Eau réduit le refroidissement disponible au Halo.",
          "cicatrice.reserve-de-remedes-entamee":
            "La réserve de Remèdes entamée limite la relève des équipes exposées.",
          "cicatrice.evacuation-des-foyers":
            "Les Foyers évacués laissent moins de veilleurs pour tenir la Couronne.",
          "cicatrice.reserves-partagees-veille-basse":
            "Les réserves partagées à Veille-Basse réduisent l’autonomie régionale.",
          "cicatrice.capacites-accueil-saturees":
            "Les sas saturés de Veille-Basse renvoient leur pression vers la Couronne.",
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Les châssis étayés transmettent encore leurs vibrations au Phare.",
          "cicatrice.plateforme-detachee-trame":
            "La Plateforme détachée prive le Halo d’un relais mobile.",
          "recuperation.socle-de-survie.amorcee":
            "Le Socle de survie reste en récupération.",
          "recuperation.socle-de-survie.accomplie":
            "Le Socle de survie récupéré amortit une part de la saturation.",
          "recuperation.socle-de-survie.manquee":
            "Le Socle de survie manqué amplifie la saturation.",
          "recuperation.mobilite-minimale.amorcee":
            "La mobilité minimale reste en récupération.",
          "recuperation.mobilite-minimale.accomplie":
            "La mobilité restaurée apporte une relève au Halo.",
          "recuperation.mobilite-minimale.manquee":
            "La mobilité non restaurée immobilise les équipes du Halo.",
          "recuperation.aide-exterieure-identifiee.amorcee":
            "L’aide extérieure identifiée n’est pas encore acquise.",
          "recuperation.aide-exterieure-identifiee.accomplie":
            "L’aide extérieure acquise soulage les relais de la Couronne.",
          "recuperation.aide-exterieure-identifiee.manquee":
            "L’aide extérieure manquée laisse la Couronne isolée.",
          "recuperation.cohorte-hydratee.amorcee":
            "L’hydratation de la Cohorte reste en récupération.",
          "recuperation.cohorte-hydratee.accomplie":
            "La Cohorte hydratée stabilise un relais régional.",
          "recuperation.cohorte-hydratee.manquee":
            "La Cohorte non hydratée ajoute sa pénurie à la charge du Halo.",
          "recuperation.accueil-stabilise.amorcee":
            "La stabilisation de l’accueil reste inachevée.",
          "recuperation.accueil-stabilise.accomplie":
            "L’accueil stabilisé amortit la pression de Veille-Basse.",
          "recuperation.accueil-stabilise.manquee":
            "L’accueil non stabilisé renvoie sa pression vers le Halo.",
          "recuperation.charge-repartie-trame.amorcee":
            "La répartition de Charge de la Trame reste inachevée.",
          "recuperation.charge-repartie-trame.accomplie":
            "La Charge répartie réduit les vibrations reçues par le Halo.",
          "recuperation.charge-repartie-trame.manquee":
            "La Charge non répartie s’ajoute à la saturation.",
          "recuperation.attelage-recale-trame.amorcee":
            "Le recalage de l’attelage reste inachevé.",
          "recuperation.attelage-recale-trame.accomplie":
            "L’attelage recalé stabilise les relais mobiles du Halo.",
          "recuperation.attelage-recale-trame.manquee":
            "L’attelage non recalé désaccorde encore les relais du Halo.",
          "phare.halo-sature-annonce":
            "Dans deux minutes locales, le Halo du Phare saturera avant le Nœud.",
          "phare.halo-sature":
            "Le Halo du Phare sature et le Temps du convoi est suspendu.",
        },
        reponses: {
          "stabiliser-anneau-du-halo": {
            intention: "Stabiliser l’anneau du Halo par des étais",
            coutConnu: "6 Matériaux",
            consequence:
              "Les étais brident irréversiblement l’amplitude future du Halo.",
            mitigation:
              "La charge pourra être répartie au Nœud sous un Tronçon.",
            pireConsequence:
              "Sans arrivée au Nœud, le Phare restera bridé sans répartir la charge.",
            attribution: "Équipes d’entretien du Phare",
          },
          "relayer-halo-par-les-veilleurs": {
            intention: "Lier cinq Veilleurs à la relève du Halo",
            coutConnu: "5 Habitants affectés",
            consequence:
              "Cinq Habitants quittent irréversiblement les Foyers pour tenir la veille.",
            mitigation:
              "Leur relève pourra être organisée au Nœud sous un Tronçon.",
            pireConsequence:
              "Sans relève au Nœud, les Veilleurs resteront liés à la Couronne.",
            attribution: "Veilleurs de la Couronne",
          },
          "condamner-couronne-exterieure": {
            intention: "Condamner la Couronne extérieure",
            coutConnu: "11 Habitants affectés",
            consequence:
              "Onze Habitants et les accès extérieurs restent abandonnés derrière les cloisons.",
            mitigation:
              "Le passage intérieur vers le Nœud demeure praticable.",
            pireConsequence:
              "La Couronne extérieure ne pourra plus rejoindre la Cité-caravane.",
            attribution: "Foyers de la Couronne",
          },
        },
        cicatrices: {
          "cicatrice.halo-bride-par-les-etais":
            "Halo bridé par les étais",
          "cicatrice.veilleurs-lies-au-halo":
            "Veilleurs liés au Halo",
          "cicatrice.couronne-exterieure-condamnee":
            "Couronne extérieure condamnée",
        },
        consequencesCicatrices: {
          "cicatrice.halo-bride-par-les-etais":
            "Le Phare conserve les étais qui limitent irréversiblement l’amplitude de son Halo.",
          "cicatrice.veilleurs-lies-au-halo":
            "Cinq Habitants restent absents des Foyers tant que la relève n’est pas organisée.",
          "cicatrice.couronne-exterieure-condamnee":
            "Les accès et Foyers de la Couronne extérieure ne rejoindront plus le convoi.",
        },
        causes: {
          "crise.couronne.stabiliser-anneau-du-halo":
            "Stabilisation irréversible de l’anneau",
          "crise.couronne.relayer-halo-par-les-veilleurs":
            "Relève humaine liée au Halo",
          "crise.couronne.condamner-couronne-exterieure":
            "Condamnation de dernier recours",
        },
        garanties: {
          "halo-reparti-au-noeud": "Charge du Halo répartie au Nœud",
          "releve-des-veilleurs-au-noeud":
            "Relève des Veilleurs au Nœud",
          "passage-interieur-preserve":
            "Passage intérieur préservé",
        },
        destinations: { "noeud-central": "Nœud central" },
        conditionsRecuperation: {
          "halo-reparti-au-noeud":
            "Atteindre le Nœud central sous un Tronçon.",
          "releve-des-veilleurs-au-noeud":
            "Atteindre le Nœud central pour organiser la relève.",
          "passage-interieur-preserve":
            "Atteindre le Nœud central par le passage intérieur.",
        },
      },
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
      crise: {
        alerteTitre: "Escalation announced — Halo saturation",
        alerteCause:
          "Recording the Crown opening feeds regional fragilities and unfinished recoveries back into the Halo.",
        titre: "Crisis — Silent Crown Halo saturation",
        cause:
          "The active Lighthouse can no longer absorb the constraints accumulated by the routes, Scars and their Recoveries.",
        chaine: [
          "Opening the Crown transmits its constraints to the Halo.",
          "Regional Scars overlap within it.",
          "Earlier Recoveries modulate the saturation.",
          "Local failure: the Halo saturates before the Node.",
        ],
        maillons: {
          "couronne.ouverture.rail-ouverte":
            "The rail opening loads the Crown’s intact locks.",
          "couronne.ouverture.phares-ouvertes":
            "The Lighthouse opening tunes the locks directly to the Halo.",
          "couronne.ouverture.colonies-ouvertes":
            "The Colony opening spreads load across regional relays.",
          "couronne.ouverture.breche-ouverte":
            "The emergency breach irreversibly damages the Node and overloads its inner passage.",
          "cicatrice.rationnement-deau":
            "Water rationing reduces cooling available to the Halo.",
          "cicatrice.reserve-de-remedes-entamee":
            "The depleted Remedy reserve limits relief for exposed crews.",
          "cicatrice.evacuation-des-foyers":
            "Evacuated Hearths leave fewer watchers to hold the Crown.",
          "cicatrice.reserves-partagees-veille-basse":
            "Reserves shared at Lower Watch reduce regional autonomy.",
          "cicatrice.capacites-accueil-saturees":
            "Lower Watch’s saturated airlocks feed pressure toward the Crown.",
          "cicatrice.chassis-etaye-dans-l-urgence":
            "Braced frames still transmit their vibration to the Lighthouse.",
          "cicatrice.plateforme-detachee-trame":
            "The detached Platform deprives the Halo of a mobile relay.",
          "recuperation.socle-de-survie.amorcee":
            "Recovery of the survival baseline is still underway.",
          "recuperation.socle-de-survie.accomplie":
            "The recovered survival baseline absorbs part of the saturation.",
          "recuperation.socle-de-survie.manquee":
            "The missed survival baseline amplifies saturation.",
          "recuperation.mobilite-minimale.amorcee":
            "Minimum mobility is still being recovered.",
          "recuperation.mobilite-minimale.accomplie":
            "Restored mobility brings relief to the Halo.",
          "recuperation.mobilite-minimale.manquee":
            "Unrestored mobility strands the Halo crews.",
          "recuperation.aide-exterieure-identifiee.amorcee":
            "Identified outside help has not yet been secured.",
          "recuperation.aide-exterieure-identifiee.accomplie":
            "Secured outside help relieves Crown relays.",
          "recuperation.aide-exterieure-identifiee.manquee":
            "Missed outside help leaves the Crown isolated.",
          "recuperation.cohorte-hydratee.amorcee":
            "The Cohort’s hydration recovery remains underway.",
          "recuperation.cohorte-hydratee.accomplie":
            "The hydrated Cohort stabilizes a regional relay.",
          "recuperation.cohorte-hydratee.manquee":
            "The unhydrated Cohort adds its shortage to the Halo load.",
          "recuperation.accueil-stabilise.amorcee":
            "Shelter stabilization remains unfinished.",
          "recuperation.accueil-stabilise.accomplie":
            "Stabilized shelter absorbs Lower Watch’s pressure.",
          "recuperation.accueil-stabilise.manquee":
            "Unstabilized shelter feeds its pressure toward the Halo.",
          "recuperation.charge-repartie-trame.amorcee":
            "Iron Weave load redistribution remains unfinished.",
          "recuperation.charge-repartie-trame.accomplie":
            "Redistributed load reduces vibration reaching the Halo.",
          "recuperation.charge-repartie-trame.manquee":
            "Unredistributed load adds to saturation.",
          "recuperation.attelage-recale-trame.amorcee":
            "Consist realignment remains unfinished.",
          "recuperation.attelage-recale-trame.accomplie":
            "The realigned consist stabilizes the Halo’s mobile relays.",
          "recuperation.attelage-recale-trame.manquee":
            "The unaligned consist keeps the Halo relays out of tune.",
          "phare.halo-sature-annonce":
            "In two local minutes, the Lighthouse Halo will saturate before the Node.",
          "phare.halo-sature":
            "The Lighthouse Halo saturates and Convoy Time is paused.",
        },
        reponses: {
          "stabiliser-anneau-du-halo": {
            intention: "Brace the Halo ring",
            coutConnu: "6 Materials",
            consequence:
              "The braces irreversibly limit the Halo’s future amplitude.",
            mitigation:
              "Its load can be redistributed at the Node within one segment.",
            pireConsequence:
              "Without reaching the Node, the Lighthouse stays constrained without shedding its load.",
            attribution: "Lighthouse maintenance crews",
          },
          "relayer-halo-par-les-veilleurs": {
            intention: "Bind five Watchers to Halo relief",
            coutConnu: "5 inhabitants assigned",
            consequence:
              "Five inhabitants irreversibly leave their Hearths to hold the watch.",
            mitigation:
              "Their relief can be organized at the Node within one segment.",
            pireConsequence:
              "Without relief at the Node, the Watchers remain bound to the Crown.",
            attribution: "Crown Watchers",
          },
          "condamner-couronne-exterieure": {
            intention: "Seal the outer Crown",
            coutConnu: "11 inhabitants assigned",
            consequence:
              "Eleven inhabitants and the outer accesses remain abandoned behind the bulkheads.",
            mitigation:
              "The inner passage toward the Node remains viable.",
            pireConsequence:
              "The outer Crown can never rejoin the Caravan-city.",
            attribution: "Crown Hearths",
          },
        },
        cicatrices: {
          "cicatrice.halo-bride-par-les-etais":
            "Halo constrained by braces",
          "cicatrice.veilleurs-lies-au-halo":
            "Watchers bound to the Halo",
          "cicatrice.couronne-exterieure-condamnee":
            "Outer Crown sealed",
        },
        consequencesCicatrices: {
          "cicatrice.halo-bride-par-les-etais":
            "The Lighthouse retains braces that irreversibly limit its Halo amplitude.",
          "cicatrice.veilleurs-lies-au-halo":
            "Five inhabitants remain absent from their Hearths until relief is organized.",
          "cicatrice.couronne-exterieure-condamnee":
            "The outer Crown’s accesses and Hearths can never rejoin the convoy.",
        },
        causes: {
          "crise.couronne.stabiliser-anneau-du-halo":
            "Irreversible ring stabilization",
          "crise.couronne.relayer-halo-par-les-veilleurs":
            "Human relief bound to the Halo",
          "crise.couronne.condamner-couronne-exterieure":
            "Last-resort sealing",
        },
        garanties: {
          "halo-reparti-au-noeud": "Halo load redistributed at the Node",
          "releve-des-veilleurs-au-noeud":
            "Watcher relief at the Node",
          "passage-interieur-preserve":
            "Inner passage preserved",
        },
        destinations: { "noeud-central": "Central Node" },
        conditionsRecuperation: {
          "halo-reparti-au-noeud":
            "Reach the Central Node within one route segment.",
          "releve-des-veilleurs-au-noeud":
            "Reach the Central Node to organize relief.",
          "passage-interieur-preserve":
            "Reach the Central Node through the inner passage.",
        },
      },
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
  extinction: {
    fr: {
      crise: {
        alerteTitre: "Extinction du Phare annoncée",
        alerteCause:
          "Une Récupération manquée a supprimé trop de réponses capables de préserver la Cité-caravane.",
        titre: "Crise terminale — Extinction du Phare",
        cause:
          "Une Récupération manquée laisse moins de deux réponses de survie : le Phare va s’éteindre.",
        chaine: [],
        maillons: {
          "couronne.ouverture.rail-ouverte":
            "La voie du Rail a ouvert l’Anneau intérieur.",
          "couronne.ouverture.phares-ouvertes":
            "La voie des Phares a ouvert l’Anneau intérieur.",
          "couronne.ouverture.colonies-ouvertes":
            "La voie des Colonies a ouvert l’Anneau intérieur.",
          "couronne.ouverture.breche-ouverte":
            "La Brèche de secours a ouvert l’Anneau intérieur.",
          "reponse.stabiliser-anneau-du-halo.indisponible":
            "Les Matériaux ou les Récupérations ne permettent plus de stabiliser l’anneau du Halo.",
          "reponse.relayer-halo-par-les-veilleurs.indisponible":
            "Les Veilleurs ne peuvent plus relayer le Halo.",
          "reponse.condamner-couronne-exterieure.indisponible":
            "La Couronne extérieure ne peut plus être condamnée sans perdre la Cité-caravane.",
          "phare.extinction-annoncee":
            "L’Extinction du Phare est inévitable.",
          "phare.extinction-imminente":
            "Le Halo consume la dernière lumière du Phare.",
        },
        reponses: {
          "evacuer-le-coeur": {
            intention: "Sauver le plus d’Habitants possible",
            coutConnu: "14 Habitants laissés hors de l’évacuation",
            consequence: "Le Cœur et le Phare sont abandonnés.",
            mitigation:
              "Les registres essentiels partent avec les évacués.",
            pireConsequence:
              "La Cité-caravane se disperse sans foyer commun.",
            attribution: "Foyers du Cœur",
          },
          "transmettre-sous-le-halo": {
            intention: "Émettre une dernière transmission sous le Halo",
            coutConnu:
              "28 Habitants affectés à la dernière transmission",
            consequence:
              "Le coût humain augmente pour transmettre les connaissances.",
            mitigation:
              "Les colonies reçoivent l’intégralité des registres.",
            pireConsequence:
              "Les équipes du Phare ne quittent pas le Cœur à temps.",
            attribution: "Équipes du Phare",
          },
          "solliciter-aide-exterieure": {
            intention: "Solliciter l’alliance préparée",
            coutConnu:
              "9 Habitants affectés à l’évacuation alliée",
            consequence:
              "Le Cœur est confié aux alliés et le convoi se disperse.",
            mitigation: "Des copies des registres sont partagées.",
            pireConsequence:
              "L’alliance décide désormais du devenir du Cœur.",
            attribution: "Alliés de la Couronne",
          },
        },
        cicatrices: {},
        consequencesCicatrices: {},
        causes: {},
        garanties: {},
        destinations: {},
        conditionsRecuperation: {},
      },
      denouement: {
        denouementTitre: "Dénouement de campagne — Défaite",
        statut: "Campagne terminée avant le Nœud",
        titre: "Bilan de l’Extinction du Phare",
        eyebrow: "La dernière lumière",
        introduction:
          "Le Phare est éteint. Ce bilan restitue le choix final, ses pertes et la chaîne qui l’a rendu nécessaire.",
        choix: "Choix terminal",
        cause: "Cause de l’Extinction",
        moment: "Moment de l’Extinction",
        issue: "Issue",
        defaite: "Défaite",
        recuperationManquee: "Récupération échouée",
        choixTerminaux: {
          "evacuer-le-coeur": "Évacuer le Cœur",
          "transmettre-sous-le-halo": "Transmettre sous le Halo",
          "solliciter-aide-exterieure":
            "Solliciter l’aide extérieure",
        },
        garanties: {
          "socle-de-survie": "Socle de survie attendu",
          "mobilite-minimale": "Mobilité minimale attendue",
          "aide-exterieure-identifiee": "Aide extérieure attendue",
          "cohorte-hydratee": "Cohorte hydratée",
          "accueil-stabilise": "Accueil stabilisé",
          "charge-repartie-trame": "Charge répartie dans la Trame",
          "attelage-recale-trame": "Attelage recalé dans la Trame",
          "halo-reparti-au-noeud": "Charge du Halo répartie au Nœud",
          "releve-des-veilleurs-au-noeud":
            "Relève des Veilleurs au Nœud",
          "passage-interieur-preserve": "Passage intérieur préservé",
        },
        habitants: {
          "evacuation-prioritaire":
            "L’évacuation prioritaire sauve le plus d’Habitants possible, au prix de quatorze personnes perdues.",
          "transmission-sacrificielle":
            "La transmission est maintenue au prix d’un sacrifice humain plus lourd.",
          "evacuation-alliee":
            "L’alliance organise une évacuation partagée ; neuf Habitants restent affectés à son coût.",
        },
        coeur: {
          abandonne:
            "Le Cœur est abandonné lorsque le Phare s’éteint.",
          "eteint-apres-transmission":
            "Le Cœur est éteint après la dernière transmission.",
          "confie-aux-allies":
            "Le Cœur est confié aux alliés qui ont préparé l’évacuation.",
        },
        connaissances: {
          "registres-emportes":
            "Les registres essentiels sont emportés avec les évacués.",
          "transmises-aux-colonies":
            "Les connaissances sont transmises aux colonies sous le Halo.",
          "copies-partagees":
            "Des copies des registres sont partagées avec les alliés.",
        },
      },
      journal: {
        titres: {
          "crise.extinction-du-phare": "Extinction du Phare",
          "defaite.extinction.evacuations-du-coeur":
            "Extinction du Phare — évacuation du Cœur",
          "defaite.extinction.transmission-sous-halo":
            "Extinction du Phare — dernière transmission",
          "defaite.extinction.aide-exterieure-sollicitee":
            "Extinction du Phare — évacuation alliée",
        },
        causes: {
          "crise.recuperation.cohorte-hydratee.manquee":
            "Récupération de la Cohorte hydratée manquée",
          "crise.recuperation.accueil-stabilise.manquee":
            "Récupération de l’Accueil stabilisé manquée",
          "crise.recuperation.charge-repartie-trame.manquee":
            "Récupération de la Charge répartie manquée",
          "crise.recuperation.attelage-recale-trame.manquee":
            "Récupération de l’Attelage recalé manquée",
          "crise.recuperation.halo-reparti-au-noeud.manquee":
            "Récupération de la Charge du Halo manquée",
          "crise.recuperation.releve-des-veilleurs-au-noeud.manquee":
            "Récupération de la Relève des Veilleurs manquée",
          "crise.recuperation.passage-interieur-preserve.manquee":
            "Récupération du Passage intérieur manquée",
        },
        acteurs: {
          "equipes-du-phare": "Équipes du Phare",
          "foyers-du-coeur": "Foyers du Cœur",
          "allies-de-la-couronne": "Alliés de la Couronne",
        },
        cibles: {
          "phare-de-la-cite-caravane": "Phare de la Cité-caravane",
          "evacuation-prioritaire-du-coeur":
            "Évacuation prioritaire du Cœur",
          "derniere-transmission-du-halo":
            "Dernière transmission du Halo",
          "evacuation-alliee-du-coeur":
            "Évacuation alliée du Cœur",
        },
      },
    },
    en: {
      crise: {
        alerteTitre: "Lighthouse Extinction announced",
        alerteCause:
          "A missed Recovery removed too many responses able to preserve the Caravan City.",
        titre: "Terminal crisis — Lighthouse Extinction",
        cause:
          "A missed Recovery leaves fewer than two survival responses: the Lighthouse will go dark.",
        chaine: [],
        maillons: {
          "couronne.ouverture.rail-ouverte":
            "The Rail route opened the Inner Ring.",
          "couronne.ouverture.phares-ouvertes":
            "The Lighthouse route opened the Inner Ring.",
          "couronne.ouverture.colonies-ouvertes":
            "The Colonies route opened the Inner Ring.",
          "couronne.ouverture.breche-ouverte":
            "The emergency breach opened the Inner Ring.",
          "reponse.stabiliser-anneau-du-halo.indisponible":
            "Materials or Recoveries can no longer stabilize the Halo ring.",
          "reponse.relayer-halo-par-les-veilleurs.indisponible":
            "The Watchers can no longer relay the Halo.",
          "reponse.condamner-couronne-exterieure.indisponible":
            "The Outer Crown can no longer be sealed without losing the Caravan City.",
          "phare.extinction-annoncee":
            "Lighthouse Extinction is inevitable.",
          "phare.extinction-imminente":
            "The Halo consumes the Lighthouse’s last light.",
        },
        reponses: {
          "evacuer-le-coeur": {
            intention: "Save as many inhabitants as possible",
            coutConnu: "14 inhabitants left outside the evacuation",
            consequence: "The Heart and Lighthouse are abandoned.",
            mitigation: "Essential records leave with the evacuees.",
            pireConsequence:
              "The Caravan City scatters without a shared home.",
            attribution: "Heart Hearths",
          },
          "transmettre-sous-le-halo": {
            intention: "Send one brief transmission under the Halo",
            coutConnu:
              "28 inhabitants assigned to the final transmission",
            consequence:
              "The human cost rises so the knowledge can be transmitted.",
            mitigation:
              "The colonies receive the complete records.",
            pireConsequence:
              "The Lighthouse crews cannot leave the Heart in time.",
            attribution: "Lighthouse crews",
          },
          "solliciter-aide-exterieure": {
            intention: "Call on the prepared alliance",
            coutConnu:
              "9 inhabitants assigned to the allied evacuation",
            consequence:
              "The Heart is entrusted to the allies and the convoy scatters.",
            mitigation: "Copies of the records are shared.",
            pireConsequence:
              "The alliance now decides the Heart’s future.",
            attribution: "Crown allies",
          },
        },
        cicatrices: {},
        consequencesCicatrices: {},
        causes: {},
        garanties: {},
        destinations: {},
        conditionsRecuperation: {},
      },
      denouement: {
        denouementTitre: "Campaign denouement — Defeat",
        statut: "Campaign ended before the Node",
        titre: "Lighthouse Extinction report",
        eyebrow: "The last light",
        introduction:
          "The Lighthouse is dark. This report records the final choice, its losses, and the chain that made it necessary.",
        choix: "Terminal choice",
        cause: "Cause of Extinction",
        moment: "Extinction time",
        issue: "Outcome",
        defaite: "Defeat",
        recuperationManquee: "Failed recovery",
        choixTerminaux: {
          "evacuer-le-coeur": "Evacuate the Heart",
          "transmettre-sous-le-halo": "Transmit under the Halo",
          "solliciter-aide-exterieure": "Call on external aid",
        },
        garanties: {
          "socle-de-survie": "Expected survival baseline",
          "mobilite-minimale": "Expected minimum mobility",
          "aide-exterieure-identifiee": "Expected external aid",
          "cohorte-hydratee": "Cohort supplied with Water",
          "accueil-stabilise": "Reception stabilized",
          "charge-repartie-trame":
            "Load redistributed through the Iron Weave",
          "attelage-recale-trame":
            "Formation realigned through the Iron Weave",
          "halo-reparti-au-noeud":
            "Halo load redistributed at the Node",
          "releve-des-veilleurs-au-noeud":
            "Watcher relief secured at the Node",
          "passage-interieur-preserve": "Inner passage preserved",
        },
        habitants: {
          "evacuation-prioritaire":
            "The priority evacuation saves as many inhabitants as possible, at the cost of fourteen people.",
          "transmission-sacrificielle":
            "The transmission is maintained at a higher human cost.",
          "evacuation-alliee":
            "The allied evacuation is shared; nine inhabitants remain assigned to its cost.",
        },
        coeur: {
          abandonne:
            "The Heart is abandoned when the Lighthouse goes dark.",
          "eteint-apres-transmission":
            "The Heart goes dark after the final transmission.",
          "confie-aux-allies":
            "The Heart is entrusted to the allies who prepared the evacuation.",
        },
        connaissances: {
          "registres-emportes":
            "The essential records leave with the evacuees.",
          "transmises-aux-colonies":
            "The knowledge is transmitted to the colonies under the Halo.",
          "copies-partagees":
            "Copies of the records are shared with the allies.",
        },
      },
      journal: {
        titres: {
          "crise.extinction-du-phare": "Lighthouse Extinction",
          "defaite.extinction.evacuations-du-coeur":
            "Lighthouse Extinction — Heart evacuation",
          "defaite.extinction.transmission-sous-halo":
            "Lighthouse Extinction — final transmission",
          "defaite.extinction.aide-exterieure-sollicitee":
            "Lighthouse Extinction — allied evacuation",
        },
        causes: {
          "crise.recuperation.cohorte-hydratee.manquee":
            "Missed Cohort Water Recovery",
          "crise.recuperation.accueil-stabilise.manquee":
            "Missed Reception Recovery",
          "crise.recuperation.charge-repartie-trame.manquee":
            "Missed Iron Weave load Recovery",
          "crise.recuperation.attelage-recale-trame.manquee":
            "Missed Formation realignment Recovery",
          "crise.recuperation.halo-reparti-au-noeud.manquee":
            "Missed Halo load Recovery",
          "crise.recuperation.releve-des-veilleurs-au-noeud.manquee":
            "Missed Watcher relief Recovery",
          "crise.recuperation.passage-interieur-preserve.manquee":
            "Missed Inner passage Recovery",
        },
        acteurs: {
          "equipes-du-phare": "Lighthouse crews",
          "foyers-du-coeur": "Heart Hearths",
          "allies-de-la-couronne": "Crown allies",
        },
        cibles: {
          "phare-de-la-cite-caravane": "Caravan City Lighthouse",
          "evacuation-prioritaire-du-coeur":
            "Priority evacuation of the Heart",
          "derniere-transmission-du-halo":
            "Final Halo transmission",
          "evacuation-alliee-du-coeur":
            "Allied Heart evacuation",
        },
      },
    },
  },
  epilogue: {
    fr: {
      titre: "Épilogue de la Campagne",
      eyebrow: "Ce que la Solution protège · qui la contrôle · qui en paie le prix",
      introduction:
        "Le bilan principal sépare les trois dimensions de la Solution avant de rendre leur devenir aux personnes, lieux et obligations réellement rencontrés.",
      revelation:
        "Dernière révélation — le cœur mobile certifiait chaque rejet de cendre et conserve la preuve des seuils létaux délibérément dépassés dans les périphéries.",
      libelles: {
        axes: "Bilan de la Solution",
        "sort-du-coeur": "Sort du cœur mobile",
        revelation: "Révélation finale",
        compagnons: "Compagnons",
        colonies: "Cinq Colonies",
        sites: "Sites significatifs",
        cohortes: "Cohortes",
        factions: "Factions",
        engagements: "Engagements",
        traces: "Traces clandestines",
        statut: "Statut",
        sante: "Santé",
        projet: "Projet",
        lien: "Lien",
        rancune: "Rancune",
        causes: "Cause persistante",
      },
      axes: {
        "stabilite-technique": "Stabilité technique",
        "controle-politique": "Contrôle politique",
        "cout-humain": "Coût humain",
      },
      noms: {
        "ilyana-voss": "Ilyana Voss",
        "maelys-rive": "Maëlys Rive",
        "sira-vel": "Sira Vel",
        "bastien-roux": "Bastien Roux",
        "noor-selan": "Noor Selan",
        "elian-morne": "Élian Morne",
        "ava-cendre": "Ava Cendre",
        "tomas-rail": "Tomas Rail",
        "nadia-silex": "Nadia Silex",
        "ysee-orbe": "Ysée Orbe",
        "haut-puits": "Haut-Puits",
        "veille-basse": "Veille-Basse",
        "grand-aiguillage": "Grand-Aiguillage",
        "traverse-libre": "Traverse-Libre",
        seuil: "Seuil",
        "maison-des-filtres": "Maison des Filtres",
        "les-vanniers": "Les Vanniers",
        "hospice-du-sillon": "Hospice du Sillon",
        nacelles: "Nacelles",
        "barriere-neuve": "Barrière-Neuve",
        "dortoir-dix-sept": "Dortoir Dix-Sept",
        "pompe-neuve": "Pompe-Neuve",
        "marche-des-traverses": "Marché des Traverses",
        "signal-zero": "Signal-Zéro",
        "tete-de-ligne": "Tête-de-Ligne",
        "veille-des-trois": "Veille-des-Trois",
        "serres-de-verre": "Serres-de-Verre",
        "cohorte-de-refugies": "Première cohorte des routes",
        "cohorte-du-sillon": "Cohorte du Sillon",
        "puits-libres": "Puits Libres",
        "pelerins-de-cendre": "Pèlerins de Cendre",
        "republique-du-rail": "République du Rail",
        "bassins.conseil.reserves-partagees":
          "Réserves partagées au Conseil des Vannes",
        "bassins.conseil.vannes-contraintes":
          "Vannes contraintes par le Conseil",
        "prologue.cohorte-accueillie":
          "Première cohorte accueillie dans la cité-caravane",
        "prologue.cohorte-orientee":
          "Première cohorte orientée vers une autre veille",
        "bassins.conseil.cohorte-reorientee":
          "Cohorte réorientée par le Conseil des Vannes",
      },
      statutsDeCompagnons: {
        recrute: "recruté dans la cité-caravane",
        mort: "mort au cours de la Campagne",
        parti: "parti après une ligne rouge ou un Projet",
      },
      etats: {
        stable: "stable",
        fragile: "fragile",
        perdue: "perdue",
        prospere: "prospère",
        "negociation-ouverte": "négociation restée ouverte",
        "partage-organise": "partage de l’eau organisé",
        "reserves-protegees": "réserves protégées",
        "sous-controle-republicain": "sous contrôle républicain",
        "atelier-negocie": "atelier négocié",
        stabilisee: "stabilisée",
        autonome: "autonome",
        "voix-revendiquee": "voix revendiquée au Nœud",
        "voix-garantie": "voix garantie au Nœud",
        "tutelle-contestee": "tutelle contestée",
        actif: "actif",
        evacue: "évacué",
        absorbe: "absorbé par l’accueil",
        abandonne: "abandonné",
        "atelier-commun": "atelier commun",
        "sous-mandat": "sous mandat républicain",
        "sanctuaire-renforce": "sanctuaire renforcé",
        "releves-evacues": "relevés et gardiens évacués",
        "carrefour-allie": "carrefour allié",
        epuise: "épuisé par le passage",
        indetermine: "devenir non tranché",
        accueillie: "accueillie",
        orientee: "orientée vers une autre veille",
        "en-attente": "encore en attente",
        "charge-accueil": "accueil encore sous charge",
        "equipes-integrees": "équipes intégrées",
        refusee: "refusée",
        redirigee: "redirigée",
        hostile: "hostile",
        fermee: "fermée",
        transactionnelle: "transactionnelle",
        cooperative: "coopérative",
        mandates: "mandatés dans la nouvelle veille",
        endeuilles: "endeuillés par les refuges perdus",
        guides: "guides des routes",
        dominante: "puissance dominante",
        encadree: "pouvoir encadré par la Charte",
        "brulures-surveillees": "brûlures surveillées après exposition",
        "brulures-stabilisees": "brûlures de cendre stabilisées",
        "souffle-repose": "souffle reposé après le relevé",
        "souffle-court": "souffle encore court",
        accompli: "accompli et transmissible",
        transmis: "transmis à une garde durable",
        poursuivi: "poursuivi après la Campagne",
        "poursuivi-ailleurs": "poursuivi loin de la cité-caravane",
        "releve-partage": "relevé partagé",
        "depot-commun": "dépôt commun",
        persistante: "persistante et non attribuée",
        attribuee: "attribuée et transmissible",
        "sous-scelles": "conservée sous scellés",
      },
      liens: {
        "registre-et-releve": "Registre et relevé",
      },
      rancunes: {
        "parole-de-l-eau-ecartee": "Parole de l’eau écartée",
        "releve-retire": "Relevé retiré",
      },
      reparations: {
        "confier-les-comptes-a-la-communaute":
          "confier les comptes à une garde vérifiable",
        "transmettre-le-releve-sans-signature":
          "transmettre le relevé sans s’en attribuer le mérite",
      },
      causesDEtat: "Dernier état persistant",
      aucun: "aucun",
    },
    en: {
      titre: "Campaign Epilogue",
      eyebrow: "What the Solution protects · who controls it · who pays its price",
      introduction:
        "The main assessment separates the Solution’s three dimensions before returning outcomes to the people, places, and obligations actually encountered.",
      revelation:
        "Final revelation — the mobile heart certified every ash discharge and preserves proof of lethal thresholds deliberately exceeded in the peripheries.",
      libelles: {
        axes: "Solution assessment",
        "sort-du-coeur": "Mobile heart outcome",
        revelation: "Final revelation",
        compagnons: "Companions",
        colonies: "Five Colonies",
        sites: "Significant Sites",
        cohortes: "Cohorts",
        factions: "Factions",
        engagements: "Commitments",
        traces: "Clandestine Traces",
        statut: "Status",
        sante: "Health",
        projet: "Project",
        lien: "Bond",
        rancune: "Grudge",
        causes: "Persistent cause",
      },
      axes: {
        "stabilite-technique": "Technical stability",
        "controle-politique": "Political control",
        "cout-humain": "Human cost",
      },
      noms: {
        "ilyana-voss": "Ilyana Voss",
        "maelys-rive": "Maëlys Rive",
        "sira-vel": "Sira Vel",
        "bastien-roux": "Bastien Roux",
        "noor-selan": "Noor Selan",
        "elian-morne": "Élian Morne",
        "ava-cendre": "Ava Cendre",
        "tomas-rail": "Tomas Rail",
        "nadia-silex": "Nadia Silex",
        "ysee-orbe": "Ysée Orbe",
        "haut-puits": "High Well",
        "veille-basse": "Lower Watch",
        "grand-aiguillage": "Grand Junction",
        "traverse-libre": "Free Crossing",
        seuil: "Threshold",
        "maison-des-filtres": "Filter House",
        "les-vanniers": "The Basketmakers",
        "hospice-du-sillon": "Sillon Hospice",
        nacelles: "Cableways",
        "barriere-neuve": "New Barrier",
        "dortoir-dix-sept": "Dormitory Seventeen",
        "pompe-neuve": "New Pump",
        "marche-des-traverses": "Sleeper Market",
        "signal-zero": "Zero Signal",
        "tete-de-ligne": "Linehead",
        "veille-des-trois": "Watch of Three",
        "serres-de-verre": "Glasshouses",
        "cohorte-de-refugies": "First road Cohort",
        "cohorte-du-sillon": "Sillon Cohort",
        "puits-libres": "Free Wells",
        "pelerins-de-cendre": "Ash Pilgrims",
        "republique-du-rail": "Rail Republic",
        "bassins.conseil.reserves-partagees":
          "Reserves shared at the Sluice Council",
        "bassins.conseil.vannes-contraintes":
          "Sluices constrained by the Council",
        "prologue.cohorte-accueillie":
          "First Cohort welcomed into the caravan-city",
        "prologue.cohorte-orientee":
          "First Cohort directed to another watch",
        "bassins.conseil.cohorte-reorientee":
          "Cohort redirected by the Sluice Council",
      },
      statutsDeCompagnons: {
        recrute: "recruited into the caravan-city",
        mort: "died during the Campaign",
        parti: "departed after a red line or Project",
      },
      etats: {
        stable: "stable",
        fragile: "fragile",
        perdue: "lost",
        prospere: "thriving",
        "negociation-ouverte": "negotiation left open",
        "partage-organise": "organized water sharing",
        "reserves-protegees": "reserves protected",
        "sous-controle-republicain": "under Republic control",
        "atelier-negocie": "negotiated workshop",
        stabilisee: "stabilized",
        autonome: "autonomous",
        "voix-revendiquee": "voice claimed at the Node",
        "voix-garantie": "voice guaranteed at the Node",
        "tutelle-contestee": "contested trusteeship",
        actif: "active",
        evacue: "evacuated",
        absorbe: "absorbed by the relief effort",
        abandonne: "abandoned",
        "atelier-commun": "shared workshop",
        "sous-mandat": "under Republic mandate",
        "sanctuaire-renforce": "reinforced sanctuary",
        "releves-evacues": "surveys and keepers evacuated",
        "carrefour-allie": "allied crossroads",
        epuise: "exhausted by the passage",
        indetermine: "outcome unresolved",
        accueillie: "welcomed",
        orientee: "directed to another watch",
        "en-attente": "still waiting",
        "charge-accueil": "relief effort still under load",
        "equipes-integrees": "crews integrated",
        refusee: "refused",
        redirigee: "redirected",
        hostile: "hostile",
        fermee: "closed",
        transactionnelle: "transactional",
        cooperative: "cooperative",
        mandates: "mandated in the new watch",
        endeuilles: "mourning lost refuges",
        guides: "guides on the roads",
        dominante: "dominant power",
        encadree: "power constrained by the Charter",
        "brulures-surveillees": "burns monitored after exposure",
        "brulures-stabilisees": "stabilized ash burns",
        "souffle-repose": "breathing recovered after the survey",
        "souffle-court": "breathing still short",
        accompli: "completed and transferable",
        transmis: "transmitted to lasting custody",
        poursuivi: "continued after the Campaign",
        "poursuivi-ailleurs": "continued away from the caravan-city",
        "releve-partage": "shared survey",
        "depot-commun": "common repository",
        persistante: "persistent and unattributed",
        attribuee: "attributed and transferable",
        "sous-scelles": "held under seal",
      },
      liens: {
        "registre-et-releve": "Register and survey",
      },
      rancunes: {
        "parole-de-l-eau-ecartee": "Water counsel set aside",
        "releve-retire": "Survey taken away",
      },
      reparations: {
        "confier-les-comptes-a-la-communaute":
          "entrust the accounts to verifiable custody",
        "transmettre-le-releve-sans-signature":
          "transmit the survey without claiming its credit",
      },
      causesDEtat: "Last persistent state",
      aucun: "none",
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
