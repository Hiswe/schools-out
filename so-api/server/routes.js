'use strict'

const Router = require('koa-router')

const { School, User, Room, Teacher, Lesson } = require('../models')
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
  .post(`/schools/:schoolId/rooms`, async ctx => {
    const { schoolId } = ctx.params
    const { body } = ctx.request
    body.schoolId = schoolId
    const room = await Room.create(body)
    ctx.body = room
  })
  //--- LESSONS
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
    const teachers = await Teacher.findAll({
      include: [
        {
          model: School,
          attributes: [`id`, `name`],
        },
      ],
    })
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
