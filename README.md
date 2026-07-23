# Les Lanternes de Cendre

Premières tranches jouables de la Campagne : une Cité-caravane déterministe,
sa Coupe habitée accessible, les commandes du Temps du convoi et un premier
Événement narratif bilingue à la fin de la première minute. La progression est
sauvegardée localement et peut être transportée par export/import JSON. La
porte finale permet d’acheter ou de restaurer l’Accès premium permanent sans
recréer la Campagne.

## Démarrer

```sh
npm ci
npm run dev
```

Le jeu est ensuite disponible sur l’URL affichée par Vite. La Graine de
campagne de cette tranche est `CENDRE-01`. Sans identifiants Paddle, le serveur
de développement active le marchand de test déterministe. Pour ouvrir le
checkout officiel Paddle Sandbox, copier `.env.example` vers `.env.local` et
renseigner `PADDLE_CLIENT_TOKEN` et `PADDLE_PRICE_ID`.

Les secrets de webhook, de preuve locale et Better Auth restent exclusivement
dans le service commercial. Ils ne doivent jamais porter le préfixe `VITE_` ni
être commités. L’adaptateur Better Auth de `serveur-commercial/authentification.ts`
attend une base persistante, un expéditeur d’email et un journal d’audit.

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
- `src/commercial` contrôle l’Accès premium dans le navigateur, séparément de
  la Campagne et de sa sauvegarde ;
- `src/sauvegarde` possède le contrôleur de session et versionne snapshots,
  migrations et replays derrière des ports mémoire et IndexedDB ;
- `src/ui` rend la projection dans le DOM et dans PixiJS ;
- `serveur-commercial` porte le magic link, la vérification des webhooks
  Paddle, l’idempotence et le droit permanent ;
- le ticker PixiJS anime uniquement la présentation.

Les commandes `Sauvegarder`, `Exporter` et `Importer` sont disponibles dans
l’en-tête. Une archive plus récente que l’application n’est jamais remplacée :
elle reste réexportable et son incompatibilité est expliquée dans l’interface.
