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
      lessons: [],
      rooms: [],
      teachers: [],
      newLesson: {},
      lessonHeaders: [
        {
          text: `lesson name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `room`,
          align: `left`,
          value: `room.name`,
        },
        {
          text: `teacher`,
          align: `left`,
          value: `teacher.name`,
        },
        {
          text: `day`,
          align: `left`,
          // value: `teacher.name`,
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
    },
  },
}
</script>

<template lang="pug">
.so-table-form.mt-2
  v-data-table.elevation-1(
    :headers="lessonHeaders"
    :items="lessons"
  )
    template( slot="items" slot-scope="props")
      td
        nuxt-link(:to="`/lessons/${props.item.id}`")  {{ props.item.name }}
      td {{ props.item.room.name }}
      td {{ props.item.teacher.name }}
      td {{ props.item.dayName }}
  so-lesson-form(
    v-model="newLesson"
    @submit="onSubmit"
  )
</template>
