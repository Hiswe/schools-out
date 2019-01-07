'use strict'

'use strict'

const { Inscription, Teacher, Room, User, Rate, Lesson } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listInscriptions,
  create: createInscription,
  read: readInscription,
  update: updateInscription,
}

const defaultRelations = Object.freeze([
  {
    model: User,
    attributes: [`id`, `name`],
  },
  {
    model: Rate,
    attributes: [`id`, `name`],
  },
  {
    model: Lesson,
    include: [
      {
        model: Teacher,
        attributes: [`id`, `name`],
      },
      {
        model: Room,
        attributes: [`id`, `name`],
      },
    ],
  },
])

async function listInscriptions(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const inscriptions = await Inscription.findAll(params)
  ctx.body = inscriptions
}

async function createInscription(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newInscription = await Inscription.create(body)
  const inscription = await Inscription.findByPk(newInscription.id, {
    include: defaultRelations,
  })
  ctx.body = inscription
}

async function readInscription(ctx) {
  const { inscriptionId } = ctx.params
  const inscription = await Inscription.findByPk(inscriptionId, {
    include: defaultRelations,
  })
  ctx.body = inscription
}

async function updateInscription(ctx) {
  const { inscriptionId } = ctx.params
  const inscription = await Inscription.findByPk(inscriptionId)
  ctx.assert(inscription, 404, `inscription not found`)

  const { body } = ctx.request
  await inscription.update(body)

  const updatedInscription = await Inscription.findByPk(inscription.id, {
    include: defaultRelations,
  })
  ctx.body = updatedInscription
}
