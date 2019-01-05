<script>
import { mapGetters } from 'vuex'

import { IS_ADMIN } from '~/store/user'
import SoHomeSchool from '~/components/home-school.vue'
import SoHomeAdmin from '~/components/home-admin.vue'

export default {
  name: `so-page-home`,
  components: {
    SoHomeSchool,
    SoHomeAdmin,
  },
  meta: {
    authRequired: true,
  },
  computed: {
    ...mapGetters(`user`, {
      isAdmin: IS_ADMIN,
    }),
  },
}
</script>

<template lang="pug">
div
  so-home-school(v-if="!isAdmin")
  so-home-admin(v-if="isAdmin")
</template>
