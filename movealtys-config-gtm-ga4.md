# Configuration GTM & GA4 — MoveAltys

Complément opérationnel de `movealtys-plan-taggage.md`, pour les trois propriétés du domaine :
`movealtys.com` (vitrine), `lp.movealtys.com` (landing, ce dépôt) et `app.movealtys.com` (produit).
Le code de la landing est en place et pousse
déjà les quatre événements dans le `dataLayer` ; ce document couvre ce qui se règle dans les interfaces
Google et ne peut pas vivre dans le dépôt.

**Ordre :** GA4 d'abord (§1), puis GTM (§2), puis les définitions et conversions (§3). Rien ne remonte
tant que §2 n'est pas publié.

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
Admin → Flux de données → *le flux web* → Balisage → **Configurer vos domaines**.
Ajouter **les trois**, en correspondance exacte :

```
movealtys.com
lp.movealtys.com
app.movealtys.com
```

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

### 2.2 Déclencheur
Un seul, type **Événement personnalisé** :

- Nom : `CE - Landing events`
- Nom de l'événement : `^(cta_signup_click|generate_lead|cta_login_click|contact_request)$`
- ☑ Utiliser la correspondance d'expression régulière

### 2.3 Balises

**a. Balise Google (configuration GA4)**
- ID de balise : le Measurement ID
- Déclencheur : *Initialisation - Toutes les pages*
- Paramètres de configuration : `page_lang` = `{{DLV - page_lang}}`, `page_type` = `{{DLV - page_type}}`,
  `segment` = `{{DLV - segment}}` — ainsi le contexte est présent dès le `page_view`.

**b. Événement GA4 — une seule balise pour les quatre événements**
- Nom de l'événement : `{{Event}}` (variable intégrée : reprend le nom poussé dans le `dataLayer`)
- Paramètres d'événement : les douze variables du §2.1, chacune sous son propre nom
- Déclencheur : `CE - Landing events`

GTM omet automatiquement les paramètres dont la variable est vide, donc `contact_location` ne part que
sur `contact_request` et `plan` que depuis les cartes tarifs. Une balise suffit ; en ajouter une par
événement ne changerait rien à la donnée et multiplierait la maintenance.

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

**Sans cette déclaration, les paramètres sont collectés mais invisibles dans les rapports, et
l'historique antérieur ne se rattrape pas.** C'est l'oubli classique : à faire le jour de la mise en
production, pas trois semaines plus tard.

### 3.2 Événements clés (conversions)
Admin → Événements → marquer comme événement clé :

| Événement | Origine | Ce qu'il mesure |
|---|---|---|
| `generate_lead` | landing | intention forte, email saisi |
| `contact_request` | landing | intention de contact — voir la réserve sur les `mailto:` |
| `sign_up` | app | compte créé |
| `first_route_created` | app | activation réelle |

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
