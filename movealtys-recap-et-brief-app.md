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

> **Ce brief est autonome.** Vous n'avez pas besoin de lire la partie 1, ni de connaître Google Tag
> Manager. Tout est expliqué depuis le début.

---

## 2.1 Le problème qu'on vous demande de résoudre

Une landing page (`lp.movealtys.com`) fait de la publicité et envoie des visiteurs vers votre page
d'inscription. Aujourd'hui on sait combien de personnes **cliquent**. On ne sait pas combien **créent
réellement un compte**, ni **d'où elles venaient** (quelle pub, quel mot-clé, quelle campagne).

Sans cette information, impossible de savoir quelle campagne publicitaire rapporte des clients et laquelle
brûle du budget.

**Votre travail : faire en sorte que l'app dise « cette inscription vient de la campagne X ».**

## 2.2 Comment ça marche — le modèle mental

```
   Visiteur clique une pub Google
              ↓
   lp.movealtys.com/fr/
              ↓  la landing écrit 2 cookies sur .movealtys.com :
              ↓    mv_attr    = d'où vient ce visiteur + un identifiant unique (lp_id)
              ↓    mv_consent = a-t-il accepté les cookies de mesure
              ↓
   app.movealtys.com/register?lp_id=…&utm_source=google
              ↓  VOUS : lire lp_id, le garder, et signaler ce que fait l'utilisateur
              ↓
        window.dataLayer.push({ event: 'sign_up', lp_id: '…' })
              ↓
   Google Tag Manager (déjà configuré, rien à faire)
              ↓
   Google Analytics 4 → « 12 inscriptions, dont 8 venant de la campagne X »
```

**Le point important : vous ne parlez jamais directement à Google Analytics.** Vous écrivez dans un tableau
JavaScript de la page, `window.dataLayer`. Un outil déjà installé, Google Tag Manager, surveille ce tableau
et transmet à Analytics. Tout est déjà branché de ce côté — **vous n'avez aucune balise, aucun compte,
aucune configuration Google à créer.**

### Le vocabulaire, une fois pour toutes

| Terme | Ce que c'est |
|---|---|
| **`dataLayer`** | Un simple tableau JavaScript sur `window`. Vous y poussez des objets. C'est votre seule interface. |
| **GTM** (Google Tag Manager) | Un script qui surveille le `dataLayer` et relaie vers les outils de mesure. Déjà configuré. |
| **GA4** (Google Analytics 4) | L'outil de mesure final. Vous ne l'appelez jamais directement. |
| **Consent Mode** | Le mécanisme Google pour savoir si on a le droit de mesurer. Il faut le renseigner avant toute mesure. |
| **`lp_id`** | Un identifiant unique par visiteur, généré par la landing. C'est le fil rouge de toute l'opération. |
| **`mv_attr`** | Le cookie où la landing range `lp_id` et la provenance du visiteur. |
| **`mv_consent`** | Le cookie où la landing range la réponse au bandeau : `granted` ou `denied`. |

### Pourquoi les cookies de la landing vous sont accessibles

`app.movealtys.com` et `lp.movealtys.com` sont deux sous-domaines de `movealtys.com`. La landing pose ses
cookies sur le domaine `.movealtys.com` — **avec le point devant** — ce qui les rend lisibles depuis tous
les sous-domaines. Vous n'avez donc rien à négocier avec la landing : les cookies sont déjà là quand
l'utilisateur arrive chez vous.

---

## 2.3 La spécification des événements

**Le tableau des événements vit dans `movealtys-plan-taggage.csv`**, à ouvrir dans un tableur. Les valeurs
autorisées de chaque paramètre sont dans `movealtys-plan-taggage-parametres.csv`.

Une seule source de vérité, volontairement : dupliquer le tableau dans plusieurs documents, c'est
garantir qu'ils divergeront.

La version mise en page, avec le module de code prêt à copier et les exemples d'intégration, est
publiée ici : **https://claude.ai/code/artifact/d435fc34-30ac-46e7-b80c-a7ffa8938770**

## 2.4 Les cinq tâches

| # | Tâche | Où | Effort |
|---|---|---|---|
| 1 | Copier le module `tracking.js` et l'initialiser | front, au démarrage | 30 min |
| 2 | Trancher le paramètre `email` de l'URL | front, `Register.tsx` | 20 min |
| 3 | Appeler les fonctions de suivi aux bons moments | front, 13 endroits | 3 h |
| 4 | Stocker `lp_id` et l'acquisition en base | back | 1 h |
| 5 | Ajouter un bandeau de consentement | front | 2 h |

La 4 est la plus importante : Google Analytics peut tomber, être bloqué ou être remplacé dans deux ans ;
ce qui est en base, non.

## 2.5 Ce que le code de l'app impose

Relevé dans le bundle de production, août 2026.

**Six champs à l'inscription** — `first_name`, `last_name`, `company_name`, `email`, `password`,
`password_confirmation`. **Aucun login social**, donc aucun paramètre `method` à mesurer.

**Un essai gratuit de 14 jours, sans choix d'offre.** Le plan n'existe qu'à partir de `/subscription/*`,
donc `plan` n'apparaît que sur `begin_checkout` et `purchase`. Identifiants réels : `starter`, `premium`,
`enterprise`.

**Quatre étapes d'onboarding** — `company_info`, `company_details`, `legal_consent`, `user_preferences`.

**Six étapes dans le créateur de tournée** — `general_info`, `vehicle_selection`, `route_planning`,
`salary_config`, `additional_charges`, `cost_estimation`.

**`Register.tsx` ne lit pas `?email=`.** Aucun `useSearchParams`, aucun `URLSearchParams`. Le formulaire
hero de la landing envoie donc une adresse pour rien, tout en créant un problème RGPD. À trancher : soit
l'app implémente le préremplissage et purge le paramètre de l'URL, soit la landing cesse de l'envoyer.

## 2.6 Le funnel visé

```
page_view (landing)
  → cta_signup_click
  → sign_up_start → sign_up_submit → sign_up      ← essai 14 jours ouvert
  → onboarding_complete
  → first_route_created                            ← activation réelle
  → view_pricing → begin_checkout → purchase       ← client payant
```

C'est `purchase` qu'il faudra importer dans Google Ads, pas `sign_up` : optimiser les enchères sur des
inscriptions à un essai gratuit attire du volume qui ne paie jamais.

## 2.7 Ce qu'il ne faut pas faire

**Aucune balise à créer dans GTM.** Le conteneur contient déjà le déclencheur `CE - App events`, qui
reconnaît les quinze noms d'événements, et la balise qui les relaie vers Analytics.

**Pas de seconde balise de configuration GA4.** Une deuxième doublerait toutes les pages vues.

**Pas d'événement créé dans l'interface GA4.** Le bouton « Créer un événement » fabrique un dérivé qui
s'ajoute à l'original : le même geste compté deux fois.

**Pas de renommage.** Un `signup_completed` à la place de `sign_up` ne remonte nulle part, silencieusement.

**Aucune donnée personnelle en paramètre** : ni e-mail, ni nom, ni téléphone.
