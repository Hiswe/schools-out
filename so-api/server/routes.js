'use strict'

const Router = require('koa-router')

const { School, User, Room, Teacher, Lesson } = require('../models')
const USER_TYPES = require('../models/users-types')
const { jwtMiddleware, login } = require('./authentication')
const config = require('../config')

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
  //////
  // SCHOOLS
  //////
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
  .get(`/rooms`, async ctx => {
    const params = {}
    const { schoolId } = ctx.state.jwtData
    if (schoolId) params.where = { schoolId }
    const rooms = await Room.findAll(params)
    ctx.body = rooms
  })
  .post(`/schools/:schoolId/rooms`, async ctx => {
    const { schoolId } = ctx.params
    const { body } = ctx.request
    body.schoolId = schoolId
    const room = await Room.create(body)
    ctx.body = room
  })
  //--- LESSONS
  .get(`/lessons/:lessonId`, async ctx => {
    const { schoolId } = ctx.params
    const lesson = await Lesson.findByPk({
      where: {
        schoolId,
      },
      include: [
        {
          model: Teacher,
          attributes: [`id`, `name`],
        },
        {
          model: Room,
          attributes: [`id`, `name`],
        },
        {
          model: User,
          attributes: [`id`, `name`, `email`],
        },
      ],
    })
    ctx.body = lesson
  })
  .get(`/lessons`, async ctx => {
    const params = {
      include: [
        {
          model: Teacher,
          attributes: [`id`, `name`],
        },
        {
          model: Room,
          attributes: [`id`, `name`],
        },
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    }
    const { schoolId } = ctx.state.jwtData
    if (schoolId) params.where = { schoolId }
    const lessons = await Lesson.findAll(params)
    ctx.body = lessons
  })
  .get(`/schools/:schoolId/lessons`, async ctx => {
    const { schoolId } = ctx.params
    const lessons = await Lesson.findAll({
      where: {
        schoolId,
      },
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
    })
    ctx.body = lessons
  })
  .post(`/schools/:schoolId/lessons`, async ctx => {
    const { schoolId } = ctx.params
    const { body } = ctx.request
    body.schoolId = schoolId
    const newLesson = await Lesson.create(body)
    const lesson = await Lesson.findByPk(newLesson.id, {
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
    })
    ctx.body = lesson
  })
  //////
  // TEACHERS
  //////
  .get(`/teachers`, async ctx => {
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
    const teachers = await Teacher.findAll(params)
    ctx.body = teachers
  })
  .post(`/teachers`, async ctx => {
    const { body } = ctx.request
    const newTeacher = await Teacher.create(body)
    const teacher = await Teacher.findByPk(newTeacher.id, {
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    })
    ctx.body = teacher
  })
  .get(`/teachers/:teacherId`, async ctx => {
    const { teacherId } = ctx.params
    const teacher = await Teacher.findByPk(teacherId, {
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    })
    ctx.body = teacher
  })
  //////
  // USERS
  //////
  .get(`/users/types`, async ctx => {
    ctx.body = USER_TYPES.list
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
  .get(`/users/:userId`, async ctx => {
    const { userId } = ctx.params
    const user = await User.findByPk(userId, {
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
