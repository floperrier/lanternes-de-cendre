# Porte humaine des Bassins fendus

Ce protocole collecte les preuves nécessaires à l’issue #39 sans modifier la
version pendant la vague. Il ne remplace ni les joueurs humains ni la revue
humaine de l’anglais.

## Version gelée

- Commit candidat : `204c03d`
- Graine par défaut : `CENDRE-01`
- Installation : `npm ci`
- Vérification préalable : `npm run check`
- Lancement : `npm run dev`
- Marchand : marchand de test déterministe lorsque Paddle n’est pas configuré

Toute correction fonctionnelle crée une nouvelle version candidate et remet à
zéro les sessions qui doivent être comparables. Un défaut sans effet sur les
résultats peut être documenté, mais pas corrigé silencieusement pendant la
vague.

## Participants

Recruter huit à dix personnes :

- qui n’ont jamais joué aux Lanternes de Cendre ;
- qui jouent sur navigateur de bureau, à la souris ou au clavier ;
- qui peuvent parcourir les Bassins fendus sans aide du concepteur ;
- dont au moins deux utilisent l’interface anglaise.

Attribuer un identifiant local `BF-01` à `BF-10`. Ne conserver ni nom, ni
adresse électronique, ni enregistrement audio/vidéo sans consentement séparé.
Le facilitateur peut résoudre uniquement un problème de machine ou de
connexion. Toute explication du jeu compte comme intervention et invalide la
session pour le critère d’autonomie.

## Consigne

> Dirigez la Cité-caravane jusqu’à la sortie des Bassins fendus. Pensez à voix
> haute si vous l’acceptez, mais ne cherchez pas à satisfaire le facilitateur.
> Vous pouvez interrompre la session à tout moment. Signalez ce que vous
> comprenez, ce qui vous surprend et ce qui vous paraît répétitif.

Ne révéler ni itinéraire recommandé, ni solution attendue, ni fonctionnement
des ressources, Compagnons, Colonies ou Conseils.

## Fiche de session

Copier ce bloc pour chaque participant :

```md
### BF-__

- Date :
- Commit / build :
- Langue : FR | EN
- Navigateur / système :
- Expérience des jeux de gestion : faible | moyenne | forte
- Début / fin :
- Bassins terminés sans intervention : oui | non
- Graine et archive exportée :
- Décision antérieure mémorisée, avec ses mots :
- Cause d’un revers comprise, avec ses mots :
- Compagnons reconnus sans suggestion :
- Transformation du convoi décrite :
- Exploration ou route comparée :
- Effet diplomatique attribué à une décision :
- Haltes, durées actives en minutes :
- Entretien répétitif, durée active estimée en minutes :
- Blocage ou intervention technique :
- Verbatim utile (facultatif, avec consentement) :
- Défauts reproductibles :
```

Après la partie, poser les mêmes six questions, dans cet ordre :

1. Quelle décision prise plus tôt a eu le plus d’effet ?
2. Pourquoi votre revers le plus important est-il arrivé ?
3. Quelles personnes du convoi distinguez-vous, et pourquoi ?
4. En quoi votre convoi diffère-t-il de celui du départ ?
5. Quel lieu ou itinéraire avez-vous renoncé à explorer ?
6. Qui, hors du convoi, vous fait confiance ou vous en veut, et pour quel acte ?

## Revue anglaise

Une personne bilingue compare l’intégralité des dix-sept Événements régionaux,
les lieux et les interfaces au français source et au glossaire canonique. Pour
chaque élément, elle consigne :

- sens, ton politique et degré d’incertitude conservés ;
- coûts et conséquences sans ambiguïté ajoutée ;
- termes du domaine cohérents ;
- variables et accords corrects ;
- texte utilisable à 200 % de zoom ;
- statut `approuvé` ou ticket de correction.

Une traduction assistée ou une relecture par agent ne compte pas comme
approbation humaine.

## Agrégation et décision

La porte peut être fermée seulement si toutes les conditions suivantes sont
prouvées :

- huit à dix sessions de nouveaux joueurs sont valides et terminées sans
  intervention du concepteur ;
- les six dimensions observées sont couvertes par les résultats de la vague,
  dont au moins trois Compagnons reconnaissables ;
- la médiane des Haltes normales est strictement inférieure à dix minutes ;
- l’entretien répétitif représente moins de 25 % du temps actif agrégé ;
- la revue anglaise est complète et chaque élément est approuvé ;
- chaque défaut bloquant possède une issue reproductible fermée sur le commit
  candidat ;
- le temps réel de production des lots #35 à #38 est consigné et jugé
  compatible avec la Trame de Fer, ou une réduction de périmètre est décidée
  explicitement.

Publier sur #39 un tableau anonymisé des sessions, les médianes, la liste des
issues créées et fermées, l’identité de la version candidate et la décision.
Les archives de campagne restent locales sauf consentement explicite de
partage.
