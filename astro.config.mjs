// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { PAGE_SLUGS } from './src/lib/static-pages'
import { INDEXABLE } from './src/lib/seo'

export const SITE_URL = 'https://lp.movealtys.com'

export default defineConfig({
  site: SITE_URL,
  // Port dédié : 4321 (défaut Astro) est partagé avec tous les autres projets
  // Astro de la machine, et le navigateur y garde en cache leurs redirections.
  server: { port: 4330 },
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      // Laissé à false : sinon l'i18n intercepte `/` avec un 301, que les
      // navigateurs mettent en cache définitivement par origine. C'est
      // `src/pages/index.astro` qui prend le relais, sans réponse 3xx.
      redirectToDefaultLocale: false,
    },
  },
  // A sitemap for a deliberately unindexed property is a contradictory signal, so
  // it ships only when `INDEXABLE` says the landing is meant to rank.
  integrations: INDEXABLE
    ? [
        sitemap({
          // Keep out everything that ships `noindex`: the footer stubs and the
          // bare `/` splash page that just forwards to the default locale.
          filter: (page) =>
            new URL(page).pathname !== '/' && !PAGE_SLUGS.some((slug) => page.endsWith(`/${slug}/`)),
          i18n: {
            defaultLocale: 'fr',
            locales: { fr: 'fr-FR', en: 'en-US' },
          },
        }),
      ]
    : [],
  vite: {
    plugins: [tailwindcss()],
  },
})
