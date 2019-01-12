'use strict'

const {
  Registration,
  Teacher,
  Place,
  Student,
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
    model: Student,
    attributes: [`id`, `name`],
  },
  {
    model: Rate,
    attributes: [`id`, `name`, `price`, `weeklyHours`],
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
  console.log(body)
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const rate = await Rate.findByPk(body.rateId)
  body.priceAtRegistration = rate.price
  body.studentId = body.student ? body.student.id : body.studentId
  const { lessons } = body
  delete body.lessons

  const includedLessons = lessons.map(l => l.id)
  console.log({ includedLessons })

  const newRegistration = new Registration(body)
  newRegistration.addLessons(includedLessons)
  await newRegistration.save()
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
