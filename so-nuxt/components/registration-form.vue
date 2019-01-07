<script>
export default {
  name: `so-registration-form`,
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formValid: true,

      users: [],
      lessons: [],
      rates: [],

      studentRules: [v => !!v || `Student is required`],
      lessonRules: [v => !!v || `Lesson is required`],
      rateRules: [v => !!v || `Rate is required`],
      lessonsRules: [
        v => !!v || `lessons nº is required`,
        v => v > 0 || `lessons can't be null`,
      ],
      // durations,
      // days,
      // hours,
    }
  },
  async created() {
    const { $axios } = this
    const [users, lessons, rates] = await Promise.all([
      $axios.$get(`/users`),
      $axios.$get(`/lessons`),
      $axios.$get(`/rates`),
    ])
    this.users = users
    this.lessons = lessons
    this.rates = rates
  },
  methods: {
    reset() {
      this.$refs.registrationForm.reset()
    },
    submit() {
      if (!this.$refs.registrationForm.validate()) return
      this.$emit(`submit`, this.value)
    },
    clear() {
      this.reset()
    },
  },
}
</script>

<template lang="pug">
v-form(
  ref="registrationForm"
  v-model="formValid"
)
  v-card
    v-card-title(primary-title)
      .headline {{ $t(`registrations.new`) }}
    v-card-text
      .so-form-registration
        //- v-text-field(
        //-   v-model="user.name"
        //-   label="Name"
        //-   :rules="nameRules"
        //-   required
        //- )
        //- v-text-field(
        //-   v-model="user.email"
        //-   label="Email"
        //-   :rules="emailRules"
        //-   required
        //- )

        v-select.so-form-registration__user(
          :items="users"
          item-text="name"
          item-value="id"
          :label="$t(`students.singular`)"
          v-model="value.userId"
          :rules="studentRules"
          required
        )
        v-select(
          :items="lessons"
          item-text="name"
          item-value="id"
          :label="$t(`lessons.singular`)"
          v-model="value.lessonId"
          :rules="lessonRules"
          required
        )
        v-text-field(
          v-model.number="value.duration"
          label="nº of lessons"
          type="number"
          :rules="lessonsRules"
          required
        )
        v-select(
          :items="rates"
          :item-text="rateName"
          item-value="id"
          :label="$t(`rates.singular`)"
          v-model="value.rateId"
          :rules="rateRules"
          required
        )
    v-card-actions
      v-btn(
        :disabled="!formValid"
        @click="submit"
        color="primary"
      ) {{ $t(`registrations.create`) }}
      v-btn(@click="clear") {{ $t(`clear`) }}
</template>
