<script>
export default {
  name: `so-main-navigation`,
}
</script>

<template lang="pug">

v-navigation-drawer(permanent app dark)
  v-toolbar(flat)
    v-list
      v-list-tile(nuxt to="/")
        v-list-tile-title.title School's out
  v-divider
  v-list.pt-0(dense)
    v-list-tile(nuxt to="/schools")
      v-list-tile-action
        v-icon account_balance
      v-list-tile-content
        v-list-tile-title schools
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
</template>
