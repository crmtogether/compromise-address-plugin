import postcodePatterns from '../model/regex.js'
import detectCountry from '../detect/country.js'

// Parse a postcode to extract metadata
const parsePostcode = function (text, country = null, contextText = null) {
  const postcode = text.trim()
  
  // Try to detect country from context if not provided
  if (!country && contextText) {
    country = detectCountry(contextText)
  }
  
  // If country is specified, use that pattern
  if (country) {
    const patternData = postcodePatterns.find(p => p.country === country)
    if (patternData) {
      const regex = new RegExp(patternData.pattern.source, patternData.pattern.flags)
      const match = regex.exec(postcode)
      if (match && match[0] === postcode) {
        return {
          postcode: postcode,
          country: country,
          normalized: normalizePostcode(postcode, country),
          raw: postcode
        }
      }
    }
  }
  
  // Otherwise, try to detect country from format (but prefer detected country)
  for (const { pattern, country: patternCountry } of postcodePatterns) {
    // Skip if we detected a country and this isn't it
    if (country && patternCountry !== country) {
      continue
    }
    
    const regex = new RegExp(pattern.source, pattern.flags)
    const match = regex.exec(postcode)
    if (match && match[0] === postcode) {
      return {
        postcode: postcode,
        country: patternCountry,
        normalized: normalizePostcode(postcode, patternCountry),
        raw: postcode
      }
    }
  }
  
  // If no match found, return basic info
  return {
    postcode: postcode,
    country: country || null,
    normalized: postcode,
    raw: postcode
  }
}

// Normalize postcode format
const normalizePostcode = function (postcode, country) {
  const pc = postcode.trim().toUpperCase()
  
  switch (country) {
    case 'Canada':
      // Format: A1A 1A1 (ensure space)
      return pc.replace(/^([A-Z]\d[A-Z])\s*(\d[A-Z]\d)$/, '$1 $2')
    
    case 'UK':
      // Format: SW1A 1AA (ensure space before last 3 chars)
      return pc.replace(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/, '$1 $2')
    
    case 'Ireland':
      // Format: D02 AF30 (ensure space or hyphen)
      return pc.replace(/^([AC-FHKNPRTV-Y]\d{2}|D6W)[\s-]?([0-9AC-FHKNPRTVWXY]{4})$/, '$1 $2')
    
    case 'USA':
      // Format: 12345 or 12345-6789
      return pc
    
    case 'South Africa':
    case 'Germany':
    case 'France':
    case 'Australia':
      // Numeric formats - just return as-is
      return pc
    
    default:
      return pc
  }
}

export default parsePostcode
