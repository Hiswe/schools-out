<script>
export default {
  name: `so-page-school`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      school: {},
      lessons: [],
      newPlace: {},
      newLesson: {},
      placeValid: true,
      lessonValid: true,
      nameRules: [v => !!v || `Name is required`],
      capacityRules: [
        v => !!v || `Capacity is required`,
        v => v > 0 || `capacity can't be null`,
      ],
      teacherRules: [v => !!v || `Teacher is required`],
      teacherHeaders: [
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
    }
  },
  async asyncData({ $axios, params }) {
    const { id } = params
    const [school] = await Promise.all([
      $axios.$get(`/schools/${id}`),
      // $axios.$get(`/schools/${id}/lessons`),
    ])
    return { school }
  },
  methods: {
    async submitPlace() {
      if (!this.$refs.placeForm.validate()) return console.log(`invalid form`)
      const placeUri = `/schools/${this.school.id}/places`
      const place = await this.$axios.$post(placeUri, this.newPlace)
      this.school.places.push(place)
      this.$refs.placeForm.reset()
    },
    clearPlace() {
      this.$refs.placeForm.reset()
    },
    async submitLesson() {
      if (!this.$refs.lessonForm.validate()) return console.log(`invalid form`)
      const lessonUri = `/schools/${this.school.id}/lessons`
      const lesson = await this.$axios.$post(lessonUri, this.newLesson)
      this.lessons.push(lesson)
      this.$refs.lessonForm.reset()
    },
    clearLesson() {
      this.$refs.lessonForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  h1.display-2
    span.grey--text.text--darken-1 School:
    |
    | {{school.name}}

  v-tabs(centered icons-and-text dark)
    v-tabs-slider
    v-tab(href="#students")
      | Students
      v-icon group
    v-tab(href="#teachers")
      | Teachers
      v-icon school
    v-tab(href="#prices")
      | Prices
      v-icon attach_money

    v-tab-item(value="students")
      v-data-table.elevation-1.mt-5(
        :headers="teacherHeaders"
        :items="school.students"
      )
        template( slot="items" slot-scope="props")
          td
            nuxt-link(:to="`/students/${props.item.id}`") {{ props.item.name }}
          td {{ props.item.email }}

    v-tab-item(value="teachers")
      v-data-table.elevation-1.mt-5(
        :headers="teacherHeaders"
        :items="school.teachers"
      )
        template( slot="items" slot-scope="props")
          td
            nuxt-link(:to="`/teachers/${props.item.id}`") {{ props.item.name }}
          td {{ props.item.email }}

    v-tab-item(value="prices")
      h2.display-3 prices

</template>

<style lang="scss" scoped>
.so-2-cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
}
</style>
