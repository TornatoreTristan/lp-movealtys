/**
 * Consent gate — CNIL basic consent mode.
 *
 * Consent Mode v2 defaults are declared `denied` in the document head, and the
 * GTM container itself is only injected after an explicit acceptance. Refusing
 * therefore means zero request to Google, not a cookieless ping.
 *
 * The choice is stored on `.movealtys.com`, the registrable domain shared by the
 * three properties — movealtys.com, lp.movealtys.com and app.movealtys.com — so
 * one answer covers the whole estate and nobody is asked twice mid-signup.
 */

import { gtag, pushEvent } from './data-layer'

export type ConsentChoice = 'granted' | 'denied'

export const CONSENT_COOKIE = 'mv_consent'

/** CNIL: a consent answer is re-asked at most every six months. */
const CONSENT_MAX_AGE_DAYS = 180

/** The registrable domain the three properties share. */
const ESTATE_DOMAIN = 'movealtys.com'

/** True for movealtys.com and any of its subdomains — lp, app, and whatever comes next. */
export function isEstateHost(host: string): boolean {
  return host === ESTATE_DOMAIN || host.endsWith(`.${ESTATE_DOMAIN}`)
}

/** Widest domain we may write to, so every property reads the same cookies. Undefined off-estate. */
export function cookieDomain(): string | undefined {
  return isEstateHost(window.location.hostname) ? `.${ESTATE_DOMAIN}` : undefined
}

export function readCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function writeCookie(name: string, value: string, maxAgeDays: number): void {
  const domain = cookieDomain()
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${Math.round(maxAgeDays * 86_400)}`,
    'samesite=lax',
    domain ? `domain=${domain}` : '',
    window.location.protocol === 'https:' ? 'secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export function readConsent(): ConsentChoice | null {
  const value = readCookie(CONSENT_COOKIE)
  return value === 'granted' || value === 'denied' ? value : null
}

const listeners = new Set<(choice: ConsentChoice) => void>()

export function onConsentChange(listener: (choice: ConsentChoice) => void): void {
  listeners.add(listener)
}

function applyConsent(choice: ConsentChoice): void {
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
  if (choice === 'granted') window.mvLoadGtm?.()
}

export function setConsent(choice: ConsentChoice): void {
  writeCookie(CONSENT_COOKIE, choice, CONSENT_MAX_AGE_DAYS)
  applyConsent(choice)
  pushEvent('consent_update', { consent_state: choice })
  listeners.forEach((listener) => listener(choice))
}

/**
 * Wires the banner: shown only when no answer is on file, reopened from the
 * footer link. No-ops when no container id is configured and the banner is
 * therefore absent from the page.
 */
export function initConsentUi(): void {
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]')
  const openers = document.querySelectorAll<HTMLElement>('[data-consent-open]')

  const setOpen = (open: boolean) => banner?.toggleAttribute('hidden', !open)

  if (banner) {
    if (readConsent() === null) setOpen(true)

    banner.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        setConsent(button.dataset.consentChoice === 'granted' ? 'granted' : 'denied')
        setOpen(false)
      })
    })
  }

  openers.forEach((opener) => {
    opener.hidden = !banner
    opener.addEventListener('click', () => setOpen(true))
  })
}
