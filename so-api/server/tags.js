'use strict'

const { Tag } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listTags,
  create: createTag,
  read: readTag,
  update: updateTag,
}

const defaultRelations = Object.freeze([])

async function listTags(ctx) {
  const params = {
    include: defaultRelations,
    order: [[`name`, `ASC`]],
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const rates = await Tag.findAll(params)
  ctx.body = rates
}

async function createTag(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newTag = await Tag.create(body)
  const rate = await Tag.findByPk(newTag.id, {
    include: defaultRelations,
  })
  ctx.body = rate
}

async function readTag(ctx) {
  const { rateId } = ctx.params
  const rate = await Tag.findByPk(rateId, {
    include: defaultRelations,
  })
  ctx.body = rate
}

async function updateTag(ctx) {
  const { rateId } = ctx.params
  const rate = await Tag.findByPk(rateId)
  ctx.assert(rate, 404, `tag not found`)

  const { body } = ctx.request
  await rate.update(body)

  const updatedTag = await Tag.findByPk(rate.id, {
    include: defaultRelations,
  })
  ctx.body = updatedTag
}
