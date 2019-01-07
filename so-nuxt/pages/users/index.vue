<script>
import merge from 'lodash.merge'

export default {
  name: `so-page-users-list`,
  data() {
    return {
      dialog: false,
      users: [],
      userTypes: [],
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
      user: {},
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
    const [users, userTypes] = await Promise.all([
      $axios.$get(`/users`),
      $axios.$get(`/users/types`),
    ])
    return { users, userTypes }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const userBody = merge({ type: this.userTypes[0] }, this.user)
      const user = await this.$axios.$post(`/users`, userBody)
      console.log(user)

      this.users.push(user)
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
      :items="users"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}
      template( slot="items" slot-scope="props")
        td
          nuxt-link(:to="`/users/${props.item.id}`") {{ props.item.name }}
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
            .so-user-form
              v-text-field(
                v-model="user.name"
                label="Name"
                :rules="nameRules"
                required
              )
              v-text-field(
                v-model="user.email"
                label="Email"
                :rules="emailRules"
                required
              )
              //- v-select(
              //-   :items="userTypes"
              //-   label="Type"
              //-   v-model="user.type"
              //-   :rules="typeRules"
              //-   required
              //- )
          v-card-actions
            v-btn(
              :disabled="!valid"
              @click="submit"
              color="primary"
            ) {{ $t(`students.create`) }}
            v-btn(@click="clear") {{$t(`clear`)}}
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


