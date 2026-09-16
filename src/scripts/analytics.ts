/**
 * The four landing-page events of the tagging plan.
 *
 *   cta_signup_click · generate_lead · cta_login_click · contact_request
 *
 * One delegated listener reads `data-track` off the clicked element rather than
 * a set of CSS selectors configured in GTM: the classes on this site are
 * Tailwind output and change with every design pass, so a selector-based
 * trigger would break silently and nobody would notice until the monthly report.
 */

import { pushEvent, type EventParams } from './data-layer'
import { initConsentUi, onConsentChange, readConsent } from './consent'
import { decorateEstateLinks, ensureAttribution, landingId } from './attribution'

/** Page-level parameters, published by BaseLayout on <body>. */
function pageContext(): EventParams {
  const { pageType, segment, pageLang } = document.body.dataset
  return { page_type: pageType, segment, page_lang: pageLang }
}

function labelOf(element: Element): string {
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 100)
}

/**
 * A contact click and a CTA click carry the same three attributes but report
 * them under different parameter names, so the two funnels stay separable in
 * GA4. The DOM only ever spells out `data-cta-location`.
 */
function paramsFor(event: string, element: HTMLElement): EventParams {
  const location = element.dataset.ctaLocation
  const plan = element.dataset.plan

  if (event === 'contact_request') {
    return {
      contact_method: element.getAttribute('href')?.startsWith('mailto:') ? 'mailto' : 'link',
      contact_location: location,
      plan,
      ...pageContext(),
    }
  }

  return {
    cta_location: location,
    cta_destination: element.dataset.ctaDestination,
    cta_label: labelOf(element),
    plan,
    lp_id: landingId(),
    ...pageContext(),
  }
}

function trackClicks(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    const element = target?.closest<HTMLElement>('[data-track]')
    if (!element?.dataset.track) return

    pushEvent(element.dataset.track, paramsFor(element.dataset.track, element))
  })
}

/**
 * Tells the team someone is heading to /register with their email — see
 * `src/pages/api/signup-intent.ts`. Not analytics: it goes to this site's own
 * server whatever the consent answer, and `sendBeacon` outlives the navigation
 * so the form never waits for it.
 */
function notifySignupIntent(form: HTMLFormElement, location: string): void {
  const email = form.querySelector<HTMLInputElement>('input[name="email"]')?.value.trim()
  if (!email || !navigator.sendBeacon) return

  const { segment, pageLang } = document.body.dataset
  const query = new URLSearchParams(window.location.search)
  const utm = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      .map((key) => [key, query.get(key)])
      .filter(([, value]) => value),
  )

  const body = JSON.stringify({
    email,
    locale: pageLang,
    segment,
    page_path: window.location.pathname,
    cta_location: location,
    lp_id: landingId(),
    referrer: document.referrer || undefined,
    ...utm,
  })
  navigator.sendBeacon('/api/signup-intent/', new Blob([body], { type: 'application/json' }))
}

/**
 * The hero form is a GET straight to /register, so the page unloads on submit.
 * `generate_lead` is a conversion and the most qualified signal on the site —
 * worth holding the navigation for, but never longer than the hard ceiling
 * below, which fires whether or not GTM answers.
 */
function trackHeroForm(): void {
  const NAVIGATION_CEILING_MS = 800

  document.addEventListener('submit', (event) => {
    const target = event.target as HTMLElement | null
    const form = target?.closest<HTMLFormElement>('form[data-track-submit]')
    if (!form) return

    const submitButton = form.querySelector('[type="submit"]')
    const context = pageContext()
    const location = form.dataset.ctaLocation ?? 'hero_form'

    notifySignupIntent(form, location)

    pushEvent('cta_signup_click', {
      cta_location: location,
      cta_destination: 'register',
      cta_label: submitButton ? labelOf(submitButton) : undefined,
      lp_id: landingId(),
      ...context,
    })

    const lead: EventParams = {
      lead_type: form.dataset.leadType ?? 'email_prefill',
      cta_location: location,
      lp_id: landingId(),
      ...context,
    }

    // Nothing is listening when consent was refused: submit straight away.
    if (readConsent() !== 'granted') {
      pushEvent('generate_lead', lead)
      return
    }

    event.preventDefault()

    let navigated = false
    const go = () => {
      if (navigated) return
      navigated = true
      form.submit()
    }

    pushEvent('generate_lead', lead, { callback: go, timeout: NAVIGATION_CEILING_MS - 100 })
    window.setTimeout(go, NAVIGATION_CEILING_MS)
  })
}

export function initAnalytics(): void {
  initConsentUi()

  if (readConsent() === 'granted') ensureAttribution()
  decorateEstateLinks()

  onConsentChange((choice) => {
    if (choice !== 'granted') return
    ensureAttribution()
    decorateEstateLinks()
  })

  trackClicks()
  trackHeroForm()
}
