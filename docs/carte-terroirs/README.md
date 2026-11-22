# Carte vidéo des terroirs (accueil) : formes cliquables

Les zones cliquables suivent la forme exacte de chaque terroir. Elles ont été détourées automatiquement à partir des couleurs de la carte : bleu Côte des Bar, rose Les Riceys, jaune Montgueux, vert Villenauxe. Le script `detoure.py` (Python + OpenCV) a produit les tracés de `src/components/home/carte-terroirs-formes.ts`.

- **Cadrage « final »** : dernière image de la vidéo, identique au poster (vérifié : écart nul). Actif à partir de 13,4 s, à la fin et sur le poster.
- **Cadrage « milieu »** : carte immobile de 4,4 s à 10,6 s (cadrage plus serré, fond satellite). Chaque terroir devient cliquable dès son apparition : Côte des Bar 4,4 s, Les Riceys 4,8 s, Montgueux 5,2 s, Villenauxe 6,1 s.
- **Entre 10,6 et 13,4 s**, la carte bouge (recadrage) : rien n'est cliquable.
- `detoure-poster.jpg` et `detoure-milieu.jpg` montrent les contours obtenus.

**Si la vidéo change** : relancer le script sur la nouvelle image finale (et sur une image du moment immobile), puis remplacer les tracés.
