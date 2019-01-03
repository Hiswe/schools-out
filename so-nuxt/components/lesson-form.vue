<script>
const hours = [
  { text: `9h00`, value: `09:00` },
  { text: `9h30`, value: `09:30` },
  { text: `10h00`, value: `10:00` },
  { text: `10h30`, value: `10:30` },
  { text: `11h00`, value: `11:00` },
  { text: `11h30`, value: `11:30` },
  { text: `12h00`, value: `12:00` },
  { text: `12h30`, value: `12:30` },
  { text: `13h00`, value: `13:00` },
  { text: `13h30`, value: `13:30` },
  { text: `14h00`, value: `14:00` },
  { text: `14h30`, value: `14:30` },
  { text: `15h00`, value: `15:00` },
  { text: `15h30`, value: `15:30` },
  { text: `16h00`, value: `16:00` },
  { text: `16h30`, value: `16:30` },
  { text: `17h00`, value: `17:00` },
  { text: `17h30`, value: `17:30` },
  { text: `18h00`, value: `18:00` },
  { text: `18h30`, value: `18:30` },
  { text: `19h00`, value: `19:00` },
  { text: `19h30`, value: `19:30` },
  { text: `20h00`, value: `20:00` },
  { text: `20h30`, value: `20:30` },
  { text: `21h00`, value: `21:00` },
  { text: `21h30`, value: `21:30` },
  { text: `22h00`, value: `22:00` },
  { text: `22h30`, value: `22:30` },
]
const durations = [
  {
    text: `30min`,
    value: 0.5,
  },
  {
    text: `1h`,
    value: 1,
  },
  {
    text: `1h30`,
    value: 1.5,
  },
  {
    text: `2h`,
    value: 2,
  },
]
const days = [
  {
    text: `monday`,
    value: 1,
  },
  {
    text: `tuesday`,
    value: 2,
  },
  {
    text: `wednesday`,
    value: 3,
  },
  {
    text: `thursday`,
    value: 4,
  },
  {
    text: `friday`,
    value: 5,
  },
  {
    text: `saturday`,
    value: 6,
  },
  {
    text: `sunday`,
    value: 0,
  },
]

export default {
  name: `so-lesson-form`,
  props: {
    value: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: `new lesson`,
    },
    submitText: {
      type: String,
      default: `add lesson`,
    },
  },
  data() {
    return {
      lessonValid: true,
      rooms: [],
      teachers: [],
      nameRules: [v => !!v || `Name is required`],
      teacherRules: [v => !!v || `Teacher is required`],
      roomRules: [v => !!v || `Room is required`],
      durationRules: [v => !!v || `duration is required`],
      dayRules: [v => !!v || `day is required`],
      startRules: [v => !!v || `start is required`],
      durations,
      days,
      hours,
    }
  },
  async created() {
    const [teachers, rooms] = await Promise.all([
      this.$axios.$get(`/teachers`),
      this.$axios.$get(`/rooms`),
    ])
    this.rooms = rooms
    this.teachers = teachers
  },
  methods: {
    reset() {
      this.$refs.lessonForm.reset()
    },
    submitLesson() {
      if (!this.$refs.lessonForm.validate()) return
      this.$emit(`submit`, this.value)
    },
    clearLesson() {
      this.$refs.lessonForm.reset()
    },
  },
}
</script>

<template lang="pug">
v-form(
  ref="lessonForm"
  v-model="lessonValid"
)
  v-card
    v-card-title(
      primary-title
      v-if="title"
    )
      .headline {{ this.title }}
    v-card-text.so-form-lesson
      v-text-field.so-form-lesson__name(
        v-model="value.name"
        label="lesson name"
        :rules="nameRules"
        required
      )
      v-select.so-form-lesson__teacher(
        :items="teachers"
        item-text="name"
        item-value="id"
        label="teacher"
        v-model="value.teacherId"
        :rules="teacherRules"
        required
      )
      v-select.so-form-lesson__room(
        :items="rooms"
        item-text="name"
        item-value="id"
        label="room"
        v-model="value.roomId"
        :rules="roomRules"
        required
      )
      v-select.so-form-lesson__day(
        :items="days"
        label="day"
        v-model="value.day"
        :rules="dayRules"
        required
      )
      v-select.so-form-lesson__start(
        :items="hours"
        label="start at"
        v-model="value.startHour"
        :rules="startRules"
        required
      )
      v-select.so-form-lesson__duration(
        :items="durations"
        label="duration"
        v-model="value.duration"
        :rules="durationRules"
        required
      )
    v-card-actions
      v-btn(
        :disabled="!lessonValid"
        @click="submitLesson"
        color="primary"
      ) {{ submitText }}
      v-btn(@click="clearLesson") clear
</template>

<style lang="scss" scoped>
.so-form-lesson {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    'name     name      name    name  name     name'
    'teacher  teacher   teacher room  room     room'
    'day      day       start   start duration duration';
  grid-gap: 1rem;
}
.so-form-lesson__name {
  grid-area: name;
}
.so-form-lesson__teacher {
  grid-area: teacher;
}
.so-form-lesson__room {
  grid-area: room;
}
.so-form-lesson__day {
  grid-area: day;
}
.so-form-lesson__start {
  grid-area: start;
}
.so-form-lesson__duration {
  grid-area: duration;
}
</style>
