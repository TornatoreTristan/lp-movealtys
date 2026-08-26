/**
 * Build-time half of the tagging plan (see movealtys-plan-taggage.md).
 *
 * Everything here runs while Astro renders. The runtime half — the dataLayer,
 * the consent gate and the attribution handover to app.movealtys.com — lives in
 * `src/scripts/`.
 */

/**
 * GTM container, shared with app.movealtys.com. Hard-coded rather than
 * environment-only: a container id ships in the HTML anyway, so treating it as
 * configuration just means one more thing to forget on a new deploy target.
 */
const DEFAULT_GTM_ID = 'GTM-KDVSW56S'

const GTM_ID_OVERRIDE = (import.meta.env.PUBLIC_GTM_ID as string | undefined)?.trim()

/**
 * Off during `astro dev` so local work never lands in the property. Set
 * `PUBLIC_GTM_ID` to measure anyway (to exercise the banner), or to an empty
 * string to ship a build with no measurement at all.
 */
export const GTM_ID = GTM_ID_OVERRIDE ?? (import.meta.env.DEV ? '' : DEFAULT_GTM_ID)

export const ANALYTICS_ENABLED = GTM_ID.length > 0

/** Audience landing pages, keyed by their route slug. Drives the `segment` parameter. */
export const SEGMENT_SLUGS = ['independants', 'tpe', 'livraison-locale', 'flotte-interne'] as const

export type SegmentSlug = (typeof SEGMENT_SLUGS)[number]

/** `plan` parameter values, indexed like `content.pricing.plans`. */
export const PLAN_SLUGS = ['independant', 'pro', 'entreprise'] as const

export type PageType = 'home' | 'segment' | 'legal' | '404'

export interface PageContext {
  pageType: PageType
  /** Slug of the audience page, or `none` outside them. */
  segment: SegmentSlug | 'home' | 'none'
}

/**
 * Derives the two page-level event parameters from the locale-free path that
 * every page already hands to BaseLayout — no extra prop to keep in sync.
 *
 * `override` exists for the 404 page, which renders at no path of its own and
 * would otherwise be counted as the home page.
 */
export function getPageContext(path: string, override?: PageType): PageContext {
  const slug = path.replace(/^\/+|\/+$/g, '')

  let derived: PageContext
  if (!slug) derived = { pageType: 'home', segment: 'home' }
  else if ((SEGMENT_SLUGS as readonly string[]).includes(slug)) {
    derived = { pageType: 'segment', segment: slug as SegmentSlug }
  } else derived = { pageType: 'legal', segment: 'none' }

  if (!override || override === derived.pageType) return derived
  return { pageType: override, segment: override === 'segment' ? derived.segment : 'none' }
}
