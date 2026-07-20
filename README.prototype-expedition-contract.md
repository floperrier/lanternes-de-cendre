# PROTOTYPE — Contrat d’une expédition commandée à distance

Question testée : **quelle répartition entre préparation du Porte-Lanterne, autonomie du compagnon responsable et ordres transmis à distance rend une Opération cartographiée tendue et compréhensible ?**

Ce prototype jetable met le même scénario et le même état en mémoire derrière trois organisations radicalement différentes, accessibles avec `?variant=` :

- `A` — **Briefing à trois temps** : préparer, suivre, décider dans une table de mission structurée.
- `B` — **Carte et radio** : donner la priorité à la progression spatiale et aux échanges avec l’équipe.
- `C` — **Mandat d’autonomie** : rendre explicites les règles permanentes et les seuils qui obligent l’équipe à rappeler le Porte-Lanterne.

Le scénario de test est volontairement borné : une responsable, quatre Habitants agrégés, un objectif, trois choix de préparation, deux incidents autonomes, un ordre important transmis à distance et un retour avec bilan causal.

## Lancer

Depuis ce worktree :

```sh
./run-prototype-expedition-contract.sh
```

Puis ouvrir <http://127.0.0.1:4174/prototype-expedition-contract.html?variant=A>.

Les flèches de la barre inférieure, ou les touches `←` et `→`, changent de variante sans perdre l’état. Le bouton **Réinitialiser** remet le scénario au départ.

Captures de référence :

- [Variante A — préparation](output/playwright/variant-a-preparation.png)
- [Variante A — ordre requis](output/playwright/variant-a-escalation.png)
- [Variante B — ordre requis](output/playwright/variant-b-escalation.png)
- [Variante C — ordre requis](output/playwright/variant-c-escalation.png)
- [Variante C — bilan de retour](output/playwright/variant-c-result.png)
- [Variante C — bilan en largeur étroite](output/playwright/variant-c-result-narrow.png)

## Parcours à essayer

1. Comparer les coûts certains, les gains estimés et la provenance des incertitudes.
2. Modifier l’équipement, la consigne d’autonomie et le seuil de repli.
3. Lancer l’expédition et faire progresser le scénario jusqu’à la station.
4. Constater les incidents traités sans ordre, puis l’arrêt de l’Expédition lorsqu’un ordre important est requis.
5. Choisir une issue, faire rentrer l’équipe et lire le bilan.
6. Refaire le parcours dans les trois variantes avec le même état partagé.

## Hypothèses rendues contestables

- Le Porte-Lanterne décide avant le départ de l’objectif, de la responsable, de l’équipement, d’une **consigne d’autonomie** et d’un **seuil de repli**.
- La responsable règle seule les écarts qui restent dans ce mandat et les inscrit dans le journal causal.
- Une décision hors mandat suspend uniquement l’Expédition ; le Temps du convoi continue jusqu’à ce que le joueur le suspende lui-même.
- Le suivi présente des coûts connus exactement et des gains ou risques sous forme d’intervalles sourcés.
- Un ordre à distance porte sur une intention et un compromis, jamais sur le déplacement direct des membres de l’équipe.
- Le retour compare le prévu au réalisé et explique chaque écart.

Ces hypothèses ne sont pas des décisions tant qu’elles n’ont pas reçu de verdict humain sur le ticket Wayfinder.

## Statut

Code jetable, sans persistance, backend, moteur de jeu ni tests de production. L’interface utilise uniquement le DOM afin de tester le contrat d’information et de commande. Le prototype ne doit pas être fusionné tel quel dans la V1.
