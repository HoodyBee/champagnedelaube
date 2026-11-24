# Tour SEO avant la mise en ligne (24 novembre 2026)

## Méthode

- **Construction** : version de production locale (`CONTEXT=production`), avec les contenus Sanity publiés.
- **Pages parcourues** : toutes les pages du plan du site, leurs versions FR et EN, puis chaque lien interne. Cela fait 138 adresses, dont 92 pages réelles (91 indexables).
- **Points vérifiés** :
  - titre, description, H1 et hiérarchie des titres ;
  - textes alternatifs des images, liens internes ;
  - canonical, hreflang, données structurées, Open Graph ;
  - plan du site et robots.txt ;
  - poids, vitesse et affichage sur mobile.

## Bilan rapide

| Point | Résultat |
|---|---|
| Titres | aucun doublon ; 30 à 60 caractères (sauf Montgueux : 61) |
| Descriptions | aucun doublon ; 140 à 160 caractères ; 2 coupées par « … » (**corrigées**) |
| H1 | un seul par page, partout |
| Hiérarchie des titres | aucun saut de niveau (H2 → H4) |
| Textes alternatifs | 166 textes distincts, de bonne qualité ; les images sans texte sont décoratives (logos, pastilles, vignettes dans un lien déjà nommé) |
| Liens cassés | aucun ; mais le lien « FR » du sélecteur de langue passait par une redirection temporaire (307) sur chaque page (**corrigé**) |
| Canonical | correct sur toutes les pages (adresse https://champagnedelaube.fr, sans www) |
| hreflang | réciproque partout ; l'article sur le rap annonçait une version anglaise non traduite (**corrigé**) |
| Données structurées | Organization + LocalBusiness (accueil), Article (articles), fil d'Ariane (toutes les pages), FAQ et TouristDestination (Troyes) |
| Open Graph / Twitter | titre, description, image, type, langue : présents partout |
| Plan du site | 91 adresses, langues réelles des articles respectées, « Notre démarche » incluse |
| robots.txt | correct (Studio et API exclus, lien vers le plan du site) |
| Mobile (Pixel 7, 4G lente simulée) | affichage du contenu principal en 0,2 à 1 s, aucun décalage de mise en page, aucun débordement horizontal |

## Corrigé dans la PR #18 (code)

1. **Sélecteur de langue** : le lien « FR » mène directement à l'adresse finale (`/vignerons/`), et non à `/fr/vignerons/`, qui redirigeait (307).
2. **hreflang des articles** : seules les langues réellement traduites sont annoncées.
3. **Descriptions coupées** : Troyes (FR) et Notre démarche (FR et EN) raccourcies sous 160 caractères. Le titre anglais de Notre démarche est complété.

## À valider : corrections dans Sanity (je ne touche à rien sans votre accord)

Champ concerné dans le Studio : onglet **Référencement** (titre Google, description) de chaque page.

### Accueil (cohérence avec le nouveau haut de page)
- **Titre FR** : « Champagnes de vignerons de la Côte des Bar et de l'Aube » → **« Champagnes de vignerons de l'Aube et dégustations à Troyes »** (58)
- **Titre EN** : → **« Aube grower champagnes and private tastings in Troyes »** (53)
- **Description FR** : → **« Dégustations privées à Troyes ou chez vous, sélection de champagnes de vignerons indépendants de la Côte des Bar, des Riceys, de Montgueux et de Villenauxe. »** (160)
- **Description EN** : → **« Private tastings in Troyes or at your home, and a selection of champagnes from independent winemakers of the Côte des Bar, Les Riceys, Montgueux and Villenauxe. »** (160)

### Dégustations privées (« visites de domaines » ne correspond plus à l'offre)
- **Description FR** : → **« Découvrez autrement les champagnes de vignerons de l'Aube : dégustations privées à Troyes ou chez vous, de 6 à 13 personnes, en français ou en anglais. »**
- **Description EN** : → **« Discover champagnes from independent Aube winemakers differently: private tastings in Troyes or at your home, for 6 to 13 people, in French or in English. »** (154)

### Vignerons : devenez partenaire (« apporteur d'affaires » et sigles)
- **Titre FR** : « Partenariat Vignerons | Trouvez votre apporteur d'affaires » → **« Vignerons de l'Aube : faites découvrir vos cuvées »** (49)
- **Titre EN** : → **« Aube winemakers: introduce your cuvées to new audiences »** (55)
- **Description FR** : → **« Vignerons de l'Aube, faites connaître vos cuvées : nous les présentons aux restaurants, cavistes, hôtels, entreprises et amateurs. Rencontrons-nous au domaine. »** (159)
- **Description EN** : → **« Aube winemakers, get your cuvées known: we present them to restaurants, wine shops, hotels, companies and enthusiasts. Let's meet at your estate. »** (145)

### Espace Pro : restaurants, cavistes, hôtels
- **Description FR** : « … Sourcing sur-mesure, cuvées identitaires et tarifs pro. » → **« Enrichissez votre carte avec des champagnes de vignerons indépendants de l'Aube : sélection sur mesure, cuvées de caractère et un interlocuteur unique à Troyes. »** (160)

### Entreprises & CSE (majuscules)
- **Titre FR** : → **« Champagnes pour entreprises et CSE : cadeaux et événements »** (58)
- **Titre EN** : → **« Champagne for companies and works councils: gifts and events »** (60)

### Tout savoir sur le champagne (majuscule)
- **Titre FR** : → **« Tout savoir sur le champagne : cépages, terroirs et méthode »** (59)

### Article « Sauté d'agneau à l'orange »
- **Titre FR** : « Sauté d'Agneau & Champagne Meunier | Recette Pâques » → **« Agneau à l'orange et champagne meunier : recette de Pâques »** (58)
- **Description FR** : → **« Notre recette de Pâques : sauté d'agneau à l'orange, rattes et coings confits, servi avec un champagne 100 % meunier de Binon-Coquard. Un accord de saison. »** (155)

### Montgueux (titre trop long d'un caractère)
- **Titre FR** : → **« Champagne de Montgueux, colline du chardonnay près de Troyes »** (60)

### Villenauxe-la-Grande (point final manquant)
- **Description FR** : → **« Villenauxe-la-Grande, au nord-ouest de l'Aube, en limite de la Marne : une centaine d'hectares de vignes, surtout du chardonnay, et des vignerons indépendants. »** (159)

### Image de l'article sur le rap (vignette sur les pages anglaises du Mag)
- **Texte alternatif EN** (manquant, le français s'affiche) : **« Jay-Z with a bottle of Cristal Roederer champagne, still from a music video »**

## Le reste, par priorité

### Indispensable avant la mise en ligne
- **Sanity** : CORS `https://champagnedelaube.fr` et webhook `https://champagnedelaube.fr/api/revalidate/` (checklist `docs/communication/05-checklist-mise-en-ligne.md`).
- **Netlify** : domaine principal `champagnedelaube.fr`, www en alias (les redirections sont prêtes).
- **Search Console** : propriété « Domaine », puis envoi de `https://champagnedelaube.fr/sitemap.xml`.
- **Après la fusion** : vérifier sur le site en ligne une adresse inventée (`/xyz-test-404/` → page « introuvable »), puis un article et l'accueil.

### Utile dans le mois
- **Fiches vignerons Moutard*Dangin et Mennetrier** : ce sont des fiches par défaut, affichées tant qu'aucun vigneron n'est publié. Elles sont indexables. Si ces domaines ne sont pas encore partenaires, à décider : les garder, les retirer du plan du site ou les passer en « noindex ».
- **Pages peu liées** : « Actualités » du Mag, le thème « Champagne & art » et « Tout savoir sur le champagne » ne reçoivent presque aucun lien depuis le contenu (seulement les menus). Ajouter 1 ou 2 liens depuis des articles proches.
- **Textes de page « visites de domaines »** : à relire sur la page Dégustations privées, pour la même raison que le haut de l'accueil.
- **Poids des pages** : chaque page envoie toutes les traductions au navigateur (environ 70 Ko avant compression). Limiter aux textes utiles allégerait chaque page, mais ce changement touche de nombreux composants : à faire à part et tester page par page.
- **Données structurées** : ajouter une page « À propos » (AboutPage + Person) pour Notre démarche.

### Plus tard
- **Noms de fichiers des images** : les images Sanity ont des noms techniques (code unique). Sanity permet d'ajouter un nom lisible dans l'adresse (« vanity filename ») ; gain faible, à faire avec un réglage du composant d'image.
- **Texte alternatif de la carte des terroirs** (accueil) : très long (plus de 180 caractères) ; il peut être raccourci, la description détaillée restant dans la page.
- **Article sur le rap** : le traduire en anglais pour l'ouvrir aux pages EN.
