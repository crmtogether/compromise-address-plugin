# compromise-address-plugin

A plugin for [compromise](https://github.com/spencermountain/compromise) that parses addresses and postcodes from text.

## Installation

```bash
npm install compromise-address-plugin
```

## Usage

```javascript
import nlp from 'compromise'
import addressPlugin from 'compromise-address-plugin'

nlp.extend(addressPlugin)

const doc = nlp('Send it to 123 Main Street, New York, NY 10001')
doc.addresses().get()
// [{ streetNumber: '123', streetName: 'Main', streetType: 'Street', city: 'New York', state: 'NY', postcode: '10001', country: 'USA' }]

doc.postcodes().get()
// [{ postcode: '10001', country: 'USA', text: '10001' }]
```

## Supported Countries

This plugin supports address and postcode parsing for:

- **USA** - ZIP codes (5 digits, optional +4 extension)
- **Canada** - Postal codes (A1A 1A1 format)
- **UK** - Postcodes (various formats like SW1A 2AA)
- **Ireland** - Eircodes (D02 AF30 format)
- **South Africa** - Postal codes (4 digits)
- **Germany** - Postleitzahl (5 digits)
- **France** - Code postal (5 digits)
- **Australia** - Postcodes (4 digits)

## API

### `.postcodes()`

Extract postal codes from text.

```javascript
const doc = nlp('New York 10001 and Toronto M5H 2N2')
const postcodes = doc.postcodes()

postcodes.text()
// '10001 M5H 2N2'

postcodes.get()
// [
//   { postcode: '10001', country: 'USA', text: '10001' },
//   { postcode: 'M5H 2N2', country: 'Canada', text: 'M5H 2N2' }
// ]

postcodes.json()
// Returns full JSON with postcode metadata

postcodes.country('USA')
// Filter to only US postcodes

postcodes.format()
// Normalize postcode formats consistently
```

### `.addresses()`

Extract full addresses from text.

```javascript
const doc = nlp('The address is 123 Main Street, New York, NY 10001')
const addresses = doc.addresses()

addresses.get()
// [
//   {
//     streetNumber: '123',
//     streetName: 'Main',
//     streetType: 'Street',
//     city: 'New York',
//     state: 'NY',
//     postcode: '10001',
//     country: 'USA',
//     text: '123 Main Street, New York, NY 10001'
//   }
// ]

addresses.json()
// Returns full JSON with address metadata

addresses.postcode()
// Extract just the postcode from addresses

addresses.city()
// Extract city component

addresses.street()
// Extract street component

addresses.normalize()
// Normalize address format
```

## Examples

### Extract Postcodes

```javascript
import nlp from 'compromise'
import addressPlugin from 'compromise-address-plugin'

nlp.extend(addressPlugin)

// Single postcode
let doc = nlp('London SW1A 2AA')
doc.postcodes().get()
// [{ postcode: 'SW1A 2AA', country: 'UK' }]

// Multiple postcodes
doc = nlp('New York 10001 and Los Angeles 90001')
doc.postcodes().get()
// [
//   { postcode: '10001', country: 'USA' },
//   { postcode: '90001', country: 'USA' }
// ]

// Filter by country
doc = nlp('New York 10001 and Toronto M5H 2N2')
doc.postcodes().country('USA').get()
// [{ postcode: '10001', country: 'USA' }]
```

### Extract Addresses

```javascript
// US address
let doc = nlp('123 Main Street, New York, NY 10001')
doc.addresses().get()
// [{ streetNumber: '123', streetName: 'Main', streetType: 'Street', city: 'New York', state: 'NY', postcode: '10001', country: 'USA' }]

// UK address
doc = nlp('10 Downing Street, London SW1A 2AA')
doc.addresses().get()
// [{ streetNumber: '10', streetName: 'Downing', streetType: 'Street', city: 'London', postcode: 'SW1A 2AA', country: 'UK' }]

// Canadian address
doc = nlp('123 Main Street, Toronto, ON M5H 2N2')
doc.addresses().get()
// [{ streetNumber: '123', streetName: 'Main', streetType: 'Street', city: 'Toronto', state: 'ON', postcode: 'M5H 2N2', country: 'Canada' }]
```

### Country-Specific Examples

```javascript
// Ireland
let doc = nlp('1 Grafton Street, Dublin 2, D02 AF30')
doc.addresses().get()
// [{ streetNumber: '1', streetName: 'Grafton', streetType: 'Street', city: 'Dublin', postcode: 'D02 AF30', country: 'Ireland' }]

// Australia
doc = nlp('123 George Street, Sydney NSW 2000')
doc.addresses().get()
// [{ streetNumber: '123', streetName: 'George', streetType: 'Street', city: 'Sydney', state: 'NSW', postcode: '2000', country: 'Australia' }]

// Germany
doc = nlp('Unter den Linden 1, 10117 Berlin')
doc.addresses().get()
// [{ streetName: 'Unter den Linden', streetNumber: '1', postcode: '10117', city: 'Berlin', country: 'Germany' }]

// France
doc = nlp('1 Avenue des Champs-Élysées, 75008 Paris')
doc.addresses().get()
// [{ streetNumber: '1', streetName: 'Avenue des Champs-Élysées', postcode: '75008', city: 'Paris', country: 'France' }]

// South Africa
doc = nlp('123 Main Street, Cape Town 8001')
doc.addresses().get()
// [{ streetNumber: '123', streetName: 'Main', streetType: 'Street', city: 'Cape Town', postcode: '8001', country: 'South Africa' }]
```

## Postcode Formats

### USA
- Format: `12345` or `12345-6789`
- Example: `10001`, `90210-1234`

### Canada
- Format: `A1A 1A1` (letter-digit-letter space digit-letter-digit)
- Example: `M5H 2N2`, `K1A 0A6`

### UK
- Format: Various formats
- Examples: `SW1A 2AA`, `M1 1AA`, `WC2H 7LT`

### Ireland (Eircode)
- Format: `A12 BCDE` or `D6W ABCD` (routing key + unique identifier)
- Example: `D02 AF30`, `A86 F4E2`

### South Africa
- Format: `1234` (4 digits)
- Example: `8001`, `0001`

### Germany
- Format: `12345` (5 digits)
- Example: `10117`, `80331`

### France
- Format: `12345` (5 digits)
- Example: `75008`, `69001`

### Australia
- Format: `1234` (4 digits)
- Example: `2000`, `3000`

## How It Works

The plugin uses **country detection** to improve accuracy:

1. **Country Detection**: Analyzes text for country indicators (city names, state/province codes, country keywords)
2. **Pattern Matching**: Only matches postcode patterns for the detected country
3. **Context-Aware Parsing**: Uses detected country to disambiguate postcodes with similar formats

This approach solves ambiguity issues (e.g., 4-digit codes used by both Australia and South Africa, 5-digit codes used by USA, Germany, and France).

## Limitations

- Address parsing relies on postcode detection - addresses without postcodes may not be detected
- Street name extraction works best with common street types (Street, Avenue, Road, etc.)
- City and state extraction may vary in accuracy depending on text context
- Some address formats may not be fully parsed if they don't follow common patterns
- Country detection requires context clues (city names, state codes) - isolated postcodes without context may not be accurately identified

## License

Apache-2.0
