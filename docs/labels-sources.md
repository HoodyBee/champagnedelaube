# Article « Champagne : labels et certifications » : tableau, logos et vérifications

Le tableau est un vrai tableau (bloc « Tableau comparatif des labels » dans le Studio). Son contenu (FR, EN) est dans `src/lib/labels.ts`, les logos dans `public/labels/`. Sur mobile, chaque label devient une carte.

Colonnes : **Label** (logo officiel, lien vers le site du label) · **La démarche** (nom complet) · **Pesticides de synthèse** · **La promesse** · **Indice nature** (🌿, lu « Indice nature : 3 sur 5 » par les lecteurs d'écran).

## Logos

| Label | Fichier | Source | Remarque |
|---|---|---|---|
| HVE | `logo-hve-haute-valeur-environnementale.svg` | [hve-asso.com](https://hve-asso.com/la-hve/) | Logo officiel de la certification. |
| VDC | — | **non trouvé** | Aucun fichier officiel accessible sur champagne.fr : le sigle « VDC » s'affiche à la place. **À fournir par Julien.** |
| Terra Vitis | `logo-terra-vitis.png` | [terravitis.com](https://terravitis.com/) | Logo « Viticulteurs responsables ». |
| AB (logo français) | — | **non récupéré** | Wikimedia Commons a refusé le téléchargement (erreur serveur) et agencebio.org bloque l'accès. **À fournir par Julien.** |
| Eurofeuille (bio, UE) | `logo-eurofeuille-bio-union-europeenne.svg` | [Wikimedia Commons – Organic-Logo.svg](https://commons.wikimedia.org/wiki/File:Organic-Logo.svg) | Logo bio officiel de l'Union européenne. |
| Demeter | `logo-demeter.png` | [demeter.fr](https://www.demeter.fr/) | Marque déposée. |
| Biodyvin | `logo-biodyvin.png` | [biodyvin.com](https://www.biodyvin.com/) | Marque déposée. |

**Règles d'usage.** Ces logos sont des marques. Sur un produit, seuls les opérateurs certifiés peuvent les apposer. Ici, ils servent seulement à **identifier** le label dans un article d'information, en petit format, sans modification, avec un lien vers le site officiel : c'est l'usage habituel des sites d'information. Si un organisme le demande, on les retire.

## Vérifications (à relire par Julien : ce qui est inexact est signalé, pas corrigé en silence)

### 1. HVE : « les produits les plus toxiques (CMR) sont interdits »
**Inexact en partie.** Depuis la révision du référentiel (décret du 18 novembre 2022, en vigueur le 1er janvier 2023), seuls les produits classés **CMR 1** sont interdits pour obtenir la certification de niveau 3. Les **CMR 2 restent autorisés** ; ne pas en utiliser rapporte simplement des points.
→ Dans le tableau : « Depuis 2023, les produits classés CMR 1 (les plus dangereux) sont interdits. »
Sources : [Chambre d'agriculture – nouveau référentiel HVE 2022](https://agri82.chambre-agriculture.fr/fileadmin/user_upload/Occitanie/075_Inst-Tarn-et-Garonne/8-Archives/Archives_2022/actualites_2022/Nouveau_referentiel_HVE_2022_2.pdf) · [Chambres d'agriculture d'Occitanie – note HVE](https://po.chambre-agriculture.fr/fileadmin/user_upload/Occitanie/073_Inst-Pyrenees-Orientales/FICHIERS/AGROENVIRONNEMENT/HVE/NT_HVE-ChambresOc.pdf) · [Réussir – le référentiel HVE va évoluer](https://www.reussir.fr/vigne/le-referentiel-hve-va-evoluer).

### 2. HVE : le pilier « irrigation » (texte de l'article, pas du tableau)
**Inexact.** L'article dit : « chaque goutte utilisée pour nettoyer la cave est comptée ». Le 4e pilier de la HVE porte sur la **gestion de l'irrigation** des cultures, pas sur l'eau de la cave. Ce paragraphe apparaît en plus **deux fois**. **Non modifié** : à vous de choisir la reformulation.
Sources : [Chambre d'agriculture – nouveau référentiel HVE 2022](https://agri82.chambre-agriculture.fr/fileadmin/user_upload/Occitanie/075_Inst-Tarn-et-Garonne/8-Archives/Archives_2022/actualites_2022/Nouveau_referentiel_HVE_2022_2.pdf) · [DRAAF Nouvelle-Aquitaine – brochure HVE](https://draaf.nouvelle-aquitaine.agriculture.gouv.fr/IMG/pdf/brochure_hve_draaf_na_23072023-1-2.pdf).

### 3. VDC
Exact : certification créée par la filière champenoise (Comité Champagne). Elle couvre les sols, l'eau, les intrants, la biodiversité, le carbone et les paysages. Elle va au-delà de la HVE niveau 3 et concernait 46 % des surfaces en 2022.
**Divergence** : date de lancement (2014 ou 2015 selon les sources), donc non citée.
Sources : [Comité Champagne – fiche développement durable](https://www.champagne.education/sites/default/files/2023-12/Fiche-Developpement-Durable-Champagne-FR.pdf) · [Référentiel VDC, version 8.0 (préfecture de l'Aisne)](https://www.aisne.gouv.fr/index.php/contenu/telechargement/27707/182449/file/referentiel_avec_photos_version_8.0_janvier2020.pdf) · [Question parlementaire, Assemblée nationale](https://www.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE36484.pdf) · [BKWine](https://www.bkwine.com/news/new-environmental-certification-in-champagne-vdc/).

### 4. Terra Vitis : « uniquement si la récolte est menacée »
**Simplification, non confirmée mot pour mot.** Terra Vitis est une démarche de viticulture raisonnée : chaque intervention doit être justifiée et tracée. La règle exacte « seulement si la récolte est menacée » ne figure pas dans les documents publics trouvés. Le texte est gardé tel quel. Une formulation plus sûre serait : « Les produits de synthèse sont utilisés seulement quand c'est justifié. »
Sources : [Chambre d'agriculture de Gironde – formation Terra Vitis](https://gironde.chambre-agriculture.fr/fileadmin/user_upload/Nouvelle-Aquitaine/100_Inst-Gironde/Documents/pdf_formations/2024/Environnement/24_VVT_001__vers_la_viti_durable_par_terravitis_2j_V5.pdf) · [Terra Vitis – communiqué 2026](https://terravitis.com/wp-content/uploads/2026/07/CP-N°13-TERRA-VITIS2.pdf).

### 5. Agriculture biologique : « zéro chimie »
**Inexact**, comme vous l'aviez noté. Le bio interdit les produits chimiques de synthèse, mais autorise le **cuivre et le soufre** (doses plafonnées) ainsi que des extraits de plantes. Les phosphonates ne sont pas admis.
→ Dans le tableau : « Aucun produit chimique de synthèse : la vigne est protégée uniquement avec des produits d'origine naturelle (dont le cuivre et le soufre, en quantités limitées). »
Sources : règlement (UE) 2018/848, en application depuis 2022 · [Réussir – quatre questions sur la réglementation bio européenne](https://reussir.fr/vigne/quatre-questions-sur-la-reglementation-bio-europeenne) · [Pleinchamp – restrictions sur le cuivre](https://www.pleinchamp.com/actualite/restrictions-d-usage-du-cuivre-en-vigne-un-parfum-d-impasse-technique-et-de-surtransposition) · [INAO – guide de lecture vin bio](https://www.inao.gouv.fr/fichier/Guide-de-lecture-RCE-203-VIN-BIO-juin2012.pdf).

### 6. Biodynamie (Demeter, Biodyvin)
- Exact : Demeter exige d'être **déjà certifié bio**, et impose les préparations biodynamiques (500 ou 500P sur les sols et les vignes, préparations 502 à 507 pour les composts).
- **À nuancer** : le **calendrier lunaire** est très suivi, mais il ne figure pas comme une obligation dans les documents Demeter trouvés. Dans le tableau, j'ai donc écrit : « travail souvent guidé par le calendrier lunaire ».
- **Inexact dans le texte de l'article** : « Elle interdit tous les produits chimiques ». Le cuivre et le soufre restent autorisés (Demeter : cuivre plafonné à 3 kg/ha/an en moyenne sur 7 ans ; Biodyvin : 4 kg/ha/an). **Non modifié** : à vous de choisir.

Sources : [Demeter – fiche technique viticulture 2026](https://www.demeter.fr/wp-content/uploads/2026/03/FT-2026-Viticulture-WEB.pdf) · [Demeter – comparatif bio et Demeter](https://www.demeter.fr/wp-content/uploads/2022/04/Comparatif-viti-2022-plaquette.pdf) · [Réussir – biodynamie, une démarche mais deux marques](https://www.reussir.fr/vigne/biodynamie-une-demarche-mais-deux-marques).

### 7. Indice nature
Échelle **éditoriale** (la vôtre), pas une note officielle. Je n'y ai pas touché.

## Corrections faites dans l'article (validées par Julien, retours PR #15)

| Passage | Avant | Après | Source |
|---|---|---|---|
| HVE, pilier « eau » | « chaque goutte utilisée pour nettoyer la cave est comptée » | Le pilier porte sur l'**irrigation** des cultures ; en Champagne, le cahier des charges **interdit d'irriguer** la vigne, donc il est respecté d'office | Référentiel HVE 2022 (sources ci-dessus) · cahier des charges AOC Champagne, ch. I « Irrigation : l'irrigation est interdite » |
| HVE, piliers | le paragraphe « irrigation » apparaissait **deux fois** | doublon supprimé (FR et EN) | — |
| HVE, stratégie phytosanitaire | « uniquement si la météo l'impose » | traitements raisonnés et notés selon la pression des maladies ; CMR 1 interdits depuis 2023 | Référentiel HVE 2022, note des Chambres d'agriculture |
| Terra Vitis, traçabilité | « justifier qu'aucune alternative naturelle n'était possible pour sauver la récolte » | « il doit pouvoir le justifier » (règle exacte non publiée) | Chambre d'agriculture de Gironde, Terra Vitis |
| Biodynamie | « Elle interdit tous les produits chimiques… et le calendrier lunaire » | reprend les règles du bio : pas de chimie de synthèse, **cuivre et soufre autorisés** en quantités encore plus limitées ; calendrier lunaire **souvent suivi, sans obligation** | Demeter (fiche viticulture 2026, comparatif bio/Demeter) · Réussir |
| Demeter et Biodyvin | « Biodyvin est plus spécifique au monde viticole français… garantit des raisins sains et de haute qualité » | Demeter : marque internationale, toutes productions ; Biodyvin : réservé aux vignerons, admission avec dégustation ; les deux exigent la certification bio | Réussir – « Biodynamie, une démarche mais deux marques » · Demeter |

Vérifié et **gardé tel quel** : HVE certification d'État, seul le niveau 3 porte un logo ; Terra Vitis propre au vin ; VDC propre à la Champagne (sols, eau, intrants, biodiversité, carbone ; 46 % des surfaces en 2022, d'où « une grande partie ») ; bio sans pesticides ni herbicides de synthèse, cuivre, soufre et désherbage mécanique ; climat humide qui favorise les maladies.
Dans le **tableau**, la phrase Terra Vitis « que si la récolte est menacée » est gardée (votre texte) ; dites-moi si vous préférez « seulement quand c'est justifié ».
