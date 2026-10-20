import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import test from 'node:test'

// The image copies an explicit file list. A page that links a file left off that list
// works on a local file server but returns 404 in production.
const copied = readFileSync('Dockerfile', 'utf8')
  .split('\n')
  .filter((line) => line.startsWith('COPY --chown'))
  .flatMap((line) => line.split(/\s+/).slice(2, -1))
const shipped = (path) =>
  copied.some((source) =>
    source.endsWith('/') ? path.startsWith(source) : path === normalize(source),
  )
const pages = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : pages(path)
    return name.endsWith('.html') ? [path] : []
  })

test('the image ships every local file a page links to', () => {
  for (const page of pages('.')) {
    if (!shipped(page)) continue
    const html = readFileSync(page, 'utf8')
    for (const [, reference] of html.matchAll(/(?:src|href|srcset)="([^"#?]+)/g)) {
      if (/^(?:[a-z]+:|\/\/|mailto:)/.test(reference) || reference.endsWith('/')) continue
      const target = normalize(join(dirname(page), reference.split(' ')[0]))
      if (target.startsWith('downloads/')) continue
      assert.ok(shipped(target), `${page} links ${reference}, but the Dockerfile does not copy it`)
    }
  }
})
