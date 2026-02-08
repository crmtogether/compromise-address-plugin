import findAddresses from '../find/addresses.js'
import parseAddress from '../parse/addresses.js'
import { addressToJSON } from '../toJSON.js'

const api = function (View) {
  class Addresses extends View {
    constructor(document, pointer, groups, opts = {}) {
      super(document, pointer, groups)
      this.viewType = 'Addresses'
      this.opts = Object.assign({}, opts)
    }

    get(n) {
      const all = []
      this.forEach(m => {
        const parsed = parseAddress(m)
        if (parsed.postcode || parsed.streetNumber) {
          all.push(addressToJSON(parsed))
        }
      })
      if (typeof n === 'number') {
        return all[n]
      }
      return all
    }

    json(opts = {}) {
      return this.map(m => {
        const json = m.toView().json(opts)[0] || {}
        const parsed = parseAddress(m)
        if (parsed.postcode || parsed.streetNumber) {
          json.address = addressToJSON(parsed)
        }
        return json
      }, [])
    }

    /** Extract just the postcode */
    postcode() {
      return this.all().postcodes()
    }

    /** Extract city component */
    city() {
      const cities = []
      this.forEach(m => {
        const parsed = parseAddress(m)
        if (parsed.city) {
          cities.push(parsed.city)
        }
      })
      return this.all().match(cities.join('|'))
    }

    /** Extract street component */
    street() {
      const streets = []
      this.forEach(m => {
        const parsed = parseAddress(m)
        if (parsed.streetName) {
          streets.push(parsed.streetName)
        }
      })
      return this.all().match(streets.join('|'))
    }

    /** Normalize address format */
    normalize() {
      // Return addresses in a standardized format
      return this.map(m => {
        const parsed = parseAddress(m)
        const parts = []
        
        if (parsed.streetNumber) parts.push(parsed.streetNumber)
        if (parsed.streetName) parts.push(parsed.streetName)
        if (parsed.streetType) parts.push(parsed.streetType)
        if (parsed.unit) parts.push(parsed.unit)
        if (parsed.city) parts.push(parsed.city)
        if (parsed.state) parts.push(parsed.state)
        if (parsed.postcode) parts.push(parsed.postcode)
        
        const normalized = parts.join(', ')
        m.replaceWith(normalized)
        return m
      })
    }
  }

  View.prototype.addresses = function (opts) {
    const m = findAddresses(this)
    return new Addresses(this.document, m.pointer, null, opts)
  }
}

export default api
