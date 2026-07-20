# Prototype jetable — direction visuelle du convoi

> Trois directions de la même interface, sur une seule route, commutables par `?variant=`. Ce code répond à une question de conception et ne doit pas être promu tel quel en production.

## Question

Quelle direction 2D rend ensemble la rudesse extérieure, la chaleur intérieure et la complexité de gestion lisibles dans la coupe du convoi, la carte météo, les conseils et les événements ?

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir l’URL indiquée par Vite. Le prototype démarre sur `?variant=A`.

## Comparer

- `?variant=A` — **Coupe habitée** : le convoi et sa vie intérieure sont le centre de gravité ; les autres surfaces viennent recouvrir temporairement le monde.
- `?variant=B` — **Atlas d’exploitation** : la carte météorologique et les causes du monde restent dominantes ; le convoi, les conseils et les opérations sont arrimés autour d’elle.
- `?variant=C` — **Vigie du phare** : le Phare devient l’instrument focal ; les couches de gestion rayonnent autour de lui et les conseils prennent la forme d’un ruban narratif.

La barre flottante et les touches `←` / `→` changent de direction sans perdre l’état. Dans chaque direction :

1. ouvrir `Convoi`, `Météo`, `Conseil` et `Journal` ;
2. sélectionner plusieurs Plateformes mobiles ;
3. mettre le Temps du convoi en pause ou changer sa vitesse ;
4. confier l’Incident du filtre à l’Intendance ;
5. vérifier ce qui reste lisible à largeur réduite.

## État commun simulé

- Bassins fendus, 184 habitants, Autonomie de huit jours et marge de Chaleur de +2 ;
- cinq Plateformes mobiles au total : le Phare et les quatre Quartiers mobiles stables ;
- un Incident ordinaire, `Filtre nord — encrassé`, résoluble selon la doctrine ;
- un conseil fondé sur un fait daté, une recommandation et un enjeu personnel ;
- une carte qui distingue état réel, renseignement daté et Front de cendre.

`Liora` et son portrait sont des données synthétiques de prototype, pas un onzième profil ajouté au Vivier de compagnons. Le prototype ne tranche ni le nom d’un compagnon, ni la composition finale de l’écran, ni le moteur de rendu.

## Sources visuelles

- Concepts complets : [`output/concepts`](./output/concepts)
- Assets textuels exclus, utilisés par le code : [`src/assets`](./src/assets)
- Rendus de comparaison : [`output/screenshots`](./output/screenshots)
- Prompts et corrections de domaine : [`ASSET-PROMPTS.md`](./ASSET-PROMPTS.md)
- Comparaison concept/rendu : [`FIDELITY-LEDGER.md`](./FIDELITY-LEDGER.md)

Les textes, contrôles, alertes et états sont tous rendus dans le DOM. Les images ne portent aucun libellé nécessaire au jeu.
