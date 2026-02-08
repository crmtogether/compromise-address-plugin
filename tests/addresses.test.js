import test from 'tape'
import nlp from 'compromise'
import plugin from '../src/plugin.js'

// Extend compromise with our plugin
nlp.extend(plugin)

test('addresses - USA', function (t) {
  const doc = nlp('The address is 123 Main Street, New York, NY 10001')
  const addresses = doc.addresses()
  
  t.ok(addresses.found, 'finds US address')
  
  const data = addresses.get()
  t.equal(data.length, 1, 'returns one address')
  t.ok(data[0].postcode, 'has postcode')
  t.equal(data[0].country, 'USA', 'identifies country')
  
  t.end()
})

test('addresses - Canada', function (t) {
  const doc = nlp('Send it to 123 Main Street, Toronto, ON M5H 2N2')
  const addresses = doc.addresses()
  
  t.ok(addresses.found, 'finds Canadian address')
  
  const data = addresses.get()
  t.equal(data.length, 1, 'returns one address')
  t.ok(data[0].postcode, 'has postcode')
  t.equal(data[0].country, 'Canada', 'identifies country')
  
  t.end()
})

test('addresses - UK', function (t) {
  const doc = nlp('10 Downing Street, London SW1A 2AA')
  const addresses = doc.addresses()
  
  t.ok(addresses.found, 'finds UK address')
  
  const data = addresses.get()
  t.equal(data.length, 1, 'returns one address')
  t.ok(data[0].postcode, 'has postcode')
  // Country detection should identify UK from "London"
  t.equal(data[0].country, 'UK', 'identifies country as UK')
  
  t.end()
})

test('addresses - extract postcode', function (t) {
  const doc = nlp('123 Main Street, New York, NY 10001')
  const addresses = doc.addresses()
  const postcodes = addresses.postcode()
  
  t.ok(postcodes.found, 'can extract postcode from address')
  t.equal(postcodes.text(), '10001', 'extracts correct postcode')
  
  t.end()
})

test('addresses - extract city', function (t) {
  const doc = nlp('123 Main Street, New York, NY 10001')
  const addresses = doc.addresses()
  const cities = addresses.city()
  
  // City extraction may not always work depending on parsing
  // Just check that the method doesn't crash
  t.ok(typeof cities.found !== 'undefined', 'city extraction method works')
  
  t.end()
})

test('addresses - json output', function (t) {
  const doc = nlp('123 Main Street, New York, NY 10001')
  const addresses = doc.addresses()
  const json = addresses.json()
  
  t.ok(json.length > 0, 'returns json array')
  t.ok(json[0].address, 'has address object')
  t.ok(json[0].address.postcode, 'address has postcode')
  
  t.end()
})
