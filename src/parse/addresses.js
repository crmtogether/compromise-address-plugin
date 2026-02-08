import parsePostcode from './postcodes.js'
import findPostcodes from '../find/postcodes.js'
import detectCountry from '../detect/country.js'

// Parse an address to extract components
const parseAddress = function (view) {
  const text = view.text()
  
  // Detect country from context first
  const detectedCountry = detectCountry(text)
  
  // Find postcode in this address
  const postcodeMatch = findPostcodes(view)
  let postcode = null
  let postcodeCountry = null
  
  if (postcodeMatch.found) {
    const postcodeText = postcodeMatch.firstTerms().text()
    const parsed = parsePostcode(postcodeText, detectedCountry, text)
    postcode = parsed.postcode
    postcodeCountry = parsed.country || detectedCountry
  }
  
  // Extract components using compromise matching
  const components = {
    streetNumber: null,
    streetName: null,
    streetType: null,
    unit: null,
    city: null,
    state: null,
    postcode: postcode,
    country: postcodeCountry || detectedCountry,
    raw: text
  }
  
  // Try to find street number (numeric value at start)
  const numbers = view.match('#Value+').firstTerms()
  if (numbers.found) {
    components.streetNumber = numbers.text()
  }
  
  // Try to find street type
  const streetTypes = view.match('#StreetType+')
  if (streetTypes.found) {
    components.streetType = streetTypes.firstTerms().text()
    
    // Street name is before street type
    const beforeStreetType = view.before(streetTypes.firstTerms())
    const streetNameMatch = beforeStreetType.match('#Noun+').lastTerms()
    if (streetNameMatch.found) {
      components.streetName = streetNameMatch.text()
    }
  } else {
    // Try to find street name without explicit type
    const streetMatch = view.match('#Value+ #Noun+').lastTerms()
    if (streetMatch.found) {
      components.streetName = streetMatch.text()
    }
  }
  
  // Try to find unit (apartment, suite, etc.)
  const units = view.match('#UnitType+ #Value+')
  if (units.found) {
    components.unit = units.text()
  }
  
  // Try to find city (proper noun, often before postcode or state)
  if (postcodeMatch.found) {
    const beforePostcode = view.before(postcodeMatch.firstTerms())
    const cities = beforePostcode.match('#ProperNoun+').lastTerms()
    if (cities.found) {
      components.city = cities.text()
    }
  } else {
    // Try to find city as proper noun
    const cities = view.match('#ProperNoun+').lastTerms()
    if (cities.found) {
      components.city = cities.text()
    }
  }
  
  // Try to find state/province (often abbreviated or proper noun)
  // This is tricky - might be before postcode or after city
  if (postcodeMatch.found) {
    const beforePostcode = view.before(postcodeMatch.firstTerms())
    const states = beforePostcode.match('#ProperNoun+').lastTerms()
    if (states.found && states.text() !== components.city) {
      components.state = states.text()
    }
  }
  
  return components
}

export default parseAddress
