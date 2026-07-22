# Les Lanternes de Cendre

Premières tranches jouables de la Campagne : une Cité-caravane déterministe,
sa Coupe habitée accessible, les commandes du Temps du convoi et un premier
Événement narratif bilingue à la fin de la première minute.

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
- `content` contient les sources YAML et traductions, et référence les fiches de provenance versionnées sous `docs/assets` ;
- `src/content` contient le compilateur public et le catalogue immuable généré ;
- `src/application` orchestre les commandes et construit les projections ;
- `src/ui` rend la projection dans le DOM et dans PixiJS ;
- le ticker PixiJS anime uniquement la présentation.
