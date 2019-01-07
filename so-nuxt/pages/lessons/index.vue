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
      rooms: [],
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
          text: `room`,
          align: `left`,
          value: `room.name`,
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
      roomRules: [v => !!v || `Room is required`],
      teacherRules: [v => !!v || `Teacher is required`],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios, params, store } = nuxtContext
    const [lessons, teachers, rooms] = await Promise.all([
      $axios.$get(`/lessons`),
      $axios.$get(`/teachers`),
      $axios.$get(`/rooms`),
    ])
    return { lessons, teachers, rooms }
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
        td {{ props.item.room.name }}
        td {{ props.item.teacher.name }}
        td {{ props.item.dayName }}
        td {{ props.item.startHour }}

  v-dialog(v-model="dialog" max-width="600px")
    so-lesson-form(
      v-model="newLesson"
      ref="form"
      @submit="onSubmit"
    )

  v-btn(
    fixed
    dark
    fab
    bottom
    right
    color="pink"
    @click="dialog = !dialog"
  )
    v-icon add
</template>
