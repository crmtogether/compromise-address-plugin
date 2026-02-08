import findPostcodes from './postcodes.js'

// Find addresses in a document
// Strategy: Find postcodes first, then extract context around them
const findAddresses = function (view) {
  // First, find all postcodes
  const postcodes = findPostcodes(view)
  
  if (!postcodes.found) {
    return view.none()
  }
  
  const results = []
  
  // For each postcode, try to extract the full address
  postcodes.forEach(postcodeMatch => {
    // Get the sentence containing this postcode
    const sentence = postcodeMatch.fullSentences()
    
    // Try to match address patterns around the postcode
    // Look for: [Number] [Street] [StreetType], [City], [State] [Postcode]
    // or variations
    
    // Start with the sentence containing the postcode
    // Then try to expand to get more context (previous sentence if needed)
    let addressMatch = sentence
    
    // Try to match common address patterns
    // Pattern 1: Number + Street + Type + City + State + Postcode
    const pattern1 = addressMatch.match('#Value+ #Noun+ #StreetType+ #ProperNoun+ #ProperNoun+')
    if (pattern1.found) {
      results.push({
        match: pattern1,
        postcode: postcodeMatch.text()
      })
      return
    }
    
    // Pattern 2: Number + Street + Type, City, State Postcode
    const pattern2 = addressMatch.match('#Value+ #Noun+ #StreetType+ #ProperNoun+')
    if (pattern2.found) {
      // Include postcode
      results.push({
        match: pattern2.union(postcodeMatch),
        postcode: postcodeMatch.text()
      })
      return
    }
    
    // Pattern 3: Just use the sentence with postcode
    results.push({
      match: sentence,
      postcode: postcodeMatch.text()
    })
  })
  
  // Combine all address matches
  if (results.length === 0) {
    return view.none()
  }
  
  let combined = view.none()
  for (const result of results) {
    combined = combined.union(result.match)
  }
  
  return combined
}

export default findAddresses
