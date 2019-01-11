<script>
export default {
  name: `so-grid-rate`,
  props: {
    ratesGroup: {
      type: Object,
      required: true,
    },
    selectedId: {
      type: String,
    },
  },
  data() {
    return {
      isInteractive: false,
    }
  },
  computed: {
    wrapperClasses() {
      return { 'so-grid-rates--interactive': this.isInteractive }
    },
  },
  mounted() {
    this.isInteractive = this.$listeners.select != null
  },
  methods: {
    select(isHour = true, rate = {}) {
      if (!this.isInteractive) return
      if (isHour) return
      if (!rate.id) return
      this.$emit(`select`, rate)
    },
  },
}
</script>

<template lang="pug">
table.so-grid-rates(
  :class="wrapperClasses"
)
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
        @click="select(index === 0, rate)"
        :class="[`so-grid-rates__cell--${index === 0 ?  'hour' : 'price'}`, rate.id === selectedId ? `so-grid-rates__cell--selected` : `` ]"
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
.so-grid-rates__cell--hour {
  text-align: right;
}
.so-grid-rates__cell--price {
  font-weight: 500;
  font-size: 12px;
  text-align: center;
}
.so-grid-rates--interactive {
  .so-grid-rates__cell--price {
    color: var(--v-primary-base);
  }
  .so-grid-rates__cell--selected {
    color: white;
    background: var(--v-primary-base);
  }
}
</style>
