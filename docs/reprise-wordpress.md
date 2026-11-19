# Reprise des textes de l'ancien site (WordPress) dans Sanity

Les textes de l'ancien site ont été repris **en brouillon** dans le Studio Sanity (rien n'est publié). Ce document dit où les retrouver et quels passages réécrire avant publication.

> Script utilisé : `scripts/import-wordpress.mjs` (simulation puis écriture ; il ne remplace jamais un contenu déjà saisi).

## 1. Ce qui a été repris, et où le trouver

| Ancienne page | Dans le Studio | Champ |
|---|---|---|
| `/` (accueil) | **Page d'accueil** | onglet « Ancien site » → *Texte de l'ancien site (à reprendre)* + Référencement |
| `/champagne-hotel-restaurants-et-cavistes/` | **Espace Professionnels** | onglet « Ancien site » + Référencement |
| `/cse-et-cadeaux-dentreprise/` | **Entreprises & CSE** | onglet « Ancien site » + Référencement |
| `/tasting-troyes/` | **Espace Particuliers** | onglet « Ancien site » + Référencement |
| `/la-cote-des-bar/` | **Terroirs → Côte des Bar** | Accroche (ancien titre H1), Photo, Texte de la page, Référencement |
| `/montgueux/` | **Terroirs → Montgueux** | idem |
| `/villenauxe-la-grande/` | **Terroirs → Villenauxe-la-Grande** | idem |
| *(pas de page)* | **Terroirs → Les Riceys** | fiche vide, à compléter |
| `/tout-savoir-sur-le-champagne/` | **Autres pages → Tout savoir sur le champagne** | Titre, Texte, Référencement |
| `/recettes-accords-mets-champagne/` | **Autres pages → Recettes et accords** | Titre, Texte, Référencement |
| `/vignerons-de-laube-devenez-partenaire-de-nos-degustations/` | **Autres pages → Vignerons : devenez partenaire** | Titre, Texte, Référencement |
| 7 articles | **Articles** | Titre, Adresse (identique à l'ancienne), Rubrique, Date, Résumé, Photo, Texte, Référencement |

**Pourquoi un champ « Ancien site » pour les 4 espaces ?** Leur structure a changé (3 entrées, arguments, offres…). L'ancien texte y est rangé tel quel, **sans être affiché sur le site** : copiez-en les passages utiles dans les nouveaux champs, puis videz ce champ.

Repris en **français uniquement** : les champs EN, NL, IT, DE sont vides (avertissement orange « Traduction à compléter » dans le Studio). Je pourrai proposer les traductions une fois les textes français validés.

Les boutons de l'ancien site (« Accords Mets et Champagne »…) ont été gardés comme simples liens. Les images ont été copiées dans Sanity (version la plus grande disponible).

## Mise à jour : corrections appliquées dans les brouillons

À votre demande, les propositions ci-dessous ont été **appliquées directement dans les brouillons** (rien n'est publié) : 60 reformulations dans 16 documents, coquilles corrigées (« suchis », « landemain », « ci, plus » → « Ici, plus », « hectares . », « priviligiée »), emojis retirés (😉, 👉, 🍾), descriptions Google refaites (pesto, sushis, boudin, recettes, tout savoir, Entreprises & CSE, accueil, Côte des Bar), et 46 textes alternatifs d'images remplacés par de vraies descriptions. Seul « Route du Champagne en fête » est conservé (nom propre). Une sauvegarde de l'état précédent a été faite avant les modifications.

**Images à remplacer (non modifiées)** :
- Accueil, onglet « Ancien site » : l'**ancien logo** (bouteille sur rond pêche avec texte superposé) — interdit par le brand book.
- Espace Particuliers, onglet « Ancien site » : photo de banque d'images d'une **soirée avec verres levés** — scène festive à éviter (loi Évin, brand book).
- Terroir Montgueux : la photo principale montre des **maisons à pans de bois de Troyes**, pas Montgueux.
- Photos de banque d'images (tracteur vu du ciel, coffrets, table gastronomique, mains dans les vignes) : à remplacer par vos photos quand vous en aurez.
- L'ancienne adresse e-mail de l'agence, présente dans les anciens textes (Entreprises & CSE, Particuliers, Pro, Vignerons partenaires), a été remplacée partout par contact@champagnedelaube.fr (12 occurrences, liens compris).

## 2. Passages à réécrire (loi Évin)

*Rappel du brand book : informer (terroir, vignerons, cépages, méthodes, accords) plutôt que faire rêver ; ne pas associer le champagne à la fête, à la séduction, à la réussite sociale ou au plaisir de boire ; pas d'incitation à consommer. Ces propositions ne remplacent pas l'avis d'un juriste.*

### Entreprises & CSE (onglet « Ancien site »)
| Actuel | Problème | Proposition |
|---|---|---|
| « Offrir du Champagne à ses salariés, vos clients ou vos partenaires, c'est l'assurance de faire plaisir. » | Incitation + plaisir | « Un coffret de champagnes de vignerons de l'Aube fait découvrir un terroir et les personnes qui le cultivent. » |
| « Offrez le meilleur du terroir aubois à vos collaborateurs. » (aussi dans la description Google) | Incitation + superlatif | « Des coffrets composés avec des vignerons indépendants de l'Aube, pour vos collaborateurs et vos clients. » |

### Espace Particuliers (onglet « Ancien site »)
| Actuel | Problème | Proposition |
|---|---|---|
| « …ou vous avez simplement soif de découvertes ? » | Jeu de mots sur la soif | « …ou vous souhaitez simplement découvrir les vignerons de l'Aube ? » |
| « Dites-nous ce qui vous ferait plaisir en remplissant le formulaire ci-dessous. » | Plaisir | « Décrivez-nous votre projet dans le formulaire ci-dessous. » |
| « …pour des moments de partage décomplexés. » | Convivialité associée à l'alcool (à la limite) | « …pour des dégustations commentées, en petit comité. » |

### Page d'accueil (onglet « Ancien site »)
| Actuel | Problème | Proposition |
|---|---|---|
| « Découvrez nos suggestions gourmandes pour sublimer les champagnes. » | « Sublimer » : valorisation subjective | « Nos idées d'accords entre plats et champagnes de vignerons. » |

### Tout savoir sur le champagne
| Actuel | Problème | Proposition |
|---|---|---|
| « Le champagne est bien plus qu'une boisson festive : c'est un vin effervescent unique… » (texte **et** description Google) | Association à la fête | « Le champagne est un vin effervescent produit exclusivement dans l'aire délimitée de la Champagne, selon la méthode champenoise. » |
| « …l'Aube […] est un terroir incontournable… » | Superlatif | « …l'Aube […] est un terroir reconnu pour ses coteaux et ses vignes de pinot noir. » |
| « …le champagne accompagne aussi bien les moments d'exception que les repas… » | Moments d'exception | « …le champagne accompagne de nombreux plats, de l'entrée au dessert. » |
| « …cette boisson d'exception… et comment mieux le déguster. » | Superlatif | « …ce vin, ses terroirs, ses cépages et ses méthodes d'élaboration. » |

### Recettes et accords (page)
| Actuel | Problème | Proposition |
|---|---|---|
| Titre et titre Google : « …astuces pour sublimer vos plats » | « Sublimer » | « Recettes et accords mets-champagne : nos idées par plat et par cépage » |
| Description Google : « …pour sublimer vos repas. Brut, rosé… » | « Sublimer » | « Des recettes et des idées d'accords mets-champagne : blanc de noirs, blanc de blancs, rosé, avec les cuvées de vignerons de l'Aube. » |
| « Soyez surpris par le champagne, il sera excellent pour sublimer les saveurs… » | Injonction + superlatif | « Pourquoi un champagne peu dosé s'accorde avec le saumon, l'avocat et le riz vinaigré. » |
| « …chaque champagne trouve son accord idéal. » / « l'accord parfait » | Superlatif (léger) | « …chaque style de champagne a ses accords. » |

### Terroir Montgueux
| Actuel | Problème | Proposition |
|---|---|---|
| « …offre une maturité exceptionnelle aux raisins… » | Superlatif | « …favorise une bonne maturité des raisins… » |
| « Il a su séduire de grands noms de la Champagne… » | Séduction | « De grands noms de la Champagne s'y approvisionnent, aux côtés de vignerons indépendants… » |
| « …le joyau caché de l'Aube » | Superlatif (léger, acceptable) | « …un vignoble encore méconnu de l'Aube » |

### Article « Sauté d'agneau & Champagne 100 % Meunier »
| Actuel | Problème | Proposition |
|---|---|---|
| « Pour sublimer ce sauté d'agneau à l'orange, nous avons sélectionné… » | « Sublimer » | « Pour accompagner ce sauté d'agneau à l'orange, nous avons choisi… » |
| « Une tension qui purifie le palais à chaque gorgée et relance la gourmandise de la bouchée suivante. » | Incitation à boire | « Sa fraîcheur équilibre le gras de l'agneau. » |
| « C'est encore meilleur le landemain 😉 » | Emoji (brand book) + coquille | « Ce plat est encore meilleur réchauffé le lendemain. » |

### Article « Pâtes au pesto »
| Actuel | Problème | Proposition |
|---|---|---|
| « …capable d'équilibrer la richesse de la sauce et de sublimer les saveurs… » | « Sublimer » | « …d'équilibrer la richesse de la sauce sans dominer le basilic. » |
| « Pour sublimer ce plat parfumé et généreux, nous avons ouvert… » | « Sublimer » | « Pour accompagner ce plat, nous avons choisi… » |
| « …cette cuvée récompensée séduit par ses arômes… » | Séduction | « …cette cuvée récompensée présente des arômes de fruits jaunes… » |
| *« Route du Champagne en fête »* | Nom propre d'un événement | **À garder** tel quel. |

### Article « Que boire avec des sushis ? »
| Actuel | Problème | Proposition |
|---|---|---|
| « Pour sublimer ces saveurs, il faut un Champagne… » | « Sublimer » | « Pour accompagner ces saveurs, il faut un champagne… » |
| « Chaque gorgée vient nettoyer et préparer le palais, rendant chaque bouchée encore plus savoureuse. » | Incitation à boire | « Sa fraîcheur et son effervescence équilibrent le gras du saumon et de l'avocat. » |
| Description Google « Soyez surpris par le champagne, il sera excellent pour sublimer… » | Injonction + superlatif | « Sushis et champagne : pourquoi un champagne peu dosé, comme un pinot gris de la Côte des Bar, s'accorde avec le saumon et le riz vinaigré. » |

### Article « Aumônières de boudin blanc »
| Actuel | Problème | Proposition |
|---|---|---|
| « Les fêtes de fin d'année sont l'occasion parfaite pour marier cuisine raffinée et bulles de caractère. » | Fête | « Le boudin blanc de Rethel s'accorde avec un blanc de noirs de la Côte des Bar. » |
| « …un accord à la fois gourmand, élégant et festif, où chaque bouchée appelle une gorgée… » | Fête + incitation | « …un accord où l'ampleur du pinot noir répond à la richesse du boudin blanc. » |
| « Un accord à tester pour vos repas de fête : » | Fête | « La recette : » |
| « …une valeur sûre pour surprendre vos invités et sublimer vos repas de fin d'année. » | Incitation | « …cet accord convient en entrée ou en plat léger. » |
| « …idéal pour vos repas de fêtes. » | Fête | À supprimer. |
| Description Google « …alliance gourmande et festive et sublimer vos repas de fin d'année » | Fête | « Aumônières de boudin blanc aux pommes et champagne blanc de noirs : la recette et l'accord, avec un vigneron de la Côte des Bar. » |

### Article « L'importance des accords mets et champagne »
| Actuel | Problème | Proposition |
|---|---|---|
| « …je pensais que le champagne était réservé aux desserts ou aux moments de fête. » | Fête | « …je pensais que le champagne était réservé au dessert. » |
| « Associer un plat et un champagne n'est pas qu'une question de prestige : » | Prestige | « Associer un plat et un champagne n'est pas qu'une question d'habitude : » |
| « …redécouvrir le champagne autrement que lors des seules occasions festives. » | Fête | « …redécouvrir le champagne tout au long d'un repas. » |
| « …notez celles qui vous séduisent le plus. » | Séduction | « …notez celles que vous préférez. » |
| « Le champagne, loin d'être uniquement un symbole de fête, est un vin à part entière capable de sublimer un repas complet. » | Fête + « sublimer » | « Le champagne est un vin à part entière, qui peut accompagner un repas complet. » |
| « …offre une expérience gustative inoubliable. » | Superlatif | « …permet de mieux connaître les cuvées et ceux qui les font. » |

**Fausses alertes (rien à changer)** : « la biodynamie, l'étape ultime » (article labels), « le même cépage peut offrir une signature différente » (article cépage).

## 3. Autres corrections repérées

Bilan de l'import : 18 brouillons créés, 31 images copiées dans Sanity.


- **Description Google en double** : l'article « Pâtes au pesto » a la même description que « Aumônières de boudin blanc » (à remplacer, voir ci-dessus).
- **Coquilles d'origine** (reprises telles quelles) : « suchis » (titre de l'article sushis, à corriger en « sushis ») ; « ci, plus de 90 % » au lieu de « Ici, plus de 90 % » (Montgueux) ; « landemain » (article agneau) ; « Superficie : Environ 186,6 hectares . » (espace avant le point).
- **Textes alternatifs des images** : beaucoup reprennent le nom du fichier (« sushis et champagne 02 »). À réécrire en décrivant la photo.
- **Image cassée** : l'article « Qu'est-ce qu'un cépage ? » contenait une image qui n'existe plus sur l'ancien serveur (erreur 404) ; elle n'a pas été reprise. Ajoutez une nouvelle photo si besoin.
- **Les Riceys** : pas de page sur l'ancien site ; la fiche est à rédiger.
- **Vignerons cités dans les articles** (Binon-Coquard, Daniel Pétré & Fils, Guy Lamoureux) : sans rémunération, pas de mention « Collaboration commerciale » (case laissée décochée).
- **Traductions** : à faire après validation des textes français.
