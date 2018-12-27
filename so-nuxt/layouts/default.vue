<script>
import SoMainNavigation from '@/components/main-navigation.vue'

export default {
  name: `so-layout`,
  components: {
    SoMainNavigation,
  },
}
</script>

<template lang="pug">
v-app
  so-main-navigation
  v-toolbar(app)
  v-content
    v-container(fluid)
      nuxt
  //- v-footer(app)
</template>

