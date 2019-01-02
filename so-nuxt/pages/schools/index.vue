<script>
export default {
  name: `so-page-schools-list`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      schools: [],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
      ],
      valid: true,
      school: {
        name: ``,
      },
      nameRules: [
        v => !!v || `Name is required`,
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
    }
  },
  async asyncData({ $axios, params }) {
    const schools = await $axios.$get(`/schools`)
    return { schools }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const school = await this.$axios.$post(`/schools`, this.school)
      this.schools.push(school)
      this.$refs.form.reset()
    },
    clear() {
      this.$refs.form.reset()
    },
  },
}
</script>

<template lang="pug">
.so-page-schools.mt-3
  v-data-table.elevation-1(
    :headers="headers"
    :items="schools"
  )
    template( slot="items" slot-scope="props")
      td {{ props.item.name }}

  v-form(
    ref="form"
    v-model="valid"
  )
    v-card
      v-card-title(primary-title)
        .headline new school
      v-card-text
        v-text-field(
          v-model="school.name"
          label="Name"
          :rules="nameRules"
          required
        )
      v-card-actions
        v-btn(
          :disabled="!valid"
          @click="submit"
          color="primary"
        ) Create School
        v-btn(@click="clear") clear
</template>

<style lang="scss" scoped>
.so-page-schools {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 2rem;
}
</style>
