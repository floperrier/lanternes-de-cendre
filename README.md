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
de développement active le marchand de test déterministe. Better Auth y livre
le magic link dans l’interface de test et conserve identités, sessions,
commandes, droits et événements idempotents dans SQLite. Pour ouvrir le
checkout officiel Paddle Sandbox, copier `.env.example` vers `.env.local` et
renseigner ses trois valeurs publiques. Ce fichier local ne configure ni
origine distante ni secret : le port effectivement résolu par Vite est donc
repris dans les magic links.

Les secrets de webhook, la clé privée Ed25519 et le secret Better Auth restent
exclusivement dans le service commercial. Ils ne doivent jamais porter le
préfixe `VITE_` ni être commités. Seule la clé publique Ed25519 est intégrée au
client pour vérifier le reçu hors ligne. La production part de
`.env.production.example` et exige le remplacement de toutes ses valeurs :
origine et livraison email HTTPS, secrets forts, paire Ed25519 cohérente et
base SQLite persistante. Le fichier d’exemple de production ne doit jamais
être utilisé tel quel.

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
  Paddle, l’idempotence, le droit permanent et le catalogue premium protégé ;
- le ticker PixiJS anime uniquement la présentation.

Les commandes `Sauvegarder`, `Exporter` et `Importer` sont disponibles dans
l’en-tête. Une archive plus récente que l’application n’est jamais remplacée :
elle reste réexportable et son incompatibilité est expliquée dans l’interface.
