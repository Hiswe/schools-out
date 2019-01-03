<script>
export default {
  name: `so-page-lesson`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      lesson: {},
      inscriptionHeaders: [
        {
          text: `name`,
          align: `left`,
          value: `user.name`,
        },
        {
          text: `rate name`,
          align: `left`,
          sortable: false,
        },
        {
          text: `price`,
          align: `right`,
          sortable: false,
        },
      ],
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
.so-page-lesson
  v-card
    v-card-title: h4 lesson: {{lesson.name}}
    v-divider
    v-list(dense)
      v-list-tile
        v-list-tile-content Teacher
        v-list-tile-content.align-end
          nuxt-link(:to="`/teachers/${lesson.teacher.id}`")
            | {{lesson.teacher.name}}
      v-list-tile
        v-list-tile-content Room
        v-list-tile-content.align-end
          nuxt-link(:to="`/rooms/${lesson.room.id}`")
            | {{lesson.room.name}}
  v-data-table.elevation-1(
    :headers="inscriptionHeaders"
    :items="lesson.inscriptions"
  )
    template( slot="items" slot-scope="props")
      td
        nuxt-link(:to="`/users/${props.item.user.id}`") {{ props.item.user.name }}
      td {{ props.item.rate.nameWeekly }}
      td.text-xs-right {{ props.item.rate.price }}
</template>

<style lang="scss" scoped>
.so-page-lesson {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 2rem;
}
</style>
