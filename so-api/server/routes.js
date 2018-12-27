'use strict'

const Router = require('koa-router')

const { School, User } = require('../models')
const USER_TYPES = require('../models/users-types')

const apiRouter = new Router({
  prefix: `/v1`,
})

apiRouter
  .get(`/`, async ctx => {
    ctx.body = {
      version: `v1`,
    }
  })
  //////
  // SCHOOLS
  //////
  .get(`/schools`, async ctx => {
    const schools = await School.findAll({})
    ctx.body = schools
  })
  .post(`/schools`, async ctx => {
    const { body } = ctx.request
    const school = await School.create(body)
    ctx.body = school
  })
  //////
  // USERS
  //////
  .get(`/users/types`, async ctx => {
    ctx.body = USER_TYPES
  })
  .get(`/users`, async ctx => {
    const users = await User.findAll({
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    })
    ctx.body = users
  })
  .post(`/users`, async ctx => {
    const { body } = ctx.request
    const newUser = await User.create(body)
    const user = await User.findByPk(newUser.id, {
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    })
    ctx.body = user
  })

module.exports = apiRouter
