// Run with: bun scripts/capture-feed.mjs /path/to/sift
// Curated demonstration content, not a live account or claimed creator endorsements.
import { createRequire } from 'node:module'
import path from 'node:path'
const sift=path.resolve(process.argv[2] || '../sift')
const {chromium}=createRequire(path.join(sift,'package.json'))('playwright')
const videos=[
 ['The surprising mathematics of everyday life','3Blue1Brown','2.1M views · 2 weeks ago'],
 ['Why some cities are a joy to walk through','Not Just Bikes','840K views · 1 month ago'],
 ['What makes a great film feel effortless','Every Frame a Painting','1.6M views · 3 weeks ago'],
 ['How bridges carry more than their own weight','Practical Engineering','920K views · 5 days ago'],
 ['The science of making better coffee','James Hoffmann','1.2M views · 1 week ago'],
 ['The hidden patterns behind how we think','Veritasium','3.4M views · 2 weeks ago'],
 ['Inside the buildings changing our cities','The B1M','680K views · 4 days ago'],
 ['A closer look at how bicycles stay upright','SmarterEveryDay','2.8M views · 1 month ago'],
]
const fixture=`<!doctype html><html><head><meta charset="utf-8"><title>YouTube</title></head><body><ytd-app><ytd-rich-grid-renderer><div id="contents">${videos.map(([title,channel,meta],i)=>`<ytd-rich-grid-media><a id="video-title-link" href="/watch?v=demo000000${i}">${title}</a><ytd-channel-name>${channel}</ytd-channel-name><div id="metadata-line">${meta}</div></ytd-rich-grid-media>`).join('')}</div></ytd-rich-grid-renderer></ytd-app></body></html>`
const extension=path.join(sift,'dist-store')
const context=await chromium.launchPersistentContext('',{headless:true,channel:'chromium',executablePath:process.env.SIFT_BROWSER||'/Applications/Helium.app/Contents/MacOS/Helium',colorScheme:'light',viewport:{width:1280,height:800},deviceScaleFactor:2,args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`,'--no-first-run']})
try {
 await context.route('https://www.youtube.com/**',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:fixture}):route.abort())
 await context.route('https://api.sifttheweb.com/**',route=>route.abort())
 const page=context.pages()[0]||await context.newPage();await page.goto('https://www.youtube.com/')
 const rows=page.locator('night-guard-root .ng-result-title');await rows.nth(7).waitFor()
 if(await rows.count()!==8)throw Error('Expected eight feed rows')
 await page.evaluate(()=>document.fonts.ready)
 const out=path.resolve(import.meta.dirname,'../assets')
 await page.screenshot({path:path.join(out,'site-feed-desktop.png')})
 await page.setViewportSize({width:390,height:760});await page.screenshot({path:path.join(out,'site-feed-mobile.png')})
 console.log('Captured real Sift interface: 8 curated demonstration videos, desktop and mobile at 2x.')
} finally {await context.close()}
