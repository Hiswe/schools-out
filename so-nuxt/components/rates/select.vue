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
  },
  methods: {
    onSelect(rate) {
      console.log(rate)
      this.$emit(`input`, rate.id)
    },
  },
}
</script>

<template lang="pug">
v-card
  v-card-title
    h4.title {{ $t(`rates.singular` )}}

  v-divider
  v-card-text
    v-select(
      :items="categories"
      placeholder="select a rate"
      v-model="category"
      outline
      required
    )
    so-grid-rates.so-rate-select__grid(
      :ratesGroup="ratesGroup"
      :selectedId="value"
      @select="onSelect"
    )
</template>

<style lang="scss" scoped>
.so-rate-select__grid {
  width: 100%;
}
</style>
