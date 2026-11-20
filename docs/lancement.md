# Mise en ligne sur champagnedelaube.fr : ce qui reste à faire

Légende : **🔴 obligatoire avant la mise en ligne** · 🟠 fortement conseillé · ⚪ peut attendre.
Qui : **Vous** (Studio Sanity, Netlify, Brevo, registrar) · **Claude** (code).

## 1. Code et pages (Claude, « étape 10 »)

| | Tâche | Qui |
|---|---|---|
| 🔴 | Fusionner la PR de l'étape 12 (publication, rubriques, Studio, marronnier, maillage) | Vous |
| 🔴 | **Lever le blocage Google** : aujourd'hui tout le site est en `noindex, nofollow` (site en construction). À retirer le jour J seulement | Claude |
| ✅ | **Mentions légales complètes** (éditeur, SIRET, siège, directeur de la publication, conception, Netlify, OVH, données, cookies, mention sanitaire). Adresse du siège modifiable dans Réglages → Contact, affichée uniquement sur les pages légales | Claude |
| ✅ | **Icônes Instagram et Facebook** : en-tête (ordinateur), menu mobile, pied de page ; lien « Suivez-nous sur Instagram » dans l'appel final de l'accueil | Claude |
| ✅ | **Redirections 301** faites (`src/redirections.ts`) : `/champagne-aube/`, catégories, étiquette, auteurs, flux, liens courts `?p=` et `?page_id=`. Les 7 articles et les 10 pages historiques gardent leur adresse | Claude |
| ✅ | **sitemap.xml** (langues actives, hreflang) et **robots.txt** faits | Claude |
| 🟠 | Page 404 soignée, et vrai code 404 pour les adresses inconnues (aujourd'hui la page « introuvable » s'affiche, avec un noindex) | Claude |
| 🟠 | Données structurées générales (Organisation, fil d'Ariane : déjà en place ; vérification finale dans l'outil de test de Google) | Claude |
| ⚪ | Page « Où trouver nos pépites ? » (cachée tant que l'interrupteur des Réglages est éteint) | Claude, plus tard |
| ⚪ | Protection anti-robots Cloudflare Turnstile sur les formulaires (le champ piège, le délai et la limite par adresse sont déjà actifs) | Claude + vous (clé gratuite) |

## 2. Contenus (vous, dans le Studio)

| | Tâche |
|---|---|
| ✅ / 🔴 | **Tout est publié** (sauvegarde : `docs/sauvegardes/`), sauf le portrait Daniel Pétré & Fils, resté en brouillon. À relire dans le Studio |
| ✅ / 🟠 | **Réglages du site** créés et publiés (e-mail, Instagram, Facebook, signature, siège, langues FR et EN). À vérifier : l'adresse qui reçoit les formulaires |
| 🔴 | **Fiches vignerons** : au moins les domaines de votre sélection, avec portrait, village, terroir, philosophie. Aujourd'hui seules 2 fiches par défaut s'affichent (Moutard*Dangin, Mennetrier) |
| ✅ | **Langues au lancement : français et anglais** (NL, IT, DE masquées, réactivables dans « Langues actives ») |
| ✅ | **Traductions anglaises** publiées. L'article sur le rap (français seulement) n'est pas indexé en anglais |
| 🟠 | Relire les 18 articles publiés ; sources dans `docs/articles-cepages-sources.md` et `docs/marronnier-2027-sources.md` |
| 🟠 | **Mes événements** : saisir vos rendez-vous dans « Mes événements (calendrier) » : ils apparaissent sur l'accueil, dans le marronnier et le PDF |
| 🟠 | Marronnier : décocher « à confirmer » quand Bières à Troyes, la Route du Champagne en fête, le Week-end des Grands Crus et la Fête des vendanges de Montmartre annonceront leurs dates 2027 |
| ✅ | 6 articles repris de l'ancien site publiés (rubriques attribuées) |
| 🟠 | Portrait Daniel Pétré & Fils : préciser s'il s'agit d'une collaboration commerciale (case « Collaboration commerciale » de l'article) |
| 🟠 | Au moins un **format de dégustation** (document « Expérience ») avec durée, nombre de personnes, prix « à partir de » ou vide (« Sur demande ») |
| 🟠 | **Catalogue PDF « Notre sélection »** (Réglages du site) et **brochure CSE** (Entreprises & CSE) |
| 🟠 | Trancher les points listés dans `docs/terroirs-sources.md` (surface de Montgueux, rattachement de Villenauxe-la-Grande…) |
| ⚪ | FAQ des pages (Espace Pro, Vos Grands Événements, Nos Dégustations) : elles n'apparaissent que remplies |

