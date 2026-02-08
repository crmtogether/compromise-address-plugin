import postcodePatterns from '../model/regex.js'
import detectCountry from '../detect/country.js'

// Find postcodes in a document
const findPostcodes = function (view) {
  // First, try to find terms tagged as 'Postcode' by our regex patterns
  const tagged = view.match('#Postcode')
  
  if (tagged.found) {
    return tagged
  }
  
  // Detect country from context first
  const text = view.text()
  const detectedCountry = detectCountry(text)
  
  // Filter patterns to only the detected country, or all if no country detected
  const patternsToUse = detectedCountry
    ? postcodePatterns.filter(p => p.country === detectedCountry)
    : postcodePatterns
  
  // Fallback: manually search for postcodes using regex
  const foundPostcodes = []
  
  // Try patterns for detected country (or all if not detected)
  for (const { pattern, country } of patternsToUse) {
    // Create a new regex instance with global flag for exec loop
    const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
    const regex = new RegExp(pattern.source, flags)
    
    let match
    let execCount = 0
    const maxExecutions = 100 // Safety limit to prevent infinite loops
    
    while ((match = regex.exec(text)) !== null && execCount < maxExecutions) {
      execCount++
      const postcode = match[0].trim()
      
      // Use detected country if available, otherwise use pattern country
      const postcodeCountry = detectedCountry || country
      
      // Avoid duplicates
      const key = `${postcode}-${match.index}`
      if (!foundPostcodes.find(p => p.key === key)) {
        foundPostcodes.push({
          postcode: postcode,
          country: postcodeCountry,
          index: match.index,
          key: key
        })
      }
      
      // Prevent infinite loop - if regex doesn't advance, break
      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }
    }
  }
  
  // Remove duplicates and sort by position
  const uniquePostcodes = []
  const seen = new Set()
  
  for (const pc of foundPostcodes) {
    if (!seen.has(pc.key)) {
      seen.add(pc.key)
      uniquePostcodes.push(pc)
    }
  }
  
  // Sort by position in text
  uniquePostcodes.sort((a, b) => a.index - b.index)
  
  // Return combined matches
  if (uniquePostcodes.length === 0) {
    return view.none()
  }
  
  // Match postcodes in the document
  const postcodeTexts = uniquePostcodes.map(p => p.postcode)
  
  // For postcodes with spaces (like Canada), use a different matching strategy
  let result = view.none()
  
  for (const pc of uniquePostcodes) {
    const postcodeText = pc.postcode
    
    try {
      // Try lookup first (works for exact matches)
      const lookupResult = view.lookup([postcodeText])
      if (lookupResult.found) {
        result = result.union(lookupResult)
        continue
      }
      
      // For postcodes with spaces, try matching parts separately
      if (postcodeText.includes(' ')) {
        const parts = postcodeText.split(/\s+/)
        // Try to find both parts near each other
        const part1Match = view.match(parts[0])
        const part2Match = view.match(parts[1])
        
        if (part1Match.found && part2Match.found) {
          // Check if they're adjacent or close
          const combined = part1Match.growRight(parts[1])
          if (combined.found) {
            result = result.union(combined)
            continue
          }
        }
      } else {
        // For postcodes without spaces, use regular match
        const match = view.match(postcodeText)
        if (match.found) {
          result = result.union(match)
        }
      }
    } catch (e) {
      // Skip this postcode if match fails
      continue
    }
  }
  
  return result
}

export default findPostcodes
