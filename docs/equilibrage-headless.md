# Équilibrage headless de la Campagne

Le banc d’équilibrage conduit le noyau public de simulation avec des commandes
sémantiques. Il ne remplace ni les playtests humains, ni leur mesure de la
compréhension, de la fatigue ou de la répétition perçue.

## Matrices reproductibles

La passe standard exécute 256 Graines pour chacune des dix stratégies
déterministes, soit 2 560 Campagnes complètes :

```sh
npm run equilibrage:check
```

Elle fait partie de `npm run check`. La passe nocturne exécute 2 048 Graines
par stratégie, soit 20 480 Campagnes, puis écrit son rapport :

```sh
npm run equilibrage:nightly
```

GitHub Actions lance cette matrice chaque nuit et conserve
`artifacts/equilibrage/nocturne.json`. Une matrice locale réduite sert
uniquement au développement du banc, jamais à valider une modification de
règles :

```sh
npx tsx scripts/equilibrage-campagne.ts \
  --graines 4 \
  --prefixe DIAGNOSTIC \
  --resume artifacts/equilibrage/diagnostic.json
```

Les dix stratégies couvrent les premières Campagnes et les Campagnes rejouées,
les branches hautes et basses, Rail et Puits Libres, Marché et raccord direct,
les trois sorties de la Couronne, plusieurs réponses de Crise, avec et sans
Compagnon, ainsi que différentes politiques de Halte. Elles sont des sondes
déterministes explicites, pas des profils de joueurs prétendument réalistes.
La passe standard rejoue en outre le journal exact de chaque candidate sous la
version de règles précédente et conserve le rapport complet dans
`artifacts/equilibrage/standard.json`. Elle recalcule cette v3 puis vérifie son
égalité exacte avec l’oracle versionné
`artifacts/equilibrage/reference-v3.json.gz` avant de comparer v3 et v4. La
sortie console limite les capsules affichées, mais indique leur nombre total.

## Comparer un réglage

Toute modification de projection, de disponibilité, de causalité ou de valeur
incrémente `VERSION_REGLES_D_EQUILIBRAGE_COURANTE` et ajoute une entrée à
`HISTORIQUE_DES_REGLES_D_EQUILIBRAGE`. La référence est produite sur la
version précédente avec la matrice complète :

```sh
npx tsx scripts/equilibrage-campagne.ts \
  --graines 256 \
  --version-regles 1 \
  --prefixe EQUILIBRAGE \
  --ecrire-reference artifacts/equilibrage/regles-v1.json.gz \
  --resume artifacts/equilibrage/regles-v1.json
```

La candidate emploie le même préfixe et le même nombre de Graines :

```sh
npx tsx scripts/equilibrage-campagne.ts \
  --graines 256 \
  --version-regles 2 \
  --prefixe EQUILIBRAGE \
  --reference artifacts/equilibrage/regles-v1.json.gz \
  --resume artifacts/equilibrage/regles-v2.json
```

Le banc vérifie que la référence est la version immédiatement antérieure et
que les couples Graine–stratégie sont identiques. Il rejoue ensuite sous
l’ancienne règle le journal exact de commandes de la candidate. Une commande
refusée n’est pas remplacée : les commandes suivantes sont conservées comme
non exécutées afin que les deux journaux restent strictement comparables.

Le rapport contient le premier écart d’état, d’événements, de statut ou
d’erreur et une capsule minimale arrêtée à cet écart. Les deltas de métriques
ne sont publiés que lorsque les deux côtés ont achevé toutes leurs Campagnes ;
ils valent `null` avec la portée `indisponible-apres-divergence` si l’ancienne
règle refuse une commande. La comparaison échoue si les Graines ou commandes
diffèrent. Un écart expliqué entre les états est attendu lorsqu’une règle
change.

## Mesures et portes

Le rapport calcule médiane, premier et troisième quartiles pour :

- la part des Tronçons parcourus avec besoins sous tension, cible 30–50 % ;
- les Crises par Campagne, cible médiane 3–5 ;
- l’arrivée au Nœud, cible 65–80 % pour une première Campagne et 80–95 % pour
  une Campagne rejouée ;
- la charge d’équipes d’entretien pondérée par le temps simulé, indicateur
  proxy comparé au seuil de 25 % ;
- la durée des Haltes réellement effectuées, sans injecter de zéro pour les
  Campagnes sans Halte ;
- la part des Faits portant une cause et la répétition des motifs de choix.

Tension, Crises, arrivée et Haltes sont des mesures directes du noyau. La
charge d’entretien, la causalité et la répétition sont étiquetées
`proxy-headless`. La première estime la part de capacité humaine mobilisée et
ne mesure pas le temps d’attention du joueur ; les deux autres repèrent les
Faits sans cause et les motifs répétés, mais ne prouvent pas qu’une personne
comprend une conséquence ou ressent une répétition. Ces conclusions
appartiennent aux playtests humains.

Une bande manquée apparaît dans `alertesDeBandes` et reste visible sans
masquer le reste du diagnostic. Le rapport porte alors explicitement
`referenceEquilibree: false` : la matrice reste exploitable comme diagnostic,
mais ne constitue pas une preuve que la référence est réglée.

La référence v4 issue de la matrice standard règle les trois mesures directes
sans modifier les coefficients économiques : 48,08 % de Tronçons sous tension,
trois Crises médianes, 76,56 % d’arrivée pour les premières Campagnes et
85,94 % pour les Campagnes rejouées. La cascade matérielle reste accessible
après la purification sur la branche haute même si Veille-Basse a été évitée ;
les dix sondes couvrent ensuite explicitement six décisions de maintenir le
débit, deux Récupérations immédiates et quatre pénuries persistantes. La sonde
prudente conserve en plus la marge matérielle de sa Solution finale, tandis que
la sonde opportuniste assume l’accueil risqué de la cohorte. La v3 précédente
est recalculée séparément, doit correspondre exactement à l’oracle versionné et
franchit les mêmes invariants avant la comparaison du journal candidat exact.

Les mesures `proxy-headless` sont regroupées dans `indicateursProxy`. Leur
comparaison à un seuil reste informative et ne décide jamais
`referenceEquilibree`, qui dépend uniquement des mesures directes.

Les portes automatisées qui font échouer la passe sont :

- matrice incomplète ;
- impasse ;
- récupération de Crise sans coût ;
- boucle profitable, sondée sur un aller-retour de Doctrine et sur un cycle
  Construction–Démontage complet en Halte ;
- stratégie potentiellement dominante à exposition comparable : plus de 65 %
  de sélection, plus de dix points de réussite et aucun coût compensatoire ;
- échec de l’une des deux versions de règles successives ;
- différence de Graines ou de commandes lors d’une comparaison.

## Ordre de correction

Une alerte est traitée dans cet ordre :

1. projection ou formulation ;
2. disponibilité des options et causalité ;
3. valeurs numériques.

Le rapport et sa capsule servent à localiser la première cause. Une valeur
n’est modifiée qu’après avoir exclu une information absente, une option
inaccessible ou un prérequis causal impossible. Après correction, la version
de règles est incrémentée et les deux matrices successives sont rejouées.
