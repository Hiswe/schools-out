<script>
import { mapGetters } from 'vuex'

import { IS_USER } from '~/store/user'

export default {
  name: `so-main-navigation`,
  computed: {
    ...mapGetters(`user`, {
      isUser: IS_USER,
    }),
  },
}
</script>

<template lang="pug">

v-navigation-drawer(
  app permanent dark
  v-if="isUser"
)
  v-toolbar(flat)
    v-list
      v-list-tile(nuxt to="/")
        v-list-tile-title.title School's out
  v-divider
  v-list.pt-0(dense)
    //- v-list-tile(nuxt to="/schools")
    //-   v-list-tile-action
    //-     v-icon account_balance
    //-   v-list-tile-content
    //-     v-list-tile-title schools
    v-list-tile(nuxt to="/users")
      v-list-tile-action
        v-icon group
      v-list-tile-content
        v-list-tile-title users
    v-list-tile(nuxt to="/teachers")
      v-list-tile-action
        v-icon school
      v-list-tile-content
        v-list-tile-title teachers
    v-list-tile(nuxt to="/rooms")
      v-list-tile-action
        v-icon meeting_room
      v-list-tile-content
        v-list-tile-title rooms
    v-list-tile(nuxt to="/prices")
      v-list-tile-action
        v-icon attach_money
      v-list-tile-content
        v-list-tile-title prices
    v-list-tile(nuxt to="/lessons")
      v-list-tile-action
        v-icon assignment
      v-list-tile-content
        v-list-tile-title lessons
</template>
