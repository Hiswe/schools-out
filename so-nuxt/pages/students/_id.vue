<script>
import merge from 'lodash.merge'

export default {
  name: `so-page-student`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      student: {},
      lessons: [],
      rates: [],
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
      rateName(rate) {
        return `${rate.name} - ${rate.weeklyHours}/w - ${rate.price}€`
      },
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const [student, lessons, rates] = await Promise.all([
      $axios.$get(`/students/${id}`),
      $axios.$get(`/lessons`),
      $axios.$get(`/rates`),
    ])
    return { student, lessons, rates }
  },
  methods: {
    async submitRegistration() {
      if (!this.$refs.registrationForm.validate()) return
      const registrationUri = `/registrations`
      const registrationBody = merge(
        {
          studentId: this.student.id,
        },
        this.newRegistration,
      )
      const registration = await this.$axios.$post(
        registrationUri,
        registrationBody,
      )
      this.student.registrations.push(registration)
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
    h1.display-1 {{ $t(`students.withName`, {name: student.name}) }}

  .so-content: .so-table-form.mt-4
    div
      h2.display-5.mb-2 {{ $t(`registrations.plural`) }}
      v-data-table.elevation-1(
        :headers="headers"
        :items="student.registrations"
      )
        template( slot="items" slot-scope="props")
          td {{ props.item.lesson.name }}
          td {{ props.item.rate.name }} - {{ props.item.rate.weeklyHours }}/w
          td.text-xs-right {{ props.item.rate.price }}
          td {{ props.item.lesson.teacher.name }}
</template>

