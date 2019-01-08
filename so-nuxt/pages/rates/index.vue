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
    async save(rate) {
      const { $axios } = this
      await $axios.$post(`/rates/${rate.id}`, rate)
    },
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
            .mt-3.title( slot="input") {{ $t(`rates.nameUpdate`) }}
            v-text-field(
              slot="input"
              v-model="props.item.name"
              label="Edit"
              single-line
              autofocus
            )
        td
          v-edit-dialog(
            :return-value.sync="props.item.price"
            @save="save(props.item)"
            large
            lazy
            persistent
            save-text="ok"
            :cancel-text="$t(`cancel`)"
          )
            div {{ props.item.price }}
            .mt-3.title( slot="input") {{ $t(`rates.priceUpdate`) }}
            v-text-field(
              slot="input"
              v-model="props.item.price"
              label="Edit"
              single-line
              autofocus
            )
        td
          v-edit-dialog(
            :return-value.sync="props.item.weeklyLessons"
            @save="save(props.item)"
            large
            lazy
            persistent
            save-text="ok"
            :cancel-text="$t(`cancel`)"
          )
            div {{ props.item.weeklyLessons }}
            .mt-3.title( slot="input") {{ $t(`rates.lessonsUpdate`) }}
            v-text-field(
              slot="input"
              v-model="props.item.weeklyLessons"
              label="Edit"
              single-line
              autofocus
            )

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
