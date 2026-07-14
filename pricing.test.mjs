import assert from 'node:assert/strict'
import test from 'node:test'

import { premiumPriceForLocales } from './pricing.mjs'

test('localizes the configured Stripe prices', () => {
  assert.equal(premiumPriceForLocales(['nb-NO']), '89 NOK')
  assert.equal(premiumPriceForLocales(['de-DE']), '€8.99')
  assert.equal(premiumPriceForLocales(['bg-BG']), '€8.99')
  assert.equal(premiumPriceForLocales(['en-GB']), 'US$8.99')
  assert.equal(premiumPriceForLocales(['nb']), '89 NOK')
})
