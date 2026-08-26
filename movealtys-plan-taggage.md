# Plan de taggage MoveAltys

Chaque événement est poussé dans `window.dataLayer`. GTM (`GTM-KDVSW56S`) les relaie vers GA4 :
aucune balise à créer.

Tous les événements portent `page_type`, `segment`, `page_lang` et `lp_id`.

## Landing — `lp.movealtys.com` · fait

| Événement | Quand | Paramètres |
|---|---|---|
| `cta_signup_click` | clic sur un bouton « Essai gratuit » — 10 emplacements | `cta_location`, `cta_destination`, `cta_label`, `plan` |
| `generate_lead` | soumission du formulaire hero — même intention, avec l'e-mail saisi | `lead_type`, `cta_location` |
| `cta_login_click` | clic sur « Connexion » — 3 emplacements | `cta_location`, `cta_destination`, `cta_label` |
| `contact_request` | clic sur un CTA `mailto:` — 4 emplacements | `contact_location`, `contact_method` |

## App — `app.movealtys.com` · à faire

Répond à la question : **le visiteur est-il allé au bout de l'inscription ?**

| Événement | Quand | Paramètres |
|---|---|---|
| `sign_up_start` | montage de `Register.tsx` | — |
| `sign_up_error` | validation en échec ou erreur serveur | `error_type` |
| `sign_up` | compte créé | — |

`lp_id` fait le lien : il est posé par la landing dans le cookie `mv_attr` (domaine `.movealtys.com`) et
dans l'URL. L'app le lit et le renvoie sur chacun de ces trois événements.

Taux de conversion = `sign_up` ÷ `cta_signup_click`, segmentable par `cta_location`, `segment` et source.

## Valeurs

| Paramètre | Valeurs |
|---|---|
| `page_type` | `home` · `segment` · `legal` · `404` |
| `segment` | `home` · `independants` · `tpe` · `livraison-locale` · `flotte-interne` · `none` |
| `page_lang` | `fr` · `en` |
| `lp_id` | UUID posé par la landing |
| `cta_location` | `header` · `header_mobile` · `hero_form` · `pricing_card` · `pricing_enterprise` · `final_cta` · `footer` · `segment_hero` · `segment_pricing` · `segment_final_cta` |
| `cta_destination` | `register` · `login` · `mailto` |
| `cta_label` | le libellé affiché du bouton |
| `contact_location` | `footer` · `final_cta` · `pricing_enterprise` · `segment_final_cta` |
| `contact_method` | `mailto` |
| `lead_type` | `email_prefill` |
| `plan` | `starter` · `premium` · `enterprise` — depuis les cartes tarifs uniquement |
| `error_type` | `password_too_short` · `password_mismatch` · `first_name_too_short` · `last_name_too_short` · `company_name_too_short` · `email_taken` · `server` |

## Exemple

```js
window.dataLayer.push({
  event: 'sign_up',
  lp_id: '3f2b8c14-9a7e-4d51-b0c8-6e2a91d47f3b',
})
```
