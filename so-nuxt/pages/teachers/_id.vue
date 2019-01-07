<script>
export default {
  name: `so-page-teacher`,
  meta: {
    authRequired: true,
  },
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
.so-wrapper

  .so-top-bar
    h1.display-1 {{$t(`teachers.withName`, {name: teacher.name})}}
</template>

