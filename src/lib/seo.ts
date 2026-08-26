/**
 * Indexation policy for this property.
 *
 * The landing page is deliberately kept out of the search index. It lives on
 * `lp.movealtys.com` alongside the marketing site on `movealtys.com`, says
 * largely the same things, and would compete with it for the same queries —
 * leaving Google to pick which one ranks. Its job is to receive paid and
 * campaign traffic, which needs no organic visibility at all.
 *
 * Note what this does *not* do: `robots.txt` still allows crawling. Blocking
 * the crawl would stop robots from ever reading the `noindex` below, which is
 * the classic way to keep a page indexed forever. Let them in, tell them no.
 *
 * Flip this to `true` the day the landing is meant to rank on its own — the
 * meta tag, `robots.txt` and the sitemap all follow from here.
 */
export const INDEXABLE = false

/** `content` for the robots meta tag, or `null` when the page may be indexed. */
export function robotsDirective(pageNoindex: boolean): string | null {
  // A page marked noindex on its own (a stub, the 404) also withholds its links.
  if (pageNoindex) return 'noindex, nofollow'
  // Site-wide: no indexing, but keep following links to the app and the site.
  if (!INDEXABLE) return 'noindex, follow'
  return null
}
