<script>
import * as soHelpers from '@schools-out/helpers'

import { rowsPerPageItems } from '~/helpers/tables'

// console.log(soHelpers)

export default {
  name: `so-page-rates`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      rowsPerPageItems,
      rates: [],
      tags: [],
      rateValid: true,
      newRate: {},
      newTag: {},
      tabActive: null,
      nameRules: [v => !!v || `Name is required`],
      priceRules: [
        v => !!v || `price is required`,
        v => v > 0 || `price can't be null`,
      ],
      hoursRules: [
        v => !!v || `hours is required`,
        v => v > 0 || `hours can't be null`,
      ],
      tagsRules: [v => !!v || `tags is required`],
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
          text: `rates.weeklyHours`,
          value: `weeklyHours`,
        },
        {
          text: `rates.tag`,
          value: `tag.name`,
        },
      ],
      dialog: false,
    }
  },
  computed: {
    gridRates() {
      return []
      // return soHelpers.ratesTableToGrid(this.rates)
    },
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [rates, tags] = await Promise.all([
      $axios.$get(`/rates`),
      $axios.$get(`/tags`),
    ])
    return { rates, tags }
  },
  methods: {
    async submitRate() {
      if (!this.$refs.rateForm.validate()) return
      const rate = await this.$axios.$post(`/rates`, this.newRate)
      this.rates.push(rate)
      this.$refs.rateForm.reset()
      this.dialog = false
    },
    clearRate() {
      this.$refs.rateForm.reset()
    },
    async save(rate) {
      const { $axios } = this
      await $axios.$post(`/rates/${rate.id}`, rate)
    },
    async addTag() {
      const { $axios } = this
      const tag = await $axios.$post(`/tags`, this.newTag)
      this.tags.push(tag)
      this.tags = this.tags.sort((a, b) =>
        a.name !== b.name ? (a.name < b.name ? -1 : 1) : 0,
      )
      this.newTag.name = ``
    },
  },
}
</script>

<template lang="pug">
.so-wrapper
  .so-top-bar
    h1.display-1 {{$t(`rates.plural`)}}

  .so-content
    .so-page-rates
      v-tabs.elevation-1(
        v-model="tabActive"
        dark
      )
        v-tab(
          key="table-view"
          ripple
        ) table
        v-tab(
          key="grid-view"
          ripple
        ) grid
        v-tab-item(
          key="table-view"
        )
          v-data-table(
            :headers="headers"
            :items="rates"
            :rows-per-page-items="rowsPerPageItems"
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
                  :return-value.sync="props.item.weeklyHours"
                  @save="save(props.item)"
                  large
                  lazy
                  persistent
                  save-text="ok"
                  :cancel-text="$t(`cancel`)"
                )
                  div {{ props.item.weeklyHours }}
                  .mt-3.title( slot="input") {{ $t(`rates.weeklyHours`) }}
                  v-text-field(
                    slot="input"
                    v-model="props.item.weeklyHours"
                    label="Edit"
                    single-line
                    autofocus
                  )
              td: div {{ props.item.tag.name }}
        v-tab-item(
          key="grid-view"
        )
          template(v-for="(rate, index) in gridRates")
            div rates-{{index}}
              table(:key="`rates-${index}`")
                thead


      div: v-card
        v-card-title: h4 {{ $t(`rates.tags`) }}
        v-divider
        v-list(dense)
          template(v-for="(tag, index) in tags")
            v-list-tile(:key="tag.id")
              v-list-tile-content {{ tag.name }}
            v-divider(
              v-if="index + 1 < tags.length"
              :key="index"
            )
          v-divider(v-if="tags.length")
          v-list-tile
            v-list-tile-content
              v-text-field(
                :placeholder="$t(`rates.tagsNew`)"
                v-model="newTag.name"
                solo
              )
            v-list-tile-action
              v-btn(icon ripple @click="addTag")
                v-icon(color="primary") add_circle_outline

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
              v-model.number="newRate.weeklyHours"
              :label="$t(`rates.weeklyHoursShort`)"
              type="number"
              :rules="hoursRules"
              required
            )
            v-select.so-form-rate__tags(
              v-model="newRate.tagId"
              :items="tags"
              item-text="name"
              item-value="id"
              :rules="tagsRules"
              :label="$t(`rates.tag`)"
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
.so-page-rates {
  display: grid;
  grid-template-columns: 1fr 240px;
  grid-gap: 2rem;
}
.so-form-rate {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}
.so-form-rate__name {
  grid-column: 1 / -1;
}
.so-form-rate__tags {
  grid-column: 3 / -1;
}
</style>
