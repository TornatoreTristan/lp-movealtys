export const LOCALES = ['fr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

/** Human-readable + BCP-47 metadata used for <html lang>, hreflang and OG tags. */
export const LOCALE_META: Record<Locale, { label: string; bcp47: string; ogLocale: string }> = {
  fr: { label: 'Français', bcp47: 'fr-FR', ogLocale: 'fr_FR' },
  en: { label: 'English', bcp47: 'en-US', ogLocale: 'en_US' },
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** Reads the locale out of a pathname such as `/en/pricing/`. Falls back to the default. */
export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/')
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE
}

/** Builds a locale-prefixed path: localizePath('en', 'pricing') -> '/en/pricing/' */
export function localizePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${locale}/${clean}/` : `/${locale}/`
}
