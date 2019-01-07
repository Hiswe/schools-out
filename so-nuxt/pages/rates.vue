<script>
export default {
  name: `so-page-rates`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      rates: [],
      rateValid: true,
      newRate: {},
      nameRules: [v => !!v || `Name is required`],
      priceRules: [
        v => !!v || `price is required`,
        v => v > 0 || `price can't be null`,
      ],
      sessionsRules: [
        v => !!v || `sessions is required`,
        v => v > 0 || `sessions can't be null`,
      ],
      headers: [
        {
          text: `name`,
          align: `left`,
          value: `name`,
        },
        {
          text: `price`,
          value: `price`,
        },
        {
          text: `lessons/week`,
          value: `weeklyLessons`,
        },
      ],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [rates] = await Promise.all([$axios.$get(`/rates`)])
    return { rates }
  },
  methods: {
    async submitRate() {
      if (!this.$refs.rateForm.validate()) return
      const rate = await this.$axios.$post(`/rates`, this.newRate)
      this.rates.push(rate)
      this.$refs.rateForm.reset()
    },
    clearRate() {
      this.$refs.rateForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 rates

  .so-content: .so-table-form
    v-data-table.elevation-1(
      :headers="headers"
      :items="rates"
    )
      template( slot="items" slot-scope="props")
        td {{ props.item.name }}
        td {{ props.item.price }}
        td {{ props.item.weeklyLessons }}
    v-form(
      ref="rateForm"
      v-model="rateValid"
    )
      v-card
        v-card-title(primary-title)
          .headline new rate
        v-card-text.so-form-rate
          v-text-field.so-form-rate__name(
            v-model="newRate.name"
            label="Name"
            :rules="nameRules"
            required
          )
          v-text-field(
            v-model.number="newRate.price"
            label="price"
            type="number"
            :rules="priceRules"
            required
          )
          v-text-field(
            v-model.number="newRate.weeklyLessons"
            label="lessons/week"
            type="number"
            :rules="sessionsRules"
            required
          )
        v-card-actions
          v-btn(
            :disabled="!rateValid"
            @click="submitRate"
            color="primary"
          ) add rate
          v-btn(@click="clearRate") clear
</template>

<style lang="scss" scoped>
.so-form-rate {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}
.so-form-rate__name {
  grid-column: 1 / span 2;
}
</style>
