# Plan de taggage — MoveAltys

**Stack retenue :** GTM (conteneur web) → GA4, avec Consent Mode v2 et bandeau de consentement.
**Périmètre :** `movealtys.com` (vitrine) + `lp.movealtys.com` (landing, ce dépôt) + `app.movealtys.com` (produit).
**Date :** 2026-08-26 · **Statut :** étapes 1 et 2 implémentées dans le dépôt ; étape 3 à faire dans
les consoles Google (`movealtys-config-gtm-ga4.md`).

---

## 0. Le point qui change tout

Trois propriétés, un seul domaine racine :

| Hôte | Rôle |
|---|---|
| `movealtys.com` | site vitrine |
| `lp.movealtys.com` | landing page — **ce dépôt** |
| `app.movealtys.com` | produit |

Ce n'est donc pas du cross-domain au sens strict : le cookie `_ga` posé par GA4 en
`cookie_domain: 'auto'` se pose sur `.movealtys.com` et est lisible des trois côtés. Le `client_id`, la
session, le choix de consentement et l'identifiant d'attribution circulent **nativement**, sans linker
`_gl`.

Il reste deux choses à faire, sinon la mesure est fausse :

1. Déclarer **les trois hôtes** dans **Admin → Flux de données → Balisage → Configurer vos domaines**.
   Sans ça, chaque passage d'une propriété à l'autre génère un *self-referral* qui coupe la session et
   réattribue la conversion à « movealtys.com / referral » au lieu de la source réelle (Google Ads, SEO,
   LinkedIn…). Avec trois hôtes le trou se creuse à chaque saut, pas seulement au dernier.
2. Propager les UTM / `gclid` dans les liens sortants. Aujourd'hui les liens sont en dur
   (`src/i18n/content.ts:4-7`) : **toute l'attribution acquisition est perdue au franchissement**.

---

## 1. Convention de nommage

- Événements et paramètres en `snake_case`, en anglais, ≤ 40 caractères.
- On réutilise les **événements recommandés GA4** quand ils existent (`generate_lead`, `sign_up`, `login`) :
  ils alimentent les rapports natifs et l'import de conversions dans Google Ads.
- Un événement = une **intention utilisateur**, pas un emplacement. L'emplacement est un paramètre.
  → un seul `cta_signup_click` pour les 10 boutons « Essai gratuit », différenciés par `cta_location`.
- Aucune donnée personnelle dans les paramètres (voir §7).

### Paramètres communs (envoyés sur tous les événements custom)

| Paramètre | Type | Valeurs | Source |
|---|---|---|---|
| `page_type` | string | `home` \| `segment` \| `legal` \| `404` | props de la page |
| `segment` | string | `home` \| `independants` \| `tpe` \| `livraison-locale` \| `flotte-interne` \| `none` | route |
| `page_lang` | string | `fr` \| `en` | `Astro.params.lang` |

> `language` est déjà collecté automatiquement par GA4 (langue du navigateur) — d'où `page_lang` pour la
> langue **du contenu**, qui n'est pas la même chose.

### Paramètres des CTA

| Paramètre | Valeurs |
|---|---|
| `cta_location` | `header`, `header_mobile`, `hero_form`, `pricing_card`, `pricing_enterprise`, `final_cta`, `footer`, `segment_hero`, `segment_pricing`, `segment_final_cta` |
| `cta_label` | libellé affiché (ex. `Essai gratuit`, `Free trial`) |
| `cta_destination` | `register`, `login`, `mailto`, `anchor` |
| `plan` | `independant`, `pro`, `entreprise` — uniquement depuis les cartes tarifs |

---

## 2. Événements essentiels — Landing page

### 2.1 `cta_signup_click` — clic « Essai gratuit »

Le volume haut du funnel. Se déclenche sur **tout** lien vers `app.movealtys.com/register`.