## 3. Photos

| | Tâche |
|---|---|
| ✅ | Photos placées en brouillon : vignes de la Côte des Bar (accueil), service en dégustation (accueil et Dégustations privées), dégustation en plein air (Vos Grands Événements), caves voûtées (Les terroirs de l'Aube) |
| 🟠 | Remplacer la photo « Montgueux » (en réalité Troyes), ajouter une photo pour Les Riceys, un portrait par vigneron, et les images signalées dans `docs/reprise-wordpress.md` |
| ⚪ | Une photo par article du Mag |

## 4. Domaine, Netlify, Brevo, Sanity (vous, avec mes instructions pas à pas)

| | Tâche |
|---|---|
| 🔴 | **Domaine** : chez OVH (DNS chez OVH), faire pointer `champagnedelaube.fr` vers Netlify ; dans Netlify, ajouter le domaine (sans www) comme domaine principal, `www` en redirection ; vérifier le certificat HTTPS |
| 🔴 | **Brevo, authentification du domaine** : suivre `docs/brevo-domaine-ovh.md` (code Brevo, DKIM, DMARC en mode observation, sans toucher aux e-mails OVH ni à l'ancien site) |
| 🔴 | **Webhook Sanity** + variable `SANITY_REVALIDATE_SECRET` dans Netlify (instructions données à l'étape 6), avec l'adresse définitive `https://champagnedelaube.fr/api/revalidate/` |
| 🔴 | **Sanity, CORS** : ajouter `https://champagnedelaube.fr` dans sanity.io/manage → API → CORS origins (pour le Studio sur le domaine) |
| 🔴 | **Sécurité** : supprimer la clé d'écriture Sanity (« Sanity write token (import) ») dans sanity.io/manage → API → Tokens, et dans les réglages de l'environnement cloud (Network secrets), une fois les imports vérifiés |
| 🟠 | Variables Netlify à vérifier : `BREVO_API_KEY`, `BREVO_KEY_EXPIRES`, `NEWSLETTER_SECRET`, `SANITY_REVALIDATE_SECRET` (et Turnstile si activé) |
| 🟠 | Netlify : notifications du formulaire « alerte-technique » vers votre e-mail |

## 5. Tests le jour J (ensemble)

| | Test |
|---|---|
| 🔴 | Un vrai envoi de chaque type de formulaire (Pro, Entreprises, dégustation, événement, contact, catalogue, newsletter) : notification reçue, accusé de réception, contact dans la bonne liste Brevo, double confirmation de la newsletter |
| 🔴 | Fenêtre d'âge, mention sanitaire, liens du pied de page, sélecteur de langue, sur ordinateur et mobile |
| 🔴 | Anciennes adresses : vérifier que les 7 articles et les pages historiques répondent, et que les redirections fonctionnent |
| 🟠 | Google Search Console : valider le domaine, envoyer le sitemap, surveiller les erreurs la première semaine |
| 🟠 | Vitesse (PageSpeed Insights) sur mobile, une fois les photos en place |
| ⚪ | Fiche Google Business Profile à jour (adresse, site, horaires des dégustations) |

## Pas nécessaire au lancement

- **Bandeau cookies** : le site ne dépose aujourd'hui aucun cookie de mesure d'audience ni de publicité (seulement des cookies techniques : âge, newsletter). Si vous ajoutez plus tard un outil de statistiques, il faudra un bandeau de consentement.
- **Conditions générales de vente** : pas de vente ni de paiement en ligne (devis et réservations par formulaire).
- **Allemand** : masqué, réactivable plus tard.
