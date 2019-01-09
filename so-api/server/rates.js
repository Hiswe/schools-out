'use strict'

const { Rate, Tag } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listRates,
  create: createRate,
  read: readRate,
  update: updateRate,
}

const defaultRelations = Object.freeze([
  {
    model: Tag,
    attributes: [`name`],
  },
])

async function listRates(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const rates = await Rate.findAll(params)
  ctx.body = rates
}

async function createRate(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newRate = await Rate.create(body)
  const rate = await Rate.findByPk(newRate.id, {
    include: defaultRelations,
  })
  ctx.body = rate
}

async function readRate(ctx) {
  const { rateId } = ctx.params
  const rate = await Rate.findByPk(rateId, {
    include: defaultRelations,
  })
  ctx.body = rate
}

async function updateRate(ctx) {
  const { rateId } = ctx.params
  const rate = await Rate.findByPk(rateId)
  ctx.assert(rate, 404, `rate not found`)

  const { body } = ctx.request
  await rate.update(body)

  const updatedRate = await Rate.findByPk(rate.id, {
    include: defaultRelations,
  })
  ctx.body = updatedRate
}
