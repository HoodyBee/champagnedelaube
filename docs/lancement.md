# Mise en ligne sur champagnedelaube.fr : ce qui reste à faire

Légende : **🔴 obligatoire avant la mise en ligne** · 🟠 fortement conseillé · ⚪ peut attendre.
Qui : **Vous** (Studio Sanity, Netlify, Brevo, registrar) · **Claude** (code).

## 1. Code et pages (Claude, « étape 10 »)

| | Tâche | Qui |
|---|---|---|
| 🔴 | Fusionner les PR dans l'ordre : #10, #8, #9, puis la PR des retours (#11) | Vous |
| 🔴 | **Lever le blocage Google** : aujourd'hui tout le site est en `noindex, nofollow` (site en construction). À retirer le jour J seulement | Claude |
| 🔴 | **Page Mentions légales** (`/mentions-legales/`) : le lien existe dans le pied de page mais la page n'est pas encore créée. Il faudra vos informations : raison sociale ou nom, statut, SIRET, adresse, directeur de la publication, hébergeur (Netlify) | Claude + vos informations |
| 🔴 | **Redirections 301** des anciennes adresses WordPress qui disparaissent : `/champagne-aube/` (ancienne page) → `/le-terroir-de-laube/`, catégories, étiquettes, pages auteur, flux RSS, `?p=123`, `/wp-content/uploads/…` des images connues de Google. Les 7 articles et les pages historiques gardent leur adresse | Claude (liste à partir du sitemap actuel) |
| 🔴 | **sitemap.xml** (langues actives seulement) et **robots.txt** | Claude |
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
| 🔴 | **Traductions NL et IT** des contenus du Studio : sans elles, les pages néerlandaises et italiennes affichent l'anglais. Sinon, garder NL et IT décochées dans « Langues actives » au lancement (elles restent prêtes) |
| 🟠 | Importer (avec une clé d'écriture) puis relire et publier : textes des terroirs (`scripts/import-terroirs.mjs`) et articles sur les cépages (`scripts/import-articles.mjs`) |
| 🟠 | Publier les 7 articles repris (corrections loi Évin déjà appliquées dans les brouillons) |
| 🟠 | Au moins un **format de dégustation** (document « Expérience ») avec durée, nombre de personnes, prix « à partir de » ou vide (« Sur demande ») |
| 🟠 | **Catalogue PDF « Notre sélection »** (Réglages du site) et **brochure CSE** (Entreprises & CSE) |
| 🟠 | Trancher les points listés dans `docs/terroirs-sources.md` (surface de Montgueux, rattachement de Villenauxe-la-Grande…) |
| ⚪ | FAQ des pages (Espace Pro, Vos Grands Événements, Nos Dégustations) : elles n'apparaissent que remplies |

## 3. Photos

| | Tâche |
|---|---|
| 🔴 | Grande image d'ouverture de l'accueil (paysage de vignes) et photo de Nos Dégustations (voir `docs/photos-proposition.md`) |
| 🟠 | Une photo par terroir, un portrait par vigneron ; remplacer la photo « Montgueux » (en réalité Troyes) et les images signalées dans `docs/reprise-wordpress.md` (ancien logo, soirée verres levés, photos de banque d'images) |
| ⚪ | Une photo par article du Mag |

## 4. Domaine, Netlify, Brevo, Sanity (vous, avec mes instructions pas à pas)

| | Tâche |
|---|---|
| 🔴 | **Domaine** : chez votre registrar (à identifier), faire pointer `champagnedelaube.fr` vers Netlify ; dans Netlify, ajouter le domaine (sans www) comme domaine principal, `www` en redirection ; vérifier le certificat HTTPS |
| 🔴 | **Brevo, authentification du domaine** : ajouter dans les DNS les enregistrements SPF, DKIM et DMARC donnés par Brevo (Expéditeurs, domaines et IP dédiées → Domaines). Sans eux, les e-mails risquent d'arriver en indésirables |
| 🔴 | **Webhook Sanity** + variable `SANITY_REVALIDATE_SECRET` dans Netlify (instructions données à l'étape 6), avec l'adresse définitive `https://champagnedelaube.fr/api/revalidate/` |
| 🔴 | **Sanity, CORS** : ajouter `https://champagnedelaube.fr` dans sanity.io/manage → API → CORS origins (pour le Studio sur le domaine) |
| 🔴 | **Sécurité** : une clé d'écriture Sanity est toujours enregistrée dans l'environnement de travail de Claude (« Sanity reprise WordPress »). Si vous ne voulez plus qu'elle serve, supprimez-la dans sanity.io/manage → API → Tokens, et dans les réglages de l'environnement cloud (Network secrets) |
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
