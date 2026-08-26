# Configuration GTM & GA4 — MoveAltys

Complément opérationnel de `movealtys-plan-taggage.md`, pour les trois propriétés du domaine :
`movealtys.com` (vitrine), `lp.movealtys.com` (landing, ce dépôt) et `app.movealtys.com` (produit).
Le code de la landing est en place et pousse
déjà les quatre événements dans le `dataLayer` ; ce document couvre ce qui se règle dans les interfaces
Google et ne peut pas vivre dans le dépôt.

**Ordre :** GA4 d'abord (§1), puis GTM (§2), puis les définitions et conversions (§3). Rien ne remonte
tant que §2 n'est pas publié.

---

## 0.1 Ce que contient déjà le conteneur `GTM-KDVSW56S`

Relevé sur l'export du 26 août 2026 (`workspace6`). Rien de tout cela n'était documenté ; c'est le point
de départ réel, pas une page blanche.

| Balise | Ce qu'elle fait |
|---|---|
| `00_GA4` | Balise Google, `G-CKKH5M76NL`, **routée en server-side vers `sst.movealtys.com`** |
| `00_Ads_settings` | Balise Google Ads `AW-18194899813` |
| `00_ADS_Linker` | Conversion Linker, cross-domain |
| `ADS_Essai_Gratuit` | Conversion Ads (`eECICILQi90cEOXGgORD`) |
| `Microsoft Clarity` | Session replay, projet `y7dr77i6pg` |

Trois conséquences pour ce plan :

**Il y a du server-side tagging.** `sst.movealtys.com` est un quatrième hôte, mais ce n'est pas un hôte de
pages : **ne pas l'ajouter** à « Configurer vos domaines ». Le plan fonctionne à l'identique — les
événements partent du navigateur vers le conteneur serveur, qui les relaie à GA4.

**Les déclencheurs existants sont des clics sur URL** (`Click URL contient app.movealtys.com/register`).
Ils continueront de fonctionner sur la landing — la décoration des liens ajoute des paramètres de requête
sans toucher au chemin. Mais ils **ne captent pas la soumission du formulaire hero**, qui est un `submit`
et non un clic : c'est un trou de mesure sur le signal le plus qualifié du site. D'où le déclencheur
`CE - Lead (formulaire hero)` ajouté à la conversion Ads.

**Aucune balise n'a de vérification de consentement** (`consentStatus: NOT_SET`). Sur la landing ce n'est
pas bloquant — le conteneur n'y est injecté qu'après acceptation. Sur la vitrine et l'app, en revanche,
ces balises se déclenchent sans condition. Voir l'encadré du §2.

---

## 0. Ce que le dépôt fournit déjà

| Élément | Où |
|---|---|
| Consent Mode v2, defaults `denied` | `src/components/analytics/Gtm.astro` |
| Injection du conteneur GTM après acceptation | idem, fonction `mvLoadGtm` |
| Bandeau de consentement bilingue | `src/components/analytics/ConsentBanner.astro` |
| Cookie de choix `mv_consent` sur `.movealtys.com` | `src/scripts/consent.ts` |
| Attribution `mv_attr` + `lp_id`, propagation vers l'app | `src/scripts/attribution.ts` |
| Les 4 événements + écouteur délégué | `src/scripts/analytics.ts` |
| Contexte de page sur `<body>` | `src/layouts/BaseLayout.astro` |

**Conteneur :** `GTM-KDVSW56S`, en dur dans `src/lib/tracking.ts`. La mesure est active sur les builds
de production et désactivée pendant `astro dev` ; `PUBLIC_GTM_ID` sert d'override dans les deux sens.
Voir `.env.example`.

> **Mode retenu : consent mode « basic ».** Le conteneur GTM n'est injecté qu'après acceptation, donc un
> refus produit **zéro requête** vers Google, et non des pings sans cookie. C'est le choix le plus
> défendable côté CNIL. Contrepartie : pas de modélisation des conversions pour le trafic refusant.
> Pour passer en mode « advanced » plus tard, il suffit d'appeler `mvLoadGtm()` au chargement plutôt
> qu'à l'acceptation — les `consent default` sont déjà en place, aucun autre changement de code.

