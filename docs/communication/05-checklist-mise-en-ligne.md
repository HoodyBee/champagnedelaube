# Checklist unique de mise en ligne

À suivre **dans l'ordre**, en cochant au fur et à mesure.

Le détail des explications reste dans :
- `docs/mise-en-ligne.md` (indexation, audience, Search Console) ;
- `docs/brevo-domaine-ovh.md` (DNS pour Brevo) ;
- `docs/lancement.md` (liste complète avant lancement).

---

## ⛔ À NE SURTOUT PAS TOUCHER CHEZ OVH

- **Les lignes MX** (`mx1`, `mx2`, `mx3.mail.ovh.net`) : c'est la réception de vos e-mails. Les modifier = plus d'e-mails.
- **La ligne SPF existante** (`v=spf1 include:mx.ovh.com ~all`) : ne la supprimez pas et n'en créez pas une seconde. Deux SPF = erreur.
- **Les serveurs DNS** du domaine (ns18.ovh.net, dns18.ovh.net) : ne les changez pas pour ceux de Netlify. Vous devriez alors tout recopier, e-mails compris.
- **La ligne TXT ajoutée par OVH** (lien Instagram) : laissez-la.
- **La messagerie OVH** (boîtes, redirections) : rien à faire.
- **Règle d'or** : **on AJOUTE des lignes, on ne SUPPRIME rien**, sauf la ligne A de l'ancien site, au moment prévu (étape 2).
- **Toujours** : faites un **export de la zone DNS** (Zone DNS > « Exporter ») avant toute modification. C'est votre sauvegarde.

---

## 1. Netlify (le site)

