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
          "bassins.nacelles.conseil-maintenance-commune": "Maintenance commune préparée pour le Conseil"
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
          "bassins.nacelles.deux-voix-dans-le-cable": "Deux voix dans le câble"
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
          "frein-magnetique-des-nacelles": "Frein magnétique des Nacelles"
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
          "frein-magnetique-des-nacelles": "Frein magnétique des Nacelles"
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
          "bassins.nacelles.conseil-maintenance-commune": "Common maintenance prepared for the Council"
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
          "bassins.nacelles.deux-voix-dans-le-cable": "Two voices in the cable"
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
          "frein-magnetique-des-nacelles": "Cableway Magnetic Brake"
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
          "frein-magnetique-des-nacelles": "Cableway Magnetic Brake"
        }
      }
    }
  }
} as const;
