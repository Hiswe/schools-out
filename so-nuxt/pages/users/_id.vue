<script>
export default {
  name: `so-page-user`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      user: {},
      lessons: [],
      rates: [],
      registrationValid: true,
      newRegistration: {},
      headers: [
        {
          text: `lesson name`,
          align: `left`,
          value: `lesson.name`,
        },
        {
          text: `rate name`,
          align: `left`,
          sortable: false,
        },
        {
          text: `rate price`,
          align: `right`,
          value: `lesson.price`,
        },
        {
          text: `teacher`,
          align: `left`,
          value: `lesson.teacher.name`,
        },
      ],
      lessonRules: [v => !!v || `Lesson is required`],
      rateRules: [v => !!v || `Rate is required`],
      lessonsRules: [
        v => !!v || `lessons nº is required`,
        v => v > 0 || `lessons can't be null`,
      ],
      rateName(rate) {
        return `${rate.name} - ${rate.weeklyLessons}/w - ${rate.price}€`
      },
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const [user, lessons, rates] = await Promise.all([
      $axios.$get(`/users/${id}`),
      $axios.$get(`/lessons`),
      $axios.$get(`/rates`),
    ])
    return { user, lessons, rates }
  },
  methods: {
    async submitRegistration() {
      if (!this.$refs.registrationForm.validate()) return
      const registrationUri = `/users/${this.user.id}/registrations`
      const registration = await this.$axios.$post(
        registrationUri,
        this.newRegistration,
      )
      this.user.registrations.push(registration)
      this.$refs.registrationForm.reset()
    },
    clearRegistration() {
      this.$refs.registrationForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`students.withName`, {name: user.name}) }}

  .so-content: .so-table-form.mt-4
    div
      h2.display-5.mb-2 registrations
      v-data-table.elevation-1(
        :headers="headers"
        :items="user.registrations"
      )
        template( slot="items" slot-scope="props")
          td {{ props.item.lesson.name }}
          td {{ props.item.rate.name }} - {{ props.item.rate.weeklyLessons }}/w
          td.text-xs-right {{ props.item.rate.price }}
          td {{ props.item.lesson.teacher.name }}
    v-form(
      ref="registrationForm"
      v-model="registrationValid"
    )
      h2.display-5.mb-2 new registrations
      v-card
        v-card-text
          v-select(
            :items="lessons"
            item-text="name"
            item-value="id"
            label="Lesson"
            v-model="newRegistration.lessonId"
            :rules="lessonRules"
            required
          )
          v-text-field(
          v-model.number="newRegistration.duration"
          label="nº of lessons"
          type="number"
          :rules="lessonsRules"
          required
        )
          v-select(
            :items="rates"
            :item-text="rateName"
            item-value="id"
            label="Rate"
            v-model="newRegistration.rateId"
            :rules="rateRules"
            required
          )
        v-card-actions
          v-btn(
            :disabled="!registrationValid"
            @click="submitRegistration"
            color="primary"
          ) Create registration
          v-btn(@click="clearRegistration") {{$t(`clear`)}}

</template>

