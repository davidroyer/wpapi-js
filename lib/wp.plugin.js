import axios from 'axios'

const Resources = [
  {
    collectionName: 'categories',
    singleName: 'category'
  },
  {
    collectionName: 'comments',
    singleName: 'comment'
  },
  {
    collectionName: 'media',
    singleName: 'media'
  },
  {
    collectionName: 'menus',
    singleName: 'menu'
  },
  {
    collectionName: 'pages',
    singleName: 'page'
  },
  {
    collectionName: 'tags',
    singleName: 'tag'
  },
  {
    collectionName: 'taxonomies',
    singleName: 'taxonomy'
  },
  {
    collectionName: 'statuses',
    singleName: 'status'
  },
  {
    collectionName: 'types',
    singleName: 'type'
  },
  {
    collectionName: 'users',
    singleName: 'user'
  }
]

const DEFAULTS = {
  namespace: 'wp/v2',
  wpSiteUrl: ''
}


export default async (ctx, inject) => {
  const moduleOptions = <%= serialize(options) %>;
  console.log('moduleOptions: ', moduleOptions);
  const wp = await new WpApi({
    wpSiteUrl: moduleOptions.wpSiteUrl
  })
  // const wp = await new WpApi(options)
  ctx.$wp = wp
  inject('wp', wp)
}




class WpApi {
  constructor (options) {
    this.options = Object.assign({}, DEFAULTS, options)
    this.axios = this._createAxiosClient()

    /**
     * Set up predefined resources methods.
     */
    return new Promise(async (resolve, reject) => {
      try {
        await this._createDefaultResourceRoutes(Resources)
        await this._createCustomPostRoutes()
      } catch (ex) {
        return reject(ex)
      }
      resolve(this)
    })
  }

  /**
   * Create axios client.
   */
  _createAxiosClient () {
    const options = {
      baseURL: this._createBaseUrl()
    }
    return axios.create(options)
  }

  /**
   * Create base url.
   */
  _createBaseUrl () {
    return `${this.options.wpSiteUrl}/wp-json/wp/v2/`
  }

  _setupRoutes () {}
  /**
   * Generate config for axios request
   */
  setConfig (options) {
    const requestConfig = {
      params: {
        ...options
      }
    }
    return requestConfig
  }

  /**
   * Modify namespace that is used.
   */
  namespace (namespace) {
    this.options.namespace = namespace
    return this
  }

  async postTypes () {
    const { data } = await this.axios.get(`types`)
    return data
  }

  async allSiteData () {
    const { data } = await this.axios.get(`${this.options.wpSiteUrl}/wp-json`)
    return data
  }

  async siteData () {
    const { data } = await this.axios.get(`${this.options.wpSiteUrl}/wp-json`)
    const { name, description, url, home, gmt_offset, timezone_string } = data
    return { name, description, url, home, gmt_offset, timezone_string }
  }

  async _createDefaultResourceRoutes (Resources) {
    Resources.forEach(({ collectionName, singleName }) => {
      this[collectionName] = async options => {
        const { data } = await this.axios.get(
          `${collectionName}`,
          this.setConfig(options)
        )
        return data
      }

      if (singleName === 'menu') {
        this[singleName] = async slug => {
          const { data } = await this.axios.get(`${collectionName}/${slug}`)
          return data
        }
      } else {
        this[singleName] = async slug => {
          const { data } = await this.axios.get(
            `${collectionName}/?slug=${slug}&_embed`
          )
          return data[0]
        }
      }
    })
  }

  async _createCustomPostRoutes () {
    const PostTypes = await this.postTypes()

    Object.entries(PostTypes).forEach(([key, postObject]) => {
      const { rest_base } = postObject
      this[rest_base] = async options => {
        const { data } = await this.axios.get(
          `${rest_base}`,
          this.setConfig(options)
        )
        return data
      }

      this[`${key}`] = async slug => {
        const { data } = await this.axios.get(
          `${rest_base}/?slug=${slug}&_embed`
        )
        return data[0]
      }
    })
  }
}
