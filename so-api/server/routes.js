'use strict'

const Router = require('koa-router')

const { School, Student, Place, Teacher } = require('../models')
const lessons = require('./lessons')
const places = require('./places')
const teachers = require('./teachers')
const registrations = require('./registrations')
const rates = require('./rates')
const tags = require('./tags')
const students = require('./students')
// const USER_TYPES = require('../models/students-types')
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
          model: Student,
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
  .get(`/rates/grid`, rates.listGrid)
  .get(`/rates/:rateId`, rates.read)
  .post(`/rates/:rateId`, rates.update)
  .get(`/rates`, rates.list)
  .post(`/rates`, rates.create)
  //----- LESSONS
  .get(`/lessons/:lessonId`, lessons.read)
  .post(`/lessons/:lessonId`, lessons.update)
  .get(`/lessons`, lessons.list)
  .post(`/lessons`, lessons.create)
  //----- REGISTRATIONS
  // .get(`/registrations/:registrationId`, registrations.read)
  // .post(`/registrations/:registrationId`, registrations.update)
  .get(`/registrations`, registrations.list)
  .post(`/registrations`, registrations.create)
  //----- TAGS
  .get(`/tags/:tagId`, tags.read)
  .post(`/tags/:tagId`, tags.update)
  .get(`/tags`, tags.list)
  .post(`/tags`, tags.create)
  //----- TEACHERS
  .get(`/teachers/:teacherId`, teachers.read)
  .get(`/teachers`, teachers.list)
  .post(`/teachers`, teachers.create)
  //----- USERS
  // .get(`/students/types`, async ctx => {
  //   ctx.body = USER_TYPES.list
  // })
  .get(`/students`, students.list)
  .post(`/students`, students.create)
  .get(`/students/:userId`, students.read)

module.exports = apiRouter
