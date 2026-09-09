// Run: node scripts/verify-beta.mjs [path-to-sift]
// The installation is exercised in an isolated browser, using the downloaded ZIP bytes.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
const sift = path.resolve(process.argv[2] || '../sift')
const { chromium } = createRequire(path.join(sift, 'package.json'))('playwright')
const output = await mkdtemp(path.join(tmpdir(), 'sift-beta-verify-'))
const server = createServer(async (req, res) => {
  try {
    const route = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    let file = path.resolve(root, '.' + route)
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.zip': 'application/zip' }
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }
    if (file.endsWith('.zip')) headers['Content-Disposition'] = 'attachment; filename="sift-beta.zip"'
    res.writeHead(200, headers).end(await readFile(file))
  } catch { res.writeHead(404).end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = process.env.SIFT_SITE_URL || `http://127.0.0.1:${server.address().port}`
const executablePath = process.env.SIFT_BROWSER || chromium.executablePath()
const browser = await chromium.launch({ executablePath, headless: true, args: ["--disable-gpu"] })
try {
  const errors = []
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  const downloads = []
  page.on('download', file => downloads.push(file))
  await page.goto(base)
  const first = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Become an early tester' }).first().click()
  const download = await first
  assert.match(page.url(), /\/beta\/$/)
  assert.equal(download.suggestedFilename(), 'sift-beta.zip')
  const archive = path.join(output, 'sift-beta.zip')
  await download.saveAs(archive)
  assert.equal(await download.failure(), null)
  const hash = bytes => createHash('sha256').update(bytes).digest('hex')
  assert.equal(hash(await readFile(archive)), hash(await readFile(path.join(root, 'assets/downloads/sift-0.7.2-beta.zip'))))
  await page.getByRole('button', { name: 'Copy Chrome extensions address' }).click()
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'chrome://extensions/')
  assert.match(await page.locator('#copy-status').textContent(), /Copied/)
  await page.reload()
  assert.equal(downloads.length, 1, 'Reload should not start another download')
  const retry = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download ZIP', exact: true }).click()
  await retry
  assert.equal(downloads.length, 2)
  await page.locator('#platform').selectOption('windows')
  assert.match(await page.locator('#unzip-instruction').textContent(), /Extract All/)
  await page.locator('#platform').selectOption('mac')
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.screenshot({ path: path.join(output, 'narrow.png'), fullPage: true })

  const denied = await browser.newContext()
  await denied.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('Not allowed', 'NotAllowedError')) } }) })
  const fallback = await denied.newPage()
  await fallback.goto(base + '/beta/')
  await fallback.getByRole('button', { name: 'Copy Chrome extensions address' }).click()
  assert.match(await fallback.locator('#copy-status').textContent(), /selected address/)
  assert(await fallback.locator('#extensions-address').evaluate(input => input.selectionEnd - input.selectionStart === input.value.length))
  await denied.close()

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' })
  const phone = await mobile.newPage()
  let phoneDownloads = 0
  phone.on('download', () => phoneDownloads++)
  await phone.goto(base + '/beta/')
  assert(await phone.locator('#device-notice').isVisible())
  assert.equal(phoneDownloads, 0)
  assert(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await phone.screenshot({ path: path.join(output, 'phone.png'), fullPage: true })
  await mobile.close()

  const noScript = await browser.newContext({ javaScriptEnabled: false })
  const plain = await noScript.newPage()
  await plain.goto(base + '/beta/')
  const manual = plain.waitForEvent('download')
  await plain.getByRole('link', { name: 'Download ZIP', exact: true }).click()
  assert.equal((await manual).suggestedFilename(), 'sift-beta.zip')
  await noScript.close()
  assert.deepEqual(errors, [])

  const unpacked = path.join(output, 'sift-beta')
  execFileSync('unzip', ['-q', archive, '-d', unpacked])
  const manifest = JSON.parse(await readFile(path.join(unpacked, 'manifest.json'), 'utf8'))
  assert.equal(manifest.version, '0.7.2')
  assert(!manifest.permissions.includes('nativeMessaging'))
  assert.deepEqual(manifest.host_permissions, ['https://www.youtube.com/*', 'https://api.sifttheweb.com/*'])
  const installed = await chromium.launchPersistentContext('', { executablePath, headless: true, args: ["--disable-gpu", `--load-extension=${unpacked}`, `--disable-extensions-except=${unpacked}`] })
  try {
    await installed.route('https://api.sifttheweb.com/**', route => route.abort())
    const worker = installed.serviceWorkers()[0] || await installed.waitForEvent('serviceworker')
    assert.equal(new URL(worker.url()).host, 'diogcncoiojjahmbinhamjfkcjnfpdcc')
    const fixture = await readFile(path.join(sift, 'tests/fixtures/high-signal-ai.html'), 'utf8')
    await installed.route('https://www.youtube.com/**', route => route.fulfill({ contentType: 'text/html', body: fixture }))
    const youtube = await installed.newPage()
    await youtube.goto('https://www.youtube.com/')
    await youtube.locator('night-guard-root .ng-result-title').first().waitFor()
    await youtube.screenshot({ path: path.join(output, 'installed.png') })
    const manager = await installed.newPage()
    await manager.goto('chrome://extensions/')
    await manager.locator('extensions-item').first().waitFor()
    await manager.screenshot({ path: path.join(output, 'extensions.png') })
  } finally { await installed.close() }
  await writeFile(path.join(output, 'result.json'), JSON.stringify({ base, archive, unpacked, sha256: hash(await readFile(archive)), errors }, null, 2))
  console.log(JSON.stringify({ status: 'passed', output, unpacked }, null, 2))
} finally { await browser.close(); server.close() }
