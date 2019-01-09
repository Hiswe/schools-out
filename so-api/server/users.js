'use strict'

const { User, Registration, Lesson, Teacher, Rate } = require('../models')
const { printInstance } = require('./helpers')

module.exports = {
  list: listUsers,
  create: createUser,
  read: readUser,
  update: updateUser,
}

const defaultRelations = Object.freeze([
  {
    model: Registration,
    include: [
      {
        model: Lesson,
        include: [
          {
            model: Teacher,
          },
        ],
      },
      {
        model: Rate,
      },
    ],
  },
])
const defaultAttributes = Object.freeze({
  exclude: [`password`, `token`, `tokenExpire`, `deletedAt`],
})

async function listUsers(ctx) {
  const params = {
    include: defaultRelations,
    attributes: defaultAttributes,
  }
  const { schoolId } = ctx.state.jwtData
  if (schoolId) params.where = { schoolId }
  const users = await User.findAll(params)
  ctx.body = users
}

async function createUser(ctx) {
  const { body } = ctx.request
  const { schoolId } = ctx.state.jwtData
  body.schoolId = body.schoolId || schoolId
  const newUser = await User.create(body)
  const user = await User.findByPk(newUser.id, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = user
}

async function readUser(ctx) {
  const { userId } = ctx.params
  const user = await User.findByPk(userId, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = user
}

async function updateUser(ctx) {
  const { userId } = ctx.params
  const user = await User.findByPk(userId)
  ctx.assert(user, 404, `user not found`)

  const { body } = ctx.request
  await user.update(body)

  const updatedUser = await User.findByPk(user.id, {
    include: defaultRelations,
    attributes: defaultAttributes,
  })
  ctx.body = updatedUser
}
