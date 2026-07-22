# Les Lanternes de Cendre

Premières tranches jouables de la Campagne : une Cité-caravane déterministe,
sa Coupe habitée accessible, les commandes du Temps du convoi et un premier
Événement narratif bilingue à la fin de la première minute. La progression est
sauvegardée localement et peut être transportée par export/import JSON.

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
- `src/sauvegarde` possède le contrôleur de session et versionne snapshots,
  migrations et replays derrière des ports mémoire et IndexedDB ;
- `src/ui` rend la projection dans le DOM et dans PixiJS ;
- le ticker PixiJS anime uniquement la présentation.

Les commandes `Sauvegarder`, `Exporter` et `Importer` sont disponibles dans
l’en-tête. Une archive plus récente que l’application n’est jamais remplacée :
elle reste réexportable et son incompatibilité est expliquée dans l’interface.
