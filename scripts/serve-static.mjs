/**
 * Sert `.output/public` comme le ferait GitHub Pages.
 *
 * `pnpm preview` passe par Nitro, qui résout des chemins qu'un hébergeur
 * statique renvoie en 404 (`/200` pour `200.html`, par exemple). Ça masque des
 * bugs de déploiement : c'est précisément comme ça qu'un précache de service
 * worker cassé a pu passer inaperçu. Ce serveur-ci ne fait que du fichier brut,
 * avec le repli 404.html de GitHub Pages.
 *
 * Usage :
 *   pnpm serve:pages                        # racine, port 3200
 *   pnpm serve:pages /pokemon-companion     # sous-chemin, comme un dépôt de projet
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[3] ?? '.output/public')
const base = (process.argv[2] ?? '').replace(/\/$/, '')
const port = Number(process.env.PORT ?? 3200)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost')

  if (base && !pathname.startsWith(base)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('hors du chemin de base')
    return
  }

  let relative = pathname.slice(base.length) || '/'
  if (relative.endsWith('/')) relative += 'index.html'

  // `normalize` sur un chemin déjà préfixé par `/` empêche la remontée hors root.
  let file = join(root, normalize(relative))

  try {
    const stats = await stat(file)
    if (stats.isDirectory()) file = join(file, 'index.html')
    await stat(file)
  }
  catch {
    // Repli GitHub Pages : 404.html, qui contient le shell du SPA.
    file = join(root, '404.html')
    response.statusCode = 404
  }

  try {
    const body = await readFile(file)
    response.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
    response.end(body)
  }
  catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' }).end('introuvable')
  }
}).listen(port, () => {
  console.log(`Sortie statique servie sur http://localhost:${port}${base || ''}/`)
  console.log(`  racine : ${root}`)
})
