<script>
export default {
  name: `so-page-inscriptions-list`,
  data() {
    return {
      inscriptions: [],
      users: [],
      lessons: [],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [inscriptions, users, lessons] = await Promise.all([
      $axios.$get(`/inscriptions`),
      $axios.$get(`/users`),
      $axios.$get(`/lessons`),
    ])
    return { inscriptions, users, lessons }
  },
}
</script>

<template lang="pug">
div
  h1 inscriptions
  //- <v-date-picker
  //-   v-model="date"
  //-   type="month"
  //-   no-title
  //-   scrollable
  //- >
  //-   <v-spacer></v-spacer>
  //-   <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
  //-   <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
  //- </v-date-picker>

</template>
