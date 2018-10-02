const { resolve } = require('path')

module.exports = async function module (moduleOptions) {
  // const options = Object.assign({}, moduleOptions)
  const options = Object.assign({}, this.options.wpapi, moduleOptions)
  this.addPlugin({
    src: resolve(__dirname, 'wp.plugin.js'),
    fileName: 'wp.plugin.js',
    options
  })
}
module.exports.meta = require('../package.json')
