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
      inscriptionValid: true,
      newInscription: {},
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
    async submitInscription() {
      if (!this.$refs.inscriptionForm.validate()) return
      const inscriptionUri = `/users/${this.user.id}/inscriptions`
      const inscription = await this.$axios.$post(
        inscriptionUri,
        this.newInscription,
      )
      this.user.inscriptions.push(inscription)
      this.$refs.inscriptionForm.reset()
    },
    clearInscription() {
      this.$refs.inscriptionForm.reset()
    },
  },
}
</script>

<template lang="pug">
div
  h1.display-2
    span.grey--text.text--darken-1 User:
    |
    | {{user.name}}
  .so-table-form.mt-4
    div
      h2.display-5.mb-2 inscriptions
      v-data-table.elevation-1(
        :headers="headers"
        :items="user.inscriptions"
      )
        template( slot="items" slot-scope="props")
          td {{ props.item.lesson.name }}
          td {{ props.item.rate.name }} - {{ props.item.rate.weeklyLessons }}/w
          td.text-xs-right {{ props.item.rate.price }}
          td {{ props.item.lesson.teacher.name }}
    v-form(
      ref="inscriptionForm"
      v-model="inscriptionValid"
    )
      h2.display-5.mb-2 new inscriptions
      v-card
        v-card-text
          v-select(
            :items="lessons"
            item-text="name"
            item-value="id"
            label="Lesson"
            v-model="newInscription.lessonId"
            :rules="lessonRules"
            required
          )
          v-text-field(
          v-model.number="newInscription.duration"
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
            v-model="newInscription.rateId"
            :rules="rateRules"
            required
          )
        v-card-actions
          v-btn(
            :disabled="!inscriptionValid"
            @click="submitInscription"
            color="primary"
          ) Create inscription
          v-btn(@click="clearInscription") clear

</template>

