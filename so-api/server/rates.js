'use strict'

const { Rate, Tag } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listRates,
  listGrid: listGridRates,
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

const splitBy = key => (aggregator, val) => {
  aggregator[val[key]] = aggregator[val[key]] || []
  aggregator[val[key]].push(val)
  return aggregator
}

const splitByName = splitBy(`name`)
const splitByTag = splitBy(`tagName`)

function flattenObjectToArray(obj) {
  return Object.entries(obj)
    .sort(([a], [b]) => (a !== b ? (a < b ? -1 : 1) : 0))
    .map(([key, value]) => value)
}

async function listRates(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const rates = await Rate.findAll(params)

  ctx.body = rates
}

async function listGridRates(ctx) {
  const params = {
    include: defaultRelations,
    raw: true,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const rates = await Rate.findAll(params)

  const gridRates = flattenObjectToArray(
    rates
      .map(r => {
        r.tagName = r[`tag.name`]
        delete r[`tag.name`]
        return r
      })
      .reduce(splitByName, {}),
  ).map(names => {
    const orderedByTag = Object.entries(names.reduce(splitByTag, {}))
      .map(([tagName, rates]) => {
        const total = rates.reduce((total, rate) => total + rate.price, 0)
        const average = total / rates.length
        return {
          tagName,
          rates: rates.sort((a, b) => a.price > b.price),
          total,
          average,
        }
      })
      .sort((a, b) => a.average > b.average)
    return orderedByTag
  })

  ctx.body = gridRates
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
