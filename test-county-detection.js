import nlp from 'compromise'
import plugin from './src/plugin.js'
import detectCountry from './src/detect/country.js'

console.log('Extending compromise...')
nlp.extend(plugin)
console.log('Extended!\n')

// Test that counties help determine country
const testCases = [
  { text: 'Kildare', expected: 'Ireland' },
  { text: 'Sligo', expected: 'Ireland' },
  { text: 'County Wexford', expected: 'Ireland' },
  { text: 'Meath', expected: 'Ireland' },
  { text: '123 Main Street, Kildare', expected: 'Ireland' },
  { text: 'Sligo town', expected: 'Ireland' },
  { text: 'Wexford County', expected: 'Ireland' }
]

console.log('Testing county-based country detection:\n')
testCases.forEach((testCase, i) => {
  const doc = nlp(testCase.text)
  const addresses = doc.addresses()
  
  // Also test postcode detection if there's a postcode
  const postcodes = doc.postcodes()
  
  let detectedCountry = null
  if (postcodes.found) {
    const data = postcodes.get()
    detectedCountry = data[0]?.country
  } else if (addresses.found) {
    const data = addresses.get()
    detectedCountry = data[0]?.country
  }
  
  // Also test direct country detection
  const directDetection = detectCountry(testCase.text)
  
  const match = (detectedCountry === testCase.expected || directDetection === testCase.expected) ? '✓' : '✗'
  console.log(`${match} "${testCase.text}"`)
  console.log(`   From parsing: ${detectedCountry || 'none'}`)
  console.log(`   Direct detection: ${directDetection || 'none'}`)
  console.log(`   Expected: ${testCase.expected}`)
  console.log()
})
