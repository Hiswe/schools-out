<script>
export default {
  name: `so-grid-rate`,
  props: {
    ratesGroup: {
      type: Object,
      required: true,
    },
  },
  methods: {
    select(rate) {
      this.$emit(`rate`, rate)
    },
  },
}
</script>

<template lang="pug">
table.so-grid-rates
  thead
    tr
      th.so-grid-rates__cell.so-grid-rates__cell--header(
        v-for="header in ratesGroup.header"
        :key="`rates-group-${header}`"
        v-text="header"
      )
  tbody
    tr(
      v-for="(row, rowIndex) in ratesGroup.body"
      :key="`rates-group-row-${rowIndex}`"
    )
      td.so-grid-rates__cell.so-grid-rates__cell--body(
        v-for="(rate, index) in row"
        :class="`so-grid-rates__cell--${index === 0 ?  'hour' : 'price'}`"
        :key="`rates-group-price-${rate.id}`"
        v-text="rate.duration || rate.price"
      )
</template>

<style lang="scss" scoped>
.so-grid-rates {
  border: 1px solid black;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 1rem;
}
.so-grid-rates__cell {
  border: 1px solid black;
  padding: 0.5rem 1rem;
}
.so-grid-rates__cell--header {
  font-weight: 500;
  font-size: 12px;
}
.so-grid-rates__cell--price {
  font-weight: 500;
  font-size: 12px;
  text-align: right;
}
</style>
