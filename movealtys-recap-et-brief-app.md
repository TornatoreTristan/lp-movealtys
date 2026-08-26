# MoveAltys — état de la mesure et brief pour l'app

**26 août 2026.** Deux parties. La première fait le point sur la landing et la mesure ; la seconde est un
brief autonome, à transmettre tel quel au développeur d'`app.movealtys.com` — il n'a pas besoin de lire
la première pour faire son travail.

Documents de référence : `movealtys-plan-taggage.md` (le plan complet) et
`movealtys-config-gtm-ga4.md` (la configuration des consoles Google).

---
---

# Partie 1 — Où on en est

## 1.1 La landing

Site Astro statique, bilingue français/anglais, servi depuis **`lp.movealtys.com`**.

| | |
|---|---|
| Pages | accueil, 4 pages segment (indépendants, TPE, livraison locale, flotte interne), 4 pages légales, 404 |
| Rôle | recevoir le trafic payant et campagne, et l'envoyer vers `app.movealtys.com/register` |
| Indexation | **désactivée** — la landing ne doit pas concurrencer `movealtys.com` sur les mêmes requêtes |
| Dépôt | `github.com/TornatoreTristan/lp-movealtys` (public) |

Le `noindex` est piloté par `src/lib/seo.ts`. Le crawl reste **autorisé** : bloquer les robots les
empêcherait de lire la directive, ce qui est la façon classique de rester indexé pour toujours.

## 1.2 Les trois propriétés

| Hôte | Rôle | Mesure |
|---|---|---|
| `movealtys.com` | site vitrine | conteneur GTM déjà en place, sans consentement |
| `lp.movealtys.com` | landing — ce dépôt | **implémentée**, avec consentement |
| `app.movealtys.com` | produit | **à faire** — c'est l'objet de la partie 2 |
| `sst.movealtys.com` | conteneur serveur GTM | pas un hôte de pages, à ne pas déclarer dans GA4 |

Les trois premières partagent le domaine racine `movealtys.com`. Le cookie `_ga` s'y pose donc une seule
fois et se lit des trois côtés : `client_id`, session, consentement et identifiant d'attribution circulent
nativement. C'est ce qui rend le funnel landing → inscription mesurable sans linker cross-domain.

## 1.3 Ce qui est en place sur la landing

Quatre événements, poussés dans le `dataLayer` par un écouteur délégué qui lit l'attribut `data-track` sur
l'élément cliqué — pas des sélecteurs CSS, que Tailwind casserait au premier refactor.

| Événement | Déclencheur | Conversion |
|---|---|---|
| `cta_signup_click` | les 10 boutons « Essai gratuit » | non |
| `generate_lead` | soumission du formulaire hero, avec e-mail | **oui** |
| `cta_login_click` | les 3 liens « Connexion » | non |
| `contact_request` | les 4 CTA `mailto:` | **oui** |

Chacun porte le contexte de page (`page_type`, `segment`, `page_lang`) et, pour les CTA,
`cta_location` / `cta_destination` / `cta_label` / `plan`.

**Consentement en mode « basic »** : le conteneur GTM n'est injecté qu'après acceptation du bandeau. Un
refus ne produit donc aucune requête vers Google — pas même un ping sans cookie.

**Attribution** : à la première visite consentie, la landing génère un `lp_id` et mémorise la source
(UTM, `gclid`, referrer) dans un cookie de portée `.movealtys.com`, puis décore tous les liens sortants
vers les autres propriétés du domaine. C'est le fil qui permettra de dire *combien de clics « Essai
gratuit » deviennent des comptes créés, et par quel canal*.

## 1.4 Ce qui reste à faire

| # | Quoi | Qui | Bloquant pour |
|---|---|---|---|
| 1 | Déployer la landing sur `lp.movealtys.com` | Tristan | tout le reste |
| 2 | Importer `GTM-KDVSW56S_workspace6.json` et **publier** le conteneur | Tristan | toute remontée |
| 3 | GA4 → déclarer les 3 domaines + les renvois indésirables | Tristan | l'attribution |
| 4 | GA4 → créer les 13 dimensions personnalisées | Tristan | la lisibilité des rapports |
| 5 | Faire partir les événements, vérifier dans DebugView | Tristan | l'étape 6 |
| 6 | Étoiler `generate_lead` et `contact_request` comme événements clés | Tristan | Google Ads |
| 7 | **Implémenter la mesure côté app** | dev app | la moitié du funnel |
| 8 | Porter le consentement sur la vitrine et sur l'app | dev app | la conformité |
| 9 | Remplacer les `mailto:` par une page `/contact/` | décision produit | mesurer vraiment les demandes |
| 10 | Measurement Protocol côté serveur | phase 2 | la fiabilité des chiffres |

Les points 4 et 6 ne se rattrapent pas rétroactivement : une dimension déclarée en octobre ne fera pas
apparaître les données de septembre.

Le point 9 mérite d'être tranché : les quatre CTA de contact sont des `mailto:`. On mesure l'ouverture du
client mail, pas l'envoi du message. Tant que c'est le cas, `contact_request` est une **intention**, pas
une demande — et ne doit pas être importé comme conversion dans Google Ads.

