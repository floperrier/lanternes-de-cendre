# Bêta commerciale

La bêta est un paquet unique : application statique, service commercial
Node.js, contenu premium, preuves de budgets et d’équilibrage, licences et
manifeste d’empreintes. Elle conserve la séparation entre l’Accès premium
restaurable et les Campagnes locales portables.

## Construire et vérifier

Exécuter la chaîne complète :

```sh
npm ci
npx playwright install --with-deps chromium firefox webkit
npm run check
```

La fin de la chaîne construit `dist-beta/`, en vérifie toutes les empreintes,
puis rejoue dans Chromium le parcours servi par le binaire de production :
Démonstration anonyme, sauvegarde, achat de test, chargement premium,
restauration de l’Accès et reprise de la même Campagne.

Le paquet contient :

- `public/` : shell Vite et assets publics ;
- `server/serveur.mjs` et `server/assets/` : service HTTP et charge premium ;
- `manifeste-beta.json` : commit, versions de format, neuf variantes finales,
  commandes de contrôle, taille et SHA-256 de chaque fichier ;
- `licences-tierces.json` : versions et licences des dépendances d’exécution ;
- `preuves/` : budgets, performance et équilibrage standard conformes ;
- ce document et les fichiers npm nécessaires à une installation
  `--omit=dev`.

Avant promotion, conserver le paquet sous un identifiant immuable dérivé du
commit et exécuter :

```sh
npm ci --omit=dev
npm run start
curl --fail https://beta.example.invalid/api/beta/sante
```

Le serveur écoute derrière un terminateur TLS. Les variables obligatoires en
production sont :

- `COMMERCIAL_ORIGIN`, URL HTTPS publique ;
- `COMMERCIAL_DATABASE_PATH`, chemin persistant de la base SQLite ;
- `PADDLE_CLIENT_TOKEN`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_PRICE_ID` et
  `PADDLE_PRODUCT_ID` réels ;
- `PREMIUM_RECEIPT_PRIVATE_KEY`, clef Ed25519 au format PEM ;
- `BETTER_AUTH_SECRET`, secret aléatoire d’au moins 32 caractères ;
- `EMAIL_DELIVERY_URL` HTTPS et `EMAIL_DELIVERY_TOKEN` ;
- facultativement `HOST` et `PORT`.

Le mode commercial de test n’est activé que par
`BETA_COMMERCIAL_MODE=test`; il ne doit jamais être défini sur la cible
publique. En production, un secret absent, une origine HTTP ou une référence
Paddle de test arrête le serveur avant l’ouverture du port.

## Support

Dans « Sauvegarde de Campagne », demander au joueur d’utiliser « Capsule de
support ». Le fichier contient la sauvegarde portable, les versions de
simulation, contenu et sauvegarde, l’empreinte finale et la reproduction
rejouable. Sa création échoue si le replay diverge. Il n’inclut ni courriel,
ni identité commerciale, ni preuve locale d’Accès premium.

Pour traiter un incident :

1. relever le commit depuis `/api/beta/sante` ;
2. conserver la capsule telle quelle et vérifier son empreinte avant analyse ;
3. reproduire avec la version immuable désignée par le manifeste ;
4. joindre le premier écart de replay et le manifeste au rapport, sans
   demander la base commerciale ni les données d’authentification.

Une archive future ou incompatible reste réexportable par le joueur et ne
doit pas être convertie manuellement.

## Retour arrière

Chaque promotion conserve le paquet précédent, son manifeste et une
sauvegarde cohérente du fichier SQLite avec ses fichiers WAL/SHM. Le contrôle
`npm run beta:verifier` recalcule l’inventaire avant toute promotion ou
restauration. La suite `npm run test:e2e:beta` automatise la procédure entière
sur deux paquets immuables aux binaires et empreintes distincts. Le paquet
courant migre réellement le schéma commercial V1 vers V2 avant que la
restauration ne remette en service le binaire V1 et sa base V1 sauvegardée. La
preuve couvre aussi l’installation de production, SQLite/WAL/SHM, le
redémarrage, la sonde de santé, une session anonyme, la restauration d’un
Accès et l’import d’une archive de sauvegarde connue.

Procédure :

1. retirer la cible courante du trafic, suspendre toute écriture et archiver
   ensemble la base SQLite, `-wal` et `-shm`, puis terminer proprement son
   processus ;
2. sélectionner le dernier paquet précédemment servi ;
3. exécuter `npm ci --omit=dev` et `npm run beta:verifier` dans ce paquet ;
4. restaurer la sauvegarde de base associée au même paquet si sa migration a
   déjà été engagée ;
5. démarrer, vérifier `/api/beta/sante`, une session anonyme, la restauration
   d’un Accès de test et l’import d’une archive de sauvegarde connue ;
6. seulement alors rétablir le trafic, en conservant le paquet fautif pour
   diagnostic.

La progression locale n’est jamais incluse dans ce retour arrière : les
sauvegardes restent portables et leurs migrations préservent toujours
l’original.
