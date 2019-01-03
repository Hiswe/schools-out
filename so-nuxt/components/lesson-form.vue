<script>
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
      durations: [
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
      ],
      days: [
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
      ],
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
    v-card-title(primary-title)
      .headline {{ this.title }}
    v-card-text.so-form-lesson
      v-text-field.so-form-lesson__name(
        v-model="value.name"
        label="Name"
        :rules="nameRules"
        required
      )
      v-select.so-form-lesson__teacher(
        :items="teachers"
        item-text="name"
        item-value="id"
        label="Teacher"
        v-model="value.teacherId"
        :rules="teacherRules"
        required
      )
      v-select.so-form-lesson__room(
        :items="rooms"
        item-text="name"
        item-value="id"
        label="Rooms"
        v-model="value.roomId"
        :rules="roomRules"
        required
      )
      v-select.so-form-lesson__day(
        :items="days"
        label="Day"
        v-model="value.day"
        :rules="dayRules"
        required
      )
      //- v-select.so-form-lesson__start(
      //-   :items="days"
      //-   label="start at"
      //-   v-model="value.startAt"
      //-   :rules="dayRules"
      //-   required
      //- )
      v-select.so-form-lesson__duration(
        :items="durations"
        label="Duration"
        v-model="value.duration"
        :rules="durationRules"
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
.so-form-lesson__duration {
  grid-area: duration;
}
.so-form-lesson__day {
  grid-area: day;
}
</style>