```js
{
  event: 'cta_signup_click',
  cta_location: 'header',
  cta_label: 'Essai gratuit',
  cta_destination: 'register',
  plan: undefined,          // renseigné seulement depuis Pricing
  page_type: 'home',
  segment: 'home',
  page_lang: 'fr'
}
```

**Points de déclenchement — 9 emplacements dans le code, 10 boutons rendus (la carte tarifs en produit 2) :**

| Emplacement | Fichier | `cta_location` |
|---|---|---|
| Header desktop | `src/components/Header.astro:54` | `header` |
| Header mobile | `src/components/Header.astro:89` | `header_mobile` |
| Formulaire hero (submit) | `src/components/sections/Hero.astro:56` | `hero_form` |
| Cartes tarifs (Indépendant, Pro) | `src/components/sections/Pricing.astro:84` | `pricing_card` + `plan` |
| CTA final | `src/components/sections/FinalCta.astro:33` | `final_cta` |
| Footer | `src/components/Footer.astro:80` | `footer` |
| Hero page segment | `src/components/SegmentLanding.astro:51` | `segment_hero` |
| Tarif page segment | `src/components/SegmentLanding.astro:199` | `segment_pricing` |
| CTA final page segment | `src/components/SegmentLanding.astro:258` | `segment_final_cta` |

### 2.2 `generate_lead` — soumission du formulaire hero **[conversion]**

Le formulaire hero (`Hero.astro:56`) est un `GET` vers `/register` avec l'email en query string : c'est le
signal d'intention le plus fort de la LP, il mérite son propre événement. Il se déclenche **en plus** de
`cta_signup_click` (`cta_location: 'hero_form'`).

```js
{
  event: 'generate_lead',
  lead_type: 'email_prefill',
  cta_location: 'hero_form',
  page_type, segment, page_lang
  // ⚠️ jamais l'email — voir §7
}
```

### 2.3 `cta_login_click` — clic « Connexion »

Distingue le trafic **client existant** du trafic prospect. Sans lui, une LP qui « convertit bien » peut
n'être qu'une porte d'entrée de vos utilisateurs actuels — et votre taux de conversion réel est faussé.

**Points de déclenchement (3) :** `Header.astro:49` (`header`), `Header.astro:87` (`header_mobile`),
`Footer.astro:79` (`footer`).

> Nom volontairement différent de l'événement GA4 `login` : ici c'est un **clic**, pas une connexion
> réussie. `login` sera réservé à l'app (§3).

### 2.4 `contact_request` — demande de contact **[conversion]**

```js
{
  event: 'contact_request',
  contact_method: 'mailto',
  contact_location: 'footer',   // footer | final_cta | pricing_enterprise | segment_final_cta
  plan: 'entreprise',           // si depuis la carte Entreprise
  page_type, segment, page_lang
}
```

**Points de déclenchement (4) :** `Footer.astro:33`, `FinalCta.astro:34`, `Pricing.astro:84` (carte
Entreprise), `SegmentLanding.astro:259`.

> ⚠️ **Limite structurelle.** Les 4 CTA contact sont des `mailto:`. On mesure l'**ouverture du client mail**,
> pas l'envoi. En pratique 40 à 70 % des clics `mailto:` ne débouchent sur aucun message (webmail non
> configuré, mobile, abandon), et sur desktop certains navigateurs ne déclenchent même pas l'événement.
> **Recommandation :** créer une page `/contact/` avec un vrai formulaire. C'est le seul moyen de mesurer
> des demandes de contact réelles, et ça débloque l'événement `form_submit` + la source du lead dans le CRM.
> Tant que c'est du `mailto:`, traiter `contact_request` comme une **intention**, pas une demande.

---

## 3. Événements essentiels — app.movealtys.com

> Établi sur le code réel de l'application (bundle de production, août 2026), pas sur des hypothèses.
> Le tableau exploitable est dans `movealtys-plan-taggage.csv`.

