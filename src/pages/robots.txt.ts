import type { APIRoute } from 'astro'
import { INDEXABLE } from '../lib/seo'

/**
 * Generated rather than served from `public/`, so the indexation switch in
 * `src/lib/seo.ts` governs the meta tag, this file and the sitemap together.
 */
export const GET: APIRoute = ({ site }) => {
  const lines = INDEXABLE
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site).href}`]
    : [
        '# Crawling is allowed on purpose: robots have to read the page to see its',
        '# noindex directive. Blocking them here would leave it indexed instead.',
        'User-agent: *',
        'Allow: /',
      ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
