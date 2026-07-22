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
  ]
} as const;
