# Mise en ligne sur champagnedelaube.fr : ce qui reste à faire

Légende : **🔴 obligatoire avant la mise en ligne** · 🟠 fortement conseillé · ⚪ peut attendre.
Qui : **Vous** (Studio Sanity, Netlify, Brevo, registrar) · **Claude** (code).

## 1. Code et pages (Claude, « étape 10 »)

| | Tâche | Qui |
|---|---|---|
| 🔴 | Fusionner les PR dans l'ordre : #10, #8, #9, puis la PR des retours (#11) | Vous |
| 🔴 | **Lever le blocage Google** : aujourd'hui tout le site est en `noindex, nofollow` (site en construction). À retirer le jour J seulement | Claude |
| ✅ / 🔴 | **Page Mentions légales** créée (`/mentions-legales/`) : il reste à remplir les champs [À COMPLÉTER] (nom ou raison sociale, statut, SIRET, adresse, directeur de la publication, adresse de l'hébergeur, crédits photos), dans le Studio (Autres pages → Mentions légales) ou en me les envoyant | Vous |
| ✅ | **Redirections 301** faites (`src/redirections.ts`) : `/champagne-aube/`, catégories, étiquette, auteurs, flux, liens courts `?p=` et `?page_id=`. Les 7 articles et les 10 pages historiques gardent leur adresse | Claude |
| ✅ | **sitemap.xml** (langues actives, hreflang) et **robots.txt** faits | Claude |
| 🟠 | Page 404 soignée, et vrai code 404 pour les adresses inconnues (aujourd'hui la page « introuvable » s'affiche, avec un noindex) | Claude |
| 🟠 | Données structurées générales (Organisation, fil d'Ariane : déjà en place ; vérification finale dans l'outil de test de Google) | Claude |
| ⚪ | Page « Où trouver nos pépites ? » (cachée tant que l'interrupteur des Réglages est éteint) | Claude, plus tard |
| ⚪ | Protection anti-robots Cloudflare Turnstile sur les formulaires (le champ piège, le délai et la limite par adresse sont déjà actifs) | Claude + vous (clé gratuite) |

## 2. Contenus (vous, dans le Studio)

| | Tâche |
|---|---|
| 🔴 | **Relire et publier** les brouillons repris de l'ancien site (accueil, Espace Pro, Entreprises & CSE, Nos Dégustations, pages). Rien n'est publié aujourd'hui : le site affiche les textes par défaut |
| 🔴 | **Réglages du site** : adresse qui reçoit les formulaires, réseaux sociaux, signature, langues actives (FR, EN, NL, IT) |
| 🔴 | **Fiches vignerons** : au moins les domaines de votre sélection, avec portrait, village, terroir, philosophie. Aujourd'hui seules 2 fiches par défaut s'affichent (Moutard-Dangin, Mennetrier) |
| ✅ | **Langues au lancement : français et anglais** (NL, IT, DE masquées, réactivables dans « Langues actives ») |
| 🔴 | Traductions **anglaises** des contenus publiés dans le Studio (un avertissement orange signale celles qui manquent) |
| 🟠 | Relire et publier les brouillons importés : textes des terroirs, page « Les terroirs de l'Aube », 6 articles sur les cépages (import fait ; sauvegardes dans `docs/import-*-sauvegarde.json`) |
| 🟠 | Publier les 7 articles repris (corrections loi Évin déjà appliquées dans les brouillons) |
| 🟠 | Au moins un **format de dégustation** (document « Expérience ») avec durée, nombre de personnes, prix « à partir de » ou vide (« Sur demande ») |
| 🟠 | **Catalogue PDF « Notre sélection »** (Réglages du site) et **brochure CSE** (Entreprises & CSE) |
| 🟠 | Trancher les points listés dans `docs/terroirs-sources.md` (surface de Montgueux, rattachement de Villenauxe-la-Grande…) |
| ⚪ | FAQ des pages (Espace Pro, Vos Grands Événements, Nos Dégustations) : elles n'apparaissent que remplies |

## 3. Photos

| | Tâche |
|---|---|
| 🔴 | Grande image d'ouverture de l'accueil (paysage de la Côte des Bar ou vigneron dans ses parcelles), photo de la section « Dégustations privées » (accueil) et ouverture de la page Dégustations privées (voir `docs/photos-proposition.md`) |
| 🟠 | Une photo par terroir, un portrait par vigneron ; remplacer la photo « Montgueux » (en réalité Troyes) et les images signalées dans `docs/reprise-wordpress.md` (ancien logo, soirée verres levés, photos de banque d'images) |
| ⚪ | Une photo par article du Mag |

## 4. Domaine, Netlify, Brevo, Sanity (vous, avec mes instructions pas à pas)

| | Tâche |
|---|---|
| 🔴 | **Domaine** : chez votre registrar (à identifier), faire pointer `champagnedelaube.fr` vers Netlify ; dans Netlify, ajouter le domaine (sans www) comme domaine principal, `www` en redirection ; vérifier le certificat HTTPS |
| 🔴 | **Brevo, authentification du domaine** : ajouter dans les DNS les enregistrements SPF, DKIM et DMARC donnés par Brevo (Expéditeurs, domaines et IP dédiées → Domaines). Sans eux, les e-mails risquent d'arriver en indésirables |
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
