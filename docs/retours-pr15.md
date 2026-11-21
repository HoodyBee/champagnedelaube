# Retours PR #15 : listes de contrôle

## Le Mag : nouveau classement des articles

Rubriques : **Actu** · **Accords mets & champagne** · **Tout savoir sur le champagne** (avec les dossiers « Cépages » et « Terroirs ») · **Portraits** · **Autres horizons**.
« Terroirs & cépages » et « Œnotourisme » disparaissent comme rubriques (redirections 301 : `/le-mag/terroirs-cepages/` → Tout savoir, `/le-mag/oenotourisme/` → Autres horizons).

| Article | Rubrique principale | Aussi dans | Statut |
|---|---|---|---|
| Accords mets et vin : pâtes au pesto | Accords | — | publié |
| Agneau à l'orange et champagne meunier | Accords | — | publié |
| Aumônières de boudin blanc aux pommes | Accords | — | publié |
| Champagne et sushis | Accords | — | publié |
| L'importance des accords mets et champagnes | Accords | Tout savoir | publié |
| Champagne : labels et certifications | Tout savoir | — | publié |
| Le vocabulaire du champagne en anglais | Tout savoir | — | publié |
| Qu'est-ce qu'un cépage ? | **Tout savoir** (avant : Terroirs & cépages) | — | publié |
| Marronnier 2027 | Actu | Tout savoir | publié |
| Pourquoi les vignerons devraient s'intéresser au rap | Actu | — | publié |
| Daniel Pétré & Fils | Portraits | — | brouillon (photos Pétré à valider) |
| 8 articles cépages (pinot noir, meunier, chardonnay, chardonnay rose, pinot blanc, pinot gris, arbane, petit meslier) | Tout savoir | — | **repassés en brouillon** : remplacés par les pages cépages (301) |

Portraits et Autres horizons n'ont pas encore d'article publié : leurs pages existent (lien du menu) avec « Les premiers articles arrivent très bientôt », et ne sont pas indexées par Google tant qu'elles sont vides.

## Fiches vignerons (rien n'a été modifié ni supprimé)

| Fiche | Où | Partenaire | Remarque |
|---|---|---|---|
| Champagne Moutard*Dangin (Polisy) | site (`src/lib/fallback-vignerons.ts`), `/vignerons/moutard-dangin/` | **oui** | fiche complète ; cépages : pinot noir, chardonnay, meunier, pinot blanc |
| Champagne Mennetrier (Arrentières) | site (`src/lib/fallback-vignerons.ts`), `/vignerons/mennetrier/` | **oui** | fiche minimale : pas de photo, pas de personnes, cépages non renseignés |
| — | Sanity (documents « Vigneron ») | — | **aucune fiche** dans le Studio pour l'instant |

Les pages cépages ne renvoient que vers les partenaires qui cultivent ce cépage : aujourd'hui Moutard*Dangin (pinot noir, chardonnay, meunier, pinot blanc). Mennetrier y apparaîtra dès que ses cépages seront renseignés.

## Retours PR #15 (2e série) : emplacements d'image

Règle : jamais de motif à la place d'une photo. Une de nos photos sur le sujet, sinon notre logo sur fond crème, sinon pas d'emplacement (le texte prend toute la largeur).

| Page | Emplacement | Avant | Maintenant |
|---|---|---|---|
| Les terroirs de l'Aube | « Situer l'Aube » | motif | Coteaux de vignes à Colombé-le-Sec (2026) |
| Les terroirs de l'Aube | « Des sols venus du Jurassique et du Crétacé » | motif | Coteau de vignes à Spoy (2025) |
| Les terroirs de l'Aube | « Un climat à double influence » | motif | Coucher de soleil sur les vignes à Merrey-sur-Arce (2025) |
| Fiche Moutard*Dangin, et ses cartes (Restaurants-cavistes-hôtels, autres vignerons, Nos partenaires) | photo du domaine | motif | Service d'un verre de Moutard*Dangin sur un salon (2024) |
| Fiche Mennetrier, et ses cartes | photo du domaine | motif | Logo Champagne de l'Aube sur fond crème (aucune photo du domaine) |
| Pages cépages | bloc « Le goûter chez nos vignerons partenaires » | motif | Bloc remplacé par l'encart « Envie de le goûter ? » |
| Page Meunier | photo d'ouverture | emplacement vide | Emplacement supprimé : le texte prend toute la largeur |
| Communication & marketing | photo d'ouverture | aucune | Julien sur son ordinateur, en terrasse |
| Accueil | fond du bloc « Une question, un projet ? » | motif décoratif | **inchangé** : c'est un décor de fond, pas une photo manquante (à retirer si vous préférez) |

Tout autre emplacement sans photo affiche désormais automatiquement le logo sur fond crème (plus jamais le motif).
