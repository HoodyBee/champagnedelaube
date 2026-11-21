# Mise en ligne : indexation, mesure d'audience, Search Console

## 1. Indexation par Google (automatique)

- Le site est **indexable seulement sur le site en ligne** : Netlify fournit la variable `CONTEXT=production` lors de la construction du site principal. Les aperçus de PR restent en `noindex`.
- Rien à faire : à la fusion, le site en ligne passe en `index, follow, max-image-preview:large`.
- Restent toujours hors de Google : les langues masquées (NL, IT, DE), les rubriques vides du Mag, Nos partenaires, la confirmation d'inscription, les pages 404.

## 2. Mesure d'audience : ce que je recommande

**Plausible Analytics** : la solution la plus simple qui respecte le RGPD **sans bandeau cookies**.

| | Plausible | Matomo (sans cookie) | Google Analytics |
|---|---|---|---|
| Cookie déposé | aucun | aucun si configuré pour (mode exemption CNIL) | oui |
| Bandeau de consentement | non nécessaire | non nécessaire si configuré selon la CNIL | obligatoire |
| Hébergement des données | Union européenne (Allemagne) | au choix (cloud en UE ou votre serveur) | États-Unis |
| Mise en place | une variable dans Netlify | plus technique (réglages à suivre à la lettre) | bandeau + réglages |
| Coût | payant (environ 9 $ par mois ; essai gratuit de 30 jours, **tarif à vérifier sur plausible.io**) | gratuit si auto-hébergé, payant en cloud | gratuit |

Pourquoi Plausible : le script est très léger (aucun effet sur la vitesse), le tableau de bord tient en une page et il n'y a aucun réglage de confidentialité à maintenir. L'obligation d'**informer** les visiteurs reste : le paragraphe est déjà prêt dans la politique de confidentialité et ne s'affiche qu'une fois la mesure activée.

Sources : [CNIL – solutions pour la mesure d'audience](https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience) (l'exemption de consentement « n'exempte pas l'obligation d'informer les utilisateurs ») · [European Alternatives – Plausible](https://european-alternatives.eu/product/plausible.io) (société en Estonie, données en UE).

### Ce qui est prêt (mais désactivé)

- `src/lib/audience.ts` et `src/components/layout/Audience.tsx` : le script n'est chargé **que** si la variable `NEXT_PUBLIC_PLAUSIBLE_SCRIPT` existe.
- Politique de confidentialité : le paragraphe « Mesure d'audience » (FR et EN) apparaît automatiquement à l'activation. **Relisez-le** avec la page « Data policy » de Plausible avant d'activer.

### Pour l'activer (10 minutes)

1. Créez un compte sur plausible.io et ajoutez le site `champagnedelaube.fr`.
2. Plausible vous donne un extrait de code : copiez seulement l'adresse du script (ce qui suit `src="`, par exemple `https://plausible.io/js/script.js`).
3. Dans Netlify : **Site configuration → Environment variables → Add a variable** : nom `NEXT_PUBLIC_PLAUSIBLE_SCRIPT`, valeur = l'adresse copiée. Puis **Deploys → Trigger deploy**.
4. Visitez le site : la visite apparaît dans Plausible en moins d'une minute.

## 3. Cookies et politique de confidentialité (vérifié le 21 novembre 2026)

Relevé fait en naviguant sur le site construit :

| Élément | Type | Durée | Annoncé dans les textes |
|---|---|---|---|
| `cda_age` | cookie + copie en stockage local | 1 an | oui (confidentialité et mentions légales) |
| `NEXT_LOCALE` | cookie | la visite | oui (confidentialité) ; **ajouté** aux mentions légales, qui annonçaient « un seul cookie » |
| `cda_nl_bar` | stockage local | — | oui |
| Images | chargées depuis `cdn.sanity.io` (aucun cookie) | — | Sanity est cité parmi les prestataires |

Aucun cookie publicitaire ni de mesure d'audience, aucun service tiers qui dépose des cookies : **pas besoin de bandeau cookies** (le site n'en a pas, et c'est cohérent).

## 4. Google Search Console

**Recommandé : la vérification par le DNS chez OVH** (elle couvre tout le domaine, avec et sans « www », et ne touche pas au site).

1. Dans [Search Console](https://search.google.com/search-console), « Ajouter une propriété » → type **Domaine** → `champagnedelaube.fr`.
2. Google affiche un enregistrement `TXT` (`google-site-verification=…`) : copiez-le.
3. Chez OVH : **Noms de domaine → champagnedelaube.fr → Zone DNS → Ajouter une entrée → TXT**, sous-domaine vide, collez la valeur. Validez.
4. Revenez dans Search Console et cliquez « Valider » (le DNS peut demander quelques heures).
5. Puis **Sitemaps** → envoyez `https://champagnedelaube.fr/sitemap.xml`.

**Autre possibilité (balise)** : un emplacement est prêt dans le code. Choisissez le type « Préfixe d'URL », méthode « Balise HTML », copiez seulement la valeur du `content="…"`, et ajoutez-la dans Netlify comme variable `GOOGLE_SITE_VERIFICATION`, puis relancez un déploiement. La balise `<meta name="google-site-verification">` apparaît alors sur toutes les pages.

## 5. Juste après la mise en ligne

- Tester le partage : [débogueur Facebook](https://developers.facebook.com/tools/debug/), [inspecteur LinkedIn](https://www.linkedin.com/post-inspector/), un envoi WhatsApp.
- Tester les données structurées : [résultats enrichis Google](https://search.google.com/test/rich-results).
- Dans Search Console, après quelques jours : « Pages » (erreurs d'indexation) et « Redirections ».