- [ ] **Fusionner la PR** du nouveau site sur GitHub, quand vous l'avez relue. Netlify publie automatiquement.
- [ ] **Variables d'environnement** (Site configuration > Environment variables) : vérifier qu'elles existent.
  - `BREVO_API_KEY` et `BREVO_KEY_EXPIRES`
  - `NEWSLETTER_SECRET`
  - `SANITY_REVALIDATE_SECRET`
  - Facultatif : `NEXT_PUBLIC_PLAUSIBLE_SCRIPT` (mesure d'audience) et `GOOGLE_SITE_VERIFICATION`.
- [ ] **Ajouter le domaine** (Domain management > Add a domain) : `champagnedelaube.fr` comme domaine principal, et `www.champagnedelaube.fr` en redirection vers lui.
- [ ] **Noter les valeurs DNS** que Netlify affiche pour le domaine : une ligne **A** pour `champagnedelaube.fr` et un **CNAME** pour `www`. **Copiez exactement les valeurs données par Netlify**, ne recopiez pas d'exemple.

## 2. OVH : faire pointer le site vers Netlify

Espace client OVHcloud > Web Cloud > Noms de domaine > `champagnedelaube.fr` > **Zone DNS**.

- [ ] **Exporter la zone DNS** (sauvegarde).
- [ ] **Ligne A du domaine** (`champagnedelaube.fr`, actuellement `51.91.236.193`, l'ancien site) : **modifier** la valeur pour celle donnée par Netlify. C'est la seule ligne existante que l'on modifie.
- [ ] **Ligne `www`** : si elle existe, la modifier en **CNAME** vers la valeur Netlify ; sinon, l'ajouter.
- [ ] **Ne rien toucher d'autre** (MX, SPF, TXT).
- [ ] Revenir dans Netlify : attendre que le domaine soit vérifié et que le **certificat HTTPS** soit actif. Cela peut prendre de quelques minutes à quelques heures, parfois jusqu'à 48 h.

## 3. OVH : Brevo (pour que les e-mails du site arrivent bien)

Détail pas à pas : `docs/brevo-domaine-ovh.md`.

- [ ] Dans Brevo, **Expéditeurs, domaines** > Ajouter `champagnedelaube.fr` et noter les valeurs **de votre compte**.
- [ ] Dans OVH, **AJOUTER** (sans rien supprimer) :
  - le **code Brevo** (TXT) ;
  - les **2 lignes DKIM** (CNAME `brevo1._domainkey` et `brevo2._domainkey`, ou ce que Brevo demande) ;
  - la ligne **DMARC** en mode observation : `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`.
- [ ] Dans Brevo : « Authentifier ce domaine », puis vérifier l'expéditeur `contact@champagnedelaube.fr`.
- [ ] **Ne pas passer DMARC en `quarantine` ou `reject`** pour l'instant.

## 4. Sanity

- [ ] **CORS** (sanity.io/manage > API > CORS origins) : ajouter `https://champagnedelaube.fr`.
- [ ] **Webhook de mise à jour** : adresse `https://champagnedelaube.fr/api/revalidate/`, avec le même secret que `SANITY_REVALIDATE_SECRET`.
- [ ] **Publier ce qui doit l'être** : la page « Notre démarche » (ancienne « Qui suis-je ? ») une fois votre parcours complété, puis les articles relus (voir `docs/articles-sources.md`).

## 5. Tests (le jour même)

- [ ] **Navigation** : le site s'ouvre en `https://champagnedelaube.fr`, et `www` redirige bien vers la version sans `www`.
- [ ] **Anciennes adresses** : quelques-unes (par exemple d'anciens articles) redirigent vers les nouvelles.
- [ ] **Sur votre téléphone** : la fenêtre d'âge, le menu, la carte des terroirs et une page article.
- [ ] **Formulaires** : un vrai envoi de chaque type.
  - Pro, Entreprises, dégustation (avec l'occasion EVJF), contact, catalogue, newsletter.
  - Vous devez recevoir la notification. Le visiteur reçoit l'accusé de réception, et le contact arrive dans la bonne liste Brevo.
- [ ] **Newsletter** : l'e-mail de double confirmation arrive, le lien fonctionne, et l'e-mail de bienvenue part (voir `03-email-bienvenue-newsletter.md`).
- [ ] **E-mails OVH** : envoyez-vous un e-mail normal depuis votre messagerie OVH et répondez-y. Tout doit marcher comme avant.
- [ ] **Brevo** : un e-mail test vers Gmail affiche `DKIM: PASS` et `DMARC: PASS` (Gmail > « Afficher l'original »).
- [ ] **Studio** : modifier un petit texte, publier, et vérifier qu'il apparaît sur le site en moins d'une minute (webhook).
- [ ] **Partage** : coller l'adresse du site dans le [débogueur Facebook](https://developers.facebook.com/tools/debug/) et l'[inspecteur LinkedIn](https://www.linkedin.com/post-inspector/). L'image et le titre doivent s'afficher.

## 6. Google Search Console

- [ ] Ajouter une propriété de type **Domaine** : `champagnedelaube.fr`.
- [ ] Copier l'enregistrement **TXT** `google-site-verification=…` et l'**AJOUTER** dans la zone DNS OVH (sous-domaine vide). Ne pas remplacer les autres TXT.
- [ ] Valider (cela peut prendre quelques heures).
- [ ] **Sitemaps** : envoyer `https://champagnedelaube.fr/sitemap.xml`.
- [ ] Après quelques jours : vérifier les rubriques « Pages » (erreurs) et « Redirections ».
- [ ] Créer la **fiche Google Business Profile** (voir `02-google-business-profile.md`).

## 7. Sécurité

- [ ] **Clé Brevo** : noter sa date d'expiration (`BREVO_KEY_EXPIRES`). La tâche hebdomadaire vous alerte avant l'échéance.
- [ ] **Comptes** : activer la **double authentification** sur OVH, Netlify, GitHub, Sanity, Brevo et Google.
- [ ] **Accès** : vérifier qui a accès au Studio Sanity (sanity.io/manage > Members) et retirer les accès inutiles.
- [ ] **Clés et mots de passe** : ne jamais les envoyer par e-mail ou par message. Ils se saisissent uniquement dans Netlify, Sanity ou Brevo.
- [ ] **Sauvegardes** : garder l'export de la zone DNS du jour J. Les sauvegardes de contenu Sanity sont dans `docs/sauvegardes/`.
- [ ] **Ancien site** : le garder accessible chez votre hébergeur quelques semaines (sans le supprimer), au cas où il faudrait revenir en arrière. Pour revenir en arrière, remettre l'ancienne valeur de la ligne A (`51.91.236.193`).
