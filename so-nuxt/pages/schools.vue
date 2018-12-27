<script>
export default {
  name: `so-page-schools-list`,
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
    console.log(schools)
    return {}
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const school = await this.$axios.$post(`/schools`, this.school)
      console.log(school)
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
div
  h1 Schools
  v-form(
    ref="form"
    v-model="valid"
  )
    v-text-field(
      v-model="school.name"
      label="Name"
      :rules="nameRules"
      required
    )
    v-btn(
      :disabled="!valid"
      @click="submit"
    ) Create School
    v-btn(@click="clear") clear
  v-data-table(
    :headers="headers"
    :items="schools"
  )
    template( slot="items" slot-scope="props")
      td {{ props.item.name }}
</template>