---
---

# Partie 2 — Brief pour le développeur d'app.movealtys.com

> Ce brief est autonome. Tout ce qu'il faut savoir est ici.

## 2.1 Le contexte en trois lignes

La landing `lp.movealtys.com` envoie des visiteurs sur `app.movealtys.com/register`. On sait aujourd'hui
combien de personnes cliquent ; on ne sait pas combien vont au bout de l'inscription, ni d'où elles
venaient. Votre travail : fermer ce trou.

Trois choses à implémenter, dans cet ordre : **récupérer l'identifiant d'attribution**, **respecter le
consentement**, **pousser huit événements**. Aucune configuration GTM ou GA4 de votre côté — tout est déjà
prêt et vous attend.

## 2.2 Ce que la landing vous transmet

`app.movealtys.com` est un sous-domaine de `movealtys.com`, donc les cookies posés par la landing vous
sont **directement lisibles**, côté client comme côté serveur.

### Cookie `mv_attr` — l'attribution

Portée `.movealtys.com`, durée 13 mois. Contenu : du JSON, **encodé avec `encodeURIComponent`**.

```json
{
  "lp_id": "3f2b8c14-9a7e-4d51-b0c8-6e2a91d47f3b",
  "first_seen": "2026-08-26T14:32:07.412Z",
  "landing_page": "/fr/tpe/",
  "referrer": "https://www.google.com/",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "tpe-cout-revient",
  "gclid": "Cj0KCQ..."
}
```

Seuls `lp_id`, `first_seen`, `landing_page` et `referrer` sont garantis. Les clés de campagne
(`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`,
`msclkid`) n'apparaissent que si le visiteur est arrivé avec.

```js
const raw = document.cookie.match(/(?:^|;\s*)mv_attr=([^;]*)/)
const attribution = raw ? JSON.parse(decodeURIComponent(raw[1])) : null
```

### Query params — le filet de sécurité

Les liens de la landing vers l'app portent aussi `lp_id` et les paramètres de campagne en query string.
Utilisez-les quand le cookie est absent : navigation privée, cookie bloqué, ITP.

```
https://app.movealtys.com/register?email=…&lp_id=3f2b8c14-…&utm_source=google&utm_medium=cpc
```

**Ordre de lecture recommandé :** query param d'abord (il reflète la visite en cours), cookie ensuite.

### Cookie `mv_consent` — la réponse au bandeau

Valeur `granted` ou `denied`, portée `.movealtys.com`, durée 6 mois. Absent = le visiteur n'a pas encore
répondu.

## 2.3 Ce qu'il faut implémenter

### A. Persister `lp_id` sur l'utilisateur — le plus important

À la création du compte, écrivez `lp_id` **et la source d'acquisition** en base, sur l'enregistrement
utilisateur. C'est ce qui permet, indépendamment de GA4 et sans dépendre d'aucun outil tiers, de produire
la seule métrique qui compte : *nombre de clics « Essai gratuit » → nombre de comptes créés, par canal.*

Champs suggérés : `lp_id`, `acquisition_source`, `acquisition_medium`, `acquisition_campaign`,
`acquisition_gclid`, `landing_first_seen`.

Si `lp_id` est absent, stockez `null` — n'inventez pas de valeur de remplacement, ce serait du bruit
indistinguable d'une vraie attribution.

### B. Respecter le consentement

La landing n'injecte GTM qu'après acceptation. **Faites la même chose**, sinon un visiteur qui refuse sur
la landing sera mesuré chez vous — alors même que son refus est lisible dans `mv_consent`.

```js
const consent = document.cookie.match(/(?:^|;\s*)mv_consent=([^;]*)/)?.[1]

// Consent Mode v2, AVANT toute balise
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied',
  ad_personalization: 'denied', analytics_storage: 'denied',
  functionality_storage: 'granted', security_storage: 'granted',
  wait_for_update: 500,
})

if (decodeURIComponent(consent ?? '') === 'granted') {
  gtag('consent', 'update', {
    ad_storage: 'granted', ad_user_data: 'granted',
    ad_personalization: 'granted', analytics_storage: 'granted',
  })
  loadGtm() // conteneur GTM-KDVSW56S
}
```

Si l'utilisateur arrive sans cookie `mv_consent` — accès direct à l'app, sans passer par la landing — il
vous faut votre propre bandeau, qui écrit **le même cookie, sur le même domaine, avec les mêmes valeurs**.
Sinon le visiteur répondra deux fois.

L'implémentation de référence est lisible dans `src/scripts/consent.ts` et
`src/components/analytics/Gtm.astro` du dépôt de la landing.

### C. Purger l'e-mail de l'URL — bloquant, conformité

Le formulaire de la landing envoie l'e-mail en query string : `…/register?email=jean@exemple.fr`. Si vous
laissez ce paramètre dans l'URL, GA4 collecte une **adresse e-mail dans `page_location`**. C'est une
donnée personnelle transmise à Google sans base légale, et une violation des conditions d'utilisation de
GA4 — motif de suspension du compte.

