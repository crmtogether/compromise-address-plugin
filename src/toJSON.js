// Convert parsed postcode/address data to JSON format

export const postcodeToJSON = function (parsed) {
  return {
    text: parsed.postcode,
    postcode: parsed.normalized,
    country: parsed.country,
    raw: parsed.raw
  }
}

export const addressToJSON = function (parsed) {
  return {
    text: parsed.raw,
    streetNumber: parsed.streetNumber,
    streetName: parsed.streetName,
    streetType: parsed.streetType,
    unit: parsed.unit,
    city: parsed.city,
    state: parsed.state,
    postcode: parsed.postcode,
    country: parsed.country
  }
}
