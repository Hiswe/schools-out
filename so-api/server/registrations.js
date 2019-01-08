'use strict'

'use strict'

const {
  Registration,
  Teacher,
  Place,
  User,
  Rate,
  Lesson,
} = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listRegistrations,
  create: createRegistration,
  read: readRegistration,
  update: updateRegistration,
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
        model: Place,
        attributes: [`id`, `name`],
      },
    ],
  },
])

async function listRegistrations(ctx) {
  const params = {
    include: defaultRelations,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const registrations = await Registration.findAll(params)
  ctx.body = registrations
}

async function createRegistration(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  console.log(body)
  const newRegistration = await Registration.create(body)
  const registration = await Registration.findByPk(newRegistration.id, {
    include: defaultRelations,
  })
  ctx.body = registration
}

async function readRegistration(ctx) {
  const { registrationId } = ctx.params
  const registration = await Registration.findByPk(registrationId, {
    include: defaultRelations,
  })
  ctx.body = registration
}

async function updateRegistration(ctx) {
  const { registrationId } = ctx.params
  const registration = await Registration.findByPk(registrationId)
  ctx.assert(registration, 404, `registration not found`)

  const { body } = ctx.request
  await registration.update(body)

  const updatedRegistration = await Registration.findByPk(registration.id, {
    include: defaultRelations,
  })
  ctx.body = updatedRegistration
}
