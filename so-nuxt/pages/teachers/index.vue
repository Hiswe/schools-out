<script>
export default {
  name: `so-page-teachers-list`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      dialog: false,
      teachers: [],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `email`,
          align: `left`,
          value: `email`,
        },
      ],
      valid: true,
      teacher: {},
      nameRules: [
        v => !!v || `Name is required`,
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  async asyncData({ $axios, params }) {
    const [teachers] = await Promise.all([$axios.$get(`/teachers`)])
    return { teachers }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const teacher = await this.$axios.$post(`/teachers`, this.teacher)
      this.teachers.push(teacher)
      this.$refs.form.reset()
      this.dialog = false
    },
    clear() {
      this.$refs.form.reset()
    },
  },
}
</script>

<template lang="pug">
div
  h1.display-2 Teachers
  v-dialog(v-model="dialog" max-width="600px")
    v-form.mt-3(
      ref="form"
      v-model="valid"
    )
      v-card
        v-card-title(primary-title)
          .headline new teacher
        v-card-text
          .so-teacher-form
            v-text-field(
              v-model="teacher.name"
              label="Name"
              :rules="nameRules"
              required
            )
            v-text-field(
              v-model="teacher.email"
              label="Email"
              :rules="emailRules"
              required
            )
        v-card-actions
          v-btn(
            :disabled="!valid"
            @click="submit"
            color="primary"
          ) Create teacher
          v-btn(@click="clear") clear
  v-data-table.elevation-1.mt-5(
    :headers="headers"
    :items="teachers"
  )
    template( slot="items" slot-scope="props")
      td
        nuxt-link(:to="`/teachers/${props.item.id}`") {{ props.item.name }}
      td {{ props.item.email }}
  v-btn(
    fixed
    dark
    fab
    bottom
    right
    color="pink"
    @click="dialog = !dialog"
  )
    v-icon person_add
</template>
