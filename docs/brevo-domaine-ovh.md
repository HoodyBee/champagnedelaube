# Authentifier champagnedelaube.fr dans Brevo (DKIM, DMARC) depuis OVH

Objectif : que les e-mails envoyés par Brevo au nom de `@champagnedelaube.fr` (newsletter, confirmations des formulaires) arrivent en boîte de réception, sans rien casser :
- l'ancien site reste en ligne jusqu'au lancement ;
- vos e-mails actuels chez OVH continuent de fonctionner (réception et envoi).

**Règle d'or : on AJOUTE des lignes dans la zone DNS. On ne modifie ni ne supprime aucune ligne existante.**

## 1. Ce qui existe aujourd'hui (relevé du 19/11/2026)

| Type | Nom | Valeur | Rôle | À toucher ? |
|---|---|---|---|---|
| MX | champagnedelaube.fr | mx1 / mx2 / mx3.mail.ovh.net | réception de vos e-mails chez OVH | **Non** |
| TXT (SPF) | champagnedelaube.fr | `v=spf1 include:mx.ovh.com ~all` | autorise OVH à envoyer vos e-mails | **Non** (voir 4.c) |
| A | champagnedelaube.fr | 51.91.236.193 | l'ancien site | **Non** (changera seulement au lancement) |
| TXT | champagnedelaube.fr | `4\|https://www.instagram.com/...` | ligne ajoutée par OVH | **Non** |
| TXT | _dmarc | *(aucune)* | | à ajouter |
| DKIM Brevo | brevo1/brevo2._domainkey | *(aucune)* | | à ajouter |

Les serveurs DNS sont ceux d'OVH (ns18.ovh.net, dns18.ovh.net) : tout se passe dans votre espace client OVH.

## 2. Récupérer vos valeurs dans Brevo

1. Connectez-vous à Brevo.
2. Cliquez sur votre nom en haut à droite, puis **Expéditeurs, domaines et IP dédiées** et l'onglet **Domaines**.
3. Cliquez sur **Ajouter un domaine** et saisissez `champagnedelaube.fr`.
4. Si Brevo propose une **configuration automatique** avec OVHcloud, vous pouvez l'utiliser : Brevo ajoute lui-même les lignes et ne touche pas aux autres. Sinon, choisissez **configuration manuelle**.
5. Brevo affiche 3 types de lignes. **Copiez les valeurs exactes de votre compte** ; celles ci-dessous ne sont que des exemples :

| Ligne | Type | Nom (sous-domaine) | Valeur (exemple) |
|---|---|---|---|
| Code Brevo | TXT | *(vide, c'est-à-dire le domaine lui-même)* | `brevo-code:abc123…` |
| DKIM 1 | CNAME | `brevo1._domainkey` | `b1.champagnedelaube-fr.dkim.brevo.com.` |
| DKIM 2 | CNAME | `brevo2._domainkey` | `b2.champagnedelaube-fr.dkim.brevo.com.` |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

Selon les comptes, Brevo demande parfois une seule ligne DKIM de type TXT (nom `mail._domainkey`) au lieu des deux CNAME. Suivez ce que Brevo affiche.

## 3. Ajouter les lignes dans OVH

1. Connectez-vous à l'espace client OVHcloud.
2. Allez dans **Web Cloud**, puis **Noms de domaine**, puis `champagnedelaube.fr`, puis l'onglet **Zone DNS**.
3. **Avant tout**, cliquez sur **Exporter la zone DNS** (ou faites une capture d'écran) : c'est votre sauvegarde.
4. Pour chaque ligne du tableau Brevo, cliquez sur **Ajouter une entrée** :
   - **Code Brevo** : type TXT, sous-domaine laissé **vide**, valeur `brevo-code:…`. Ne remplacez pas les TXT existants : c'est une ligne de plus.
   - **DKIM** : type CNAME. Sous-domaine `brevo1._domainkey` (OVH complète avec `.champagnedelaube.fr`). Cible : la valeur Brevo. Si OVH refuse la cible, ajoutez un point final (`…dkim.brevo.com.`). Recommencez pour `brevo2._domainkey`.
   - **DMARC** : type TXT (ou le type « DMARC » proposé par OVH), sous-domaine `_dmarc`, valeur `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`.
5. Laissez le TTL par défaut et validez chaque entrée.

### Pourquoi c'est sans risque

- **DKIM** : les lignes `brevo1._domainkey` et `brevo2._domainkey` ne concernent que Brevo. Vos e-mails OVH ne les utilisent pas.
- **DMARC en `p=none`** : c'est le mode « observation ». Aucun e-mail n'est bloqué ni mis en spam à cause de DMARC ; vous recevez seulement des rapports (via Brevo). C'est indispensable aujourd'hui : Gmail et Yahoo exigent une ligne DMARC des expéditeurs d'envois en nombre.
- **Code Brevo** : une simple preuve de propriété, sans effet sur le reste.
- **MX, SPF et A ne bougent pas** : la réception des e-mails, l'envoi depuis OVH et l'ancien site restent identiques.

## 4. Points d'attention

a. **Ne passez pas tout de suite en `p=quarantine` ou `p=reject`.** Vos e-mails envoyés depuis OVH ne sont pas encore signés DKIM : avec une politique stricte, certains pourraient finir en spam. On durcira plus tard, après avoir activé DKIM sur votre messagerie OVH (option disponible dans la rubrique e-mails d'OVH) et lu quelques semaines de rapports.

b. **Une seule ligne DMARC.** S'il en existait déjà une (ce n'est pas le cas aujourd'hui), on modifierait celle-là au lieu d'en créer une deuxième.

c. **SPF : n'y touchez pas, sauf si Brevo l'exige.** Brevo n'a en principe pas besoin d'être ajouté au SPF. Si Brevo vous le demande quand même, **modifiez** la ligne existante au lieu d'en créer une seconde (deux SPF = erreur) :
   `v=spf1 include:mx.ovh.com include:spf.brevo.com ~all`

d. **Au lancement du nouveau site sur Netlify**, gardez les DNS chez OVH et ne changez que la ligne A du domaine et la ligne `www` (valeurs données par Netlify). Si un jour vous confiez les DNS à Netlify, il faudra y recopier **toutes** les lignes e-mail (MX, SPF, code Brevo, DKIM, DMARC) avant de basculer.

## 5. Vérifier

1. Revenez dans Brevo, onglet **Domaines**, et cliquez sur **Authentifier ce domaine**. La propagation peut prendre de quelques minutes à 48 heures.
2. Quand les 3 lignes sont au vert, créez (ou vérifiez) l'expéditeur `contact@champagnedelaube.fr` dans **Expéditeurs**.
3. Envoyez-vous un e-mail test depuis Brevo vers une adresse Gmail. Dans Gmail, ouvrez le message, menu **⋮**, **Afficher l'original** : vous devez lire `DKIM: PASS` et `DMARC: PASS`.
4. Envoyez-vous aussi un e-mail normal depuis votre messagerie OVH, et répondez-y : tout doit fonctionner comme avant.

En cas de doute, exportez la zone DNS et envoyez-la-moi : je vérifierai les lignes avant que vous les enregistriez.

Sources : [Brevo – Authentifier votre domaine](https://help.brevo.com/hc/en-us/articles/12163873383186) · [Brevo – Dépannage](https://help.brevo.com/hc/en-us/articles/16045394674066) · [Brevo – FAQ authentification](https://help.brevo.com/hc/en-us/articles/17286219877778)
