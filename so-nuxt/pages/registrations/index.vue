<script>
import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-page-registrations-list`,
  data() {
    return {
      registrations: [],
      users: [],
      lessons: [],
      rowsPerPageItems,
      registrationsHeaders: [
        {
          text: `students.tableName`,
          align: `left`,
          value: `user.name`,
        },
        // {
        //   text: ``,
        //   align: `left`,
        //   value: `room.name`,
        // },
        // {
        //   text: `teachers.singular`,
        //   align: `left`,
        //   value: `teacher.name`,
        // },
        // {
        //   text: `day`,
        //   align: `left`,
        //   // value: `teacher.name`,
        // },
        // {
        //   text: `begin`,
        //   align: `left`,
        //   value: `startHour`,
        // },
      ],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [registrations, users, lessons] = await Promise.all([
      $axios.$get(`/registrations`),
      $axios.$get(`/users`),
      $axios.$get(`/lessons`),
    ])
    return { registrations, users, lessons }
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
        //- td
        //-   nuxt-link(:to="`/lessons/${props.item.id}`")  {{ props.item.name }}
        td {{ props.item.user.name }}
        //- td {{ props.item.teacher.name }}
        //- td {{ props.item.dayName }}
        //- td {{ props.item.startHour }}
  //- <v-date-picker
  //-   v-model="date"
  //-   type="month"
  //-   no-title
  //-   scrollable
  //- >
  //-   <v-spacer></v-spacer>
  //-   <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
  //-   <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
  //- </v-date-picker>

</template>
