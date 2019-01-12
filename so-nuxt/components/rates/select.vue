<script>
import SoGridRates from './grid.vue'

export default {
  name: `so-rate-select`,
  components: {
    SoGridRates,
  },
  props: {
    gridRates: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      default: ``,
    },
  },
  data() {
    return { category: 0 }
  },
  computed: {
    categories() {
      return this.gridRates.map((rates, index) => ({
        text: rates.name,
        value: index,
      }))
    },
    ratesGroup() {
      return this.gridRates[this.category]
    },
    ratesById() {
      const flatten = this.gridRates
        .reduce((acc, rateGroup) => {
          const flattenedHours = rateGroup.body.reduce(
            (a, r) => a.concat(r.slice(1)),
            [],
          )
          return acc.concat(flattenedHours)
        }, [])
        .filter(r => r.id)
        .reduce((acc, rate) => {
          acc[rate.id] = rate
          return acc
        }, {})
      return flatten
    },
    selected() {
      return this.ratesById[this.value]
    },
  },
  methods: {
    onSelect(rate) {
      this.$emit(`input`, rate.id)
    },
  },
}
</script>

<template lang="pug">
v-card
  v-card-title.so-rate-select__title
    h4.title {{ $t(`rates.singular` )}}
    p.subheading.so-rate-select__summary(v-if="selected")
      | {{ selected.hours | duration }} - {{ selected.price }}€
  v-divider
  v-card-text
    v-select(
      :items="categories"
      placeholder="select a rate"
      v-model="category"
      outline
      single-line
      required
    )

    so-grid-rates.so-rate-select__grid(
      :ratesGroup="ratesGroup"
      :selectedId="value"
      @select="onSelect"
    )
</template>

<style lang="scss" scoped>
.so-rate-select__title {
  display: flex;
  align-items: baseline;
}
.so-rate-select__summary {
  flex: 1 0 auto;
  margin: 0;
  text-align: right;
}
.so-rate-select__grid {
  width: 100%;
}
</style>
