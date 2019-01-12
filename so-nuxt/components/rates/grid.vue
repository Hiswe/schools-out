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
  border: 2px solid var(--v-secondary-lighten2);
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  border-radius: 0.25rem;
}

.so-grid-rates__cell {
  border: solid var(--v-secondary-lighten2);
  border-width: 1px 0 0;
  padding: 0.5rem 1rem;

  &:empty {
    background: repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 5px
    );
  }
}
.so-grid-rates__cell--header {
  font-weight: 500;
  border-top: none;
}
.so-grid-rates__cell--hour {
  text-align: right;
}
.so-grid-rates__cell--price {
  font-weight: 500;
  text-align: center;
}
.so-grid-rates--interactive {
  .so-grid-rates__cell--price:not(:empty) {
    color: var(--v-primary-base);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
  .so-grid-rates__cell--selected:not(:empty) {
    color: white;
    background: var(--v-primary-base);
  }
}
</style>
