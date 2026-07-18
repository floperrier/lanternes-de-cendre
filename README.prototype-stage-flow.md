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

Code jetable, sans persistance, sans backend, sans tests de production. Ces artefacts servent uniquement à choisir une structure d'interaction ; ils ne doivent pas être fusionnés tels quels dans la V1.
