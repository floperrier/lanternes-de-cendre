# PROTOTYPE — Contrat recommandé d’une expédition commandée à distance

Question testée : **quelle répartition entre préparation du Porte-Lanterne, autonomie du compagnon responsable et ordres transmis à distance rend une Opération cartographiée tendue et compréhensible ?**

Cette seconde génération applique la décision de l’issue #12 au scénario de l’issue #11. Elle ne compare plus trois coques concurrentes : elle matérialise une seule recommandation à valider.

- La **Coupe habitée** reste la coque globale et garde le convoi perceptible.
- L’**Atlas d’exploitation** sert à préparer et suivre l’Opération cartographiée.
- Le ruban de **Vigie du phare** apparaît seulement lorsqu’un ordre important exige fait connu, recommandation, enjeu personnel et conséquences.
- L’Expédition reste un outil contextuel d’**Atelier–Opérations**, pas une cinquième surface principale.

Les illustrations text-free de l’issue #12 sont réutilisées ; tout texte, contrôle et état nécessaire reste en DOM.

## Lancer

Depuis ce worktree :

```sh
./run-prototype-expedition-contract.sh
```

Puis ouvrir <http://127.0.0.1:4174/prototype-expedition-contract.html>.

Captures de référence :

- [Préparation recommandée](output/playwright/recommended-preparation.png)
- [Suivi cartographié](output/playwright/recommended-following.png)
- [Ordre important](output/playwright/recommended-decision.png)
- [Bilan de retour](output/playwright/recommended-result.png)
- [Bilan en largeur étroite](output/playwright/recommended-result-narrow.png)

## Parcours à essayer

1. Lire le mandat borné, puis ouvrir les sources des estimations.
2. Lancer l’Expédition et atteindre les jalons cartographiés.
3. Constater que Liora traite seule le détour et l’incident couverts par le mandat.
4. Observer l’arrêt de l’Expédition lorsque l’objectif, le gain et le risque changent ensemble.
5. Vérifier que le Temps du convoi continue et peut être suspendu manuellement.
6. Choisir l’ordre recommandé **Couper puis contourner**, recevoir l’équipe et lire le bilan causal.
7. Ouvrir Météo, Conseil et Journal pour vérifier la spécialisation des quatre surfaces.

## Décisions proposées à validation

1. **Contrat de préparation** — un objectif et une issue de repli, une responsable, un groupe agrégé, un équipement spécialisé, une enveloppe d’autonomie et un seuil de repli. Pas de microgestion individuelle.
2. **Autonomie** — la responsable absorbe tous les écarts réversibles couverts par le mandat et les inscrit dans le Journal causal.
3. **Rappels fixes** — départ, jalon cartographié, rupture du mandat et retour ; leur fréquence n’est pas un réglage joueur.
4. **Ordre à distance** — sollicitation seulement lors d’un changement d’objectif, du franchissement du seuil de repli, d’une conséquence irréversible ou d’un coût hors mandat. Le joueur choisit une intention et un compromis, jamais des déplacements directs.
5. **Temps** — l’équipe attend lors d’un ordre requis, mais le convoi continue. Seule une Crise à conséquence immédiate suspend automatiquement le Temps du convoi ; la pause manuelle reste toujours disponible.
6. **Information** — coûts et coûts d’opportunité exacts ; durée et gains incertains sous forme d’intervalles avec source et âge ; risque nommé, mitigation et pire conséquence crédible. Aucun pourcentage de probabilité.
7. **Retour** — comparaison prévu/réalisé, explication causale des écarts et mémoire des coûts, gains, ordres, blessures, renseignements, engagements ou cicatrices. Une issue de repli peut produire un succès partiel.
8. **Opérations simultanées** — le modèle en accepte plusieurs, mais l’interface met en avant celle qui attend un ordre. Leur plafond numérique reste une question d’équilibrage, pas une décision de ce prototype.

Ces choix restent des propositions tant qu’ils n’ont pas reçu de verdict humain sur le ticket Wayfinder.

## Statut

Code jetable, sans persistance, backend, moteur de jeu ni tests de production. Le prototype sert à valider un contrat d’information et de commande ; il ne doit pas être fusionné tel quel dans la V1.
