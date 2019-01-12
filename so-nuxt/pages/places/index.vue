<script>
import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-page-places`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      dialog: false,
      places: [],
      placeValid: true,
      rowsPerPageItems,
      newPlace: {},
      nameRules: [v => !!v || `Name is required`],
      capacityRules: [
        v => !!v || `Capacity is required`,
        v => v > 0 || `capacity can't be null`,
      ],
      placeHeaders: [
        {
          text: `places.name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `places.capacity`,
          align: `left`,
          value: `capacity`,
        },
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
    async save(place) {
      const { $axios } = this
      await $axios.$post(`/places/${place.id}`, place)
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{ $t(`places.plural`) }}
  .so-content
    v-data-table.elevation-1(
      :rows-per-page-items="rowsPerPageItems"
      :headers="placeHeaders"
      :items="places"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}
      template(slot="items" slot-scope="props")
        td
          v-edit-dialog(
            :return-value.sync="props.item.name"
            @save="save(props.item)"
            large
            lazy
            persistent
            save-text="ok"
            :cancel-text="$t(`cancel`)"
          )
            div {{ props.item.name }}
            .mt-3.title( slot="input") {{ $t(`places.name`) }}
            v-text-field(
              slot="input"
              v-model="props.item.name"
              label="Edit"
              single-line
              autofocus
            )
        td
          v-edit-dialog(
            :return-value.sync="props.item.capacity"
            @save="save(props.item)"
            large
            lazy
            persistent
            save-text="ok"
            :cancel-text="$t(`cancel`)"
          )
            div {{ props.item.capacity }}
            .mt-3.title( slot="input") {{ $t(`places.capacity`) }}
            v-text-field(
              slot="input"
              v-model="props.item.capacity"
              label="Edit"
              single-line
              autofocus
            )

  v-btn(fixed dark fab bottom right color="pink"
    @click="dialog = !dialog"
  ): v-icon assignment_ind

  v-dialog(v-model="dialog" max-width="600px")
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
            :label="$t(`name`)"
            :rules="nameRules"
            required
          )
          v-text-field(
            v-model.number="newPlace.capacity"
            :label="$t(`places.capacity`)"
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

