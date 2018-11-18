const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: ['@@'],
  wpapi: {
    url: 'https://demo1.wpapi.app'
    // url: 'https://got2dance.wpapi.app'
  }
}
