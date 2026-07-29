/**
 * Génère les icônes PWA depuis `public/favicon.svg`.
 *
 * Playwright est déjà présent pour les tests de fumée : on s'en sert comme
 * moteur de rendu plutôt que d'ajouter une dépendance de traitement d'image.
 *
 * Usage : pnpm icons
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')

const targets = [
  { file: 'pwa-192.png', size: 192, padding: 0 },
  { file: 'pwa-512.png', size: 512, padding: 0 },
  // L'icône maskable doit tenir dans la « safe zone » circulaire d'Android :
  // 20 % de marge de chaque côté, sinon les bords sont rognés.
  { file: 'pwa-maskable-512.png', size: 512, padding: 0.2 },
  { file: 'apple-touch-icon.png', size: 180, padding: 0.1 },
]

const browser = await chromium.launch()

for (const { file, size, padding } of targets) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  })

  const inset = Math.round(size * padding)
  await page.setContent(`
    <style>
      html, body { margin: 0; padding: 0; width: ${size}px; height: ${size}px; }
      body { background: #0f172a; display: grid; place-items: center; }
      svg { width: ${size - inset * 2}px; height: ${size - inset * 2}px; }
    </style>
    ${svg}
  `)

  const buffer = await page.screenshot({ omitBackground: false })
  writeFileSync(new URL(`../public/${file}`, import.meta.url), buffer)
  console.log(`public/${file} — ${size}×${size}${padding ? ` (marge ${padding * 100} %)` : ''}`)
  await page.close()
}

await browser.close()
