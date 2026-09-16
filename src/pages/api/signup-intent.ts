/**
 * Announces a signup intent: someone typed their email in the hero form and
 * left for app.movealtys.com/register. The page posts here with `sendBeacon`
 * on submit — to `/api/signup-intent/`, trailing slash included, or the
 * redirect turns the POST into a GET — and this route relays it to
 * `SIGNUP_WEBHOOK_URL`.
 *
 * The only on-demand route of the site. The webhook URL is a secret and the
 * repository is public, so the browser never talks to the webhook directly.
 */
import type { APIRoute } from 'astro'
import { SIGNUP_WEBHOOK_SECRET, SIGNUP_WEBHOOK_URL } from 'astro:env/server'

export const prerender = false

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_BODY_BYTES = 4096
const WEBHOOK_TIMEOUT_MS = 5000

/**
 * In-memory limits. Not keyed by IP: behind the production proxy chain the
 * address the server sees is a proxy's, shared by every visitor.
 */
const WINDOW_MS = 10 * 60 * 1000
/** Ceiling across all visitors, so a script cannot flood the channel. */
const GLOBAL_MAX = 30
const recentSends: number[] = []
/** One notification per address per window: resubmits and double clicks stay silent. */
const lastSentByEmail = new Map<string, number>()

function prune(now: number): void {
  while (recentSends.length && now - recentSends[0] >= WINDOW_MS) recentSends.shift()
  for (const [email, at] of lastSentByEmail) {
    if (now - at >= WINDOW_MS) lastSentByEmail.delete(email)
  }
}

/** Only this site may post: the production host, or whatever host served the page (dev, preview). */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  let host: string
  try {
    host = new URL(origin).host
  } catch {
    return false
  }
  return host === new URL(import.meta.env.SITE).host || host === request.headers.get('host')
}

function text(value: unknown, max = 200): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return new Response(null, { status: 403 })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return new Response(null, { status: 413 })

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw)
  } catch {
    return new Response(null, { status: 400 })
  }
  if (!body || typeof body !== 'object') return new Response(null, { status: 400 })

  const email = text(body.email, 254)?.toLowerCase()
  if (!email || !EMAIL_PATTERN.test(email)) return new Response(null, { status: 400 })

  const now = Date.now()
  prune(now)
  if (lastSentByEmail.has(email)) return new Response(null, { status: 204 })
  if (recentSends.length >= GLOBAL_MAX) {
    console.warn('[signup-intent] global limit reached, intent dropped')
    return new Response(null, { status: 429 })
  }

  if (!SIGNUP_WEBHOOK_URL) {
    console.warn('[signup-intent] SIGNUP_WEBHOOK_URL is not set, intent dropped')
    return new Response(null, { status: 204 })
  }

  const utm = Object.fromEntries(UTM_KEYS.map((key) => [key, text(body[key])]).filter(([, value]) => value))

  const payload = {
    event: 'signup_intent',
    email,
    occurred_at: new Date().toISOString(),
    locale: text(body.locale, 5),
    page_path: text(body.page_path, 300),
    segment: text(body.segment, 50),
    cta_location: text(body.cta_location, 50),
    lp_id: text(body.lp_id, 100),
    referrer: text(body.referrer, 300),
    ...utm,
  }

  try {
    const response = await fetch(SIGNUP_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(SIGNUP_WEBHOOK_SECRET ? { 'x-webhook-secret': SIGNUP_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error(`[signup-intent] webhook answered ${response.status}`)
      return new Response(null, { status: 502 })
    }
  } catch (error) {
    console.error('[signup-intent] webhook unreachable', error)
    return new Response(null, { status: 502 })
  }

  recentSends.push(now)
  lastSentByEmail.set(email, now)

  return new Response(null, { status: 204 })
}
