<script>
import { rowsPerPageItems } from '~/helpers/tables'

export default {
  name: `so-lessons-listing`,
  props: {
    lessons: {
      type: Array,
      default: [],
    },
    hideHeaders: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
  },
  data() {
    return {
      rowsPerPageItems,
      lessonHeaders: [
        {
          text: `lessons.tableName`,
          align: `left`,
          value: `name`,
        },
        {
          text: `places.singular`,
          align: `left`,
          value: `place.name`,
        },
        {
          text: `teachers.singular`,
          align: `left`,
          value: `teacher.name`,
        },
        {
          text: `day`,
          align: `left`,
          value: `teacher.name`,
        },
        {
          text: `begin`,
          align: `left`,
          value: `startHour`,
        },
        {
          text: `duration`,
          align: `left`,
          value: `duration`,
        },
      ],
    }
  },
}
</script>

<template lang="pug">
v-data-table.so-lessons-listing.elevation-1(
  :rows-per-page-items="rowsPerPageItems"
  :headers="lessonHeaders"
  :items="lessons"
  :hide-headers="hideHeaders"
  :hide-actions="hideActions"
)
  template(slot="headerCell" slot-scope="props")
    | {{ $t(props.header.text) }}
  template( slot="items" slot-scope="props")
    td
      nuxt-link(:to="`/lessons/${props.item.id}`")  {{ props.item.name }}
    td {{ props.item.place.name }}
    td {{ props.item.teacher.name }}
    td {{ props.item.dayName }}
    td {{ props.item.startHour }}
    td {{ props.item.duration | duration }}
</template>
