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
  const { tagId } = ctx.state.jwtData
  if (tagId) params.where = { tagId }
  const rates = await Tag.findAll(params)
  ctx.body = rates
}

async function createTag(ctx) {
  const { body } = ctx.request
  const { tagId } = ctx.state.jwtData
  body.tagId = body.tagId || tagId
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
