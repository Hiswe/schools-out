<script>
import { Promise } from 'q'
export default {
  name: `so-page-school`,
  data() {
    return {
      school: {},
      lessons: [],
      newRoom: {},
      newLesson: {},
      roomValid: true,
      lessonValid: true,
      nameRules: [v => !!v || `Name is required`],
      capacityRules: [
        v => !!v || `Capacity is required`,
        v => v > 0 || `capacity can't be null`,
      ],
      roomRules: [v => !!v || `Room is required`],
      teacherRules: [v => !!v || `Teacher is required`],
      teacherHeaders: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `email`,
          align: `left`,
          value: `email`,
        },
      ],
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
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const [school, lessons] = await Promise.all([
      $axios.$get(`/schools/${id}`),
      $axios.$get(`/schools/${id}/lessons`),
    ])
    return { school, lessons }
  },
  methods: {
    async submitRoom() {
      if (!this.$refs.roomForm.validate()) return console.log(`invalid form`)
      const roomUri = `/schools/${this.school.id}/rooms`
      const room = await this.$axios.$post(roomUri, this.newRoom)
      this.school.rooms.push(room)
      this.$refs.roomForm.reset()
    },
    clearRoom() {
      this.$refs.roomForm.reset()
    },
    async submitLesson() {
      if (!this.$refs.lessonForm.validate()) return console.log(`invalid form`)
      const lessonUri = `/schools/${this.school.id}/lessons`
      const lesson = await this.$axios.$post(lessonUri, this.newLesson)
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
div
  h1.display-2
    span.grey--text.text--darken-1 School:
    |
    | {{school.name}}

  v-tabs(centered icons-and-text dark)
    v-tabs-slider
    v-tab(href="#rooms")
      | Rooms
      v-icon meeting_room
    v-tab(href="#users")
      | Users
      v-icon group
    v-tab(href="#teachers")
      | Teachers
      v-icon school
    v-tab(href="#prices")
      | Prices
      v-icon attach_money

    v-tab(href="#lessons")
      | Lessons
      v-icon assignment

    //- ROOMS
    v-tab-item(value="rooms")
      .so-2-cols.mt-4
        v-card
          v-card-title(primary-title)
            .headline existing rooms
          v-card-text
            v-list(
              two-line
              v-if="Array.isArray(school.rooms) && school.rooms.length"
            )
              v-list-tile(
                v-for="room in school.rooms"
                :key="room.id"
              ): v-list-tile-content
                v-list-tile-title {{room.name}}
                v-list-tile-sub-title
                  span.primary--text {{room.capacity}}
                  |
                  | people

        v-form(
          ref="roomForm"
          v-model="roomValid"
        )
          v-card
            v-card-title(primary-title)
              .headline new room
            v-card-text
              v-text-field(
                v-model="newRoom.name"
                label="Name"
                :rules="nameRules"
                required
              )
              v-text-field(
                v-model.number="newRoom.capacity"
                label="People capacity"
                type="number"
                :rules="capacityRules"
                required
              )
            v-card-actions
              v-btn(
                :disabled="!roomValid"
                @click="submitRoom"
                color="primary"
              ) add Room
              v-btn(@click="clearRoom") clear

    v-tab-item(value="users")
      v-data-table.elevation-1.mt-5(
        :headers="teacherHeaders"
        :items="school.users"
      )
        template( slot="items" slot-scope="props")
          td
            nuxt-link(:to="`/users/${props.item.id}`") {{ props.item.name }}
          td {{ props.item.email }}

    v-tab-item(value="teachers")
      v-data-table.elevation-1.mt-5(
        :headers="teacherHeaders"
        :items="school.teachers"
      )
        template( slot="items" slot-scope="props")
          td
            nuxt-link(:to="`/teachers/${props.item.id}`") {{ props.item.name }}
          td {{ props.item.email }}

    v-tab-item(value="prices")
      h2.display-3 prices

    v-tab-item(value="lessons")
      .so-lessons.mt-4
        v-data-table.elevation-1(
          :headers="lessonHeaders"
          :items="lessons"
        )
          template( slot="items" slot-scope="props")
            td {{ props.item.name }}
            td {{ props.item.teacher.name }}
            td {{ props.item.room.name }}
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
                :items="school.teachers"
                item-text="name"
                item-value="id"
                label="Teacher"
                v-model="newLesson.teacherId"
                :rules="teacherRules"
                required
              )
              v-select(
                :items="school.rooms"
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

<style lang="scss" scoped>
.so-2-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
}
.so-lessons {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;
}
</style>

