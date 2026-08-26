import { LOCALES, LOCALE_META, localizePath, type Locale } from '../i18n/config'
import { CONTENT, CONTACT } from '../i18n/content'

/**
 * The organisation's identity is anchored on the brand domain, not on the host
 * this page happens to be served from: `movealtys.com`, `lp.movealtys.com` and
 * `app.movealtys.com` must resolve to the same entity, so the `@id` and the
 * `url` stay on the apex while `WebSite` describes this property.
 */
const BRAND_ORIGIN = 'https://movealtys.com'

const ORGANISATION_ID = `${BRAND_ORIGIN}/#organization`

/** Structured data for the landing page: who we are, what the product is, and the FAQ. */
export function buildHomeSchema(locale: Locale, site: URL): Record<string, unknown>[] {
  const t = CONTENT[locale]
  const home = new URL(localizePath(locale, ''), site).href

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORGANISATION_ID,
      name: 'MoveAltys',
      url: BRAND_ORIGIN,
      logo: new URL('/img/movealtys-logo.svg', site).href,
      email: CONTACT.email,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      url: site.origin,
      name: 'MoveAltys',
      publisher: { '@id': ORGANISATION_ID },
      inLanguage: LOCALES.map((code) => LOCALE_META[code].bcp47),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'MoveAltys',
      url: home,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: t.meta.description,
      inLanguage: LOCALE_META[locale].bcp47,
      publisher: { '@id': ORGANISATION_ID },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: t.hero.reassurance,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        ratingCount: String(t.testimonials.items.length),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: LOCALE_META[locale].bcp47,
      mainEntity: t.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ]
}

/** Structured data for a per-audience landing page (independents, TPE, …). */
export function buildSegmentSchema(locale: Locale, site: URL, slug: string, key: 'independents' | 'tpe' | 'localDelivery' | 'internalFleet'): Record<string, unknown>[] {
  const p = CONTENT[locale][key]
  const url = new URL(localizePath(locale, slug), site).href

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url,
      name: p.meta.title,
      description: p.meta.description,
      inLanguage: LOCALE_META[locale].bcp47,
      isPartOf: { '@id': `${site.origin}/#website` },
      publisher: { '@id': ORGANISATION_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: LOCALE_META[locale].bcp47,
      mainEntity: p.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ]
}
