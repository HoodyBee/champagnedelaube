# Pages cépages : liste officielle, sources et vérifications (étape 13)

> **Mise à jour (retours PR #15)** : la page générale s'appelle « Les cépages de l'appellation Champagne ». Le **voltis est masqué** pour l'instant (page en brouillon dans le Studio et dans le code : `CEPAGES_MASQUES` dans `src/lib/cepages-contenu.ts`) ; ses textes et ses sources sont gardés ci-dessous pour plus tard.

Une page générale (`/cepages-champagne/`, anglais `/en/champagne-grape-varieties/`) et une page par cépage (`/cepages-champagne/pinot-noir/`…). Textes dans `src/lib/cepages-contenu.ts` (français, anglais), repris des articles cépages du Mag et complétés. Photos : fiches **Cépage** du Studio (menu **Notre Terroir → Les cépages**). Si vous remplissez « Accroche » et « Texte de la page » dans une fiche, ce texte remplace celui du dépôt.

Règle : chaque fait est recoupé par **au moins deux sources** ; une partie sans source n'est pas écrite (ex. pas de partie « culture » pour le pinot blanc, le pinot gris ni le chardonnay rose).

## 1. La liste officielle

Source principale : **cahier des charges de l'AOC Champagne**, version homologuée par l'arrêté du 31 juillet 2025 (Bulletin officiel du ministère de l'Agriculture du 7 août 2025, [document](https://info.agriculture.gouv.fr/boagri/document_administratif-677d59b2-d392-4220-9fa3-e65dbc723244/telechargement)), chapitre V « Encépagement » :

- **Cépages principaux (8)** : arbane B, chardonnay B, **chardonnay rose Rs**, meunier N, petit meslier B, pinot blanc B, pinot gris G, pinot noir N.
- **Variété « d'intérêt à fin d'adaptation » (1)** : **voltis B**, sous réserve d'une convention signée entre l'INAO, l'ODG et les opérateurs.
- Règles du voltis : au plus **5 % de l'encépagement** de l'exploitation, au plus **10 % de l'assemblage**, jamais seul.

Recoupements : [Comité Champagne – chardonnay rose](https://www.champagne.fr/fr/approfondir/mediaroom/communique-presse-champagne/le-chardonnay-rose-un-cepage-oublie-qui-retrouve) · [Vitisphere](https://www.vitisphere.com/actualite-105578--le-chardonnay-rose-entre-dans-le-cahier-des-charges-de-laoc-champagne.html) · [iDealwine](https://www.idealwine.net/le-chardonnay-rose-entre-dans-laoc-champagne/) · [Réussir Vigne – l'ODG approuve un cahier des charges modifié](https://www.reussir.fr/vigne/lodg-champagne-approuve-un-cahier-des-charges-modifie) · [Réussir Vigne – Voltis, un blanc idéal pour l'assemblage](https://www.reussir.fr/vigne/voltis-un-blanc-ideal-pour-lassemblage).

### Le chardonnay rose est-il un cépage distinct ?

**Oui pour l'appellation** : le cahier des charges le cite à part (« Chardonnay rose Rs ») parmi les huit cépages principaux. **Botaniquement**, c'est une mutation naturelle du chardonnay (peau rosée). La page dit les deux.

Sources :
- Cahier des charges de l'AOC Champagne homologué par l'arrêté du 31 juillet 2025, chapitre V « Encépagement » ([Bulletin officiel du ministère de l'Agriculture, 7 août 2025](https://info.agriculture.gouv.fr/boagri/document_administratif-677d59b2-d392-4220-9fa3-e65dbc723244/telechargement)) : « Chardonnay rose Rs » dans la liste des cépages principaux.
- [Comité Champagne – « Le chardonnay rose, un cépage oublié qui retrouve sa place »](https://www.champagne.fr/fr/approfondir/mediaroom/communique-presse-champagne/le-chardonnay-rose-un-cepage-oublie-qui-retrouve) : mutation naturelle du chardonnay, connue en Champagne et en Bourgogne au début du XXe siècle.
- [Vitisphere](https://www.vitisphere.com/actualite-105578--le-chardonnay-rose-entre-dans-le-cahier-des-charges-de-laoc-champagne.html) · [iDealwine](https://www.idealwine.net/le-chardonnay-rose-entre-dans-laoc-champagne/) : entrée dans le cahier des charges.

## 2. Faits ajoutés par rapport aux anciens articles

| Fait | Sources |
|---|---|
| Voltis : variété résistante au mildiou et à l'oïdium, obtenue par l'INRAE | [INRAE Colmar – fiche variétale Voltis](https://svqv.colmar.hub.inrae.fr/media/files/fiches-varietales/voltis) · [IFV – fiche Voltis](https://www.vignevin.com/wp-content/uploads/2026/07/VOLTIS-B.pdf) · [Chambre d'agriculture – fiche Voltis](https://Lot.chambre-agriculture.fr/fileadmin/user_upload/Occitanie/070_Inst-Lot/Documents/Arborescence/Productions_techniques/Viticulture/Fiche_voltis_20220701.pdf) |
| Voltis : 5 % de l'encépagement, 10 % de l'assemblage, jamais seul, convention | Cahier des charges 2025 (ch. V et IX) · [Réussir Vigne](https://www.reussir.fr/vigne/au-congres-de-la-cnaoc-les-vifa-posees-en-modele) |
| Pinot noir et chardonnay débourrent avant le meunier (plus exposés aux gelées de printemps) | [The Drinks Business – gel 2020](https://thedrinksbusiness.com/?p=506004) · [BSV Champagne, bilan 2025](https://draaf.grand-est.agriculture.gouv.fr/IMG/pdf/bsvbilan_viti_cha_2025.pdf) |
| Les Riceys : seule commune aux 3 appellations ; Rosé des Riceys, AOC par décret du 8 décembre 1947 | voir `docs/terroirs-sources.md` |
| Montgueux : craie du Turonien, exposition sud / sud-est, AOC en 1927, plants partis au Japon fin XIXe ; agrumes et fruits exotiques souvent cités | voir `docs/terroirs-sources.md` |
| Villenauxe-la-Grande : chardonnay majoritaire, vallée de la Noxe ; pinot blanc et petit meslier chez certains | voir `docs/terroirs-sources.md` |
| Meunier : un peu à Montgueux | voir `docs/terroirs-sources.md` |

Tous les autres faits (rôle de chaque cépage dans l'assemblage, blanc de noirs / blanc de blancs, nom du meunier, fromenteau, « blanc vrai », arbane sensible au gel, petit meslier gouais × savagnin…) viennent de `docs/articles-cepages-sources.md`.

## 3. Volontairement non donnés

- **Pourcentages des cépages dans l'AOC** (38 / 31-32 / 30-31 % selon les sources) : seul l'ordre est donné.
- **Part des cépages rares** (0,3 %, 0,04 %, 0,004 %…) et **surfaces d'arbane** : non citées.
- **Part exacte du pinot noir dans la Côte des Bar** : « plus de huit vignes sur dix ».
- **Chiffres pour l'Aube cépage par cépage** : aucune statistique officielle trouvée en accès libre. À ajouter si vous avez le chiffre du Comité Champagne ou du SGV.
- **Arômes du voltis** et **année d'entrée du voltis dans le cahier des charges** : une seule source, non cités.
- **Chardonnay rose dans l'Aube** : aucune vigne signalée par les sources ; la page le dit.

## 4. Anciennes adresses (redirections 301)

| Ancienne adresse (FR et `/en/…`) | Nouvelle adresse |
|---|---|
| `/pinot-noir-champagne/` | `/cepages-champagne/pinot-noir/` |
| `/meunier-cepage-champagne/` | `/cepages-champagne/meunier/` |
| `/chardonnay-champagne/` | `/cepages-champagne/chardonnay/` |
| `/chardonnay-rose-champagne/` | `/cepages-champagne/chardonnay-rose/` |
| `/pinot-blanc-champagne/` | `/cepages-champagne/pinot-blanc/` |
| `/pinot-gris-fromenteau-champagne/` | `/cepages-champagne/pinot-gris/` |
| `/arbane-cepage-champagne/` | `/cepages-champagne/arbane/` |
| `/petit-meslier-cepage-champagne/` | `/cepages-champagne/petit-meslier/` |

Les 8 anciens articles sont **masqués, pas supprimés** : ils sont repassés en brouillon dans le Studio. L'article « Qu'est-ce qu'un cépage ? » reste dans Le Mag (rubrique Tout savoir).

## 5. Photos

| Cépage | Photo principale | Légende |
|---|---|---|
| Pinot noir | Grappe tenue au-dessus des caisses, Polisy 2026 (+ galerie de 6 photos de raisins noirs) | — |
| Chardonnay | Grappe de chardonnay encore verte | — |
| Meunier | aucune (pas de photo de meunier dans le lot) | — |
| Pinot blanc | Fleurs de vigne | « (illustration) » |
| Pinot gris | Vignes à Colombé-le-Sec | « (illustration) » |
| Arbane | Vigne en fleurs | « (illustration) » |
| Petit meslier | Vignes à Spoy | « (illustration) » |
| Chardonnay rose | Jeune pousse de vigne | « (illustration) » |
| Voltis (masqué) | Jeune plantation de vigne | « (illustration) » |