L'inscription ouvre un **essai gratuit de 14 jours**, sans choix d'offre. Le vrai bout de la chaîne n'est
donc pas l'inscription mais l'**abonnement payé**, dans le tunnel `/subscription/*`.

| Prio | Événement | Déclencheur | Paramètres | Conversion |
|---|---|---|---|---|
| P1 | `sign_up_start` | montage de `Register.tsx` | `has_email_prefill` | non |
| P1 | `sign_up_submit` | après validation cliente, avant `POST /users/register` | — | non |
| P1 | `sign_up_error` | validation en échec ou erreur serveur | `error_type` | non |
| P1 | `sign_up` | **compte créé** — l'essai démarre | — | **oui** |
| P1 | `login` | `POST /users/login` réussi | — | non |
| P2 | `email_verified` | route `/verify-email`, jeton validé | — | non |
| P2 | `onboarding_step` | chacune des 4 étapes validée | `step_name` | non |
| P1 | `onboarding_complete` | fin de `Onboarding.tsx` | — | non |
| P2 | `route_builder_step` | chacune des 6 étapes de `NewTour.tsx` | `step_name` | non |
| P1 | `first_route_created` | **première tournée enregistrée**, une fois par compte | — | **oui** |
| P1 | `view_pricing` | affichage de `/subscription/pricing` | — | non |
| P1 | `begin_checkout` | affichage de `/subscription/checkout` | `plan`, `value`, `currency` | non |
| P1 | `purchase` | **abonnement payé** | `plan`, `value`, `currency`, `transaction_id` | **oui** |
| P2 | `invite_sent` | invitation d'équipe envoyée | — | non |
| P2 | `invite_accepted` | invitation acceptée, compte créé | — | non |

**Valeurs, tirées du code de l'app :**

| Paramètre | Valeurs |
|---|---|
| `error_type` | `password_too_short` · `password_mismatch` · `first_name_too_short` · `last_name_too_short` · `company_name_too_short` · `email_taken` · `server` |
| `step_name` (onboarding) | `company_info` · `company_details` · `legal_consent` · `user_preferences` |
| `step_name` (tournée) | `general_info` · `vehicle_selection` · `route_planning` · `salary_config` · `additional_charges` · `cost_estimation` |
| `plan` | `starter` · `premium` · `enterprise` |

### Ce qu'il n'y a pas à mesurer

**Pas de `method` d'authentification.** `Register.tsx` et `Login.tsx` ne proposent que l'e-mail et le mot
de passe — six champs à l'inscription : `first_name`, `last_name`, `company_name`, `email`, `password`,
`password_confirmation`. Aucun Google, aucun Microsoft, aucun SSO.

**Pas de `plan` à l'inscription.** L'offre se choisit après l'essai, dans `/subscription/*`. Le paramètre
n'apparaît donc que sur `begin_checkout` et `purchase`.

### Deux incohérences à trancher avec la landing

**Les identifiants de plan divergent.** La landing émet `independant` / `pro` / `entreprise`, l'app
utilise `starter` / `premium` / `enterprise`. En l'état, impossible de joindre « a cliqué la carte Pro »
et « a souscrit premium ». Aligner la landing sur les identifiants de l'app.

**`Register.tsx` ne lit pas le paramètre `?email=`.** Aucun `useSearchParams` ni `URLSearchParams` dans le
fichier. Le formulaire hero de la landing transmet donc une adresse pour rien — sans préremplir quoi que
ce soit, et en créant le problème RGPD du §7. Soit l'app implémente la lecture, soit la landing cesse
d'envoyer le champ.

---

## 4. Le pont LP → app

