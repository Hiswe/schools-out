<script>
const hours = Array.from({ length: 14 }).map((v, i) => {
  const hour = `${9 + i}`.padStart(2, `0`)
  return `${hour}`
})

export default {
  name: `so-home-admin`,
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
      school: {},
      nameRules: [v => !!v || `Name is required`],
    }
  },
  async created() {
    const { $axios } = this
    const [schools] = await Promise.all([$axios.$get(`/schools`)])
    this.schools = schools
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
      td: nuxt-link(:to="`/schools/${props.item.id}`") {{ props.item.name }}

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
