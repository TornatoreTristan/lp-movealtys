/**
 * Thin wrapper around the GTM dataLayer.
 *
 * Pushing is always safe: the dataLayer is a plain in-page array, and the GTM
 * container is only injected once the visitor has accepted (see `consent.ts`).
 * Events pushed before that are replayed by GTM if consent arrives later, and
 * discarded with the page if it never does.
 */

export type EventParams = Record<string, string | number | boolean | undefined>

export interface PushOptions {
  /** Ran once GTM has flushed the event — use to delay a navigation. */
  callback?: () => void
  /** Ceiling for `callback`, in milliseconds. */
  timeout?: number
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    /** Injects the GTM container. Defined by `Gtm.astro`, idempotent. */
    mvLoadGtm?: () => void
  }
}

/** Empty and undefined values are dropped: GA4 would register them as blank dimensions. */
export function pushEvent(event: string, params: EventParams = {}, options: PushOptions = {}): void {
  const payload: Record<string, unknown> = { event }

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') payload[key] = value
  }

  if (options.callback) {
    payload.eventCallback = options.callback
    payload.eventTimeout = options.timeout ?? 700
  }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
}

/** Consent commands go through the canonical gtag shim declared in `Gtm.astro`. */
export function gtag(...args: unknown[]): void {
  window.gtag?.(...args)
}
