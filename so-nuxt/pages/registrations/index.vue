<script>
import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-page-registrations-list`,
  data() {
    return {
      registrations: [],
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
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [registrations] = await Promise.all([$axios.$get(`/registrations`)])
    return { registrations }
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
      //- template( slot="items" slot-scope="props")
      //-   td
      //-     nuxt-link(:to="`/students/${props.item.user.id}`") {{ props.item.user.name }}
      //-   td
      //-     nuxt-link(:to="`/lessons/${props.item.lesson.id}`") {{ props.item.lesson.name }}
      //-   td {{ props.item.lesson.dayName }}
      //-   td {{ props.item.lesson.startHour }}
      //-   td {{ props.item.lesson.place.name }}
      //-   td {{ props.item.rate.nameFull }}

  v-btn(
    fixed
    dark
    fab
    bottom
    right
    color="pink"
    nuxt
    to="/registrations/new"

  ): v-icon assignment_ind
</template>
