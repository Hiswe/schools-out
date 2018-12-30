<script>
export default {
  name: `so-page-school`,
  data() {
    school: {
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const school = await $axios.$get(`/schools/${id}`)
    return { school }
  },
}
</script>

<template lang="pug">
div
  h1.display-2
    span.grey--text.text--darken-1 School:
    |
    | {{school.name}}
</template>

