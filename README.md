# Les Lanternes de Cendre

Première tranche jouable de la Campagne : une Cité-caravane déterministe,
sa Coupe habitée accessible et les commandes du Temps du convoi.

## Démarrer

```sh
npm ci
npm run dev
```

Le jeu est ensuite disponible sur l’URL affichée par Vite. La Graine de
campagne de cette tranche est `CENDRE-01`.

## Vérifier

```sh
npm run check
```

Cette commande exécute le typage, le lint, les tests Node et Chromium, puis le
build de production. Le même contrôle est lancé par GitHub Actions à chaque
push et sur chaque pull request.

## Frontières

- `src/simulation` contient le noyau pur et sérialisable ;
- `src/application` orchestre les commandes et construit les projections ;
- `src/ui` rend la projection dans le DOM et dans PixiJS ;
- le ticker PixiJS anime uniquement la présentation.
