import WpApi from '@wpapi/wp-client'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path, { resolve } from 'path'

module.exports = async function module (moduleOptions) {
  const options = Object.assign({}, this.options.wpapi, moduleOptions)

  this.nuxt.hook('build:before', async (nuxt, buildOptions) => {
    const wp = await new WpApi({
      wpSiteUrl: this.options.wpapi.url || moduleOptions.url
    })

    const PostTypes = await wp.postTypes()
    const postTypesPath = path.join(`${this.options.srcDir}/api/post-types.json`)
    await mkdirp(path.dirname(postTypesPath))
    await fs.writeFileSync(postTypesPath, JSON.stringify(PostTypes))
  })

  this.nuxt.hook('generate:extendRoutes', async routes => {
    const wp = await new WpApi({
      wpSiteUrl: this.options.wpapi.url || moduleOptions.url
    })
    let routesArray = []
    const Endpoints = [
      'posts',
      'pages',
      'projects'
    ]
    // wp.createRoutes(await wp.postTypes())
    wp._createCustomPostRoutes(await wp.postTypes())

    for (const endpoint of Endpoints) {
      const endpointData = await wp[endpoint]()
      const endpointRoutes = endpointData.map(endpointItem => `/${endpoint}/${endpointItem.slug}`)
      routesArray.push(...endpointRoutes)
    }
    return routesArray
  })

  this.addPlugin({
    src: resolve(__dirname, 'wp.plugin.js'),
    fileName: 'wp.plugin.js',
    options
  })
}
module.exports.meta = require('../package.json')
