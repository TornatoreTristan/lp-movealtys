# Plan de taggage MoveAltys

Chaque événement est poussé dans `window.dataLayer`. GTM (`GTM-KDVSW56S`) les relaie vers GA4 :
aucune balise à créer.

Tous les événements portent aussi `page_type`, `segment`, `page_lang` et `lp_id`.

## Landing — `lp.movealtys.com` · fait

| Événement | Quand | Paramètres |
|---|---|---|
| `cta_signup_click` | clic sur un bouton « Essai gratuit » (10 emplacements) | `cta_location`, `cta_destination`, `cta_label`, `plan` |
| `generate_lead` | soumission du formulaire hero | `lead_type`, `cta_location` |
| `cta_login_click` | clic sur « Connexion » (3 emplacements) | `cta_location`, `cta_destination`, `cta_label` |
| `contact_request` | clic sur un CTA `mailto:` (4 emplacements) | `contact_location`, `contact_method`, `plan` |

## App — `app.movealtys.com` · à faire

| Prio | Événement | Quand | Paramètres |
|---|---|---|---|
| P1 | `sign_up_start` | montage de `Register.tsx` | `has_email_prefill` |
| P1 | `sign_up_submit` | après validation cliente, avant `POST /users/register` | — |
| P1 | `sign_up_error` | validation en échec ou erreur serveur | `error_type` |
| P1 | `sign_up` | compte créé — l'essai de 14 jours démarre | — |
| P1 | `login` | `POST /users/login` réussi | — |
| P1 | `onboarding_complete` | fin de `Onboarding.tsx` | — |
| P1 | `first_route_created` | première tournée enregistrée, une fois par compte | — |
| P1 | `view_pricing` | affichage de `/subscription/pricing` | — |
| P1 | `begin_checkout` | affichage de `/subscription/checkout` | `plan`, `value`, `currency` |
| P1 | `purchase` | abonnement payé | `plan`, `value`, `currency`, `transaction_id` |
| P2 | `email_verified` | route `/verify-email`, jeton validé | — |
| P2 | `onboarding_step` | chacune des 4 étapes validée | `step_name` |
| P2 | `route_builder_step` | chacune des 6 étapes de `NewTour.tsx` | `step_name` |
| P2 | `invite_sent` | invitation d'équipe envoyée | — |
| P2 | `invite_accepted` | invitation acceptée, compte créé | — |

## Valeurs

| Paramètre | Valeurs |
|---|---|
| `page_type` | `home` · `segment` · `legal` · `404` |
| `segment` | `home` · `independants` · `tpe` · `livraison-locale` · `flotte-interne` · `none` |
| `page_lang` | `fr` · `en` |
| `lp_id` | UUID posé par la landing, lu dans le cookie `mv_attr` ou l'URL |
| `cta_location` | `header` · `header_mobile` · `hero_form` · `pricing_card` · `pricing_enterprise` · `final_cta` · `footer` · `segment_hero` · `segment_pricing` · `segment_final_cta` |
| `cta_destination` | `register` · `login` · `mailto` |
| `contact_location` | `footer` · `final_cta` · `pricing_enterprise` · `segment_final_cta` |
| `contact_method` | `mailto` |
| `lead_type` | `email_prefill` |
| `plan` | `starter` · `premium` · `enterprise` |
| `error_type` | `password_too_short` · `password_mismatch` · `first_name_too_short` · `last_name_too_short` · `company_name_too_short` · `email_taken` · `server` |
| `step_name` | onboarding : `company_info` · `company_details` · `legal_consent` · `user_preferences`<br>tournée : `general_info` · `vehicle_selection` · `route_planning` · `salary_config` · `additional_charges` · `cost_estimation` |
| `has_email_prefill` | `true` · `false` |
| `value` | montant en euros |
| `currency` | `EUR` |
| `transaction_id` | identifiant unique de la transaction |

## Conversions

`generate_lead` · `contact_request` · `sign_up` · `first_route_created` · `purchase`

Dans Google Ads, n'importer que **`purchase`**.

## Exemple

```js
window.dataLayer.push({
  event: 'purchase',
  plan: 'premium',
  value: 69,
  currency: 'EUR',
  transaction_id: 'sub_1a2b3c',
  lp_id: '3f2b8c14-9a7e-4d51-b0c8-6e2a91d47f3b',
})
```
