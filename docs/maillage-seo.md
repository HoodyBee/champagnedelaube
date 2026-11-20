# Maillage interne et référencement (étape 12)

## Principes

1. **Une seule adresse par contenu.** Un article garde son adresse (`/mon-article/`), quelle que soit sa rubrique. La **rubrique principale** donne le fil d'Ariane, le sur-titre et la section des données structurées ; les **rubriques secondaires** font seulement apparaître l'article dans d'autres listes. Pas de contenu dupliqué.
2. **Chaque rubrique a sa page** : `/le-mag/terroirs-cepages/`, `/le-mag/actualites/`, `/le-mag/portraits/`… (les rubriques vides n'ont pas de page). « Tout savoir » et « Accords » gardent leurs adresses historiques ; `/le-mag/tout-savoir/` et `/le-mag/accords/` y redirigent (301).
3. **Liens retour automatiques (« Pour aller plus loin »).** Quand un article contient un lien vers une page (un terroir, les dégustations, l'Espace Pro…), cette page affiche l'article en retour. Le maillage se construit tout seul à chaque nouvel article.
4. **Ancres descriptives** partout (« Tous les articles « Terroirs & cépages » », « Nos dégustations privées de champagnes de vignerons, à Troyes ou chez vous »), jamais « cliquez ici ».
5. **Liens dans la bonne langue** : un lien saisi `/la-cote-des-bar` devient `/en/la-cote-des-bar/` sur la version anglaise, `/vignerons` devient `/en/winemakers/` ; plus aucune redirection intermédiaire.

## Qui fait un lien vers qui

| Page | Reçoit des liens depuis |
|---|---|
| Accueil | Logo, fil d'Ariane de toutes les pages |
| Notre Terroir et les 4 terroirs | Menu, accueil (carte), articles cépages (liens dans le texte), marronnier (Saint-Vincent, Route du Champagne), cartes « autres terroirs » |
| Articles cépages (pinot noir, meunier, chardonnay, rares) | Pages terroirs (« Pour aller plus loin »), page rubrique Terroirs & cépages, Tout savoir (rubrique secondaire), « Articles liés », marronnier (journées des cépages, tableau et texte) |
| Notre sélection du moment | Menu, accueil, encadré « Continuer la découverte » de chaque article |
| Dégustations privées | Menu, accueil (bouton principal), encadré de chaque article, textes des articles, marronnier |
| Vos Grands Événements | Menu, Dégustations privées, « Pour aller plus loin » |
| Espace Pro & Entreprises | Menu, accueil, marronnier (« restaurants, cavistes et hôtels »), Noël dans le calendrier (Entreprises & CSE) |
| Marronnier 2027 | Accueil (calendrier, « Voir tout le calendrier »), Le Mag, rubriques Actualités et Tout savoir, redirection de l'ancien article des journées |
| Fiches vignerons | Notre sélection, articles qui les citent (« Les vignerons de cet article ») |

Les versions anglaises sans traduction (article sur le rap) ne sont pas indexées : elles renvoient vers la version française (canonique) et ne figurent pas dans le plan du site.

## Mots-clés visés

| Page | Mot-clé principal | Secondaires |
|---|---|---|
| Accueil | champagne de l'Aube | champagnes de vignerons, Côte des Bar, Troyes |
| Les terroirs de l'Aube | terroir de l'Aube | champagne Côte des Bar, Riceys, Montgueux, Villenauxe |
| Côte des Bar | champagne Côte des Bar | pinot noir, Bar-sur-Aube, Bar-sur-Seine |
| Les Riceys | champagne des Riceys | rosé des Riceys |
| Montgueux | champagne Montgueux | chardonnay, Troyes |
| Villenauxe-la-Grande | champagne Villenauxe-la-Grande | chardonnay, nord-ouest de l'Aube |
| Notre sélection du moment | champagne de vigneron Aube | vignerons indépendants |
| Dégustations privées | dégustation champagne Troyes | dégustation à domicile, atelier champagne |
| Vos Grands Événements | champagne mariage | champagne pour événement, Aube |
| Restaurants, cavistes, hôtels | champagne pour CHR | fournisseur champagne restaurant, caviste |
| Entreprises & CSE | coffret champagne CSE | cadeau d'entreprise champagne |
| Vignerons : devenez partenaire | vigneron partenaire Aube | apporteur d'affaires champagne |
| Le Mag | magazine champagne | vignerons, terroirs, accords |
| Terroirs & cépages | cépages du champagne | pinot noir, meunier, chardonnay, cépages rares |
| Tout savoir sur le champagne | tout savoir sur le champagne | méthode champenoise, dosage, labels |
| Accords mets et champagne | accord mets champagne | recettes au champagne |
| Marronnier 2027 | marronnier 2027 | calendrier éditorial vin, journées mondiales du vin 2027, gastronomie |
| Pinot noir | pinot noir champagne | blanc de noirs, Côte des Bar |
| Meunier | meunier champagne | pinot meunier |
| Chardonnay | chardonnay champagne | blanc de blancs, Montgueux |
| Vocabulaire | vocabulaire champagne anglais | lexique, dosage |

## Contrôles automatiques faits (version locale, contenus publiés)

- Les 81 adresses du plan du site (FR + EN) : toutes en 200, **un seul H1** par page, hiérarchie H2/H3, toutes les images avec un texte alternatif (les images décoratives ont un alt vide, comme il se doit).
- **Titles uniques** (≤ 65 caractères : au-delà, le suffixe « | Champagne de l'Aube » est retiré automatiquement) et **descriptions uniques** (≤ 160 caractères, coupées proprement sinon).
- **Données structurées** : Organization et LocalBusiness (accueil), BreadcrumbList (toutes les pages), Article (articles), FAQPage (pages avec questions), Event (« ⭐ Mes événements » dans le marronnier, dès qu'un événement est saisi dans le Studio : aucun pour l'instant).
- **Aucun lien interne cassé.** Seuls les liens du sélecteur de langue vers le français passent par `/fr/…` (comportement voulu : ils mémorisent la langue choisie).
- Le site reste en `noindex` jusqu'au jour J (à retirer au lancement).
