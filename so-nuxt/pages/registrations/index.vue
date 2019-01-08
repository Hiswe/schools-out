<script>
import { rowsPerPageItems } from '~/helpers/tables'
import SoRegistrationForm from '~/components/registration-form'

export default {
  name: `so-page-registrations-list`,
  components: {
    SoRegistrationForm,
  },
  data() {
    return {
      registrations: [],
      newRegistration: {},
      rowsPerPageItems,
      registrationHeaders: [
        {
          text: `students.tableName`,
          align: `left`,
          value: `user.name`,
        },
        {
          text: `lessons.tableName`,
          align: `left`,
          value: `lesson.name`,
        },
        {
          text: `day`,
          align: `left`,
          value: `lesson.dayName`,
        },
        {
          text: `schedule`,
          align: `left`,
          value: `lesson.startHour`,
        },
        {
          text: `places.singular`,
          align: `left`,
          value: `lesson.place.name`,
        },
        {
          text: `rates.singular`,
          align: `left`,
          value: `lesson.rate.nameFull`,
        },
      ],
      dialog: false,
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [registrations] = await Promise.all([$axios.$get(`/registrations`)])
    return { registrations }
  },
  methods: {
    async onSubmit(newRegistration) {
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
    h1.display-1 {{ $t(`registrations.plural`) }}

  .so-content
    v-data-table.elevation-1(
      :rows-per-page-items="rowsPerPageItems"
      :headers="registrationHeaders"
      :items="registrations"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}
      template( slot="items" slot-scope="props")
        td
          nuxt-link(:to="`/users/${props.item.user.id}`") {{ props.item.user.name }}
        td
          nuxt-link(:to="`/lessons/${props.item.lesson.id}`") {{ props.item.lesson.name }}
        td {{ props.item.lesson.dayName }}
        td {{ props.item.lesson.startHour }}
        td {{ props.item.lesson.place.name }}
        td {{ props.item.rate.nameFull }}

  v-btn(fixed dark fab bottom right color="pink"
    @click="dialog = !dialog"
  ): v-icon assignment_ind

  v-dialog(v-model="dialog" max-width="600px")
    so-registration-form(
      v-model="newRegistration"
      ref="form"
      @submit="onSubmit"
    )
</template>
