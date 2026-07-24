# Budgets de la Campagne complète

La configuration bloquante est
`content/assets/budgets.yaml`. `npm run build` produit le graphe Vite, puis
`npm run budgets:check` vérifie l’inventaire réel et écrit
`artifacts/budgets/campagne.json`. Une ressource non inventoriée, non
traçable ou hors budget fait échouer le build.

## Périmètres mesurés

- **Shell** : `index.html`, l’entrée JavaScript, ses imports statiques, les
  styles et les fontes déclarées par le manifeste Vite.
- **Première scène** : shell, code de la Coupe habitée et de l’Atlas Pixi
  selon le graphe Vite, puis bundle commun.
- **Bundles régionaux** : Bassins, Trame, Couronne et Finale. Les images
  premium restent dans la charge commerciale signée ; leur nom ne paraît
  pas dans la distribution gratuite.
- **Cache complet** : distribution Vite, assets commerciaux et catalogue
  premium sérialisé.
- **Textures actives** : bundle commun, région courante, région suivante et
  plus grande illustration à la demande, à quatre octets décodés par pixel.
  C’est le maximum que le gestionnaire peut conserver simultanément.

Les images de la région courante et de la suivante sont décodées à priorité
basse pendant une période d’inactivité. En franchissant une région, les
références `Image` de la région dépassée sont vidées afin que le navigateur
puisse libérer les textures. Les trois illustrations suivantes du prologue
forment le bundle `a-la-demande` et ne sont chargées que lorsqu’un Événement
les affiche. Les textures communes Pixi restent actives durant la scène.

## Résultat de référence

Mesures du build de production de référence :

| Périmètre | Mesuré | Budget |
| --- | ---: | ---: |
| Shell | 1,58 Mio | 4 Mio |
| Première scène | 5,07 Mio | 12 Mio |
| Bassins | 3,84 Mio | 30 Mio |
| Trame | 2,41 Mio | 30 Mio |
| Couronne | 2,66 Mio | 30 Mio |
| Finale | 1,20 Mio | 30 Mio |
| Cache complet | 16,30 Mio | 150 Mio |
| Textures actives maximales | 182,12 Mio | 256 Mio |

Tous les atlases restent sous la préférence de 2 048 px et aucune texture
ne dépasse 4 096 px. Cette version ne référence aucune piste audio : le
budget audio est donc explicitement nul, pas omis.

`npm run performance:check` lance le build via `vite preview` dans Chromium
avec cache froid, latence de 40 ms et débit limité à 10 Mbit/s. Il écrit
`artifacts/budgets/performance.json`. La mesure locale de référence donne :

- première scène jouable en 3,8–4,1 s sur un maximum de 15 s ;
- commande de vitesse reflétée autour de 1 ms ;
- ticker Pixi entre 57 et 60 images/s pour une cible de 60 et un plancher de
  55 ;
- 28 conduites sentinelles, soit 113 commandes, en 65–83 ms et sans
  divergence.

Les durées sont réévaluées en CI sur la machine courante et les rapports
sont conservés comme artefacts.

## Qualité et dérogation

Le compilateur de contenu vérifie les références, traductions françaises et
anglaises, alternatives essentielles, absence de texte incorporé, fichiers,
empreintes et provenance. Le vérificateur de budgets ajoute les licences,
l’inventaire exhaustif, les dimensions et l’état d’approbation.

Les 63 fichiers ou entrées visuelles encore en attente de revue humaine
sont couverts par `revue-humaine-assets-0.1.0`. Cette dérogation :

- ne vaut que pour la version `0.1.0` ;
- est liée à l’empreinte SHA-256 exacte des chemins, contenus et statuts ;
- devient invalide si un asset change, si un nouvel asset apparaît ou si la
  version du paquet évolue.

Elle ne couvre ni provenance absente, ni licence absente, ni empreinte
incorrecte, ni traduction ou alternative manquante. Une approbation humaine
ultérieure retire naturellement les fichiers concernés de l’empreinte et
oblige à mettre à jour ou supprimer la dérogation.

## Commandes

```sh
npm run build
npm run performance:check
```

`npm run check` exécute ces deux contrôles, les tests multi-navigateurs, les
scénarios et la vérification de frontière premium.
