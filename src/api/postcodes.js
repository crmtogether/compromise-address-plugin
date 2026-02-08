import findPostcodes from '../find/postcodes.js'
import parsePostcode from '../parse/postcodes.js'
import { postcodeToJSON } from '../toJSON.js'

const api = function (View) {
  class Postcodes extends View {
    constructor(document, pointer, groups, opts = {}) {
      super(document, pointer, groups)
      this.viewType = 'Postcodes'
      this.opts = Object.assign({}, opts)
    }

    get(n) {
      const all = []
      // Get context text for country detection
      const contextText = this.all().text()
      
      this.forEach(m => {
        const postcodeText = m.text()
        const parsed = parsePostcode(postcodeText, this.opts.country, contextText)
        if (parsed.postcode) {
          all.push(postcodeToJSON(parsed))
        }
      })
      if (typeof n === 'number') {
        return all[n]
      }
      return all
    }

    json(opts = {}) {
      // Get context text for country detection
      const contextText = this.all().text()
      
      return this.map(m => {
        const json = m.toView().json(opts)[0] || {}
        const postcodeText = m.text()
        const parsed = parsePostcode(postcodeText, this.opts.country, contextText)
        if (parsed.postcode) {
          json.postcode = postcodeToJSON(parsed)
        }
        return json
      }, [])
    }

    /** Filter by country */
    country(countryName) {
      const filtered = this.filter(m => {
        const postcodeText = m.text()
        const parsed = parsePostcode(postcodeText)
        return parsed.country === countryName
      })
      return new Postcodes(this.document, filtered.pointer, null, this.opts)
    }

    /** Format postcodes consistently */
    format() {
      const res = this.map(m => {
        const postcodeText = m.text()
        const parsed = parsePostcode(postcodeText)
        if (parsed.normalized) {
          m.replaceWith(parsed.normalized)
        }
        return m
      })
      return new Postcodes(this.document, res.pointer, null, this.opts)
    }
  }

  View.prototype.postcodes = function (opts) {
    const m = findPostcodes(this)
    return new Postcodes(this.document, m.pointer, null, opts)
  }
}

export default api
