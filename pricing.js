const EURO_AREA_REGIONS = new Set([
  'AT',
  'BE',
  'BG',
  'CY',
  'DE',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PT',
  'SI',
  'SK',
])

const regionFromLocale = (locale) => {
  try {
    return new Intl.Locale(locale).maximize().region
  } catch {
    return undefined
  }
}

export const premiumPriceForLocales = (locales) => {
  const region = locales.map(regionFromLocale).find((candidate) => candidate !== undefined)
  if (region === 'NO') return '89 NOK'
  if (region !== undefined && EURO_AREA_REGIONS.has(region)) return '€8.99'
  return 'US$8.99'
}

if (typeof document !== 'undefined' && typeof navigator !== 'undefined') {
  const price = document.querySelector('[data-premium-price]')
  if (price !== null) price.textContent = premiumPriceForLocales(navigator.languages)
}
