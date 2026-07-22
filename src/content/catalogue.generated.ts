// Ce fichier est généré par npm run content:compile.
export default {
  "version": 1,
  "evenements": [
    {
      "id": "prologue.signaux-sous-la-cendre",
      "famille": "conflits-regionaux",
      "themes": [
        "accueil",
        "survie-collective"
      ],
      "fonction": "premier-arbitrage",
      "fenetre": "premiere-minute-atteinte",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 60
          }
        ],
        "interdites": [
          {
            "type": "fait-present",
            "fait": "prologue.cohorte-accueillie"
          },
          {
            "type": "fait-present",
            "fait": "prologue.cohorte-orientee"
          }
        ]
      },
      "periodeEligibilite": {
        "debut": 60,
        "fin": 600
      },
      "priorite": 100,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "cohorte-de-refugies"
      ],
      "sourcesInformations": [
        "porte-lanterne"
      ],
      "faitsLus": [
        "prologue.cohorte-accueillie",
        "prologue.cohorte-orientee"
      ],
      "choix": [
        {
          "id": "accueillir",
          "effets": [
            {
              "type": "habitants.modifier",
              "valeur": 6
            }
          ],
          "faitsProduits": [
            {
              "id": "prologue.cohorte-accueillie",
              "cible": "cohorte-de-refugies"
            }
          ]
        },
        {
          "id": "orienter",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.cohorte-orientee",
              "cible": "cohorte-de-refugies"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "prochain-conseil",
        "cible": "cohorte-de-refugies"
      },
      "recuperation": {
        "type": "aucune-dette-materielle"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": "toujours"
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "prologue.signaux-sous-la-cendre",
        "fichier": "/assets/cite-caravane.png",
        "contientTexte": false,
        "alternatives": {
          "fr": "Coupe habitée de la Cité-caravane, le Phare entouré de ses Plateformes en formation en grappe.",
          "en": "Cutaway view of the caravan-city, with the lighthouse surrounded by its clustered mobile platforms."
        },
        "provenance": {
          "fiche": "docs/assets/cite-caravane.provenance.json",
          "creeLe": "2026-07-21",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "A UI concept generated during the same implementation task, used only as an art-direction reference.",
          "prompt": "Create a fresh standalone wide production game environment plate for PixiJS, matching the approved interface concept's fixed oblique camera, painterly industrial 2D rendering, cold slate and warm amber palette. Show exactly seven mobile platforms: one central ancient Phare maintenance platform and six inhabited platforms in an irregular two-row cluster. Preserve the sense of one connected traveling community in cold ash wastes at blue-gray dawn. Keep all seven platforms fully visible with practical cover-fit cropping room. No UI, borders, panels, buttons, text, labels, logos, watermark, train-like formation, giant single vehicle, steampunk gears, glossy science fiction, neon or excessive bloom.",
          "droits": "Original generated asset; no third-party artwork or named artist was supplied as a reference.",
          "empreinteSha256": "adf24fde903c2af3c3e476fc4ed149260d58c146685078e3d97e0380cb337f34",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.prologue.signaux.origine",
            "modele": "Phare",
            "variables": [],
            "valeurs": {}
          },
          "libelleIntentions": {
            "cle": "evenement.ruban.intentions",
            "modele": "Intentions",
            "variables": [],
            "valeurs": {}
          },
          "titre": {
            "cle": "evenement.prologue.signaux.titre",
            "modele": "Des signaux sous la cendre",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.signaux.presentation",
            "modele": "Depuis le Phare, un signalement indique une cohorte à pied derrière la formation. Vos {habitants} Habitants peuvent lui faire une place, mais le convoi devra partager ses volumes étanches.",
            "variables": [
              "habitants"
            ],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.signaux.information",
              "modele": "Le rapport confirme six silhouettes et aucun véhicule à proximité.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.signaux.variante.standard",
              "modele": "Leurs lampes répondent une à une au signal du Phare.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "accueillir": {
              "intention": {
                "cle": "evenement.prologue.signaux.choix.accueillir",
                "modele": "Ouvrir les Foyers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.signaux.choix.accueillir.cout",
                  "modele": "Coût connu : {places} places occupées dans les Foyers.",
                  "variables": [
                    "places"
                  ],
                  "valeurs": {
                    "places": 6
                  }
                }
              ]
            },
            "orienter": {
              "intention": {
                "cle": "evenement.prologue.signaux.choix.orienter",
                "modele": "Transmettre la route de Veille-Basse",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.signaux.choix.orienter.cout",
                  "modele": "Coût connu : la cohorte poursuit seule, hors du Halo de veille.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.prologue.signaux.origine",
            "modele": "Lighthouse",
            "variables": [],
            "valeurs": {}
          },
          "libelleIntentions": {
            "cle": "evenement.ruban.intentions",
            "modele": "Intentions",
            "variables": [],
            "valeurs": {}
          },
          "titre": {
            "cle": "evenement.prologue.signaux.titre",
            "modele": "Signals beneath the ash",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.signaux.presentation",
            "modele": "A report from the lighthouse indicates a cohort on foot behind the formation. Your {habitants} inhabitants can make room for them, but the convoy will have to share its sealed quarters.",
            "variables": [
              "habitants"
            ],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.signaux.information",
              "modele": "The report confirms six figures and no vehicle nearby.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.signaux.variante.standard",
              "modele": "Their lamps answer the lighthouse signal one by one.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "accueillir": {
              "intention": {
                "cle": "evenement.prologue.signaux.choix.accueillir",
                "modele": "Open the living quarters",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.signaux.choix.accueillir.cout",
                  "modele": "Known cost: {places} places occupied in the living quarters.",
                  "variables": [
                    "places"
                  ],
                  "valeurs": {
                    "places": 6
                  }
                }
              ]
            },
            "orienter": {
              "intention": {
                "cle": "evenement.prologue.signaux.choix.orienter",
                "modele": "Transmit the route to Veille-Basse",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.signaux.choix.orienter.cout",
                  "modele": "Known cost: the cohort continues alone, outside the watch halo.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        }
      }
    }
  ],
  "installations": [
    {
      "id": "cuisine-conserverie",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.cuisine.nom",
            "modele": "Cuisine-conserverie",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.cuisine.service",
            "modele": "Préparer et conserver les rations de la Cité-caravane.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.cuisine.transformation",
              "modele": "Vivres bruts → rations conservées",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.cuisine.operationnelle",
              "modele": "Les rations sont préparées sans perte supplémentaire.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.cuisine.degradee",
              "modele": "La conservation consomme davantage de Vivres.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.cuisine.hors-service",
              "modele": "Aucune ration ne peut être stabilisée pendant la Halte.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.cuisine.nom",
            "modele": "Preserving kitchen",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.cuisine.service",
            "modele": "Prepare and preserve the caravan-city's rations.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.cuisine.transformation",
              "modele": "Raw food → preserved rations",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.cuisine.operationnelle",
              "modele": "Rations are prepared without additional losses.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.cuisine.degradee",
              "modele": "Preservation consumes additional Food.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.cuisine.hors-service",
              "modele": "No ration can be stabilized during the Halt.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "station-filtration",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.filtration.nom",
            "modele": "Station de filtration",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.filtration.service",
            "modele": "Rendre potable l’Eau récupérée sur la route.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.filtration.transformation",
              "modele": "Eau brute → Eau potable",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.filtration.operationnelle",
              "modele": "Le débit nominal d’Eau potable est maintenu.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.filtration.degradee",
              "modele": "Le débit baisse et les filtres consomment plus de Matériaux.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.filtration.hors-service",
              "modele": "Les réserves d’Eau ne peuvent plus être renouvelées.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.filtration.nom",
            "modele": "Filtration station",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.filtration.service",
            "modele": "Make water recovered on the road safe to drink.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.filtration.transformation",
              "modele": "Raw water → drinking Water",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.filtration.operationnelle",
              "modele": "The nominal drinking Water flow is maintained.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.filtration.degradee",
              "modele": "Flow decreases and filters consume more Materials.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.filtration.hors-service",
              "modele": "Water reserves can no longer be replenished.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "dortoirs-etanches",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.dortoirs.nom",
            "modele": "Dortoirs étanches",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.dortoirs.service",
            "modele": "Abriter les Habitants de la cendre ambiante.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.dortoirs.transformation",
              "modele": "Chaleur + filtres → volumes habitables",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.dortoirs.operationnelle",
              "modele": "Les volumes restent étanches et chauffés.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.dortoirs.degradee",
              "modele": "La Chaleur demandée augmente et le confort chute.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.dortoirs.hors-service",
              "modele": "Les Habitants doivent être relogés immédiatement.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.dortoirs.nom",
            "modele": "Sealed dormitories",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.dortoirs.service",
            "modele": "Shelter Inhabitants from ambient ash.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.dortoirs.transformation",
              "modele": "Heat + filters → habitable volumes",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.dortoirs.operationnelle",
              "modele": "The volumes remain sealed and heated.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.dortoirs.degradee",
              "modele": "Heat demand rises and comfort falls.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.dortoirs.hors-service",
              "modele": "The Inhabitants must be rehoused immediately.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "infirmerie-filtree",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.infirmerie.nom",
            "modele": "Infirmerie filtrée",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.infirmerie.service",
            "modele": "Soigner les urgences sans exposer patients ni soignants.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.infirmerie.transformation",
              "modele": "Remèdes → soins d’urgence",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.infirmerie.operationnelle",
              "modele": "Les urgences sont traitées dans un volume protégé.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.infirmerie.degradee",
              "modele": "Les soins exigent plus de Remèdes et de Main-d’œuvre.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.infirmerie.hors-service",
              "modele": "Seuls les premiers soins restent possibles.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.infirmerie.nom",
            "modele": "Filtered infirmary",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.infirmerie.service",
            "modele": "Treat emergencies without exposing patients or carers.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.infirmerie.transformation",
              "modele": "Medicine → emergency care",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.infirmerie.operationnelle",
              "modele": "Emergencies are treated in a protected volume.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.infirmerie.degradee",
              "modele": "Care requires more Medicine and Labour.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.infirmerie.hors-service",
              "modele": "Only first aid remains possible.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "chaudiere-commune",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.chaudiere.nom",
            "modele": "Chaudière commune",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.chaudiere.service",
            "modele": "Distribuer la Chaleur aux Quartiers mobiles.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.chaudiere.transformation",
              "modele": "Combustible → Chaleur",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.chaudiere.operationnelle",
              "modele": "La production thermique nominale est disponible.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.chaudiere.degradee",
              "modele": "La consommation de Combustible augmente.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.chaudiere.hors-service",
              "modele": "Les volumes non prioritaires doivent être délestés.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.chaudiere.nom",
            "modele": "Common boiler",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.chaudiere.service",
            "modele": "Distribute Heat to the mobile Quarters.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.chaudiere.transformation",
              "modele": "Fuel → Heat",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.chaudiere.operationnelle",
              "modele": "Nominal thermal production is available.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.chaudiere.degradee",
              "modele": "Fuel consumption increases.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.chaudiere.hors-service",
              "modele": "Non-priority volumes must shed their heating load.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "groupe-traction",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.traction.nom",
            "modele": "Groupe de traction",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.traction.service",
            "modele": "Maintenir la mobilité de la formation en grappe.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.traction.transformation",
              "modele": "Combustible → traction",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.traction.operationnelle",
              "modele": "La vitesse de route prévue reste disponible.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.traction.degradee",
              "modele": "La consommation augmente et l’allure sûre diminue.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.traction.hors-service",
              "modele": "La Plateforme doit être remorquée pendant le voyage.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.traction.nom",
            "modele": "Traction unit",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.traction.service",
            "modele": "Maintain the mobility of the clustered formation.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.traction.transformation",
              "modele": "Fuel → traction",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.traction.operationnelle",
              "modele": "The planned road speed remains available.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.traction.degradee",
              "modele": "Consumption rises and the safe pace decreases.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.traction.hors-service",
              "modele": "The Platform must be towed during travel.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "atelier-bord",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.atelier.nom",
            "modele": "Atelier de bord",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.atelier.service",
            "modele": "Réparer les installations et conduire les Chantiers.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.atelier.transformation",
              "modele": "Matériaux → réparations et pièces",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.atelier.operationnelle",
              "modele": "Les réparations et Chantiers avancent au rythme prévu.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.atelier.degradee",
              "modele": "Les réparations et Chantiers prennent plus de temps.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.atelier.hors-service",
              "modele": "Aucun Chantier structurel ne peut progresser.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.atelier.nom",
            "modele": "On-board workshop",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.atelier.service",
            "modele": "Repair installations and conduct Worksites.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.atelier.transformation",
              "modele": "Materials → repairs and parts",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.atelier.operationnelle",
              "modele": "Repairs and Worksites progress at the planned pace.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.atelier.degradee",
              "modele": "Repairs and Worksites take longer.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.atelier.hors-service",
              "modele": "No structural Worksite can progress.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "poste-operations",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.operations.nom",
            "modele": "Poste d’opérations",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.operations.service",
            "modele": "Préparer et suivre les Expéditions depuis la Cité-caravane.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.operations.transformation",
              "modele": "Renseignements → mandats et rapports",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.operations.operationnelle",
              "modele": "Les rapports et ordres distants restent disponibles.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.operations.degradee",
              "modele": "Les rapports arrivent plus tard et avec moins de contexte.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.operations.hors-service",
              "modele": "Aucun ordre distant ne peut être transmis.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.operations.nom",
            "modele": "Operations post",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.operations.service",
            "modele": "Prepare and monitor Expeditions from the caravan-city.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.operations.transformation",
              "modele": "Intelligence → mandates and reports",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.operations.operationnelle",
              "modele": "Reports and remote orders remain available.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.operations.degradee",
              "modele": "Reports arrive later and with less context.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.operations.hors-service",
              "modele": "No remote order can be transmitted.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    },
    {
      "id": "condenseur-thermique",
      "textes": {
        "fr": {
          "nom": {
            "cle": "installation.condenseur.nom",
            "modele": "Condenseur thermique",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.condenseur.service",
            "modele": "Produire un appoint d’Eau indépendant d’une source locale.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.condenseur.transformation",
              "modele": "Combustible −2/h · Eau +8/h",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.condenseur.operationnelle",
              "modele": "Le condenseur fournit 8 L d’Eau par heure.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.condenseur.degradee",
              "modele": "Le débit d’Eau est réduit de moitié sans baisse de consommation.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.condenseur.hors-service",
              "modele": "Le condenseur ne fournit plus d’Eau et doit être isolé.",
              "variables": [],
              "valeurs": {}
            }
          }
        },
        "en": {
          "nom": {
            "cle": "installation.condenseur.nom",
            "modele": "Thermal condenser",
            "variables": [],
            "valeurs": {}
          },
          "service": {
            "cle": "installation.condenseur.service",
            "modele": "Produce supplemental Water independently of a local source.",
            "variables": [],
            "valeurs": {}
          },
          "transformationsDeStocks": [
            {
              "cle": "installation.condenseur.transformation",
              "modele": "Fuel −2/h · Water +8/h",
              "variables": [],
              "valeurs": {}
            }
          ],
          "consequences": {
            "operationnelle": {
              "cle": "installation.condenseur.operationnelle",
              "modele": "The condenser provides 8 L of Water per hour.",
              "variables": [],
              "valeurs": {}
            },
            "degradee": {
              "cle": "installation.condenseur.degradee",
              "modele": "Water output is halved without reducing consumption.",
              "variables": [],
              "valeurs": {}
            },
            "hors-service": {
              "cle": "installation.condenseur.hors-service",
              "modele": "The condenser provides no Water and must be isolated.",
              "variables": [],
              "valeurs": {}
            }
          }
        }
      }
    }
  ]
} as const;
