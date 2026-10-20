import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://sifttheweb.com',
  integrations: [react()],
  // Keep the published URLs: privacy.astro becomes /privacy.html and beta/index.astro becomes /beta/index.html.
  build: { format: 'preserve' },
  // Keep the page text and whitespace exactly as written.
  compressHTML: false,
})
