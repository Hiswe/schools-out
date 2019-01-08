'use strict'

const { Place, Lesson, Teacher } = require('../models')

module.exports = {
  list: listPlaces,
  create: createPlace,
}

const defaultRelation = Object.freeze([
  {
    model: Lesson,
    include: [{ model: Teacher }],
  },
])

async function listPlaces(ctx) {
  const params = { include: defaultRelation }
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