À faire **avant** la première balise :

```js
const url = new URL(window.location.href)
if (url.searchParams.has('email')) {
  prefillEmailField(url.searchParams.get('email'))
  url.searchParams.delete('email')
  window.history.replaceState({}, '', url)
}
```

Et jamais d'e-mail, de nom ou de numéro de téléphone dans un paramètre d'événement.

### D. Pousser les huit événements

Un seul `dataLayer.push` par événement. Les valeurs vides ou inconnues : **omettez la clé**, ne poussez
pas de chaîne vide.

```js
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  event: 'sign_up',
  method: 'email',
  plan: 'pro',
  lp_id: '3f2b8c14-9a7e-4d51-b0c8-6e2a91d47f3b',
})
```

| Événement | Quand le pousser | Paramètres |
|---|---|---|
| `sign_up_start` | affichage de `/register` | `lp_id`, `plan`, `has_email_prefill` (booléen) |
| `sign_up_submit` | soumission du formulaire, avant l'appel serveur | `lp_id`, `plan` |
| `sign_up_error` | échec de validation ou erreur serveur | `error_type` |
| `sign_up` | **compte effectivement créé** | `method`, `plan`, `lp_id` |
| `email_verified` | e-mail confirmé, si double opt-in | `lp_id` |
| `onboarding_complete` | fin du parcours d'onboarding | `lp_id`, `steps_completed` |
| `first_route_created` | **première tournée calculée** | `lp_id` |
| `login` | connexion réussie | `method` |

**Valeurs attendues :**

| Paramètre | Valeurs |
|---|---|
| `plan` | `independant` · `pro` · `entreprise` |
| `method` | `email` · `google` · `microsoft` — le moyen d'authentification |
| `error_type` | `email_taken` · `weak_password` · `invalid_email` · `server` |
| `has_email_prefill` | `true` · `false` |
| `lp_id` | l'UUID lu au §2.2, ou clé omise s'il est absent |

**Les deux à ne pas négliger.** `sign_up_error` est ce qui rend le funnel exploitable : sans lui, un
décrochage entre `sign_up_submit` et `sign_up` est un trou noir — on voit que les gens abandonnent, jamais
pourquoi. `first_route_created` mesure l'activation réelle : un compte créé qui ne calcule jamais de
tournée n'est pas un client.

## 2.4 Ce qui est déjà prêt — vous n'y touchez pas

Le conteneur **`GTM-KDVSW56S`** contient déjà :

- un déclencheur `CE - App events` dont l'expression régulière couvre vos huit noms d'événements ;
- une balise `01_GA4_Events_Plan_Taggage` qui les relaie vers GA4 avec tous leurs paramètres ;
- les variables de couche de données correspondantes.

Vous poussez dans le `dataLayer`, le reste part tout seul. **Aucune balise à créer.**

## 2.5 Ce qu'il ne faut pas faire

**N'ajoutez pas de seconde balise de configuration GA4.** Le conteneur en a une, `00_GA4`. Une deuxième
sur le même Measurement ID doublerait tous les `page_view`.

**Ne créez pas d'événement dans l'interface GA4** (bouton « Créer un événement »). Il fabrique un
événement dérivé qui s'ajoute à l'original : le même geste utilisateur compté deux fois. Vos événements
partent du code, c'est la bonne façon.

**Ne renommez pas les événements.** Les noms ci-dessus sont ceux que le déclencheur attend ; un
`signup_completed` à la place de `sign_up` ne remontera nulle part, silencieusement.

**N'envoyez pas de donnée personnelle** en paramètre : ni e-mail, ni nom, ni téléphone, ni identifiant
client interne exploitable seul.

## 2.6 Recette

Avec le mode Aperçu GTM actif sur `app.movealtys.com` :

- [ ] Arrivée depuis la landing : `lp_id` lisible, en cookie **et** en query param.
- [ ] Arrivée en navigation privée : `lp_id` toujours lisible, via le query param.
- [ ] Le paramètre `email` a disparu de l'URL avant la première balise ; `page_location` n'en contient pas.
- [ ] Refus du consentement : onglet Réseau, **zéro** requête vers `googletagmanager.com` et `google-analytics.com`.
- [ ] Consentement donné sur la landing, puis navigation vers l'app : **aucun second bandeau**.
- [ ] Parcours d'inscription complet : `sign_up_start` → `sign_up_submit` → `sign_up` dans DebugView, chacun avec son `lp_id`.
- [ ] Inscription avec un e-mail déjà pris : `sign_up_error` avec `error_type: 'email_taken'`.
- [ ] Session GA4 **continue** entre la landing et l'app : même `session_id`, source d'origine conservée, aucun `movealtys.com / referral`.
- [ ] En base : le compte créé porte bien son `lp_id` et sa source d'acquisition.

Le dernier point est le plus important. Les huit autres se rattrapent ; une inscription enregistrée sans
attribution est définitivement perdue.
