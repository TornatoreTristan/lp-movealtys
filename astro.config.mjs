// @ts-check
import { defineConfig, envField } from 'astro/config'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { PAGE_SLUGS } from './src/lib/static-pages'
import { INDEXABLE } from './src/lib/seo'

export const SITE_URL = 'https://lp.movealtys.com'

export default defineConfig({
  site: SITE_URL,
  // Every page stays prerendered; the adapter only serves the one on-demand
  // route, `/api/signup-intent`, and the static build next to it.
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      // Where each hero-form submission is announced (n8n, Make, Zapier…).
      // Unset: the endpoint accepts the request and drops it.
      SIGNUP_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true, url: true }),
      // Sent as `X-Webhook-Secret` so the receiver can reject forged calls.
      SIGNUP_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
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
