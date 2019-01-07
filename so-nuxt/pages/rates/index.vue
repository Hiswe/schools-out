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
          text: `lessons.perWeek`,
          value: `weeklyLessons`,
        },
      ],
      dialog: false,
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
    save() {},
    cancel() {},
    open(item) {
      console.log(item)
    },
    close() {},
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{$t(`rates.plural`)}}

  .so-content
    v-data-table.elevation-1(
      :headers="headers"
      :items="rates"
    )
      template(slot="headerCell" slot-scope="props")
        | {{ $t(props.header.text) }}

      template( slot="items" slot-scope="props")
        td {{ props.item.name }}
        td
          v-edit-dialog(
            :return-value.sync="props.item.price"
            large
            lazy
            persistent
            @save="save(props.item)"
            @cancel="cancel(props.item)"
            @open="open(props.item)"
            @close="close(props.item)"
          )
            div {{ props.item.price }}
            .mt-3.title( slot="input") Update Price
            v-text-field(
              slot="input"
              v-model="props.item.price"
              label="Edit"
              single-line
              counter
              autofocus
            )
        td {{ props.item.weeklyLessons }}

    v-btn(fixed dark fab bottom right color="pink"
      @click="dialog = !dialog"
    ): v-icon add

    v-dialog(v-model="dialog" max-width="600px")
      v-form(
        ref="rateForm"
        v-model="rateValid"
      )
        v-card
          v-card-title(primary-title)
            .headline {{ $t(`rates.new`) }}
          v-card-text.so-form-rate
            v-text-field.so-form-rate__name(
              v-model="newRate.name"
              :label="$t(`title`)"
              :rules="nameRules"
              required
            )
            v-text-field(
              v-model.number="newRate.price"
              :label="$t(`price`)"
              type="number"
              :rules="priceRules"
              required
            )
            v-text-field(
              v-model.number="newRate.weeklyLessons"
              :label="$t(`lessons.perWeek`)"
              type="number"
              :rules="sessionsRules"
              required
            )
          v-card-actions
            v-btn(
              :disabled="!rateValid"
              @click="submitRate"
              color="primary"
            ) {{$t(`rates.create`)}}
            v-btn(@click="clearRate") {{ $t(`clear`) }}
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
