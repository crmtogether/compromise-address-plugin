// Detect country from text context (city names, state names, country names, etc.)

const countryIndicators = {
  'USA': {
    states: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'],
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Fort Worth', 'Charlotte', 'Seattle', 'Denver', 'Washington', 'Boston'],
    keywords: ['United States', 'USA', 'US', 'America']
  },
  'Canada': {
    provinces: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
    keywords: ['Canada', 'Canadian']
  },
  'UK': {
    cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Edinburgh', 'Glasgow', 'Cardiff', 'Belfast'],
    counties: [
      // England counties
      'Bedfordshire', 'Berkshire', 'Buckinghamshire', 'Cambridgeshire', 'Cheshire', 'Cornwall', 'Cumbria', 'Derbyshire', 'Devon', 'Dorset',
      'Durham', 'East Sussex', 'Essex', 'Gloucestershire', 'Hampshire', 'Herefordshire', 'Hertfordshire', 'Kent', 'Lancashire', 'Leicestershire',
      'Lincolnshire', 'Norfolk', 'Northamptonshire', 'Northumberland', 'North Yorkshire', 'Nottinghamshire', 'Oxfordshire', 'Rutland', 'Shropshire',
      'Somerset', 'South Yorkshire', 'Staffordshire', 'Suffolk', 'Surrey', 'Tyne and Wear', 'Warwickshire', 'West Midlands', 'West Sussex',
      'West Yorkshire', 'Wiltshire', 'Worcestershire',
      // Scotland regions/counties
      'Aberdeenshire', 'Angus', 'Argyll', 'Ayrshire', 'Banffshire', 'Berwickshire', 'Bute', 'Caithness', 'Clackmannanshire', 'Dumfriesshire',
      'Dunbartonshire', 'East Lothian', 'Fife', 'Inverness-shire', 'Kincardineshire', 'Kinross-shire', 'Kirkcudbrightshire', 'Lanarkshire',
      'Midlothian', 'Moray', 'Nairnshire', 'Orkney', 'Peeblesshire', 'Perthshire', 'Renfrewshire', 'Ross-shire', 'Roxburghshire', 'Selkirkshire',
      'Shetland', 'Stirlingshire', 'Sutherland', 'West Lothian', 'Wigtownshire',
      // Wales counties
      'Anglesey', 'Brecknockshire', 'Caernarfonshire', 'Cardiganshire', 'Carmarthenshire', 'Denbighshire', 'Flintshire', 'Glamorgan', 'Merionethshire',
      'Monmouthshire', 'Montgomeryshire', 'Pembrokeshire', 'Radnorshire',
      // Northern Ireland counties
      'Antrim', 'Armagh', 'Down', 'Fermanagh', 'Londonderry', 'Tyrone',
      // Common abbreviations and variations
      'Yorkshire', 'Middlesex', 'Huntingdonshire'
    ],
    keywords: ['United Kingdom', 'UK', 'England', 'Scotland', 'Wales', 'Northern Ireland', 'British']
  },
  'Ireland': {
    cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Kilkenny'],
    counties: ['Dublin', 'Kildare', 'Sligo', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Wexford', 'Wicklow', 'Meath', 'Louth', 'Kilkenny', 'Carlow', 'Tipperary', 'Clare', 'Kerry', 'Mayo', 'Donegal', 'Cavan', 'Monaghan', 'Longford', 'Westmeath', 'Offaly', 'Laois', 'Roscommon', 'Leitrim'],
    keywords: ['Ireland', 'Irish', 'Republic of Ireland', 'Éire']
  },
  'Australia': {
    states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
    keywords: ['Australia', 'Australian']
  },
  'South Africa': {
    cities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'],
    keywords: ['South Africa', 'South African']
  },
  'Germany': {
    states: ['Bayern', 'Bavaria', 'Baden-Württemberg', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Hesse', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Lower Saxony', 'Nordrhein-Westfalen', 'North Rhine-Westphalia', 'Rheinland-Pfalz', 'Rhineland-Palatinate', 'Saarland', 'Sachsen', 'Saxony', 'Sachsen-Anhalt', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thüringen', 'Thuringia'],
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    keywords: ['Germany', 'German', 'Deutschland']
  },
  'France': {
    states: [
      // Régions (Regions)
      'Île-de-France', 'Ile-de-France', 'Provence-Alpes-Côte d\'Azur', 'Provence-Alpes-Cote d\'Azur', 'PACA',
      'Auvergne-Rhône-Alpes', 'Auvergne-Rhone-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France',
      'Grand Est', 'Pays de la Loire', 'Normandie', 'Normandy', 'Bretagne', 'Brittany', 'Centre-Val de Loire',
      'Bourgogne-Franche-Comté', 'Bourgogne-Franche-Comte', 'Corse', 'Corsica', 'Guadeloupe', 'Martinique',
      'Guyane', 'French Guiana', 'La Réunion', 'Reunion', 'Mayotte',
      // Départements (Departments) - major ones
      'Paris', 'Seine-et-Marne', 'Yvelines', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', 'Val-d\'Oise',
      'Bouches-du-Rhône', 'Bouches-du-Rhone', 'Rhône', 'Rhone', 'Nord', 'Gironde', 'Loire-Atlantique',
      'Haute-Garonne', 'Bas-Rhin', 'Haut-Rhin', 'Var', 'Alpes-Maritimes', 'Ille-et-Vilaine', 'Morbihan',
      'Finistère', 'Finistere', 'Côtes-d\'Armor', 'Cotes-d\'Armor', 'Loire', 'Vendée', 'Vendee',
      'Charente-Maritime', 'Dordogne', 'Pyrénées-Atlantiques', 'Pyrenees-Atlantiques', 'Aude', 'Hérault', 'Herault',
      'Gard', 'Vaucluse', 'Alpes-de-Haute-Provence', 'Drôme', 'Drome', 'Isère', 'Isere', 'Savoie', 'Haute-Savoie',
      'Ain', 'Saône-et-Loire', 'Saone-et-Loire', 'Côte-d\'Or', 'Cote-d\'Or', 'Yonne', 'Nièvre', 'Nievre',
      'Meurthe-et-Moselle', 'Meuse', 'Moselle', 'Ardennes', 'Aisne', 'Oise', 'Somme', 'Pas-de-Calais',
      'Calvados', 'Eure', 'Seine-Maritime', 'Manche', 'Orne', 'Sarthe', 'Maine-et-Loire', 'Mayenne',
      'Indre-et-Loire', 'Loir-et-Cher', 'Cher', 'Indre', 'Eure-et-Loir', 'Loiret', 'Yonne'
    ],
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    keywords: ['France', 'French']
  }
}

// Detect country from text
const detectCountry = function (text) {
  const lowerText = text.toLowerCase()
  const scores = {}
  
  // Check each country's indicators
  for (const [country, indicators] of Object.entries(countryIndicators)) {
    let score = 0
    
    // Check keywords (strongest indicator)
    for (const keyword of indicators.keywords || []) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += 10
      }
    }
    
    // Check counties first (very strong indicator - county names are highly specific)
    // This is especially important for Ireland where county names are commonly used
    for (const county of indicators.counties || []) {
      // Match county names as whole words
      const countyRegex = new RegExp(`\\b${county}\\b`, 'i')
      if (countyRegex.test(text)) {
        score += 8 // Higher weight than cities since counties are more specific
      }
    }
    
    // Check cities (strong indicator)
    for (const city of indicators.cities || []) {
      if (lowerText.includes(city.toLowerCase())) {
        score += 5
      }
    }
    
    // Check states/provinces (moderate indicator)
    for (const state of indicators.states || []) {
      // Match state abbreviations as whole words or with punctuation
      const stateRegex = new RegExp(`\\b${state}\\b`, 'i')
      if (stateRegex.test(text)) {
        score += 3
      }
    }
    
    if (score > 0) {
      scores[country] = score
    }
  }
  
  // Return country with highest score, or null if no match
  if (Object.keys(scores).length === 0) {
    return null
  }
  
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  return sorted[0][0]
}

export default detectCountry
