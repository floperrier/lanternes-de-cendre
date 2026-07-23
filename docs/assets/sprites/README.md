# Pipeline de sprites

Le catalogue versionné se trouve dans `art/sprites/catalogue.yaml`. Les
planches brutes, frames intermédiaires et aperçus sont écrits sous
`art/sprites/work/`, qui reste hors Git.

## Créer un sprite

1. Ajouter un seed PNG transparent sous `art/sprites/seeds/`.
2. Ajouter son prompt sous `art/sprites/prompts/`.
3. Ajouter la spécification dans `art/sprites/catalogue.yaml`.
4. Ajouter la provenance du seed sous
   `docs/assets/sprites/<id>.seed.provenance.json`.
5. Générer et inspecter le brouillon.

```sh
OPENAI_API_KEY=... npm run sprites:draft -- cite.fumee-01
```

La commande construit un canvas de référence, envoie une seule demande
d’édition pour la planche entière, normalise toutes les cases avec une échelle
commune et une ancre basse centrée, puis produit :

```text
art/sprites/work/<id>/
  edit-canvas.png
  raw.png
  frames/*.png
  production/<id>.png
  production/<id>.json
  preview.png
```

Une génération est réutilisée tant que le seed, le prompt et les paramètres
n’ont pas changé. `--force` ignore ce cache.

## Importer une planche existante

Une sortie d’un autre outil peut être redimensionnée, normalisée et contrôlée
par le même pipeline :

```sh
npm run sprites:ingest -- cite.fumee-01 ./planche-transparente.png
```

Pour initialiser simultanément le seed depuis la première case :

```sh
npm run sprites:ingest -- cite.fumee-01 ./planche-transparente.png \
  --seed-from-frame-1
```

L’import attend un PNG déjà détouré. Il préserve le ratio, centre la planche
sur le canvas configuré puis exécute les mêmes contrôles que la génération API.

Si une planche est déjà présente sous `art/sprites/work/<id>/raw.png` :

```sh
npm run sprites:process -- cite.fumee-01
```

## Approuver et publier

La prévisualisation doit être inspectée à la taille du jeu. Quand le sprite est
accepté, modifier sa section dans le catalogue :

```yaml
publication:
  status: approved
  reviewer: "Nom du reviewer"
```

Puis publier :

```sh
npm run sprites:publish -- cite.fumee-01
```

La commande refuse les brouillons. Elle copie l’atlas PNG et son JSON PixiJS
vers `public/assets/sprites/`, écrit la provenance et vérifie les empreintes.

## Contrôles automatisés

```sh
npm run sprites:check
```

Les contrôles couvrent :

- validité et unicité du catalogue ;
- existence et empreinte de la provenance des seeds ;
- dimensions, canal alpha et nombre de frames ;
- contenu non vide et absence de découpe sur les bords ;
- ancre basse commune et dérive maximale des dimensions ;
- cohérence de l’atlas PixiJS ;
- empreintes et reviewer des sprites publiés.

`npm run check` inclut cette vérification, mais ne lance jamais de génération
distante. La CI reste donc déterministe et sans coût API.
