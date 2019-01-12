<script>
import { SoLessonsList, SoLessonsForm } from '~/components/lessons'
import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-page-lessons`,
  meta: {
    authRequired: true,
  },
  components: {
    SoLessonsForm,
    SoLessonsList,
  },
  data() {
    return {
      dialog: false,
      lessons: [],
      places: [],
      teachers: [],
      newLesson: {},
      rowsPerPageItems,
      lessonHeaders: [
        {
          text: `lessons.tableName`,
          align: `left`,
          value: `name`,
        },
        {
          text: `places.singular`,
          align: `left`,
          value: `place.name`,
        },
        {
          text: `teachers.singular`,
          align: `left`,
          value: `teacher.name`,
        },
        {
          text: `day`,
          align: `left`,
          value: `teacher.name`,
        },
        {
          text: `begin`,
          align: `left`,
          value: `startHour`,
        },
        {
          text: `duration`,
          align: `left`,
          value: `duration`,
        },
      ],
      nameRules: [v => !!v || `Name is required`],
      placeRules: [v => !!v || `Place is required`],
      teacherRules: [v => !!v || `Teacher is required`],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios, params, store } = nuxtContext
    const [lessons, teachers, places] = await Promise.all([
      $axios.$get(`/lessons`),
      $axios.$get(`/teachers`),
      $axios.$get(`/places`),
    ])
    return { lessons, teachers, places }
  },
  methods: {
    async onSubmit(newLesson) {
      const lesson = await this.$axios.$post(`/lessons`, newLesson)
      this.lessons.push(lesson)
      this.$refs.form.reset()
      this.dialog = false
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`lessons.plural`) }}

  .so-content
    so-lessons-list(
      :lessons="lessons"
    )
  v-btn(fixed dark fab bottom right color="pink"
    @click="dialog = !dialog"
  ): v-icon add

  v-dialog(v-model="dialog" max-width="600px")
    so-lessons-form(
      v-model="newLesson"
      ref="form"
      @submit="onSubmit"
    )
</template>
