<script>
import { mapState, mapActions } from 'vuex'

import { LOGIN } from '~/store/user'

export default {
  name: `so-page-login`,
  layout: `authentication`,
  meta: {
    authForbidden: true,
  },
  data() {
    return {
      shools: [],
      user: {},
      schoolRules: [v => !!v || `School is required`],
      valid: true,
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const schools = await $axios.$get(`/login`)
    return { schools }
  },
  methods: {
    submit() {
      this.login(this.user)
    },
    ...mapActions(`user`, {
      login: LOGIN,
    }),
  },
}
</script>

<template lang="pug">
v-card.elevation-12
  v-toolbar( dark color="primary")
    v-toolbar-title Login form
  v-card-text
    v-form(ref="form" v-model="valid")
      v-select(
        :items="schools"
        item-text="name"
        item-value="id"
        label="School"
        v-model="user.id"
        :rules="schoolRules"
        required
      )
  v-card-actions
    v-spacer
    v-btn(
      color="primary"
      @click="submit"
      :disabled="!valid"
    ) Login
</template>
