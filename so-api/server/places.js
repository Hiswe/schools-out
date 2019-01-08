'use strict'

const { Place, Lesson, Teacher } = require('../models')

module.exports = {
  list: listPlaces,
  create: createPlace,
  read: readPlace,
  update: updatePlace,
}

const defaultRelations = Object.freeze([
  {
    model: Lesson,
    include: [{ model: Teacher }],
  },
])

async function listPlaces(ctx) {
  const params = { include: defaultRelations }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const places = await Place.findAll(params)
  ctx.body = places
}

async function createPlace(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const place = await Place.create(body)
  ctx.body = place
}

async function readPlace(ctx) {
  const { placeId } = ctx.params
  const place = await Place.findByPk(placeId, {
    include: defaultRelations,
  })
  ctx.body = place
}

async function updatePlace(ctx) {
  const { placeId } = ctx.params
  const place = await Place.findByPk(placeId)
  ctx.assert(place, 404, `place not found`)

  const { body } = ctx.request
  await place.update(body)

  const updatedPlace = await Place.findByPk(place.id, {
    include: defaultRelations,
  })
  ctx.body = updatedPlace
}
