<script>
export default {
  name: `so-oage-registrations-new`,
  data() {
    return {
      newRegistration: {},

      formValid: true,
      beginCal: false,
      endCal: false,

      students: [],
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
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [students, lessons, rates] = await Promise.all([
      $axios.$get(`/students`),
      $axios.$get(`/lessons`),
      $axios.$get(`/rates`),
    ])
    return {
      students,
      lessons,
      rates,
    }
  },
  methods: {
    async onSubmit(newRegistration) {
      if (!this.$refs.registrationForm.validate()) return
      const registration = await this.$axios.$post(
        `/registrations`,
        newRegistration,
      )
      this.registrations.push(registration)
      this.$refs.form.reset()
      this.dialog = false
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`registrations.new`) }}

  .so-content
    v-form(
      ref="registrationForm"
      v-model="formValid"
    )
      v-card
        v-card-text
          .so-form-registration
            v-select.so-form-registration__student(
              :items="students"
              item-text="name"
              item-value="id"
              :label="$t(`students.singular`)"
              v-model="newRegistration.userId"
              :rules="studentRules"
              required
            )
            v-select.so-form-registration__lesson(
              :items="lessons"
              item-text="name"
              item-value="id"
              :label="$t(`lessons.singular`)"
              v-model="newRegistration.lessonId"
              :rules="lessonRules"
              required
            )
            v-select.so-form-registration__rates(
              :items="rates"
              item-text="nameFull"
              item-value="id"
              :label="$t(`rates.singular`)"
              v-model="newRegistration.rateId"
              :rules="rateRules"
              required
            )
            v-menu.so-form-registration__start(
              ref="menuBegin"
              :close-on-content-click="false"
              v-model="beginCal"
              :nudge-right="40"
              :return-newRegistration.sync="newRegistration.startAt"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            )
              v-text-field(
                slot="activator"
                v-model="newRegistration.startAt"
                :label="$t(`monthBegin`)"
                prepend-icon="event"
                readonly
              )
              v-date-picker(
                v-model="newRegistration.startAt"
                type="month"
                no-title
              )
                v-spacer
                v-btn( flat color="primary" @click="beginCal = false") {{ $t('close') }}
                v-btn( flat color="primary" @click="$refs.menuBegin.save(newRegistration.startAt)") OK

            v-menu.so-form-registration__end(
              ref="menuEnd"
              :close-on-content-click="false"
              v-model="endCal"
              :nudge-right="40"
              :return-newRegistration.sync="newRegistration.endAt"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            )
              v-text-field(
                slot="activator"
                v-model="newRegistration.endAt"
                :label="$t(`monthEnd`)"
                prepend-icon="event"
                readonly
              )
              v-date-picker(
                v-model="newRegistration.endAt"
                type="month"
                no-title
              )
                v-spacer
                v-btn( flat color="primary" @click="endCal = false") {{ $t('close') }}
                v-btn( flat color="primary" @click="$refs.menuEnd.save(newRegistration.endAt)") OK
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
