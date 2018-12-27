<script>
export default {
  name: `so-page-schools-list`,
  data() {
    return {
      schools: [],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
      ],
    }
  },
  async asyncData({ $axios, params }) {
    const schools = await $axios.$get(`/schools`)
    console.log(schools)
    return {}
  },
}
</script>

<template lang="pug">
div
  h1 Schools
  v-data-table(
    :headers="headers"
    :items="schools"
  )
    template( slot="items" slot-scope="props")
      td {{ props.item.name }}
</template>
