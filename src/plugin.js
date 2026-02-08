import api from './api/index.js'
import tags from './model/tags.js'
import words from './model/words.js'
import regex from './model/regex.js'
import version from './_version.js'

export default {
  tags,
  words,
  api,
  mutate: world => {
    // Add our regexes to compromise's regex text matcher
    // Format: [regex, tag, optionalName]
    world.model.two.regexText = world.model.two.regexText || []
    regex.forEach(({ pattern, name }) => {
      // Convert to RegExp if needed and push as [regex, tag, name]
      const regexObj = pattern instanceof RegExp ? pattern : new RegExp(pattern.source, pattern.flags)
      world.model.two.regexText.push([regexObj, 'Postcode', name])
    })
  },
  version,
}
