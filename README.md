# MoveAltys — Landing page

Site vitrine de [movealtys.com](https://movealtys.com), le SaaS d'optimisation de tournées
et de calcul du coût de revient transport.

**Stack** : Astro 7 (statique) · Tailwind CSS v4 · TypeScript strict · i18n FR/EN.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:4321 → redirige vers /fr/
```

| Script            | Rôle                                                         |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Serveur de développement                                      |
| `npm run build`   | Build statique dans `dist/`                                   |
| `npm run preview` | Sert le build de production                                   |
| `npm run check`   | Vérification des types Astro/TypeScript                       |
| `npm run og`      | Régénère les images Open Graph (`public/img/og-*.png`)        |

## Structure

```
src/
├─ i18n/
│  ├─ config.ts      # locales, helpers d'URL (localizePath, getLocaleFromUrl)
│  └─ content.ts     # ⭐ TOUT le texte du site, FR + EN, typé
├─ layouts/
│  └─ BaseLayout.astro  # <head>, SEO, hreflang, Open Graph, JSON-LD
├─ components/
│  ├─ Header / Footer / LanguageSwitcher
│  ├─ ui/            # Button, Section, SectionHeading, RouteVisual
│  └─ sections/      # Hero, Stats, Problem, Features, HowItWorks,
│                    # Testimonials, Pricing, Faq, FinalCta
├─ lib/
│  ├─ schema.ts        # JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage)
│  └─ static-pages.ts  # gabarits des pages légales
├─ pages/
│  ├─ [lang]/index.astro   # la landing page
│  ├─ [lang]/[page].astro  # about / legal / privacy / terms (gabarits, noindex)
│  └─ 404.astro
├─ scripts/reveal.ts   # apparition au scroll (IntersectionObserver)
└─ styles/global.css   # tokens de design Tailwind v4 (@theme)
```

### Modifier le contenu

Tout le texte visible vit dans **`src/i18n/content.ts`**. Les deux dictionnaires
`fr` et `en` partagent le même type : ajouter une clé côté FR force sa traduction
côté EN, sinon `npm run check` échoue.

### Charte graphique

Les couleurs de marque sont déclarées en tokens Tailwind v4 dans
`src/styles/global.css` (`@theme`) :

| Token          | Valeur    | Usage                     |
| -------------- | --------- | ------------------------- |
| `brand-500`    | `#327eff` | Bleu MoveAltys, CTA       |
| `ink-950`      | `#0c0045` | Titres, fonds sombres     |
| `muted`        | `#4e4e55` | Texte courant             |
| `ink-50`       | `#f6f5f8` | Fonds de section          |

## Internationalisation

- Routing préfixé : `/fr/…` et `/en/…`, `/` redirige vers `/fr/`.
- `hreflang` + `x-default` générés automatiquement dans `BaseLayout`.
- Le sitemap est annoté par locale et exclut les pages `noindex`.

Ajouter une langue = ajouter le code dans `LOCALES` (`src/i18n/config.ts`),
son entrée dans `LOCALE_META`, puis le dictionnaire correspondant dans
`content.ts`. Les routes, hreflang et sitemap suivent.

## Reste à faire

- [ ] Rédiger les pages `about`, `legal`, `privacy`, `terms` (gabarits `noindex` dans `src/lib/static-pages.ts`)
- [ ] Confirmer la grille tarifaire (les montants sont actuellement « sur devis »)
- [ ] Brancher le formulaire du hero sur l'API d'essai gratuit (il pointe pour l'instant vers `app.movealtys.com/register`)
- [ ] Ajouter la bannière de consentement avant tout script de mesure d'audience
- [ ] Remplacer les visuels produit par de vraies captures de l'application

## Déploiement

Build statique : la sortie `dist/` se déploie telle quelle sur Vercel, Netlify,
Cloudflare Pages ou un hébergement classique. Commande de build `npm run build`,
dossier de sortie `dist`.
