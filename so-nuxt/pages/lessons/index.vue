<script>
import SoLessonForm from '~/components/lesson-form.vue'

export default {
  name: `so-page-lessons`,
  meta: {
    authRequired: true,
  },
  components: {
    SoLessonForm,
  },
  data() {
    return {
      dialog: false,
      lessons: [],
      places: [],
      teachers: [],
      newLesson: {},
      lessonsRows: [
        10,
        25,
        50,
        // rows-per-page-items
      ],
      lessonHeaders: [
        {
          text: `lessons.tableName`,
          align: `left`,
          value: `name`,
        },
        {
          text: `place`,
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
          // value: `teacher.name`,
        },
        {
          text: `begin`,
          align: `left`,
          value: `startHour`,
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
    v-data-table.elevation-1(
      :rows-per-page-items="lessonsRows"
      :headers="lessonHeaders"
      :items="lessons"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}
      template( slot="items" slot-scope="props")
        td
          nuxt-link(:to="`/lessons/${props.item.id}`")  {{ props.item.name }}
        td {{ props.item.place.name }}
        td {{ props.item.teacher.name }}
        td {{ props.item.dayName }}
        td {{ props.item.startHour }}

  v-btn(fixed dark fab bottom right color="pink"
    @click="dialog = !dialog"
  ): v-icon add

  v-dialog(v-model="dialog" max-width="600px")
    so-lesson-form(
      v-model="newLesson"
      ref="form"
      @submit="onSubmit"
    )
</template>
