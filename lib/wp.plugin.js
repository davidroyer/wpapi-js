import WpApi from '@wpapi/wp-client'
import postTypes from '@/api/post-types.json'

export default async (ctx, inject) => {
  const moduleOptions = <%= serialize(options) %>
  const wp = await new WpApi({
    wpSiteUrl: moduleOptions.url
  })  

  wp._createCustomPostRoutes(await wp.postTypes());

  // const wp = await new WpApi({
  //   url: moduleOptions.url
  // })
  // wp.createRoutes(postTypes)

  ctx.$wp = wp
  inject('wp', wp)
}