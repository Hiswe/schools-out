<script>
import merge from 'lodash.merge'

import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-page-students-list`,
  data() {
    return {
      dialog: false,
      birthdayCal: false,

      students: [],
      studentTypes: [],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `email`,
          align: `left`,
          value: `email`,
        },
      ],
      valid: true,
      newStudent: {},
      rowsPerPageItems,
      nameRules: [
        v => !!v || `Name is required`,
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      typeRules: [v => !!v || `Type is required`],
    }
  },
  async asyncData({ $axios, params }) {
    const [students, studentTypes] = await Promise.all([
      $axios.$get(`/students`),
      $axios.$get(`/students/types`),
    ])
    return { students, studentTypes }
  },
  watch: {
    // https://vuetifyjs.com/en/components/date-pickers#date-pickers-birthday-picker
    birthdayCal(val) {
      if (!val) return
      this.$nextTick(() => (this.$refs.birthdayPicker.activePicker = `YEAR`))
    },
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const studentBody = merge({ type: this.studentTypes[0] }, this.newStudent)
      const student = await this.$axios.$post(`/students`, studentBody)
      console.log(student)

      this.students.push(student)
      this.dialog = false
      this.$refs.form.reset()
    },
    clear() {
      this.$refs.form.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`students.plural`) }}

  .so-content
    v-data-table.elevation-1(
      :headers="headers"
      :items="students"
      :rows-per-page-items="rowsPerPageItems"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}
      template( slot="items" slot-scope="props")
        td
          nuxt-link(:to="`/students/${props.item.id}`") {{ props.item.name }}
        td {{ props.item.email }}
        //- td {{ props.item.school.name }}

    v-dialog(v-model="dialog" max-width="600px")
      v-form(
        ref="form"
        v-model="valid"
      )
        v-card
          v-card-title(primary-title)
            .headline {{ $t(`students.new`) }}
          v-card-text
            .so-student-form
              v-text-field(
                v-model="newStudent.name"
                label="Name"
                :rules="nameRules"
                required
              )
              v-text-field(
                v-model="newStudent.email"
                label="Email"
                :rules="emailRules"
                required
              )
              v-menu.so-form-registration__start(
                ref="menuBirthday"
                :close-on-content-click="false"
                v-model="birthdayCal"
                :nudge-right="40"
                :return-newStudent.sync="newStudent.birthday"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              )
                v-text-field(
                  slot="activator"
                  v-model="newStudent.birthday"
                  :label="$t(`students.birthday`)"
                  prepend-icon="event"
                  readonly
                )
                v-date-picker(
                  ref="birthdayPicker"
                  v-model="newStudent.birthday"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                )
                  v-spacer
                  v-btn( flat color="primary" @click="birthdayCal = false") {{ $t('close') }}
                  v-btn( flat color="primary" @click="$refs.menuBirthday.save(newStudent.birthday)") OK

              //- v-select(
              //-   :items="studentTypes"
              //-   label="Type"
              //-   v-model="newStudent.type"
              //-   :rules="typeRules"
              //-   required
              //- )
          v-card-actions
            v-btn(
              :disabled="!valid"
              @click="submit"
              color="primary"
            ) {{ $t(`students.create`) }}
            v-btn(@click="clear") {{ $t(`clear`) }}
  v-btn(
    fixed
    dark
    fab
    bottom
    right
    color="pink"
    @click="dialog = !dialog"
  )
    v-icon person_add
</template>

