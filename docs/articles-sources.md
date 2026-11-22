# Articles du Mag en brouillon (mission 2) : sources et points d'attention

Les 14 articles sont **en brouillon** dans le Studio (Le Mag du Champagne > Articles). Ils ne sont pas publiés, donc absents du site.
- **Texte de travail** : un fichier Markdown par article dans `content/articles-brouillons/`. Ils ont été envoyés dans Sanity avec un petit script, sans aucun changement du code du site.
- **Langue** : français seulement (pas encore de version anglaise).
- **Liens internes** : vers des pages publiées seulement. Les liens entre ces nouveaux articles seront à ajouter une fois publiés.
- **Questions-réponses** : le Studio n'a pas de champ dédié pour les articles, elles sont donc dans le texte, sous l'intertitre « Vos questions ».

## Photos

| Article | Photo principale | Origine |
|---|---|---|
| Rosé des Riceys | verre de rosé aux Riceys (Route du Champagne en fête 2025) | **nos photos** ; légende sans dire que c'est du Rosé des Riceys |
| Rosé de saignée | verre aux reflets rouges | [Pixabay n° 1004255](https://pixabay.com/photos/red-wine-glass-drink-wine-glass-1004255/), Quadronet_Webdesign, légende « Illustration » (Pixabay le classe « vin rouge », d'où le texte alternatif neutre) |
| Coteaux champenois | grappes de pinot noir en véraison | nos photos |
| Prosecco ou champagne | deux flûtes sur fond noir | [Pixabay n° 6786251](https://pixabay.com/photos/sparkling-wine-date-of-birth-party-6786251/), Fotografie_Reimann, « Illustration » |
| Moutard*Dangin | vendanges 2026 à Celles-sur-Ource ; dans le texte : caisses à Polisy, grappe à Polisy | **nos photos des vendanges 2026 chez eux** |
| Mennetrier | jeune plantation de vigne | nos photos, légende « Illustration » (en attendant une vraie photo du domaine) |
| Tailles de bouteilles | **illustration originale** (schéma à l'échelle, couleurs du brand book, 1600 × 900, 96 Ko) | création ; script `content/photos/formats-bouteilles-champagne.py` (aucun changement du code du site) |
| Whisky dans l'Aube | **aucune** : pas de photo « whisky-soligny » dans la Médiathèque | emplacement signalé dans le texte |
| Température de service | serveur avec un plateau de flûtes | Médiathèque (StockSnap, déjà importée) |
| Brut, extra brut | flûtes et bulles sur fond noir | [Pixabay n° 7626984](https://pixabay.com/photos/sparkling-wine-alcoholic-drink-7626984/), Fotografie_Reimann, « Illustration » |
| Champagne et chaource | fromages à pâte molle | [Pixabay n° 1433504](https://pixabay.com/photos/cheese-tray-cheeses-french-cheese-1433504/), JillWellington, « Illustration » (ce n'est pas forcément du chaource) |
| Andouillette | saucisses grillées | [Pixabay n° 3524649](https://pixabay.com/photos/sausages-barbecue-grill-3524649/), webandi, « Illustration » (ce n'est pas une andouillette) |
| Cidre du Pays d'Othe | verger et tonneaux de pommes | [Pixabay n° 1872997](https://pixabay.com/photos/apples-fruits-orchard-nature-trees-1872997/), lumix2004, « Illustration » (pas le Pays d'Othe) |
| Brasseries de l'Aube | planche de dégustation de bières | [Pixabay n° 2370783](https://pixabay.com/photos/beer-varieties-different-sorts-2370783/), PeterKraayvanger, « Illustration » |

Les photos Pixabay sont au maximum permis par l'API (1280 px), sans métadonnées, avec crédit et les étiquettes `banque-images` et `banque-pixabay` (lot `content/photos/lots/pixabay-4.json`).

## Sources par article

### 1. Le Rosé des Riceys, la rareté de l'Aube
- **Appellation** : AOC par décret du 8 décembre 1947 ; 100 % pinot noir ; seule commune des Riceys ; vin tranquille. Sources : [INAO – Rosé des Riceys](https://www.inao.gouv.fr/produit/rose-des-riceys-17489), [cahier des charges (INAO)](https://extranet.inao.gouv.fr/fichier/3-CDC-Ros%C3%A9-des-Riceys-PNO.pdf).
- **Vinification** : vendange entière avec macération semi-carbonique. Source : cahier des charges, [version publiée au BO Agri (SGV Champagne)](https://www.sgv-champagne.fr/wp-content/uploads/2020/09/Cahier-des-Charges-AOC-Rose%cc%81-des-Riceys.pdf).
- **Millésime obligatoire** : [INAO](https://www.inao.gouv.fr/produit/rose-des-riceys-17489) et [Vinovonk](https://vinovonk.com/en/articles/les-riceys-zuid-champagne-aube-rose/).
- **Le village** : trois appellations ; plus de 840 ha ; trois anciens bourgs ; environ 350 ha délimités. Voir `docs/terroirs-sources.md` (office de tourisme Côte des Bar, Aube Champagne, les-riceys.fr).
- **Non repris** : rendement, degré, durée de macération (une seule source, ou sources en désaccord) ; « vin de garde » (non vérifié).

### 2. Qu'est-ce qu'un rosé de saignée ?
- **Les deux méthodes** : assemblage (ajout de vin rouge tranquille de Champagne avant la prise de mousse, méthode la plus répandue) et saignée ou macération. Sources : [Vinovonk – rosé d'assemblage](https://vinovonk.com/en/lexicon/rose-d-assemblage/), [Vinovonk – rosé de saignée](https://vinovonk.com/en/lexicon/rose-de-saignee/), [Decanter – saignée](https://www.decanter.com/learn/what-does-saignee-mean-in-rose-wine-443878/), [iDealwine](https://www.idealwine.net/les-secrets-du-champagne-rose/).
- **Le mélange blanc et rouge, interdit en principe pour les vins tranquilles** : [règlement (UE) 2019/934](https://eur-lex.europa.eu/eli/reg_del/2019/934/oj) (vins sans appellation) et [Vinovonk](https://vinovonk.com/en/lexicon/rose-d-assemblage/). **Volontairement non écrit** : que la Champagne serait « la seule appellation » à l'autoriser (texte officiel incomplet sur ce point).
- **Non repris** : la part de vin rouge (« 5 à 20 % » : une seule source).

### 3. Connaissez-vous le Coteaux champenois ?
- **AOC du 21 août 1974**, qui remplace les « vins nature de la Champagne » ; vins tranquilles rouges, blancs et rosés ; aire et cépages de l'AOC Champagne. Sources : [ABC du vin](https://www.abcduvin.com/index.php/term/,6c53ad9f5fa7aa706e53abaaaeaa.xhtml), [Plus de bulles](https://www.plus-de-bulles.com/blog/coteaux-champenois-ancetre-champagne/), [La Champagne viticole](https://lachampagneviticole.fr/en/produire-des-vins-tranquilles/), [Wikipédia](https://en.wikipedia.org/wiki/Coteaux_Champenois_AOC).
- **Rouge de Bouzy, le plus connu** : [Club Oenologique](https://cluboenologique.com/report/coteaux-champenois-the-forgotten-still-wine-of-champagne/), [Wine with Seth](https://www.winewithseth.com/winewiki/bouzy/).
- **Non repris** : volumes produits (chiffres contradictoires).

### 4. Prosecco ou champagne : quelles différences ? (1 628 mots)
- **Prosecco** :
  - glera au moins 85 % ; DOC sur 9 provinces de Vénétie et du Frioul-Vénétie Julienne, reconnue en 2009 ; DOCG Conegliano Valdobbiadene et Asolo ;
  - méthode Martinotti ou Charmat (cuve close).
  - Sources : [TuttoBollicine – disciplinari](https://www.tuttobollicine.com/post/5ea98f0dbe7ea0e3feffed19/prosecco-i-disciplinari-di-produzione.html), [Consorzio Conegliano Valdobbiadene](https://www.prosecco.it/wp-content/uploads/2024/05/Libretto-Giallo.pdf), [Pagus](https://www.paguswinetours.com/it/territori/prosecco/).
- **Champagne** : au moins 15 mois après le tirage dont 12 sur lies ; 3 ans pour un millésimé. Sources : [Millésima](https://www.millesima.fr/blog/la-fabrication-du-champagne-les-coulisses-de-la-methode-champenoise.html), [FCVC](https://www.fcvc.fr/duree-vieillissement-ideale-selon-type-champagne.html) ; cahier des charges de l'AOC Champagne (INAO).
- **« Extra dry » plus sucré que « brut »** : seuils officiels ([DGCCRF](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/champagne-connaitre-le-langage-des-etiquettes)).
- **Volontairement non repris** :
  - aucun prix chiffré : la différence de prix est expliquée par les coûts (raisin, vendange manuelle, méthode, temps) ;
  - aucune pression en bars ;
  - aucune comparaison avec les « grandes marques ».

### 5. Moutard*Dangin
- **Source unique**, comme demandé : le [site officiel](https://www.champagnemoutarddangin.fr/), pages [Notre domaine](https://www.champagnemoutarddangin.fr/notre-domaine), [Cuvées](https://www.champagnemoutarddangin.fr/cuvées-traditionnelles) et [Œnotourisme](https://www.champagnemoutarddangin.fr/general-8).
- **Repris** : Polisy ; 5 générations ; dates 1860, 1875, 1930, 1985, 1998, 2021 (HVE et VDC, sans herbicide), 2022 ; l'équipe ; les cépages, dont le pinot blanc ; le statut de vigneron-négociant ; les cuvées.
- **Volontairement non repris** : les prix, les horaires de visite et les notes des critiques. « Maison » n'est utilisé que dans le titre que vous avez donné ; le texte dit « domaine ».

### 6. Mennetrier
- **Source unique** : le [site officiel](https://champagne-mennetrier.com/), pages [Le domaine](https://champagne-mennetrier.com/le-domaine/) et [Nos champagnes](https://champagne-mennetrier.com/nos-champagnes-mennetrier/). Orthographe vérifiée : **Mennetrier**, à **Arrentières** (10200).
- **Repris** : la famille depuis le XVIIIe siècle ; plus de 6 générations ; Jean Mennetrier et Jacqueline Chaput, qui plantent du chardonnay à partir de 1960 ; pinot noir majoritaire ; tout est fait à la propriété ; vendange à la main ; environ 5 ans en cave ; les cuvées.
- **Volontairement non repris** : les médailles et les prix.

### 7. Les tailles de bouteilles
- **Contenances** : [champagne.education – fiche des formats](https://www.champagne.education/sites/default/files/2024-05/Fiche-Formats-Bouteilles-Champagne-FR.pdf) et [champagne.fr (Comité Champagne)](https://www.champagne.fr/en/about-champagne/a-great-blended-wine/champagne-bottles-bottling), recoupés avec [Vinabox](https://www.vinabox.fr/guide-vin/tailles-bouteilles-champagne/) et [Taille-bouteille-vin](https://www.taille-bouteille-vin.fr/champagne/tailles-bouteilles-champagne.php).
- **À noter** : le **Souverain (26,25 L)** n'est donné avec un volume précis que par une partie des sources.

### 8. Whisky dans l'Aube
- **Distillerie de Soligny** :
  - [site officiel](https://www.solignywhisky.fr/) : orge des parcelles voisines, circuit court ; gamme Air de Plaine et Vents d'Anges ;
  - [article « Aube »](https://www.solignywhisky.fr/alambic-radio/premier-whisky-single-malt-aube/) : embouteillé le 28 octobre 2023, 1 308 bouteilles, 4 fûts dont pinot noir et chardonnay, distillations de 2020 ;
  - famille Godier : [L'Usine Nouvelle](https://www.usinenouvelle.com/article/drinks-stories-dans-l-aube-ce-couple-sort-de-l-agriculture-conventionnelle-pour-produire-son-whisky.N2036727), [La Bouteille Dorée](https://www.labouteilledoree.com/en/767_distillerie-de-soligny).
- **Distillerie artisanale du Pays d'Othe** (Saint-Mards-en-Othe) : [Aube en Champagne](https://aube-champagne.com/en/poi/distillerie-artisanale-du-pays-d-othe), [Whisky Magazine](https://whiskymag.com/articles/whisky-made-in-france/). **Nom de son whisky non repris** (une seule source).
- **Non cité** : la distillerie liée à Champagne Moutard (Buxeuil) : une seule source, et une marque différente de Moutard*Dangin. **À vous de décider.**

### 9. Température de service
- **8 à 10 °C**, et 10 à 12 °C pour les millésimés : [Sip Champagnes (référence au Comité Champagne)](https://sipchampagnes.com/en-us/blogs/news/the-perfect-champagne-serving-temperature-a-complete-guide-by-style), [Vin Paris](https://www.vin-paris.fr/temperature-de-service-du-champagne/), [Vinalia](https://www.vinalia.fr/blog/decouverte/champagne-les-secrets-d-un-service-parfait.html).
- **Seau d'eau et de glace, 3 à 4 h au réfrigérateur, pas de congélateur** : [Autour du vin](https://www.autourduvin.fr/a-quelle-temperature-se-consomme-le-champagne/), [Vinispi](https://www.vinispi.com/quelle-est-la-temperature-ideale-pour-boire-du-champagne/).
- **Verre et ouverture** : conseils d'usage courant, sans chiffre.

### 10. Brut, extra brut, brut nature
- **Seuils officiels** : [DGCCRF – le langage des étiquettes](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/champagne-connaitre-le-langage-des-etiquettes), [Decanter](https://www.decanter.com/wine/champagne-styles-explained-486862/), [UFC-Que Choisir](https://www.quechoisir.org/conseils-champagne-les-dix-questions-a-se-poser-pour-bien-choisir-une-bouteille-de-champagne-n61374/).
- **Exemples de nos vignerons** : leurs sites officiels (dosages publiés).

### 11. Champagne et chaource
- **AOP, lait entier de vache, pâte molle, croûte fleurie, Aube et Yonne, caractère lactique** : [INAO – fiche](https://www.inao.gouv.fr/node/34039/printable/pdf), [cahier des charges](https://extranet.inao.gouv.fr/fichier/cdcchaource.pdf).
- **Huîtres gratinées au chaource, dégustation avec fromages locaux** : site de Moutard*Dangin.
- **Non repris** : la date de l'AOC et la durée d'affinage (non confirmées).

### 12. Andouillette de Troyes
- **La spécialité la plus célèbre, gratinée au chaource, label « 5 A »** : [Office de tourisme – spécialités](https://www.troyeslachampagne.com/2-quelles-sont-les-specialites-culinaires-a-tester-a-troyes/), [Office de tourisme – l'andouillette (AAAAA)](https://en.troyeslachampagne.com/enjoy/local-products/the-troyes-andouillette/), [GaultMillau](https://fr.gaultmillau.com/fr/news/l-andouillette-de-troyes-comment-bien-la-reconnaitre).
- **Composition** : volontairement peu détaillée, comme pour la page Troyes.

### 13. Le cidre du Pays d'Othe
- **Le verger de l'Aube** : premières traces au XVIe siècle, plus de 300 variétés en « vergers refuges », route du cidre et des pressoirs. Sources : [Aube en Champagne – gastronomie](https://www.aube-champagne.com/en/portfolio-post/local-gastronomy/), [Aube en Champagne – pommes et cidre](https://www.aube-champagne.com/en/portfolio-post/apples-and-cider-in-pays-dothe/).
- **GR de pays « Tour du cidre »** (environ 30 km, Saint-Mards, Eaux-Puiseaux, Vosnon, Nogent-en-Othe) : [GR Infos](https://www.gr-infos.com/en/grp-cidre.htm).
- **Musée du cidre à Eaux-Puiseaux** : [Aube en Champagne](https://www.aube-champagne.com/en/poi/musee-du-cidre-du-pays-d-othe-et-magasin-de-la-ferme/), [Gilles Pudlowski](https://www.gillespudlowski.com/?p=240339).
- **Appellation** : une démarche d'IGP est évoquée par un producteur, mais son statut n'est pas confirmé. Le texte reste prudent (« à notre connaissance »).

### 14. Les brasseries artisanales de l'Aube
- **Sept brasseries, « en pleine renaissance », approvisionnement en céréales** : [Aube en Champagne – les brasseries artisanales](https://www.aube-champagne.com/en/portfolio-post/the-7-craft-breweries-of-the-aube/), [Aube en Champagne – gastronomie](https://www.aube-champagne.com/en/portfolio-post/local-gastronomy/).
- **Brasserie Jumie, à Buchères** : [Aube en Champagne](https://www.aube-champagne.com/en/poi/brasserie-jumie/), [Gilles Pudlowski](https://www.gillespudlowski.com/?p=437742) (« la plus grosse brasserie de l'Aube » selon cet article).
- **Autres brasseries** : non nommées (une seule source chacune).

## Longueur des textes
- **Dans la cible** (800 à 1 200 mots, ou plus pour le prosecco) : Rosé de saignée, Coteaux champenois, Prosecco, Moutard*Dangin, Whisky, Brut, Andouillette.
- **Un peu courts** : Rosé des Riceys (790), Température (765), Tailles de bouteilles (750), Chaource (740), Mennetrier (730), Cidre (700) et Brasseries (700). Je n'ai pas voulu ajouter de faits non vérifiés pour gagner des mots. Pour les deux portraits, vos passages « À COMPLÉTER » les allongeront.
