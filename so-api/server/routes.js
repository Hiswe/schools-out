'use strict'

const { inspect } = require('util')
const Router = require('koa-router')

const {
  School,
  User,
  Room,
  Teacher,
  Lesson,
  Rate,
  Inscription,
} = require('../models')
const lessons = require('./lessons')
const rooms = require('./rooms')
const teachers = require('./teachers')
const inscriptions = require('./inscriptions')
const USER_TYPES = require('../models/users-types')
const { jwtMiddleware, login } = require('./authentication')
const config = require('../config')

const apiRouter = new Router({
  prefix: `/v1`,
})

const printInstance = instance => {
  console.log(
    inspect(JSON.parse(JSON.stringify(instance)), { colors: true, depth: 4 }),
  )
}

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
          model: Room,
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
  //--- ROOMS
  .get(`/rooms`, rooms.list)
  .post(`/rooms`, rooms.create)
  //----- RATES
  .get(`/rates`, async ctx => {
    const params = {}
    const { schoolId } = ctx.state.jwtData
    if (schoolId) params.where = { schoolId }
    const rates = await Rate.findAll(params)
    ctx.body = rates
  })
  .post(`/rates`, async ctx => {
    const { body } = ctx.request
    const { schoolId } = ctx.state.jwtData
    body.schoolId = body.schoolId || schoolId
    const rate = await Rate.create(body)
    ctx.body = rate
  })
  //----- LESSONS
  .get(`/lessons/:lessonId`, lessons.read)
  .post(`/lessons/:lessonId`, lessons.update)
  .get(`/lessons`, lessons.list)
  .post(`/lessons`, lessons.create)
  //----- LESSONS
  // .get(`/inscriptions/:inscriptionId`, inscriptions.read)
  // .post(`/inscriptions/:inscriptionId`, inscriptions.update)
  .get(`/inscriptions`, inscriptions.list)
  // .post(`/inscriptions`, inscriptions.create)
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
          model: Inscription,
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
  .post(`/users/:userId/inscriptions`, async ctx => {
    const { userId } = ctx.params
    const user = await User.findByPk(userId)
    ctx.assert(user, 404, `user not found`)

    const { body } = ctx.request
    const { schoolId } = ctx.state.jwtData
    body.userId = userId
    body.schoolId = body.schoolId || schoolId
    const newInscription = await Inscription.create(body)
    const inscription = await Inscription.findByPk(newInscription.id, {
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
    })

    ctx.body = inscription
  })

module.exports = apiRouter
