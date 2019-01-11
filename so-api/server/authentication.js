'use strict'

const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')

const config = require('../config')
const { School, Student } = require('../models')
const { secret, expiresIn } = config.jwt

function createAccessToken(user) {
  const isAdmin = user.id === config.superAdmin.id

  const current = {
    isAdmin,
    userId: user.id,
    // for now we don't pass a user but a school
    // TODO: change to user.schoolId
    schoolId: isAdmin ? false : user.id,
  }
  return {
    current,
    access_token: jsonwebtoken.sign(current, secret, { expiresIn }),
  }
}

//----- UTILS

const jwtMiddleware = jwt({
  secret,
  key: `jwtData`,
})

async function login(ctx, next) {
  const { body } = ctx.request
  if (body.id === config.superAdmin.id) {
    ctx.body = createAccessToken(body)
    return
  }

  // For now we just connect a school
  // TODO: replace school by a user
  const user = await School.findOne({
    where: {
      id: body.id,
      // isDeactivated: { $not: true },
    },
  })
  ctx.assert(user, 404, `MESSAGES.NO_SCHOOL`)

  // const isPasswordValid = await user.comparePassword(body.password)
  // ctx.assert(isPasswordValid, 401, MESSAGES.INVALID_PASSWORD)

  ctx.body = createAccessToken(user)
}

module.exports = {
  jwtMiddleware,
  login,
}
