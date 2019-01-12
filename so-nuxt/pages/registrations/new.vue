<script>
import * as soHelpers from '@schools-out/helpers'

import { SoGridRates, SoRatesSelect } from '~/components/rates'
import { SoLessonsList } from '~/components/lessons'

export default {
  name: `so-page-registrations-new`,
  components: {
    SoGridRates,
    SoRatesSelect,
    SoLessonsList,
  },
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
  computed: {
    gridRates() {
      return soHelpers.ratesTableToGrid(this.rates)
    },
    selectedRate() {
      if (!this.newRegistration.rateId) return false
      return this.rates.find(rate => rate.id === this.newRegistration.rateId)
    },
    lessonsCumulatedHours() {
      if (!this.newRegistration.lessons) return 0
      return this.newRegistration.lessons.reduce((t, l) => t + l.duration, 0)
    },
    weeklyHours() {
      if (!this.selectedRate) return 1
      return this.selectedRate.weeklyHours
    },
    hoursProgress() {
      return (this.lessonsCumulatedHours / this.weeklyHours) * 100
    },
    hoursInvalid() {
      return this.lessonsCumulatedHours > this.weeklyHours
    },
    hoursGaugeColor() {
      return this.hoursInvalid
        ? `red`
        : this.lessonsCumulatedHours === this.weeklyHours
        ? `green`
        : `primary`
    },
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
      console.log(newRegistration)
      // const registration = await this.$axios.$post(
      //   `/registrations`,
      //   newRegistration,
      // )
      // this.$refs.form.reset()
    },
    // rateId
    clear() {
      this.$refs.registrationForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`registrations.new`) }}

  v-form.so-content(
    ref="registrationForm"
    v-model="formValid"
  ): .so-page-registration
    v-card
      v-card-title
        h4.title {{ $t(`students.singular` )}}
      v-divider
      v-card-text
        v-select.so-form-registration__student(
          :items="students"
          item-text="name"
          :return-object="true"
          v-model="newRegistration.user"
          :rules="studentRules"
          :placeholder="$t(`students.pleaseSelect`)"
          single-line
          outline
          required
        )
        v-list(dense)
          v-list-tile(v-if="newRegistration.user")
            v-list-tile-content.grey--text.font-weight-medium {{ $t(`students.birthday`) }}
            v-list-tile-content.align-end
                | {{newRegistration.user.birthday}}
    so-rates-select(
      :class="newRegistration.user ? ``: `is-deactivated`"
      :gridRates="gridRates"
      v-model="newRegistration.rateId"
    )
    v-card(
      :class="newRegistration.rateId ? ``: `is-deactivated`"
    )
      v-card-title
        h4.title {{ $t(`lessons.plural` )}}
      v-divider
      v-card-text
        v-select.so-form-registration__lesson(
          :items="lessons"
          item-text="name"
          :return-object="true"
          :placeholder="$t(`lessons.pleaseSelect`)"
          v-model="newRegistration.lessons"
          :rules="lessonRules"
          single-line
          outline
          required
          multiple
        )
        .so-form-registration__hours(
          v-if="newRegistration.rateId"
        )
          h5.title.text-xs-center.pb-3 {{ $t(`hoursPerWeek`) }}
          v-progress-circular.so-form-registration__hours-gauge(
            :rotate="-90"
            :size="140"
            :width="15"
            :value="hoursProgress"
            :color="hoursGaugeColor"
          )
            span.title
              | {{ lessonsCumulatedHours | duration }}
              br
              span.black--text  {{ weeklyHours | duration }}
    v-card(
      :class="newRegistration.lessons ? ``: `is-deactivated`"
    )
      v-card-title
        h4.title {{ $t(`duration`) }}
      v-divider
      v-card-text
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
          @click="onSubmit"
          color="primary"
        ) {{ $t(`registrations.create`) }}
        v-btn(@click="clear") {{ $t(`clear`) }}
    so-lessons-list.so-page-registration___lessons(
      v-if="newRegistration.lessons"
      :lessons="newRegistration.lessons"
      hide-actions
    )
</template>

<style lang="scss" scoped>
.so-page-registration {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
.is-deactivated {
  opacity: 0.5;
  pointer-events: none;
}
.pouic,
.so-page-registration___lessons {
  grid-column: 1 / -1;
}
.so-form-registration__hours-gauge {
  margin: 0 auto;
  display: block;
}
</style>
