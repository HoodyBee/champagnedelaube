# E-mail de bienvenue de la newsletter (Brevo)

Envoyé automatiquement à chaque nouvel inscrit, **après** sa double confirmation.

**Mise en place dans Brevo** :
1. Menu **Automations**, puis **Créer une automation** et le modèle **Message de bienvenue**.
2. Déclencheur : « Contact ajouté à une liste ». Choisissez la liste des actualités (newsletter).
3. Collez le texte ci-dessous dans un e-mail simple aux couleurs du site : fond blanc, titres anthracite (`#1E1E20`), liens et boutons bronze (`#8A6420`), filet doré (`#BF9140`).

**Liens** :
- Tous les liens pointent vers le site. Brevo ajoute tout seul le lien de désinscription : gardez la balise `{{ unsubscribe }}` (ou le bloc « Désinscription » du modèle).
- Le lien « Qui suis-je ? » ne fonctionne qu'une fois la page publiée dans le Studio : activez l'automation après l'avoir publiée, ou retirez ce lien en attendant.

---

**Expéditeur** : Julien · Champagne de l'Aube `<contact@champagnedelaube.fr>`

**Objet** :
```
Bienvenue chez Champagne de l'Aube 🥂
```

**Pré-en-tête** (le petit texte affiché après l'objet) :
```
Terroirs, dégustations, histoires de vignerons : voici ce qui vous attend.
```

---

**Texte de l'e-mail** :

> **Bonjour {{ contact.FIRSTNAME | default : "" }},**
>
> Merci de nous avoir rejoints ! Vous faites désormais partie de la petite communauté de Champagne de l'Aube.
>
> Je m'appelle Julien, je vis à Troyes, et je passe mon temps à faire découvrir les champagnes de vignerons indépendants de l'Aube : leurs terroirs, leurs villages, leurs cuvées de caractère.
>
> **Ce que vous recevrez**
> De temps en temps, pas plus : nos prochaines dégustations, les nouveautés de notre sélection, les meilleurs articles du Mag et les rendez-vous à ne pas manquer dans l'Aube.
>
> **Pour commencer, trois idées :**
>
> 🥂 **Organiser une dégustation privée**, chez vous ou à Troyes, entre amis ou en famille
> [Découvrir nos dégustations] → https://champagnedelaube.fr/tasting-troyes/
>
> 📖 **Lire Le Mag du Champagne** : cépages, accords mets et champagne, histoires de vignerons
> [Lire Le Mag] → https://champagnedelaube.fr/le-mag/
>
> 👋 **Faire connaissance** : mon parcours, et pourquoi l'Aube me tient tant à cœur
> [Qui suis-je ?] → https://champagnedelaube.fr/qui-suis-je/
>
> Une question, une envie, un projet ? Répondez simplement à cet e-mail : il arrive directement chez moi.
>
> À très bientôt,
> **Julien**
> Champagne de l'Aube · Troyes
> https://champagnedelaube.fr · Instagram : @champagnedelaube
>
> ---
> *L'abus d'alcool est dangereux pour la santé. À consommer avec modération.*
>
> Vous recevez cet e-mail car vous vous êtes inscrit aux actualités de Champagne de l'Aube sur champagnedelaube.fr. Vous pouvez vous désinscrire à tout moment : [Se désinscrire] ({{ unsubscribe }}).
> Champagne de l'Aube · [ADRESSE POSTALE À COMPLÉTER PAR JULIEN, obligatoire dans les e-mails commerciaux]

---

**Version anglaise** (pour les inscrits depuis la version anglaise du site) : sur demande, je l'écrirai dans le même esprit. Brevo permet de l'envoyer selon l'attribut `LANGUE` du contact (`EN`).
