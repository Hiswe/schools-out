'use strict'

const { Room, Lesson, Teacher } = require('../models')

module.exports = {
  list: listRooms,
  create: createRoom,
}

const defaultRelation = Object.freeze([
  {
    model: Lesson,
    include: [{ model: Teacher }],
  },
])

async function listRooms(ctx) {
  const params = { include: defaultRelation }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const rooms = await Room.findAll(params)
  ctx.body = rooms
}

async function createRoom(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const room = await Room.create(body)
  ctx.body = room
}
