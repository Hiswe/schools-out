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
v-app.so-app
  nuxt-link.so-logo.primary(to="/")
    span.white--text School's out
  so-main-navigation
  .so-logout
    v-tooltip(bottom)
      v-btn(
        @click="logout"
        slot="activator"
        flat
        icon
        color="primary"
      ): v-icon power_settings_new
      span logout
  nuxt
</template>

<style lang="scss">
.so-table-form {
  display: grid;
  grid-template-columns: 1fr 450px;
  grid-gap: 2rem;
}
.so-app .application--wrap {
  all: unset;
  display: grid;
  grid-template-columns: 250px 1fr 50px;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    'logo top-bar logout'
    'left-menu content content';
  width: 100%;
  grid-gap: 0;
  min-height: 100vh;
}

// fix vuetify regression while not using layout or removing tyles from .application--wrap
*,
*::before,
*::after {
  box-sizing: border-box;
}

.so-logo {
  grid-area: logo;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.so-logout {
  grid-area: logout;
}
.so-main-menu {
  grid-area: left-menu;
}
.so-wrapper {
  display: contents;
}
.so-content {
  grid-area: content;
  padding: 2rem;
}
.so-top-bar {
  grid-area: top-bar;
  padding-left: 2rem;
  display: flex;
  align-items: center;
}
</style>
