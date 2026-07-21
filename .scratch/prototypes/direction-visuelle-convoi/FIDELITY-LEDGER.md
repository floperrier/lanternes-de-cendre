# Registre de fidélité

Les trois concepts sont des hypothèses à faire réagir, pas encore une direction acceptée. Le contrôle compare néanmoins chaque rendu 1440 × 900 à son concept de référence avec le même niveau d’exigence visuelle.

| Point inspecté | Preuve dans les concepts | Preuve dans les rendus | Résultat |
| --- | --- | --- | --- |
| Hiérarchie | A centre la coupe ; B centre l’atlas ; C centre le Phare et ses couches radiales | Les trois rendus conservent ces focales sans les remplacer par un tableau de bord générique | Conforme |
| Palette | A oppose ambre intérieur et cendre froide ; B emploie graphite, cuivre et cyan ; C ajoute vermillon et papier ivoire | Tokens et assets reprennent ces rôles sans teinte globale ajoutée aux images | Conforme |
| Structure physique | Un Phare et quatre Plateformes mobiles en grappe | Les trois assets retenus montrent exactement cinq plateformes totales ; les deux premiers concepts erronés ont été corrigés avant intégration | Corrigé |
| Typographie | Titres éditoriaux condensés, libellés techniques très contrastés | Titres Georgia, chrome condensé système, échelle volontaire et focus à trois pixels | Conforme au prototype |
| Conteneurs | A emploie des panneaux contextuels ; B des rails ouverts ; C des onglets et un ruban | Chaque variante possède son propre arbre de mise en page ; aucun layout partagé de type grille de cartes | Conforme |
| Conseils | Le conseil distingue une voix et une conséquence | Le DOM sépare fait connu, recommandation et enjeu personnel, conformément au contrat du Conseil | Conforme |
| Alertes | L’Incident est signalé par forme, icône, couleur et texte | Triangle, intitulé, état, effets et action sont tous exposés dans le DOM | Conforme |
| Interaction | Onglets, Temps du convoi et sélection sont visibles | Les quatre surfaces, cinq plateformes, pause, vitesses et résolution d’Incident ont été testées dans chaque direction | Conforme |
| Largeur réduite | La V1 doit rester utilisable au zoom navigateur 200 % | À 720 px de large, les trois variantes se réorganisent verticalement sans débordement horizontal | Conforme |
| Copie visible | Les concepts contiennent une copie exploratoire générée | Le rendu n’ajoute que la copie nécessaire au scénario commun ; tous les libellés utiles sont code-native | Conforme |

## Déviations intentionnelles

- **Coupe habitée** remplace les étiquettes raster posées sur le monde par une liste de plateformes accessible, et réduit la barre de ressources à Autonomie, habitants, Chaleur et Entretien. Les stocks détaillés restent volontairement secondaires.
- **Atlas d’exploitation** réduit la densité du concept à deux renseignements de route et au Front, afin de tester la lecture causale plutôt que la quantité de contenu.
- **Vigie du phare** rassemble conseil et conséquence dans un seul ruban narratif et conserve l’index des plateformes à droite ; cette direction teste une lecture focale, pas un cadran interactif.
- `Liora` est une donnée synthétique de scénario et ne modifie pas le Vivier de compagnons.
- Les images de concepts incluent des erreurs de texte et parfois de comptage propres à la génération. Les assets text-free corrigés, et non ces captures, font autorité dans le prototype.

## Corrections réalisées pendant le contrôle

- suppression des plateformes surnuméraires et remplacement de l’installation maritime de C par des châssis mobiles sur terre de cendre ;
- restauration de l’état sélectionné de l’onglet Météo dans B ;
- confinement du nom du jeu dans la navigation étroite de C ;
- exposition correcte des Plateformes mobiles comme boutons et ajout d’un nom accessible au contrôle Pause ;
- enrichissement du ruban de conseil avec l’enjeu personnel attendu par le modèle de domaine.

Aucun écart visuel matériel et corrigeable ne reste dans le périmètre du prototype. Le choix entre A, B, C ou une combinaison demeure volontairement humain.
