/**
 * Acquisition handover across the movealtys.com estate.
 *
 * Three properties share one registrable domain — the marketing site
 * (movealtys.com), this landing page (lp.movealtys.com) and the product
 * (app.movealtys.com). The landing owns the campaign context; the app owns the
 * signup. Without this module the two never meet: every link out is hard-coded,
 * so a visitor arriving from Google Ads lands on /register stripped of
 * everything that says where they came from.
 *
 * Two sources, deliberately different in nature:
 *   - the cookie `mv_attr` holds the first touch and a stable `lp_id`, and is
 *     only written once measurement consent is granted;
 *   - the current URL's own campaign parameters are read every time — passing
 *     along a parameter the visitor arrived with is not storage, so it needs no
 *     consent and keeps working for people who refused.
 *
 * On collision the current URL wins: `lp_id` stays stable while the campaign
 * reflects the visit that actually produced the click.
 */

import { isEstateHost, readConsent, readCookie, writeCookie } from './consent'

const ATTR_COOKIE = 'mv_attr'

/** 13 months — the CNIL ceiling for measurement cookies. */
const ATTR_MAX_AGE_DAYS = 395

const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
] as const

interface Attribution extends Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>> {
  lp_id: string
  first_seen: string
  landing_page: string
  referrer: string
}

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `lp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

function campaignFromUrl(): Record<string, string> {
  const search = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}

  for (const key of CAMPAIGN_KEYS) {
    const value = search.get(key)
    if (value) found[key] = value.slice(0, 200)
  }
  return found
}

function readStored(): Attribution | null {
  const raw = readCookie(ATTR_COOKIE)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Attribution
    return typeof parsed?.lp_id === 'string' ? parsed : null
  } catch {
    return null
  }
}

/**
 * Creates the visitor's attribution record on first consented visit, and keeps
 * it untouched afterwards — first touch, not last.
 */
export function ensureAttribution(): Attribution | null {
  if (readConsent() !== 'granted') return null

  const existing = readStored()
  if (existing) return existing

  const record: Attribution = {
    lp_id: newId(),
    first_seen: new Date().toISOString(),
    landing_page: window.location.pathname,
    referrer: document.referrer || 'direct',
    ...campaignFromUrl(),
  }

  writeCookie(ATTR_COOKIE, JSON.stringify(record), ATTR_MAX_AGE_DAYS)
  return record
}

/** Parameters to carry over to the app. Empty until there is something to carry. */
export function attributionParams(): Record<string, string> {
  const stored = readStored()
  const params: Record<string, string> = {}

  if (stored) {
    params.lp_id = stored.lp_id
    for (const key of CAMPAIGN_KEYS) {
      const value = stored[key]
      if (value) params[key] = value
    }
  }

  return { ...params, ...campaignFromUrl() }
}

/** The visitor's stable landing id, for event parameters. */
export function landingId(): string | undefined {
  return readStored()?.lp_id
}

/** Targets another property of the estate — not this page's own host, not the open web. */
function leavesThisProperty(url: URL): boolean {
  return isEstateHost(url.hostname) && url.hostname !== window.location.hostname
}

/**
 * Appends the attribution to every link and form leaving this property for
 * another one in the estate — app.movealtys.com today, movealtys.com the day a
 * link points there. Runs at init and again on acceptance, since the id only
 * exists after consent.
 *
 * Existing parameters are never overwritten: the hero form's `email` and any
 * hand-written query string stay as authored.
 */
export function decorateEstateLinks(): void {
  const params = attributionParams()
  if (Object.keys(params).length === 0) return

  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]').forEach((link) => {
    const url = new URL(link.href)
    if (!leavesThisProperty(url)) return

    for (const [key, value] of Object.entries(params)) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value)
    }
    link.href = url.toString()
  })

  document.querySelectorAll<HTMLFormElement>('form[action^="https://"]').forEach((form) => {
    if (!leavesThisProperty(new URL(form.action))) return

    for (const [key, value] of Object.entries(params)) {
      const field = form.querySelector<HTMLInputElement>(`input[name="${key}"]`)
      if (field) {
        field.value = value
        continue
      }
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    }
  })
}
