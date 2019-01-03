<script>
export default {
  name: `so-page-rooms`,
  meta: {
    authRequired: true,
  },
  data() {
    return {
      rooms: [],
      roomValid: true,
      newRoom: {},
      nameRules: [v => !!v || `Name is required`],
      capacityRules: [
        v => !!v || `Capacity is required`,
        v => v > 0 || `capacity can't be null`,
      ],
    }
  },
  async asyncData(nuxtContext) {
    const { $axios } = nuxtContext
    const [rooms] = await Promise.all([$axios.$get(`/rooms`)])
    return { rooms }
  },
  methods: {
    async submitRoom() {
      if (!this.$refs.roomForm.validate()) return console.log(`invalid form`)
      const roomUri = `/rooms`
      const room = await this.$axios.$post(roomUri, this.newRoom)
      this.rooms.push(room)
      this.$refs.roomForm.reset()
    },
    clearRoom() {
      this.$refs.roomForm.reset()
    },
  },
}
</script>

<template lang="pug">
.so-table-form.mt-4
  v-card
    v-card-title(primary-title)
      .headline existing rooms
    v-card-text
      v-list(
        two-line
        v-if="rooms.length"
      )
        v-list-tile(
          v-for="room in rooms"
          :key="room.id"
        ): v-list-tile-content
          v-list-tile-title {{room.name}}
          v-list-tile-sub-title
            span.primary--text {{room.capacity}}
            |
            | people

  v-form(
    ref="roomForm"
    v-model="roomValid"
  )
    v-card
      v-card-title(primary-title)
        .headline new room
      v-card-text
        v-text-field(
          v-model="newRoom.name"
          label="Name"
          :rules="nameRules"
          required
        )
        v-text-field(
          v-model.number="newRoom.capacity"
          label="People capacity"
          type="number"
          :rules="capacityRules"
          required
        )
      v-card-actions
        v-btn(
          :disabled="!roomValid"
          @click="submitRoom"
          color="primary"
        ) add Room
        v-btn(@click="clearRoom") clear

</template>

