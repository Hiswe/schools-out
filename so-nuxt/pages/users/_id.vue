<script>
export default {
  name: `so-page-user`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      user: {},
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const user = await $axios.$get(`/users/${id}`)
    return { user }
  },
}
</script>

<template lang="pug">
div
  h1.display-2
    span.grey--text.text--darken-1 User:
    |
    | {{user.name}}
</template>

