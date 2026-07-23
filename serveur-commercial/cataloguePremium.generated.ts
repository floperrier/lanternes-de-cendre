// Ce fichier est généré par npm run content:compile.
export default {
  "version": 1,
  "evenements": [
    {
      "id": "veille-basse.la-place-sous-le-phare",
      "famille": "conflits-regionaux",
      "themes": [
        "accueil",
        "cohorte-de-refugies"
      ],
      "fonction": "arbitrer-accueil-cohorte",
      "fenetre": "premier-jalon-bassins-fendus",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "veille-basse"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 480,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "cohorte-du-sillon",
        "habitants-veille-basse",
        "pelerins-de-cendre",
        "techniciens-veille-basse"
      ],
      "sourcesInformations": [
        "cohorte-du-sillon",
        "techniciens-veille-basse"
      ],
      "faitsLus": [],
      "choix": [
        {
          "id": "accueillir",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.cohorte-accueillie",
              "cible": "cohorte-du-sillon"
            }
          ]
        },
        {
          "id": "refuser",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.cohorte-refusee",
              "cible": "cohorte-du-sillon"
            }
          ]
        },
        {
          "id": "rediriger",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.cohorte-redirigee",
              "cible": "hospice-du-sillon"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "integration-ou-prochain-jalon-de-veille-basse",
        "cible": "cohorte-du-sillon"
      },
      "recuperation": {
        "type": "equipes-apres-integration"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "veille-basse.la-place-sous-le-phare",
        "fichier": "/api/commercial/assets/veille-basse-cohorte.webp",
        "octetsTransferes": 191248,
        "contientTexte": false,
        "alternatives": {
          "fr": "Coupe du Phare éteint de Veille-Basse : la Cohorte attend devant les volumes étanches où habitants et Pèlerins préparent des couchettes.",
          "en": "Cutaway of Lower Watch’s dead lighthouse: the Cohort waits before sealed rooms where residents and Pilgrims prepare bunks."
        },
        "provenance": {
          "fiche": "docs/assets/veille-basse-cohorte.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No external input image; generated from the written Veille-Basse event brief.",
          "prompt": "Wide 16:9 painterly industrial 2D scene of the sealed lower chambers of an extinguished lighthouse at Veille-Basse as an exhausted refugee cohort reaches the crowded inhabited entrance; cold slate exterior, warm amber refuge, readable ensemble, no text, label, UI, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "f595550d62faa755e30250d9e2b52aaaa549ff8d9f17b44ee027e38f841bc8a6",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.veille-basse.cohorte.origine",
            "modele": "Veille-Basse — volumes étanches",
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
            "cle": "evenement.veille-basse.cohorte.titre",
            "modele": "La place sous le Phare éteint",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.cohorte.presentation",
            "modele": "Dix-huit personnes du camp des Digues atteignent Veille-Basse. Épuisée mais formée à la charpente étanche, la Cohorte du Sillon demande une destination durable tandis que la Colonie fragile manque déjà de filtres.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.cohorte.information",
              "modele": "La Cohorte vient du camp des Digues, compte dix-huit personnes et sait rendre habitables des volumes fissurés.",
              "variables": [],
              "valeurs": {}
            },
            {
              "cle": "evenement.veille-basse.cohorte.information-charge",
              "modele": "L’accueil occupera les équipes pendant dix minutes avant que deux équipes de charpente puissent rejoindre le convoi.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.cohorte.variante.standard",
              "modele": "Sous la tour éteinte, chaque couchette libre a déjà un nom ; le choix porte sur la communauté qui assumera les nouveaux arrivants.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "accueillir": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.accueillir",
                "modele": "Créer une Charge d’accueil dans la Cité-caravane",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.accueillir.cout",
                  "modele": "Coût connu : dix-huit Habitants à abriter immédiatement ; deux équipes seulement après l’intégration.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "refuser": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.refuser",
                "modele": "Fermer les volumes de Veille-Basse",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.refuser.cout",
                  "modele": "Coût connu : la Cohorte restera sur les routes et ce refus reviendra aux portes de la Colonie.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "rediriger": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.rediriger",
                "modele": "Garantir le passage vers l’Hospice du Sillon",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.rediriger.cout",
                  "modele": "Coût connu : l’Hospice portera la Charge et demandera ensuite des places filtrées.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.veille-basse.cohorte.origine",
            "modele": "Lower Watch — sealed quarters",
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
            "cle": "evenement.veille-basse.cohorte.titre",
            "modele": "Room beneath the dead lighthouse",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.cohorte.presentation",
            "modele": "Eighteen people from the Dike Camp reach Lower Watch. Exhausted but trained in sealed-frame carpentry, the Sillon Cohort asks for a lasting destination while the fragile Colony is already short of filters.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.cohorte.information",
              "modele": "The Cohort comes from the Dike Camp, numbers eighteen people, and knows how to make cracked chambers habitable.",
              "variables": [],
              "valeurs": {}
            },
            {
              "cle": "evenement.veille-basse.cohorte.information-charge",
              "modele": "Welcoming them will occupy the teams for ten minutes before two carpentry teams can join the convoy.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.cohorte.variante.standard",
              "modele": "Beneath the dead tower, every free bunk already has a name; the choice is which community will carry the newcomers.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "accueillir": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.accueillir",
                "modele": "Create a Welcoming Load in the caravan-city",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.accueillir.cout",
                  "modele": "Known cost: shelter eighteen inhabitants immediately; gain two teams only after integration.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "refuser": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.refuser",
                "modele": "Close Lower Watch’s quarters",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.refuser.cout",
                  "modele": "Known cost: the Cohort remains on the roads and this refusal will return to the Colony’s gates.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "rediriger": {
              "intention": {
                "cle": "evenement.veille-basse.cohorte.choix.rediriger",
                "modele": "Guarantee passage to Sillon Hospice",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.cohorte.choix.rediriger.cout",
                  "modele": "Known cost: the Hospice carries the Load and will later ask for filtered spaces.",
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
      "id": "veille-basse.la-porte-des-filtres",
      "famille": "conflits-regionaux",
      "themes": [
        "survie-collective",
        "pelerins-de-cendre"
      ],
      "fonction": "offrir-intervention-avant-perte",
      "fenetre": "premier-jalon-bassins-fendus",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "veille-basse"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "veille-basse.cohorte-accueillie",
              "veille-basse.cohorte-refusee",
              "veille-basse.cohorte-redirigee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 480,
        "fin": 2147483647
      },
      "priorite": 100,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "habitants-veille-basse",
        "pelerins-de-cendre",
        "techniciens-veille-basse"
      ],
      "sourcesInformations": [
        "techniciens-veille-basse"
      ],
      "faitsLus": [
        "veille-basse.cohorte-accueillie",
        "veille-basse.cohorte-refusee",
        "veille-basse.cohorte-redirigee"
      ],
      "choix": [
        {
          "id": "renforcer-sas",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.sas-renforce",
              "cible": "habitants-veille-basse"
            }
          ]
        },
        {
          "id": "ouvrir-hospice",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.hospice-ouvert",
              "cible": "hospice-du-sillon"
            }
          ]
        },
        {
          "id": "renoncer-intervention",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.intervention-refusee",
              "cible": "habitants-veille-basse"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "intervention-ou-perte-au-jalon-local",
        "cible": "habitants-veille-basse"
      },
      "recuperation": {
        "type": "marche-des-filtres"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "veille-basse.la-porte-des-filtres",
        "fichier": "/api/commercial/assets/veille-basse-porte.webp",
        "octetsTransferes": 226000,
        "contientTexte": false,
        "alternatives": {
          "fr": "Dans le sas de Veille-Basse, deux techniciens retiennent une porte sous la cendre tandis que les Pèlerins montrent les volumes protégés encore accessibles.",
          "en": "In Lower Watch’s airlock, two technicians hold a gate against the ash while Pilgrims point toward protected rooms still available."
        },
        "provenance": {
          "fiche": "docs/assets/veille-basse-porte.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No external input image; generated from the written Veille-Basse event brief.",
          "prompt": "Wide 16:9 painterly industrial 2D scene of Veille-Basse’s failing sealed gate during an ash gust, with two technician teams bracing filters and Ash Pilgrims asking to open protected space; an explicit warning with a visible possible intervention, no text, label, UI, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "6005fd7eb2736df10bb68147c2ae1fac47bbc34eeccca7dcc6d841f9226944f2",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.veille-basse.porte.origine",
            "modele": "Veille-Basse — porte des filtres",
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
            "cle": "evenement.veille-basse.porte.titre",
            "modele": "La porte des filtres",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.porte.presentation",
            "modele": "Une rafale force le sas extérieur. Veille-Basse est avertie : sans intervention, ses deux équipes ne pourront pas maintenir simultanément les filtres, les archives et l’accueil.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.porte.information",
              "modele": "Les techniciens confirment deux réponses viables avant la prochaine rafale ; aucune perte n’est encore irréversible.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.porte.variante.standard",
              "modele": "Les verrous vibrent ; entre les deux rafales demeure une fenêtre assez longue pour agir.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "renforcer-sas": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.sas",
                "modele": "Affecter les techniciens au renfort du sas",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.sas.cout",
                  "modele": "Coût connu : le Marché des filtres et l’ouverture des archives attendront.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-hospice": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.hospice",
                "modele": "Ouvrir les volumes filtrés de l’Hospice",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.hospice.cout",
                  "modele": "Coût connu : Veille-Basse reste fragile, mais la Pression d’accueil se déplace vers l’Hospice.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "renoncer-intervention": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.renoncer",
                "modele": "Renoncer à intervenir avant la prochaine rafale",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.renoncer.cout",
                  "modele": "Coût connu : l’occasion sera consignée comme ignorée ; Veille-Basse deviendra perdue au prochain Jalon local.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.veille-basse.porte.origine",
            "modele": "Lower Watch — filter gate",
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
            "cle": "evenement.veille-basse.porte.titre",
            "modele": "The filter gate",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.porte.presentation",
            "modele": "An ash gust strains the outer airlock. Lower Watch is warned: without intervention, its two teams cannot maintain the filters, archives, and welcome at the same time.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.porte.information",
              "modele": "The technicians confirm two viable responses before the next gust; no loss is irreversible yet.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.porte.variante.standard",
              "modele": "The locks shake; between two gusts, a window long enough to act remains.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "renforcer-sas": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.sas",
                "modele": "Assign the technicians to reinforce the airlock",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.sas.cout",
                  "modele": "Known cost: the filter market and archive opening must wait.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-hospice": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.hospice",
                "modele": "Open the Hospice’s filtered chambers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.hospice.cout",
                  "modele": "Known cost: Lower Watch remains fragile, but the welcoming Pressure shifts to the Hospice.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "renoncer-intervention": {
              "intention": {
                "cle": "evenement.veille-basse.porte.choix.renoncer",
                "modele": "Decline to intervene before the next gust",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.porte.choix.renoncer.cout",
                  "modele": "Known cost: the opportunity will be recorded as ignored; Lower Watch will become lost at the next local Milestone.",
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
      "id": "veille-basse.les-registres-du-reflux",
      "famille": "mystere-des-phares",
      "themes": [
        "reseau-ancien",
        "peripheries-sacrifiees"
      ],
      "fonction": "revelation-essentielle-deplacement-des-cendres",
      "fenetre": "premier-jalon-bassins-fendus",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "veille-basse"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "veille-basse.sas-renforce",
              "veille-basse.hospice-ouvert"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 480,
        "fin": 2147483647
      },
      "priorite": 90,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "techniciens-veille-basse"
      ],
      "sourcesInformations": [
        "techniciens-veille-basse"
      ],
      "faitsLus": [
        "veille-basse.sas-renforce",
        "veille-basse.hospice-ouvert"
      ],
      "choix": [
        {
          "id": "copier-registres",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.registres-copies",
              "cible": "techniciens-veille-basse"
            }
          ]
        },
        {
          "id": "laisser-registres",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.registres-laisses",
              "cible": "habitants-veille-basse"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "solution-finale",
        "cible": "porte-lanterne"
      },
      "recuperation": {
        "type": "revelation-garantie"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "veille-basse.les-registres-du-reflux",
        "fichier": "/api/commercial/assets/veille-basse-archives.webp",
        "octetsTransferes": 212892,
        "contientTexte": false,
        "alternatives": {
          "fr": "Salle d’archives sans texte lisible : cartes gravées, conduites et tambours de calibration montrent la cendre déplacée des phares centraux vers les Bassins périphériques.",
          "en": "Archive room without readable text: engraved maps, conduits, and calibration drums show ash displaced from central lighthouses toward peripheral Basins."
        },
        "provenance": {
          "fiche": "docs/assets/veille-basse-archives.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No external input image; generated from the written Veille-Basse mystery-revelation brief.",
          "prompt": "Wide 16:9 painterly industrial 2D archive vault in Veille-Basse’s dead lighthouse, where physical maps, airflow channels and calibration drums reveal that the ancient network displaced toxic ash from protected cities toward peripheral basins; understandable without a Companion, no readable text, label, UI, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "78c082dd0cae64868e0bac44a0dcabb4c626dba277d57f08280aa80032f89848",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.veille-basse.archives.origine",
            "modele": "Archives techniques de Veille-Basse",
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
            "cle": "evenement.veille-basse.archives.titre",
            "modele": "Les registres du reflux",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.archives.presentation",
            "modele": "Les cartes de calibration montrent que le Réseau ancien protégeait les villes productives et repoussait la cendre vers les Bassins fendus. Sa désynchronisation n’a pas créé la masse : elle a libéré ce que les périphéries recevaient déjà.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.archives.information",
              "modele": "Les tracés, dates de maintenance et volumes déplacés se recoupent ; cette révélation ne dépend du témoignage d’aucun Compagnon.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.archives.variante.standard",
              "modele": "Sur la table, les anciennes courbes convergent toutes vers les mêmes territoires sacrifiés.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "copier-registres": {
              "intention": {
                "cle": "evenement.veille-basse.archives.choix.copier",
                "modele": "Copier les registres dans le Journal causal",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.archives.choix.copier.cout",
                  "modele": "Coût connu : une équipe technique quitte les filtres le temps de sécuriser la copie.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "laisser-registres": {
              "intention": {
                "cle": "evenement.veille-basse.archives.choix.laisser",
                "modele": "Laisser les originaux sous la garde de Veille-Basse",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.archives.choix.laisser.cout",
                  "modele": "Coût connu : la Cité-caravane n’emporte qu’un relevé synthétique, mais la révélation reste acquise.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.veille-basse.archives.origine",
            "modele": "Lower Watch technical archives",
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
            "cle": "evenement.veille-basse.archives.titre",
            "modele": "The backflow records",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.archives.presentation",
            "modele": "Calibration maps show that the Ancient Network protected productive cities and pushed ash toward the Fractured Basins. Its loss of synchronization did not create the mass: it released what the peripheries had always received.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.archives.information",
              "modele": "Routes, maintenance dates, and displaced volumes agree; this revelation depends on no Companion’s testimony.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.archives.variante.standard",
              "modele": "Across the table, every old curve converges on the same sacrificed territories.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "copier-registres": {
              "intention": {
                "cle": "evenement.veille-basse.archives.choix.copier",
                "modele": "Copy the records into the causal Journal",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.archives.choix.copier.cout",
                  "modele": "Known cost: one technical team leaves the filters while securing the copy.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "laisser-registres": {
              "intention": {
                "cle": "evenement.veille-basse.archives.choix.laisser",
                "modele": "Leave the originals in Lower Watch’s care",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.archives.choix.laisser.cout",
                  "modele": "Known cost: the caravan-city carries only a summary survey, but the revelation remains known.",
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
      "id": "veille-basse.maelys-et-le-coffret",
      "famille": "histoires-de-compagnons",
      "themes": [
        "confiance",
        "transmission"
      ],
      "fonction": "histoire-de-maelys-rive",
      "fenetre": "premier-jalon-bassins-fendus",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "veille-basse"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "veille-basse.registres-copies",
              "veille-basse.registres-laisses"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 480,
        "fin": 2147483647
      },
      "priorite": 80,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "maelys-rive",
        "techniciens-veille-basse"
      ],
      "sourcesInformations": [
        "maelys-rive"
      ],
      "faitsLus": [
        "veille-basse.registres-copies",
        "veille-basse.registres-laisses"
      ],
      "choix": [
        {
          "id": "confier-coffret",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.maelys-mission-confiee",
              "cible": "maelys-rive"
            }
          ]
        },
        {
          "id": "garder-equipes",
          "effets": [],
          "faitsProduits": [
            {
              "id": "veille-basse.maelys-equipes-prioritaires",
              "cible": "techniciens-veille-basse"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "prochain-jalon-de-veille-basse",
        "cible": "maelys-rive"
      },
      "recuperation": {
        "type": "competence-non-obligatoire"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "veille-basse.maelys-et-le-coffret",
        "fichier": "/api/commercial/assets/veille-basse-maelys.webp",
        "octetsTransferes": 199516,
        "contientTexte": false,
        "alternatives": {
          "fr": "Dans un atelier couvert, Maëlys tend un coffret de relevés au Porte-Lanterne tandis que des équipes de charpente renforcent l’Hospice au second plan.",
          "en": "In a covered workshop, Maëlys offers the Lantern-Bearer a survey case while carpentry teams reinforce the Hospice in the background."
        },
        "provenance": {
          "fiche": "docs/assets/veille-basse-maelys.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No external input image; generated from the written Maëlys Rive event brief.",
          "prompt": "Wide 16:9 painterly industrial 2D workshop passage where Maëlys Rive offers a sealed survey case while refugee carpentry teams prepare the Hospice du Sillon; grounded ensemble rather than heroic portrait, no text, label, UI, logo or watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "3ad5cda3a39479cf5f9ceb03b75ae9ec7a3ce395c7a58fe68e6f92e3070886d8",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.veille-basse.maelys.origine",
            "modele": "Atelier de Veille-Basse",
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
            "cle": "evenement.veille-basse.maelys.titre",
            "modele": "Maëlys et le coffret étanche",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.maelys.presentation",
            "modele": "Maëlys Rive, technicienne du Phare éteint, propose son coffret de relevés pour reconnaître les conduites de l’Hospice. Son savoir ouvre une voie plus précise ; les équipes de charpente peuvent aussi réussir sans elle.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.maelys.information",
              "modele": "Le coffret contient des jauges anciennes et un protocole que Maëlys a reconstruit, mais aucune étape ne requiert sa présence.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.maelys.variante.standard",
              "modele": "Elle pose le coffret entre vous, sans présenter sa propre présence comme le prix du succès.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-coffret": {
              "intention": {
                "cle": "evenement.veille-basse.maelys.choix.coffret",
                "modele": "Confier à Maëlys le relevé de l’Hospice",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.maelys.choix.coffret.cout",
                  "modele": "Coût connu : Veille-Basse perd temporairement une technicienne de ses filtres.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garder-equipes": {
              "intention": {
                "cle": "evenement.veille-basse.maelys.choix.equipes",
                "modele": "Garder Maëlys aux filtres et envoyer les charpentiers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.maelys.choix.equipes.cout",
                  "modele": "Coût connu : le relevé de l’Hospice sera plus lent, sans bloquer sa consolidation.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.veille-basse.maelys.origine",
            "modele": "Lower Watch workshop",
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
            "cle": "evenement.veille-basse.maelys.titre",
            "modele": "Maëlys and the sealed case",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.veille-basse.maelys.presentation",
            "modele": "Maëlys Rive, a technician of the dead lighthouse, offers her survey case to inspect the Hospice conduits. Her knowledge opens a more precise route; the carpentry teams can also succeed without her.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.veille-basse.maelys.information",
              "modele": "The case holds ancient gauges and a protocol Maëlys reconstructed, but no step requires her presence.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.veille-basse.maelys.variante.standard",
              "modele": "She sets the case between you without presenting her own presence as the price of success.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-coffret": {
              "intention": {
                "cle": "evenement.veille-basse.maelys.choix.coffret",
                "modele": "Entrust the Hospice survey to Maëlys",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.maelys.choix.coffret.cout",
                  "modele": "Known cost: Lower Watch temporarily loses one filter technician.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garder-equipes": {
              "intention": {
                "cle": "evenement.veille-basse.maelys.choix.equipes",
                "modele": "Keep Maëlys on the filters and send the carpenters",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.veille-basse.maelys.choix.equipes.cout",
                  "modele": "Known cost: the Hospice survey will be slower without blocking its reinforcement.",
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
      "id": "bassins.haut-puits.pacte-des-citernes",
      "famille": "conflits-regionaux",
      "themes": [
        "partage-de-leau",
        "autonomie-locale"
      ],
      "fonction": "negocier-pacte-des-citernes",
      "fenetre": "halte-haut-puits",
      "conditions": {
        "requises": [
          {
            "type": "temps-au-moins",
            "secondes": 360
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.haut-puits.partage-promis",
              "bassins.haut-puits.reserves-protegees"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 360,
        "fin": 2147483647
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
        "bassins.haut-puits.partage-promis",
        "bassins.haut-puits.reserves-protegees"
      ],
      "choix": [
        {
          "id": "ouvrir-citerne",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "eau",
              "valeur": -30
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.pacte-partage",
              "cible": "habitants-haut-puits"
            }
          ]
        },
        {
          "id": "garantir-autonomie",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.pacte-autonomie",
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
        "type": "marche-de-besoins-fini"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.haut-puits.pacte-des-citernes",
        "fichier": "/assets/bassins-haut-puits.webp",
        "octetsTransferes": 283424,
        "contientTexte": false,
        "alternatives": {
          "fr": "Autour de la vanne de la citerne profonde, les délégués des Puits Libres et les familles déplacées attendent la décision du Porte-Lanterne.",
          "en": "Around the deep cistern valve, Free Wells delegates and displaced families await the Lantern-Bearer’s decision."
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
            "cle": "evenement.haut-puits.pacte.origine",
            "modele": "Citerne profonde de Haut-Puits",
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
            "cle": "evenement.haut-puits.pacte.titre",
            "modele": "Le pacte des citernes",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.pacte.presentation",
            "modele": "Les Puits Libres proposent d’ouvrir la citerne aux familles déplacées si la cité-caravane garantit des pièces de filtration jusqu’au Conseil des Vannes.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.pacte.information",
              "modele": "Le registre de jauge confirme que le partage rendrait Haut-Puits fragile sans assécher immédiatement la citerne.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.pacte.variante.standard",
              "modele": "Les marques de niveau traversent la paroi de la citerne comme les anneaux d’une dette ancienne.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "ouvrir-citerne": {
              "intention": {
                "cle": "evenement.haut-puits.pacte.choix.ouvrir",
                "modele": "Garantir le partage de l’Eau",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.pacte.choix.ouvrir.cout",
                  "modele": "Coût connu : trente litres d’Eau du convoi soutiendront la première distribution.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garantir-autonomie": {
              "intention": {
                "cle": "evenement.haut-puits.pacte.choix.garantir",
                "modele": "Garantir d’abord l’autonomie de Haut-Puits",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.pacte.choix.garantir.cout",
                  "modele": "Coût connu : les familles déplacées seront écartées jusqu’au Conseil des Vannes.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.haut-puits.pacte.origine",
            "modele": "High Well deep cistern",
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
            "cle": "evenement.haut-puits.pacte.titre",
            "modele": "The cistern pact",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.pacte.presentation",
            "modele": "The Free Wells will open the cistern to displaced families if the caravan-city guarantees filtration parts until the Sluice Council.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.pacte.information",
              "modele": "The gauge register confirms that sharing would leave High Well fragile without immediately draining the cistern.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.pacte.variante.standard",
              "modele": "Level marks cross the cistern wall like the rings of an old debt.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "ouvrir-citerne": {
              "intention": {
                "cle": "evenement.haut-puits.pacte.choix.ouvrir",
                "modele": "Guarantee Water sharing",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.pacte.choix.ouvrir.cout",
                  "modele": "Known cost: thirty litres of convoy Water will support the first distribution.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garantir-autonomie": {
              "intention": {
                "cle": "evenement.haut-puits.pacte.choix.garantir",
                "modele": "Guarantee High Well’s autonomy first",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.pacte.choix.garantir.cout",
                  "modele": "Known cost: displaced families will be turned away until the Sluice Council.",
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
      "id": "bassins.haut-puits.vanniers-du-panache",
      "famille": "conflits-regionaux",
      "themes": [
        "panache-de-cendre",
        "responsabilite-locale"
      ],
      "fonction": "arbitrer-consequence-du-halo",
      "fenetre": "halte-haut-puits",
      "conditions": {
        "requises": [
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.haut-puits.pacte-partage",
              "bassins.haut-puits.pacte-autonomie"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 360,
        "fin": 2147483647
      },
      "priorite": 90,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "puits-libres",
        "habitants-haut-puits"
      ],
      "sourcesInformations": [
        "puits-libres"
      ],
      "faitsLus": [
        "bassins.haut-puits.pacte-partage",
        "bassins.haut-puits.pacte-autonomie"
      ],
      "choix": [
        {
          "id": "confiner-boues",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.panache-confine",
              "cible": "habitants-haut-puits"
            }
          ]
        },
        {
          "id": "deriver-panache",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.panache-derive",
              "cible": "puits-libres"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "puits-libres"
      },
      "recuperation": {
        "type": "liaison-des-vanniers"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.haut-puits.vanniers-du-panache",
        "fichier": "/api/commercial/assets/haut-puits-vanniers.webp",
        "octetsTransferes": 359508,
        "contientTexte": false,
        "alternatives": {
          "fr": "Les ateliers des Vanniers apparaissent sous un panache de cendre balisé par des paniers de roseaux.",
          "en": "The Basketmakers’ workshops sit beneath an ash plume marked by reed baskets."
        },
        "provenance": {
          "fiche": "docs/assets/haut-puits-vanniers.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Use case: wide 16:9 story-event illustration for the premium narrative game “Lanternes de cendre”. Create one production-ready environment image. The attached Cité-Caravane image is a style and world reference only: match its elevated oblique viewpoint, intricate industrial machinery, painterly-realistic detail, charcoal/ash blue-black palette, restrained warm amber lantern light, and desolate ash-storm atmosphere. New scene: the Basketmakers’ district below High Well, with reed-weaving workshops, drying reed bundles, woven baskets and filter mats, narrow water channels, and a dense ash plume visibly drifting down onto the district from distant settling basins. A few small anonymous workers protect their workshops; the threatened craft community and cause-and-effect of the plume must be visually clear. Cinematic wide composition, high environmental storytelling, no readable text, no typography, no logos, no watermark, no weapons, no UI. Do not copy the exact composition of the reference.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "788daf8b7565d4a79373816542b3cc9ff27a8bffa80a619fc9acbe711765ee57",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.haut-puits.vanniers.origine",
            "modele": "Chemin des Vanniers",
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
            "cle": "evenement.haut-puits.vanniers.titre",
            "modele": "Les Vanniers sous le panache",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.vanniers.presentation",
            "modele": "Le halo du convoi a poussé une langue de cendre vers les ateliers des Vanniers. Haut-Puits demande qui portera les boues nécessaires à son confinement.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.vanniers.information",
              "modele": "Les relevés datés relient le panache au dernier Engagement de route ; le détour reste praticable, mais sans retour normal.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.vanniers.variante.standard",
              "modele": "Des paniers de roseaux enduits de cendre balisent la dérive jusqu’aux ateliers suspendus.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confiner-boues": {
              "intention": {
                "cle": "evenement.haut-puits.vanniers.choix.confiner",
                "modele": "Confiner les boues avec les équipes du convoi",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.vanniers.choix.confiner.cout",
                  "modele": "Coût connu : les équipes d’Entretien délaisseront un chantier pendant la prochaine veille.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "deriver-panache": {
              "intention": {
                "cle": "evenement.haut-puits.vanniers.choix.deriver",
                "modele": "Dériver le panache vers le bassin vide",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.vanniers.choix.deriver.cout",
                  "modele": "Coût connu : les Puits Libres porteront cette nouvelle nuisance au Conseil des Vannes.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.haut-puits.vanniers.origine",
            "modele": "Basketmakers’ Path",
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
            "cle": "evenement.haut-puits.vanniers.titre",
            "modele": "The Basketmakers under the plume",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.vanniers.presentation",
            "modele": "The convoy’s watch halo pushed an ash tongue towards the Basketmakers’ workshops. High Well asks who will carry the sludge needed to contain it.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.vanniers.information",
              "modele": "Dated readings link the plume to the last Route Commitment; the diversion remains passable, but there is no normal return.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.vanniers.variante.standard",
              "modele": "Ash-coated reed baskets mark the drift all the way to the suspended workshops.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confiner-boues": {
              "intention": {
                "cle": "evenement.haut-puits.vanniers.choix.confiner",
                "modele": "Contain the sludge with convoy crews",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.vanniers.choix.confiner.cout",
                  "modele": "Known cost: Maintenance crews will leave one worksite unattended during the next watch.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "deriver-panache": {
              "intention": {
                "cle": "evenement.haut-puits.vanniers.choix.deriver",
                "modele": "Divert the plume towards the empty basin",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.vanniers.choix.deriver.cout",
                  "modele": "Known cost: the Free Wells will bring this new burden to the Sluice Council.",
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
      "id": "bassins.haut-puits.boues-du-decanteur",
      "famille": "consequences-systemiques",
      "themes": [
        "decantation",
        "transformation-du-convoi"
      ],
      "fonction": "exposer-dette-de-decantation",
      "fenetre": "halte-haut-puits",
      "conditions": {
        "requises": [
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.haut-puits.panache-confine",
              "bassins.haut-puits.panache-derive"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 360,
        "fin": 2147483647
      },
      "priorite": 80,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "equipes-entretien",
        "habitants-haut-puits"
      ],
      "sourcesInformations": [
        "equipes-entretien"
      ],
      "faitsLus": [
        "bassins.haut-puits.panache-confine",
        "bassins.haut-puits.panache-derive"
      ],
      "choix": [
        {
          "id": "consigner-decanteur",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.decanteur-documente",
              "cible": "equipes-entretien"
            }
          ]
        },
        {
          "id": "adapter-arche",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.arche-documentee",
              "cible": "equipes-entretien"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "transformation-regionale",
        "cible": "equipes-entretien"
      },
      "recuperation": {
        "type": "projet-non-impose"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.haut-puits.boues-du-decanteur",
        "fichier": "/api/commercial/assets/haut-puits-decanteur.webp",
        "octetsTransferes": 291654,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des équipes comparent des boues confinées aux plans d’un Décanteur itinérant et d’une Arche des déplacés.",
          "en": "Crews compare contained sludge with plans for a Travelling Settler and an Ark for the Displaced."
        },
        "provenance": {
          "fiche": "docs/assets/haut-puits-decanteur.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Use case: wide 16:9 story-event illustration for the premium narrative game “Lanternes de cendre”. Create one production-ready environment image. The attached Cité-Caravane image is a style and world reference only: match its elevated oblique viewpoint, intricate industrial machinery, painterly-realistic detail, charcoal/ash blue-black palette, restrained warm amber lantern light, and desolate ash-storm atmosphere. New scene: a sludge confinement yard beside High Well. Thick dark settling sludge is held behind patched metal baffles and portable pipes. In the foreground, an engineering table clearly displays two distinct sets of visual plans without readable writing: one for a compact travelling settler mounted on a caravan chassis, the other for a broad ark-like shelter for displaced families. Mechanics compare the two options, but neither machine is being built yet. Make the two possible transformations visually distinct and the unresolved choice unmistakable. Cinematic wide composition, high environmental storytelling, no readable text, no typography, no logos, no watermark, no weapons, no UI. Do not copy the exact composition of the reference.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "9543f42946840cfa2ef894bce527d9c52db6a2fe6a026e90ca49145d539a9327",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.haut-puits.boues.origine",
            "modele": "Maison des Filtres",
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
            "cle": "evenement.haut-puits.boues.titre",
            "modele": "Ce que retient le Décanteur",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.boues.presentation",
            "modele": "Les boues confinées prouvent qu’un Décanteur itinérant sécuriserait des sources contaminées, tandis que les plans de sas pourraient servir à une Arche des déplacés.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.boues.information",
              "modele": "Les deux projets réclament un châssis entier et restent incompatibles avec une transformation gratuite ou instantanée.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.boues.variante.standard",
              "modele": "Deux jeux de plans restent ouverts côte à côte ; aucun ne désigne à lui seul la forme future du convoi.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-decanteur": {
              "intention": {
                "cle": "evenement.haut-puits.boues.choix.decanteur",
                "modele": "Consigner le procédé du Décanteur itinérant",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.boues.choix.decanteur.cout",
                  "modele": "Coût connu : les résidus occuperaient de la Charge et exigeraient un confinement durable.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "adapter-arche": {
              "intention": {
                "cle": "evenement.haut-puits.boues.choix.arche",
                "modele": "Adapter les sas pour l’Arche des déplacés",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.boues.choix.arche.cout",
                  "modele": "Coût connu : l’accueil augmenterait immédiatement les besoins en Eau, Vivres et Chaleur.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.haut-puits.boues.origine",
            "modele": "Filter House",
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
            "cle": "evenement.haut-puits.boues.titre",
            "modele": "What the Settler retains",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.boues.presentation",
            "modele": "The contained sludge proves that a Travelling Settler could secure contaminated sources, while the airlock plans could serve an Ark for the Displaced.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.boues.information",
              "modele": "Both projects require an entire chassis and remain incompatible with a free or instant transformation.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.boues.variante.standard",
              "modele": "Two sets of plans remain open side by side; neither alone determines the convoy’s future shape.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-decanteur": {
              "intention": {
                "cle": "evenement.haut-puits.boues.choix.decanteur",
                "modele": "Record the Travelling Settler process",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.boues.choix.decanteur.cout",
                  "modele": "Known cost: residues would occupy Load and require lasting containment.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "adapter-arche": {
              "intention": {
                "cle": "evenement.haut-puits.boues.choix.arche",
                "modele": "Adapt the airlocks for the Ark for the Displaced",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.boues.choix.arche.cout",
                  "modele": "Known cost: sheltering people would immediately increase Water, Food and Heat needs.",
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
      "id": "bassins.haut-puits.ilyana-et-la-vanne",
      "famille": "histoires-de-compagnons",
      "themes": [
        "conviction",
        "partage-de-leau"
      ],
      "fonction": "confronter-conviction-d-ilyana",
      "fenetre": "halte-haut-puits",
      "conditions": {
        "requises": [
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.haut-puits.decanteur-documente",
              "bassins.haut-puits.arche-documentee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 360,
        "fin": 2147483647
      },
      "priorite": 70,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ilyana-voss",
        "habitants-haut-puits"
      ],
      "sourcesInformations": [
        "ilyana-voss"
      ],
      "faitsLus": [
        "bassins.haut-puits.decanteur-documente",
        "bassins.haut-puits.arche-documentee"
      ],
      "choix": [
        {
          "id": "lui-confier-registre",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.ilyana-garante",
              "cible": "ilyana-voss"
            }
          ]
        },
        {
          "id": "garder-arbitrage-collectif",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.haut-puits.ilyana-contredite",
              "cible": "ilyana-voss"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "ilyana-voss"
      },
      "recuperation": {
        "type": "lien-reparable-au-conseil"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.haut-puits.ilyana-et-la-vanne",
        "fichier": "/api/commercial/assets/haut-puits-ilyana.webp",
        "octetsTransferes": 201668,
        "contientTexte": false,
        "alternatives": {
          "fr": "Ilyana tient un registre ouvert devant la vanne de Haut-Puits tandis que les délégués attendent la décision.",
          "en": "Ilyana holds an open register before the High Well valve while delegates await the decision."
        },
        "provenance": {
          "fiche": "docs/assets/haut-puits-ilyana.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "public/assets/cite-caravane.png used as the project art-direction reference.",
          "prompt": "Use case: wide 16:9 story-event illustration for the premium narrative game “Lanternes de cendre”. Create one production-ready character-and-environment image. The attached Cité-Caravane image is a style and world reference only: match its elevated oblique industrial setting, painterly-realistic detail, charcoal/ash blue-black palette, restrained warm amber lantern light, and desolate ash-storm atmosphere. New scene: Ilyana Voss, a practical adult convoy companion in ash-dark work clothes, stands at High Well’s large water distribution valve, one hand near the brass control wheel. Beside her lies an open blank registry with visible ruled pages but absolutely no readable writing. Across the valve table, several local delegates and convoy witnesses face her, making the tension between entrusting her as guarantor and retaining collective arbitration visually clear. Include cistern pipes and the well infrastructure behind them. Respectful non-glamourized character depiction, cinematic wide composition, high environmental storytelling, no readable text, no typography, no logos, no watermark, no weapons, no UI. Do not copy the exact composition of the reference.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "5b97d81678fa990d6289f36a79a4d34b24e7be92b0fc75fd43168eea6c9e5e4e",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.haut-puits.ilyana.origine",
            "modele": "Vanne de répartition",
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
            "cle": "evenement.haut-puits.ilyana.titre",
            "modele": "Ilyana devant la dernière vanne",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.ilyana.presentation",
            "modele": "Ilyana demande que chaque ouverture de la citerne soit consignée avec ses bénéficiaires et son coût, même si les Puits Libres jugent ce registre intrusif.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.ilyana.information",
              "modele": "Sa proposition défend sa conviction d’une Eau sûre pour tous sans lui donner autorité sur le Conseil.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.ilyana.variante.standard",
              "modele": "Elle pose son crayon sur le registre plutôt que sur la vanne, laissant la décision au Porte-Lanterne.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lui-confier-registre": {
              "intention": {
                "cle": "evenement.haut-puits.ilyana.choix.confier",
                "modele": "Lui confier le registre de partage",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.ilyana.choix.confier.cout",
                  "modele": "Coût connu : sa parole engagera personnellement l’Intendance au Conseil des Vannes.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garder-arbitrage-collectif": {
              "intention": {
                "cle": "evenement.haut-puits.ilyana.choix.collectif",
                "modele": "Garder le registre sous arbitrage collectif",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.ilyana.choix.collectif.cout",
                  "modele": "Coût connu : Ilyana restera consultée, mais sa garantie ne sera pas reconnue.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.haut-puits.ilyana.origine",
            "modele": "Distribution valve",
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
            "cle": "evenement.haut-puits.ilyana.titre",
            "modele": "Ilyana at the last valve",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.haut-puits.ilyana.presentation",
            "modele": "Ilyana asks that every opening of the cistern record its beneficiaries and cost, even though the Free Wells consider such a register intrusive.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.haut-puits.ilyana.information",
              "modele": "Her proposal defends her belief in safe Water for everyone without granting her authority over the Council.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.haut-puits.ilyana.variante.standard",
              "modele": "She places her pencil on the register rather than the valve, leaving the decision to the Lantern-Bearer.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lui-confier-registre": {
              "intention": {
                "cle": "evenement.haut-puits.ilyana.choix.confier",
                "modele": "Entrust her with the sharing register",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.ilyana.choix.confier.cout",
                  "modele": "Known cost: her word will personally commit Stewardship at the Sluice Council.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "garder-arbitrage-collectif": {
              "intention": {
                "cle": "evenement.haut-puits.ilyana.choix.collectif",
                "modele": "Keep the register under collective arbitration",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.haut-puits.ilyana.choix.collectif.cout",
                  "modele": "Known cost: Ilyana will remain consulted, but her guarantee will not be recognized.",
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
      "id": "bassins.nacelles.le-poids-des-deux-rives",
      "famille": "conflits-regionaux",
      "themes": [
        "eau",
        "accueil",
        "factions"
      ],
      "fonction": "confronter-les-decisions-des-deux-branches",
      "fenetre": "relais-des-nacelles",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "relais-des-vannes"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 120,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "nacelliers-des-vannes",
        "puits-libres",
        "pelerins-de-cendre",
        "cohorte-du-sillon"
      ],
      "sourcesInformations": [
        "nacelliers-des-vannes"
      ],
      "faitsLus": [
        "bassins.haut-puits.ilyana-garante",
        "bassins.haut-puits.ilyana-contredite",
        "veille-basse.maelys-mission-confiee",
        "veille-basse.maelys-equipes-prioritaires",
        "veille-basse.intervention-refusee"
      ],
      "choix": [
        {
          "id": "partager-contrepoids",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -4
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.accord-regional",
              "cible": "nacelliers-des-vannes"
            }
          ]
        },
        {
          "id": "reserver-passage",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "eau",
              "valeur": -8
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.passage-restreint",
              "cible": "cohorte-du-sillon"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "nacelliers-des-vannes"
      },
      "recuperation": {
        "type": "accord-regional-couteux"
      },
      "variantes": [
        {
          "id": "echo-ilyana-garante",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.haut-puits.ilyana-garante"
          }
        },
        {
          "id": "echo-ilyana-contredite",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.haut-puits.ilyana-contredite"
          }
        },
        {
          "id": "echo-maelys-mission",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.maelys-mission-confiee"
          }
        },
        {
          "id": "echo-maelys-equipes",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.maelys-equipes-prioritaires"
          }
        },
        {
          "id": "echo-veille-abandonnee",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.intervention-refusee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.nacelles.le-poids-des-deux-rives",
        "fichier": "/api/commercial/assets/nacelles-deux-rives.webp",
        "octetsTransferes": 141660,
        "contientTexte": false,
        "alternatives": {
          "fr": "Deux nacelles suspendues se font face au-dessus d’un bassin de cendre, entourées de voyageurs de Haut-Puits et de Veille-Basse qui répartissent les contrepoids.",
          "en": "Two suspended cable cages face one another above an ash basin while travellers from High Well and Lower Watch distribute counterweights."
        },
        "provenance": {
          "fiche": "docs/assets/nacelles-deux-rives.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "No external input image; generated from the written Nacelles regional-conflict brief.",
          "prompt": "Create a single 16:9 narrative event illustration for the French dieselpunk survival management game “Les Lanternes de Cendre”. Scene: two suspended industrial cable-car cages face each other above a vast cracked ash-settling basin; travellers from a deep-well settlement and refugees from a sealed lighthouse settlement visibly cooperate to redistribute heavy counterweights. A mobile lighthouse-convoy glows faintly in the distant haze. Art direction: painterly editorial concept art, muted charcoal, ash beige, oxidized copper and restrained amber light; human-scale, materially plausible machinery, weathered cables and pulleys; sober, tense, compassionate, no heroic pose. Wide composition with clear silhouettes and accessibility-friendly value contrast. No text, no letters, no logos, no UI, no watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "e0ef9c1eae5553779db0e9aed19590ebb84debf0657409eb1b3e5fea50b295c0",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.nacelles.conflit.origine",
            "modele": "Relais des Nacelles",
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
            "cle": "evenement.nacelles.conflit.titre",
            "modele": "Le poids des deux rives",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.conflit.presentation",
            "modele": "Les nacelles ne peuvent porter à la fois les réserves de Haut-Puits et toutes les familles venues de Veille-Basse. Les Puits Libres et les Pèlerins réclament chacun la priorité promise en amont.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.conflit.information",
              "modele": "Le coût réellement payé pour atteindre le Relais porte déjà la marque des deux Colonies, de la Cohorte, du panache et de leurs Factions.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "echo-ilyana-garante": {
              "cle": "evenement.nacelles.conflit.variante.ilyana-garante",
              "modele": "Le registre confié à Ilyana précède le convoi sur le câble : les Nacelliers traitent la garantie de partage de Haut-Puits comme une parole opposable.",
              "variables": [],
              "valeurs": {}
            },
            "echo-ilyana-contredite": {
              "cle": "evenement.nacelles.conflit.variante.ilyana-contredite",
              "modele": "Le registre resté collectif arrive sans garante désignée : les Nacelliers exigent que chaque priorité de Haut-Puits soit renégociée au Relais.",
              "variables": [],
              "valeurs": {}
            },
            "echo-maelys-mission": {
              "cle": "evenement.nacelles.conflit.variante.maelys-mission",
              "modele": "Le coffret confié à Maëlys documente les charges de la rive basse : sa mission donne aux techniciens de Veille-Basse une voix dans la répartition.",
              "variables": [],
              "valeurs": {}
            },
            "echo-maelys-equipes": {
              "cle": "evenement.nacelles.conflit.variante.maelys-equipes",
              "modele": "Les équipes gardées à Veille-Basse ne peuvent renforcer les câbles : leur absence rend visible le prix de la priorité donnée à la Colonie.",
              "variables": [],
              "valeurs": {}
            },
            "echo-veille-abandonnee": {
              "cle": "evenement.nacelles.conflit.variante.veille-abandonnee",
              "modele": "La rive basse n’envoie ni coffret ni équipe : le refus d’intervenir à Veille-Basse revient comme une place vide dans chaque cage.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.nacelles.conflit.variante.standard",
              "modele": "Les registres d’approche restent ouverts côte à côte : aucun délégué ne peut effacer la rive opposée.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "partager-contrepoids": {
              "intention": {
                "cle": "evenement.nacelles.conflit.choix.partager",
                "modele": "Répartir les contrepoids entre les deux rives",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.conflit.choix.partager.cout",
                  "modele": "Coût connu : 4 Matériaux renforcent les cages communes ; aucun choix antérieur n’est annulé.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "reserver-passage": {
              "intention": {
                "cle": "evenement.nacelles.conflit.choix.reserver",
                "modele": "Réserver la prochaine cage au convoi",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.conflit.choix.reserver.cout",
                  "modele": "Coût connu : 8 L d’Eau compensent l’attente imposée aux voyageurs des deux rives.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.nacelles.conflit.origine",
            "modele": "Cableway Relay",
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
            "cle": "evenement.nacelles.conflit.titre",
            "modele": "The weight of both banks",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.conflit.presentation",
            "modele": "The cableways cannot carry both High Well’s reserves and every family arriving from Lower Watch. The Free Wells and Ash Pilgrims each demand the priority promised upstream.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.conflit.information",
              "modele": "The cost already paid to reach the Relay bears the mark of both Colonies, the Cohort, the plume and their Factions.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "echo-ilyana-garante": {
              "cle": "evenement.nacelles.conflit.variante.ilyana-garante",
              "modele": "The register entrusted to Ilyana reaches the cable crews first: they treat High Well’s sharing guarantee as a commitment that can be challenged.",
              "variables": [],
              "valeurs": {}
            },
            "echo-ilyana-contredite": {
              "cle": "evenement.nacelles.conflit.variante.ilyana-contredite",
              "modele": "The collective register arrives without a named guarantor: the cable crews require every High Well priority to be renegotiated at the Relay.",
              "variables": [],
              "valeurs": {}
            },
            "echo-maelys-mission": {
              "cle": "evenement.nacelles.conflit.variante.maelys-mission",
              "modele": "The case entrusted to Maëlys documents loads from the lower bank: her mission gives Lower Watch technicians a voice in the allocation.",
              "variables": [],
              "valeurs": {}
            },
            "echo-maelys-equipes": {
              "cle": "evenement.nacelles.conflit.variante.maelys-equipes",
              "modele": "The teams kept at Lower Watch cannot reinforce the cables: their absence exposes the cost of prioritizing the Colony.",
              "variables": [],
              "valeurs": {}
            },
            "echo-veille-abandonnee": {
              "cle": "evenement.nacelles.conflit.variante.veille-abandonnee",
              "modele": "The lower bank sends neither case nor crew: refusing to intervene at Lower Watch returns as an empty place in every cage.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.nacelles.conflit.variante.standard",
              "modele": "Both approach registers remain open side by side: no delegate can erase the opposite bank.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "partager-contrepoids": {
              "intention": {
                "cle": "evenement.nacelles.conflit.choix.partager",
                "modele": "Distribute the counterweights between both banks",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.conflit.choix.partager.cout",
                  "modele": "Known cost: 4 Materials reinforce the shared cages; no earlier choice is undone.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "reserver-passage": {
              "intention": {
                "cle": "evenement.nacelles.conflit.choix.reserver",
                "modele": "Reserve the next cage for the convoy",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.conflit.choix.reserver.cout",
                  "modele": "Known cost: 8 L of Water offset the wait imposed on travellers from both banks.",
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
      "id": "bassins.nacelles.le-frein-sous-la-cendre",
      "famille": "mystere-des-phares",
      "themes": [
        "reseau-ancien",
        "cible-clandestine"
      ],
      "fonction": "reveler-la-cible-du-frein-magnetique",
      "fenetre": "relais-des-nacelles",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "relais-des-vannes"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.nacelles.accord-regional",
              "bassins.nacelles.passage-restreint"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "nacelliers-des-vannes",
        "frein-magnetique-des-nacelles"
      ],
      "sourcesInformations": [
        "nacelliers-des-vannes"
      ],
      "faitsLus": [
        "bassins.nacelles.accord-regional",
        "bassins.nacelles.passage-restreint"
      ],
      "choix": [
        {
          "id": "baliser-frein",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.cible-frein-balisee",
              "cible": "frein-magnetique-des-nacelles"
            }
          ]
        },
        {
          "id": "consigner-frein",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.cible-frein-consignee",
              "cible": "frein-magnetique-des-nacelles"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "cible-clandestine-revelee",
        "cible": "frein-magnetique-des-nacelles"
      },
      "recuperation": {
        "type": "renseignement-concret"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.nacelles.le-frein-sous-la-cendre",
        "fichier": "/api/commercial/assets/nacelles-frein.webp",
        "octetsTransferes": 153966,
        "contientTexte": false,
        "alternatives": {
          "fr": "Sous le tambour d’une nacelle, des techniciens découvrent un frein magnétique ancien relié à une plaque de laiton et le balisent sans le toucher.",
          "en": "Beneath a cable drum, technicians discover an old magnetic brake connected to a brass plate and mark it without touching it."
        },
        "provenance": {
          "fiche": "docs/assets/nacelles-frein.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "No external input image; generated from the written Nacelles mystery brief.",
          "prompt": "Create a single 16:9 narrative event illustration matching the established “Les Lanternes de Cendre” painterly dieselpunk concept-art style. Scene: beneath the main drum of an old industrial cableway relay, technicians discover a precise ancient magnetic brake connected to a patterned brass plate; they mark and measure the housing without touching it. Massive pulleys and worn steel cables frame the machinery, ash dust hangs in the air, dim amber work lamps reveal the concrete target. Palette: muted charcoal, ash beige, oxidized copper, restrained amber; sober archaeological-industrial mystery, materially plausible, strong readable silhouettes and value contrast. No text, no letters, no logos, no UI, no watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "4869a9a069f961680a2745fa67b58d6b4c8c8723728aacd5ee2c9b717f20e0ae",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.nacelles.mystere.origine",
            "modele": "Machinerie sous le Relais",
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
            "cle": "evenement.nacelles.mystere.titre",
            "modele": "Le frein sous la cendre",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.mystere.presentation",
            "modele": "Sous le tambour principal, un frein magnétique du Réseau ancien module encore chaque charge. Ses impulsions concordent avec les registres montrant le déplacement historique de la cendre vers les périphéries.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.mystere.information",
              "modele": "Le boîtier, son alimentation et sa transmission sont localisés : le frein magnétique est désormais une Cible clandestine concrète, limitée à ce passage.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.mystere.variante.standard",
              "modele": "La plaque de laiton porte le même motif que les courbes de reflux copiées à Veille-Basse.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "baliser-frein": {
              "intention": {
                "cle": "evenement.nacelles.mystere.choix.baliser",
                "modele": "Baliser le boîtier et ses témoins",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.mystere.choix.baliser.cout",
                  "modele": "Coût connu : les Nacelliers sauront exactement quelle infrastructure a été désignée.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "consigner-frein": {
              "intention": {
                "cle": "evenement.nacelles.mystere.choix.consigner",
                "modele": "Consigner le frein dans le Journal causal",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.mystere.choix.consigner.cout",
                  "modele": "Coût connu : le renseignement quitte le cercle des seuls techniciens, sans déclencher d’opération.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.nacelles.mystere.origine",
            "modele": "Machinery beneath the Relay",
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
            "cle": "evenement.nacelles.mystere.titre",
            "modele": "The brake beneath the ash",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.mystere.presentation",
            "modele": "Beneath the main drum, an Ancient Network magnetic brake still modulates every load. Its pulses match the registers showing ash historically displaced toward the outskirts.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.mystere.information",
              "modele": "The housing, power feed and transmission are located: the magnetic brake is now a concrete Covert Target limited to this crossing.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.mystere.variante.standard",
              "modele": "The brass plate bears the same pattern as the reflux curves copied at Lower Watch.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "baliser-frein": {
              "intention": {
                "cle": "evenement.nacelles.mystere.choix.baliser",
                "modele": "Mark the housing and its telltales",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.mystere.choix.baliser.cout",
                  "modele": "Known cost: the Cable Crews will know exactly which infrastructure was designated.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "consigner-frein": {
              "intention": {
                "cle": "evenement.nacelles.mystere.choix.consigner",
                "modele": "Record the brake in the causal Journal",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.mystere.choix.consigner.cout",
                  "modele": "Known cost: the intelligence leaves the technicians’ circle without launching an operation.",
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
      "id": "bassins.nacelles.la-main-sur-le-frein",
      "famille": "consequences-systemiques",
      "themes": [
        "intervention-clandestine",
        "trace-clandestine"
      ],
      "fonction": "transformer-le-frein-revele",
      "fenetre": "relais-des-nacelles",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "relais-des-vannes"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.nacelles.cible-frein-balisee",
              "bassins.nacelles.cible-frein-consignee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 100,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "nacelliers-des-vannes",
        "frein-magnetique-des-nacelles",
        "puits-libres",
        "pelerins-de-cendre"
      ],
      "sourcesInformations": [
        "frein-magnetique-des-nacelles"
      ],
      "faitsLus": [
        "bassins.nacelles.cible-frein-balisee",
        "bassins.nacelles.cible-frein-consignee"
      ],
      "choix": [
        {
          "id": "reparer-publiquement",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -6
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.frein-reaccorde",
              "cible": "nacelliers-des-vannes"
            }
          ]
        },
        {
          "id": "intervenir-clandestinement",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -2
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.frein-transforme-clandestinement",
              "cible": "frein-magnetique-des-nacelles"
            },
            {
              "id": "bassins.nacelles.trace-laiton-persistante",
              "cible": "nacelliers-des-vannes"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "enquete-au-dela-de-la-region",
        "cible": "nacelliers-des-vannes"
      },
      "recuperation": {
        "type": "reparation-publique-toujours-disponible"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.nacelles.la-main-sur-le-frein",
        "fichier": "/api/commercial/assets/nacelles-trace.webp",
        "octetsTransferes": 143524,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une main gantée hésite au-dessus du frein magnétique ouvert tandis que de la limaille de laiton brillante tombe sur un tissu de relevé.",
          "en": "A gloved hand hesitates above the open magnetic brake while bright brass filings fall onto a survey cloth."
        },
        "provenance": {
          "fiche": "docs/assets/nacelles-trace.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "No external input image; generated from the written Nacelles systemic-consequence brief.",
          "prompt": "Create a single 16:9 narrative event illustration matching the established “Les Lanternes de Cendre” painterly dieselpunk concept-art style. Close narrative scene: an open ancient cableway magnetic brake inside a worn industrial relay; a gloved hand hesitates above the exact mechanism while bright brass filings fall onto a dark survey cloth, leaving an unmistakable persistent trace. In the background, two cable crews wait in tense silhouette, making the ethical choice between public repair and covert alteration legible without melodrama. Muted charcoal, ash beige, oxidized copper, controlled amber task light; materially plausible machinery, strong value contrast, sober and morally tense. No text, no letters, no logos, no UI, no watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "c9b0b18fa91eb93a818c638e9648e47f4ebde3f6504f403c5b8cd4942b8afc32",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.nacelles.systeme.origine",
            "modele": "Frein magnétique des Nacelles",
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
            "cle": "evenement.nacelles.systeme.titre",
            "modele": "La main sur le frein",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.systeme.presentation",
            "modele": "La Cible révélée peut être réparée au grand jour ou transformée sans consentement pour rendre les charges impossibles à discriminer. L’opération cachée toucherait une infrastructure précise et laisserait une enquête possible.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.systeme.information",
              "modele": "Toute ouverture du boîtier disperse une limaille de laiton identifiable ; elle survivra au changement de Région comme Trace clandestine.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.systeme.variante.standard",
              "modele": "Le capot reste ouvert devant vous ; la différence entre réparation et intervention cachée est explicite.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "reparer-publiquement": {
              "intention": {
                "cle": "evenement.nacelles.systeme.choix.reparer",
                "modele": "Réaccorder publiquement le frein",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.systeme.choix.reparer.cout",
                  "modele": "Coût connu : 6 Matériaux et un accord public des Nacelliers.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "intervenir-clandestinement": {
              "intention": {
                "cle": "evenement.nacelles.systeme.choix.clandestin",
                "modele": "Transformer clandestinement le frein révélé",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.systeme.choix.clandestin.cout",
                  "modele": "Coût connu : 2 Matériaux ; une Trace persistante pourra nourrir doute, accusation ou preuve.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.nacelles.systeme.origine",
            "modele": "Cableway Magnetic Brake",
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
            "cle": "evenement.nacelles.systeme.titre",
            "modele": "A hand on the brake",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.systeme.presentation",
            "modele": "The revealed Target can be repaired openly or altered without consent so loads can no longer be discriminated. The hidden operation would affect a precise infrastructure and leave room for an investigation.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.systeme.information",
              "modele": "Opening the housing scatters identifiable brass filings; they will survive the regional transition as a Covert Trace.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.systeme.variante.standard",
              "modele": "The housing remains open before you; the difference between repair and hidden intervention is explicit.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "reparer-publiquement": {
              "intention": {
                "cle": "evenement.nacelles.systeme.choix.reparer",
                "modele": "Retune the brake publicly",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.systeme.choix.reparer.cout",
                  "modele": "Known cost: 6 Materials and the Cable Crews’ public agreement.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "intervenir-clandestinement": {
              "intention": {
                "cle": "evenement.nacelles.systeme.choix.clandestin",
                "modele": "Covertly alter the revealed brake",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.systeme.choix.clandestin.cout",
                  "modele": "Known cost: 2 Materials; a persistent Trace may later support doubt, accusation or proof.",
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
      "id": "bassins.nacelles.deux-voix-dans-le-cable",
      "famille": "histoires-de-compagnons",
      "themes": [
        "ilyana-voss",
        "maelys-rive",
        "conseil-des-vannes"
      ],
      "fonction": "preparer-une-option-du-conseil",
      "fenetre": "relais-des-nacelles",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "relais-des-vannes"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.nacelles.frein-reaccorde",
              "bassins.nacelles.frein-transforme-clandestinement"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 90,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ilyana-voss",
        "maelys-rive",
        "nacelliers-des-vannes"
      ],
      "sourcesInformations": [
        "ilyana-voss",
        "maelys-rive"
      ],
      "faitsLus": [
        "bassins.nacelles.frein-reaccorde",
        "bassins.nacelles.frein-transforme-clandestinement"
      ],
      "choix": [
        {
          "id": "porter-passage-partage",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.conseil-passage-partage",
              "cible": "ilyana-voss"
            }
          ]
        },
        {
          "id": "porter-maintenance-commune",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.nacelles.conseil-maintenance-commune",
              "cible": "maelys-rive"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "nacelliers-des-vannes"
      },
      "recuperation": {
        "type": "deux-voix-non-obligatoires"
      },
      "variantes": [
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.nacelles.deux-voix-dans-le-cable",
        "fichier": "/api/commercial/assets/nacelles-compagnes.webp",
        "octetsTransferes": 197294,
        "contientTexte": false,
        "alternatives": {
          "fr": "Ilyana et Maëlys se tiennent sur une passerelle de nacelles, l’une avec un registre et l’autre avec un coffret de relevés, face aux câbles tendus vers les deux rives.",
          "en": "Ilyana and Maëlys stand on a cableway footbridge, one holding a register and the other a survey case, facing cables stretched toward both banks."
        },
        "provenance": {
          "fiche": "docs/assets/nacelles-compagnes.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "No external input image; generated from the written Ilyana Voss and Maëlys Rive companion-story brief.",
          "prompt": "Create a single 16:9 narrative event illustration matching the established “Les Lanternes de Cendre” painterly dieselpunk concept-art style. Scene on a high cableway relay footbridge over ash basins: two competent women stand side by side but retain distinct roles—an older dark-haired steward named Ilyana holds an open water-sharing register, while a younger field engineer named Maëlys carries a compact weathered survey case. They face heavy cables stretching toward two different settlement banks and calmly compare proposals; cable crews work behind them. No heroic pose, no romance, no authority tableau: collaborative disagreement and practical trust. Muted charcoal, ash beige, oxidized copper, restrained amber beacon light; windblown ash, strong readable silhouettes and value contrast. No text, no legible writing, no letters, no logos, no UI, no watermark.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "0b2531363f5f561118a8a656ce36d331d960f204c0c7165ad83f61a7b6363d9b",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.nacelles.compagnons.origine",
            "modele": "Passerelle du Relais",
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
            "cle": "evenement.nacelles.compagnons.titre",
            "modele": "Deux voix dans le câble",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.compagnons.presentation",
            "modele": "Ilyana Voss défend un registre commun des passages ; Maëlys Rive veut que les équipes capables d’entretenir les câbles circulent entre les Colonies. Elles formulent deux options compatibles avec les faits acquis, sans réclamer d’autorité personnelle.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.compagnons.information.ilyana",
              "modele": "Ilyana relie la proposition de passage partagé aux engagements hydriques pris à Haut-Puits.",
              "variables": [],
              "valeurs": {}
            },
            {
              "cle": "evenement.nacelles.compagnons.information.maelys",
              "modele": "Maëlys relie la maintenance commune au devenir de la Cohorte et aux techniciens de Veille-Basse.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.compagnons.variante.standard",
              "modele": "Les deux Compagnes parlent depuis des rives différentes, puis nouent leurs propositions au même câble.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "porter-passage-partage": {
              "intention": {
                "cle": "evenement.nacelles.compagnons.choix.partage",
                "modele": "Porter le passage partagé au Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.compagnons.choix.partage.cout",
                  "modele": "Coût connu : les priorités de passage devront rester publiques et contestables.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "porter-maintenance-commune": {
              "intention": {
                "cle": "evenement.nacelles.compagnons.choix.maintenance",
                "modele": "Porter la maintenance commune au Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.compagnons.choix.maintenance.cout",
                  "modele": "Coût connu : chaque Colonie cédera périodiquement une équipe au Relais.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.nacelles.compagnons.origine",
            "modele": "Relay footbridge",
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
            "cle": "evenement.nacelles.compagnons.titre",
            "modele": "Two voices in the cable",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.nacelles.compagnons.presentation",
            "modele": "Ilyana Voss argues for a shared crossing register; Maëlys Rive wants crews able to maintain the cables to move between Colonies. They frame two options compatible with established facts without claiming personal authority.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.nacelles.compagnons.information.ilyana",
              "modele": "Ilyana links the shared-crossing proposal to the water commitments made at High Well.",
              "variables": [],
              "valeurs": {}
            },
            {
              "cle": "evenement.nacelles.compagnons.information.maelys",
              "modele": "Maëlys links common maintenance to the Cohort’s fate and Lower Watch’s technicians.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "standard": {
              "cle": "evenement.nacelles.compagnons.variante.standard",
              "modele": "The two Companions speak from different banks, then knot their proposals to the same cable.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "porter-passage-partage": {
              "intention": {
                "cle": "evenement.nacelles.compagnons.choix.partage",
                "modele": "Bring shared passage before the Sluice Council",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.compagnons.choix.partage.cout",
                  "modele": "Known cost: crossing priorities must remain public and open to challenge.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "porter-maintenance-commune": {
              "intention": {
                "cle": "evenement.nacelles.compagnons.choix.maintenance",
                "modele": "Bring common maintenance before the Sluice Council",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.nacelles.compagnons.choix.maintenance.cout",
                  "modele": "Known cost: each Colony will periodically assign one crew to the Relay.",
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
      "id": "bassins.deversoir.la-conduite-zero",
      "famille": "mystere-des-phares",
      "themes": [
        "ligne-zero",
        "memoire-industrielle"
      ],
      "fonction": "reveler-la-ligne-zero-dans-les-bassins",
      "fenetre": "deversoir-noir",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "deversoir-noir"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 120,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "techniciens-du-deversoir",
        "equipes-entretien"
      ],
      "sourcesInformations": [
        "techniciens-du-deversoir"
      ],
      "faitsLus": [
        "prologue.harmonique-consignee",
        "prologue.signal-etouffe"
      ],
      "choix": [
        {
          "id": "relever-interface",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.ligne-zero-relevee",
              "cible": "conduite-de-la-ligne-zero"
            }
          ]
        },
        {
          "id": "preserver-conduite",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.ligne-zero-preservee",
              "cible": "conduite-de-la-ligne-zero"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "renseignement-trame-de-fer",
        "cible": "conduite-de-la-ligne-zero"
      },
      "recuperation": {
        "type": "interface-conservee"
      },
      "variantes": [
        {
          "id": "harmonique-reconnue",
          "condition": {
            "type": "fait-present",
            "fait": "prologue.harmonique-consignee"
          }
        },
        {
          "id": "signal-perdu",
          "condition": {
            "type": "fait-present",
            "fait": "prologue.signal-etouffe"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.deversoir.la-conduite-zero",
        "fichier": "/api/commercial/assets/deversoir-ligne-zero.webp",
        "octetsTransferes": 293810,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une dalle fendue révèle une conduite circulaire ancienne sous les bassins de cendre, entourée de techniciens qui en relèvent les repères.",
          "en": "A cracked slab reveals an ancient circular conduit beneath ash basins while technicians survey its markings."
        },
        "provenance": {
          "fiche": "docs/assets/deversoir-ligne-zero.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "The repository Cité-Caravane illustration was supplied only as a visual world and style reference.",
          "prompt": "Generate a wide narrative-game environment illustration of the Déversoir Noir: a cracked settling basin whose broken wall reveals the buried Ligne Zéro maintenance conduit and its circular mobile-lighthouse docking interface, inspected by cable crews under an ash storm. Match the elevated oblique painterly-industrial direction, charcoal palette and restrained amber light of the supplied world reference. No readable text, typography, logos, watermark, weapons or UI.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "e267303bf7451cbdb4bc82e28d23cef13992994231d7c836b9bfd39cba2f3c82",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.deversoir.ligne-zero.origine",
            "modele": "Sous les dalles du Déversoir Noir",
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
            "cle": "evenement.deversoir.ligne-zero.titre",
            "modele": "La conduite zéro",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.ligne-zero.presentation",
            "modele": "Une dalle rompue découvre un conduit annulaire du Réseau ancien. Ses repères décrivent la première Ligne Zéro lisible : un service enfoui qui file déjà vers la Trame de Fer.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.ligne-zero.information",
              "modele": "Les techniciens isolent une interface encore exploitable. Son relevé donnera une avance concrète sur les accès de la prochaine Région.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "harmonique-reconnue": {
              "cle": "evenement.deversoir.ligne-zero.variante.harmonique",
              "modele": "L’harmonique consignée au départ réapparaît dans les repères de maintenance.",
              "variables": [],
              "valeurs": {}
            },
            "signal-perdu": {
              "cle": "evenement.deversoir.ligne-zero.variante.signal",
              "modele": "Le signal étouffé au départ manque dans la séquence ; l’interface indique précisément cette lacune.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.ligne-zero.variante.standard",
              "modele": "Les repères alternent ventilation, délestage et accès de service.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "relever-interface": {
              "intention": {
                "cle": "evenement.deversoir.ligne-zero.choix.relever",
                "modele": "Relever l’interface avant de refermer la dalle",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.ligne-zero.choix.relever.cout",
                  "modele": "Coût connu : le relevé sera public et le Déversoir saura ce que vous emportez.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "preserver-conduite": {
              "intention": {
                "cle": "evenement.deversoir.ligne-zero.choix.poumon",
                "modele": "Préserver la conduite comme poumon des Bassins",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.ligne-zero.choix.poumon.cout",
                  "modele": "Coût connu : aucun démontage ne renforcera le convoi avant le passage.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.deversoir.ligne-zero.origine",
            "modele": "Beneath the Black Spillway slabs",
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
            "cle": "evenement.deversoir.ligne-zero.titre",
            "modele": "The Zero Conduit",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.ligne-zero.presentation",
            "modele": "A broken slab exposes an annular Ancient Network conduit. Its markings describe the first legible Zero Line: a buried service route already running toward the Iron Weave.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.ligne-zero.information",
              "modele": "The technicians isolate a usable interface. Surveying it will provide concrete intelligence on the next Region’s access points.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "harmonique-reconnue": {
              "cle": "evenement.deversoir.ligne-zero.variante.harmonique",
              "modele": "The harmonic recorded at departure returns among the maintenance marks.",
              "variables": [],
              "valeurs": {}
            },
            "signal-perdu": {
              "cle": "evenement.deversoir.ligne-zero.variante.signal",
              "modele": "The signal smothered at departure is missing from the sequence; the interface identifies the gap.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.ligne-zero.variante.standard",
              "modele": "The markings alternate ventilation, load shedding and service access.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "relever-interface": {
              "intention": {
                "cle": "evenement.deversoir.ligne-zero.choix.relever",
                "modele": "Survey the interface before closing the slab",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.ligne-zero.choix.relever.cout",
                  "modele": "Known cost: the survey will be public and the Spillway will know what you carry.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "preserver-conduite": {
              "intention": {
                "cle": "evenement.deversoir.ligne-zero.choix.poumon",
                "modele": "Preserve the conduit as the Basins’ lung",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.ligne-zero.choix.poumon.cout",
                  "modele": "Known cost: no dismantled part will reinforce the convoy before passage.",
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
      "id": "bassins.deversoir.la-tempete-aux-vannes",
      "famille": "conflits-regionaux",
      "themes": [
        "partage-de-leau",
        "cohortes",
        "contrainte"
      ],
      "fonction": "convoquer-le-conseil-des-vannes",
      "fenetre": "deversoir-noir",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "deversoir-noir"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.deversoir.ligne-zero-relevee",
              "bassins.deversoir.ligne-zero-preservee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "puits-libres",
        "pelerins-de-cendre",
        "habitants-haut-puits",
        "habitants-veille-basse"
      ],
      "sourcesInformations": [
        "techniciens-du-deversoir"
      ],
      "faitsLus": [
        "bassins.deversoir.ligne-zero-relevee",
        "bassins.deversoir.ligne-zero-preservee",
        "veille-basse.intervention-refusee",
        "bassins.nacelles.conseil-passage-partage",
        "bassins.nacelles.conseil-maintenance-commune"
      ],
      "choix": [
        {
          "id": "convoquer-delegations",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.conseil-convoque",
              "cible": "conseil-des-vannes"
            }
          ]
        },
        {
          "id": "publier-comptes",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.conseil-public",
              "cible": "conseil-des-vannes"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "conseil-des-vannes",
        "cible": "conseil-des-vannes"
      },
      "recuperation": {
        "type": "contrainte-explicite-toujours-disponible"
      },
      "variantes": [
        {
          "id": "maintenance-commune",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.nacelles.conseil-maintenance-commune"
          }
        },
        {
          "id": "accord-des-nacelles",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.nacelles.conseil-passage-partage"
          }
        },
        {
          "id": "veille-abandonnee",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.intervention-refusee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.deversoir.la-tempete-aux-vannes",
        "fichier": "/api/commercial/assets/deversoir-conseil.webp",
        "octetsTransferes": 402590,
        "contientTexte": false,
        "alternatives": {
          "fr": "Quatre délégations entourent une table mécanique ronde pendant qu’une tempête de cendre frappe les vannes du Déversoir Noir.",
          "en": "Four delegations surround a round mechanical table while an ash storm strikes the Black Spillway sluices."
        },
        "provenance": {
          "fiche": "docs/assets/deversoir-conseil.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "The repository Cité-Caravane illustration was supplied only as a visual world and style reference.",
          "prompt": "Generate a wide narrative-game illustration of the Conseil des Vannes during an ash storm, with delegates around a mechanical sluice table and four physically legible courses of action: shared cistern valves, settler repair parts, sealed refugee frames and a chained coercive gate. Match the supplied world reference without copying it. No readable text, typography, logos, watermark, weapons or UI.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "b887ca0bc7a20f5a2eb820e7b019617d5fdfc87d5b46078beaff35a47b5da22a",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.deversoir.tempete.origine",
            "modele": "Table des Vannes",
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
            "cle": "evenement.deversoir.tempete.titre",
            "modele": "La tempête aux vannes",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.tempete.presentation",
            "modele": "La cendre sature les filtres de Veille-Basse tandis que Haut-Puits garde les dernières réserves claires. Les délégations réclament une règle commune avant l’ouverture du passage.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.tempete.information",
              "modele": "Le partage, la réparation du décanteur et la réorientation de la Cohorte ne seront proposés que si vos décisions antérieures les rendent réels. La contrainte restera explicite.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "maintenance-commune": {
              "cle": "evenement.deversoir.tempete.variante.maintenance",
              "modele": "La maintenance commune portée depuis les Nacelles garantit déjà des équipes au Relais ; chaque Colonie devra désormais honorer cette obligation.",
              "variables": [],
              "valeurs": {}
            },
            "accord-des-nacelles": {
              "cle": "evenement.deversoir.tempete.variante.accord",
              "modele": "L’accord porté depuis les Nacelles fournit déjà une procédure de passage contestable.",
              "variables": [],
              "valeurs": {}
            },
            "veille-abandonnee": {
              "cle": "evenement.deversoir.tempete.variante.perte",
              "modele": "Le refus de Veille-Basse revient sous la forme d’un filtre vide et d’une délégation sans équipe.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.tempete.variante.standard",
              "modele": "Chaque siège correspond à une réserve, une dette ou une absence vérifiable.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "convoquer-delegations": {
              "intention": {
                "cle": "evenement.deversoir.tempete.choix.delegations",
                "modele": "Convoquer chaque délégation autour de la table",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.tempete.choix.delegations.cout",
                  "modele": "Coût connu : les Colonies entendront aussi les options qu’elles refusent.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "publier-comptes": {
              "intention": {
                "cle": "evenement.deversoir.tempete.choix.comptes",
                "modele": "Publier les réserves et les pertes avant de siéger",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.tempete.choix.comptes.cout",
                  "modele": "Coût connu : aucun camp ne pourra dissimuler sa fragilité après le Conseil.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.deversoir.tempete.origine",
            "modele": "Sluice Table",
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
            "cle": "evenement.deversoir.tempete.titre",
            "modele": "The storm at the sluices",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.tempete.presentation",
            "modele": "Ash clogs Lower Watch’s filters while High Well holds the last clear reserves. The delegations demand a common rule before the passage opens.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.tempete.information",
              "modele": "Sharing, repairing the settler and redirecting the Cohort will appear only when earlier decisions make them real. Coercion will remain explicit.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "maintenance-commune": {
              "cle": "evenement.deversoir.tempete.variante.maintenance",
              "modele": "The common maintenance pledge carried from the Cableways already guarantees crews at the Relay; each Colony must now honor that obligation.",
              "variables": [],
              "valeurs": {}
            },
            "accord-des-nacelles": {
              "cle": "evenement.deversoir.tempete.variante.accord",
              "modele": "The agreement carried from the Cableways already supplies a challengeable crossing procedure.",
              "variables": [],
              "valeurs": {}
            },
            "veille-abandonnee": {
              "cle": "evenement.deversoir.tempete.variante.perte",
              "modele": "Lower Watch’s refusal returns as an empty filter and a delegation without a crew.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.tempete.variante.standard",
              "modele": "Every seat corresponds to a verifiable reserve, debt or absence.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "convoquer-delegations": {
              "intention": {
                "cle": "evenement.deversoir.tempete.choix.delegations",
                "modele": "Summon every delegation around the table",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.tempete.choix.delegations.cout",
                  "modele": "Known cost: the Colonies will also hear the options they reject.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "publier-comptes": {
              "intention": {
                "cle": "evenement.deversoir.tempete.choix.comptes",
                "modele": "Publish reserves and losses before sitting",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.tempete.choix.comptes.cout",
                  "modele": "Known cost: neither camp can conceal its fragility after the Council.",
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
      "id": "bassins.deversoir.le-chassis-des-bassins",
      "famille": "consequences-systemiques",
      "themes": [
        "transformation-du-convoi",
        "dette-regionale"
      ],
      "fonction": "inscrire-la-transformation-regionale",
      "fenetre": "deversoir-noir",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "deversoir-noir"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.conseil.reserves-partagees",
              "bassins.conseil.decanteur-repare",
              "bassins.conseil.cohorte-reorientee",
              "bassins.conseil.vannes-contraintes"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 100,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "equipes-entretien",
        "cohorte-du-sillon"
      ],
      "sourcesInformations": [
        "equipes-entretien"
      ],
      "faitsLus": [
        "bassins.conseil.reserves-partagees",
        "bassins.conseil.decanteur-repare",
        "bassins.conseil.cohorte-reorientee",
        "bassins.conseil.vannes-contraintes"
      ],
      "choix": [
        {
          "id": "sceller-transformation",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -12
            }
          ],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.transformation-scellee",
              "cible": "chassis-regional-des-bassins"
            }
          ]
        },
        {
          "id": "conserver-gabarits",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.gabarits-conserves",
              "cible": "chassis-regional-des-bassins"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "projet-regional-persistant",
        "cible": "chassis-regional-des-bassins"
      },
      "recuperation": {
        "type": "plans-non-choisis-conserves"
      },
      "variantes": [
        {
          "id": "decanteur",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.conseil.decanteur-repare"
          }
        },
        {
          "id": "arche",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.conseil.cohorte-reorientee"
          }
        },
        {
          "id": "sans-transformation",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.deversoir.le-chassis-des-bassins",
        "fichier": "/api/commercial/assets/deversoir-chassis.webp",
        "octetsTransferes": 408904,
        "contientTexte": false,
        "alternatives": {
          "fr": "Un vaste châssis roulant reçoit des éléments de décanteur et d’arche dans un atelier de cendre éclairé par des lanternes.",
          "en": "A vast rolling frame receives settler and ark components in an ash workshop lit by lanterns."
        },
        "provenance": {
          "fiche": "docs/assets/deversoir-chassis.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "The repository Cité-Caravane illustration was supplied only as a visual world and style reference.",
          "prompt": "Generate a wide narrative-game worksite illustration where one finite regional chassis is committed either to a travelling settling apparatus or to sealed Ark frames for displaced people, with unchosen plans preserved nearby. Match the supplied elevated oblique painterly-industrial world reference. No readable text, typography, logos, watermark, weapons or UI.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "38f5768f518bfad2617a2b1c1c7c60a76250078c880e8dd20c507e8c1f5ec7b5",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.deversoir.chassis.origine",
            "modele": "Atelier du Déversoir",
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
            "cle": "evenement.deversoir.chassis.titre",
            "modele": "Le châssis des Bassins",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.chassis.presentation",
            "modele": "Les ateliers traduisent la décision du Conseil en bâtis transportables. Le décanteur ou l’arche deviendra une transformation majeure du convoi, jamais une réponse finale à la Trame.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.chassis.information",
              "modele": "Les plans écartés restent lisibles : ils pourront revenir dans un rapport, une dette ou une autre construction.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "decanteur": {
              "cle": "evenement.deversoir.chassis.variante.decanteur",
              "modele": "Les bras du vieux décanteur dessinent une purification mobile à l’échelle du convoi.",
              "variables": [],
              "valeurs": {}
            },
            "arche": {
              "cle": "evenement.deversoir.chassis.variante.arche",
              "modele": "Les membrures de l’Arche réservent des travées aux déplacés et à leurs métiers.",
              "variables": [],
              "valeurs": {}
            },
            "sans-transformation": {
              "cle": "evenement.deversoir.chassis.variante.aucune",
              "modele": "Aucun grand projet n’a été choisi ; le châssis conserve plusieurs attaches incompatibles.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "sceller-transformation": {
              "intention": {
                "cle": "evenement.deversoir.chassis.choix.sceller",
                "modele": "Sceller la transformation retenue dans le châssis",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.chassis.choix.sceller.cout",
                  "modele": "Coût connu : 12 Matériaux et le châssis entier ; cette forme suivra durablement le convoi et limitera ses remplacements.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "conserver-gabarits": {
              "intention": {
                "cle": "evenement.deversoir.chassis.choix.gabarits",
                "modele": "Clore le châssis en Plateforme standard et conserver les gabarits",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.chassis.choix.gabarits.cout",
                  "modele": "Coût connu : le châssis gagne trois Emplacements ordinaires mais renonce à porter un Projet majeur dans cette Région.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.deversoir.chassis.origine",
            "modele": "Spillway Workshop",
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
            "cle": "evenement.deversoir.chassis.titre",
            "modele": "The Basins’ frame",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.chassis.presentation",
            "modele": "The workshops translate the Council’s decision into transportable frames. The settler or the Ark will become a major convoy transformation, never a final answer to the Iron Weave.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.chassis.information",
              "modele": "Rejected plans remain legible: they can return in a report, a debt or another construction.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "decanteur": {
              "cle": "evenement.deversoir.chassis.variante.decanteur",
              "modele": "The old settler’s arms outline mobile purification at convoy scale.",
              "variables": [],
              "valeurs": {}
            },
            "arche": {
              "cle": "evenement.deversoir.chassis.variante.arche",
              "modele": "The Ark’s ribs reserve bays for displaced people and their trades.",
              "variables": [],
              "valeurs": {}
            },
            "sans-transformation": {
              "cle": "evenement.deversoir.chassis.variante.aucune",
              "modele": "No major project was chosen; the frame keeps several incompatible fittings.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "sceller-transformation": {
              "intention": {
                "cle": "evenement.deversoir.chassis.choix.sceller",
                "modele": "Seal the chosen transformation into the frame",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.chassis.choix.sceller.cout",
                  "modele": "Known cost: 12 Materials and the whole chassis; this shape will follow the convoy and restrict later replacements.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "conserver-gabarits": {
              "intention": {
                "cle": "evenement.deversoir.chassis.choix.gabarits",
                "modele": "Close the chassis as a Standard Platform and preserve the templates",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.chassis.choix.gabarits.cout",
                  "modele": "Known cost: the chassis gains three ordinary Slots but gives up carrying a Major Project in this Region.",
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
      "id": "bassins.deversoir.le-passage-sans-retour",
      "famille": "consequences-systemiques",
      "themes": [
        "passage-de-region",
        "memoire-des-lieux"
      ],
      "fonction": "preparer-le-passage-de-region",
      "fenetre": "deversoir-noir",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "deversoir-noir"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "bassins.deversoir.transformation-scellee",
              "bassins.deversoir.gabarits-conserves"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 780,
        "fin": 2147483647
      },
      "priorite": 90,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "techniciens-du-deversoir",
        "habitants-haut-puits",
        "habitants-veille-basse"
      ],
      "sourcesInformations": [
        "techniciens-du-deversoir"
      ],
      "faitsLus": [
        "bassins.deversoir.transformation-scellee",
        "bassins.deversoir.gabarits-conserves",
        "bassins.haut-puits.ilyana-garante",
        "veille-basse.maelys-mission-confiee"
      ],
      "choix": [
        {
          "id": "consigner-abandons",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.passage-prepare",
              "cible": "passage-vers-la-trame"
            }
          ]
        },
        {
          "id": "transmettre-registres",
          "effets": [],
          "faitsProduits": [
            {
              "id": "bassins.deversoir.passage-transmis",
              "cible": "passage-vers-la-trame"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "retours-de-region",
        "cible": "habitants-des-bassins"
      },
      "recuperation": {
        "type": "rapports-et-epilogue"
      },
      "variantes": [
        {
          "id": "haut-puits-quitte",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.haut-puits.ilyana-garante"
          }
        },
        {
          "id": "veille-basse-quitte",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.maelys-mission-confiee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "bassins.deversoir.le-passage-sans-retour",
        "fichier": "/api/commercial/assets/deversoir-passage.webp",
        "octetsTransferes": 320722,
        "contientTexte": false,
        "alternatives": {
          "fr": "Un convoi entre dans un corridor de métal tandis qu’une porte se ferme derrière lui et que des registres des lieux quittés restent visibles.",
          "en": "A convoy enters a metal corridor as a gate closes behind it, with registers of the abandoned places still visible."
        },
        "provenance": {
          "fiche": "docs/assets/deversoir-passage.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "illustration-story",
          "entree": "The repository Cité-Caravane illustration was supplied only as a visual world and style reference.",
          "prompt": "Generate a wide narrative-game illustration of the irreversible Passage de région: the Cité-Caravane enters a buried Ligne Zéro corridor while the ash Front closes behind, with physical lantern tokens recalling High Well, Lower Watch, the cable gondolas and the black sluice. Match the supplied world reference. No readable text, typography, logos, watermark, weapons or UI.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "34038892ac53eb9a5b22b9d41f3ba1787c29cda98097beb5dd2c175955df1aa4",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.deversoir.passage.origine",
            "modele": "Seuil de la Trame de Fer",
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
            "cle": "evenement.deversoir.passage.titre",
            "modele": "Le passage sans retour",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.passage.presentation",
            "modele": "Les accès arrière du Déversoir seront condamnés dès l’engagement du convoi. Avant de quitter les Bassins, le Conseil nomme les lieux abandonnés, les colonies fragilisées et les occasions encore ouvertes.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.passage.information",
              "modele": "Le Journal gardera ces absences comme causes disponibles pour les rapports et l’épilogue ; le passage de Région, lui, ne sera pas annulable.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "haut-puits-quitte": {
              "cle": "evenement.deversoir.passage.variante.haut-puits",
              "modele": "Haut-Puits garde une garante et un pacte dont les effets survivront à votre départ.",
              "variables": [],
              "valeurs": {}
            },
            "veille-basse-quitte": {
              "cle": "evenement.deversoir.passage.variante.veille-basse",
              "modele": "Veille-Basse garde la mission de Maëlys et les équipes dont vous avez fixé la priorité.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.passage.variante.standard",
              "modele": "Les deux Colonies apparaissent dans le registre, y compris par leurs refus et leurs places vides.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-abandons": {
              "intention": {
                "cle": "evenement.deversoir.passage.choix.consigner",
                "modele": "Consigner chaque abandon et chaque occasion",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.passage.choix.consigner.cout",
                  "modele": "Coût connu : le convoi emporte une dette publique envers les lieux quittés.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "transmettre-registres": {
              "intention": {
                "cle": "evenement.deversoir.passage.choix.transmettre",
                "modele": "Transmettre les registres aux habitants qui restent",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.passage.choix.transmettre.cout",
                  "modele": "Coût connu : les Bassins conserveront leurs propres preuves et pourront contester votre récit.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.deversoir.passage.origine",
            "modele": "Threshold of the Iron Weave",
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
            "cle": "evenement.deversoir.passage.titre",
            "modele": "The passage without return",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.deversoir.passage.presentation",
            "modele": "The Spillway’s rear accesses will be condemned once the convoy commits. Before leaving the Basins, the Council names the abandoned places, weakened Colonies and still-open opportunities.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.deversoir.passage.information",
              "modele": "The Journal will retain these absences as causes for reports and the epilogue; the regional passage itself cannot be undone.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "haut-puits-quitte": {
              "cle": "evenement.deversoir.passage.variante.haut-puits",
              "modele": "High Well keeps a guarantor and a pact whose effects survive your departure.",
              "variables": [],
              "valeurs": {}
            },
            "veille-basse-quitte": {
              "cle": "evenement.deversoir.passage.variante.veille-basse",
              "modele": "Lower Watch keeps Maëlys’s mission and the crews whose priority you set.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.deversoir.passage.variante.standard",
              "modele": "Both Colonies appear in the register, including through refusals and empty places.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "consigner-abandons": {
              "intention": {
                "cle": "evenement.deversoir.passage.choix.consigner",
                "modele": "Record every abandonment and opportunity",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.passage.choix.consigner.cout",
                  "modele": "Known cost: the convoy carries a public debt to the places it leaves.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "transmettre-registres": {
              "intention": {
                "cle": "evenement.deversoir.passage.choix.transmettre",
                "modele": "Hand the registers to the people who remain",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.deversoir.passage.choix.transmettre.cout",
                  "modele": "Known cost: the Basins retain their own evidence and can challenge your account.",
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
      "id": "trame.barriere-neuve.le-permis-des-essieux",
      "famille": "conflits-regionaux",
      "themes": [
        "permis",
        "circulation",
        "republique-du-rail"
      ],
      "fonction": "nommer-le-droit-de-circuler",
      "fenetre": "barriere-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "barriere-neuve"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 150,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "douaniers-du-rail",
        "republique-du-rail"
      ],
      "sourcesInformations": [
        "douaniers-du-rail"
      ],
      "faitsLus": [
        "bassins.deversoir.ligne-zero-relevee"
      ],
      "choix": [
        {
          "id": "prendre-permis",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.barriere-neuve.permis-republicain",
              "cible": "barriere-neuve"
            }
          ]
        },
        {
          "id": "demander-droit-local",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.barriere-neuve.droit-local-conteste",
              "cible": "barriere-neuve"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "controle-des-voies",
        "cible": "barriere-neuve"
      },
      "recuperation": {
        "type": "permis-ou-contournement"
      },
      "variantes": [
        {
          "id": "ligne-zero",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.deversoir.ligne-zero-relevee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.barriere-neuve.le-permis-des-essieux",
        "fichier": "/api/commercial/assets/trame-barriere-permis.webp",
        "octetsTransferes": 133270,
        "contientTexte": false,
        "alternatives": {
          "fr": "La Cité-caravane attend sous le portique de Barrière-Neuve tandis que des contrôleurs inspectent ses essieux.",
          "en": "The caravan-city waits beneath New Barrier’s gantry while inspectors examine its axles."
        },
        "provenance": {
          "fiche": "docs/assets/trame-barriere-permis.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established oblique industrial art direction.",
          "prompt": "Barrière-Neuve axle checkpoint in an ash-covered industrial rail corridor, where customs crews inspect the caravan-city's many mobile platforms under a massive iron gantry. Painterly cinematic game concept art, grounded industrial realism, wide 16:9 establishing view from an oblique elevated angle, cold ash daylight cut by warm amber lanterns. No text, letters, numbers, logos, watermark, foregrounded weapons or modern vehicles.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "0f75eaf191fec9cf8e94663f83e3896f64fd420597988fcac0dacc6abc8e2a14",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.trame.permis.origine",
            "modele": "Contrôle des essieux de Barrière-Neuve",
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
            "cle": "evenement.trame.permis.titre",
            "modele": "Le permis des essieux",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.permis.presentation",
            "modele": "La République du Rail ouvre la voie lourde à condition d’inscrire chaque Plateforme, chaque charge et chaque passage dans son registre.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.permis.information",
              "modele": "Le permis n’est pas une réputation : il nomme un droit de circulation révocable et les obligations qui lui sont attachées.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.trame.permis.variante.ligne-zero",
              "modele": "Le relevé de la Ligne Zéro prouve que ce corridor précédait la République, sans abolir son contrôle actuel.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.permis.variante.standard",
              "modele": "Les portiques pèsent le convoi avant d’ouvrir une seule voie.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "prendre-permis": {
              "intention": {
                "cle": "evenement.trame.permis.choix.permis",
                "modele": "Prendre le permis républicain",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.permis.choix.permis.cout",
                  "modele": "Coût connu : un Engagement de circulation donnera aux contrôleurs le droit d’inspecter le convoi.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "demander-droit-local": {
              "intention": {
                "cle": "evenement.trame.permis.choix.local",
                "modele": "Faire reconnaître le droit local des ateliers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.permis.choix.local.cout",
                  "modele": "Coût connu : le passage restera contesté jusqu’à Grand-Aiguillage.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.trame.permis.origine",
            "modele": "New Barrier axle control",
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
            "cle": "evenement.trame.permis.titre",
            "modele": "The axle permit",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.permis.presentation",
            "modele": "The Rail Republic opens the heavy route only if every Platform, load and passage is entered in its register.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.permis.information",
              "modele": "The permit is not reputation: it names a revocable circulation right and its attached obligations.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.trame.permis.variante.ligne-zero",
              "modele": "The Zero Line survey proves this corridor predates the Republic without abolishing its current control.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.permis.variante.standard",
              "modele": "The gantries weigh the convoy before opening a single route.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "prendre-permis": {
              "intention": {
                "cle": "evenement.trame.permis.choix.permis",
                "modele": "Take the republican permit",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.permis.choix.permis.cout",
                  "modele": "Known cost: a circulation Commitment grants inspectors the right to inspect the convoy.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "demander-droit-local": {
              "intention": {
                "cle": "evenement.trame.permis.choix.local",
                "modele": "Demand recognition of the workshops’ local right",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.permis.choix.local.cout",
                  "modele": "Known cost: passage remains contested until Grand Junction.",
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
      "id": "trame.barriere-neuve.la-taxe-des-lanternes",
      "famille": "conflits-regionaux",
      "themes": [
        "taxes",
        "requisitions",
        "services-lourds"
      ],
      "fonction": "transformer-la-taxe-en-engagement",
      "fenetre": "barriere-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "barriere-neuve"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.barriere-neuve.permis-republicain",
              "trame.barriere-neuve.droit-local-conteste"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 140,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "douaniers-du-rail",
        "republique-du-rail"
      ],
      "sourcesInformations": [
        "douaniers-du-rail"
      ],
      "faitsLus": [
        "trame.barriere-neuve.permis-republicain",
        "trame.barriere-neuve.droit-local-conteste"
      ],
      "choix": [
        {
          "id": "payer-taxe",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "combustible",
              "valeur": -3
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.barriere-neuve.taxe-des-lanternes",
              "cible": "republique-du-rail"
            }
          ]
        },
        {
          "id": "accepter-requisition",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.barriere-neuve.priorite-aux-requisitions",
              "cible": "republique-du-rail"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "engagement-republicain",
        "cible": "grand-aiguillage"
      },
      "recuperation": {
        "type": "dette-nommee"
      },
      "variantes": [
        {
          "id": "permis",
          "condition": {
            "type": "fait-present",
            "fait": "trame.barriere-neuve.permis-republicain"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.barriere-neuve.la-taxe-des-lanternes",
        "fichier": "/api/commercial/assets/trame-barriere-taxe.webp",
        "octetsTransferes": 136682,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des fûts de combustible et des caisses de matériaux sont pesés à la guérite des taxes devant le convoi.",
          "en": "Fuel drums and material crates are weighed at the tax booth before the convoy."
        },
        "provenance": {
          "fiche": "docs/assets/trame-barriere-taxe.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established oblique industrial art direction.",
          "prompt": "The lantern tax booth at Barrière-Neuve, with fuel canisters and structural materials weighed beside a registry mechanism while the caravan-city waits. Painterly cinematic game concept art, grounded industrial realism, wide 16:9 oblique elevated view, warm booth lanterns against dim metallic haze. No text, letters, numbers, logos, watermark or foregrounded weapons.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "bf36f074c30b6b0068a2c0164de024dd5ab66052cb9205bf79c1b36ac5c6a30b",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.trame.taxe.origine",
            "modele": "Guérite des taxes de Barrière-Neuve",
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
            "cle": "evenement.trame.taxe.titre",
            "modele": "La taxe des lanternes",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.taxe.presentation",
            "modele": "Le tarif peut être payé en combustible ou converti en priorité de réquisition pour les ateliers républicains.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.taxe.information",
              "modele": "Chaque option produit un Engagement nommé, consultable et contestable ; aucune jauge de réputation ne le remplace.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "permis": {
              "cle": "evenement.trame.taxe.variante.permis",
              "modele": "Le permis déjà signé transforme la taxe en clause publique du passage.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.taxe.variante.standard",
              "modele": "Sans registre commun, chaque essieu peut être immobilisé séparément.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "payer-taxe": {
              "intention": {
                "cle": "evenement.trame.taxe.choix.payer",
                "modele": "Acquitter la taxe en combustible",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.taxe.choix.payer.cout",
                  "modele": "Coût connu : 3 Combustible ; la circulation reste transactionnelle.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "accepter-requisition": {
              "intention": {
                "cle": "evenement.trame.taxe.choix.requisition",
                "modele": "Accorder une priorité de réquisition",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.taxe.choix.requisition.cout",
                  "modele": "Coût connu : un Engagement donne priorité aux ateliers républicains lors du prochain service lourd.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.trame.taxe.origine",
            "modele": "New Barrier tax booth",
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
            "cle": "evenement.trame.taxe.titre",
            "modele": "The lantern tax",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.taxe.presentation",
            "modele": "The tariff can be paid in fuel or converted into requisition priority for republican workshops.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.taxe.information",
              "modele": "Each option creates a named, consultable and challengeable Commitment; no reputation gauge replaces it.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "permis": {
              "cle": "evenement.trame.taxe.variante.permis",
              "modele": "The signed permit makes the tax a public clause of passage.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.taxe.variante.standard",
              "modele": "Without a shared register, each axle can be detained separately.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "payer-taxe": {
              "intention": {
                "cle": "evenement.trame.taxe.choix.payer",
                "modele": "Pay the tax in fuel",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.taxe.choix.payer.cout",
                  "modele": "Known cost: 3 Fuel; circulation remains transactional.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "accepter-requisition": {
              "intention": {
                "cle": "evenement.trame.taxe.choix.requisition",
                "modele": "Grant requisition priority",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.taxe.choix.requisition.cout",
                  "modele": "Known cost: a Commitment gives republican workshops priority during the next heavy service.",
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
      "id": "trame.grand-aiguillage.la-piece-sans-serie",
      "famille": "mystere-des-phares",
      "themes": [
        "ligne-zero",
        "piece-de-regulation",
        "maintenance"
      ],
      "fonction": "reveler-la-piece-de-regulation",
      "fenetre": "grand-aiguillage",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "grand-aiguillage"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.barriere-neuve.taxe-des-lanternes",
              "trame.barriere-neuve.priorite-aux-requisitions"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 130,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "aiguilleurs",
        "ateliers-grand-aiguillage"
      ],
      "sourcesInformations": [
        "aiguilleurs"
      ],
      "faitsLus": [
        "trame.barriere-neuve.taxe-des-lanternes",
        "trame.barriere-neuve.priorite-aux-requisitions"
      ],
      "choix": [
        {
          "id": "appeler-train-outil",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.train-outil-annonce",
              "cible": "piece-de-regulation"
            }
          ]
        },
        {
          "id": "ouvrir-reparation-locale",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.reparation-locale-ouverte",
              "cible": "piece-de-regulation"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "acces-piece-regulation",
        "cible": "piece-de-regulation"
      },
      "recuperation": {
        "type": "voies-alternatives"
      },
      "variantes": [
        {
          "id": "requisition",
          "condition": {
            "type": "fait-present",
            "fait": "trame.barriere-neuve.priorite-aux-requisitions"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.grand-aiguillage.la-piece-sans-serie",
        "fichier": "/api/commercial/assets/trame-piece-regulation.webp",
        "octetsTransferes": 180788,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une vaste bague de régulation ancienne se dresse dans les ateliers ferroviaires de Grand-Aiguillage.",
          "en": "A vast ancient regulation ring stands inside Grand Junction’s railway workshops."
        },
        "provenance": {
          "fiche": "docs/assets/trame-piece-regulation.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established oblique industrial art direction.",
          "prompt": "An unnumbered ancient regulation ring compatible with a mobile lighthouse core revealed inside Grand-Aiguillage's vast heavy workshop. Painterly cinematic game concept art, grounded industrial realism, mysterious pre-apocalypse technology, wide 16:9 oblique elevated view, cool diffuse workshop light and amber inspection lamps. No text, letters, numbers, logos, watermark, glowing runes or weapons.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "55183d51ad02a7b0b08fe2cd1c82f911b36b7d4a96bf240a4a3f279b5e6f6ab8",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.trame.piece.origine",
            "modele": "Hall des régulateurs de Grand-Aiguillage",
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
            "cle": "evenement.trame.piece.titre",
            "modele": "La pièce sans série",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.piece.presentation",
            "modele": "Une bague de régulation compatible avec le cœur mobile dort dans un bâti ancien, mais ni la République ni les ateliers locaux ne peuvent seuls la remettre en service.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.piece.information",
              "modele": "Le Train-outil peut l’usiner sous contrôle républicain ; les ateliers peuvent ouvrir une réparation locale plus lente sans imposer ce monopole.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "requisition": {
              "cle": "evenement.trame.piece.variante.requisition",
              "modele": "La priorité déjà consentie place le Train-outil en tête de la file, mais rend sa dette immédiatement exigible.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.piece.variante.standard",
              "modele": "Les traces d’usure prouvent que plusieurs ateliers ont déjà tenté la réparation.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "appeler-train-outil": {
              "intention": {
                "cle": "evenement.trame.piece.choix.train",
                "modele": "Appeler le Train-outil de la Ligne Zéro",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.piece.choix.train.cout",
                  "modele": "Coût connu : un Engagement de service lourd et 2 créneaux d’atelier seront dus à la République.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-reparation-locale": {
              "intention": {
                "cle": "evenement.trame.piece.choix.locale",
                "modele": "Ouvrir la réparation aux ateliers locaux",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.piece.choix.locale.cout",
                  "modele": "Coût connu : 2 services lourds resteront mobilisés et l’eau de refroidissement devra être assurée.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.trame.piece.origine",
            "modele": "Grand Junction regulator hall",
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
            "cle": "evenement.trame.piece.titre",
            "modele": "The unnumbered part",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.piece.presentation",
            "modele": "A regulation ring compatible with the mobile core lies in an ancient cradle, but neither the Republic nor local workshops can restore it alone.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.piece.information",
              "modele": "The Tool Train can machine it under republican control; the workshops can open a slower local repair without imposing that monopoly.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "requisition": {
              "cle": "evenement.trame.piece.variante.requisition",
              "modele": "Existing priority places the Tool Train first in line but makes its debt immediately due.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.piece.variante.standard",
              "modele": "Wear marks prove several workshops have already attempted the repair.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "appeler-train-outil": {
              "intention": {
                "cle": "evenement.trame.piece.choix.train",
                "modele": "Call the Zero Line Tool Train",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.piece.choix.train.cout",
                  "modele": "Known cost: a heavy-service Commitment and 2 workshop slots will be owed to the Republic.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-reparation-locale": {
              "intention": {
                "cle": "evenement.trame.piece.choix.locale",
                "modele": "Open the repair to local workshops",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.piece.choix.locale.cout",
                  "modele": "Known cost: 2 heavy services remain committed and cooling water must be secured.",
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
      "id": "trame.grand-aiguillage.l-eau-des-machines",
      "famille": "consequences-systemiques",
      "themes": [
        "eau-de-refroidissement",
        "marche",
        "services-lourds"
      ],
      "fonction": "rendre-la-dependance-materielle",
      "fenetre": "grand-aiguillage",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "grand-aiguillage"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.grand-aiguillage.train-outil-annonce",
              "trame.grand-aiguillage.reparation-locale-ouverte"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 120,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ateliers-grand-aiguillage",
        "habitants-grand-aiguillage"
      ],
      "sourcesInformations": [
        "ateliers-grand-aiguillage"
      ],
      "faitsLus": [
        "trame.grand-aiguillage.train-outil-annonce",
        "trame.grand-aiguillage.reparation-locale-ouverte"
      ],
      "choix": [
        {
          "id": "acheter-refroidissement",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "eau",
              "valeur": -8
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.refroidissement-securise",
              "cible": "grand-aiguillage"
            }
          ]
        },
        {
          "id": "rationner-refroidissement",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.refroidissement-rationne",
              "cible": "grand-aiguillage"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "usure-des-ateliers",
        "cible": "grand-aiguillage"
      },
      "recuperation": {
        "type": "service-lourd-reduit"
      },
      "variantes": [
        {
          "id": "locale",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.reparation-locale-ouverte"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.grand-aiguillage.l-eau-des-machines",
        "fichier": "/api/commercial/assets/trame-eau-machines.webp",
        "octetsTransferes": 137210,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des réservoirs presque vides alimentent les tours lourds fumants de Grand-Aiguillage.",
          "en": "Nearly empty tanks feed Grand Junction’s steaming heavy lathes."
        },
        "provenance": {
          "fiche": "docs/assets/trame-eau-machines.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established oblique industrial art direction.",
          "prompt": "Grand-Aiguillage's heavy workshop cooling system at the edge of failure, with low cisterns feeding steaming lathes while residents and machinists ration water. Painterly cinematic game concept art, grounded industrial realism, wide 16:9 oblique elevated view showing the relationship between scarce water and heavy services, furnace glow softened by gray ash daylight. No text, letters, numbers, logos, watermark, explosion or foregrounded weapons.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "5f9e8cac790b8aed4b537ab24dc60f8ed97cf4ce12bef69263c1663e97725085",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.trame.eau.origine",
            "modele": "Circuit de refroidissement de Grand-Aiguillage",
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
            "cle": "evenement.trame.eau.titre",
            "modele": "L’eau des machines",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.eau.presentation",
            "modele": "Les tours lourds chauffent plus vite que les réservoirs ne se remplissent. Le Marché ne dispose que de deux services et d’une seule réserve de refroidissement.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.eau.information",
              "modele": "Acheter l’eau sécurise les machines ; rationner préserve le convoi mais encadre les réquisitions et ralentit l’atelier.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "locale": {
              "cle": "evenement.trame.eau.variante.locale",
              "modele": "La réparation locale accepte ce rythme réduit pour conserver son autonomie.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.eau.variante.standard",
              "modele": "Les contremaîtres attendent une règle avant de relancer les tours.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-refroidissement": {
              "intention": {
                "cle": "evenement.trame.eau.choix.acheter",
                "modele": "Fournir 8 Eau aux circuits",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.eau.choix.acheter.cout",
                  "modele": "Coût connu : 8 Eau ; la réserve de refroidissement est consommée.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "rationner-refroidissement": {
              "intention": {
                "cle": "evenement.trame.eau.choix.rationner",
                "modele": "Rationner les tours et encadrer les réquisitions",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.eau.choix.rationner.cout",
                  "modele": "Coût connu : aucun stock immédiat, mais un seul service lourd pourra fonctionner à la fois.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.trame.eau.origine",
            "modele": "Grand Junction cooling circuit",
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
            "cle": "evenement.trame.eau.titre",
            "modele": "Water for the machines",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.eau.presentation",
            "modele": "Heavy lathes heat faster than the reservoirs refill. The Market holds only two services and one cooling reserve.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.eau.information",
              "modele": "Buying water secures the machines; rationing preserves the convoy but limits requisitions and slows the workshop.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "locale": {
              "cle": "evenement.trame.eau.variante.locale",
              "modele": "The local repair accepts this reduced pace to preserve its autonomy.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.eau.variante.standard",
              "modele": "The foremen await a rule before restarting the lathes.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-refroidissement": {
              "intention": {
                "cle": "evenement.trame.eau.choix.acheter",
                "modele": "Supply 8 Water to the circuits",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.eau.choix.acheter.cout",
                  "modele": "Known cost: 8 Water; the cooling reserve is consumed.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "rationner-refroidissement": {
              "intention": {
                "cle": "evenement.trame.eau.choix.rationner",
                "modele": "Ration the lathes and limit requisitions",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.eau.choix.rationner.cout",
                  "modele": "Known cost: no immediate stock, but only one heavy service can run at a time.",
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
      "id": "trame.grand-aiguillage.ilyana-et-l-attelage",
      "famille": "histoires-de-compagnons",
      "themes": [
        "ilyana-voss",
        "attelage-federe",
        "autonomie"
      ],
      "fonction": "ouvrir-un-transport-non-monopolistique",
      "fenetre": "grand-aiguillage",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "grand-aiguillage"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.grand-aiguillage.refroidissement-securise",
              "trame.grand-aiguillage.refroidissement-rationne"
            ]
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.grand-aiguillage.train-outil-annonce",
              "trame.grand-aiguillage.reparation-locale-ouverte"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ilyana-voss",
        "attelages-puits-libres"
      ],
      "sourcesInformations": [
        "ilyana-voss"
      ],
      "faitsLus": [
        "trame.grand-aiguillage.train-outil-annonce",
        "trame.grand-aiguillage.reparation-locale-ouverte",
        "trame.grand-aiguillage.refroidissement-securise",
        "trame.grand-aiguillage.refroidissement-rationne",
        "compagnon.ilyana-voss.affectee-intendance"
      ],
      "choix": [
        {
          "id": "former-attelage",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -8
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.attelage-federe-annonce",
              "cible": "piece-de-regulation"
            }
          ]
        },
        {
          "id": "reserver-train-outil",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.grand-aiguillage.train-outil-reserve",
              "cible": "train-outil-ligne-zero"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "transport-piece-regulation",
        "cible": "piece-de-regulation"
      },
      "recuperation": {
        "type": "attelage-ou-train-outil"
      },
      "variantes": [
        {
          "id": "ilyana",
          "condition": {
            "type": "fait-present",
            "fait": "compagnon.ilyana-voss.affectee-intendance"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.grand-aiguillage.ilyana-et-l-attelage",
        "fichier": "/api/commercial/assets/trame-attelage-federe.webp",
        "octetsTransferes": 159398,
        "contientTexte": false,
        "alternatives": {
          "fr": "Ilyana organise plusieurs remorques reliées pour transporter ensemble la grande bague de régulation.",
          "en": "Ilyana organizes several linked trailers to carry the great regulation ring together."
        },
        "provenance": {
          "fiche": "docs/assets/trame-attelage-federe.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established oblique industrial art direction.",
          "prompt": "Ilyana organizing a federated hauler at Grand-Aiguillage so a massive regulation ring can be distributed across several Free Wells trailers instead of one republican locomotive. Painterly cinematic game concept art, grounded industrial realism, wide 16:9 oblique elevated view, hopeful amber lantern light through industrial haze. No text, letters, numbers, logos, watermark, heroic weapon pose or modern truck.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "9ac372ba941e1645495dbf01d8c818e6d04b8ccf3af02af116c15a85a72b70cb",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.trame.attelage.origine",
            "modele": "Quai des attelages de Grand-Aiguillage",
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
            "cle": "evenement.trame.attelage.titre",
            "modele": "Ilyana et l’attelage",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.attelage.presentation",
            "modele": "Ilyana propose de répartir la pièce entre plusieurs remorques des Puits Libres afin qu’aucune locomotive ne puisse confisquer son transport.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.attelage.information",
              "modele": "L’Attelage fédéré coûte des Matériaux et du temps ; le Train-outil reste plus direct mais conserve le contrôle républicain.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ilyana": {
              "cle": "evenement.trame.attelage.variante.ilyana",
              "modele": "Depuis l’Intendance, Ilyana peut garantir la répartition écrite des charges entre les attelages.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.attelage.variante.standard",
              "modele": "Les meneurs locaux exigent que chaque remorque garde un manifeste public.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "former-attelage": {
              "intention": {
                "cle": "evenement.trame.attelage.choix.former",
                "modele": "Former l’Attelage fédéré",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.attelage.choix.former.cout",
                  "modele": "Coût connu : 8 Matériaux ; le transport restera possible sans monopole républicain.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "reserver-train-outil": {
              "intention": {
                "cle": "evenement.trame.attelage.choix.train",
                "modele": "Réserver le Train-outil",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.attelage.choix.train.cout",
                  "modele": "Coût connu : l’Engagement de service lourd réserve la pièce à la voie principale.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.trame.attelage.origine",
            "modele": "Grand Junction haulers’ platform",
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
            "cle": "evenement.trame.attelage.titre",
            "modele": "Ilyana and the hauler",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.trame.attelage.presentation",
            "modele": "Ilyana proposes splitting the part across several Free Wells trailers so no locomotive can confiscate its transport.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.trame.attelage.information",
              "modele": "The Federated Hauler costs Materials and time; the Tool Train is more direct but preserves republican control.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ilyana": {
              "cle": "evenement.trame.attelage.variante.ilyana",
              "modele": "From Stewardship, Ilyana can guarantee the written distribution of loads among haulers.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.trame.attelage.variante.standard",
              "modele": "Local drivers demand a public manifest for every trailer.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "former-attelage": {
              "intention": {
                "cle": "evenement.trame.attelage.choix.former",
                "modele": "Form the Federated Hauler",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.attelage.choix.former.cout",
                  "modele": "Known cost: 8 Materials; transport remains possible without a republican monopoly.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "reserver-train-outil": {
              "intention": {
                "cle": "evenement.trame.attelage.choix.train",
                "modele": "Reserve the Tool Train",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.trame.attelage.choix.train.cout",
                  "modele": "Known cost: the heavy-service Commitment reserves the part for the main route.",
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
      "id": "trame.pompe-neuve.l-embranchement-sans-garde",
      "famille": "conflits-regionaux",
      "themes": [
        "renseignements",
        "autonomie",
        "securite-ferroviaire"
      ],
      "fonction": "opposer-securite-et-autonomie",
      "fenetre": "pompe-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "pompe-neuve"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 150,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "mecaniciens-pompe-neuve",
        "puits-libres"
      ],
      "sourcesInformations": [
        "mecaniciens-pompe-neuve"
      ],
      "faitsLus": [
        "bassins.deversoir.ligne-zero-relevee"
      ],
      "choix": [
        {
          "id": "suivre-balises-libres",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.pompe-neuve.balises-libres-suivies",
              "cible": "pompe-neuve"
            }
          ]
        },
        {
          "id": "faire-verifier-aiguillage",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.pompe-neuve.aiguillage-signale",
              "cible": "republique-du-rail"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "connaissance-de-la-branche",
        "cible": "traverse-libre"
      },
      "recuperation": {
        "type": "balises-ou-signalement"
      },
      "variantes": [
        {
          "id": "ligne-zero",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.deversoir.ligne-zero-relevee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.pompe-neuve.l-embranchement-sans-garde",
        "fichier": "/api/commercial/assets/trame-pompe-renseignement.webp",
        "octetsTransferes": 150848,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des mécaniciens replacent des balises lumineuses autour d’aiguilles rouillées tandis que la voie principale gardée brille au loin.",
          "en": "Mechanics replace luminous markers around rusted switches while the guarded main line glows in the distance."
        },
        "provenance": {
          "fiche": "docs/assets/trame-pompe-renseignement.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "New Pump mechanics replace amber markers around unattended rusted switches while a guarded Rail Republic main line shines in the distance; painterly 16:9 industrial concept art, no text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "a366d3b2b91475c334045a329aecab0e623aa70f40e9b004c95b864f44f82536",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.traverse.renseignement.origine",
            "modele": "Aiguilles sans garde de Pompe-Neuve",
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
            "cle": "evenement.traverse.renseignement.titre",
            "modele": "L’embranchement sans garde",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.renseignement.presentation",
            "modele": "La voie républicaine promet des contrôles et des ponts entretenus. L’embranchement des Puits Libres n’offre que des balises reprises à la main, mais personne n’y exige de permis.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.renseignement.information",
              "modele": "Le dernier relevé autonome confirme un passage dégradé et un détour coûteux ; demander une vérification républicaine rendra cette approche officiellement connue.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.traverse.renseignement.variante.ligne-zero",
              "modele": "Les marques de la Ligne Zéro concordent avec les balises libres sans garantir l’état des rails.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.renseignement.variante.standard",
              "modele": "Les mécaniciens refusent de promettre une sécurité qu’aucune équipe permanente ne peut assurer.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "suivre-balises-libres": {
              "intention": {
                "cle": "evenement.traverse.renseignement.choix.libres",
                "modele": "Suivre les balises des Puits Libres",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.renseignement.choix.libres.cout",
                  "modele": "Coût connu : autonomie préservée, avec une consommation d’Eau plus incertaine.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "faire-verifier-aiguillage": {
              "intention": {
                "cle": "evenement.traverse.renseignement.choix.republique",
                "modele": "Faire vérifier l’aiguillage par un agent du Rail",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.renseignement.choix.republique.cout",
                  "modele": "Coût connu : la République apprend que le convoi emprunte l’embranchement et exige que ses mouvements soient signalés.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.traverse.renseignement.origine",
            "modele": "New Pump unattended switches",
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
            "cle": "evenement.traverse.renseignement.titre",
            "modele": "The unattended branch",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.renseignement.presentation",
            "modele": "The republican route promises inspections and maintained bridges. The Free Wells branch offers only hand-restored markers, but no one demands a permit there.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.renseignement.information",
              "modele": "The last autonomous survey confirms a degraded passage and a costly detour; requesting a republican inspection makes this approach officially known.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.traverse.renseignement.variante.ligne-zero",
              "modele": "The Zero Line markings match the free markers without guaranteeing the rails’ condition.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.renseignement.variante.standard",
              "modele": "The mechanics refuse to promise safety that no permanent crew can guarantee.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "suivre-balises-libres": {
              "intention": {
                "cle": "evenement.traverse.renseignement.choix.libres",
                "modele": "Follow the Free Wells markers",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.renseignement.choix.libres.cout",
                  "modele": "Known cost: autonomy is preserved, with less certain Water consumption.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "faire-verifier-aiguillage": {
              "intention": {
                "cle": "evenement.traverse.renseignement.choix.republique",
                "modele": "Have a Rail agent inspect the switch",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.renseignement.choix.republique.cout",
                  "modele": "Known cost: the Republic learns that the convoy is taking the branch and requires its movements to be reported.",
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
      "id": "trame.pompe-neuve.les-filtres-du-rail",
      "famille": "conflits-regionaux",
      "themes": [
        "filtres",
        "dependance-au-rail",
        "aide"
      ],
      "fonction": "rendre-visible-la-connaissance-de-l-aide",
      "fenetre": "pompe-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "pompe-neuve"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.pompe-neuve.balises-libres-suivies",
              "trame.pompe-neuve.aiguillage-signale"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 140,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "mecaniciens-pompe-neuve",
        "habitants-traverse-libre"
      ],
      "sourcesInformations": [
        "mecaniciens-pompe-neuve"
      ],
      "faitsLus": [
        "trame.pompe-neuve.balises-libres-suivies",
        "trame.pompe-neuve.aiguillage-signale"
      ],
      "choix": [
        {
          "id": "livrer-discretement",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -4
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.pompe-neuve.filtres-livres-discretement",
              "cible": "traverse-libre"
            }
          ]
        },
        {
          "id": "inscrire-livraison",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.pompe-neuve.livraison-inscrite",
              "cible": "republique-du-rail"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "aide-connue-ou-discrete",
        "cible": "traverse-libre"
      },
      "recuperation": {
        "type": "livraison-publique-sans-stock"
      },
      "variantes": [
        {
          "id": "engagement",
          "condition": {
            "type": "fait-present",
            "fait": "trame.pompe-neuve.aiguillage-signale"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.pompe-neuve.les-filtres-du-rail",
        "fichier": "/api/commercial/assets/trame-pompe-filtres.webp",
        "octetsTransferes": 111958,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des filtres cylindriques sont répartis entre un wagon officiel et des chariots bâchés des Puits Libres.",
          "en": "Cylindrical filters are split between an official railcar and tarped Free Wells carts."
        },
        "provenance": {
          "fiche": "docs/assets/trame-pompe-filtres.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "At a soot-dark New Pump depot, cylindrical filters are divided between an official Rail wagon and tarped Free Wells hand carts; painterly 16:9 industrial concept art, no text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "cefb31052cbd41c234e2b1769dd651011f4f3f561d07f944d2476b0349ebdf3c",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.traverse.filtres.origine",
            "modele": "Dépôt de Pompe-Neuve",
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
            "cle": "evenement.traverse.filtres.titre",
            "modele": "Les filtres du rail",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.filtres.presentation",
            "modele": "Traverse-Libre possède l’Eau mais ses filtres et ses remèdes arrivent par des wagons républicains. Un lot bloqué à Pompe-Neuve peut partir sous bâche ou sous manifeste.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.filtres.information",
              "modele": "Une livraison discrète n’altère la relation publique que si elle rompt un Engagement existant ; un manifeste rend l’aide immédiatement connue.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "engagement": {
              "cle": "evenement.traverse.filtres.variante.engagement",
              "modele": "Le contrôle déjà consigné oblige le convoi à signaler ses mouvements ; cacher la livraison romprait cet Engagement.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.filtres.variante.standard",
              "modele": "Sans Engagement antérieur, les bâches peuvent encore passer pour un échange local.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "livrer-discretement": {
              "intention": {
                "cle": "evenement.traverse.filtres.choix.discret",
                "modele": "Transférer les filtres sous les bâches des Puits Libres",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.filtres.choix.discret.cout",
                  "modele": "Coût connu : 4 Matériaux pour reconditionner le lot ; toute clause républicaine existante serait rompue.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "inscrire-livraison": {
              "intention": {
                "cle": "evenement.traverse.filtres.choix.public",
                "modele": "Inscrire la livraison au manifeste du Rail",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.filtres.choix.public.cout",
                  "modele": "Coût connu : aucun stock immédiat, mais l’aide à Traverse-Libre devient publique.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.traverse.filtres.origine",
            "modele": "New Pump depot",
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
            "cle": "evenement.traverse.filtres.titre",
            "modele": "The railway filters",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.filtres.presentation",
            "modele": "Free Crossing holds Water, but its filters and medicine arrive on republican cars. A lot blocked at New Pump can leave under tarps or under a manifest.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.filtres.information",
              "modele": "A discreet delivery changes the public relationship only if it breaks an existing Commitment; a manifest makes the aid immediately known.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "engagement": {
              "cle": "evenement.traverse.filtres.variante.engagement",
              "modele": "The recorded inspection commits the convoy to report its movements; hiding the delivery would break that Commitment.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.filtres.variante.standard",
              "modele": "Without a prior Commitment, the tarps can still pass as a local exchange.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "livrer-discretement": {
              "intention": {
                "cle": "evenement.traverse.filtres.choix.discret",
                "modele": "Move the filters under Free Wells tarps",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.filtres.choix.discret.cout",
                  "modele": "Known cost: 4 Materials to repackage the lot; any existing republican clause would be broken.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "inscrire-livraison": {
              "intention": {
                "cle": "evenement.traverse.filtres.choix.public",
                "modele": "Enter the delivery in the Rail manifest",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.filtres.choix.public.cout",
                  "modele": "Known cost: no immediate stock, but aid to Free Crossing becomes public.",
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
      "id": "trame.traverse-libre.le-reservoir-sous-la-voie",
      "famille": "mystere-des-phares",
      "themes": [
        "ligne-zero",
        "reservoirs",
        "contournement"
      ],
      "fonction": "reveler-le-contournement-hydraulique",
      "fenetre": "pompe-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "pompe-neuve"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.pompe-neuve.filtres-livres-discretement",
              "trame.pompe-neuve.livraison-inscrite"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 130,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "habitants-traverse-libre",
        "reservoirs-traverse-libre"
      ],
      "sourcesInformations": [
        "habitants-traverse-libre"
      ],
      "faitsLus": [
        "bassins.deversoir.ligne-zero-relevee",
        "trame.pompe-neuve.filtres-livres-discretement",
        "trame.pompe-neuve.livraison-inscrite"
      ],
      "choix": [
        {
          "id": "lever-vanne-du-contournement",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.contournement-releve",
              "cible": "contournement-traverse-libre"
            }
          ]
        },
        {
          "id": "preserver-vanne",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.vanne-preservee",
              "cible": "reservoirs-traverse-libre"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "contournement-revele",
        "cible": "traverse-libre"
      },
      "recuperation": {
        "type": "vanne-reversible"
      },
      "variantes": [
        {
          "id": "ligne-zero",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.deversoir.ligne-zero-relevee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.traverse-libre.le-reservoir-sous-la-voie",
        "fichier": "/api/commercial/assets/trame-traverse-reservoir.webp",
        "octetsTransferes": 139780,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une grande vanne ancienne sous un réservoir ouvre sur une galerie sèche marquée par la Ligne Zéro.",
          "en": "A great ancient valve beneath a reservoir opens onto a dry gallery marked by the Zero Line."
        },
        "provenance": {
          "fiche": "docs/assets/trame-traverse-reservoir.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Residents inspect a monumental maintenance valve beneath three reservoirs as it reveals a dry bypass around collapsed rails; painterly 16:9 industrial concept art, no text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "81ab748cfb9b6d4d10197f41dc951a02696294b598f7825c0b16ec3f947c26f8",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.traverse.reservoir.origine",
            "modele": "Plans des galeries à Pompe-Neuve",
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
            "cle": "evenement.traverse.reservoir.titre",
            "modele": "Le réservoir sous la voie",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.reservoir.presentation",
            "modele": "Sous un ancien réservoir, une vanne porte le même profil que la Ligne Zéro. Elle commandait un passage sec contournant autrefois les rails affaissés.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.reservoir.information",
              "modele": "Lever la vanne consomme une réserve mais révèle le contournement ; la préserver garde davantage d’Eau sans effacer le relevé.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.traverse.reservoir.variante.ligne-zero",
              "modele": "Le relevé du Déversoir confirme que cette vanne appartenait au réseau de maintenance de la Ligne Zéro.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.reservoir.variante.standard",
              "modele": "Les habitants ne connaissent que la comptine ouvrière qui décrit son ouverture.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lever-vanne-du-contournement": {
              "intention": {
                "cle": "evenement.traverse.reservoir.choix.lever",
                "modele": "Lever la vanne et relever le passage sec",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.reservoir.choix.lever.cout",
                  "modele": "Coût connu : une des trois réserves d’Eau de Traverse-Libre est mobilisée.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "preserver-vanne": {
              "intention": {
                "cle": "evenement.traverse.reservoir.choix.preserve",
                "modele": "Préserver la vanne et ses joints anciens",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.reservoir.choix.preserve.cout",
                  "modele": "Coût connu : le contournement reste fermé jusqu’à une urgence.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.traverse.reservoir.origine",
            "modele": "Gallery plans at New Pump",
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
            "cle": "evenement.traverse.reservoir.titre",
            "modele": "The reservoir beneath the track",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.reservoir.presentation",
            "modele": "Beneath an old reservoir, a valve bears the same profile as the Zero Line. It once controlled a dry passage around the collapsed rails.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.reservoir.information",
              "modele": "Raising the valve consumes one reserve but reveals the bypass; preserving it keeps more Water without erasing the survey.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.traverse.reservoir.variante.ligne-zero",
              "modele": "The Spillway survey confirms that this valve belonged to the Zero Line maintenance network.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.reservoir.variante.standard",
              "modele": "The inhabitants know only the workers’ rhyme that describes its opening.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lever-vanne-du-contournement": {
              "intention": {
                "cle": "evenement.traverse.reservoir.choix.lever",
                "modele": "Raise the valve and survey the dry passage",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.reservoir.choix.lever.cout",
                  "modele": "Known cost: one of Free Crossing’s three Water reserves is mobilized.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "preserver-vanne": {
              "intention": {
                "cle": "evenement.traverse.reservoir.choix.preserve",
                "modele": "Preserve the valve and its ancient seals",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.reservoir.choix.preserve.cout",
                  "modele": "Known cost: the bypass remains closed until an emergency.",
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
      "id": "trame.traverse-libre.la-galerie-qui-cede",
      "famille": "consequences-systemiques",
      "themes": [
        "route-degradee",
        "dependances",
        "recuperation"
      ],
      "fonction": "garantir-une-issue-couteuse",
      "fenetre": "pompe-neuve",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "pompe-neuve"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.traverse-libre.contournement-releve",
              "trame.traverse-libre.vanne-preservee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 120,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "habitants-traverse-libre",
        "puits-libres"
      ],
      "sourcesInformations": [
        "eclaireurs-puits-libres"
      ],
      "faitsLus": [
        "trame.traverse-libre.contournement-releve",
        "trame.traverse-libre.vanne-preservee"
      ],
      "choix": [
        {
          "id": "etayer-galerie",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -10
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.galerie-etayee",
              "cible": "galerie-des-reservoirs"
            }
          ]
        },
        {
          "id": "ouvrir-contournement",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.contournement-ouvert",
              "cible": "contournement-traverse-libre"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "route-reparee-ou-contournee",
        "cible": "traverse-libre"
      },
      "recuperation": {
        "type": "dette-de-filtres-sans-stock"
      },
      "variantes": [
        {
          "id": "vanne",
          "condition": {
            "type": "fait-present",
            "fait": "trame.traverse-libre.contournement-releve"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.traverse-libre.la-galerie-qui-cede",
        "fichier": "/api/commercial/assets/trame-traverse-galerie.webp",
        "octetsTransferes": 175142,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une galerie ferroviaire s’affaisse devant des équipes qui choisissent entre poser des étais et ouvrir un tunnel de contournement.",
          "en": "A railway gallery collapses before crews choosing between braces and opening a bypass tunnel."
        },
        "provenance": {
          "fiche": "docs/assets/trame-traverse-galerie.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "A railway gallery begins to collapse while one crew prepares braces and another opens a dry piped bypass, showing two costly recovery options; painterly 16:9 industrial concept art, no text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "388d4b27f7f16903ee66ba96bbf7a2c914a6124c5ad6c37578407e4ce8c7237d",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.traverse.galerie.origine",
            "modele": "Poste de surveillance de Pompe-Neuve",
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
            "cle": "evenement.traverse.galerie.titre",
            "modele": "La galerie qui cède",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.galerie.presentation",
            "modele": "L’affaissement annoncé a gagné le dernier rail. Traverse-Libre peut étayer la galerie ou ouvrir son contournement, mais aucune issue n’est gratuite.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.galerie.information",
              "modele": "L’étaiement restaure une liaison précaire ; le contournement évite le rail au prix d’une dette de filtres envers les Puits Libres.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "vanne": {
              "cle": "evenement.traverse.galerie.variante.vanne",
              "modele": "La vanne déjà relevée permet d’ouvrir le passage avant que le plafond ne ferme la galerie.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.galerie.variante.standard",
              "modele": "Il faut briser les scellés préservés pour que le passage serve d’issue.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "etayer-galerie": {
              "intention": {
                "cle": "evenement.traverse.galerie.choix.etayer",
                "modele": "Étayer la Galerie des Réservoirs",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.galerie.choix.etayer.cout",
                  "modele": "Coût connu : 10 Matériaux ; la voie secondaire redevient praticable et sa cause reste consignée.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-contournement": {
              "intention": {
                "cle": "evenement.traverse.galerie.choix.contourner",
                "modele": "Ouvrir le contournement des réservoirs",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.galerie.choix.contourner.cout",
                  "modele": "Coût connu : aucun stock immédiat ; deux futurs lots de filtres seront dus aux Puits Libres.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.traverse.galerie.origine",
            "modele": "New Pump monitoring post",
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
            "cle": "evenement.traverse.galerie.titre",
            "modele": "The yielding gallery",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.galerie.presentation",
            "modele": "The reported collapse has reached the last rail. Free Crossing can shore up the gallery or open its bypass, but neither outcome is free.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.galerie.information",
              "modele": "Shoring restores a precarious link; the bypass avoids the rail at the cost of a filter debt to the Free Wells.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "vanne": {
              "cle": "evenement.traverse.galerie.variante.vanne",
              "modele": "The surveyed valve makes it possible to open the passage before the roof closes the gallery.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.galerie.variante.standard",
              "modele": "The preserved seals must be broken for the passage to serve as an exit.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "etayer-galerie": {
              "intention": {
                "cle": "evenement.traverse.galerie.choix.etayer",
                "modele": "Shore up Reservoir Gallery",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.galerie.choix.etayer.cout",
                  "modele": "Known cost: 10 Materials; the secondary route becomes passable again and its cause remains recorded.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ouvrir-contournement": {
              "intention": {
                "cle": "evenement.traverse.galerie.choix.contourner",
                "modele": "Open the reservoir bypass",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.galerie.choix.contourner.cout",
                  "modele": "Known cost: no immediate stock; two future filter lots will be owed to the Free Wells.",
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
      "id": "trame.traverse-libre.maelys-et-le-manifeste",
      "famille": "histoires-de-compagnons",
      "themes": [
        "maelys-rive",
        "registre",
        "connaissance"
      ],
      "fonction": "choisir-la-trace-politique-de-l-aide",
      "fenetre": "traverse-libre",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "traverse-libre"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.traverse-libre.galerie-etayee",
              "trame.traverse-libre.contournement-ouvert"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "maelys-rive",
        "delegues-puits-libres"
      ],
      "sourcesInformations": [
        "maelys-rive"
      ],
      "faitsLus": [
        "veille-basse.maelys-mission-confiee",
        "trame.traverse-libre.galerie-etayee",
        "trame.traverse-libre.contournement-ouvert"
      ],
      "choix": [
        {
          "id": "publier-manifeste",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.manifeste-public",
              "cible": "republique-du-rail"
            }
          ]
        },
        {
          "id": "sceller-registre",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.traverse-libre.registre-scelle",
              "cible": "delegues-puits-libres"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "aide-attribuable-ou-discrete",
        "cible": "traverse-libre"
      },
      "recuperation": {
        "type": "registre-conserve"
      },
      "variantes": [
        {
          "id": "maelys",
          "condition": {
            "type": "fait-present",
            "fait": "veille-basse.maelys-mission-confiee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.traverse-libre.maelys-et-le-manifeste",
        "fichier": "/api/commercial/assets/trame-traverse-maelys.webp",
        "octetsTransferes": 115390,
        "contientTexte": false,
        "alternatives": {
          "fr": "Maëlys compare un manifeste public et un registre scellé devant les délégués des Puits Libres.",
          "en": "Maëlys compares a public manifest and a sealed register before the Free Wells delegates."
        },
        "provenance": {
          "fiche": "docs/assets/trame-traverse-maelys.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Maëlys compares an open public cargo manifest with a sealed register placed in her instrument case before Free Wells delegates; painterly 16:9 industrial concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "9e3d5d12689026ca351135980f0ab7ff4f0f9d3d66a142a6b2b1dd8d05d7dbcb",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.traverse.maelys.origine",
            "modele": "Salle des registres de Traverse-Libre",
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
            "cle": "evenement.traverse.maelys.titre",
            "modele": "Maëlys et le manifeste",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.maelys.presentation",
            "modele": "Maëlys peut publier chaque caisse et chaque détour, ou sceller le registre dans son coffret. Le premier choix protège les habitants par la preuve ; le second protège l’embranchement par la discrétion.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.maelys.information",
              "modele": "Un registre public rend l’aide attribuable. Un registre scellé ne touche la République que s’il dissimule la rupture d’un Engagement existant.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "maelys": {
              "cle": "evenement.traverse.maelys.variante.maelys",
              "modele": "Le coffret confié depuis Veille-Basse permet à Maëlys de signer chaque relevé sans dépendre d’un bureau du Rail.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.maelys.variante.standard",
              "modele": "Maëlys reconstitue le registre à partir des marques de caisse et des témoins de la galerie.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "publier-manifeste": {
              "intention": {
                "cle": "evenement.traverse.maelys.choix.public",
                "modele": "Publier le manifeste de Traverse-Libre",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.maelys.choix.public.cout",
                  "modele": "Coût connu : l’aide devient opposable et immédiatement connue de la République.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "sceller-registre": {
              "intention": {
                "cle": "evenement.traverse.maelys.choix.sceller",
                "modele": "Sceller le registre dans le coffret de Maëlys",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.maelys.choix.sceller.cout",
                  "modele": "Coût connu : les Puits Libres gardent la preuve ; tout Engagement rompu pourra être attribué plus tard.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.traverse.maelys.origine",
            "modele": "Free Crossing records room",
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
            "cle": "evenement.traverse.maelys.titre",
            "modele": "Maëlys and the manifest",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.traverse.maelys.presentation",
            "modele": "Maëlys can publish every crate and detour, or seal the register in her case. The first choice protects inhabitants through proof; the second protects the branch through discretion.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.traverse.maelys.information",
              "modele": "A public register makes the aid attributable. A sealed register affects the Republic only if it conceals a broken Commitment.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "maelys": {
              "cle": "evenement.traverse.maelys.variante.maelys",
              "modele": "The case entrusted since Low Watch lets Maëlys sign every survey without depending on a Rail office.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.traverse.maelys.variante.standard",
              "modele": "Maëlys reconstructs the register from crate marks and gallery witnesses.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "publier-manifeste": {
              "intention": {
                "cle": "evenement.traverse.maelys.choix.public",
                "modele": "Publish the Free Crossing manifest",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.maelys.choix.public.cout",
                  "modele": "Known cost: the aid becomes enforceable and immediately known to the Republic.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "sceller-registre": {
              "intention": {
                "cle": "evenement.traverse.maelys.choix.sceller",
                "modele": "Seal the register in Maëlys’s case",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.traverse.maelys.choix.sceller.cout",
                  "modele": "Known cost: the Free Wells keep the proof; any broken Commitment may be attributed later.",
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
      "id": "trame.marche.les-services-de-la-voie-principale",
      "famille": "conflits-regionaux",
      "themes": [
        "marche-borne",
        "republique-du-rail",
        "piece-de-regulation"
      ],
      "fonction": "confronter-l-offre-officielle-aux-etats-de-grand-aiguillage",
      "fenetre": "marche-des-traverses",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "marche-des-traverses"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 150,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "commis-du-marche",
        "republique-du-rail"
      ],
      "sourcesInformations": [
        "commis-du-marche"
      ],
      "faitsLus": [
        "trame.grand-aiguillage.train-outil-annonce",
        "trame.grand-aiguillage.reparation-locale-ouverte"
      ],
      "choix": [
        {
          "id": "acheter-coupleur-officiel",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "materiaux",
              "valeur": -6
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.marche.coupleur-officiel-acquis",
              "cible": "piece-de-regulation"
            }
          ]
        },
        {
          "id": "ceder-reserve-refroidissement",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "eau",
              "valeur": -8
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.marche.reserve-echangee",
              "cible": "commis-du-marche"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "offre-officielle-epuisee",
        "cible": "marche-des-traverses"
      },
      "recuperation": {
        "type": "deux-moyens-d-echange"
      },
      "variantes": [
        {
          "id": "train-outil",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.train-outil-annonce"
          }
        },
        {
          "id": "ateliers",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.reparation-locale-ouverte"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.marche.les-services-de-la-voie-principale",
        "fichier": "/api/commercial/assets/trame-marche-officiel.webp",
        "octetsTransferes": 146290,
        "contientTexte": false,
        "alternatives": {
          "fr": "Un comptoir ferroviaire pèse un coupleur de régulation entre registres officiels et réservoirs d’eau de refroidissement.",
          "en": "A railway counter weighs a regulation coupler between official registers and cooling-water tanks."
        },
        "provenance": {
          "fiche": "docs/assets/trame-marche-officiel.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Official Sleeper Market counter weighing a regulation coupler between an open register and cooling-water tanks; painterly 16:9 industrial survival concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "8c1895ebd7eab830471ee0563619413321d2409162abe0fe7c282eca9359b120",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.convergence.officiel.origine",
            "modele": "Comptoir officiel du Marché des Traverses",
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
            "cle": "evenement.convergence.officiel.titre",
            "modele": "Les services de la voie principale",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.officiel.presentation",
            "modele": "Le comptoir républicain n’ouvre qu’une fois son registre. Son offre dépend de ce que Grand-Aiguillage a conservé : un coupleur calibré ou une place de service lourd contre une réserve de refroidissement.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.officiel.information",
              "modele": "Les deux moyens d’échange sont bornés et ferment le comptoir ; l’un prépare directement la Pièce, l’autre préserve une capacité d’atelier pour l’Aiguillage Zéro.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "train-outil": {
              "cle": "evenement.convergence.officiel.variante.train",
              "modele": "Le Train-outil annoncé garantit la cote du coupleur, mais lie sa traçabilité aux registres républicains.",
              "variables": [],
              "valeurs": {}
            },
            "ateliers": {
              "cle": "evenement.convergence.officiel.variante.ateliers",
              "modele": "Les ateliers locaux ont transmis une cote compatible que les commis ne peuvent plus monopoliser.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.officiel.variante.standard",
              "modele": "Sans préparation venue de Grand-Aiguillage, les commis facturent surtout leur garantie et leur registre.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-coupleur-officiel": {
              "intention": {
                "cle": "evenement.convergence.officiel.choix.coupleur",
                "modele": "Acheter le coupleur officiel calibré",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.officiel.choix.coupleur.cout",
                  "modele": "Coût connu : 6 Matériaux ; le coupleur devient une option documentée pour la Pièce de régulation.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ceder-reserve-refroidissement": {
              "intention": {
                "cle": "evenement.convergence.officiel.choix.reserve",
                "modele": "Céder une réserve d’Eau de refroidissement",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.officiel.choix.reserve.cout",
                  "modele": "Coût connu : 8 Eau ; un service lourd reste mobilisable sans acheter le coupleur.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.convergence.officiel.origine",
            "modele": "Sleeper Market official counter",
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
            "cle": "evenement.convergence.officiel.titre",
            "modele": "The main route services",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.officiel.presentation",
            "modele": "The republican counter opens its register only once. Its offer depends on what Grand Junction preserved: a calibrated coupler or a heavy-service slot traded for a cooling reserve.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.officiel.information",
              "modele": "Both means of exchange are finite and close the counter; one prepares the Part directly, while the other preserves workshop capacity for Zero Junction.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "train-outil": {
              "cle": "evenement.convergence.officiel.variante.train",
              "modele": "The announced Tool Train guarantees the coupler’s dimensions but ties its traceability to republican registers.",
              "variables": [],
              "valeurs": {}
            },
            "ateliers": {
              "cle": "evenement.convergence.officiel.variante.ateliers",
              "modele": "The local workshops transmitted a compatible dimension that the clerks can no longer monopolize.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.officiel.variante.standard",
              "modele": "Without preparation from Grand Junction, the clerks mostly charge for their guarantee and register.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-coupleur-officiel": {
              "intention": {
                "cle": "evenement.convergence.officiel.choix.coupleur",
                "modele": "Buy the calibrated official coupler",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.officiel.choix.coupleur.cout",
                  "modele": "Known cost: 6 Materials; the coupler becomes a documented option for the Regulation Part.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "ceder-reserve-refroidissement": {
              "intention": {
                "cle": "evenement.convergence.officiel.choix.reserve",
                "modele": "Yield a cooling Water reserve",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.officiel.choix.reserve.cout",
                  "modele": "Known cost: 8 Water; one heavy service remains available without buying the coupler.",
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
      "id": "trame.marche.la-bascule-sans-manifeste",
      "famille": "conflits-regionaux",
      "themes": [
        "marche-borne",
        "puits-libres",
        "intervention-clandestine",
        "trace"
      ],
      "fonction": "rendre-la-clandestinite-concrete-et-attribuable",
      "fenetre": "marche-des-traverses",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "marche-des-traverses"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.marche.coupleur-officiel-acquis",
              "trame.marche.reserve-echangee"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 140,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "porteurs-des-puits-libres",
        "habitants-traverse-libre"
      ],
      "sourcesInformations": [
        "porteurs-des-puits-libres"
      ],
      "faitsLus": [
        "trame.marche.coupleur-officiel-acquis",
        "trame.marche.reserve-echangee",
        "trame.pompe-neuve.filtres-livres-discretement",
        "trame.pompe-neuve.livraison-inscrite"
      ],
      "choix": [
        {
          "id": "acheter-filtres-sans-marque",
          "effets": [
            {
              "type": "stock.modifier",
              "stock": "remedes",
              "valeur": -2
            }
          ],
          "faitsProduits": [
            {
              "id": "trame.marche.filtres-sans-marque-acquis",
              "cible": "traverse-libre"
            }
          ]
        },
        {
          "id": "intervenir-sur-bascule",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.marche.trace-bascule-clandestine",
              "cible": "bascule-des-manifestes"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "trace-attribuable",
        "cible": "bascule-des-manifestes"
      },
      "recuperation": {
        "type": "echange-ou-intervention"
      },
      "variantes": [
        {
          "id": "traverse-aidee",
          "condition": {
            "type": "fait-present",
            "fait": "trame.pompe-neuve.filtres-livres-discretement"
          }
        },
        {
          "id": "traverse-publique",
          "condition": {
            "type": "fait-present",
            "fait": "trame.pompe-neuve.livraison-inscrite"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.marche.la-bascule-sans-manifeste",
        "fichier": "/api/commercial/assets/trame-marche-clandestin.webp",
        "octetsTransferes": 127294,
        "contientTexte": false,
        "alternatives": {
          "fr": "Des porteurs déplacent des filtres sans marque derrière une grande bascule dont la transmission plombée peut être débranchée.",
          "en": "Carriers move unmarked filters behind great scales whose sealed transmission can be disconnected."
        },
        "provenance": {
          "fiche": "docs/assets/trame-marche-clandestin.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Free Wells carriers move unmarked filters behind manifest scales whose sealed copper-wire transmission can be disconnected; painterly 16:9 industrial concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "e09ff691de9ad52e14af96ef174355507cf7ab89a178d1018e31191e3fd316d2",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.convergence.clandestin.origine",
            "modele": "Bascule arrière du Marché des Traverses",
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
            "cle": "evenement.convergence.clandestin.titre",
            "modele": "La bascule sans manifeste",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.clandestin.presentation",
            "modele": "Derrière les travées officielles, les Puits Libres proposent leur dernier lot de filtres sans marque. La Bascule des manifestes peut aussi être débranchée pour soustraire un chargement, mais ses plombs garderont une Trace.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.clandestin.information",
              "modele": "L’Intervention vise la transmission de pesée elle-même : un fil rompu, un plomb déplacé et un horaire suffiront à l’attribuer plus tard.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "traverse-aidee": {
              "cle": "evenement.convergence.clandestin.variante.aidee",
              "modele": "Les bâches déjà passées à Pompe-Neuve donnent aux porteurs une filière discrète, mais pas une seconde offre.",
              "variables": [],
              "valeurs": {}
            },
            "traverse-publique": {
              "cle": "evenement.convergence.clandestin.variante.publique",
              "modele": "Le manifeste public de Traverse-Libre oblige les porteurs à séparer strictement les caisses sans marque.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.clandestin.variante.standard",
              "modele": "Les besoins critiques de Traverse-Libre fixent la valeur du dernier lot bien au-dessus de son poids.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-filtres-sans-marque": {
              "intention": {
                "cle": "evenement.convergence.clandestin.choix.filtres",
                "modele": "Échanger deux doses de Remèdes contre les filtres",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.clandestin.choix.filtres.cout",
                  "modele": "Coût connu : 2 Remèdes ; l’unique lot sans marque rejoint les réserves liées à Traverse-Libre.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "intervenir-sur-bascule": {
              "intention": {
                "cle": "evenement.convergence.clandestin.choix.intervention",
                "modele": "Débrancher la transmission de la Bascule",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.clandestin.choix.intervention.cout",
                  "modele": "Coût connu : aucun stock immédiat ; la transmission concrète est neutralisée et une Trace attribuable demeure sur ses plombs.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.convergence.clandestin.origine",
            "modele": "Sleeper Market rear scales",
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
            "cle": "evenement.convergence.clandestin.titre",
            "modele": "The scales without a manifest",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.clandestin.presentation",
            "modele": "Behind the official aisles, the Free Wells offer their last lot of unmarked filters. The manifest scales can also be disconnected to hide a load, but their seals will retain a Trace.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.clandestin.information",
              "modele": "The Intervention targets the weighing transmission itself: a broken wire, a displaced seal and a timestamp will be enough to attribute it later.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "traverse-aidee": {
              "cle": "evenement.convergence.clandestin.variante.aidee",
              "modele": "The tarps already passed through New Pump give the carriers a discreet channel, but not a second offer.",
              "variables": [],
              "valeurs": {}
            },
            "traverse-publique": {
              "cle": "evenement.convergence.clandestin.variante.publique",
              "modele": "Free Crossing’s public manifest forces the carriers to separate the unmarked crates strictly.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.clandestin.variante.standard",
              "modele": "Free Crossing’s critical needs set the last lot’s value far above its weight.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "acheter-filtres-sans-marque": {
              "intention": {
                "cle": "evenement.convergence.clandestin.choix.filtres",
                "modele": "Trade two Medicine doses for the filters",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.clandestin.choix.filtres.cout",
                  "modele": "Known cost: 2 Medicine; the only unmarked lot joins the reserves linked to Free Crossing.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "intervenir-sur-bascule": {
              "intention": {
                "cle": "evenement.convergence.clandestin.choix.intervention",
                "modele": "Disconnect the scales’ transmission",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.clandestin.choix.intervention.cout",
                  "modele": "Known cost: no immediate stock; the concrete transmission is disabled and an attributable Trace remains on its seals.",
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
      "id": "trame.signal-zero.l-interface-aux-deux-frequences",
      "famille": "mystere-des-phares",
      "themes": [
        "ligne-zero",
        "piece-de-regulation",
        "interface"
      ],
      "fonction": "reveler-la-compatibilite-sans-imposer-d-itineraire",
      "fenetre": "signal-zero",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "signal-zero"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.marche.filtres-sans-marque-acquis",
              "trame.marche.trace-bascule-clandestine"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 130,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "techniciens-signal-zero",
        "ligne-zero"
      ],
      "sourcesInformations": [
        "techniciens-signal-zero"
      ],
      "faitsLus": [
        "trame.marche.filtres-sans-marque-acquis",
        "trame.marche.trace-bascule-clandestine",
        "bassins.deversoir.ligne-zero-relevee"
      ],
      "choix": [
        {
          "id": "lire-frequence-du-rail",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.interface-rail-lue",
              "cible": "interface-de-la-ligne-zero"
            }
          ]
        },
        {
          "id": "lire-frequence-des-puits",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.interface-libre-lue",
              "cible": "interface-de-la-ligne-zero"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "informations-de-regulation",
        "cible": "piece-de-regulation"
      },
      "recuperation": {
        "type": "deux-frequences-compatibles"
      },
      "variantes": [
        {
          "id": "ligne-zero",
          "condition": {
            "type": "fait-present",
            "fait": "bassins.deversoir.ligne-zero-relevee"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.signal-zero.l-interface-aux-deux-frequences",
        "fichier": "/api/commercial/assets/trame-signal-interface.webp",
        "octetsTransferes": 94750,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une console ancienne de la Ligne Zéro affiche deux rythmes lumineux compatibles devant des techniciens du Rail et des Puits Libres.",
          "en": "An ancient Zero Line console displays two compatible light rhythms before Rail and Free Wells technicians."
        },
        "provenance": {
          "fiche": "docs/assets/trame-signal-interface.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Ancient Zero Line console displays two compatible physical signal rhythms to Rail and Free Wells technicians without privileging a route; painterly 16:9 industrial concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "2d726dbf3f1383f945f6041626255c6e437f65a86629fcbf0861670297832edd",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.convergence.interface.origine",
            "modele": "Enclave technique de Signal-Zéro",
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
            "cle": "evenement.convergence.interface.titre",
            "modele": "L’interface aux deux fréquences",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.interface.presentation",
            "modele": "L’interface de la Ligne Zéro accepte la cadence du Rail comme celle des balises libres. Les deux lectures révèlent les cotes de la Pièce de régulation ; aucune ne commande la route à prendre.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.interface.information",
              "modele": "La fréquence républicaine documente le verrouillage lourd ; la fréquence des Puits Libres révèle le dégagement manuel et le contournement.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.convergence.interface.variante.ligne-zero",
              "modele": "Le relevé du Déversoir confirme le même ordre d’impulsions sous une autre enveloppe mécanique.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.interface.variante.standard",
              "modele": "Les techniciens reconnaissent la compatibilité, mais ignorent encore où la première interface fut relevée.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lire-frequence-du-rail": {
              "intention": {
                "cle": "evenement.convergence.interface.choix.rail",
                "modele": "Lire la fréquence calibrée du Rail",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.interface.choix.rail.cout",
                  "modele": "Coût connu : la procédure lourde devient lisible sans accorder de monopole ni engager un itinéraire.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "lire-frequence-des-puits": {
              "intention": {
                "cle": "evenement.convergence.interface.choix.puits",
                "modele": "Lire la fréquence reprise par les Puits Libres",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.interface.choix.puits.cout",
                  "modele": "Coût connu : le dégagement manuel devient lisible sans condamner la voie principale.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.convergence.interface.origine",
            "modele": "Zero Signal technical enclave",
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
            "cle": "evenement.convergence.interface.titre",
            "modele": "The two-frequency interface",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.interface.presentation",
            "modele": "The Zero Line interface accepts both Rail cadence and free-marker cadence. Both readings reveal the Regulation Part’s dimensions; neither commands which route to take.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.interface.information",
              "modele": "The republican frequency documents heavy locking; the Free Wells frequency reveals manual release and the bypass.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "ligne-zero": {
              "cle": "evenement.convergence.interface.variante.ligne-zero",
              "modele": "The Spillway survey confirms the same pulse order beneath a different mechanical casing.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.interface.variante.standard",
              "modele": "The technicians recognize compatibility but do not yet know where the first interface was surveyed.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "lire-frequence-du-rail": {
              "intention": {
                "cle": "evenement.convergence.interface.choix.rail",
                "modele": "Read the Rail’s calibrated frequency",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.interface.choix.rail.cout",
                  "modele": "Known cost: the heavy procedure becomes legible without granting a monopoly or committing to a route.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "lire-frequence-des-puits": {
              "intention": {
                "cle": "evenement.convergence.interface.choix.puits",
                "modele": "Read the frequency restored by the Free Wells",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.interface.choix.puits.cout",
                  "modele": "Known cost: the manual release becomes legible without condemning the main route.",
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
      "id": "trame.signal-zero.les-deux-branches-dans-le-verre",
      "famille": "consequences-systemiques",
      "themes": [
        "echos",
        "grand-aiguillage",
        "traverse-libre",
        "climax"
      ],
      "fonction": "convertir-les-etats-des-branches-en-options-du-climax",
      "fenetre": "signal-zero",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "signal-zero"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.signal-zero.interface-rail-lue",
              "trame.signal-zero.interface-libre-lue"
            ]
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 120,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "techniciens-signal-zero",
        "commis-du-marche"
      ],
      "sourcesInformations": [
        "techniciens-signal-zero"
      ],
      "faitsLus": [
        "trame.signal-zero.interface-rail-lue",
        "trame.signal-zero.interface-libre-lue",
        "trame.grand-aiguillage.train-outil-annonce",
        "trame.grand-aiguillage.reparation-locale-ouverte",
        "trame.grand-aiguillage.attelage-federe-annonce",
        "trame.traverse-libre.galerie-etayee",
        "trame.traverse-libre.contournement-ouvert",
        "trame.traverse-libre.manifeste-public"
      ],
      "choix": [
        {
          "id": "graver-les-deux-branches",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.echos-conserves",
              "cible": "table-de-signal-zero"
            }
          ]
        },
        {
          "id": "isoler-les-frequences",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.frequences-separees",
              "cible": "table-de-signal-zero"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "options-du-climax-modifiees",
        "cible": "aiguillage-zero"
      },
      "recuperation": {
        "type": "memoire-ou-separation"
      },
      "variantes": [
        {
          "id": "train-outil",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.train-outil-annonce"
          }
        },
        {
          "id": "grand-aiguillage",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.reparation-locale-ouverte"
          }
        },
        {
          "id": "attelage-federe",
          "condition": {
            "type": "fait-present",
            "fait": "trame.grand-aiguillage.attelage-federe-annonce"
          }
        },
        {
          "id": "galerie-etayee",
          "condition": {
            "type": "fait-present",
            "fait": "trame.traverse-libre.galerie-etayee"
          }
        },
        {
          "id": "traverse-libre",
          "condition": {
            "type": "fait-present",
            "fait": "trame.traverse-libre.contournement-ouvert"
          }
        },
        {
          "id": "manifeste-public",
          "condition": {
            "type": "fait-present",
            "fait": "trame.traverse-libre.manifeste-public"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.signal-zero.les-deux-branches-dans-le-verre",
        "fichier": "/api/commercial/assets/trame-signal-echo.webp",
        "octetsTransferes": 156238,
        "contientTexte": false,
        "alternatives": {
          "fr": "Une table de verre technique superpose la gare-atelier de Grand-Aiguillage et les galeries de Traverse-Libre avec leurs routes possibles.",
          "en": "A technical glass table overlays Grand Junction’s railway workshop and Free Crossing’s galleries with their possible routes."
        },
        "provenance": {
          "fiche": "docs/assets/trame-signal-echo.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Analog glass plotting table overlays Grand Junction and Free Crossing with prepared and missing links converging toward a central switch; painterly 16:9 industrial concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "bd84a33f788dd2378c92af72484a981709cbfa6757e8e8b5f4ffdf4e8832444e",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.convergence.echos.origine",
            "modele": "Table de verre de Signal-Zéro",
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
            "cle": "evenement.convergence.echos.titre",
            "modele": "Les deux branches dans le verre",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.echos.presentation",
            "modele": "La table restitue Grand-Aiguillage et Traverse-Libre côte à côte : leurs préparatifs, leurs absences et leurs dettes ouvrent des moyens différents d’aborder l’Aiguillage Zéro.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.echos.information",
              "modele": "Train-outil, réparation locale, Attelage fédéré, Galerie étayée, contournement et publicité de l’aide modifient les options ; aucun de ces échos ne choisit encore le climax.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "train-outil": {
              "cle": "evenement.convergence.echos.variante.train",
              "modele": "Le Train-outil apparaît comme une préparation républicaine de la Pièce, avec son monopole et sa dette de service.",
              "variables": [],
              "valeurs": {}
            },
            "grand-aiguillage": {
              "cle": "evenement.convergence.echos.variante.grand",
              "modele": "La cote des ateliers locaux apparaît dans le verre à côté du canal officiel.",
              "variables": [],
              "valeurs": {}
            },
            "attelage-federe": {
              "cle": "evenement.convergence.echos.variante.attelage",
              "modele": "L’Attelage fédéré inscrit dans le verre une variante de transport autonome et réparti.",
              "variables": [],
              "valeurs": {}
            },
            "galerie-etayee": {
              "cle": "evenement.convergence.echos.variante.galerie",
              "modele": "La Galerie étayée réduit le risque du transport sans ouvrir le contournement clandestin.",
              "variables": [],
              "valeurs": {}
            },
            "traverse-libre": {
              "cle": "evenement.convergence.echos.variante.traverse",
              "modele": "Le contournement de Traverse-Libre dessine une sortie que le registre républicain ne contient pas.",
              "variables": [],
              "valeurs": {}
            },
            "manifeste-public": {
              "cle": "evenement.convergence.echos.variante.manifeste",
              "modele": "Le manifeste public de Traverse-Libre fournit une preuve opposable pour une charte partagée.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.echos.variante.standard",
              "modele": "Les lacunes des branches non visitées restent visibles comme des options non préparées, jamais comme des faits inventés.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "graver-les-deux-branches": {
              "intention": {
                "cle": "evenement.convergence.echos.choix.graver",
                "modele": "Graver les deux états sur une même plaque",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.echos.choix.graver.cout",
                  "modele": "Coût connu : les deux Colonies pourront opposer leurs preuves lors du climax régional.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "isoler-les-frequences": {
              "intention": {
                "cle": "evenement.convergence.echos.choix.isoler",
                "modele": "Isoler les fréquences sur deux plaques",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.echos.choix.isoler.cout",
                  "modele": "Coût connu : chaque axe garde son autonomie, mais leurs preuves devront être rapprochées au Conseil.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.convergence.echos.origine",
            "modele": "Zero Signal glass table",
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
            "cle": "evenement.convergence.echos.titre",
            "modele": "Both branches in the glass",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.echos.presentation",
            "modele": "The table restores Grand Junction and Free Crossing side by side: their preparations, absences and debts open different means of approaching Zero Junction.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.echos.information",
              "modele": "Tool Train, local repair, Federated Hauler, shored Gallery, bypass and aid publicity modify the options; none of these echoes chooses the climax yet.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "train-outil": {
              "cle": "evenement.convergence.echos.variante.train",
              "modele": "The Tool Train appears as a republican preparation of the Part, together with its monopoly and service debt.",
              "variables": [],
              "valeurs": {}
            },
            "grand-aiguillage": {
              "cle": "evenement.convergence.echos.variante.grand",
              "modele": "The local workshops’ dimension appears in the glass beside the official channel.",
              "variables": [],
              "valeurs": {}
            },
            "attelage-federe": {
              "cle": "evenement.convergence.echos.variante.attelage",
              "modele": "The Federated Hauler records an autonomous, distributed transport variant in the glass.",
              "variables": [],
              "valeurs": {}
            },
            "galerie-etayee": {
              "cle": "evenement.convergence.echos.variante.galerie",
              "modele": "The Shored Gallery lowers transport risk without opening the clandestine bypass.",
              "variables": [],
              "valeurs": {}
            },
            "traverse-libre": {
              "cle": "evenement.convergence.echos.variante.traverse",
              "modele": "Free Crossing’s bypass draws an exit that the republican register does not contain.",
              "variables": [],
              "valeurs": {}
            },
            "manifeste-public": {
              "cle": "evenement.convergence.echos.variante.manifeste",
              "modele": "Free Crossing’s public manifest provides enforceable evidence for a shared charter.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.echos.variante.standard",
              "modele": "Gaps from unvisited branches remain visible as unprepared options, never as invented facts.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "graver-les-deux-branches": {
              "intention": {
                "cle": "evenement.convergence.echos.choix.graver",
                "modele": "Engrave both states on one plate",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.echos.choix.graver.cout",
                  "modele": "Known cost: both Colonies will be able to present their evidence during the regional climax.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "isoler-les-frequences": {
              "intention": {
                "cle": "evenement.convergence.echos.choix.isoler",
                "modele": "Isolate the frequencies on two plates",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.echos.choix.isoler.cout",
                  "modele": "Known cost: each axis keeps its autonomy, but their evidence must be reconciled at the Council.",
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
      "id": "trame.signal-zero.ilyana-et-la-trace",
      "famille": "histoires-de-compagnons",
      "themes": [
        "ilyana-voss",
        "trace",
        "transmission",
        "attribution"
      ],
      "fonction": "decider-qui-pourra-attribuer-l-intervention",
      "fenetre": "signal-zero",
      "conditions": {
        "requises": [
          {
            "type": "lieu-present",
            "lieu": "signal-zero"
          },
          {
            "type": "un-des-faits-present",
            "faits": [
              "trame.signal-zero.echos-conserves",
              "trame.signal-zero.frequences-separees"
            ]
          },
          {
            "type": "fait-present",
            "fait": "trame.marche.trace-bascule-clandestine"
          }
        ],
        "interdites": []
      },
      "periodeEligibilite": {
        "debut": 1200,
        "fin": 2147483647
      },
      "priorite": 110,
      "epuisement": "unique",
      "acteurs": [
        "porte-lanterne",
        "ilyana-voss",
        "techniciens-signal-zero"
      ],
      "sourcesInformations": [
        "ilyana-voss"
      ],
      "faitsLus": [
        "trame.marche.trace-bascule-clandestine",
        "compagnon.ilyana-voss.affectee-intendance",
        "trame.signal-zero.echos-conserves",
        "trame.signal-zero.frequences-separees"
      ],
      "choix": [
        {
          "id": "confier-trace-a-ilyana",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.trace-sous-scelles",
              "cible": "ilyana-voss"
            }
          ]
        },
        {
          "id": "transmettre-trace-au-signal",
          "effets": [],
          "faitsProduits": [
            {
              "id": "trame.signal-zero.trace-transmise",
              "cible": "techniciens-signal-zero"
            }
          ]
        }
      ],
      "consequenceDifferee": {
        "type": "attribution-future-de-la-trace",
        "cible": "bascule-des-manifestes"
      },
      "recuperation": {
        "type": "preuve-sous-scelles-ou-transmise"
      },
      "variantes": [
        {
          "id": "trace",
          "condition": {
            "type": "fait-present",
            "fait": "trame.marche.trace-bascule-clandestine"
          }
        },
        {
          "id": "intendance",
          "condition": {
            "type": "fait-present",
            "fait": "compagnon.ilyana-voss.affectee-intendance"
          }
        },
        {
          "id": "standard",
          "condition": {
            "type": "toujours"
          }
        }
      ],
      "destinationEcho": "journal-de-campagne",
      "asset": {
        "id": "trame.signal-zero.ilyana-et-la-trace",
        "fichier": "/api/commercial/assets/trame-signal-ilyana.webp",
        "octetsTransferes": 93826,
        "contientTexte": false,
        "alternatives": {
          "fr": "Ilyana tient un fil de transmission rompu et des plombs de registre entre une boîte scellée et le pupitre de Signal-Zéro.",
          "en": "Ilyana holds a broken transmission wire and register seals between a sealed box and the Zero Signal console."
        },
        "provenance": {
          "fiche": "docs/assets/trame-signal-ilyana.provenance.json",
          "creeLe": "2026-07-23",
          "outil": "Codex built-in image_gen",
          "modele": "built-in model (identifier not exposed)",
          "usage": "stylized-concept",
          "entree": "No input image; generated from the project’s established industrial ash-world art direction.",
          "prompt": "Ilyana Voss compares a broken copper transmission wire and displaced seals between an evidence box and the Zero Signal console; painterly 16:9 industrial concept art, no legible text or logos.",
          "droits": "OpenAI Terms of Use — output assigned to the user",
          "empreinteSha256": "e5bd7ec64459699fffc03747a5b06a1ab3829486c6b73697b7964f3acb7259a4",
          "statutApprobation": "pending-pull-request-review",
          "reviseur": null
        }
      },
      "textes": {
        "fr": {
          "origine": {
            "cle": "evenement.convergence.ilyana.origine",
            "modele": "Poste de consignation de Signal-Zéro",
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
            "cle": "evenement.convergence.ilyana.titre",
            "modele": "Ilyana et la Trace",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.ilyana.presentation",
            "modele": "Ilyana peut conserver sous scellés les marques de la Bascule ou les transmettre aux techniciens. La Trace ne disparaît pas : seule change la personne capable de l’attribuer.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.ilyana.information",
              "modele": "Sous scellés, la preuve reste différée ; transmise, elle pourra revenir dès l’Aiguillage Zéro avec son heure, sa cible et ses plombs.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "trace": {
              "cle": "evenement.convergence.ilyana.variante.trace",
              "modele": "Ilyana retrouve sur le fil rompu la même poussière de cuivre que sur les plombs déplacés de la Bascule.",
              "variables": [],
              "valeurs": {}
            },
            "intendance": {
              "cle": "evenement.convergence.ilyana.variante.intendance",
              "modele": "Depuis l’Intendance, Ilyana dispose déjà du registre horaire nécessaire pour sceller la preuve.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.ilyana.variante.standard",
              "modele": "Sans Trace clandestine, Ilyana consigne surtout l’absence de rupture afin d’empêcher une accusation fabriquée.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-trace-a-ilyana": {
              "intention": {
                "cle": "evenement.convergence.ilyana.choix.confier",
                "modele": "Confier les marques à Ilyana sous scellés",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.ilyana.choix.confier.cout",
                  "modele": "Coût connu : l’attribution est différée, mais Ilyana conserve une preuve complète.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "transmettre-trace-au-signal": {
              "intention": {
                "cle": "evenement.convergence.ilyana.choix.transmettre",
                "modele": "Transmettre la Trace aux techniciens de Signal-Zéro",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.ilyana.choix.transmettre.cout",
                  "modele": "Coût connu : la Trace devient immédiatement attribuable par l’enclave technique.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            }
          }
        },
        "en": {
          "origine": {
            "cle": "evenement.convergence.ilyana.origine",
            "modele": "Zero Signal recording post",
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
            "cle": "evenement.convergence.ilyana.titre",
            "modele": "Ilyana and the Trace",
            "variables": [],
            "valeurs": {}
          },
          "presentation": {
            "cle": "evenement.convergence.ilyana.presentation",
            "modele": "Ilyana can keep the scales’ marks under seal or transmit them to the technicians. The Trace does not disappear: only the person able to attribute it changes.",
            "variables": [],
            "valeurs": {}
          },
          "informations": [
            {
              "cle": "evenement.convergence.ilyana.information",
              "modele": "Under seal, the evidence remains deferred; once transmitted, it may return at Zero Junction with its time, target and seals.",
              "variables": [],
              "valeurs": {}
            }
          ],
          "variantes": {
            "trace": {
              "cle": "evenement.convergence.ilyana.variante.trace",
              "modele": "Ilyana finds the same copper dust on the broken wire and the scales’ displaced seals.",
              "variables": [],
              "valeurs": {}
            },
            "intendance": {
              "cle": "evenement.convergence.ilyana.variante.intendance",
              "modele": "From Stewardship, Ilyana already has the hourly register needed to seal the evidence.",
              "variables": [],
              "valeurs": {}
            },
            "standard": {
              "cle": "evenement.convergence.ilyana.variante.standard",
              "modele": "Without a clandestine Trace, Ilyana mainly records the absence of damage to prevent a fabricated accusation.",
              "variables": [],
              "valeurs": {}
            }
          },
          "choix": {
            "confier-trace-a-ilyana": {
              "intention": {
                "cle": "evenement.convergence.ilyana.choix.confier",
                "modele": "Entrust the marks to Ilyana under seal",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.ilyana.choix.confier.cout",
                  "modele": "Known cost: attribution is deferred, but Ilyana retains complete evidence.",
                  "variables": [],
                  "valeurs": {}
                }
              ]
            },
            "transmettre-trace-au-signal": {
              "intention": {
                "cle": "evenement.convergence.ilyana.choix.transmettre",
                "modele": "Transmit the Trace to Zero Signal technicians",
                "variables": [],
                "valeurs": {}
              },
              "coutsConnus": [
                {
                  "cle": "evenement.convergence.ilyana.choix.transmettre.cout",
                  "modele": "Known cost: the Trace becomes immediately attributable by the technical enclave.",
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
  "conseils": [
    {
      "id": "conseil.des-vannes",
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
          "id": "eau-cohorte-et-deversoir",
          "voix": [
            {
              "compagnonId": "ilyana-voss",
              "criteres": [
                "affectation-au-quartier",
                "competence-majeure",
                "competence-secondaire",
                "conviction-concernee"
              ]
            }
          ],
          "decisions": [
            {
              "id": "partager-reserves",
              "faitProduit": "bassins.conseil.reserves-partagees",
              "ouverteParAffectation": false
            },
            {
              "id": "reparer-decanteur",
              "faitProduit": "bassins.conseil.decanteur-repare",
              "ouverteParAffectation": false
            },
            {
              "id": "reorienter-cohorte",
              "faitProduit": "bassins.conseil.cohorte-reorientee",
              "ouverteParAffectation": false
            },
            {
              "id": "contraindre-vannes",
              "faitProduit": "bassins.conseil.vannes-contraintes",
              "ouverteParAffectation": false
            }
          ]
        }
      ],
      "textes": {
        "fr": {
          "titre": {
            "cle": "conseil.des-vannes.titre",
            "modele": "Conseil des Vannes",
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
            "eau-cohorte-et-deversoir": {
              "titre": {
                "cle": "conseil.des-vannes.sujet.titre",
                "modele": "Eau, Cohorte et passage régional",
                "variables": [],
                "valeurs": {}
              },
              "voix": {
                "ilyana-voss": {
                  "faitConnu": {
                    "cle": "conseil.des-vannes.voix.fait-connu",
                    "modele": "Les réserves, le décanteur et la Cohorte ne sont défendables que s’ils ont été préparés dans les Colonies.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "source": {
                    "cle": "conseil.des-vannes.voix.source",
                    "modele": "Registres croisés de Haut-Puits, Veille-Basse et des Nacelles",
                    "variables": [],
                    "valeurs": {}
                  },
                  "dateSource": {
                    "cle": "conseil.des-vannes.voix.date",
                    "modele": "À la tempête du Déversoir Noir",
                    "variables": [],
                    "valeurs": {}
                  },
                  "recommandationMorale": {
                    "cle": "conseil.des-vannes.voix.recommandation",
                    "modele": "Ilyana recommande la seule option soutenue par des faits publics et une responsabilité durable.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "enjeuPersonnel": {
                    "cle": "conseil.des-vannes.voix.enjeu",
                    "modele": "Une décision sans preuve ferait de l’Intendance une autorité sans recours.",
                    "variables": [],
                    "valeurs": {}
                  }
                }
              },
              "decisions": {
                "partager-reserves": {
                  "cle": "conseil.des-vannes.decision.partager",
                  "modele": "Partager les réserves entre les deux Colonies",
                  "variables": [],
                  "valeurs": {}
                },
                "reparer-decanteur": {
                  "cle": "conseil.des-vannes.decision.decanteur",
                  "modele": "Réparer le vieux décanteur comme projet majeur",
                  "variables": [],
                  "valeurs": {}
                },
                "reorienter-cohorte": {
                  "cle": "conseil.des-vannes.decision.cohorte",
                  "modele": "Réorienter la Cohorte vers une Arche de déplacés",
                  "variables": [],
                  "valeurs": {}
                },
                "contraindre-vannes": {
                  "cle": "conseil.des-vannes.decision.contraindre",
                  "modele": "Contraindre les vannes et assumer la coercition",
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
            "bassins.conseil.reserves-partagees": {
              "titre": {
                "cle": "journal.conseil.des-vannes.partager.titre",
                "modele": "Les réserves des deux Colonies ont été mises en partage",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Décision du Conseil des Vannes convoqué par la tempête du Déversoir Noir.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.decanteur-repare": {
              "titre": {
                "cle": "journal.conseil.des-vannes.decanteur.titre",
                "modele": "Le vieux décanteur a été retenu comme transformation du convoi",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Décision du Conseil des Vannes convoqué par la tempête du Déversoir Noir.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.cohorte-reorientee": {
              "titre": {
                "cle": "journal.conseil.des-vannes.cohorte.titre",
                "modele": "La Cohorte a été réorientée vers une Arche de déplacés",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Décision du Conseil des Vannes convoqué par la tempête du Déversoir Noir.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.vannes-contraintes": {
              "titre": {
                "cle": "journal.conseil.des-vannes.contraindre.titre",
                "modele": "Les vannes ont été contraintes au nom du passage",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Décision du Conseil des Vannes convoqué par la tempête du Déversoir Noir.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Conseil des Vannes",
                "variables": [],
                "valeurs": {}
              }
            }
          }
        },
        "en": {
          "titre": {
            "cle": "conseil.des-vannes.titre",
            "modele": "Sluice Council",
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
            "eau-cohorte-et-deversoir": {
              "titre": {
                "cle": "conseil.des-vannes.sujet.titre",
                "modele": "Water, Cohort and regional passage",
                "variables": [],
                "valeurs": {}
              },
              "voix": {
                "ilyana-voss": {
                  "faitConnu": {
                    "cle": "conseil.des-vannes.voix.fait-connu",
                    "modele": "The reserves, settler and Cohort can be defended only if they were prepared in the Colonies.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "source": {
                    "cle": "conseil.des-vannes.voix.source",
                    "modele": "Cross-checked registers from High Well, Lower Watch and the Cableways",
                    "variables": [],
                    "valeurs": {}
                  },
                  "dateSource": {
                    "cle": "conseil.des-vannes.voix.date",
                    "modele": "During the storm at the Black Spillway",
                    "variables": [],
                    "valeurs": {}
                  },
                  "recommandationMorale": {
                    "cle": "conseil.des-vannes.voix.recommandation",
                    "modele": "Ilyana recommends the sole option backed by public facts and durable responsibility.",
                    "variables": [],
                    "valeurs": {}
                  },
                  "enjeuPersonnel": {
                    "cle": "conseil.des-vannes.voix.enjeu",
                    "modele": "A decision without evidence would turn Stewardship into an authority without appeal.",
                    "variables": [],
                    "valeurs": {}
                  }
                }
              },
              "decisions": {
                "partager-reserves": {
                  "cle": "conseil.des-vannes.decision.partager",
                  "modele": "Share the reserves between both Colonies",
                  "variables": [],
                  "valeurs": {}
                },
                "reparer-decanteur": {
                  "cle": "conseil.des-vannes.decision.decanteur",
                  "modele": "Repair the old settler as a major project",
                  "variables": [],
                  "valeurs": {}
                },
                "reorienter-cohorte": {
                  "cle": "conseil.des-vannes.decision.cohorte",
                  "modele": "Redirect the Cohort into an Ark for the displaced",
                  "variables": [],
                  "valeurs": {}
                },
                "contraindre-vannes": {
                  "cle": "conseil.des-vannes.decision.contraindre",
                  "modele": "Force the sluices and own the coercion",
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
            "bassins.conseil.reserves-partagees": {
              "titre": {
                "cle": "journal.conseil.des-vannes.partager.titre",
                "modele": "Both Colonies’ reserves were placed in common",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Decision of the Sluice Council summoned by the Black Spillway storm.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Sluice Council",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.decanteur-repare": {
              "titre": {
                "cle": "journal.conseil.des-vannes.decanteur.titre",
                "modele": "The old settler was chosen as a convoy transformation",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Decision of the Sluice Council summoned by the Black Spillway storm.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Sluice Council",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.cohorte-reorientee": {
              "titre": {
                "cle": "journal.conseil.des-vannes.cohorte.titre",
                "modele": "The Cohort was redirected into an Ark for the displaced",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Decision of the Sluice Council summoned by the Black Spillway storm.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Sluice Council",
                "variables": [],
                "valeurs": {}
              }
            },
            "bassins.conseil.vannes-contraintes": {
              "titre": {
                "cle": "journal.conseil.des-vannes.contraindre.titre",
                "modele": "The sluices were forced in the name of passage",
                "variables": [],
                "valeurs": {}
              },
              "cause": {
                "cle": "journal.conseil.des-vannes.cause",
                "modele": "Decision of the Sluice Council summoned by the Black Spillway storm.",
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
                "cle": "journal.cible.conseil-des-vannes",
                "modele": "Sluice Council",
                "variables": [],
                "valeurs": {}
              }
            }
          }
        }
      }
    }
  ],
  "libellesTransversaux": {
    "fr": {
      "journal": {
        "titres": {
          "bassins.haut-puits.pacte-partage": "Pacte de partage des citernes",
          "bassins.haut-puits.pacte-autonomie": "Autonomie de Haut-Puits garantie",
          "bassins.haut-puits.panache-confine": "Boues du panache confinées",
          "bassins.haut-puits.panache-derive": "Panache dérivé vers le bassin vide",
          "bassins.haut-puits.decanteur-documente": "Décanteur itinérant documenté",
          "bassins.haut-puits.arche-documentee": "Arche des déplacés documentée",
          "bassins.haut-puits.ilyana-garante": "Ilyana garante du registre",
          "bassins.haut-puits.ilyana-contredite": "Arbitrage collectif du registre maintenu",
          "veille-basse.cohorte-accueillie": "Cohorte du Sillon accueillie",
          "veille-basse.cohorte-refusee": "Cohorte du Sillon refusée",
          "veille-basse.cohorte-redirigee": "Cohorte redirigée vers l’Hospice du Sillon",
          "veille-basse.sas-renforce": "Sas de Veille-Basse renforcé",
          "veille-basse.hospice-ouvert": "Volumes de l’Hospice ouverts",
          "veille-basse.intervention-refusee": "Intervention à Veille-Basse refusée",
          "veille-basse.registres-copies": "Registres du reflux copiés",
          "veille-basse.registres-laisses": "Registres confiés à Veille-Basse",
          "veille-basse.maelys-mission-confiee": "Coffret de Maëlys confié au convoi",
          "veille-basse.maelys-equipes-prioritaires": "Équipes de Maëlys maintenues à Veille-Basse",
          "bassins.nacelles.accord-regional": "Contrepoids partagés entre les deux rives",
          "bassins.nacelles.passage-restreint": "Passage des Nacelles réservé",
          "bassins.nacelles.cible-frein-balisee": "Frein magnétique balisé comme Cible clandestine",
          "bassins.nacelles.cible-frein-consignee": "Frein magnétique consigné comme Cible clandestine",
          "bassins.nacelles.frein-reaccorde": "Frein des Nacelles réaccordé publiquement",
          "bassins.nacelles.frein-transforme-clandestinement": "Frein des Nacelles transformé clandestinement",
          "bassins.nacelles.trace-laiton-persistante": "Trace de limaille de laiton persistante",
          "bassins.nacelles.conseil-passage-partage": "Passage partagé préparé pour le Conseil",
          "bassins.nacelles.conseil-maintenance-commune": "Maintenance commune préparée pour le Conseil",
          "bassins.deversoir.ligne-zero-relevee": "L’interface de la Ligne Zéro a été relevée",
          "bassins.deversoir.ligne-zero-preservee": "La conduite de la Ligne Zéro a été préservée",
          "bassins.deversoir.conseil-convoque": "Les délégations ont été convoquées aux Vannes",
          "bassins.deversoir.conseil-public": "Les comptes d’eau ont été rendus publics",
          "bassins.deversoir.transformation-scellee": "La transformation régionale a été scellée",
          "bassins.deversoir.gabarits-conserves": "Les gabarits régionaux ont été conservés",
          "bassins.deversoir.passage-prepare": "Les abandons ont été consignés avant le passage",
          "bassins.deversoir.passage-transmis": "Les registres des Bassins ont été transmis",
          "trame.barriere-neuve.permis-republicain": "Permis républicain de circulation",
          "trame.barriere-neuve.droit-local-conteste": "Droit local de passage contesté",
          "trame.barriere-neuve.taxe-des-lanternes": "Taxe des lanternes acquittée",
          "trame.barriere-neuve.priorite-aux-requisitions": "Priorité consentie aux réquisitions",
          "trame.grand-aiguillage.train-outil-annonce": "Train-outil annoncé pour la pièce de régulation",
          "trame.grand-aiguillage.reparation-locale-ouverte": "Réparation locale ouverte hors monopole",
          "trame.grand-aiguillage.refroidissement-securise": "Refroidissement des ateliers sécurisé",
          "trame.grand-aiguillage.refroidissement-rationne": "Refroidissement des ateliers rationné",
          "trame.grand-aiguillage.attelage-federe-annonce": "Attelage fédéré annoncé",
          "trame.grand-aiguillage.train-outil-reserve": "Train-outil réservé",
          "trame.pompe-neuve.balises-libres-suivies": "Balises autonomes de Pompe-Neuve suivies",
          "trame.pompe-neuve.aiguillage-signale": "Aiguillage de Pompe-Neuve signalé à la République",
          "trame.pompe-neuve.filtres-livres-discretement": "Filtres livrés discrètement à Traverse-Libre",
          "trame.pompe-neuve.livraison-inscrite": "Livraison à Traverse-Libre inscrite au manifeste",
          "trame.traverse-libre.contournement-releve": "Contournement hydraulique relevé",
          "trame.traverse-libre.vanne-preservee": "Vanne ancienne préservée",
          "trame.traverse-libre.galerie-etayee": "Galerie des Réservoirs étayée",
          "trame.traverse-libre.contournement-ouvert": "Contournement de Traverse-Libre ouvert",
          "trame.traverse-libre.manifeste-public": "Aide à Traverse-Libre rendue publique",
          "trame.traverse-libre.registre-scelle": "Registre d’aide scellé",
          "trame.marche.coupleur-officiel-acquis": "Coupleur officiel acquis au Marché",
          "trame.marche.reserve-echangee": "Réserve de refroidissement échangée",
          "trame.marche.filtres-sans-marque-acquis": "Filtres sans marque acquis",
          "trame.marche.trace-bascule-clandestine": "Trace laissée sur la Bascule",
          "trame.signal-zero.interface-rail-lue": "Fréquence républicaine de l’interface lue",
          "trame.signal-zero.interface-libre-lue": "Fréquence libre de l’interface lue",
          "trame.signal-zero.echos-conserves": "Échos des deux branches conservés",
          "trame.signal-zero.frequences-separees": "Fréquences de Signal-Zéro séparées",
          "trame.signal-zero.trace-sous-scelles": "Trace confiée à Ilyana sous scellés",
          "trame.signal-zero.trace-transmise": "Trace transmise aux techniciens"
        },
        "causes": {
          "bassins.haut-puits.pacte-des-citernes": "Le pacte des citernes",
          "bassins.haut-puits.vanniers-du-panache": "Les Vanniers sous le panache",
          "bassins.haut-puits.boues-du-decanteur": "Ce que retient le Décanteur",
          "bassins.haut-puits.ilyana-et-la-vanne": "Ilyana devant la dernière vanne",
          "veille-basse.la-place-sous-le-phare": "La place sous le Phare éteint",
          "veille-basse.la-porte-des-filtres": "La porte des filtres",
          "veille-basse.les-registres-du-reflux": "Les registres du reflux",
          "veille-basse.maelys-et-le-coffret": "Maëlys et le coffret étanche",
          "bassins.nacelles.le-poids-des-deux-rives": "Le poids des deux rives",
          "bassins.nacelles.le-frein-sous-la-cendre": "Le frein sous la cendre",
          "bassins.nacelles.la-main-sur-le-frein": "La main sur le frein",
          "bassins.nacelles.deux-voix-dans-le-cable": "Deux voix dans le câble",
          "bassins.deversoir.la-conduite-zero": "Décision prise devant la conduite révélée du Déversoir Noir.",
          "bassins.deversoir.la-tempete-aux-vannes": "Décision prise pendant la tempête qui sature les filtres des deux Colonies.",
          "bassins.deversoir.le-chassis-des-bassins": "Décision prise devant le châssis destiné à porter la transformation régionale.",
          "bassins.deversoir.le-passage-sans-retour": "Décision prise avant le passage irréversible vers la Trame de Fer.",
          "trame.barriere-neuve.le-permis-des-essieux": "Décision prise au contrôle des essieux de Barrière-Neuve.",
          "trame.barriere-neuve.la-taxe-des-lanternes": "Décision prise devant le registre des taxes et réquisitions.",
          "trame.grand-aiguillage.la-piece-sans-serie": "Décision prise devant la pièce de régulation sans numéro de série.",
          "trame.grand-aiguillage.l-eau-des-machines": "Décision prise devant les circuits de refroidissement des ateliers.",
          "trame.grand-aiguillage.ilyana-et-l-attelage": "Décision prise avec Ilyana au quai des attelages.",
          "trame.pompe-neuve.l-embranchement-sans-garde": "Décision prise devant les aiguilles sans garde de Pompe-Neuve.",
          "trame.pompe-neuve.les-filtres-du-rail": "Décision prise au dépôt de filtres de Pompe-Neuve.",
          "trame.traverse-libre.le-reservoir-sous-la-voie": "Décision prise sous la voie des réservoirs.",
          "trame.traverse-libre.la-galerie-qui-cede": "Décision prise face à l’affaissement de la Galerie.",
          "trame.traverse-libre.maelys-et-le-manifeste": "Décision prise avec Maëlys devant le registre de Traverse-Libre.",
          "trame.marche.les-services-de-la-voie-principale": "Décision prise devant le comptoir officiel du Marché des Traverses.",
          "trame.marche.la-bascule-sans-manifeste": "Décision prise à la Bascule clandestine du Marché.",
          "trame.signal-zero.l-interface-aux-deux-frequences": "Décision prise devant l’interface de la Ligne Zéro.",
          "trame.signal-zero.les-deux-branches-dans-le-verre": "Décision prise devant la table de verre de Signal-Zéro.",
          "trame.signal-zero.ilyana-et-la-trace": "Décision prise avec Ilyana au poste de Signal-Zéro."
        },
        "acteurs": {
          "ilyana-voss": "Ilyana Voss",
          "puits-libres": "Puits Libres",
          "habitants-haut-puits": "Habitants de Haut-Puits",
          "equipes-entretien": "Équipes d’entretien",
          "porte-lanterne": "Porte-Lanterne",
          "cohorte-du-sillon": "Cohorte du Sillon",
          "habitants-veille-basse": "Habitants de Veille-Basse",
          "techniciens-veille-basse": "Techniciens de Veille-Basse",
          "pelerins-de-cendre": "Pèlerins de Cendre",
          "maelys-rive": "Maëlys Rive",
          "nacelliers-des-vannes": "Nacelliers des Vannes",
          "frein-magnetique-des-nacelles": "Frein magnétique des Nacelles",
          "techniciens-du-deversoir": "Techniciens du Déversoir",
          "republique-du-rail": "République du Rail",
          "douaniers-du-rail": "Douaniers du Rail",
          "aiguilleurs": "Aiguilleurs de Grand-Aiguillage",
          "ateliers-grand-aiguillage": "Ateliers de Grand-Aiguillage",
          "habitants-grand-aiguillage": "Habitants de Grand-Aiguillage",
          "attelages-puits-libres": "Attelages des Puits Libres",
          "mecaniciens-pompe-neuve": "Mécaniciens de Pompe-Neuve",
          "habitants-traverse-libre": "Habitants de Traverse-Libre",
          "reservoirs-traverse-libre": "Réservoirs de Traverse-Libre",
          "delegues-puits-libres": "Délégués des Puits Libres",
          "commis-du-marche": "Commis du Marché des Traverses",
          "porteurs-des-puits-libres": "Porteurs des Puits Libres",
          "techniciens-signal-zero": "Techniciens de Signal-Zéro",
          "ligne-zero": "Ligne Zéro"
        },
        "cibles": {
          "equipes-entretien": "Équipes d’entretien",
          "ilyana-voss": "Ilyana Voss",
          "puits-libres": "Puits Libres",
          "habitants-haut-puits": "Habitants de Haut-Puits",
          "cohorte-du-sillon": "Cohorte du Sillon",
          "habitants-veille-basse": "Habitants de Veille-Basse",
          "techniciens-veille-basse": "Techniciens de Veille-Basse",
          "hospice-du-sillon": "Hospice du Sillon",
          "maelys-rive": "Maëlys Rive",
          "nacelliers-des-vannes": "Nacelliers des Vannes",
          "frein-magnetique-des-nacelles": "Frein magnétique des Nacelles",
          "conduite-de-la-ligne-zero": "Conduite de la Ligne Zéro",
          "conseil-des-vannes": "Conseil des Vannes",
          "chassis-regional-des-bassins": "Châssis régional des Bassins",
          "passage-vers-la-trame": "Passage vers la Trame de Fer",
          "habitants-des-bassins": "Habitants des Bassins",
          "barriere-neuve": "Barrière-Neuve",
          "republique-du-rail": "République du Rail",
          "grand-aiguillage": "Grand-Aiguillage",
          "train-outil-ligne-zero": "Train-outil de la Ligne Zéro",
          "reservoirs-traverse-libre": "Réservoirs de Traverse-Libre",
          "delegues-puits-libres": "Délégués des Puits Libres",
          "pompe-neuve": "Pompe-Neuve",
          "traverse-libre": "Traverse-Libre",
          "contournement-traverse-libre": "Contournement de Traverse-Libre",
          "galerie-des-reservoirs": "Galerie des Réservoirs",
          "commis-du-marche": "Commis du Marché des Traverses",
          "techniciens-signal-zero": "Techniciens de Signal-Zéro",
          "marche-des-traverses": "Marché des Traverses",
          "signal-zero": "Signal-Zéro",
          "piece-de-regulation": "Pièce de régulation",
          "bascule-des-manifestes": "Bascule des manifestes",
          "interface-de-la-ligne-zero": "Interface de la Ligne Zéro",
          "table-de-signal-zero": "Table de Signal-Zéro",
          "aiguillage-zero": "Aiguillage Zéro"
        }
      }
    },
    "en": {
      "journal": {
        "titres": {
          "bassins.haut-puits.pacte-partage": "Cistern-sharing pact",
          "bassins.haut-puits.pacte-autonomie": "High Well autonomy guaranteed",
          "bassins.haut-puits.panache-confine": "Plume sludge contained",
          "bassins.haut-puits.panache-derive": "Plume diverted to the empty basin",
          "bassins.haut-puits.decanteur-documente": "Travelling Settler documented",
          "bassins.haut-puits.arche-documentee": "Ark for the Displaced documented",
          "bassins.haut-puits.ilyana-garante": "Ilyana guarantees the registry",
          "bassins.haut-puits.ilyana-contredite": "Collective registry arbitration retained",
          "veille-basse.cohorte-accueillie": "Sillon Cohort welcomed",
          "veille-basse.cohorte-refusee": "Sillon Cohort refused",
          "veille-basse.cohorte-redirigee": "Cohort redirected to Sillon Hospice",
          "veille-basse.sas-renforce": "Lower Watch airlock reinforced",
          "veille-basse.hospice-ouvert": "Hospice sealed quarters opened",
          "veille-basse.intervention-refusee": "Lower Watch intervention refused",
          "veille-basse.registres-copies": "Backflow records copied",
          "veille-basse.registres-laisses": "Records entrusted to Lower Watch",
          "veille-basse.maelys-mission-confiee": "Maëlys’s survey case entrusted to the convoy",
          "veille-basse.maelys-equipes-prioritaires": "Maëlys’s teams kept at Lower Watch",
          "bassins.nacelles.accord-regional": "Counterweights shared between both banks",
          "bassins.nacelles.passage-restreint": "Cable crossing reserved",
          "bassins.nacelles.cible-frein-balisee": "Magnetic brake marked as a Covert Target",
          "bassins.nacelles.cible-frein-consignee": "Magnetic brake recorded as a Covert Target",
          "bassins.nacelles.frein-reaccorde": "Cable brake publicly retuned",
          "bassins.nacelles.frein-transforme-clandestinement": "Cable brake covertly altered",
          "bassins.nacelles.trace-laiton-persistante": "Persistent brass-filings Trace",
          "bassins.nacelles.conseil-passage-partage": "Shared crossing prepared for the Council",
          "bassins.nacelles.conseil-maintenance-commune": "Common maintenance prepared for the Council",
          "bassins.deversoir.ligne-zero-relevee": "The Zero Line interface was surveyed",
          "bassins.deversoir.ligne-zero-preservee": "The Zero Line conduit was preserved",
          "bassins.deversoir.conseil-convoque": "The delegations were summoned to the Sluices",
          "bassins.deversoir.conseil-public": "The water accounts were made public",
          "bassins.deversoir.transformation-scellee": "The regional transformation was sealed",
          "bassins.deversoir.gabarits-conserves": "The regional templates were preserved",
          "bassins.deversoir.passage-prepare": "The abandoned places were recorded before passage",
          "bassins.deversoir.passage-transmis": "The Basins’ registers were handed on",
          "trame.barriere-neuve.permis-republicain": "Republican circulation permit",
          "trame.barriere-neuve.droit-local-conteste": "Contested local right of passage",
          "trame.barriere-neuve.taxe-des-lanternes": "Lantern tax paid",
          "trame.barriere-neuve.priorite-aux-requisitions": "Requisition priority granted",
          "trame.grand-aiguillage.train-outil-annonce": "Tool Train announced for the regulation part",
          "trame.grand-aiguillage.reparation-locale-ouverte": "Local repair opened outside the monopoly",
          "trame.grand-aiguillage.refroidissement-securise": "Workshop cooling secured",
          "trame.grand-aiguillage.refroidissement-rationne": "Workshop cooling rationed",
          "trame.grand-aiguillage.attelage-federe-annonce": "Federated Hauler announced",
          "trame.grand-aiguillage.train-outil-reserve": "Tool Train reserved",
          "trame.pompe-neuve.balises-libres-suivies": "New Pump autonomous markers followed",
          "trame.pompe-neuve.aiguillage-signale": "New Pump switch reported to the Republic",
          "trame.pompe-neuve.filtres-livres-discretement": "Filters discreetly delivered to Free Crossing",
          "trame.pompe-neuve.livraison-inscrite": "Free Crossing delivery entered in the manifest",
          "trame.traverse-libre.contournement-releve": "Hydraulic bypass surveyed",
          "trame.traverse-libre.vanne-preservee": "Ancient valve preserved",
          "trame.traverse-libre.galerie-etayee": "Reservoir Gallery shored up",
          "trame.traverse-libre.contournement-ouvert": "Free Crossing bypass opened",
          "trame.traverse-libre.manifeste-public": "Aid to Free Crossing made public",
          "trame.traverse-libre.registre-scelle": "Aid register sealed",
          "trame.marche.coupleur-officiel-acquis": "Official coupler acquired at the Market",
          "trame.marche.reserve-echangee": "Cooling reserve traded",
          "trame.marche.filtres-sans-marque-acquis": "Unmarked filters acquired",
          "trame.marche.trace-bascule-clandestine": "Trace left on the scales",
          "trame.signal-zero.interface-rail-lue": "Republican interface frequency read",
          "trame.signal-zero.interface-libre-lue": "Free interface frequency read",
          "trame.signal-zero.echos-conserves": "Both branches’ echoes preserved",
          "trame.signal-zero.frequences-separees": "Zero Signal frequencies separated",
          "trame.signal-zero.trace-sous-scelles": "Trace entrusted to Ilyana under seal",
          "trame.signal-zero.trace-transmise": "Trace transmitted to the technicians"
        },
        "causes": {
          "bassins.haut-puits.pacte-des-citernes": "The cistern pact",
          "bassins.haut-puits.vanniers-du-panache": "The Basketmakers under the plume",
          "bassins.haut-puits.boues-du-decanteur": "What the Settler retains",
          "bassins.haut-puits.ilyana-et-la-vanne": "Ilyana at the last valve",
          "veille-basse.la-place-sous-le-phare": "Room beneath the dead lighthouse",
          "veille-basse.la-porte-des-filtres": "The filter gate",
          "veille-basse.les-registres-du-reflux": "The backflow records",
          "veille-basse.maelys-et-le-coffret": "Maëlys and the sealed case",
          "bassins.nacelles.le-poids-des-deux-rives": "The weight of both banks",
          "bassins.nacelles.le-frein-sous-la-cendre": "The brake beneath the ash",
          "bassins.nacelles.la-main-sur-le-frein": "A hand on the brake",
          "bassins.nacelles.deux-voix-dans-le-cable": "Two voices in the cable",
          "bassins.deversoir.la-conduite-zero": "Decision made before the Black Spillway’s revealed conduit.",
          "bassins.deversoir.la-tempete-aux-vannes": "Decision made during the storm saturating both Colonies’ filters.",
          "bassins.deversoir.le-chassis-des-bassins": "Decision made before the frame built to carry the regional transformation.",
          "bassins.deversoir.le-passage-sans-retour": "Decision made before irreversible passage into the Iron Weave.",
          "trame.barriere-neuve.le-permis-des-essieux": "Decision made at New Barrier’s axle control.",
          "trame.barriere-neuve.la-taxe-des-lanternes": "Decision made before the tax and requisition register.",
          "trame.grand-aiguillage.la-piece-sans-serie": "Decision made before the unnumbered regulation part.",
          "trame.grand-aiguillage.l-eau-des-machines": "Decision made before the workshops’ cooling circuits.",
          "trame.grand-aiguillage.ilyana-et-l-attelage": "Decision made with Ilyana at the haulers’ platform.",
          "trame.pompe-neuve.l-embranchement-sans-garde": "Decision made at New Pump’s unattended switches.",
          "trame.pompe-neuve.les-filtres-du-rail": "Decision made at the New Pump filter depot.",
          "trame.traverse-libre.le-reservoir-sous-la-voie": "Decision made beneath the reservoir track.",
          "trame.traverse-libre.la-galerie-qui-cede": "Decision made at the Reservoir Gallery collapse.",
          "trame.traverse-libre.maelys-et-le-manifeste": "Decision made with Maëlys before the Free Crossing register.",
          "trame.marche.les-services-de-la-voie-principale": "Decision made at Sleeper Market’s official counter.",
          "trame.marche.la-bascule-sans-manifeste": "Decision made at the Market’s clandestine scales.",
          "trame.signal-zero.l-interface-aux-deux-frequences": "Decision made before the Zero Line interface.",
          "trame.signal-zero.les-deux-branches-dans-le-verre": "Decision made before the Zero Signal glass table.",
          "trame.signal-zero.ilyana-et-la-trace": "Decision made with Ilyana at the Zero Signal post."
        },
        "acteurs": {
          "ilyana-voss": "Ilyana Voss",
          "puits-libres": "Free Wells",
          "habitants-haut-puits": "High Well inhabitants",
          "equipes-entretien": "Maintenance crews",
          "porte-lanterne": "Lantern-Bearer",
          "cohorte-du-sillon": "Sillon Cohort",
          "habitants-veille-basse": "Lower Watch residents",
          "techniciens-veille-basse": "Lower Watch technicians",
          "pelerins-de-cendre": "Ash Pilgrims",
          "maelys-rive": "Maëlys Rive",
          "nacelliers-des-vannes": "Sluice Cable Crews",
          "frein-magnetique-des-nacelles": "Cableway Magnetic Brake",
          "techniciens-du-deversoir": "Spillway Technicians",
          "republique-du-rail": "Rail Republic",
          "douaniers-du-rail": "Rail Customs Officers",
          "aiguilleurs": "Grand Junction Switch Crews",
          "ateliers-grand-aiguillage": "Grand Junction Workshops",
          "habitants-grand-aiguillage": "Grand Junction Residents",
          "attelages-puits-libres": "Free Wells Haulers",
          "mecaniciens-pompe-neuve": "New Pump Mechanics",
          "habitants-traverse-libre": "Free Crossing Inhabitants",
          "reservoirs-traverse-libre": "Free Crossing Reservoirs",
          "delegues-puits-libres": "Free Wells Delegates",
          "commis-du-marche": "Sleeper Market clerks",
          "porteurs-des-puits-libres": "Free Wells carriers",
          "techniciens-signal-zero": "Zero Signal technicians",
          "ligne-zero": "Zero Line"
        },
        "cibles": {
          "equipes-entretien": "Maintenance crews",
          "ilyana-voss": "Ilyana Voss",
          "puits-libres": "Free Wells",
          "habitants-haut-puits": "High Well inhabitants",
          "cohorte-du-sillon": "Sillon Cohort",
          "habitants-veille-basse": "Lower Watch residents",
          "techniciens-veille-basse": "Lower Watch technicians",
          "hospice-du-sillon": "Sillon Hospice",
          "maelys-rive": "Maëlys Rive",
          "nacelliers-des-vannes": "Sluice Cable Crews",
          "frein-magnetique-des-nacelles": "Cableway Magnetic Brake",
          "conduite-de-la-ligne-zero": "Zero Line Conduit",
          "conseil-des-vannes": "Sluice Council",
          "chassis-regional-des-bassins": "Basins Regional Frame",
          "passage-vers-la-trame": "Passage into the Iron Weave",
          "habitants-des-bassins": "People of the Basins",
          "barriere-neuve": "New Barrier",
          "republique-du-rail": "Rail Republic",
          "piece-de-regulation": "Regulation Part",
          "grand-aiguillage": "Grand Junction",
          "train-outil-ligne-zero": "Zero Line Tool Train",
          "reservoirs-traverse-libre": "Free Crossing Reservoirs",
          "delegues-puits-libres": "Free Wells Delegates",
          "pompe-neuve": "New Pump",
          "traverse-libre": "Free Crossing",
          "contournement-traverse-libre": "Free Crossing Bypass",
          "galerie-des-reservoirs": "Reservoir Gallery",
          "commis-du-marche": "Sleeper Market clerks",
          "techniciens-signal-zero": "Zero Signal technicians",
          "marche-des-traverses": "Sleeper Market",
          "signal-zero": "Zero Signal",
          "bascule-des-manifestes": "Manifest scales",
          "interface-de-la-ligne-zero": "Zero Line interface",
          "table-de-signal-zero": "Zero Signal table",
          "aiguillage-zero": "Zero Junction"
        }
      }
    }
  }
} as const;
