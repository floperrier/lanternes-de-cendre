# Distribution premium et démonstration d'un jeu navigateur

Recherche effectuée le 18 juillet 2026 à partir de documentations officielles. Les tarifs et conditions sont des données datées à revérifier avant contractualisation. Cette note établit les options et leurs contraintes ; elle ne choisit pas le canal commercial de la V1.

## Résumé factuel

Trois familles de canaux sont techniquement crédibles, mais elles ne vendent pas le même produit :

1. **Site propriétaire** : le jeu, la démo et le paiement restent sur le domaine de l'éditeur. Stripe Payments laisse l'éditeur marchand officiel et responsable du droit d'accès ainsi que de la fiscalité ; Paddle ou Stripe Managed Payments peuvent prendre le rôle de marchand officiel. Aucun de ces prestataires ne fournit à lui seul un système de « propriété du jeu » : le serveur du jeu doit transformer le paiement en droit d'accès.
2. **itch.io** : excellent hébergeur et canal de découverte pour une démo HTML5, avec hébergement des ressources et paiement intégrés. En revanche, sa documentation indique que les jeux déclarés « HTML Game » n'acceptent que des dons. La vente d'accès passe par le type « Downloadable » ou par un échange avec itch.io ; il n'existe donc pas de parcours documenté, natif et sans ambiguïté pour une démo HTML5 gratuite suivie du même jeu HTML5 payant.
3. **Steam** : fournit nativement vente, licence, démo séparée et transfert de sauvegarde par Steam Cloud, mais distribue des builds par système d'exploitation. Une version web doit donc devenir une application de bureau empaquetée et maintenue comme telle ; ce n'est plus une exécution dans le navigateur de l'utilisateur.

## Comparaison à faible résolution

| Canal | Exécution et hébergement | Paiement et coût public | Droit d'accès du joueur | Démonstration et sauvegarde | Contrainte structurante |
| --- | --- | --- | --- | --- | --- |
| Domaine propre + Stripe Payments | Navigateur, hébergeur choisi par l'éditeur | En France : 1,5 % + 0,25 € pour une carte standard de l'EEE ; Checkout et Payment Links inclus. Stripe Tax Basic no-code : +0,5 % par transaction | À créer dans le compte du jeu à partir d'un webhook de paiement | Démo librement conçue ; reprise locale automatique possible sur le même origin, sinon compte, synchronisation ou export/import | L'éditeur est marchand officiel et reste responsable de la fiscalité, des remboursements, du support et des droits d'accès |
| Domaine propre + Paddle | Navigateur, hébergeur choisi par l'éditeur | 5 % + 0,50 $ par transaction Checkout, sans abonnement mensuel annoncé | À créer dans le compte du jeu à partir de `transaction.completed` | Même liberté et mêmes règles web que sur le site avec Stripe | Paddle est marchand officiel et prend en charge calcul, collecte et reversement des taxes, mais impose onboarding, politique d'usage et URLs de vente approuvées |
| Domaine propre + Stripe Managed Payments | Navigateur, hébergeur choisi par l'éditeur | 3,5 % par transaction en plus des frais Payments | À créer côté jeu ; la couche marchand officiel ne remplace pas l'entitlement | Identique aux autres ventes directes | Éligibilité et disponibilité pour ce jeu et cette société à confirmer avec Stripe avant de chiffrer ce scénario |
| itch.io | HTML/CSS/JS dans une iframe, ressources hébergées par itch.io | Part itch.io réglable de 0 à 100 % (10 % dans son exemple par défaut), plus frais processeur ; modèle Payouts disponible comme marchand officiel | « Ownership » itch.io matérialisé par une clé de téléchargement pour les projets vendus | Démo/téléchargement gratuit ne confère pas la propriété ; aucun pont de sauvegarde démo-vers-full n'est documenté | Les projets de type HTML Game sont documentés comme donation-only ; le payant passe par « Downloadable » ou le support |
| Steam, avec application desktop empaquetée | Builds et depots Windows/macOS/Linux, lancés via l'écosystème Steam | 100 $ de Steam Direct par application, récupérables après 1 000 $ d'Adjusted Gross Revenue ; taux de partage communiqué dans le contrat privé | Licence Steam (« Subscription »), vérifiable par l'API Steamworks ; le contenu est licencié, non vendu | Démo avec App ID séparé ; sauvegarde partageable avec le jeu complet via Steam Cloud | Production, signature, validation et support d'un exécutable par OS ; ce n'est pas un canal de jeu navigateur natif |

