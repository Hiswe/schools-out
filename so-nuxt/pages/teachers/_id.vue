<script>
export default {
  name: `so-page-teacher`,
  data() {
    return {
      teacher: {},
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const teacher = await $axios.$get(`/teachers/${id}`)
    return { teacher }
  },
}
</script>

<template lang="pug">
div
  h1.display-2
    span.grey--text.text--darken-1 Teacher:
    |
    | {{teacher.name}}
</template>

