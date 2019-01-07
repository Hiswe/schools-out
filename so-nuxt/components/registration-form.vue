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
      beginCal: false,
      endCal: false,

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
        v-select.so-form-registration__student(
          :items="users"
          item-text="name"
          item-value="id"
          :label="$t(`students.singular`)"
          v-model="value.userId"
          :rules="studentRules"
          required
        )
        v-select.so-form-registration__lesson(
          :items="lessons"
          item-text="name"
          item-value="id"
          :label="$t(`lessons.singular`)"
          v-model="value.lessonId"
          :rules="lessonRules"
          required
        )
        v-select.so-form-registration__rates(
          :items="rates"
          item-text="nameFull"
          item-value="id"
          :label="$t(`rates.singular`)"
          v-model="value.rateId"
          :rules="rateRules"
          required
        )
        v-menu.so-form-registration__start(
          ref="menuBegin"
          :close-on-content-click="false"
          v-model="beginCal"
          :nudge-right="40"
          :return-value.sync="value.startAt"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        )
          v-text-field(
            slot="activator"
            v-model="value.startAt"
            :label="$t(`monthBegin`)"
            prepend-icon="event"
            readonly
          )
          v-date-picker(
            v-model="value.startAt"
            type="month"
            no-title
          )
            v-spacer
            v-btn( flat color="primary" @click="beginCal = false") {{ $t('close') }}
            v-btn( flat color="primary" @click="$refs.menuBegin.save(value.startAt)") OK

        v-menu.so-form-registration__end(
          ref="menuEnd"
          :close-on-content-click="false"
          v-model="endCal"
          :nudge-right="40"
          :return-value.sync="value.endAt"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        )
          v-text-field(
            slot="activator"
            v-model="value.endAt"
            :label="$t(`monthEnd`)"
            prepend-icon="event"
            readonly
          )
          v-date-picker(
            v-model="value.endAt"
            type="month"
            no-title
          )
            v-spacer
            v-btn( flat color="primary" @click="endCal = false") {{ $t('close') }}
            v-btn( flat color="primary" @click="$refs.menuEnd.save(value.endAt)") OK
    v-card-actions
      v-btn(
        :disabled="!formValid"
        @click="submit"
        color="primary"
      ) {{ $t(`registrations.create`) }}
      v-btn(@click="clear") {{ $t(`clear`) }}

</template>

<style lang="scss" scoped>
.so-form-registration {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}
.so-form-registration__student {
  grid-column: 1 / span 2;
}
</style>
