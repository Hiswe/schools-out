<script>
const hours = Array.from({ length: 14 }).map((v, i) => {
  const hour = `${9 + i}`.padStart(2, `0`)
  return `${hour}`
})

export default {
  name: `so-home-school`,
  data() {
    return {
      hours,
      rooms: [],
    }
  },
  async created() {
    const { $axios } = this
    const [rooms] = await Promise.all([$axios.$get(`/rooms`)])
    this.rooms = rooms
  },
}
</script>

<template lang="pug">
dl.so-rooms-calendar
  template(v-for="room in rooms")
    dt.display-1.so-rooms-calendar__name {{room.name}}
    dd.mb-5.so-rooms-calendar__content.so-day-calendar
      span.so-day-calendar__day Monday
      span.so-day-calendar__day Tuesday
      span.so-day-calendar__day Wednesday
      span.so-day-calendar__day Thursday
      span.so-day-calendar__day Friday
      span.so-day-calendar__day Saturday
      span.so-day-calendar__day Sunday
      span.so-day-calendar__hour(
        v-for="(h, i) in hours"
        :class="`so-day-calendar__hour--${i}`"
      ) {{ h }}
      nuxt-link.so-day-calendar__lesson.primary(
        v-for="lesson in room.lessons"
        :key="lesson.id"
        :to="`/lessons/${lesson.id}`"
        :class="`so-day-calendar__lesson--day-${lesson.day} so-day-calendar__lesson--hour-${lesson.startHour} so-day-calendar__lesson--duration-${lesson.duration}`.replace('.', '-').replace(':', '-')"
      )
        span.white--text {{ lesson.name }}
</template>

<style lang="scss" scoped>
.so-day-calendar {
  display: grid;
  grid-template-columns: 4rem repeat(7, 1fr);
  grid-template-rows: 1.5rem repeat(28, 20px);
  grid-gap: 1px;

  // need this to place automatically days & hours
  &::after {
    content: '';
    grid-column: 1;
    grid-row: 1;
  }
  &::before {
    content: '';
    grid-column: 2 / -1;
    grid-row: 2 / -1;
    background: repeating-linear-gradient(
      to left,
      transparent,
      transparent percentage(1/7),
      rgba(0, 0, 0, 0.025) percentage(1/7),
      rgba(0, 0, 0, 0.025) percentage(2/7)
    );
    z-index: 0;
  }
}
.so-day-calendar__day {
  grid-row: 1;
  justify-self: center;
}
.so-day-calendar__hour {
  grid-column: 1 / -1;
  padding-right: 0.25rem;
  border: dotted #eee;
  border-width: 2px 0 0 0;
  display: flex;
  align-items: center;
  z-index: 1;

  @for $i from 0 through 14 {
    &--#{$i} {
      grid-row: #{$i * 2 + 2} / #{$i * 2 + 4};
    }
  }
}
.so-day-calendar__lesson {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &--day-0 {
    grid-column: 8;
  }
  @for $i from 1 through 6 {
    &--day-#{$i} {
      grid-column: $i + 1;
    }
  }
  $durations: '0-5' '1' '1-5' '2';
  // https://stackoverflow.com/a/15146850
  @for $i from 1 through length($durations) {
    $duration: nth($durations, $i);
    &--duration-#{$duration} {
      height: calc(#{$i * 20px} + #{$i * 1px} - 1px);
    }
  }
  $hours: '09-00' '09-30' '10-00' '10-30' '11-00' '11-30' '12-00' '12-30'
    '13-00' '13-30' '14-00' '14-30' '15-00' '15-30' '16-00' '16-30' '17-00'
    '17-30' '18-00' '18-30' '19-00' '19-30' '20-00' '20-30' '21-00' '21-30'
    '22-00' '22-30';
  @for $i from 1 through length($hours) {
    $hour: nth($hours, $i);
    &--hour-#{$hour} {
      grid-row: $i + 1;
    }
  }
}
</style>
