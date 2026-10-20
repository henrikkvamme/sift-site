import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, posix, relative, resolve } from 'node:path'
import test from 'node:test'

// The image serves `dist/` as it is. A page that links a file missing from `dist/` returns 404 in
// production. Run `bun run build` before this test.
const dist = resolve(import.meta.dirname, '..', 'dist')

const pages = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return pages(path)
    return name.endsWith('.html') ? [path] : []
  })

/** Every URL in a `src`, `href`, or `srcset` attribute. `srcset` holds a list with descriptors. */
const references = (html) =>
  [...html.matchAll(/\s(src|href|srcset)="([^"]*)"/g)].flatMap(([, attribute, value]) =>
    attribute === 'srcset' ? value.split(',').map((entry) => entry.trim().split(/\s+/)[0] ?? '') : [value],
  )

/** The site path a reference points to, or undefined for a link that leaves the site. */
const sitePath = (page, reference) => {
  if (reference === '' || reference.startsWith('#')) return undefined
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(reference)) return undefined
  const path = reference.split(/[?#]/)[0] ?? ''
  const directory = posix.dirname(`/${relative(dist, page).split('\\').join('/')}`)
  return posix.resolve(directory, path) + (path.endsWith('/') || path === '' ? '/' : '')
}

const served = (path) => {
  const file = join(dist, path)
  if (path.endsWith('/')) return existsSync(join(file, 'index.html'))
  return existsSync(file) && statSync(file).isFile()
}

test('dist has every published page', () => {
  for (const path of ['/', '/pricing.html', '/privacy.html', '/terms.html', '/beta/', '/beta/mac/', '/update/']) {
    assert.ok(served(path), `${path} is missing from dist/`)
  }
})

test('every local file a page links to is in dist', () => {
  const list = pages(dist)
  assert.ok(list.length > 0, 'dist/ has no pages. Run `bun run build` first.')
  let checked = 0
  for (const page of list) {
    const html = readFileSync(page, 'utf8')
    for (const reference of references(html)) {
      const path = sitePath(page, reference)
      // nginx proxies /downloads/ to the Sift API.
      if (path === undefined || path.startsWith('/downloads/')) continue
      checked += 1
      assert.ok(served(path), `${relative(dist, page)} links ${reference}, but dist/ has no ${path}`)
    }
  }
  assert.ok(checked > 50, `expected many local links, found ${checked}`)
})
