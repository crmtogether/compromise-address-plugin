import postcodes from './postcodes.js'
import addresses from './addresses.js'

const api = function (View) {
  postcodes(View)
  addresses(View)
}

export default api
