# Méthode : ajouter un nouveau lot de photos

À suivre à l'identique pour chaque lot (Google Photos, Drive…). Les originaux ne sont **jamais** ajoutés au dépôt.

## 1. Récupérer le lot

1. Julien dépose un zip dans une release GitHub (ex. tag `photos-a-trier`).
2. Téléchargement dans un dossier temporaire **hors du dépôt** : `/tmp/photos/zip/`, extraction dans `/tmp/photos/brut/`.
3. Formats lus : jpg, jpeg, png, heic (convertir les heic en jpg d'abord) ; vidéos ignorées.

## 2. Lire la date et le lieu

```bash
python3 -I scripts/photos-lire.py "/tmp/photos/brut/<dossier>" /tmp/photos/travail
```

- **Date** : EXIF « DateTimeOriginal ».
- **Lieu** : coordonnées GPS de l'EXIF → commune la plus proche, calculée **en local** à partir des centres des communes publiés par geo.api.gouv.fr (fichiers `com10.json`, `com51.json`… téléchargés une fois par département : Aube 10, Marne 51, Haute-Marne 52, Yonne 89, Côte-d'Or 21, Seine-et-Marne 77, Paris 75…). Les coordonnées des photos ne sont jamais envoyées à un service extérieur.
- Hors de France : pays ou région notés à la main (ex. Pise, Cinque Terre).
- Le script produit `meta.json` et des **planches-contact numérotées** (`planches/p01.jpg`…) pour le tri à l'œil.

## 3. Trier (règles strictes)

| Règle | Décision |
|---|---|
| Bouteille, étiquette ou verre **Daniel Pétré & Fils** sur une photo **d'avant le 1er janvier 2025**, ou étiquette illisible | Section « À valider par Julien (Pétré avant 2025) » de l'inventaire. **Ni sur le site, ni dans Sanity.** |
| Visage reconnaissable au premier plan | Écartée |
| Photo floue (netteté faible et flou visible sur la planche) | Écartée |
| Doublon (même scène, cadrage voisin) | On garde la meilleure, les autres sont écartées |
| Photo hors de l'Aube (Italie, Bourgogne, Paris…) | Le Mag uniquement, **jamais** une page terroir |
| Photo sans GPS | Jamais sur une page terroir (lieu non prouvé) : thèmes généraux seulement |
| Cépage sur une photo de raisin | Seulement si Julien le confirme |
| Geste festif (verres qui trinquent) | Écartée (loi Évin) |

## 4. Classer

Arborescence unique, utilisée dans l'inventaire et dans les étiquettes de la Médiathèque :

- `terroirs / cote-des-bar / [les-riceys, bar-sur-seine, bar-sur-aube, autre-commune]`
- `terroirs / montgueux`
- `terroirs / sezannais / villenauxe-la-grande`
- `cepages / [chardonnay, pinot-noir, meunier, autres]`
- `vignes-et-vendanges / [vignes, raisin, vendanges, travaux-de-la-vigne]`
- `degustations-et-evenements / [événement-année]` (ex. `route-du-champagne-2025`)
- `accords-mets`
- `bouteilles-et-verres`
- `mag / [voyages, patrimoine, divers]`
- `logos`

Repères : Barséquanais (autour de Bar-sur-Seine : Les Riceys, Polisy, Celles-sur-Ource, Merrey-sur-Arce, Essoyes…) ; Barsuraubois (autour de Bar-sur-Aube : Spoy, Colombé-le-Sec, Arrentières…).

## 5. Nommer (SEO)

- Mots que les gens cherchent, en français, **sans accents**, séparés par des tirets, **3 à 7 mots**, `champagne` quand c'est pertinent, plus la commune, le sujet et l'année si utile.
- Exemples : `degustation-champagne-les-riceys-2025.jpg`, `vendanges-champagne-cote-des-bar-2026.jpg`.
- Jamais `IMG_`, `PXL_`, `photo1`. Deux photos ne peuvent pas avoir le même nom (le script vérifie).
- Moutard*Dangin : `moutard-dangin` dans les noms de fichiers et les étiquettes (l'étoile y est interdite), **Moutard*Dangin** dans tous les textes visibles.

## 6. Texte alternatif

Une phrase en français, descriptive et naturelle (« Verre de champagne servi lors de la Route du Champagne en fête aux Riceys »), jamais une liste de mots-clés. Version anglaise dans le manifeste.

## 7. Préparer les fichiers

```bash
python3 -I scripts/photos-preparer.py "/tmp/photos/brut/<dossier>" selection.json /tmp/photos/prepa
```

- Redressement selon l'orientation, **2400 px maximum** (grand côté), **qualité 80**.
- **Toutes** les métadonnées supprimées (GPS, date et heure, modèle d'appareil, nom).
- Ajout de l'auteur et du copyright : EXIF « Artist » et « Copyright », et XMP (`dc:creator`, `dc:rights`, `photoshop:Credit`) avec « © Champagne de l'Aube / Detectezmoi.com ».
- La date et le lieu restent **uniquement** dans `docs/photos-inventaire.md`.

## 8. Envoyer dans Sanity

1. Écrire le manifeste du lot : `content/photos/lots/lot-N.json` (fichier, alt FR/EN, étiquettes, crédit, usage).
2. Simulation, puis envoi (clé d'écriture Sanity demandée par le formulaire sécurisé) :

```bash
node scripts/import-photos.mjs content/photos/lots/lot-N.json /tmp/photos/prepa
SANITY_WRITE_TOKEN=proxy-injected node scripts/import-photos.mjs content/photos/lots/lot-N.json /tmp/photos/prepa --envoyer
```

Le script :
- crée les **étiquettes** de la Médiathèque (`terroir-…`, `commune-…`, `secteur-…`, `theme-…`, `cepage-…`, `evenement-…`, `vigneron-…`, `mag-…`) ;
- envoie chaque fichier sous son nom lisible ;
- renseigne le titre, le texte alternatif, la description (usage prévu), le **crédit** (« © Champagne de l'Aube / Detectezmoi.com ») et les étiquettes ;
- écrit `lot-N-assets.json` (nom → identifiant Sanity) pour placer les photos.

## 9. Placer sur le site

- Sauvegarder d'abord les documents concernés (`docs/sauvegardes/`).
- Placer avec le texte alternatif et le crédit (champs de l'image). Dans le Studio, régler le **point d'intérêt** (hotspot) si le recadrage coupe le sujet.
- Une page terroir ne reçoit que des photos prises dans ce terroir (GPS à l'appui).

## 10. Banques d'images (cépages rares)

- Wikimedia Commons, Unsplash, Pexels : vérifier que la photo montre vraiment le cépage (les erreurs sont fréquentes). Les planches de l'« Ampélographie » de Viala et Vermorel (1901-1910, domaine public) sont une source fiable.
- Noter l'auteur et la licence dans le champ **Crédit** (ex. « Photo : Jean Dupont, CC BY-SA 4.0, Wikimedia Commons ») : le crédit apparaît automatiquement dans les **mentions légales**, rubrique « Crédits photos ».

## 11. Mettre à jour l'inventaire et vérifier

- Compléter `docs/photos-inventaire.md` (résumé, Pétré à valider, photos manquantes par page).
- `npm run build`, contrôle des liens et des textes alternatifs, puis pull request.
