<script>
import { mapGetters } from 'vuex'

import { SCHOOL_ID } from '~/store/user'

export default {
  name: `so-page-lessons`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      lessons: [],
      rooms: [],
      teachers: [],
      lessonValid: true,
      newLesson: {},
      lessonHeaders: [
        {
          text: `name`,
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
      ],
      nameRules: [v => !!v || `Name is required`],
      roomRules: [v => !!v || `Room is required`],
      teacherRules: [v => !!v || `Teacher is required`],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios, params, store } = nuxtContext
    const schoolId = store.getters[`user/${SCHOOL_ID}`]
    const [lessons, teachers, rooms] = await Promise.all([
      $axios.$get(`/lessons`),
      $axios.$get(`/teachers`),
      $axios.$get(`/rooms`),
    ])
    return { lessons, teachers, rooms }
  },
  computed: {
    ...mapGetters(`user`, {
      schoolId: SCHOOL_ID,
    }),
  },
  methods: {
    async submitLesson() {
      if (!this.$refs.lessonForm.validate()) return
      const lesson = await this.$axios.$post(`/lessons`, this.newLesson)
      this.lessons.push(lesson)
      this.$refs.lessonForm.reset()
    },
    clearLesson() {
      this.$refs.lessonForm.reset()
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
  v-form(
    ref="lessonForm"
    v-model="lessonValid"
  )
    v-card
      v-card-title(primary-title)
        .headline new lesson
      v-card-text
        v-text-field(
          v-model="newLesson.name"
          label="Name"
          :rules="nameRules"
          required
        )
        v-select(
          :items="teachers"
          item-text="name"
          item-value="id"
          label="Teacher"
          v-model="newLesson.teacherId"
          :rules="teacherRules"
          required
        )
        v-select(
          :items="rooms"
          item-text="name"
          item-value="id"
          label="Rooms"
          v-model="newLesson.roomId"
          :rules="roomRules"
          required
        )
      v-card-actions
        v-btn(
          :disabled="!lessonValid"
          @click="submitLesson"
          color="primary"
        ) add lesson
        v-btn(@click="clearLesson") clear
</template>
