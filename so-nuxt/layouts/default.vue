<script>
import { mapActions } from 'vuex'

import SoMainNavigation from '@/components/main-navigation.vue'
import { LOGOUT } from '~/store/user'

export default {
  name: `so-layout`,
  components: {
    SoMainNavigation,
  },
  methods: {
    ...mapActions(`user`, {
      logout: LOGOUT,
    }),
  },
}
</script>

<template lang="pug">
v-app
  so-main-navigation
  v-toolbar(app)
    v-spacer
    v-tooltip(bottom)
      v-btn(
        @click="logout"
        slot="activator"
        flat
        icon
        color="primary"
      ): v-icon power_settings_new
      span logout
  v-content
    v-container(fluid)
      nuxt
  //- v-footer(app)
</template>

<style lang="scss">
.so-table-form {
  display: grid;
  grid-template-columns: 1fr 450px;
  grid-gap: 2rem;
}
</style>
