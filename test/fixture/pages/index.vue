<template>
  <section>
    <h1>wpapi-js/nuxt-client</h1>
    <h2>Testing</h2>
    <hr>
    <h2>Projects</h2>
    <pre>{{ projects.length }}</pre>
    <hr>
    <h2>Posts</h2>
    <pre>{{ posts.length }}</pre>
    <hr>
    <h2>Pages</h2>
    <pre>{{ pages.length }}</pre>
    <hr>
  </section>
</template>
<script>

export default {
  async asyncData ({ app }) {
    // console.log(app.$wp)
    const projects = await app.$wp.projects()
    const pages = await app.$wp.pages()
    const posts = await app.$wp.posts()
    return {
      projects,
      pages,
      posts
    }
  }
}
</script>