### Étape A — Unifier la mesure
- Même **Measurement ID GA4** sur les trois hôtes.
- `movealtys.com`, `lp.movealtys.com` et `app.movealtys.com` ajoutés dans **Configurer vos domaines**
  (supprime le self-referral, et retire au passage les liens internes du rapport « clics sortants » de
  l'Enhanced Measurement).
- Aucun paramètre `site` à inventer : GA4 expose déjà la dimension *Nom d'hôte* pour distinguer les trois.
- Cookie `_ga` en `cookie_domain: 'auto'` → posé sur `.movealtys.com`, partagé. Rien d'autre à faire pour
  que le `client_id` suive.

### Étape B — Propager l'attribution (le point critique)

À la première visite sur la LP, après consentement :

1. Capturer `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `document.referrer`,
   la landing page et l'horodatage.
2. Générer un `lp_id` (`crypto.randomUUID()`), stable par visiteur.
3. Persister le tout dans un cookie first-party `mv_attr` sur `.movealtys.com` (durée ≤ 13 mois, CNIL).
4. **Réécrire tous les liens vers `app.movealtys.com`** pour y ajouter `lp_id` + les UTM. Le formulaire hero
   envoie déjà `email` en `GET` : il faut y injecter les mêmes paramètres en champs cachés.

Les trois propriétés partageant le même domaine racine, l'app lit `mv_attr` directement — les query params
servent de filet de sécurité (cookie bloqué, navigation privée). Le code décore les liens sortants vers
**toute autre propriété du domaine**, pas seulement l'app : le jour où la landing pointera vers la vitrine,
l'attribution suivra sans nouvelle ligne de code.

> **Variante sans cookie** si vous voulez limiter la surface de consentement : ne transmettre `lp_id` et les
> UTM que par query param. Moins robuste (perdu si l'utilisateur revient plus tard directement sur l'app),
> mais exempté de consentement.

### Étape C — Réconcilier côté app
À la création du compte, l'app lit `lp_id` (cookie ou query param) et le **persiste en base sur
l'utilisateur**, avec la source d'acquisition. C'est ce qui vous donne, indépendamment de GA4 :

> nombre de clics « Essai gratuit » → nombre de comptes créés, par canal, par segment, par langue.

`lp_id` doit aussi partir en paramètre de l'événement `sign_up` pour recoller le funnel dans GA4.

### Étape D — Fiabiliser en serveur (phase 2)
Adblock, Safari ITP et les erreurs réseau font perdre 15 à 30 % des `sign_up` mesurés côté client. Une fois
le reste en place : à la création du compte, envoyer `sign_up` via le **Measurement Protocol GA4** depuis le
backend, avec le `client_id` extrait du cookie `_ga` et le `session_id` du cookie `_ga_<container_id>`.
GA4 dédoublonne sur l'`event_id`.

### Étape E — Exploiter
Funnel exploratoire GA4 :

```
page_view (LP) → cta_signup_click → sign_up_start → sign_up_submit → sign_up → first_route_created
```

Segmenté par `cta_location`, `segment`, `page_lang` et source/medium. C'est ce rapport qui dira si les pages
segment (`/tpe/`, `/independants/`…) convertissent mieux que la home, et quel CTA porte réellement le volume.

---

## 5. Événements secondaires (phase 2)

À poser une fois le socle validé — utiles pour le CRO, pas pour le pilotage.

| Événement | Déclencheur | Paramètre clé |
|---|---|---|
| `view_pricing` | Section `#pricing` visible à 50 % | `segment` |
| `faq_open` | Ouverture d'un `<details>` (`Faq.astro:22`) | `faq_question` |
| `nav_click` | Clic navigation (header / footer) | `nav_item`, `nav_location` |
| `language_switch` | `LanguageSwitcher` | `from_lang`, `to_lang` |
| `scroll_depth` | 25 / 50 / 75 / 90 % | natif GTM, aucun code |

GA4 collecte déjà seul : `page_view`, `scroll` (90 %), `click` sortant, `file_download`.

---

## 6. Implémentation — état du dépôt

**Les étapes 1 et 2 sont implémentées et vérifiées** (`astro check` : 0 erreur, 0 avertissement ; build :
20 pages). L'étape 3 se règle dans les consoles Google — voir `movealtys-config-gtm-ga4.md`.

### Fichiers créés

| Fichier | Rôle |
|---|---|
| `src/lib/tracking.ts` | Constantes de build : `GTM_ID`, slugs de segment et de plan, dérivation du contexte de page |
| `src/scripts/data-layer.ts` | `pushEvent()` — écriture dans le `dataLayer`, purge des valeurs vides |
| `src/scripts/consent.ts` | Cookie `mv_consent` sur `.movealtys.com`, `consent update`, pilotage du bandeau |
| `src/scripts/attribution.ts` | Cookie `mv_attr`, `lp_id`, décoration des liens et formulaires quittant cette propriété pour une autre du domaine |
| `src/scripts/analytics.ts` | Les 4 événements : écouteur délégué + soumission du formulaire hero |
| `src/components/analytics/Gtm.astro` | Consent Mode v2, puis injection conditionnelle du conteneur |
| `src/components/analytics/ConsentBanner.astro` | Bandeau bilingue, refus aussi accessible que l'acceptation |

Modifiés : `BaseLayout.astro` (contexte de page sur `<body>`, montage), `Button.astro` (props `track`,
`ctaLocation`, `ctaDestination`, `plan`), `Header`, `Hero`, `Pricing`, `FinalCta`, `Footer`,
`SegmentLanding`, `404.astro`, et `content.ts` (textes du bandeau, fr + en).

### Activation

Conteneur **`GTM-KDVSW56S`**, en dur dans `src/lib/tracking.ts` (`DEFAULT_GTM_ID`) : un ID de conteneur
part de toute façon dans le HTML, en faire une variable d'environnement n'ajoute qu'un oubli possible à
chaque nouvelle cible de déploiement.

| Commande | Effet |
|---|---|
| `npm run build` | mesure active, bandeau affiché |
| `npm run dev` | mesure désactivée — le travail local n'atterrit pas dans la propriété |
| `PUBLIC_GTM_ID=GTM-KDVSW56S npm run dev` | mesure active en dev, pour travailler le bandeau |
| `PUBLIC_GTM_ID= npm run build` | build sans bandeau, sans conteneur, sans cookie |

### Deux décisions prises à l'implémentation

**Consent mode « basic ».** Le conteneur GTM n'est injecté qu'après acceptation : un refus produit zéro
requête vers Google, et non les pings sans cookie du mode « advanced ». C'est ce que demandait la ligne
de recette « aucun événement avant consentement ». Basculer en advanced plus tard ne demande qu'un appel
de `mvLoadGtm()` au chargement — les `consent default` sont déjà posés.

**Un seul attribut d'emplacement.** Le DOM ne porte que `data-cta-location` ; c'est le runtime qui le
republie en `contact_location` pour `contact_request`. Les deux funnels restent séparables dans GA4 sans
doubler les attributs dans chaque composant.

### Le cœur du dispositif

```ts
document.addEventListener('click', (event) => {
  const element = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
  if (!element?.dataset.track) return
  pushEvent(element.dataset.track, paramsFor(element.dataset.track, element))
})
```

Pourquoi ce choix plutôt que des triggers GTM sur sélecteurs CSS : les classes de ce projet sont générées
par Tailwind et changent à chaque retouche de design. Un trigger du type `.bg-brand-500.rounded-full`
casse silencieusement au premier refactor, et personne ne s'en aperçoit avant le rapport mensuel. Les
attributs `data-*` sont explicites, versionnés avec le code, et relisibles dans six mois.

### Dimensions personnalisées

À déclarer dans GA4 **avant** la mise en production : sans elles les paramètres sont bien collectés mais
invisibles dans les rapports, et l'historique ne se rattrape pas. Liste complète dans
`movealtys-config-gtm-ga4.md` §3.1.

---

## 7. Consentement et conformité

- **Consent Mode v2**, `analytics_storage` et `ad_storage` en `denied` par défaut, avec
  `wait_for_update: 500`, `url_passthrough: true`, `ads_data_redaction: true`.
- Bandeau avec refus aussi accessible que l'acceptation (exigence CNIL), et lien de retrait permanent.
- **Le cookie de consentement doit être posé sur `.movealtys.com`**, pour que l'app hérite du choix : sinon
  l'utilisateur se voit imposer un second bandeau juste après avoir cliqué « Essai gratuit », en plein
  parcours de conversion.
- Durée des cookies de mesure ≤ 13 mois, données ≤ 25 mois.
- Politique de confidentialité (`src/lib/static-pages.ts`) à compléter : la section actuelle mentionne
  vaguement « des outils d'analyse » — il faut nommer GA4, la finalité, la durée et le responsable.

### ⚠️ Fuite d'email à anticiper

Le formulaire hero envoie l'email **en query string** vers `app.movealtys.com/register?email=...`. GA4 va
donc collecter cet email dans `page_location` côté app. C'est une **donnée personnelle transmise à Google
sans base légale** : violation RGPD + violation des CGU de GA4 (motif de suspension de compte).

Deux garde-fous, à mettre en place **avant** la première ligne de tracking sur l'app :
1. Activer **Rédaction des données** sur le flux GA4 (Admin → Flux de données → Balisage → Rédaction des
   données) : coche « Adresse e-mail », et ajouter `email` aux paramètres de requête à supprimer.
2. Côté app, consommer le paramètre `email` puis le retirer de l'URL (`history.replaceState`) avant tout
   envoi GA4.

Et évidemment : jamais d'email dans un paramètre d'événement — `generate_lead` ne transporte que
`lead_type`.

---

## 8. Recette

Avant mise en production :

- [ ] Mode Aperçu GTM : les 17 CTA de la LP déclenchent le bon événement, avec les bons paramètres.
- [ ] DebugView GA4 : `page_lang`, `segment` et `page_type` corrects sur `/fr/` et `/en/`, home et 4 pages segment.
- [ ] Header mobile testé séparément (les CTA sont dupliqués dans le DOM : vérifier qu'un clic n'envoie pas 2 événements).
- [ ] Formulaire hero : `generate_lead` **et** `cta_signup_click` partent, et le `submit` n'est pas coupé par la navigation (`beacon` / `event_callback`).
- [ ] Navigation `lp.` → `app.` : session GA4 **continue** (même `session_id`, source d'origine conservée, pas de `movealtys.com / referral`).
- [ ] Même vérification sur `movealtys.com` → `lp.movealtys.com`, si un lien existe entre les deux.
- [ ] `lp_id` présent dans l'URL d'arrivée sur `/register` et lisible côté app.
- [ ] Aucun événement avant consentement (onglet Réseau : zéro requête vers `google-analytics.com`).
- [ ] Choix de consentement conservé au passage sur l'app, sans second bandeau.
- [ ] Aucun email dans `page_location` ni dans un paramètre d'événement.

## 9. Ordre de mise en œuvre

| # | Étape | Statut |
|---|---|---|
| 1 | Bandeau de consentement, Consent Mode v2, conteneur GTM | **fait** — dépôt |
| 2 | `data-track` sur les 17 CTA, écouteur délégué, les 4 événements | **fait** — dépôt |
| 3 | Balises GTM, dimensions personnalisées, conversions GA4 | à faire — consoles Google, `movealtys-config-gtm-ga4.md` |
| 4 | Propagation UTM / `lp_id` + les **trois hôtes** dans « Configurer vos domaines » | code en place ; reste la config GA4 et la lecture côté app |
| 5 | Événements app (§3) et persistance du `lp_id` en base | à faire — équipe app |
| 6 | Funnel GA4, puis Measurement Protocol serveur (§4 étape D) | phase 2 |

Rien ne remonte tant que `PUBLIC_GTM_ID` n'est pas renseignée et que le conteneur n'est pas publié.
L'étape 4 est le contrat d'interface avec l'équipe app : à caler avec eux en premier, avant d'écrire du
code des deux côtés.
