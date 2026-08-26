/**
 * Rasterises the Open Graph cards to PNG (1200x630) — social platforms do not accept SVG.
 * Run with `npm run og` after changing the tagline or the brand colours.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const OUT_DIR = new URL('../public/img/', import.meta.url)

const CARDS = {
  fr: {
    title: 'Rentable ou pas ?',
    highlight: 'Sachez-le avant de partir.',
    kicker: 'COÛT DE REVIENT &amp; MARGE PAR TOURNÉE',
    footnote: 'Coût réel · Péages inclus · Marge avant le départ',
  },
  en: {
    title: 'Profitable or not?',
    highlight: 'Know before you go.',
    kicker: 'ROUTE COST &amp; MARGIN SOFTWARE',
    footnote: 'True cost price · Tolls included · Margin before departure',
  },
}

const FONT = "'Avenir Next','Helvetica Neue',Helvetica,Arial,sans-serif"

const card = ({ title, highlight, kicker, footnote }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0045"/>
      <stop offset="100%" stop-color="#19398f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5e93ff"/>
      <stop offset="100%" stop-color="#91b6ff"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="90" r="300" fill="#327eff" opacity="0.20"/>
  <circle cx="120" cy="600" r="240" fill="#327eff" opacity="0.12"/>

  <g transform="translate(80,90)">
    <rect width="14" height="14" rx="4" fill="#327eff"/>
    <text x="30" y="12" font-family="${FONT}" font-size="19" font-weight="700" letter-spacing="3" fill="#91b6ff">${kicker}</text>
  </g>

  <text x="80" y="270" font-family="${FONT}" font-size="76" font-weight="800" fill="#ffffff">${title}</text>
  <text x="80" y="360" font-family="${FONT}" font-size="76" font-weight="800" fill="url(#accent)">${highlight}</text>

  <path d="M80 470 L200 420 L320 452 L440 392 L560 414" fill="none" stroke="#327eff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="80" cy="470" r="11" fill="#ffffff"/>
  <circle cx="320" cy="452" r="9" fill="#5e93ff"/>
  <circle cx="560" cy="414" r="11" fill="#ffffff"/>

  <text x="80" y="552" font-family="${FONT}" font-size="26" font-weight="600" fill="#b3accd">${footnote}</text>

  <text x="1120" y="552" text-anchor="end" font-family="${FONT}" font-size="30" font-weight="800" letter-spacing="1" fill="#ffffff">movealtys.com</text>
</svg>`

await mkdir(OUT_DIR, { recursive: true })

for (const [locale, copy] of Object.entries(CARDS)) {
  const svg = card(copy)
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(new URL(`og-${locale}.png`, OUT_DIR), png)
  await writeFile(new URL(`og-${locale}.svg`, OUT_DIR), svg.trim())
  console.log(`generated og-${locale}.png (${(png.length / 1024).toFixed(0)} kB)`)
}
