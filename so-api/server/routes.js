'use strict'

const { inspect } = require('util')
const Router = require('koa-router')

const {
  School,
  User,
  Place,
  Teacher,
  Lesson,
  Rate,
  Registration,
} = require('../models')
const lessons = require('./lessons')
const places = require('./places')
const teachers = require('./teachers')
const registrations = require('./registrations')
const rates = require('./rates')
const USER_TYPES = require('../models/users-types')
const { jwtMiddleware, login } = require('./authentication')
const config = require('../config')
const { printInstance } = require('./helpers')

const apiRouter = new Router({
  prefix: `/v1`,
})

//////
// PUBLIC
//////

apiRouter
  .get(`/`, async ctx => {
    ctx.body = {
      version: `v1`,
    }
  })
  .get(`/login`, async ctx => {
    const schools = await School.findAll({})
    schools.unshift({
      id: config.superAdmin.id,
      name: `admin`,
    })
    ctx.body = schools
  })
  .post(`/account/login`, login)

//////
// PRIVATE
//////

apiRouter
  .use(jwtMiddleware)
  .get(`/account/me`, async ctx => {
    const { jwtData } = ctx.state
    ctx.body = { current: jwtData }
  })
  //----- SCHOOLS
  .get(`/schools`, async ctx => {
    const { jwtData } = ctx.state
    ctx.assert(jwtData.isAdmin, 401)
    const schools = await School.findAll({})
    ctx.body = schools
  })
  .post(`/schools`, async ctx => {
    const { jwtData } = ctx.state
    ctx.assert(jwtData.isAdmin, 401)
    const { body } = ctx.request
    const school = await School.create(body)
    ctx.body = school
  })
  .get(`/schools/:schoolId`, async ctx => {
    const { schoolId } = ctx.params
    const school = await School.findByPk(schoolId, {
      include: [
        {
          model: Place,
          attributes: [`id`, `name`, `capacity`],
        },
        {
          model: Teacher,
          attributes: [`id`, `name`, `email`],
        },
        {
          model: User,
          attributes: [`id`, `name`, `email`],
        },
      ],
    })
    ctx.body = school
  })
  //--- PLACES
  .get(`/places/:placeId`, places.read)
  .post(`/places/:placeId`, places.update)
  .get(`/places`, places.list)
  .post(`/places`, places.create)
  //----- RATES
  .get(`/rates/:rateId`, rates.read)
  .post(`/rates/:rateId`, rates.update)
  .get(`/rates`, rates.list)
  .post(`/rates`, rates.create)
  //----- LESSONS
  .get(`/lessons/:lessonId`, lessons.read)
  .post(`/lessons/:lessonId`, lessons.update)
  .get(`/lessons`, lessons.list)
  .post(`/lessons`, lessons.create)
  //----- LESSONS
  // .get(`/registrations/:registrationId`, registrations.read)
  // .post(`/registrations/:registrationId`, registrations.update)
  .get(`/registrations`, registrations.list)
  .post(`/registrations`, registrations.create)
  //----- TEACHERS
  .get(`/teachers/:teacherId`, teachers.read)
  .get(`/teachers`, teachers.list)
  .post(`/teachers`, teachers.create)
  //----- USERS
  .get(`/users/types`, async ctx => {
    ctx.body = USER_TYPES.list
  })
  .get(`/users`, async ctx => {
    const params = {
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    }
    const { schoolId } = ctx.state.jwtData
    if (schoolId) params.where = { schoolId }
    const users = await User.findAll(params)
    ctx.body = users
  })
  .post(`/users`, async ctx => {
    const { body } = ctx.request
    const { schoolId } = ctx.state.jwtData
    body.schoolId = body.schoolId || schoolId
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
  .get(`/users/:userId`, async ctx => {
    const { userId } = ctx.params
    const user = await User.findByPk(userId, {
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
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
      ],
    })
    printInstance(user)
    ctx.body = user
  })

module.exports = apiRouter
