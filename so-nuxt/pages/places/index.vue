<script>
export default {
  name: `so-page-places`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      places: [],
      placeValid: true,
      newPlace: {},
      nameRules: [v => !!v || `Name is required`],
      capacityRules: [
        v => !!v || `Capacity is required`,
        v => v > 0 || `capacity can't be null`,
      ],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [places] = await Promise.all([$axios.$get(`/places`)])
    return { places }
  },
  methods: {
    async submitPlace() {
      if (!this.$refs.placeForm.validate()) return console.log(`invalid form`)
      const placeUri = `/places`
      const place = await this.$axios.$post(placeUri, this.newPlace)
      this.places.push(place)
      this.$refs.placeForm.reset()
    },
    clearPlace() {
      this.$refs.placeForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`places.plural`) }}
  .so-content: .so-table-form
    v-card
      v-card-title(primary-title)
        .headline existing places
      v-card-text
        v-list(
          two-line
          v-if="places.length"
        )
          v-list-tile(
            v-for="place in places"
            :key="place.id"
          ): v-list-tile-content
            v-list-tile-title {{place.name}}
            v-list-tile-sub-title
              span.primary--text {{place.capacity}}
              |
              | people

    v-form(
      ref="placeForm"
      v-model="placeValid"
    )
      v-card
        v-card-title(primary-title)
          .headline {{ $t(`places.new`) }}
        v-card-text
          v-text-field(
            v-model="newPlace.name"
            label="Name"
            :rules="nameRules"
            required
          )
          v-text-field(
            v-model.number="newPlace.capacity"
            label="People capacity"
            type="number"
            :rules="capacityRules"
            required
          )
        v-card-actions
          v-btn(
            :disabled="!placeValid"
            @click="submitPlace"
            color="primary"
          ) {{ $t(`places.create`) }}
          v-btn(@click="clearPlace") {{ $t(`clear`) }}

</template>