---

## 1. GA4

### 1.1 Property et flux
1. Créer la propriété GA4 (ou réutiliser celle de l'app si elle existe — **une seule pour les deux**).
2. Flux de données web sur `https://movealtys.com`. Noter le **Measurement ID** (`G-XXXXXXXXXX`).
3. Laisser la mesure améliorée activée, **sauf** « Clics sortants » qui deviendra redondant une fois
   l'app déclarée comme domaine interne.

### 1.2 Configurer vos domaines — le point critique
```
Admin → Flux de données → [le flux web]
      → Balise Google → Configurer les paramètres de balise
      → Configurer vos domaines
```

Ajouter **les trois**, en correspondance « Contient » :

```
movealtys.com
lp.movealtys.com
app.movealtys.com
```

**Pas `sst.movealtys.com`** : c'est le conteneur serveur, pas un hôte de pages. L'y ajouter n'a aucun
effet utile et brouille la lecture pour la personne qui reprendra la configuration.

Dans le même panneau, **Répertorier les renvois indésirables** → ajouter `movealtys.com` en « Contient ».
Les trois hôtes partagent le cookie, donc la session ne devrait pas se couper de toute façon ; cette liste
est la ceinture qui rattrape les cas où le cookie manque — navigation privée, ITP, tout premier passage.

Sans ça, chaque passage d'une propriété à l'autre casse la session et réattribue la conversion à
`movealtys.com / referral`. C'est l'erreur la plus fréquente et la plus coûteuse du dispositif, et avec
trois hôtes elle se produit deux fois plutôt qu'une sur un parcours vitrine → landing → inscription.

> ⚠️ Si l'option est réglée sur « Contient », `movealtys.com` couvre déjà les deux sous-domaines. Le
> réglage par défaut est « Contient » ; vérifiez-le plutôt que de le supposer, une correspondance
> « Est exactement égal à » sur le seul apex laisserait passer les deux sous-domaines.

**Distinguer les trois dans les rapports** ne demande aucun paramètre supplémentaire : GA4 expose la
dimension *Nom d'hôte* nativement. Inutile d'inventer un paramètre `site`.

### 1.3 Rédaction des données — obligatoire avant de tagger l'app
Admin → Flux de données → Balisage → **Rédaction des données** :
- cocher **Adresse e-mail**
- ajouter `email` à la liste des paramètres de requête à supprimer

Rappel du pourquoi : le formulaire hero envoie `?email=…` vers `/register`. Sans cette purge, GA4
collecte des adresses e-mail dans `page_location` — manquement RGPD et motif de suspension du compte.

### 1.4 Conservation
Admin → Conservation des données → **14 mois** (maximum de l'offre gratuite ; le plafond CNIL est de
25 mois, GA4 ne les propose pas).

---

## 2. GTM — conteneur `GTM-KDVSW56S`

> ### ⚠️ Le conteneur est partagé par les trois propriétés
>
> Deux points à vérifier **avant** de publier une nouvelle version du conteneur.
>
> **1. Les balises existantes vont maintenant se déclencher sur la landing aussi.** Passer en revue
> leurs déclencheurs : tout ce qui est en « All Pages » couvrira les trois hôtes dès que la landing
> chargera le conteneur. Ce qui doit rester propre à la vitrine ou à l'app a besoin d'une condition sur
> `{{Page Hostname}}` — c'est aussi le moyen le plus simple de segmenter les balises par propriété.
>
> **2. Le gating de consentement ne protège que la landing.** Ici le conteneur n'est injecté qu'après
> acceptation. Sur la vitrine et sur l'app, c'est leur code à elles qui décide quand GTM se charge : si
> elles le chargent sans condition, le refus exprimé sur la landing n'y sera pas respecté, alors même
> que le cookie `mv_consent` y est parfaitement lisible. Deux façons de fermer la brèche — porter le même
> mécanisme dans les deux autres propriétés (lire `mv_consent`, n'injecter qu'ensuite), ou, au minimum,
> activer les vérifications de consentement supplémentaires sur toutes les balises (§2.3c), qui elles
> s'appliquent partout.
>
> **Corollaire à ne pas manquer :** si la vitrine porte déjà son propre bandeau avec un autre nom de
> cookie, le visiteur en verra deux sur un parcours vitrine → landing. Un seul mécanisme pour les trois
> propriétés, ou trois bandeaux qui se contredisent.

### 2.1 Variables de couche de données
Créer une variable **Variable de couche de données** (version 2) par paramètre, nommée
`DLV - <nom>`, avec le nom de la variable identique au paramètre :

```
cta_location      cta_destination   cta_label      plan
contact_location  contact_method    lead_type      lp_id
page_type         segment           page_lang      consent_state
```

### 2.2 Déclencheurs
Deux, tous deux de type **Événement personnalisé**, avec ☑ *Utiliser la correspondance d'expression
régulière*. Deux plutôt qu'un seul gros : chaque équipe fait évoluer le sien sans toucher à celui de
l'autre, et une erreur de regex ne coupe pas la mesure des deux côtés à la fois.

**`CE - Landing events`**
```
^(cta_signup_click|generate_lead|cta_login_click|contact_request)$
```

**`CE - App events`**
```
^(sign_up_start|sign_up_submit|sign_up_error|sign_up|login|email_verified|onboarding_step|onboarding_complete|route_builder_step|first_route_created|view_pricing|begin_checkout|purchase|invite_sent|invite_accepted)$
```

Ajouter un événement au plan, c'est donc une seule chose à faire : l'ajouter à la regex du déclencheur
concerné. Rien d'autre ne bouge — ni la balise, ni les variables.

### 2.3 Balises

**a. Balise Google (configuration GA4)**
- ID de balise : le Measurement ID
- Déclencheur : *Initialisation - Toutes les pages*
- Paramètres de configuration : `page_lang` = `{{DLV - page_lang}}`, `page_type` = `{{DLV - page_type}}`,
  `segment` = `{{DLV - segment}}` — ainsi le contexte est présent dès le `page_view`.

**b. Événement GA4 — une seule balise pour les quatre événements**
- Nom de l'événement : `{{Event}}` (variable intégrée : reprend le nom poussé dans le `dataLayer`)
- Paramètres d'événement : les dix-huit variables du §2.1, chacune sous son propre nom
- Déclencheurs : `CE - Landing events` **et** `CE - App events`

GTM omet automatiquement les paramètres dont la variable est vide, donc `contact_location` ne part que
sur `contact_request` et `plan` que depuis les cartes tarifs. **Une seule balise suffit pour les dix-neuf
événements des trois propriétés** ; en ajouter une par événement ne changerait rien à la donnée et
multiplierait la maintenance par douze.

**c. Paramètres de consentement des deux balises**
Onglet *Consentement* → « Vérifications de consentement supplémentaires » → exiger
`analytics_storage`. Le conteneur ne se charge déjà qu'après acceptation ; c'est une ceinture en plus
des bretelles, utile le jour où quelqu'un passera en mode advanced.

### 2.4 Recette avant publication
Mode **Aperçu** GTM, sur `/fr/` puis `/en/` :

- refuser le bandeau → onglet Réseau : aucune requête vers `googletagmanager.com` ni `google-analytics.com` ;
- accepter → le conteneur se charge, `consent_update` apparaît, l'événement `gtm.js` suit ;
- cliquer chaque CTA et vérifier `cta_location` / `cta_destination` / `plan` dans DebugView ;
- soumettre le formulaire hero → `cta_signup_click` **puis** `generate_lead`, et la navigation part bien ;
- header mobile : un clic = un seul événement (les CTA sont dupliqués dans le DOM).

---

## 3. Définitions personnalisées et conversions

### 3.1 Dimensions personnalisées
Admin → **Définitions personnalisées** → Créer, portée **Événement**, une par paramètre :

| Nom à afficher | Paramètre |
|---|---|
| CTA location | `cta_location` |
| CTA destination | `cta_destination` |
| CTA label | `cta_label` |
| Plan | `plan` |
| Contact location | `contact_location` |
| Contact method | `contact_method` |
| Lead type | `lead_type` |
| Page type | `page_type` |
| Segment | `segment` |
| Page language | `page_lang` |
| Landing ID | `lp_id` |
| Error type | `error_type` *(côté app)* |
| Step name | `step_name` *(côté app)* |
| Has email prefill | `has_email_prefill` *(côté app)* |

**Sans cette déclaration, les paramètres sont collectés mais invisibles dans les rapports, et
l'historique antérieur ne se rattrape pas.** C'est l'oubli classique : à faire le jour de la mise en
production, pas trois semaines plus tard.

### 3.2 Événements clés (conversions)

**Un événement clé se marque avec l'étoile**, sur Admin → Événements → onglet *Événements récents*, à
gauche du nom. L'étoile n'apparaît que sur un événement **déjà reçu au moins une fois** : il n'existe pas
de moyen de déclarer une conversion à l'avance. Il faut donc faire partir l'événement d'abord.

> ⚠️ **Ne pas utiliser « Créer un événement »**, le bouton bleu de ce même écran. Il fabrique un événement
> *dérivé* d'un autre : l'événement source continue de partir et le dérivé s'y ajoute, donc le même geste
> utilisateur est compté deux fois. Il existe pour les sites dont on ne peut pas modifier le taggage. Ici
> on le peut — les douze événements du plan partent du code avec leurs paramètres. Aucun ne doit être
> recréé dans GA4.
>
> Même logique côté GTM : **une seule balise de configuration GA4** par Measurement ID. Une seconde
> doublerait les `page_view`. Le conteneur en a déjà une, `00_GA4` — on la complète, on ne la duplique pas.

Les dimensions du §3.1, elles, **ne dépendent pas des événements** : le champ « Paramètre d'événement »
est libre, on y saisit `lp_id` ou `error_type` avant leur première occurrence. Et il le faut, puisqu'une
dimension déclarée après coup ne récupère pas l'historique.

Les quatre à étoiler, dès qu'ils apparaissent :

| Événement | Origine | Ce qu'il mesure |
|---|---|---|
| `generate_lead` | landing | intention forte, email saisi |
| `contact_request` | landing | intention de contact — voir la réserve sur les `mailto:` |
| `sign_up` | app | compte créé |
| `first_route_created` | app | activation réelle |

La liste *Événements récents* peut mettre jusqu'à 24 h à se peupler. **DebugView**, lui, est instantané :
c'est là qu'on valide le taggage, pas ici.

### 3.3 Google Ads
Une fois `generate_lead` et `sign_up` remontés : Admin → Association de produits → Google Ads, puis
importer les deux comme actions de conversion. Ne pas importer `cta_signup_click` — c'est un clic, pas
une conversion, et l'optimisation des enchères se mettrait à chasser du volume creux.

---

## 4. Valeurs de référence

Les valeurs effectivement émises par le code, pour recouper avec ce qui arrive dans DebugView.

| Paramètre | Valeurs |
|---|---|
| `page_type` | `home` · `segment` · `legal` · `404` |
| `segment` | `home` · `independants` · `tpe` · `livraison-locale` · `flotte-interne` · `none` |
| `page_lang` | `fr` · `en` |
| `cta_location` | `header` · `header_mobile` · `hero_form` · `pricing_card` · `pricing_enterprise` · `final_cta` · `footer` · `segment_hero` · `segment_pricing` · `segment_final_cta` |
| `cta_destination` | `register` · `login` · `mailto` |
| `plan` | `independant` · `pro` · `entreprise` |
| `contact_method` | `mailto` |
| `lead_type` | `email_prefill` |
| `consent_state` | `granted` · `denied` |

`segment` vaut `none` sur les pages légales et la 404 : ces pages n'appartiennent à aucune audience, et
les compter comme `home` fausserait la lecture par segment.
