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
    v-tabs(
      show-arrows
    )
      v-tabs-slider(color="primary")
      v-tab(
        v-for="(gridRate, i) in gridRates"
        :href="`#tab-${i}`"
        :key="`gridRate-${i}`"
      ) {{ gridRate.name }}
      v-tabs-items
        v-tab-item(
          v-for="(gridRate, i) in gridRates"
          :value="`tab-${i}`"
          :key="`gridRate-tab-${i}`"
        )
          so-grid-rates.so-rate-select__grid(
            :ratesGroup="gridRate"
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
  line-height: 0.5;
}
.so-rate-select__grid {
  width: 100%;
}
</style>
