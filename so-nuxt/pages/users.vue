<script>
export default {
  name: `so-page-users-list`,
  data() {
    return {
      users: [],
      schools: [],
      userTypes: [],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `school`,
          align: `left`,
          value: `school.name`,
        },
      ],
      valid: true,
      user: {},
      nameRules: [
        v => !!v || `Name is required`,
        // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      schoolRules: [v => !!v || `School is required`],
      typeRules: [v => !!v || `Type is required`],
    }
  },
  async asyncData({ $axios, params }) {
    const [users, userTypes, schools] = await Promise.all([
      $axios.$get(`/users`),
      $axios.$get(`/users/types`),
      $axios.$get(`/schools`),
    ])
    return { users, schools, userTypes }
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) return console.log(`invalid form`)
      const user = await this.$axios.$post(`/users`, this.user)
      console.log(user)
      this.users.push(user)
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
  h1.display-2 Users
  v-form.mt-3(
    ref="form"
    v-model="valid"
  )
    v-card
      v-card-title(primary-title)
        .headline new user
      v-card-text
        .so-user-form
          v-text-field(
            v-model="user.name"
            label="Name"
            :rules="nameRules"
            required
          )
          v-text-field(
            v-model="user.email"
            label="Email"
            :rules="emailRules"
            required
          )
          v-select(
            :items="schools"
            item-text="name"
            item-value="id"
            label="School"
            v-model="user.schoolId"
            :rules="schoolRules"
            required
          )
          v-select(
            :items="userTypes"
            label="Type"
            v-model="user.type"
            :rules="typeRules"
            required
          )
      v-card-actions
        v-btn(
          :disabled="!valid"
          @click="submit"
          color="primary"
        ) Create user
        v-btn(@click="clear") clear
  v-data-table.elevation-1.mt-5(
    :headers="headers"
    :items="users"
  )
    template( slot="items" slot-scope="props")
      td {{ props.item.name }}
      td {{ props.item.school.name }}
</template>

<style lang="scss" scoped>
.so-user-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
}
</style>
