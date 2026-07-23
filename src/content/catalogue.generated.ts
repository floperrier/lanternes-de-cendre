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
        "octetsTransferes": 2864647,
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
          "droits": "OpenAI Terms of Use — output assigned to the user",
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
    },
    {
      "id": "prologue.reponse-du-phare",
      "famille": "mystere-des-phares",
      "themes": [
        "reseau-ancien",
        "signal"
      ],
      "fonction": "premiere-revelation",
      "fenetre": "prologue-enchaine",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 60
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "prologue.cohorte-accueillie",
              "prologue.cohorte-orientee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 60,
        "fin": 1200
      },
      "priorite": 90,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "equipes-entretien"
      ],
      "sourcesInformations": [
        "equipes-entretien"
      ],
      "faitsLus": [
        "prologue.cohorte-accueillie",
        "prologue.cohorte-orientee"
      ],
      "choix": [
        {
          "id": "consigner-harmonique",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.harmonique-consignee",
              "cible": "equipes-entretien"
            }
          ]
        },
        {
          "id": "etouffer-signal",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.signal-etouffe",
              "cible": "equipes-entretien"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "revelation-regionale",
        "cible": "equipes-entretien"
      },
      "recuperation": {
        "type": "observation-au-jalon"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": "toujours"
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "prologue.reponse-du-phare",
        "fichier": "/assets/prologue-reponse-du-phare.webp",
        "octetsTransferes": 234138,
        "contientTexte": false,
        "alternatives": {
          "fr": "Le cœur mobile ouvert rayonne dans le Phare tandis qu’un second phare répond au loin sous la cendre.",
          "en": "The open mobile core glows inside the Lighthouse while a second lighthouse answers in the distant ash."
        },
        "provenance": {
          "fiche": "docs/assets/prologue-reponse-du-phare.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Depict the caravan-city lighthouse core answering a distant buried beacon with an unexpected harmonic pulse, in the established oblique industrial ash-world style. Wide 16:9, no text, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "f1a488452e4f59b21580975c129234e446c417570aec6a8090c001582ca3d216",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.prologue.reponse.origine",
            "modele": "Chambre du cœur mobile",
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
            "cle": "evenement.prologue.reponse.titre",
            "modele": "Le Phare reçoit une réponse",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.reponse.presentation",
            "modele": "Après le signal de la cohorte, le cœur mobile émet une harmonique que ses plans ne décrivent pas. Une lueur lointaine lui répond sous la cendre, sur l’ancienne Ligne Zéro.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.reponse.information",
              "modele": "Les aiguilles ont répété trois fois le même intervalle ; ce n’est ni une panne ni un écho du Halo.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.reponse.variante.standard",
              "modele": "Dans les conduites du Phare, le métal vibre comme une corde trop longtemps silencieuse.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-harmonique": {
              "intention": {
                "cle": "evenement.prologue.reponse.choix.consigner",
                "modele": "Consigner l’harmonique pour la route",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.reponse.choix.consigner.cout",
                  "modele": "Coût connu : l’Atelier détourne une équipe pendant la prochaine veille.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "etouffer-signal": {
              "intention": {
                "cle": "evenement.prologue.reponse.choix.etouffer",
                "modele": "Étouffer le signal jusqu’à la Halte",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.reponse.choix.etouffer.cout",
                  "modele": "Coût connu : la piste vers le Phare répondant peut se refroidir.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.prologue.reponse.origine",
            "modele": "Mobile core chamber",
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
            "cle": "evenement.prologue.reponse.titre",
            "modele": "The Lighthouse receives an answer",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.reponse.presentation",
            "modele": "After the cohort’s signal, the mobile core emits a harmonic absent from its plans. A distant light answers beneath the ash, along the old Zero Line.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.reponse.information",
              "modele": "The needles repeated the same interval three times; this is neither a fault nor an echo from the Halo.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.reponse.variante.standard",
              "modele": "Inside the Lighthouse conduits, metal vibrates like a string silent for too long.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-harmonique": {
              "intention": {
                "cle": "evenement.prologue.reponse.choix.consigner",
                "modele": "Record the harmonic for the road",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.reponse.choix.consigner.cout",
                  "modele": "Known cost: the Workshop diverts one crew during the next watch.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "etouffer-signal": {
              "intention": {
                "cle": "evenement.prologue.reponse.choix.etouffer",
                "modele": "Muffle the signal until the Halt",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.reponse.choix.etouffer.cout",
                  "modele": "Known cost: the trail to the answering Lighthouse may go cold.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        }
      }
    },
    {
      "id": "prologue.filtres-de-la-veille",
      "famille": "consequences-systemiques",
      "themes": [
        "cendre-ambiante",
        "maintenance"
      ],
      "fonction": "exposer-consequence-systemique",
      "fenetre": "prologue-enchaine",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 60
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "prologue.harmonique-consignee",
              "prologue.signal-etouffe"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 60,
        "fin": 1200
      },
      "priorite": 80,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "equipes-entretien"
      ],
      "sourcesInformations": [
        "equipes-entretien"
      ],
      "faitsLus": [
        "prologue.harmonique-consignee",
        "prologue.signal-etouffe"
      ],
      "choix": [
        {
          "id": "proteger-foyers",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.filtres-foyers-prioritaires",
              "cible": "cohorte-de-refugies"
            }
          ]
        },
        {
          "id": "maintenir-ateliers",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.filtres-ateliers-prioritaires",
              "cible": "equipes-entretien"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "prochain-incident",
        "cible": "equipes-entretien"
      },
      "recuperation": {
        "type": "filtres-renouvelables"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": "toujours"
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "prologue.filtres-de-la-veille",
        "fichier": "/assets/prologue-filtres-de-la-veille.webp",
        "octetsTransferes": 238648,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des équipes comparent des filtres noircis entre les Foyers et les ateliers reliés par des conduites.",
          "en": "Crews compare blackened filters between the Hearths and workshops linked by air ducts."
        },
        "provenance": {
          "fiche": "docs/assets/prologue-filtres-de-la-veille.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Depict maintenance crews comparing blackened ash filters between sealed Hearths and workshops, in the established oblique industrial ash-world style. Wide 16:9, no text, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "2d0ce4d83e2ebe5175de64861ac56cc3138ee0935d02ab5c6a1fa8462a3ed461",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.prologue.filtres.origine",
            "modele": "Intendance",
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
            "cle": "evenement.prologue.filtres.titre",
            "modele": "La cendre dans les filtres",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.filtres.presentation",
            "modele": "Le passage de la cohorte et la réponse du Phare ont prolongé l’ouverture des sas. Les filtres propres ne suffiront pas simultanément aux Foyers et aux ateliers jusqu’à la Halte.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.filtres.information",
              "modele": "Les jauges donnent une veille de marge ; aucun volume n’est encore contaminé.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.filtres.variante.standard",
              "modele": "Des cylindres noirs s’alignent sur le pont ; chacun porte la trace du même souffle de cendre.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "proteger-foyers": {
              "intention": {
                "cle": "evenement.prologue.filtres.choix.foyers",
                "modele": "Réserver les filtres propres aux Foyers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.filtres.choix.foyers.cout",
                  "modele": "Coût connu : les ateliers ralentiront et la maintenance prendra du retard.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "maintenir-ateliers": {
              "intention": {
                "cle": "evenement.prologue.filtres.choix.ateliers",
                "modele": "Maintenir l’air des ateliers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.filtres.choix.ateliers.cout",
                  "modele": "Coût connu : les Foyers vivront sous filtration réduite jusqu’à la Halte.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.prologue.filtres.origine",
            "modele": "Stewardship",
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
            "cle": "evenement.prologue.filtres.titre",
            "modele": "Ash in the filters",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.filtres.presentation",
            "modele": "The cohort’s passage and the Lighthouse answer kept the airlocks open. There are not enough clean filters for both the Hearths and the workshops until the Halt.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.filtres.information",
              "modele": "The gauges show one watch of margin; no sealed volume is contaminated yet.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.filtres.variante.standard",
              "modele": "Black cylinders line the deck; each bears the trace of the same breath of ash.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "proteger-foyers": {
              "intention": {
                "cle": "evenement.prologue.filtres.choix.foyers",
                "modele": "Reserve clean filters for the Hearths",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.filtres.choix.foyers.cout",
                  "modele": "Known cost: the workshops will slow and maintenance will fall behind.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "maintenir-ateliers": {
              "intention": {
                "cle": "evenement.prologue.filtres.choix.ateliers",
                "modele": "Maintain workshop airflow",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.filtres.choix.ateliers.cout",
                  "modele": "Known cost: the Hearths will use reduced filtration until the Halt.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        }
      }
    },
    {
      "id": "prologue.ilyana-au-clapet",
      "famille": "histoires-de-compagnons",
      "themes": [
        "confiance",
        "eau"
      ],
      "fonction": "presenter-compagnon",
      "fenetre": "prologue-enchaine",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 60
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "prologue.filtres-foyers-prioritaires",
              "prologue.filtres-ateliers-prioritaires"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 60,
        "fin": 1200
      },
      "priorite": 70,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ilyana-voss"
      ],
      "sourcesInformations": [
        "ilyana-voss"
      ],
      "faitsLus": [
        "prologue.filtres-foyers-prioritaires",
        "prologue.filtres-ateliers-prioritaires"
      ],
      "choix": [
        {
          "id": "confier-clapet",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.ilyana-ecoutee",
              "cible": "ilyana-voss"
            }
          ]
        },
        {
          "id": "maintenir-protocole",
          "effets": [],
          "faitsProduits": [
            {
              "id": "prologue.ilyana-contredite",
              "cible": "ilyana-voss"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "premier-conseil",
        "cible": "ilyana-voss"
      },
      "recuperation": {
        "type": "affectation-possible"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": "toujours"
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "prologue.ilyana-au-clapet",
        "fichier": "/assets/prologue-ilyana-au-clapet.webp",
        "octetsTransferes": 201700,
        "contientTexte": false,
        "alternatives": {
          "fr": "Ilyana montre les jauges et le clapet secondaire dans la station de filtration pendant qu’une équipe intervient.",
          "en": "Ilyana points out the gauges and secondary valve in the filtration station while a crew intervenes."
        },
        "provenance": {
          "fiche": "docs/assets/prologue-ilyana-au-clapet.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Depict Ilyana Voss isolating a secondary valve and explaining pressure gauges in the filtration bay, in the established grounded industrial style. Wide 16:9, no text, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "e61f18f77e360e9fd454dad5e16536f18bbcdaa13ee1875cbcf65d4c598449b2",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.prologue.ilyana.origine",
            "modele": "Station de filtration",
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
            "cle": "evenement.prologue.ilyana.titre",
            "modele": "Ilyana tient le clapet",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.ilyana.presentation",
            "modele": "Ilyana Voss propose d’isoler elle-même le clapet secondaire : douze minutes sans débit d’atelier suffiraient à préserver l’eau des Foyers. Ses brûlures rendent pourtant tout contact avec une fuite dangereux.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.ilyana.information",
              "modele": "Son relevé recoupe les jauges de l’Intendance et nomme précisément le risque qu’elle accepte.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.ilyana.variante.standard",
              "modele": "Elle garde une main sur la vanne et l’autre ouverte vers vous, sans masquer ni la solution ni son prix.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-clapet": {
              "intention": {
                "cle": "evenement.prologue.ilyana.choix.confier",
                "modele": "Lui confier l’isolement du clapet",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.ilyana.choix.confier.cout",
                  "modele": "Coût connu : Ilyana s’expose au circuit et quitte son poste courant.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "maintenir-protocole": {
              "intention": {
                "cle": "evenement.prologue.ilyana.choix.protocole",
                "modele": "Maintenir le protocole collectif",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.ilyana.choix.protocole.cout",
                  "modele": "Coût connu : l’opération prendra plus longtemps et son expertise restera en retrait.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.prologue.ilyana.origine",
            "modele": "Filtration station",
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
            "cle": "evenement.prologue.ilyana.titre",
            "modele": "Ilyana holds the valve",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.prologue.ilyana.presentation",
            "modele": "Ilyana Voss offers to isolate the secondary valve herself: twelve minutes without workshop flow would preserve water for the Hearths. Her burns make any leak dangerous to her.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.prologue.ilyana.information",
              "modele": "Her reading matches the Stewardship gauges and names precisely the risk she accepts.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.prologue.ilyana.variante.standard",
              "modele": "She keeps one hand on the valve and the other open toward you, hiding neither the solution nor its price.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-clapet": {
              "intention": {
                "cle": "evenement.prologue.ilyana.choix.confier",
                "modele": "Entrust the valve isolation to her",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.ilyana.choix.confier.cout",
                  "modele": "Known cost: Ilyana enters the circuit and leaves her current post.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "maintenir-protocole": {
              "intention": {
                "cle": "evenement.prologue.ilyana.choix.protocole",
                "modele": "Keep the collective protocol",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.prologue.ilyana.choix.protocole.cout",
                  "modele": "Known cost: the operation will take longer and her expertise will remain sidelined.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        }
      }
    },
    {
      "id": "bassins-fendus.eau-de-haut-puits",
      "famille": "conflits-regionaux",
      "themes": [
        "partage-de-leau",
        "autonomie-locale"
      ],
      "fonction": "premier-conflit-regional",
      "fenetre": "premier-jalon-bassins-fendus",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 360
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "prologue.ilyana-ecoutee",
              "prologue.ilyana-contredite"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 360,
        "fin": 24000
      },
      "priorite": 100,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "puits-libres",
        "habitants-haut-puits"
      ],
      "sourcesInformations": [
        "habitants-haut-puits"
      ],
      "faitsLus": [
        "prologue.ilyana-ecoutee",
        "prologue.ilyana-contredite",
        "prologue.cohorte-accueillie",
        "prologue.cohorte-orientee"
      ],
      "choix": [
        {
          "id": "promettre-partage",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.partage-promis",
              "cible": "habitants-haut-puits"
            }
          ]
        },
        {
          "id": "proteger-reserves",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.reserves-protegees",
              "cible": "puits-libres"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "habitants-haut-puits"
      },
      "recuperation": {
        "type": "engagement-renegociable"
      },
      "variantes": [
        {
          "id": "cohorte-accueillie",
          "condition": "fait-present:prologue.cohorte-accueillie"
        },
        {
          "id": "cohorte-orientee",
          "condition": "fait-present:prologue.cohorte-orientee"
        },
        {
          "id": "standard",
          "condition": "toujours"
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins-fendus.eau-de-haut-puits",
        "fichier": "/assets/bassins-haut-puits.webp",
        "octetsTransferes": 283424,
        "contientTexte": false,
        "alternatives": {
          "fr": "À Haut-Puits, les Puits Libres et des familles déplacées se font face autour de la vanne de la citerne.",
          "en": "At High Well, the Free Wells and displaced families face each other around the cistern valve."
        },
        "provenance": {
          "fiche": "docs/assets/bassins-haut-puits.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Depict the first regional conflict at High Well around the last deep cistern: Free Wells delegates and displaced families contest a water gate while the caravan-city arrives, in the established oblique industrial ash-world style. Wide 16:9, no text, logo, watermark or foregrounded weapons.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "1538d10da74331d41bfe2ddbe88198c96e796115eb10a02dbeb35155cab9b5a9",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.bassins.haut-puits.origine",
            "modele": "Haut-Puits",
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
            "cle": "evenement.bassins.haut-puits.titre",
            "modele": "L’eau qui reste aux Bassins",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.bassins.haut-puits.presentation",
            "modele": "Au terme du premier Tronçon, Haut-Puits ouvre sa citerne profonde. Les Puits Libres veulent garantir l’autonomie de la colonie ; les familles déplacées réclament la part annoncée par les signaux du prologue.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.bassins.haut-puits.information",
              "modele": "La vanne peut servir les deux groupes aujourd’hui, mais la saison sèche rend toute promesse durable coûteuse.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "cohorte-accueillie": {
              "cle": "evenement.bassins.haut-puits.variante.cohorte-accueillie",
              "modele": "Les six membres accueillis dans les Foyers se tiennent devant la citerne : la place ouverte sur la route engage désormais le partage de l’eau.",
              "variables": [],
              "valeurs": {}
            },
            "cohorte-orientee": {
              "cle": "evenement.bassins.haut-puits.variante.cohorte-orientee",
              "modele": "La cohorte orientée vers Veille-Basse a fait porter sa demande : la promesse donnée sur la route atteint désormais la citerne.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.bassins.haut-puits.variante.standard",
              "modele": "Autour de la vanne levée, personne ne conteste la pénurie ; le conflit porte sur qui en portera le poids.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "promettre-partage": {
              "intention": {
                "cle": "evenement.bassins.haut-puits.choix.partage",
                "modele": "Promettre un partage mesuré",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.bassins.haut-puits.choix.partage.cout",
                  "modele": "Coût connu : la Cité-caravane devra contribuer à la prochaine maintenance de la citerne.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "proteger-reserves": {
              "intention": {
                "cle": "evenement.bassins.haut-puits.choix.reserves",
                "modele": "Garantir d’abord les réserves de Haut-Puits",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.bassins.haut-puits.choix.reserves.cout",
                  "modele": "Coût connu : les familles déplacées retiendront ce refus au prochain Conseil.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.bassins.haut-puits.origine",
            "modele": "High Well",
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
            "cle": "evenement.bassins.haut-puits.titre",
            "modele": "The water left to the Basins",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.bassins.haut-puits.presentation",
            "modele": "At the end of the first Route Segment, High Well opens its deep cistern. The Free Wells want to secure the colony’s autonomy; displaced families demand the share announced by the prologue signals.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.bassins.haut-puits.information",
              "modele": "The valve can serve both groups today, but the dry season makes every lasting promise costly.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "cohorte-accueillie": {
              "cle": "evenement.bassins.haut-puits.variante.cohorte-accueillie",
              "modele": "The six people welcomed into the Hearths stand before the cistern: the place opened on the road now commits the convoy to sharing water.",
              "variables": [],
              "valeurs": {}
            },
            "cohorte-orientee": {
              "cle": "evenement.bassins.haut-puits.variante.cohorte-orientee",
              "modele": "The cohort directed to Lower Watch sent its request ahead: the promise made on the road has now reached the cistern.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.bassins.haut-puits.variante.standard",
              "modele": "Around the raised valve, no one disputes the shortage; the conflict is about who will bear its weight.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "promettre-partage": {
              "intention": {
                "cle": "evenement.bassins.haut-puits.choix.partage",
                "modele": "Promise a measured share",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.bassins.haut-puits.choix.partage.cout",
                  "modele": "Known cost: the caravan-city must contribute to the cistern’s next maintenance.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "proteger-reserves": {
              "intention": {
                "cle": "evenement.bassins.haut-puits.choix.reserves",
                "modele": "Secure High Well’s reserves first",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.bassins.haut-puits.choix.reserves.cout",
                  "modele": "Known cost: the displaced families will remember this refusal at the next Council.",
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
  ],
  "conseils": [
    {
      "id": "conseil.premiere-veille",
      "compagnon": {
        "id": "ilyana-voss",
        "competences": {
          "majeure": "intendance",
          "secondaire": "diplomatie"
        },
        "trait": "minutieuse-intransigeante",
        "conviction": "eau-sure-pour-tous",
        "projet": "circuit-de-purification-redondant",
        "etatPersonnel": {
          "id": "brulures-de-cendre-stabilisees",
          "contrainte": "eviter-eau-contaminee",
          "voieDeSoin": "filtres-et-repos-en-halo"
        },
        "affectation": {
          "quartier": "intendance",
          "occupation": "tete-de-quartier",
          "faitProduit": "compagnon.ilyana-voss.affectee-intendance",
          "cause": "affectation.porte-lanterne"
        }
      },
      "sujets": [
        {
          "id": "purification-et-partage-de-l-eau",
          "voix": [
            {
              "compagnonId": "ilyana-voss",
              "criteres": [
                "affectation-au-quartier",
                "competence-majeure",
                "conviction-concernee",
                "enjeu-personnel"
              ]
            }
          ],
          "decisions": [
            {
              "id": "securiser-circuit",
              "faitProduit": "conseil.premiere-veille.circuit-securise",
              "ouverteParAffectation": true
            },
            {
              "id": "maintenir-distribution",
              "faitProduit": "conseil.premiere-veille.distribution-maintenue",
              "ouverteParAffectation": false
            }
          ]
        }
      ],
      "textes": {
        "fr": {
          "titre": {
            "cle": "conseil.premiere-veille.titre",
            "modele": "Conseil de la première veille",
            "variables": [],
            "valeurs": {}
          },
          "compagnon": {
            "nom": {
              "cle": "compagnon.ilyana-voss.nom",
              "modele": "Ilyana Voss",
              "variables": [],
              "valeurs": {}
            },
            "competenceMajeure": {
              "cle": "competence.intendance",
              "modele": "Intendance",
              "variables": [],
              "valeurs": {}
            },
            "competenceSecondaire": {
              "cle": "competence.diplomatie",
              "modele": "Diplomatie",
              "variables": [],
              "valeurs": {}
            },
            "trait": {
              "cle": "compagnon.ilyana-voss.trait",
              "modele": "Minutieuse, jusqu’à l’intransigeance",
              "variables": [],
              "valeurs": {}
            },
            "ambivalence": {
              "cle": "compagnon.ilyana-voss.ambivalence",
              "modele": "Elle décèle les écarts infimes, mais se raidit sous la pression.",
              "variables": [],
              "valeurs": {}
            },
            "conviction": {
              "cle": "compagnon.ilyana-voss.conviction",
              "modele": "Chaque Habitant a droit à une eau sûre.",
              "variables": [],
              "valeurs": {}
            },
            "projet": {
              "cle": "compagnon.ilyana-voss.projet",
              "modele": "Établir un circuit de purification redondant.",
              "variables": [],
              "valeurs": {}
            },
            "etatPersonnel": {
              "cle": "compagnon.ilyana-voss.etat",
              "modele": "Brûlures de cendre stabilisées",
              "variables": [],
              "valeurs": {}
            },
            "contrainte": {
              "cle": "compagnon.ilyana-voss.contrainte",
              "modele": "Éviter toute exposition à l’eau contaminée.",
              "variables": [],
              "valeurs": {}
            },
            "voieDeSoin": {
              "cle": "compagnon.ilyana-voss.soin",
              "modele": "Renouveler ses filtres et se reposer sous le Halo de veille.",
              "variables": [],
              "valeurs": {}
            },
            "quartier": {
              "cle": "quartier.intendance.nom",
              "modele": "Intendance",
              "variables": [],
              "valeurs": {}
            },
            "informationOuverte": {
              "cle": "compagnon.ilyana-voss.information-ouverte",
              "modele": "Le clapet secondaire peut isoler la pompe douze minutes sans interrompre l’eau des Foyers.",
              "variables": [],
              "valeurs": {}
            }
          },
          "libelles": {
            "typeCompagnon": {
              "cle": "interface.compagnon.type",
              "modele": "Compagnon",
              "variables": [],
              "valeurs": {}
            },
            "competenceMajeure": {
              "cle": "interface.compagnon.competence-majeure",
              "modele": "Compétence majeure",
              "variables": [],
              "valeurs": {}
            },
            "competenceSecondaire": {
              "cle": "interface.compagnon.competence-secondaire",
              "modele": "Compétence secondaire",
              "variables": [],
              "valeurs": {}
            },
            "trait": {
              "cle": "interface.compagnon.trait",
              "modele": "Trait ambivalent",
              "variables": [],
              "valeurs": {}
            },
            "conviction": {
              "cle": "interface.compagnon.conviction",
              "modele": "Conviction",
              "variables": [],
              "valeurs": {}
            },
            "projet": {
              "cle": "interface.compagnon.projet",
              "modele": "Projet",
              "variables": [],
              "valeurs": {}
            },
            "etatPersonnel": {
              "cle": "interface.compagnon.etat",
              "modele": "État personnel",
              "variables": [],
              "valeurs": {}
            },
            "soin": {
              "cle": "interface.compagnon.soin",
              "modele": "Soin",
              "variables": [],
              "valeurs": {}
            },
            "affecter": {
              "cle": "interface.compagnon.affecter-intendance",
              "modele": "Affecter à l’Intendance",
              "variables": [],
              "valeurs": {}
            },
            "affectee": {
              "cle": "interface.compagnon.affectee",
              "modele": "Affectée",
              "variables": [],
              "valeurs": {}
            },
            "informationOuverte": {
              "cle": "interface.compagnon.information-ouverte",
              "modele": "Information ouverte",
              "variables": [],
              "valeurs": {}
            },
            "conseil": {
              "cle": "interface.conseil.type",
              "modele": "Conseil",
              "variables": [],
              "valeurs": {}
            },
            "faitConnu": {
              "cle": "interface.conseil.fait-connu",
              "modele": "Fait connu",
              "variables": [],
              "valeurs": {}
            },
            "source": {
              "cle": "interface.conseil.source",
              "modele": "Source",
              "variables": [],
              "valeurs": {}
            },
            "recommandationMorale": {
              "cle": "interface.conseil.recommandation",
              "modele": "Recommandation morale",
              "variables": [],
              "valeurs": {}
            },
            "enjeuPersonnel": {
              "cle": "interface.conseil.enjeu",
              "modele": "Enjeu personnel",
              "variables": [],
              "valeurs": {}
            },
            "decision": {
              "cle": "interface.conseil.decision",
              "modele": "Décision du Porte-Lanterne",
              "variables": [],
              "valeurs": {}
            },
            "reponseOuverte": {
              "cle": "interface.conseil.reponse-ouverte",
              "modele": "Réponse ouverte par l’Affectation d’Ilyana",
              "variables": [],
              "valeurs": {}
            }
          },
          "sujets": {
            "purification-et-partage-de-l-eau": {
              "titre": {
                "cle": "conseil.premiere-veille.sujet.eau.titre",
                "modele": "Purification et partage de l’eau",
                "variables": [],
                "valeurs": {}
              },
              "voix": {
                "ilyana-voss": {
                  "faitConnu": {
                    "cle": "conseil.premiere-veille.voix.fait-connu",
                    "modele": "Le clapet secondaire tiendra douze minutes avant la chute de pression.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "source": {
                    "cle": "conseil.premiere-veille.voix.source",
                    "modele": "Relevé de pression de l’Intendance",
                    "variables": [],
                    "valeurs": {}
                  },
                  "dateSource": {
                    "cle": "conseil.premiere-veille.voix.date",
                    "modele": "relevé à 00:00",
                    "variables": [],
                    "valeurs": {}
                  },
                  "recommandationMorale": {
                    "cle": "conseil.premiere-veille.voix.recommandation",
                    "modele": "Ilyana recommande de protéger l’eau des Foyers avant le débit des ateliers.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "enjeuPersonnel": {
                    "cle": "conseil.premiere-veille.voix.enjeu",
                    "modele": "Ses brûlures de cendre récidiveraient au contact d’une eau mal filtrée.",
                    "variables": [],
                    "valeurs": {}
                  }
                }
              },
              "decisions": {
                "securiser-circuit": {
                  "cle": "conseil.premiere-veille.decision.securiser",
                  "modele": "Prioriser la sécurisation du circuit",
                  "variables": [],
                  "valeurs": {}
                },
                "maintenir-distribution": {
                  "cle": "conseil.premiere-veille.decision.maintenir",
                  "modele": "Maintenir la distribution vers les ateliers",
                  "variables": [],
                  "valeurs": {}
                }
              }
            }
          },
          "journal": {
            "compagnon.ilyana-voss.affectee-intendance": {
              "titre": {
                "cle": "journal.conseil.affectation.titre",
                "modele": "Ilyana Voss affectée à l’Intendance",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.affectation.cause",
                "modele": "Affectation ordonnée par le Porte-Lanterne",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Porte-Lanterne",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Intendance",
                "variables": [],
                "valeurs": {}
              }
            },
            "conseil.premiere-veille.circuit-securise": {
              "titre": {
                "cle": "journal.conseil.decision.securiser.titre",
                "modele": "Conseil — circuit de purification sécurisé",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.cause",
                "modele": "Conseil de la première veille",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Porte-Lanterne",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Intendance",
                "variables": [],
                "valeurs": {}
              }
            },
            "conseil.premiere-veille.distribution-maintenue": {
              "titre": {
                "cle": "journal.conseil.decision.maintenir.titre",
                "modele": "Conseil — distribution maintenue vers les ateliers",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.cause",
                "modele": "Conseil de la première veille",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Porte-Lanterne",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Intendance",
                "variables": [],
                "valeurs": {}
              }
            }
          }
        },
        "en": {
          "titre": {
            "cle": "conseil.premiere-veille.titre",
            "modele": "First Watch Council",
            "variables": [],
            "valeurs": {}
          },
          "compagnon": {
            "nom": {
              "cle": "compagnon.ilyana-voss.nom",
              "modele": "Ilyana Voss",
              "variables": [],
              "valeurs": {}
            },
            "competenceMajeure": {
              "cle": "competence.intendance",
              "modele": "Stewardship",
              "variables": [],
              "valeurs": {}
            },
            "competenceSecondaire": {
              "cle": "competence.diplomatie",
              "modele": "Diplomacy",
              "variables": [],
              "valeurs": {}
            },
            "trait": {
              "cle": "compagnon.ilyana-voss.trait",
              "modele": "Meticulous, to the point of intransigence",
              "variables": [],
              "valeurs": {}
            },
            "ambivalence": {
              "cle": "compagnon.ilyana-voss.ambivalence",
              "modele": "She spots the smallest deviations, but hardens under pressure.",
              "variables": [],
              "valeurs": {}
            },
            "conviction": {
              "cle": "compagnon.ilyana-voss.conviction",
              "modele": "Every inhabitant deserves safe water.",
              "variables": [],
              "valeurs": {}
            },
            "projet": {
              "cle": "compagnon.ilyana-voss.projet",
              "modele": "Build a redundant purification circuit.",
              "variables": [],
              "valeurs": {}
            },
            "etatPersonnel": {
              "cle": "compagnon.ilyana-voss.etat",
              "modele": "Stabilized ash burns",
              "variables": [],
              "valeurs": {}
            },
            "contrainte": {
              "cle": "compagnon.ilyana-voss.contrainte",
              "modele": "Avoid any exposure to contaminated water.",
              "variables": [],
              "valeurs": {}
            },
            "voieDeSoin": {
              "cle": "compagnon.ilyana-voss.soin",
              "modele": "Renew her filters and rest inside the watch halo.",
              "variables": [],
              "valeurs": {}
            },
            "quartier": {
              "cle": "quartier.intendance.nom",
              "modele": "Stewardship",
              "variables": [],
              "valeurs": {}
            },
            "informationOuverte": {
              "cle": "compagnon.ilyana-voss.information-ouverte",
              "modele": "The secondary valve can isolate the pump for twelve minutes without cutting water to the living quarters.",
              "variables": [],
              "valeurs": {}
            }
          },
          "libelles": {
            "typeCompagnon": {
              "cle": "interface.compagnon.type",
              "modele": "Companion",
              "variables": [],
              "valeurs": {}
            },
            "competenceMajeure": {
              "cle": "interface.compagnon.competence-majeure",
              "modele": "Major skill",
              "variables": [],
              "valeurs": {}
            },
            "competenceSecondaire": {
              "cle": "interface.compagnon.competence-secondaire",
              "modele": "Secondary skill",
              "variables": [],
              "valeurs": {}
            },
            "trait": {
              "cle": "interface.compagnon.trait",
              "modele": "Ambivalent trait",
              "variables": [],
              "valeurs": {}
            },
            "conviction": {
              "cle": "interface.compagnon.conviction",
              "modele": "Conviction",
              "variables": [],
              "valeurs": {}
            },
            "projet": {
              "cle": "interface.compagnon.projet",
              "modele": "Project",
              "variables": [],
              "valeurs": {}
            },
            "etatPersonnel": {
              "cle": "interface.compagnon.etat",
              "modele": "Personal condition",
              "variables": [],
              "valeurs": {}
            },
            "soin": {
              "cle": "interface.compagnon.soin",
              "modele": "Care",
              "variables": [],
              "valeurs": {}
            },
            "affecter": {
              "cle": "interface.compagnon.affecter-intendance",
              "modele": "Assign to Stewardship",
              "variables": [],
              "valeurs": {}
            },
            "affectee": {
              "cle": "interface.compagnon.affectee",
              "modele": "Assigned",
              "variables": [],
              "valeurs": {}
            },
            "informationOuverte": {
              "cle": "interface.compagnon.information-ouverte",
              "modele": "Unlocked information",
              "variables": [],
              "valeurs": {}
            },
            "conseil": {
              "cle": "interface.conseil.type",
              "modele": "Council",
              "variables": [],
              "valeurs": {}
            },
            "faitConnu": {
              "cle": "interface.conseil.fait-connu",
              "modele": "Known fact",
              "variables": [],
              "valeurs": {}
            },
            "source": {
              "cle": "interface.conseil.source",
              "modele": "Source",
              "variables": [],
              "valeurs": {}
            },
            "recommandationMorale": {
              "cle": "interface.conseil.recommandation",
              "modele": "Moral recommendation",
              "variables": [],
              "valeurs": {}
            },
            "enjeuPersonnel": {
              "cle": "interface.conseil.enjeu",
              "modele": "Personal stake",
              "variables": [],
              "valeurs": {}
            },
            "decision": {
              "cle": "interface.conseil.decision",
              "modele": "Lantern-Bearer decision",
              "variables": [],
              "valeurs": {}
            },
            "reponseOuverte": {
              "cle": "interface.conseil.reponse-ouverte",
              "modele": "Response unlocked by Ilyana’s Assignment",
              "variables": [],
              "valeurs": {}
            }
          },
          "sujets": {
            "purification-et-partage-de-l-eau": {
              "titre": {
                "cle": "conseil.premiere-veille.sujet.eau.titre",
                "modele": "Water purification and sharing",
                "variables": [],
                "valeurs": {}
              },
              "voix": {
                "ilyana-voss": {
                  "faitConnu": {
                    "cle": "conseil.premiere-veille.voix.fait-connu",
                    "modele": "The secondary valve will hold for twelve minutes before pressure drops.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "source": {
                    "cle": "conseil.premiere-veille.voix.source",
                    "modele": "Stewardship pressure reading",
                    "variables": [],
                    "valeurs": {}
                  },
                  "dateSource": {
                    "cle": "conseil.premiere-veille.voix.date",
                    "modele": "recorded at 00:00",
                    "variables": [],
                    "valeurs": {}
                  },
                  "recommandationMorale": {
                    "cle": "conseil.premiere-veille.voix.recommandation",
                    "modele": "Ilyana recommends protecting water for the living quarters before workshop throughput.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "enjeuPersonnel": {
                    "cle": "conseil.premiere-veille.voix.enjeu",
                    "modele": "Her ash burns would flare again if exposed to poorly filtered water.",
                    "variables": [],
                    "valeurs": {}
                  }
                }
              },
              "decisions": {
                "securiser-circuit": {
                  "cle": "conseil.premiere-veille.decision.securiser",
                  "modele": "Prioritize circuit safety",
                  "variables": [],
                  "valeurs": {}
                },
                "maintenir-distribution": {
                  "cle": "conseil.premiere-veille.decision.maintenir",
                  "modele": "Maintain distribution to the workshops",
                  "variables": [],
                  "valeurs": {}
                }
              }
            }
          },
          "journal": {
            "compagnon.ilyana-voss.affectee-intendance": {
              "titre": {
                "cle": "journal.conseil.affectation.titre",
                "modele": "Ilyana Voss assigned to Stewardship",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.affectation.cause",
                "modele": "Assignment ordered by the Lantern-Bearer",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Lantern-Bearer",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Stewardship",
                "variables": [],
                "valeurs": {}
              }
            },
            "conseil.premiere-veille.circuit-securise": {
              "titre": {
                "cle": "journal.conseil.decision.securiser.titre",
                "modele": "Council — purification circuit secured",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.cause",
                "modele": "First Watch Council",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Lantern-Bearer",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Stewardship",
                "variables": [],
                "valeurs": {}
              }
            },
            "conseil.premiere-veille.distribution-maintenue": {
              "titre": {
                "cle": "journal.conseil.decision.maintenir.titre",
                "modele": "Council — distribution to the workshops maintained",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.cause",
                "modele": "First Watch Council",
                "variables": [],
                "valeurs": {}
              },
              "acteurs": [
                {
                  "cle": "journal.acteur.porte-lanterne",
                  "modele": "Lantern-Bearer",
                  "variables": [],
                  "valeurs": {}
                },
                {
                  "cle": "compagnon.ilyana-voss.nom",
                  "modele": "Ilyana Voss",
                  "variables": [],
                  "valeurs": {}
                }
              ],
              "cible": {
                "cle": "quartier.intendance.nom",
                "modele": "Stewardship",
                "variables": [],
                "valeurs": {}
              }
            }
          }
        }
      }
    }
  ]
} as const;
