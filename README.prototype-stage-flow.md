# PROTOTYPE — Parcours d’une étape complète

Question testée : **quel enchaînement concret de surfaces, de décisions et de retours rend une étape complète lisible sans créer de micromanagement ?**

Trois variantes structurellement différentes du même état simulé sont accessibles avec `?variant=` :

- `A` — **Journal de quart** : une décision centrale à la fois, guidée par un fil linéaire.
- `B` — **Convoi-hub** : les phases habitent des lieux dans une coupe fonctionnelle du convoi.
- `C` — **Table de commandement** : chronologie, ordre en cours et prévision restent visibles ensemble.

Captures de référence :

- [Variante A — Journal de quart](output/playwright/variant-a-guided.png)
- [Variante B — Convoi-hub](output/playwright/variant-b-hub.png)
- [Variante C — Table de commandement](output/playwright/variant-c-command.png)

## Lancer

Depuis ce worktree :

```sh
./run-prototype-stage-flow.sh
```

Puis ouvrir <http://127.0.0.1:4173/prototype-stage-flow.html?variant=A>.

Les flèches de la barre inférieure, ou les touches `←` et `→`, changent de variante sans perdre l’état en mémoire. Le bouton **Recommencer l’étape** réinitialise tout.

## Statut

Le premier prototype a rempli son rôle de contre-exemple : son découpage en sept phases successives a été écarté au profit d'une gestion continue de la cité-caravane, rythmée par des incidents et interrompue seulement par les décisions irréversibles.

La direction spatiale retenue est une **cité-caravane en grappe** : plusieurs plateformes avancent sur des files parallèles irrégulières autour du phare, puis peuvent se déployer et se réorganiser pendant une halte.

- [Croquis accepté — Cité-caravane en grappe](output/concepts/cite-caravane-en-grappe.png)

Le second prototype remplace les phases par un même Temps du convoi partagé entre la ville, les incidents et les opérations. Trois organisations de la vue principale sont comparables avec `?variant=A`, `B` ou `C` :

- [Prototype temps réel — Cité vivante](prototype-realtime-caravan.html?variant=A)
- [Prototype temps réel — Poste du phare](prototype-realtime-caravan.html?variant=B)
- [Prototype temps réel — Table d’exploitation](prototype-realtime-caravan.html?variant=C)

Captures du second prototype :

- [Variante A — Cité vivante](output/playwright/realtime-variant-a.png)
- [Variante B — Poste du phare](output/playwright/realtime-variant-b.png)
- [Variante C — Table d’exploitation](output/playwright/realtime-variant-c.png)
- [Variante A — largeur étroite](output/playwright/realtime-variant-a-narrow.png)

Dans chaque variante, essayer de sélectionner une plateforme, planifier un bâtiment, laisser ou traiter la fuite de vapeur, atteindre la halte, tenir conseil puis choisir la route. L’état reste partagé lors du changement de variante.

## Verdict humain provisoire

Aucune variante n'est validée comme interface du jeu. La variante A suscite une préférence faible, sans conviction suffisante pour en faire une direction.

Ce prototype est une **source primaire jetable**, pas une autorité de conception. Il sert à exposer des hypothèses et à provoquer des réactions. Seules les décisions formulées explicitement dans le ticket et la carte Wayfinder font référence ; la composition visuelle devra être réévaluée avec un prototype de rendu plus fidèle, après le choix du moteur et de la direction artistique.

Code jetable, sans persistance, sans backend, sans tests de production. Ces artefacts servent uniquement à choisir une structure d'interaction ; ils ne doivent pas être fusionnés tels quels dans la V1.
