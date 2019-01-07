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
      users: [],
      lessons: [],
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
          text: `hour`,
          align: `left`,
          value: `lesson.startHour`,
        },
        {
          text: `rooms.singular`,
          align: `left`,
          value: `lesson.room.name`,
        },
      ],
      dialog: false,
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
        td {{ props.item.lesson.name }}
        td {{ props.item.lesson.dayName }}
        td {{ props.item.lesson.startHour }}
        td {{ props.item.lesson.room.name }}

  v-btn(fixed dark fab bottom right color="pink"
    @click="dialog = !dialog"
  ): v-icon assignment_ind

  v-dialog(v-model="dialog" max-width="600px")
    so-registration-form(
      v-model="newRegistration"
      ref="form"
      @submit="onSubmit"
    )
      //- v-form(
      //-   ref="form"
      //-   v-model="valid"
      //- )
      //-   v-card
      //-     v-card-title(primary-title)
      //-       .headline {{ $t(`registrations.new`) }}
      //-     v-card-text
      //-       .so-form-registration
      //-         //- v-text-field(
      //-         //-   v-model="user.name"
      //-         //-   label="Name"
      //-         //-   :rules="nameRules"
      //-         //-   required
      //-         //- )
      //-         //- v-text-field(
      //-         //-   v-model="user.email"
      //-         //-   label="Email"
      //-         //-   :rules="emailRules"
      //-         //-   required
      //-         //- )
      //-         v-select.so-form-registration__user(
      //-           :items="users"
      //-           item-text="name"
      //-           item-value="id"
      //-           :label="$t(`students.singular`)"
      //-           v-model="newRegistration.userId"
      //-           :rules="teacherRules"
      //-           required
      //-         )
      //-     v-card-actions
      //-       v-btn(
      //-         :disabled="!valid"
      //-         @click="submit"
      //-         color="primary"
      //-       ) {{ $t(`registrations.create`) }}
      //-       v-btn(@click="clear") {{ $t(`clear`) }}
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
