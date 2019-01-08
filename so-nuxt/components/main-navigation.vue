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
v-list.so-main-menu.pt-0(dense v-if="isUser" dark)
  v-list-tile(nuxt to="/lessons")
    v-list-tile-action
      v-icon assignment
    v-list-tile-content
      v-list-tile-title {{ $t(`lessons.plural`) }}
  v-list-tile(nuxt to="/users")
    v-list-tile-action
      v-icon group
    v-list-tile-content
      v-list-tile-title {{ $t(`students.plural`) }}
  v-list-tile(nuxt to="/registrations")
    v-list-tile-action
      v-icon assignment
    v-list-tile-content
      v-list-tile-title {{ $t(`registrations.plural`) }}
  v-list-tile(nuxt to="/rates")
    v-list-tile-action
      v-icon attach_money
    v-list-tile-content
      v-list-tile-title {{ $t(`rates.plural`) }}
  v-list-tile(nuxt to="/teachers")
    v-list-tile-action
      v-icon school
    v-list-tile-content
      v-list-tile-title {{ $t(`teachers.plural`) }}
  v-list-tile(nuxt to="/places")
    v-list-tile-action
      v-icon place
    v-list-tile-content
      v-list-tile-title {{ $t(`places.plural`) }}
</template>