## 1. Vente directe sur le domaine du jeu

### Hébergement

Un jeu statique peut être livré comme n'importe quelle application web. À titre de référence vérifiable, Cloudflare Pages accepte jusqu'à 20 000 fichiers sur l'offre gratuite et limite chaque ressource à 25 Mio ; les fichiers plus gros doivent notamment passer par R2. Les Pages Functions sont facturées comme Workers. L'offre Workers gratuite annonce 100 000 requêtes dynamiques par jour ; l'offre payante commence à 5 $ par mois, inclut 10 millions de requêtes mensuelles et annonce les requêtes de ressources statiques gratuites et illimitées. Ces chiffres montrent qu'un front statique peut coûter très peu au lancement, mais un compte joueur, la validation des achats et la sauvegarde cloud ajoutent un backend à exploiter.

Sources : [limites de Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/), [tarification de Cloudflare Workers](https://developers.cloudflare.com/workers/platform/pricing/).

### Stripe Payments : processeur, pas magasin

Stripe Checkout et Payment Links acceptent les paiements ponctuels et sont inclus sans supplément dans la tarification Payments standard. Pour une société française, Stripe affiche 1,5 % + 0,25 € pour les cartes standard de l'EEE et 2,5 % + 0,25 € pour les cartes britanniques. Stripe Tax Basic ajoute 0,5 % en intégration no-code dans les juridictions où la société est enregistrée pour collecter la taxe. Ce produit calcule la taxe, mais ne transforme pas Stripe Payments en marchand officiel : l'éditeur doit déterminer ses obligations d'enregistrement, de déclaration et de reversement.

Le droit d'accès doit être construit par le jeu. Stripe demande de traiter les événements de paiement par webhook pour garantir le fulfillment ; une simple redirection de retour après Checkout n'est pas fiable. Le modèle minimal est donc : compte joueur stable, commande Stripe liée à ce compte, webhook vérifié, entitlement permanent, et traitement explicite des remboursements et litiges.

Sources : [tarifs Stripe France](https://stripe.com/fr/pricing), [fonctionnement de Checkout](https://docs.stripe.com/payments/checkout/how-checkout-works), [fulfillment Checkout et Payment Links](https://docs.stripe.com/checkout/fulfillment).

Stripe affiche aussi **Managed Payments**, où Stripe devient marchand officiel et prend en charge conformité fiscale indirecte, fraude, litiges, facturation et support client. Le prix public est de 3,5 % par transaction réussie **en plus** des frais Payments. La page tarifaire ne suffit pas à confirmer l'éligibilité de ce jeu, de la société ou de tous les marchés visés ; cette option doit donc faire l'objet d'une validation commerciale avant comparaison finale.

Source : [tarifs Stripe France, section Managed Payments](https://stripe.com/fr/pricing).

### Paddle : marchand officiel

Paddle documente explicitement les ventes ponctuelles de produits numériques. Un produit à prix non récurrent est vendu par Paddle Checkout, puis le webhook `transaction.completed` doit déclencher l'accès, la clé ou le téléchargement. Paddle agit comme marchand officiel et annonce prendre en charge l'enregistrement fiscal, le calcul, la collecte et le reversement des taxes. Son tarif public est de 5 % + 0,50 $ par transaction Checkout, sans frais mensuels annoncés.

Les jeux sont explicitement dans le marché logiciel accepté par Paddle, sous réserve de sa politique d'usage et de son examen. Le contrat impose aussi que le fournisseur possède et exploite les URLs approuvées depuis lesquelles il vend. L'éditeur conserve ses droits de propriété intellectuelle sur le produit ; Paddle reçoit les droits nécessaires à la revente et reste libre, en tant que marchand officiel, de fixer juridiquement le prix ou droit de licence présenté à l'acheteur.

Sources : [produits numériques ponctuels chez Paddle](https://developer.paddle.com/get-started/how-paddle-works/digital-products/), [tarification Paddle](https://www.paddle.com/pricing), [politique d'usage Paddle](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle), [contrat fournisseur Paddle](https://www.paddle.com/legal/terms).

### Démonstration et transfert de sauvegarde sur le Web

Les prestataires de paiement ne définissent pas une « démo ». Le jeu peut utiliser une route gratuite et une route premium, ou un seul build dont les contenus sont ouverts par entitlement. Conserver démo et jeu complet sous le même origin et avec le même schéma de données permet de relire la sauvegarde locale : la norme HTML associe `localStorage` à l'origin de la fenêtre. Elle précise aussi que les navigateurs peuvent refuser le stockage tiers dans une iframe.

Un entitlement masqué uniquement dans le JavaScript public n'est pas un contrôle d'accès : si les ressources premium sont déjà livrées au navigateur de la démo, elles peuvent être extraites. Le choix ultérieur devra donc opposer explicitement une distribution sans DRM assumée à une livraison authentifiée des ressources ou données premium.

Conséquences :

- **Même origin, même navigateur et même profil** : la reprise peut être transparente, sans copie, si la démo et le jeu complet utilisent la même clé et une migration de format versionnée.
- **Changement de domaine, iframe tierce, autre appareil ou données de navigateur effacées** : aucune reprise locale automatique n'est garantie. Il faut un export/import signé ou, plus robuste, un compte avec sauvegarde synchronisée côté serveur.
- **Achat sans compte stable** : l'email de paiement seul est une identité fragile. Une future décision doit préciser comment l'achat est réclamé, restauré et transféré.

Source : [norme HTML, Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute).

## 2. itch.io

### Ce que la plateforme fournit

itch.io peut héberger un ZIP HTML/CSS/JS complet et l'exécuter dans une iframe sur la page du projet. Il héberge les ressources, la page de magasin, les statistiques et le paiement. L'éditeur conserve tous les droits de propriété sur son contenu ; itch.io reçoit une licence non exclusive nécessaire à l'hébergement et à la promotion. Il ne modifie pas les fichiers et n'impose pas de DRM.

Sources : [chargement des jeux HTML5](https://itch.io/docs/creators/html5), [FAQ créateur](https://itch.io/docs/creators/faq), [conditions itch.io, contenu des éditeurs](https://itch.io/docs/legal/terms#4-publisher-content).

### Limite du premium HTML5

La documentation est sans ambiguïté sur la configuration standard : les jeux de type **HTML Game** n'acceptent que des dons. Pour vendre l'accès, itch.io conseille de déclarer le projet **Downloadable** ou de contacter son support au sujet des jeux HTML5 achetables. Ainsi, deux parcours sont documentés sans développement spécifique de plateforme :

- démo HTML5 gratuite/donation-only sur itch.io, puis jeu complet téléchargeable payant ;
- projet payant de type Downloadable contenant la version complète, avec la démo distribuée séparément.

Une version complète payante qui resterait jouable dans le navigateur doit être confirmée directement avec itch.io avant d'être considérée comme acquise.

Source : [paiement des jeux HTML5 itch.io](https://itch.io/docs/creators/html5#can-i-take-payments-with-my-html5-game).

### Coûts, fiscalité et droit d'accès

La part de revenu itch.io est réglable de 0 à 100 % ; la plateforme utilise 10 % dans son exemple par défaut. Elle indique ensuite des frais processeur généralement proches de 2,9 % + 0,30 $ dans cet exemple. Deux modèles de paiement existent :

- **Direct to you** : l'éditeur est marchand officiel, relie ses comptes Stripe/PayPal et assume notamment TVA et chargebacks ;
- **Collected by itch.io / Payouts** : itch.io est marchand officiel, collecte et reverse la TVA, puis verse les fonds en USD après délai et revue. Les fonds deviennent normalement disponibles sept jours après l'achat et la revue prend typiquement 10 à 14 jours après la demande ; retenues fiscales et frais de versement dépendent de la situation du vendeur.

Pour le mode Direct, la liste Stripe publiée par itch.io ne comprend actuellement que les États-Unis, le Canada, l'Irlande et le Royaume-Uni ; elle ne liste pas la France. Le scénario d'un éditeur français doit donc vérifier PayPal ou utiliser Payouts, plutôt que supposer une connexion Stripe directe.

Un paiement crée une « ownership » itch.io matérialisée par une clé de téléchargement. Un téléchargement de démo ou un téléchargement gratuit après refus de payer ne crée pas cette propriété. Les conditions juridiques décrivent toutefois l'accès du joueur comme une licence : il ne reçoit évidemment pas la propriété intellectuelle du jeu.

Sources : [paiements et modèle marchand officiel itch.io](https://itch.io/docs/creators/payments), [prix et ownership itch.io](https://itch.io/docs/creators/pricing), [clés de téléchargement itch.io](https://itch.io/docs/creators/download-keys).

### Sauvegarde

itch.io ne documente aucun mécanisme natif de transfert de sauvegarde entre une démo et un achat. Une démo iframe et une version complète téléchargée ou hébergée ailleurs n'ont pas le même origin ni nécessairement le même système de fichiers. Le jeu doit donc fournir son propre export/import ou une sauvegarde liée à un compte indépendant d'itch.io. Le simple `localStorage` de la démo ne constitue pas une promesse de reprise.

## 3. Steam comme canal secondaire desktop

Steam documente des depots et builds pour Windows, macOS et Linux/SteamOS, pas la vente d'une URL jouée dans le navigateur externe. La documentation Steam HTML Surface permet d'afficher du HTML5 à l'intérieur d'une application via Chromium Embedded Framework, mais demande elle aussi une application intégrée à Steamworks. La conséquence — une **inférence technique** à valider par un prototype de packaging — est qu'un jeu web doit être livré comme exécutable desktop ou application intégrant une surface web.

Sources : [plateformes et builds Steam](https://partner.steamgames.com/doc/store/application/platforms), [Steam HTML Surface](https://partner.steamgames.com/doc/features/html_surface).

Steam facture 100 $ par nouvelle application. Ce montant n'est pas remboursable, mais est récupérable dans un versement après 1 000 $ d'Adjusted Gross Revenue. Le pourcentage de partage des revenus n'est pas publié dans la documentation publique consultée : Valve renvoie au Steam Distribution Agreement signé. Une comparaison financière sérieuse ne doit donc pas inscrire un taux non vérifié comme fait officiel.

Sources : [Steam Direct Fee](https://partner.steamgames.com/doc/gettingstarted/appfee), [FAQ Steam sur partage et versements](https://partner.steamgames.com/doc/finance/payments_salesreporting/faq).

La démo reçoit son propre App ID, ses depots, son build et sa checklist. Steam autorise le partage de depots avec le jeu complet et documente explicitement la sauvegarde de la démo dans le Steam Cloud du jeu complet, afin que l'achat reprenne la partie. L'accès premium peut être vérifié par `ISteamApps::BIsSubscribedApp`. Pour le joueur, Steam parle d'une « Subscription » : le contenu est licencié et non vendu, sans transfert de propriété.

Sources : [démos Steam et transfert de sauvegarde](https://partner.steamgames.com/doc/store/application/demos), [Steam Subscriber Agreement](https://store.steampowered.com/subscriber_agreement/).

## Données nécessaires à la décision ultérieure

La décision commerciale ne peut pas être prise sur les seuls pourcentages. Il faut fixer ou mesurer :

1. **Prix public et marchés de lancement** : le fixe par transaction favorise les prix plus élevés ; le choix MoR/PSP dépend fortement du nombre de territoires réellement ouverts.
2. **Capacité fiscale et support** : personne morale vendeuse, immatriculations TVA déjà détenues, politique de remboursement, support acheteur, traitement des litiges et capacité comptable.
3. **Promesse de possession** : compte obligatoire ou non, accès hors ligne, restauration d'achat, politique en cas d'arrêt des serveurs, DRM acceptable, licence utilisateur.
4. **Promesse de sauvegarde** : même appareil seulement, synchronisation multiappareil, export manuel, et transfert éventuel entre site, itch.io et Steam.
5. **Acceptation d'un wrapper desktop** : OS pris en charge, signature/notarisation, mises à jour, QA et différence autorisée entre versions web et Steam.
6. **Économie d'hébergement** : poids du build et des fichiers unitaires, trafic estimé, coût du backend d'identité/entitlement/sauvegarde, journalisation et sauvegardes serveur.
7. **Valeur de la découverte** : trafic mesuré de chaque page, taux démo-vers-achat, taux d'activation après achat et coût d'acquisition hors plateforme.
8. **Validation fournisseur** : réponse écrite d'itch.io sur le HTML5 payant, approbation Paddle du produit et des URLs, éligibilité Stripe Managed Payments, et taux Steam contractuel après onboarding.

## Points qu'un prototype devra vérifier

- Persistance réelle de la sauvegarde dans les principaux navigateurs, y compris blocage du stockage tiers dans l'iframe itch.io.
- Migration sans perte d'une sauvegarde de démo vers le schéma du jeu complet.
- Restauration d'un achat Stripe/Paddle après changement de navigateur sans exposer le webhook ou accepter une simple adresse email comme preuve.
- Taille et performances du build dans les limites de l'hébergeur ; stratégie pour les ressources de plus de 25 Mio si Cloudflare Pages est utilisé.
- Packaging desktop et partage Steam Cloud entre les deux App IDs, si Steam reste dans le périmètre.
