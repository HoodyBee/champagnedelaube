# Champagne de l'Aube — site web

Refonte de [champagnedelaube.fr](https://champagnedelaube.fr) : Next.js, Tailwind CSS, Sanity, hébergé sur Netlify.

## Lancer le site sur votre ordinateur

Prérequis : [Node.js](https://nodejs.org) version 22 ou plus.

```bash
npm install
```

```bash
npm run dev
```

Puis ouvrez http://localhost:3000 dans votre navigateur. Le Studio Sanity (administration des contenus) est sur http://localhost:3000/studio.

Avant le premier lancement, copiez `.env.example` en `.env.local` et remplissez l'identifiant de votre projet Sanity.

## Où se trouve quoi

| Dossier / fichier | Rôle |
| --- | --- |
| `BRAND_BOOK.md` | Le brand book : il fait foi. |
| `tokens.json` | **Source unique** des couleurs, polices, espacements et arrondis. |
| `scripts/generate-tokens.mjs` | Transforme `tokens.json` en `src/styles/tokens.css` (lancé automatiquement). |
| `public/brand/` | Logos, terroirs, thèmes, pictos et cépages officiels (ne jamais les retoucher). |
| `src/lib/brand.ts` | Registre des fichiers de marque : c'est ici qu'on bascule un PNG vers son SVG. |
| `src/app/[locale]/` | Les pages du site, une version par langue. |
| `src/app/studio/` | Le Studio Sanity intégré (/studio). |
| `src/app/api/revalidate/` | Reçoit l'alerte de Sanity à chaque publication et met le site à jour. |
| `src/i18n/routing.ts` | Langues, langues publiées dans Google et URL traduites. |
| `messages/*.json` | Petits textes de l'interface (menus, boutons) dans chaque langue. |
| `src/sanity/schemaTypes/` | Les champs du Studio (vignerons, terroirs, offres, événements, pages). |
| `sanity.config.ts` | Configuration du Studio. |
| `src/components/` | Les briques réutilisables (badges, en-tête, pied de page…). |
| `src/components/layout/` | En-tête, sélecteur de langue, pied de page, vérification de l'âge. |
| `src/lib/site.ts` | Menus (terroirs, Espace Pro, contenus) et coordonnées par défaut. |

## Langues

- 5 langues : français par défaut (URL sans préfixe), puis `/en/`, `/nl/`, `/it/`, `/de/`.
- **Règle : tout le site est traduit dans les 5 langues, tout le temps.**
  - Textes de l'interface (menus, boutons, fenêtre d'âge…) : `messages/fr.json`, `en.json`, `nl.json`, `it.json`, `de.json`. Avant chaque build, `npm run check:i18n` vérifie qu'aucun texte ne manque ; s'il en manque un, le build s'arrête et indique lequel.
  - Contenus du Studio : chaque champ traduit affiche les 5 langues. Un avertissement orange « Traduction à compléter » apparaît tant qu'une langue est vide (la publication reste possible).
- Sécurité : un texte encore vide s'affiche en anglais, puis en français.
- Langues ouvertes à Google : `indexedLocales` dans `src/i18n/routing.ts` (aujourd'hui FR et EN ; NL, IT et DE seront ajoutées quand leurs contenus du Studio seront traduits).

## Fonds (décision novembre 2026)

Fond principal `blanc`. Touches de chaleur : classe `surface-chaude` (fond `creme-clair` + filet doré `filet`). Le `creme` d'origine est réservé au logo et à de rares accents.

## Formulaires, contacts et newsletter (Brevo)

**Formulaires** : 9 formulaires définis dans `src/lib/forms/definitions.ts`, un seul composant `LeadForm` et une seule fonction d'envoi (`src/app/actions/forms.ts`). Chaque formulaire a la case « 18 ans ou plus » (obligatoire), la case « actualités » (facultative, décochée), la mention RGPD et l'anti-spam (champ piège, délai minimal, limite par adresse IP, Cloudflare Turnstile si configuré).

À chaque demande, via **Brevo** :
1. vous recevez un e-mail (en français) à l'« Adresse qui reçoit les formulaires » des Réglages du site ; « Répondre » écrit au visiteur ;
2. le visiteur devient un **contact Brevo**, classé dans la liste de son profil (Professionnels, Entreprises & CSE, Particuliers, Vignerons), avec sa langue (`LANGUE`), la page d'origine (`PAGE_ORIGINE`), son profil (`PROFIL`), son établissement (`ETABLISSEMENT`) et, pour une dégustation privée, l’occasion choisie (`OCCASION`, en français, par exemple « Enterrement de vie de jeune fille ou de garçon (EVJF / EVJG) ») ;
3. il reçoit un accusé de réception dans sa langue ;
4. s'il a coché la case « actualités », il reçoit en plus l'e-mail de **double confirmation** de la newsletter.

**Newsletter** : bandeau refermable au-dessus de l'en-tête → page `/newsletter/`, et formulaire dans le pied de page. Même parcours : e-mail + 18 ans + consentement → e-mail de confirmation (lien signé, valable 7 jours) → page de confirmation avec un bouton → le contact est ajouté à la liste **Newsletter** (attribut `NEWSLETTER_CONSENTEMENT` = date). **N'envoyez vos campagnes qu'à la liste « Newsletter »** : les autres listes contiennent des personnes qui n'ont pas demandé la newsletter.

Les 5 listes (dossier « Site internet ») et les 5 attributs sont **créés automatiquement** dans Brevo s'ils n'existent pas.

**Tâche hebdomadaire** (`netlify/functions/brevo-keepalive.mts`, chaque lundi à 7 h UTC) : utilise la clé (Brevo la désactive après 90 jours sans usage), vérifie l'accès aux contacts et l'envoi (mode « bac à sable », rien n'est envoyé), et la date d'expiration. En cas de problème : e-mail d'alerte via Brevo et, en secours, notification du formulaire Netlify « alerte-technique ». Lancement manuel : Netlify → Logs → Functions → `brevo-keepalive` → Run now.

### Renouveler la clé Brevo (avant le 18 novembre 2027, ou si vous recevez une alerte)
1. Brevo → menu en haut à droite (votre nom) → **SMTP & API** → onglet **API Keys** → **Generate a new API key**. Nom : `site-netlify-AAAA`. Si Brevo propose des droits restreints : **Transactional emails** et **Contacts** uniquement.
2. Copiez la clé (elle ne s'affiche qu'une fois).
3. Netlify → **Project configuration** → **Environment variables** → `BREVO_API_KEY` → **Edit** → collez la nouvelle clé → **Save**.
4. Toujours dans Netlify, mettez à jour `BREVO_KEY_EXPIRES` avec la nouvelle date d'expiration indiquée par Brevo (format AAAA-MM-JJ).
5. **Deploys** → **Trigger deploy** → **Deploy project** (les variables ne sont prises en compte qu'au déploiement suivant).
6. Vérifiez : Netlify → Logs → Functions → `brevo-keepalive` → **Run now** : le journal doit afficher `"ok":true`.
7. Dans Brevo, supprimez l'ancienne clé.

## Vocabulaire

`npm run check:i18n` (lancé avant chaque build) bloque aussi les expressions interdites par la stratégie : « sans intermédiaire », « maison de champagne » (et leurs équivalents dans les 4 autres langues).

## Vérification de l'âge

Une fenêtre s'affiche à la première visite. La réponse est gardée un an dans le cookie technique `cda_age`. Pour la revoir pendant vos tests : ouvrez une fenêtre de navigation privée. Tout le contenu reste dans le HTML : Google indexe les pages normalement.

## Modifier la charte

1. Modifiez la valeur dans `tokens.json`.
2. Lancez `npm run tokens` (ou relancez `npm run dev`).

## Remplacer une vignette PNG par un SVG

1. Déposez le SVG dans le même dossier, avec le même nom (ex. `public/brand/pictos/bio.svg`).
2. Dans `src/lib/brand.ts`, changez `bio.png` en `bio.svg`. Si le SVG est le picto seul (sans fond ni texte), remplacez aussi `vignette(...)` par un objet avec `format: "picto"` : le site l'affichera alors en blanc dans une pastille ronde de sa couleur, avec son nom à côté.

## Classes utiles (charte)

- Couleurs : `bg-creme`, `text-anthracite`, `text-bronze`, `bg-or`, `bg-story-riceys`, `bg-theme-bio`, `bg-cepage-noir`…
- Textes : `text-titre-logo`, `text-titre-post`, `text-titre-section`, `text-accroche`, `text-corps`, `text-traduction`, `text-bandeau`, `text-sur-titre`, `text-legende`.
- Espacements : `p-space-1` (8 px) à `p-space-5` (64 px), idem pour `m-`, `gap-`…
- Arrondis : `rounded-photo` (0), `rounded-etiquette` (4 px), `rounded-carte` (12 px), `rounded-rond`.

Rappels : `or` ne sert jamais pour du texte (utiliser `bronze`) ; Inter (`font-sans`) uniquement en petites capitales espacées.
