<script>
export default {
  name: `so-page-lesson`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      lesson: {},
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const lesson = await $axios.$get(`/lessons/${id}`)
    return { lesson }
  },
}
</script>


<template lang="pug">
div
  h1 lesson: {{lesson.name}}
</template>
