<script>
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
      default: `lessons.new`,
    },
    submitText: {
      type: String,
      default: `add lesson`,
    },
  },
  data() {
    return {
      formValid: true,
      places: [],
      teachers: [],
      nameRules: [v => !!v || `Name is required`],
      teacherRules: [v => !!v || `Teacher is required`],
      placeRules: [v => !!v || `Place is required`],
      durationRules: [v => !!v || `duration is required`],
      dayRules: [v => !!v || `day is required`],
      startRules: [v => !!v || `start is required`],
      durations,
      days,
      allowedHours: v => v >= 9 && v <= 22,
      allowedMinutes: m => m % 5 === 0,
      hourPickerMenu: false,
    }
  },
  async created() {
    const { $axios } = this
    const [teachers, places] = await Promise.all([
      $axios.$get(`/teachers`),
      $axios.$get(`/places`),
    ])
    this.places = places
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
  v-model="formValid"
)
  v-card
    v-card-title(
      primary-title
      v-if="title"
    )
      .headline {{ $t(this.title) }}
    v-card-text.so-form-lesson
      v-text-field.so-form-lesson__name(
        v-model="value.name"
        :label="$t(`lessons.tableName`)"
        :rules="nameRules"
        required
      )
      v-select.so-form-lesson__teacher(
        :items="teachers"
        item-text="name"
        item-value="id"
        :label="$t(`teachers.singular`)"
        v-model="value.teacherId"
        :rules="teacherRules"
        required
      )
      v-select.so-form-lesson__place(
        :items="places"
        item-text="name"
        item-value="id"
        :label="$t(`places.singular`)"
        v-model="value.placeId"
        :rules="placeRules"
        required
      )
      v-select.so-form-lesson__day(
        :items="days"
        :label="$t(`day`)"
        v-model="value.day"
        :rules="dayRules"
        required
      )
      v-menu.so-form-lesson__start(
        ref="hourMenu"
        :close-on-content-click="false"
        v-model="hourPickerMenu"
        :nudge-right="40"
        :return-value.sync="value.startHour"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      )
        v-text-field(
          slot="activator"
          v-model="value.startHour"
          :label="$t(`lessons.startAt`)"
          prepend-icon="access_time"
          :rules="startRules"
          required
          readonly
        )
        v-time-picker(
          v-if="hourPickerMenu"
          v-model="value.startHour"
          full-width
          format="24hr"
          :allowedHours="allowedHours"
          :allowedMinutes="allowedMinutes"
          @change="$refs.hourMenu.save(value.startHour)"
        )
      v-select.so-form-lesson__duration(
        :items="durations"
        :label="$t(`lessons.duration`)"
        v-model="value.duration"
        :rules="durationRules"
        required
      )
    v-card-actions
      v-btn(
        :disabled="!formValid"
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
    'teacher  teacher   teacher place  place     place'
    'day      day       start   start duration duration';
  grid-gap: 1rem;
}
.so-form-lesson__name {
  grid-area: name;
}
.so-form-lesson__teacher {
  grid-area: teacher;
}
.so-form-lesson__place {
  grid-area: place;
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
