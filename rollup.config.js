// Rollup configuration for building the plugin
// Based on compromise-dates plugin structure

export default {
  input: 'src/plugin.js',
  output: [
    {
      file: 'builds/compromise-address-plugin.mjs',
      format: 'esm'
    },
    {
      file: 'builds/compromise-address-plugin.cjs',
      format: 'cjs'
    },
    {
      file: 'builds/compromise-address-plugin.min.js',
      format: 'umd',
      name: 'compromiseAddressPlugin',
      plugins: []
    }
  ],
  external: ['compromise']
}
