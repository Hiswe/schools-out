<script>
import SoLessonForm from '~/components/lesson-form.vue'

export default {
  name: `so-page-lesson`,
  meta: {
    authRequired: true,
  },
  components: {
    SoLessonForm,
  },
  data() {
    return {
      dialog: false,
      lesson: {},
      registrationHeaders: [
        {
          text: `student name`,
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
  methods: {
    async onSubmit(updatedLesson) {
      const uri = `/lessons/${updatedLesson.id}`
      const lesson = await this.$axios.$post(uri, updatedLesson)
      this.lesson = lesson
    },
  },
}
</script>

<template lang="pug">
.so-wrapper

  .so-top-bar
    h1.display-1 lesson: {{lesson.name}}

  .so-content: .so-page-lesson
    v-card
      v-card-title: h4 {{lesson.name}}
      v-divider
      v-list(dense)
        v-list-tile
          v-list-tile-content Teacher
          v-list-tile-content.align-end
            nuxt-link(:to="`/teachers/${lesson.teacher.id}`")
              | {{lesson.teacher.name}}
        v-list-tile
          v-list-tile-content Place
          v-list-tile-content.align-end
            nuxt-link(:to="`/places/${lesson.place.id}`")
              | {{lesson.place.name}}

    v-data-table.elevation-1(
      :headers="registrationHeaders"
      :items="lesson.registrations"
    )
      template( slot="items" slot-scope="props")
        td
          nuxt-link(:to="`/users/${props.item.user.id}`") {{ props.item.user.name }}
        td {{ props.item.rate.nameWeekly }}
        td.text-xs-right {{ props.item.rate.price }}

  v-btn(
    fixed
    dark
    fab
    bottom
    right
    color="pink"
    @click="dialog = !dialog"
  )
    v-icon edit
  v-dialog(v-model="dialog" max-width="600px")
    so-lesson-form(
      v-model="lesson"
      ref="form"
      @submit="onSubmit"
      title=""
      submit-text="update lesson"
    )
</template>

<style lang="scss" scoped>
.so-page-lesson {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 2rem;
}
</style>
