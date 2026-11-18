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

## Formulaires

- 9 formulaires, tous définis dans `src/lib/forms/definitions.ts` (grille tarifaire Pro, dégustation en établissement, vigneron partenaire, devis entreprise, brochure CSE, réservation d'expérience, conseil événement, inscription événement, contact).
- Un seul composant `LeadForm` et une seule fonction d'envoi (`src/app/actions/forms.ts`) : validation, case « 18 ans ou plus » obligatoire, mention RGPD, anti-spam (champ piège, délai minimal, limite par adresse IP, Cloudflare Turnstile si configuré).
- Envoi par **Resend** à l'adresse « Adresse qui reçoit les formulaires » des Réglages du site, avec « Répondre » directement au visiteur, et accusé de réception au visiteur dans sa langue.
- Variables à régler sur Netlify : voir `.env.example`. Sans `RESEND_API_KEY`, le formulaire affiche un message invitant à écrire à contact@champagnedelaube.fr.

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
