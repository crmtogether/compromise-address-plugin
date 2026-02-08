// Regex patterns for postcodes by country
// These will be added to world.model.two.regexText

const postcodePatterns = [
  // USA: 5 digits, optional 4-digit extension
  {
    pattern: /\b\d{5}(?:-\d{4})?\b/i,
    country: 'USA',
    name: 'us-postcode'
  },
  // Canada: Letter-Digit-Letter Space Digit-Letter-Digit
  {
    pattern: /\b[A-Z]\d[A-Z]\s\d[A-Z]\d\b/i,
    country: 'Canada',
    name: 'ca-postcode'
  },
  // UK: Various formats (1-2 letters + 1-2 digits + optional letter + space + 1 digit + 2 letters)
  {
    pattern: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i,
    country: 'UK',
    name: 'uk-postcode'
  },
  // Ireland (Eircode): Routing Key (3 chars) + Unique Identifier (4 chars)
  {
    pattern: /\b(?:[AC-FHKNPRTV-Y]\d{2}|D6W)[\s-]?[0-9AC-FHKNPRTVWXY]{4}\b/i,
    country: 'Ireland',
    name: 'ie-postcode'
  },
  // South Africa: 4 digits
  {
    pattern: /\b\d{4}\b/,
    country: 'South Africa',
    name: 'za-postcode'
  },
  // Germany: 5 digits
  {
    pattern: /\b\d{5}\b/,
    country: 'Germany',
    name: 'de-postcode'
  },
  // France: 5 digits
  {
    pattern: /\b\d{5}\b/,
    country: 'France',
    name: 'fr-postcode'
  },
  // Australia: 4 digits
  {
    pattern: /\b\d{4}\b/,
    country: 'Australia',
    name: 'au-postcode'
  }
]

export default postcodePatterns
