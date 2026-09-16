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

/** Per-IP ceiling, in memory: enough to keep a script from flooding the channel. */
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)

  if (hits.size > 10_000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= RATE_LIMIT.windowMs)) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT.max
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
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

  const ip = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || clientAddress
  if (rateLimited(ip)) return new Response(null, { status: 429 })

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

  return new Response(null, { status: 204 })
}
